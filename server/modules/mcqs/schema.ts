import { z } from "zod";

export const mcqOptionSchema = z.union([
  z.string().min(1),
  z.object({
    optionText: z.string().min(1),
    isCorrect: z.boolean().optional(),
    position: z.number().int().nonnegative().optional(),
  }),
]);

export const createMcqSchema = z.object({
  question: z.string().min(1),
  explanation: z.string().nullable().optional(),
  type: z.enum(["single", "multiple", "true_false"]).optional(),
  imageUrl: z.string().min(1).nullable().optional(),
  reference: z.string().min(1).nullable().optional(),
  year: z.coerce.number().int().optional(),
  rationaleType: z.enum(["detailed", "quick", "video"]).optional(),
  difficulty: z.enum(["easy", "moderate", "hard"]),
  options: z.array(mcqOptionSchema).min(2),
  correctIndex: z.number().int().nonnegative().optional(),
  tags: z.array(z.string().min(1)).optional(),
  examId: z.number().int().positive(),
  subjectId: z.string().min(1),
  topicId: z.string().min(1).optional(),
  system: z.enum([
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
  ]),
  createdBy: z.string().min(1).optional(),
});

export const updateMcqSchema = createMcqSchema.partial();

export const listMcqQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().max(100).optional(),
  limit: z.coerce.number().int().positive().max(200).optional(),
  random: z.preprocess(
    (value) => (typeof value === "string" ? value === "true" : value),
    z.boolean()
  ).optional(),
  adaptive: z.preprocess(
    (value) => (typeof value === "string" ? value === "true" : value),
    z.boolean()
  ).optional(),
  excludeAttempted: z.preprocess(
    (value) => (typeof value === "string" ? value === "true" : value),
    z.boolean()
  ).optional(),
  includeExplanation: z.preprocess(
    (value) => (typeof value === "string" ? value === "true" : value),
    z.boolean()
  ).optional(),
  search: z.string().min(1).optional(),
  difficulty: z.enum(["easy", "moderate", "hard"]).optional(),
  examId: z.coerce.number().int().positive().optional(),
  subjectId: z.string().min(1).optional(),
  topicId: z.string().min(1).optional(),
  system: z.enum([
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
  ]).optional(),
});

export const mcqCsvRowSchema = z.object({
  exam_id: z.coerce.number().int().positive(),
  subject_id: z.string().min(1),
  topic_id: z.string().min(1).optional(),
  question: z.string().min(1),
  type: z.enum(["single", "multiple", "true_false"]).optional(),
  image_url: z.string().min(1).optional(),
  reference: z.string().min(1).optional(),
  year: z.coerce.number().int().optional(),
  rationale_type: z.enum(["detailed", "quick", "video"]).optional(),
  option_a: z.string().min(1),
  option_b: z.string().min(1),
  option_c: z.string().min(1),
  option_d: z.string().min(1),
  correct_option: z.string().min(1),
  difficulty: z.enum(["easy", "moderate", "hard"]),
  system: z.enum([
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
  ]),
  tags: z.string().optional(),
  explanation: z.string().optional(),
});
