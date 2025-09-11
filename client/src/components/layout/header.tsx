import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import MobileMenu from "./mobile-menu";

export default function Header() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/exam-prep", label: "Exam Prep" },
    { href: "/colleges", label: "Colleges" },
    { href: "/study-materials", label: "Study Materials" },
    { href: "/news", label: "News" },
  ];

  const isActiveLink = (href: string) => {
    if (href === "/" && location === "/") return true;
    if (href !== "/" && location.startsWith(href)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2" data-testid="logo-link">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <User className="text-primary-foreground text-lg" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">NurseEd</h1>
              <p className="text-xs text-muted-foreground">Pakistan</p>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors font-medium ${
                  isActiveLink(link.href)
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-primary"
                }`}
                data-testid={`nav-link-${link.label.toLowerCase().replace(" ", "-")}`}
              >
                {link.label}
              </Link>
            ))}
            <Button data-testid="button-signin">
              Sign In
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </Button>
        </div>
        
        <MobileMenu 
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          navLinks={navLinks}
          isActiveLink={isActiveLink}
        />
      </nav>
    </header>
  );
}
