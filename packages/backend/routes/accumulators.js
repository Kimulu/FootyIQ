const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Accumulator = require("../models/Accumulator");
const BetSlip = require("../models/BetSlip"); // Ensure capitalization matches your file
const User = require("../models/User");

// ── Auth Helper ────────────────────────────────────────────────────
const getUser = (req) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
    const token = authHeader.split(" ")[1];
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
};

// ── GET ALL (Public/Client) ────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const accas = await Accumulator.find()
      .populate("predictions")
      .sort({ createdAt: -1 });
    res.json(accas);
  } catch (err) {
    console.error("Get Accas Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// ── CREATE ACCUMULATOR (Admin Only) ────────────────────────────────
router.post("/", async (req, res) => {
  try {
    const user = getUser(req);
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    if (user.role !== "admin")
      return res.status(403).json({ message: "Admin only" });

    const { title, matchIds, totalOdds } = req.body;

    const newAcca = new Accumulator({
      title,
      predictions: matchIds,
      totalOdds,
      status: "Upcoming",
    });

    await newAcca.save();
    res.status(201).json(newAcca);
  } catch (err) {
    console.error("Create Acca Error:", err);
    res.status(500).json({ message: "Failed to create acca" });
  }
});

// ── TRACK ACCUMULATOR BET ──────────────────────────────────────────
router.post("/track", async (req, res) => {
  try {
    const user = getUser(req);
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const { accumulatorId, stakeAmount } = req.body;

    // 1. Validation
    if (!accumulatorId || !stakeAmount) {
      return res
        .status(400)
        .json({ message: "Missing accumulator ID or stake" });
    }

    const acca = await Accumulator.findById(accumulatorId);
    if (!acca)
      return res.status(404).json({ message: "Accumulator not found" });

    // 2. Create BetSlip
    // FIXED: Changed 'type' to 'tipType' to match your Schema
    const betSlip = await BetSlip.create({
      user: user.id,
      accumulator: accumulatorId,
      tipType: "Accumulator", // <--- MATCHES SCHEMA ENUM
      matchSnapshot: { title: acca.title },
      stakeAmount,
      oddsAtBet: acca.totalOdds,
    });

    // 3. Deduct Stake
    await User.findByIdAndUpdate(user.id, {
      $inc: { "bankroll.amount": -stakeAmount },
    });

    res.status(201).json(betSlip);
  } catch (err) {
    // This logs the ACTUAL error to your terminal
    console.error("Track Acca Error:", err.message);
    res.status(500).json({ message: "Tracking failed", error: err.message });
  }
});

module.exports = router;
