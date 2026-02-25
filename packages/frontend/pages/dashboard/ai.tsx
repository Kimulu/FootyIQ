"use client";

import { useEffect, useState, useMemo } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { apiClient } from "@/utils/apiClient";
import {
  Bot,
  Sparkles,
  Percent,
  ChevronDown,
  ChevronRight,
  Calendar,
  Cpu,
  Layers,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Helper to strip time and compare dates
const normalizeDate = (d: Date) => {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  return date;
};

export default function AiPredictionsPage() {
  const [allPredictions, setAllPredictions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 'all' or a specific date string (ISO format YYYY-MM-DD)
  const [selectedDate, setSelectedDate] = useState<string>("");

  const [expandedLeagues, setExpandedLeagues] = useState<Set<string>>(
    new Set(),
  );

  // 1. Fetch Data
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await apiClient.getAiPredictions();
        setAllPredictions(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // 2. Extract Unique Dates from Data (The "Calendar" Logic)
  const availableDates = useMemo(() => {
    if (allPredictions.length === 0) return [];

    const dateSet = new Set<string>();
    allPredictions.forEach((p) => {
      const dateStr = normalizeDate(p.kickoffTime).toISOString();
      dateSet.add(dateStr);
    });

    // Sort dates chronologically
    return Array.from(dateSet).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime(),
    );
  }, [allPredictions]);

  // 3. Auto-select the first available date on load
  useEffect(() => {
    if (availableDates.length > 0 && !selectedDate) {
      setSelectedDate(availableDates[0]); // Select the closest day with games
    }
  }, [availableDates, selectedDate]);

  // 4. Filter & Group Data based on Selection
  const groupedData = useMemo(() => {
    // Step A: Filter by Date
    const filtered = allPredictions.filter((p) => {
      if (selectedDate === "all") return true;
      return normalizeDate(p.kickoffTime).toISOString() === selectedDate;
    });

    // Step B: Group by Competition
    const groups: Record<string, { crest: string; matches: any[] }> = {};

    filtered.forEach((p) => {
      if (!groups[p.competition]) {
        groups[p.competition] = { crest: p.competitionCrest, matches: [] };
      }
      groups[p.competition].matches.push(p);
    });

    return groups;
  }, [allPredictions, selectedDate]);

  // Auto-expand leagues when filter changes
  useEffect(() => {
    const allLeagues = Object.keys(groupedData);
    setExpandedLeagues(new Set(allLeagues));
  }, [groupedData]);

  const toggleLeague = (leagueName: string) => {
    const newSet = new Set(expandedLeagues);
    if (newSet.has(leagueName)) newSet.delete(leagueName);
    else newSet.add(leagueName);
    setExpandedLeagues(newSet);
  };

  // Helper to generate tab label (Today, Tomorrow, or Date)
  const getTabLabel = (isoDate: string) => {
    const target = new Date(isoDate);
    const today = normalizeDate(new Date());
    const tomorrow = normalizeDate(new Date());
    tomorrow.setDate(today.getDate() + 1);

    if (target.getTime() === today.getTime()) return "Today";
    if (target.getTime() === tomorrow.getTime()) return "Tomorrow";

    // Format: "Fri, Feb 27"
    return target.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <ProtectedRoute allowedRoles={["user", "admin"]}>
      <DashboardLayout role="user">
        {/* ── Header ── */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
              <Bot className="w-6 h-6 text-purple-500" />
            </div>
            <h1 className="text-2xl font-bold text-white">AI Predictions</h1>
          </div>
          <p className="text-white/50 text-sm ml-1">
            Algorithmic insights powered by machine learning.
          </p>
        </div>

        {/* ── Dynamic Date Tabs ── */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {availableDates.map((dateStr) => (
            <DateTab
              key={dateStr}
              label={getTabLabel(dateStr)}
              active={selectedDate === dateStr}
              onClick={() => setSelectedDate(dateStr)}
            />
          ))}

          {/* "All" Tab at the end */}
          <DateTab
            label="All Upcoming"
            active={selectedDate === "all"}
            onClick={() => setSelectedDate("all")}
          />
        </div>

        {/* ── Content ── */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 bg-[#0a0a0a] border border-white/5 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : Object.keys(groupedData).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-xl bg-white/[0.02]">
            <Cpu className="w-10 h-10 text-white/20 mb-4" />
            <p className="text-white/40">
              No AI predictions found for this date.
            </p>
          </div>
        ) : (
          <div className="space-y-6 pb-20">
            {Object.entries(groupedData).map(([leagueName, data]) => (
              <div
                key={leagueName}
                className="rounded-xl overflow-hidden bg-[#0a0a0a] border border-white/10"
              >
                {/* Accordion Header */}
                <button
                  onClick={() => toggleLeague(leagueName)}
                  className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {data.crest ? (
                      <img
                        src={data.crest}
                        alt={leagueName}
                        className="w-6 h-6 object-contain"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                        <Trophy className="w-3 h-3 text-white/20" />
                      </div>
                    )}
                    <span className="font-bold text-white text-sm">
                      {leagueName}
                    </span>
                    <span className="text-xs text-white/40 font-mono bg-black/20 px-2 py-0.5 rounded">
                      {data.matches.length}
                    </span>
                  </div>
                  {expandedLeagues.has(leagueName) ? (
                    <ChevronDown className="w-5 h-5 text-white/40" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-white/40" />
                  )}
                </button>

                {/* Accordion Content */}
                <AnimatePresence>
                  {expandedLeagues.has(leagueName) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 border-t border-white/5">
                        {data.matches.map((match: any) => (
                          <AiCard key={match._id} prediction={match} />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}

// ── Components ──

function DateTab({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 px-6 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider transition-all border ${
        active
          ? "bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-900/20"
          : "bg-[#0a0a0a] text-white/40 border-white/10 hover:text-white hover:border-white/30"
      }`}
    >
      {label}
    </button>
  );
}

function AiCard({ prediction }: { prediction: any }) {
  const getConfColor = (conf: number) => {
    if (conf >= 80)
      return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
    if (conf >= 60)
      return "text-orange-400 bg-orange-400/10 border-orange-400/20";
    return "text-white/40 bg-white/5 border-white/10";
  };

  return (
    <div className="relative p-4 rounded-xl border border-purple-500/10 bg-[#0f0f0f] hover:border-purple-500/30 transition-all group">
      {/* Date & Confidence */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-[10px] text-white/40 flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {new Date(prediction.kickoffTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
        <div
          className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${getConfColor(prediction.confidence)}`}
        >
          <Percent className="w-3 h-3" />
          {prediction.confidence}%
        </div>
      </div>

      {/* Teams */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col items-start gap-1 w-[45%]">
          <img
            src={prediction.logoHome}
            className="w-8 h-8 object-contain mb-1"
          />
          <span className="text-xs font-bold text-white leading-tight">
            {prediction.homeTeam}
          </span>
        </div>
        <span className="text-xs text-white/20 font-bold">VS</span>
        <div className="flex flex-col items-end gap-1 w-[45%]">
          <img
            src={prediction.logoAway}
            className="w-8 h-8 object-contain mb-1"
          />
          <span className="text-xs font-bold text-white text-right leading-tight">
            {prediction.awayTeam}
          </span>
        </div>
      </div>

      {/* Prediction Box */}
      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        <div>
          <p className="text-[10px] text-white/40 uppercase font-bold">Pick</p>
          <p className="text-sm font-bold text-white capitalize">
            {prediction.prediction.replace(/_/g, " ")}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-white/40 uppercase font-bold">Odds</p>
          <p className="text-sm font-bold text-purple-400">{prediction.odds}</p>
        </div>
      </div>
    </div>
  );
}

// Icon helper
function Trophy({ className }: { className?: string }) {
  return <Layers className={className} />;
}
