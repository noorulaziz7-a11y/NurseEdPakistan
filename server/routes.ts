import type { Express, Request, Response } from "express";
import { storage } from "./storage";
import { insertUserSchema, loginUserSchema } from "@shared/schema";
import { AuthService } from "./auth";

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
      const message =
        error instanceof Error ? error.message : "Registration failed";
      res.status(400).json({ message });
    }
  });

  app.post("/api/auth/login", async (req: Request, res: Response, next) => {
    try {
      const loginData = loginUserSchema.parse(req.body);
      const user = await AuthService.login(loginData);

      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

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

      const user = await AuthService.getCurrentUser(
        parseInt(req.session.userId, 10)
      );
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
      console.log("📡 Fetching colleges with filters:", req.query);
      const { city, program } = req.query;

      const filters = {
        city: city as string | undefined,
        programs: program as string | undefined,
      };

      const colleges = await storage.getColleges(filters);
      console.log(`✅ Found ${colleges.length} colleges`);
      res.json(colleges);
    } catch (error) {
      console.error("❌ Error fetching colleges:", error);
      res.status(500).json({ message: "Failed to fetch colleges" });
    }
  });

  // ---------------- EXAM QUESTIONS ROUTE ----------------
  app.get("/api/exam-questions/:examType", async (req: Request, res: Response) => {
    try {
      const { examType } = req.params;
      console.log(`📡 Fetching questions for exam type: ${examType}`);
      const questions = await storage.getExamQuestions(examType);
      console.log(`✅ Found ${questions.length} questions for ${examType}`);
      res.json(questions);
    } catch (error) {
      console.error(`❌ Error fetching questions for ${req.params.examType}:`, error);
      res.status(500).json({ message: "Failed to fetch exam questions" });
    }
  });

  // ---------------- EXAMS ROUTE ---------------- 
  app.get("/api/exams", async (_req: Request, res: Response) => {
    try {
      const exams = [
        { id: "nclex", name: "NCLEX-RN", description: "US/Canada licensure exam", badge: "Popular", badgeColor: "bg-blue-100 text-blue-700", region: "North America" },
        { id: "snle", name: "SNLE", description: "Saudi licensure exam", badge: "KSA", badgeColor: "bg-green-100 text-green-700", region: "Middle East" },
        { id: "moh", name: "MOH", description: "UAE Ministry of Health exam", badge: "UAE", badgeColor: "bg-yellow-100 text-yellow-700", region: "Middle East" },
        { id: "dha", name: "DHA", description: "Dubai Health Authority exam", badge: "Dubai", badgeColor: "bg-red-100 text-red-700", region: "Middle East" },
        { id: "haad", name: "HAAD", description: "Abu Dhabi DOH exam", badge: "Abu Dhabi", badgeColor: "bg-purple-100 text-purple-700", region: "Middle East" },
        { id: "ielts", name: "IELTS", description: "Language proficiency", badge: "Language", badgeColor: "bg-pink-100 text-pink-700", region: "Global" },
      ];
      res.json(exams);
    } catch (error) {
      console.error("❌ Error fetching exams:", error);
      res.status(500).json({ message: "Failed to fetch exams" });
    }
  });

  // ---------------- QUIZ ROUTES ---------------- 
  // Get quiz questions with filters
  app.get("/api/quiz/questions", async (req: Request, res: Response) => {
    try {
      const { examType, difficulty, category, limit, moduleType } = req.query;
      let questions = await storage.getExamQuestions(examType as string);
      
      // Filter by difficulty
      if (difficulty) {
        questions = questions.filter(q => q.difficulty === difficulty);
      }
      
      // Filter by category
      if (category) {
        questions = questions.filter(q => q.category === category);
      }
      
      // Filter by module type (for IELTS)
      if (moduleType && examType === "ielts") {
        // IELTS module filtering logic can be added here
      }
      
      // Shuffle and limit
      const shuffled = questions.sort(() => Math.random() - 0.5);
      const limitNum = limit ? parseInt(limit as string) : shuffled.length;
      const result = shuffled.slice(0, limitNum);
      
      res.json(result);
    } catch (error) {
      console.error("❌ Error fetching quiz questions:", error);
      res.status(500).json({ message: "Failed to fetch quiz questions" });
    }
  });

  // Submit quiz result
  app.post("/api/quiz/results", async (req: Request, res: Response) => {
    try {
      const userId = req.session?.userId;
      const resultData = req.body;
      
      // In a real implementation, save to database
      // For now, return success
      res.json({ 
        success: true, 
        resultId: `result_${Date.now()}`,
        message: "Quiz result saved successfully"
      });
    } catch (error) {
      console.error("❌ Error saving quiz result:", error);
      res.status(500).json({ message: "Failed to save quiz result" });
    }
  });

  // Get user progress
  app.get("/api/quiz/progress", async (req: Request, res: Response) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.json({ progress: null });
      }
      
      // In a real implementation, fetch from database
      res.json({ progress: null });
    } catch (error) {
      console.error("❌ Error fetching progress:", error);
      res.status(500).json({ message: "Failed to fetch progress" });
    }
  });

  // Get user results history
  app.get("/api/quiz/results", async (req: Request, res: Response) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.json({ results: [] });
      }
      
      // In a real implementation, fetch from database
      res.json({ results: [] });
    } catch (error) {
      console.error("❌ Error fetching results:", error);
      res.status(500).json({ message: "Failed to fetch results" });
    }
  });

  // Check guest quiz limit
  app.get("/api/quiz/guest-limit", async (req: Request, res: Response) => {
    try {
      const sessionId = req.query.sessionId as string;
      // In a real implementation, check from database
      const GUEST_QUIZ_LIMIT = 5;
      res.json({ 
        limit: GUEST_QUIZ_LIMIT,
        remaining: GUEST_QUIZ_LIMIT,
        canTakeQuiz: true
      });
    } catch (error) {
      console.error("❌ Error checking guest limit:", error);
      res.status(500).json({ message: "Failed to check guest limit" });
    }
  });

  // ---------------- LEADERBOARD ROUTES ---------------- 
  app.get("/api/leaderboard", async (req: Request, res: Response) => {
    try {
      const { examType, period } = req.query;
      // Mock leaderboard data - in real app, fetch from database
      const leaderboard = [
        { rank: 1, username: "NursePro2024", score: 98, examType: "NCLEX", completedAt: new Date().toISOString() },
        { rank: 2, username: "StudyMaster", score: 95, examType: "NCLEX", completedAt: new Date().toISOString() },
        { rank: 3, username: "ExamChamp", score: 93, examType: "MOH", completedAt: new Date().toISOString() },
        { rank: 4, username: "NursingStar", score: 91, examType: "DHA", completedAt: new Date().toISOString() },
        { rank: 5, username: "TopPerformer", score: 89, examType: "SNLE", completedAt: new Date().toISOString() },
      ];
      res.json(leaderboard);
    } catch (error) {
      console.error("❌ Error fetching leaderboard:", error);
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });

  // ---------------- DAILY CHALLENGE ROUTES ---------------- 
  app.get("/api/daily-challenge", async (req: Request, res: Response) => {
    try {
      const { date } = req.query;
      // Mock daily challenge - in real app, fetch from database
      const challenge = {
        id: `challenge-${date}`,
        date: date || new Date().toISOString().split("T")[0],
        examType: "NCLEX",
        questionCount: 20,
        difficulty: "medium",
        timeLimit: 30,
        completed: false,
        participants: 1250,
        topScore: 98,
      };
      res.json(challenge);
    } catch (error) {
      console.error("❌ Error fetching daily challenge:", error);
      res.status(500).json({ message: "Failed to fetch daily challenge" });
    }
  });

  app.get("/api/daily-challenge/stats", async (req: Request, res: Response) => {
    try {
      // Mock stats - in real app, fetch from database
      res.json({
        streak: 7,
        totalCompleted: 45,
        averageScore: 85,
      });
    } catch (error) {
      console.error("❌ Error fetching challenge stats:", error);
      res.status(500).json({ message: "Failed to fetch challenge stats" });
    }
  });

  // ---------------- ANALYTICS ROUTES ---------------- 
  app.get("/api/analytics", async (req: Request, res: Response) => {
    try {
      const userId = req.session?.userId;
      // Mock analytics data - in real app, fetch from database
      res.json({
        totalQuizzes: 125,
        averageScore: 87,
        totalTime: 3420, // minutes
        completionRate: 92,
        performanceOverTime: [
          { date: "Week 1", score: 75, average: 70 },
          { date: "Week 2", score: 80, average: 72 },
          { date: "Week 3", score: 85, average: 75 },
          { date: "Week 4", score: 90, average: 78 },
        ],
        examBreakdown: [
          { exam: "NCLEX", score: 88, attempts: 45 },
          { exam: "MOH", score: 85, attempts: 30 },
          { exam: "DHA", score: 90, attempts: 25 },
        ],
        subjectPerformance: [
          { name: "Medical-Surgical", value: 35 },
          { name: "Pediatrics", value: 25 },
          { name: "Pharmacology", value: 20 },
          { name: "Mental Health", value: 20 },
        ],
        weeklyActivity: [
          { day: "Mon", quizzes: 5, time: 120 },
          { day: "Tue", quizzes: 8, time: 180 },
          { day: "Wed", quizzes: 6, time: 150 },
          { day: "Thu", quizzes: 7, time: 165 },
          { day: "Fri", quizzes: 4, time: 90 },
          { day: "Sat", quizzes: 10, time: 240 },
          { day: "Sun", quizzes: 3, time: 75 },
        ],
      });
    } catch (error) {
      console.error("❌ Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });
}
