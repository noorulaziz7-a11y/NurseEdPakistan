import express, { Request, Response } from "express";
import { storage, MemStorage } from "./storage";
import { AuthService } from "./auth";

const router = express.Router();

// UTILITY — normalize exam names
const normalizeExam = (str: string) =>
  str.toLowerCase().replace(/[^a-z0-9]/g, "");

const fallbackStorage =
  process.env.NODE_ENV !== "production" ? new MemStorage() : null;

// ---------------- USERS ----------------

router.get("/api/users/:id", async (req: Request, res: Response) => {
  try {
    const user = await storage.getUser(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ---------------- AUTH ----------------

const sanitizeUser = (user: any) => {
  const { password, ...safeUser } = user || {};
  return safeUser;
};

router.post("/api/auth/register", async (req: Request, res: Response) => {
  try {
    const user = await AuthService.register(req.body);
    req.session.userId = user.id;
    res.json({ user: sanitizeUser(user) });
  } catch (error: any) {
    res.status(400).json({ message: error?.message || "Registration failed" });
  }
});

router.post("/api/auth/login", async (req: Request, res: Response) => {
  try {
    const user = await AuthService.login(req.body);
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    req.session.userId = user.id;
    res.json({ user: sanitizeUser(user) });
  } catch (error: any) {
    res.status(400).json({ message: error?.message || "Login failed" });
  }
});

router.get("/api/auth/me", async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.json({ user: null });
    const user = await storage.getUser(userId);
    if (!user) return res.json({ user: null });
    res.json({ user: sanitizeUser(user) });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.post("/api/auth/logout", async (req: Request, res: Response) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

// ---------------- EXAMS ----------------

// Get all exams
router.get("/api/exams", async (_req: Request, res: Response) => {
  try {
    const exams = await storage.getAllExams();
    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Get exam by ID
router.get("/api/exams/:id", async (req: Request, res: Response) => {
  try {
    const exams = await storage.getAllExams();
    const exam = exams.find((e) => e.id.toString() === req.params.id);
    if (!exam) return res.status(404).json({ message: "Exam not found" });
    res.json(exam);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ---------------- MCQs / Exam Questions ----------------

// Accept both /api/exams/:examType/questions and /api/exams/:examId/questions
router.get(
  ["/api/exams/:examType/questions", "/api/exams/:examId/questions"],
  async (req: Request, res: Response) => {
    try {
      const raw = req.query || {};

      const subject = raw.category?.toString() || raw.subject?.toString();
      const system = raw.system?.toString();
      const difficulty = raw.difficulty?.toString();
      const limit = raw.limit ? parseInt(raw.limit.toString()) : undefined;

      // Accept either :examType or :examId
      const paramValue =
        (req.params as any).examType || (req.params as any).examId;

      if (!paramValue) {
        return res
          .status(400)
          .json({ message: "Exam identifier missing in URL" });
      }

      // Normalize exam name so "NCLEX", "nclex-rn", "nclexrn" all match
      const normalizedExam = normalizeExam(paramValue);

      const baseFilters = { subject, system, difficulty, limit };
      let questions = await storage.getExamQuestions(normalizedExam, baseFilters);

      // If strict filters yield no results, progressively relax them to avoid empty quizzes.
      if (questions.length === 0 && (subject || system || difficulty)) {
        const relaxations = [
          { subject, difficulty, limit }, // drop system first
          { difficulty, limit },          // drop subject too
          { limit },                      // drop difficulty too
        ];

        for (const filters of relaxations) {
          questions = await storage.getExamQuestions(normalizedExam, filters);
          if (questions.length > 0) break;
        }
      }

      // Fallback: If no questions found via ID, try looking up by Exam Name (legacy data support)
      if (questions.length === 0) {
        const exams = await storage.getAllExams();
        const exam = exams.find((e) => normalizeExam(e.id) === normalizedExam);

        if (exam && exam.name) {
          console.log(`No questions found for ID ${normalizedExam}, trying name: ${exam.name}`);
          let questionsByName = await storage.getExamQuestions(exam.name, baseFilters);
          if (questionsByName.length === 0 && (subject || system || difficulty)) {
            const relaxations = [
              { subject, difficulty, limit },
              { difficulty, limit },
              { limit },
            ];
            for (const filters of relaxations) {
              questionsByName = await storage.getExamQuestions(exam.name, filters);
              if (questionsByName.length > 0) break;
            }
          }
          if (questionsByName.length > 0) {
            questions = questionsByName;
          }
        }
      }

      // Dev fallback: if DB is empty, serve seeded in-memory questions
      if (questions.length === 0 && fallbackStorage) {
        let fallbackQuestions = await fallbackStorage.getExamQuestions(
          normalizedExam,
          baseFilters
        );
        if (fallbackQuestions.length === 0 && (subject || system || difficulty)) {
          const relaxations = [
            { subject, difficulty, limit },
            { difficulty, limit },
            { limit },
          ];
          for (const filters of relaxations) {
            fallbackQuestions = await fallbackStorage.getExamQuestions(
              normalizedExam,
              filters
            );
            if (fallbackQuestions.length > 0) break;
          }
        }
        if (fallbackQuestions.length === 0) {
          const fallbackExams = await fallbackStorage.getAllExams();
          const fallbackExam = fallbackExams.find(
            (e) => normalizeExam(e.id) === normalizedExam
          );
          if (fallbackExam?.name) {
            fallbackQuestions = await fallbackStorage.getExamQuestions(
              fallbackExam.name,
              baseFilters
            );
            if (fallbackQuestions.length === 0 && (subject || system || difficulty)) {
              const relaxations = [
                { subject, difficulty, limit },
                { difficulty, limit },
                { limit },
              ];
              for (const filters of relaxations) {
                fallbackQuestions = await fallbackStorage.getExamQuestions(
                  fallbackExam.name,
                  filters
                );
                if (fallbackQuestions.length > 0) break;
              }
            }
          }
        }
        if (fallbackQuestions.length > 0) {
          questions = fallbackQuestions;
        }
      }

      res.json(questions);
    } catch (error) {
      console.error("Failed to fetch exam questions:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }
);

// Legacy practice-test endpoint (used by /practice-test/:examType)
router.get("/api/exam-questions/:examType", async (req: Request, res: Response) => {
  try {
    const normalizedExam = normalizeExam(req.params.examType);
    const questions = await storage.getExamQuestions(normalizedExam);
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Get single MCQ
router.get("/api/questions/:id", async (req: Request, res: Response) => {
  try {
    const question = await storage.getExamQuestionById(req.params.id);
    if (!question)
      return res.status(404).json({ message: "Question not found" });
    res.json(question);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ---------------- DAILY CHALLENGE ----------------

router.get("/api/daily-challenge/:examType", async (req: Request, res: Response) => {
  try {
    const normalizedExam = normalizeExam(req.params.examType);
    const questions = await storage.getExamQuestions(normalizedExam, { limit: 1 });
    if (questions.length === 0)
      return res.status(404).json({ message: "No questions found" });
    res.json(questions[0]);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.get("/api/daily-challenge/stats", async (_req: Request, res: Response) => {
  res.json({ streak: 0, totalCompleted: 0, averageScore: 0 });
});

// ---------------- COLLEGES ----------------

router.get("/api/colleges", async (req: Request, res: Response) => {
  try {
    const { city, type, programs } = req.query;
    const colleges = await storage.getColleges({
      city: city?.toString(),
      type: type?.toString(),
      programs: programs?.toString(),
    });
    res.json(colleges);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Get a college by ID
router.get("/api/colleges/:id", async (req: Request, res: Response) => {
  try {
    const college = await storage.getCollegeById(req.params.id);
    if (!college) return res.status(404).json({ message: "College not found" });
    res.json(college);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ---------------- STUDY LIBRARY ----------------
router.get("/api/study-libraries", async (req: Request, res: Response) => {
  try {
    const category = req.query.category?.toString();
    const libraries = await storage.getStudyLibraries(category);
    res.json(libraries);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ---------------- NEWS ----------------
router.get("/api/news", async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit.toString()) : undefined;
    const featured =
      req.query.featured !== undefined
        ? req.query.featured?.toString() === "true"
        : undefined;
    const articles = await storage.getNewsArticles(limit, featured);
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ---------------- PRACTICE TESTS ----------------
router.get("/api/practice-tests", async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.json([]);
    const tests = await storage.getPracticeTests(userId);
    res.json(tests);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.post("/api/practice-tests", async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId || req.body?.userId || null;
    const test = await storage.createPracticeTest({ ...req.body, userId });
    res.json(test);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ---------------- ANALYTICS ----------------
router.get("/api/analytics", async (req: Request, res: Response) => {
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

    const tests = await storage.getPracticeTests(userId);
    const totalQuizzes = tests.length;
    const averageScore =
      totalQuizzes > 0
        ? Math.round(tests.reduce((sum, t) => sum + (t.score || 0), 0) / totalQuizzes)
        : 0;
    const totalTime = tests.reduce((sum, t) => sum + (t.timeSpent || 0), 0);
    const completionRate =
      totalQuizzes > 0
        ? Math.round(
            (tests.filter((t) => (t.totalQuestions || 0) > 0).length / totalQuizzes) * 100
          )
        : 0;

    res.json({
      totalQuizzes,
      averageScore,
      totalTime,
      completionRate,
      performanceOverTime: [],
      examBreakdown: [],
      subjectPerformance: [],
      weeklyActivity: [],
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ---------------- LEADERBOARD ----------------
router.get("/api/leaderboard", async (_req: Request, res: Response) => {
  res.json([]);
});

// ---------------- IELTS PROGRESS ----------------
router.get("/api/ielts/progress", async (_req: Request, res: Response) => {
  res.json(null);
});

export const registerRoutes = router;
