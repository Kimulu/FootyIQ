"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  Settings,
  Layers,
  Bot,
  LogOut,
  LayoutDashboard,
  Trophy,
  Newspaper,
  Home,
  ShoppingBag,
  Mail,
  ChevronRight,
  Users,
  BookOpen,
  Crown,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "../ui/Button";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNavbar({ isOpen, onClose }: Props) {
  const { user, logout } = useAuth();
  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";

  const plan = (user as any)?.subscription?.plan;
  const isPremium =
    plan === "premium" || plan === "yearly" || plan === "monthly";
  const userStatusLabel = isAdmin
    ? "Administrator"
    : isPremium
      ? "Premium"
      : "Free";

  const PUBLIC_LINKS = [
    { label: "Home", href: "/", icon: Home },
    { label: "News", href: "#latest-news", icon: Newspaper },
    { label: "Tips", href: "#match-tips", icon: Trophy },
    { label: "Contact Us", href: "/contact", icon: Mail },
    { label: "Advertise", href: "/shop", icon: ShoppingBag },
  ];

  const USER_DASHBOARD_LINKS = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Match Tips", href: "/dashboard/predictions", icon: Trophy },
    { label: "My Bets", href: "/dashboard/my-bets", icon: BookOpen },
    { label: "News & Analysis", href: "/dashboard/news", icon: Newspaper },
    { label: "Accumulators", href: "/dashboard/accumulators", icon: Layers },
    { label: "AI Predictions", href: "/dashboard/ai", icon: Bot },
    { label: "Profile", href: "/dashboard/profile", icon: User },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const ADMIN_DASHBOARD_LINKS = [
    { label: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Match Tips", href: "/admin/add-match", icon: Trophy },
    { label: "Articles", href: "/admin/articles", icon: Newspaper },
    { label: "Accumulators", href: "/admin/accumulators", icon: Layers },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ];

  const links = !isAuthenticated
    ? PUBLIC_LINKS
    : isAdmin
      ? ADMIN_DASHBOARD_LINKS
      : USER_DASHBOARD_LINKS;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-[#0a0a0a] border-l border-white/10 z-50 md:hidden flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <span className="text-xl font-extrabold tracking-[0.2em] text-white">
                {isAdmin ? "ADMIN" : "MENU"}
              </span>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {isAuthenticated && user && (
                <div className="mb-8">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-600 to-orange-800 flex items-center justify-center text-white font-bold text-lg shadow-lg overflow-hidden flex-shrink-0">
                      {(user as any)?.avatar ? (
                        <img
                          src={(user as any).avatar}
                          alt={user.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        user.username.charAt(0).toUpperCase()
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold truncate">
                        {user.username}
                      </p>
                      {/* UPDATED STATUS LABEL */}
                      <p
                        className={`text-xs font-medium uppercase tracking-wide ${isPremium ? "text-orange-400" : "text-white/50"}`}
                      >
                        {userStatusLabel}
                      </p>
                    </div>
                  </div>

                  {!isAdmin && !isPremium && (
                    <Link
                      href="/dashboard/upgrade"
                      onClick={onClose}
                      className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 shadow-lg shadow-orange-900/20 group active:scale-95 transition-transform"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-white/20 rounded-full">
                          <Crown className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-bold text-sm">
                            Upgrade to Pro
                          </p>
                          <p className="text-orange-100 text-[10px]">
                            Unlock all tips
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-white/50 group-hover:text-white" />
                    </Link>
                  )}
                </div>
              )}

              <div className="space-y-1">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={onClose}
                    className="flex items-center justify-between p-3 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <link.icon className="w-5 h-5 text-white/40 group-hover:text-orange-500 transition-colors" />
                      <span className="font-medium tracking-wide text-sm">
                        {link.label}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/40" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="p-8 border-t border-white/5 bg-[#050505]">
              {!isAuthenticated ? (
                <div className="flex flex-col gap-6 items-center justify-center w-full">
                  <Button href="/signup" className="!min-w-[210px] !px-2">
                    CREATE ACCOUNT
                  </Button>
                  <Link
                    href="/login"
                    onClick={onClose}
                    className="text-xs font-bold uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors"
                  >
                    Sign In
                  </Link>
                </div>
              ) : (
                <button
                  onClick={() => {
                    logout();
                    onClose();
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 py-3.5 rounded-xl font-bold uppercase tracking-widest text-sm transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
