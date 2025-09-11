import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="gradient-bg text-primary-foreground py-20" data-testid="hero-section">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6" data-testid="text-hero-title">
            Advance Your Nursing Career in Pakistan
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90" data-testid="text-hero-subtitle">
            Comprehensive exam preparation, college directory, and study resources for nursing professionals and students across Pakistan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/practice-test/NCLEX-RN">
              <Button 
                className="bg-primary-foreground text-primary px-8 py-3 rounded-lg font-semibold hover:bg-primary-foreground/90 transition-colors"
                data-testid="button-start-practice"
              >
                Start Practice Tests
              </Button>
            </Link>
            <Link href="/colleges">
              <Button 
                variant="outline"
                className="border-2 border-primary-foreground text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary-foreground/10 transition-colors"
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
