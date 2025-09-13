import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Clock, Bookmark, CheckCircle, XCircle, ArrowLeft, ArrowRight } from "lucide-react";
import { EXAM_CONFIGS } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import type { ExamQuestion } from "@shared/schema";

export default function PracticeTest() {
  const [, params] = useRoute("/practice-test/:examType");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const examType = params?.examType as string;
  const config = EXAM_CONFIGS[examType as keyof typeof EXAM_CONFIGS];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(75 * 60); // 75 minutes in seconds
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<Set<number>>(new Set());

  const { data: questions, isLoading } = useQuery<ExamQuestion[]>({
    queryKey: ["/api/exam-questions", examType],
    enabled: !!examType && !!config,
  });

  const submitTestMutation = useMutation({
    mutationFn: async (testData: any) => {
      const response = await fetch("/api/practice-tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testData),
      });
      if (!response.ok) throw new Error("Failed to submit test");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/practice-tests"] });
      toast({
        title: "Test Completed!",
        description: "Your results have been saved.",
      });
    },
  });

  // Timer effect
  useEffect(() => {
    if (showResults) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setShowResults(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showResults]);

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8">
          <CardContent className="text-center">
            <h1 className="text-2xl font-bold mb-4">Invalid Exam Type</h1>
            <Button onClick={() => setLocation("/exam-prep")}>
              Back to Exam Prep
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading practice test...</p>
        </div>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8">
          <CardContent className="text-center">
            <h1 className="text-2xl font-bold mb-4">No Questions Available</h1>
            <p className="text-muted-foreground mb-4">
              There are currently no practice questions available for {config.name}.
            </p>
            <Button onClick={() => setLocation("/exam-prep")}>
              Back to Exam Prep
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const answeredCount = Object.keys(selectedAnswers).length;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const toggleBookmark = () => {
    setBookmarkedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(currentQuestionIndex)) {
        newSet.delete(currentQuestionIndex);
      } else {
        newSet.add(currentQuestionIndex);
      }
      return newSet;
    });
  };

  const handleSubmitTest = () => {
    const correctAnswers = questions.reduce((count, question, index) => {
      return selectedAnswers[index] === question.correctAnswer ? count + 1 : count;
    }, 0);

    const score = Math.round((correctAnswers / questions.length) * 100);
    const timeSpent = Math.round((75 * 60 - timeRemaining) / 60); // in minutes

    submitTestMutation.mutate({
      userId: "demo-user", // In real app, get from auth context
      examType,
      questionsAnswered: answeredCount,
      correctAnswers,
      totalQuestions: questions.length,
      timeSpent,
      score,
    });

    setShowResults(true);
  };

  if (showResults) {
    const correctAnswers = questions.reduce((count, question, index) => {
      return selectedAnswers[index] === question.correctAnswer ? count + 1 : count;
    }, 0);
    const score = Math.round((correctAnswers / questions.length) * 100);

    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <Card className="p-8">
            <CardContent className="text-center">
              <div className="mb-8">
                <div className={`w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center ${
                  score >= 70 ? 'bg-accent text-accent-foreground' : 'bg-destructive text-destructive-foreground'
                }`}>
                  {score >= 70 ? <CheckCircle className="w-12 h-12" /> : <XCircle className="w-12 h-12" />}
                </div>
                <h1 className="text-3xl font-bold mb-2" data-testid="text-test-complete">
                  Test Complete!
                </h1>
                <p className="text-lg text-muted-foreground" data-testid="text-score">
                  Your score: {score}% ({correctAnswers}/{questions.length})
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="text-2xl font-bold text-card-foreground" data-testid="text-questions-answered">
                    {answeredCount}
                  </div>
                  <div className="text-sm text-muted-foreground">Questions Answered</div>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="text-2xl font-bold text-card-foreground" data-testid="text-correct-answers">
                    {correctAnswers}
                  </div>
                  <div className="text-sm text-muted-foreground">Correct Answers</div>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="text-2xl font-bold text-card-foreground" data-testid="text-time-used">
                    {formatTime(75 * 60 - timeRemaining)}
                  </div>
                  <div className="text-sm text-muted-foreground">Time Used</div>
                </div>
              </div>

              <div className="space-y-4">
                <Button 
                  onClick={() => window.location.reload()} 
                  className="w-full md:w-auto"
                  data-testid="button-retake-test"
                >
                  Retake Test
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setLocation("/exam-prep")}
                  className="w-full md:w-auto"
                  data-testid="button-back-exam-prep"
                >
                  Back to Exam Prep
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="ios-nav-blur border-b border-border/20 py-6 sticky top-0 z-10">
        <div className="container mx-auto px-6 sm:px-8 lg:px-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Badge className={`${config.badgeColor} px-4 py-2 rounded-2xl ios-subtitle`} data-testid="badge-exam-type">
                {config.name}
              </Badge>
              <span className="text-sm text-muted-foreground ios-body" data-testid="text-question-progress">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-sm text-muted-foreground flex items-center ios-body bg-muted/40 px-4 py-2 rounded-2xl">
                <Clock className="mr-2 w-4 h-4" />
                <span data-testid="text-time-remaining">{formatTime(timeRemaining)}</span>
              </div>
              <Button 
                className="ios-button-primary px-6 py-3"
                onClick={handleSubmitTest}
                data-testid="button-submit-test"
              >
                Submit Test
              </Button>
            </div>
          </div>
          <div className="mt-6">
            <Progress value={progress} className="h-3 bg-muted/40 rounded-full" data-testid="progress-test" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 sm:px-8 lg:px-10 py-12 max-w-5xl">
        <Card className="ios-card p-10 md:p-12 ios-slide-up">
          <CardContent className="p-0">
            {/* Question */}
            <div className="mb-10">
              <h2 className="text-2xl md:text-3xl ios-title text-card-foreground mb-8 leading-relaxed" data-testid="text-question">
                {currentQuestion.question}
              </h2>
              
              {/* Multiple Choice Options */}
              <RadioGroup 
                value={selectedAnswers[currentQuestionIndex] || ""} 
                onValueChange={handleAnswerSelect}
                className="space-y-4"
                data-testid="radio-group-answers"
              >
                {(currentQuestion.options as string[]).map((option, index) => {
                  const label = String.fromCharCode(65 + index); // A, B, C, D
                  const isSelected = selectedAnswers[currentQuestionIndex] === option;
                  return (
                    <div key={index} className={`flex items-start space-x-4 p-6 rounded-2xl border transition-all duration-200 cursor-pointer ios-scale-in ${
                      isSelected 
                        ? 'border-primary/30 bg-primary/5 shadow-sm' 
                        : 'border-border/50 hover:border-border hover:bg-muted/30 hover:shadow-sm'
                    }`}>
                      <RadioGroupItem value={option} id={`option-${index}`} className="mt-1.5 w-5 h-5" />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer ios-body" data-testid={`label-option-${index}`}>
                        <span className="ios-subtitle text-primary text-lg">{label}.</span>
                        <span className="text-card-foreground ml-3 text-lg leading-relaxed">{option}</span>
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>
            </div>
            
            {/* Navigation */}
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-6 sm:space-y-0">
              <Button 
                variant="ghost" 
                onClick={toggleBookmark}
                className={`ios-button-secondary text-muted-foreground hover:text-foreground transition-all duration-200 px-6 py-3 ${
                  bookmarkedQuestions.has(currentQuestionIndex) ? 'text-amber-600 bg-amber-50 hover:bg-amber-100' : ''
                }`}
                data-testid="button-bookmark"
              >
                <Bookmark className={`mr-2 w-4 h-4 ${bookmarkedQuestions.has(currentQuestionIndex) ? 'fill-current' : ''}`} />
                {bookmarkedQuestions.has(currentQuestionIndex) ? 'Bookmarked' : 'Bookmark Question'}
              </Button>
              
              <div className="flex space-x-4">
                <Button 
                  className="ios-button-secondary px-8 py-3"
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  data-testid="button-previous"
                >
                  <ArrowLeft className="mr-2 w-4 h-4" />
                  Previous
                </Button>
                <Button 
                  className="ios-button-primary px-8 py-3"
                  onClick={handleNext}
                  disabled={currentQuestionIndex === questions.length - 1}
                  data-testid="button-next"
                >
                  Next
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Question Navigator */}
        <Card className="ios-card mt-8 p-8">
          <CardContent className="p-0">
            <h3 className="text-xl ios-title mb-6" data-testid="text-navigator-title">Question Navigator</h3>
            <div className="grid grid-cols-8 md:grid-cols-10 gap-3">
              {questions.map((_, index) => (
                <Button
                  key={index}
                  className={`h-12 w-12 p-0 rounded-xl transition-all duration-200 ios-scale-in ${
                    currentQuestionIndex === index 
                      ? 'ios-button-primary shadow-md' 
                      : selectedAnswers[index]
                        ? 'bg-accent/20 text-accent border-accent/30 border hover:bg-accent/30'
                        : 'ios-button-secondary'
                  } ${
                    bookmarkedQuestions.has(index) ? 'ring-2 ring-amber-400 ring-offset-2' : ''
                  }`}
                  onClick={() => setCurrentQuestionIndex(index)}
                  data-testid={`button-question-${index}`}
                >
                  {index + 1}
                </Button>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-6 space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-6 text-sm ios-body">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-accent/20 border border-accent/30 rounded-lg mr-2"></div>
                  <span className="text-muted-foreground">Answered</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-amber-400 rounded-lg mr-2"></div>
                  <span className="text-muted-foreground">Bookmarked</span>
                </div>
              </div>
              <span className="text-sm ios-subtitle text-foreground" data-testid="text-answered-count">
                {answeredCount} of {questions.length} answered
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
