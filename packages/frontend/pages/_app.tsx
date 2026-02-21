import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#050505]">
        <Component {...pageProps} />
      </div>
      <Toaster
        position="top-right"
        duration={6000}
        expand={false}
        closeButton
        visibleToasts={3}
      />
    </AuthProvider>
  );
}
