import ArticleCarousel from "@/components/sections/ArticleCarousel";
import { PublicLayout } from "../components/layout/PublicLayout";
import { Hero } from "../components/sections/Hero";
import { PredictionSection } from "@/components/sections/PredictionSection";
import { NewsletterSection } from "@/components/sections/NewsLetterSection";
import { PricingSection } from "@/components/sections/PricingSection";

export default function HomePage() {
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
