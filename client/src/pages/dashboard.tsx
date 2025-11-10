// src/pages/exam-prep/dashboard.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Button } from "@/components/ui/button";
import { Target, Clock, TrendingUp, CheckCircle } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

const mockData = [
  { name: "NCLEX", score: 78 },
  { name: "MOH", score: 65 },
  { name: "SNLE", score: 89 },
  { name: "DHA", score: 58 },
  { name: "HAAD", score: 64 },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background text-foreground py-16">
      <div className="container mx-auto px-4 md:px-8">
        <h1 className="text-3xl font-bold text-center mb-10">
          📊 My Exam Dashboard
        </h1>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="text-center shadow-md border-t-4 border-blue-500">
            <CardContent className="py-6">
              <Target className="w-6 h-6 mx-auto text-blue-600 mb-2" />
              <h3 className="text-2xl font-bold">82%</h3>
              <p className="text-sm text-muted-foreground">Overall Accuracy</p>
            </CardContent>
          </Card>
          <Card className="text-center shadow-md border-t-4 border-green-500">
            <CardContent className="py-6">
              <TrendingUp className="w-6 h-6 mx-auto text-green-600 mb-2" />
              <h3 className="text-2xl font-bold">+15%</h3>
              <p className="text-sm text-muted-foreground">Weekly Progress</p>
            </CardContent>
          </Card>
          <Card className="text-center shadow-md border-t-4 border-indigo-500">
            <CardContent className="py-6">
              <Clock className="w-6 h-6 mx-auto text-indigo-600 mb-2" />
              <h3 className="text-2xl font-bold">36 hrs</h3>
              <p className="text-sm text-muted-foreground">Study Time</p>
            </CardContent>
          </Card>
          <Card className="text-center shadow-md border-t-4 border-yellow-500">
            <CardContent className="py-6">
              <CheckCircle className="w-6 h-6 mx-auto text-yellow-600 mb-2" />
              <h3 className="text-2xl font-bold">214</h3>
              <p className="text-sm text-muted-foreground">Quizzes Completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Progress */}
        <Card className="mb-12">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">My Exam Progress</h2>
            <div className="space-y-5">
              {mockData.map((exam) => (
                <div key={exam.name}>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">{exam.name}</span>
                    <span className="text-muted-foreground">{exam.score}%</span>
                  </div>
                  <ProgressBar value={exam.score} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chart */}
        <Card className="mb-12">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              Performance by Exam
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button className="px-8 py-3 text-base font-semibold">
            Start New Quiz
          </Button>
        </div>
      </div>
    </div>
  );
}
