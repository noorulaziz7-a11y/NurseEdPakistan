// Quiz Results Page - iOS-inspired design
import { useParams, useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, Clock, TrendingUp, RotateCcw, BarChart3, Award } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend } from "recharts";

export default function QuizResultPage() {
  const { examId } = useParams<{ examId: string }>();
  const [searchParams] = new URLSearchParams(window.location.search);
  
  const score = parseInt(searchParams.get("score") || "0");
  const correct = parseInt(searchParams.get("correct") || "0");
  const total = parseInt(searchParams.get("total") || "0");
  const timeSpent = parseInt(searchParams.get("time") || "0");
  const incorrect = total - correct;

  const minutes = Math.floor(timeSpent / 60);
  const seconds = timeSpent % 60;

  const getScoreColor = () => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadge = () => {
    if (score >= 90) return { text: "Excellent", color: "bg-green-500" };
    if (score >= 80) return { text: "Great", color: "bg-blue-500" };
    if (score >= 70) return { text: "Good", color: "bg-yellow-500" };
    if (score >= 60) return { text: "Fair", color: "bg-orange-500" };
    return { text: "Needs Improvement", color: "bg-red-500" };
  };

  const pieData = [
    { name: "Correct", value: correct, color: "#22c55e" },
    { name: "Incorrect", value: incorrect, color: "#ef4444" },
  ];

  const badge = getScoreBadge();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="inline-block mb-4"
          >
            <div className={`w-24 h-24 ${badge.color} rounded-full flex items-center justify-center shadow-lg`}>
              <Award className="w-12 h-12 text-white" />
            </div>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Quiz Completed!
          </h1>
          <p className="text-lg text-gray-600">Great job completing the practice quiz</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Score Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2"
          >
            <Card className="border-0 shadow-xl rounded-3xl bg-white/80 backdrop-blur-xl overflow-hidden">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Your Score</p>
                    <h2 className={`text-6xl font-bold ${getScoreColor()}`}>
                      {score}%
                    </h2>
                  </div>
                  <Badge className={`${badge.color} text-white px-4 py-2 text-lg`}>
                    {badge.text}
                  </Badge>
                </div>
                <Progress value={score} className="h-3 mb-6" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-2xl">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <span className="text-sm text-gray-600">Correct</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">{correct}</p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-2xl">
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle className="w-5 h-5 text-red-600" />
                      <span className="text-sm text-gray-600">Incorrect</span>
                    </div>
                    <p className="text-2xl font-bold text-red-600">{incorrect}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-0 shadow-xl rounded-3xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-5 h-5" />
                      <span className="text-sm opacity-90">Time Spent</span>
                    </div>
                    <p className="text-3xl font-bold">
                      {minutes}:{seconds.toString().padStart(2, "0")}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="w-5 h-5" />
                      <span className="text-sm opacity-90">Total Questions</span>
                    </div>
                    <p className="text-3xl font-bold">{total}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5" />
                      <span className="text-sm opacity-90">Accuracy</span>
                    </div>
                    <p className="text-3xl font-bold">{score}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Charts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid md:grid-cols-2 gap-6 mb-8"
        >
          <Card className="border-0 shadow-xl rounded-3xl bg-white/80 backdrop-blur-xl">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Score Distribution</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl rounded-3xl bg-white/80 backdrop-blur-xl">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Performance Overview</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={pieData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Bar dataKey="value" fill="#8884d8" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <Link href={`/exam-prep/${examId}/quizzes`}>
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-8 py-6 text-lg font-semibold shadow-lg"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Retake Quiz
            </Button>
          </Link>
          <Link href={`/exam-prep/${examId}/quiz/review`}>
            <Button
              size="lg"
              variant="outline"
              className="rounded-2xl px-8 py-6 text-lg font-semibold border-2"
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              Review Answers
            </Button>
          </Link>
          <Link href={`/exam-prep/${examId}`}>
            <Button
              size="lg"
              variant="ghost"
              className="rounded-2xl px-8 py-6 text-lg font-semibold"
            >
              Back to Exam
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
