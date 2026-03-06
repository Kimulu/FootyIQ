"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { apiClient } from "@/utils/apiClient";
import { useAuth } from "@/context/AuthContext";
import { Check, Crown, Zap, Shield } from "lucide-react";
import { toast } from "sonner";

export default function UpgradePage() {
  const { user } = useAuth();

  const handlePayment = async (plan: "daily" | "monthly" | "yearly") => {
    try {
      toast.loading("Initializing secure payment via Paystack...");

      // Call the backend to get the Paystack URL
      const paystackUrl = await apiClient.initializePayment(plan);

      // Redirect user to Paystack (M-Pesa/Card)
      window.location.href = paystackUrl;
    } catch (err: any) {
      toast.dismiss();
      toast.error(err.message || "Payment initialization failed");
    }
  };

  return (
    <ProtectedRoute allowedRoles={["user", "admin"]}>
      <DashboardLayout role="user">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-black text-white mb-4">
              Unlock <span className="text-orange-500">Winning Insights</span>
            </h1>
            <p className="text-white/50 max-w-2xl mx-auto">
              Get instant access to AI Confidence scores, high-odds
              Accumulators, and our expert Premium Tips.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* ── DAILY PLAN ── */}
            <PlanCard
              title="Daily Pass"
              price="50"
              period="/day"
              features={[
                "Today's Premium Tips",
                "Single Day Access",
                "Basic Support",
              ]}
              color="emerald"
              onClick={() => handlePayment("daily")}
            />

            {/* ── MONTHLY PLAN (Highlighted) ── */}
            <PlanCard
              title="Monthly Pro"
              price="500"
              period="/mo"
              features={[
                "All Daily Premium Tips",
                "AI Confidence Scores",
                "Accumulator Access",
                "Full 30-Day Access",
              ]}
              color="orange"
              isPopular
              onClick={() => handlePayment("monthly")}
            />

            {/* ── YEARLY PLAN ── */}
            <PlanCard
              title="Yearly Elite"
              price="5,400"
              period="/yr"
              features={[
                "Everything in Monthly",
                "2 Months Free (Save 10%)",
                "VIP Support",
                "Priority Updates",
              ]}
              color="orange"
              discount="-10% OFF"
              onClick={() => handlePayment("yearly")}
            />
          </div>

          <div className="mt-12 text-center">
            <p className="text-white/30 text-xs flex items-center justify-center gap-2">
              <Shield className="w-3 h-3" /> Secure payment via Paystack (M-Pesa
              & Card supported)
            </p>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

// ── SUB-COMPONENT: Plan Card ──
function PlanCard({
  title,
  price,
  period,
  features,
  color,
  isPopular,
  discount,
  onClick,
}: any) {
  const isOrange = color === "orange";

  return (
    <div
      className={`relative flex flex-col p-1 rounded-2xl bg-[#0a0a0a] border transition-all duration-300 ${
        isPopular
          ? "scale-105 shadow-2xl border-orange-500/40 z-10"
          : "border-white/10 hover:-translate-y-2"
      }`}
    >
      {isPopular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-600 to-orange-500 text-white text-[10px] font-bold px-4 py-1 uppercase tracking-widest rounded-full shadow-[0_0_15px_rgba(249,115,22,0.4)] z-20 whitespace-nowrap border border-orange-400/50">
          Most Popular
        </div>
      )}

      {/* Gradient Top */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r ${isOrange ? "from-orange-600 to-orange-400" : "from-emerald-600 to-emerald-400"}`}
      />

      <div className="p-8 flex flex-col h-full bg-[#0c0c0c]/80 backdrop-blur-sm rounded-xl">
        <div className="mb-6">
          <h3
            className={`text-sm font-bold uppercase tracking-widest mb-2 ${isOrange ? "text-orange-500" : "text-emerald-500"}`}
          >
            {title}
          </h3>
          <div className="flex items-baseline gap-1">
            <span className="text-white/60 text-lg">KSh</span>
            <span className="text-4xl font-black text-white tracking-tight">
              {price}
            </span>
            <span className="text-white/40 text-sm">{period}</span>
          </div>
          {discount && (
            <span className="inline-block mt-2 text-[10px] font-bold text-white bg-emerald-600/20 text-emerald-400 px-2 py-0.5 rounded">
              {discount}
            </span>
          )}
        </div>

        <div className="h-px w-full bg-white/10 mb-6" />

        <ul className="space-y-4 mb-8 flex-grow">
          {features.map((feat: string, i: number) => (
            <li
              key={i}
              className="flex items-start gap-3 text-sm text-white/70"
            >
              <Check
                className={`w-4 h-4 flex-shrink-0 ${isOrange ? "text-orange-500" : "text-emerald-500"}`}
              />
              {feat}
            </li>
          ))}
        </ul>

        <button
          onClick={onClick}
          className={`w-full py-4 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${isOrange ? "bg-orange-600 hover:bg-orange-500 text-white shadow-lg shadow-orange-900/20" : "bg-white/5 hover:bg-white/10 text-white border border-white/10"}`}
        >
          {isOrange ? "Upgrade Now" : "Get Started"}
        </button>
      </div>
    </div>
  );
}
