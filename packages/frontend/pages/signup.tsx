"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/utils/apiClient";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { Lock, Mail, Phone, User } from "lucide-react";

// Place tunnel-hero.png in /public/images/
const HERO_IMAGE = "/images/tunnel-hero.png";

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.register(formData);
      toast.success("Account Created!", {
        description: "Redirecting you to login...",
        style: { borderLeft: "4px solid #10B981" },
      });
      setTimeout(() => router.push("/login"), 1500);
    } catch (err: any) {
      toast.error("Registration Failed", {
        description: err.message || "Registration failed. Please try again.",
        style: { borderLeft: "4px solid #ef4444" },
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col-reverse lg:flex-row bg-[#050505] overflow-hidden">
      {/* ══════════════════════════════════════
          LEFT / BOTTOM PANEL — Sign Up Form
      ══════════════════════════════════════ */}
      <div className="w-full lg:w-1/2 flex items-center justify-center relative px-0 py-12 lg:py-16">
        {/* Soft emerald glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-600/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative w-full max-w-md z-10 px-6 lg:px-12">
          {/* Desktop: logo as heading */}
          <div className="hidden lg:block mb-8">
            <img
              src="/images/logo.png"
              alt="FootyIQ"
              className="h-10 w-auto object-contain mb-3"
            />
            <p className="text-white/40 text-sm">
              Create an account to start winning today.
            </p>
          </div>

          {/* Mobile: text heading */}
          <div className="lg:hidden mb-8">
            <h1 className="text-3xl font-black text-white tracking-tight mb-2">
              Create an <span className="text-emerald-500">Account</span>
            </h1>
            <p className="text-white/40 text-sm">
              Create an account to start winning today.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 mb-2">
                Username
              </label>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-lg blur opacity-0 group-focus-within:opacity-20 transition duration-300" />
                <div className="relative flex items-center">
                  <User className="absolute left-4 w-4 h-4 text-white/20 pointer-events-none" />
                  <input
                    name="username"
                    type="text"
                    required
                    onChange={handleChange}
                    className="w-full bg-[#0f0f0f] border border-white/10 rounded-lg pl-11 pr-4 py-3.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all"
                    placeholder="WinningBettor"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 mb-2">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-lg blur opacity-0 group-focus-within:opacity-20 transition duration-300" />
                <div className="relative flex items-center">
                  <Mail className="absolute left-4 w-4 h-4 text-white/20 pointer-events-none" />
                  <input
                    name="email"
                    type="email"
                    required
                    onChange={handleChange}
                    className="w-full bg-[#0f0f0f] border border-white/10 rounded-lg pl-11 pr-4 py-3.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 mb-2">
                Phone Number (M-Pesa)
              </label>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-lg blur opacity-0 group-focus-within:opacity-20 transition duration-300" />
                <div className="relative flex items-center">
                  <Phone className="absolute left-4 w-4 h-4 text-white/20 pointer-events-none" />
                  <input
                    name="phoneNumber"
                    type="tel"
                    onChange={handleChange}
                    className="w-full bg-[#0f0f0f] border border-white/10 rounded-lg pl-11 pr-4 py-3.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all"
                    placeholder="0712345678"
                  />
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 mb-2">
                Password
              </label>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-lg blur opacity-0 group-focus-within:opacity-20 transition duration-300" />
                <div className="relative flex items-center">
                  <Lock className="absolute left-4 w-4 h-4 text-white/20 pointer-events-none" />
                  <input
                    name="password"
                    type="password"
                    required
                    onChange={handleChange}
                    className="w-full bg-[#0f0f0f] border border-white/10 rounded-lg pl-11 pr-4 py-3.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            {/* Submit button — semi-transparent emerald, no polygon */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all duration-200
                  bg-emerald-500/20 border border-emerald-500/40 text-emerald-400
                  hover:bg-emerald-500/30 hover:border-emerald-500/60 hover:text-emerald-300
                  active:scale-[0.99]
                  ${loading ? "opacity-60 cursor-not-allowed" : ""}
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
                    Creating Account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>
            </div>
          </form>

          {/* Sign in link */}
          <p className="mt-7 text-center text-xs text-white/30">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-emerald-500 hover:text-emerald-400 font-bold transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════
          RIGHT / TOP PANEL — Tunnel image
          • Mobile: top of screen (40vh)
          • Desktop: full right half
      ══════════════════════════════════════ */}
      <div className="relative w-full h-[40vh] lg:h-auto lg:w-[50%] lg:min-w-0 overflow-hidden flex-shrink-0">
        {/* Desktop image — cropped portrait version */}
        <Image
          src="/images/tunnel-hero-desktop.png"
          alt="Football player in tunnel"
          fill
          priority
          className="object-cover object-left hidden lg:block"
        />

        {/* Mobile image — original wide version */}
        <Image
          src="/images/tunnel-hero.png"
          alt="Football player in tunnel"
          fill
          priority
          className="object-cover object-center lg:hidden"
        />

        {/* Top vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

        {/* Mobile: bottom fade into page bg */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050505] lg:hidden pointer-events-none" />

        {/* Desktop: left-edge fade into form panel */}
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#050505] hidden lg:block pointer-events-none" />

        {/* Desktop: diagonal hard blade on left edge */}
        <div
          className="absolute left-0 top-0 h-full w-20 bg-[#050505] z-10 hidden lg:block"
          style={{ clipPath: "polygon(0 0, 45% 0, 100% 100%, 0 100%)" }}
        />

        {/* Mobile: logo top-LEFT over image */}
        <div className="absolute top-6 left-6 z-20 lg:hidden">
          <img
            src="/images/logo.png"
            alt="FootyIQ"
            className="h-8 w-auto object-contain drop-shadow-lg"
          />
        </div>
      </div>
    </div>
  );
}
