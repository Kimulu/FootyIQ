import Link from "next/link";
import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
}

export function Button({
  children,
  href,
  onClick,
  className = "",
}: ButtonProps) {
  // The Parallelogram Shape
  const buttonShape =
    "polygon(15px 0, 100% 0, calc(100% - 15px) 100%, 0% 100%)";

  // The 60/40 Split Gradient
  const gradientStyle = `linear-gradient(115deg, 
    #FF6200 0%, 
    #FF6200 70%, 
    #CC3300 70.1%, 
    #CC3300 100%
  )`;

  // The inner visual content of the button
  const InnerContent = () => (
    <div
      className={`relative flex h-[31px] min-w-[170px] items-center text-[13px] font-bold uppercase tracking-widest text-white shadow-[0_4px_20px_rgba(255,85,0,0.25)] ${className}`}
      style={{
        clipPath: buttonShape,
        background: gradientStyle,
      }}
    >
      {/* LEFT ZONE: Text (60%) */}
      {/* pl-4 offsets the left slant visually */}
      <div className="flex h-full w-[70%] items-center justify-center pl-1">
        <span className="z-10 whitespace-nowrap drop-shadow-sm">
          {children}
        </span>
      </div>

      {/* RIGHT ZONE: Arrow (40%) */}
      {/* pr-4 offsets the right slant visually */}
      <div className="flex h-full w-[30%] items-center justify-center pr-4">
        <span className="text-lg font-black leading-none opacity-90 transition-transform group-hover:translate-x-1">
          ›
        </span>
      </div>

      {/* Glass Reflection (Top Half) */}
      <div className="absolute inset-x-0 top-0 h-2/5 w-full bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
    </div>
  );

  // Wrapper classes for hover effects
  const wrapperClass =
    "group relative inline-block transition-transform hover:scale-[1.02] active:scale-95";

  // Render as Link if href exists, otherwise as button
  if (href) {
    return (
      <Link href={href} className={wrapperClass}>
        <InnerContent />
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={wrapperClass}>
      <InnerContent />
    </button>
  );
}
