// server/db.ts (top)
import "dotenv/config";
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Export unconditional names; provide safe stubs when DATABASE_URL is missing.
const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);

export const pool: Pool | undefined = hasDatabaseUrl
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : undefined;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const db: any = hasDatabaseUrl
  ? drizzle({ client: pool as Pool, schema })
  : new Proxy(
      {},
      {
        get() {
          throw new Error("DATABASE_URL must be set before using the database layer.");
        },
      }
    );
