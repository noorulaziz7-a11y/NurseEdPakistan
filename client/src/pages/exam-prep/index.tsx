import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  BookOpen,
  Award,
  Users,
  TrendingUp,
  FileQuestion,
  Sparkles,
  Lightbulb,
  Clock,
  CheckCircle2,
  ArrowRight,
  Filter,
  X,
} from "lucide-react";
import { ExamCardSkeleton } from "@/components/skeleton/ExamCardSkeleton";
import ExamCard from "./components/Exam-Card";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Fallback exam data to ensure page always renders
const FALLBACK_EXAMS = [
  {
    id: "nclex",
    name: "NCLEX-RN",
    description: "US/Canada licensure exam",
    badge: "Popular",
    badgeColor: "bg-blue-100 text-blue-700",
    region: "North America",
  },
  {
    id: "snle",
    name: "SNLE",
    description: "Saudi licensure exam",
    badge: "KSA",
    badgeColor: "bg-green-100 text-green-700",
    region: "Middle East",
  },
  {
    id: "moh",
    name: "MOH",
    description: "UAE Ministry of Health exam",
    badge: "UAE",
    badgeColor: "bg-yellow-100 text-yellow-700",
    region: "Middle East",
  },
  {
    id: "dha",
    name: "DHA",
    description: "Dubai Health Authority exam",
    badge: "Dubai",
    badgeColor: "bg-red-100 text-red-700",
    region: "Middle East",
  },
  {
    id: "haad",
    name: "HAAD",
    description: "Abu Dhabi DOH exam",
    badge: "Abu Dhabi",
    badgeColor: "bg-purple-100 text-purple-700",
    region: "Middle East",
  },
  {
    id: "ielts",
    name: "IELTS",
    description: "Language proficiency",
    badge: "Language",
    badgeColor: "bg-pink-100 text-pink-700",
    region: "Global",
  },
];

const REGIONS = ["All Regions", "North America", "Middle East", "Global"];
const STUDY_TIPS = [
  {
    icon: Clock,
    title: "Study Consistently",
    tip: "Dedicate 30-60 minutes daily rather than cramming. Consistency beats intensity.",
  },
  {
    icon: CheckCircle2,
    title: "Practice Regularly",
    tip: "Take practice quizzes weekly to identify weak areas and track progress.",
  },
  {
    icon: BookOpen,
    title: "Review Explanations",
    tip: "Read detailed explanations for every question, even if you got it right.",
  },
  {
    icon: TrendingUp,
    title: "Track Your Progress",
    tip: "Use the dashboard to monitor your performance and focus on improvement areas.",
  },
];

// SVG Background Pattern Component
const BackgroundPattern = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <svg
      className="absolute top-0 left-0 w-full h-full opacity-5"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="grid"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="20" cy="20" r="1.5" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
    {/* Gradient Blobs */}
    <div className="absolute top-20 right-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
    <div className="absolute top-40 left-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
  </div>
);

// Hero Section Component
const HeroSection = () => (
  <motion.section
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-black py-20 px-4 overflow-hidden"
  >
    <BackgroundPattern />
    <div className="relative max-w-7xl mx-auto text-center z-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex items-center justify-center gap-3 mb-6"
      >
        <Sparkles className="w-10 h-10 text-yellow-300" />
        <h1 className="text-5xl md:text-6xl font-bold font-['Poppins',sans-serif]">
          Nursing LiExam Prep Hub
        </h1>
        <Sparkles className="w-10 h-10 text-yellow-300" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto font-['Nunito',sans-serif] leading-relaxed"
      >
        Master your nursing licensure exams with comprehensive study materials,
        AI-powered practice quizzes, and expert guidance. Your path to success
        starts here.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-8 flex flex-wrap items-center justify-center gap-4 text-blue-100"
      >
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-medium">10,000+ Questions</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-medium">Expert Explanations</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-medium">Progress Tracking</span>
        </div>
      </motion.div>
    </div>
  </motion.section>
);

// Stats Section Component
const StatsSection = ({ examCount }: { examCount: number }) => {
  const stats = [
    {
      icon: Award,
      value: examCount.toString(),
      label: "Available Exams",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: Users,
      value: "10K+",
      label: "Active Learners",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: FileQuestion,
      value: "10K+",
      label: "Practice Questions",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: TrendingUp,
      value: "95%",
      label: "Pass Rate",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className="max-w-7xl mx-auto px-4 -mt-12 mb-12 relative z-20"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <Card className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden">
                <CardContent className={`p-6 text-center ${stat.bgColor}`}>
                  <Icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                  <div
                    className={`text-3xl font-bold mb-1 font-['Poppins',sans-serif] ${stat.color}`}
                  >
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 font-medium font-['Nunito',sans-serif]">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
};

// Search & Filter Section Component
const SearchFilterSection = ({
  searchQuery,
  setSearchQuery,
  selectedRegion,
  setSelectedRegion,
}: {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
}) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      className="max-w-7xl mx-auto px-4 mb-8"
    >
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
          <Input
            type="text"
            placeholder="Search exams by name, description, or region..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-12 h-14 text-base shadow-lg border-2 border-gray-200 focus:border-blue-500 rounded-2xl font-['Nunito',sans-serif]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-3 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="rounded-full font-['Nunito',sans-serif]"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex gap-2 flex-wrap"
              >
                {REGIONS.map((region) => (
                  <button
                    key={region}
                    onClick={() => setSelectedRegion(region)}
                    className={`px-4 py-2 rounded-full text-sm font-medium font-['Nunito',sans-serif] transition-all ${
                      selectedRegion === region
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {region}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Active Filters Display */}
        {(searchQuery || selectedRegion !== "All Regions") && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-sm text-gray-600 font-['Nunito',sans-serif]"
          >
            <span>Active filters:</span>
            {searchQuery && (
              <Badge className="bg-blue-100 text-blue-700">
                Search: "{searchQuery}"
              </Badge>
            )}
            {selectedRegion !== "All Regions" && (
              <Badge className="bg-purple-100 text-purple-700">
                {selectedRegion}
              </Badge>
            )}
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedRegion("All Regions");
              }}
              className="text-blue-600 hover:text-blue-700 font-medium ml-2"
            >
              Clear all
            </button>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};

// Study Tips Section Component
const StudyTipsSection = () => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.7, duration: 0.6 }}
    className="max-w-7xl mx-auto px-4 mb-12"
  >
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-xl rounded-2xl overflow-hidden">
      <CardContent className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-600 rounded-xl">
            <Lightbulb className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 font-['Poppins',sans-serif]">
            Study Tips & Best Practices
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {STUDY_TIPS.map((tip, index) => {
            const Icon = tip.icon;
            return (
              <motion.div
                key={tip.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-white p-5 rounded-xl shadow-md"
              >
                <Icon className="w-6 h-6 text-blue-600 mb-3" />
                <h3 className="font-semibold text-gray-800 mb-2 font-['Poppins',sans-serif]">
                  {tip.title}
                </h3>
                <p className="text-sm text-gray-600 font-['Nunito',sans-serif] leading-relaxed">
                  {tip.tip}
                </p>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  </motion.section>
);

// Main Component
export default function ExamPrepPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All Regions");

  const { data: exams, isLoading, isError, error } = useQuery({
    queryKey: ["exams"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/exams", {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          throw new Error(`Failed to fetch exams: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          return data;
        }
        console.warn("Server returned empty exams array, using fallback");
        return FALLBACK_EXAMS;
      } catch (err) {
        console.warn("/api/exams failed — using client fallback.", err);
        return FALLBACK_EXAMS;
      }
    },
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    retry: 1,
    retryDelay: 1000,
  });

  // Filter exams based on search query and region
  const filteredExams = useMemo(() => {
    const displayExams = exams && Array.isArray(exams) && exams.length > 0 ? exams : FALLBACK_EXAMS;
    let filtered = displayExams;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (exam: any) =>
          exam.name.toLowerCase().includes(query) ||
          exam.description.toLowerCase().includes(query) ||
          (exam.badge && exam.badge.toLowerCase().includes(query)) ||
          (exam.region && exam.region.toLowerCase().includes(query))
      );
    }

    // Region filter
    if (selectedRegion !== "All Regions") {
      filtered = filtered.filter(
        (exam: any) => exam.region === selectedRegion
      );
    }

    return filtered;
  }, [exams, searchQuery, selectedRegion]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
        <HeroSection />
        <StatsSection examCount={0} />
        <div className="max-w-7xl mx-auto px-4 pb-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <ExamCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md"
        >
          <div className="text-6xl mb-4">😢</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2 font-['Poppins',sans-serif]">
            Failed to load exams
          </h2>
          <p className="text-gray-600 mb-6 font-['Nunito',sans-serif]">
            Please check your server connection or try again later.
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-3 font-['Nunito',sans-serif]"
          >
            Retry
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
      <HeroSection />
      <StatsSection examCount={filteredExams.length} />

      <div className="max-w-7xl mx-auto">
        <SearchFilterSection
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedRegion={selectedRegion}
          setSelectedRegion={setSelectedRegion}
        />

        {/* Exams Grid Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="px-4 mb-12"
        >
          {filteredExams.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Search className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2 font-['Poppins',sans-serif]">
                No exams found
              </h3>
              <p className="text-gray-500 mb-4 font-['Nunito',sans-serif]">
                Try adjusting your search query or filters
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedRegion("All Regions");
                }}
                variant="outline"
                className="rounded-xl font-['Nunito',sans-serif]"
              >
                Clear filters
              </Button>
            </motion.div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-2 font-['Poppins',sans-serif]">
                  Select Your Exam
                </h2>
                <p className="text-gray-600 font-['Nunito',sans-serif]">
                  Choose from our comprehensive collection of nursing licensure
                  exams. {filteredExams.length} exam{filteredExams.length !== 1 ? "s" : ""} available
                </p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="wait">
                  {filteredExams.map((exam: any, index: number) => (
                    <motion.div
                      key={exam.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                      layout
                    >
                      <ExamCard exam={exam} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}
        </motion.section>

        <StudyTipsSection />
      </div>
    </div>
  );
}
