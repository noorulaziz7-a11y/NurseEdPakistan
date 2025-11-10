import { Link } from "wouter";
import { ClipboardCheck, Newspaper, BookOpen } from "lucide-react";
import React from "react";

const PLATFORM_TITLE = "Everything You Need to Succeed";
const PLATFORM_SUBTITLE = "From exam preparation to career guidance, Nursing Educator provides all the tools and resources you need for Nursing success.";

const features = [
  {
    icon: ClipboardCheck,
    title: "Exam Preparation",
    description: "Comprehensive modules for NCLEX-RN, MOH, and SNLE exams with practice questions and detailed explanations.",
    link: "/exam-prep",
    linkText: "Explore Exams",
    color: "text-blue-600",
    gradient: "from-blue-100 via-blue-50 to-blue-100",
  },
  {
    icon: Newspaper,
    title: "News",
    description: "Stay updated with the latest news and developments in the nursing field.",
    link: "/news",
    linkText: "Read News",
    color: "bg-indigo-100 text-indigo-600",
    gradient: "from-indigo-50 to-indigo-100"
  },
  {
    icon: BookOpen,
    title: "Study Library",
    description: "Downloadable study materials, textbooks, and reference guides organized by subject and difficulty level.",
    link: "/Study-Library",
    linkText: "Access Materials",
    color: "bg-cyan-100 text-cyan-600",
    gradient: "from-cyan-50 to-cyan-100"
  }
];

const PlatformOverview: React.FC = () => {
  return (
    <section className="relative py-24 bg-gradient-to-b from-background via-blue-50/50 to-background overflow-hidden">
      <div className="container mx-auto px-6 sm:px-8 lg:px-10">
        <div className="text-center mb-16 ios-fade-in">
          <h2 className="text-3xl md:text-5xl ios-title text-foreground mb-6 leading-tight" data-testid="text-section-title">
            <span className="text-primary">{PLATFORM_TITLE}</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto ios-body leading-relaxed" data-testid="text-section-subtitle">
            {PLATFORM_SUBTITLE}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <Link
              key={feature.title}
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
};

export default React.memo(PlatformOverview);
