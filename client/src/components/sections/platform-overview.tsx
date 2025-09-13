import { Link } from "wouter";
import { ClipboardCheck, University, BookOpen } from "lucide-react";

export default function PlatformOverview() {
  const features = [
    {
      icon: ClipboardCheck,
      title: "Exam Preparation",
      description: "Comprehensive modules for NCLEX-RN, MOH, and SNLE exams with practice questions and detailed explanations.",
      link: "/exam-prep",
      linkText: "Explore Exams",
      color: "bg-primary/10 text-primary",
      gradient: "from-primary/5 to-primary/10"
    },
    {
      icon: University,
      title: "College Directory", 
      description: "Complete database of nursing colleges across Pakistan with admission details, programs, and contact information.",
      link: "/colleges",
      linkText: "Find Colleges",
      color: "bg-secondary/10 text-secondary",
      gradient: "from-secondary/5 to-secondary/10"
    },
    {
      icon: BookOpen,
      title: "Study Resources",
      description: "Downloadable study materials, textbooks, and reference guides organized by subject and difficulty level.",
      link: "/study-materials", 
      linkText: "Access Materials",
      color: "bg-accent/10 text-accent",
      gradient: "from-accent/5 to-accent/10"
    }
  ];

  return (
    <section className="py-20 md:py-24 bg-background" data-testid="platform-overview-section">
      <div className="container mx-auto px-6 sm:px-8 lg:px-10">
        <div className="text-center mb-16 ios-fade-in">
          <h2 className="text-3xl md:text-5xl ios-title text-foreground mb-6 leading-tight" data-testid="text-section-title">
            Everything You Need to{" "}
            <span className="text-primary">Succeed</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto ios-body leading-relaxed" data-testid="text-section-subtitle">
            From exam preparation to career guidance, NurseEd Pakistan provides all the tools and resources you need for nursing success.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <Link
              key={index}
              href={feature.link}
              className="block ios-card p-8 group cursor-pointer ios-slide-up"
              style={{ animationDelay: `${index * 150}ms` }}
              data-testid={`card-feature-${feature.title.toLowerCase().replace(" ", "-")}`}
            >
              <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200`}>
                <feature.icon className="text-2xl" />
              </div>
              <h3 className="text-2xl ios-subtitle text-card-foreground mb-4 group-hover:text-primary transition-colors duration-200" data-testid={`text-feature-title-${index}`}>
                {feature.title}
              </h3>
              <p className="text-muted-foreground mb-6 ios-body leading-relaxed" data-testid={`text-feature-description-${index}`}>
                {feature.description}
              </p>
              <div className="flex items-center text-primary ios-subtitle group-hover:text-primary/80 transition-colors duration-200" data-testid={`link-feature-${index}`}>
                <span>{feature.linkText}</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
