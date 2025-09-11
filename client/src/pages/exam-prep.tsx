import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { CheckCircle, TrendingUp, Clock, Target } from "lucide-react";
import { EXAM_CONFIGS } from "@/lib/constants";
import type { ExamQuestion } from "@shared/schema";

export default function ExamPrep() {
  const { data: nclexQuestions } = useQuery<ExamQuestion[]>({
    queryKey: ["/api/exam-questions/NCLEX-RN"],
  });

  const { data: mohQuestions } = useQuery<ExamQuestion[]>({
    queryKey: ["/api/exam-questions/MOH"],
  });

  const { data: snleQuestions } = useQuery<ExamQuestion[]>({
    queryKey: ["/api/exam-questions/SNLE"],
  });

  const examProgress = {
    "NCLEX-RN": 45,
    "MOH": 23,
    "SNLE": 78
  };

  const examStats = {
    "NCLEX-RN": {
      totalQuestions: nclexQuestions?.length || 0,
      completedSessions: 12,
      averageScore: 78,
      timeSpent: "24 hours"
    },
    "MOH": {
      totalQuestions: mohQuestions?.length || 0,
      completedSessions: 5,
      averageScore: 65,
      timeSpent: "8 hours"
    },
    "SNLE": {
      totalQuestions: snleQuestions?.length || 0,
      completedSessions: 18,
      averageScore: 89,
      timeSpent: "15 hours"
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary to-secondary text-primary-foreground py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6" data-testid="text-exam-prep-title">
              Exam Preparation Center
            </h1>
            <p className="text-xl text-primary-foreground/90 mb-8" data-testid="text-exam-prep-subtitle">
              Comprehensive preparation modules for NCLEX-RN, MOH, and SNLE nursing examinations with practice tests and detailed study materials.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Exam Modules */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {Object.entries(EXAM_CONFIGS).map(([examType, config]) => {
            const stats = examStats[examType as keyof typeof examStats];
            const progress = examProgress[examType as keyof typeof examProgress];
            
            return (
              <Card key={examType} className="overflow-hidden" data-testid={`card-exam-prep-${examType.toLowerCase()}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-semibold text-card-foreground" data-testid={`text-exam-name-${examType.toLowerCase()}`}>
                      {config.name}
                    </h3>
                    <Badge className={config.badgeColor} data-testid={`badge-${examType.toLowerCase()}`}>
                      {config.badge}
                    </Badge>
                  </div>
                  
                  <p className="text-muted-foreground mb-6" data-testid={`text-exam-description-${examType.toLowerCase()}`}>
                    {config.description}
                  </p>
                  
                  {/* Features */}
                  <div className="space-y-3 mb-6">
                    {config.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-muted-foreground">
                        <CheckCircle className="text-accent mr-2 w-4 h-4" />
                        <span data-testid={`text-feature-${examType.toLowerCase()}-${index}`}>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-muted/30 rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-card-foreground" data-testid={`text-total-questions-${examType.toLowerCase()}`}>
                        {stats.totalQuestions}
                      </div>
                      <div className="text-xs text-muted-foreground">Questions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-card-foreground" data-testid={`text-sessions-${examType.toLowerCase()}`}>
                        {stats.completedSessions}
                      </div>
                      <div className="text-xs text-muted-foreground">Sessions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-card-foreground" data-testid={`text-average-score-${examType.toLowerCase()}`}>
                        {stats.averageScore}%
                      </div>
                      <div className="text-xs text-muted-foreground">Avg Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-card-foreground" data-testid={`text-time-spent-${examType.toLowerCase()}`}>
                        {stats.timeSpent}
                      </div>
                      <div className="text-xs text-muted-foreground">Time Spent</div>
                    </div>
                  </div>
                  
                  {/* Progress */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm text-muted-foreground mb-2">
                      <span>Progress</span>
                      <span data-testid={`text-progress-${examType.toLowerCase()}`}>{progress}%</span>
                    </div>
                    <ProgressBar progress={progress} />
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Link href={`/practice-test/${examType}`} className="block">
                      <Button className={`w-full ${config.buttonColor}`} data-testid={`button-practice-test-${examType.toLowerCase()}`}>
                        <Target className="mr-2 w-4 h-4" />
                        {progress > 0 ? "Continue Practice" : "Start Practice Test"}
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full" data-testid={`button-study-guide-${examType.toLowerCase()}`}>
                      Study Guide
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Performance Overview */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h3 className="text-2xl font-semibold text-card-foreground mb-6" data-testid="text-performance-title">
              Performance Overview
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-card-foreground" data-testid="text-total-sessions">35</div>
                <div className="text-sm text-muted-foreground">Total Sessions</div>
              </div>
              
              <div className="text-center p-4 bg-secondary/5 rounded-lg">
                <Target className="w-8 h-8 text-secondary mx-auto mb-2" />
                <div className="text-2xl font-bold text-card-foreground" data-testid="text-overall-accuracy">77%</div>
                <div className="text-sm text-muted-foreground">Overall Accuracy</div>
              </div>
              
              <div className="text-center p-4 bg-accent/5 rounded-lg">
                <Clock className="w-8 h-8 text-accent mx-auto mb-2" />
                <div className="text-2xl font-bold text-card-foreground" data-testid="text-study-time">47h</div>
                <div className="text-sm text-muted-foreground">Study Time</div>
              </div>
              
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <CheckCircle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-card-foreground" data-testid="text-streak">12</div>
                <div className="text-sm text-muted-foreground">Day Streak</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Start */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-2xl font-semibold text-card-foreground mb-4" data-testid="text-quick-start-title">
              Quick Start
            </h3>
            <p className="text-muted-foreground mb-6" data-testid="text-quick-start-subtitle">
              Jump into a focused practice session or continue where you left off.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="h-16 flex flex-col space-y-1" data-testid="button-quick-nclex">
                <span className="font-semibold">NCLEX-RN</span>
                <span className="text-xs opacity-90">Continue: 45% complete</span>
              </Button>
              
              <Button variant="outline" className="h-16 flex flex-col space-y-1" data-testid="button-quick-moh">
                <span className="font-semibold">MOH Exam</span>
                <span className="text-xs">Start: Fresh session</span>
              </Button>
              
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 h-16 flex flex-col space-y-1" data-testid="button-quick-snle">
                <span className="font-semibold">SNLE</span>
                <span className="text-xs opacity-90">Continue: 78% complete</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
