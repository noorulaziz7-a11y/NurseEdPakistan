export const EXAM_TYPES = {
  NCLEX: "NCLEX-RN",
  MOH: "MOH",
  SNLE: "SNLE"
} as const;

export const EXAM_CONFIGS = {
  [EXAM_TYPES.NCLEX]: {
    name: "NCLEX-RN",
    description: "Complete preparation for the National Council Licensure Examination for Registered Nurses.",
    badge: "International",
    badgeColor: "bg-primary/10 text-primary",
    features: ["3,500+ Practice Questions", "Detailed Rationales", "Adaptive Testing"],
    buttonColor: "bg-primary text-primary-foreground hover:bg-primary/90"
  },
  [EXAM_TYPES.MOH]: {
    name: "MOH Exam", 
    description: "Ministry of Health examination preparation for nursing positions in Gulf countries.",
    badge: "UAE/KSA",
    badgeColor: "bg-secondary/10 text-secondary",
    features: ["2,800+ Practice Questions", "Country-Specific Content", "Mock Examinations"],
    buttonColor: "bg-secondary text-secondary-foreground hover:bg-secondary/90"
  },
  [EXAM_TYPES.SNLE]: {
    name: "SNLE",
    description: "Specialized Nursing Licensing Examination for registration with Pakistan Nursing Council.",
    badge: "Pakistan", 
    badgeColor: "bg-accent/10 text-accent",
    features: ["1,200+ Practice Questions", "Local Guidelines", "Urdu Support"],
    buttonColor: "bg-accent text-accent-foreground hover:bg-accent/90"
  }
};

export const STUDY_MATERIAL_CATEGORIES = [
  "All Materials",
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
