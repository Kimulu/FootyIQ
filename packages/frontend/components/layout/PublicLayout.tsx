import React from "react";
import { Navbar } from "../navigation/Navbar";
import { Footer } from "../navigation/Footer";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#050505]">{children}</main>
      <Footer />
    </>
  );
}
