import { useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Seo from "@/shared/seo/Seo";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";
import { Badge } from "@/shared/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  bulkUploadMCQs,
  createMCQ,
  deleteMCQ,
  getExamSubjects,
  getExamTopics,
  getExams,
  getMCQs,
  updateMCQ,
  type McqDifficulty,
  type McqSystem,
  type McqListItem,
} from "@/modules/mcqs/services/mcqApi";

const BODY_SYSTEMS: McqSystem[] = [
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

const DIFFICULTY_OPTIONS: McqDifficulty[] = ["easy", "moderate", "hard"];

type FormState = {
  id?: string;
  examId: number | null;
  subjectId: string;
  topicId: string;
  difficulty: McqDifficulty;
  system: McqSystem;
  question: string;
  explanation: string;
  options: string[];
  correctIndex: number;
  tags: string;
};

const emptyForm: FormState = {
  examId: null,
  subjectId: "",
  topicId: "",
  difficulty: "moderate",
  system: "Cardiovascular",
  question: "",
  explanation: "",
  options: ["", "", "", ""],
  correctIndex: 0,
  tags: "",
};

export default function McqAdminPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [page, setPage] = useState(1);
  const [examFilter, setExamFilter] = useState<number | null>(null);
  const [subjectFilter, setSubjectFilter] = useState("");
  const [topicFilter, setTopicFilter] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [systemFilter, setSystemFilter] = useState<string>("all");

  const { data: exams = [] } = useQuery({
    queryKey: ["/api/v1/exams"],
    queryFn: getExams,
  });

  const { data: subjects = [] } = useQuery({
    queryKey: ["/api/v1/exams", examFilter, "subjects"],
    queryFn: () => (examFilter ? getExamSubjects(examFilter) : []),
    enabled: Boolean(examFilter),
  });

  const { data: topics = [] } = useQuery({
    queryKey: ["/api/v1/exam-topics", examFilter, subjectFilter],
    queryFn: () =>
      getExamTopics({ examId: examFilter ?? undefined, subjectId: subjectFilter || undefined }),
    enabled: Boolean(examFilter && subjectFilter),
  });

  const { data, isLoading } = useQuery({
    queryKey: [
      "/api/v1/mcqs",
      {
        page,
        pageSize: 10,
        examId: examFilter ?? undefined,
        subjectId: subjectFilter || undefined,
        topicId: topicFilter || undefined,
        difficulty: difficultyFilter === "all" ? undefined : (difficultyFilter as McqDifficulty),
        system: systemFilter === "all" ? undefined : (systemFilter as McqSystem),
      },
    ],
    queryFn: () =>
      getMCQs({
        page,
        pageSize: 10,
        examId: examFilter ?? undefined,
        subjectId: subjectFilter || undefined,
        topicId: topicFilter || undefined,
        difficulty: difficultyFilter === "all" ? undefined : (difficultyFilter as McqDifficulty),
        system: systemFilter === "all" ? undefined : (systemFilter as McqSystem),
      }),
  });

  const createMutation = useMutation({
    mutationFn: createMCQ,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/v1/mcqs"] });
      setForm(emptyForm);
      setIsModalOpen(false);
      toast({ title: "MCQ created" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<FormState> }) =>
      updateMCQ(id, {
        examId: payload.examId ?? undefined,
        subjectId: payload.subjectId || undefined,
        topicId: payload.topicId || undefined,
        difficulty: payload.difficulty,
        system: payload.system,
        question: payload.question || "",
        explanation: payload.explanation || null,
        options: payload.options || [],
        correctIndex: payload.correctIndex,
        tags: payload.tags
          ? payload.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
          : [],
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/v1/mcqs"] });
      setForm(emptyForm);
      setIsModalOpen(false);
      toast({ title: "MCQ updated" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMCQ,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/v1/mcqs"] });
      toast({ title: "MCQ deleted" });
    },
  });

  const bulkUploadMutation = useMutation({
    mutationFn: bulkUploadMCQs,
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["/api/v1/mcqs"] });
      toast({
        title: "CSV upload complete",
        description: `Success: ${result.success}, Failed: ${result.failed}`,
      });
    },
    onError: (error) => {
      toast({
        title: "CSV upload failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    },
  });

  const isEditing = Boolean(form.id);
  const total = data?.total ?? 0;
  const pageSize = data?.pageSize ?? 10;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const subjectMap = useMemo(() => {
    return subjects.reduce<Record<string, string>>((acc, subject) => {
      acc[subject.id] = subject.name;
      return acc;
    }, {});
  }, [subjects]);

  const topicMap = useMemo(() => {
    return topics.reduce<Record<string, string>>((acc, topic) => {
      acc[topic.id] = topic.title;
      return acc;
    }, {});
  }, [topics]);

  const handleEdit = (mcq: McqListItem) => {
    const options = mcq.options?.length
      ? mcq.options.map((option) => option.optionText)
      : ["", "", "", ""];
    const correctIndex = mcq.options?.findIndex((option) => option.isCorrect) ?? 0;
    setExamFilter(mcq.examId);
    setSubjectFilter(mcq.subjectId);
    setTopicFilter(mcq.topicId || "");
    setForm({
      id: mcq.id,
      examId: mcq.examId,
      subjectId: mcq.subjectId,
      topicId: mcq.topicId || "",
      difficulty: mcq.difficulty,
      system: mcq.system,
      question: mcq.question || "",
      explanation: mcq.explanation || "",
      options:
        options.length >= 4 ? options.slice(0, 4) : [...options, ...new Array(4 - options.length).fill("")],
      correctIndex: correctIndex < 0 ? 0 : correctIndex,
      tags: mcq.tags?.map((tag) => tag.tag).join(", ") || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    if (!form.examId || !form.subjectId || !form.question.trim()) {
      toast({
        title: "Missing required fields",
        description: "Exam, subject, and question are required.",
        variant: "destructive",
      });
      return;
    }
    if (form.options.filter(Boolean).length < 2) {
      toast({
        title: "Missing options",
        description: "Add at least two answer options.",
        variant: "destructive",
      });
      return;
    }

    if (isEditing && form.id) {
      updateMutation.mutate({ id: form.id, payload: form });
    } else {
      createMutation.mutate({
        examId: form.examId,
        subjectId: form.subjectId,
        topicId: form.topicId || null,
        difficulty: form.difficulty,
        system: form.system,
        question: form.question.trim(),
        explanation: form.explanation.trim() || null,
        options: form.options.map((opt) => opt.trim()).filter(Boolean),
        correctIndex: form.correctIndex,
        tags: form.tags
          ? form.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
          : [],
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="MCQ Admin | Nursing Educator Hub"
        description="Manage MCQs for Nursing Educator Hub."
        canonicalPath="/admin/mcqs"
        noIndex
      />
      <section className="bg-gradient-to-r from-secondary to-accent text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">MCQ Bank</h1>
            <p className="text-secondary-foreground/90">
              Create, edit, and organize MCQs by exam, subject, topic, and system.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <Card>
          <CardContent className="p-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5 w-full">
              <Select
                value={examFilter ? String(examFilter) : "all"}
                onValueChange={(value) => {
                  const parsed = value === "all" ? null : Number(value);
                  setExamFilter(parsed);
                  setSubjectFilter("");
                  setTopicFilter("");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Exam" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Exams</SelectItem>
                  {exams.map((exam) => (
                    <SelectItem key={exam.id} value={String(exam.id)}>
                      {exam.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={subjectFilter || "all"} onValueChange={setSubjectFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={topicFilter || "all"} onValueChange={setTopicFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Topic" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Topics</SelectItem>
                  {topics.map((topic) => (
                    <SelectItem key={topic.id} value={topic.id}>
                      {topic.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulty</SelectItem>
                  {DIFFICULTY_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={systemFilter} onValueChange={setSystemFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="System" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Systems</SelectItem>
                  {BODY_SYSTEMS.map((system) => (
                    <SelectItem key={system} value={system}>
                      {system}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-wrap gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  bulkUploadMutation.mutate(file);
                  event.currentTarget.value = "";
                }}
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={bulkUploadMutation.isPending}
              >
                Upload CSV
              </Button>
              <Button
                onClick={() => {
                  setForm({
                    ...emptyForm,
                    examId: examFilter,
                    subjectId: subjectFilter || "",
                    topicId: topicFilter || "",
                  });
                  setIsModalOpen(true);
                }}
              >
                Add MCQ
              </Button>
            </div>
          </CardContent>
        </Card>

        {data?.meta && (
          <Card>
            <CardContent className="p-4 flex flex-wrap gap-3 text-xs text-slate-600">
              <span className="font-semibold text-slate-700">Difficulty:</span>
              {Object.entries(data.meta.difficulty).map(([key, value]) => (
                <Badge key={key} variant="secondary">
                  {key}: {value}
                </Badge>
              ))}
              <span className="ml-4 font-semibold text-slate-700">Systems:</span>
              {Object.entries(data.meta.system).map(([key, value]) => (
                <Badge key={key} variant="secondary">
                  {key}: {value}
                </Badge>
              ))}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Question</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Topic</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>System</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      Loading MCQs...
                    </TableCell>
                  </TableRow>
                )}
                {data?.data?.map((mcq) => (
                  <TableRow key={mcq.id}>
                    <TableCell className="font-medium max-w-[360px]">
                      {mcq.question}
                    </TableCell>
                    <TableCell>{subjectMap[mcq.subjectId] || "—"}</TableCell>
                    <TableCell>{mcq.topicId ? topicMap[mcq.topicId] || "—" : "—"}</TableCell>
                    <TableCell className="capitalize">{mcq.difficulty}</TableCell>
                    <TableCell>{mcq.system}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(mcq)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteMutation.mutate(mcq.id)}
                        disabled={deleteMutation.isPending}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {!isLoading && data?.data?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No MCQs found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <div className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </div>
          <Button
            variant="outline"
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={page >= totalPages}
          >
            Next
          </Button>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit MCQ" : "Add MCQ"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Select
                value={form.examId ? String(form.examId) : ""}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, examId: Number(value), subjectId: "", topicId: "" }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Exam" />
                </SelectTrigger>
                <SelectContent>
                  {exams.map((exam) => (
                    <SelectItem key={exam.id} value={String(exam.id)}>
                      {exam.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={form.subjectId}
                onValueChange={(value) => setForm((prev) => ({ ...prev, subjectId: value, topicId: "" }))}
                disabled={!form.examId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={form.topicId}
                onValueChange={(value) => setForm((prev) => ({ ...prev, topicId: value }))}
                disabled={!form.subjectId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Topic (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {topics.map((topic) => (
                    <SelectItem key={topic.id} value={topic.id}>
                      {topic.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={form.difficulty}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, difficulty: value as McqDifficulty }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTY_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={form.system}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, system: value as McqSystem }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Body System" />
                </SelectTrigger>
                <SelectContent>
                  {BODY_SYSTEMS.map((system) => (
                    <SelectItem key={system} value={system}>
                      {system}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Input
              placeholder="Question"
              value={form.question}
              onChange={(event) => setForm((prev) => ({ ...prev, question: event.target.value }))}
            />
            <Textarea
              placeholder="Explanation (optional)"
              value={form.explanation}
              onChange={(event) => setForm((prev) => ({ ...prev, explanation: event.target.value }))}
              rows={4}
            />

            <div className="grid md:grid-cols-2 gap-4">
              {form.options.map((option, index) => (
                <Input
                  key={`option-${index}`}
                  placeholder={`Option ${String.fromCharCode(65 + index)}`}
                  value={option}
                  onChange={(event) =>
                    setForm((prev) => {
                      const options = [...prev.options];
                      options[index] = event.target.value;
                      return { ...prev, options };
                    })
                  }
                />
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Select
                value={String(form.correctIndex)}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, correctIndex: Number(value) }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Correct option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Option A</SelectItem>
                  <SelectItem value="1">Option B</SelectItem>
                  <SelectItem value="2">Option C</SelectItem>
                  <SelectItem value="3">Option D</SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder="Tags (comma separated)"
                value={form.tags}
                onChange={(event) => setForm((prev) => ({ ...prev, tags: event.target.value }))}
              />
            </div>

            <div className="flex items-center justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setIsModalOpen(false);
                  setForm(emptyForm);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {isEditing ? "Update MCQ" : "Create MCQ"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
