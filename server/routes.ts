import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertExamQuestionSchema, insertCollegeSchema, insertStudyMaterialSchema, insertNewsArticleSchema, insertPracticeTestSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Exam questions routes
  app.get("/api/exam-questions/:examType", async (req, res) => {
    try {
      const { examType } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const questions = await storage.getExamQuestions(examType, limit);
      res.json(questions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch exam questions" });
    }
  });

  app.get("/api/exam-questions/:examType/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const question = await storage.getExamQuestionById(id);
      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }
      res.json(question);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch question" });
    }
  });

  app.post("/api/exam-questions", async (req, res) => {
    try {
      const questionData = insertExamQuestionSchema.parse(req.body);
      const question = await storage.createExamQuestion(questionData);
      res.status(201).json(question);
    } catch (error) {
      res.status(400).json({ message: "Invalid question data" });
    }
  });

  // Colleges routes
  app.get("/api/colleges", async (req, res) => {
    try {
      const filters = {
        city: req.query.city as string,
        type: req.query.type as string,
        programs: req.query.programs as string,
      };
      const colleges = await storage.getColleges(filters);
      res.json(colleges);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch colleges" });
    }
  });

  app.get("/api/colleges/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const college = await storage.getCollegeById(id);
      if (!college) {
        return res.status(404).json({ message: "College not found" });
      }
      res.json(college);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch college" });
    }
  });

  app.post("/api/colleges", async (req, res) => {
    try {
      const collegeData = insertCollegeSchema.parse(req.body);
      const college = await storage.createCollege(collegeData);
      res.status(201).json(college);
    } catch (error) {
      res.status(400).json({ message: "Invalid college data" });
    }
  });

  // Study materials routes
  app.get("/api/study-materials", async (req, res) => {
    try {
      const category = req.query.category as string;
      const materials = await storage.getStudyMaterials(category);
      res.json(materials);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch study materials" });
    }
  });

  app.get("/api/study-materials/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const material = await storage.getStudyMaterialById(id);
      if (!material) {
        return res.status(404).json({ message: "Material not found" });
      }
      res.json(material);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch material" });
    }
  });

  app.post("/api/study-materials", async (req, res) => {
    try {
      const materialData = insertStudyMaterialSchema.parse(req.body);
      const material = await storage.createStudyMaterial(materialData);
      res.status(201).json(material);
    } catch (error) {
      res.status(400).json({ message: "Invalid material data" });
    }
  });

  // News articles routes
  app.get("/api/news", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const featured = req.query.featured === "true" ? true : req.query.featured === "false" ? false : undefined;
      const articles = await storage.getNewsArticles(limit, featured);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch news articles" });
    }
  });

  app.get("/api/news/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const article = await storage.getNewsArticleById(id);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch article" });
    }
  });

  app.post("/api/news", async (req, res) => {
    try {
      const articleData = insertNewsArticleSchema.parse(req.body);
      const article = await storage.createNewsArticle(articleData);
      res.status(201).json(article);
    } catch (error) {
      res.status(400).json({ message: "Invalid article data" });
    }
  });

  // Practice tests routes
  app.get("/api/practice-tests/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const tests = await storage.getPracticeTests(userId);
      res.json(tests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch practice tests" });
    }
  });

  app.post("/api/practice-tests", async (req, res) => {
    try {
      const testData = insertPracticeTestSchema.parse(req.body);
      const test = await storage.createPracticeTest(testData);
      res.status(201).json(test);
    } catch (error) {
      res.status(400).json({ message: "Invalid test data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
