"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { Lock, Mail } from "lucide-react";

// Place fans-hero.png in /public/images/
const HERO_IMAGE = "/images/fans-hero.png";

export default function SignInPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ email, password });
      toast.success("Login Successful", {
        description: "Welcome back to FootyIQ!",
        style: { borderLeft: "4px solid #f97316" },
      });
    } catch (err: any) {
      toast.error("Access Denied", {
        description: err.message || "Invalid email or password",
        style: { borderLeft: "4px solid #ef4444" },
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#050505] overflow-hidden">
      {/* ══════════════════════════════════════
          TOP / LEFT PANEL — Fans photo
          • Mobile: top half of screen (40vh)
          • Desktop: full left half
      ══════════════════════════════════════ */}
      <div className="relative w-full h-[40vh] lg:h-auto lg:w-1/2 overflow-hidden flex-shrink-0">
        {/* Hero image */}
        <Image
          src={HERO_IMAGE}
          alt="Football fans celebrating"
          fill
          priority
          className="object-cover object-top lg:object-center"
        />

        {/* Top vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70 pointer-events-none" />

        {/* Mobile: bottom fade into page bg */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050505] lg:hidden pointer-events-none" />

        {/* Desktop: right-edge fade */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#050505] hidden lg:block pointer-events-none" />

        {/* Desktop: diagonal hard blade */}
        <div
          className="absolute right-0 top-0 h-full w-20 bg-[#050505] z-10 hidden lg:block"
          style={{ clipPath: "polygon(55% 0, 100% 0, 100% 100%, 0% 100%)" }}
        />

        {/* Mobile: logo overlay on image */}
        <div className="absolute top-6 right-6 z-20 lg:hidden">
          <img
            src="/images/logo.png"
            alt="FootyIQ"
            className="h-8 w-auto object-contain drop-shadow-lg"
          />
        </div>
      </div>

      {/* ══════════════════════════════════════
          BOTTOM / RIGHT PANEL — Sign In Form
          • Mobile: below image, fills rest of screen
          • Desktop: full right half
      ══════════════════════════════════════ */}
      <div className="w-full lg:w-1/2 flex items-center justify-center relative px-6 py-12 lg:py-16">
        {/* Soft bg glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-orange-600/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative w-full max-w-md z-10">
          {/* Desktop-only heading (mobile shows logo on image) */}
          <div className="hidden lg:block mb-10">
            <h1 className="text-3xl font-black text-white tracking-tight mb-2">
              Welcome <span className="text-orange-500">Back</span>
            </h1>
            <p className="text-white/40 text-sm">
              Sign in to access your premium predictions.
            </p>
          </div>

          {/* Mobile heading */}
          <div className="lg:hidden mb-8 text-center">
            <h1 className="text-2xl font-black text-white tracking-tight mb-1">
              Welcome <span className="text-orange-500">Back</span>
            </h1>
            <p className="text-white/40 text-sm">
              Sign in to access your premium predictions.
            </p>
          </div>

          {/* Desktop logo above heading */}
          <div className="hidden lg:block mb-6">
            <img
              src="/images/logo.png"
              alt="FootyIQ"
              className="h-9 w-auto object-contain"
            />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 mb-2">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-600 to-orange-400 rounded-lg blur opacity-0 group-focus-within:opacity-20 transition duration-300" />
                <div className="relative flex items-center">
                  <Mail className="absolute left-4 w-4 h-4 text-white/20 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#0f0f0f] border border-white/10 rounded-lg pl-11 pr-4 py-3.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[10px] text-orange-500/70 hover:text-orange-400 uppercase tracking-wider transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-600 to-orange-400 rounded-lg blur opacity-0 group-focus-within:opacity-20 transition duration-300" />
                <div className="relative flex items-center">
                  <Lock className="absolute left-4 w-4 h-4 text-white/20 pointer-events-none" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#0f0f0f] border border-white/10 rounded-lg pl-11 pr-4 py-3.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            {/* Simple orange semi-transparent button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all duration-200
                  bg-orange-500/20 border border-orange-500/40 text-orange-400
                  hover:bg-orange-500/30 hover:border-orange-500/60 hover:text-orange-300
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
                    Signing In...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="my-7 flex items-center gap-4">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-[10px] uppercase tracking-widest text-white/20">
              or
            </span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          {/* Google SSO */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 bg-[#0f0f0f] border border-white/10 rounded-lg py-3.5 text-white/70 text-sm font-medium hover:border-white/20 hover:text-white transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </button>

          {/* Sign up link */}
          <p className="mt-8 text-center text-xs text-white/30">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-orange-500 hover:text-orange-400 font-bold transition-colors"
            >
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
