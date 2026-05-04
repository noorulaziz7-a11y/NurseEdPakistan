import { apiClient } from "@/shared/api/axios";
import { endpoints } from "@/shared/api/endpoints";

export type McqDifficulty = "easy" | "moderate" | "hard";
export type McqSystem =
  | "Cardiovascular"
  | "Respiratory"
  | "Neurological"
  | "Gastrointestinal"
  | "Renal"
  | "Endocrine"
  | "Musculoskeletal"
  | "Reproductive"
  | "Hematology"
  | "Immune"
  | "Integumentary";

export type McqType = "single" | "multiple" | "true_false";
export type McqRationaleType = "detailed" | "quick" | "video";

export type McqOptionInput =
  | string
  | {
      optionText: string;
      isCorrect?: boolean;
      position?: number;
    };

export type McqPayload = {
  examId: number;
  subjectId: string;
  topicId?: string | null;
  difficulty: McqDifficulty;
  system: McqSystem;
  type?: McqType;
  imageUrl?: string | null;
  reference?: string | null;
  year?: number | null;
  rationaleType?: McqRationaleType | null;
  question: string;
  explanation?: string | null;
  options: McqOptionInput[];
  correctIndex?: number | null;
  tags?: string[] | null;
  createdBy?: string | null;
};

export type Mcq = {
  id: string;
  question: string;
  explanation?: string | null;
  examId: number;
  subjectId: string;
  topicId?: string | null;
  difficulty: McqDifficulty;
  system: McqSystem;
  type?: McqType;
  imageUrl?: string | null;
  reference?: string | null;
  year?: number | null;
  rationaleType?: McqRationaleType | null;
  createdBy?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type McqOption = {
  id?: number;
  optionText: string;
  isCorrect?: boolean;
  position?: number;
};

export type McqTag = {
  id?: number;
  tag: string;
};

export type McqListItem = Mcq & {
  options?: McqOption[];
  tags?: McqTag[];
};

export type McqListResponse<T = McqListItem> = {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  meta: {
    difficulty: Record<string, number>;
    system: Record<string, number>;
  };
};

export type Exam = {
  id: number;
  name: string;
};

export type ExamSubject = {
  id: string;
  examId: number;
  name: string;
};

export type ExamTopic = {
  id: string;
  examId: number;
  subjectId?: string | null;
  title: string;
};

export async function getMCQs(params?: {
  page?: number;
  pageSize?: number;
  limit?: number;
  random?: boolean;
  adaptive?: boolean;
  excludeAttempted?: boolean;
  includeExplanation?: boolean;
  search?: string;
  examId?: number;
  subjectId?: string;
  topicId?: string;
  difficulty?: McqDifficulty;
  system?: McqSystem;
}) {
  const res = await apiClient.get<McqListResponse>(endpoints.mcqs, { params });
  return res.data;
}

export async function getMCQ(id: string) {
  const res = await apiClient.get<McqListItem>(`${endpoints.mcqs}/${id}`);
  return res.data;
}

export async function createMCQ(payload: McqPayload) {
  const res = await apiClient.post<Mcq>(endpoints.mcqs, payload);
  return res.data;
}

export async function updateMCQ(id: string, payload: Partial<McqPayload>) {
  const res = await apiClient.put<Mcq>(`${endpoints.mcqs}/${id}`, payload);
  return res.data;
}

export async function deleteMCQ(id: string) {
  const res = await apiClient.delete<{ success: boolean }>(
    `${endpoints.mcqs}/${id}`
  );
  return res.data;
}

export async function bulkUploadMCQs(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await apiClient.post<{ success: number; failed: number }>(
    endpoints.mcqBulkUpload,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return res.data;
}

export async function getExams() {
  const res = await apiClient.get<Exam[]>("/api/v1/exams");
  return res.data;
}

export async function getExamSubjects(examId: number) {
  const res = await apiClient.get<{ data: ExamSubject[] }>(
    `/api/v1/exams/${examId}/subjects`
  );
  return res.data.data;
}

export async function getExamTopics(params: { examId?: number; subjectId?: string }) {
  const res = await apiClient.get<{ data: ExamTopic[] }>("/api/v1/exam-topics", {
    params,
  });
  return res.data.data;
}
