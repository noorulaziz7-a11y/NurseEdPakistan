import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Star,
  CheckCircle2,
  ArrowRight,
  Users,
  Award,
  BookOpen,
  TrendingUp,
  Shield,
  Clock,
  Zap,
  Target,
  GraduationCap,
  MessageSquare,
  ChevronDown,
  Quote,
  Play,
} from "lucide-react";
import Hero from "@/components/sections/hero";
import PlatformOverview from "../components/sections/platform-overview";
import { useState } from "react";

// SEO Metadata Component
export const HomePageSEO = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "Nursing Educator Hub",
    description: "Comprehensive nursing education platform for NCLEX, MOH, DHA, HAAD, and SNLE exam preparation",
    url: "https://nursingeducatorhub.com",
    logo: "https://nursingeducatorhub.com/logo.png",
    founder: {
      "@type": "Person",
      name: "Noor Dawar",
      jobTitle: "BSN Graduate",
      alumniOf: "PIMS Islamabad",
    },
    offers: {
      "@type": "Offer",
      category: "Educational Service",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <meta
        name="description"
        content="Master your nursing career with comprehensive exam prep for NCLEX, MOH, DHA, HAAD, and SNLE. 10K+ practice questions, AI-powered learning, and expert guidance."
      />
      <meta
        name="keywords"
        content="nursing education, NCLEX prep, MOH exam, DHA exam, HAAD exam, SNLE exam, nursing licensure, nursing study materials, nursing practice questions"
      />
      <meta property="og:title" content="Nursing Educator Hub - Master Your Nursing Career" />
      <meta
        property="og:description"
        content="Comprehensive exam prep, interactive learning, and expert guidance for nursing licensure exams."
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://nursingeducatorhub.com" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Nursing Educator Hub - Master Your Nursing Career" />
      <meta
        name="twitter:description"
        content="Comprehensive exam prep, interactive learning, and expert guidance for nursing licensure exams."
      />
    </>
  );
};

// Testimonials Data
const testimonials = [
  {
    name: "Sarah Ahmed, RN",
    role: "NCLEX-RN Passed",
    location: "Karachi, Pakistan",
    rating: 5,
    text: "This platform made NCLEX prep so easy! The practice questions were spot-on and the detailed explanations helped me understand concepts I was struggling with. Passed on my first try!",
    avatar: "SA",
  },
  {
    name: "Ahmed Hassan",
    role: "DHA Licensed Nurse",
    location: "Dubai, UAE",
    rating: 5,
    text: "The AI-powered quizzes feel exactly like real exam questions. The personalized study plan kept me on track, and I felt confident going into my DHA exam.",
    avatar: "AH",
  },
  {
    name: "Maria Khan, BSN",
    role: "MOH Certified",
    location: "Riyadh, Saudi Arabia",
    rating: 5,
    text: "I love how the progress tracking shows my weak areas clearly. The study materials are comprehensive and the platform is so user-friendly. Highly recommend!",
    avatar: "MK",
  },
  {
    name: "Fatima Ali",
    role: "SNLE Passed",
    location: "Lahore, Pakistan",
    rating: 5,
    text: "The study library has everything I needed. The flashcards and practice tests were invaluable. This platform truly prepared me for success.",
    avatar: "FA",
  },
];

// Features Data
const features = [
  {
    icon: BookOpen,
    title: "10,000+ Practice Questions",
    description: "Comprehensive question bank covering all major nursing licensure exams with detailed explanations.",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    icon: Zap,
    title: "AI-Powered Learning",
    description: "Personalized study recommendations and adaptive learning paths based on your performance.",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    icon: Target,
    title: "Progress Tracking",
    description: "Real-time analytics and performance insights to help you identify and improve weak areas.",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    icon: GraduationCap,
    title: "Expert Instructors",
    description: "Learn from experienced nursing educators and industry professionals.",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    icon: Clock,
    title: "Flexible Study Schedule",
    description: "Study at your own pace with 24/7 access to all materials and resources.",
    color: "text-pink-600",
    bgColor: "bg-pink-50",
  },
  {
    icon: Shield,
    title: "95% Pass Rate",
    description: "Join thousands of successful nurses who passed their exams using our platform.",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
  },
];

// FAQ Data
const faqs = [
  {
    question: "Which nursing exams does the platform cover?",
    answer:
      "We provide comprehensive preparation for NCLEX-RN (US/Canada), MOH (UAE), DHA (Dubai), HAAD (Abu Dhabi), SNLE (Saudi Arabia), and IELTS for language proficiency requirements.",
  },
  {
    question: "How does the AI-powered learning work?",
    answer:
      "Our AI analyzes your performance on practice questions and quizzes to identify your strengths and weaknesses. It then creates personalized study plans and recommends specific topics to focus on.",
  },
  {
    question: "Can I access the platform on mobile devices?",
    answer:
      "Yes! Our platform is fully responsive and works seamlessly on smartphones, tablets, and desktop computers. Study anywhere, anytime.",
  },
  {
    question: "What's included in the free plan?",
    answer:
      "The free plan includes access to 5 practice quizzes per exam, basic performance tracking, and sample questions. Upgrade to Pro for unlimited access to all features.",
  },
  {
    question: "How accurate are the practice questions?",
    answer:
      "Our question bank is created by experienced nursing educators and regularly updated to match current exam formats. Many students report that our questions closely mirror actual exam questions.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "Yes, we offer a 30-day money-back guarantee. If you're not satisfied with our platform, contact us for a full refund.",
  },
];

// FAQ Component
const FAQItem = ({ question, answer, index }: { question: string; answer: string; index: number }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      viewport={{ once: true }}
    >
      <Card className="border-2 hover:border-primary/50 transition-colors rounded-xl">
        <CardContent className="p-6">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between text-left"
          >
            <h3 className="text-lg font-semibold text-gray-800 font-['Poppins',sans-serif] pr-4">
              {question}
            </h3>
            <ChevronDown
              className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${
                isOpen ? "transform rotate-180" : ""
              }`}
            />
          </button>
          <motion.div
            initial={false}
            animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="mt-4 text-gray-600 leading-relaxed font-['Nunito',sans-serif]">{answer}</p>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Testimonial Component
const TestimonialCard = ({
  testimonial,
  index,
}: {
  testimonial: (typeof testimonials)[0];
  index: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      viewport={{ once: true }}
    >
      <Card className="h-full bg-white shadow-lg hover:shadow-xl transition-shadow rounded-2xl border-0">
        <CardContent className="p-6">
          <div className="flex items-center gap-1 mb-4">
            {[...Array(testimonial.rating)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <Quote className="w-8 h-8 text-blue-200 mb-3" />
          <p className="text-gray-700 mb-6 leading-relaxed font-['Nunito',sans-serif]">
            "{testimonial.text}"
          </p>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
              {testimonial.avatar}
            </div>
            <div>
              <div className="font-semibold text-gray-800 font-['Poppins',sans-serif]">
                {testimonial.name}
              </div>
              <div className="text-sm text-gray-600 font-['Nunito',sans-serif]">
                {testimonial.role} • {testimonial.location}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function Home() {
  return (
    <>
      <HomePageSEO />
      <main className="bg-gradient-to-b from-background via-muted/30 to-background text-foreground overflow-hidden">
        {/* 🌟 Hero Section - Configurable */}
        <Hero />

        {/* 📊 Stats Section */}
        <motion.section
          className="py-16 bg-white border-y border-gray-200"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { icon: Users, value: "10K+", label: "Active Students", color: "text-blue-600" },
                { icon: BookOpen, value: "10K+", label: "Practice Questions", color: "text-green-600" },
                { icon: Award, value: "95%", label: "Pass Rate", color: "text-purple-600" },
                { icon: TrendingUp, value: "6", label: "Exam Types", color: "text-orange-600" },
              ].map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-center"
                  >
                    <Icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                    <div className="text-3xl md:text-4xl font-bold text-gray-800 mb-1 font-['Poppins',sans-serif]">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 font-['Nunito',sans-serif]">{stat.label}</div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* 🚀 Platform Overview Section */}
        <PlatformOverview />

        {/* ✨ Features Section */}
        <motion.section
          className="py-20 bg-gradient-to-b from-white to-blue-50/30"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200 font-['Nunito',sans-serif]">
                Why Choose Us
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 font-['Poppins',sans-serif]">
                Everything You Need to Succeed
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto font-['Nunito',sans-serif]">
                Comprehensive tools and resources designed to help you excel in your nursing career
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -5 }}
                  >
                    <Card className="h-full border-2 hover:border-primary/50 transition-all rounded-2xl shadow-md hover:shadow-xl">
                      <CardContent className="p-6">
                        <div className={`w-14 h-14 ${feature.bgColor} rounded-xl flex items-center justify-center mb-4`}>
                          <Icon className={`w-7 h-7 ${feature.color}`} />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2 font-['Poppins',sans-serif]">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed font-['Nunito',sans-serif]">
                          {feature.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* 💬 Testimonials Section */}
        <motion.section
          className="py-20 bg-white"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-green-100 text-green-700 border-green-200 font-['Nunito',sans-serif]">
                Success Stories
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 font-['Poppins',sans-serif]">
                Trusted by Thousands of Nurses
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto font-['Nunito',sans-serif]">
                See what our students have to say about their experience
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard key={testimonial.name} testimonial={testimonial} index={index} />
              ))}
            </div>
          </div>
        </motion.section>

        {/* ❤️ Our Mission Section */}
        <motion.section
          className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200 font-['Nunito',sans-serif]">
              Our Mission
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 font-['Poppins',sans-serif]">
              Empowering the Next Generation of Nurses
            </h2>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8 font-['Nunito',sans-serif]">
              <strong className="text-blue-600">Nursing Educator Hub</strong> is committed to advancing
              nursing education through accessible, innovative, and practical learning solutions. We equip
              students with exam prep tools, clinical knowledge, and career guidance to help them succeed
              in nursing school and beyond.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                "Accessible Education",
                "Innovative Learning",
                "Expert Guidance",
                "Proven Results",
              ].map((value, index) => (
                <motion.div
                  key={value}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm"
                >
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="font-medium text-gray-700 font-['Nunito',sans-serif]">{value}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* 🩺 About Us Section */}
        <motion.section
          className="py-20 md:py-24 bg-white"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-purple-100 text-purple-700 border-purple-200 font-['Nunito',sans-serif]">
                About Us
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 font-['Poppins',sans-serif]">
                Founded by a Nurse, Built for Nurses
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed font-['Nunito',sans-serif]">
                  Founded by <strong className="text-blue-600">Noor Dawar</strong> (BSN Graduate From PIMS
                  Islamabad), Nursing Educator Hub is a forward-thinking educational platform designed to
                  bridge the gap between theory and clinical practice.
                </p>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed font-['Nunito',sans-serif]">
                  We offer NCLEX, MOH, DHA, and HAAD prep, interactive quizzes, and practical study
                  resources tailored for every stage of your nursing journey.
                </p>
                <p className="text-base text-gray-600 leading-relaxed font-['Nunito',sans-serif]">
                  Our platform also features verified nursing college directories in Pakistan, helping
                  students make informed choices while connecting with a growing global community of nurses
                  and educators.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: GraduationCap, label: "Expert Faculty", count: "50+" },
                  { icon: BookOpen, label: "Study Materials", count: "500+" },
                  { icon: Users, label: "Active Students", count: "10K+" },
                  { icon: Award, label: "Success Rate", count: "95%" },
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                      viewport={{ once: true }}
                      className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl text-center border-2 border-blue-100"
                    >
                      <Icon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-800 mb-1 font-['Poppins',sans-serif]">
                        {item.count}
                      </div>
                      <div className="text-sm text-gray-600 font-['Nunito',sans-serif]">{item.label}</div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.section>

        {/* ❓ FAQ Section */}
        <motion.section
          className="py-20 bg-gradient-to-b from-gray-50 to-white"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-orange-100 text-orange-700 border-orange-200 font-['Nunito',sans-serif]">
                Frequently Asked Questions
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 font-['Poppins',sans-serif]">
                Got Questions? We've Got Answers
              </h2>
              <p className="text-xl text-gray-600 font-['Nunito',sans-serif]">
                Everything you need to know about our platform
              </p>
            </div>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <FAQItem key={index} question={faq.question} answer={faq.answer} index={index} />
              ))}
            </div>
          </div>
        </motion.section>

        {/* 💡 CTA Section */}
        <motion.section
          className="py-20 md:py-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white relative overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 font-['Poppins',sans-serif]">
                Ready to Start Your Nursing Journey?
              </h2>
              <p className="text-xl md:text-2xl mb-10 text-blue-100 font-['Nunito',sans-serif]">
                Join thousands of successful nurses and start preparing for your licensure exam today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/exam-prep">
                  <Button
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-blue-50 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl px-8 py-6 text-lg font-semibold font-['Nunito',sans-serif]"
                  >
                    Start Free Trial
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/study-library">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm rounded-xl px-8 py-6 text-lg font-semibold font-['Nunito',sans-serif]"
                  >
                    <Play className="mr-2 w-5 h-5" />
                    Watch Demo
                  </Button>
                </Link>
              </div>
              <p className="mt-6 text-blue-100 text-sm font-['Nunito',sans-serif]">
                No credit card required • 30-day money-back guarantee
              </p>
            </motion.div>
          </div>
        </motion.section>
      </main>
    </>
  );
}
