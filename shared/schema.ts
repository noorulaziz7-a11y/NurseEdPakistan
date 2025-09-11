import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, jsonb, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  examProgress: jsonb("exam_progress").default({}),
});

export const examQuestions = pgTable("exam_questions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  examType: text("exam_type").notNull(), // NCLEX-RN, MOH, SNLE
  question: text("question").notNull(),
  options: jsonb("options").notNull(), // array of options
  correctAnswer: text("correct_answer").notNull(),
  explanation: text("explanation").notNull(),
  difficulty: text("difficulty").notNull(), // beginner, intermediate, advanced
  category: text("category").notNull(),
});

export const colleges = pgTable("colleges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  city: text("city").notNull(),
  province: text("province").notNull(),
  type: text("type").notNull(), // private, government
  programs: jsonb("programs").notNull(), // array of program types
  admissionFee: integer("admission_fee"),
  rating: integer("rating"), // 1-5 stars
  reviewCount: integer("review_count").default(0),
  description: text("description"),
  contact: jsonb("contact"), // phone, email, website
  accreditation: jsonb("accreditation"), // array of accreditations
});

export const studyMaterials = pgTable("study_materials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  type: text("type").notNull(), // PDF, EPUB, Video
  level: text("level").notNull(), // beginner, intermediate, advanced
  isPremium: boolean("is_premium").default(false),
  fileUrl: text("file_url"),
  pageCount: integer("page_count"),
  duration: text("duration"), // for videos
  rating: integer("rating"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const newsArticles = pgTable("news_articles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  category: text("category").notNull(),
  author: text("author").notNull(),
  authorTitle: text("author_title"),
  imageUrl: text("image_url"),
  publishedAt: timestamp("published_at").defaultNow(),
  featured: boolean("featured").default(false),
});

export const practiceTests = pgTable("practice_tests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  examType: text("exam_type").notNull(),
  questionsAnswered: integer("questions_answered").default(0),
  correctAnswers: integer("correct_answers").default(0),
  totalQuestions: integer("total_questions").default(50),
  timeSpent: integer("time_spent"), // in minutes
  completedAt: timestamp("completed_at"),
  score: integer("score"), // percentage
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertExamQuestionSchema = createInsertSchema(examQuestions).omit({
  id: true,
});

export const insertCollegeSchema = createInsertSchema(colleges).omit({
  id: true,
});

export const insertStudyMaterialSchema = createInsertSchema(studyMaterials).omit({
  id: true,
  updatedAt: true,
});

export const insertNewsArticleSchema = createInsertSchema(newsArticles).omit({
  id: true,
  publishedAt: true,
});

export const insertPracticeTestSchema = createInsertSchema(practiceTests).omit({
  id: true,
  completedAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type ExamQuestion = typeof examQuestions.$inferSelect;
export type InsertExamQuestion = z.infer<typeof insertExamQuestionSchema>;
export type College = typeof colleges.$inferSelect;
export type InsertCollege = z.infer<typeof insertCollegeSchema>;
export type StudyMaterial = typeof studyMaterials.$inferSelect;
export type InsertStudyMaterial = z.infer<typeof insertStudyMaterialSchema>;
export type NewsArticle = typeof newsArticles.$inferSelect;
export type InsertNewsArticle = z.infer<typeof insertNewsArticleSchema>;
export type PracticeTest = typeof practiceTests.$inferSelect;
export type InsertPracticeTest = z.infer<typeof insertPracticeTestSchema>;
