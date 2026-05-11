import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { 
  Stethoscope, 
  Activity, 
  Baby, 
  Brain, 
  Heart, 
  ShieldAlert, 
  ArrowRight,
  BookOpen,
  Clock,
  Award
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Progress } from "@/shared/ui/progress";
import { Link } from "wouter";

const SPECIALTY_ICONS: Record<string, any> = {
  icu: Activity,
  er: ShieldAlert,
  peds: Baby,
  psych: Brain,
  cardio: Heart,
  default: Stethoscope
};

export default function SpecialtyTracksPage() {
  const { data: specialties, isLoading } = useQuery({
    queryKey: ["/api/v1/specialties"],
    queryFn: async () => {
      const res = await fetch("/api/v1/specialties");
      if (!res.ok) throw new Error("Failed to fetch specialties");
      return res.json();
    }
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4 animate-pulse">
        <div className="h-12 w-64 bg-slate-200 rounded mb-8"></div>
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-slate-100 rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 mb-4 border-none px-3 py-1">
            Registered Nurse Professional Track
          </Badge>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Specialty Certification Prep
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl">
            Advance your career with specialized training modules designed for practicing 
            Registered Nurses. Master complex clinical scenarios and earn certifications.
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-8">
          {specialties?.map((specialty: any) => {
            const Icon = SPECIALTY_ICONS[specialty.slug] || SPECIALTY_ICONS.default;
            return (
              <motion.div
                key={specialty.id}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="border-none shadow-lg rounded-3xl overflow-hidden bg-white">
                  <CardHeader className="pb-2">
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                      <Icon className="w-8 h-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold">{specialty.name}</CardTitle>
                    <CardDescription className="text-slate-500">
                      {specialty.description || "Comprehensive specialty training module."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          <span>12 Modules</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>24 Hours</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-medium text-slate-500">
                          <span>Progress</span>
                          <span>0%</span>
                        </div>
                        <Progress value={0} className="h-2 bg-slate-100" />
                      </div>

                      <Button asChild className="w-full h-12 rounded-2xl bg-slate-900 hover:bg-slate-800">
                        <Link href={`/exam-prep/specialties/${specialty.slug}`}>
                          Explore Track
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}

          {/* Coming Soon Placeholder */}
          <Card className="border-2 border-dashed border-slate-200 shadow-none rounded-3xl bg-transparent flex flex-col items-center justify-center p-8 text-center opacity-60">
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
              <Award className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-400">More Tracks</h3>
            <p className="text-slate-400 text-sm mt-2">
              Oncology, Dialysis, and Community Health coming soon.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
