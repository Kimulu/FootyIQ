const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto"); // Built-in Node module for generating tokens
const User = require("../models/User");

// ==========================================
// 1. USER REGISTRATION (Clients)
// ==========================================
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, phoneNumber } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill in all required fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      phoneNumber: phoneNumber || "",
      role: "user",
      subscription: {
        plan: "free",
        status: "active",
      },
    });

    await newUser.save();
    res.status(201).json({ message: "Account created successfully!" });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// ==========================================
// 2. ADMIN REGISTRATION
// ==========================================
router.post("/register/admin/:secretKey", async (req, res) => {
  const { secretKey } = req.params;
  const ADMIN_SECRET = process.env.ADMIN_SECRET || "footy_master_key_2024";

  if (secretKey !== ADMIN_SECRET) {
    return res.status(403).json({ message: "Forbidden: Invalid Secret Key" });
  }

  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: "admin",
      subscription: {
        plan: "yearly",
        status: "active",
      },
    });

    await newUser.save();
    res.status(201).json({ message: "Admin Registered Successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating admin", error: err.message });
  }
});

// ==========================================
// 3. LOGIN
// ==========================================
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json("User not found");

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password,
    );
    if (!validPassword) return res.status(400).json("Wrong password");

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        plan: user.subscription.plan,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    const { password, ...others } = user._doc;

    res.status(200).json({ ...others, token });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// ==========================================
// 4. FORGOT PASSWORD (Simulated Email)
// ==========================================
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      // Security: Don't reveal if user exists or not
      return res.json({ message: "If that email exists, we sent a link." });
    }

    // Generate a generic random token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash it for database storage (security best practice)
    const hash = await bcrypt.hash(resetToken, 10);

    // Save to user with 1 hour expiration
    user.resetPasswordToken = hash;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // ── SIMULATED EMAIL SENDING ──
    // This logs to your VS Code terminal
    const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}&email=${email}`;

    console.log("\n==================================================");
    console.log("📧 MOCK EMAIL SERVICE");
    console.log("--------------------------------------------------");
    console.log(`To: ${email}`);
    console.log(`Subject: Password Reset Request`);
    console.log(`Link: ${resetUrl}`);
    console.log("==================================================\n");

    res.json({ message: "If that email exists, we sent a link." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ==========================================
// 5. RESET PASSWORD
// ==========================================
router.post("/reset-password", async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;

    // Find user with matching email AND unexpired token time
    const user = await User.findOne({
      email,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Verify token matches the hash stored in DB
    const isValid = await bcrypt.compare(token, user.resetPasswordToken);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Clear reset fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
