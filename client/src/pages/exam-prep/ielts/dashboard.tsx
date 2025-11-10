// Enhanced IELTS Dashboard with iOS-inspired design
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Headphones, BookOpen, PenTool, Mic, TrendingUp, Clock, Award, BarChart3 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const MODULES = [
  {
    id: "listening",
    name: "Listening",
    icon: Headphones,
    color: "blue",
    description: "Improve your listening comprehension with audio exercises and practice tests.",
    link: "/exam-prep/ielts/listening",
  },
  {
    id: "reading",
    name: "Reading",
    icon: BookOpen,
    color: "green",
    description: "Enhance reading speed and comprehension for IELTS passages.",
    link: "/exam-prep/ielts/reading",
  },
  {
    id: "writing",
    name: "Writing",
    icon: PenTool,
    color: "purple",
    description: "Learn essay structures and report writing for IELTS tasks.",
    link: "/exam-prep/ielts/writing",
  },
  {
    id: "speaking",
    name: "Speaking",
    icon: Mic,
    color: "orange",
    description: "Boost your speaking confidence with guided question sets.",
    link: "/exam-prep/ielts/speaking",
  },
];

export default function IELTSDashboard() {
  // Fetch user progress for IELTS modules
  const { data: progress } = useQuery({
    queryKey: ["/api/ielts/progress"],
    queryFn: async () => {
      const res = await fetch("/api/ielts/progress");
      if (!res.ok) return null;
      return res.json();
    },
  });

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string; light: string }> = {
      blue: {
        bg: "bg-blue-500",
        text: "text-blue-600",
        border: "border-blue-500",
        light: "bg-blue-50",
      },
      green: {
        bg: "bg-green-500",
        text: "text-green-600",
        border: "border-green-500",
        light: "bg-green-50",
      },
      purple: {
        bg: "bg-purple-500",
        text: "text-purple-600",
        border: "border-purple-500",
        light: "bg-purple-50",
      },
      orange: {
        bg: "bg-orange-500",
        text: "text-orange-600",
        border: "border-orange-500",
        light: "bg-orange-50",
      },
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 font-['SF_Pro_Display',system-ui,sans-serif]">
            IELTS Preparation Hub
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-['SF_Pro_Text',system-ui,sans-serif]">
            Master all four IELTS modules with comprehensive practice materials, expert guidance, and performance tracking.
          </p>
        </motion.div>

        {/* Overall Progress Card */}
        {progress && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <Card className="border-0 shadow-xl rounded-3xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Overall Progress</h2>
                    <p className="text-blue-100">Track your performance across all modules</p>
                  </div>
                  <Award className="w-12 h-12 text-blue-200" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-blue-100 mb-1">Average Score</p>
                    <p className="text-3xl font-bold">{progress.averageScore || 0}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-100 mb-1">Total Practice</p>
                    <p className="text-3xl font-bold">{progress.totalPractice || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-100 mb-1">Time Spent</p>
                    <p className="text-3xl font-bold">{Math.floor((progress.timeSpent || 0) / 60)}h</p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-100 mb-1">Completion</p>
                    <p className="text-3xl font-bold">{progress.completion || 0}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Module Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {MODULES.map((module, index) => {
            const Icon = module.icon;
            const colors = getColorClasses(module.color);
            const moduleProgress = progress?.modules?.[module.id] || { score: 0, completed: 0 };

            return (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <Link href={module.link}>
                  <Card className="border-0 shadow-lg rounded-3xl bg-white/80 backdrop-blur-xl hover:shadow-xl transition-all duration-300 cursor-pointer group h-full">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`p-4 ${colors.light} rounded-2xl group-hover:scale-110 transition-transform`}>
                            <Icon className={`w-8 h-8 ${colors.text}`} />
                          </div>
                          <div>
                            <CardTitle className="text-2xl font-bold text-gray-900 mb-1">
                              {module.name}
                            </CardTitle>
                            <p className="text-sm text-gray-600">{module.description}</p>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">Progress</span>
                            <span className="text-sm font-semibold text-gray-900">
                              {moduleProgress.completed || 0}% Complete
                            </span>
                          </div>
                          <Progress value={moduleProgress.completed || 0} className="h-2" />
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <TrendingUp className={`w-4 h-4 ${colors.text}`} />
                            <span className="text-sm text-gray-600">
                              Score: <span className={`font-semibold ${colors.text}`}>
                                {moduleProgress.score || 0}%
                              </span>
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {moduleProgress.timeSpent || 0} min
                            </span>
                          </div>
                        </div>
                        <Button
                          className={`w-full ${colors.bg} hover:opacity-90 text-white rounded-2xl h-12 font-semibold shadow-lg`}
                        >
                          Start {module.name} Practice
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid md:grid-cols-3 gap-6"
        >
          <Card className="border-0 shadow-lg rounded-3xl bg-white/80 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Questions</p>
                  <p className="text-2xl font-bold text-gray-900">1,000+</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg rounded-3xl bg-white/80 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-xl">
                  <Award className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Practice Tests</p>
                  <p className="text-2xl font-bold text-gray-900">50+</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg rounded-3xl bg-white/80 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Study Hours</p>
                  <p className="text-2xl font-bold text-gray-900">100+</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

