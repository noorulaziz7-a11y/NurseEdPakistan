import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import { storage } from "../../storage";
import { db } from "../../db";
import { refreshTokens } from "@shared/schema";
import { insertUserSchema, loginUserSchema } from "@shared/schema";
import type { User } from "@shared/schema";
import { eq } from "drizzle-orm";

const accessSecret = process.env.JWT_SECRET || "dev_access_secret";
const refreshSecret = process.env.JWT_REFRESH_SECRET || "dev_refresh_secret";
const accessExpiresIn = process.env.JWT_EXPIRES_IN || "15m";
const refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

const inMemoryRefreshTokens = new Map<string, { userId: string; expiresAt: Date; revokedAt?: Date }>();

function getExpiryDate(expiresIn: string) {
  const match = /^(\d+)([smhd])$/.exec(expiresIn);
  if (!match) return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const value = parseInt(match[1], 10);
  const unit = match[2];
  const multiplier =
    unit === "s"
      ? 1000
      : unit === "m"
      ? 60 * 1000
      : unit === "h"
      ? 60 * 60 * 1000
      : 24 * 60 * 60 * 1000;
  return new Date(Date.now() + value * multiplier);
}

async function persistRefreshToken(tokenId: string, userId: string, expiresAt: Date) {
  if (!process.env.DATABASE_URL) {
    inMemoryRefreshTokens.set(tokenId, { userId, expiresAt });
    return;
  }
  await db.insert(refreshTokens).values({
    userId,
    token: tokenId,
    expiresAt,
  });
}

async function revokeRefreshToken(tokenId: string) {
  if (!process.env.DATABASE_URL) {
    const entry = inMemoryRefreshTokens.get(tokenId);
    if (entry) {
      entry.revokedAt = new Date();
      inMemoryRefreshTokens.set(tokenId, entry);
    }
    return;
  }
  await db
    .update(refreshTokens)
    .set({ revokedAt: new Date() })
    .where(eq(refreshTokens.token, tokenId));
}

async function validateRefreshToken(tokenId: string) {
  if (!process.env.DATABASE_URL) {
    const entry = inMemoryRefreshTokens.get(tokenId);
    if (!entry) return null;
    if (entry.revokedAt) return null;
    if (entry.expiresAt.getTime() < Date.now()) return null;
    return entry;
  }
  const [record] = await db
    .select()
    .from(refreshTokens)
    .where(eq(refreshTokens.token, tokenId));
  if (!record || record.revokedAt) return null;
  if (new Date(record.expiresAt).getTime() < Date.now()) return null;
  return { userId: record.userId || "", expiresAt: record.expiresAt };
}

async function issueTokens(userId: string) {
  const refreshId = randomUUID();
  const accessToken = jwt.sign({ sub: userId }, accessSecret, { expiresIn: accessExpiresIn });
  const refreshToken = jwt.sign({ sub: userId, jti: refreshId }, refreshSecret, {
    expiresIn: refreshExpiresIn,
  });
  const expiresAt = getExpiryDate(refreshExpiresIn);
  await persistRefreshToken(refreshId, userId, expiresAt);
  return { accessToken, refreshToken };
}

export const AuthService = {
  async register(data: unknown): Promise<User> {
    const parsed = insertUserSchema.parse(data);
    const hashedPassword = await bcrypt.hash(parsed.password, 10);

    const userToInsert = {
      ...parsed,
      password: hashedPassword,
    };

    const user = await storage.createUser(userToInsert);
    return user;
  },

  async login(data: unknown): Promise<User | null> {
    const parsed = loginUserSchema.parse(data);

    const user = await storage.getUserByEmail(parsed.email);
    if (!user) return null;

    const passwordMatch = await bcrypt.compare(parsed.password, user.password);
    if (!passwordMatch) return null;

    await storage.updateUserLastLogin(user.id);
    return user;
  },

  async getCurrentUser(userId: string): Promise<User | null> {
    const user = await storage.getUser(userId);
    return user || null;
  },

  async issueTokens(userId: string) {
    return issueTokens(userId);
  },

  async refresh(refreshToken: string) {
    const decoded = jwt.verify(refreshToken, refreshSecret) as { sub?: string; jti?: string };
    if (!decoded?.sub || !decoded?.jti) {
      throw new Error("Invalid refresh token");
    }

    const valid = await validateRefreshToken(decoded.jti);
    if (!valid || valid.userId !== decoded.sub) {
      throw new Error("Invalid refresh token");
    }

    await revokeRefreshToken(decoded.jti);
    return issueTokens(decoded.sub);
  },

  async revoke(refreshToken?: string | null) {
    if (!refreshToken) return;
    try {
      const decoded = jwt.verify(refreshToken, refreshSecret) as { jti?: string };
      if (decoded?.jti) {
        await revokeRefreshToken(decoded.jti);
      }
    } catch {
      // ignore invalid token
    }
  },
};
