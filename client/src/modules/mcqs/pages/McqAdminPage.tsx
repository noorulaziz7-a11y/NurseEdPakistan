import { useMemo, useRef, useState, useEffect } from "react";
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
import { Checkbox } from "@/shared/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from "xlsx";
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
  type McqType,
  type McqRationaleType,
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
const TYPE_OPTIONS: McqType[] = ["single", "multiple", "true_false"];
const RATIONALE_OPTIONS: McqRationaleType[] = ["detailed", "quick", "video"];

type FormState = {
  id?: string;
  examId: number | null;
  subjectId: string;
  topicId: string;
  difficulty: McqDifficulty;
  system: McqSystem;
  type: McqType;
  imageUrl: string;
  reference: string;
  year: string;
  rationaleType: McqRationaleType | "";
  question: string;
  explanation: string;
  options: string[];
  correctIndices: number[];
  tags: string;
};

type UploadValidation = {
  rows: Record<string, string>[];
  errors: string[];
  csv: string;
  fileName: string;
};

const emptyForm: FormState = {
  examId: null,
  subjectId: "",
  topicId: "",
  difficulty: "moderate",
  system: "Cardiovascular",
  type: "single",
  imageUrl: "",
  reference: "",
  year: "",
  rationaleType: "",
  question: "",
  explanation: "",
  options: ["", "", "", ""],
  correctIndices: [0],
  tags: "",
};

export default function McqAdminPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [examFilter, setExamFilter] = useState<number | null>(null);
  const [subjectFilter, setSubjectFilter] = useState("");
  const [topicFilter, setTopicFilter] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [systemFilter, setSystemFilter] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [uploadValidation, setUploadValidation] = useState<UploadValidation | null>(null);
  const [isValidateOpen, setIsValidateOpen] = useState(false);

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

  useEffect(() => {
    setPage(1);
    setSelectedIds(new Set());
  }, [examFilter, subjectFilter, topicFilter, difficultyFilter, systemFilter, search, pageSize]);

  const { data, isLoading } = useQuery({
    queryKey: [
      "/api/v1/mcqs",
      {
        page,
        pageSize,
        examId: examFilter ?? undefined,
        subjectId: subjectFilter || undefined,
        topicId: topicFilter || undefined,
        difficulty: difficultyFilter === "all" ? undefined : (difficultyFilter as McqDifficulty),
        system: systemFilter === "all" ? undefined : (systemFilter as McqSystem),
        search: search.trim() || undefined,
      },
    ],
    queryFn: () =>
      getMCQs({
        page,
        pageSize,
        examId: examFilter ?? undefined,
        subjectId: subjectFilter || undefined,
        topicId: topicFilter || undefined,
        difficulty: difficultyFilter === "all" ? undefined : (difficultyFilter as McqDifficulty),
        system: systemFilter === "all" ? undefined : (systemFilter as McqSystem),
        search: search.trim() || undefined,
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
        type: payload.type,
        imageUrl: payload.imageUrl || null,
        reference: payload.reference || null,
        year: payload.year ? Number(payload.year) : null,
        rationaleType: payload.rationaleType || null,
        question: payload.question || "",
        explanation: payload.explanation || null,
        options: payload.options && payload.correctIndices
          ? buildOptionsPayload({
              ...emptyForm,
              ...payload,
              correctIndices: payload.correctIndices,
              options: payload.options,
            })
          : [],
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
  const resolvedPageSize = data?.pageSize ?? pageSize;
  const totalPages = Math.max(1, Math.ceil(total / resolvedPageSize));

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

  useEffect(() => {
    if (!previewId && data?.data && data.data.length > 0) {
      setPreviewId(data.data[0].id);
    }
  }, [data?.data, previewId]);

  const previewItem = useMemo(() => {
    if (!data?.data) return null;
    return data.data.find((item) => item.id === previewId) || null;
  }, [data?.data, previewId]);

  const duplicateWarning = useMemo(() => {
    if (!form.question.trim() || !data?.data) return null;
    const normalized = form.question.trim().toLowerCase();
    return data.data.find(
      (item) => item.question.trim().toLowerCase() === normalized && item.id !== form.id
    );
  }, [form.question, form.id, data?.data]);

  const handleEdit = (mcq: McqListItem) => {
    const options = mcq.options?.length
      ? mcq.options.map((option) => option.optionText)
      : ["", "", "", ""];
    const correctIndices =
      mcq.options?.reduce<number[]>((acc, option, index) => {
        if (option.isCorrect) acc.push(index);
        return acc;
      }, []) ?? [];
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
      type: mcq.type || "single",
      imageUrl: mcq.imageUrl || "",
      reference: mcq.reference || "",
      year: mcq.year ? String(mcq.year) : "",
      rationaleType: mcq.rationaleType || "",
      question: mcq.question || "",
      explanation: mcq.explanation || "",
      options:
        options.length >= 4 ? options.slice(0, 4) : [...options, ...new Array(4 - options.length).fill("")],
      correctIndices: correctIndices.length > 0 ? correctIndices : [0],
      tags: mcq.tags?.map((tag) => tag.tag).join(", ") || "",
    });
    setIsModalOpen(true);
  };

  const buildOptionsPayload = (state: FormState) =>
    state.options.map((optionText, index) => ({
      optionText: optionText.trim(),
      isCorrect: state.correctIndices.includes(index),
      position: index,
    }));

  const normalizeHeader = (value: string) =>
    value.trim().toLowerCase().replace(/[\s-]+/g, "_");

  const toCsv = (rows: Record<string, string>[]) => {
    if (rows.length === 0) return "";
    const headers = Object.keys(rows[0]);
    const escape = (value: string) => {
      if (value.includes(",") || value.includes("\"") || value.includes("\n")) {
        return `"${value.replace(/"/g, "\"\"")}"`;
      }
      return value;
    };
    const lines = rows.map((row) =>
      headers.map((header) => escape(row[header] ?? "")).join(",")
    );
    return [headers.join(","), ...lines].join("\n");
  };

  const validateRows = (rows: Record<string, string>[]) => {
    const required = [
      "exam_id",
      "subject_id",
      "question",
      "option_a",
      "option_b",
      "option_c",
      "option_d",
      "correct_option",
      "difficulty",
      "system",
    ];
    const errors: string[] = [];
    const seenQuestions = new Set<string>();

    rows.forEach((row, index) => {
      required.forEach((field) => {
        if (!row[field]) {
          errors.push(`Row ${index + 2}: Missing ${field}`);
        }
      });
      const q = row.question?.trim().toLowerCase();
      if (q) {
        if (seenQuestions.has(q)) {
          errors.push(`Row ${index + 2}: Duplicate question in file`);
        }
        seenQuestions.add(q);
      }
    });
    return errors;
  };

  const parseUploadFile = async (file: File) => {
    const extension = file.name.split(".").pop()?.toLowerCase();
    if (extension === "xlsx" || extension === "xls") {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const rawRows = XLSX.utils.sheet_to_json<Record<string, string>>(worksheet, {
        defval: "",
      });
      const rows = rawRows.map((row) => {
        const normalized: Record<string, string> = {};
        Object.entries(row).forEach(([key, value]) => {
          normalized[normalizeHeader(String(key))] = String(value ?? "");
        });
        return normalized;
      });
      return rows;
    }

    const text = await file.text();
    const lines = text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
    if (lines.length === 0) return [];
    const headers = lines[0].split(",").map(normalizeHeader);
    return lines.slice(1).map((line) => {
      const values = line.split(",").map((value) => value.trim());
      return Object.fromEntries(headers.map((key, idx) => [key, values[idx] ?? ""]));
    });
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
    if (form.correctIndices.length === 0) {
      toast({
        title: "Missing correct answers",
        description: "Select at least one correct option.",
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
        type: form.type,
        imageUrl: form.imageUrl || null,
        reference: form.reference || null,
        year: form.year ? Number(form.year) : null,
        rationaleType: form.rationaleType || null,
        question: form.question.trim(),
        explanation: form.explanation.trim() || null,
        options: buildOptionsPayload(form).filter((opt) => opt.optionText),
        tags: form.tags
          ? form.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
          : [],
      });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    await Promise.all(Array.from(selectedIds).map((id) => deleteMCQ(id)));
    queryClient.invalidateQueries({ queryKey: ["/api/v1/mcqs"] });
    setSelectedIds(new Set());
    toast({ title: "Selected MCQs deleted" });
  };

  const handleExport = () => {
    const rows = (data?.data || []).map((mcq) => ({
      id: mcq.id,
      question: mcq.question,
      exam_id: String(mcq.examId),
      subject_id: mcq.subjectId,
      topic_id: mcq.topicId || "",
      difficulty: mcq.difficulty,
      system: mcq.system,
      type: mcq.type || "single",
      image_url: mcq.imageUrl || "",
      reference: mcq.reference || "",
      year: mcq.year ? String(mcq.year) : "",
      rationale_type: mcq.rationaleType || "",
      tags: mcq.tags?.map((tag) => tag.tag).join("|") || "",
      explanation: mcq.explanation || "",
    }));
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "MCQs");
    XLSX.writeFile(workbook, "mcqs_export.xlsx");
  };

  const handleUploadValidate = async (file: File) => {
    const rows = await parseUploadFile(file);
    if (rows.length === 0) {
      toast({ title: "Upload failed", description: "File is empty.", variant: "destructive" });
      return;
    }
    const errors = validateRows(rows);
    const csv = toCsv(rows);
    setUploadValidation({
      rows,
      errors,
      csv,
      fileName: file.name,
    });
    setIsValidateOpen(true);
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
        <div className="grid gap-6 lg:grid-cols-[2.3fr_1fr]">
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="grid gap-3 md:grid-cols-[1.4fr_1fr]">
                  <Input
                    placeholder="Search by question text..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Select value={String(pageSize)} onValueChange={(value) => setPageSize(Number(value))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Rows" />
                      </SelectTrigger>
                      <SelectContent>
                        {[10, 20, 30, 50].map((size) => (
                          <SelectItem key={size} value={String(size)}>
                            {size} per page
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={handleExport}>
                      Export Excel
                    </Button>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
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

                <div className="flex flex-wrap items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (!file) return;
                      handleUploadValidate(file);
                      event.currentTarget.value = "";
                    }}
                  />
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Validate Upload
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleBulkDelete}
                    disabled={selectedIds.size === 0}
                  >
                    Bulk Delete
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
                      <TableHead className="w-[40px]">
                        <Checkbox
                          checked={selectedIds.size > 0 && selectedIds.size === (data?.data?.length || 0)}
                          onCheckedChange={(checked) => {
                            if (!data?.data) return;
                            if (checked) {
                              setSelectedIds(new Set(data.data.map((item) => item.id)));
                            } else {
                              setSelectedIds(new Set());
                            }
                          }}
                        />
                      </TableHead>
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
                        <TableCell colSpan={7} className="text-center text-muted-foreground">
                          Loading MCQs...
                        </TableCell>
                      </TableRow>
                    )}
                    {data?.data?.map((mcq) => (
                      <TableRow key={mcq.id} onClick={() => setPreviewId(mcq.id)} className="cursor-pointer">
                        <TableCell onClick={(event) => event.stopPropagation()}>
                          <Checkbox
                            checked={selectedIds.has(mcq.id)}
                            onCheckedChange={(checked) => {
                              setSelectedIds((prev) => {
                                const next = new Set(prev);
                                if (checked) next.add(mcq.id);
                                else next.delete(mcq.id);
                                return next;
                              });
                            }}
                          />
                        </TableCell>
                        <TableCell className="font-medium max-w-[360px]">
                          {mcq.question}
                        </TableCell>
                        <TableCell>{subjectMap[mcq.subjectId] || "—"}</TableCell>
                        <TableCell>{mcq.topicId ? topicMap[mcq.topicId] || "—" : "—"}</TableCell>
                        <TableCell className="capitalize">{mcq.difficulty}</TableCell>
                        <TableCell>{mcq.system}</TableCell>
                        <TableCell className="text-right space-x-2" onClick={(event) => event.stopPropagation()}>
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
                        <TableCell colSpan={7} className="text-center text-muted-foreground">
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

          <PreviewPanel item={previewItem} subjectMap={subjectMap} topicMap={topicMap} />
        </div>
      </div>

      <McqFormDialog
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        isEditing={isEditing}
        form={form}
        setForm={setForm}
        exams={exams}
        subjects={subjects}
        topics={topics}
        duplicateWarning={duplicateWarning}
        onSubmit={handleSubmit}
        onCancel={() => {
          setIsModalOpen(false);
          setForm(emptyForm);
        }}
      />

      <UploadValidationModal
        open={isValidateOpen}
        onOpenChange={setIsValidateOpen}
        validation={uploadValidation}
        onConfirm={() => {
          if (!uploadValidation) return;
          const file = new File([uploadValidation.csv], "mcqs.csv", {
            type: "text/csv",
          });
          bulkUploadMutation.mutate(file);
          setIsValidateOpen(false);
        }}
      />
    </div>
  );
}

type PreviewPanelProps = {
  item: McqListItem | null;
  subjectMap: Record<string, string>;
  topicMap: Record<string, string>;
};

function PreviewPanel({ item, subjectMap, topicMap }: PreviewPanelProps) {
  if (!item) {
    return (
      <Card className="h-fit">
        <CardContent className="p-6 text-sm text-muted-foreground">
          Select an MCQ to preview.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-fit sticky top-6">
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Preview</p>
          <h3 className="text-lg font-semibold text-slate-900">{item.question}</h3>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <Badge variant="secondary">{subjectMap[item.subjectId] || item.subjectId}</Badge>
          <Badge variant="secondary">{item.topicId ? topicMap[item.topicId] || item.topicId : "No topic"}</Badge>
          <Badge variant="secondary" className="capitalize">{item.difficulty}</Badge>
          <Badge variant="secondary">{item.system}</Badge>
          <Badge variant="secondary">{item.type || "single"}</Badge>
        </div>
        {item.imageUrl && (
          <img
            src={item.imageUrl}
            alt="MCQ visual"
            className="rounded-xl border border-slate-200"
          />
        )}
        <div className="space-y-2">
          {(item.options || []).map((option) => (
            <div
              key={option.id ?? option.optionText}
              className={`rounded-lg border px-3 py-2 text-sm ${option.isCorrect ? "border-emerald-400 bg-emerald-50" : "border-slate-200"}`}
            >
              {option.optionText}
            </div>
          ))}
        </div>
        {item.explanation && (
          <div className="text-sm text-slate-600">{item.explanation}</div>
        )}
      </CardContent>
    </Card>
  );
}

type McqFormDialogProps = {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  isEditing: boolean;
  form: FormState;
  setForm: (value: FormState | ((prev: FormState) => FormState)) => void;
  exams: { id: number; name: string }[];
  subjects: { id: string; name: string }[];
  topics: { id: string; title: string }[];
  duplicateWarning: McqListItem | null;
  onSubmit: () => void;
  onCancel: () => void;
};

function McqFormDialog({
  open,
  onOpenChange,
  isEditing,
  form,
  setForm,
  exams,
  subjects,
  topics,
  duplicateWarning,
  onSubmit,
  onCancel,
}: McqFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit MCQ" : "Add MCQ"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
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

              <Select
                value={form.type}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, type: value as McqType }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Question Type" />
                </SelectTrigger>
                <SelectContent>
                  {TYPE_OPTIONS.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={form.rationaleType}
                onValueChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    rationaleType: value === "none" ? "" : (value as McqRationaleType),
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Rationale Type (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {RATIONALE_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Input
                placeholder="Image URL (optional)"
                value={form.imageUrl}
                onChange={(event) => setForm((prev) => ({ ...prev, imageUrl: event.target.value }))}
              />
              <Input
                placeholder="Reference (optional)"
                value={form.reference}
                onChange={(event) => setForm((prev) => ({ ...prev, reference: event.target.value }))}
              />
              <Input
                placeholder="Year (optional)"
                value={form.year}
                onChange={(event) => setForm((prev) => ({ ...prev, year: event.target.value }))}
              />
            </div>

            <Input
              placeholder="Question"
              value={form.question}
              onChange={(event) => setForm((prev) => ({ ...prev, question: event.target.value }))}
            />
            {duplicateWarning && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                A similar question already exists: "{duplicateWarning.question.slice(0, 90)}..."
              </div>
            )}
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
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Correct options
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {form.options.map((_, index) => {
                    const label = `Option ${String.fromCharCode(65 + index)}`;
                    const checked = form.correctIndices.includes(index);
                    return (
                      <label key={label} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(event) =>
                            setForm((prev) => {
                              const next = event.target.checked
                                ? [...prev.correctIndices, index]
                                : prev.correctIndices.filter((item) => item !== index);
                              return { ...prev, correctIndices: next };
                            })
                          }
                        />
                        {label}
                      </label>
                    );
                  })}
                </div>
                {form.type !== "multiple" && form.correctIndices.length > 1 && (
                  <p className="text-xs text-amber-600">
                    Multiple correct answers selected. Switch to "multiple" type if needed.
                  </p>
                )}
              </div>

              <Input
                placeholder="Tags (comma separated)"
                value={form.tags}
                onChange={(event) => setForm((prev) => ({ ...prev, tags: event.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-4">
            <Card>
              <CardContent className="p-4 space-y-3">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Live Preview</p>
                <p className="text-sm font-semibold">{form.question || "Preview question"}</p>
                <div className="space-y-2 text-sm">
                  {form.options.map((opt, idx) => (
                    <div
                      key={idx}
                      className={`rounded-lg border px-3 py-2 ${form.correctIndices.includes(idx) ? "border-emerald-300 bg-emerald-50" : "border-slate-200"}`}
                    >
                      {opt || `Option ${String.fromCharCode(65 + idx)}`}
                    </div>
                  ))}
                </div>
                {form.explanation && (
                  <div className="text-xs text-slate-500">{form.explanation}</div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>{isEditing ? "Update MCQ" : "Create MCQ"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

type UploadValidationModalProps = {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  validation: UploadValidation | null;
  onConfirm: () => void;
};

function UploadValidationModal({
  open,
  onOpenChange,
  validation,
  onConfirm,
}: UploadValidationModalProps) {
  const errorPreview = validation?.errors.slice(0, 6) || [];
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Validate Upload</DialogTitle>
        </DialogHeader>
        {!validation ? (
          <p className="text-sm text-muted-foreground">No file selected.</p>
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              File: {validation.fileName} • Rows: {validation.rows.length}
            </div>
            {validation.errors.length > 0 ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                <p className="font-semibold mb-2">Validation issues</p>
                <ul className="list-disc pl-4 space-y-1">
                  {errorPreview.map((error) => (
                    <li key={error}>{error}</li>
                  ))}
                </ul>
                {validation.errors.length > errorPreview.length && (
                  <p className="mt-2 text-xs">
                    +{validation.errors.length - errorPreview.length} more issues
                  </p>
                )}
              </div>
            ) : (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                Validation passed. Ready to upload.
              </div>
            )}
          </div>
        )}
        <div className="flex items-center justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={onConfirm} disabled={!validation || validation.errors.length > 0}>
            Upload
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
