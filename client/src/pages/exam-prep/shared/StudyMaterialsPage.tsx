// ✅ src/pages/exam-prep/shared/StudyMaterialsPage.tsx
import { Link, useParams } from "wouter"; // Import useParams
import { exams } from "../exam-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, BookOpen, Video, ArrowLeft, ArrowRight, ClipboardList } from "lucide-react";

export default function StudyMaterialsPage() {
  // Use useParams to get the parameters captured by the Route in App.tsx
  const params = useParams();
  const examId = params?.examId?.toLowerCase();

  const exam = exams.find((e) => e.id === examId);

  // We no longer need the 'match' check.
  if (!exam) {
    return (
      <div className="text-center py-32">
        <h2 className="text-3xl font-bold text-red-500 mb-4">Exam Not Found</h2>
        <p className="text-muted-foreground">
          Please return to the Exam Prep page and select a valid exam.
        </p>
      </div>
    );
  }

  const materials = [
    {
      title: "AI-Generated Flashcards",
      type: "Flashcards",
      icon: <BookOpen className="w-8 h-8 text-green-600" />,
      desc: "Review high-yield flashcards for quick recall and smart revision.",
      link: `/exam-prep/${exam.id}/studymaterials/flashcards`,
    },
    {
      title: "Comprehensive Nursing Notes",
      type: "Notes",
      icon: <FileText className="w-8 h-8 text-blue-600" />,
      desc: "Download detailed topic-wise notes covering the entire exam syllabus.",
      link: `/exam-prep/${exam.id}/studymaterials/nursing-notes`,
    },
    {
      title: "Structured Study Guides",
      type: "Guides",
      icon: <Video className="w-8 h-8 text-purple-600" />,
      desc: "Access organized guides, outlines, and recommended reading plans.",
      link: `/exam-prep/${exam.id}/studymaterials/study-guides`,
    },
    {
      title: "Past Papers & Question Banks",
      type: "Past Papers",
      icon: <ClipboardList className="w-8 h-8 text-amber-600" />,
      desc: "Practice with previous exam papers and curated question sets.",
      link: `/exam-prep/${exam.id}/studymaterials/past-papers`,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground py-16">
      <div className="max-w-4xl mx-auto text-center mb-12 px-4">
        <h1 className="text-4xl font-bold mb-3">{exam.name} Study Materials</h1>
        <p className="text-muted-foreground text-lg mb-6">
          Explore curated notes, flashcards, guides, and past papers to prepare effectively for the{" "}
          {exam.name} exam.
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild variant="outline" className="flex items-center">
            <Link href={`/exam-prep/${exam.id}`}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Overview
            </Link>
          </Button>
          <Button asChild className="bg-green-600 text-white flex items-center">
            <Link href={`/exam-prep/${exam.id}/quizzes`}>
              Start Practice Test
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto px-4">
        {materials.map((item, i) => (
          <Link key={i} href={item.link}>
            <Card className="border-2 border-blue-500 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-3">{item.icon}</div>
                <h3 className="font-semibold text-xl mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{item.desc}</p>
                <Button variant="outline" className="w-full">
                  Open {item.type}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
