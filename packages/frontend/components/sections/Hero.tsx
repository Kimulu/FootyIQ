import Link from "next/link";
import { Container } from "../layout/Container";
import { Button } from "../ui/Button";

export function Hero() {
  const buttonShape =
    "polygon(15px 0, 100% 0, calc(100% - 15px) 100%, 0% 100%)";

  return (
    <section className="relative h-screen min-h-[540px] w-full overflow-hidden bg-[#050505]">
      {/* 1. BACKGROUND IMAGE */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/hero.jpg)" }}
      />

      {/* 2. GRADIENT OVERLAYS */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#050505] via-[#050505]/70 to-transparent" />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />

      {/* 
         === DEBUG MODE: DOTS === 
         Adjust the classes below to move the dots.
         Currently 'inset-0' makes it fill the screen. 
         Try changing 'inset-0' to 'top-0 right-0 w-[50%] h-full' to restrict it to the right side.
      */}
      <div className="pointer-events-none  absolute top-[210px] right-[-2px] w-[400px] h-[400px] z-10 mix-blend-overlay">
        <img
          src="/accents/dots-overlay2.png"
          alt="Dots Pattern"
          className="h-full w-full object-cover object-right"
        />
      </div>

      {/* 4. SOFT GLOW (Finalized - No Border) */}
      <div className="pointer-events-none absolute bottom-[-50px] right-[-90px] z-20 h-[600px] w-[600px]">
        <img
          src="/accents/diagonal-glow-soft.svg"
          className="h-full w-full object-contain rotate-[-11deg] opacity-80 mix-blend-screen"
          alt="Soft Glow"
        />
      </div>

      {/* 5. SHARP LINE (Finalized - No Border) */}
      <div className="pointer-events-none absolute bottom-[-177px] right-[10px] z-20 h-[600px] w-[600px]">
        <img
          src="/accents/diagonal-glow-line.svg"
          className="h-full w-full object-contain rotate-[-10deg] drop-shadow-[0_0_20px_rgba(255,80,0,0.8)]"
          alt="Sharp Line"
        />
      </div>

      {/* 6. CONTENT */}
      <div className="relative z-30 flex h-full items-center">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl leading-[1.1]">
              Football,
              <span className="text-white"> Explained.</span>
            </h1>

            <p className="mt-6 max-w-xl text-md leading-relaxed text-white/80 md:text-md font-light">
              Tactical insights,match predictions,and smart
              <br /> football analysis-without the noise
            </p>

            <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center">
              <Button href="/tips" className="!h-[31px] !text-[11px]">
                OPEN ACCOUNT
              </Button>

              <Link
                href="/news"
                className="group relative inline-block transition-transform hover:scale-[1.02] active:scale-95"
              >
                <div
                  // UPDATED DIMENSIONS:
                  // h-[36px] (was 44)
                  // min-w-[150px] (was 190)
                  // text-[11px] (was 12)
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
                    {/* Smaller chevron to match text size */}
                    <span className="text-[10px] font-bold">›</span>
                  </span>
                </div>
              </Link>
            </div>

            <div className="mt-14 flex flex-wrap items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-white/60">
              <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-[#10b981] shadow-[0_0_6px_#10b981]" />
                UPDATED DAILY
              </span>
              <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 backdrop-blur-md">
                FREE + PREMIUM
              </span>
              <span className="relative flex items-center gap-2 rounded-full border border-[#ff5500]/30 bg-[#ff5500]/10 px-5 py-2 backdrop-blur-md text-[#ffbd9b]">
                JERSEY SHOP
                <span className="absolute inset-0 rounded-full bg-[#ff5500]/10 blur-sm" />
              </span>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
