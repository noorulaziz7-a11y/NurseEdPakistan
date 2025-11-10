import React from "react";
import Skeleton from "@/components/ui/skeleton";

export const QuizSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 p-4 bg-white dark:bg-slate-800 rounded-lg">
      <Skeleton className="h-6 w-1/2" />
      <Skeleton className="h-40 w-full rounded" />
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-10 w-full rounded" />
        <Skeleton className="h-10 w-full rounded" />
        <Skeleton className="h-10 w-full rounded" />
        <Skeleton className="h-10 w-full rounded" />
      </div>
    </div>
  );
};

export default QuizSkeleton;
