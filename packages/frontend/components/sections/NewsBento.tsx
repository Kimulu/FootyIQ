import Link from "next/link";
import { useEffect, useState } from "react";
import { Container } from "../layout/Container";
import { Badge } from "../ui/Badge";

function formatAge(iso: string) {
  const ms = Date.now() - new Date(iso).getTime();
  const mins = Math.max(1, Math.floor(ms / 60000));
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const d = Math.floor(hrs / 24);
  return `${d}d ago`;
}

export function NewsBento() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const res = await fetch("http://localhost:5000/api/articles");

        if (!res.ok) {
          if (res.status === 204) {
            console.warn("🟡 No articles in DB.");
            setArticles([]);
          } else {
            throw new Error("Server error");
          }
        } else {
          const data = await res.json();
          setArticles(data);
        }
      } catch (err) {
        console.error("❌ Failed to fetch news:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, []);

  if (loading) {
    return (
      <section className="py-16 text-center text-white/50">
        <Container>Fetching the latest football news...</Container>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 text-center text-red-400">
        <Container>
          Something went wrong loading news. Try again later.
        </Container>
      </section>
    );
  }

  if (articles.length === 0) {
    return (
      <section className="py-16 text-center text-white/50">
        <Container>No fresh news at the moment. Check back later!</Container>
      </section>
    );
  }

  const [featured, ...rest] = articles;

  return (
    <section className="relative py-16">
      <Container>
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-sm font-semibold tracking-[0.18em] text-white/60">
              LATEST FOOTBALL INTELLIGENCE
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">
              Fresh news, without the noise.
            </h2>
          </div>

          <Link
            href="/news"
            className="hidden text-sm font-semibold text-white/70 hover:text-white md:inline"
          >
            View all →
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-12">
          {/* Featured Article */}
          <Link
            href={`/news/${featured.slug}`}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 md:col-span-7"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-[rgba(255,106,0,0.10)]" />
            <div className="absolute inset-0 opacity-[0.10] [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.25)_1px,transparent_0)] [background-size:14px_14px]" />

            <div className="relative p-7">
              <div className="flex items-center justify-between gap-4">
                <Badge tone="blue">NEWS</Badge>
                <span className="text-xs font-semibold text-white/50">
                  {formatAge(featured.publishedAt)}
                </span>
              </div>

              <h3 className="mt-5 text-2xl font-extrabold leading-snug tracking-tight md:text-3xl">
                {featured.title}
              </h3>

              <p className="mt-3 max-w-xl text-sm text-white/70 md:text-base">
                {featured.content?.slice(0, 150)}...
              </p>

              <div className="mt-6 flex items-center justify-between">
                <span className="text-sm font-semibold text-white/60">
                  {featured.source}
                </span>
                <span className="text-sm font-semibold text-[var(--accent)]">
                  Read →
                </span>
              </div>
            </div>

            <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
              <div className="absolute inset-0 bg-[rgba(255,106,0,0.06)]" />
              <div className="absolute -bottom-10 left-1/2 h-16 w-2/3 -translate-x-1/2 bg-[rgba(255,106,0,0.20)] blur-2xl" />
            </div>
          </Link>

          {/* Smaller Articles */}
          <div className="grid gap-6 md:col-span-5">
            {rest.slice(0, 3).map((a) => (
              <Link
                key={a.slug}
                href={`/news/${a.slug}`}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <div className="flex items-center justify-between gap-4">
                  <Badge tone="blue">NEWS</Badge>
                  <span className="text-xs font-semibold text-white/50">
                    {formatAge(a.publishedAt)}
                  </span>
                </div>

                <h4 className="mt-4 text-lg font-extrabold leading-snug">
                  {a.title}
                </h4>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs font-semibold text-white/60">
                    {a.source}
                  </span>
                  <span className="text-xs font-semibold text-white/60 group-hover:text-[var(--accent)]">
                    Open →
                  </span>
                </div>

                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-[rgba(255,106,0,0.55)]" />
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 md:hidden">
          <Link
            href="/news"
            className="text-sm font-semibold text-white/70 hover:text-white"
          >
            View all news →
          </Link>
        </div>

        <p className="mt-6 text-xs text-white/45">
          Updated on a schedule (morning, afternoon, evening) to limit external
          calls.
        </p>
      </Container>
    </section>
  );
}
