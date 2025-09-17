// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  // throw if you want it to fail hard when DATABASE_URL is absent.
  // For local dev you can leave as a warning instead of throwing.
  throw new Error("DATABASE_URL missing — ensure the database is provisioned");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});

