// Quiz Setup Page - iOS-inspired design
import { useState } from "react";
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Play, CheckCircle2, BookOpen, Target, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SUBJECTS = [
  "Medical-Surgical",
  "Pediatrics",
  "Pharmacology",
  "Mental Health",
  "Maternal-Newborn",
  "Community Health",
  "Leadership",
  "Research",
];

const DIFFICULTY_LEVELS = [
  { value: "beginner", label: "Easy", color: "text-green-600" },
  { value: "intermediate", label: "Medium", color: "text-yellow-600" },
  { value: "advanced", label: "Hard", color: "text-red-600" },
];

const QUESTION_COUNTS = [10, 25, 50, 100];

export default function QuizSetupPage() {
  const { examId } = useParams<{ examId: string }>();
  const { toast } = useToast();
  
  const [subjects, setSubjects] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<string>("intermediate");
  const [questionCount, setQuestionCount] = useState<number>(25);

  const handleSubjectToggle = (subject: string) => {
    setSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    );
  };

  const handleStartQuiz = () => {
    if (subjects.length === 0) {
      toast({
        title: "Please select at least one subject",
        variant: "destructive",
      });
      return;
    }

    // Navigate to quiz page with params
    const params = new URLSearchParams({
      subjects: subjects.join(","),
      difficulty,
      count: questionCount.toString(),
    });
    window.location.href = `/exam-prep/${examId}/quiz?${params.toString()}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link href={`/exam-prep/${examId}`}>
            <Button variant="ghost" className="mb-4 -ml-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Overview
            </Button>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 font-['SF_Pro_Display',system-ui,sans-serif]">
            Quiz Setup
          </h1>
          <p className="text-lg text-gray-600 font-['SF_Pro_Text',system-ui,sans-serif]">
            Configure your practice session to match your learning goals
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Configuration Card */}
          <div className="md:col-span-2 space-y-6">
            {/* Subjects Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-0 shadow-lg rounded-3xl bg-white/80 backdrop-blur-xl">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-xl">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-semibold">Subjects</CardTitle>
                      <CardDescription>Select one or more subjects to practice</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {SUBJECTS.map((subject) => {
                      const isSelected = subjects.includes(subject);
                      return (
                        <motion.button
                          key={subject}
                          onClick={() => handleSubjectToggle(subject)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`p-4 rounded-2xl border-2 transition-all duration-200 font-medium text-sm ${
                            isSelected
                              ? "bg-blue-50 border-blue-500 text-blue-700 shadow-md"
                              : "bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{subject}</span>
                            {isSelected && (
                              <CheckCircle2 className="w-4 h-4 ml-2" />
                            )}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Difficulty Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-0 shadow-lg rounded-3xl bg-white/80 backdrop-blur-xl">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-xl">
                      <Target className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-semibold">Difficulty Level</CardTitle>
                      <CardDescription>Choose the challenge level</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={difficulty} onValueChange={setDifficulty}>
                    <div className="grid grid-cols-3 gap-4">
                      {DIFFICULTY_LEVELS.map((level) => (
                        <motion.div
                          key={level.value}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Label
                            htmlFor={level.value}
                            className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                              difficulty === level.value
                                ? "bg-purple-50 border-purple-500 shadow-md"
                                : "bg-gray-50 border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <RadioGroupItem
                              value={level.value}
                              id={level.value}
                              className="sr-only"
                            />
                            <span className={`text-lg font-semibold mb-1 ${level.color}`}>
                              {level.label}
                            </span>
                            <span className="text-xs text-gray-500 capitalize">
                              {level.value}
                            </span>
                          </Label>
                        </motion.div>
                      ))}
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </motion.div>

            {/* Question Count */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-0 shadow-lg rounded-3xl bg-white/80 backdrop-blur-xl">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-xl">
                      <Clock className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-semibold">Number of Questions</CardTitle>
                      <CardDescription>Select how many questions to practice</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Select
                    value={questionCount.toString()}
                    onValueChange={(value) => setQuestionCount(parseInt(value))}
                  >
                    <SelectTrigger className="h-14 rounded-2xl border-2 text-lg font-medium">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {QUESTION_COUNTS.map((count) => (
                        <SelectItem key={count} value={count.toString()}>
                          {count} Questions
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Summary Card */}
          <div className="md:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="border-0 shadow-xl rounded-3xl bg-gradient-to-br from-blue-500 to-blue-600 text-black sticky top-8">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold mb-2">Quiz Summary</CardTitle>
                  <CardDescription className="text-blue-100">
                    Review your settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-blue-100 mb-1">Subjects</p>
                    <p className="font-semibold">
                      {subjects.length > 0 ? subjects.join(", ") : "None selected"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-100 mb-1">Difficulty</p>
                    <p className="font-semibold capitalize">
                      {DIFFICULTY_LEVELS.find((l) => l.value === difficulty)?.label}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-100 mb-1">Questions</p>
                    <p className="font-semibold">{questionCount}</p>
                  </div>
                  <div className="pt-4 border-t border-blue-400/30">
                    <p className="text-sm text-blue-100 mb-2">Estimated Time</p>
                    <p className="text-2xl font-bold">
                      {Math.ceil(questionCount * 1.5)} min
                    </p>
                  </div>
                  <Button
                    onClick={handleStartQuiz}
                    className="w-full bg-white text-blue-600 hover:bg-blue-50 h-12 rounded-2xl font-semibold text-lg shadow-lg mt-6"
                    disabled={subjects.length === 0}
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Start Quiz
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

