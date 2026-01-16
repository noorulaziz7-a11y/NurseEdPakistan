import { z } from "zod";

// Browser-safe Zod schemas (no drizzle dependencies)
export const insertUserSchema = z.object({
  username: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// Lightweight TypeScript types for client usage
export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface College {
  id: string;
  name: string;
  city: string;
  province: string;
  type: string;
  programs: Record<string, unknown>;
  admissionFee?: number | null;
  rating?: number | null;
  reviewCount?: number | null;
  description?: string | null;
  contact?: Record<string, unknown> | null;
  accreditation?: Record<string, unknown> | null;
}

export interface StudyLibrary {
  id: string;
  title: string;
  description?: string | null;
  category: string;
  type: string;
  level: string;
  isPremium?: boolean;
  fileUrl?: string | null;
  duration?: string | null;
  rating?: number | null;
  updatedAt?: string | null;
}

export interface NewsArticle {
  id: string;
  title: string;
  excerpt?: string | null;
  content: string;
  category: string;
  author: string;
  authorTitle?: string | null;
  imageUrl?: string | null;
  publishedAt?: string | null;
  featured?: boolean;
}

export interface ExamQuestion {
  id: string;
  examType: string;
  question: string;
  options: Record<string, unknown>;
  correctAnswer: string;
  explanation: string;
  difficulty: string;
  category: string;
}


