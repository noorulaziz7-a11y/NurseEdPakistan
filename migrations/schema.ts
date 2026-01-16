import { pgTable, foreignKey, varchar, text, integer, timestamp, jsonb, boolean, serial, unique } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const ieltsModules = pgTable("ielts_modules", {
	id: varchar().default(gen_random_uuid()).primaryKey().notNull(),
	userId: varchar("user_id"),
	moduleType: text("module_type").notNull(),
	totalQuestions: integer("total_questions").default(0),
	answeredQuestions: integer("answered_questions").default(0),
	correctAnswers: integer("correct_answers").default(0),
	averageScore: integer("average_score").default(0),
	lastPracticeAt: timestamp("last_practice_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "ielts_modules_user_id_users_id_fk"
		}),
]);

export const colleges = pgTable("colleges", {
	id: varchar().default(gen_random_uuid()).primaryKey().notNull(),
	name: text().notNull(),
	city: text().notNull(),
	type: text().notNull(),
	description: text(),
	programs: jsonb().notNull(),
	province: text().notNull(),
	admissionFee: integer("admission_fee"),
	rating: integer(),
	reviewCount: integer("review_count").default(0),
	contact: jsonb(),
	accreditation: jsonb(),
});

export const newsArticles = pgTable("news_articles", {
	id: varchar().default(gen_random_uuid()).primaryKey().notNull(),
	title: text().notNull(),
	featured: boolean().default(false),
	publishedAt: timestamp("published_at", { mode: 'string' }).defaultNow(),
	excerpt: text(),
	content: text().notNull(),
	category: text().notNull(),
	author: text().notNull(),
	authorTitle: text("author_title"),
	imageUrl: text("image_url"),
});

export const exams = pgTable("exams", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 100 }).notNull(),
	description: text(),
	badge: varchar({ length: 20 }),
	badgeColor: varchar("badge_color", { length: 50 }),
	progress: integer().default(0),
});

export const users = pgTable("users", {
	id: varchar().default(gen_random_uuid()).primaryKey().notNull(),
	email: text().notNull(),
	username: text().notNull(),
	password: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	lastLoginAt: timestamp("last_login_at", { mode: 'string' }),
	firstName: text("first_name").notNull(),
	lastName: text("last_name").notNull(),
	examProgress: jsonb("exam_progress").default({}),
}, (table) => [
	unique("users_email_unique").on(table.email),
	unique("users_username_unique").on(table.username),
]);

export const guestQuizSessions = pgTable("guest_quiz_sessions", {
	id: varchar().default(gen_random_uuid()).primaryKey().notNull(),
	sessionId: text("session_id").notNull(),
	quizCount: integer("quiz_count").default(0),
	lastQuizAt: timestamp("last_quiz_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const practiceTests = pgTable("practice_tests", {
	id: varchar().default(gen_random_uuid()).primaryKey().notNull(),
	userId: varchar("user_id"),
	score: integer(),
	completedAt: timestamp("completed_at", { mode: 'string' }),
	examType: text("exam_type").notNull(),
	questionsAnswered: integer("questions_answered").default(0),
	correctAnswers: integer("correct_answers").default(0),
	totalQuestions: integer("total_questions").default(50),
	timeSpent: integer("time_spent"),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "practice_tests_user_id_users_id_fk"
		}),
]);

export const examQuestions = pgTable("exam_questions", {
	id: varchar().default(gen_random_uuid()).primaryKey().notNull(),
	examType: text("exam_type").notNull(),
	options: jsonb().notNull(),
	question: text().notNull(),
	explanation: text().notNull(),
	difficulty: text().notNull(),
	category: text().notNull(),
	correctAnswer: text("correct_answer").notNull(),
});

export const quizProgress = pgTable("quiz_progress", {
	id: varchar().default(gen_random_uuid()).primaryKey().notNull(),
	userId: varchar("user_id"),
	examId: text("exam_id").notNull(),
	examType: text("exam_type").notNull(),
	moduleType: text("module_type"),
	currentQuestionIndex: integer("current_question_index").default(0),
	selectedAnswers: jsonb("selected_answers").default({}),
	timeSpent: integer("time_spent").default(0),
	startedAt: timestamp("started_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "quiz_progress_user_id_users_id_fk"
		}),
]);

export const quizResults = pgTable("quiz_results", {
	id: varchar().default(gen_random_uuid()).primaryKey().notNull(),
	userId: varchar("user_id"),
	examId: text("exam_id").notNull(),
	examType: text("exam_type").notNull(),
	moduleType: text("module_type"),
	totalQuestions: integer("total_questions").notNull(),
	correctAnswers: integer("correct_answers").notNull(),
	incorrectAnswers: integer("incorrect_answers").notNull(),
	score: integer().notNull(),
	timeSpent: integer("time_spent"),
	answers: jsonb().notNull(),
	subjects: jsonb(),
	difficulty: text(),
	completedAt: timestamp("completed_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "quiz_results_user_id_users_id_fk"
		}),
]);

export const studyLibrary = pgTable("study_library", {
	id: varchar().default(gen_random_uuid()).primaryKey().notNull(),
	title: text().notNull(),
	description: text(),
	category: text().notNull(),
	type: text().notNull(),
	level: text().notNull(),
	isPremium: boolean("is_premium").default(false),
	fileUrl: text("file_url"),
	pageCount: integer("page_count"),
	duration: text(),
	rating: integer(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const studyMaterials = pgTable("study_materials", {
	id: varchar().default(gen_random_uuid()).primaryKey().notNull(),
	title: text().notNull(),
	description: text(),
	category: text().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	type: text().notNull(),
	level: text().notNull(),
	isPremium: boolean("is_premium").default(false),
	fileUrl: text("file_url"),
	duration: text(),
	rating: integer(),
	examType: text("exam_type").notNull(),
});
