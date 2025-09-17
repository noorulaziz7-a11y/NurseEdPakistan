// server/auth.ts
import bcrypt from "bcrypt";
import { storage } from "./storage";
import type { LoginUser, InsertUser, User } from "@shared/schema";

const SALT_ROUNDS = process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS, 10) : 10;

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    // keep bcrypt usage centralized so it's easy to swap to bcryptjs if needed
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  static async register(userData: InsertUser): Promise<User> {
    // Check if user already exists
    const existingUserByEmail = await storage.getUserByEmail(userData.email);
    if (existingUserByEmail) {
      throw new Error("User with this email already exists");
    }

    const existingUserByUsername = await storage.getUserByUsername(userData.username);
    if (existingUserByUsername) {
      throw new Error("Username is already taken");
    }

    // Hash password
    const hashedPassword = await this.hashPassword(userData.password);

    // Create user
    const newUser = await storage.createUser({
      ...userData,
      password: hashedPassword,
    });

    // Remove password from response
    // use object rest to exclude password safely
    // Note: ensure storage.createUser returns the password field; if it doesn't, this still works.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _pw, ...userWithoutPassword } = newUser as any;
    return userWithoutPassword as User;
  }

  static async login(loginData: LoginUser): Promise<User> {
    // Find use
