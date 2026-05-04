import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Progress } from "@/shared/ui/progress";
import { Badge } from "@/shared/ui/badge";
import { Checkbox } from "@/shared/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group";
import { Label } from "@/shared/ui/label";
import { 
  Clock, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Loader2,
  Flag
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  resumeAttempt, 
  saveAttemptProgress,
  submitAttempt,
  type AttemptAnswerRecord 
} from "@/modules/exams/services/attemptApi";

/* -------------------- TYPES -------------------- */

interface QuestionOption {
  id: number;
  optionText: string;
  isCorrect?: boolean;
}

interface Question {
  id: string;
  question: string;
  options: QuestionOption[];
  explanation: string;
  difficulty: string;
  category: string;
  type: "single" | "multiple" | "true_false";
  imageUrl?: string | null;
  reference?: string | null;
}

type QuizAnswerMap = Record<string, number[]>;

/* -------------------- HELPERS -------------------- */

const formatTime = (s: number) =>
  `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

/* -------------------- COMPONENT -------------------- */

export default function QuizPage() {
  const { examId } = useParams<{ examId: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // 1. State Management
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<QuizAnswerMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 2. Extract Attempt ID from URL
  const searchParams = new URLSearchParams(window.location.search);
  const attemptId = searchParams.get("attemptId");

  // 3. Fetch Questions and Resume State
  useEffect(() => {
    let isMounted = true;

    async function loadQuiz() {
      if (!attemptId) {
        setError("Missing Attempt ID. Please start the quiz from the setup page.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await resumeAttempt(attemptId);
        
        if (isMounted) {
          setQuestions(data.questions);
          setCurrentQuestionIndex(data.currentQuestionIndex || 0);
          setTimeRemaining(data.remainingTime);
          
          // Map saved answers to our state format
          const savedMap: QuizAnswerMap = {};
          data.savedAnswers.forEach((ans: AttemptAnswerRecord) => {
            savedMap[ans.mcqId] = ans.selectedOptionIds || (ans.selectedOptionId ? [ans.selectedOptionId] : []);
          });
          setSelectedAnswers(savedMap);
          setError(null);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || "Failed to load quiz data.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadQuiz();

    return () => {
      isMounted = false;
    };
  }, [attemptId]);

  // 4. Timer Logic
  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev !== null && prev > 0) return prev - 1;
        clearInterval(timer);
        return 0;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  // 5. Navigation Handlers
  const handleNext = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  }, [currentQuestionIndex, questions.length]);

  const handlePrevious = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  }, [currentQuestionIndex]);

  // 6. Answer Selection Handler
  const handleSelectAnswer = (optionId: number) => {
    const question = questions[currentQuestionIndex];
    if (!question) return;

    setSelectedAnswers((prev) => {
      const current = prev[question.id] || [];
      let next: number[];

      if (question.type === "multiple") {
        next = current.includes(optionId)
          ? current.filter((id) => id !== optionId)
          : [...current, optionId];
      } else {
        next = [optionId];
      }

      // Proactively save progress
      saveAttemptProgress(attemptId!, {
        currentQuestionIndex,
        timeRemainingSeconds: timeRemaining,
        answers: [{ mcqId: question.id, selectedOptionIds: next }]
      }).catch(err => console.error("Failed to save progress", err));

      return { ...prev, [question.id]: next };
    });
  };

  // 7. Submit Handler
  const handleSubmit = async () => {
    if (!attemptId) return;
    
    try {
      setIsSubmitting(true);
      
      // Calculate time spent
      const timeSpent = timeRemaining !== null 
        ? (questions.length * 60) - timeRemaining 
        : undefined;

      // 1. Final progress save
      await saveAttemptProgress(attemptId, {
        currentQuestionIndex,
        timeRemainingSeconds: timeRemaining,
        answers: Object.entries(selectedAnswers).map(([mcqId, ids]) => ({
          mcqId,
          selectedOptionIds: ids
        }))
      });

      // 2. Submit attempt to backend
      const { result, summary } = await submitAttempt(attemptId, timeSpent);

      // 3. Redirect to results with summary data
      const params = new URLSearchParams({
        attemptId,
        score: String(summary.score),
        correct: String(summary.correctAnswers),
        total: String(summary.totalQuestions),
        time: String(timeSpent || 0)
      });

      setLocation(`/exam-prep/${examId}/quiz/result?${params.toString()}`);
    } catch (err: any) {
      toast({
        title: "Submission failed",
        description: err.message || "Could not save your final answers.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 8. Render States
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <h2 className="text-xl font-semibold text-slate-700">Loading your exam...</h2>
        <p className="text-slate-500">Preparing your practice session</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-10 h-10 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Oops! Something went wrong</h2>
        <p className="text-slate-600 max-w-md mb-6">{error}</p>
        <Button onClick={() => window.location.reload()} className="bg-slate-900">
          Try Again
        </Button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) return null;

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const currentSelections = selectedAnswers[currentQuestion.id] || [];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header / Nav */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setLocation("/exam-prep")}
            className="text-slate-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Exit
          </Button>

          <div className="flex items-center gap-4">
            {timeRemaining !== null && (
              <div className="flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-bold border border-blue-100">
                <Clock className="w-4 h-4 mr-2" />
                {formatTime(timeRemaining)}
              </div>
            )}
            <Badge variant="outline" className="bg-slate-100">
              Question {currentQuestionIndex + 1} of {questions.length}
            </Badge>
          </div>

          <Button 
            variant="default" 
            size="sm" 
            className="bg-slate-900"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Finish"}
          </Button>
        </div>
        <Progress value={progress} className="h-1 rounded-none bg-slate-100" />
      </div>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white">
              <CardContent className="p-8">
                {/* Difficulty & Type */}
                <div className="flex items-center gap-2 mb-6">
                  <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none capitalize">
                    {currentQuestion.difficulty}
                  </Badge>
                  <Badge variant="outline" className="text-slate-500 border-slate-200">
                    {currentQuestion.type === "multiple" ? "Multiple Choice" : "Single Choice"}
                  </Badge>
                </div>

                {/* Question Text */}
                <h2 className="text-2xl font-semibold text-slate-900 mb-8 leading-tight">
                  {currentQuestion.question}
                </h2>

                {/* Options */}
                <div className="space-y-4">
                  {currentQuestion.options.map((option) => {
                    const isSelected = currentSelections.includes(option.id);
                    
                    return (
                      <button
                        key={option.id}
                        onClick={() => handleSelectAnswer(option.id)}
                        className={`w-full text-left p-5 rounded-2xl border-2 transition-all flex items-start gap-4 ${
                          isSelected
                            ? "border-blue-600 bg-blue-50/50 shadow-sm"
                            : "border-slate-100 hover:border-blue-200 hover:bg-slate-50"
                        }`}
                      >
                        <div className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          isSelected ? "border-blue-600 bg-blue-600" : "border-slate-300"
                        }`}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <span className={`text-lg ${isSelected ? "text-blue-900 font-medium" : "text-slate-700"}`}>
                          {option.optionText}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer Controls */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="flex-1 h-14 rounded-2xl border-slate-200"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Previous
          </Button>

          <Button
            variant="default"
            size="lg"
            onClick={currentQuestionIndex === questions.length - 1 ? handleSubmit : handleNext}
            disabled={isSubmitting}
            className={`flex-1 h-14 rounded-2xl shadow-lg transition-all ${
              currentQuestionIndex === questions.length - 1 
                ? "bg-green-600 hover:bg-green-700 shadow-green-100" 
                : "bg-slate-900 shadow-slate-200"
            }`}
          >
            {currentQuestionIndex === questions.length - 1 ? (
              isSubmitting ? "Submitting..." : "Finish Quiz"
            ) : (
              "Next"
            )}
            {currentQuestionIndex === questions.length - 1 ? (
              isSubmitting ? <Loader2 className="w-5 h-5 ml-2 animate-spin" /> : <CheckCircle2 className="w-5 h-5 ml-2" />
            ) : (
              <ArrowRight className="w-5 h-5 ml-2" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
