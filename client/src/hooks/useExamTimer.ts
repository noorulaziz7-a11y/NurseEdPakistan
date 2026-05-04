import { useEffect, useRef, useState } from "react";

type TimerOptions = {
  initialSeconds: number;
  autoStart?: boolean;
  onTick?: (remaining: number) => void;
};

export function useExamTimer({ initialSeconds, autoStart, onTick }: TimerOptions) {
  const [remainingSeconds, setRemainingSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(Boolean(autoStart));
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    setRemainingSeconds(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setRemainingSeconds((prev) => {
        const next = Math.max(0, prev - 1);
        if (onTick) {
          onTick(next);
        }
        if (next === 0) {
          setIsRunning(false);
        }
        return next;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, onTick]);

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  const reset = (seconds: number) => {
    setRemainingSeconds(seconds);
    setIsRunning(false);
  };

  return {
    remainingSeconds,
    isRunning,
    start,
    pause,
    reset,
    setRemainingSeconds,
  };
}
