import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Clock, Target, CheckCircle2 } from "lucide-react";

interface ProgressWidgetProps {
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  studyTime: number; // in minutes
  accuracy: number; // percentage
}

export default function ProgressWidget({
  totalQuestions,
  answeredQuestions,
  correctAnswers,
  studyTime,
  accuracy,
}: ProgressWidgetProps) {
  const progress = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;

  const stats = [
    {
      icon: CheckCircle2,
      label: "Questions Answered",
      value: `${answeredQuestions}/${totalQuestions}`,
      color: "text-[#1E88E5]",
      bgColor: "bg-blue-50",
    },
    {
      icon: Target,
      label: "Accuracy",
      value: `${accuracy}%`,
      color: accuracy >= 80 ? "text-[#22C55E]" : accuracy >= 60 ? "text-[#F59E0B]" : "text-red-600",
      bgColor: accuracy >= 80 ? "bg-green-50" : accuracy >= 60 ? "bg-yellow-50" : "bg-red-50",
    },
    {
      icon: Clock,
      label: "Study Time",
      value: `${Math.floor(studyTime / 60)}h ${studyTime % 60}m`,
      color: "text-[#00BCD4]",
      bgColor: "bg-cyan-50",
    },
  ];

  return (
    <Card className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-[#1E88E5] rounded-lg">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 font-['Poppins',sans-serif]">
            Your Progress Overview
          </h3>
        </div>

        {/* Main Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 font-['Nunito',sans-serif]">
              Overall Progress
            </span>
            <span className="text-sm font-semibold text-[#1E88E5] font-['Poppins',sans-serif]">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-[#1E88E5] to-[#1565C0] rounded-full"
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className={`${stat.bgColor} rounded-xl p-3 text-center`}
              >
                <Icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
                <div className={`text-lg font-bold mb-1 font-['Poppins',sans-serif] ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-xs text-gray-600 font-['Nunito',sans-serif]">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

