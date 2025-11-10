// src/pages/exam-prep/ielts/speaking.tsx
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function IELTSSpeaking() {
  return (
    <section className="bg-gradient-to-b from-blue-50 via-white to-gray-50 min-h-screen py-16 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">IELTS Speaking</h1>
        <p className="text-gray-600 mb-8">
          Prepare for IELTS Speaking interviews using sample questions and topic prompts.
        </p>

        <div className="bg-white p-6 rounded-xl shadow-md text-left space-y-4">
          <h2 className="font-semibold text-lg">Part 1 – Introduction</h2>
          <p className="text-gray-700">“Can you tell me about your hometown?”</p>

          <h2 className="font-semibold text-lg">Part 2 – Cue Card</h2>
          <p className="text-gray-700">“Describe a memorable trip you took.”</p>

          <h2 className="font-semibold text-lg">Part 3 – Discussion</h2>
          <p className="text-gray-700">“Why do people like to travel to different countries?”</p>
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
