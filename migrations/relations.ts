import { relations } from "drizzle-orm/relations";
import { users, practiceTests } from "./schema";

export const practiceTestsRelations = relations(practiceTests, ({one}) => ({
	user: one(users, {
		fields: [practiceTests.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	practiceTests: many(practiceTests),
}));