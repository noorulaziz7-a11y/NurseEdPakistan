import { Link } from "wouter";
import { User, Facebook, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-blue rounded-lg flex items-center justify-center">
                <User className="text-white text-lg" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-card-foreground">Nursing Educator Hub</h3>
          
              </div>
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              Empowering nursing professionals and students across Pakistan with comprehensive education resources and career guidance.
            </p>
            <div className="flex space-x-3">
              <button className="w-8 h-8 bg-muted rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors" data-testid="button-facebook">
                <Facebook className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 bg-muted rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors" data-testid="button-twitter">
                <Twitter className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 bg-muted rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors" data-testid="button-linkedin">
                <Linkedin className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Education */}
          <div>
            <h4 className="text-lg font-semibold text-card-foreground mb-4">Education</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/exam-prep" className="hover:text-foreground transition-colors" data-testid="footer-link-nclex">NCLEX-RN Prep</Link></li>
              <li><Link href="/exam-prep" className="hover:text-foreground transition-colors" data-testid="footer-link-moh">MOH Exam Prep</Link></li>
              <li><Link href="/exam-prep" className="hover:text-foreground transition-colors" data-testid="footer-link-snle">SNLE Preparation</Link></li>
              <li><Link href="/practice-test/NCLEX-RN" className="hover:text-foreground transition-colors" data-testid="footer-link-practice">Practice Tests</Link></li>
              <li><Link href="/study-library" className="hover:text-foreground transition-colors" data-testid="footer-link-materials">Study Library</Link></li>
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold text-card-foreground mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/colleges" className="hover:text-foreground transition-colors" data-testid="footer-link-colleges">College Directory</Link></li>
              <li><a href="#" className="hover:text-foreground transition-colors" data-testid="footer-link-career">Career Guidance</a></li>
              <li><Link href="/news" className="hover:text-foreground transition-colors" data-testid="footer-link-news">News & Updates</Link></li>
              <li><a href="#" className="hover:text-foreground transition-colors" data-testid="footer-link-blog">Blog</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors" data-testid="footer-link-faq">FAQs</a></li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold text-card-foreground mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors" data-testid="footer-link-contact">Contact Us</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors" data-testid="footer-link-help">Help Center</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors" data-testid="footer-link-privacy">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors" data-testid="footer-link-terms">Terms of Service</a></li>
              <li><Link href="/about-us" className="hover:text-foreground transition-colors" data-testid="footer-link-about">About Us</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground" data-testid="text-copyright">
            © 2025 Nursing Educator Hub. All rights reserved. | Designed for BSN Students and Registered Nurses.
          </p>
        </div>
      </div>
    </footer>
  );
}
