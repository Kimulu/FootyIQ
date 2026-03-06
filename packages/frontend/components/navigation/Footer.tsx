"use client";

import Link from "next/link";
import { Container } from "../layout/Container";

export function Footer() {
  return (
    <footer className="relative w-full bg-[#050505] pt-20 pb-8 overflow-hidden">
      {/* --- Ambient Background Glow (Bottom Right) --- */}
      <div className="absolute bottom-0 right-0 w-[600px] h-[300px] bg-orange-600/10 blur-[100px] rounded-full pointer-events-none" />

      <Container>
        {/* Changed grid from lg:grid-cols-5 to lg:grid-cols-4 for better spacing since we removed socials */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          {/* --- Column 1: Brand & Logo --- */}
          <div className="lg:col-span-1 pr-0 lg:pr-10">
            <Link
              href="/"
              className="inline-block mb-6 transition-opacity hover:opacity-80"
            >
              <img
                src="/images/logo.png"
                alt="FootyIQ"
                className="h-12 w-auto object-contain"
              />
            </Link>
            <p className="text-white/50 text-sm leading-relaxed">
              Smart football analysis and match tips without the noise. Elevate
              your betting strategy with data-driven insights.
            </p>
          </div>

          {/* --- Column 2: Explore --- */}
          <div>
            <h4 className="text-white text-base font-semibold mb-6">Explore</h4>
            <ul className="space-y-3">
              <FooterLink href="/news" label="News & Analysis" />
              <FooterLink href="/predictions" label="Match Tips" />
              <FooterLink href="/dashboard/accumulators" label="Accumulators" />
            </ul>
          </div>

          {/* --- Column 3: Support --- */}
          <div>
            <h4 className="text-white text-base font-semibold mb-6">Support</h4>
            <ul className="space-y-3">
              <FooterLink href="/contact" label="Contact Us" />
              {/* Placeholder for future help center */}
              <li className="text-white/30 text-sm cursor-not-allowed">
                Help Center (Coming Soon)
              </li>
            </ul>
          </div>

          {/* --- Column 4: Legal --- */}
          <div>
            <h4 className="text-white text-base font-semibold mb-6">Legal</h4>
            <ul className="space-y-3">
              <FooterLink href="/terms" label="Terms of Service" />
              <FooterLink href="/privacy" label="Privacy Policy" />
            </ul>
          </div>
        </div>

        {/* --- Divider Line with Gradient --- */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-orange-500/50 to-transparent mb-8" />

        {/* --- Copyright Section --- */}
        <div className="text-center">
          <p className="text-white/40 text-sm">
            &copy; {new Date().getFullYear()} FootyIQ. All rights reserved.
          </p>
        </div>

        {/* --- Built With Love --- */}
        <div className="mt-2 text-center">
          <p className="text-[10px] uppercase tracking-widest text-white/20 font-mono">
            Built with <span className="text-red-500 animate-pulse">❤</span> in
            Nairobi
          </p>
        </div>
      </Container>
    </footer>
  );
}

// --- Helper Components ---

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link
        href={href}
        className="text-white/50 text-sm hover:text-orange-500 hover:pl-1 transition-all duration-200"
      >
        {label}
      </Link>
    </li>
  );
}
