const Parser = require("rss-parser");
const slugify = require("slugify");
const Article = require("../models/Articles");

const parser = new Parser({
  customFields: {
    item: [
      ["media:thumbnail", "thumbnail"], // Maps <media:thumbnail> to item.thumbnail
    ],
  },
});

// @route POST /api/news/sync
// @desc Fetch and store fresh news from BBC RSS feed
// @access Public or Private (optional)
exports.syncNews = async (req, res) => {
  try {
    const feed = await parser.parseURL(
      "https://feeds.bbci.co.uk/sport/football/rss.xml",
    );
    const articles = feed.items?.slice(0, 10) || [];

    if (!articles.length) {
      return res
        .status(404)
        .json({ message: "No articles found in the RSS feed." });
    }

    let savedCount = 0;

    for (const item of articles) {
      const slug = slugify(item.title || "", { lower: true, strict: true });

      const exists = await Article.findOne({ slug });
      if (exists) continue;

      // FIX: Access the attribute through the "$" property
      const imageUrl =
        item.thumbnail?.$?.url || "/images/news-placeholdersssss.jpg";

      await Article.create({
        title: item.title?.trim() || "Untitled",
        content: item.contentSnippet || item.description || "",
        slug,
        publishedAt: new Date(item.pubDate || Date.now()),
        source: "BBC Sport",
        sourceUrl: item.link,
        image: imageUrl,
      });

      savedCount++;
    }

    return res.status(201).json({
      message: "✅ News sync complete.",
      totalFetched: articles.length,
      newArticlesSaved: savedCount,
    });
  } catch (err) {
    console.error("❌ Error syncing news:", err.message);
    return res.status(500).json({ message: "Server error syncing news." });
  }
};

exports.getArticles = async (req, res) => {
  try {
    const articles = await Article.find().sort({ publishedAt: -1 }).limit(10);
    res.status(200).json(articles);
  } catch (err) {
    console.error("❌ Error fetching articles:", err.message);
    res.status(500).json({ message: "Server error fetching articles." });
  }
};
