const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    subscription: {
      plan: {
        type: String,
        enum: ["free", "daily", "monthly", "yearly", "premium"],
        default: "free",
      },
      status: {
        type: String,
        enum: ["active", "expired", "cancelled"],
        default: "active",
      },
      expiresAt: { type: Date, default: null },
    },

    phoneNumber: { type: String, trim: true },
    avatar: { type: String, default: "" },
    banner: { type: String, default: "" }, // Like Twitter header
    bio: { type: String, default: "" }, // Short description
    location: { type: String, default: "" },

    // ── Bankroll Tracker ──────────────────────────────
    bankroll: {
      amount: { type: Number, default: 0 }, // Current bankroll in KSh
      initialAmount: { type: Number, default: 0 }, // Starting bankroll
      isSet: { type: Boolean, default: false }, // Has the user set their bankroll?
      updatedAt: { type: Date, default: null },
    },

    // ── Gamification ─────────────────────────────────
    points: { type: Number, default: 0 }, // Total points for leaderboard
    streak: { type: Number, default: 0 }, // Daily login streak
    lastLoginDate: { type: Date, default: null },

    // ── Password Reset ───────────────────────────────
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", UserSchema);
