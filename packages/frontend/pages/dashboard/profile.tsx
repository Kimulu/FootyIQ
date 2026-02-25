"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { apiClient } from "@/utils/apiClient";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import Link from "next/link"; // Added Link for Edit Profile button
import {
  Wallet,
  TrendingUp,
  Target,
  CheckCircle2,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  Star,
  MapPin, // Added MapPin
  Edit, // Added Edit icon
} from "lucide-react";

interface BetStats {
  total: number;
  won: number;
  lost: number;
  pending: number;
  totalStaked: number;
  profitLoss: number;
  winRate: string;
  roi: string;
}

// ── Badge definitions ──────────────────────────────────────────────
const getBadges = (stats: BetStats, points: number) => {
  const badges = [];

  if (stats.total >= 1)
    badges.push({
      label: "First Bet",
      desc: "Tracked your first bet",
      icon: "🎯",
      earned: true,
    });
  if (stats.total >= 10)
    badges.push({
      label: "10 Bets",
      desc: "Tracked 10 bets",
      icon: "📊",
      earned: true,
    });
  if (stats.won >= 5)
    badges.push({
      label: "5 Wins",
      desc: "Won 5 tracked bets",
      icon: "✅",
      earned: true,
    });
  if (parseFloat(stats.winRate) >= 70)
    badges.push({
      label: "Sharp",
      desc: "70%+ win rate",
      icon: "🔥",
      earned: true,
    });
  if (parseFloat(stats.roi) >= 20)
    badges.push({
      label: "Profitable",
      desc: "20%+ ROI",
      icon: "📈",
      earned: true,
    });
  if (points >= 1000)
    badges.push({
      label: "1K Points",
      desc: "Earned 1,000 points",
      icon: "⭐",
      earned: true,
    });

  // Unearned
  if (stats.total < 10)
    badges.push({
      label: "10 Bets",
      desc: `${10 - stats.total} more to go`,
      icon: "📊",
      earned: false,
    });
  if (stats.won < 5)
    badges.push({
      label: "5 Wins",
      desc: `${5 - stats.won} more wins needed`,
      icon: "✅",
      earned: false,
    });
  if (parseFloat(stats.winRate) < 70)
    badges.push({
      label: "Sharp",
      desc: "Reach 70% win rate",
      icon: "🔥",
      earned: false,
    });

  return badges;
};

export default function ProfilePage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<BetStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiClient.getMyBets();
        setStats(data.stats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const points = (user as any)?.points || 0;
  const bankroll = (user as any)?.bankroll;
  const isProfitable = (stats?.profitLoss ?? 0) >= 0;
  const badges = stats ? getBadges(stats, points) : [];
  const earnedBadges = badges.filter((b) => b.earned);
  const unearnedBadges = badges.filter((b) => !b.earned);

  const joinDate = (user as any)?.createdAt
    ? new Date((user as any).createdAt).toLocaleDateString([], {
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <ProtectedRoute allowedRoles={["user", "admin"]}>
      <DashboardLayout role="user">
        {/* ── NEW: Profile Visual Header (Banner + Avatar) ── */}
        <div className="relative mb-12">
          {/* Banner Image */}
          <div className="h-48 md:h-64 w-full rounded-2xl overflow-hidden bg-[#151515] relative">
            {(user as any)?.banner ? (
              <img
                src={(user as any).banner}
                alt="Banner"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-orange-900/40 to-[#0a0a0a]" />
            )}

            {/* Edit Button overlay on banner */}
            <Link
              href="/dashboard/settings"
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-lg text-xs font-bold backdrop-blur-md transition-all flex items-center gap-2"
            >
              <Edit className="w-3 h-3" /> Edit Profile
            </Link>
          </div>

          {/* Avatar & Info Wrapper */}
          <div className="px-6 md:px-10">
            <div className="flex flex-col md:flex-row items-start gap-6 -mt-12 relative z-10">
              {/* Avatar (Image or Initials) */}
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-[#050505] bg-[#1a1a1a] flex items-center justify-center text-white font-black text-4xl shadow-2xl overflow-hidden">
                {(user as any)?.avatar ? (
                  <img
                    src={(user as any).avatar}
                    alt={user?.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  user?.username?.charAt(0).toUpperCase() || "U"
                )}
              </div>

              {/* User Details */}
              <div className="flex-1 min-w-0 pt-2 md:pt-14">
                <div className="flex items-center gap-3 flex-wrap mb-2">
                  <h1 className="text-3xl font-black text-white">
                    {user?.username}
                  </h1>
                  <span
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                      (user as any)?.subscription?.plan === "yearly" ||
                      (user as any)?.subscription?.plan === "monthly"
                        ? "bg-orange-500/10 text-orange-400 border-orange-500/20"
                        : "bg-white/5 text-white/40 border-white/10"
                    }`}
                  >
                    {(user as any)?.subscription?.plan === "free"
                      ? "Free Plan"
                      : "Premium"}
                  </span>
                </div>

                {/* Bio (New) */}
                {(user as any)?.bio && (
                  <p className="text-white/60 text-sm mb-4 max-w-2xl leading-relaxed">
                    {(user as any).bio}
                  </p>
                )}

                {/* Meta info row */}
                <div className="flex items-center gap-6 flex-wrap text-white/40 text-xs font-medium">
                  {/* Location (New) */}
                  {(user as any)?.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {(user as any).location}
                    </div>
                  )}

                  {user?.email && (
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5" />
                      {user.email}
                    </div>
                  )}

                  {joinDate && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      Joined {joinDate}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bankroll & Performance ── */}
        <div className="mb-10">
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white/40 mb-4">
            Performance Summary
          </h2>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-[#0a0a0a] border border-white/5 rounded-xl p-5 h-24 animate-pulse"
                />
              ))}
            </div>
          ) : stats ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Bankroll */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0 }}
                className="bg-[#0a0a0a] border border-white/5 rounded-xl p-5 hover:border-orange-500/20 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Wallet className="w-4 h-4 text-orange-500" />
                  <span className="text-[10px] uppercase tracking-widest text-white/40">
                    Bankroll
                  </span>
                </div>
                <div className="text-xl font-black text-white">
                  {bankroll?.isSet
                    ? `KSh ${(bankroll.amount || 0).toLocaleString()}`
                    : "Not set"}
                </div>
                {bankroll?.isSet && (
                  <div className="text-xs text-white/30 mt-1">
                    Started: KSh{" "}
                    {(bankroll.initialAmount || 0).toLocaleString()}
                  </div>
                )}
              </motion.div>

              {/* Win Rate */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="bg-[#0a0a0a] border border-white/5 rounded-xl p-5 hover:border-orange-500/20 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-orange-500" />
                  <span className="text-[10px] uppercase tracking-widest text-white/40">
                    Win Rate
                  </span>
                </div>
                <div className="text-xl font-black text-white">
                  {stats.winRate}%
                </div>
                <div className="text-xs text-white/30 mt-1">
                  {stats.won}W · {stats.lost}L · {stats.pending}P
                </div>
              </motion.div>

              {/* ROI */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-[#0a0a0a] border border-white/5 rounded-xl p-5 hover:border-orange-500/20 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-orange-500" />
                  <span className="text-[10px] uppercase tracking-widest text-white/40">
                    ROI
                  </span>
                </div>
                <div
                  className={`text-xl font-black ${parseFloat(stats.roi) >= 0 ? "text-emerald-400" : "text-red-400"}`}
                >
                  {parseFloat(stats.roi) >= 0 ? "+" : ""}
                  {stats.roi}%
                </div>
                <div className="text-xs text-white/30 mt-1">
                  Bankroll growth
                </div>
              </motion.div>

              {/* Profit / Loss */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-[#0a0a0a] border border-white/5 rounded-xl p-5 hover:border-orange-500/20 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-500" />
                  <span className="text-[10px] uppercase tracking-widest text-white/40">
                    Profit / Loss
                  </span>
                </div>
                <div
                  className={`text-xl font-black ${isProfitable ? "text-emerald-400" : "text-red-400"}`}
                >
                  {isProfitable ? "+" : ""}KSh{" "}
                  {stats.profitLoss.toLocaleString()}
                </div>
                <div className="text-xs text-white/30 mt-1">
                  {stats.total} bets tracked
                </div>
              </motion.div>
            </div>
          ) : (
            <p className="text-white/30 text-sm">No betting activity yet.</p>
          )}
        </div>

        {/* ── Badges — quiet section, no fanfare ── */}
        {stats && stats.total > 0 && (
          <div className="mb-10">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white/40 mb-4">
              Milestones
            </h2>

            {/* Earned */}
            {earnedBadges.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-4">
                {earnedBadges.map((badge) => (
                  <div
                    key={badge.label}
                    className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#0a0a0a] border border-white/10 hover:border-orange-500/20 transition-colors"
                    title={badge.desc}
                  >
                    <span className="text-base">{badge.icon}</span>
                    <div>
                      <div className="text-white text-xs font-bold">
                        {badge.label}
                      </div>
                      <div className="text-white/30 text-[10px]">
                        {badge.desc}
                      </div>
                    </div>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 ml-1" />
                  </div>
                ))}
              </div>
            )}

            {/* Unearned — greyed out, no pressure */}
            {unearnedBadges.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {unearnedBadges.map((badge) => (
                  <div
                    key={badge.label + "-unearned"}
                    className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#0a0a0a] border border-white/5 opacity-40"
                    title={badge.desc}
                  >
                    <span className="text-base grayscale">{badge.icon}</span>
                    <div>
                      <div className="text-white/60 text-xs font-bold">
                        {badge.label}
                      </div>
                      <div className="text-white/30 text-[10px]">
                        {badge.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Account details ── */}
        <div>
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white/40 mb-4">
            Account
          </h2>
          <div className="bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden">
            {[
              { label: "Username", value: user?.username },
              { label: "Email", value: user?.email },
              {
                label: "Phone",
                value: (user as any)?.phoneNumber || "Not set",
              },
              {
                label: "Plan",
                value:
                  (user as any)?.subscription?.plan === "free"
                    ? "Free"
                    : "Premium",
              },
              { label: "Member since", value: joinDate || "—" },
            ].map((row, i) => (
              <div
                key={row.label}
                className={`flex items-center justify-between px-5 py-4 ${
                  i < 4 ? "border-b border-white/5" : ""
                }`}
              >
                <span className="text-white/40 text-sm">{row.label}</span>
                <span className="text-white text-sm font-medium">
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
