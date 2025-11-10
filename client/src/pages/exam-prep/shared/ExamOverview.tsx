import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, ClipboardCheck, Crown, Sparkles } from "lucide-react";
import { exams } from "../exam-data";

interface ExamOverviewProps {
  examId: string;
}

export default function ExamOverview({ examId }: ExamOverviewProps) {
  const exam = exams.find((e) => e.id === examId.toLowerCase());

  if (!exam) {
    return (
      <div className="p-10 text-center text-red-600 font-semibold text-lg">
        ❌ Exam not found: {examId}
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-white to-blue-50 text-gray-900 py-20">
      <div className="max-w-6xl mx-auto px-6 text-center">
        {/* 🌟 Exam Title + Description */}
        <h1 className="text-4xl md:text-5xl font-bold text-blue-700 mb-4">
          {exam.name} Preparation
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
          {exam.description}
        </p>

        {/* 🔹 Action Buttons */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-16">
          <Link href={`/exam-prep/${examId}/quizzes`}>
            <Button className="px-8 py-4 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md">
              <Sparkles className="w-5 h-5 mr-2" /> Start Practice Test
            </Button>
          </Link>

          <Link href={`/exam-prep/${examId}/studymaterials`}>
            <Button
              variant="outline"
              className="px-8 py-4 text-lg font-semibold border-2 border-blue-600 text-blue-700 hover:bg-blue-50 rounded-xl shadow-sm"
            >
              <BookOpen className="w-5 h-5 mr-2" /> Study Materials
            </Button>
          </Link>

          <Link href="/subscription-plans">
            <Button
              variant="outline"
              className="px-8 py-4 text-lg font-semibold border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-50 rounded-xl shadow-sm"
            >
              <Crown className="w-5 h-5 mr-2" /> Subscription Plans
            </Button>
          </Link>
        </div>

        {/* 💎 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border-2 border-blue-500 rounded-2xl shadow-[0_0_25px_-5px_rgba(59,130,246,0.5)] hover:shadow-[0_0_35px_-5px_rgba(59,130,246,0.7)] transition-all duration-300">
            <CardContent className="p-8 text-center">
              <BookOpen className="w-10 h-10 mx-auto mb-4 text-blue-600" />
              <h3 className="text-xl font-semibold mb-2">Comprehensive Notes</h3>
              <p className="text-sm text-gray-600">
                Organized study materials and topic-wise summaries for efficient revision.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-500 rounded-2xl shadow-[0_0_25px_-5px_rgba(34,197,94,0.5)] hover:shadow-[0_0_35px_-5px_rgba(34,197,94,0.7)] transition-all duration-300">
            <CardContent className="p-8 text-center">
              <ClipboardCheck className="w-10 h-10 mx-auto mb-4 text-green-600" />
              <h3 className="text-xl font-semibold mb-2">AI-Generated Quizzes</h3>
              <p className="text-sm text-gray-600">
                Realistic question sets with instant feedback to track your progress.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-500 rounded-2xl shadow-[0_0_25px_-5px_rgba(147,51,234,0.5)] hover:shadow-[0_0_35px_-5px_rgba(147,51,234,0.7)] transition-all duration-300">
            <CardContent className="p-8 text-center">
              <Crown className="w-10 h-10 mx-auto mb-4 text-purple-600" />
              <h3 className="text-xl font-semibold mb-2">Personalized Learning</h3>
              <p className="text-sm text-gray-600">
                Smart analytics and recommendations based on your performance trends.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
