// server/auth.ts
import bcrypt from "bcryptjs";
import { storage } from "./storage";
import { insertUserSchema, loginUserSchema } from "@shared/schema";
import type { User } from "@shared/schema";

export const AuthService = {
  async register(data: unknown): Promise<User> {
    const parsed = insertUserSchema.parse(data);
    const hashedPassword = await bcrypt.hash(parsed.password, 10);

    const userToInsert = {
      ...parsed,
      password: hashedPassword,
    };

    const user = await storage.createUser(userToInsert);
    return user;
  },

  async login(data: unknown): Promise<User | null> {
    const parsed = loginUserSchema.parse(data);

    const user = await storage.getUserByEmail(parsed.email);
    if (!user) return null;

    const passwordMatch = await bcrypt.compare(parsed.password, user.password);
    if (!passwordMatch) return null;

    await storage.updateUserLastLogin(user.id);
    return user;
  },

  async getCurrentUser(userId: string): Promise<User | null> {
    const user = await storage.getUser(userId);
    return user || null;
  },
};
