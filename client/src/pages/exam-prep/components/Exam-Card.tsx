// src/pages/exam-prep/components/Exam-Card.tsx
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  FileQuestion,
  Globe,
  PlayCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Progress } from "@/shared/ui/progress";

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

  const difficultyLabel = exam.difficulty
    ? exam.difficulty.charAt(0).toUpperCase() + exam.difficulty.slice(1)
    : null;

  return (
    <Link href={`/exam-prep/${exam.id}`}>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        className="h-full"
      >
        <Card
          className="group cursor-pointer h-full flex flex-col
            border border-slate-200/70 hover:border-slate-300
            rounded-2xl bg-white
            shadow-sm hover:shadow-md
            transition-all duration-200"
        >
          <CardHeader className="pb-3 pt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800 font-['Poppins',sans-serif]">
                {exam.name}
              </h3>
              {exam.badge && (
                <Badge
                  className={`${exam.badgeColor} text-xs font-medium px-2.5 py-1 rounded-full`}
                >
                  {exam.badge}
                </Badge>
              )}
            </div>
            {exam.region && (
              <div className="mt-2 inline-flex items-center gap-1 text-xs text-slate-500">
                <Globe className="h-3 w-3" />
                <span className="font-['Nunito',sans-serif]">{exam.region}</span>
              </div>
            )}
          </CardHeader>

          <CardContent className="flex-1 flex flex-col px-6 pb-6">
            <p className="text-sm text-slate-600 leading-relaxed flex-1 font-['Nunito',sans-serif]">
              {exam.description}
            </p>

            {(exam.questions || exam.passRate || difficultyLabel) && (
              <div className="mt-4 grid grid-cols-1 gap-2 text-xs text-slate-600">
                {exam.questions && (
                  <div className="flex items-center gap-2">
                    <FileQuestion className="h-4 w-4 text-slate-400" />
                    <span className="font-medium">{exam.questions} questions</span>
                  </div>
                )}
                {exam.passRate && (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-slate-400" />
                    <span className="font-medium">{exam.passRate} pass rate</span>
                  </div>
                )}
                {difficultyLabel && (
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-slate-400" />
                    <span className="font-medium">{difficultyLabel} difficulty</span>
                  </div>
                )}
              </div>
            )}

            {/* Progress Bar (if progress exists) */}
            {hasProgress && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-5"
              >
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-['Nunito',sans-serif]">
                  <span>Progress</span>
                  <span className="font-semibold">{progress}%</span>
                </div>
                <Progress value={progress} />
              </motion.div>
            )}

            {/* Dynamic CTA Button */}
            <motion.div className="mt-5" whileTap={{ scale: 0.98 }}>
              <Button
                variant="default"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white
                  font-semibold transition-colors duration-200
                  flex items-center justify-center gap-2 rounded-xl
                  font-['Nunito',sans-serif] py-5"
              >
                <PlayCircle className="w-5 h-5" />
                {hasProgress ? "Continue" : "Start"}
                <span className="text-white/80">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}
