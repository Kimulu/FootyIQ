import ArticleCarousel from "@/components/sections/ArticleCarousel";
import { PublicLayout } from "../components/layout/PublicLayout";
import { Hero } from "../components/sections/Hero";
import { useAuth } from "@/context/AuthContext";
import { PredictionSection } from "@/components/sections/PredictionSection";
import { NewsletterSection } from "@/components/sections/NewsLetterSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/dist/client/components/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If not loading and user exists, redirect immediately
    if (!isLoading && user) {
      if (user.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/dashboard");
      }
    }
  }, [user, isLoading, router]);

  // 1. Show Loading Spinner while checking auth state
  //    This prevents the "Flash" of the landing page content
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
      </div>
    );
  }

  // 2. If User is logged in, render nothing (while the router.push happens)
  if (user) {
    return null;
  }

  return (
    <PublicLayout>
      <main>
        <Hero />
        <ArticleCarousel />
        <PredictionSection />
        <NewsletterSection />
        <PricingSection />
        {/* Next sections here */}
        {/* Pricing */}
      </main>
    </PublicLayout>
  );
}
