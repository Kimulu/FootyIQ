const mongoose = require("mongoose");

const BetSlipSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // OPTIONAL: Can be a single match
    prediction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prediction",
      required: false,
    },

    // OPTIONAL: Can be an accumulator
    accumulator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Accumulator",
      required: false,
    },

    matchSnapshot: {
      homeTeam: { type: String },
      awayTeam: { type: String },
      tip: { type: String },
      competition: { type: String },
      kickoffTime: { type: Date },
      title: { type: String },
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

// ── THE FIX IS HERE ───────────────────────────────────────────────
// Use async function. Do NOT pass 'next'.
BetSlipSchema.pre("save", async function () {
  // 1. Validation
  if (!this.prediction && !this.accumulator) {
    throw new Error(
      "BetSlip must be linked to either a Prediction or an Accumulator.",
    );
  }

  // 2. Calculation
  const odds = parseFloat(this.oddsAtBet);
  if (!isNaN(odds) && odds > 0) {
    this.potentialReturn = parseFloat((this.stakeAmount * odds).toFixed(2));
  } else {
    this.potentialReturn = 0;
  }

  // No need to call next(). If we don't throw an error, it proceeds automatically.
});

// Force deletion of model cache to ensure this new schema loads
if (mongoose.models.BetSlip) {
  delete mongoose.models.BetSlip;
}

module.exports = mongoose.model("BetSlip", BetSlipSchema);
