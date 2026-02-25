const router = require("express").Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Middleware to verify Token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token || req.headers.authorization;
  if (authHeader) {
    const token = authHeader.includes(" ")
      ? authHeader.split(" ")[1]
      : authHeader;

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json("Token is not valid!");
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("You are not authenticated!");
  }
};

// ==========================================
// 1. GET MY PROFILE
// ==========================================
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json("User not found");
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ==========================================
// 2. UPDATE MY PROFILE (Password/Phone)
// ==========================================
router.put("/profile", verifyToken, async (req, res) => {
  try {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: req.body },
      { new: true },
    ).select("-password");

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ==========================================
// 3. LEADERBOARD
// ⚠️ Must be before GET "/" to avoid route conflicts
// ==========================================
router.get("/leaderboard", verifyToken, async (req, res) => {
  try {
    const leaders = await User.find({ points: { $gt: 0 } })
      .select("username points bankroll createdAt avatar")
      .sort({ points: -1 })
      .limit(50);

    res.json(leaders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ==========================================
// 4. ADMIN: GET ALL USERS
// ==========================================
router.get("/", verifyToken, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json("Access Denied");

  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});
// ── UPDATE PROFILE (Bio, Avatar, etc.) ─────────────────────────────
router.put("/profile", verifyToken, async (req, res) => {
  try {
    // Prevent password update via this route for security
    if (req.body.password) {
      return res
        .status(400)
        .json({ message: "Use /change-password to update password" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: req.body },
      { new: true },
    ).select("-password");

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ── CHANGE PASSWORD ────────────────────────────────────────────────
router.put("/change-password", verifyToken, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json("User not found");

    // 1. Verify Old Password
    const validPassword = await bcrypt.compare(oldPassword, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    // 2. Hash New Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // 3. Save
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ── DELETE ACCOUNT ─────────────────────────────────────────────────
router.delete("/me", verifyToken, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
