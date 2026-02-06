import { storage } from "../../storage";

export async function getUserById(id: string) {
  return storage.getUser(id);
}

export async function getPracticeTests(userId: string) {
  return storage.getPracticeTests(userId);
}

export async function createPracticeTest(payload: any) {
  return storage.createPracticeTest(payload);
}

export async function getAnalytics(userId: string) {
  const tests = await storage.getPracticeTests(userId);
  const totalQuizzes = tests.length;
  const averageScore =
    totalQuizzes > 0
      ? Math.round(tests.reduce((sum, t) => sum + (t.score || 0), 0) / totalQuizzes)
      : 0;
  const totalTime = tests.reduce((sum, t) => sum + (t.timeSpent || 0), 0);
  const completionRate =
    totalQuizzes > 0
      ? Math.round((tests.filter((t) => (t.totalQuestions || 0) > 0).length / totalQuizzes) * 100)
      : 0;

  return {
    totalQuizzes,
    averageScore,
    totalTime,
    completionRate,
    performanceOverTime: [],
    examBreakdown: [],
    subjectPerformance: [],
    weeklyActivity: [],
  };
}
