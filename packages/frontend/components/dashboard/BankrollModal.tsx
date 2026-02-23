"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiClient } from "@/utils/apiClient";
import { toast } from "sonner";
import { Wallet, X, TrendingUp, ShieldCheck, Info } from "lucide-react";

interface Props {
  isOpen: boolean;
  onComplete: (amount: number) => void;
  onSkip: () => void;
}

export function BankrollModal({ isOpen, onComplete, onSkip }: Props) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  // Quick select amounts in KSh
  const QUICK_AMOUNTS = [500, 1000, 2500, 5000, 10000];

  const handleSubmit = async () => {
    const parsed = parseFloat(amount);
    if (!parsed || parsed <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setLoading(true);
    try {
      await apiClient.setBankroll(parsed);
      toast.success("Bankroll set!", {
        description: `Your starting bankroll is KSh ${parsed.toLocaleString()}`,
        style: { borderLeft: "4px solid #f97316" },
      });
      onComplete(parsed);
    } catch (err: any) {
      toast.error(err.message || "Failed to set bankroll");
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
                {/* Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[100px] bg-orange-600/10 blur-[60px] rounded-full pointer-events-none" />

                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <h2 className="text-white font-black text-lg tracking-tight">
                        Set Your Bankroll
                      </h2>
                      <p className="text-white/40 text-xs">
                        One-time setup · You can change this anytime
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onSkip}
                    className="p-2 rounded-full bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6">
                {/* Why this matters */}
                <div className="flex gap-3 p-4 rounded-xl bg-orange-500/5 border border-orange-500/10">
                  <Info className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                  <p className="text-white/60 text-xs leading-relaxed">
                    Your bankroll is the total amount you're willing to bet
                    with. We use this to track your{" "}
                    <span className="text-orange-400 font-bold">win rate</span>,{" "}
                    <span className="text-orange-400 font-bold">ROI</span>, and{" "}
                    <span className="text-orange-400 font-bold">
                      profit/loss
                    </span>{" "}
                    over time. We never access your actual money.
                  </p>
                </div>

                {/* Amount input */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 mb-2">
                    Starting Bankroll (KSh)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm font-bold">
                      KSh
                    </span>
                    <input
                      type="number"
                      min="1"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0"
                      className="w-full bg-[#0f0f0f] border border-white/10 rounded-lg pl-14 pr-4 py-3.5 text-white text-lg font-bold placeholder-white/20 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 transition-all"
                    />
                  </div>
                </div>

                {/* Quick select */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-3">
                    Quick Select
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {QUICK_AMOUNTS.map((qty) => (
                      <button
                        key={qty}
                        onClick={() => setAmount(qty.toString())}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border ${
                          amount === qty.toString()
                            ? "bg-orange-500/20 border-orange-500/50 text-orange-400"
                            : "bg-white/5 border-white/10 text-white/50 hover:border-white/20 hover:text-white"
                        }`}
                      >
                        {qty.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* What you'll unlock */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-white/5 border border-white/5">
                    <TrendingUp className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span className="text-white/60 text-xs">ROI Tracking</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-white/5 border border-white/5">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span className="text-white/60 text-xs">
                      Win Rate Stats
                    </span>
                  </div>
                </div>

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={loading || !amount}
                  className={`w-full py-3.5 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all duration-200
                    bg-orange-500/20 border border-orange-500/40 text-orange-400
                    hover:bg-orange-500/30 hover:border-orange-500/60 hover:text-orange-300
                    active:scale-[0.99]
                    ${loading || !amount ? "opacity-50 cursor-not-allowed" : ""}
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
                      Saving...
                    </span>
                  ) : (
                    "Set My Bankroll"
                  )}
                </button>

                {/* Skip */}
                <button
                  onClick={onSkip}
                  className="w-full text-center text-xs text-white/30 hover:text-white/60 transition-colors"
                >
                  Skip for now — I'll set this later in my profile
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
