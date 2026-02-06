import { db } from "./db";
import { auditLogs } from "@shared/schema";

type AuditPayload = {
  userId?: string | null;
  action: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  metadata?: Record<string, unknown>;
};

const inMemoryAuditLogs: AuditPayload[] = [];

export async function recordAuditLog(payload: AuditPayload) {
  if (!process.env.DATABASE_URL) {
    inMemoryAuditLogs.push(payload);
    return;
  }

  try {
    await db.insert(auditLogs).values({
      userId: payload.userId || null,
      action: payload.action,
      ipAddress: payload.ipAddress || null,
      userAgent: payload.userAgent || null,
      metadata: payload.metadata || {},
    });
  } catch (error) {
    console.warn("Failed to write audit log:", error);
  }
}
