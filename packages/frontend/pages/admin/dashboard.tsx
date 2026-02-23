"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ResolveBetButton } from "@/components/dashboard/ResolveBetButton";
import { apiClient } from "@/utils/apiClient";
import { Prediction } from "@/types/Prediction";
import { Newspaper, Trophy, Users, MoreHorizontal } from "lucide-react";

// Extend Prediction locally to include all possible statuses from the backend
type PredictionWithStatus = Prediction & {
  status: "Upcoming" | "Won" | "Lost" | "Pending" | "Void";
};

export default function AdminDashboard() {
  const [predictions, setPredictions] = useState<PredictionWithStatus[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiClient.getPredictions();
        setPredictions(data as PredictionWithStatus[]);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  const handleResolved = (predictionId: string, result: string) => {
    setPredictions((prev) =>
      prev.map((p) =>
        p._id === predictionId
          ? { ...p, status: result as PredictionWithStatus["status"] }
          : p,
      ),
    );
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <DashboardLayout role="admin">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-6">
            Admin Dashboard
          </h1>

          {/* Admin Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AdminStatCard
              label="Today's Articles"
              count="12"
              icon={Newspaper}
              color="text-orange-500"
            />
            <AdminStatCard
              label="Today's Tips"
              count="8"
              icon={Trophy}
              color="text-yellow-500"
            />
            <AdminStatCard
              label="Active Subscribers"
              count="1,245"
              icon={Users}
              color="text-emerald-500"
              hasProgress
            />
          </div>
        </div>

        {/* Predictions Table with Resolve */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden min-h-[400px] w-full max-w-full">
          {/* Tabs */}
          <div className="flex items-center border-b border-white/5 px-4 md:px-6 overflow-x-auto scrollbar-none">
            <button className="py-4 px-2 text-sm font-bold text-orange-500 border-b-2 border-orange-500 whitespace-nowrap">
              Match Tips
            </button>
            <button className="py-4 px-4 md:px-6 text-sm font-medium text-white/50 hover:text-white whitespace-nowrap">
              Recent Articles
            </button>
            <button className="py-4 px-4 md:px-6 text-sm font-medium text-white/50 hover:text-white whitespace-nowrap">
              Recent Subscribers
            </button>
            <div className="ml-auto pl-4 flex-shrink-0">
              <button className="text-xs text-white/40 hover:text-white whitespace-nowrap">
                View All ›
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[600px] text-left border-collapse">
              <thead>
                <tr className="text-xs text-white/40 uppercase tracking-wider border-b border-white/5">
                  <th className="p-4 md:p-6 font-medium">Match</th>
                  <th className="p-4 md:p-6 font-medium hidden sm:table-cell">
                    Tip
                  </th>
                  <th className="p-4 md:p-6 font-medium hidden sm:table-cell">
                    Competition
                  </th>
                  <th className="p-4 md:p-6 font-medium">Result</th>
                  <th className="p-4 md:p-6 font-medium text-right">
                    <MoreHorizontal className="w-5 h-5 ml-auto" />
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {predictions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-8 text-center text-white/30 text-sm"
                    >
                      No predictions found
                    </td>
                  </tr>
                ) : (
                  predictions.map((pred) => (
                    <tr
                      key={pred._id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                    >
                      {/* Match */}
                      <td className="p-4 md:p-6">
                        <div className="flex items-center gap-2">
                          <img
                            src={pred.logoHome || "/logos/default.png"}
                            className="w-5 h-5 object-contain"
                          />
                          <span className="text-white font-medium text-xs">
                            {pred.homeTeam} vs {pred.awayTeam}
                          </span>
                          <img
                            src={pred.logoAway || "/logos/default.png"}
                            className="w-5 h-5 object-contain"
                          />
                        </div>
                      </td>

                      {/* Tip */}
                      <td className="p-4 md:p-6 hidden sm:table-cell">
                        <span className="text-orange-400 text-xs font-bold">
                          {pred.prediction}
                        </span>
                      </td>

                      {/* Competition */}
                      <td className="p-4 md:p-6 hidden sm:table-cell">
                        <span className="px-2 py-1 bg-white/5 rounded text-white/60 text-xs">
                          {pred.competition}
                        </span>
                      </td>

                      {/* Resolve */}
                      <td className="p-4 md:p-6">
                        <ResolveBetButton
                          predictionId={pred._id}
                          currentStatus={pred.status || "Pending"}
                          homeTeam={pred.homeTeam}
                          awayTeam={pred.awayTeam}
                          onResolved={(result) =>
                            handleResolved(pred._id, result)
                          }
                        />
                      </td>

                      {/* Actions */}
                      <td className="p-4 md:p-6 text-right text-white/40 group-hover:text-white cursor-pointer">
                        ...
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function AdminStatCard({ label, count, icon: Icon, color, hasProgress }: any) {
  return (
    <div className="bg-gradient-to-br from-[#151515] to-[#0a0a0a] border border-white/5 rounded-xl p-6 relative overflow-hidden w-full">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-white/50 text-xs uppercase font-bold mb-1 flex items-center gap-2">
            <Icon className="w-4 h-4 flex-shrink-0" /> {label}
          </div>
          <div className="text-3xl font-bold text-white">{count}</div>
        </div>
      </div>

      {hasProgress && (
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-white/40 font-bold">F</span>
          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="w-[70%] h-full bg-orange-600 rounded-full" />
          </div>
          <span className="text-xs text-white/40 font-bold">P</span>
        </div>
      )}

      <div
        className={`absolute -right-4 -top-4 w-24 h-24 bg-current opacity-5 blur-2xl rounded-full ${color}`}
      />
    </div>
  );
}
