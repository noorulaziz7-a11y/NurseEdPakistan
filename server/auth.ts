// server/auth.ts
import bcrypt from "bcrypt";
import { storage } from "./storage";
import type { LoginUser, InsertUser, User } from "@shared/schema";

const SALT_ROUNDS = process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS, 10) : 10;

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  static async register(userData: InsertUser): Promise<User> {
    const existingUserByEmail = await storage.getUserByEmail(userData.email);
    if (existingUserByEmail) {
      throw new Error("User with this email already exists");
    }

    const existingUserByUsername = await storage.getUserByUsername(userData.username);
    if (existingUserByUsername) {
      throw new Error("Username is already taken");
    }

    const hashedPassword = await this.hashPassword(userData.password);

    const newUser = await storage.createUser({
      ...userData,
      password: hashedPassword,
    });

    // Remove password from response
    const { password: _pw, ...userWithoutPassword } = newUser as User;
    return userWithoutPassword as User;
  }

  static async login(loginData: LoginUser): Promise<User> {
    let user = await storage.getUserByEmail(loginData.email);
    if (!user && "username" in loginData && loginData.username) {
      user = await storage.getUserByUsername(loginData.username);
    }
    if (!user) {
      throw new Error("Invalid credentials");
    }
    // Now TypeScript knows user is a User
    const { password: _pw, ...userWithoutPassword } = user;

    return userWithoutPassword as User;
  }

  static async getCurrentUser(userId: number): Promise<User | null> {
    const user = await storage.getUserById(userId);
    if (!user) {
      return null;
    }
    const { password: _pw, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }
}
