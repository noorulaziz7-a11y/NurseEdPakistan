import { Link } from "wouter";
import { Home, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface BreadcrumbsProps {
  items: { label: string; href?: string }[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="max-w-7xl mx-auto px-4 py-4" aria-label="Breadcrumb">
      <ol className="flex items-center gap-2 text-sm text-gray-600 font-['Nunito',sans-serif]">
        <li>
          <Link
            href="/"
            className="hover:text-[#1E88E5] transition-colors flex items-center gap-1"
          >
            <Home className="w-4 h-4" />
            Home
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4 text-gray-400" />
            {item.href ? (
              <Link
                href={item.href}
                className="hover:text-[#1E88E5] transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-800 font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

