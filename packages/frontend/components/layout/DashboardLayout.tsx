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
} from "lucide-react";

interface Props {
  children: React.ReactNode;
  role: "admin" | "user";
}

export function DashboardLayout({ children, role }: Props) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const USER_MENU = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Match Tips", href: "/predictions", icon: Trophy },
    { label: "News & Analysis", href: "/news", icon: Newspaper },
    { label: "Accumulators", href: "/dashboard/accumulators", icon: Layers },
    { label: "Artificial Intelligence", href: "/dashboard/ai", icon: Bot },
    { label: "Profile", href: "/dashboard/profile", icon: User },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const ADMIN_MENU = [
    { label: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Articles", href: "/admin/articles", icon: Newspaper },
    { label: "Match Tips", href: "/admin/add-match", icon: Trophy },
    { label: "Sources", href: "/admin/sources", icon: LinkIcon },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ];

  const menuItems = role === "admin" ? ADMIN_MENU : USER_MENU;

  return (
    <div className="min-h-screen bg-[#050505] flex">
      {/* ── SIDEBAR — desktop only ── */}
      <aside className="hidden md:flex w-64 border-r border-white/5 bg-[#0a0a0a] flex-col fixed h-full z-20">
        {/* Logo */}
        <div className="h-24 flex items-center justify-center border-b border-white/5">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <img
              src="/images/logo.png"
              alt="FootyIQ"
              className="h-12 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all group ${
                  isActive
                    ? "bg-orange-600/10 text-orange-500 border-l-2 border-orange-500"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 ${isActive ? "text-orange-500" : "text-white/40 group-hover:text-white transition-colors"}`}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/5">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-white/40 hover:text-red-400 hover:bg-red-500/5 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 md:ml-64">
        {/* Top Header */}
        <header className="h-16 md:h-20 border-b border-white/5 flex items-center justify-between px-4 md:px-8 bg-[#050505]/80 backdrop-blur-md sticky top-0 z-10">
          {/* Mobile: hamburger + logo */}
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

          {/* Desktop: search bar */}
          <div className="relative w-96 hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-[#121212] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-colors"
            />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4 md:gap-6">
            <button className="text-white/60 hover:text-white transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
            </button>
            <button className="text-white/60 hover:text-white transition-colors hidden md:block">
              <MessageSquare className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 md:pl-6 md:border-l md:border-white/10">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-white">
                  {user?.username || "User"}
                </p>
                <p className="text-xs text-white/50 capitalize">
                  {role === "admin" ? "Administrator" : "Pro User"}
                </p>
              </div>
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-orange-600 to-orange-800 flex items-center justify-center text-white font-bold shadow-lg border border-white/10 text-sm">
                {user?.username?.charAt(0).toUpperCase() || "U"}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 md:p-8">{children}</div>
      </main>

      {/* ── MOBILE NAVBAR DRAWER ── */}
      <MobileNavbar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </div>
  );
}
