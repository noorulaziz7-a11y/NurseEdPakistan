// src/pages/exam-prep/components/Exam-Card.tsx
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, PlayCircle, CheckCircle2, BarChart3, Globe, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ExamCardProps {
  exam: {
    id: string;
    name: string;
    description: string;
    badge?: string;
    badgeColor: string;
    progress?: number;
    difficulty?: string;
    questions?: string;
    passRate?: string;
    region?: string;
  };
}

export default function ExamCard({ exam }: ExamCardProps) {
  // Simulate progress (in real app, this would come from user data)
  const hasProgress = exam.progress !== undefined && exam.progress > 0;
  const progress = exam.progress || 0;

  // Difficulty color mapping
  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty?.toLowerCase()) {
      case "high":
        return "text-red-600 bg-red-50";
      case "medium":
        return "text-yellow-600 bg-yellow-50";
      case "low":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <Link href={`/exam-prep/${exam.id}`}>
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="h-full"
      >
        <Card
          className="group cursor-pointer h-full flex flex-col 
            hover:shadow-2xl hover:shadow-blue-500/20
            transition-all duration-300 
            border-2 border-gray-200 hover:border-blue-400
            rounded-2xl bg-white
            overflow-hidden relative"
        >
          {/* Animated Badge Ring */}
          <div className="absolute top-4 right-4 z-10">
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute inset-0 border-2 border-dashed border-blue-200 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ width: "60px", height: "60px" }}
            />
            <Badge
              className={`${exam.badgeColor} text-xs font-semibold px-3 py-1.5 rounded-full shadow-md relative z-10 font-['Nunito',sans-serif]`}
            >
              {exam.badge || "Exam"}
            </Badge>
          </div>

          <CardHeader className="pb-3 pt-6">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 pr-20">
                <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors font-['Poppins',sans-serif]">
                  {exam.name}
                </h3>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-6 pt-0">
            <div className="flex items-center gap-2 mb-4 text-gray-500">
              <BookOpen className="w-4 h-4" />
              <span className="text-xs font-medium font-['Nunito',sans-serif]">
                Licensure Exam
              </span>
              {exam.region && (
                <>
                  <span className="text-gray-300">•</span>
                  <div className="flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    <span className="text-xs font-medium font-['Nunito',sans-serif]">
                      {exam.region}
                    </span>
                  </div>
                </>
              )}
            </div>

            <p className="text-sm text-gray-600 mb-6 leading-relaxed flex-1 font-['Nunito',sans-serif]">
              {exam.description}
            </p>

            {/* Exam Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {exam.questions && (
                <div className="bg-blue-50 rounded-lg p-2 text-center">
                  <div className="text-xs text-gray-600 font-['Nunito',sans-serif] mb-1">
                    Questions
                  </div>
                  <div className="text-sm font-bold text-blue-600 font-['Poppins',sans-serif]">
                    {exam.questions}
                  </div>
                </div>
              )}
              {exam.passRate && (
                <div className="bg-green-50 rounded-lg p-2 text-center">
                  <div className="text-xs text-gray-600 font-['Nunito',sans-serif] mb-1">
                    Pass Rate
                  </div>
                  <div className="text-sm font-bold text-green-600 font-['Poppins',sans-serif]">
                    {exam.passRate}
                  </div>
                </div>
              )}
              {exam.difficulty && (
                <div className={`${getDifficultyColor(exam.difficulty)} rounded-lg p-2 text-center col-span-2`}>
                  <div className="flex items-center justify-center gap-1">
                    <BarChart3 className="w-3 h-3" />
                    <span className="text-xs font-medium font-['Nunito',sans-serif]">
                      Difficulty: {exam.difficulty}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Progress Bar (if progress exists) */}
            {hasProgress && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4"
              >
                <div className="flex items-center justify-between text-xs text-gray-600 mb-2 font-['Nunito',sans-serif]">
                  <span>Your Progress</span>
                  <span className="font-semibold">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                  />
                </div>
              </motion.div>
            )}

            {/* Dynamic CTA Button */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="default"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 
                  hover:from-blue-700 hover:to-blue-800 
                  text-gray-700 font-semibold shadow-lg
                  group-hover:shadow-xl transition-all duration-300
                  flex items-center justify-center gap-2 rounded-xl
                  font-['Nunito',sans-serif] py-6"
              >
                {hasProgress ? (
                  <>
                    <PlayCircle className="w-5 h-5" />
                    Continue Learning
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Start Practice
                  </>
                )}
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </Button>
            </motion.div>
          </CardContent>

          {/* Hover Gradient Overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 
              group-hover:from-blue-500/5 group-hover:to-purple-500/5 
              pointer-events-none transition-all duration-300 rounded-2xl"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          />

          {/* Success Indicator */}
          {hasProgress && progress >= 80 && (
            <div className="absolute top-4 left-4 z-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-green-500 text-white rounded-full p-1.5 shadow-lg"
              >
                <TrendingUp className="w-4 h-4" />
              </motion.div>
            </div>
          )}
        </Card>
      </motion.div>
    </Link>
  );
}
