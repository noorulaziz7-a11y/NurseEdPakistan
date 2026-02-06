import type { Request, Response, NextFunction } from "express";
import { redisClient } from "./redis";

const memoryCache = new Map<string, { expiresAt: number; value: string }>();

type CacheOptions = {
  ttlSeconds?: number;
  shouldCache?: (req: Request) => boolean;
};

function defaultShouldCache(req: Request) {
  if (req.method !== "GET") return false;
  const path = req.path;
  if (path.startsWith("/api/v1/auth")) return false;
  if (path.startsWith("/api/v1/admin")) return false;
  if (path.startsWith("/api/v1/subscriptions")) return false;
  return true;
}

function getCacheKey(req: Request) {
  return `api-cache:${req.originalUrl}`;
}

async function getCached(key: string) {
  if (redisClient) {
    const value = await redisClient.get(key);
    return value || null;
  }
  const entry = memoryCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    memoryCache.delete(key);
    return null;
  }
  return entry.value;
}

async function setCached(key: string, value: string, ttlSeconds: number) {
  if (redisClient) {
    await redisClient.set(key, value, { EX: ttlSeconds });
    return;
  }
  memoryCache.set(key, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
}

export function cacheMiddleware(options: CacheOptions = {}) {
  const ttl = options.ttlSeconds ?? 60;
  const shouldCache = options.shouldCache ?? defaultShouldCache;

  return async (req: Request, res: Response, next: NextFunction) => {
    if (!shouldCache(req)) return next();

    const cacheKey = getCacheKey(req);
    const cached = await getCached(cacheKey);
    if (cached) {
      res.setHeader("X-Cache", "HIT");
      res.setHeader("Content-Type", "application/json");
      return res.send(cached);
    }

    const originalJson = res.json.bind(res);
    res.json = (body: any) => {
      const payload = JSON.stringify(body);
      setCached(cacheKey, payload, ttl).catch(() => null);
      res.setHeader("X-Cache", "MISS");
      return originalJson(body);
    };

    next();
  };
}
