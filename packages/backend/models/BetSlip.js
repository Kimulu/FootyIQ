const mongoose = require("mongoose");

const BetSlipSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    prediction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prediction",
      required: true,
    },

    matchSnapshot: {
      homeTeam: { type: String },
      awayTeam: { type: String },
      tip: { type: String },
      competition: { type: String },
      kickoffTime: { type: Date },
    },

    stakeAmount: { type: Number, required: true },
    oddsAtBet: { type: String, default: "-" },

    result: {
      type: String,
      enum: ["Pending", "Won", "Lost", "Void"],
      default: "Pending",
    },

    potentialReturn: { type: Number, default: 0 },
    actualReturn: { type: Number, default: 0 },
    profitLoss: { type: Number, default: 0 },
    pointsEarned: { type: Number, default: 0 },

    tipType: {
      type: String,
      enum: ["Free", "Premium", "AI", "Accumulator", "TipOfTheDay"],
      default: "Free",
    },
  },
  { timestamps: true },
);

// Fixed: use async pre-save hook instead of next() callback
BetSlipSchema.pre("save", async function () {
  const odds = parseFloat(this.oddsAtBet);
  if (!isNaN(odds) && odds > 0) {
    this.potentialReturn = parseFloat((this.stakeAmount * odds).toFixed(2));
  }
});

module.exports =
  mongoose.models.BetSlip || mongoose.model("BetSlip", BetSlipSchema);
