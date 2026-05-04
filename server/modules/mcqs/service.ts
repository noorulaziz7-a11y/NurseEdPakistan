import { db } from "../../db";
import {
  mcqs,
  mcqOptions,
  mcqTags,
  difficultyLevels,
  examMcqs,
  exams,
  attemptAnswers,
  examAttempts,
} from "@shared/schema";
import { and, desc, eq, ilike, inArray, sql } from "drizzle-orm";
import { mcqCsvRowSchema } from "./schema";

export const normalizeExam = (str: string) =>
  str.toLowerCase().replace(/[^a-z0-9]/g, "");
async function resolveExamId(examIdentifier: string) {
  const numeric = Number(examIdentifier);
  if (Number.isFinite(numeric)) return numeric;
  const normalized = normalizeExam(examIdentifier);
  const rows = await db.select({ id: exams.id, name: exams.name }).from(exams);
  const match = rows.find((row) => normalizeExam(row.name) === normalized);
  return match?.id ?? null;
}

export async function getDailyChallenge(examType: string) {
  const examId = await resolveExamId(examType);
  if (!examId) return null;
  const [row] = await db
    .select({ id: mcqs.id })
    .from(mcqs)
    .where(eq(mcqs.examId, examId))
    .orderBy(sql`RANDOM()`)
    .limit(1);
  if (!row) return null;
  return getMcqById(row.id);
}

export function getDailyChallengeStats() {
  return { streak: 0, totalCompleted: 0, averageScore: 0 };
}

type McqOptionInput =
  | string
  | {
      optionText: string;
      isCorrect?: boolean;
      position?: number;
    };

type McqPayload = {
  question: string;
  explanation?: string | null;
  type?: "single" | "multiple" | "true_false";
  imageUrl?: string | null;
  reference?: string | null;
  year?: number | null;
  rationaleType?: "detailed" | "quick" | "video" | null;
  difficulty?: "easy" | "moderate" | "hard" | null;
  options: McqOptionInput[];
  correctIndex?: number | null;
  tags?: string[] | null;
  examId: number;
  subjectId: string;
  topicId?: string | null;
  system: string;
  createdBy?: string | null;
};

function normalizeOptions(
  options: McqOptionInput[],
  correctIndex?: number | null
) {
  return options.map((option, idx) => {
    if (typeof option === "string") {
      return {
        optionText: option,
        isCorrect: correctIndex === idx,
        position: idx,
      };
    }
    return {
      optionText: option.optionText,
      isCorrect: option.isCorrect ?? correctIndex === idx,
      position: option.position ?? idx,
    };
  });
}

async function resolveDifficultyId(name?: string | null) {
  if (!name) return null;
  const normalized = name.toLowerCase().trim();
  if (!normalized) return null;

  const [existing] = await db
    .select()
    .from(difficultyLevels)
    .where(eq(difficultyLevels.name, normalized));
  if (existing) return existing.id;

  const [created] = await db
    .insert(difficultyLevels)
    .values({ name: normalized })
    .returning();
  return created.id;
}

function mapDifficultyToLevelName(value?: McqPayload["difficulty"]) {
  if (!value) return null;
  if (value === "moderate") return "medium";
  return value;
}

export async function createMCQ(payload: McqPayload) {
  const question = payload.question ?? (payload as { stem?: string }).stem ?? "";
  const difficultyId = await resolveDifficultyId(
    mapDifficultyToLevelName(payload.difficulty) ?? null
  );
  const optionRows = normalizeOptions(
    payload.options,
    payload.correctIndex ?? null
  );
  const tags = (payload.tags || []).filter(Boolean);
  const topicId = payload.topicId?.trim() || null;

  return await db.transaction(async (tx) => {
    const [mcq] = await tx
      .insert(mcqs)
      .values({
        question,
        explanation: payload.explanation ?? null,
        type: payload.type ?? "single",
        imageUrl: payload.imageUrl ?? null,
        reference: payload.reference ?? null,
        year: payload.year ?? null,
        rationaleType: payload.rationaleType ?? null,
        examId: payload.examId,
        subjectId: payload.subjectId,
        topicId,
        difficulty: payload.difficulty ?? "moderate",
        system: payload.system,
        difficultyId,
        createdBy: payload.createdBy ?? null,
      })
      .returning();

    if (optionRows.length > 0) {
      await tx.insert(mcqOptions).values(
        optionRows.map((option) => ({
          ...option,
          mcqId: mcq.id,
        }))
      );
    }

    if (tags.length > 0) {
      await tx.insert(mcqTags).values(
        tags.map((tag) => ({
          mcqId: mcq.id,
          tag,
        }))
      );
    }

    if (payload.examId) {
      await tx.insert(examMcqs).values({
        examId: payload.examId,
        mcqId: mcq.id,
      });
    }

    return mcq;
  });
}

export async function updateMCQ(id: string, payload: Partial<McqPayload>) {
  let difficultyId: number | null | undefined = undefined;
  if (payload.difficulty !== undefined) {
    difficultyId = await resolveDifficultyId(
      mapDifficultyToLevelName(payload.difficulty) ?? null
    );
  }
  const question = payload.question ?? (payload as { stem?: string }).stem;
  const topicId =
    payload.topicId !== undefined ? payload.topicId?.trim() || null : undefined;
  const updateFields: Partial<typeof mcqs.$inferInsert> = {
    question,
    explanation: payload.explanation,
    type: payload.type,
    imageUrl: payload.imageUrl,
    reference: payload.reference,
    year: payload.year,
    rationaleType: payload.rationaleType,
    examId: payload.examId,
    subjectId: payload.subjectId,
    topicId,
    difficulty: payload.difficulty,
    system: payload.system,
    difficultyId,
    createdBy: payload.createdBy,
    updatedAt: new Date(),
  };

  Object.keys(updateFields).forEach((key) => {
    if (updateFields[key as keyof typeof updateFields] === undefined) {
      delete updateFields[key as keyof typeof updateFields];
    }
  });

  return await db.transaction(async (tx) => {
    const [mcq] = await tx
      .update(mcqs)
      .set(updateFields)
      .where(eq(mcqs.id, id))
      .returning();

    if (!mcq) return null;

    if (payload.options) {
      const optionRows = normalizeOptions(
        payload.options,
        payload.correctIndex ?? null
      );
      await tx.delete(mcqOptions).where(eq(mcqOptions.mcqId, id));
      if (optionRows.length > 0) {
        await tx.insert(mcqOptions).values(
          optionRows.map((option) => ({
            ...option,
            mcqId: id,
          }))
        );
      }
    }

    if (payload.tags) {
      await tx.delete(mcqTags).where(eq(mcqTags.mcqId, id));
      const tags = payload.tags.filter(Boolean);
      if (tags.length > 0) {
        await tx.insert(mcqTags).values(
          tags.map((tag) => ({
            mcqId: id,
            tag,
          }))
        );
      }
    }

    if (payload.examId !== undefined) {
      await tx.delete(examMcqs).where(eq(examMcqs.mcqId, id));
      if (payload.examId) {
        await tx.insert(examMcqs).values({
          examId: payload.examId,
          mcqId: id,
        });
      }
    }

    return mcq;
  });
}

export async function deleteMCQ(id: string) {
  const [deleted] = await db
    .delete(mcqs)
    .where(eq(mcqs.id, id))
    .returning();
  return deleted || null;
}

export async function getMcqById(id: string) {
  const [mcq] = await db.select().from(mcqs).where(eq(mcqs.id, id));
  if (!mcq) return null;

  const [options, tags] = await Promise.all([
    db.select().from(mcqOptions).where(eq(mcqOptions.mcqId, id)),
    db.select().from(mcqTags).where(eq(mcqTags.mcqId, id)),
  ]);

  return {
    ...mcq,
    options,
    tags,
  };
}

export async function listMcqs(params: {
  page?: number;
  pageSize?: number;
  limit?: number;
  random?: boolean;
  adaptive?: boolean;
  excludeAttempted?: boolean;
  includeExplanation?: boolean;
  search?: string;
  difficulty?: "easy" | "moderate" | "hard";
  examId?: number;
  subjectId?: string;
  topicId?: string;
  system?: string;
  userId?: string | null;
}) {
  const page = params.page ?? 1;
  const pageSize = params.limit ?? params.pageSize ?? 20;
  const offset = params.limit ? 0 : (page - 1) * pageSize;

  const conditions = [];
  if (params.difficulty) {
    conditions.push(eq(mcqs.difficulty, params.difficulty));
  }
  if (params.examId) {
    conditions.push(eq(mcqs.examId, params.examId));
  }
  if (params.subjectId) {
    conditions.push(eq(mcqs.subjectId, params.subjectId));
  }
  if (params.topicId) {
    conditions.push(eq(mcqs.topicId, params.topicId));
  }
  if (params.system) {
    conditions.push(eq(mcqs.system, params.system));
  }
  if (params.search) {
    conditions.push(ilike(mcqs.question, `%${params.search}%`));
  }
  if (params.excludeAttempted && params.userId) {
    conditions.push(
      sql`NOT EXISTS (
        SELECT 1 FROM ${attemptAnswers} aa
        JOIN ${examAttempts} ea ON aa.attempt_id = ea.id
        WHERE ea.user_id = ${params.userId}
          AND aa.mcq_id = ${mcqs.id}
      )`
    );
  }

  const totalResult = conditions.length
    ? await db
        .select({ count: sql<number>`count(*)` })
        .from(mcqs)
        .where(and(...conditions))
    : await db.select({ count: sql<number>`count(*)` }).from(mcqs);
  const total = Number(totalResult[0]?.count ?? 0);

  const includeExplanation = params.includeExplanation !== false;
  const selectFields = {
    id: mcqs.id,
    question: mcqs.question,
    explanation: includeExplanation ? mcqs.explanation : sql<null>`null`,
    type: mcqs.type,
    imageUrl: mcqs.imageUrl,
    reference: mcqs.reference,
    year: mcqs.year,
    rationaleType: mcqs.rationaleType,
    examId: mcqs.examId,
    subjectId: mcqs.subjectId,
    topicId: mcqs.topicId,
    difficulty: mcqs.difficulty,
    system: mcqs.system,
    difficultyId: mcqs.difficultyId,
    createdBy: mcqs.createdBy,
    createdAt: mcqs.createdAt,
    updatedAt: mcqs.updatedAt,
  };
  const orderByClause = params.random ? sql`RANDOM()` : desc(mcqs.createdAt);
  const baseQuery = conditions.length
    ? db.select(selectFields).from(mcqs).where(and(...conditions))
    : db.select(selectFields).from(mcqs);
  const rows = await baseQuery
    .orderBy(orderByClause)
    .limit(pageSize)
    .offset(offset);

  const ids = rows.map((row) => row.id);
  if (ids.length === 0) {
    return {
      data: [],
      page,
      pageSize,
      total,
      meta: { difficulty: {}, system: {} },
    };
  }

  const [options, tags] = await Promise.all([
    db.select().from(mcqOptions).where(inArray(mcqOptions.mcqId, ids)),
    db.select().from(mcqTags).where(inArray(mcqTags.mcqId, ids)),
  ]);

  const data = rows.map((mcq) => ({
    ...mcq,
    options: options.filter((option) => option.mcqId === mcq.id),
    tags: tags.filter((tag) => tag.mcqId === mcq.id),
  }));

  const difficultyCounts = conditions.length
    ? await db
        .select({
          difficulty: mcqs.difficulty,
          count: sql<number>`count(*)`,
        })
        .from(mcqs)
        .where(and(...conditions))
        .groupBy(mcqs.difficulty)
    : await db
        .select({
          difficulty: mcqs.difficulty,
          count: sql<number>`count(*)`,
        })
        .from(mcqs)
        .groupBy(mcqs.difficulty);

  const systemCounts = conditions.length
    ? await db
        .select({
          system: mcqs.system,
          count: sql<number>`count(*)`,
        })
        .from(mcqs)
        .where(and(...conditions))
        .groupBy(mcqs.system)
    : await db
        .select({
          system: mcqs.system,
          count: sql<number>`count(*)`,
        })
        .from(mcqs)
        .groupBy(mcqs.system);

  return {
    data,
    page,
    pageSize,
    total,
    meta: {
      difficulty: difficultyCounts.reduce<Record<string, number>>((acc, row) => {
        acc[row.difficulty] = Number(row.count);
        return acc;
      }, {}),
      system: systemCounts.reduce<Record<string, number>>((acc, row) => {
        acc[row.system] = Number(row.count);
        return acc;
      }, {}),
    },
  };
}

export async function getByExam(examId: number) {
  const links = await db
    .select()
    .from(examMcqs)
    .where(eq(examMcqs.examId, examId));

  if (links.length === 0) return [];

  const mcqIds = links.map((link) => link.mcqId);
  const mcqRows = await db
    .select()
    .from(mcqs)
    .where(inArray(mcqs.id, mcqIds));

  const [optionRows, tagRows, examRow] = await Promise.all([
    db.select().from(mcqOptions).where(inArray(mcqOptions.mcqId, mcqIds)),
    db.select().from(mcqTags).where(inArray(mcqTags.mcqId, mcqIds)),
    db.select().from(exams).where(eq(exams.id, examId)),
  ]);

  return mcqRows.map((mcq) => ({
    ...mcq,
    exam: examRow[0] || null,
    options: optionRows.filter((option) => option.mcqId === mcq.id),
    tags: tagRows.filter((tag) => tag.mcqId === mcq.id),
  }));
}

function parseCsvLine(line: string) {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === "\"") {
      if (inQuotes && line[i + 1] === "\"") {
        current += "\"";
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
      continue;
    }
    current += char;
  }
  result.push(current.trim());
  return result;
}

function normalizeCsvHeader(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
}

function parseTags(value?: string) {
  if (!value) return [];
  return value
    .split(/[|;,]/)
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function resolveCorrectIndex(
  correctOption: string,
  options: string[]
): number | null {
  const normalized = correctOption.trim().toLowerCase();
  if (!normalized) return null;
  const letterIndex = ["a", "b", "c", "d"].indexOf(normalized);
  if (letterIndex >= 0) return letterIndex;
  const optionIndex = options.findIndex(
    (option) => option.trim().toLowerCase() === normalized
  );
  return optionIndex >= 0 ? optionIndex : null;
}

export async function bulkUploadCsvFile(csv: string) {
  const lines = csv
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) return { success: 0, failed: 0 };

  const headers = parseCsvLine(lines[0]).map(normalizeCsvHeader);
  const rows = lines.slice(1);
  let success = 0;
  let failed = 0;

  for (const row of rows) {
    try {
      const values = parseCsvLine(row);
      const record = Object.fromEntries(
        headers.map((key, idx) => [key, values[idx] ?? ""])
      ) as Record<string, string>;
      if (record.examid && !record.exam_id) {
        record.exam_id = record.examid;
      }
      if (record.subjectid && !record.subject_id) {
        record.subject_id = record.subjectid;
      }
      if (record.topicid && !record.topic_id) {
        record.topic_id = record.topicid;
      }
      if (record.imageurl && !record.image_url) {
        record.image_url = record.imageurl;
      }
      if (record.rationaletype && !record.rationale_type) {
        record.rationale_type = record.rationaletype;
      }
      const parsed = mcqCsvRowSchema.parse(record);

      const options = [
        parsed.option_a,
        parsed.option_b,
        parsed.option_c,
        parsed.option_d,
      ];
      const correctIndex = resolveCorrectIndex(parsed.correct_option, options);

      if (correctIndex === null) {
        failed += 1;
        continue;
      }

      const existing = await db
        .select({ id: mcqs.id })
        .from(mcqs)
        .where(eq(mcqs.question, parsed.question))
        .limit(1);
      if (existing.length > 0) {
        failed += 1;
        continue;
      }

      await db.transaction(async (tx) => {
        const difficultyId = await resolveDifficultyId(
          mapDifficultyToLevelName(parsed.difficulty) ?? null
        );
        const [mcq] = await tx
          .insert(mcqs)
          .values({
            examId: parsed.exam_id,
            subjectId: parsed.subject_id,
            topicId: parsed.topic_id || null,
            question: parsed.question,
            explanation: parsed.explanation || null,
            type: parsed.type ?? "single",
            imageUrl: parsed.image_url || null,
            reference: parsed.reference || null,
            year: parsed.year ?? null,
            rationaleType: parsed.rationale_type ?? null,
            difficulty: parsed.difficulty,
            system: parsed.system,
            difficultyId,
          })
          .returning();

        const optionRows = normalizeOptions(options, correctIndex);
        await tx.insert(mcqOptions).values(
          optionRows.map((option) => ({
            ...option,
            mcqId: mcq.id,
          }))
        );

        const tags = parseTags(parsed.tags);
        if (tags.length > 0) {
          await tx.insert(mcqTags).values(
            tags.map((tag) => ({
              mcqId: mcq.id,
              tag,
            }))
          );
        }
      });

      success += 1;
    } catch {
      failed += 1;
    }
  }

  return { success, failed };
}

export async function bulkUploadCSV(csv: string) {
  const lines = csv
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) return { created: 0, failed: 0 };

  const headers = parseCsvLine(lines[0]).map((h) => h.toLowerCase());
  const rows = lines.slice(1);
  let created = 0;
  let failed = 0;

  for (const row of rows) {
    try {
      const values = parseCsvLine(row);
      const record = Object.fromEntries(
        headers.map((key, idx) => [key, values[idx]])
      );

      const options = record.options
        ? record.options.split("|").map((opt: string) => opt.trim())
        : [];
      const correctIndex = record.correctindex
        ? Number(record.correctindex)
        : null;
      const tags = record.tags
        ? record.tags.split("|").map((tag: string) => tag.trim())
        : [];
      const examId = record.examid ? Number(record.examid) : null;
      const question = record.question || record.stem;

      if (!question || options.length === 0) {
        failed += 1;
        continue;
      }

      await createMCQ({
        question,
        explanation: record.explanation || null,
        difficultyName: record.difficulty || record.difficultycode || null,
        options,
        correctIndex,
        tags,
        examId,
      });

      created += 1;
    } catch {
      failed += 1;
    }
  }

  return { created, failed };
}
