import { Prediction } from "@/types/Prediction";
import Link from "next/link";
import { Lock } from "lucide-react";

interface Props {
  prediction: Prediction;
}

export function PredictionCard({ prediction }: Props) {
  const isPremium = prediction.type === "Premium";
  const isLocked = prediction.isLocked; // Check the flag from backend

  // Design Constants
  const buttonShape =
    "polygon(15px 0, 100% 0, calc(100% - 15px) 100%, 0% 100%)";
  const glowColor = isPremium
    ? "shadow-[0_0_15px_rgba(234,88,12,0.15)]"
    : "shadow-[0_0_15px_rgba(16,185,129,0.15)]";
  const badgeColor = isPremium ? "bg-orange-600" : "bg-emerald-600";
  const btnBgColor = isPremium ? "bg-orange-500" : "bg-[#10b981]";
  const btnTextColor = isPremium ? "text-orange-400" : "text-[#4ade80]";

  // Helper to get abbreviated team name
  const getTeamName = (name: string) =>
    name.length > 13 ? name.substring(0, 3).toUpperCase() : name;

  return (
    <div
      className={`group relative flex flex-col w-full overflow-hidden rounded-xl bg-[#0a0a0a] border border-white/10 ${glowColor} transition-transform hover:-translate-y-1 duration-300`}
    >
      {/* ── LOCKED OVERLAY ── */}
      {isLocked && (
        <div className="absolute inset-0 z-20 backdrop-blur-md bg-black/60 flex flex-col items-center justify-center text-center p-6">
          <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mb-3">
            <Lock className="w-6 h-6 text-orange-500" />
          </div>
          <h3 className="text-white font-bold text-lg mb-1">Premium Tip</h3>
          <p className="text-white/50 text-xs mb-4 max-w-[200px]">
            This high-value prediction is locked for free users.
          </p>
          <Link href="/dashboard/upgrade" className="inline-block">
            <button className="px-6 py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold uppercase tracking-widest rounded shadow-lg shadow-orange-900/40 transition-all">
              Unlock Now
            </button>
          </Link>
        </div>
      )}

      {/* Background Gradient */}
      <div
        className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${isPremium ? "from-orange-600 to-orange-400" : "from-emerald-600 to-emerald-400"}`}
      />

      {/* Badge */}
      <div className="absolute top-4 left-4 z-10">
        <span
          className={`${badgeColor} text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wider`}
        >
          {isPremium ? "Premium" : "Free"}
        </span>
      </div>

      {/* Main Content */}
      <div
        className={`relative p-5 pt-12 flex-grow flex flex-col justify-between ${isLocked ? "opacity-20 blur-sm" : ""}`}
      >
        {/* League */}
        <div className="mb-4">
          <p className="text-[#f59e0b] text-[10px] font-bold uppercase tracking-[0.2em] truncate">
            {prediction.competition || "Match"}
          </p>
        </div>

        {/* Teams */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col items-start gap-1">
            <span className="text-xl font-bold text-white tracking-wide leading-tight">
              {getTeamName(prediction.homeTeam)}
            </span>
            <span className="text-xl font-bold text-white tracking-wide leading-tight">
              {getTeamName(prediction.awayTeam)}
            </span>
          </div>

          <div className="flex items-center gap-2 opacity-80">
            <img
              src={prediction.logoHome || "/logos/default.png"}
              alt="home"
              className="h-8 w-8 object-contain"
            />
            <span className="text-xs text-white/40 font-bold">VS</span>
            <img
              src={prediction.logoAway || "/logos/default.png"}
              alt="away"
              className="h-8 w-8 object-contain"
            />
          </div>
        </div>

        {/* Details */}
        <div className="border-t border-dashed border-white/10 pt-4">
          <div className="mb-2">
            <p className="text-white/60 text-xs uppercase font-bold tracking-wider">
              Tip
            </p>
            <p className="text-white text-sm font-semibold truncate">
              {prediction.prediction}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-xs uppercase font-bold tracking-wider">
                Odds
              </p>
              <p className="text-white text-sm font-semibold">
                {prediction.odds || "1.85"}
              </p>
            </div>
            <div className="text-right">
              <span className="flex items-center gap-1 text-emerald-400 text-xs font-bold uppercase">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                {prediction.status || "Pending"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Button (Only visible if NOT locked, otherwise covered by overlay) */}
      <div
        className={`bg-[#121212] p-3 border-t border-white/5 flex justify-center ${isLocked ? "opacity-20 blur-sm" : ""}`}
      >
        <Link
          href={`/predictions/${prediction._id}`}
          className="group relative inline-block transition-transform hover:scale-[1.02] active:scale-95"
        >
          <div
            className="relative flex h-[32px] min-w-[110px] items-center justify-center text-[9px] font-bold uppercase tracking-widest text-white shadow-lg"
            style={{ clipPath: buttonShape }}
          >
            <div className={`absolute inset-0 ${btnBgColor}`} />
            <div
              className="absolute inset-[1px] bg-[#0a0f10]"
              style={{ clipPath: buttonShape }}
            />
            <span className={`z-10 flex items-center gap-2 ${btnTextColor}`}>
              View Analysis <span className="text-[10px] font-bold">›</span>
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
