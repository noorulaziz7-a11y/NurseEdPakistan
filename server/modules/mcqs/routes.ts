import { Router } from "express";
import multer from "multer";
import {
  dailyChallenge,
  dailyChallengeStats,
  createMcqHandler,
  updateMcqHandler,
  deleteMcqHandler,
  getByExamHandler,
  bulkUploadHandler,
  listMcqsHandler,
  getMcqHandler,
} from "./controller";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.get("/daily-challenge/:examType", dailyChallenge);
router.get("/daily-challenge/stats", dailyChallengeStats);

// MCQ management
router.post("/mcqs", createMcqHandler);
router.get("/mcqs", listMcqsHandler);
router.get("/mcqs/:id", getMcqHandler);
router.put("/mcqs/:id", updateMcqHandler);
router.delete("/mcqs/:id", deleteMcqHandler);
router.get("/mcqs/by-exam/:examId", getByExamHandler);
router.post("/mcqs/bulk-upload", upload.single("file"), bulkUploadHandler);

export default router;
