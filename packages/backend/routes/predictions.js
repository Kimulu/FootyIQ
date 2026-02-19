const express = require("express");
const Prediction = require("../models/Prediction");

const router = express.Router();

// GET /api/predictions
router.get("/", async (req, res) => {
  try {
    // DEBUGGING MODE: Fetch ALL games, no date filter.
    // We sort by kickoffTime (1 = Ascending/Oldest to Newest, -1 = Newest to Oldest)
    // Let's use -1 for now so you see the most recent data added if they are past dates.
    const predictions = await Prediction.find()
      .sort({ kickoffTime: 1 })
      .limit(20);

    console.log(
      `DEBUG: Sending ${predictions.length} predictions to frontend.`,
    );

    // Disable caching to force browser to get fresh data
    res.set("Cache-Control", "no-store");

    res.json(predictions);
  } catch (err) {
    console.error("Failed to fetch predictions:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/predictions/:id
router.get("/:id", async (req, res) => {
  try {
    const prediction = await Prediction.findById(req.params.id);
    if (!prediction) return res.status(404).json({ message: "Not found" });
    res.json(prediction);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
