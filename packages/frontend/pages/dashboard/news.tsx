"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { apiClient } from "@/utils/apiClient";
import { Article } from "@/types/Article";
import Link from "next/link";
import {
  Typography,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "@material-tailwind/react";
import { Search, FileText } from "lucide-react";

export default function NewsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Polygon shape for the button (copied from your component)
  const buttonShape =
    "polygon(15px 0, 100% 0, calc(100% - 15px) 100%, 0% 100%)";

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await apiClient.getArticles();
        setArticles(data);
      } catch (err) {
        console.error("Failed to fetch articles:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Filter articles based on search
  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <ProtectedRoute allowedRoles={["user", "admin"]}>
      <DashboardLayout role="user">
        {/* ── Header Section ── */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">
            News & Analysis
          </h1>
          <p className="text-white/50 text-sm mb-6">
            Stay ahead of the game with the latest tactical breakdowns and
            football news.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-colors"
            />
          </div>
        </div>

        {/* ── Content Grid ── */}
        {loading ? (
          // Loading Skeletons
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-[400px] rounded-xl bg-[#0a0a0a] border border-white/5 animate-pulse flex flex-col"
              >
                <div className="h-44 bg-white/5 w-full" />
                <div className="p-4 flex-1">
                  <div className="h-6 bg-white/10 rounded w-3/4 mb-4" />
                  <div className="h-4 bg-white/10 rounded w-full mb-2" />
                  <div className="h-4 bg-white/10 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredArticles.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-xl bg-white/5">
            <FileText className="w-10 h-10 text-white/20 mb-4" />
            <p className="text-white/40 font-medium">No articles found.</p>
          </div>
        ) : (
          // Articles Grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
            {filteredArticles.map((article) => (
              <Card
                key={article._id}
                className="flex flex-col overflow-hidden bg-[#101010] text-white shadow-lg border border-white/5 hover:border-white/10 transition-colors h-full"
              >
                <CardHeader
                  floated={false}
                  shadow={false}
                  className="m-0 rounded-none flex-shrink-0"
                >
                  <div className="relative h-44 w-full overflow-hidden">
                    <img
                      src={article.image || "/images/news-placeholder.jpg"}
                      alt={article.title}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                    {/* Gradient Overlay for image text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#101010] to-transparent opacity-60" />
                  </div>
                </CardHeader>

                <CardBody className="flex-grow p-5">
                  <Typography
                    variant="h6"
                    className="text-white font-bold leading-tight line-clamp-2 mb-3"
                  >
                    {article.title}
                  </Typography>
                  <Typography className="text-sm text-white/60 line-clamp-3 font-normal">
                    {article.content}
                  </Typography>
                </CardBody>

                <CardFooter className="flex items-center justify-between p-5 pt-0 border-t border-white/5 mt-auto">
                  <span className="text-xs text-white/40 font-medium">
                    {new Date(article.publishedAt).toLocaleDateString(
                      undefined,
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      },
                    )}
                  </span>

                  <Link
                    href={article.sourceUrl}
                    target="_blank" // Opens external news in new tab usually
                    className="group relative inline-block transition-transform hover:scale-[1.02] active:scale-95"
                  >
                    <div
                      className="relative flex h-[32px] min-w-[110px] items-center justify-center text-[9px] font-bold uppercase tracking-widest text-white shadow-lg"
                      style={{ clipPath: buttonShape }}
                    >
                      <div className="absolute inset-0 bg-[#10b981]" />
                      <div
                        className="absolute inset-[1px] bg-[#0a0f10]"
                        style={{ clipPath: buttonShape }}
                      />
                      <span className="z-10 flex items-center gap-2 text-[#4ade80] drop-shadow-[0_0_8px_rgba(74,222,128,0.4)]">
                        Read More
                        <span className="text-[10px] font-bold">›</span>
                      </span>
                    </div>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
