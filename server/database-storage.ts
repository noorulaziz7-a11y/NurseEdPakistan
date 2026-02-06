import {
  users,
  exams,
  examQuestions,
  colleges,
  studyLibrary,
  newsArticles,
  blogPosts,
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
  type BlogPost,
  type InsertBlogPost,
  type PracticeTest,
  type InsertPracticeTest,
} from "@shared/schema";
import { db } from "./db";
import { eq, like, and, desc } from "drizzle-orm";

export class DatabaseStorage {
  // ---------------- EXAMS ----------------
  async getAllExams(): Promise<any[]> {
    return await db.select().from(exams);
  }

  private examQuestionSelect = {
    id: examQuestions.id,
    examType: examQuestions.examType,
    question: examQuestions.question,
    options: examQuestions.options,
    correctAnswer: examQuestions.correctAnswer,
    explanation: examQuestions.explanation,
    difficulty: examQuestions.difficulty,
    category: examQuestions.category,
  };

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
  async getExamQuestions(
    examType: string,
    filters?: { subject?: string; system?: string; difficulty?: string; limit?: number }
  ): Promise<ExamQuestion[]> {
    const conditions = [eq(examQuestions.examType, examType)];

    if (filters?.subject) {
      conditions.push(eq(examQuestions.category, filters.subject));
    }

    if (filters?.difficulty) {
      conditions.push(eq(examQuestions.difficulty, filters.difficulty));
    }

    let query: any =
      conditions.length === 1
        ? db.select(this.examQuestionSelect).from(examQuestions).where(conditions[0])
        : db.select(this.examQuestionSelect).from(examQuestions).where(and(...conditions));

    if (filters?.limit && filters.limit > 0) {
      query = query.limit(filters.limit);
    }

    return await query;
  }

  async getExamQuestionById(id: string): Promise<ExamQuestion | undefined> {
    const [question] = await db
      .select(this.examQuestionSelect)
      .from(examQuestions)
      .where(eq(examQuestions.id, id));
    return question;
  }

  async createExamQuestion(insertQuestion: InsertExamQuestion): Promise<ExamQuestion> {
    const { system, ...safeInsert } = insertQuestion as InsertExamQuestion & { system?: unknown };
    const [question] = await db.insert(examQuestions).values(safeInsert).returning();
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

  // ---------------- STUDY LIBRARY ----------------
  async getStudyLibraries(category?: string): Promise<StudyMaterial[]> {
    let query: any = db.select().from(studyLibrary);

    if (category && category !== "All Materials" && category !== "All Libraries") {
      query = query.where(eq(studyLibrary.category, category));
    }

    query = query.orderBy(desc(studyLibrary.updatedAt));

    return await query;
  }

  async getStudyLibraryById(id: string): Promise<StudyMaterial | undefined> {
    const [material] = await db.select().from(studyLibrary).where(eq(studyLibrary.id, id));
    return material;
  }

  async createStudyLibrary(insertMaterial: InsertStudyMaterial): Promise<StudyMaterial> {
    const [material] = await db.insert(studyLibrary).values(insertMaterial).returning();
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

  // ---------------- BLOG POSTS ----------------
  async getBlogPosts(filters?: { status?: string; limit?: number }): Promise<BlogPost[]> {
    let query: any = db.select().from(blogPosts);
    if (filters?.status) {
      query = query.where(eq(blogPosts.status, filters.status));
    }
    if (filters?.limit && filters.limit > 0) {
      query = query.limit(filters.limit);
    }
    query = query.orderBy(desc(blogPosts.publishedAt), desc(blogPosts.updatedAt));
    return await query;
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post;
  }

  async getBlogPostById(id: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post;
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const [post] = await db.insert(blogPosts).values(insertPost).returning();
    return post;
  }

  async updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const [updated] = await db.update(blogPosts).set(post).where(eq(blogPosts.id, id)).returning();
    return updated;
  }

  async deleteBlogPost(id: string): Promise<boolean> {
    const [deleted] = await db.delete(blogPosts).where(eq(blogPosts.id, id)).returning();
    return Boolean(deleted);
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
