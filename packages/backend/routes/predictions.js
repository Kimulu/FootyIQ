const express = require("express");
const Prediction = require("../models/Prediction");

const router = express.Router();

// GET /api/predictions
router.get("/", async (req, res) => {
  try {
    const predictions = await Prediction.find()
      .sort({ kickoffTime: 1 })
      .limit(20);

    console.log(
      `DEBUG: Sending ${predictions.length} predictions to frontend.`,
    );

    res.set("Cache-Control", "no-store");
    res.json(predictions);
  } catch (err) {
    console.error("Failed to fetch predictions:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/predictions/tip-of-day
// ⚠️ MUST be before /:id — otherwise Express treats "tip-of-day" as an ID
router.get("/tip-of-day", async (req, res) => {
  try {
    const tip = await Prediction.findOne({ isTipOfDay: true });
    if (!tip) return res.status(404).json({ message: "No Tip of the Day set" });
    res.json(tip);
  } catch (err) {
    console.error(err);
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
