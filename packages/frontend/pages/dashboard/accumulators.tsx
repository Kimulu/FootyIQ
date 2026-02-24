"use client";

import { useState, useEffect } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { apiClient } from "@/utils/apiClient";
import { Layers, Trophy, BookCheck, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { TrackBetModal } from "@/components/dashboard/TrackBetModal"; // <--- Import Modal

export default function AccumulatorsPage() {
  const { refreshUser } = useAuth();
  const [accas, setAccas] = useState<any[]>([]);
  const [trackedAccaIds, setTrackedAccaIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // State for the Modal
  const [trackingAcca, setTrackingAcca] = useState<any | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [accasData, betsData] = await Promise.all([
        apiClient.getAccumulators(),
        apiClient.getMyBets(),
      ]);

      setAccas(accasData);

      const accaIds = new Set<string>(
        betsData.betSlips
          .filter((b: any) => b.tipType === "Accumulator" && b.accumulator)
          .map((b: any) =>
            typeof b.accumulator === "object"
              ? b.accumulator._id
              : b.accumulator,
          )
          .filter(Boolean),
      );

      setTrackedAccaIds(accaIds);

      if (refreshUser) await refreshUser();
    } catch (err) {
      console.error("Failed to load accumulators:", err);
      toast.error("Could not load accumulators");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <ProtectedRoute allowedRoles={["user", "admin"]}>
      <DashboardLayout role="user">
        {/* ── MODAL ────────────────────────────────────────────── */}
        {/* This was missing! It renders the modal when trackingAcca is set */}
        {trackingAcca && (
          <TrackBetModal
            isOpen={!!trackingAcca}
            accumulator={trackingAcca} // Pass the specific acca object
            onClose={() => setTrackingAcca(null)}
            onTracked={loadData}
          />
        )}

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Accumulators</h1>
          <p className="text-white/50 text-sm">
            High-value bundles curated by our experts.
          </p>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-[260px] bg-[#0a0a0a] border border-white/5 rounded-xl animate-pulse"
              />
            ))}
          </div>
        )}

        {/* EMPTY */}
        {!loading && accas.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-xl bg-white/[0.02]">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <Layers className="w-8 h-8 text-white/20" />
            </div>
            <h3 className="text-white font-bold text-lg mb-1">
              No Accumulators Available
            </h3>
            <p className="text-white/40 text-sm max-w-md text-center">
              Check back later for new bundles.
            </p>
          </div>
        )}

        {/* LIST */}
        {!loading && accas.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10">
            {accas.map((acca) => {
              const isTracked = trackedAccaIds.has(acca._id);

              return (
                <div
                  key={acca._id}
                  className="bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden flex flex-col hover:border-white/20 transition-colors"
                >
                  {/* Header */}
                  <div className="bg-white/5 p-5 flex justify-between items-center border-b border-white/5">
                    <div>
                      <h3 className="font-bold text-white text-lg flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-orange-500" />
                        {acca.title}
                      </h3>
                      <p className="text-xs text-white/40 mt-1">
                        {new Date(acca.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase text-white/40 font-bold tracking-wider">
                        Total Odds
                      </p>
                      <p className="text-2xl font-black text-orange-500 tracking-tight">
                        {acca.totalOdds}
                      </p>
                    </div>
                  </div>

                  {/* Matches */}
                  <div className="p-5 space-y-4 flex-1">
                    {acca.predictions.map((match: any) => (
                      <div
                        key={match._id}
                        className="flex items-center justify-between text-sm group"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-1 h-8 rounded-full transition-colors ${
                              match.status === "Won"
                                ? "bg-emerald-500"
                                : "bg-white/20"
                            }`}
                          />
                          <div>
                            <p className="text-white font-bold">
                              {match.homeTeam}{" "}
                              <span className="text-white/30 font-normal mx-1">
                                vs
                              </span>{" "}
                              {match.awayTeam}
                            </p>
                            <p className="text-xs text-orange-400 font-medium">
                              Tip: {match.prediction}
                            </p>
                          </div>
                        </div>
                        <span className="text-white/40 font-mono text-xs bg-white/5 px-2 py-1 rounded border border-white/5">
                          {match.odds}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="p-5 border-t border-white/5 bg-[#080808]">
                    <div className="flex items-center justify-between gap-4">
                      <div className="text-xs text-white/40">
                        <span className="block text-white/20 font-bold uppercase tracking-wider mb-0.5">
                          Potential Return
                        </span>
                        <span>
                          (100 × {acca.totalOdds}) ={" "}
                          <span className="text-white font-bold">
                            {(
                              100 * parseFloat(acca.totalOdds)
                            ).toLocaleString()}
                          </span>
                        </span>
                      </div>

                      {isTracked ? (
                        <div className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                          <BookCheck className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-emerald-500 text-xs font-bold uppercase tracking-wider">
                            Tracked
                          </span>
                        </div>
                      ) : (
                        <button
                          // OPEN MODAL INSTEAD OF API CALL
                          onClick={() => setTrackingAcca(acca)}
                          className="px-4 py-2 bg-orange-500/10 border border-orange-500/30 text-orange-400 hover:bg-orange-500/20 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
                        >
                          Track Bet
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
