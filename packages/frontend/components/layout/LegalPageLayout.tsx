import { PublicLayout } from "@/components/layout/PublicLayout";
import { Container } from "@/components/layout/Container";

export function LegalPageLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <PublicLayout>
      <section className="pt-32 pb-20 bg-[#050505] min-h-screen">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">{title}</h1>
            <div className="prose prose-invert prose-orange max-w-none text-white/70">
              {children}
            </div>
          </div>
        </Container>
      </section>
    </PublicLayout>
  );
}
