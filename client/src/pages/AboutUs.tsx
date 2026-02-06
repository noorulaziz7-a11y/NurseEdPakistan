import React from "react";
import { CheckCircle2, Globe, BookOpen, Users, Target, Shield } from "lucide-react";
import { Card, CardContent } from "@/shared/ui/card";

const AboutUs: React.FC = () => {
  return (
    <section className="bg-gray-50 py-16 px-6 md:px-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border shadow-sm text-sm text-blue-700">
            <Globe className="w-4 h-4" />
            Global Nursing Education
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-blue-700 mt-6 mb-4">
            Educate Nursing Students Across the Globe
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Nursing Educator Hub empowers the next generation of nurses with accessible,
            evidence-based learning resources and structured preparation. We connect students,
            educators, and professionals to the tools they need to excel academically and clinically.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <Card className="border-0 shadow-lg rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-5 h-5 text-blue-700" />
                <h2 className="text-2xl font-semibold text-blue-700">Our Mission</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                Make nursing education practical, engaging, and universally accessible.
              </p>
              <ul className="space-y-3 text-gray-700">
                {[
                  "Simplify complex nursing concepts with clear, structured content.",
                  "Promote collaboration among nursing learners worldwide.",
                  "Bridge classroom knowledge with real-world clinical skills.",
                  "Advance compassionate, ethical, evidence-based practice.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 mt-1" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-5 h-5 text-blue-700" />
                <h2 className="text-2xl font-semibold text-blue-700">Who We Serve</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                Built by nurses, for nurses—supporting students, educators, and working
                professionals with tools that improve outcomes.
              </p>
              <ul className="space-y-3 text-gray-700">
                {[
                  "Curated study materials aligned to licensure exams.",
                  "Practice quizzes with focused explanations.",
                  "Clinical resources for bedside readiness.",
                  "Research and leadership insights for growth.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 mt-1" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-6 text-left">
          {[
            {
              icon: BookOpen,
              title: "Structured Learning",
              text: "Clear learning paths with practical study guides and exam prep.",
            },
            {
              icon: Shield,
              title: "Evidence-Based Focus",
              text: "Resources aligned to modern clinical guidelines and best practices.",
            },
            {
              icon: Globe,
              title: "Global Community",
              text: "A connected platform that supports learners across regions.",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title} className="border-0 shadow-md rounded-2xl">
                <CardContent className="p-6">
                  <Icon className="w-6 h-6 text-blue-700 mb-3" />
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.text}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
