// src/lib/api/exams.ts
import { Exam } from "@/types/exam";

const API_BASE = "http://localhost:5000/api";

export async function getExams(): Promise<Exam[]> {
  const res = await fetch(`${API_BASE}/exams`);
  if (!res.ok) throw new Error("Failed to fetch exams");
  return res.json();
}
