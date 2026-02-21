"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { apiClient } from "@/utils/apiClient";
import { Prediction } from "@/types/Prediction";
import Link from "next/link";
import { MessageSquare, Unlock, FileText, Lock } from "lucide-react";

export default function UserDashboard() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiClient.getPredictions();
        setPredictions(data.slice(0, 3)); // Only show top 3
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  return (
    <ProtectedRoute allowedRoles={["user", "admin"]}>
      <DashboardLayout role="user">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-6">Welcome back!</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatWidget icon={MessageSquare} count={3} label="New Tips Today" />
            <StatWidget icon={Unlock} count={2} label="Premium Tips Unlocked" />
            <StatWidget icon={FileText} count={5} label="New Articles" />
          </div>
        </div>

        {/* Today's Match Tips Section */}
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
            {predictions.map((pred) => (
              <DashboardTipCard key={pred._id} prediction={pred} />
            ))}
          </div>
        </div>

        {/* Latest Intelligence Section */}
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

// --- HELPER COMPONENTS ---

function StatWidget({ icon: Icon, count, label }: any) {
  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6 flex items-center gap-4 relative overflow-hidden group hover:border-orange-500/30 transition-colors">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <div className="text-2xl font-bold text-white">{count}</div>
        <div className="text-sm text-white/50">{label}</div>
      </div>
    </div>
  );
}

function DashboardTipCard({ prediction }: { prediction: Prediction }) {
  const isPremium = prediction.type === "Premium";

  return (
    <div
      className={`relative p-5 rounded-xl border ${isPremium ? "border-orange-500/20 bg-orange-900/5" : "border-white/10 bg-[#0a0a0a]"}`}
    >
      {/* Badge */}
      <div
        className={`absolute top-4 left-4 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${isPremium ? "bg-orange-600 text-white" : "bg-[#252525] text-orange-500"}`}
      >
        {isPremium ? "Locked Tip" : prediction.competition || "Match"}
      </div>

      <div className="mt-8 flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/10 p-1">
            <img
              src={prediction.logoHome || "/logos/default.png"}
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-sm font-bold text-white">
            {prediction.homeTeam.substring(0, 3).toUpperCase()}
          </span>
        </div>
        <span className="text-xs text-white/30 font-bold">VS</span>
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-white">
            {prediction.awayTeam.substring(0, 3).toUpperCase()}
          </span>
          <div className="w-8 h-8 rounded-full bg-white/10 p-1">
            <img
              src={prediction.logoAway || "/logos/default.png"}
              className="w-full h-full object-contain"
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
          <div className="mb-3">
            <div className="text-xs text-white/50">
              Tip:{" "}
              <span className="text-white font-bold">
                {prediction.prediction}
              </span>
            </div>
            <div className="text-xs text-white/50">
              Odds: <span className="text-white font-bold"></span>
            </div>
          </div>
          <button className="w-full py-2 border border-orange-500/30 text-orange-500 rounded text-xs font-bold uppercase hover:bg-orange-500/10 transition-colors">
            View Analysis
          </button>
        </div>
      )}
    </div>
  );
}
