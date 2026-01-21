import React from "react";

export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "orange" | "green" | "blue";
}) {
  const map: Record<string, string> = {
    neutral: "bg-white/10 text-[var(--text)]",
    orange: "bg-[color:var(--accent)]/15 text-[var(--accent)]",
    green: "bg-[color:var(--accent2)]/15 text-[var(--accent2)]",
    blue: "bg-[#3ABEFF]/15 text-[#3ABEFF]",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${map[tone]}`}
    >
      {children}
    </span>
  );
}
