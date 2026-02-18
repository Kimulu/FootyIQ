import { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
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
import { Container } from "../layout/Container";
import { Button } from "../ui/Button";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 640 },
    items: 3,
  },
  mobile: {
    breakpoint: { max: 640, min: 0 },
    items: 1,
  },
};

export default function ArticleCarousel() {
  const buttonShape =
    "polygon(15px 0, 100% 0, calc(100% - 15px) 100%, 0% 100%)";
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiClient.getArticles();
        setArticles(data);
      } catch (err) {
        console.error("Failed to fetch articles:", err);
      }
    };
    load();
  }, []);

  return (
    <section className="relative z-20 w-full bg-[#050505] pt-5 text-white">
      <Container>
        <h2 className="text-3xl font-bold text-white mb-2">Latest News</h2>
        <Carousel
          responsive={responsive}
          infinite
          autoPlay
          autoPlaySpeed={4000}
          arrows={false}
          showDots={false}
          // ADD THESE TWO PROPS:
          itemClass="px-2 flex" // Adds spacing between cards and makes them flex items
          containerClass="pb-5"
        >
          {articles.map((article) => (
            <Card
              key={article._id}
              // REMOVED max-w-[300px], ADDED h-full and flex-col
              className="flex h-full flex-col overflow-hidden bg-[#101010] text-white shadow-lg"
            >
              <CardHeader
                floated={false}
                shadow={false}
                className="m-0 rounded-none flex-shrink-0" // Prevents header from shrinking
              >
                <img
                  src={article.image || "/images/news-placeholder.jpg"}
                  alt={article.title}
                  className="h-44 w-full object-cover"
                />
              </CardHeader>

              {/* flex-grow makes this section fill all available space */}
              <CardBody className="flex-grow">
                <Typography variant="h6" className="text-white line-clamp-2">
                  {article.title}
                </Typography>
                <Typography className="mt-2 text-sm text-white/80 line-clamp-3">
                  {article.content}
                </Typography>
              </CardBody>

              <CardFooter className="flex items-center justify-between text-xs text-white/60 pt-0">
                <span>
                  {new Date(article.publishedAt).toLocaleDateString()}
                </span>
                <Link
                  href={article.sourceUrl}
                  className="group relative inline-block transition-transform hover:scale-[1.02] active:scale-95"
                >
                  <div
                    // UPDATED DIMENSIONS:
                    // h-[36px] (was 44)
                    // min-w-[150px] (was 190)
                    // text-[11px] (was 12)
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
                      {/* Smaller chevron to match text size */}
                      <span className="text-[10px] font-bold">›</span>
                    </span>
                  </div>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </Carousel>
      </Container>
    </section>
  );
}
