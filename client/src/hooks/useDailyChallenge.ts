import { useState, useEffect } from "react";
import { ExamQuestion } from "@shared/browser";

export const useDailyChallenge = (examType: string) => {
  const [question, setQuestion] = useState<ExamQuestion | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDailyChallenge = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/daily-challenge/${examType}`);
        if (!res.ok) throw new Error("Failed to fetch daily challenge");

        const data: ExamQuestion = await res.json();
        setQuestion(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDailyChallenge();
  }, [examType]);

  return { question, loading, error };
};
