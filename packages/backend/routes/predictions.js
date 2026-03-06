const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Prediction = require("../models/Prediction");
const User = require("../models/User");
const { isPremium } = require("../utils/accessControl"); // Ensure this path is correct

// ── Helper: Get User safely (Optional Auth) ────────────────────────
// We don't block the request if no token, we just return null user.
const getOptionalUser = async (req) => {
  try {
    const authHeader = req.headers.authorization || req.headers.token;
    if (!authHeader || !authHeader.startsWith("Bearer ")) return null;

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch fresh user data (needed for trial expiry check)
    return await User.findById(decoded.id);
  } catch (err) {
    return null;
  }
};

// GET /api/predictions
router.get("/", async (req, res) => {
  try {
    // 1. Determine Access Level
    const user = await getOptionalUser(req);
    const hasAccess = isPremium(user);

    // 2. Fetch Data
    let predictions = await Prediction.find()
      .sort({ kickoffTime: 1 })
      .limit(20);

    console.log(
      `DEBUG: User: ${user?.username || "Guest"} | Premium: ${hasAccess}`,
    );

    // 3. Mask Data if NOT Premium
    if (!hasAccess) {
      predictions = predictions.map((doc) => {
        // Convert Mongoose document to plain object
        const p = doc.toObject();

        if (p.type === "Premium") {
          return {
            ...p,
            // HIDE SENSITIVE DATA
            homeTeam: "Locked Match",
            awayTeam: "Locked Match",
            logoHome: "/images/lock-placeholder.png", // Ensure you have a placeholder or use generic
            logoAway: "/images/lock-placeholder.png",
            prediction: "🔒 Upgrade to Unlock",
            odds: "?.??",
            isLocked: true, // Flag for frontend
          };
        }
        return p;
      });
    }

    res.set("Cache-Control", "no-store");
    res.json(predictions);
  } catch (err) {
    console.error("Failed to fetch predictions:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/predictions/tip-of-day
router.get("/tip-of-day", async (req, res) => {
  try {
    const tip = await Prediction.findOne({ isTipOfDay: true });
    if (!tip) return res.status(404).json({ message: "No Tip of the Day set" });

    // Apply same masking logic
    const user = await getOptionalUser(req);
    const hasAccess = isPremium(user);

    if (!hasAccess && tip.type === "Premium") {
      const maskedTip = {
        ...tip.toObject(),
        homeTeam: "Locked Match",
        awayTeam: "Locked Match",
        prediction: "🔒 Upgrade to Unlock",
        odds: "?.??",
        isLocked: true,
      };
      return res.json(maskedTip);
    }

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

    // Mask logic for single view
    const user = await getOptionalUser(req);
    const hasAccess = isPremium(user);

    if (!hasAccess && prediction.type === "Premium") {
      return res.json({
        ...prediction.toObject(),
        homeTeam: "Locked Match",
        awayTeam: "Locked Match",
        prediction: "🔒 Upgrade to Unlock",
        odds: "?.??",
        isLocked: true,
      });
    }

    res.json(prediction);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
