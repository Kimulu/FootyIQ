const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ==========================================
// 1. USER REGISTRATION (Clients)
// ==========================================
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, phoneNumber } = req.body;

    // Basic Validation
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill in all required fields" });
    }

    // Check if user exists
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
      role: "user", // Default role
      subscription: {
        plan: "free", // FIXED: changed "Free" to "free"
        status: "active", // FIXED: changed "Active" to "active"
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
// 2. ADMIN REGISTRATION (One-time setup usually)
// ==========================================
router.post("/register/admin/:secretKey", async (req, res) => {
  const { secretKey } = req.params;
  // In production, put this in your .env file
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
        plan: "yearly", // FIXED: changed "Yearly" to "yearly"
        status: "active", // FIXED: changed "Active" to "active"
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

    // Create Token containing important info
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        plan: user.subscription.plan,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }, // Token expires in 7 days
    );

    // Remove password from response
    const { password, ...others } = user._doc;

    res.status(200).json({ ...others, token });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;
