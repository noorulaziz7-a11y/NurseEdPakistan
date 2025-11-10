import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, LogOut, UserCircle, Settings } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import MobileMenu from "./mobile-menu";

export default function Header() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/exam-prep", label: "Exam Prep" },
    { href: "/colleges", label: "Colleges" },
    { href: "/study-library", label: "Study Library" },
    { href: "/news", label: "News" },
    { href: "/about-us", label: "About Us" },
  ];

  const isActiveLink = (href: string) => {
    if (href === "/" && location === "/") return true;
    if (href !== "/" && location.startsWith(href)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 ios-nav-blur border-b border-border/20 ios-fade-in bg-white">
      <nav className="container mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 ios-scale-in" data-testid="logo-link">
            <div className="w-12 h-12 flex items-center justify-center">
              <img
                src="/images/logo.png"
                alt="Nursing Educator Hub Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="text-xl ios-title text-foreground font-bold">Nursing Educator Hub</div>
              <p className="text-xs ios-body text-muted-foreground opacity-80"></p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-xl transition-all duration-200 ios-subtitle text-sm ${
                  isActiveLink(link.href)
                    ? "text-white bg-blue shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                }`}
                data-testid={`nav-link-${link.label.toLowerCase().replace(" ", "-")}`}
              >
                {link.label}
              </Link>
            ))}

            {/* Auth / User Menu */}
            <div className="ml-4 flex items-center space-x-3">
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full hover:shadow-sm transition-all duration-200"
                      data-testid="button-user-menu"
                    >
                      <Avatar className="h-10 w-10 border-2 border-border/20">
                        <AvatarFallback className="bg-primary/10 text-primary ios-subtitle">
                          {user?.firstName?.[0]?.toUpperCase()}
                          {user?.lastName?.[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="ios-card min-w-[220px] p-2">
                    <div className="flex items-center justify-start gap-3 p-3 rounded-xl bg-muted/30">
                      <Avatar className="h-12 w-12 border-2 border-border/20">
                        <AvatarFallback className="bg-primary/10 text-primary ios-subtitle">
                          {user?.firstName?.[0]?.toUpperCase()}
                          {user?.lastName?.[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="ios-subtitle text-foreground" data-testid="text-user-name">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p
                          className="text-sm text-muted-foreground ios-body truncate max-w-[140px]"
                          data-testid="text-user-email"
                        >
                          {user?.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator className="my-2" />
                    <DropdownMenuItem asChild data-testid="menu-item-profile" className="rounded-lg p-3 cursor-pointer">
                      <Link href="/profile" className="flex items-center">
                        <UserCircle className="mr-3 h-4 w-4 text-muted-foreground" />
                        <span className="ios-body">Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild data-testid="menu-item-settings" className="rounded-lg p-3 cursor-pointer">
                      <Link href="/settings" className="flex items-center">
                        <Settings className="mr-3 h-4 w-4 text-muted-foreground" />
                        <span className="ios-body">Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-2" />
                    <DropdownMenuItem
                      className="rounded-lg p-3 cursor-pointer text-destructive focus:text-destructive"
                      onClick={logout}
                      data-testid="menu-item-logout"
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      <span className="ios-body">Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button asChild className="ios-button-primary px-6 py-2" data-testid="button-signin">
                  <Link href="/auth">Sign In</Link>
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-10 w-10 rounded-xl hover:bg-muted/40 transition-all duration-200"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </Button>
        </div>

        {/* Mobile Menu Component */}
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
