import { PublicLayout } from "../components/layout/PublicLayout";
import { Hero } from "../components/sections/Hero";

export default function HomePage() {
  return (
    <PublicLayout>
      <main>
        <Hero />
        {/* Next sections here */}
      </main>
    </PublicLayout>
  );
}
