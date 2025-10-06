// server/routes.ts
import type { Express, Request, Response } from "express";
import { storage } from "./storage";
import {
  insertUserSchema,
  loginUserSchema,
} from "@shared/schema";
import { AuthService } from "./auth";

/**
 * Register all routes on the provided Express app
 */
export async function registerRoutes(app: Express): Promise<void> {
  // ---------------- AUTH ROUTES ----------------

  app.post("/api/auth/register", async (req: Request, res: Response, next) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await AuthService.register(userData);

      req.session.regenerate((err: any) => {
        if (err) return next(err);
        req.session.userId = user.id;
        req.session.save((err: any) => {
          if (err) return next(err);
          res.status(201).json({ user, message: "Registration successful" });
        });
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Registration failed";
      res.status(400).json({ message });
    }
  });

  app.post("/api/auth/login", async (req: Request, res: Response, next) => {
    try {
      const loginData = loginUserSchema.parse(req.body);
      const user = await AuthService.login(loginData);

      req.session.regenerate((err: any) => {
        if (err) return next(err);
        req.session.userId = user.id;
        req.session.save((err: any) => {
          if (err) return next(err);
          res.json({ user, message: "Login successful" });
        });
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      res.status(401).json({ message });
    }
  });

  app.post("/api/auth/logout", async (req: Request, res: Response) => {
    req.session.destroy((err: any) => {
      if (err) return res.status(500).json({ message: "Logout failed" });
      res.clearCookie("connect.sid");
      res.json({ message: "Logout successful" });
    });
  });

  app.get("/api/auth/me", async (req: Request, res: Response) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = await AuthService.getCurrentUser(req.session.userId);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      res.json({ user });
    } catch {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // ---------------- COLLEGES ROUTE ----------------
  app.get("/api/colleges", async (req: Request, res: Response) => {
    try {
      console.log("📡 Fetching colleges...");
      const colleges = await storage.getColleges();
      console.log(`✅ Found ${colleges.length} colleges`);
      res.json(colleges);
    } catch (error) {
      console.error("❌ Error fetching colleges:", error);
      res.status(500).json({ message: "Failed to fetch colleges" });
    }
  });
}
