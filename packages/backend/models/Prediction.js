const mongoose = require("mongoose");

const PredictionSchema = new mongoose.Schema(
  {
    externalId: { type: Number, unique: true, sparse: true },
    homeTeam: { type: String, required: true },
    awayTeam: { type: String, required: true },
    kickoffTime: { type: Date, required: true },

    // Ensure this field name matches what we use in Frontend
    competition: { type: String, required: true },

    // Keep this just in case you want to support the old data format,
    // but we will try to save to 'competition' from now on.
    league: { type: String },

    prediction: { type: String, default: "Pending Analysis" },
    odds: { type: String, default: "-" },
    type: {
      type: String,
      enum: ["Free", "Premium"],
      default: "Free",
    },
    status: {
      type: String,
      enum: ["Upcoming", "Won", "Lost", "Pending"],
      default: "Pending",
    },
    logoHome: { type: String },
    logoAway: { type: String },
  },
  { timestamps: true },
);

module.exports =
  mongoose.models.Prediction || mongoose.model("Prediction", PredictionSchema);
