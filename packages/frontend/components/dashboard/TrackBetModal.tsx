"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiClient } from "@/utils/apiClient";
import { toast } from "sonner";
import { X, TrendingUp, Wallet, Calculator } from "lucide-react";
import { Prediction } from "@/types/Prediction";

interface Props {
  isOpen: boolean;
  prediction: Prediction;
  onClose: () => void;
  onTracked: () => void;
}

export function TrackBetModal({
  isOpen,
  prediction,
  onClose,
  onTracked,
}: Props) {
  const [stakeAmount, setStakeAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const QUICK_STAKES = [100, 200, 500, 1000, 2000];

  const odds = parseFloat(prediction.odds || "0");

  const potentialReturn =
    parseFloat(stakeAmount) > 0 && odds > 0
      ? (parseFloat(stakeAmount) * odds).toFixed(2)
      : null;

  const potentialProfit = potentialReturn
    ? (parseFloat(potentialReturn) - parseFloat(stakeAmount)).toFixed(2)
    : null;

  const handleTrack = async () => {
    const parsed = parseFloat(stakeAmount);
    if (!parsed || parsed <= 0) {
      toast.error("Please enter a valid stake amount");
      return;
    }

    setLoading(true);
    try {
      await apiClient.trackBet({
        predictionId: prediction._id,
        stakeAmount: parsed,
        oddsAtBet: prediction.odds,
        tipType: prediction.type,
      });

      toast.success("Bet tracked!", {
        description: `KSh ${parsed.toLocaleString()} on ${prediction.homeTeam} vs ${prediction.awayTeam}`,
        style: { borderLeft: "4px solid #f97316" },
      });

      onTracked();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to track bet");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
          >
            <div className="w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="relative p-6 border-b border-white/5">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[80px] bg-orange-600/10 blur-[60px] rounded-full pointer-events-none" />
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <h2 className="text-white font-black text-lg tracking-tight">
                        Track This Bet
                      </h2>
                      <p className="text-white/40 text-xs">
                        Log your stake to track your ROI
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-5">
                {/* Match info */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-2">
                    <img
                      src={prediction.logoHome || "/logos/default.png"}
                      className="w-6 h-6 object-contain"
                    />
                    <span className="text-white font-bold text-sm">
                      {prediction.homeTeam.substring(0, 3).toUpperCase()}
                    </span>
                  </div>

                  <div className="text-center">
                    <div className="text-[10px] text-white/30 uppercase tracking-widest mb-1">
                      Tip
                    </div>
                    <div className="text-orange-400 font-bold text-xs px-3 py-1 bg-orange-500/10 rounded-lg">
                      {prediction.prediction}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold text-sm">
                      {prediction.awayTeam.substring(0, 3).toUpperCase()}
                    </span>
                    <img
                      src={prediction.logoAway || "/logos/default.png"}
                      className="w-6 h-6 object-contain"
                    />
                  </div>
                </div>

                {/* Odds display — read only */}
                {prediction.odds && prediction.odds !== "-" && (
                  <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-white/5 border border-white/5">
                    <span className="text-xs text-white/40 uppercase tracking-widest">
                      Odds
                    </span>
                    <span className="text-white font-bold text-sm">
                      {prediction.odds}
                    </span>
                  </div>
                )}

                {/* Stake input */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 mb-2">
                    Your Stake (KSh)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm font-bold">
                      KSh
                    </span>
                    <input
                      type="number"
                      min="1"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      placeholder="0"
                      className="w-full bg-[#0f0f0f] border border-white/10 rounded-lg pl-14 pr-4 py-3.5 text-white text-lg font-bold placeholder-white/20 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 transition-all"
                    />
                  </div>

                  {/* Quick stakes */}
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {QUICK_STAKES.map((s) => (
                      <button
                        key={s}
                        onClick={() => setStakeAmount(s.toString())}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                          stakeAmount === s.toString()
                            ? "bg-orange-500/20 border-orange-500/50 text-orange-400"
                            : "bg-white/5 border-white/10 text-white/50 hover:border-white/20 hover:text-white"
                        }`}
                      >
                        {s.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Potential return calculator */}
                {potentialReturn && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-2 gap-3"
                  >
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Calculator className="w-3 h-3 text-white/30" />
                        <span className="text-[10px] text-white/30 uppercase tracking-wider">
                          Potential Return
                        </span>
                      </div>
                      <div className="text-white font-bold text-lg">
                        KSh {parseFloat(potentialReturn).toLocaleString()}
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Wallet className="w-3 h-3 text-emerald-400/50" />
                        <span className="text-[10px] text-emerald-400/50 uppercase tracking-wider">
                          Potential Profit
                        </span>
                      </div>
                      <div className="text-emerald-400 font-bold text-lg">
                        +KSh {parseFloat(potentialProfit!).toLocaleString()}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Track button */}
                <button
                  onClick={handleTrack}
                  disabled={loading || !stakeAmount}
                  className={`w-full py-3.5 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all duration-200
                    bg-orange-500/20 border border-orange-500/40 text-orange-400
                    hover:bg-orange-500/30 hover:border-orange-500/60 hover:text-orange-300
                    active:scale-[0.99]
                    ${loading || !stakeAmount ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Tracking...
                    </span>
                  ) : (
                    "Track This Bet"
                  )}
                </button>

                <p className="text-center text-xs text-white/20">
                  This only tracks your bet — it does not place it anywhere.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
