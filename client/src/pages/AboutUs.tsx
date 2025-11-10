import React from "react";

const AboutUs: React.FC = () => {
  return (
    <section className="bg-gray-50 py-16 px-6 md:px-20">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-blue-700 mb-6">
          Educate Nursing Students Across The Globe
        </h1>
        <p className="text-lg text-gray-700 mb-12">
          At <span className="font-semibold text-blue-600">Nursing Educator</span>, our mission is to empower
          the next generation of nurses by providing accessible, high-quality learning resources,
          innovative tools, and mentorship. We believe in making nursing education interactive,
          evidence-based, and globally connected — helping students excel in academics and
          clinical practice.
        </p>

        <div className="grid md:grid-cols-2 gap-12 text-left">
          <div>
            <h2 className="text-2xl font-semibold text-blue-700 mb-4">Our Mission</h2>
            <ul className="space-y-3 text-gray-700">
              <li>💡 Simplifying complex nursing concepts through digital tools</li>
              <li>🌍 Promoting collaboration among nursing students worldwide</li>
              <li>🧠 Bridging the gap between classroom knowledge and clinical skills</li>
              <li>❤️ Encouraging compassionate, ethical, and evidence-based practice</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-blue-700 mb-4">About Us</h2>
            <p className="text-gray-700 leading-relaxed">
              NurseEdPakistan is a digital learning platform built by nurses, for nurses. We
              support nursing students, educators, and professionals through study materials,
              quizzes, clinical resources, and educational updates. Our goal is to connect learners
              with knowledge and opportunities to grow in their careers.
            </p>
            <ul className="mt-4 space-y-2 text-gray-700">
              <li>📚 Free and structured nursing study materials</li>
              <li>🧾 Past papers and exam preparation guides</li>
              <li>💬 Articles, tutorials, and leadership insights</li>
              <li>🏥 Clinical concept maps and EBP projects</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
