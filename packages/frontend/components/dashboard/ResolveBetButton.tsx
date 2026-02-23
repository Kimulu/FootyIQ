"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiClient } from "@/utils/apiClient";
import { toast } from "sonner";
import { CheckCircle2, XCircle, MinusCircle, ChevronDown } from "lucide-react";

interface Props {
  predictionId: string;
  currentStatus: string;
  homeTeam: string;
  awayTeam: string;
  onResolved: (result: string) => void;
}

export function ResolveBetButton({
  predictionId,
  currentStatus,
  homeTeam,
  awayTeam,
  onResolved,
}: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);

  const options = [
    {
      label: "Won",
      value: "Won",
      icon: CheckCircle2,
      color: "text-emerald-400",
      bg: "hover:bg-emerald-500/10 hover:border-emerald-500/30",
    },
    {
      label: "Lost",
      value: "Lost",
      icon: XCircle,
      color: "text-red-400",
      bg: "hover:bg-red-500/10 hover:border-red-500/30",
    },
    {
      label: "Void",
      value: "Void",
      icon: MinusCircle,
      color: "text-white/40",
      bg: "hover:bg-white/10 hover:border-white/20",
    },
  ];

  const handleResolve = async (result: "Won" | "Lost" | "Void") => {
    setLoading(result);
    setOpen(false);
    try {
      await apiClient.resolveBets(predictionId, result);
      toast.success(`Match resolved as ${result}`, {
        description: `${homeTeam} vs ${awayTeam} — all user bets updated`,
        style: {
          borderLeft: `4px solid ${result === "Won" ? "#10b981" : result === "Lost" ? "#ef4444" : "#666"}`,
        },
      });
      onResolved(result);
    } catch (err: any) {
      toast.error(err.message || "Failed to resolve bets");
    } finally {
      setLoading(null);
    }
  };

  // Already resolved — show badge only
  if (["Won", "Lost", "Void"].includes(currentStatus)) {
    const colors: Record<string, string> = {
      Won: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      Lost: "bg-red-500/10 text-red-400 border-red-500/20",
      Void: "bg-white/10 text-white/40 border-white/10",
    };
    return (
      <span
        className={`px-3 py-1 rounded text-xs font-bold border ${colors[currentStatus]}`}
      >
        {currentStatus}
      </span>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        disabled={!!loading}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-white/20 text-xs font-bold uppercase tracking-wider transition-all"
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-3 w-3"
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
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Resolving...
          </>
        ) : (
          <>
            Mark Result
            <ChevronDown
              className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`}
            />
          </>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Click away */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-40 bg-[#0f0f0f] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-20"
            >
              {options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() =>
                    handleResolve(opt.value as "Won" | "Lost" | "Void")
                  }
                  className={`w-full flex items-center gap-2.5 px-4 py-3 text-xs font-bold border-b border-white/5 last:border-0 transition-all ${opt.color} ${opt.bg}`}
                >
                  <opt.icon className="w-4 h-4" />
                  {opt.label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
