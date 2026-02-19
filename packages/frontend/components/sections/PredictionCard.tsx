import { Prediction } from "@/types/Prediction";
import Link from "next/link";

interface Props {
  prediction: Prediction;
}

export function PredictionCard({ prediction }: Props) {
  const isPremium = prediction.type === "Premium";

  // Specific polygon shape
  const buttonShape =
    "polygon(15px 0, 100% 0, calc(100% - 15px) 100%, 0% 100%)";

  // Dynamic colors
  const glowColor = isPremium
    ? "shadow-[0_0_15px_rgba(234,88,12,0.15)]"
    : "shadow-[0_0_15px_rgba(16,185,129,0.15)]";
  const badgeColor = isPremium ? "bg-orange-600" : "bg-emerald-600";
  const btnBgColor = isPremium ? "bg-orange-500" : "bg-[#10b981]";
  const btnTextColor = isPremium ? "text-orange-400" : "text-[#4ade80]";
  const btnDropShadow = isPremium
    ? "drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]"
    : "drop-shadow-[0_0_8px_rgba(74,222,128,0.4)]";

  // Helper to get abbreviated team name
  const getTeamName = (name: string) =>
    name.length > 13 ? name.substring(0, 3).toUpperCase() : name;

  // FIX: Handle Competition Name (Supports 'competition' or 'league' field)
  const competitionName =
    prediction.competition || prediction.league || "Upcoming Match";

  return (
    <div
      className={`group relative flex flex-col w-full overflow-hidden rounded-xl bg-[#0a0a0a] border border-white/10 ${glowColor} transition-transform hover:-translate-y-1 duration-300`}
    >
      {/* Background Gradient Effect */}
      <div
        className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${isPremium ? "from-orange-600 to-orange-400" : "from-emerald-600 to-emerald-400"}`}
      />

      {/* Badge (Free / Premium) */}
      <div className="absolute top-4 left-4 z-10">
        <span
          className={`${badgeColor} text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wider`}
        >
          {isPremium ? "Premium" : "Free"}
        </span>
      </div>

      {/* Main Content Area */}
      <div className="relative p-5 pt-12 flex-grow flex flex-col justify-between">
        {/* --- FIXED COMPETITION NAME --- */}
        <div className="mb-4">
          <p className="text-[#f59e0b] text-[10px] font-bold uppercase tracking-[0.2em] truncate">
            {competitionName}
          </p>
        </div>

        {/* Teams Row */}
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

        {/* Prediction Details or Lock */}
        {isPremium ? (
          // LOCKED STATE
          <div className="flex flex-col items-center justify-center py-4 border-t border-dashed border-white/10">
            <div className="mb-2 text-orange-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <p className="text-white font-medium text-sm">
              Tip: Upgrade to See
            </p>
          </div>
        ) : (
          // UNLOCKED STATE
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
                  {(prediction as any).odds || "1.85"}
                </p>
              </div>
              <div className="text-right">
                <span className="flex items-center gap-1 text-emerald-400 text-xs font-bold uppercase">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Pending
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer / Button Area */}
      <div className="bg-[#121212] p-3 border-t border-white/5 flex justify-center">
        <Link
          href={isPremium ? "/subscription" : `/predictions/${prediction._id}`}
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
            <span
              className={`z-10 flex items-center gap-2 ${btnTextColor} ${btnDropShadow}`}
            >
              {isPremium ? "Unlock Tip" : "View Analysis"}
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
