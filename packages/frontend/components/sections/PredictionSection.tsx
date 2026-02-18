"use client";

import { useEffect, useState } from "react";
import { Prediction } from "@/types/Prediction";
import { apiClient } from "@/utils/apiClient";
import { PredictionCard } from "./PredictionCard";
import { Container } from "../layout/Container";

export function PredictionSection() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiClient.getPredictions();
        // Slice to 3 to match the 3-column layout in the image, or keep 4 if you prefer
        setPredictions(data.slice(0, 7));
      } catch (err) {
        console.error("Failed to load predictions", err);
      }
    };

    load();
  }, []);

  return (
    <section className="bg-[#050505] py-12">
      <Container>
        {/* Header Section matching image style */}
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

        {/* Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {predictions.map((pred) => (
            <PredictionCard key={pred._id} prediction={pred} />
          ))}
        </div>

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
