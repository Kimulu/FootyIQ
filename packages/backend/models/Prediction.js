const mongoose = require("mongoose");

const PredictionSchema = new mongoose.Schema(
  {
    externalId: { type: Number, unique: true, sparse: true }, // ID from the API to prevent duplicates
    homeTeam: { type: String, required: true },
    awayTeam: { type: String, required: true },
    kickoffTime: { type: Date, required: true },

    // Changed: Not required on creation, because the API doesn't know your prediction yet
    prediction: { type: String, default: "Pending Analysis" },

    odds: { type: String, default: "-" }, // Added for your card display

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
    league: { type: String }, // e.g., "Premier League"
    logoHome: { type: String },
    logoAway: { type: String },
  },
  { timestamps: true },
);

module.exports =
  mongoose.models.Prediction || mongoose.model("Prediction", PredictionSchema);
