// src/pages/exam-prep/ielts/index.tsx
import { Link } from "wouter";
import { BookOpen, Headphones, Mic, PenTool } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function IELTSOverview() {
  return (
    <section className="bg-gradient-to-b from-blue-50 via-white to-gray-50 min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-6 text-center">
        {/* Header */}
        <h1 className="text-5xl font-bold text-gray-800 mb-4">IELTS Exam Modules</h1>
        <p className="text-gray-600 max-w-2xl mx-auto mb-10">
          Prepare for all four IELTS modules — Listening, Reading, Writing, and Speaking — with expert-designed materials and practice sets.
        </p>

        {/* Module Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <IELTSCard
            icon={<Headphones className="w-10 h-10 text-blue-600" />}
            title="Listening"
            description="Improve your listening comprehension with audio exercises."
            link="/exam-prep/ielts/listening"
          />
          <IELTSCard
            icon={<BookOpen className="w-10 h-10 text-green-600" />}
            title="Reading"
            description="Enhance reading speed and comprehension for IELTS passages."
            link="/exam-prep/ielts/reading"
          />
          <IELTSCard
            icon={<PenTool className="w-10 h-10 text-purple-600" />}
            title="Writing"
            description="Learn essay structures and report writing for IELTS tasks."
            link="/exam-prep/ielts/writing"
          />
          <IELTSCard
            icon={<Mic className="w-10 h-10 text-orange-600" />}
            title="Speaking"
            description="Boost your speaking confidence with guided question sets."
            link="/exam-prep/ielts/speaking"
          />
        </div>

        {/* Subscription CTA */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Upgrade for Full Access</h2>
          <p className="text-gray-600 mb-6">
            Unlock premium IELTS content, audio materials, and expert feedback.
          </p>
          <Link href="/pricing">
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              View Subscription Plans
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function IELTSCard({
  icon,
  title,
  description,
  link,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
}) {
  return (
    <Link href={link}>
      <Card className="hover:shadow-2xl hover:scale-[1.03] transition-transform duration-300 bg-white border border-gray-100 rounded-2xl cursor-pointer">
        <CardContent className="flex flex-col items-center justify-center text-center p-8 space-y-3">
          <div className="p-4 bg-gray-50 rounded-full">{icon}</div>
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
