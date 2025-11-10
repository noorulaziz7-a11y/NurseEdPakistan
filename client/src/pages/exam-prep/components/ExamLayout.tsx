// src/pages/exam-prep/components/ExamLayout.tsx
import { ReactNode } from "react";
import { motion } from "framer-motion";

interface ExamLayoutProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
}

export default function ExamLayout({ title, subtitle, children }: ExamLayoutProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-white text-gray-900 flex flex-col items-center py-10 px-6 sm:px-12 lg:px-20"
    >
      <div className="max-w-6xl w-full space-y-8">
        {title && (
          <header className="border-b pb-4">
            <h1 className="text-3xl font-bold text-primary">{title}</h1>
            {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
          </header>
        )}
        <div>{children}</div>
      </div>
    </motion.section>
  );
}
