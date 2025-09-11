import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { CheckCircle } from "lucide-react";
import { EXAM_CONFIGS } from "@/lib/constants";

export default function ExamModules() {
  const examProgress = {
    "NCLEX-RN": 45,
    "MOH": 23,
    "SNLE": 78
  };

  return (
    <section className="py-16" data-testid="exam-modules-section">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="text-exam-modules-title">
            Exam Preparation Modules
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-exam-modules-subtitle">
            Structured preparation courses designed specifically for major nursing certification exams in Pakistan and internationally.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {Object.entries(EXAM_CONFIGS).map(([examType, config]) => (
            <div 
              key={examType}
              className="bg-card rounded-xl p-6 shadow-sm border border-border"
              data-testid={`card-exam-${examType.toLowerCase()}`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-card-foreground" data-testid={`text-exam-name-${examType.toLowerCase()}`}>
                  {config.name}
                </h3>
                <span className={`${config.badgeColor} text-sm px-3 py-1 rounded-full`} data-testid={`badge-${examType.toLowerCase()}`}>
                  {config.badge}
                </span>
              </div>
              
              <p className="text-muted-foreground mb-6" data-testid={`text-exam-description-${examType.toLowerCase()}`}>
                {config.description}
              </p>
              
              <div className="space-y-4 mb-6">
                {config.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-sm text-muted-foreground">
                    <CheckCircle className="text-accent mr-2 w-4 h-4" />
                    <span data-testid={`text-feature-${examType.toLowerCase()}-${index}`}>{feature}</span>
                  </div>
                ))}
              </div>
              
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>Progress</span>
                  <span data-testid={`text-progress-${examType.toLowerCase()}`}>{examProgress[examType as keyof typeof examProgress]}%</span>
                </div>
                <ProgressBar progress={examProgress[examType as keyof typeof examProgress]} />
              </div>
              
              <Link href={`/practice-test/${examType}`}>
                <Button 
                  className={`w-full py-3 rounded-lg font-semibold transition-colors ${config.buttonColor}`}
                  data-testid={`button-exam-${examType.toLowerCase()}`}
                >
                  {examProgress[examType as keyof typeof examProgress] > 0 ? "Continue Studying" : "Start Preparation"}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
