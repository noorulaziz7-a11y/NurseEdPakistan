// app/routes.tsx
import Home from "@/pages/home";
import AboutUs from "@/pages/AboutUs";
import Colleges from "@/pages/colleges";
import News from "@/pages/news";
import StudyLibrary from "@/pages/Study-Libray";
import AuthPage from "@/pages/auth";
import NotFound from "@/pages/not-found";
import ExamPrep from "@/pages/exam-prep";
import DynamicExamPage from "@/pages/exam-prep/DynamicExamPage";

// Shared exam pages
import StudyMaterialsPage from "@/pages/exam-prep/shared/StudyMaterialsPage";
import StudyGuidesPage from "@/pages/exam-prep/shared/StudyGuidesPage";
import FlashcardsPage from "@/pages/exam-prep/shared/FlashcardsPage";
import NursingNotesPage from "@/pages/exam-prep/shared/NursingNotesPage";
import PastPapersPage from "@/pages/exam-prep/shared/PastPapersPage";

// Quizzes
import QuizIndex from "@/pages/exam-prep/shared/quizzes/index";
import QuizSetup from "@/pages/exam-prep/shared/quizzes/setup";
import QuizPage from "@/pages/exam-prep/shared/quizzes/quiz";
import QuizResult from "@/pages/exam-prep/shared/quizzes/result";

// IELTS modules
import IELTSDashboard from "@/pages/exam-prep/ielts/dashboard";
import IELTSListening from "@/pages/exam-prep/ielts/listening";
import IELTSReading from "@/pages/exam-prep/ielts/reading";
import IELTSWriting from "@/pages/exam-prep/ielts/writing";
import IELTSSpeaking from "@/pages/exam-prep/ielts/speaking";

// New exam-prep subpages
import ResourcesPage from "@/pages/exam-prep/resources";
import ProgressPage from "@/pages/exam-prep/progress";
import GuidePage from "@/pages/exam-prep/guide";

// New pages
import Dashboard from "@/pages/dashboard";
import Contact from "@/pages/contact";

export const routes = [
  // 🏠 Core
  { path: "/", component: Home },
  { path: "/about-us", component: AboutUs },
  { path: "/colleges", component: Colleges },
  { path: "/news", component: News },
  { path: "/study-library", component: StudyLibrary },
  { path: "/auth", component: AuthPage },
  { path: "/contact", component: Contact },

  // 📘 Exam prep
  { path: "/exam-prep", component: ExamPrep },
  { path: "/exam-prep/dashboard", component: Dashboard },
  { path: "/exam-prep/leaderboard", component: () => import("@/pages/exam-prep/leaderboard").then(m => m.default) },
  { path: "/exam-prep/daily-challenge", component: () => import("@/pages/exam-prep/daily-challenge").then(m => m.default) },
  { path: "/exam-prep/analytics", component: () => import("@/pages/exam-prep/analytics").then(m => m.default) },

  // 🎧 IELTS
  { path: "/exam-prep/ielts", component: IELTSDashboard },
  { path: "/exam-prep/ielts/listening", component: IELTSListening },
  { path: "/exam-prep/ielts/reading", component: IELTSReading },
  { path: "/exam-prep/ielts/writing", component: IELTSWriting },
  { path: "/exam-prep/ielts/speaking", component: IELTSSpeaking },

  // 🧩 Shared
  { path: "/exam-prep/:examId/studymaterials", component: StudyMaterialsPage },
  { path: "/exam-prep/:examId/studyguides", component: StudyGuidesPage },
  { path: "/exam-prep/:examId/flashcards", component: FlashcardsPage },
  { path: "/exam-prep/:examId/notes", component: NursingNotesPage },
  { path: "/exam-prep/:examId/pastpapers", component: PastPapersPage },

  // 🧩 Quizzes
  { path: "/exam-prep/:examId/quizzes", component: QuizIndex },
  { path: "/exam-prep/:examId/quizzes/setup", component: QuizSetup },
  { path: "/exam-prep/:examId/quiz", component: QuizPage },
  { path: "/exam-prep/:examId/quiz/result", component: QuizResult },

  // 📚 New exam-prep subpages
  { path: "/exam-prep/:examId/resources", component: ResourcesPage },
  { path: "/exam-prep/:examId/progress", component: ProgressPage },
  { path: "/exam-prep/:examId/guide", component: GuidePage },

  // 🧠 Dynamic exam home (must be last to avoid route conflicts)
  { path: "/exam-prep/:examId", component: DynamicExamPage },

  // 🚫 404
  { path: "*", component: NotFound },
];
