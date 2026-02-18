const mongoose = require("mongoose");

const ArticleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    publishedAt: { type: Date, required: true },
    source: { type: String, required: true },
    sourceUrl: { type: String, required: true },
    image: { type: String },
  },
  { timestamps: true },
);

module.exports =
  mongoose.models.Article || mongoose.model("Article", ArticleSchema);
