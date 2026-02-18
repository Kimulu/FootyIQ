const mongoose = require("mongoose");
const Parser = require("rss-parser");
const dotenv = require("dotenv");
const slugify = require("slugify");
const Article = require("../models/Articles");

const parser = new Parser();

dotenv.config();

const PORT = process.env.PORT || 5000;

async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
}

async function fetchAndStoreArticles() {
  try {
    await connectToDatabase();

    const feed = await parser.parseURL("https://www.skysports.com/rss/12040");
    const articles = feed.items?.slice(0, 5) || [];

    console.log(`📰 Fetched ${articles.length} articles from Sky Sports`);

    for (const item of articles) {
      const slug = slugify(item.title || "", { lower: true, strict: true });

      const exists = await Article.findOne({ slug });
      if (exists) continue;

      await Article.create({
        title: item.title,
        content: item.contentSnippet || "",
        slug,
        publishedAt: new Date(item.pubDate || new Date()),
        source: "Sky Sports",
        sourceUrl: item.link,
        image: "/images/news-placeholder.jpg", // fallback image
      });

      console.log(`✅ Stored article: ${item.title}`);
    }

    console.log("🎉 All new articles saved.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error syncing articles:", err);
    process.exit(1);
  }
}

fetchAndStoreArticles();
