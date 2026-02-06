// src/pages/exam-prep/dashboard.tsx
import React from "react";
import DashboardLayout from "@/modules/dashboard/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Progress } from "@/shared/ui/progress";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Target, Clock, TrendingUp, CheckCircle, ArrowUpRight } from "lucide-react";
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

const statCards = [
  {
    label: "Overall Accuracy",
    value: "82%",
    helper: "Last 30 days",
    tone: "border-blue-500/60",
    icon: Target,
  },
  {
    label: "Weekly Progress",
    value: "+15%",
    helper: "Compared to last week",
    tone: "border-emerald-500/60",
    icon: TrendingUp,
  },
  {
    label: "Study Time",
    value: "36 hrs",
    helper: "Total this month",
    tone: "border-indigo-500/60",
    icon: Clock,
  },
  {
    label: "Quizzes Completed",
    value: "214",
    helper: "All time",
    tone: "border-amber-500/60",
    icon: CheckCircle,
  },
];

export default function Dashboard() {
  return (
    <DashboardLayout
      title="My Exam Dashboard"
      description="Track performance, keep momentum, and discover your next study focus."
      actions={
        <>
          <Button variant="secondary">Download report</Button>
          <Button>
            Start New Quiz
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map((stat) => (
          <Card
            key={stat.label}
            className={`border ${stat.tone} shadow-sm bg-white/80 backdrop-blur`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <h3 className="text-2xl font-semibold text-foreground mt-2">
                    {stat.value}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-2">{stat.helper}</p>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-muted/40 flex items-center justify-center">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6 mb-10">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>My Exam Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {mockData.map((exam) => (
              <div key={exam.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{exam.name}</span>
                  <Badge variant="secondary">{exam.score}%</Badge>
                </div>
                <Progress value={exam.score} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Weekly Focus</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              Your strongest area is <span className="font-semibold text-foreground">NCLEX</span>.
            </p>
            <p>
              Your weakest area is <span className="font-semibold text-foreground">DHA</span>.
            </p>
            <p>
              Recommended: schedule two DHA practice blocks and review rationales.
            </p>
            <Button variant="outline" className="w-full">
              View study plan
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Performance by Exam</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="score" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
