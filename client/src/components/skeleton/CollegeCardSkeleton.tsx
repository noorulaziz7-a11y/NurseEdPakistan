import React from "react";
import { Skeleton } from "@/shared/ui/skeleton";
import { Card, CardContent } from "@/shared/ui/card";

export default function CollegeCardSkeleton() {
  return (
    <Card className="w-full border shadow-sm">
      <CardContent className="p-5 space-y-3">
        <Skeleton className="h-6 w-3/5" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-32 w-full rounded-lg" />
      </CardContent>
    </Card>
  );
}
