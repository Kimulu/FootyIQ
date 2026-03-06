const express = require("express");
const router = express.Router();
const https = require("https");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// ── Helper: Get User ID from Token ─────────────────────────────────
const getUser = (req) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return null;
    const token = authHeader.split(" ")[1];
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
};

// ── 1. INITIALIZE PAYMENT ──────────────────────────────────────────
router.post("/initialize", async (req, res) => {
  try {
    // 1. Decode Token
    const tokenData = getUser(req);
    if (!tokenData) return res.status(401).json({ message: "Unauthorized" });

    // 2. CRITICAL FIX: Fetch the actual user from DB to get the Email
    const user = await User.findById(tokenData.id);

    if (!user) {
      return res.status(404).json({ message: "User account not found" });
    }

    const { plan } = req.body;

    // Define Prices (in Kobo/Cents - Paystack uses lowest currency unit)
    // 500 KSh = 50000 cents
    const PRICES = {
      daily: 5000, // 50 KSh
      monthly: 50000, // 500 KSh
      yearly: 540000, // 5400 KSh
    };

    const amount = PRICES[plan];
    if (!amount) return res.status(400).json({ message: "Invalid plan" });

    // 3. Use the Real Email
    const params = JSON.stringify({
      email: user.email, // <--- THIS IS THE FIX (Was user.email || "customer@...")
      amount: amount,
      currency: "KES",
      callback_url: "http://localhost:3000/dashboard",
      metadata: {
        userId: user._id.toString(),
        plan: plan,
      },
    });

    // Make Request to Paystack
    const options = {
      hostname: "api.paystack.co",
      port: 443,
      path: "/transaction/initialize",
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    };

    const paystackReq = https.request(options, (paystackRes) => {
      let data = "";
      paystackRes.on("data", (chunk) => {
        data += chunk;
      });
      paystackRes.on("end", () => {
        try {
          const response = JSON.parse(data);
          if (response.status) {
            res.json({ authorization_url: response.data.authorization_url });
          } else {
            console.error("Paystack Init Error:", response.message);
            res.status(400).json({
              message: "Paystack failed to init: " + response.message,
            });
          }
        } catch (e) {
          res.status(500).json({ message: "Invalid response from Paystack" });
        }
      });
    });

    paystackReq.on("error", (error) => {
      console.error(error);
      res.status(500).json({ message: "Connection error" });
    });

    paystackReq.write(params);
    paystackReq.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ── 2. WEBHOOK ─────────────────────────────────────────────────────
router.post("/webhook", async (req, res) => {
  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
    .update(JSON.stringify(req.body))
    .digest("hex");
  if (hash !== req.headers["x-paystack-signature"]) {
    return res.sendStatus(400);
  }

  const event = req.body;

  if (event.event === "charge.success") {
    const { userId, plan } = event.data.metadata;

    const now = new Date();
    let expiresAt = new Date();

    if (plan === "daily") expiresAt.setDate(now.getDate() + 1);
    if (plan === "monthly") expiresAt.setDate(now.getDate() + 30);
    if (plan === "yearly") expiresAt.setDate(now.getDate() + 365);
    if (plan === "premium") expiresAt.setDate(now.getDate() + 365);

    await User.findByIdAndUpdate(userId, {
      subscription: {
        plan: plan,
        status: "active",
        expiresAt: expiresAt,
      },
    });

    console.log(`✅ Payment success! User ${userId} upgraded.`);
  }

  res.sendStatus(200);
});

module.exports = router;
