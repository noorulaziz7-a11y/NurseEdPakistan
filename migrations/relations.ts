import { relations } from "drizzle-orm/relations";
import { users, ieltsModules, practiceTests, quizProgress, quizResults } from "./schema";

export const ieltsModulesRelations = relations(ieltsModules, ({one}) => ({
	user: one(users, {
		fields: [ieltsModules.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	ieltsModules: many(ieltsModules),
	practiceTests: many(practiceTests),
	quizProgresses: many(quizProgress),
	quizResults: many(quizResults),
}));

export const practiceTestsRelations = relations(practiceTests, ({one}) => ({
	user: one(users, {
		fields: [practiceTests.userId],
		references: [users.id]
	}),
}));

export const quizProgressRelations = relations(quizProgress, ({one}) => ({
	user: one(users, {
		fields: [quizProgress.userId],
		references: [users.id]
	}),
}));

export const quizResultsRelations = relations(quizResults, ({one}) => ({
	user: one(users, {
		fields: [quizResults.userId],
		references: [users.id]
	}),
}));