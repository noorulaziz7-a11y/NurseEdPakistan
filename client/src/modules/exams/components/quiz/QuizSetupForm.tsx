import { useEffect, useMemo, useState } from "react";
import { useParams } from "wouter";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { CheckCircle2, Filter, ListChecks } from "lucide-react";
import { getExamSubjects, getExamTopics, getExams, getMCQs } from "@/modules/mcqs/services/mcqApi";
import { exams as examDirectory } from "@/pages/exam-prep/exam-data";
import { createAttempt } from "@/modules/exams/services/attemptApi";

type TestMode = "timed" | "tutor" | "mixed";
type Difficulty = "easy" | "moderate" | "hard";

export type ExamFilterPayload = {
  mode: TestMode;
  subjects: string[];
  topics: string[];
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

const DIFFICULTY_OPTIONS: { label: string; value: Difficulty }[] = [
  { label: "Easy", value: "easy" },
  { label: "Moderate", value: "moderate" },
  { label: "Hard", value: "hard" },
];

const MODE_OPTIONS: { label: string; value: TestMode }[] = [
  { label: "Timed", value: "timed" },
  { label: "Tutor", value: "tutor" },
  { label: "Mixed", value: "mixed" },
];

const QUESTION_RANGE = { min: 10, max: 100 };
export default function QuizSetupForm() {
  const { examId } = useParams<{ examId: string }>();
  const examIdNumber = examId ? Number(examId) : NaN;

  const { data: apiExams = [], isLoading: isExamLoading } = useQuery({
    queryKey: ["/api/v1/exams"],
    queryFn: getExams,
  });

  const [examPicker, setExamPicker] = useState<string>("");

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

  useEffect(() => {
    if (!examPicker && resolvedExamId) {
      setExamPicker(String(resolvedExamId));
    }
  }, [examPicker, resolvedExamId]);

  const [mode, setMode] = useState<TestMode>("timed");
  const [subjectIds, setSubjectIds] = useState<string[]>([]);
  const [topicIds, setTopicIds] = useState<string[]>([]);
  const [bodySystems, setBodySystems] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty>("moderate");
  const [totalQuestions, setTotalQuestions] = useState(50);
  const [error, setError] = useState<string | null>(null);

  const effectiveExamId = useMemo(() => {
    const numeric = Number(examPicker);
    return Number.isFinite(numeric) ? numeric : null;
  }, [examPicker]);

  const effectiveExamSlug = useMemo(() => {
    if (examId && examDirectory.some((exam) => exam.id === examId)) {
      return examId;
    }
    const picked = apiExams.find((exam) => String(exam.id) === examPicker);
    if (picked?.name) {
      const match = examDirectory.find(
        (exam) => exam.name.toLowerCase() === picked.name.toLowerCase()
      );
      if (match) return match.id;
    }
    return examId || "";
  }, [apiExams, examId, examPicker]);

  const {
    data: subjects = [],
    isLoading: isSubjectsLoading,
    isError: isSubjectsError,
    error: subjectsError,
  } = useQuery({
    queryKey: ["/api/v1/exams", effectiveExamId, "subjects"],
    queryFn: () => (effectiveExamId ? getExamSubjects(effectiveExamId) : []),
    enabled: Boolean(effectiveExamId),
  });

  const { data: topics = [] } = useQuery({
    queryKey: ["/api/v1/exam-topics", effectiveExamId, subjectIds[0]],
    queryFn: () =>
      getExamTopics({ examId: effectiveExamId ?? undefined, subjectId: subjectIds[0] }),
    enabled: Boolean(effectiveExamId) && Boolean(subjectIds[0]),
  });

  const selectedPreview = useMemo(() => {
    const difficultyLabel =
      DIFFICULTY_OPTIONS.find((item) => item.value === difficulty)?.label ??
      "Moderate";
    const subjectLabels = subjects
      .filter((subject) => subjectIds.includes(subject.id))
      .map((subject) => subject.name);
    const topicLabels = topics
      .filter((topic) => topicIds.includes(topic.id))
      .map((topic) => topic.title);
    return {
      mode,
      subjectIds,
      topicIds,
      subjectLabels,
      topicLabels,
      bodySystems,
      difficultyLabel,
      totalQuestions,
    };
  }, [mode, subjectIds, topicIds, subjects, topics, bodySystems, difficulty, totalQuestions]);

  const subjectOptions = subjects;

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
    setMode("timed");
    setSubjectIds([]);
    setTopicIds([]);
    setBodySystems([]);
    setDifficulty("moderate");
    setTotalQuestions(50);
    setError(null);
  };

  const [isStarting, setIsStarting] = useState(false);

  const handleStart = async () => {
    if (!effectiveExamId) {
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
    if (subjectIds.length === 0) {
      setError("Select at least one subject to continue.");
      return;
    }
    if (topics.length > 0 && topicIds.length === 0) {
      setError("Select at least one topic to continue.");
      return;
    }
    if (totalQuestions < QUESTION_RANGE.min || totalQuestions > QUESTION_RANGE.max) {
      setError(`Select between ${QUESTION_RANGE.min} and ${QUESTION_RANGE.max} MCQs.`);
      return;
    }

    setError(null);
    setIsStarting(true);

    try {
      // 1. Fetch MCQs based on filters to get IDs
      const mcqResponse = await getMCQs({
        page: 1,
        pageSize: totalQuestions,
        examId: effectiveExamId,
        subjectId: subjectIds[0], // Using first subject for now as per previous logic
        difficulty,
        system: bodySystems[0] as any, // Using first system
      });

      if (!mcqResponse.data.length) {
        throw new Error("No questions found matching your criteria.");
      }

      // 2. Create attempt
      const attempt = await createAttempt({
        examId: effectiveExamId,
        questionIds: mcqResponse.data.map((m) => m.id),
        timeLimitSeconds: mode === "timed" ? totalQuestions * 60 : null, // 1 min per question for timed
      });

      // 3. Redirect
      const params = new URLSearchParams({
        attemptId: attempt.id,
        mode,
      });

      window.location.href = `/exam-prep/${effectiveExamSlug}/quiz?${params.toString()}`;
    } catch (err: any) {
      setError(err.message || "Failed to start quiz session.");
      setIsStarting(false);
    }
  };

  return (
    <motion.div
      className="max-w-4xl w-full mx-auto"
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border border-slate-100 shadow-xl rounded-3xl bg-white">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-2">
            <CardTitle className="text-3xl font-semibold text-slate-900">
              Build Your Exam Session
            </CardTitle>
            <p className="text-slate-500 text-sm">
              Choose exam details and start a focused practice session.
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-100 p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3">
                  Exam
                </p>
                <Select
                  value={examPicker}
                  onValueChange={(value) => {
                    setExamPicker(value);
                    setSubjectIds([]);
                    setTopicIds([]);
                  }}
                >
                  <SelectTrigger className="h-11 rounded-xl">
                    <SelectValue placeholder="Select exam" />
                  </SelectTrigger>
                  <SelectContent>
                    {apiExams.map((exam) => (
                      <SelectItem key={exam.id} value={String(exam.id)}>
                        {exam.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-2xl border border-slate-100 p-4 shadow-sm">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-600 mb-3">
                  <Filter className="w-4 h-4 text-blue-600" />
                  Test Mode
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {MODE_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setMode(option.value)}
                      className={`h-10 rounded-xl text-sm font-semibold transition-all ${
                        mode === option.value
                          ? "bg-slate-900 text-white shadow-sm"
                          : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-100 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                    <ListChecks className="w-4 h-4 text-blue-600" />
                    Subjects
                  </div>
                  <span className="text-xs text-slate-400">
                    {subjectIds.length} selected
                  </span>
                </div>
                {isSubjectsError && (
                  <div className="mb-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                    {(subjectsError as Error)?.message || "Failed to load subjects."}
                  </div>
                )}
                {Boolean(effectiveExamId) && !isSubjectsLoading && subjects.length === 0 && !isSubjectsError && (
                  <div className="mb-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                    No subjects found for this exam yet. Seed the database or add subjects via the admin endpoints.
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  {subjectOptions.map((subject) => {
                    const selected = subjectIds.includes(subject.id);
                    return (
                      <button
                        key={subject.id}
                        onClick={() => {
                          toggleValue(subject.id, subjectIds, setSubjectIds);
                          setTopicIds([]);
                        }}
                        className={`px-3 py-2 rounded-full text-xs font-semibold transition-all border ${
                          selected
                            ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                            : "bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600"
                        }`}
                      >
                        {subject.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="rounded-2xl border border-slate-100 p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-slate-600">Topics</p>
                    <span className="text-xs text-slate-400">
                      {topicIds.length} selected
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {topics.length === 0 && (
                      <span className="text-xs text-slate-400">
                        Select a subject to load topics.
                      </span>
                    )}
                    {topics.map((topic) => {
                      const selected = topicIds.includes(topic.id);
                      return (
                        <button
                          key={topic.id}
                          onClick={() => toggleValue(topic.id, topicIds, setTopicIds)}
                          className={`px-3 py-2 rounded-full text-xs font-semibold transition-all border ${
                            selected
                              ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                              : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900"
                          }`}
                        >
                          {topic.title}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div>
                <div className="rounded-2xl border border-slate-100 p-4 shadow-sm">
                  <p className="text-sm font-semibold text-slate-600 mb-3">Body Systems</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {BODY_SYSTEMS.map((system) => {
                      const selected = bodySystems.includes(system);
                      return (
                        <button
                          key={system}
                          onClick={() => toggleValue(system, bodySystems, setBodySystems)}
                          className={`flex items-center justify-between rounded-2xl border px-3 py-3 text-sm transition-all hover:-translate-y-0.5 ${
                            selected
                              ? "bg-blue-600 border-blue-600 text-white shadow-sm"
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
            </div>

            <div className="space-y-6">
              <div>
                <div className="rounded-2xl border border-slate-100 p-4 shadow-sm">
                  <p className="text-sm font-semibold text-slate-600 mb-3">Difficulty</p>
                  <div className="grid grid-cols-3 gap-2">
                    {DIFFICULTY_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setDifficulty(option.value)}
                        className={`h-10 rounded-xl text-sm font-semibold transition-all ${
                          difficulty === option.value
                            ? "bg-slate-900 text-white shadow-sm"
                            : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className="rounded-2xl border border-slate-100 p-4 shadow-sm">
                  <div className="flex items-center justify-between text-sm font-semibold text-slate-600 mb-3">
                    <span>Question Count</span>
                    <Badge className="bg-slate-900 text-white">{totalQuestions}</Badge>
                  </div>
                  <input
                    type="range"
                    min={QUESTION_RANGE.min}
                    max={QUESTION_RANGE.max}
                    value={totalQuestions}
                    onChange={(event) => setTotalQuestions(Number(event.target.value))}
                    className="w-full accent-slate-900"
                  />
                  <div className="mt-2 text-xs text-slate-400">
                    {QUESTION_RANGE.min}–{QUESTION_RANGE.max} questions
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-700">
                <p className="font-semibold mb-2">Session Preview</p>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-white text-slate-700 border border-slate-200">
                    {selectedPreview.mode.toUpperCase()}
                  </Badge>
                  <Badge className="bg-white text-slate-700 border border-slate-200">
                    {selectedPreview.totalQuestions} MCQs
                  </Badge>
                  <Badge className="bg-white text-slate-700 border border-slate-200">
                    {selectedPreview.difficultyLabel}
                  </Badge>
                  {selectedPreview.subjectLabels.length > 0 && (
                    <Badge className="bg-white text-slate-700 border border-slate-200">
                      {selectedPreview.subjectLabels.length} subjects
                    </Badge>
                  )}
                  {selectedPreview.topicLabels.length > 0 && (
                    <Badge className="bg-white text-slate-700 border border-slate-200">
                      {selectedPreview.topicLabels.length} topics
                    </Badge>
                  )}
                  {selectedPreview.bodySystems.length > 0 && (
                    <Badge className="bg-white text-slate-700 border border-slate-200">
                      {selectedPreview.bodySystems.length} systems
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

          <div className="flex flex-col gap-3">
            <Button
              variant="outline"
              onClick={clearFilters}
              className="h-11 rounded-xl border-slate-200 w-full"
            >
              Clear Filters
            </Button>
            <Button
              onClick={handleStart}
              disabled={isExamLoading || isStarting}
              className="h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow-md hover:shadow-lg transition-all w-full"
            >
              {isStarting ? "Creating Session..." : "Start Test"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
