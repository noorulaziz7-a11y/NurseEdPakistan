import { useParams, Link } from "wouter";
import { exams } from "../../exam-data"; // Adjust the import path if necessary
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { ArrowLeft, Play } from "lucide-react";

export default function QuizSetupPage() {
  // Get the examId from the URL (/exam-prep/:examId/quizzes)
  const params = useParams();
  const examId = params?.examId?.toLowerCase();

  // Find the exam details
  const exam = exams.find((e) => e.id === examId);

  if (!exam) {
    return (
      <div className="text-center py-32">
        <h2 className="text-3xl font-bold text-red-500 mb-4">Quiz Not Found</h2>
        <p className="text-muted-foreground">
          The exam ID provided is invalid. Please select a valid exam.
        </p>
        <Button asChild className="mt-4">
            <Link href="/exam-prep">Back to Exam Prep</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">{exam.name} Quiz Setup</CardTitle>
            <CardDescription>
              Configure your practice session before starting the {exam.name} quiz.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Select your preferences for this practice session:
            </p>
            {/* Placeholder for configuration inputs */}
            <div className="mt-6 p-4 border rounded bg-muted">
                <p className="text-sm text-muted-foreground">
                    (Configuration options such as topic selection, number of questions, and timer settings will be added here.)
                </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
                <Link href={`/exam-prep/${exam.id}`}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Overview
                </Link>
            </Button>
            <Button asChild>
                {/* Link to the quiz setup page */}
                <Link href={`/exam-prep/${exam.id}/quizzes/setup`}>
                    <Play className="w-4 h-4 mr-2"/>
                    Start Quiz
                </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}