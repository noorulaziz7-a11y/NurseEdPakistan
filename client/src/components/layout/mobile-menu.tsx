import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Link } from "wouter";

export default function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Colleges", path: "/colleges" },
    { name: "Courses", path: "/courses" },
    { name: "Exam Prep", path: "/exam-prep" },
    { name: "Study Library", path: "/study-library" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[250px]">
        <SheetHeader>
          <SheetTitle className="text-lg font-semibold">Menu</SheetTitle>
        </SheetHeader>
        <nav className="mt-6 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link key={link.path} href={link.path}>
              <span
                onClick={onClose}
                className="block text-base font-medium text-muted-foreground hover:text-primary transition"
              >
                {link.name}
              </span>
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
