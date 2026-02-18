const express = require("express");
const router = express.Router();
const newsController = require("../controllers/newsController");

// Route to sync and save news articles from BBC RSS feed
router.post("/sync", newsController.syncNews);
router.get("/", newsController.getArticles);

module.exports = router;
