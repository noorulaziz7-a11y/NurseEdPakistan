// pages/exam-prep/components/exam-nav.tsx
import { Link, useLocation } from "wouter";

interface Props { examId: string; }

export default function ExamNav({ examId }: Props) {
  const [location] = useLocation();
  const base = `/exam-prep/${examId}`;

  const tabs = [
    { label: "Study Materials", path: `${base}/study-materials` },
    { label: "Quizzes", path: `${base}/quizzes` },
    { label: "Performance Overview", path: `${base}/overview` },
  ];

  return (
    <nav className="flex gap-4 border-b pb-3">
      {tabs.map(t => {
        const active = location === t.path || location === base;
        return (
          <Link key={t.path} href={t.path}>
            <a className={`cursor-pointer pb-2 ${active ? "text-primary border-b-2 border-primary" : "text-muted-foreground"}`}>
              {t.label}
            </a>
          </Link>
        );
      })}
    </nav>
  );
}
