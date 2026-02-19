"use client";

import { useEffect, useState } from "react";
import { Prediction } from "@/types/Prediction";
import { apiClient } from "@/utils/apiClient";
import { PredictionCard } from "./PredictionCard";
import { Container } from "../layout/Container";
import { AlertCircle, Loader2 } from "lucide-react"; // Make sure you have lucide-react

export function PredictionSection() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await apiClient.getPredictions();
        console.log("Frontend received:", data); // Check console to see the array
        setPredictions(data); // Removed slice for now to see everything available
      } catch (err) {
        console.error("Failed to load predictions", err);
        setError("Failed to load match tips.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <section className="bg-[#050505] py-12 min-h-[400px]">
      <Container>
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Today's Match Tips
            </h2>
            <p className="text-white/60 text-sm">
              Expert football tips to help you make smarter bets.
            </p>
          </div>

          <a
            href="/predictions"
            className="hidden md:inline-flex items-center text-xs font-bold text-orange-500 hover:text-orange-400 uppercase tracking-widest"
          >
            View All Predictions <span className="ml-1 text-lg">›</span>
          </a>
        </div>

        {/* --- CONTENT AREA --- */}

        {/* 1. LOADING STATE */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-[300px] w-full rounded-xl bg-[#0a0a0a] border border-white/5 animate-pulse flex flex-col p-5"
              >
                <div className="h-4 w-20 bg-white/10 rounded mb-8" />
                <div className="flex justify-between mb-8">
                  <div className="h-8 w-24 bg-white/10 rounded" />
                  <div className="h-8 w-24 bg-white/10 rounded" />
                </div>
                <div className="h-4 w-3/4 bg-white/10 rounded mx-auto mt-auto" />
              </div>
            ))}
          </div>
        )}

        {/* 2. ERROR STATE */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-12 border border-dashed border-red-500/20 rounded-xl bg-red-500/5">
            <AlertCircle className="w-10 h-10 text-red-500 mb-4" />
            <p className="text-red-400 font-medium">{error}</p>
          </div>
        )}

        {/* 3. EMPTY STATE (No matches found) */}
        {!loading && !error && predictions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 border border-dashed border-white/10 rounded-xl bg-white/5">
            <p className="text-white/40 font-medium mb-2">
              No matches found in database.
            </p>
            <p className="text-white/20 text-xs">
              (Debug: Please run the Admin Sync to populate fixtures)
            </p>
          </div>
        )}

        {/* 4. DATA GRID */}
        {!loading && !error && predictions.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {predictions.map((pred) => (
              <PredictionCard key={pred._id} prediction={pred} />
            ))}
          </div>
        )}

        {/* Mobile View All Button */}
        <div className="mt-10 text-center md:hidden">
          <a
            href="/predictions"
            className="inline-block border border-orange-500/30 text-orange-500 text-xs font-bold uppercase tracking-widest px-6 py-3 rounded hover:bg-orange-500/10 transition-colors"
          >
            View All Tips
          </a>
        </div>
      </Container>
    </section>
  );
}
