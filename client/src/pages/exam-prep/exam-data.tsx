// src/pages/exam-prep/exam-data.tsx

export interface ExamInfo {
  id: string;
  name: string;
  description: string;
  country: string;
  badge?: string;
  badgeColor: string;
}

export const exams: ExamInfo[] = [
  {
    id: "nclex",
    name: "NCLEX-RN",
    description:
      "The National Council Licensure Examination for Registered Nurses (NCLEX-RN) evaluates nursing competence for practice in the United States and Canada.",
    country: "USA & Canada",
    badge: "USA",
    badgeColor: "bg-blue-500",
  },
  {
    id: "moh",
    name: "MOH",
    description:
      "The Ministry of Health (MOH) exam is required for nurses seeking licensure in the UAE under the MOH authority.",
    country: "UAE",
    badge: "UAE",
    badgeColor: "bg-teal-500",
  },
  {
    id: "dha",
    name: "DHA",
    description:
      "The Dubai Health Authority (DHA) exam is for nurses who wish to practice in Dubai healthcare facilities.",
    country: "Dubai",
    badge: "UAE",
    badgeColor: "bg-pink-500",
  },
  {
    id: "haad",
    name: "HAAD",
    description:
      "The HAAD (now DOH Abu Dhabi) exam assesses nurses for licensure in the Abu Dhabi region.",
    country: "Abu Dhabi",
    badge: "UAE",
    badgeColor: "bg-orange-500",
  },
  {
    id: "snle",
    name: "SNLE",
    description:
      "The Saudi Nursing Licensure Exam (SNLE) ensures nurses meet the professional practice standards of Saudi Arabia.",
    country: "Saudi Arabia",
    badge: "Saudi Arabia",
    badgeColor: "bg-green-500",
  },
  {
    id: "ielts",
    name: "IELTS",
    description:
      "The International English Language Testing System (IELTS) measures language proficiency for healthcare professionals.",
    country: "Global",
    badge: "Intl",
    badgeColor: "bg-purple-500",
  },
];
