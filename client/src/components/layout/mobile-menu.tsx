import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/shared/ui/sheet";
import { Link } from "wouter";

export default function MobileMenu({
  isOpen,
  onClose,
  navLinks,
  isActiveLink,
}: {
  isOpen: boolean;
  onClose: () => void;
  navLinks: { href: string; label: string }[];
  isActiveLink: (href: string) => boolean;
}) {
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-[280px] sm:w-[320px]">
        <SheetHeader>
          <SheetTitle className="text-lg font-semibold">Menu</SheetTitle>
        </SheetHeader>
        <nav className="mt-6 flex flex-col gap-2">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <span
                onClick={onClose}
                className={`block rounded-xl px-3 py-2 text-base font-medium transition ${
                  isActiveLink(link.href)
                    ? "bg-blue-600 text-white"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                }`}
              >
                {link.label}
              </span>
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
