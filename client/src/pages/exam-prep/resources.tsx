import { useRoute, Link } from "wouter";
import { motion } from "framer-motion";
import { exams } from "./exam-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Download,
  ExternalLink,
  Video,
  BookOpen,
  Lightbulb,
  Youtube,
  FileDown,
  Link as LinkIcon,
} from "lucide-react";
import Breadcrumbs from "@/components/exam-prep/Breadcrumbs";
import SectionHeader from "@/components/exam-prep/SectionHeader";
import { ExamPageSEO } from "@/components/exam-prep/ExamPageSEO";

export default function ResourcesPage() {
  const [, params] = useRoute("/exam-prep/:examId/resources");
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

  const resources = [
    {
      type: "PDF",
      title: `${exam.name} Complete Study Guide`,
      description: "Comprehensive study guide covering all exam topics",
      icon: FileText,
      color: "text-red-600 bg-red-50",
      action: "Download PDF",
    },
    {
      type: "Video",
      title: "Expert Tips & Strategies",
      description: "Video tutorials from experienced nursing educators",
      icon: Video,
      color: "text-blue-600 bg-blue-50",
      action: "Watch Videos",
    },
    {
      type: "Link",
      title: "Official Exam Website",
      description: "Visit the official exam registration and information portal",
      icon: LinkIcon,
      color: "text-green-600 bg-green-50",
      action: "Visit Site",
    },
    {
      type: "PDF",
      title: "Sample Questions & Answers",
      description: "Practice questions with detailed explanations",
      icon: FileDown,
      color: "text-purple-600 bg-purple-50",
      action: "Download PDF",
    },
    {
      type: "Video",
      title: "YouTube Playlist",
      description: "Curated playlist of exam preparation videos",
      icon: Youtube,
      color: "text-red-600 bg-red-50",
      action: "Watch Playlist",
    },
    {
      type: "PDF",
      title: "Exam Format & Structure Guide",
      description: "Detailed breakdown of exam sections and timing",
      icon: BookOpen,
      color: "text-orange-600 bg-orange-50",
      action: "Download PDF",
    },
  ];

  return (
    <>
      <ExamPageSEO examName={exam.name} examId={exam.id} pageType="resources" />

      <div className="min-h-screen bg-gradient-to-b from-[#F9FAFB] via-white to-[#F9FAFB]">
        <Breadcrumbs
          items={[
            { label: "Exam Preparation", href: "/exam-prep" },
            { label: exam.name, href: `/exam-prep/${exam.id}` },
            { label: "Resources" },
          ]}
        />

        <div className="max-w-7xl mx-auto px-4 py-8">
          <SectionHeader
            icon={Lightbulb}
            title="Tips & Resources"
            subtitle={`Expert resources, PDFs, and external links for ${exam.name} preparation`}
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource, index) => {
              const Icon = resource.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <Card className="h-full rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all">
                    <CardContent className="p-6">
                      <div className={`p-3 ${resource.color} rounded-xl w-fit mb-4`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <Badge className="mb-3 text-xs font-['Nunito',sans-serif]">
                        {resource.type}
                      </Badge>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 font-['Poppins',sans-serif]">
                        {resource.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 font-['Nunito',sans-serif]">
                        {resource.description}
                      </p>
                      <Button
                        variant="outline"
                        className="w-full rounded-xl font-['Nunito',sans-serif]"
                      >
                        {resource.action}
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12"
          >
            <Card className="bg-gradient-to-br from-[#1E88E5] to-[#1565C0] text-white rounded-2xl border-0 shadow-xl">
              <CardContent className="p-8 text-center">
                <Lightbulb className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-3 font-['Poppins',sans-serif]">
                  Study Tips & Best Practices
                </h3>
                <p className="text-blue-100 mb-6 max-w-2xl mx-auto font-['Nunito',sans-serif]">
                  Create a study schedule, practice regularly, review explanations thoroughly, and
                  track your progress to maximize your exam preparation success.
                </p>
                <Link href={`/exam-prep/${exam.id}`}>
                  <Button
                    size="lg"
                    className="bg-white text-[#1E88E5] hover:bg-blue-50 rounded-xl font-['Nunito',sans-serif]"
                  >
                    Back to Exam Overview
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
}

