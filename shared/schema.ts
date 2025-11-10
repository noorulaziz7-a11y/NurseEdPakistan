// shared/schema.ts
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, jsonb, timestamp, boolean, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const exams = pgTable("exams", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  badge: varchar("badge", { length: 20 }),
  badgeColor: varchar("badge_color", { length: 50 }),
  progress: integer("progress").default(0),
});

/* ---------------- USERS TABLE ---------------- */
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  examProgress: jsonb("exam_progress").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  lastLoginAt: timestamp("last_login_at"),
});

/* ---------------- EXAM QUESTIONS ---------------- */
export const examQuestions = pgTable("exam_questions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  examType: text("exam_type").notNull(), // NCLEX-RN, MOH, SNLE
  question: text("question").notNull(),
  options: jsonb("options").notNull(),
  correctAnswer: text("correct_answer").notNull(),
  explanation: text("explanation").notNull(),
  difficulty: text("difficulty").notNull(), // beginner, intermediate, advanced
  category: text("category").notNull(),
});

/* ---------------- COLLEGES ---------------- */
export const colleges = pgTable("colleges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  city: text("city").notNull(),
  province: text("province").notNull(),
  type: text("type").notNull(),
  programs: jsonb("programs").notNull(),
  admissionFee: integer("admission_fee"),
  rating: integer("rating"),
  reviewCount: integer("review_count").default(0),
  description: text("description"),
  contact: jsonb("contact"),
  accreditation: jsonb("accreditation"),
});

/* ---------------- STUDY MATERIALS (exam-prep) ---------------- */
export const studyMaterials = pgTable("study_materials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  examType: text("exam_type").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  type: text("type").notNull(), // pdf, video, notes
  level: text("level").notNull(),
  isPremium: boolean("is_premium").default(false),
  fileUrl: text("file_url"),
  duration: text("duration"),
  rating: integer("rating"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

/* ---------------- STUDY LIBRARY (separate page) ---------------- */
export const studyLibrary = pgTable("study_library", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  type: text("type").notNull(),
  level: text("level").notNull(),
  isPremium: boolean("is_premium").default(false),
  fileUrl: text("file_url"),
  pageCount: integer("page_count"),
  duration: text("duration"),
  rating: integer("rating"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

/* ---------------- NEWS ARTICLES ---------------- */
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

/* ---------------- PRACTICE TESTS ---------------- */
export const practiceTests = pgTable("practice_tests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  examType: text("exam_type").notNull(),
  questionsAnswered: integer("questions_answered").default(0),
  correctAnswers: integer("correct_answers").default(0),
  totalQuestions: integer("total_questions").default(50),
  timeSpent: integer("time_spent"),
  completedAt: timestamp("completed_at"),
  score: integer("score"),
});

/* ---------------- QUIZ RESULTS ---------------- */
export const quizResults = pgTable("quiz_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  examId: text("exam_id").notNull(),
  examType: text("exam_type").notNull(),
  moduleType: text("module_type"), // For IELTS: listening, reading, writing, speaking
  totalQuestions: integer("total_questions").notNull(),
  correctAnswers: integer("correct_answers").notNull(),
  incorrectAnswers: integer("incorrect_answers").notNull(),
  score: integer("score").notNull(), // Percentage
  timeSpent: integer("time_spent"), // Seconds
  answers: jsonb("answers").notNull(), // Array of { questionId, selectedAnswer, correct }
  subjects: jsonb("subjects"), // Subject-wise performance
  difficulty: text("difficulty"), // easy, medium, hard
  completedAt: timestamp("completed_at").defaultNow(),
});

/* ---------------- QUIZ PROGRESS ---------------- */
export const quizProgress = pgTable("quiz_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  examId: text("exam_id").notNull(),
  examType: text("exam_type").notNull(),
  moduleType: text("module_type"), // For IELTS
  currentQuestionIndex: integer("current_question_index").default(0),
  selectedAnswers: jsonb("selected_answers").default({}),
  timeSpent: integer("time_spent").default(0),
  startedAt: timestamp("started_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

/* ---------------- IELTS MODULES ---------------- */
export const ieltsModules = pgTable("ielts_modules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  moduleType: text("module_type").notNull(), // listening, reading, writing, speaking
  totalQuestions: integer("total_questions").default(0),
  answeredQuestions: integer("answered_questions").default(0),
  correctAnswers: integer("correct_answers").default(0),
  averageScore: integer("average_score").default(0),
  lastPracticeAt: timestamp("last_practice_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

/* ---------------- GUEST QUIZ TRACKING (localStorage fallback) ---------------- */
// This is handled client-side, but we can track server-side too
export const guestQuizSessions = pgTable("guest_quiz_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: text("session_id").notNull(), // Client-generated session ID
  quizCount: integer("quiz_count").default(0),
  lastQuizAt: timestamp("last_quiz_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

/* ---------------- ZOD SCHEMAS (frontend + backend shared) ---------------- */
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  lastLoginAt: true,
  examProgress: true,
}).extend({
  email: z.string().email(),
  password: z.string().min(6),
});

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
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

export const insertStudyLibrarySchema = createInsertSchema(studyLibrary).omit({
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

/* ---------------- TYPES ---------------- */
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;

export type ExamQuestion = typeof examQuestions.$inferSelect;
export type InsertExamQuestion = z.infer<typeof insertExamQuestionSchema>;

export type College = typeof colleges.$inferSelect;
export type InsertCollege = z.infer<typeof insertCollegeSchema>;

export type StudyMaterial = typeof studyMaterials.$inferSelect;
export type InsertStudyMaterial = z.infer<typeof insertStudyMaterialSchema>;

export type StudyLibrary = typeof studyLibrary.$inferSelect;
export type InsertStudyLibrary = z.infer<typeof insertStudyLibrarySchema>;

export type NewsArticle = typeof newsArticles.$inferSelect;
export type InsertNewsArticle = z.infer<typeof insertNewsArticleSchema>;

export type PracticeTest = typeof practiceTests.$inferSelect;
export type InsertPracticeTest = z.infer<typeof insertPracticeTestSchema>;

export type QuizResult = typeof quizResults.$inferSelect;
export type QuizProgress = typeof quizProgress.$inferSelect;
export type IELTSModule = typeof ieltsModules.$inferSelect;
export type GuestQuizSession = typeof guestQuizSessions.$inferSelect;
