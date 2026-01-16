import { useState, useEffect } from "react";
import { ExamQuestion } from "@shared/browser";

interface UseExamQuestionsProps {
  examType: string;
  subject?: string;
  system?: string;
  difficulty?: string;
  limit?: number;
}

export const useExamQuestions = ({
  examType,
  subject,
  system,
  difficulty,
  limit,
}: UseExamQuestionsProps) => {
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (subject) params.append("subject", subject);
        if (system) params.append("system", system);
        if (difficulty) params.append("difficulty", difficulty);
        if (limit) params.append("limit", limit.toString());

        const res = await fetch(`/api/exams/${examType}/questions?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch questions");

        const data: ExamQuestion[] = await res.json();
        setQuestions(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [examType, subject, system, difficulty, limit]);

  return { questions, loading, error };
};
