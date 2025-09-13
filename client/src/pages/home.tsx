import Hero from "@/components/sections/hero";
import PlatformOverview from "@/components/sections/platform-overview";
import ExamModules from "@/components/sections/exam-modules";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Clock, Bookmark } from "lucide-react";
import type { ExamQuestion } from "@shared/schema";
import { useState } from "react";

export default function Home() {
  const [selectedAnswer, setSelectedAnswer] = useState("");

  const { data: questions, isLoading } = useQuery<ExamQuestion[]>({
    queryKey: ["/api/exam-questions/NCLEX-RN"],
    // Get first question for demo
  });

  return (
    <div>
      <Hero />
      <PlatformOverview />
      <ExamModules />
      
      {/* Practice Test Demo */}
      <section className="py-20 md:py-24 bg-muted/20" data-testid="practice-demo-section">
        <div className="container mx-auto px-6 sm:px-8 lg:px-10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12 ios-fade-in">
              <h2 className="text-3xl md:text-5xl ios-title text-foreground mb-6 leading-tight" data-testid="text-practice-demo-title">
                Interactive{" "}
                <span className="text-primary">Practice Tests</span>
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto ios-body leading-relaxed" data-testid="text-practice-demo-subtitle">
                Experience our adaptive testing system with immediate feedback and detailed explanations.
              </p>
            </div>
            
            <Card className="ios-card p-8 md:p-10 ios-slide-up">
              <CardContent className="p-0">
                {/* Question Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-4">
                    <span className="bg-primary/10 text-primary ios-subtitle text-sm px-4 py-2 rounded-2xl" data-testid="badge-demo-exam-type">
                      NCLEX-RN
                    </span>
                    <span className="text-sm text-muted-foreground ios-body" data-testid="text-demo-question-number">
                      Question 15 of 50
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center ios-body bg-muted/40 px-4 py-2 rounded-2xl">
                    <Clock className="mr-2 w-4 h-4" />
                    <span data-testid="text-demo-time-remaining">12:45</span>
                  </div>
                </div>
                
                {/* Question */}
                {isLoading ? (
                  <div className="animate-pulse">
                    <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                    <div className="space-y-3">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-10 bg-muted rounded"></div>
                      ))}
                    </div>
                  </div>
                ) : questions && questions.length > 0 ? (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-card-foreground mb-4" data-testid="text-demo-question">
                      {questions[0].question}
                    </h3>
                    
                    {/* Multiple Choice Options */}
                    <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer} className="space-y-3" data-testid="radio-group-demo-answers">
                      {(questions[0].options as string[]).map((option, index) => {
                        const label = String.fromCharCode(65 + index); // A, B, C, D
                        return (
                          <div key={index} className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors">
                            <RadioGroupItem value={option} id={`option-${index}`} className="mt-1" />
                            <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer" data-testid={`label-demo-option-${index}`}>
                              <span className="font-medium text-card-foreground">{label}.</span>
                              <span className="text-card-foreground ml-2">{option}</span>
                            </Label>
                          </div>
                        );
                      })}
                    </RadioGroup>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground" data-testid="text-demo-error">Unable to load practice question</p>
                  </div>
                )}
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                  <Button variant="ghost" className="ios-button-secondary text-muted-foreground hover:text-foreground transition-colors" data-testid="button-demo-bookmark">
                    <Bookmark className="mr-2 w-4 h-4" />
                    Bookmark Question
                  </Button>
                  <div className="flex space-x-3">
                    <Button className="ios-button-secondary px-6 py-3" data-testid="button-demo-previous">
                      Previous
                    </Button>
                    <Button className="ios-button-primary px-6 py-3" data-testid="button-demo-submit">
                      Submit Answer
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
