const express = require("express");
const Article = require("../models/Articles");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const articles = await Article.find().sort({ publishedAt: 1 }).limit(20);

    if (!articles || articles.length === 0) {
      return res.status(204).json({ message: "No articles found." });
    }

    console.log(`📰 Fetched ${articles.length} articles from DB`);
    res.status(200).json(articles);
  } catch (err) {
    console.error("❌ Failed to fetch articles:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
