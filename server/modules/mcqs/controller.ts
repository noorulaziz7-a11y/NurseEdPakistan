import type { Request, Response } from "express";
import {
  getExamQuestionsWithFallback,
  getExamQuestionsLegacy,
  getExamQuestionById,
  getDailyChallenge,
  getDailyChallengeStats,
  createMCQ,
  updateMCQ,
  deleteMCQ,
  getByExam,
  bulkUploadCsvFile,
  getMcqById,
  listMcqs,
} from "./service";
import { createMcqSchema, listMcqQuerySchema, updateMcqSchema } from "./schema";
import { z } from "zod";

export async function listExamQuestions(req: Request, res: Response) {
  try {
    const raw = req.query || {};
    const subject = raw.category?.toString() || raw.subject?.toString();
    const system = raw.system?.toString();
    const difficulty = raw.difficulty?.toString();
    const limit = raw.limit ? parseInt(raw.limit.toString()) : undefined;

    const paramValue =
      (req.params as any).examType || (req.params as any).examId;

    if (!paramValue) {
      return res
        .status(400)
        .json({ message: "Exam identifier missing in URL" });
    }

    const questions = await getExamQuestionsWithFallback(paramValue, {
      subject,
      system,
      difficulty,
      limit,
    });

    res.json(questions);
  } catch (error) {
    console.error("Failed to fetch exam questions:", error);
    res.status(500).json({ message: "Server error", error });
  }
}

export async function listLegacyExamQuestions(req: Request, res: Response) {
  try {
    const questions = await getExamQuestionsLegacy(req.params.examType);
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

export async function getQuestion(req: Request, res: Response) {
  try {
    const question = await getExamQuestionById(req.params.id);
    if (!question)
      return res.status(404).json({ message: "Question not found" });
    res.json(question);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

export async function dailyChallenge(req: Request, res: Response) {
  try {
    const question = await getDailyChallenge(req.params.examType);
    if (!question)
      return res.status(404).json({ message: "No questions found" });
    res.json(question);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

export async function dailyChallengeStats(_req: Request, res: Response) {
  res.json(getDailyChallengeStats());
}

export async function createMcqHandler(req: Request, res: Response) {
  try {
    const payload = createMcqSchema.parse(req.body);
    const mcq = await createMCQ(payload);
    res.status(201).json(mcq);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error", error });
  }
}

export async function updateMcqHandler(req: Request, res: Response) {
  try {
    const payload = updateMcqSchema.parse(req.body);
    const mcq = await updateMCQ(req.params.id, payload);
    if (!mcq) return res.status(404).json({ message: "MCQ not found" });
    res.json(mcq);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error", error });
  }
}

export async function deleteMcqHandler(req: Request, res: Response) {
  try {
    const deleted = await deleteMCQ(req.params.id);
    if (!deleted) return res.status(404).json({ message: "MCQ not found" });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

export async function getByExamHandler(req: Request, res: Response) {
  try {
    const examId = Number(req.params.examId);
    if (Number.isNaN(examId)) {
      return res.status(400).json({ message: "Invalid exam ID" });
    }
    const mcqs = await getByExam(examId);
    res.json(mcqs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

export async function bulkUploadHandler(req: Request, res: Response) {
  try {
    const file = (req as any).file as
      | { buffer?: Buffer }
      | undefined;
    const csv =
      file?.buffer?.toString("utf8") ||
      (typeof req.body?.csv === "string" ? req.body.csv : null);
    if (!csv) {
      return res.status(400).json({ message: "CSV file is required" });
    }
    const result = await bulkUploadCsvFile(csv);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

export async function listMcqsHandler(req: Request, res: Response) {
  try {
    const query = listMcqQuerySchema.parse(req.query);
    const result = await listMcqs(query);
    res.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error", error });
  }
}

export async function getMcqHandler(req: Request, res: Response) {
  try {
    const mcq = await getMcqById(req.params.id);
    if (!mcq) return res.status(404).json({ message: "MCQ not found" });
    res.json(mcq);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}
