export const EXAM_TYPES = {
  NCLEX: "NCLEX-RN",
  MOH: "MOH",
  SNLE: "SNLE",
  DHA: "DHA",
  HAAD: "HAAD",
  IELTS: "IELTS",
} as const;

export const EXAM_CONFIGS = {
  [EXAM_TYPES.NCLEX]: {
    name: "NCLEX-RN",
    description: "Complete preparation for the National Council Licensure Examination for Registered Nurses.",
    badge: "USA/Canada",
    badgeColor: "bg-primary text-primary-foreground",
    features: ["3,500+ Practice Questions", "Detailed Rationales", "Adaptive Testing"],
    buttonColor: "bg-primary text-accent-foreground hover:bg-primary/90"
  },
  [EXAM_TYPES.MOH]: {
    name: "MOH Exam", 
    description: "Ministry of Health examination preparation for nursing positions in Gulf countries.",
    badge: "UAE/KSA",
    badgeColor: "bg-primary text-primary-foreground",
    features: ["2,800+ Practice Questions", "Country-Specific Content", "Mock Examinations"],
    buttonColor: "bg-primary text-accent-foreground hover:bg-primary/90"
  },
  [EXAM_TYPES.SNLE]: {
    name: "SNLE",
    description: "Saudi Nursing Licensure Examination for foreign Registered Nurses.",
    badge: "Saudi Arabia", 
    badgeColor: "bg-primary text-primary-foreground",
    features: ["1,200+ Practice Questions", "Local Guidelines", "Urdu Support"],
    buttonColor: "bg-primary text-accent-foreground hover:bg-primary/90"
  },
  [EXAM_TYPES.DHA]: {
    name: "DHA (Dubai)",
    badge: "Dubai",
    badgeColor: "bg-pink-500 text-white",
    description: "Master the DHA Nursing Exam with tailored quizzes and analytics.",
    features: [
      "Dubai-specific nursing scenarios",
      "AI-generated DHA-style MCQs",
      "Smart progress tracking",
    ],
  },
  [EXAM_TYPES.HAAD]: {
    name: "HAAD (Abu Dhabi)",
    badge: "Abu Dhabi",
    badgeColor: "bg-purple-500 text-white",
    description: "Ace the HAAD exam with targeted questions and mock tests.",
    features: [
      "Core medical-surgical concepts",
      "Exam simulation mode",
      "Detailed performance reports",
    ],
  },
  [EXAM_TYPES.IELTS]: {
    name: "IELTS (Academic)",
    badge: "Language",
    badgeColor: "bg-indigo-500 text-white",
    description: "Boost your IELTS scores with AI-powered question practice.",
    features: [
      "Listening & reading modules",
      "Speaking prompts with feedback",
      "Grammar and vocabulary drills",
    ],
  },
};

export const STUDY_LIBRARY_CATEGORIES = [
  "All Libraries",
  "Fundamentals",
  "Medical-Surgical",
  "Pediatrics",
  "Mental Health",
  "Community Health",
  "Clinical Skills"
];

export const COLLEGE_CITIES = [
  "All Cities",
  "Karachi",
  "Lahore", 
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta"
];

export const COLLEGE_PROGRAMS = [
  "All Programs",
  "BSN",
  "MSN", 
  "Post-RN BSN",
  "Diploma",
  "PhD"
];
