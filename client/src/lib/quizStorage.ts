export type StoredQuizState = {
  attemptId?: string;
  currentIndex: number;
  answers: Record<string, string[]>;
  flags: string[];
  remainingSeconds: number;
  questionOrder: string[];
  optionOrder: Record<string, number[]>;
};

export function buildQuizStorageKey(parts: {
  examId: number | null;
  subjectIds: string[];
  topicIds: string[];
  difficulty: string;
  system: string | null;
}) {
  const segment = [
    parts.examId ?? "unknown",
    parts.subjectIds.join("-") || "all-subjects",
    parts.topicIds.join("-") || "all-topics",
    parts.difficulty,
    parts.system ?? "all-systems",
  ].join("|");
  return `quiz_state:${segment}`;
}

export function loadQuizState(key: string): StoredQuizState | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as StoredQuizState;
  } catch {
    return null;
  }
}

export function saveQuizState(key: string, state: StoredQuizState) {
  localStorage.setItem(key, JSON.stringify(state));
}

export function clearQuizState(key: string) {
  localStorage.removeItem(key);
}
