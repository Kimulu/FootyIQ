"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiClient } from "@/utils/apiClient";
import { toast } from "sonner";
import { Lock } from "lucide-react";

function ResetForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) return toast.error("Passwords do not match");

    setLoading(true);
    try {
      await apiClient.resetPassword({ email, token, newPassword: password });
      toast.success("Password updated!");
      router.push("/login");
    } catch (err: any) {
      toast.error(err.message || "Failed to reset");
    } finally {
      setLoading(false);
    }
  };

  if (!token || !email)
    return <p className="text-white text-center">Invalid Link</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">
          New Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#121212] border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm text-white focus:border-orange-500 outline-none"
          />
        </div>
      </div>
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">
          Confirm Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          <input
            type="password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full bg-[#121212] border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm text-white focus:border-orange-500 outline-none"
          />
        </div>
      </div>
      <button
        disabled={loading}
        className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-lg transition-colors disabled:opacity-50"
      >
        {loading ? "Updating..." : "Set New Password"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-white mb-6">New Password</h1>
        <Suspense fallback={<p className="text-white/50">Loading...</p>}>
          <ResetForm />
        </Suspense>
      </div>
    </div>
  );
}
