import { z } from "zod";

export const createExamSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1).optional(),
  description: z.string().optional(),
  durationMinutes: z.number().int().positive().optional(),
  scoringRules: z.record(z.unknown()).optional(),
  accessLevel: z.string().min(1).optional(),
});

export const updateExamSchema = createExamSchema.partial();

export const createExamSubjectSchema = z.object({
  name: z.string().min(1),
  order: z.number().int().nonnegative().optional(),
});

export const updateExamSubjectSchema = createExamSubjectSchema.partial();

export const listExamSubjectQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().max(100).optional(),
  search: z.string().min(1).optional(),
});

export const createExamTopicSchema = z.object({
  examId: z.number().int().positive(),
  subjectId: z.string().min(1).optional(),
  parentTopicId: z.string().min(1).optional(),
  title: z.string().min(1),
  weight: z.number().int().nonnegative().optional(),
});

export const updateExamTopicSchema = createExamTopicSchema.partial();

export const listExamTopicQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().max(100).optional(),
  search: z.string().min(1).optional(),
  examId: z.coerce.number().int().positive().optional(),
  subjectId: z.string().min(1).optional(),
});
