import { useState } from "react";
import { useParams } from "wouter";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Brain, Layers, Settings, CheckCircle2 } from "lucide-react";

const SUBJECTS = [
  "Medical-Surgical",
  "Pediatrics",
  "Pharmacology",
  "Mental Health",
  "Maternal-Newborn",
];

const SYSTEMS = [
  "Cardiovascular",
  "Respiratory",
  "Neurological",
  "Musculoskeletal",
  "Renal",
  "Gastrointestinal",
  "Endocrine",
  "Reproductive",
  "Hematologic",
];

const DIFFICULTY_LEVELS = [
  // Must match backend `exam_questions.difficulty` values: beginner, intermediate, advanced
  { label: "Beginner", value: "beginner" },
  { label: "Intermediate", value: "intermediate" },
  { label: "Advanced", value: "advanced" },
];
const QUESTION_COUNTS = [10, 25, 50, 100];

export default function QuizSetupForm() {
  const { examId } = useParams<{ examId: string }>();

  const [subject, setSubject] = useState("");
  const [system, setSystem] = useState("");
  const [difficulty, setDifficulty] = useState("intermediate");
  const [count, setCount] = useState(25);

  const handleStart = () => {
    // Don't force filters: many question banks won't have `system` populated yet.
    // If nothing is selected, we'll still run a valid quiz with difficulty + count.

    const params = new URLSearchParams({
      difficulty,
      count: count.toString(),
    });

    if (subject) params.set("subjects", subject); // quiz.tsx expects `subjects`
    if (system) params.set("system", system);

    window.location.href = `/exam-prep/${examId}/quiz?${params.toString()}`;
  };

  return (
    <motion.div
      className="max-w-lg w-full mx-auto"
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-0 shadow-2xl rounded-3xl bg-white/90 backdrop-blur-xl">
        <CardHeader className="pb-2 text-center">
          <CardTitle className="text-3xl font-bold text-blue-700 font-['Nunito',sans-serif]">
            Quiz Setup
          </CardTitle>
          <p className="text-gray-500 text-sm mt-2">
            Customize your quiz below — just like UWorld!
          </p>
        </CardHeader>

        <CardContent className="space-y-6 p-6">
          {/* Subject Selection */}
          <div>
            <label className="text-sm font-semibold text-gray-600 flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-blue-600" /> Subject
            </label>
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger className="h-12 rounded-xl border-gray-200">
                <SelectValue placeholder="Select Subject" />
              </SelectTrigger>
              <SelectContent>
                {SUBJECTS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* System Selection */}
          <div>
            <label className="text-sm font-semibold text-gray-600 flex items-center gap-2 mb-2">
              <Layers className="w-4 h-4 text-blue-600" /> System
            </label>
            <Select value={system} onValueChange={setSystem}>
              <SelectTrigger className="h-12 rounded-xl border-gray-200">
                <SelectValue placeholder="Select System" />
              </SelectTrigger>
              <SelectContent>
                {SYSTEMS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Difficulty */}
          <div>
            <label className="text-sm font-semibold text-gray-600 flex items-center gap-2 mb-2">
              <Brain className="w-4 h-4 text-blue-600" /> Difficulty Level
            </label>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger className="h-12 rounded-xl border-gray-200">
                <SelectValue placeholder="Select Difficulty" />
              </SelectTrigger>
              <SelectContent>
                {DIFFICULTY_LEVELS.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Question Count */}
          <div>
            <label className="text-sm font-semibold text-gray-600 flex items-center gap-2 mb-2">
              <Settings className="w-4 h-4 text-blue-600" /> Number of Questions
            </label>
            <Select value={count.toString()} onValueChange={(v) => setCount(parseInt(v))}>
              <SelectTrigger className="h-12 rounded-xl border-gray-200">
                <SelectValue placeholder="Select Number of Questions" />
              </SelectTrigger>
              <SelectContent>
                {QUESTION_COUNTS.map((c) => (
                  <SelectItem key={c} value={c.toString()}>
                    {c} Questions
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Preview Card */}
          {(subject || system) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 bg-blue-50 border border-blue-100 p-4 rounded-xl text-blue-700"
            >
              <p className="font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Quiz Preview
              </p>
              <p className="text-sm mt-1">
                {subject && <span>📘 <strong>{subject}</strong></span>}{" "}
                {system && <span>• 🩺 <strong>{system}</strong></span>}{" "}
                | {count} Questions • {DIFFICULTY_LEVELS.find(d => d.value === difficulty)?.label} Mode
              </p>
            </motion.div>
          )}

          {/* Start Button */}
          <Button
            onClick={handleStart}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            Start Quiz
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
