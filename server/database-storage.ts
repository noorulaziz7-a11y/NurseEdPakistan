import {
  users,
  examQuestions,
  colleges,
  studyMaterials,
  newsArticles,
  practiceTests,
  type User,
  type InsertUser,
  type ExamQuestion,
  type InsertExamQuestion,
  type College,
  type InsertCollege,
  type StudyMaterial,
  type InsertStudyMaterial,
  type NewsArticle,
  type InsertNewsArticle,
  type PracticeTest,
  type InsertPracticeTest,
} from "@shared/schema";
import { db } from "./db";
import { eq, like, and, desc } from "drizzle-orm";

export class DatabaseStorage {
  // ---------------- USERS ----------------
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUserLastLogin(userId: string): Promise<void> {
    await db.update(users).set({ lastLoginAt: new Date() }).where(eq(users.id, userId));
  }

  // ---------------- EXAM QUESTIONS ----------------
  async getExamQuestions(examType: string, limit?: number): Promise<ExamQuestion[]> {
    let query: any = db.select().from(examQuestions).where(eq(examQuestions.examType, examType));

    if (limit && limit > 0) {
      query = query.limit(limit);
    }

    return await query;
  }

  async getExamQuestionById(id: string): Promise<ExamQuestion | undefined> {
    const [question] = await db.select().from(examQuestions).where(eq(examQuestions.id, id));
    return question;
  }

  async createExamQuestion(insertQuestion: InsertExamQuestion): Promise<ExamQuestion> {
    const [question] = await db.insert(examQuestions).values(insertQuestion).returning();
    return question;
  }

  // ---------------- COLLEGES ----------------
  async getColleges(filters?: { city?: string; type?: string; programs?: string }): Promise<College[]> {
    const conditions: any[] = [];

    if (filters?.city && filters.city !== "All Cities") {
      conditions.push(eq(colleges.city, filters.city));
    }

    if (filters?.type) {
      conditions.push(eq(colleges.type, filters.type));
    }

    if (filters?.programs && filters.programs !== "All Programs") {
      conditions.push(like(colleges.programs, `%${filters.programs}%`));
    }

    let query: any = db.select().from(colleges);
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return await query;
  }

  async getCollegeById(id: string): Promise<College | undefined> {
    const [college] = await db.select().from(colleges).where(eq(colleges.id, id));
    return college;
  }

  async createCollege(insertCollege: InsertCollege): Promise<College> {
    const [college] = await db.insert(colleges).values(insertCollege).returning();
    return college;
  }

  // ---------------- STUDY MATERIALS ----------------
  async getStudyMaterials(category?: string): Promise<StudyMaterial[]> {
    let query: any = db.select().from(studyMaterials);

    if (category && category !== "All Materials") {
      query = query.where(eq(studyMaterials.category, category));
    }

    query = query.orderBy(desc(studyMaterials.updatedAt));

    return await query;
  }

  async getStudyMaterialById(id: string): Promise<StudyMaterial | undefined> {
    const [material] = await db.select().from(studyMaterials).where(eq(studyMaterials.id, id));
    return material;
  }

  async createStudyMaterial(insertMaterial: InsertStudyMaterial): Promise<StudyMaterial> {
    const [material] = await db.insert(studyMaterials).values(insertMaterial).returning();
    return material;
  }

  // ---------------- NEWS ARTICLES ----------------
  async getNewsArticles(limit?: number, featured?: boolean): Promise<NewsArticle[]> {
    let query: any = db.select().from(newsArticles);

    if (featured !== undefined) {
      query = query.where(eq(newsArticles.featured, featured));
    }

    if (limit && limit > 0) {
      query = query.limit(limit);
    }

    query = query.orderBy(desc(newsArticles.publishedAt));
    return await query;
  }

  async getNewsArticleById(id: string): Promise<NewsArticle | undefined> {
    const [article] = await db.select().from(newsArticles).where(eq(newsArticles.id, id));
    return article;
  }

  async createNewsArticle(insertArticle: InsertNewsArticle): Promise<NewsArticle> {
    const [article] = await db.insert(newsArticles).values(insertArticle).returning();
    return article;
  }

  // ---------------- PRACTICE TESTS ----------------
  async getPracticeTests(userId: string): Promise<PracticeTest[]> {
    const rows = await db
      .select()
      .from(practiceTests)
      .where(eq(practiceTests.userId, userId))
      .orderBy(desc(practiceTests.completedAt));

    return rows as PracticeTest[];
  }

  async createPracticeTest(insertTest: InsertPracticeTest): Promise<PracticeTest> {
    const [test] = await db.insert(practiceTests).values(insertTest).returning();
    return test;
  }
}
