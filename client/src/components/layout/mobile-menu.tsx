import { Link } from "wouter";
import { Button } from "@/components/ui/button";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: Array<{ href: string; label: string }>;
  isActiveLink: (href: string) => boolean;
}

export default function MobileMenu({ isOpen, onClose, navLinks, isActiveLink }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="md:hidden border-t border-border mt-4 pt-4 pb-4" data-testid="mobile-menu">
      <div className="flex flex-col space-y-4">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className={`transition-colors font-medium ${
              isActiveLink(link.href)
                ? "text-foreground"
                : "text-muted-foreground hover:text-primary"
            }`}
            data-testid={`mobile-nav-link-${link.label.toLowerCase().replace(" ", "-")}`}
          >
            {link.label}
          </Link>
        ))}
        <Button className="w-full" onClick={onClose} data-testid="mobile-button-signin">
          Sign In
        </Button>
      </div>
    </div>
  );
}
