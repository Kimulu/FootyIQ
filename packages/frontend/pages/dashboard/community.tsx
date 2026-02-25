"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { apiClient } from "@/utils/apiClient";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { TrendingUp, Users, Calendar } from "lucide-react";

interface LeaderboardEntry {
  _id: string;
  username: string;
  points: number;
  avatar?: string; // <--- Added this
  bankroll?: {
    amount: number;
    initialAmount: number;
  };
}

export default function CommunityPage() {
  const { user } = useAuth();
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth] = useState(
    new Date().toLocaleString("default", { month: "long", year: "numeric" }),
  );

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await apiClient.getLeaderboard();
        setLeaders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Find current user's rank
  const myRank = leaders.findIndex((l) => l._id === (user as any)?._id) + 1;

  return (
    <ProtectedRoute allowedRoles={["user", "admin"]}>
      <DashboardLayout role="user">
        {/* ── Header ── */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Top Performers</h1>
          <p className="text-white/40 text-sm">
            Members with the highest accuracy and returns this month
          </p>
        </div>

        {/* ── Context note ── */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/5 mb-8">
          <TrendingUp className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
          <p className="text-white/50 text-xs leading-relaxed">
            Rankings are based on points earned from accurately followed tips
            this month. Points reset on the 1st of each month.
          </p>
        </div>

        {/* ── Month + user count ── */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-2 text-white/40 text-xs">
            <Calendar className="w-3.5 h-3.5" />
            <span>{currentMonth}</span>
          </div>
          <div className="flex items-center gap-2 text-white/40 text-xs">
            <Users className="w-3.5 h-3.5" />
            <span>{leaders.length} active members this month</span>
          </div>
        </div>

        {/* ── Your rank pill ── */}
        {myRank > 0 && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-orange-500/5 border border-orange-500/10 flex items-center justify-between">
            <span className="text-white/50 text-xs">Your current rank</span>
            <span className="text-orange-400 font-black text-sm">
              #{myRank} of {leaders.length}
            </span>
          </div>
        )}

        {/* ── Leaderboard table ── */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-12 px-5 py-3 border-b border-white/5 text-[10px] uppercase tracking-widest text-white/30 font-bold">
            <div className="col-span-1">#</div>
            <div className="col-span-6">Member</div>
            <div className="col-span-3 text-right">Points</div>
            <div className="col-span-2 text-right hidden sm:block">ROI</div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16 gap-3 text-white/30">
              <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
              Loading...
            </div>
          ) : leaders.length === 0 ? (
            <div className="py-16 text-center text-white/30 text-sm">
              No activity recorded this month yet.
            </div>
          ) : (
            leaders.map((entry, index) => {
              const isMe = entry._id === (user as any)?._id;
              const rank = index + 1;

              // ROI Calculation
              const roi =
                entry.bankroll?.initialAmount &&
                entry.bankroll.initialAmount > 0
                  ? (
                      ((entry.bankroll.amount - entry.bankroll.initialAmount) /
                        entry.bankroll.initialAmount) *
                      100
                    ).toFixed(1)
                  : null;

              return (
                <motion.div
                  key={entry._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.04 }}
                  className={`grid grid-cols-12 px-5 py-4 border-b border-white/5 items-center transition-colors ${
                    isMe
                      ? "bg-orange-500/5 border-l-2 border-l-orange-500/40"
                      : "hover:bg-white/[0.02]"
                  }`}
                >
                  {/* Rank */}
                  <div className="col-span-1">
                    {rank === 1 ? (
                      <span className="text-yellow-400 font-black text-sm">
                        1
                      </span>
                    ) : rank === 2 ? (
                      <span className="text-white/60 font-black text-sm">
                        2
                      </span>
                    ) : rank === 3 ? (
                      <span className="text-orange-700 font-black text-sm">
                        3
                      </span>
                    ) : (
                      <span className="text-white/30 text-sm">{rank}</span>
                    )}
                  </div>

                  {/* Username & Avatar */}
                  <div className="col-span-6 flex items-center gap-3">
                    {/* AVATAR LOGIC */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 overflow-hidden ${
                        rank === 1
                          ? "bg-yellow-400/10 text-yellow-400 border border-yellow-400/20"
                          : rank === 2
                            ? "bg-white/10 text-white/60 border border-white/10"
                            : rank === 3
                              ? "bg-orange-800/20 text-orange-700 border border-orange-700/20"
                              : "bg-white/5 text-white/40 border border-white/5"
                      }`}
                    >
                      {entry.avatar ? (
                        <img
                          src={entry.avatar}
                          alt={entry.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        entry.username.charAt(0).toUpperCase()
                      )}
                    </div>

                    <div>
                      <span
                        className={`text-sm font-bold ${
                          isMe ? "text-orange-400" : "text-white/80"
                        }`}
                      >
                        {entry.username}
                        {isMe && (
                          <span className="ml-2 text-[10px] text-orange-400/60 font-normal">
                            you
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Points */}
                  <div className="col-span-3 text-right">
                    <span
                      className={`font-black text-sm ${
                        rank <= 3 ? "text-white" : "text-white/60"
                      }`}
                    >
                      {entry.points.toLocaleString()}
                      <span className="text-white/30 text-xs font-normal ml-1">
                        pts
                      </span>
                    </span>
                  </div>

                  {/* ROI */}
                  <div className="col-span-2 text-right hidden sm:block">
                    {roi !== null ? (
                      <span
                        className={`text-xs font-bold ${
                          parseFloat(roi) >= 0
                            ? "text-emerald-400"
                            : "text-red-400"
                        }`}
                      >
                        {parseFloat(roi) >= 0 ? "+" : ""}
                        {roi}%
                      </span>
                    ) : (
                      <span className="text-white/20 text-xs">—</span>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* ── Rewards note ── */}
        <div className="mt-8 p-5 rounded-xl border border-white/5 bg-[#0a0a0a]">
          <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-3">
            Monthly Rewards
          </p>
          <div className="space-y-2">
            {[
              { rank: "1st place", reward: "3 months Premium access" },
              { rank: "2nd place", reward: "1 month Premium access" },
              { rank: "3rd place", reward: "2 weeks Premium access" },
              { rank: "Top 10", reward: "Elite member badge" },
            ].map((r) => (
              <div key={r.rank} className="flex items-center justify-between">
                <span className="text-white/30 text-xs">{r.rank}</span>
                <span className="text-white/50 text-xs">{r.reward}</span>
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
