const express = require("express");
const router = express.Router();
const axios = require("axios");

const GITHUB_URL =
  "https://raw.githubusercontent.com/Kimulu/AIFootballPredictions/main/public/predictions.json";

router.get("/", async (req, res) => {
  try {
    const response = await axios.get(GITHUB_URL);

    const rawData = response.data;
    const matches = rawData.matches || [];

    const formattedPredictions = matches.map((item) => {
      // Logic: Calculate Implied Odds
      let probability = 0;
      if (item.prediction.pick === "OVER") {
        probability = item.prediction.prob_over;
      } else {
        probability = item.prediction.prob_under;
      }
      const impliedOdds = probability > 0 ? (1 / probability).toFixed(2) : "-";

      // Logic: Format Prediction Text
      const market =
        rawData.market === "over_2_5_goals" ? "2.5 Goals" : "Goals";
      const readablePrediction = `${item.prediction.pick} ${market}`;

      return {
        _id: `ai-${item.matchId}`,
        homeTeam: item.home_team,
        awayTeam: item.away_team,

        // Competition Details
        competition: item.competitionName || "AI League",
        competitionCrest: item.competitionCrest, // <--- NEW: Pass the league logo

        kickoffTime: new Date(item.utcDate),
        prediction: readablePrediction,
        odds: impliedOdds,
        type: "AI",
        status: "Upcoming",

        // Team Logos
        logoHome: item.home_team_crest,
        logoAway: item.away_team_crest,

        confidence: Math.round(item.prediction.confidence * 100),
        bucket: item.bucket, // Pass the bucket (optional use)
      };
    });

    res.json(formattedPredictions);
  } catch (err) {
    console.error("AI Fetch Error:", err.message);
    res.status(500).json({ message: "Failed to load AI predictions" });
  }
});

module.exports = router;
