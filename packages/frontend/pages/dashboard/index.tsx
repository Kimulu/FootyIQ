"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { BankrollModal } from "@/components/dashboard/BankrollModal";
import { TrackBetModal } from "@/components/dashboard/TrackBetModal";
import { apiClient } from "@/utils/apiClient";
import { useAuth } from "@/context/AuthContext";
import { Prediction } from "@/types/Prediction";
import { BetStats } from "@/types/BetStats";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Lock,
  Wallet,
  TrendingUp,
  TrendingDown,
  Target,
  CheckCircle2,
  Star,
  Clock,
  Trophy,
  BookCheck,
} from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  Won: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  Lost: "text-red-400 bg-red-400/10 border-red-400/20",
  Void: "text-gray-400 bg-gray-400/10 border-gray-400/20",
  Upcoming: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  Pending: "text-blue-400 bg-blue-400/10 border-blue-400/20",
};

const RESOLVED = ["Won", "Lost", "Void"];

export default function UserDashboard() {
  const { user, refreshUser } = useAuth();

  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [tipOfDay, setTipOfDay] = useState<Prediction | null>(null);
  const [showBankrollModal, setShowBankrollModal] = useState(false);
  const [bankrollAmount, setBankrollAmount] = useState<number>(0);
  const [betStats, setBetStats] = useState<BetStats | null>(null);
  const [trackingPrediction, setTrackingPrediction] =
    useState<Prediction | null>(null);

  // Set of predictionIds the user has already tracked
  const [trackedIds, setTrackedIds] = useState<Set<string>>(new Set());

  // Load predictions + tip of day
  useEffect(() => {
    const load = async () => {
      try {
        const [preds, tod] = await Promise.all([
          apiClient.getPredictions(),
          apiClient.getTipOfDay(),
        ]);
        setTipOfDay(tod);
        const filtered = tod
          ? preds.filter((p) => p._id !== tod._id).slice(0, 3)
          : preds.slice(0, 3);
        setPredictions(filtered);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  // Load bet stats + build trackedIds set
  const loadBetStats = async () => {
    try {
      const data = await apiClient.getMyBets();
      setBetStats(data.stats);

      // Build a set of prediction IDs the user has already tracked
      const ids = new Set<string>(
        data.betSlips
          .map((b: any) => b.prediction?._id || b.prediction)
          .filter(Boolean),
      );
      setTrackedIds(ids);

      if (refreshUser) await refreshUser();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadBetStats();
  }, []);

  // Sync bankroll
  useEffect(() => {
    if (user?.bankroll?.amount !== undefined) {
      setBankrollAmount(user.bankroll.amount);
    } else if (user && !user.bankroll?.isSet) {
      const timer = setTimeout(() => setShowBankrollModal(true), 800);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleBankrollComplete = async (amount: number) => {
    setBankrollAmount(amount);
    setShowBankrollModal(false);
    if (refreshUser) await refreshUser();
  };

  const isProfitable = (betStats?.profitLoss ?? 0) >= 0;

  return (
    <ProtectedRoute allowedRoles={["user", "admin"]}>
      <DashboardLayout role="user">
        {/* ── Modals ── */}
        <BankrollModal
          isOpen={showBankrollModal}
          onComplete={handleBankrollComplete}
          onSkip={() => setShowBankrollModal(false)}
        />
        {trackingPrediction && (
          <TrackBetModal
            isOpen={!!trackingPrediction}
            prediction={trackingPrediction}
            onClose={() => setTrackingPrediction(null)}
            onTracked={loadBetStats}
          />
        )}

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <h1 className="text-2xl font-bold text-white">
            Welcome back,{" "}
            <span className="text-orange-500">{user?.username}</span>!
          </h1>
          <button
            onClick={() => setShowBankrollModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-orange-500/30 transition-all group"
          >
            <Wallet className="w-4 h-4 text-orange-500" />
            <span className="text-xs text-white/60 group-hover:text-white transition-colors">
              {bankrollAmount > 0
                ? `KSh ${bankrollAmount.toLocaleString()}`
                : "Set Bankroll"}
            </span>
          </button>
        </div>

        {/* ══════════════════════════════════════════
            1. TIP OF THE DAY
        ══════════════════════════════════════════ */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-orange-500">
              Tip of the Day
            </h2>
          </div>

          {tipOfDay ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="relative rounded-2xl overflow-hidden border border-orange-500/30 bg-gradient-to-br from-orange-900/10 via-[#0a0a0a] to-[#0a0a0a]"
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/60 to-transparent" />
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/5 blur-[80px] rounded-full pointer-events-none" />

              <div className="relative z-10 p-6 md:p-8">
                {/* Competition + kickoff */}
                <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-orange-400" />
                    <span className="text-orange-400 text-xs font-bold uppercase tracking-widest">
                      {tipOfDay.competition}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-white/30 text-xs">
                    <Clock className="w-3 h-3" />
                    {new Date(tipOfDay.kickoffTime).toLocaleString([], {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>

                {/* Teams */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center p-2">
                      <img
                        src={tipOfDay.logoHome || "/logos/default.png"}
                        className="w-full h-full object-contain"
                        alt={tipOfDay.homeTeam}
                      />
                    </div>
                    <span className="text-white font-black text-sm text-center">
                      {tipOfDay.homeTeam}
                    </span>
                  </div>

                  <div className="text-center px-4">
                    <div className="text-white/20 text-xs font-bold uppercase tracking-widest mb-3">
                      vs
                    </div>
                    <div className="px-4 py-2 rounded-xl bg-orange-500/15 border border-orange-500/30">
                      <div className="text-[10px] text-orange-400/60 uppercase tracking-widest mb-1">
                        Our Tip
                      </div>
                      <div className="text-orange-300 font-black text-sm">
                        {tipOfDay.prediction}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center p-2">
                      <img
                        src={tipOfDay.logoAway || "/logos/default.png"}
                        className="w-full h-full object-contain"
                        alt={tipOfDay.awayTeam}
                      />
                    </div>
                    <span className="text-white font-black text-sm text-center">
                      {tipOfDay.awayTeam}
                    </span>
                  </div>
                </div>

                {/* Bottom row */}
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/5">
                    <span className="text-white/40 text-xs">Odds</span>
                    <span className="text-white font-black text-sm">
                      {tipOfDay.odds || "—"}
                    </span>
                  </div>

                  <span
                    className={`px-3 py-2 rounded-lg border text-[10px] font-bold uppercase tracking-wider ${STATUS_COLORS[tipOfDay.status] || STATUS_COLORS.Pending}`}
                  >
                    {tipOfDay.status}
                  </span>

                  {/* Dynamic track button for tip of day */}
                  <TrackButton
                    prediction={tipOfDay}
                    trackedIds={trackedIds}
                    onTrack={() => setTrackingPrediction(tipOfDay)}
                    className="ml-auto"
                  />
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="p-6 rounded-2xl border border-dashed border-white/10 flex items-center gap-4">
              <Star className="w-5 h-5 text-white/20 flex-shrink-0" />
              <div>
                <p className="text-white/40 text-sm font-bold">
                  No Tip of the Day set yet
                </p>
                <p className="text-white/20 text-xs">
                  Check back soon — our analysts are working on it.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ══════════════════════════════════════════
            2. BETTING STATS
        ══════════════════════════════════════════ */}
        {betStats && betStats.total > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-bold text-white mb-4 relative inline-block">
              Your Betting Stats
              <div className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-orange-500" />
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-5 hover:border-orange-500/20 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-orange-500" />
                  <span className="text-[10px] uppercase tracking-widest text-white/40">
                    Win Rate
                  </span>
                </div>
                <div className="text-2xl font-black text-white">
                  {betStats.winRate}%
                </div>
                <div className="text-xs text-white/30 mt-1">
                  {betStats.won}W / {betStats.lost}L / {betStats.pending}P
                </div>
              </div>

              <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-5 hover:border-orange-500/20 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-orange-500" />
                  <span className="text-[10px] uppercase tracking-widest text-white/40">
                    ROI
                  </span>
                </div>
                <div
                  className={`text-2xl font-black ${parseFloat(betStats.roi) >= 0 ? "text-emerald-400" : "text-red-400"}`}
                >
                  {parseFloat(betStats.roi) >= 0 ? "+" : ""}
                  {betStats.roi}%
                </div>
                <div className="text-xs text-white/30 mt-1">
                  Return on investment
                </div>
              </div>

              <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-5 hover:border-orange-500/20 transition-colors">
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
                  {isProfitable ? "+" : ""}KSh{" "}
                  {betStats.profitLoss.toLocaleString()}
                </div>
                <div className="text-xs text-white/30 mt-1">
                  Staked: KSh {betStats.totalStaked.toLocaleString()}
                </div>
              </div>

              <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-5 hover:border-orange-500/20 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-500" />
                  <span className="text-[10px] uppercase tracking-widest text-white/40">
                    Bets Tracked
                  </span>
                </div>
                <div className="text-2xl font-black text-white">
                  {betStats.total}
                </div>
                <div className="text-xs text-white/30 mt-1">
                  {betStats.pending} still pending
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════
            3. TODAY'S MATCH TIPS
        ══════════════════════════════════════════ */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white relative inline-block">
              Today's Match Tips
              <div className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-orange-500" />
            </h2>
            <Link
              href="/predictions"
              className="text-xs font-bold text-orange-500 uppercase tracking-widest border border-orange-500/30 px-4 py-2 rounded hover:bg-orange-500/10"
            >
              View All Tips
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {predictions.length === 0 ? (
              <p className="text-white/30 text-sm col-span-3">
                No other tips available right now.
              </p>
            ) : (
              predictions.map((pred) => (
                <DashboardTipCard
                  key={pred._id}
                  prediction={pred}
                  trackedIds={trackedIds}
                  onTrack={() => setTrackingPrediction(pred)}
                />
              ))
            )}
          </div>
        </div>

        {/* ══════════════════════════════════════════
            4. LATEST INTELLIGENCE
        ══════════════════════════════════════════ */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">
              Latest Intelligence
            </h2>
            <Link
              href="/news"
              className="text-xs text-white/50 hover:text-white"
            >
              View All News
            </Link>
          </div>

          <div className="bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <span className="px-2 py-1 bg-white/10 rounded text-[10px] font-bold text-white/60 uppercase">
                    Analysis
                  </span>
                  <span className="text-white/80 text-sm font-medium group-hover:text-orange-500 transition-colors">
                    Tactical Analysis: Why Midfield Control Won the Game
                  </span>
                </div>
                <div className="text-white/30 text-xs">Yesterday</div>
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

// ── TrackButton — single source of truth for button state ─────────
function TrackButton({
  prediction,
  trackedIds,
  onTrack,
  className = "",
}: {
  prediction: Prediction;
  trackedIds: Set<string>;
  onTrack: () => void;
  className?: string;
}) {
  const isResolved = RESOLVED.includes(prediction.status);
  const isTracked = trackedIds.has(prediction._id);

  // Match is done — no button at all
  if (isResolved) return null;

  // Already tracking — disabled state
  if (isTracked) {
    return (
      <div
        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/5 border border-white/10 ${className}`}
      >
        <BookCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span className="text-emerald-500 text-xs font-bold uppercase tracking-wider">
          Tracked
        </span>
      </div>
    );
  }

  // Default — track this bet
  return (
    <button
      onClick={onTrack}
      className={`px-4 py-2 bg-orange-500/20 border border-orange-500/40 text-orange-400 hover:bg-orange-500/30 hover:border-orange-500/60 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${className}`}
    >
      Track Bet
    </button>
  );
}

// ── DashboardTipCard ───────────────────────────────────────────────
function DashboardTipCard({
  prediction,
  trackedIds,
  onTrack,
}: {
  prediction: Prediction;
  trackedIds: Set<string>;
  onTrack: () => void;
}) {
  const isPremium = prediction.type === "Premium";

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Won":
        return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
      case "Lost":
        return "text-red-400 bg-red-400/10 border-red-400/20";
      case "Void":
        return "text-gray-400 bg-gray-400/10 border-gray-400/20";
      default:
        return "text-blue-400 bg-blue-400/10 border-blue-400/20";
    }
  };

  return (
    <div
      className={`relative p-5 rounded-xl border ${
        isPremium
          ? "border-orange-500/20 bg-orange-900/5"
          : "border-white/10 bg-[#0a0a0a]"
      }`}
    >
      {/* Badge */}
      <div
        className={`absolute top-4 left-4 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
          isPremium
            ? "bg-orange-600 text-white"
            : "bg-[#252525] text-orange-500"
        }`}
      >
        {isPremium ? "Locked Tip" : prediction.competition || "Match"}
      </div>

      {/* Teams */}
      <div className="mt-8 flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/10 p-1">
            <img
              src={prediction.logoHome || "/logos/default.png"}
              className="w-full h-full object-contain"
              alt={prediction.homeTeam}
            />
          </div>
          <span className="text-sm font-bold text-white">
            {prediction.homeTeam.substring(0, 3).toUpperCase()}
          </span>
        </div>
        <span className="text-xs text-white/30 font-bold">VS</span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-white">
            {prediction.awayTeam.substring(0, 3).toUpperCase()}
          </span>
          <div className="w-8 h-8 rounded-full bg-white/10 p-1">
            <img
              src={prediction.logoAway || "/logos/default.png"}
              className="w-full h-full object-contain"
              alt={prediction.awayTeam}
            />
          </div>
        </div>
      </div>

      {isPremium ? (
        <div className="text-center py-2">
          <Lock className="w-6 h-6 text-orange-500 mx-auto mb-2" />
          <p className="text-xs text-white/60 mb-3">
            Premium Tip: Upgrade to Unlock
          </p>
          <button className="w-full py-2 bg-gradient-to-r from-orange-600 to-orange-500 rounded text-xs font-bold text-white uppercase">
            Upgrade Now
          </button>
        </div>
      ) : (
        <div>
          <div className="mb-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-white/50">Tip</span>
              <span className="text-sm text-white font-bold">
                {prediction.prediction}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-white/50">Odds</span>
              <span className="text-sm text-white font-bold">
                {prediction.odds}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 mt-2 border-t border-white/5">
              <span className="text-xs text-white/50">Status</span>
              <span
                className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider ${getStatusColor(prediction.status || "Upcoming")}`}
              >
                {prediction.status || "Upcoming"}
              </span>
            </div>
          </div>

          {/* Dynamic button */}
          <TrackButton
            prediction={prediction}
            trackedIds={trackedIds}
            onTrack={onTrack}
            className="w-full justify-center flex"
          />
        </div>
      )}
    </div>
  );
}
