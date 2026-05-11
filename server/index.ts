import "dotenv/config";

import http from "http";
import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import pino from "pino";
import pinoHttp from "pino-http";
import { registerRoutes } from "./routes";
import { registerSeoRoutes } from "./seo";
import { cacheMiddleware } from "./cache";
import { pool, db } from "./db";
import { performanceMetrics } from "@shared/schema";
import { optimizeDatabase } from "./modules/exams/service";
import { randomUUID } from "crypto";

const app = express();
const PostgresStore = connectPgSimple(session);

// Initialize Pino logger (NDJSON structured logs)
const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  redact: {
    paths: ["req.headers.authorization", "req.cookies", "res.headers['set-cookie']"],
    censor: "[REDACTED]",
  },
  formatters: {
    level: (label) => ({ level: label }),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

const httpLogger = pinoHttp({
  logger,
  genReqId: () => randomUUID(),
  customLogLevel: (res, err) => {
    if (res.statusCode >= 500) return "error";
    if (res.statusCode >= 400) return "warn";
    return "info";
  },
});

// Liveness probe (Kubernetes/Docker) – needs to be first to avoid CSP/other middleware blocking
app.get("/health/live", (req: Request, res: Response) => {
  res.status(200).json({ status: "alive", timestamp: new Date().toISOString() });
});

// Readiness probe
app.get("/health/ready", async (req: Request, res: Response) => {
  const checks = {
    database: false,
  };

  try {
    // Test database connection
    if (pool) {
      await pool.query("SELECT 1");
      checks.database = true;
    }
  } catch (err) {
    logger.error({ err }, "Database health check failed");
  }

  const isReady = checks.database;
  res.status(isReady ? 200 : 503).json({
    status: isReady ? "ready" : "unavailable",
    checks,
    timestamp: new Date().toISOString(),
  });
});

// Seed database in development only when a database is configured
if (app.get("env") === "development" && process.env.DATABASE_URL) {
  // Dynamically import to avoid loading DB code when no DATABASE_URL
  import("./seed").then(m => m.seedDatabase().catch(logger.error));
}

app.use((req, res, next) => {
  const isWebhook = req.originalUrl.startsWith("/api/v1/subscriptions/webhook");
  if (isWebhook) {
    return express.raw({ type: "application/json" })(req, res, next);
  }
  return express.json()(req, res, next);
});
app.use(express.urlencoded({ extended: false }));

// Helmet (CSP is lenient for dev, adjust in prod)
app.use(helmet({
  contentSecurityPolicy: app.get("env") === "development" ? false : undefined,
}));

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 120,
  standardHeaders: true,
});
app.use("/api/v1", apiLimiter);
app.use("/api/v1", cacheMiddleware({ ttlSeconds: 60 }));

// Development CORS (allow frontend dev server origins)
if (app.get("env") === "development") {
  app.use((req, res, next) => {
    const origin = (process.env.CORS_ORIGIN as string) || (req.headers.origin as string) || "*";
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Vary", "Origin");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });
}

// Session configuration (use Postgres by default for compatibility)
let sessionStore: any = undefined;
if (pool) {
  sessionStore = new PostgresStore({ pool, tableName: "sessions", createTableIfMissing: true });
  logger.info("Using Postgres session store (default)");
}

app.use(
  session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET || "nursing-education-app-dev-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "lax",
    },
  })
);

// Structured request logging
app.use(httpLogger);

// Simple request logger for /api endpoints
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api/v1")) {
      logger.info({
        method: req.method,
        path,
        statusCode: res.statusCode,
        durationMs: duration,
        traceId: (req as any).id,
      });

      if (process.env.DATABASE_URL) {
        db.insert(performanceMetrics).values({
          path,
          method: req.method,
          statusCode: res.statusCode,
          durationMs: duration,
          ipAddress: req.ip || req.headers["x-forwarded-for"] || null,
          userAgent: req.headers["user-agent"] || null,
          userId: (req.session as any)?.userId || null,
        }).catch((err: any) => logger.warn({ err }, "Failed to record performance metric"));
      }
    }
  });

  next();
});

const server = http.createServer(app);

// Graceful shutdown handler
const gracefulShutdown = async (signal: string) => {
  logger.info({ signal }, "Received shutdown signal, starting graceful shutdown");

  server.close(() => {
    logger.info("HTTP server closed");
  });

  if (pool) {
    await pool.end().catch(logger.error);
    logger.info("Database pool closed");
  }

  process.exit(0);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

(async () => {
  try {
    registerSeoRoutes(app);
    await registerRoutes(app);

    if (process.env.DATABASE_URL) {
      optimizeDatabase().catch(err => logger.warn({ err }, "Database optimization failed"));
    }

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err?.status || err?.statusCode || 500;
      const message = err?.message || "Internal Server Error";
      const traceId = (_req as any).id;

      logger.error({ err, status, traceId }, `Request failed: ${message}`);

      if (!res.headersSent) {
        res.status(status).json({ 
          message,
          traceId: process.env.NODE_ENV === "development" ? traceId : undefined,
        });
      }
    });

    if (app.get("env") !== "development") {
      try {
        const viteModule: any = await import("./vite");
        viteModule.serveStatic(app);
      } catch (e) {
        logger.warn({ err: e }, "Static file serving is unavailable");
      }
    }

    const port = parseInt(process.env.PORT || "5000", 10);
    server.listen(
      {
        port,
        host: "0.0.0.0",
        reusePort: true,
      },
      () => {
        logger.info({ port }, "Server running");
      }
    );
  } catch (err) {
    logger.fatal({ err }, "Failed to start server");
    process.exit(1);
  }
})();
