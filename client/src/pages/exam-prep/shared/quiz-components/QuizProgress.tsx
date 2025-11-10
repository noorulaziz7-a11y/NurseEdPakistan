import React from "react";
export default function QuizProgress({ current, total }: { current: number;
total: number }) {
const percent = Math.round((current / total) * 100);
return (
<div>
<div className="flex justify-between text-sm text-muted-foreground
mb-2">
<span>Question</span>
<span>{current}/{total}</span>
</div>
<div className="w-full bg-muted/30 rounded-full h-2">
<div className="h-2 rounded-full bg-primary" style={{ width: `$
{percent}%` }} />
</div>
</div>
);
}
