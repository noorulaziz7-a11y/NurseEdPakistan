// server/routes.ts
import type { Express, Request, Response } from "express";
import { storage } from "./storage";
import {
  insertExamQuestionSchema,
  insertCollegeSchema,
  insertStudyMaterialSchema,
  insertNewsArticleSchema,
  insertPracticeTestSchema,
  insertUserSchema,
  loginUserSchema,
} from "@shared/schema";
import { AuthService } from "./auth";

/**
 * Register application routes on the provided Express app.
 * This function does NOT create or return an http.Server — the caller
 * (server/index.ts) is responsible for creating/starting the server.
 */
export async function registerRoutes(app: Express): Promise<void> {
  // Authentication routes
  app.post("/api/auth/register", async (req: Request, res: Response, next) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await AuthService.register(userData);

      // Regenerate session for security and set user ID
      req.session.regenerate((err: any) => {
        if (err) return next(err);
        req.session.userId = user.id;
        req.session.save((err: any) => {
          if (err) return next(err);
          res.status(201).json({ user, message: "Registration successful" });
        });
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(400).json({ message: "Registration failed" });
      }
    }
  });

  app.post("/api/auth/login", async (req: Request, res: Response, next) => {
    try {
      const loginData = loginUserSchema.parse(req.body);
      const user = await AuthService.login(loginData);

      // Regenerate session for security and set user ID
      req.session.regenerate((err: any) => {
        if (err) return next(err);
        req.session.userId = user.id;
        req.session.save((err: any) => {
          if (err) return next(err);
          res.json({ user, message: "Login successful" });
        });
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(401).json({ message: error.message });
      } else {
        res.status(401).json({ message: "Login failed" });
      }
    }
  });

  app.post("/api/auth/logout", async (req: Request, res: Response) => {
    try {
      req.session.destroy((err: any) => {
        if (err) {
          return res.status(500).json({ message: "Logout failed" });
        }
        res.clearCookie("connect.sid");
        res.json({ message: "Logout successful" });
      });
    } catch (error) {
      res.status(500).json({ message: "Logout failed" });
    }
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
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // Exam questions ro
