"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Newspaper, Trophy, Users, MoreHorizontal } from "lucide-react";

export default function AdminDashboard() {
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
