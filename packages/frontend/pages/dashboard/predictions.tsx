"use client";

import { useEffect, useMemo, useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { TrackBetModal } from "@/components/dashboard/TrackBetModal";
import { apiClient } from "@/utils/apiClient";
import { Prediction } from "@/types/Prediction";
import { useAuth } from "@/context/AuthContext";
import {
  Lock,
  Search,
  Filter,
  Calendar,
  ChevronDown,
  BookCheck,
} from "lucide-react";

// ── STATUS COLORS (Consistent with Dashboard) ──────────────────────
const STATUS_COLORS: Record<string, string> = {
  Won: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  Lost: "text-red-400 bg-red-400/10 border-red-400/20",
  Void: "text-gray-400 bg-gray-400/10 border-gray-400/20",
  Upcoming: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  Pending: "text-blue-400 bg-blue-400/10 border-blue-400/20",
};

const RESOLVED = ["Won", "Lost", "Void"] as const;
type DateFilter = "today" | "tomorrow" | "week" | "all";

function safeDate(value: any): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

export default function PredictionsPage() {
  const { refreshUser } = useAuth();
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);

  // Tracking Logic
  const [trackingPrediction, setTrackingPrediction] =
    useState<Prediction | null>(null);
  const [trackedIds, setTrackedIds] = useState<Set<string>>(new Set());

  // Filters
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilter>("today");
  const [leagueFilter, setLeagueFilter] = useState<string>("all");

  // 1. Load Data
  const loadData = async () => {
    setLoading(true);
    try {
      const [preds, betsData] = await Promise.all([
        apiClient.getPredictions(),
        apiClient.getMyBets(),
      ]);

      setPredictions(preds);

      // Build tracked set
      const ids = new Set<string>(
        betsData.betSlips
          .map((b: any) => b.prediction?._id || b.prediction)
          .filter(Boolean),
      );
      setTrackedIds(ids);

      if (refreshUser) await refreshUser();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const leagues = useMemo(() => {
    const set = new Set<string>();
    for (const p of predictions) {
      const lg = (p.competition || (p as any).league || "").trim();
      if (lg) set.add(lg);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [predictions]);

  const filteredPredictions = useMemo(() => {
    const q = search.trim().toLowerCase();

    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const startOfTomorrow = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
    );
    const startOfDayAfter = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 2,
    );
    const endOfWeek = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 7,
    );

    return predictions.filter((p) => {
      // Search by teams + league
      const home = (p.homeTeam || "").toLowerCase();
      const away = (p.awayTeam || "").toLowerCase();
      const comp = (
        (p.competition || (p as any).league || "") as string
      ).toLowerCase();

      const matchesSearch =
        !q || home.includes(q) || away.includes(q) || comp.includes(q);

      // League filter (uses competition first, falls back to league)
      const lg = (p.competition || (p as any).league || "").trim();
      const matchesLeague = leagueFilter === "all" || lg === leagueFilter;

      // Date filter (uses kickoffTime)
      const kickoff = safeDate((p as any).kickoffTime);
      let matchesDate = true;

      if (dateFilter !== "all") {
        if (!kickoff) return false;

        if (dateFilter === "today") {
          matchesDate = kickoff >= startOfToday && kickoff < startOfTomorrow;
        } else if (dateFilter === "tomorrow") {
          matchesDate = kickoff >= startOfTomorrow && kickoff < startOfDayAfter;
        } else if (dateFilter === "week") {
          matchesDate = kickoff >= startOfToday && kickoff < endOfWeek;
        }
      }

      return matchesSearch && matchesLeague && matchesDate;
    });
  }, [predictions, search, leagueFilter, dateFilter]);

  return (
    <ProtectedRoute allowedRoles={["user", "admin"]}>
      <DashboardLayout role="user">
        {/* ── Modal ── */}
        {trackingPrediction && (
          <TrackBetModal
            isOpen={!!trackingPrediction}
            prediction={trackingPrediction}
            onClose={() => setTrackingPrediction(null)}
            onTracked={loadData}
          />
        )}

        {/* ── Header Area ── */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Match Tips</h1>
          <p className="text-white/50 text-sm">
            Expert analysis and predictions for today&apos;s top matches.
          </p>
        </div>

        {/* ── Filters ── */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search teams or leagues..."
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500/50"
            />
          </div>

          {/* Date Filter */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as DateFilter)}
              className="appearance-none pl-10 pr-10 py-3 bg-[#0a0a0a] border border-white/10 rounded-lg text-sm text-white/70 hover:text-white focus:outline-none focus:border-orange-500/50"
            >
              <option value="today">Today</option>
              <option value="tomorrow">Tomorrow</option>
              <option value="week">Next 7 Days</option>
              <option value="all">All Dates</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50 pointer-events-none" />
          </div>

          {/* League Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <select
              value={leagueFilter}
              onChange={(e) => setLeagueFilter(e.target.value)}
              className="appearance-none pl-10 pr-10 py-3 bg-[#0a0a0a] border border-white/10 rounded-lg text-sm text-white/70 hover:text-white focus:outline-none focus:border-orange-500/50"
            >
              <option value="all">All Leagues</option>
              {leagues.map((lg) => (
                <option key={lg} value={lg}>
                  {lg}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50 pointer-events-none" />
          </div>

          {/* Reset (optional but useful) */}
          <button
            onClick={() => {
              setSearch("");
              setDateFilter("today");
              setLeagueFilter("all");
            }}
            className="px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-lg text-sm text-white/70 hover:text-white transition-colors"
          >
            Reset
          </button>
        </div>

        {/* ── Content Grid ── */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-[280px] rounded-xl bg-[#0a0a0a] border border-white/5 animate-pulse"
              />
            ))}
          </div>
        ) : filteredPredictions.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-xl">
            <p className="text-white/40">
              No match tips found for these filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
            {filteredPredictions.map((pred) => (
              <MatchTipCard
                key={pred._id}
                prediction={pred}
                trackedIds={trackedIds}
                onTrack={() => setTrackingPrediction(pred)}
              />
            ))}
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}

// ── Shared Card Component (Similar to Dashboard but tailored for grid) ──
function MatchTipCard({
  prediction,
  trackedIds,
  onTrack,
}: {
  prediction: Prediction;
  trackedIds: Set<string>;
  onTrack: () => void;
}) {
  const isPremium = prediction.type === "Premium";
  const isResolved = RESOLVED.includes(prediction.status as any);
  const isTracked = trackedIds.has(prediction._id);

  // Helper for status badge color
  const getStatusColor = (status: string) => {
    return STATUS_COLORS[status] || STATUS_COLORS.Upcoming;
  };

  return (
    <div
      className={`relative p-5 rounded-xl border flex flex-col justify-between h-full ${
        isPremium
          ? "border-orange-500/20 bg-orange-900/5"
          : "border-white/10 bg-[#0a0a0a]"
      }`}
    >
      <div>
        {/* Badge */}
        <div className="flex justify-between items-start mb-6">
          <div
            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
              isPremium
                ? "bg-orange-600 text-white"
                : "bg-[#252525] text-orange-500"
            }`}
          >
            {isPremium
              ? "Locked"
              : prediction.competition || (prediction as any).league || "Match"}
          </div>

          {/* Kickoff Time */}
          <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
            {prediction.kickoffTime
              ? new Date(prediction.kickoffTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "--:--"}
          </div>
        </div>

        {/* Teams */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-white/5 p-1.5 border border-white/5">
              <img
                src={prediction.logoHome || "/logos/default.png"}
                className="w-full h-full object-contain"
                alt="Home"
              />
            </div>
            <span className="text-xs font-bold text-white text-center max-w-[80px] leading-tight">
              {prediction.homeTeam}
            </span>
          </div>

          <span className="text-xs text-white/20 font-bold uppercase tracking-widest">
            vs
          </span>

          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-white/5 p-1.5 border border-white/5">
              <img
                src={prediction.logoAway || "/logos/default.png"}
                className="w-full h-full object-contain"
                alt="Away"
              />
            </div>
            <span className="text-xs font-bold text-white text-center max-w-[80px] leading-tight">
              {prediction.awayTeam}
            </span>
          </div>
        </div>
      </div>

      {/* Footer / Action Area */}
      <div className="mt-auto">
        {isPremium ? (
          <div className="text-center py-2 bg-white/5 rounded-lg border border-white/5">
            <Lock className="w-4 h-4 text-orange-500 mx-auto mb-1" />
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">
              Premium Content
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-white/5 rounded p-2">
                <p className="text-[10px] text-white/40 uppercase font-bold">
                  Tip
                </p>
                <p className="text-xs font-bold text-white truncate">
                  {(prediction as any).prediction}
                </p>
              </div>
              <div className="bg-white/5 rounded p-2">
                <p className="text-[10px] text-white/40 uppercase font-bold">
                  Odds
                </p>
                <p className="text-xs font-bold text-orange-400">
                  {(prediction as any).odds}
                </p>
              </div>
            </div>

            {/* Status & Track Button */}
            <div className="flex items-center gap-2">
              <span
                className={`flex-shrink-0 px-2 py-1.5 rounded border text-[10px] font-bold uppercase tracking-wider ${getStatusColor(
                  prediction.status || "Upcoming",
                )}`}
              >
                {prediction.status || "Upcoming"}
              </span>

              {/* Track Button Logic */}
              {!isResolved &&
                (isTracked ? (
                  <div className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded bg-white/5 border border-white/10">
                    <BookCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-500 text-[10px] font-bold uppercase tracking-wider">
                      Tracked
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={onTrack}
                    className="flex-1 px-3 py-1.5 bg-orange-500/10 border border-orange-500/30 text-orange-400 hover:bg-orange-500/20 rounded text-[10px] font-bold uppercase tracking-wider transition-colors"
                  >
                    Track Bet
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
