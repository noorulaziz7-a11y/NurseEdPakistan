import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="ios-hero-gradient py-24 md:py-32" data-testid="hero-section">
      <div className="container mx-auto px-6 sm:px-8 lg:px-10">
        <div className="max-w-5xl mx-auto text-center">
          <div className="ios-fade-in">
            <h1 className="text-4xl md:text-7xl ios-title text-foreground mb-8 leading-tight" data-testid="text-hero-title">
              Advance Your{" "}
              <span className="text-primary">Nursing Career</span>{" "}
              in Pakistan
            </h1>
          </div>
          <div className="ios-slide-up">
            <p className="text-lg md:text-xl mb-12 text-muted-foreground max-w-3xl mx-auto ios-body leading-relaxed" data-testid="text-hero-subtitle">
              Comprehensive exam preparation, college directory, and study resources for nursing professionals and students across Pakistan.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto ios-scale-in">
            <Link href="/practice-test/NCLEX-RN" className="w-full sm:w-auto">
              <Button 
                className="ios-button-primary w-full sm:w-auto px-8 py-4 text-lg"
                data-testid="button-start-practice"
              >
                Start Practice Tests
              </Button>
            </Link>
            <Link href="/colleges" className="w-full sm:w-auto">
              <Button 
                className="ios-button-secondary w-full sm:w-auto px-8 py-4 text-lg"
                data-testid="button-browse-colleges"
              >
                Browse Colleges
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
