const BetSlip = require("../models/BetSlip");
const User = require("../models/User");

/**
 * Finds all pending bets for a match and calculates wins/losses
 */
const resolveBetsForMatch = async (predictionId, result) => {
  // 1. Only process Valid Results
  if (!["Won", "Lost", "Void"].includes(result)) return;

  // 2. Find all PENDING slips for this match
  const betSlips = await BetSlip.find({
    prediction: predictionId,
    result: "Pending",
  });

  if (betSlips.length === 0) return;

  console.log(
    `Resolving ${betSlips.length} bets for match ${predictionId} as ${result}`,
  );

  // 3. Loop and Update
  for (const slip of betSlips) {
    slip.result = result;

    if (result === "Won") {
      const odds = parseFloat(slip.oddsAtBet);
      // Calculate Return
      slip.actualReturn = !isNaN(odds)
        ? parseFloat((slip.stakeAmount * odds).toFixed(2))
        : slip.stakeAmount;

      // Calculate Profit
      slip.profitLoss = parseFloat(
        (slip.actualReturn - slip.stakeAmount).toFixed(2),
      );

      // Calculate Points (Optional gamification)
      const oddsNum = parseFloat(slip.oddsAtBet) || 1;
      slip.pointsEarned = Math.round(slip.stakeAmount * oddsNum * 10);

      // Update User Wallet
      await User.findByIdAndUpdate(slip.user, {
        $inc: {
          "bankroll.amount": slip.actualReturn,
          points: slip.pointsEarned,
        },
      });
    } else if (result === "Lost") {
      slip.actualReturn = 0;
      slip.profitLoss = -slip.stakeAmount;
      slip.pointsEarned = 0;
      // No bankroll update needed (stake was deducted on creation)
    } else if (result === "Void") {
      slip.actualReturn = slip.stakeAmount;
      slip.profitLoss = 0;
      // Refund stake
      await User.findByIdAndUpdate(slip.user, {
        $inc: { "bankroll.amount": slip.stakeAmount },
      });
    }

    await slip.save();
  }
};

module.exports = { resolveBetsForMatch };
