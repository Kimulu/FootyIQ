const express = require("express");
const Prediction = require("../models/Prediction");

const router = express.Router();

// GET /api/predictions
// Returns upcoming matches sorted by date
router.get("/", async (req, res) => {
  try {
    // Get current date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const predictions = await Prediction.find({
      kickoffTime: { $gte: today }, // Only show future/today's games
    })
      .sort({ kickoffTime: 1 }) // Earliest games first
      .limit(20); // Increased limit since we might have many fixtures

    res.json(predictions);
  } catch (err) {
    console.error("Failed to fetch predictions:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/predictions/:id
// Get single prediction details
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
