import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
      <Toaster
        position="top-right" // Comes from right
        duration={6000} // 6 Seconds (Slower)
        expand={false}
        closeButton
        visibleToasts={3}
        // We remove styling here to handle it fully in CSS for better animation control
      />
    </AuthProvider>
  );
}
