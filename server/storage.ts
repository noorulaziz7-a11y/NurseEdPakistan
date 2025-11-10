import {
  type User,
  type InsertUser,
  type ExamQuestion,
  type InsertExamQuestion,
  type College,
  type InsertCollege,
  type StudyLibrary,
  type InsertStudyLibrary,
  type NewsArticle,
  type InsertNewsArticle,
  type PracticeTest,
  type InsertPracticeTest,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserLastLogin(userId: string): Promise<void>;

  // Exams
  getAllExams(): Promise<any[]>;

  // Exam Questions
  getExamQuestions(examType: string, limit?: number): Promise<ExamQuestion[]>;
  getExamQuestionById(id: string): Promise<ExamQuestion | undefined>;
  createExamQuestion(question: InsertExamQuestion): Promise<ExamQuestion>;

  // Colleges
  getColleges(filters?: { city?: string; type?: string; programs?: string }): Promise<College[]>;
  getCollegeById(id: string): Promise<College | undefined>;
  createCollege(college: InsertCollege): Promise<College>;

  // Study Library
  getStudyLibraries(category?: string): Promise<StudyLibrary[]>;
  getStudyLibraryById(id: string): Promise<StudyLibrary | undefined>;
  createStudyLibrary(material: InsertStudyLibrary): Promise<StudyLibrary>;

  // News Articles
  getNewsArticles(limit?: number, featured?: boolean): Promise<NewsArticle[]>;
  getNewsArticleById(id: string): Promise<NewsArticle | undefined>;
  createNewsArticle(article: InsertNewsArticle): Promise<NewsArticle>;

  // Practice Tests
  getPracticeTests(userId: string): Promise<PracticeTest[]>;
  createPracticeTest(test: InsertPracticeTest): Promise<PracticeTest>;
}

export class MemStorage implements IStorage {
  private users = new Map<string, User>();
  private exams: any[] = [];
  private examQuestions = new Map<string, ExamQuestion>();
  private colleges = new Map<string, College>();
  private studyLibraries = new Map<string, StudyLibrary>();
  private newsArticles = new Map<string, NewsArticle>();
  private practiceTests = new Map<string, PracticeTest>();

  constructor() {
    this.seedData();
  }

  private seedData() {
    // 🧠 Seed exams (for /api/exams)
    this.exams = [
      {
        id: "nclex",
        name: "NCLEX-RN",
        description: "US-based licensure exam for Registered Nurses.",
        badge: "International",
        badgeColor: "bg-blue-100 text-blue-600",
        progress: 45,
        image: "/images/exams/nclex.jpg",
      },
      {
        id: "moh",
        name: "MOH Exam",
        description: "UAE Ministry of Health licensing exam for nurses.",
        badge: "UAE",
        badgeColor: "bg-green-100 text-green-600",
        progress: 23,
        image: "/images/exams/moh.jpg",
      },
      {
        id: "snle",
        name: "SNLE",
        description: "Saudi Nursing Licensure Exam for registered nurses.",
        badge: "Saudi Arabia",
        badgeColor: "bg-yellow-100 text-yellow-600",
        progress: 78,
        image: "/images/exams/snle.jpg",
      },
      {
        id: "dha",
        name: "DHA Exam",
        description: "Dubai Health Authority exam for healthcare professionals.",
        badge: "Dubai",
        badgeColor: "bg-pink-100 text-pink-600",
        progress: 0,
        image: "/images/exams/dha.jpg",
      },
      {
        id: "haad",
        name: "HAAD Exam",
        description: "Abu Dhabi licensing exam for nurses and midwives.",
        badge: "Abu Dhabi",
        badgeColor: "bg-purple-100 text-purple-600",
        progress: 0,
        image: "/images/exams/haad.jpg",
      },
      {
        id: "ielts",
        name: "IELTS for Nurses",
        description: "English proficiency exam required for international nurses.",
        badge: "Language",
        badgeColor: "bg-indigo-100 text-indigo-600",
        progress: 0,
        image: "/images/exams/ielts.jpg",
      },
    ];

    // 🔹 Seed exam questions (unchanged)
    const sampleQuestions: InsertExamQuestion[] = [
      {
        examType: "NCLEX-RN",
        question:
          "A nurse is caring for a client with chronic kidney disease. Which of the following dietary recommendations would be most appropriate?",
        options: [
          "Increase protein intake to 2.0 g/kg/day",
          "Restrict phosphorus and potassium intake",
          "Encourage high-sodium foods for fluid retention",
          "Increase fluid intake to 3 liters per day",
        ],
        correctAnswer: "Restrict phosphorus and potassium intake",
        explanation:
          "Clients with chronic kidney disease need to restrict phosphorus and potassium as the kidneys cannot effectively filter these electrolytes, leading to dangerous accumulation.",
        difficulty: "intermediate",
        category: "Medical-Surgical",
      },
    ];

    sampleQuestions.forEach((q) => this.createExamQuestion(q));
  }

  // Exams
  async getAllExams(): Promise<any[]> {
    return this.exams;
  }

  // Users
  async getUser(id: string) {
    return this.users.get(id);
  }

  async getUserByUsername(username: string) {
    return Array.from(this.users.values()).find((u) => u.username === username);
  }

  async getUserByEmail(email: string) {
    return Array.from(this.users.values()).find((u) => u.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      examProgress: {},
      createdAt: new Date(),
      lastLoginAt: null,
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserLastLogin(userId: string): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      user.lastLoginAt = new Date();
      this.users.set(userId, user);
    }
  }

  // Exam Questions
  async getExamQuestions(examType: string, limit?: number): Promise<ExamQuestion[]> {
    const questions = Array.from(this.examQuestions.values()).filter(
      (q) => q.examType === examType
    );
    return limit ? questions.slice(0, limit) : questions;
  }

  async getExamQuestionById(id: string) {
    return this.examQuestions.get(id);
  }

  async createExamQuestion(insertQuestion: InsertExamQuestion): Promise<ExamQuestion> {
    const id = randomUUID();
    const question: ExamQuestion = { ...insertQuestion, id };
    this.examQuestions.set(id, question);
    return question;
  }

  // Colleges
  async getColleges(filters?: { city?: string; programs?: string }): Promise<College[]> {
    let colleges = Array.from(this.colleges.values());

    if (filters?.city) {
      colleges = colleges.filter((c) => c.city.toLowerCase() === filters.city!.toLowerCase());
    }

    if (filters?.programs) {
      const program = filters.programs.toLowerCase();
      colleges = colleges.filter(
        (c) => Array.isArray(c.programs) && c.programs.some((p) => p.toLowerCase().includes(program))
      );
    }

    return colleges;
  }

  async getCollegeById(id: string) {
    return this.colleges.get(id);
  }

  async createCollege(insertCollege: InsertCollege): Promise<College> {
    const id = randomUUID();
    const college: College = { ...insertCollege, id, createdAt: new Date() };
    this.colleges.set(id, college);
    return college;
  }
  // (Other methods remain unchanged)
  // Study Library
  async getStudyLibraries(category?: string): Promise<StudyLibrary[]> {
    let libraries = Array.from(this.studyLibraries.values());
    if (category) {
      libraries = libraries.filter((l) => l.category === category);
    }
    return libraries;
  }

  async getStudyLibraryById(id: string): Promise<StudyLibrary | undefined> {
    return this.studyLibraries.get(id);
  }

  async createStudyLibrary(material: InsertStudyLibrary): Promise<StudyLibrary> {
    const id = randomUUID();
    const newMaterial: StudyLibrary = { ...material, id, createdAt: new Date() };
    this.studyLibraries.set(id, newMaterial);
    return newMaterial;
  }

  // News Articles
  async getNewsArticles(limit?: number, featured?: boolean): Promise<NewsArticle[]> {
    let articles = Array.from(this.newsArticles.values());
    if (featured) {
      articles = articles.filter((a) => a.featured);
    }
    if (limit) {
      articles = articles.slice(0, limit);
    }
    return articles;
  }

  async getNewsArticleById(id: string): Promise<NewsArticle | undefined> {
    return this.newsArticles.get(id);
  }

  async createNewsArticle(article: InsertNewsArticle): Promise<NewsArticle> {
    const id = randomUUID();
    const newArticle: NewsArticle = { ...article, id, publishedAt: new Date() };
    this.newsArticles.set(id, newArticle);
    return newArticle;
  }

  // Practice Tests
  async getPracticeTests(userId: string): Promise<PracticeTest[]> {
    return Array.from(this.practiceTests.values()).filter((pt) => pt.userId === userId);
  }

  async createPracticeTest(test: InsertPracticeTest): Promise<PracticeTest> {
    const id = randomUUID();
    const newTest: PracticeTest = { ...test, id, completedAt: new Date() };
    this.practiceTests.set(id, newTest);
    return newTest;
  }
}

import { DatabaseStorage } from "./database-storage";
import { seedDatabase } from "./seed";

// 🧩 Use DatabaseStorage (for production) or MemStorage (for testing)
export const storage =
  process.env.USE_MEMORY_STORAGE === "true" ? new MemStorage() : new DatabaseStorage();

// Initialize database with seed data in dev mode
if (process.env.NODE_ENV === "development") {
  seedDatabase().catch(console.error);
}
