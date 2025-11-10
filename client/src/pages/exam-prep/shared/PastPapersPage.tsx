import { useRoute, Link } from "wouter";
import { exams } from "../exam-data";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ClipboardList } from "lucide-react";

export default function PastPapersPage() {
  const [match, params] = useRoute("/exam-prep/:examId/studymaterials/past-papers");
  const exam = exams.find((e) => e.id === params?.examId?.toLowerCase());

  if (!match || !exam)
    return <div className="text-center py-32 text-red-500 font-bold">Exam Not Found</div>;

  return (
    <div className="min-h-screen bg-background text-foreground py-16 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <ClipboardList className="w-16 h-16 text-amber-600 mx-auto mb-6" />
        <h1 className="text-4xl font-bold mb-4">{exam.name} Past Papers</h1>
        <p className="text-muted-foreground mb-8 text-lg">
          Review past paper questions and topic-based MCQ sets for effective exam preparation.
        </p>

        <Button asChild variant="outline" className="mb-8">
          <Link href={`/exam-prep/${exam.id}/studymaterials`}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Study Materials
          </Link>
        </Button>

        <div className="border border-dashed rounded-xl p-10 text-muted-foreground">
          Past paper sets and downloadable question banks will be available here soon.
        </div>
      </div>
    </div>
  );
}
