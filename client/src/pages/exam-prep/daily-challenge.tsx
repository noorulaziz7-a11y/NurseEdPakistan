// Daily Challenge Page - iOS-inspired design
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Zap, 
  Clock, 
  Target, 
  Trophy, 
  Calendar, 
  CheckCircle2, 
  Play,
  Flame,
  Award,
  TrendingUp
} from "lucide-react";

interface DailyChallenge {
  id: string;
  date: string;
  examType: string;
  questionCount: number;
  difficulty: string;
  timeLimit: number;
  completed: boolean;
  score?: number;
  participants: number;
  topScore: number;
}

export default function DailyChallengePage() {
  const [today, setToday] = useState(new Date().toISOString().split("T")[0]);

  const { data: challenge, isLoading } = useQuery<DailyChallenge>({
    queryKey: ["/api/daily-challenge", today],
    queryFn: async () => {
      const res = await fetch(`/api/daily-challenge?date=${today}`);
      if (!res.ok) return null;
      return res.json();
    },
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/daily-challenge/stats"],
    queryFn: async () => {
      const res = await fetch("/api/daily-challenge/stats");
      if (!res.ok) return { streak: 0, totalCompleted: 0, averageScore: 0 };
      return res.json();
    },
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      case "medium":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";
      case "hard":
        return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl">
              <Flame className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Daily Challenge
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Test your knowledge with today's special challenge
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-3 gap-6 mb-8"
        >
          <Card className="border-0 shadow-lg rounded-3xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-xl">
                  <Flame className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current Streak</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stats?.streak || 0} days
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg rounded-3xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-xl">
                  <CheckCircle2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Completed</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stats?.totalCompleted || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg rounded-3xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Avg Score</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stats?.averageScore || 0}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Today's Challenge */}
        {isLoading ? (
          <Card className="border-0 shadow-xl rounded-3xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl">
            <CardContent className="p-12 text-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Loading challenge...</p>
            </CardContent>
          </Card>
        ) : challenge ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-0 shadow-xl rounded-3xl bg-gradient-to-br from-blue-500 to-blue-600 text-white overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-3xl font-bold mb-2 flex items-center gap-2">
                      <Zap className="w-8 h-8" />
                      Today's Challenge
                    </CardTitle>
                    <div className="flex items-center gap-2 text-blue-100">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(challenge.date).toLocaleDateString("en-US", { 
                        weekday: "long", 
                        year: "numeric", 
                        month: "long", 
                        day: "numeric" 
                      })}</span>
                    </div>
                  </div>
                  {challenge.completed && (
                    <Badge className="bg-green-500 text-white px-4 py-2">
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Completed
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-5 h-5" />
                      <span className="text-sm opacity-90">Exam Type</span>
                    </div>
                    <p className="text-xl font-bold">{challenge.examType}</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-5 h-5" />
                      <span className="text-sm opacity-90">Time Limit</span>
                    </div>
                    <p className="text-xl font-bold">{challenge.timeLimit} min</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-5 h-5" />
                      <span className="text-sm opacity-90">Questions</span>
                    </div>
                    <p className="text-xl font-bold">{challenge.questionCount}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Badge className={`${getDifficultyColor(challenge.difficulty)} px-4 py-2 text-sm font-semibold`}>
                    {challenge.difficulty.toUpperCase()}
                  </Badge>
                  <div className="flex items-center gap-2 text-blue-100">
                    <Users className="w-4 h-4" />
                    <span>{challenge.participants} participants</span>
                  </div>
                  {challenge.topScore > 0 && (
                    <div className="flex items-center gap-2 text-yellow-200">
                      <Trophy className="w-4 h-4" />
                      <span>Top Score: {challenge.topScore}%</span>
                    </div>
                  )}
                </div>

                {challenge.completed && challenge.score !== undefined && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm opacity-90">Your Score</span>
                      <span className="text-2xl font-bold">{challenge.score}%</span>
                    </div>
                    <Progress value={challenge.score} className="h-3" />
                  </div>
                )}

                <Link href={`/exam-prep/${challenge.examType.toLowerCase()}/quiz?dailyChallenge=true`}>
                  <Button
                    size="lg"
                    className="w-full bg-white text-blue-600 hover:bg-blue-50 h-14 rounded-2xl font-semibold text-lg shadow-lg"
                    disabled={challenge.completed}
                  >
                    <Play className="w-5 h-5 mr-2" />
                    {challenge.completed ? "Challenge Completed" : "Start Challenge"}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <Card className="border-0 shadow-xl rounded-3xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl">
            <CardContent className="p-12 text-center">
              <Zap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No challenge available for today</p>
            </CardContent>
          </Card>
        )}

        {/* Previous Challenges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <Card className="border-0 shadow-xl rounded-3xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Recent Challenges</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                Challenge history coming soon...
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

