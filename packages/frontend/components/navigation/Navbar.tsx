"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "../layout/Container";
import { Button } from "../ui/Button";
import { Menu } from "lucide-react"; // Hamburger Icon
import { MobileNavbar } from "@/components/layout/MobileNavbar";

const NAV = [
  { label: "HOME", href: "/" },
  { label: "NEWS", href: "#latest-news" },
  { label: "TIPS", href: "#match-tips" }, // Fixed link to match your structure
  { label: "CONTACT US", href: "/contact" },
];

function isActive(pathname: string, href: string) {
  return pathname === href || (pathname.startsWith(href + "/") && href !== "/");
}

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="relative z-50 w-full bg-[#050505]">
        <div className="relative border-b border-white/5">
          {/* Bottom Glow Line */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0">
            <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-[#FF4800] to-transparent opacity-60" />
          </div>

          <Container>
            <div className="flex h-20 items-center justify-between">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2 z-20">
                <img
                  src="/images/logo.png"
                  alt="FootyIQ"
                  className="h-8 w-auto object-contain"
                />
              </Link>

              {/* DESKTOP Navigation */}
              <nav className="hidden h-full items-center gap-12 md:flex">
                {NAV.map((item) => {
                  const active = isActive(pathname, item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`group relative flex h-full items-center justify-center text-[13px] font-bold uppercase tracking-[0.1em] transition-colors duration-300 ${
                        active ? "text-white" : "text-white/60 hover:text-white"
                      }`}
                      style={{ fontFamily: '"Inter", sans-serif' }}
                    >
                      <span className="relative z-10">{item.label}</span>
                      {active && (
                        <span className="absolute bottom-0 left-1/2 z-20 h-[3px] w-[140%] -translate-x-1/2 bg-[#FF4800]" />
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Right Side Actions */}
              <div className="flex items-center gap-6">
                {/* Desktop Sign In */}
                <Link
                  href="/login"
                  className="hidden text-[13px] font-medium text-white/70 hover:text-white md:inline transition-colors"
                >
                  Sign In
                </Link>

                <div className="hidden md:block">
                  <Button href="/signup">GET TIPS</Button>
                </div>

                {/* MOBILE HAMBURGER BUTTON */}
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="md:hidden p-2 text-white/60 hover:text-white transition-colors"
                >
                  <Menu className="w-6 h-6" />
                </button>
              </div>
            </div>
          </Container>
        </div>
      </header>

      {/* MOBILE MENU COMPONENT */}
      <MobileNavbar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
}
