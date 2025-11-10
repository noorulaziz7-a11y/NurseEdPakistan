import { useRoute, Link } from "wouter";
import { exams } from "../exam-data";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Layers } from "lucide-react";

export default function FlashcardsPage() {
  const [match, params] = useRoute("/exam-prep/:examId/studymaterials/flashcards");
  const exam = exams.find((e) => e.id === params?.examId?.toLowerCase());

  if (!match || !exam)
    return <div className="text-center py-32 text-red-500 font-bold">Exam Not Found</div>;

  return (
    <div className="min-h-screen bg-background text-foreground py-16 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <Layers className="w-16 h-16 text-blue-600 mx-auto mb-6" />
        <h1 className="text-4xl font-bold mb-4">{exam.name} Flashcards</h1>
        <p className="text-muted-foreground mb-8 text-lg">
          Quick AI-generated flashcards for high-yield topics. Perfect for last-minute revision.
        </p>

        <Button asChild variant="outline" className="mb-8">
          <Link href={`/exam-prep/${exam.id}/studymaterials`}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Study Materials
          </Link>
        </Button>

        <div className="border border-dashed rounded-xl p-10 text-muted-foreground">
          Flashcard sets coming soon — you can later connect to dynamic data (e.g., DB or API).
        </div>
      </div>
    </div>
  );
}
