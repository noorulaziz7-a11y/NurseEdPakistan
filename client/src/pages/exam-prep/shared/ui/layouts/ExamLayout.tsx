import React from "react";
import ExamNav from "../../../components/exam-nav";

interface ExamLayoutProps {
  children: React.ReactNode;
  examId: string;
}

const ExamLayout: React.FC<ExamLayoutProps> = ({ children, examId }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <ExamNav examId={examId} />
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default ExamLayout;
