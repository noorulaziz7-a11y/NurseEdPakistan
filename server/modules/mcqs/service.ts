import { storage, MemStorage } from "../../storage";
import { db } from "../../db";
import {
  mcqs,
  mcqOptions,
  mcqTags,
  difficultyLevels,
  examMcqs,
  exams,
} from "@shared/schema";
import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { mcqCsvRowSchema } from "./schema";

const fallbackStorage =
  process.env.NODE_ENV !== "production" ? new MemStorage() : null;

export const normalizeExam = (str: string) =>
  str.toLowerCase().replace(/[^a-z0-9]/g, "");

type QuestionFilters = {
  subject?: string;
  system?: string;
  difficulty?: string;
  limit?: number;
};

async function applyRelaxations(
  examKey: string,
  baseFilters: QuestionFilters
) {
  const { subject, system, difficulty, limit } = baseFilters;
  const relaxations = [
    { subject, difficulty, limit }, // drop system first
    { difficulty, limit }, // drop subject too
    { limit }, // drop difficulty too
  ];

  for (const filters of relaxations) {
    const questions = await storage.getExamQuestions(examKey, filters);
    if (questions.length > 0) return questions;
  }

  return [];
}

async function applyRelaxationsToFallback(
  examKey: string,
  baseFilters: QuestionFilters
) {
  if (!fallbackStorage) return [];
  const { subject, system, difficulty, limit } = baseFilters;
  const relaxations = [
    { subject, difficulty, limit },
    { difficulty, limit },
    { limit },
  ];

  for (const filters of relaxations) {
    const questions = await fallbackStorage.getExamQuestions(examKey, filters);
    if (questions.length > 0) return questions;
  }

  return [];
}

export async function getExamQuestionsWithFallback(
  examIdentifier: string,
  baseFilters: QuestionFilters
) {
  const normalizedExam = normalizeExam(examIdentifier);
  let questions = await storage.getExamQuestions(normalizedExam, baseFilters);

  if (questions.length === 0 && (baseFilters.subject || baseFilters.system || baseFilters.difficulty)) {
    questions = await applyRelaxations(normalizedExam, baseFilters);
  }

  if (questions.length === 0) {
    const exams = await storage.getAllExams();
    const exam = exams.find((e) => normalizeExam(e.id) === normalizedExam);

    if (exam?.name) {
      console.log(
        `No questions found for ID ${normalizedExam}, trying name: ${exam.name}`
      );
      let questionsByName = await storage.getExamQuestions(exam.name, baseFilters);
      if (
        questionsByName.length === 0 &&
        (baseFilters.subject || baseFilters.system || baseFilters.difficulty)
      ) {
        questionsByName = await applyRelaxations(exam.name, baseFilters);
      }
      if (questionsByName.length > 0) {
        questions = questionsByName;
      }
    }
  }

  if (questions.length === 0 && fallbackStorage) {
    let fallbackQuestions = await fallbackStorage.getExamQuestions(
      normalizedExam,
      baseFilters
    );
    if (
      fallbackQuestions.length === 0 &&
      (baseFilters.subject || baseFilters.system || baseFilters.difficulty)
    ) {
      fallbackQuestions = await applyRelaxationsToFallback(
        normalizedExam,
        baseFilters
      );
    }
    if (fallbackQuestions.length === 0) {
      const fallbackExams = await fallbackStorage.getAllExams();
      const fallbackExam = fallbackExams.find(
        (e) => normalizeExam(e.id) === normalizedExam
      );
      if (fallbackExam?.name) {
        fallbackQuestions = await fallbackStorage.getExamQuestions(
          fallbackExam.name,
          baseFilters
        );
        if (
          fallbackQuestions.length === 0 &&
          (baseFilters.subject || baseFilters.system || baseFilters.difficulty)
        ) {
          fallbackQuestions = await applyRelaxationsToFallback(
            fallbackExam.name,
            baseFilters
          );
        }
      }
    }
    if (fallbackQuestions.length > 0) {
      questions = fallbackQuestions;
    }
  }

  return questions;
}

export async function getExamQuestionsLegacy(examType: string) {
  const normalizedExam = normalizeExam(examType);
  return storage.getExamQuestions(normalizedExam);
}

export async function getExamQuestionById(id: string) {
  return storage.getExamQuestionById(id);
}

export async function getDailyChallenge(examType: string) {
  const normalizedExam = normalizeExam(examType);
  const questions = await storage.getExamQuestions(normalizedExam, { limit: 1 });
  return questions[0] || null;
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
  difficulty?: "easy" | "moderate" | "hard";
  examId?: number;
  subjectId?: string;
  topicId?: string;
  system?: string;
}) {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 20;
  const offset = (page - 1) * pageSize;

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

  const totalResult = conditions.length
    ? await db
        .select({ count: sql<number>`count(*)` })
        .from(mcqs)
        .where(and(...conditions))
    : await db.select({ count: sql<number>`count(*)` }).from(mcqs);
  const total = Number(totalResult[0]?.count ?? 0);

  const rows = conditions.length
    ? await db
        .select()
        .from(mcqs)
        .where(and(...conditions))
        .orderBy(desc(mcqs.createdAt))
        .limit(pageSize)
        .offset(offset)
    : await db
        .select()
        .from(mcqs)
        .orderBy(desc(mcqs.createdAt))
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
