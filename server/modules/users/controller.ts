import type { Request, Response } from "express";
import {
  getUserById,
  getPracticeTests,
  createPracticeTest,
  getAnalytics,
} from "./service";

export async function getUser(req: Request, res: Response) {
  try {
    const user = await getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

export async function listPracticeTests(req: Request, res: Response) {
  try {
    const userId = req.session.userId;
    if (!userId) return res.json([]);
    const tests = await getPracticeTests(userId);
    res.json(tests);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

export async function createPracticeTestHandler(req: Request, res: Response) {
  try {
    const userId = req.session.userId || req.body?.userId || null;
    const test = await createPracticeTest({ ...req.body, userId });
    res.json(test);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

export async function analytics(req: Request, res: Response) {
  try {
    const userId = req.session.userId;
    if (!userId) {
      return res.json({
        totalQuizzes: 0,
        averageScore: 0,
        totalTime: 0,
        completionRate: 0,
        performanceOverTime: [],
        examBreakdown: [],
        subjectPerformance: [],
        weeklyActivity: [],
      });
    }
    const data = await getAnalytics(userId);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}
