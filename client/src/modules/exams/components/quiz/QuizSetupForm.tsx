import { useMemo, useState } from "react";
import { useParams } from "wouter";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Badge } from "@/shared/ui/badge";
import { CheckCircle2, Filter, ListChecks } from "lucide-react";
import { getExamSubjects, getExamTopics, getExams } from "@/modules/mcqs/services/mcqApi";
import { exams as examDirectory } from "@/pages/exam-prep/exam-data";

type TestMode = "practice" | "exam" | "timed";
type Difficulty = "easy" | "moderate" | "hard";

export type ExamFilterPayload = {
  mode: TestMode;
  subjects: string[];
  topicId?: string | null;
  bodySystems: string[];
  difficulty: Difficulty;
  totalQuestions: number;
};

const BODY_SYSTEMS = [
  "Cardiovascular",
  "Respiratory",
  "Neurological",
  "Gastrointestinal",
  "Renal",
  "Endocrine",
  "Musculoskeletal",
  "Reproductive",
  "Hematology",
  "Immune",
  "Integumentary",
];

const FALLBACK_SUBJECTS = [
  "Medical-Surgical",
  "Pediatrics",
  "Pharmacology",
  "Mental Health",
  "Maternal-Newborn",
  "Fundamentals",
  "Critical Care",
  "Community Health",
  "Leadership",
  "Emergency",
  "Ethics",
];

const DIFFICULTY_OPTIONS: { label: string; value: Difficulty }[] = [
  { label: "Easy", value: "easy" },
  { label: "Moderate", value: "moderate" },
  { label: "Hard", value: "hard" },
];

const MODE_OPTIONS: { label: string; value: TestMode }[] = [
  { label: "Practice", value: "practice" },
  { label: "Exam", value: "exam" },
  { label: "Timed", value: "timed" },
];

const QUESTION_RANGE = { min: 10, max: 200 };
const difficultyMap: Record<Difficulty, string> = {
  easy: "beginner",
  moderate: "intermediate",
  hard: "advanced",
};

export default function QuizSetupForm() {
  const { examId } = useParams<{ examId: string }>();
  const examIdNumber = examId ? Number(examId) : NaN;

  const { data: apiExams = [], isLoading: isExamLoading } = useQuery({
    queryKey: ["/api/v1/exams"],
    queryFn: getExams,
  });

  const resolvedExamId = useMemo(() => {
    if (Number.isFinite(examIdNumber)) {
      return examIdNumber;
    }
    const slugExam = examDirectory.find((exam) => exam.id === examId);
    if (!slugExam) return null;
    const match = apiExams.find((exam) => {
      const apiName = exam?.name?.toLowerCase?.();
      const slugName = slugExam.name.toLowerCase();
      return apiName ? apiName === slugName : false;
    });
    return match?.id ?? null;
  }, [examId, examIdNumber, apiExams]);

  const [mode, setMode] = useState<TestMode>("practice");
  const [subjectId, setSubjectId] = useState("");
  const [topicId, setTopicId] = useState("");
  const [bodySystems, setBodySystems] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty>("moderate");
  const [totalQuestions, setTotalQuestions] = useState(50);
  const [error, setError] = useState<string | null>(null);

  const { data: subjects = [] } = useQuery({
    queryKey: ["/api/v1/exams", resolvedExamId, "subjects"],
    queryFn: () => (resolvedExamId ? getExamSubjects(resolvedExamId) : []),
    enabled: Boolean(resolvedExamId),
  });

  const { data: topics = [] } = useQuery({
    queryKey: ["/api/v1/exam-topics", resolvedExamId, subjectId],
    queryFn: () =>
      getExamTopics({ examId: resolvedExamId ?? undefined, subjectId }),
    enabled: Boolean(resolvedExamId) && Boolean(subjectId),
  });

  const selectedPreview = useMemo(() => {
    const difficultyLabel =
      DIFFICULTY_OPTIONS.find((item) => item.value === difficulty)?.label ??
      "Moderate";
    return {
      mode,
      subjectId,
      topicId,
      subjectLabel: subjects.find((s) => s.id === subjectId)?.name ?? subjectId,
      topicLabel: topics.find((t) => t.id === topicId)?.title ?? "",
      bodySystems,
      difficultyLabel,
      totalQuestions,
    };
  }, [mode, subjectId, topicId, subjects, topics, bodySystems, difficulty, totalQuestions]);

  const subjectOptions =
    subjects.length > 0
      ? subjects
      : FALLBACK_SUBJECTS.map((name) => ({ id: name, name }));
  const isLegacyMode = !resolvedExamId;

  const toggleValue = (
    value: string,
    selected: string[],
    setter: (next: string[]) => void
  ) => {
    setter(
      selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value]
    );
  };

  const clearFilters = () => {
    setMode("practice");
    setSubjectId("");
    setTopicId("");
    setBodySystems([]);
    setDifficulty("moderate");
    setTotalQuestions(50);
    setError(null);
  };

  const handleStart = () => {
    if (!resolvedExamId && !examId) {
      setError(
        isExamLoading
          ? "Loading exam data, please try again."
          : "Select a valid exam before starting."
      );
      return;
    }
    if (!mode) {
      setError("Choose a test mode to continue.");
      return;
    }
    if (!subjectId) {
      setError("Select a subject to continue.");
      return;
    }
    if (!isLegacyMode && topics.length > 0 && !topicId) {
      setError("Select a topic to continue.");
      return;
    }
    if (totalQuestions < QUESTION_RANGE.min || totalQuestions > QUESTION_RANGE.max) {
      setError(`Select between ${QUESTION_RANGE.min} and ${QUESTION_RANGE.max} MCQs.`);
      return;
    }

    setError(null);

    const payload: ExamFilterPayload = {
      mode,
      subjects: subjectId ? [subjectId] : [],
      topicId: topicId || null,
      bodySystems,
      difficulty,
      totalQuestions,
    };

    const params = new URLSearchParams({
      difficulty: difficultyMap[difficulty],
      count: payload.totalQuestions.toString(),
      mode: payload.mode,
      subjectId: isLegacyMode ? "" : subjectId,
    });
    if (!isLegacyMode && payload.topicId) {
      params.set("topicId", payload.topicId);
    }
    if (payload.bodySystems.length > 0) {
      params.set("systems", payload.bodySystems.join(","));
      params.set("system", payload.bodySystems[0]);
    }
    if (isLegacyMode) {
      params.set("legacy", "1");
      params.set("subject", subjectId);
    } else {
      params.set("examId", String(resolvedExamId));
    }

    window.location.href = `/exam-prep/${examId}/quiz?${params.toString()}`;
  };

  return (
    <motion.div
      className="max-w-4xl w-full mx-auto"
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-0 shadow-2xl rounded-3xl bg-white/95 backdrop-blur-xl">
        <CardHeader className="pb-2 text-center">
          <CardTitle className="text-3xl font-bold text-slate-800 font-['Nunito',sans-serif]">
            Exam Filters
          </CardTitle>
          <p className="text-slate-500 text-sm mt-2">
            Build a professional test session tailored to your goals.
          </p>
        </CardHeader>

        <CardContent className="space-y-8 p-6 md:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-600 mb-3">
                  <Filter className="w-4 h-4 text-blue-600" />
                  Test Mode
                </div>
                <div className="flex flex-wrap gap-2">
                  {MODE_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setMode(option.value)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
                        mode === option.value
                          ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                          : "bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-600 mb-3">
                  <ListChecks className="w-4 h-4 text-blue-600" />
                  Subjects
                </div>
                <div className="flex flex-wrap gap-2">
                  {subjectOptions.map((subject) => {
                    const selected = subjectId === subject.id;
                    return (
                      <button
                        key={subject.id}
                        onClick={() => {
                          setSubjectId(subject.id);
                          setTopicId("");
                        }}
                        className={`px-3 py-2 rounded-xl text-sm font-medium transition-all border ${
                          selected
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-white text-slate-600 border-slate-200 hover:border-blue-200 hover:text-blue-600"
                        }`}
                      >
                        {subject.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold text-slate-600 mb-3">
                  Topics
                </div>
                <div className="flex flex-wrap gap-2">
                  {topics.length === 0 && (
                    <span className="text-xs text-slate-400">No topics available.</span>
                  )}
                  {topics.map((topic) => {
                    const selected = topicId === topic.id;
                    return (
                      <button
                        key={topic.id}
                        onClick={() => setTopicId(topic.id)}
                        className={`px-3 py-2 rounded-xl text-sm font-medium transition-all border ${
                          selected
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-white text-slate-600 border-slate-200 hover:border-blue-200 hover:text-blue-600"
                        }`}
                      >
                        {topic.title}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold text-slate-600 mb-3">
                  Body Systems
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {BODY_SYSTEMS.map((system) => {
                    const selected = bodySystems.includes(system);
                    return (
                      <button
                        key={system}
                        onClick={() => toggleValue(system, bodySystems, setBodySystems)}
                        className={`flex items-center justify-between rounded-xl border px-3 py-2 text-sm transition-all ${
                          selected
                            ? "bg-blue-50 border-blue-200 text-blue-700"
                            : "bg-white border-slate-200 text-slate-600 hover:border-blue-200 hover:text-blue-600"
                        }`}
                      >
                        <span>{system}</span>
                        {selected && <CheckCircle2 className="w-4 h-4" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="text-sm font-semibold text-slate-600 mb-3">
                  Difficulty
                </div>
                <div className="flex flex-wrap gap-2">
                  {DIFFICULTY_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setDifficulty(option.value)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
                        difficulty === option.value
                          ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                          : "bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm font-semibold text-slate-600 mb-3">
                  <span>Number of MCQs</span>
                  <Badge className="bg-blue-50 text-blue-700 border border-blue-100">
                    {totalQuestions}
                  </Badge>
                </div>
                <input
                  type="range"
                  min={QUESTION_RANGE.min}
                  max={QUESTION_RANGE.max}
                  value={totalQuestions}
                  onChange={(event) => setTotalQuestions(Number(event.target.value))}
                  className="w-full accent-blue-600"
                />
                <div className="mt-3 flex items-center gap-3">
                  <Input
                    type="number"
                    min={QUESTION_RANGE.min}
                    max={QUESTION_RANGE.max}
                    value={totalQuestions}
                    onChange={(event) => setTotalQuestions(Number(event.target.value))}
                    className="h-10 w-28"
                  />
                  <span className="text-xs text-slate-500">
                    {QUESTION_RANGE.min}–{QUESTION_RANGE.max} questions
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 text-sm text-blue-800">
                <p className="font-semibold mb-2">Session Preview</p>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-white text-blue-700 border border-blue-100">
                    {selectedPreview.mode.toUpperCase()}
                  </Badge>
                  <Badge className="bg-white text-blue-700 border border-blue-100">
                    {selectedPreview.totalQuestions} MCQs
                  </Badge>
                  <Badge className="bg-white text-blue-700 border border-blue-100">
                    {selectedPreview.difficultyLabel}
                  </Badge>
                  {selectedPreview.subjectLabel && (
                    <Badge className="bg-white text-blue-700 border border-blue-100">
                      {selectedPreview.subjectLabel}
                    </Badge>
                  )}
                  {selectedPreview.topicLabel && (
                    <Badge className="bg-white text-blue-700 border border-blue-100">
                      {selectedPreview.topicLabel}
                    </Badge>
                  )}
                  {selectedPreview.bodySystems.length > 0 && (
                    <Badge className="bg-white text-blue-700 border border-blue-100">
                      {selectedPreview.bodySystems.length} system
                      {selectedPreview.bodySystems.length > 1 ? "s" : ""}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button
              variant="outline"
              onClick={clearFilters}
              className="h-11 rounded-xl border-slate-200"
            >
              Clear Filters
            </Button>
            <Button
              onClick={handleStart}
              disabled={isExamLoading}
              className="h-11 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-md hover:shadow-lg transition-all"
            >
              Start Test
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
