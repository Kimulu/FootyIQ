"use client";

import { useState } from "react";
import { Container } from "@/components/layout/Container";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AddMatchPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    homeTeam: "",
    awayTeam: "",
    logoHome: "",
    logoAway: "",
    competition: "", // Default empty, let user type
    kickoffTime: "",
    prediction: "Over 2.5 Goals",
    odds: "1.85",
    type: "Free",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // NOTE: Ensure this matches your backend URL
      const res = await fetch("http://localhost:5000/api/admin/create-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to create match");

      toast.success("Match Added Successfully!");
      router.push("/");
    } catch (err) {
      toast.error("Failed to add match");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#050505] py-20">
      <Container>
        <div className="max-w-3xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center text-white/50 hover:text-white mb-6 text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Link>

          <div className="bg-[#0a0a0a] border border-white/10 p-8 rounded-xl shadow-2xl">
            <h1 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">
              Manual Match Entry
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* --- TEAM NAMES --- */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/50 text-xs uppercase font-bold mb-2">
                    Home Team Name
                  </label>
                  <input
                    name="homeTeam"
                    required
                    onChange={handleChange}
                    className="w-full bg-[#121212] border border-white/10 rounded-lg p-3 text-white focus:border-orange-500 outline-none"
                    placeholder="e.g. Gor Mahia"
                  />
                </div>
                <div>
                  <label className="block text-white/50 text-xs uppercase font-bold mb-2">
                    Away Team Name
                  </label>
                  <input
                    name="awayTeam"
                    required
                    onChange={handleChange}
                    className="w-full bg-[#121212] border border-white/10 rounded-lg p-3 text-white focus:border-orange-500 outline-none"
                    placeholder="e.g. AFC Leopards"
                  />
                </div>
              </div>

              {/* --- LOGO URLS --- */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/50 text-xs uppercase font-bold mb-2">
                    Home Logo URL
                  </label>
                  <input
                    name="logoHome"
                    onChange={handleChange}
                    className="w-full bg-[#121212] border border-white/10 rounded-lg p-3 text-white text-sm focus:border-orange-500 outline-none"
                    placeholder="https://... (Optional)"
                  />
                </div>
                <div>
                  <label className="block text-white/50 text-xs uppercase font-bold mb-2">
                    Away Logo URL
                  </label>
                  <input
                    name="logoAway"
                    onChange={handleChange}
                    className="w-full bg-[#121212] border border-white/10 rounded-lg p-3 text-white text-sm focus:border-orange-500 outline-none"
                    placeholder="https://... (Optional)"
                  />
                </div>
              </div>

              {/* --- MATCH DETAILS (UPDATED: INPUT FIELD) --- */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/50 text-xs uppercase font-bold mb-2">
                    Competition
                  </label>
                  {/* CHANGED FROM SELECT TO INPUT */}
                  <input
                    name="competition"
                    required
                    onChange={handleChange}
                    className="w-full bg-[#121212] border border-white/10 rounded-lg p-3 text-white focus:border-orange-500 outline-none"
                    placeholder="e.g. Europa League"
                  />
                </div>
                <div>
                  <label className="block text-white/50 text-xs uppercase font-bold mb-2">
                    Kickoff Time
                  </label>
                  <input
                    name="kickoffTime"
                    type="datetime-local"
                    required
                    onChange={handleChange}
                    className="w-full bg-[#121212] border border-white/10 rounded-lg p-3 text-white focus:border-orange-500 outline-none"
                  />
                </div>
              </div>

              {/* --- PREDICTION DATA --- */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-white/50 text-xs uppercase font-bold mb-2">
                    Type
                  </label>
                  <select
                    name="type"
                    onChange={handleChange}
                    className="w-full bg-[#121212] border border-white/10 rounded-lg p-3 text-white focus:border-orange-500 outline-none"
                  >
                    <option value="Free">Free</option>
                    <option value="Premium">Premium</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white/50 text-xs uppercase font-bold mb-2">
                    Odds
                  </label>
                  <input
                    name="odds"
                    onChange={handleChange}
                    defaultValue="1.85"
                    className="w-full bg-[#121212] border border-white/10 rounded-lg p-3 text-white focus:border-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-white/50 text-xs uppercase font-bold mb-2">
                    Prediction
                  </label>
                  <input
                    name="prediction"
                    onChange={handleChange}
                    className="w-full bg-[#121212] border border-white/10 rounded-lg p-3 text-white focus:border-orange-500 outline-none"
                    placeholder="e.g. Home Win"
                  />
                </div>
              </div>

              <button
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold uppercase tracking-widest rounded-lg shadow-lg transition-all"
              >
                {loading ? "Adding Match..." : "Create Match"}
              </button>
            </form>
          </div>
        </div>
      </Container>
    </section>
  );
}
