"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { apiClient } from "@/utils/apiClient";
import { Prediction } from "@/types/Prediction";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  ChevronRight,
  Trophy,
  Clock,
  Star,
} from "lucide-react";

// ── Extended type with all statuses ───────────────────────────────
type MatchStatus = "Upcoming" | "Pending" | "Won" | "Lost" | "Void";
type MatchType = "Free" | "Premium";
type Match = Omit<Prediction, "status"> & { status: MatchStatus };

const EMPTY_FORM = {
  homeTeam: "",
  awayTeam: "",
  logoHome: "",
  logoAway: "",
  competition: "",
  kickoffTime: "",
  prediction: "",
  odds: "1.85",
  type: "Free" as MatchType,
  status: "Upcoming" as MatchStatus,
};

const STATUS_STYLES: Record<MatchStatus, string> = {
  Upcoming: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Pending: "bg-white/10 text-white/50 border-white/10",
  Won: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Lost: "bg-red-500/10 text-red-400 border-red-500/20",
  Void: "bg-white/5 text-white/30 border-white/10",
};

export default function MatchManagementPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [filtered, setFiltered] = useState<Match[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [pinning, setPinning] = useState<string | null>(null); // NEW

  const [panel, setPanel] = useState<"create" | string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => { loadMatches(); }, []);

  const loadMatches = async () => {
    setLoading(true);
    try {
      const data = await apiClient.getPredictions();
      setMatches(data as Match[]);
      setFiltered(data as Match[]);
    } catch {
      toast.error("Failed to load matches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      matches.filter(
        (m) =>
          m.homeTeam.toLowerCase().includes(q) ||
          m.awayTeam.toLowerCase().includes(q) ||
          m.competition.toLowerCase().includes(q),
      ),
    );
  }, [search, matches]);

  const openCreate = () => { setForm(EMPTY_FORM); setPanel("create"); };

  const openEdit = (match: Match) => {
    setForm({
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      logoHome: match.logoHome || "",
      logoAway: match.logoAway || "",
      competition: match.competition,
      kickoffTime: match.kickoffTime
        ? new Date(match.kickoffTime).toISOString().slice(0, 16)
        : "",
      prediction: match.prediction,
      odds: match.odds || "1.85",
      type: match.type,
      status: match.status || "Upcoming",
    });
    setPanel(match._id);
  };

  const closePanel = () => setPanel(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreate = async () => {
    if (!form.homeTeam || !form.awayTeam || !form.competition || !form.kickoffTime) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSaving(true);
    try {
      await apiClient.createMatch(form);
      toast.success("Match created!", { style: { borderLeft: "4px solid #f97316" } });
      closePanel();
      loadMatches();
    } catch (err: any) {
      toast.error(err.message || "Failed to create match");
    } finally { setSaving(false); }
  };

  const handleUpdate = async () => {
    if (!panel || panel === "create") return;
    setSaving(true);
    try {
      await apiClient.updateMatch(panel, form);
      toast.success("Match updated!", { style: { borderLeft: "4px solid #f97316" } });
      closePanel();
      loadMatches();
    } catch (err: any) {
      toast.error(err.message || "Failed to update match");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this match?")) return;
    setDeleting(id);
    try {
      await apiClient.deleteMatch(id);
      toast.success("Match deleted");
      setMatches((prev) => prev.filter((m) => m._id !== id));
    } catch (err: any) {
      toast.error(err.message || "Failed to delete match");
    } finally { setDeleting(null); }
  };

  // ── NEW: Pin / Unpin Tip of Day ───────────────────────────────────
  const handlePinTipOfDay = async (match: Match) => {
    setPinning(match._id);
    try {
      if (match.isTipOfDay) {
        await apiClient.unpinTipOfDay(match._id);
        toast.success("Tip of the Day unpinned");
      } else {
        await apiClient.pinTipOfDay(match._id);
        toast.success(`${match.homeTeam} vs ${match.awayTeam} pinned as Tip of the Day ⭐`, {
          style: { borderLeft: "4px solid #f97316" },
        });
      }
      loadMatches();
    } catch (err: any) {
      toast.error(err.message || "Failed to update Tip of the Day");
    } finally { setPinning(null); }
  };

  const isEditing = panel !== null && panel !== "create";

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <DashboardLayout role="admin">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Match Tips</h1>
            <p className="text-white/40 text-sm mt-1">
              {matches.length} match{matches.length !== 1 ? "es" : ""} total
              {matches.some((m) => m.isTipOfDay) && (
                <span className="ml-2 text-orange-500">· 1 Tip of the Day active</span>
              )}
            </p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-5 py-2.5 bg-orange-500/20 border border-orange-500/40 text-orange-400 hover:bg-orange-500/30 hover:border-orange-500/60 rounded-lg text-sm font-bold uppercase tracking-wider transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Match
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Search teams or competition..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-orange-500/50 transition-colors"
          />
        </div>

        {/* Table */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden w-full">
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[640px] text-left border-collapse">
              <thead>
                <tr className="text-xs text-white/40 uppercase tracking-wider border-b border-white/5">
                  <th className="p-4 md:p-5 font-medium">Match</th>
                  <th className="p-4 md:p-5 font-medium hidden md:table-cell">Competition</th>
                  <th className="p-4 md:p-5 font-medium hidden sm:table-cell">Tip</th>
                  <th className="p-4 md:p-5 font-medium hidden sm:table-cell">Odds</th>
                  <th className="p-4 md:p-5 font-medium">Status</th>
                  <th className="p-4 md:p-5 font-medium hidden md:table-cell">Type</th>
                  <th className="p-4 md:p-5 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-10 text-center">
                      <div className="flex items-center justify-center gap-2 text-white/30">
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Loading matches...
                      </div>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-10 text-center text-white/30 text-sm">
                      {search ? "No matches found for your search" : "No matches yet — add your first one!"}
                    </td>
                  </tr>
                ) : (
                  filtered.map((match) => (
                    <tr
                      key={match._id}
                      className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors group ${
                        match.isTipOfDay ? "bg-orange-500/[0.03]" : ""
                      }`}
                    >
                      {/* Match */}
                      <td className="p-4 md:p-5">
                        <div className="flex items-center gap-2">
                          {/* Star badge if tip of day */}
                          {match.isTipOfDay && (
                            <Star className="w-3.5 h-3.5 text-orange-500 fill-orange-500 flex-shrink-0" />
                          )}
                          <img
                            src={match.logoHome || "/logos/default.png"}
                            className="w-6 h-6 object-contain rounded-full bg-white/5 p-0.5"
                          />
                          <span className="text-white font-bold text-xs">{match.homeTeam}</span>
                          <span className="text-white/20 text-xs">vs</span>
                          <span className="text-white font-bold text-xs">{match.awayTeam}</span>
                          <img
                            src={match.logoAway || "/logos/default.png"}
                            className="w-6 h-6 object-contain rounded-full bg-white/5 p-0.5"
                          />
                        </div>
                        <div className="flex items-center gap-1 mt-1 md:hidden">
                          <Clock className="w-3 h-3 text-white/20" />
                          <span className="text-white/30 text-[10px]">
                            {new Date(match.kickoffTime).toLocaleString([], {
                              month: "short", day: "numeric",
                              hour: "2-digit", minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </td>

                      {/* Competition */}
                      <td className="p-4 md:p-5 hidden md:table-cell">
                        <div className="flex items-center gap-1.5">
                          <Trophy className="w-3 h-3 text-white/20" />
                          <span className="text-white/60 text-xs">{match.competition}</span>
                        </div>
                      </td>

                      {/* Tip */}
                      <td className="p-4 md:p-5 hidden sm:table-cell">
                        <span className="text-orange-400 text-xs font-bold">{match.prediction || "—"}</span>
                      </td>

                      {/* Odds */}
                      <td className="p-4 md:p-5 hidden sm:table-cell">
                        <span className="text-white font-bold text-xs">{match.odds || "—"}</span>
                      </td>

                      {/* Status */}
                      <td className="p-4 md:p-5">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold border ${STATUS_STYLES[match.status || "Upcoming"]}`}>
                          {match.status || "Upcoming"}
                        </span>
                      </td>

                      {/* Type */}
                      <td className="p-4 md:p-5 hidden md:table-cell">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold border ${
                          match.type === "Premium"
                            ? "bg-orange-500/10 text-orange-400 border-orange-500/20"
                            : "bg-white/5 text-white/40 border-white/10"
                        }`}>
                          {match.type}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-4 md:p-5">
                        <div className="flex items-center justify-end gap-2">

                          {/* ⭐ Pin as Tip of Day */}
                          <button
                            onClick={() => handlePinTipOfDay(match)}
                            disabled={pinning === match._id}
                            title={match.isTipOfDay ? "Unpin Tip of Day" : "Set as Tip of the Day"}
                            className={`p-2 rounded-lg transition-all ${
                              match.isTipOfDay
                                ? "bg-orange-500/20 text-orange-400 border border-orange-500/30 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20"
                                : "bg-white/5 text-white/30 hover:text-orange-400 hover:bg-orange-500/10"
                            }`}
                          >
                            {pinning === match._id ? (
                              <svg className="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                              </svg>
                            ) : (
                              <Star className={`w-3.5 h-3.5 ${match.isTipOfDay ? "fill-orange-400" : ""}`} />
                            )}
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() => openEdit(match)}
                            className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-orange-400 hover:bg-orange-500/10 transition-all"
                            title="Edit"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(match._id)}
                            disabled={deleting === match._id}
                            className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50"
                            title="Delete"
                          >
                            {deleting === match._id ? (
                              <svg className="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                              </svg>
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {/* Open edit panel */}
                          <button
                            onClick={() => openEdit(match)}
                            className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all"
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Slide-out Edit / Create Panel ── */}
        <AnimatePresence>
          {panel !== null && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closePanel}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              />
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed top-0 right-0 bottom-0 w-full max-w-lg bg-[#0a0a0a] border-l border-white/10 z-50 flex flex-col overflow-hidden"
              >
                {/* Panel header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5 flex-shrink-0">
                  <div>
                    <h2 className="text-white font-black text-lg">
                      {isEditing ? "Edit Match" : "Add Match"}
                    </h2>
                    <p className="text-white/40 text-xs mt-0.5">
                      {isEditing
                        ? "Update match details, odds, and prediction"
                        : "Fill in the match details below"}
                    </p>
                  </div>
                  <button
                    onClick={closePanel}
                    className="p-2 rounded-full bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Panel body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-5">
                  {/* Teams */}
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-3">Teams</p>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Home Team *" name="homeTeam" value={form.homeTeam} onChange={handleChange} placeholder="e.g. Arsenal" />
                      <Field label="Away Team *" name="awayTeam" value={form.awayTeam} onChange={handleChange} placeholder="e.g. Chelsea" />
                    </div>
                  </div>

                  {/* Logos */}
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-3">Logo URLs (optional)</p>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Home Logo URL" name="logoHome" value={form.logoHome} onChange={handleChange} placeholder="https://..." />
                      <Field label="Away Logo URL" name="logoAway" value={form.logoAway} onChange={handleChange} placeholder="https://..." />
                    </div>
                    {(form.logoHome || form.logoAway) && (
                      <div className="flex items-center gap-4 mt-3 p-3 rounded-lg bg-white/5 border border-white/5">
                        {form.logoHome && (
                          <img src={form.logoHome} className="w-8 h-8 object-contain" onError={(e) => (e.currentTarget.style.display = "none")} />
                        )}
                        <span className="text-white/30 text-xs">vs</span>
                        {form.logoAway && (
                          <img src={form.logoAway} className="w-8 h-8 object-contain" onError={(e) => (e.currentTarget.style.display = "none")} />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Match details */}
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-3">Match Details</p>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Competition *" name="competition" value={form.competition} onChange={handleChange} placeholder="e.g. Premier League" />
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-white/40 mb-1.5">Kickoff Time *</label>
                        <input
                          type="datetime-local"
                          name="kickoffTime"
                          value={form.kickoffTime}
                          onChange={handleChange}
                          className="w-full bg-[#0f0f0f] border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Tip details */}
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-3">Tip Details</p>
                    <div className="space-y-3">
                      <Field label="Prediction" name="prediction" value={form.prediction} onChange={handleChange} placeholder="e.g. Home Win, Over 2.5" />
                      <div className="grid grid-cols-2 gap-3">
                        <Field label="Odds" name="odds" value={form.odds} onChange={handleChange} placeholder="e.g. 1.85" type="number" step="0.01" />
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-white/40 mb-1.5">Type</label>
                          <select
                            name="type"
                            value={form.type}
                            onChange={handleChange}
                            className="w-full bg-[#0f0f0f] border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all"
                          >
                            <option value="Free">Free</option>
                            <option value="Premium">Premium</option>
                          </select>
                        </div>
                      </div>
                      {isEditing && (
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-white/40 mb-1.5">Result Status</label>
                          <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            className="w-full bg-[#0f0f0f] border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all"
                          >
                            <option value="Upcoming">Upcoming</option>
                            <option value="Pending">Pending</option>
                            <option value="Won">Won</option>
                            <option value="Lost">Lost</option>
                            <option value="Void">Void</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Panel footer */}
                <div className="p-6 border-t border-white/5 flex-shrink-0 flex gap-3">
                  <button
                    onClick={closePanel}
                    className="flex-1 py-3 rounded-lg border border-white/10 text-white/50 hover:text-white hover:border-white/20 text-sm font-bold uppercase tracking-wider transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={isEditing ? handleUpdate : handleCreate}
                    disabled={saving}
                    className={`flex-1 py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-all bg-orange-500/20 border border-orange-500/40 text-orange-400 hover:bg-orange-500/30 hover:border-orange-500/60 hover:text-orange-300 ${saving ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {saving ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        {isEditing ? "Saving..." : "Creating..."}
                      </span>
                    ) : isEditing ? "Save Changes" : "Create Match"}
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function Field({ label, name, value, onChange, placeholder, type = "text", step }: {
  label: string; name: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string; type?: string; step?: string;
}) {
  return (
    <div>
      <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-white/40 mb-1.5">{label}</label>
      <input
        type={type} name={name} value={value} onChange={onChange}
        placeholder={placeholder} step={step}
        className="w-full bg-[#0f0f0f] border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all"
      />
    </div>
  );
}