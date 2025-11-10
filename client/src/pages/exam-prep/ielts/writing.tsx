// src/pages/exam-prep/ielts/writing.tsx
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function IELTSWriting() {
  return (
    <section className="bg-gradient-to-b from-blue-50 via-white to-gray-50 min-h-screen py-16 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">IELTS Writing</h1>
        <p className="text-gray-600 mb-8">
          Practice IELTS Writing Task 1 and Task 2 essays with guided examples and feedback criteria.
        </p>

        <div className="bg-white p-6 rounded-xl shadow-md text-left">
          <h2 className="font-semibold text-lg mb-3">Sample Task 2 Question:</h2>
          <p className="text-gray-700 mb-4">
            Some people believe that unpaid community service should be a compulsory part of high school programs.
            To what extent do you agree or disagree?
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
