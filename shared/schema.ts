// shared/schema.ts
import { relations, sql } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  integer,
  jsonb,
  timestamp,
  boolean,
  serial,
  primaryKey,
  uniqueIndex,
  index,
  foreignKey,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const exams = pgTable("exams", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  category: text("category"),
  description: text("description"),
  durationMinutes: integer("duration_minutes"),
  scoringRules: jsonb("scoring_rules").default({}),
  accessLevel: text("access_level").default("free"),
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
  system: text("system"),
});

/* ---------------- MCQ SYSTEM ---------------- */
export const difficultyLevels = pgTable(
  "difficulty_levels",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
  },
  (table) => [uniqueIndex("difficulty_levels_name_unique").on(table.name)]
);

export const mcqDifficultyEnum = pgEnum("mcq_difficulty_enum", [
  "easy",
  "moderate",
  "hard",
]);

export const mcqSystemEnum = pgEnum("mcq_system_enum", [
  "Cardiovascular",
  "Respiratory",
  "Neurological",
  "Gastrointestinal",
  "Renal",
  "Endocrine",
  "Musculoskeletal",
  "Reproductive",
  "Hematology",
  "Immune",
  "Integumentary",
]);

export const mcqTypeEnum = pgEnum("mcq_type_enum", [
  "single",
  "multiple",
  "true_false",
]);

export const mcqRationaleTypeEnum = pgEnum("mcq_rationale_type_enum", [
  "detailed",
  "quick",
  "video",
]);

export const mcqs = pgTable("mcqs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  question: text("question").notNull(),
  explanation: text("explanation"),
  type: mcqTypeEnum("type").notNull().default("single"),
  imageUrl: text("image_url"),
  reference: text("reference"),
  year: integer("year"),
  rationaleType: mcqRationaleTypeEnum("rationale_type"),
  examId: integer("exam_id")
    .notNull()
    .references(() => exams.id, { onDelete: "cascade" }),
  subjectId: varchar("subject_id")
    .notNull()
    .references(() => examSubjects.id, { onDelete: "cascade" }),
  topicId: varchar("topic_id").references(() => examTopics.id, {
    onDelete: "set null",
  }),
  difficulty: mcqDifficultyEnum("difficulty").notNull(),
  system: mcqSystemEnum("system").notNull(),
  difficultyId: integer("difficulty_id").references(() => difficultyLevels.id),
  createdBy: varchar("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("mcqs_exam_id_idx").on(table.examId),
  index("mcqs_subject_id_idx").on(table.subjectId),
  index("mcqs_topic_id_idx").on(table.topicId),
  index("mcqs_difficulty_idx").on(table.difficulty),
  index("mcqs_system_idx").on(table.system),
]);

export const mcqOptions = pgTable("mcq_options", {
  id: serial("id").primaryKey(),
  mcqId: varchar("mcq_id").notNull().references(() => mcqs.id, { onDelete: "cascade" }),
  optionText: text("option_text").notNull(),
  isCorrect: boolean("is_correct").default(false),
  position: integer("position").default(0),
});

export const mcqTags = pgTable("mcq_tags", {
  id: serial("id").primaryKey(),
  mcqId: varchar("mcq_id").notNull().references(() => mcqs.id, { onDelete: "cascade" }),
  tag: text("tag").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const examMcqs = pgTable("exam_mcqs", {
  examId: integer("exam_id").notNull().references(() => exams.id, { onDelete: "cascade" }),
  mcqId: varchar("mcq_id").notNull().references(() => mcqs.id, { onDelete: "cascade" }),
  position: integer("position").default(0),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  primaryKey({ columns: [table.examId, table.mcqId] }),
]);

/* ---------------- EXAM ENGINE ---------------- */
export const examAttempts = pgTable("exam_attempts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  examId: integer("exam_id")
    .notNull()
    .references(() => exams.id, { onDelete: "cascade" }),
  userId: varchar("user_id").references(() => users.id, { onDelete: "set null" }),
  status: text("status").notNull().default("in_progress"),
  questionIds: jsonb("question_ids").notNull(),
  difficultyWeights: jsonb("difficulty_weights"),
  currentQuestionIndex: integer("current_question_index").default(0),
  timeLimitSeconds: integer("time_limit_seconds"),
  timeRemainingSeconds: integer("time_remaining_seconds"),
  startedAt: timestamp("started_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const attemptAnswers = pgTable(
  "attempt_answers",
  {
    attemptId: varchar("attempt_id")
      .notNull()
      .references(() => examAttempts.id, { onDelete: "cascade" }),
    mcqId: varchar("mcq_id")
      .notNull()
      .references(() => mcqs.id, { onDelete: "cascade" }),
    selectedOptionId: integer("selected_option_id").references(() => mcqOptions.id),
    selectedOptionIds: jsonb("selected_option_ids"),
    isCorrect: boolean("is_correct").default(false),
    answeredAt: timestamp("answered_at").defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.attemptId, table.mcqId] }),
  ]
);

export const examResults = pgTable("exam_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  attemptId: varchar("attempt_id")
    .notNull()
    .references(() => examAttempts.id, { onDelete: "cascade" }),
  examId: integer("exam_id")
    .notNull()
    .references(() => exams.id, { onDelete: "cascade" }),
  userId: varchar("user_id").references(() => users.id, { onDelete: "set null" }),
  totalQuestions: integer("total_questions").notNull(),
  correctAnswers: integer("correct_answers").notNull(),
  score: integer("score").notNull(),
  timeSpentSeconds: integer("time_spent_seconds"),
  createdAt: timestamp("created_at").defaultNow(),
});

/* ---------------- EXAM SUBJECTS ---------------- */
export const examSubjects = pgTable(
  "exam_subjects",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    examId: integer("exam_id")
      .notNull()
      .references(() => exams.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    sortOrder: integer("sort_order").default(0),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [
    index("exam_subjects_exam_id_idx").on(table.examId),
    index("exam_subjects_name_idx").on(table.name),
  ]
);

/* ---------------- EXAM STRUCTURE ---------------- */
export const examCategories = pgTable(
  "exam_categories",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    examId: integer("exam_id")
      .notNull()
      .references(() => exams.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    sortOrder: integer("sort_order").default(0),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [index("exam_categories_exam_id_idx").on(table.examId)]
);

export const examSections = pgTable(
  "exam_sections",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    examId: integer("exam_id")
      .notNull()
      .references(() => exams.id, { onDelete: "cascade" }),
    categoryId: varchar("category_id").references(() => examCategories.id, {
      onDelete: "set null",
    }),
    name: text("name").notNull(),
    description: text("description"),
    sortOrder: integer("sort_order").default(0),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [
    index("exam_sections_exam_id_idx").on(table.examId),
    index("exam_sections_category_id_idx").on(table.categoryId),
  ]
);

export const examTopics = pgTable(
  "exam_topics",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    examId: integer("exam_id")
      .notNull()
      .references(() => exams.id, { onDelete: "cascade" }),
    sectionId: varchar("section_id").references(() => examSections.id, {
      onDelete: "set null",
    }),
    subjectId: varchar("subject_id").references(() => examSubjects.id, {
      onDelete: "set null",
    }),
    parentTopicId: varchar("parent_topic_id"),
    title: text("title").notNull(),
    description: text("description"),
    weight: integer("weight").default(0),
    sortOrder: integer("sort_order").default(0),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [
    index("exam_topics_exam_id_idx").on(table.examId),
    index("exam_topics_section_id_idx").on(table.sectionId),
    index("exam_topics_subject_id_idx").on(table.subjectId),
    index("exam_topics_parent_topic_id_idx").on(table.parentTopicId),
    foreignKey({
      columns: [table.parentTopicId],
      foreignColumns: [table.id],
      name: "exam_topics_parent_topic_id_fk",
    }).onDelete("set null"),
  ]
);

/* ---------------- ANALYTICS ---------------- */
export const questionStatistics = pgTable(
  "question_statistics",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    mcqId: varchar("mcq_id")
      .notNull()
      .references(() => mcqs.id, { onDelete: "cascade" }),
    timesAttempted: integer("times_attempted").default(0),
    timesCorrect: integer("times_correct").default(0),
    avgTimeSeconds: integer("avg_time_seconds"),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    uniqueIndex("question_statistics_mcq_id_unique").on(table.mcqId),
  ]
);

export const userTopicMastery = pgTable(
  "user_topic_mastery",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    userId: varchar("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    topicId: varchar("topic_id")
      .notNull()
      .references(() => examTopics.id, { onDelete: "cascade" }),
    masteryScore: integer("mastery_score").default(0),
    attemptCount: integer("attempt_count").default(0),
    correctCount: integer("correct_count").default(0),
    lastPracticedAt: timestamp("last_practiced_at"),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    uniqueIndex("user_topic_mastery_user_topic_unique").on(
      table.userId,
      table.topicId
    ),
    index("user_topic_mastery_user_id_idx").on(table.userId),
    index("user_topic_mastery_topic_id_idx").on(table.topicId),
  ]
);

/* ---------------- MOCK TESTS ---------------- */
export const mockTests = pgTable(
  "mock_tests",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    examId: integer("exam_id")
      .notNull()
      .references(() => exams.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    totalQuestions: integer("total_questions").default(0),
    timeLimitSeconds: integer("time_limit_seconds"),
    createdBy: varchar("created_by").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [index("mock_tests_exam_id_idx").on(table.examId)]
);

export const mockTestAttempts = pgTable(
  "mock_test_attempts",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    mockTestId: varchar("mock_test_id")
      .notNull()
      .references(() => mockTests.id, { onDelete: "cascade" }),
    userId: varchar("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    status: text("status").notNull().default("in_progress"),
    score: integer("score"),
    questionIds: jsonb("question_ids"),
    answers: jsonb("answers"),
    startedAt: timestamp("started_at").defaultNow(),
    completedAt: timestamp("completed_at"),
  },
  (table) => [
    index("mock_test_attempts_mock_test_id_idx").on(table.mockTestId),
    index("mock_test_attempts_user_id_idx").on(table.userId),
  ]
);

/* ---------------- ADAPTIVE LEARNING ---------------- */
export const adaptiveSessions = pgTable(
  "adaptive_sessions",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    userId: varchar("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    examId: integer("exam_id")
      .notNull()
      .references(() => exams.id, { onDelete: "cascade" }),
    status: text("status").notNull().default("in_progress"),
    currentDifficultyId: integer("current_difficulty_id").references(
      () => difficultyLevels.id
    ),
    startedAt: timestamp("started_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    completedAt: timestamp("completed_at"),
  },
  (table) => [
    index("adaptive_sessions_user_id_idx").on(table.userId),
    index("adaptive_sessions_exam_id_idx").on(table.examId),
  ]
);

export const adaptiveQuestionLog = pgTable(
  "adaptive_question_log",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    sessionId: varchar("session_id")
      .notNull()
      .references(() => adaptiveSessions.id, { onDelete: "cascade" }),
    mcqId: varchar("mcq_id")
      .notNull()
      .references(() => mcqs.id, { onDelete: "cascade" }),
    selectedOptionId: integer("selected_option_id").references(
      () => mcqOptions.id
    ),
    isCorrect: boolean("is_correct").default(false),
    difficultyId: integer("difficulty_id").references(() => difficultyLevels.id),
    answeredAt: timestamp("answered_at").defaultNow(),
  },
  (table) => [
    index("adaptive_question_log_session_id_idx").on(table.sessionId),
    index("adaptive_question_log_mcq_id_idx").on(table.mcqId),
  ]
);

/* ---------------- USER TOOLS ---------------- */
export const bookmarks = pgTable(
  "bookmarks",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    userId: varchar("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    mcqId: varchar("mcq_id")
      .notNull()
      .references(() => mcqs.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [
    uniqueIndex("bookmarks_user_mcq_unique").on(table.userId, table.mcqId),
    index("bookmarks_user_id_idx").on(table.userId),
  ]
);

export const notes = pgTable(
  "notes",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    userId: varchar("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    mcqId: varchar("mcq_id")
      .notNull()
      .references(() => mcqs.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    index("notes_user_id_idx").on(table.userId),
    index("notes_mcq_id_idx").on(table.mcqId),
  ]
);

export const flaggedQuestions = pgTable(
  "flagged_questions",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    userId: varchar("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    mcqId: varchar("mcq_id")
      .notNull()
      .references(() => mcqs.id, { onDelete: "cascade" }),
    reason: text("reason"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [
    uniqueIndex("flagged_questions_user_mcq_unique").on(
      table.userId,
      table.mcqId
    ),
    index("flagged_questions_user_id_idx").on(table.userId),
  ]
);

/* ---------------- EXAM BLUEPRINTS ---------------- */
export const examBlueprints = pgTable(
  "exam_blueprints",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    examId: integer("exam_id")
      .notNull()
      .references(() => exams.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    totalQuestions: integer("total_questions").default(0),
    difficultyWeights: jsonb("difficulty_weights").default({}),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    index("exam_blueprints_exam_id_idx").on(table.examId),
    uniqueIndex("exam_blueprints_exam_name_unique").on(table.examId, table.name),
  ]
);

export const difficultyLevelRelations = relations(difficultyLevels, ({ many }) => ({
  mcqs: many(mcqs),
}));

export const mcqRelations = relations(mcqs, ({ one, many }) => ({
  difficulty: one(difficultyLevels, {
    fields: [mcqs.difficultyId],
    references: [difficultyLevels.id],
  }),
  exam: one(exams, {
    fields: [mcqs.examId],
    references: [exams.id],
  }),
  subject: one(examSubjects, {
    fields: [mcqs.subjectId],
    references: [examSubjects.id],
  }),
  topic: one(examTopics, {
    fields: [mcqs.topicId],
    references: [examTopics.id],
  }),
  creator: one(users, {
    fields: [mcqs.createdBy],
    references: [users.id],
  }),
  options: many(mcqOptions),
  tags: many(mcqTags),
  examLinks: many(examMcqs),
}));

export const mcqOptionRelations = relations(mcqOptions, ({ one }) => ({
  mcq: one(mcqs, { fields: [mcqOptions.mcqId], references: [mcqs.id] }),
}));

export const mcqTagRelations = relations(mcqTags, ({ one }) => ({
  mcq: one(mcqs, { fields: [mcqTags.mcqId], references: [mcqs.id] }),
}));

export const examMcqRelations = relations(examMcqs, ({ one }) => ({
  exam: one(exams, { fields: [examMcqs.examId], references: [exams.id] }),
  mcq: one(mcqs, { fields: [examMcqs.mcqId], references: [mcqs.id] }),
}));

export const examAttemptRelations = relations(examAttempts, ({ one, many }) => ({
  exam: one(exams, { fields: [examAttempts.examId], references: [exams.id] }),
  user: one(users, { fields: [examAttempts.userId], references: [users.id] }),
  answers: many(attemptAnswers),
  result: many(examResults),
}));

export const attemptAnswerRelations = relations(attemptAnswers, ({ one }) => ({
  attempt: one(examAttempts, {
    fields: [attemptAnswers.attemptId],
    references: [examAttempts.id],
  }),
  mcq: one(mcqs, { fields: [attemptAnswers.mcqId], references: [mcqs.id] }),
  option: one(mcqOptions, {
    fields: [attemptAnswers.selectedOptionId],
    references: [mcqOptions.id],
  }),
}));

export const examResultRelations = relations(examResults, ({ one }) => ({
  attempt: one(examAttempts, {
    fields: [examResults.attemptId],
    references: [examAttempts.id],
  }),
  exam: one(exams, { fields: [examResults.examId], references: [exams.id] }),
  user: one(users, { fields: [examResults.userId], references: [users.id] }),
}));


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
export const studyLibrary = pgTable("study_library", {
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

/* ---------------- BLOG POSTS ---------------- */
export const blogPosts = pgTable(
  "blog_posts",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    excerpt: text("excerpt"),
    content: text("content").notNull(),
    coverImageUrl: text("cover_image_url"),
    author: text("author"),
    authorTitle: text("author_title"),
    status: text("status").notNull().default("draft"),
    tags: jsonb("tags").default([]),
    publishedAt: timestamp("published_at"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [uniqueIndex("blog_posts_slug_unique").on(table.slug)]
);

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

/* ---------------- SUBSCRIPTIONS ---------------- */
export const plans = pgTable("plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  priceCents: integer("price_cents").notNull(),
  currency: text("currency").notNull().default("usd"),
  interval: text("interval").notNull().default("month"),
  stripeProductId: text("stripe_product_id"),
  stripePriceId: text("stripe_price_id"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const userSubscriptions = pgTable("user_subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id, { onDelete: "set null" }),
  planId: varchar("plan_id").references(() => plans.id, { onDelete: "set null" }),
  status: text("status").notNull().default("active"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  currentPeriodStart: timestamp("current_period_start"),
  currentPeriodEnd: timestamp("current_period_end"),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id, { onDelete: "set null" }),
  subscriptionId: varchar("subscription_id").references(() => userSubscriptions.id, {
    onDelete: "set null",
  }),
  planId: varchar("plan_id").references(() => plans.id, { onDelete: "set null" }),
  amountCents: integer("amount_cents").notNull(),
  currency: text("currency").notNull().default("usd"),
  status: text("status").notNull().default("pending"),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  stripeInvoiceId: text("stripe_invoice_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const refreshTokens = pgTable("refresh_tokens", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  revokedAt: timestamp("revoked_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const auditLogs = pgTable("audit_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id, { onDelete: "set null" }),
  action: text("action").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
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


export const insertStudyLibrarySchema = createInsertSchema(studyLibrary).omit({
  id: true,
  updatedAt: true,
});

export const insertNewsArticleSchema = createInsertSchema(newsArticles).omit({
  id: true,
  publishedAt: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPracticeTestSchema = createInsertSchema(practiceTests).omit({
  id: true,
  completedAt: true,
});

export const insertPlanSchema = createInsertSchema(plans).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserSubscriptionSchema = createInsertSchema(userSubscriptions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
});

export const insertRefreshTokenSchema = createInsertSchema(refreshTokens).omit({
  id: true,
  createdAt: true,
});

export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({
  id: true,
  createdAt: true,
});

export const insertExamAttemptSchema = createInsertSchema(examAttempts).omit({
  id: true,
  startedAt: true,
  updatedAt: true,
  completedAt: true,
});

export const insertAttemptAnswerSchema = createInsertSchema(attemptAnswers);

export const insertExamResultSchema = createInsertSchema(examResults).omit({
  id: true,
  createdAt: true,
});

export const insertDifficultyLevelSchema = createInsertSchema(difficultyLevels).omit({
  id: true,
});

export const insertMcqSchema = createInsertSchema(mcqs).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertMcqOptionSchema = createInsertSchema(mcqOptions).omit({
  id: true,
});

export const insertMcqTagSchema = createInsertSchema(mcqTags).omit({
  id: true,
  createdAt: true,
});

export const insertExamMcqSchema = createInsertSchema(examMcqs).omit({
  createdAt: true,
});

/* ---------------- TYPES ---------------- */
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;

export type ExamQuestion = typeof examQuestions.$inferSelect;
export type InsertExamQuestion = z.infer<typeof insertExamQuestionSchema>;

export type College = typeof colleges.$inferSelect;
export type InsertCollege = z.infer<typeof insertCollegeSchema>;

export type StudyMaterial = typeof studyLibrary.$inferSelect;
export type InsertStudyMaterial = z.infer<typeof insertStudyLibrarySchema>;

export type StudyLibrary = typeof studyLibrary.$inferSelect;
export type InsertStudyLibrary = z.infer<typeof insertStudyLibrarySchema>;

export type NewsArticle = typeof newsArticles.$inferSelect;
export type InsertNewsArticle = z.infer<typeof insertNewsArticleSchema>;

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;

export type PracticeTest = typeof practiceTests.$inferSelect;
export type InsertPracticeTest = z.infer<typeof insertPracticeTestSchema>;

export type Plan = typeof plans.$inferSelect;
export type InsertPlan = z.infer<typeof insertPlanSchema>;
export type UserSubscription = typeof userSubscriptions.$inferSelect;
export type InsertUserSubscription = z.infer<typeof insertUserSubscriptionSchema>;
export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;

export type RefreshToken = typeof refreshTokens.$inferSelect;
export type InsertRefreshToken = z.infer<typeof insertRefreshTokenSchema>;
export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;

export type ExamAttempt = typeof examAttempts.$inferSelect;
export type InsertExamAttempt = z.infer<typeof insertExamAttemptSchema>;
export type AttemptAnswer = typeof attemptAnswers.$inferSelect;
export type InsertAttemptAnswer = z.infer<typeof insertAttemptAnswerSchema>;
export type ExamResult = typeof examResults.$inferSelect;
export type InsertExamResult = z.infer<typeof insertExamResultSchema>;

export type DifficultyLevel = typeof difficultyLevels.$inferSelect;
export type InsertDifficultyLevel = z.infer<typeof insertDifficultyLevelSchema>;
export type Mcq = typeof mcqs.$inferSelect;
export type InsertMcq = z.infer<typeof insertMcqSchema>;
export type McqOption = typeof mcqOptions.$inferSelect;
export type InsertMcqOption = z.infer<typeof insertMcqOptionSchema>;
export type McqTag = typeof mcqTags.$inferSelect;
export type InsertMcqTag = z.infer<typeof insertMcqTagSchema>;
export type ExamMcq = typeof examMcqs.$inferSelect;
export type InsertExamMcq = z.infer<typeof insertExamMcqSchema>;

export type QuizResult = typeof quizResults.$inferSelect;
export type QuizProgress = typeof quizProgress.$inferSelect;
export type IELTSModule = typeof ieltsModules.$inferSelect;
export type GuestQuizSession = typeof guestQuizSessions.$inferSelect;

export type ExamSubject = typeof examSubjects.$inferSelect;
export type ExamCategory = typeof examCategories.$inferSelect;
export type ExamSection = typeof examSections.$inferSelect;
export type ExamTopic = typeof examTopics.$inferSelect;
export type QuestionStatistic = typeof questionStatistics.$inferSelect;
export type UserTopicMastery = typeof userTopicMastery.$inferSelect;
export type MockTest = typeof mockTests.$inferSelect;
export type MockTestAttempt = typeof mockTestAttempts.$inferSelect;
export type AdaptiveSession = typeof adaptiveSessions.$inferSelect;
export type AdaptiveQuestionLog = typeof adaptiveQuestionLog.$inferSelect;
export type Bookmark = typeof bookmarks.$inferSelect;
export type Note = typeof notes.$inferSelect;
export type FlaggedQuestion = typeof flaggedQuestions.$inferSelect;
export type ExamBlueprint = typeof examBlueprints.$inferSelect;
