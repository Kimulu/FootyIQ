"use client";
import { useState, useEffect } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { apiClient } from "@/utils/apiClient";
import { toast } from "sonner";

export default function AdminAccumulators() {
  const [matches, setMatches] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    apiClient.getPredictions().then(setMatches);
  }, []);

  // Calculate combined odds of selected matches
  const totalOdds = selectedIds
    .reduce((acc, id) => {
      const match = matches.find((m) => m._id === id);
      return acc * (parseFloat(match?.odds) || 1);
    }, 1)
    .toFixed(2);

  const toggleMatch = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleCreate = async () => {
    try {
      await apiClient.createAccumulator({
        title,
        matchIds: selectedIds,
        totalOdds,
      });
      toast.success("Accumulator Created!");
      setSelectedIds([]);
      setTitle("");
    } catch (err) {
      toast.error("Failed");
    }
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <DashboardLayout role="admin">
        <h1 className="text-2xl font-bold text-white mb-6">
          Create Accumulator
        </h1>

        <div className="flex gap-4 mb-6">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Accumulator Title (e.g. Daily Treble)"
            className="bg-[#121212] border border-white/10 rounded p-3 text-white w-1/2"
          />
          <div className="p-3 bg-orange-500/10 border border-orange-500/30 rounded text-orange-400 font-bold">
            Total Odds: {totalOdds}
          </div>
          <button
            onClick={handleCreate}
            className="bg-orange-600 text-white px-6 rounded font-bold"
          >
            Create
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {matches.map((match) => (
            <div
              key={match._id}
              onClick={() => toggleMatch(match._id)}
              className={`p-4 border rounded cursor-pointer ${
                selectedIds.includes(match._id)
                  ? "border-orange-500 bg-orange-500/10"
                  : "border-white/10 bg-[#0a0a0a]"
              }`}
            >
              <div className="flex justify-between text-white text-sm">
                <span>
                  {match.homeTeam} vs {match.awayTeam}
                </span>
                <span className="text-orange-400 font-bold">{match.odds}</span>
              </div>
              <div className="text-xs text-white/50 mt-1">
                {match.prediction}
              </div>
            </div>
          ))}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
