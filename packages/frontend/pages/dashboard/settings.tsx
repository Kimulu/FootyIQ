"use client";

import { useState, useEffect } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { apiClient } from "@/utils/apiClient";
import { toast } from "sonner";
import {
  Save,
  User,
  MapPin,
  Link as LinkIcon,
  Image as ImageIcon,
  Shield,
  CreditCard,
  Bell,
  Trash2,
  Lock,
  Crown,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { user, refreshUser, logout } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile"); // profile | security | billing

  // Profile Form State
  const [formData, setFormData] = useState({
    username: "",
    phoneNumber: "",
    bio: "",
    location: "",
    avatar: "",
    banner: "",
  });

  // Password Form State
  const [passData, setPassData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        phoneNumber: (user as any).phoneNumber || "",
        bio: (user as any).bio || "",
        location: (user as any).location || "",
        avatar: (user as any).avatar || "",
        banner: (user as any).banner || "",
      });
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePassChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassData({ ...passData, [e.target.name]: e.target.value });
  };

  // ── SAVE PROFILE ──
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.updateProfile(formData);
      toast.success("Profile updated successfully!");
      if (refreshUser) await refreshUser();
    } catch (err) {
      toast.error("Failed to save changes");
    } finally {
      setLoading(false);
    }
  };

  // ── CHANGE PASSWORD ──
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passData.newPassword !== passData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await apiClient.changePassword({
        oldPassword: passData.oldPassword,
        newPassword: passData.newPassword,
      });
      toast.success("Password changed successfully");
      setPassData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      toast.error(err.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  // ── DELETE ACCOUNT ──
  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure? This action cannot be undone and you will lose your betting history.",
    );
    if (!confirmed) return;

    try {
      await apiClient.deleteAccount();
      toast.success("Account deleted");
      logout();
    } catch (err) {
      toast.error("Failed to delete account");
    }
  };

  const isPremium =
    (user as any)?.subscription?.plan === "premium" ||
    (user as any)?.subscription?.plan === "yearly";

  return (
    <ProtectedRoute allowedRoles={["user", "admin"]}>
      <DashboardLayout role={user?.role === "admin" ? "admin" : "user"}>
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Settings</h1>
            <p className="text-white/50 text-sm">
              Manage your account, subscription, and security.
            </p>
          </div>

          {/* ── TABS ── */}
          <div className="flex gap-4 mb-8 border-b border-white/10 pb-1">
            {["profile", "security", "subscription"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${
                  activeTab === tab
                    ? "text-orange-500 border-orange-500"
                    : "text-white/40 border-transparent hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* ════════════════════════════════════════════════════
             TAB: PROFILE
          ════════════════════════════════════════════════════ */}
          {activeTab === "profile" && (
            <form onSubmit={handleSaveProfile} className="space-y-8">
              {/* Visuals */}
              <div className="bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden">
                <div className="p-6 border-b border-white/5">
                  <h3 className="text-lg font-bold text-white">Visuals</h3>
                  <p className="text-white/40 text-xs mt-1">
                    Paste image URLs to update your look.
                  </p>
                </div>
                {/* Visuals */}
                <div className="bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden">
                  <div className="p-6 border-b border-white/5">
                    <h3 className="text-lg font-bold text-white">Visuals</h3>
                    <p className="text-white/40 text-xs mt-1">
                      Paste image URLs to update your look.
                    </p>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* ── BANNER SECTION ── */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">
                        Banner Image URL
                      </label>
                      <div className="relative">
                        <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <input
                          name="banner"
                          value={formData.banner}
                          onChange={handleChange}
                          placeholder="https://..."
                          className="w-full bg-[#121212] border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm text-white focus:border-orange-500 outline-none"
                        />
                      </div>

                      {/* ✅ PREVIEW RESTORED HERE */}
                      <div className="mt-4 h-32 w-full rounded-lg bg-white/5 border border-white/5 overflow-hidden relative">
                        {formData.banner ? (
                          <img
                            src={formData.banner}
                            alt="Banner Preview"
                            className="w-full h-full object-cover"
                            onError={(e) =>
                              (e.currentTarget.style.display = "none")
                            } // Hide if broken link
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-white/20 text-xs uppercase font-bold tracking-widest">
                            No Banner Set
                          </div>
                        )}
                      </div>
                    </div>

                    {/* ── AVATAR SECTION ── */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">
                        Avatar Image URL
                      </label>
                      <div className="flex items-center gap-6">
                        <div className="relative flex-1">
                          <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                          <input
                            name="avatar"
                            value={formData.avatar}
                            onChange={handleChange}
                            placeholder="https://..."
                            className="w-full bg-[#121212] border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm text-white focus:border-orange-500 outline-none"
                          />
                        </div>
                        <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 overflow-hidden flex-shrink-0">
                          {formData.avatar ? (
                            <img
                              src={formData.avatar}
                              className="w-full h-full object-cover"
                              alt="Avatar Preview"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/20">
                              <User className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal Info */}
              <div className="bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden">
                <div className="p-6 border-b border-white/5">
                  <h3 className="text-lg font-bold text-white">
                    Personal Details
                  </h3>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">
                      Username
                    </label>
                    <input
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-orange-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">
                      Phone
                    </label>
                    <input
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-orange-500 outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows={3}
                      className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-orange-500 outline-none resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  disabled={loading}
                  className="flex items-center gap-2 px-8 py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold uppercase tracking-widest rounded-lg shadow-lg shadow-orange-900/20 disabled:opacity-50"
                >
                  {loading ? (
                    "Saving..."
                  ) : (
                    <>
                      <Save className="w-4 h-4" /> Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* ════════════════════════════════════════════════════
             TAB: SUBSCRIPTION
          ════════════════════════════════════════════════════ */}
          {activeTab === "subscription" && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-[#0a0a0a] to-[#111] border border-white/10 rounded-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 blur-[80px] rounded-full pointer-events-none" />

                <div className="p-8 relative z-10">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        Current Plan:{" "}
                        <span
                          className={
                            isPremium ? "text-orange-500" : "text-white/60"
                          }
                        >
                          {isPremium ? "Premium" : "Free Tier"}
                        </span>
                      </h3>
                      <p className="text-white/50 text-sm mt-2 max-w-md">
                        {isPremium
                          ? "You have full access to all predictions, AI insights, and tactical analysis."
                          : "You are currently on the limited free plan. Upgrade to unlock all premium tips and AI predictions."}
                      </p>
                    </div>
                    {isPremium ? (
                      <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center text-orange-500">
                        <Crown className="w-6 h-6" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-white/30">
                        <User className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                    {isPremium ? (
                      <div className="text-white/40 text-xs">
                        Renews on:{" "}
                        <span className="text-white font-bold">Automatic</span>
                      </div>
                    ) : (
                      <div className="text-white/40 text-xs">
                        Missing out on{" "}
                        <span className="text-white font-bold">85% wins</span>{" "}
                        accuracy
                      </div>
                    )}

                    {isPremium ? (
                      <button className="text-white/40 hover:text-white text-sm font-medium underline decoration-white/20">
                        Manage Subscription
                      </button>
                    ) : (
                      <button
                        onClick={() => router.push("/pricing")} // Redirect to pricing page
                        className="px-6 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold uppercase tracking-widest text-xs rounded-lg shadow-lg shadow-orange-900/20"
                      >
                        Upgrade to Premium
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Notification Preferences (Mock for now) */}
              <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-white/40" /> Notifications
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium text-sm">
                        Email Alerts
                      </p>
                      <p className="text-white/30 text-xs">
                        Get daily digests of top tips
                      </p>
                    </div>
                    <div className="w-10 h-5 bg-orange-600/20 rounded-full relative cursor-not-allowed">
                      <div className="absolute right-1 top-1 w-3 h-3 bg-orange-500 rounded-full" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium text-sm">
                        SMS Alerts (Kenya Only)
                      </p>
                      <p className="text-white/30 text-xs">
                        Instant M-Pesa payment confirmations
                      </p>
                    </div>
                    <div className="w-10 h-5 bg-white/10 rounded-full relative cursor-not-allowed">
                      <div className="absolute left-1 top-1 w-3 h-3 bg-white/30 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════
             TAB: SECURITY
          ════════════════════════════════════════════════════ */}
          {activeTab === "security" && (
            <div className="space-y-8">
              {/* Change Password */}
              <div className="bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden">
                <div className="p-6 border-b border-white/5">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Lock className="w-5 h-5 text-white/40" /> Change Password
                  </h3>
                </div>
                <form onSubmit={handleChangePassword} className="p-6 space-y-6">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="oldPassword"
                      value={passData.oldPassword}
                      onChange={handlePassChange}
                      className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-orange-500 outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passData.newPassword}
                        onChange={handlePassChange}
                        className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-orange-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passData.confirmPassword}
                        onChange={handlePassChange}
                        className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-orange-500 outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      disabled={loading}
                      className="px-6 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-sm rounded-lg transition-colors"
                    >
                      {loading ? "Updating..." : "Update Password"}
                    </button>
                  </div>
                </form>
              </div>

              {/* Danger Zone */}
              <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-red-500/10 rounded-lg">
                    <Trash2 className="w-6 h-6 text-red-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-red-500">
                      Delete Account
                    </h3>
                    <p className="text-red-400/60 text-sm mt-1">
                      Permanently delete your account and all betting history.
                      This action cannot be undone.
                    </p>
                  </div>
                  <button
                    onClick={handleDeleteAccount}
                    className="px-6 py-2.5 bg-red-500 text-white font-bold text-sm rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
