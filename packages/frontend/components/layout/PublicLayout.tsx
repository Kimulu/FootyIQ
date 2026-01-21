import React from "react";
import { Navbar } from "../navigation/Navbar";
import { Footer } from "../navigation/Footer";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
