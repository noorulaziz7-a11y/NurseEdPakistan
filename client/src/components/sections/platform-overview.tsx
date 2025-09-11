import { Link } from "wouter";
import { ClipboardCheck, University, BookOpen } from "lucide-react";

export default function PlatformOverview() {
  const features = [
    {
      icon: ClipboardCheck,
      title: "Exam Preparation",
      description: "Comprehensive modules for NCLEX-RN, MOH, and SNLE exams with practice questions and detailed explanations.",
      link: "/exam-prep",
      linkText: "Explore Exams →",
      color: "bg-primary/10 text-primary"
    },
    {
      icon: University,
      title: "College Directory", 
      description: "Complete database of nursing colleges across Pakistan with admission details, programs, and contact information.",
      link: "/colleges",
      linkText: "Find Colleges →",
      color: "bg-secondary/10 text-secondary"
    },
    {
      icon: BookOpen,
      title: "Study Resources",
      description: "Downloadable study materials, textbooks, and reference guides organized by subject and difficulty level.",
      link: "/study-materials", 
      linkText: "Access Materials →",
      color: "bg-accent/10 text-accent"
    }
  ];

  return (
    <section className="py-16 bg-muted/30" data-testid="platform-overview-section">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="text-section-title">
            Everything You Need to Succeed
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-section-subtitle">
            From exam preparation to career guidance, NurseEd Pakistan provides all the tools and resources you need for nursing success.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="feature-card bg-card rounded-lg p-6 shadow-sm border border-border hover:shadow-md transition-all"
              data-testid={`card-feature-${feature.title.toLowerCase().replace(" ", "-")}`}
            >
              <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                <feature.icon className="text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-3" data-testid={`text-feature-title-${index}`}>
                {feature.title}
              </h3>
              <p className="text-muted-foreground mb-4" data-testid={`text-feature-description-${index}`}>
                {feature.description}
              </p>
              <Link 
                href={feature.link} 
                className="text-primary font-medium hover:underline"
                data-testid={`link-feature-${index}`}
              >
                {feature.linkText}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
