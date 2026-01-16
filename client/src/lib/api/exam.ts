// client/src/lib/api/exam.ts
// central place for exam-related API helpers

export const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/api`
  : "http://localhost:5000/api";

/**
 * Fetch questions for an exam from backend
 * @param examId string
 * @param opts optional filters
 */
export async function fetchExamQuestions(
  examId: string,
  opts?: { difficulty?: string; category?: string; limit?: number }
) {
  if (!examId) throw new Error("examId is required to fetch questions");
  const params = new URLSearchParams();
  if (opts?.difficulty) params.append("difficulty", opts.difficulty);
  if (opts?.category) params.append("category", opts.category);
  if (opts?.limit) params.append("limit", String(opts.limit));
  const url = `${API_BASE}/exams/${encodeURIComponent(examId)}/questions${params.toString() ? "?" + params.toString() : ""}`;
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to fetch questions (${res.status}): ${text}`);
  }
  const json = await res.json();
  if (!Array.isArray(json)) throw new Error("Unexpected response format when fetching questions");
  return json;
}
