import { storage } from "../../storage";
import { db } from "../../db";
import {
  examAttempts,
  attemptAnswers,
  examResults,
  examMcqs,
  exams,
  examSubjects,
  examTopics,
  mcqs,
  mcqOptions,
  mcqTags,
  difficultyLevels,
} from "@shared/schema";
import { and, asc, eq, ilike, inArray, sql } from "drizzle-orm";

export async function getAllExams() {
  if (!process.env.DATABASE_URL) {
    return storage.getAllExams();
  }
  try {
    return await db.select().from(exams);
  } catch (error) {
    console.warn("Falling back to memory exams:", error);
    return storage.getAllExams();
  }
}

export async function getExamById(id: string) {
  if (!process.env.DATABASE_URL) {
    const items = await storage.getAllExams();
    return items.find((e) => e.id.toString() === id);
  }
  try {
    const [exam] = await db
      .select()
      .from(exams)
      .where(eq(exams.id, Number(id)));
    return exam || null;
  } catch (error) {
    console.warn("Falling back to memory exam lookup:", error);
    const items = await storage.getAllExams();
    return items.find((e) => e.id.toString() === id) || null;
  }
}

export async function createExam(payload: {
  name: string;
  category?: string;
  description?: string;
  durationMinutes?: number;
  scoringRules?: Record<string, unknown>;
  accessLevel?: string;
}) {
  const [exam] = await db
    .insert(exams)
    .values({
      name: payload.name,
      category: payload.category ?? null,
      description: payload.description ?? null,
      durationMinutes: payload.durationMinutes ?? null,
      scoringRules: payload.scoringRules ?? {},
      accessLevel: payload.accessLevel ?? "free",
    })
    .returning();
  return exam;
}

export async function updateExam(
  id: number,
  payload: Partial<{
    name: string;
    category: string;
    description: string;
    durationMinutes: number;
    scoringRules: Record<string, unknown>;
    accessLevel: string;
  }>
) {
  const [exam] = await db
    .update(exams)
    .set({
      name: payload.name,
      category: payload.category,
      description: payload.description,
      durationMinutes: payload.durationMinutes,
      scoringRules: payload.scoringRules,
      accessLevel: payload.accessLevel,
    })
    .where(eq(exams.id, id))
    .returning();
  return exam || null;
}

export async function deleteExam(id: number) {
  const [deleted] = await db.delete(exams).where(eq(exams.id, id)).returning();
  return deleted || null;
}

export async function createExamSubject(params: {
  examId: number;
  name: string;
  order?: number;
}) {
  const [subject] = await db
    .insert(examSubjects)
    .values({
      examId: params.examId,
      name: params.name,
      sortOrder: params.order ?? 0,
    })
    .returning();
  return subject;
}

export async function updateExamSubject(
  subjectId: string,
  params: Partial<{ name: string; order: number }>
) {
  const [subject] = await db
    .update(examSubjects)
    .set({
      name: params.name,
      sortOrder: params.order,
    })
    .where(eq(examSubjects.id, subjectId))
    .returning();
  return subject || null;
}

export async function deleteExamSubject(subjectId: string) {
  const [deleted] = await db
    .delete(examSubjects)
    .where(eq(examSubjects.id, subjectId))
    .returning();
  return deleted || null;
}

export async function listExamSubjects(params: {
  examId: number;
  page?: number;
  pageSize?: number;
  search?: string;
}) {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 20;
  const offset = (page - 1) * pageSize;

  try {
    const conditions = [eq(examSubjects.examId, params.examId)];
    if (params.search) {
      conditions.push(ilike(examSubjects.name, `%${params.search}%`));
    }

    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(examSubjects)
      .where(and(...conditions));
    const total = Number(totalResult[0]?.count ?? 0);

    const data = await db
      .select()
      .from(examSubjects)
      .where(and(...conditions))
      .orderBy(asc(examSubjects.sortOrder), asc(examSubjects.name))
      .limit(pageSize)
      .offset(offset);

    return { data, page, pageSize, total };
  } catch (error) {
    console.warn("Returning fallback exam subjects:", error);
    const fallback = [
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
    ].map((name, index) => ({
      id: `${params.examId}-${name.toLowerCase().replace(/\s+/g, "-")}`,
      examId: params.examId,
      name,
      sortOrder: index,
      createdAt: new Date(),
    }));
    return { data: fallback, page, pageSize, total: fallback.length };
  }
}

export async function createExamTopic(params: {
  examId: number;
  subjectId?: string;
  parentTopicId?: string;
  title: string;
  weight?: number;
}) {
  const [topic] = await db
    .insert(examTopics)
    .values({
      examId: params.examId,
      subjectId: params.subjectId ?? null,
      parentTopicId: params.parentTopicId ?? null,
      title: params.title,
      weight: params.weight ?? 0,
    })
    .returning();
  return topic;
}

export async function updateExamTopic(
  topicId: string,
  params: Partial<{
    examId: number;
    subjectId: string;
    parentTopicId: string;
    title: string;
    weight: number;
  }>
) {
  const [topic] = await db
    .update(examTopics)
    .set({
      examId: params.examId,
      subjectId: params.subjectId,
      parentTopicId: params.parentTopicId,
      title: params.title,
      weight: params.weight,
    })
    .where(eq(examTopics.id, topicId))
    .returning();
  return topic || null;
}

export async function deleteExamTopic(topicId: string) {
  const [deleted] = await db
    .delete(examTopics)
    .where(eq(examTopics.id, topicId))
    .returning();
  return deleted || null;
}

export async function listExamTopics(params: {
  examId?: number;
  subjectId?: string;
  page?: number;
  pageSize?: number;
  search?: string;
}) {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 20;
  const offset = (page - 1) * pageSize;

  try {
    const conditions = [];
    if (params.examId) {
      conditions.push(eq(examTopics.examId, params.examId));
    }
    if (params.subjectId) {
      conditions.push(eq(examTopics.subjectId, params.subjectId));
    }
    if (params.search) {
      conditions.push(ilike(examTopics.title, `%${params.search}%`));
    }

    const totalResult = conditions.length
      ? await db
          .select({ count: sql<number>`count(*)` })
          .from(examTopics)
          .where(and(...conditions))
      : await db.select({ count: sql<number>`count(*)` }).from(examTopics);
    const total = Number(totalResult[0]?.count ?? 0);

    const data = conditions.length
      ? await db
          .select()
          .from(examTopics)
          .where(and(...conditions))
          .orderBy(asc(examTopics.sortOrder), asc(examTopics.title))
          .limit(pageSize)
          .offset(offset)
      : await db
          .select()
          .from(examTopics)
          .orderBy(asc(examTopics.sortOrder), asc(examTopics.title))
          .limit(pageSize)
          .offset(offset);

    return { data, page, pageSize, total };
  } catch (error) {
    console.warn("Returning empty topics due to DB error:", error);
    return { data: [], page, pageSize, total: 0 };
  }
}

export async function getLeaderboard() {
  return [];
}

export async function getIeltsProgress() {
  return null;
}

export async function assignMcqToExam(examId: number, mcqId: string) {
  const [mcq] = await db.select().from(mcqs).where(eq(mcqs.id, mcqId));
  if (!mcq) return null;

  await db
    .insert(examMcqs)
    .values({ examId, mcqId })
    .onConflictDoNothing();

  return mcq;
}

export async function removeMcqFromExam(examId: number, mcqId: string) {
  const [deleted] = await db
    .delete(examMcqs)
    .where(and(eq(examMcqs.examId, examId), eq(examMcqs.mcqId, mcqId)))
    .returning();
  return deleted || null;
}

export async function listExamMcqs(examId: number) {
  const links = await db
    .select()
    .from(examMcqs)
    .where(eq(examMcqs.examId, examId));

  if (links.length === 0) return [];

  const mcqIds = links.map((link) => link.mcqId);
  const rows = await db.select().from(mcqs).where(inArray(mcqs.id, mcqIds));

  const difficultyIds = rows
    .map((row) => row.difficultyId)
    .filter((id): id is number => typeof id === "number");

  const [options, tags, difficultyRows] = await Promise.all([
    db.select().from(mcqOptions).where(inArray(mcqOptions.mcqId, mcqIds)),
    db.select().from(mcqTags).where(inArray(mcqTags.mcqId, mcqIds)),
    difficultyIds.length
      ? db
          .select()
          .from(difficultyLevels)
          .where(inArray(difficultyLevels.id, difficultyIds))
      : Promise.resolve([]),
  ]);

  return rows.map((mcq) => ({
    ...mcq,
    options: options.filter((option) => option.mcqId === mcq.id),
    tags: tags.filter((tag) => tag.mcqId === mcq.id),
    difficulty: difficultyRows.find((d) => d.id === mcq.difficultyId) || null,
  }));
}

const DEFAULT_DIFFICULTY_WEIGHTS: Record<string, number> = {
  easy: 0.4,
  medium: 0.4,
  hard: 0.2,
};

function shuffle<T>(items: T[]) {
  const array = [...items];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function pickWeighted<T>(
  buckets: Record<string, T[]>,
  total: number
) {
  const targets = Object.entries(DEFAULT_DIFFICULTY_WEIGHTS).reduce(
    (acc, [key, weight]) => {
      acc[key] = Math.floor(total * weight);
      return acc;
    },
    {} as Record<string, number>
  );

  let remaining = total - Object.values(targets).reduce((sum, value) => sum + value, 0);
  const order = ["easy", "medium", "hard"];

  while (remaining > 0) {
    let progressed = false;
    for (const key of order) {
      const current = targets[key] ?? 0;
      const available = buckets[key]?.length ?? 0;
      if (current < available) {
        targets[key] = current + 1;
        remaining -= 1;
        progressed = true;
        if (remaining === 0) break;
      }
    }
    if (!progressed) break;
  }

  const selected: T[] = [];
  for (const key of order) {
    const bucket = buckets[key] || [];
    const count = Math.min(targets[key] || 0, bucket.length);
    selected.push(...bucket.slice(0, count));
  }

  if (selected.length < total) {
    const leftovers = order
      .flatMap((key) => (buckets[key] || []).slice(targets[key] || 0))
      .concat(buckets.other || []);
    selected.push(...leftovers.slice(0, total - selected.length));
  }

  return selected;
}

export const ExamGeneratorService = {
  async generateExam(examId: number) {
    const exam = await getExamById(String(examId));
    const mcqs = await listExamMcqs(examId);
    if (mcqs.length === 0) return [];

    const totalQuestions =
      typeof (exam as any)?.totalQuestions === "number"
        ? (exam as any).totalQuestions
        : mcqs.length;

    const buckets: Record<string, typeof mcqs> = {
      easy: [],
      medium: [],
      hard: [],
      other: [],
    };

    shuffle(mcqs).forEach((mcq) => {
      const key = mcq.difficulty?.name?.toLowerCase() || "other";
      if (key in buckets) {
        buckets[key].push(mcq);
      } else {
        buckets.other.push(mcq);
      }
    });

    const selected = pickWeighted(buckets, Math.min(totalQuestions, mcqs.length));
    return selected;
  },
};

export async function startExamAttempt(params: {
  examId: number;
  userId?: string | null;
}) {
  const questions = await ExamGeneratorService.generateExam(params.examId);
  if (questions.length === 0) return null;

  const questionIds = questions.map((question) => question.id);
  const [attempt] = await db
    .insert(examAttempts)
    .values({
      examId: params.examId,
      userId: params.userId ?? null,
      status: "in_progress",
      questionIds,
      currentQuestionIndex: 0,
      startedAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  return { attempt, questions };
}

async function getMcqsByIds(mcqIds: string[]) {
  if (mcqIds.length === 0) return [];
  const rows = await db.select().from(mcqs).where(inArray(mcqs.id, mcqIds));

  const difficultyIds = rows
    .map((row) => row.difficultyId)
    .filter((id): id is number => typeof id === "number");

  const [options, tags, difficultyRows] = await Promise.all([
    db.select().from(mcqOptions).where(inArray(mcqOptions.mcqId, mcqIds)),
    db.select().from(mcqTags).where(inArray(mcqTags.mcqId, mcqIds)),
    difficultyIds.length
      ? db
          .select()
          .from(difficultyLevels)
          .where(inArray(difficultyLevels.id, difficultyIds))
      : Promise.resolve([]),
  ]);

  return rows.map((mcq) => ({
    ...mcq,
    options: options.filter((option) => option.mcqId === mcq.id),
    tags: tags.filter((tag) => tag.mcqId === mcq.id),
    difficulty: difficultyRows.find((d) => d.id === mcq.difficultyId) || null,
  }));
}

export async function getAttemptResume(attemptId: string) {
  const attemptWithAnswers = await getAttempt(attemptId);
  if (!attemptWithAnswers) return null;

  const { attempt, answers } = attemptWithAnswers;
  const questionIds = Array.isArray(attempt.questionIds)
    ? (attempt.questionIds as string[])
    : [];
  const questions = await getMcqsByIds(questionIds);
  const answeredIds = new Set(answers.map((answer) => answer.mcqId));
  const unanswered = questions.filter((mcq) => !answeredIds.has(mcq.id));

  return {
    attempt,
    answers,
    unanswered,
  };
}

type DifficultyWeights = Record<string, number>;

type CreateAttemptInput = {
  examId: number;
  userId?: string | null;
  totalQuestions?: number;
  difficultyWeights?: DifficultyWeights;
  timeLimitSeconds?: number;
};

function weightedPick<T>(items: T[], weights: number[]) {
  const total = weights.reduce((sum, w) => sum + w, 0);
  let roll = Math.random() * total;
  for (let i = 0; i < items.length; i += 1) {
    roll -= weights[i];
    if (roll <= 0) return items[i];
  }
  return items[items.length - 1];
}

function weightedSampleWithoutReplacement<T>(
  items: T[],
  weights: number[],
  count: number
) {
  const remainingItems = [...items];
  const remainingWeights = [...weights];
  const results: T[] = [];
  const target = Math.min(count, remainingItems.length);

  for (let i = 0; i < target; i += 1) {
    const picked = weightedPick(remainingItems, remainingWeights);
    const index = remainingItems.indexOf(picked);
    results.push(picked);
    remainingItems.splice(index, 1);
    remainingWeights.splice(index, 1);
  }

  return results;
}

export async function createAttempt(input: CreateAttemptInput) {
  const rows = await db
    .select({
      mcqId: mcqs.id,
      difficultyName: difficultyLevels.name,
    })
    .from(examMcqs)
    .innerJoin(mcqs, eq(examMcqs.mcqId, mcqs.id))
    .leftJoin(difficultyLevels, eq(mcqs.difficultyId, difficultyLevels.id))
    .where(eq(examMcqs.examId, input.examId));

  if (rows.length === 0) {
    return null;
  }

  const weightsConfig = input.difficultyWeights || {};
  const weights = rows.map((row) => {
    const name = row.difficultyName || "default";
    const weight = weightsConfig[name] ?? 1;
    return Math.max(0.1, weight);
  });

  const desiredCount = input.totalQuestions || rows.length;
  const selected = weightedSampleWithoutReplacement(rows, weights, desiredCount);
  const questionIds = selected.map((row) => row.mcqId);

  const [attempt] = await db
    .insert(examAttempts)
    .values({
      examId: input.examId,
      userId: input.userId ?? null,
      status: "in_progress",
      questionIds,
      difficultyWeights: input.difficultyWeights ?? null,
      currentQuestionIndex: 0,
      timeLimitSeconds: input.timeLimitSeconds ?? null,
      timeRemainingSeconds: input.timeLimitSeconds ?? null,
    })
    .returning();

  return attempt;
}

export async function getAttempt(attemptId: string) {
  const [attempt] = await db
    .select()
    .from(examAttempts)
    .where(eq(examAttempts.id, attemptId));

  if (!attempt) return null;

  const answers = await db
    .select()
    .from(attemptAnswers)
    .where(eq(attemptAnswers.attemptId, attemptId));

  return { attempt, answers };
}

export async function saveAnswer(params: {
  attemptId: string;
  mcqId: string;
  selectedOptionId?: number | null;
  currentQuestionIndex?: number;
  timeRemainingSeconds?: number | null;
}) {
  const selectedOptionId = params.selectedOptionId ?? null;
  let isCorrect = false;
  if (selectedOptionId) {
    const [option] = await db
      .select()
      .from(mcqOptions)
      .where(eq(mcqOptions.id, selectedOptionId));
    isCorrect = Boolean(option?.isCorrect);
  }

  await db
    .insert(attemptAnswers)
    .values({
      attemptId: params.attemptId,
      mcqId: params.mcqId,
      selectedOptionId,
      isCorrect,
      answeredAt: new Date(),
    })
    .onConflictDoUpdate({
      target: [attemptAnswers.attemptId, attemptAnswers.mcqId],
      set: {
        selectedOptionId,
        isCorrect,
        answeredAt: new Date(),
      },
    });

  const updatePayload: Record<string, unknown> = {
    updatedAt: new Date(),
  };
  if (params.currentQuestionIndex !== undefined) {
    updatePayload.currentQuestionIndex = params.currentQuestionIndex;
  }
  if (params.timeRemainingSeconds !== undefined) {
    updatePayload.timeRemainingSeconds = params.timeRemainingSeconds;
  }

  await db
    .update(examAttempts)
    .set(updatePayload)
    .where(eq(examAttempts.id, params.attemptId));

  return { success: true };
}

export async function submitAttempt(params: {
  attemptId: string;
  timeSpentSeconds?: number | null;
}) {
  const attemptWithAnswers = await getAttempt(params.attemptId);
  if (!attemptWithAnswers) return null;

  const { attempt, answers } = attemptWithAnswers;
  const totalQuestions = Array.isArray(attempt.questionIds)
    ? attempt.questionIds.length
    : 0;
  const correctAnswers = answers.filter((answer) => answer.isCorrect).length;
  const score =
    totalQuestions > 0
      ? Math.round((correctAnswers / totalQuestions) * 100)
      : 0;

  const [existingResult] = await db
    .select()
    .from(examResults)
    .where(eq(examResults.attemptId, attempt.id));
  const result = existingResult
    ? existingResult
    : (
        await db
          .insert(examResults)
          .values({
            attemptId: attempt.id,
            examId: attempt.examId,
            userId: attempt.userId,
            totalQuestions,
            correctAnswers,
            score,
            timeSpentSeconds: params.timeSpentSeconds ?? null,
          })
          .returning()
      )[0];

  await db
    .update(examAttempts)
    .set({
      status: "completed",
      completedAt: new Date(),
      updatedAt: new Date(),
      timeRemainingSeconds:
        params.timeSpentSeconds !== undefined && attempt.timeLimitSeconds
          ? Math.max(attempt.timeLimitSeconds - (params.timeSpentSeconds || 0), 0)
          : attempt.timeRemainingSeconds,
    })
    .where(eq(examAttempts.id, attempt.id));

  return result || null;
}

type TopicStats = {
  tag: string;
  total: number;
  correct: number;
  accuracy: number;
};

export async function calculateResultSummary(params: {
  attemptId: string;
  timeSpentSeconds?: number | null;
}) {
  const attemptWithAnswers = await getAttempt(params.attemptId);
  if (!attemptWithAnswers) return null;

  const { attempt, answers } = attemptWithAnswers;
  const questionIds = Array.isArray(attempt.questionIds)
    ? (attempt.questionIds as string[])
    : [];
  const totalQuestions = questionIds.length;
  const answered = answers.length;
  const correctAnswers = answers.filter((answer) => answer.isCorrect).length;
  const score =
    totalQuestions > 0
      ? Math.round((correctAnswers / totalQuestions) * 100)
      : 0;
  const accuracy =
    answered > 0 ? Math.round((correctAnswers / answered) * 100) : 0;

  const tagRows =
    questionIds.length > 0
      ? await db
          .select()
          .from(mcqTags)
          .where(inArray(mcqTags.mcqId, questionIds))
      : [];

  const tagStats = new Map<string, { total: number; correct: number }>();
  for (const tagRow of tagRows) {
    const current = tagStats.get(tagRow.tag) || { total: 0, correct: 0 };
    current.total += 1;
    const answer = answers.find((a) => a.mcqId === tagRow.mcqId);
    if (answer?.isCorrect) current.correct += 1;
    tagStats.set(tagRow.tag, current);
  }

  const topicAnalysis: TopicStats[] = Array.from(tagStats.entries()).map(
    ([tag, stats]) => ({
      tag,
      total: stats.total,
      correct: stats.correct,
      accuracy:
        stats.total > 0
          ? Math.round((stats.correct / stats.total) * 100)
          : 0,
    })
  );

  const weakAreas = [...topicAnalysis]
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 5);

  let timePerQuestionSeconds: number | null = null;
  const answeredAt = answers
    .map((answer) => ({
      mcqId: answer.mcqId,
      answeredAt: answer.answeredAt ? new Date(answer.answeredAt) : null,
    }))
    .filter((entry) => entry.answeredAt);

  if (answeredAt.length > 0) {
    const sorted = answeredAt.sort(
      (a, b) => (a.answeredAt?.getTime() || 0) - (b.answeredAt?.getTime() || 0)
    );
    const startedAt = attempt.startedAt ? new Date(attempt.startedAt) : null;
    const perQuestion: number[] = [];
    for (let i = 0; i < sorted.length; i += 1) {
      const current = sorted[i].answeredAt as Date;
      const previous = i === 0 ? startedAt : (sorted[i - 1].answeredAt as Date);
      if (previous) {
        perQuestion.push((current.getTime() - previous.getTime()) / 1000);
      }
    }
    if (perQuestion.length > 0) {
      timePerQuestionSeconds =
        perQuestion.reduce((sum, value) => sum + value, 0) /
        perQuestion.length;
    }
  }

  if (
    timePerQuestionSeconds === null &&
    params.timeSpentSeconds &&
    totalQuestions > 0
  ) {
    timePerQuestionSeconds = params.timeSpentSeconds / totalQuestions;
  }

  return {
    score,
    accuracy,
    totalQuestions,
    answered,
    correctAnswers,
    weakAreas,
    topicAnalysis,
    timePerQuestionSeconds,
  };
}
