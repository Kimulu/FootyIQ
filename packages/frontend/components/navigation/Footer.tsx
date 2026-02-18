"use client";

import Link from "next/link";
import { Container } from "../layout/Container";
import { Twitter, Facebook, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative w-full bg-[#050505] pt-20 pb-8 overflow-hidden">
      {/* --- Ambient Background Glow (Bottom Right) --- */}
      <div className="absolute bottom-0 right-0 w-[600px] h-[300px] bg-orange-600/10 blur-[100px] rounded-full pointer-events-none" />

      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
          {/* --- Column 1: Brand & Logo --- */}
          <div className="lg:col-span-2 pr-0 lg:pr-10">
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
            <p className="text-white/50 text-sm leading-relaxed max-w-sm">
              Smart football analysis and match tips without the noise. Elevate
              your betting strategy with data-driven insights.
            </p>
          </div>

          {/* --- Column 2: Quick Links --- */}
          <div>
            <h4 className="text-white text-base font-semibold mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <FooterLink href="/news" label="News" />
              <FooterLink href="/tips" label="Tips" />
              <FooterLink href="/fixtures" label="Fixtures" />
            </ul>
          </div>

          {/* --- Column 3: Resources --- */}
          <div>
            <h4 className="text-white text-base font-semibold mb-6">
              Resources
            </h4>
            <ul className="space-y-3">
              <FooterLink href="/about" label="About Us" />
              <FooterLink href="/contact" label="Contact" />
              <FooterLink href="/faq" label="FAQs" />
            </ul>
          </div>

          {/* --- Column 4: Legal --- */}
          <div>
            <h4 className="text-white text-base font-semibold mb-6">Legal</h4>
            <ul className="space-y-3">
              <FooterLink href="/terms" label="Terms of Service" />
              <FooterLink href="/privacy" label="Privacy Policy" />
              <FooterLink href="/cookies" label="Cookie Policy" />
            </ul>
          </div>

          {/* --- Column 5: Follow Us --- */}
          <div className="lg:col-span-1">
            <h4 className="text-white text-base font-semibold mb-6">
              Follow Us
            </h4>
            <div className="flex items-center gap-4">
              <SocialLink href="#" icon={<Twitter className="w-5 h-5" />} />
              <SocialLink href="#" icon={<Facebook className="w-5 h-5" />} />
              <SocialLink href="#" icon={<Youtube className="w-5 h-5" />} />
            </div>
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

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 text-white/60 hover:bg-orange-500 hover:text-white hover:scale-110 transition-all duration-300"
    >
      {icon}
    </a>
  );
}
