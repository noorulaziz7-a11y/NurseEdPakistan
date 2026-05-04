import { apiClient } from "@/shared/api/axios";

export type AttemptProgressPayload = {
  currentQuestionIndex?: number;
  timeRemainingSeconds?: number | null;
  answers?: { mcqId: string; selectedOptionIds: number[] }[];
};

export type CreateAttemptPayload = {
  examId: number;
  questionIds: string[];
  timeLimitSeconds?: number | null;
};

export type AttemptRecord = {
  id: string;
  examId: number;
  status: string;
  questionIds: string[];
  currentQuestionIndex?: number | null;
  timeLimitSeconds?: number | null;
  timeRemainingSeconds?: number | null;
};

export type AttemptAnswerRecord = {
  attemptId: string;
  mcqId: string;
  selectedOptionId?: number | null;
  selectedOptionIds?: number[] | null;
  isCorrect?: boolean;
};

export async function createAttempt(payload: CreateAttemptPayload) {
  const res = await apiClient.post<AttemptRecord>("/api/v1/attempts", payload);
  return res.data;
}

export async function saveAttemptProgress(
  attemptId: string,
  payload: AttemptProgressPayload
) {
  const res = await apiClient.patch<{ success: boolean }>(
    `/api/v1/attempts/${attemptId}/progress`,
    payload
  );
  return res.data;
}

export async function getAttempt(attemptId: string) {
  const res = await apiClient.get<{ attempt: AttemptRecord; answers: AttemptAnswerRecord[] }>(
    `/api/v1/attempts/${attemptId}`
  );
  return res.data;
}

export async function resumeAttempt(attemptId: string) {
  const res = await apiClient.get<{
    questions: any[];
    unansweredQuestions: any[];
    remainingTime: number | null;
    savedAnswers: AttemptAnswerRecord[];
    currentQuestionIndex: number;
  }>(`/api/v1/exams/attempts/${attemptId}/resume`);
  return res.data;
}

export async function submitAttempt(attemptId: string, timeSpentSeconds?: number) {
  const res = await apiClient.post(`/api/v1/exam-attempts/${attemptId}/submit`, {
    timeSpentSeconds
  });
  return res.data;
}
