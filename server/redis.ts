import { createClient } from "redis";

const redisUrl = process.env.REDIS_URL;

export const redisClient = redisUrl ? createClient({ url: redisUrl }) : null;

if (redisClient) {
  redisClient.on("error", (err) => {
    console.warn("Redis connection error:", err);
  });

  redisClient.connect().catch((err) => {
    console.warn("Redis connection failed:", err);
  });
}
