"use client";

import { Container } from "../layout/Container";
import { Check, Star, Zap } from "lucide-react";
import Link from "next/link";

export function PricingSection() {
  return (
    <section className="relative w-full bg-[#050505] py-24 overflow-hidden">
      {/* --- Ambient Background Glows --- */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-orange-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-600/5 blur-[120px] rounded-full pointer-events-none" />

      <Container>
        {/* --- Header --- */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-wide text-white mb-4">
            Choose Your <span className="text-orange-500">Winning Plan</span>
          </h2>
          <p className="text-white/60 text-sm md:text-base">
            Unlock premium football insights and elevate your match tips
            experience today.
          </p>
        </div>

        {/* --- Pricing Cards Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* 1. DAILY PLAN (Green Theme) */}
          <PricingCard
            title="Daily Pass"
            price="50"
            period="/day"
            description="Perfect for match-day specific tips."
            accentColor="emerald"
            features={[
              "Access to Today's Premium Tips",
              "Basic Match Analysis",
              "Single Day Access",
              "Standard Support",
            ]}
            buttonText="Get Daily Access"
            icon={<Zap className="w-5 h-5 text-emerald-400" />}
          />

          {/* 2. MONTHLY PLAN (Orange Theme) */}
          <PricingCard
            title="Monthly Pro"
            price="500"
            period="/mo"
            description="Serious bettors choice for consistency."
            accentColor="orange"
            isPopular={true}
            features={[
              "All Daily Premium Tips",
              "In-Depth Tactical Analysis",
              "Early Access to Picks",
              "Full 30-Day Access",
              "Priority Support",
            ]}
            buttonText="Get Monthly Access"
          />

          {/* 3. YEARLY PLAN (Orange Theme + Discount) */}
          <PricingCard
            title="Yearly Elite"
            price="5,400"
            originalPrice="6,000" // 500 * 12
            period="/yr"
            description="Best value. Save 10% on your subscription."
            accentColor="orange"
            isBestValue={true}
            features={[
              "Everything in Monthly",
              "~2 Months Free (10% Off)",
              "Exclusive Telegram Channel",
              "Betting Strategy Guide",
              "VIP Support",
            ]}
            buttonText="Get Yearly Access"
          />
        </div>
      </Container>
    </section>
  );
}

// --- Sub-Component for the Card ---
interface PricingCardProps {
  title: string;
  price: string;
  period: string;
  features: string[];
  description: string;
  accentColor: "emerald" | "orange";
  buttonText: string;
  originalPrice?: string;
  isPopular?: boolean;
  isBestValue?: boolean;
  icon?: React.ReactNode;
}

function PricingCard({
  title,
  price,
  period,
  features,
  description,
  accentColor,
  buttonText,
  originalPrice,
  isPopular,
  isBestValue,
}: PricingCardProps) {
  // Logic to determine colors
  const isOrange = accentColor === "orange";

  // Theme Colors
  const mainColor = isOrange ? "text-orange-500" : "text-emerald-500";
  const glowShadow = isOrange
    ? "shadow-[0_0_20px_rgba(234,88,12,0.15)]"
    : "shadow-[0_0_20px_rgba(16,185,129,0.15)]";
  const borderColor = isOrange
    ? "group-hover:border-orange-500/50"
    : "group-hover:border-emerald-500/50";
  const checkColor = isOrange ? "text-orange-500" : "text-emerald-500";

  // --- BUTTON STYLES (Copied from PredictionCard) ---
  const buttonShape =
    "polygon(15px 0, 100% 0, calc(100% - 15px) 100%, 0% 100%)";
  const btnBgColor = isOrange ? "bg-orange-500" : "bg-[#10b981]";
  const btnTextColor = isOrange ? "text-orange-400" : "text-[#4ade80]";
  const btnDropShadow = isOrange
    ? "drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]"
    : "drop-shadow-[0_0_8px_rgba(74,222,128,0.4)]";

  return (
    <div
      className={`group relative flex flex-col p-1 rounded-2xl bg-[#0a0a0a] border border-white/10 transition-all duration-300 ${borderColor} ${isPopular ? "scale-[1.02] shadow-2xl border-orange-500/40" : "hover:-translate-y-2 hover:shadow-xl"}`}
    >
      {/* Top Gradient Line */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${isOrange ? "from-orange-600 to-orange-400" : "from-emerald-600 to-emerald-400"} rounded-t-2xl opacity-80`}
      />

      {/* Badges */}
      {isPopular && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-orange-600 text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest rounded-full shadow-lg z-10">
          Most Popular
        </div>
      )}
      {isBestValue && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#F59E0B] text-black text-[10px] font-bold px-3 py-1 uppercase tracking-widest rounded-full shadow-lg z-10 flex items-center gap-1">
          <Star className="w-3 h-3 fill-black" /> Best Value
        </div>
      )}

      <div className="p-8 flex flex-col h-full bg-[#0c0c0c]/80 backdrop-blur-sm rounded-xl">
        {/* Card Header */}
        <div className="mb-6">
          <h3
            className={`text-sm font-bold uppercase tracking-widest mb-2 ${mainColor}`}
          >
            {title}
          </h3>
          <div className="flex items-baseline gap-1">
            <span className="text-white/60 text-lg">KSh</span>
            <span className="text-4xl font-bold text-white tracking-tight">
              {price}
            </span>
            <span className="text-white/40 text-sm">{period}</span>
          </div>

          {/* Discount Logic */}
          {originalPrice && (
            <div className="mt-1 flex items-center gap-2">
              <span className="text-white/30 text-sm line-through decoration-orange-500/50">
                KSh {originalPrice}
              </span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded">
                -10% OFF
              </span>
            </div>
          )}

          <p className="mt-4 text-white/50 text-sm leading-relaxed">
            {description}
          </p>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />

        {/* Features */}
        <ul className="space-y-4 mb-8 flex-grow">
          {features.map((feature, idx) => (
            <li
              key={idx}
              className="flex items-start gap-3 text-sm text-white/80"
            >
              <Check className={`w-5 h-5 flex-shrink-0 ${checkColor}`} />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        {/* --- BUTTON SECTION (Using Exact Style) --- */}
        <div className="mt-auto flex justify-center pt-2">
          <Link
            href="/subscription"
            className="group/btn relative inline-block transition-transform hover:scale-[1.02] active:scale-95"
          >
            <div
              // Using h-[32px] and the exact structure from PredictionCard
              // Added min-w-[140px] (slightly wider than 110px) to fit "Get Yearly Access" text
              className="relative flex h-[32px] min-w-[150px] items-center justify-center text-[9px] font-bold uppercase tracking-widest text-white shadow-lg"
              style={{ clipPath: buttonShape }}
            >
              {/* Outer Border Color (Dynamic) */}
              <div className={`absolute inset-0 ${btnBgColor}`} />

              {/* Inner Black Background */}
              <div
                className="absolute inset-[1px] bg-[#0a0f10]"
                style={{ clipPath: buttonShape }}
              />

              {/* Text and Arrow */}
              <span
                className={`z-10 flex items-center gap-2 ${btnTextColor} ${btnDropShadow}`}
              >
                {buttonText}
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
