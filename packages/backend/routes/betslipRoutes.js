const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const BetSlip = require("../models/Betslip");
const User = require("../models/User");
const Prediction = require("../models/Prediction");
const { resolveBetsForMatch } = require("../services/betServices");

// ── Inline auth helper ─────────────────────────────────────────────
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

// ── POST /api/betslips (Place Bet) ─────────────────────────────────
router.post("/", async (req, res) => {
  try {
    const user = getUser(req);
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const { predictionId, stakeAmount, oddsAtBet, tipType } = req.body;

    if (!predictionId || !stakeAmount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const prediction = await Prediction.findById(predictionId);
    if (!prediction) {
      return res.status(404).json({ message: "Prediction not found" });
    }

    const betSlip = await BetSlip.create({
      user: user.id,
      prediction: predictionId,
      matchSnapshot: {
        homeTeam: prediction.homeTeam,
        awayTeam: prediction.awayTeam,
        tip: prediction.prediction,
        competition: prediction.competition,
        kickoffTime: prediction.kickoffTime,
      },
      stakeAmount,
      oddsAtBet: oddsAtBet || prediction.odds,
      tipType: tipType || prediction.type,
    });

    // Deduct stake from bankroll
    await User.findByIdAndUpdate(user.id, {
      $inc: { "bankroll.amount": -stakeAmount },
    });

    res.status(201).json(betSlip);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ── GET /api/betslips/me (User Stats) ──────────────────────────────
router.get("/me", async (req, res) => {
  try {
    const userData = getUser(req); // Get ID from token
    if (!userData) return res.status(401).json({ message: "Unauthorized" });

    // 1. Fetch the actual User DB Object to get Bankroll info
    const userDoc = await User.findById(userData.id);
    if (!userDoc) return res.status(404).json({ message: "User not found" });

    const betSlips = await BetSlip.find({ user: userData.id })
      .populate(
        "prediction",
        "homeTeam awayTeam kickoffTime competition status",
      )
      .sort({ createdAt: -1 });

    // 2. Filter for Settled Bets (Ignore Pending for Win Rate/Profit calc)
    //    If we include pending, it looks like you lost money because stake is gone but return is 0
    const settledBets = betSlips.filter((b) =>
      ["Won", "Lost", "Void"].includes(b.result),
    );

    const total = betSlips.length;
    const won = settledBets.filter((b) => b.result === "Won").length;
    const lost = settledBets.filter((b) => b.result === "Lost").length;
    const pending = betSlips.filter((b) => b.result === "Pending").length;

    // Calculate Profit/Loss only on SETTLED bets
    const settledStaked = settledBets.reduce(
      (sum, b) => sum + b.stakeAmount,
      0,
    );
    const settledReturned = settledBets.reduce(
      (sum, b) => sum + b.actualReturn,
      0,
    );
    const profitLoss = parseFloat((settledReturned - settledStaked).toFixed(2));

    // Win Rate (Based on settled bets only)
    const totalSettled = won + lost;
    const winRate =
      totalSettled > 0 ? ((won / totalSettled) * 100).toFixed(1) : "0.0";

    // 3. ROI Calculation (Return on Capital / Bankroll Growth)
    //    Formula: ((Current Balance - Initial Balance) / Initial Balance) * 100
    const currentBankroll = userDoc.bankroll?.amount || 0;
    const initialBankroll = userDoc.bankroll?.initialAmount || 1; // Prevent divide by zero

    // We calculate pure bankroll growth
    const bankrollGrowth = currentBankroll - initialBankroll;
    const roi = ((bankrollGrowth / initialBankroll) * 100).toFixed(1);

    res.json({
      betSlips,
      stats: {
        total,
        won,
        lost,
        pending,
        totalStaked: betSlips.reduce((sum, b) => sum + b.stakeAmount, 0), // Show total money committed (including pending)
        totalReturned: settledReturned,
        profitLoss, // Net profit from finished games
        winRate,
        roi, // Bankroll Growth %
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ── PATCH /api/betslips/resolve/:id (Manual Admin Trigger) ─────────
router.patch("/resolve/:predictionId", async (req, res) => {
  try {
    const user = getUser(req);
    if (!user || user.role !== "admin")
      return res.status(403).json({ message: "Admin only" });

    const { result } = req.body;
    const { predictionId } = req.params;

    // Use the shared service logic
    await resolveBetsForMatch(predictionId, result);

    res.json({ message: "Bets resolved successfully via manual trigger" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ── PATCH /api/betslips/bankroll (Update Bankroll) ─────────────────
router.patch("/bankroll", async (req, res) => {
  try {
    const user = getUser(req);
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const { amount } = req.body;
    if (!amount || amount <= 0)
      return res.status(400).json({ message: "Invalid amount" });

    const updatedUser = await User.findByIdAndUpdate(
      user.id,
      {
        "bankroll.amount": amount,
        "bankroll.initialAmount": amount,
        "bankroll.isSet": true,
        "bankroll.updatedAt": new Date(),
      },
      { new: true },
    );

    res.json({ message: "Bankroll updated", bankroll: updatedUser.bankroll });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
