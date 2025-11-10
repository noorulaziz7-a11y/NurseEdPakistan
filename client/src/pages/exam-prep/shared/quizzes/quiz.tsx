// Modern iOS-inspired Quiz Page
import { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Clock, ArrowLeft, ArrowRight, Bookmark, CheckCircle2, XCircle, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import AuthModal from "@/components/auth/AuthModal";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: string;
  category: string;
}

export default function QuizPage() {
  const { examId } = useParams<{ examId: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const searchParams = new URLSearchParams(window.location.search);
  
  const subjects = searchParams.get("subjects")?.split(",") || [];
  const difficulty = searchParams.get("difficulty") || "intermediate";
  const questionCount = parseInt(searchParams.get("count") || "25");

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<Set<number>>(new Set());
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [guestQuizCount, setGuestQuizCount] = useState(0);

  // Fetch questions
  const { data: questions = [], isLoading } = useQuery<Question[]>({
    queryKey: ["/api/quiz/questions", examId, difficulty, subjects.join(","), questionCount],
    queryFn: async () => {
      const params = new URLSearchParams({
        examType: examId || "",
        difficulty,
        limit: questionCount.toString(),
      });
      if (subjects.length > 0) {
        params.append("category", subjects[0]);
      }
      const res = await fetch(`/api/quiz/questions?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch questions");
      return res.json();
    },
  });

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Check guest limit
  useEffect(() => {
    if (!user) {
      const stored = localStorage.getItem("guestQuizCount");
      const count = stored ? parseInt(stored) : 0;
      setGuestQuizCount(count);
      if (count >= 5) {
        setShowAuthModal(true);
      }
    }
  }, [user]);

  const currentQuestion = questions[currentIndex];
  const selectedAnswer = selectedAnswers[currentIndex];
  const isCorrect = selectedAnswer === currentQuestion?.correctAnswer;
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleAnswerSelect = (answer: string) => {
    if (showExplanation) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentIndex]: answer }));
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setShowExplanation(false);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setShowExplanation(false);
    }
  };

  const handleBookmark = () => {
    setBookmarkedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(currentIndex)) {
        newSet.delete(currentIndex);
      } else {
        newSet.add(currentIndex);
      }
      return newSet;
    });
  };

  const handleSubmit = async () => {
    if (!user) {
      const newCount = guestQuizCount + 1;
      localStorage.setItem("guestQuizCount", newCount.toString());
      setGuestQuizCount(newCount);
      if (newCount >= 5) {
        setShowAuthModal(true);
        return;
      }
    }

    const correctCount = questions.reduce((acc, q, idx) => {
      return acc + (selectedAnswers[idx] === q.correctAnswer ? 1 : 0);
    }, 0);

    const result = {
      examId,
      examType: examId,
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      incorrectAnswers: questions.length - correctCount,
      score: Math.round((correctCount / questions.length) * 100),
      timeSpent,
      answers: questions.map((q, idx) => ({
        questionId: q.id,
        selectedAnswer: selectedAnswers[idx],
        correct: selectedAnswers[idx] === q.correctAnswer,
      })),
    };

    // Save result
    try {
      await fetch("/api/quiz/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result),
      });
    } catch (error) {
      console.error("Failed to save result:", error);
    }

    // Navigate to results
    setLocation(`/exam-prep/${examId}/quiz/result?score=${result.score}&correct=${correctCount}&total=${questions.length}&time=${timeSpent}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 flex items-center justify-center">
        <Card className="max-w-md p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">No questions found</h2>
          <p className="text-gray-600 mb-6">Please try adjusting your filters.</p>
          <Link href={`/exam-prep/${examId}/quizzes`}>
            <Button>Go Back</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/20">
        {/* Sticky Header */}
        <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href={`/exam-prep/${examId}/quizzes`}>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                </Link>
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, "0")}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="px-3 py-1">
                  Question {currentIndex + 1} of {questions.length}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBookmark}
                  className={`rounded-full ${bookmarkedQuestions.has(currentIndex) ? "text-yellow-500" : ""}`}
                >
                  <Bookmark className={`w-5 h-5 ${bookmarkedQuestions.has(currentIndex) ? "fill-current" : ""}`} />
                </Button>
              </div>
            </div>
            <Progress value={progress} className="mt-4 h-2" />
          </div>
        </div>

        {/* Question Content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-0 shadow-xl rounded-3xl bg-white/80 backdrop-blur-xl overflow-hidden">
                <CardContent className="p-8">
                  {/* Question */}
                  <div className="mb-8">
                    <div className="flex items-start gap-3 mb-4">
                      <Badge className="bg-blue-100 text-blue-700">
                        {currentQuestion.difficulty}
                      </Badge>
                      <Badge variant="outline">{currentQuestion.category}</Badge>
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900 leading-relaxed">
                      {currentQuestion.question}
                    </h2>
                  </div>

                  {/* Options */}
                  <RadioGroup
                    value={selectedAnswer}
                    onValueChange={handleAnswerSelect}
                    disabled={showExplanation}
                  >
                    <div className="space-y-3">
                      {currentQuestion.options.map((option, idx) => {
                        const isSelected = selectedAnswer === option;
                        const isCorrectOption = option === currentQuestion.correctAnswer;
                        const showResult = showExplanation && (isSelected || isCorrectOption);

                        return (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                          >
                            <Label
                              htmlFor={`option-${idx}`}
                              className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                                showResult
                                  ? isCorrectOption
                                    ? "bg-green-50 border-green-500"
                                    : isSelected
                                    ? "bg-red-50 border-red-500"
                                    : ""
                                  : isSelected
                                  ? "bg-blue-50 border-blue-500"
                                  : "bg-gray-50 border-gray-200 hover:border-gray-300"
                              } ${showExplanation ? "pointer-events-none" : ""}`}
                            >
                              <RadioGroupItem
                                value={option}
                                id={`option-${idx}`}
                                className="flex-shrink-0"
                              />
                              <span className="flex-1 text-lg font-medium">{option}</span>
                              {showResult && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="flex-shrink-0"
                                >
                                  {isCorrectOption ? (
                                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                                  ) : isSelected ? (
                                    <XCircle className="w-6 h-6 text-red-600" />
                                  ) : null}
                                </motion.div>
                              )}
                            </Label>
                          </motion.div>
                        );
                      })}
                    </div>
                  </RadioGroup>

                  {/* Explanation */}
                  {showExplanation && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 p-6 bg-blue-50 rounded-2xl border border-blue-200"
                    >
                      <div className="flex items-start gap-3">
                        <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-semibold text-blue-900 mb-2">Explanation</h3>
                          <p className="text-blue-800 leading-relaxed">{currentQuestion.explanation}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-6">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                  className="rounded-2xl px-6"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                <Button
                  onClick={handleNext}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-8 py-6 text-lg font-semibold shadow-lg"
                >
                  {currentIndex === questions.length - 1 ? "Submit Quiz" : "Next"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          message="You've reached the guest quiz limit. Please sign up to continue practicing!"
        />
      )}
    </>
  );
}

