"use client";

import { useState } from "react";
import { apiClient } from "@/utils/apiClient";
import { toast } from "sonner";
import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.forgotPassword(email);
      setSent(true);
      toast.success("Reset link sent to your email");
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl p-8">
        <Link
          href="/login"
          className="text-white/40 hover:text-white flex items-center gap-2 text-sm mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </Link>

        <h1 className="text-2xl font-bold text-white mb-2">Reset Password</h1>
        <p className="text-white/50 text-sm mb-8">
          Enter your email and we'll send you a link to reset your password.
        </p>

        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#121212] border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm text-white focus:border-orange-500 outline-none"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <button
              disabled={loading}
              className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        ) : (
          <div className="text-center py-8 bg-green-500/10 rounded-xl border border-green-500/20">
            <p className="text-green-400 font-bold mb-2">Check your inbox</p>
            <p className="text-green-400/60 text-sm px-4">
              (Since this is in dev mode, check your VS Code terminal for the
              link!)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
