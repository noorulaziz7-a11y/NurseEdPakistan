import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Target, TrendingUp, Clock, CheckCircle } from "lucide-react";
export default function PerformanceOverview() {
return (
<Card className="border-2 border-blue-500 rounded-2xl bg-white/10
backdrop-blur-md hover:shadow-[0_0_35px_-5px_rgba(59,130,246,0.8)]
transition-all duration-500 p-10 mb-16">
<CardContent className="p-8 text-center space-y-4">
<h3 className="text-2xl font-semibold mb-6">Performance Overview</h3>
<div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
<div className="p-4 bg-muted/30 rounded-lg border border-border/
40">
<Target className="mx-auto mb-2 text-primary w-6 h-6" />
<h4 className="text-xl font-bold">82%</h4>
<p className="text-sm text-muted-foreground">Overall Accuracy</p>
</div>
<div className="p-4 bg-muted/30 rounded-lg border border-border/
40">
<TrendingUp className="mx-auto mb-2 text-accent w-6 h-6" />
<h4 className="text-xl font-bold">+12%</h4>
<p className="text-sm text-muted-foreground">This Week’s
Progress</p>
</div>
<div className="p-4 bg-muted/30 rounded-lg border border-border/
40">
<Clock className="mx-auto mb-2 text-secondary w-6 h-6" />
<h4 className="text-xl font-bold">47 hrs</h4>
<p className="text-sm text-muted-foreground">Total Study Time</p>
</div>
<div className="p-4 bg-muted/30 rounded-lg border border-border/
40">
<CheckCircle className="mx-auto mb-2 text-green-500 w-6 h-6" />
<h4 className="text-xl font-bold">156</h4>
<p className="text-sm text-muted-foreground">Quizzes Completed</
p>
</div>
</div>
</CardContent>
</Card>
);
}