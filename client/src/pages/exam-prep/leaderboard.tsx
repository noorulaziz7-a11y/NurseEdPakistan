// Leaderboard Page - iOS-inspired design
import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trophy, Medal, Award, TrendingUp, Users, Calendar, Target } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface LeaderboardEntry {
  rank: number;
  username: string;
  score: number;
  examType: string;
  completedAt: string;
  avatar?: string;
}

const EXAM_TYPES = ["All", "NCLEX", "MOH", "DHA", "HAAD", "SNLE", "IELTS"];
const TIME_PERIODS = ["All Time", "This Week", "This Month"];

export default function LeaderboardPage() {
  const [selectedExam, setSelectedExam] = useState("All");
  const [selectedPeriod, setSelectedPeriod] = useState("All Time");

  const { data: leaderboard = [], isLoading } = useQuery<LeaderboardEntry[]>({
    queryKey: ["/api/leaderboard", selectedExam, selectedPeriod],
    queryFn: async () => {
      const params = new URLSearchParams({
        examType: selectedExam === "All" ? "" : selectedExam,
        period: selectedPeriod,
      });
      const res = await fetch(`/api/leaderboard?${params.toString()}`);
      if (!res.ok) return [];
      return res.json();
    },
  });

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <Award className="w-5 h-5 text-gray-400" />;
    }
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return "bg-gradient-to-br from-yellow-400 to-yellow-600";
    if (rank === 2) return "bg-gradient-to-br from-gray-300 to-gray-500";
    if (rank === 3) return "bg-gradient-to-br from-amber-500 to-amber-700";
    return "bg-white dark:bg-gray-800";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-10 h-10 text-yellow-500" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Leaderboard
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            See how you rank among top performers
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-4 mb-8 justify-center"
        >
          <Select value={selectedExam} onValueChange={setSelectedExam}>
            <SelectTrigger className="w-[180px] rounded-2xl">
              <SelectValue placeholder="Select exam" />
            </SelectTrigger>
            <SelectContent>
              {EXAM_TYPES.map((exam) => (
                <SelectItem key={exam} value={exam}>
                  {exam}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[180px] rounded-2xl">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              {TIME_PERIODS.map((period) => (
                <SelectItem key={period} value={period}>
                  {period}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {/* Top 3 Podium */}
        {leaderboard.length >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-3 gap-4 mb-8 max-w-3xl mx-auto"
          >
            {/* 2nd Place */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center mt-8"
            >
              <div className="relative">
                <Avatar className="w-20 h-20 border-4 border-gray-300">
                  <AvatarFallback className="bg-gray-300 text-gray-700 text-xl">
                    {leaderboard[1]?.username[0] || "2"}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -top-2 -right-2 bg-gray-400 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                  2
                </div>
              </div>
              <p className="mt-2 font-semibold text-gray-700 dark:text-gray-300">
                {leaderboard[1]?.username || "User"}
              </p>
              <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                {leaderboard[1]?.score || 0}%
              </p>
            </motion.div>

            {/* 1st Place */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col items-center"
            >
              <div className="relative">
                <Avatar className="w-24 h-24 border-4 border-yellow-400 shadow-lg">
                  <AvatarFallback className="bg-yellow-400 text-yellow-900 text-2xl">
                    {leaderboard[0]?.username[0] || "1"}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -top-2 -right-2 bg-yellow-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                  1
                </div>
                <Trophy className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-8 text-yellow-500" />
              </div>
              <p className="mt-2 font-bold text-lg text-gray-900 dark:text-white">
                {leaderboard[0]?.username || "Champion"}
              </p>
              <p className="text-3xl font-bold text-yellow-600">
                {leaderboard[0]?.score || 0}%
              </p>
            </motion.div>

            {/* 3rd Place */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col items-center mt-12"
            >
              <div className="relative">
                <Avatar className="w-16 h-16 border-4 border-amber-600">
                  <AvatarFallback className="bg-amber-600 text-white text-lg">
                    {leaderboard[2]?.username[0] || "3"}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -top-2 -right-2 bg-amber-600 text-white rounded-full w-7 h-7 flex items-center justify-center font-bold text-sm">
                  3
                </div>
              </div>
              <p className="mt-2 font-semibold text-gray-700 dark:text-gray-300">
                {leaderboard[2]?.username || "User"}
              </p>
              <p className="text-xl font-bold text-amber-600">
                {leaderboard[2]?.score || 0}%
              </p>
            </motion.div>
          </motion.div>
        )}

        {/* Leaderboard List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="border-0 shadow-xl rounded-3xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Rankings
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">Loading leaderboard...</p>
                </div>
              ) : leaderboard.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">No rankings available yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {leaderboard.map((entry, index) => (
                    <motion.div
                      key={entry.rank}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.05 }}
                      className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${
                        index < 3
                          ? getRankColor(entry.rank)
                          : "bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="flex items-center justify-center w-10">
                          {getRankIcon(entry.rank)}
                        </div>
                        <div className="text-2xl font-bold text-gray-400 dark:text-gray-500 w-12">
                          #{entry.rank}
                        </div>
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-blue-500 text-white">
                            {entry.username[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {entry.username}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Badge variant="outline">{entry.examType}</Badge>
                            <Calendar className="w-3 h-3" />
                            {new Date(entry.completedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-green-500" />
                          <span className="text-2xl font-bold text-gray-900 dark:text-white">
                            {entry.score}%
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

