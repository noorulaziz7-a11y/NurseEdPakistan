import { useRoute, Link } from "wouter";
import { motion } from "framer-motion";
import { exams } from "./exam-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Target,
  Clock,
  CheckCircle2,
  BarChart3,
  Award,
  ArrowLeft,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Breadcrumbs from "@/components/exam-prep/Breadcrumbs";
import SectionHeader from "@/components/exam-prep/SectionHeader";
import ProgressWidget from "@/components/exam-prep/ProgressWidget";
import { ExamPageSEO } from "@/components/exam-prep/ExamPageSEO";

export default function ProgressPage() {
  const [, params] = useRoute("/exam-prep/:examId/progress");
  const exam = exams.find((e) => e.id === params?.examId);

  if (!exam) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 font-['Poppins',sans-serif]">
          Exam Not Found
        </h1>
        <Link href="/exam-prep">
          <Button className="mt-4 rounded-xl font-['Nunito',sans-serif]">Go Back</Button>
        </Link>
      </div>
    );
  }

  // Mock progress data
  const progressData = {
    totalQuestions: 2500,
    answeredQuestions: 850,
    correctAnswers: 680,
    studyTime: 420,
    accuracy: 80,
  };

  const performanceMetrics = [
    {
      label: "Overall Score",
      value: "82%",
      change: "+5%",
      trend: "up",
      icon: Award,
      color: "text-[#22C55E] bg-green-50",
    },
    {
      label: "Questions Completed",
      value: `${progressData.answeredQuestions}/${progressData.totalQuestions}`,
      change: "+120",
      trend: "up",
      icon: CheckCircle2,
      color: "text-[#1E88E5] bg-blue-50",
    },
    {
      label: "Average Time per Question",
      value: "2.5 min",
      change: "-0.3 min",
      trend: "down",
      icon: Clock,
      color: "text-[#00BCD4] bg-cyan-50",
    },
    {
      label: "Streak Days",
      value: "12 days",
      change: "+3",
      trend: "up",
      icon: TrendingUp,
      color: "text-[#F59E0B] bg-yellow-50",
    },
  ];

  const recentActivity = [
    { date: "Today", activity: "Completed 25 practice questions", score: "88%" },
    { date: "Yesterday", activity: "Finished Quiz #12", score: "85%" },
    { date: "2 days ago", activity: "Reviewed study materials", score: "-" },
    { date: "3 days ago", activity: "Completed Quiz #11", score: "82%" },
  ];

  return (
    <>
      <ExamPageSEO examName={exam.name} examId={exam.id} pageType="progress" />

      <div className="min-h-screen bg-gradient-to-b from-[#F9FAFB] via-white to-[#F9FAFB]">
        <Breadcrumbs
          items={[
            { label: "Exam Preparation", href: "/exam-prep" },
            { label: exam.name, href: `/exam-prep/${exam.id}` },
            { label: "Progress" },
          ]}
        />

        <div className="max-w-7xl mx-auto px-4 py-8">
          <SectionHeader
            icon={BarChart3}
            title="Progress Dashboard"
            subtitle={`Track your ${exam.name} exam preparation progress and performance`}
          />

          {/* Main Progress Widget */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <ProgressWidget {...progressData} />
          </motion.div>

          {/* Performance Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4 font-['Poppins',sans-serif]">
              Performance Metrics
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {performanceMetrics.map((metric, index) => {
                const Icon = metric.icon;
                return (
                  <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                  >
                    <Card className="rounded-2xl border-0 shadow-lg">
                      <CardContent className="p-6">
                        <div className={`p-2 ${metric.color} rounded-lg w-fit mb-3`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="text-sm text-gray-600 mb-1 font-['Nunito',sans-serif]">
                          {metric.label}
                        </div>
                        <div className="text-2xl font-bold text-gray-800 mb-2 font-['Poppins',sans-serif]">
                          {metric.value}
                        </div>
                        <div
                          className={`text-xs font-semibold ${
                            metric.trend === "up" ? "text-[#22C55E]" : "text-[#F59E0B]"
                          } font-['Nunito',sans-serif]`}
                        >
                          {metric.change} from last week
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4 font-['Poppins',sans-serif]">
              Recent Activity
            </h3>
            <Card className="rounded-2xl border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                    >
                      <div>
                        <div className="text-sm text-gray-500 mb-1 font-['Nunito',sans-serif]">
                          {activity.date}
                        </div>
                        <div className="text-base font-medium text-gray-800 font-['Nunito',sans-serif]">
                          {activity.activity}
                        </div>
                      </div>
                      {activity.score !== "-" && (
                        <Badge className="bg-[#1E88E5] text-white font-['Nunito',sans-serif]">
                          {activity.score}
                        </Badge>
                      )}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8"
          >
            <Link href={`/exam-prep/${exam.id}`}>
              <Button
                variant="outline"
                className="rounded-xl font-['Nunito',sans-serif]"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Exam Overview
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </>
  );
}

