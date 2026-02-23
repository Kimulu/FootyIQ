const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Prediction = require("../models/Prediction");
const axios = require("axios");

const { resolveBetsForMatch } = require("../services/betServices");

// ── Inline auth helper ─────────────────────────────────────────────
const getUser = (req) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
    const token = authHeader.split(" ")[1];
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
};

// ── POST /api/admin/sync-fixtures ──────────────────────────────────
router.post("/sync-fixtures", async (req, res) => {
  try {
    const API_KEY = process.env.FOOTBALL_DATA_API_KEY;

    if (!API_KEY) {
      return res
        .status(500)
        .json({ message: "Missing FOOTBALL_DATA_API_KEY in .env" });
    }

    const response = await axios.get(
      "https://api.football-data.org/v4/matches?competitions=PL,PD,CL,SA,BL1,FL1,EL&status=SCHEDULED",
      { headers: { "X-Auth-Token": API_KEY } },
    );

    const matches = response.data.matches;
    let count = 0;

    for (const match of matches) {
      const matchData = {
        externalId: match.id,
        homeTeam: match.homeTeam.shortName || match.homeTeam.name,
        awayTeam: match.awayTeam.shortName || match.awayTeam.name,
        kickoffTime: match.utcDate,
        competition: match.competition.name,
        logoHome: match.homeTeam.crest,
        logoAway: match.awayTeam.crest,
      };

      const existing = await Prediction.findOne({ externalId: match.id });

      if (!existing) {
        await Prediction.create({
          ...matchData,
          prediction: "Pending Analysis",
          type: "Free",
          odds: "1.00",
        });
        count++;
      } else {
        existing.kickoffTime = match.utcDate;
        await existing.save();
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

// ── POST /api/admin/create-match ───────────────────────────────────
router.post("/create-match", async (req, res) => {
  try {
    const user = getUser(req);
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    if (user.role !== "admin")
      return res.status(403).json({ message: "Admin only" });

    const {
      homeTeam,
      awayTeam,
      competition,
      kickoffTime,
      prediction,
      odds,
      type,
      status,
      logoHome,
      logoAway,
    } = req.body;

    if (!homeTeam || !awayTeam || !competition || !kickoffTime) {
      return res.status(400).json({
        message: "homeTeam, awayTeam, competition and kickoffTime are required",
      });
    }

    const manualId = Math.floor(Math.random() * 1000000);

    const newMatch = new Prediction({
      externalId: manualId,
      homeTeam,
      awayTeam,
      competition: competition || "General",
      kickoffTime: kickoffTime || new Date(),
      prediction: prediction || "Pending Analysis",
      odds: odds || "-",
      type: type || "Free",
      status: status || "Upcoming",
      logoHome: logoHome || "https://crests.football-data.org/generic.png",
      logoAway: logoAway || "https://crests.football-data.org/generic.png",
    });

    await newMatch.save();
    res.status(201).json({ message: "Match created!", match: newMatch });
  } catch (err) {
    console.error("Manual creation failed:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// ── PATCH /api/admin/matches/:id ───────────────────────────────────
router.patch("/matches/:id", async (req, res) => {
  try {
    const user = getUser(req);
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    if (user.role !== "admin")
      return res.status(403).json({ message: "Admin only" });

    const updated = await Prediction.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true },
    );

    if (!updated) return res.status(404).json({ message: "Match not found" });

    // Auto-resolve bets when status is set to a final result
    if (["Won", "Lost", "Void"].includes(updated.status)) {
      await resolveBetsForMatch(updated._id, updated.status);
    }

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ── DELETE /api/admin/matches/:id ─────────────────────────────────
router.delete("/matches/:id", async (req, res) => {
  try {
    const user = getUser(req);
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    if (user.role !== "admin")
      return res.status(403).json({ message: "Admin only" });

    const deleted = await Prediction.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Match not found" });

    res.json({ message: "Match deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ── PATCH /api/admin/matches/:id/tip-of-day ───────────────────────
// Admin pins a prediction as Tip of the Day (only one can be active at a time)
router.patch("/matches/:id/tip-of-day", async (req, res) => {
  try {
    const user = getUser(req);
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    if (user.role !== "admin")
      return res.status(403).json({ message: "Admin only" });

    // Unpin any existing Tip of the Day first
    await Prediction.updateMany({ isTipOfDay: true }, { isTipOfDay: false });

    // Pin the new one
    const updated = await Prediction.findByIdAndUpdate(
      req.params.id,
      { isTipOfDay: true },
      { new: true },
    );

    if (!updated) return res.status(404).json({ message: "Match not found" });

    res.json({ message: "Tip of the Day updated!", match: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ── PATCH /api/admin/matches/:id/unpin-tip-of-day ─────────────────
// Admin unpins the current Tip of the Day
router.patch("/matches/:id/unpin-tip-of-day", async (req, res) => {
  try {
    const user = getUser(req);
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    if (user.role !== "admin")
      return res.status(403).json({ message: "Admin only" });

    await Prediction.findByIdAndUpdate(req.params.id, { isTipOfDay: false });
    res.json({ message: "Tip of the Day unpinned" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
