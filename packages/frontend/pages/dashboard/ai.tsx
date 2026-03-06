"use client";

import { useEffect, useState, useMemo } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { apiClient } from "@/utils/apiClient";
import {
  Bot,
  Percent,
  ChevronDown,
  ChevronRight,
  Calendar,
  Cpu,
  Trophy,
  LayoutGrid,
  List,
  Clock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const normalizeDate = (d: Date) => {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  return date;
};

export default function AiPredictionsPage() {
  const [allPredictions, setAllPredictions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [expandedLeagues, setExpandedLeagues] = useState<Set<string>>(
    new Set(),
  );

  // View Mode State
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

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

  const availableDates = useMemo(() => {
    if (allPredictions.length === 0) return [];
    const dateSet = new Set<string>();
    allPredictions.forEach((p) => {
      const dateStr = normalizeDate(p.kickoffTime).toISOString();
      dateSet.add(dateStr);
    });
    return Array.from(dateSet).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime(),
    );
  }, [allPredictions]);

  useEffect(() => {
    if (availableDates.length > 0 && !selectedDate) {
      setSelectedDate(availableDates[0]);
    }
  }, [availableDates, selectedDate]);

  const groupedData = useMemo(() => {
    const filtered = allPredictions.filter((p) => {
      if (selectedDate === "all") return true;
      return normalizeDate(p.kickoffTime).toISOString() === selectedDate;
    });

    const groups: Record<string, { crest: string; matches: any[] }> = {};

    filtered.forEach((p) => {
      if (!groups[p.competition]) {
        groups[p.competition] = { crest: p.competitionCrest, matches: [] };
      }
      groups[p.competition].matches.push(p);
    });

    return groups;
  }, [allPredictions, selectedDate]);

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

  const getTabLabel = (isoDate: string) => {
    const target = new Date(isoDate);
    const today = normalizeDate(new Date());
    const tomorrow = normalizeDate(new Date());
    tomorrow.setDate(today.getDate() + 1);

    if (target.getTime() === today.getTime()) return "Today";
    if (target.getTime() === tomorrow.getTime()) return "Tomorrow";

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
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
                <Bot className="w-6 h-6 text-purple-500" />
              </div>
              <h1 className="text-2xl font-bold text-white">AI Predictions</h1>
            </div>
            <p className="text-white/50 text-sm ml-1">
              Data-driven insights & probabilities.
            </p>
          </div>

          {/* VIEW TOGGLE BUTTONS */}
          <div className="flex bg-[#0a0a0a] border border-white/10 rounded-lg p-1">
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition-all ${viewMode === "list" ? "bg-white/10 text-white" : "text-white/40 hover:text-white"}`}
              title="List View"
            >
              <List className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-all ${viewMode === "grid" ? "bg-white/10 text-white" : "text-white/40 hover:text-white"}`}
              title="Card View"
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 
           ── Dynamic Date Tabs (FIXED) ── 
           1. max-w-[calc(100vw-3rem)]: Mobile width (screen - padding)
           2. md:max-w-[calc(100vw-20rem)]: Desktop width (screen - sidebar - padding)
           This forces the overflow-x-auto to trigger instead of pushing the page width.
        */}
        <div className="w-full max-w-[calc(100vw-3rem)] md:max-w-[calc(100vw-20rem)] overflow-x-auto pb-2 custom-scrollbar">
          <div className="flex gap-3">
            {availableDates.map((dateStr) => (
              <DateTab
                key={dateStr}
                label={getTabLabel(dateStr)}
                active={selectedDate === dateStr}
                onClick={() => setSelectedDate(dateStr)}
              />
            ))}
            <DateTab
              label="All Upcoming"
              active={selectedDate === "all"}
              onClick={() => setSelectedDate("all")}
            />
          </div>
        </div>

        {/* ── Content ── */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 bg-[#0a0a0a] border border-white/5 rounded-xl animate-pulse"
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
                    <span className="font-bold text-white text-base">
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

                {/* Content Area */}
                <AnimatePresence>
                  {expandedLeagues.has(leagueName) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      {viewMode === "grid" ? (
                        // ── GRID VIEW ──
                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 border-t border-white/5">
                          {data.matches.map((match: any) => (
                            <AiCard key={match._id} prediction={match} />
                          ))}
                        </div>
                      ) : (
                        // ── LIST VIEW ──
                        <div className="border-t border-white/5 divide-y divide-white/5">
                          {data.matches.map((match: any) => (
                            <AiListItem key={match._id} prediction={match} />
                          ))}
                        </div>
                      )}
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
      className={`flex-shrink-0 px-6 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider transition-all border whitespace-nowrap ${
        active
          ? "bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-900/20"
          : "bg-[#0a0a0a] text-white/40 border-white/10 hover:text-white hover:border-white/30"
      }`}
    >
      {label}
    </button>
  );
}

// ── LIST ITEM COMPONENT ──
function AiListItem({ prediction }: { prediction: any }) {
  const getConfColor = (conf: number) => {
    if (conf >= 80)
      return "text-emerald-400 border-emerald-400/30 bg-emerald-400/10";
    if (conf >= 60)
      return "text-orange-400 border-orange-400/30 bg-orange-400/10";
    return "text-white/40 border-white/10 bg-white/5";
  };

  return (
    <div className="p-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-white/[0.02] transition-colors">
      {/* Time & Teams Section */}
      <div className="flex items-center gap-4 flex-1">
        {/* Time Column */}
        <div className="flex flex-col items-center justify-center min-w-[50px] border-r border-white/5 pr-4">
          <span className="text-xs font-bold text-white/60">
            {new Date(prediction.kickoffTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          <span className="text-[10px] text-white/30 uppercase tracking-wider mt-1">
            Time
          </span>
        </div>

        {/* Teams (Vertical Stack) */}
        <div className="flex flex-col gap-2 flex-1">
          <div className="flex items-center gap-3">
            <img
              src={prediction.logoHome}
              className="w-5 h-5 object-contain"
              alt="Home"
            />
            <span className="text-sm font-bold text-white">
              {prediction.homeTeam}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <img
              src={prediction.logoAway}
              className="w-5 h-5 object-contain"
              alt="Away"
            />
            <span className="text-sm font-bold text-white">
              {prediction.awayTeam}
            </span>
          </div>
        </div>
      </div>

      {/* Prediction & Confidence */}
      <div className="flex items-center justify-between sm:justify-end gap-3 pl-4 sm:pl-0 sm:border-l-0 border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0">
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-bold ${getConfColor(prediction.confidence)}`}
        >
          <Percent className="w-3 h-3" /> {prediction.confidence}%
        </div>

        <div className="flex flex-col items-end min-w-[100px]">
          <span className="text-[10px] text-white/30 font-bold uppercase tracking-wider mb-0.5">
            Prediction
          </span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-white capitalize">
              {prediction.prediction.replace(/_/g, " ")}
            </span>
            <span className="text-sm font-bold text-purple-400">
              @{prediction.odds}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── GRID CARD COMPONENT ──
function AiCard({ prediction }: { prediction: any }) {
  const getConfColor = (conf: number) => {
    if (conf >= 80)
      return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
    if (conf >= 60)
      return "text-orange-400 bg-orange-400/10 border-orange-400/20";
    return "text-white/40 bg-white/5 border-white/10";
  };

  return (
    <div className="relative p-5 rounded-xl border border-purple-500/10 bg-[#0f0f0f] hover:border-purple-500/30 transition-all group">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-2 text-white/40">
          <Clock className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">
            {new Date(prediction.kickoffTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-black border shadow-sm ${getConfColor(prediction.confidence)}`}
        >
          <Percent className="w-3.5 h-3.5" />
          {prediction.confidence}%
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col items-center gap-3 w-[40%]">
          <div className="w-14 h-14 p-2 rounded-full bg-white/5 border border-white/5 flex items-center justify-center">
            <img
              src={prediction.logoHome}
              className="w-full h-full object-contain"
              alt="Home"
            />
          </div>
          <span className="text-sm font-bold text-white text-center leading-tight">
            {prediction.homeTeam}
          </span>
        </div>
        <div className="flex flex-col items-center justify-center w-[20%]">
          <span className="text-xs font-bold text-white/20 mb-1">VS</span>
        </div>
        <div className="flex flex-col items-center gap-3 w-[40%]">
          <div className="w-14 h-14 p-2 rounded-full bg-white/5 border border-white/5 flex items-center justify-center">
            <img
              src={prediction.logoAway}
              className="w-full h-full object-contain"
              alt="Away"
            />
          </div>
          <span className="text-sm font-bold text-white text-center leading-tight">
            {prediction.awayTeam}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <div>
          <p className="text-[10px] text-white/40 uppercase font-bold mb-1">
            AI Pick
          </p>
          <p className="text-base font-black text-white capitalize">
            {prediction.prediction.replace(/_/g, " ")}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-white/40 uppercase font-bold mb-1">
            Est. Odds
          </p>
          <p className="text-base font-black text-purple-400">
            {prediction.odds}
          </p>
        </div>
      </div>
    </div>
  );
}
