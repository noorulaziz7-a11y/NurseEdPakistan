import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Play,
  BookOpen,
  Award,
  Users,
  TrendingUp,
  CheckCircle2,
  Star,
  Sparkles,
  GraduationCap,
  Target,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Background Pattern Component
const BackgroundPattern = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Grid Pattern */}
    <svg
      className="absolute top-0 left-0 w-full h-full opacity-[0.03]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="hero-grid"
          width="60"
          height="60"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="30" cy="30" r="1.5" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hero-grid)" />
    </svg>
    {/* Animated Gradient Blobs */}
    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
    <div className="absolute top-20 left-10 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
    <div className="absolute -bottom-20 left-1/3 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
  </div>
);

// Trust Badge Component
const TrustBadge = ({ icon: Icon, text, delay }: { icon: any; text: string; delay: number }) => {
  const Component = Icon;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5 }}
      className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20"
    >
      <Component className="w-4 h-4 text-yellow-300" />
      <span className="text-sm font-medium text-white">{text}</span>
    </motion.div>
  );
};

// Feature Pill Component
const FeaturePill = ({ icon: Icon, text, delay }: { icon: any; text: string; delay: number }) => {
  const Component = Icon;
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="flex items-center gap-2 text-white/90"
    >
      <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
        <Component className="w-4 h-4" />
      </div>
      <span className="text-sm font-medium font-['Nunito',sans-serif]">{text}</span>
    </motion.div>
  );
};

// Stats Component
const StatCard = ({ value, label, icon: Icon, delay }: { value: string; label: string; icon: any; delay: number }) => {
  const Component = Icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="text-center"
    >
      <div className="flex items-center justify-center gap-2 mb-2">
        <Component className="w-5 h-5 text-yellow-300" />
        <div className="text-3xl md:text-4xl font-bold text-white font-['Poppins',sans-serif]">
          {value}
        </div>
      </div>
      <div className="text-sm text-white/80 font-['Nunito',sans-serif]">{label}</div>
    </motion.div>
  );
};

interface HeroProps {
  title?: string;
  subtitle?: string;
  description?: string;
  primaryCTA?: { text: string; href: string };
  secondaryCTA?: { text: string; href: string };
  showStats?: boolean;
  showTrustBadges?: boolean;
  showFeatures?: boolean;
  customBadge?: string;
}

export default function Hero({
  title = "Master Your Nursing Career",
  subtitle = "Comprehensive exam prep, interactive learning, and expert guidance",
  description = "to help you succeed in NCLEX, MOH, DHA, and more.",
  primaryCTA = { text: "Start Free Trial", href: "/exam-prep" },
  secondaryCTA = { text: "Watch Demo", href: "/study-library" },
  showStats = true,
  showTrustBadges = true,
  showFeatures = true,
  customBadge = "#1 Nursing Education Platform",
}: HeroProps = {}) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800">
      <BackgroundPattern />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column - Content */}
          <motion.div
            className="text-center lg:text-left space-y-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Trust Badges */}
            {showTrustBadges && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-6"
              >
                <TrustBadge icon={Award} text="95% Pass Rate" delay={0.3} />
                <TrustBadge icon={Star} text="4.9/5 Rating" delay={0.4} />
                <TrustBadge icon={Users} text="10K+ Students" delay={0.5} />
              </motion.div>
            )}

            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="space-y-4"
            >
              {customBadge && (
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                  <Sparkles className="w-8 h-8 text-yellow-300" />
                  <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm font-['Nunito',sans-serif]">
                    {customBadge}
                  </Badge>
                </div>
              )}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight font-['Poppins',sans-serif]">
                {title.split(" ").map((word, i, arr) =>
                  i === arr.length - 1 ? (
                    <span key={i} className="block bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
                      {word}
                    </span>
                  ) : (
                    <span key={i}>{word} </span>
                  )
                )}
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-['Nunito',sans-serif]">
                {subtitle} {description}
              </p>
            </motion.div>

            {/* Feature Pills */}
            {showFeatures && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="grid grid-cols-2 gap-3 max-w-md mx-auto lg:mx-0"
              >
                <FeaturePill icon={BookOpen} text="10K+ Practice Questions" delay={0.6} />
                <FeaturePill icon={Zap} text="AI-Powered Learning" delay={0.7} />
                <FeaturePill icon={Target} text="Personalized Study Plans" delay={0.8} />
                <FeaturePill icon={GraduationCap} text="Expert Instructors" delay={0.9} />
              </motion.div>
            )}

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4"
            >
              <Link href={primaryCTA.href}>
                <Button
                  size="lg"
                  className="group bg-white text-blue-600 hover:bg-blue-50 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl px-8 py-6 text-lg font-semibold font-['Nunito',sans-serif]"
                >
                  {primaryCTA.text}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              {secondaryCTA && (
                <Link href={secondaryCTA.href}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="group border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm rounded-xl px-8 py-6 text-lg font-semibold font-['Nunito',sans-serif]"
                  >
                    <Play className="mr-2 w-5 h-5" />
                    {secondaryCTA.text}
                  </Button>
                </Link>
              )}
            </motion.div>

            {/* Stats Row */}
            {showStats && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="grid grid-cols-3 gap-4 pt-8 border-t border-white/20"
              >
                <StatCard value="10K+" label="Questions" icon={BookOpen} delay={0.9} />
                <StatCard value="95%" label="Pass Rate" icon={TrendingUp} delay={1.0} />
                <StatCard value="6" label="Exams" icon={Award} delay={1.1} />
              </motion.div>
            )}
          </motion.div>

          {/* Right Column - Visual Element */}
          <motion.div
            className="relative hidden lg:block"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {/* Floating Cards */}
            <div className="relative w-full h-[600px]">
              {/* Main Card */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 right-10 bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/20 w-64"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-semibold font-['Poppins',sans-serif]">NCLEX Prep</div>
                    <div className="text-white/70 text-sm font-['Nunito',sans-serif]">In Progress</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-white/80">
                    <span className="font-['Nunito',sans-serif]">Progress</span>
                    <span className="font-semibold">75%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "75%" }}
                      transition={{ duration: 1, delay: 1 }}
                      className="h-2 bg-gradient-to-r from-yellow-300 to-pink-300 rounded-full"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Secondary Card */}
              <motion.div
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute bottom-20 left-0 bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/20 w-56"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-5 h-5 text-yellow-300" />
                  <div className="text-white font-semibold font-['Poppins',sans-serif]">Achievement</div>
                </div>
                <div className="text-white/90 text-sm font-['Nunito',sans-serif]">
                  Completed 500+ questions this week!
                </div>
              </motion.div>

              {/* Third Card */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-1/2 left-10 bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/20 w-52"
              >
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-5 h-5 text-green-300" />
                  <div className="text-white font-semibold font-['Poppins',sans-serif]">Streak</div>
                </div>
                <div className="text-2xl font-bold text-white font-['Poppins',sans-serif]">12 Days</div>
                <div className="text-white/70 text-sm font-['Nunito',sans-serif]">Study streak active</div>
              </motion.div>

              {/* Central Illustration Placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                  className="w-64 h-64 bg-white/5 backdrop-blur-sm rounded-3xl border-2 border-white/20 flex items-center justify-center"
                >
                  <GraduationCap className="w-32 h-32 text-white/30" />
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Mobile Image */}
          <motion.div
            className="lg:hidden relative mt-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <div className="relative w-full h-64 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-center">
              <GraduationCap className="w-32 h-32 text-white/30" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-white/60"
        >
          <span className="text-sm font-['Nunito',sans-serif]">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 h-1.5 bg-white/60 rounded-full"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
