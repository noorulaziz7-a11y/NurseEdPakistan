// server/exam.ts
import { Router, type Request, type Response } from "express";
import { studyMaterials } from "@shared/schema";

export const examRouter = Router();

// ✅ Get all available exams (for exam-prep cards)
examRouter.get("/", async (_req: Request, res: Response) => {
  try {
    // Normally you'd fetch from DB — for now return static demo data:
    const exams = [
      { id: "nclex", name: "NCLEX-RN", badge: "Popular", badgeColor: "bg-blue-100 text-blue-700" },
      { id: "snle", name: "SNLE", badge: "KSA", badgeColor: "bg-green-100 text-green-700" },
      { id: "moh", name: "MOH", badge: "UAE", badgeColor: "bg-yellow-100 text-yellow-700" },
      { id: "dha", name: "DHA", badge: "Dubai", badgeColor: "bg-red-100 text-red-700" },
      { id: "haad", name: "HAAD", badge: "Abu Dhabi", badgeColor: "bg-purple-100 text-purple-700" },
      { id: "ielts", name: "IELTS", badge: "Language", badgeColor: "bg-pink-100 text-pink-700" },
    ];
    res.json(exams);
  } catch (err) {
    console.error("Error fetching exams:", err);
    res.status(500).json({ message: "Failed to load exams" });
  }
});

// ✅ Optional: fetch study materials by exam type
examRouter.get("/:examType/materials", async (req: Request, res: Response) => {
  const { examType } = req.params;
  try {
    const materials = await db
      .select()
      .from(studyMaterials)
      .where(studyMaterials.examType.eq(examType));
    res.json(materials);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load study materials" });
  }
});
