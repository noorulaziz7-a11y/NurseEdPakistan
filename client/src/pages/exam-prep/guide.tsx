import { useRoute, Link } from "wouter";
import { motion } from "framer-motion";
import { exams } from "./exam-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Target,
  Lightbulb,
  AlertCircle,
  ArrowLeft,
  FileText,
} from "lucide-react";
import Breadcrumbs from "@/components/exam-prep/Breadcrumbs";
import SectionHeader from "@/components/exam-prep/SectionHeader";
import { ExamPageSEO } from "@/components/exam-prep/ExamPageSEO";

export default function GuidePage() {
  const [, params] = useRoute("/exam-prep/:examId/guide");
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

  const studyTips = [
    {
      icon: Clock,
      title: "Create a Study Schedule",
      description:
        "Dedicate 2-3 hours daily for consistent study. Break down topics into manageable chunks.",
      color: "text-[#1E88E5] bg-blue-50",
    },
    {
      icon: Target,
      title: "Focus on Weak Areas",
      description:
        "Identify your weak topics through practice quizzes and allocate more time to them.",
      color: "text-[#F59E0B] bg-yellow-50",
    },
    {
      icon: CheckCircle2,
      title: "Practice Regularly",
      description:
        "Take practice quizzes weekly to build confidence and improve your test-taking skills.",
      color: "text-[#22C55E] bg-green-50",
    },
    {
      icon: BookOpen,
      title: "Review Explanations",
      description:
        "Read detailed explanations for every question, even if you got it right. Understanding the 'why' is crucial.",
      color: "text-[#00BCD4] bg-cyan-50",
    },
  ];

  const examFormat = [
    { label: "Exam Type", value: "Computerized Adaptive Testing (CAT)" },
    { label: "Duration", value: "Up to 6 hours" },
    { label: "Question Count", value: "75-265 questions (varies)" },
    { label: "Passing Score", value: "Minimum 75%" },
    { label: "Question Types", value: "Multiple Choice, Select All That Apply" },
  ];

  const eligibility = [
    "Registered Nurse (RN) or equivalent qualification",
    "Completion of nursing education program",
    "Valid nursing license from home country",
    "English language proficiency (if required)",
  ];

  return (
    <>
      <ExamPageSEO examName={exam.name} examId={exam.id} pageType="guide" />

      <div className="min-h-screen bg-gradient-to-b from-[#F9FAFB] via-white to-[#F9FAFB]">
        <Breadcrumbs
          items={[
            { label: "Exam Preparation", href: "/exam-prep" },
            { label: exam.name, href: `/exam-prep/${exam.id}` },
            { label: "Study Guide" },
          ]}
        />

        <div className="max-w-7xl mx-auto px-4 py-8">
          <SectionHeader
            icon={FileText}
            title={`${exam.name} Complete Study Guide`}
            subtitle="Comprehensive guide covering exam format, eligibility, and proven study strategies"
          />

          {/* Exam Format Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <Card className="rounded-2xl border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-[#1E88E5] rounded-xl">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-800 font-['Poppins',sans-serif]">
                    Exam Format & Structure
                  </h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {examFormat.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl"
                    >
                      <div className="font-semibold text-gray-700 min-w-[140px] font-['Nunito',sans-serif]">
                        {item.label}:
                      </div>
                      <div className="text-gray-600 font-['Nunito',sans-serif]">
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Eligibility Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <Card className="rounded-2xl border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-[#22C55E] rounded-xl">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-800 font-['Poppins',sans-serif]">
                    Eligibility Requirements
                  </h3>
                </div>
                <ul className="space-y-3">
                  {eligibility.map((req, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#22C55E] mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 font-['Nunito',sans-serif]">{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Study Tips Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-[#F59E0B] rounded-xl">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 font-['Poppins',sans-serif]">
                Proven Study Strategies
              </h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {studyTips.map((tip, index) => {
                const Icon = tip.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                  >
                    <Card className="rounded-2xl border-0 shadow-lg h-full">
                      <CardContent className="p-6">
                        <div className={`p-3 ${tip.color} rounded-xl w-fit mb-4`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-2 font-['Poppins',sans-serif]">
                          {tip.title}
                        </h4>
                        <p className="text-gray-600 font-['Nunito',sans-serif]">
                          {tip.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mb-8"
          >
            <Card className="bg-gradient-to-br from-[#1E88E5] to-[#1565C0] text-white rounded-2xl border-0 shadow-xl">
              <CardContent className="p-8 text-center">
                <AlertCircle className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-3 font-['Poppins',sans-serif]">
                  Ready to Start Your Preparation?
                </h3>
                <p className="text-blue-100 mb-6 max-w-2xl mx-auto font-['Nunito',sans-serif]">
                  Begin practicing with our comprehensive question bank and track your progress
                  towards exam success.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link href={`/exam-prep/${exam.id}/quizzes`}>
                    <Button
                      size="lg"
                      className="bg-white text-[#1E88E5] hover:bg-blue-50 rounded-xl font-['Nunito',sans-serif]"
                    >
                      Start Practice Quiz
                    </Button>
                  </Link>
                  <Link href={`/exam-prep/${exam.id}`}>
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-2 border-white text-white hover:bg-white/10 rounded-xl font-['Nunito',sans-serif]"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Overview
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
}

