"use client";

import Link from "next/link";
import Image from "next/image";
import { Container } from "../layout/Container";
import { Button } from "../ui/Button";

export function Hero() {
  const buttonShape =
    "polygon(15px 0, 100% 0, calc(100% - 15px) 100%, 0% 100%)";

  return (
    <section className="relative w-full overflow-hidden bg-[#050505]">
      {/* 
        ══════════════════════════════════════
        MOBILE LAYOUT (Flex Column) 
        ══════════════════════════════════════ 
      */}
      <div className="flex flex-col lg:hidden min-h-screen">
        {/* 1. MOBILE IMAGE SECTION */}
        <div className="relative w-full h-[50vh] flex-shrink-0">
          <Image
            src="/images/hero.jpg"
            alt="Football Hero"
            fill
            priority
            // Shift image slightly to right to center action on mobile
            className="object-cover object-[75%_center]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#050505] z-10" />
        </div>

        {/* 2. MOBILE CONTENT SECTION */}
        <div className="flex-1 relative z-30 px-6 -mt-16 pb-20 bg-gradient-to-b from-transparent to-[#050505]">
          <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-orange-600/10 blur-[60px] rounded-full pointer-events-none" />

          <div className="relative z-20 pt-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-white leading-[1.1] drop-shadow-md">
              Bet
              <span className="text-white"> Smarter.</span>
            </h1>

            <p className="mt-4 text-sm leading-relaxed text-white/80 font-light drop-shadow-md">
              Tactical insights, match predictions, and smart football
              analysis—without the noise.
            </p>

            {/* --- UPDATED BUTTONS SECTION (Side by Side) --- */}
            <div className="mt-8 flex flex-row items-center gap-3 w-full">
              {/* Button 1: Open Account */}
              <div className="flex-1">
                <Button
                  href="/tips"
                  // Made smaller (h-36px) and smaller text to fit side-by-side
                  className="!h-[36px] !text-[10px] !w-full justify-center shadow-xl !px-0"
                >
                  OPEN ACCOUNT
                </Button>
              </div>

              {/* Button 2: Explore News */}
              <div className="flex-1">
                <Link
                  href="/news"
                  className="group relative block w-full active:scale-95"
                >
                  <div
                    // Adjusted dimensions for side-by-side layout
                    className="relative flex h-[36px] w-full items-center justify-center text-[10px] font-bold uppercase tracking-widest text-white shadow-lg"
                    style={{ clipPath: buttonShape }}
                  >
                    <div className="absolute inset-0 bg-[#10b981]" />
                    <div
                      className="absolute inset-[1px] bg-[#0a0f10]"
                      style={{ clipPath: buttonShape }}
                    />
                    <span className="z-10 flex items-center gap-2 text-[#4ade80] drop-shadow-[0_0_8px_rgba(74,222,128,0.4)]">
                      NEWS
                      <span className="text-[10px] font-bold">›</span>
                    </span>
                  </div>
                </Link>
              </div>
            </div>

            {/* Mobile Badges */}
            <div className="mt-10 flex flex-wrap gap-3 text-[9px] font-bold uppercase tracking-widest text-white/60">
              <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-[#10b981] shadow-[0_0_6px_#10b981]" />
                UPDATED DAILY
              </span>
              <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-md">
                FREE + PREMIUM
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 
        ══════════════════════════════════════
        DESKTOP LAYOUT (Unchanged)
        ══════════════════════════════════════ 
      */}
      <div className="hidden lg:block relative h-screen min-h-[600px] w-full">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/images/hero.jpg)" }}
        />

        <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#050505] via-[#050505]/70 to-transparent" />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />

        <div className="pointer-events-none absolute top-[210px] right-[-2px] w-[400px] h-[400px] z-10 mix-blend-overlay">
          <img
            src="/accents/dots-overlay2.png"
            alt="Dots Pattern"
            className="h-full w-full object-cover object-right"
          />
        </div>
        <div className="pointer-events-none absolute bottom-[-50px] right-[-90px] z-20 h-[600px] w-[600px]">
          <img
            src="/accents/diagonal-glow-soft.svg"
            className="h-full w-full object-contain rotate-[-11deg] opacity-80 mix-blend-screen"
            alt="Soft Glow"
          />
        </div>
        <div className="pointer-events-none absolute bottom-[-177px] right-[10px] z-20 h-[600px] w-[600px]">
          <img
            src="/accents/diagonal-glow-line.svg"
            className="h-full w-full object-contain rotate-[-10deg] drop-shadow-[0_0_20px_rgba(255,80,0,0.8)]"
            alt="Sharp Line"
          />
        </div>

        <div className="relative z-30 flex h-full items-center">
          <Container>
            <div className="max-w-3xl">
              <h1 className="text-4xl font-extrabold tracking-tight text-white leading-[1.1]">
                Bet
                <span className="text-white"> Smarter.</span>
              </h1>

              <p className="mt-6 max-w-xl text-md leading-relaxed text-white/80 font-light">
                Tactical insights,match predictions,and smart
                <br /> football analysis-without the noise
              </p>

              <div className="mt-10 flex items-center gap-6">
                <Button href="/tips" className="!h-[31px] !text-[11px]">
                  OPEN ACCOUNT
                </Button>

                <Link
                  href="/news"
                  className="group relative inline-block transition-transform hover:scale-[1.02] active:scale-95"
                >
                  <div
                    className="relative flex h-[36px] min-w-[150px] items-center justify-center text-[11px] font-bold uppercase tracking-widest text-white shadow-lg"
                    style={{ clipPath: buttonShape }}
                  >
                    <div className="absolute inset-0 bg-[#10b981]" />
                    <div
                      className="absolute inset-[1px] bg-[#0a0f10]"
                      style={{ clipPath: buttonShape }}
                    />
                    <span className="z-10 flex items-center gap-2 text-[#4ade80] drop-shadow-[0_0_8px_rgba(74,222,128,0.4)]">
                      EXPLORE NEWS
                      <span className="text-[10px] font-bold">›</span>
                    </span>
                  </div>
                </Link>
              </div>

              <div className="mt-14 flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-white/60">
                <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 backdrop-blur-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#10b981] shadow-[0_0_6px_#10b981]" />
                  UPDATED DAILY
                </span>
                <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 backdrop-blur-md">
                  FREE + PREMIUM
                </span>
                <span className="relative flex items-center gap-2 rounded-full border border-[#ff5500]/30 bg-[#ff5500]/10 px-5 py-2 backdrop-blur-md text-[#ffbd9b]">
                  ANALYTICS-DRIVEN
                  <span className="absolute inset-0 rounded-full bg-[#ff5500]/10 blur-sm" />
                </span>
              </div>
            </div>
          </Container>
        </div>
      </div>
    </section>
  );
}
