"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MobileNavbar } from "@/components/layout/MobileNavbar";
import {
  LayoutDashboard,
  Newspaper,
  Trophy,
  Layers,
  Bot,
  User,
  Settings,
  Link as LinkIcon,
  LogOut,
  Search,
  Bell,
  MessageSquare,
  Users,
  Menu,
  BookOpen,
  Crown,
} from "lucide-react";

interface Props {
  children: React.ReactNode;
  role: "admin" | "user";
}

export function DashboardLayout({ children, role }: Props) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // LOGIC: Determine Display Role
  const plan = (user as any)?.subscription?.plan;
  const isPremium =
    plan === "premium" || plan === "yearly" || plan === "monthly";
  const userStatusLabel =
    role === "admin" ? "Administrator" : isPremium ? "Premium" : "Free";

  // ... (Menus remain same as previous) ...
  // ── Core tip-focused links — what users come here for ─────────────
  const USER_CORE = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Match Tips", href: "/dashboard/predictions", icon: Trophy },
    { label: "My Bets", href: "/dashboard/my-bets", icon: BookOpen },
    { label: "News & Analysis", href: "/dashboard/news", icon: Newspaper },
    { label: "Accumulators", href: "/dashboard/accumulators", icon: Layers },
    { label: "AI Predictions", href: "/dashboard/ai", icon: Bot },
  ];

  // ── Secondary links — tucked below a divider, quietly available ───
  const USER_SECONDARY = [
    { label: "Profile", href: "/dashboard/profile", icon: User },
    { label: "Community", href: "/dashboard/community", icon: Users },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const ADMIN_MENU = [
    { label: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Articles", href: "/admin/articles", icon: Newspaper },
    { label: "Match Tips", href: "/admin/matches", icon: Trophy },
    { label: "Sources", href: "/admin/sources", icon: LinkIcon },
    { label: "Accumulators", href: "/admin/accumulators", icon: Layers },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ];

  const NavLink = ({
    href,
    label,
    icon: Icon,
  }: {
    href: string;
    label: string;
    icon: any;
  }) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all group ${
          isActive
            ? "bg-orange-600/10 text-orange-500 border-l-2 border-orange-500"
            : "text-white/50 hover:bg-white/5 hover:text-white"
        }`}
      >
        <Icon
          className={`w-4 h-4 flex-shrink-0 ${
            isActive
              ? "text-orange-500"
              : "text-white/30 group-hover:text-white transition-colors"
          }`}
        />
        {label}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-[#050505] flex">
      {/* ── SIDEBAR — desktop ── */}
      <aside className="hidden md:flex w-64 border-r border-white/5 bg-[#0a0a0a] flex-col fixed h-full z-20">
        <div className="h-20 flex items-center justify-center border-b border-white/5 px-6">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <img
              src="/images/logo.png"
              alt="FootyIQ"
              className="h-10 w-auto object-contain"
            />
          </Link>
        </div>

        <nav className="flex-1 py-6 px-4 overflow-y-auto flex flex-col gap-1">
          {role === "admin" ? (
            ADMIN_MENU.map((item) => <NavLink key={item.href} {...item} />)
          ) : (
            <>
              {USER_CORE.map((item) => (
                <NavLink key={item.href} {...item} />
              ))}
              <div className="my-3 border-t border-white/5" />
              {USER_SECONDARY.map((item) => (
                <NavLink key={item.href} {...item} />
              ))}
            </>
          )}
        </nav>

        {!isPremium && role === "user" && (
          <div className="px-4 mb-4">
            <Link
              href="/dashboard/upgrade"
              className="block p-4 rounded-xl bg-gradient-to-br from-orange-600/20 to-orange-900/10 border border-orange-500/30 group hover:border-orange-500/50 transition-all"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white shadow-lg">
                  <Crown className="w-4 h-4" />
                </div>
                <span className="text-white font-bold text-sm">Go Premium</span>
              </div>
              <p className="text-orange-200/60 text-[10px] leading-relaxed mb-3">
                Unlock high-odds tips and AI predictions.
              </p>
              <div className="w-full py-2 bg-orange-600 group-hover:bg-orange-500 text-white text-[10px] font-bold uppercase tracking-widest rounded text-center transition-colors">
                Upgrade
              </div>
            </Link>
          </div>
        )}

        <div className="p-4 border-t border-white/5">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-white/30 hover:text-red-400 hover:bg-red-500/5 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="flex-1 md:ml-64">
        <header className="h-16 md:h-20 border-b border-white/5 flex items-center justify-between px-4 md:px-8 bg-[#050505]/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-white/60 hover:text-white transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <Link href="/">
              <img
                src="/images/logo.png"
                alt="FootyIQ"
                className="h-7 w-auto object-contain"
              />
            </Link>
          </div>

          <div className="relative w-96 hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-[#121212] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-colors"
            />
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <button className="text-white/60 hover:text-white transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
            </button>
            <button className="text-white/60 hover:text-white transition-colors hidden md:block">
              <MessageSquare className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 md:pl-6 md:border-l md:border-white/10">
              {/* UPDATED USER STATUS DISPLAY */}
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-white">
                  {user?.username || "User"}
                </p>
                <p
                  className={`text-xs capitalize ${isPremium ? "text-orange-400 font-bold" : "text-white/50"}`}
                >
                  {userStatusLabel}
                </p>
              </div>
              <Link href="/dashboard/profile">
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-orange-600 to-orange-800 flex items-center justify-center text-white font-bold shadow-lg border border-white/10 text-sm cursor-pointer hover:opacity-80 transition-opacity overflow-hidden">
                  {(user as any)?.avatar ? (
                    <img
                      src={(user as any).avatar}
                      alt={user?.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    user?.username?.charAt(0).toUpperCase() || "U"
                  )}
                </div>
              </Link>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8">{children}</div>
      </main>

      <MobileNavbar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </div>
  );
}
