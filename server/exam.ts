// server/exam.ts
import type { Request, Response } from "express";

export async function getExams(req: Request, res: Response) {
  try {
    // ✅ Always return static sample data for now
    const exams = [
      { id: 1, name: "NCLEX-RN", description: "U.S. licensing exam", badge: "RN", badgeColor: "bg-blue-500", progress: 45 },
      { id: 2, name: "MOH", description: "Ministry of Health Exam (UAE)", badge: "MOH", badgeColor: "bg-green-500", progress: 23 },
      { id: 3, name: "SNLE", description: "Saudi Nursing Licensing Exam", badge: "SNLE", badgeColor: "bg-yellow-500", progress: 78 },
      { id: 4, name: "DHA", description: "Dubai Health Authority", badge: "DHA", badgeColor: "bg-purple-500", progress: 0 },
      { id: 5, name: "HAAD", description: "Abu Dhabi Health Exam", badge: "HAAD", badgeColor: "bg-red-500", progress: 0 },
      { id: 6, name: "IELTS", description: "International English Exam", badge: "IELTS", badgeColor: "bg-orange-500", progress: 0 },
    ];

    res.json(exams);
  } catch (error) {
    console.error("❌ Failed to load exams:", error);
    res.status(500).json({ message: "Failed to fetch exams" });
  }
}
