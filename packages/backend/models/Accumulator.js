const mongoose = require("mongoose");

const AccumulatorSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // e.g., "Saturday High Odds"
    predictions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Prediction" }],
    totalOdds: { type: String, required: true },
    status: {
      type: String,
      enum: ["Upcoming", "Won", "Lost", "Void"],
      default: "Upcoming",
    },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Accumulator", AccumulatorSchema);
