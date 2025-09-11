import bcrypt from "bcrypt";
import { storage } from "./storage";
import { type LoginUser, type InsertUser, type User } from "@shared/schema";

const SALT_ROUNDS = 10;

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, SALT_ROUNDS);
  }

  static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
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
      password: hashedPassword
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword as User;
  }

  static async login(loginData: LoginUser): Promise<User> {
    // Find user by email
    const user = await storage.getUserByEmail(loginData.email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Check password
    const isPasswordValid = await this.comparePassword(loginData.password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    // Update last login
    await storage.updateUserLastLogin(user.id);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  static async getCurrentUser(userId: string): Promise<User | null> {
    const user = await storage.getUser(userId);
    if (!user) {
      return null;
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }
}