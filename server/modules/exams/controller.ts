import type { Request, Response } from "express";
import {
  getAllExams,
  getExamById,
  createExam,
  updateExam,
  deleteExam,
  createExamSubject,
  updateExamSubject,
  deleteExamSubject,
  listExamSubjects,
  createExamTopic,
  updateExamTopic,
  deleteExamTopic,
  listExamTopics,
  getLeaderboard,
  getIeltsProgress,
  assignMcqToExam,
  removeMcqFromExam,
  listExamMcqs,
  startExamAttempt,
  createAttemptFromQuestions,
  getAttemptResume,
  createAttempt,
  getAttempt,
  saveAnswer,
  saveAttemptProgress,
  submitAttempt,
  calculateResultSummary,
  getAdaptiveNextQuestion,
} from "./service";
import { z } from "zod";
import {
  createExamSchema,
  updateExamSchema,
  createExamSubjectSchema,
  updateExamSubjectSchema,
  listExamSubjectQuerySchema,
  createExamTopicSchema,
  updateExamTopicSchema,
  listExamTopicQuerySchema,
  createAttemptFromQuestionsSchema,
  saveAttemptProgressSchema,
} from "./schema";

export async function getAdaptiveNextQuestionHandler(req: Request, res: Response) {
  try {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const payload = z.object({
      examId: z.number(),
      currentDifficultyId: z.number(),
      excludeMcqIds: z.array(z.string()).default([]),
    }).parse(req.body);

    const question = await getAdaptiveNextQuestion({
      userId,
      examId: payload.examId,
      currentDifficultyId: payload.currentDifficultyId,
      excludeMcqIds: payload.excludeMcqIds,
    });

    if (!question) {
      return res.status(404).json({ message: "No more questions available" });
    }

    res.json(question);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error", error });
  }
}

export async function listExams(_req: Request, res: Response) {
  try {
    const exams = await getAllExams();
    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

export async function getExam(req: Request, res: Response) {
  try {
    const exam = await getExamById(req.params.id);
    if (!exam) return res.status(404).json({ message: "Exam not found" });
    res.json(exam);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

export async function createExamHandler(req: Request, res: Response) {
  try {
    const payload = createExamSchema.parse(req.body);
    const exam = await createExam(payload);
    res.status(201).json(exam);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error", error });
  }
}

export async function updateExamHandler(req: Request, res: Response) {
  try {
    const examId = Number(req.params.id);
    if (Number.isNaN(examId)) {
      return res.status(400).json({ message: "Invalid exam ID" });
    }
    const payload = updateExamSchema.parse(req.body);
    const exam = await updateExam(examId, payload);
    if (!exam) return res.status(404).json({ message: "Exam not found" });
    res.json(exam);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error", error });
  }
}

export async function deleteExamHandler(req: Request, res: Response) {
  try {
    const examId = Number(req.params.id);
    if (Number.isNaN(examId)) {
      return res.status(400).json({ message: "Invalid exam ID" });
    }
    const deleted = await deleteExam(examId);
    if (!deleted) return res.status(404).json({ message: "Exam not found" });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

export async function createExamSubjectHandler(req: Request, res: Response) {
  try {
    const examId = Number(req.params.id);
    if (Number.isNaN(examId)) {
      return res.status(400).json({ message: "Invalid exam ID" });
    }
    const payload = createExamSubjectSchema.parse(req.body);
    const subject = await createExamSubject({
      examId,
      name: payload.name,
      order: payload.order,
    });
    res.status(201).json(subject);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error", error });
  }
}

export async function updateExamSubjectHandler(req: Request, res: Response) {
  try {
    const payload = updateExamSubjectSchema.parse(req.body);
    const subject = await updateExamSubject(req.params.subjectId, payload);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    res.json(subject);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error", error });
  }
}

export async function deleteExamSubjectHandler(req: Request, res: Response) {
  try {
    const deleted = await deleteExamSubject(req.params.subjectId);
    if (!deleted) {
      return res.status(404).json({ message: "Subject not found" });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

export async function listExamSubjectsHandler(req: Request, res: Response) {
  try {
    const examId = Number(req.params.id);
    if (Number.isNaN(examId)) {
      return res.status(400).json({ message: "Invalid exam ID" });
    }
    const query = listExamSubjectQuerySchema.parse(req.query);
    const result = await listExamSubjects({
      examId,
      page: query.page,
      pageSize: query.pageSize,
      search: query.search,
    });
    res.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error", error });
  }
}

export async function createExamTopicHandler(req: Request, res: Response) {
  try {
    const payload = createExamTopicSchema.parse(req.body);
    const topic = await createExamTopic(payload);
    res.status(201).json(topic);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error", error });
  }
}

export async function updateExamTopicHandler(req: Request, res: Response) {
  try {
    const payload = updateExamTopicSchema.parse(req.body);
    const topic = await updateExamTopic(req.params.topicId, payload);
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }
    res.json(topic);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error", error });
  }
}

export async function deleteExamTopicHandler(req: Request, res: Response) {
  try {
    const deleted = await deleteExamTopic(req.params.topicId);
    if (!deleted) {
      return res.status(404).json({ message: "Topic not found" });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

export async function listExamTopicsHandler(req: Request, res: Response) {
  try {
    const query = listExamTopicQuerySchema.parse(req.query);
    const result = await listExamTopics({
      examId: query.examId,
      subjectId: query.subjectId,
      page: query.page,
      pageSize: query.pageSize,
      search: query.search,
    });
    res.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error", error });
  }
}

export async function leaderboard(_req: Request, res: Response) {
  const data = await getLeaderboard();
  res.json(data);
}

export async function ieltsProgress(_req: Request, res: Response) {
  const data = await getIeltsProgress();
  res.json(data);
}

export async function assignExamMcqHandler(req: Request, res: Response) {
  try {
    const examId = Number(req.params.id);
    const payload = z
      .object({ mcqId: z.string().min(1) })
      .parse(req.body);
    if (Number.isNaN(examId)) {
      return res.status(400).json({ message: "Invalid exam ID" });
    }
    const mcq = await assignMcqToExam(examId, payload.mcqId);
    if (!mcq) return res.status(404).json({ message: "MCQ not found" });
    res.status(201).json({ examId, mcqId: payload.mcqId });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error", error });
  }
}

export async function removeExamMcqHandler(req: Request, res: Response) {
  try {
    const examId = Number(req.params.id);
    if (Number.isNaN(examId)) {
      return res.status(400).json({ message: "Invalid exam ID" });
    }
    const deleted = await removeMcqFromExam(examId, req.params.mcqId);
    if (!deleted) return res.status(404).json({ message: "MCQ link not found" });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

export async function listExamMcqsHandler(req: Request, res: Response) {
  try {
    const examId = Number(req.params.id);
    if (Number.isNaN(examId)) {
      return res.status(400).json({ message: "Invalid exam ID" });
    }
    const rows = await listExamMcqs(examId);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

const sanitizeMcq = (mcq: any) => ({
  ...mcq,
  options: Array.isArray(mcq.options)
    ? mcq.options.map(({ isCorrect, ...option }: any) => option)
    : mcq.options,
});

export async function startExamHandler(req: Request, res: Response) {
  try {
    const examId = Number(req.params.id);
    if (Number.isNaN(examId)) {
      return res.status(400).json({ message: "Invalid exam ID" });
    }

    const result = await startExamAttempt({
      examId,
      userId: req.session.userId || null,
    });

    if (!result) {
      return res.status(404).json({ message: "No questions found for exam" });
    }

    res.status(201).json({
      attemptId: result.attempt.id,
      questions: result.questions.map(sanitizeMcq),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

export async function createAttemptHandler(req: Request, res: Response) {
  try {
    const { examId, totalQuestions, difficultyWeights, timeLimitSeconds } =
      req.body || {};
    if (!examId || Number.isNaN(Number(examId))) {
      return res.status(400).json({ message: "examId is required" });
    }

    const attempt = await createAttempt({
      examId: Number(examId),
      userId: req.session.userId || null,
      totalQuestions,
      difficultyWeights,
      timeLimitSeconds,
    });

    if (!attempt) {
      return res.status(404).json({ message: "No questions found for exam" });
    }

    res.status(201).json(attempt);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

export async function getAttemptHandler(req: Request, res: Response) {
  try {
    const attempt = await getAttempt(req.params.id);
    if (!attempt) return res.status(404).json({ message: "Attempt not found" });
    res.json(attempt);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

export async function saveAnswerHandler(req: Request, res: Response) {
  try {
    const { mcqId, selectedOptionId, currentQuestionIndex, timeRemainingSeconds } =
      req.body || {};
    if (!mcqId) {
      return res.status(400).json({ message: "mcqId is required" });
    }
    const result = await saveAnswer({
      attemptId: req.params.id,
      mcqId,
      selectedOptionId,
      currentQuestionIndex,
      timeRemainingSeconds,
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

export async function saveAttemptAnswerHandler(req: Request, res: Response) {
  try {
    const { mcqId, selectedOptionId } = req.body || {};
    if (!mcqId) {
      return res.status(400).json({ message: "mcqId is required" });
    }
    const result = await saveAnswer({
      attemptId: req.params.attemptId,
      mcqId,
      selectedOptionId,
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

export async function submitAttemptHandler(req: Request, res: Response) {
  try {
    const { timeSpentSeconds } = req.body || {};
    const result = await submitAttempt({
      attemptId: req.params.id,
      timeSpentSeconds,
    });
    if (!result) return res.status(404).json({ message: "Attempt not found" });
    const summary = await calculateResultSummary({
      attemptId: req.params.id,
      timeSpentSeconds,
    });
    res.json({ result, summary });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

export async function submitAttemptByIdHandler(req: Request, res: Response) {
  try {
    const { timeSpentSeconds } = req.body || {};
    const result = await submitAttempt({
      attemptId: req.params.attemptId,
      timeSpentSeconds,
    });
    if (!result) return res.status(404).json({ message: "Attempt not found" });
    const summary = await calculateResultSummary({
      attemptId: req.params.attemptId,
      timeSpentSeconds,
    });
    res.json({ result, summary });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

export async function resultSummaryHandler(req: Request, res: Response) {
  try {
    const { timeSpentSeconds } = req.query || {};
    const summary = await calculateResultSummary({
      attemptId: req.params.id,
      timeSpentSeconds: timeSpentSeconds
        ? Number(timeSpentSeconds)
        : undefined,
    });
    if (!summary) return res.status(404).json({ message: "Attempt not found" });
    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

export async function resumeAttemptHandler(req: Request, res: Response) {
  try {
    const result = await getAttemptResume(req.params.attemptId);
    if (!result) {
      return res.status(404).json({ message: "Attempt not found" });
    }

    res.json({
      questions: result.questions.map(sanitizeMcq),
      unansweredQuestions: result.unanswered.map(sanitizeMcq),
      remainingTime: result.attempt.timeRemainingSeconds ?? null,
      savedAnswers: result.answers,
      currentQuestionIndex: result.attempt.currentQuestionIndex ?? 0,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

export async function createAttemptFromQuestionsHandler(
  req: Request,
  res: Response
) {
  try {
    const payload = createAttemptFromQuestionsSchema.parse(req.body);
    const attempt = await createAttemptFromQuestions({
      examId: payload.examId,
      questionIds: payload.questionIds,
      timeLimitSeconds: payload.timeLimitSeconds ?? null,
      userId: req.session.userId || null,
    });
    if (!attempt) {
      return res.status(404).json({ message: "No questions found for exam" });
    }
    res.status(201).json(attempt);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error", error });
  }
}

export async function saveAttemptProgressHandler(
  req: Request,
  res: Response
) {
  try {
    const payload = saveAttemptProgressSchema.parse(req.body);
    const result = await saveAttemptProgress({
      attemptId: req.params.id,
      currentQuestionIndex: payload.currentQuestionIndex,
      timeRemainingSeconds: payload.timeRemainingSeconds ?? null,
      answers: payload.answers,
    });
    res.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error", error });
  }
}

export async function resumeAttemptStateHandler(
  req: Request,
  res: Response
) {
  try {
    const attempt = await getAttempt(req.params.id);
    if (!attempt) return res.status(404).json({ message: "Attempt not found" });
    res.json(attempt);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}
