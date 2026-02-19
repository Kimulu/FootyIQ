const router = require("express").Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Middleware to verify Token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token || req.headers.authorization;
  if (authHeader) {
    // Supports "Bearer [token]" or just "[token]"
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
      {
        $set: req.body,
      },
      { new: true },
    ).select("-password");

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ==========================================
// 3. ADMIN: GET ALL USERS
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

module.exports = router;
