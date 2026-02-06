import { cn } from "@/lib/utils";

interface ProgressBarProps {
  progress: number;
  className?: string;
}

export function ProgressBar({ progress, className }: ProgressBarProps) {
  return (
    <div className={cn("w-full bg-muted rounded-full h-2", className)} data-testid="progress-container">
      <div 
        className="exam-progress h-2 rounded-full transition-all duration-300 ease-out"
        style={{ "--progress": `${progress}%` } as React.CSSProperties}
        data-testid="progress-bar"
      />
    </div>
  );
}
