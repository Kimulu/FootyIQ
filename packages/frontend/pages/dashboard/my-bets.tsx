"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { apiClient } from "@/utils/apiClient";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Target,
  CheckCircle2,
  Clock,
  Trophy,
  Filter,
  ChevronDown,
  Wallet,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────
type ResultFilter = "All" | "Won" | "Lost" | "Pending" | "Void";

interface BetSlip {
  _id: string;
  result: "Won" | "Lost" | "Pending" | "Void";
  stakeAmount: number;
  oddsAtBet: string;
  potentialReturn: number;
  actualReturn: number;
  profitLoss: number;
  pointsEarned: number;
  tipType: string;
  createdAt: string;
  matchSnapshot: {
    homeTeam: string;
    awayTeam: string;
    tip: string;
    competition: string;
    kickoffTime: string;
  };
}

interface BetStats {
  total: number;
  won: number;
  lost: number;
  pending: number;
  totalStaked: number;
  totalReturned: number;
  profitLoss: number;
  winRate: string;
  roi: string;
}

// ── Result styles ──────────────────────────────────────────────────
const RESULT_STYLES = {
  Won: {
    badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    row: "border-l-2 border-l-emerald-500/40",
    amount: "text-emerald-400",
  },
  Lost: {
    badge: "bg-red-500/10 text-red-400 border-red-500/20",
    row: "border-l-2 border-l-red-500/40",
    amount: "text-red-400",
  },
  Pending: {
    badge: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    row: "border-l-2 border-l-blue-500/20",
    amount: "text-white/60",
  },
  Void: {
    badge: "bg-white/5 text-white/30 border-white/10",
    row: "border-l-2 border-l-white/10",
    amount: "text-white/30",
  },
};

const FILTERS: ResultFilter[] = ["All", "Won", "Lost", "Pending", "Void"];

export default function MyBetsPage() {
  const [betSlips, setBetSlips] = useState<BetSlip[]>([]);
  const [stats, setStats] = useState<BetStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ResultFilter>("All");
  const [sortDesc, setSortDesc] = useState(true); // newest first

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await apiClient.getMyBets();
        setBetSlips(data.betSlips);
        setStats(data.stats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ── Filtered + sorted list ─────────────────────────────────────
  const displayed = betSlips
    .filter((b) => filter === "All" || b.result === filter)
    .sort((a, b) => {
      const diff =
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return sortDesc ? diff : -diff;
    });

  const isProfitable = (stats?.profitLoss ?? 0) >= 0;

  return (
    <ProtectedRoute allowedRoles={["user", "admin"]}>
      <DashboardLayout role="user">
        {/* ── Header ── */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">My Bets</h1>
          <p className="text-white/40 text-sm">
            Your full betting history and performance breakdown
          </p>
        </div>

        {/* ── Stats Summary Row ── */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {/* Win Rate */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0 }}
              className="bg-[#0a0a0a] border border-white/5 rounded-xl p-5 hover:border-orange-500/20 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-orange-500" />
                <span className="text-[10px] uppercase tracking-widest text-white/40">
                  Win Rate
                </span>
              </div>
              <div className="text-2xl font-black text-white">
                {stats.winRate}%
              </div>
              <div className="text-xs text-white/30 mt-1">
                {stats.won}W · {stats.lost}L · {stats.pending}P
              </div>
            </motion.div>

            {/* ROI */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-[#0a0a0a] border border-white/5 rounded-xl p-5 hover:border-orange-500/20 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-orange-500" />
                <span className="text-[10px] uppercase tracking-widest text-white/40">
                  ROI
                </span>
              </div>
              <div
                className={`text-2xl font-black ${parseFloat(stats.roi) >= 0 ? "text-emerald-400" : "text-red-400"}`}
              >
                {parseFloat(stats.roi) >= 0 ? "+" : ""}
                {stats.roi}%
              </div>
              <div className="text-xs text-white/30 mt-1">Bankroll growth</div>
            </motion.div>

            {/* Profit / Loss */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#0a0a0a] border border-white/5 rounded-xl p-5 hover:border-orange-500/20 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                {isProfitable ? (
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span className="text-[10px] uppercase tracking-widest text-white/40">
                  Profit / Loss
                </span>
              </div>
              <div
                className={`text-2xl font-black ${isProfitable ? "text-emerald-400" : "text-red-400"}`}
              >
                {isProfitable ? "+" : ""}KSh {stats.profitLoss.toLocaleString()}
              </div>
              <div className="text-xs text-white/30 mt-1">
                Staked: KSh {stats.totalStaked.toLocaleString()}
              </div>
            </motion.div>

            {/* Total Bets */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-[#0a0a0a] border border-white/5 rounded-xl p-5 hover:border-orange-500/20 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-orange-500" />
                <span className="text-[10px] uppercase tracking-widest text-white/40">
                  Bets Tracked
                </span>
              </div>
              <div className="text-2xl font-black text-white">
                {stats.total}
              </div>
              <div className="text-xs text-white/30 mt-1">
                {stats.pending} still pending
              </div>
            </motion.div>
          </div>
        )}

        {/* ── Filter + Sort bar ── */}
        <div className="flex items-center justify-between gap-4 mb-5 flex-wrap">
          {/* Filter tabs */}
          <div className="flex items-center gap-1 bg-[#0a0a0a] border border-white/5 rounded-lg p-1">
            <Filter className="w-3.5 h-3.5 text-white/30 ml-2 mr-1" />
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${
                  filter === f
                    ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                    : "text-white/40 hover:text-white"
                }`}
              >
                {f}
                {f !== "All" && stats && (
                  <span className="ml-1.5 text-[10px] opacity-60">
                    {f === "Won"
                      ? stats.won
                      : f === "Lost"
                        ? stats.lost
                        : f === "Pending"
                          ? stats.pending
                          : betSlips.filter((b) => b.result === "Void").length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Sort toggle */}
          <button
            onClick={() => setSortDesc((p) => !p)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0a0a0a] border border-white/5 text-white/40 hover:text-white text-xs font-bold transition-all"
          >
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform ${sortDesc ? "" : "rotate-180"}`}
            />
            {sortDesc ? "Newest First" : "Oldest First"}
          </button>
        </div>

        {/* ── Bet List ── */}
        <div className="space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-20 gap-3 text-white/30">
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Loading your bets...
            </div>
          ) : displayed.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Wallet className="w-10 h-10 text-white/10 mb-4" />
              <p className="text-white/40 font-bold">
                {filter === "All"
                  ? "No bets tracked yet"
                  : `No ${filter.toLowerCase()} bets`}
              </p>
              <p className="text-white/20 text-sm mt-1">
                {filter === "All"
                  ? "Head to the dashboard and track your first bet"
                  : "Try a different filter"}
              </p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {displayed.map((bet, i) => {
                const styles = RESULT_STYLES[bet.result];
                const isWon = bet.result === "Won";
                const isLost = bet.result === "Lost";
                const isPending = bet.result === "Pending";

                return (
                  <motion.div
                    key={bet._id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ delay: i * 0.03 }}
                    className={`bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden ${styles.row}`}
                  >
                    <div className="p-4 md:p-5">
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        {/* Left: match info */}
                        <div className="flex-1 min-w-0">
                          {/* Competition + date */}
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <div className="flex items-center gap-1.5">
                              <Trophy className="w-3 h-3 text-white/20" />
                              <span className="text-white/40 text-[10px] uppercase tracking-wider">
                                {bet.matchSnapshot.competition}
                              </span>
                            </div>
                            <span className="text-white/20 text-[10px]">·</span>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-white/20" />
                              <span className="text-white/30 text-[10px]">
                                {new Date(bet.createdAt).toLocaleDateString(
                                  [],
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )}
                              </span>
                            </div>
                          </div>

                          {/* Teams */}
                          <p className="text-white font-black text-sm mb-1">
                            {bet.matchSnapshot.homeTeam}{" "}
                            <span className="text-white/30 font-normal">
                              vs
                            </span>{" "}
                            {bet.matchSnapshot.awayTeam}
                          </p>

                          {/* Tip + Odds */}
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-orange-400 text-xs font-bold">
                              {bet.matchSnapshot.tip}
                            </span>
                            <span className="text-white/20 text-xs">·</span>
                            <span className="text-white/50 text-xs">
                              Odds:{" "}
                              <span className="text-white font-bold">
                                {bet.oddsAtBet}
                              </span>
                            </span>
                            <span className="text-white/20 text-xs">·</span>
                            <span
                              className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border ${
                                bet.tipType === "Premium"
                                  ? "bg-orange-500/10 text-orange-400 border-orange-500/20"
                                  : "bg-white/5 text-white/30 border-white/10"
                              }`}
                            >
                              {bet.tipType}
                            </span>
                          </div>
                        </div>

                        {/* Right: amounts + result badge */}
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          {/* Result badge */}
                          <span
                            className={`px-3 py-1 rounded-lg border text-[10px] font-black uppercase tracking-widest ${styles.badge}`}
                          >
                            {bet.result}
                          </span>

                          {/* Stake */}
                          <div className="text-right">
                            <div className="text-white/40 text-[10px] uppercase tracking-wider">
                              Stake
                            </div>
                            <div className="text-white font-bold text-sm">
                              KSh {bet.stakeAmount.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bottom row: financial outcome */}
                      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-4">
                          {/* Potential / Actual return */}
                          <div>
                            <div className="text-white/30 text-[10px] uppercase tracking-wider">
                              {isPending ? "Potential Return" : "Return"}
                            </div>
                            <div className="text-white/80 text-sm font-bold">
                              KSh{" "}
                              {isPending
                                ? bet.potentialReturn.toLocaleString()
                                : bet.actualReturn.toLocaleString()}
                            </div>
                          </div>

                          {/* Profit / Loss — only for settled */}
                          {!isPending && bet.result !== "Void" && (
                            <div>
                              <div className="text-white/30 text-[10px] uppercase tracking-wider">
                                {isWon ? "Profit" : "Loss"}
                              </div>
                              <div
                                className={`text-sm font-black ${styles.amount}`}
                              >
                                {isWon ? "+" : ""}KSh{" "}
                                {Math.abs(bet.profitLoss).toLocaleString()}
                              </div>
                            </div>
                          )}

                          {/* Void refund note */}
                          {bet.result === "Void" && (
                            <div className="text-white/30 text-xs">
                              Stake refunded
                            </div>
                          )}
                        </div>

                        {/* Points earned */}
                        {bet.pointsEarned > 0 && (
                          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20">
                            <span className="text-orange-400 text-xs font-black">
                              +{bet.pointsEarned} pts
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>

        {/* ── Footer count ── */}
        {!loading && displayed.length > 0 && (
          <p className="text-center text-white/20 text-xs mt-8">
            Showing {displayed.length} of {betSlips.length} bets
          </p>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
