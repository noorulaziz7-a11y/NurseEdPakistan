import type { Request, Response } from "express";
import { z } from "zod";
import { AuthService } from "./service";
import { storage } from "../../storage";
import { recordAuditLog } from "../../audit";

const sanitizeUser = (user: any) => {
  const { password, ...safeUser } = user || {};
  return safeUser;
};

export async function register(req: Request, res: Response) {
  try {
    const payload = z
      .object({
        username: z.string().min(1),
        email: z.string().email(),
        password: z.string().min(6),
        firstName: z.string().min(1),
        lastName: z.string().min(1),
      })
      .parse(req.body);
    const user = await AuthService.register(req.body);
    req.session.userId = user.id;
    const tokens = await AuthService.issueTokens(user.id);
    await recordAuditLog({
      userId: user.id,
      action: "auth.register",
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
      metadata: { email: payload.email },
    });
    res.json({ user: sanitizeUser(user), ...tokens });
  } catch (error: any) {
    res.status(400).json({ message: error?.message || "Registration failed" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const payload = z
      .object({
        email: z.string().email(),
        password: z.string().min(1),
      })
      .parse(req.body);
    const user = await AuthService.login(req.body);
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    req.session.userId = user.id;
    const tokens = await AuthService.issueTokens(user.id);
    await recordAuditLog({
      userId: user.id,
      action: "auth.login",
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
      metadata: { email: payload.email },
    });
    res.json({ user: sanitizeUser(user), ...tokens });
  } catch (error: any) {
    res.status(400).json({ message: error?.message || "Login failed" });
  }
}

export async function me(req: Request, res: Response) {
  try {
    const userId = req.session.userId;
    if (!userId) return res.json({ user: null });
    const user = await storage.getUser(userId);
    if (!user) return res.json({ user: null });
    res.json({ user: sanitizeUser(user) });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

export async function logout(req: Request, res: Response) {
  const refreshToken = req.body?.refreshToken;
  await AuthService.revoke(refreshToken);
  await recordAuditLog({
    userId: req.session.userId || null,
    action: "auth.logout",
    ipAddress: req.ip,
    userAgent: req.headers["user-agent"],
  });
  req.session.destroy(() => {
    res.json({ success: true });
  });
}

export async function refresh(req: Request, res: Response) {
  try {
    const payload = z
      .object({
        refreshToken: z.string().min(1),
      })
      .parse(req.body);
    const tokens = await AuthService.refresh(payload.refreshToken);
    await recordAuditLog({
      userId: req.session.userId || null,
      action: "auth.refresh",
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });
    res.json(tokens);
  } catch (error: any) {
    res.status(401).json({ message: error?.message || "Invalid refresh token" });
  }
}
