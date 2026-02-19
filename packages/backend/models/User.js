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

    // Role: 'user' is a standard client, 'admin' manages content/predictions
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // Subscription Status for Premium Tips
    subscription: {
      plan: {
        type: String,
        enum: ["free", "daily", "monthly", "yearly"],
        default: "free",
      },
      status: {
        type: String,
        enum: ["active", "expired", "cancelled"],
        default: "active", // Defaults to active (for free plan)
      },
      expiresAt: { type: Date, default: null }, // Null means never expires (Free tier)
    },

    // Important for M-Pesa payments later
    phoneNumber: { type: String, trim: true },

    // Optional profile picture
    avatar: { type: String, default: "" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", UserSchema);
