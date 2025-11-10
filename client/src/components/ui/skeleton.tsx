// src/components/ui/skeleton.tsx
import React from "react";
import { cn } from "@/lib/utils";

/**
 * 🔹 Generic Skeleton Loader
 * Usage:
 * <Skeleton className="h-6 w-24 rounded" />
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse bg-gray-200 dark:bg-gray-700 rounded-md",
        className
      )}
    />
  );
}
