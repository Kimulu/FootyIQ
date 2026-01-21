import React from "react";

export function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 md:px-10">{children}</div>
  );
}
