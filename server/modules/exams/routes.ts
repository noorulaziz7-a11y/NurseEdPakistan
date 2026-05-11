import { Router } from "express";
import {
  listExams,
  getExam,
  createExamHandler,
  updateExamHandler,
  deleteExamHandler,
  createExamSubjectHandler,
  updateExamSubjectHandler,
  deleteExamSubjectHandler,
  listExamSubjectsHandler,
  createExamTopicHandler,
  updateExamTopicHandler,
  deleteExamTopicHandler,
  listExamTopicsHandler,
  leaderboard,
  ieltsProgress,
  assignExamMcqHandler,
  removeExamMcqHandler,
  listExamMcqsHandler,
  startExamHandler,
  createAttemptHandler,
  getAttemptHandler,
  saveAnswerHandler,
  saveAttemptAnswerHandler,
  submitAttemptHandler,
  submitAttemptByIdHandler,
  resultSummaryHandler,
  resumeAttemptHandler,
  createAttemptFromQuestionsHandler,
  saveAttemptProgressHandler,
  resumeAttemptStateHandler,
  getAdaptiveNextQuestionHandler,
} from "./controller";

const router = Router();

router.get("/exams", listExams);
router.post("/exams", createExamHandler);
router.get("/exams/:id", getExam);
router.put("/exams/:id", updateExamHandler);
router.delete("/exams/:id", deleteExamHandler);
router.post("/exams/:id/subjects", createExamSubjectHandler);
router.get("/exams/:id/subjects", listExamSubjectsHandler);
router.put("/exam-subjects/:subjectId", updateExamSubjectHandler);
router.delete("/exam-subjects/:subjectId", deleteExamSubjectHandler);
router.post("/exam-topics", createExamTopicHandler);
router.get("/exam-topics", listExamTopicsHandler);
router.put("/exam-topics/:topicId", updateExamTopicHandler);
router.delete("/exam-topics/:topicId", deleteExamTopicHandler);
router.post("/exams/:id/start", startExamHandler);
router.post("/exams/:id/mcqs", assignExamMcqHandler);
router.delete("/exams/:id/mcqs/:mcqId", removeExamMcqHandler);
router.get("/exams/:id/mcqs", listExamMcqsHandler);
router.get("/leaderboard", leaderboard);
router.get("/ielts/progress", ieltsProgress);
router.post("/exam-attempts", createAttemptHandler);
router.get("/exam-attempts/:id", getAttemptHandler);
router.patch("/exam-attempts/:id/answers", saveAnswerHandler);
router.post("/exams/attempts/:attemptId/answer", saveAttemptAnswerHandler);
router.post("/exams/attempts/:attemptId/submit", submitAttemptByIdHandler);
router.get("/exams/attempts/:attemptId/resume", resumeAttemptHandler);
router.post("/exam-attempts/:id/submit", submitAttemptHandler);
router.get("/exam-attempts/:id/summary", resultSummaryHandler);
router.post("/attempts", createAttemptFromQuestionsHandler);
router.get("/attempts/:id", resumeAttemptStateHandler);
router.patch("/attempts/:id/progress", saveAttemptProgressHandler);
router.post("/exams/adaptive/next", getAdaptiveNextQuestionHandler);

export default router;
