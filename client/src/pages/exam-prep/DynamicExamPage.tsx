// src/pages/exam-prep/DynamicExamPage.tsx
import { useRoute, Link } from "wouter";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { exams } from "./exam-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  BookOpen,
  ClipboardCheck,
  FileText,
  Video,
  BarChart3,
  Lightbulb,
  Download,
  ExternalLink,
  PlayCircle,
  CheckCircle2,
  Target,
  Clock,
  Award,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Breadcrumbs from "@/components/exam-prep/Breadcrumbs";
import SectionHeader from "@/components/exam-prep/SectionHeader";
import { ExamPageSEO } from "@/components/exam-prep/ExamPageSEO";
import ProgressWidget from "@/components/exam-prep/ProgressWidget";

export default function DynamicExamPage() {
  const [, params] = useRoute("/exam-prep/:examId");
  const [activeTab, setActiveTab] = useState("overview");
  const exam = exams.find((e) => e.id === params?.examId);

  if (!exam) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] bg-gradient-to-b from-gray-50 to-white text-center px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 font-['Poppins',sans-serif]">
          Exam Not Found
        </h1>
        <p className="text-gray-500 font-['Nunito',sans-serif]">
          Please go back and select a valid exam.
        </p>
        <Link href="/exam-prep">
          <Button className="mt-4 rounded-xl font-['Nunito',sans-serif]">
            Go Back
          </Button>
        </Link>
      </div>
    );
  }

  // Mock progress data
  const mockProgress = {
    totalQuestions: 2500,
    answeredQuestions: 850,
    correctAnswers: 680,
    studyTime: 420,
    accuracy: 80,
  };

  const isIELTS = exam.id === "ielts";

  return (
    <>
      <ExamPageSEO examName={exam.name} examId={exam.id} pageType="overview" />

      <div className="min-h-screen bg-gradient-to-b from-[#F9FAFB] via-white to-[#F9FAFB]">
        <Breadcrumbs
          items={[
            { label: "Exam Preparation", href: "/exam-prep" },
            { label: exam.name },
          ]}
        />

        {/* Hero Header */}
        <motion.section
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative bg-gradient-to-br from-[#1E88E5] via-[#1565C0] to-[#0D47A1] text-white py-16 px-4 overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto z-10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex-1">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-3 mb-4"
                >
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <BookOpen className="w-8 h-8" />
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold font-['Poppins',sans-serif]">
                    {exam.name}
                  </h1>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-lg md:text-xl text-blue-100 max-w-3xl font-['Nunito',sans-serif] leading-relaxed mb-6"
                >
                  {exam.description}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-wrap items-center gap-4"
                >
                  <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-sm font-semibold font-['Nunito',sans-serif]">
                    {exam.country}
                  </Badge>
                  <div className="flex items-center gap-2 text-blue-100">
                    <Award className="w-5 h-5" />
                    <span className="font-medium font-['Nunito',sans-serif]">
                      Professional Licensure
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* Progress Bar */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 min-w-[280px] border border-white/20"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-blue-100 font-['Nunito',sans-serif]">
                    Your Progress
                  </span>
                  <span className="text-lg font-bold font-['Poppins',sans-serif]">
                    {Math.round((mockProgress.answeredQuestions / mockProgress.totalQuestions) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(mockProgress.answeredQuestions / mockProgress.totalQuestions) * 100}%`,
                    }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-white rounded-full"
                  />
                </div>
                <div className="mt-3 text-xs text-blue-100 font-['Nunito',sans-serif]">
                  {mockProgress.answeredQuestions} of {mockProgress.totalQuestions} questions
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Progress Dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <ProgressWidget {...mockProgress} />
          </motion.div>

          {/* Tabs Navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 gap-2 bg-gray-100 p-2 rounded-2xl mb-8">
              <TabsTrigger
                value="overview"
                className="rounded-xl font-['Nunito',sans-serif] data-[state=active]:bg-[#1E88E5] data-[state=active]:text-white"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="materials"
                className="rounded-xl font-['Nunito',sans-serif] data-[state=active]:bg-[#1E88E5] data-[state=active]:text-white"
              >
                Study Materials
              </TabsTrigger>
              <TabsTrigger
                value="questions"
                className="rounded-xl font-['Nunito',sans-serif] data-[state=active]:bg-[#1E88E5] data-[state=active]:text-white"
              >
                Question Bank
              </TabsTrigger>
              <TabsTrigger
                value="quizzes"
                className="rounded-xl font-['Nunito',sans-serif] data-[state=active]:bg-[#1E88E5] data-[state=active]:text-white"
              >
                Practice Quizzes
              </TabsTrigger>
              <TabsTrigger
                value="resources"
                className="rounded-xl font-['Nunito',sans-serif] data-[state=active]:bg-[#1E88E5] data-[state=active]:text-white"
              >
                Tips & Resources
              </TabsTrigger>
            </TabsList>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              <TabsContent value="overview" className="mt-0">
                <OverviewTab exam={exam} isIELTS={isIELTS} />
              </TabsContent>
              <TabsContent value="materials" className="mt-0">
                <MaterialsTab examId={exam.id} examName={exam.name} />
              </TabsContent>
              <TabsContent value="questions" className="mt-0">
                <QuestionsTab examId={exam.id} examName={exam.name} />
              </TabsContent>
              <TabsContent value="quizzes" className="mt-0">
                <QuizzesTab examId={exam.id} examName={exam.name} isIELTS={isIELTS} />
              </TabsContent>
              <TabsContent value="resources" className="mt-0">
                <ResourcesTab examId={exam.id} examName={exam.name} />
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </div>
      </div>
    </>
  );
}

// Overview Tab Component
function OverviewTab({ exam, isIELTS }: { exam: any; isIELTS: boolean }) {
  const overviewData = {
    eligibility: "Registered Nurse (RN) or equivalent qualification",
    format: "Computerized Adaptive Testing (CAT)",
    duration: "Up to 6 hours",
    passingScore: "Minimum 75%",
    questions: "75-265 questions (varies by performance)",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <SectionHeader
        icon={BookOpen}
        title="Exam Overview"
        subtitle="Everything you need to know about the exam format and requirements"
      />

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card className="rounded-2xl border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[#1E88E5] rounded-lg">
                <Target className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 font-['Poppins',sans-serif]">
                Eligibility Requirements
              </h3>
            </div>
            <p className="text-gray-600 font-['Nunito',sans-serif]">{overviewData.eligibility}</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[#00BCD4] rounded-lg">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 font-['Poppins',sans-serif]">
                Exam Format
              </h3>
            </div>
            <p className="text-gray-600 font-['Nunito',sans-serif]">{overviewData.format}</p>
            <p className="text-sm text-gray-500 mt-2 font-['Nunito',sans-serif]">
              Duration: {overviewData.duration}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[#22C55E] rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 font-['Poppins',sans-serif]">
                Passing Criteria
              </h3>
            </div>
            <p className="text-gray-600 font-['Nunito',sans-serif]">{overviewData.passingScore}</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[#F59E0B] rounded-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 font-['Poppins',sans-serif]">
                Question Count
              </h3>
            </div>
            <p className="text-gray-600 font-['Nunito',sans-serif]">{overviewData.questions}</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        {isIELTS ? (
          <>
            <Link href={`/exam-prep/${exam.id}/reading`}>
              <Button
                size="lg"
                className="bg-[#1E88E5] hover:bg-[#1565C0] text-white rounded-xl font-['Nunito',sans-serif]"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Reading Module
              </Button>
            </Link>
            <Link href={`/exam-prep/${exam.id}/listening`}>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-[#1E88E5] text-[#1E88E5] hover:bg-[#1E88E5]/10 rounded-xl font-['Nunito',sans-serif]"
              >
                <Video className="w-5 h-5 mr-2" />
                Listening Module
              </Button>
            </Link>
          </>
        ) : (
          <>
            <Link href={`/exam-prep/${exam.id}/quizzes/setup`}>
              <Button
                size="lg"
                className="bg-[#1E88E5] hover:bg-[#1565C0] text-white rounded-xl font-['Nunito',sans-serif]"
              >
                <PlayCircle className="w-5 h-5 mr-2" />
                Start Practice Quiz
              </Button>
            </Link>
            <Link href={`/exam-prep/${exam.id}/studymaterials`}>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-[#1E88E5] text-[#1E88E5] hover:bg-[#1E88E5]/10 rounded-xl font-['Nunito',sans-serif]"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Study Materials
              </Button>
            </Link>
          </>
        )}
      </div>
    </motion.div>
  );
}

// Materials Tab Component
function MaterialsTab({ examId, examName }: { examId: string; examName: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <SectionHeader
        icon={FileText}
        title="Study Materials"
        subtitle="Access comprehensive notes, slides, and handouts"
      />
      <Link href={`/exam-prep/${examId}/studymaterials`}>
        <Button
          size="lg"
          className="bg-[#1E88E5] hover:bg-[#1565C0] text-white rounded-xl font-['Nunito',sans-serif]"
        >
          View All Study Materials
          <ExternalLink className="w-4 h-4 ml-2" />
        </Button>
      </Link>
    </motion.div>
  );
}

// Questions Tab Component
function QuestionsTab({ examId, examName }: { examId: string; examName: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <SectionHeader
        icon={ClipboardCheck}
        title="Question Bank"
        subtitle="Practice questions organized by difficulty and topic"
      />
      <Link href={`/exam-prep/${examId}/quizzes`}>
        <Button
          size="lg"
          className="bg-[#1E88E5] hover:bg-[#1565C0] text-white rounded-xl font-['Nunito',sans-serif]"
        >
          Browse Question Bank
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </Link>
    </motion.div>
  );
}

// Quizzes Tab Component
function QuizzesTab({
  examId,
  examName,
  isIELTS,
}: {
  examId: string;
  examName: string;
  isIELTS: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <SectionHeader
        icon={BarChart3}
        title="Practice Quizzes"
        subtitle="Test your knowledge with timed practice quizzes"
      />
      <Link href={`/exam-prep/${examId}/quizzes`}>
        <Button
          size="lg"
          className="bg-[#1E88E5] hover:bg-[#1565C0] text-white rounded-xl font-['Nunito',sans-serif]"
        >
          <PlayCircle className="w-5 h-5 mr-2" />
          Start Practice Quiz
        </Button>
      </Link>
    </motion.div>
  );
}

// Resources Tab Component
function ResourcesTab({ examId, examName }: { examId: string; examName: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <SectionHeader
        icon={Lightbulb}
        title="Tips & Resources"
        subtitle="Expert tips, PDFs, and external resources"
      />
      <Link href={`/exam-prep/${examId}/resources`}>
        <Button
          size="lg"
          className="bg-[#1E88E5] hover:bg-[#1565C0] text-white rounded-xl font-['Nunito',sans-serif]"
        >
          View All Resources
          <ExternalLink className="w-4 h-4 ml-2" />
        </Button>
      </Link>
    </motion.div>
  );
}

