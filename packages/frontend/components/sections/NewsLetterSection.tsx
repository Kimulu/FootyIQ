"use client";

import { useState } from "react";
import { Container } from "../layout/Container";
import { Target, Search, Tag, Lock } from "lucide-react"; // Make sure you have lucide-react installed

export function NewsletterSection() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter logic here
    console.log("Subscribing:", email);
  };

  return (
    <section className="relative w-full overflow-hidden bg-[#050505] py-20">
      {/* --- Ambient Background Glows --- */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-orange-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-orange-900/10 blur-[100px] rounded-full pointer-events-none" />

      <Container>
        {/* --- Header Section --- */}
        <div className="mx-auto max-w-3xl text-center mb-12">
          <h2 className="mb-4 text-3xl md:text-4xl font-bold tracking-wide text-white">
            Ready to Elevate Your{" "}
            <span className="text-orange-500">Football IQ?</span>
          </h2>
          <p className="text-white/60 text-sm md:text-base leading-relaxed">
            Subscribe now to get premium tips, in-depth analysis, and exclusive
            offers straight to your inbox.
          </p>
        </div>

        {/* --- Subscription Form --- */}
        <div className="mx-auto max-w-xl mb-20">
          <form
            onSubmit={handleSubmit}
            className="relative flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-grow group">
              {/* Input Glow Effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-600 to-orange-400 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-200" />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="relative w-full bg-[#0f0f0f] text-white placeholder-white/30 border border-white/10 rounded-lg px-5 py-4 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all"
                required
              />
            </div>

            <button
              type="submit"
              className="relative px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-500 rounded-lg text-white font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(234,88,12,0.3)] hover:shadow-[0_0_30px_rgba(234,88,12,0.5)] hover:-translate-y-0.5 transition-all duration-300"
            >
              Subscribe
            </button>
          </form>

          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-white/40">
            <Lock className="w-3 h-3" />
            <span>We respect your privacy and will never spam you.</span>
          </div>
        </div>

        {/* --- Feature Cards Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Target className="w-8 h-8 text-orange-500" />}
            title="Exclusive Tips"
            description="Get access to premium, high-accuracy match tips manually curated by experts."
            actionText="View Analysis"
          />
          <FeatureCard
            icon={<Search className="w-8 h-8 text-orange-500" />}
            title="In-Depth Analysis"
            description="Receive detailed tactical breakdowns and expert insights before kickoff."
            actionText="View Analysis"
          />
          <FeatureCard
            icon={<Tag className="w-8 h-8 text-orange-500" />}
            title="Special Offers"
            description="Enjoy special offers and early access to new features and betting tools."
            actionText="Locked Tip"
            isLocked
          />
        </div>
      </Container>
    </section>
  );
}

// --- Sub-Component for the Cards ---
function FeatureCard({
  icon,
  title,
  description,
  actionText,
  isLocked = false,
}: any) {
  // Polygon shape matching your other components
  const buttonShape =
    "polygon(15px 0, 100% 0, calc(100% - 15px) 100%, 0% 100%)";

  return (
    <div className="group relative flex flex-col items-center text-center p-8 bg-[#0a0a0a] border border-white/5 rounded-2xl hover:border-orange-500/30 transition-colors duration-300">
      {/* Hover Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />

      {/* Icon with Glow */}
      <div className="relative mb-6 p-4 rounded-full bg-orange-500/10 shadow-[0_0_15px_rgba(249,115,22,0.1)] group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>

      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-white/60 text-sm leading-relaxed mb-8">
        {description}
      </p>

      {/* Footer / Fake Button Area */}
      <div className="mt-auto w-full flex justify-center opacity-80 group-hover:opacity-100 transition-opacity">
        <div
          className="relative flex h-[32px] min-w-[140px] items-center justify-center text-[10px] font-bold uppercase tracking-widest text-orange-400/80"
          style={{ clipPath: buttonShape }}
        >
          {/* Border Effect */}
          <div className="absolute inset-0 bg-orange-500/30" />
          <div
            className="absolute inset-[1px] bg-[#0a0a0a]"
            style={{ clipPath: buttonShape }}
          />

          <span className="z-10 flex items-center gap-2">
            {actionText}
            {isLocked && <Lock className="w-3 h-3" />}
          </span>
        </div>
      </div>
    </div>
  );
}
