import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

// 🧱 Exams table
export const exams = pgTable("exams", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  badge: text("badge"),
  badgeColor: text("badge_color"),
  progress: integer("progress").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// 🏫 Colleges table
export const colleges = pgTable("colleges", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  country: text("country").notNull(),
  city: text("city"),
  website: text("website"),
  createdAt: timestamp("created_at").defaultNow(),
});

// 🧠 MCQs table
export const mcqs = pgTable("mcqs", {
  id: serial("id").primaryKey(),
  examId: integer("exam_id").references(() => exams.id),
  question: text("question").notNull(),
  optionA: text("option_a").notNull(),
  optionB: text("option_b").notNull(),
  optionC: text("option_c").notNull(),
  optionD: text("option_d").notNull(),
  correctAnswer: text("correct_answer").notNull(),
});
