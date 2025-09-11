import { 
  users, examQuestions, colleges, studyMaterials, newsArticles, practiceTests,
  type User, type InsertUser, type ExamQuestion, type InsertExamQuestion, 
  type College, type InsertCollege, type StudyMaterial, type InsertStudyMaterial, 
  type NewsArticle, type InsertNewsArticle, type PracticeTest, type InsertPracticeTest 
} from "@shared/schema";
import { db } from "./db";
import { eq, like, and, or, desc } from "drizzle-orm";
import type { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUserLastLogin(userId: string): Promise<void> {
    await db
      .update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, userId));
  }

  // Exam Question methods
  async getExamQuestions(examType: string, limit?: number): Promise<ExamQuestion[]> {
    let query = db.select().from(examQuestions).where(eq(examQuestions.examType, examType));
    
    if (limit) {
      query = query.limit(limit);
    }
    
    return await query;
  }

  async getExamQuestionById(id: string): Promise<ExamQuestion | undefined> {
    const [question] = await db.select().from(examQuestions).where(eq(examQuestions.id, id));
    return question || undefined;
  }

  async createExamQuestion(insertQuestion: InsertExamQuestion): Promise<ExamQuestion> {
    const [question] = await db
      .insert(examQuestions)
      .values(insertQuestion)
      .returning();
    return question;
  }

  // College methods
  async getColleges(filters?: { city?: string; type?: string; programs?: string }): Promise<College[]> {
    let query = db.select().from(colleges);
    const conditions = [];
    
    if (filters?.city && filters.city !== "All Cities") {
      conditions.push(eq(colleges.city, filters.city));
    }
    
    if (filters?.programs && filters.programs !== "All Programs") {
      // This would need a more complex JSON query for programs array
      // For now, we'll implement basic filtering
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return await query;
  }

  async getCollegeById(id: string): Promise<College | undefined> {
    const [college] = await db.select().from(colleges).where(eq(colleges.id, id));
    return college || undefined;
  }

  async createCollege(insertCollege: InsertCollege): Promise<College> {
    const [college] = await db
      .insert(colleges)
      .values(insertCollege)
      .returning();
    return college;
  }

  // Study Material methods
  async getStudyMaterials(category?: string): Promise<StudyMaterial[]> {
    let query = db.select().from(studyMaterials);
    
    if (category && category !== "All Materials") {
      query = query.where(eq(studyMaterials.category, category));
    }
    
    return await query.orderBy(desc(studyMaterials.updatedAt));
  }

  async getStudyMaterialById(id: string): Promise<StudyMaterial | undefined> {
    const [material] = await db.select().from(studyMaterials).where(eq(studyMaterials.id, id));
    return material || undefined;
  }

  async createStudyMaterial(insertMaterial: InsertStudyMaterial): Promise<StudyMaterial> {
    const [material] = await db
      .insert(studyMaterials)
      .values(insertMaterial)
      .returning();
    return material;
  }

  // News Article methods
  async getNewsArticles(limit?: number, featured?: boolean): Promise<NewsArticle[]> {
    let query = db.select().from(newsArticles);
    
    if (featured !== undefined) {
      query = query.where(eq(newsArticles.featured, featured));
    }
    
    query = query.orderBy(desc(newsArticles.publishedAt));
    
    if (limit) {
      query = query.limit(limit);
    }
    
    return await query;
  }

  async getNewsArticleById(id: string): Promise<NewsArticle | undefined> {
    const [article] = await db.select().from(newsArticles).where(eq(newsArticles.id, id));
    return article || undefined;
  }

  async createNewsArticle(insertArticle: InsertNewsArticle): Promise<NewsArticle> {
    const [article] = await db
      .insert(newsArticles)
      .values(insertArticle)
      .returning();
    return article;
  }

  // Practice Test methods
  async getPracticeTests(userId: string): Promise<PracticeTest[]> {
    return await db
      .select()
      .from(practiceTests)
      .where(eq(practiceTests.userId, userId))
      .orderBy(desc(practiceTests.completedAt));
  }

  async createPracticeTest(insertTest: InsertPracticeTest): Promise<PracticeTest> {
    const [test] = await db
      .insert(practiceTests)
      .values(insertTest)
      .returning();
    return test;
  }
}