const express = require("express");
const router = express.Router();
const Prediction = require("../models/Prediction");
const axios = require("axios"); // You might need to run: npm install axios

// ROUTE: POST /api/admin/sync-fixtures
// Desc: Fetches fixtures from Football-Data.org and saves them to DB
router.post("/sync-fixtures", async (req, res) => {
  try {
    const API_KEY = process.env.FOOTBALL_DATA_API_KEY;

    if (!API_KEY) {
      return res
        .status(500)
        .json({ message: "Missing FOOTBALL_DATA_API_KEY in .env" });
    }

    // 1. Fetch matches for specific competitions (PL = Premier League, PD = La Liga, etc.)
    // We request matches scheduled for the next 3 days
    const response = await axios.get(
      "https://api.football-data.org/v4/matches?competitions=PL,PD,CL,SA,BL1,FL1,EL&status=SCHEDULED",
      {
        headers: { "X-Auth-Token": API_KEY },
      },
    );

    const matches = response.data.matches;
    let count = 0;

    // 2. Loop through matches and upsert (update if exists, insert if new)
    for (const match of matches) {
      const matchData = {
        externalId: match.id,
        homeTeam: match.homeTeam.shortName || match.homeTeam.name,
        awayTeam: match.awayTeam.shortName || match.awayTeam.name,
        kickoffTime: match.utcDate,
        competition: match.competition.name,
        logoHome: match.homeTeam.crest,
        logoAway: match.awayTeam.crest,
        // We do NOT overwrite 'prediction', 'type', or 'odds' if they already exist
      };

      // Check if match exists
      const existing = await Prediction.findOne({ externalId: match.id });

      if (!existing) {
        // Create new
        await Prediction.create({
          ...matchData,
          prediction: "Pending Analysis", // Default placeholder
          type: "Free",
          odds: "1.00",
        });
        count++;
      } else {
        // Optional: Update kickoff time or logos if they changed, but don't touch your prediction
        existing.kickoffTime = match.utcDate;
        existing.save();
      }
    }

    res.json({
      success: true,
      message: `Synced successfully. Added ${count} new matches.`,
    });
  } catch (err) {
    console.error("Sync Error:", err.message);
    res
      .status(500)
      .json({ message: "Failed to sync fixtures", error: err.message });
  }
});

// ROUTE: PUT /api/admin/update-tip/:id
// Desc: Allows you to update the prediction/odds/type for a specific match
router.put("/update-tip/:id", async (req, res) => {
  try {
    const { prediction, odds, type, status } = req.body;

    const updated = await Prediction.findByIdAndUpdate(
      req.params.id,
      { prediction, odds, type, status },
      { new: true },
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});

router.post("/create-match", async (req, res) => {
  try {
    const {
      homeTeam,
      awayTeam,
      competition,
      kickoffTime,
      prediction,
      odds,
      type,
      status,
      logoHome, // <--- Extract from body
      logoAway, // <--- Extract from body
    } = req.body;

    // Generate a random ID since we don't have an external API ID
    const manualId = Math.floor(Math.random() * 1000000);

    const newMatch = new Prediction({
      externalId: manualId,
      homeTeam,
      awayTeam,
      competition: competition || "General",
      kickoffTime: kickoffTime || new Date(),
      prediction: prediction || "Pending",
      odds: odds || "-",
      type: type || "Free",
      status: status || "Pending",
      // Use provided logos OR fallback to generic shield
      logoHome: logoHome || "https://crests.football-data.org/generic.png",
      logoAway: logoAway || "https://crests.football-data.org/generic.png",
    });

    await newMatch.save();
    res
      .status(201)
      .json({ message: "Match created manually!", match: newMatch });
  } catch (err) {
    console.error("Manual creation failed:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

module.exports = router;
