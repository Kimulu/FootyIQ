const express = require("express");
const Prediction = require("../../models/Prediction");
const dummyPredictions = require("../../data/dummyPredictions");

const router = express.Router();

router.post("/seed-predictions", async (req, res) => {
  try {
    await Prediction.deleteMany({});
    const result = await Prediction.insertMany(dummyPredictions);
    res.json({ message: "Dummy predictions seeded", count: result.length });
  } catch (err) {
    console.error(err);
    res.status(500).send("Seeding failed");
  }
});

module.exports = router;
