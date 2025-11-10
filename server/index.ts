
import "dotenv/config";

import http from "http";
import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import { registerRoutes } from "./routes";
// vite middleware is imported dynamically later to avoid linking issues during server-only runs

const app = express();

// Seed database in development only when a database is configured
if (app.get("env") === "development" && process.env.DATABASE_URL) {
  // Dynamically import to avoid loading DB code when no DATABASE_URL
  import("./seed").then(m => m.seedDatabase().catch(console.error));
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "nursing-education-app-dev-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // HTTPS in production
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Simple request logger for /api endpoints (keeps body capture lightly)
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      const logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      console.log(logLine);
    }
  });

  next();
});

// create an HTTP server now — this ensures we always have a server instance
// to attach WebSocket/vite middleware to even if registerRoutes doesn't return one.
const server = http.createServer(app);

(async () => {
  try {
    // registerRoutes may set up API routes and middleware.
    // If your registerRoutes function returns a server instance, that's OK,
    // but we won't rely on it. We already created `server` above.
    await registerRoutes(app);

    // central error handler:
    // - respond with JSON error message for API calls
    // - log the error but do NOT re-throw it (re-throw can crash the process)
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err?.status || err?.statusCode || 500;
      const message = err?.message || "Internal Server Error";

      // log error server-side for debugging
      try {
        console.error(`ERROR ${status}: ${message}`);
        if (err?.stack) {
          // don't print huge stacks in production
          if (process.env.NODE_ENV !== "production") {
            console.error(err.stack);
          }
        }
      } catch {
        /* no-op */
      }

      // send minimal error information to the client
      if (!res.headersSent) {
        res.status(status).json({ message });
      }
      // don't throw here — throwing inside error middleware will typically crash the server
    });

    // In development, the client runs via its own Vite dev server (separate process).
    // In production, serve built static files if available.
    if (app.get("env") !== "development") {
      try {
        const viteModule: any = await import("./vite");
        viteModule.serveStatic(app);
      } catch (e) {
        console.warn("Static file serving is unavailable:", e instanceof Error ? e.message : e);
      }
    }

    // bind to port
    const port = parseInt(process.env.PORT || "5000", 10);
    server.listen(
      {
        port,
        host: "0.0.0.0",
        reusePort: true,
      },
      () => {
        console.log(`✅ Server running at http://localhost:${port}`);
      }
    );
  } catch (err) {
    // startup error — log and exit with non-zero code
    console.error("Failed to start server:", err);
    process.exit(1);
  }
})();
