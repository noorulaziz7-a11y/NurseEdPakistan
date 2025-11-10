// src/pages/exam-prep/ielts/reading.tsx
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function IELTSReading() {
  return (
    <section className="bg-gradient-to-b from-blue-50 via-white to-gray-50 min-h-screen py-16 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">IELTS Reading</h1>
        <p className="text-gray-600 mb-8">
          Improve your reading comprehension and time management through realistic IELTS passages and questions.
        </p>

        <div className="bg-white shadow-md p-6 rounded-xl text-left">
          <h2 className="font-semibold text-lg mb-3">Sample Passage</h2>
          <p className="text-gray-700 mb-4">
            The concept of global warming refers to the long-term rise in the average temperature of the Earth’s climate system...
          </p>
          <p className="text-gray-700 mb-4">
            This environmental phenomenon has far-reaching effects on weather patterns, ecosystems, and sea levels.
          </p>
        </div>

        <Link href="/exam-prep/ielts">
          <Button variant="outline" className="mt-8 border-blue-600 text-blue-600">
            Back to IELTS Overview
          </Button>
        </Link>
      </div>
    </section>
  );
}
