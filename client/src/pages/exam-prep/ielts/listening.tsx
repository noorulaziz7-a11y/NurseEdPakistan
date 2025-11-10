// src/pages/exam-prep/ielts/listening.tsx
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function IELTSListening() {
  return (
    <section className="bg-gradient-to-b from-blue-50 via-white to-gray-50 min-h-screen py-16 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">IELTS Listening</h1>
        <p className="text-gray-600 mb-8">
          Practice listening skills using IELTS-style audio materials and comprehension questions.
        </p>
        <audio controls className="mx-auto mb-6">
          <source src="/audios/sample-listening.mp3" type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
        <p className="text-gray-500 text-sm mb-10">🎧 Example Audio Task (Section 1)</p>

        <Link href="/exam-prep/ielts">
          <Button variant="outline" className="border-blue-600 text-blue-600">
            Back to IELTS Overview
          </Button>
        </Link>
      </div>
    </section>
  );
}
