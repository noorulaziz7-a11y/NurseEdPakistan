import { pgTable, serial, text, integer, timestamp, jsonb, varchar, boolean } from "drizzle-orm/pg-core";

/* 🧱 Exams table */
export const exams = pgTable("exams", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  badge: text("badge"),
  badgeColor: text("badge_color"),
  progress: integer("progress").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

/* 🏫 Colleges table */
export const colleges = pgTable("colleges", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  country: text("country").notNull(),
  city: text("city"),
  website: text("website"),
  createdAt: timestamp("created_at").defaultNow(),
});

/* 📚 Study Materials table */
export const studyMaterials = pgTable("study_materials", {
  id: varchar("id").primaryKey().default("gen_random_uuid()"),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  level: text("level"),
  type: text("type"), // e.g., 'video', 'article', 'pdf'
  duration: integer("duration"), // in minutes
  rating: integer("rating"),
  isPremium: boolean("is_premium").default(false),
  fileUrl: text("file_url"),
  examType: text("exam_type"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

/* 🧠 Exam Questions table (matches your Neon DB) */
export const examQuestions = pgTable("exam_questions", {
  id: varchar("id").primaryKey().default("gen_random_uuid()"),
  examType: text("exam_type").notNull(),
  question: text("question").notNull(),
  options: jsonb("options").notNull(),          // JSON array of options
  correctAnswer: text("correct_answer").notNull(),
  explanation: text("explanation").notNull(),
  difficulty: text("difficulty").notNull(),
  category: text("category").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
