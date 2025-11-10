import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function ExamCardSkeleton() {
  return (
    <Card className="w-full max-w-sm shadow-sm border">
      <CardContent className="p-5 space-y-4">
        <Skeleton height={160} width="100%" rounded="rounded-xl" />
        <div className="space-y-2">
          <Skeleton height={20} width="70%" />
          <Skeleton height={14} width="50%" />
        </div>
        <Skeleton height={36} width="100%" rounded="rounded-lg" />
      </CardContent>
    </Card>
  );
}
