const isPremium = (user) => {
  if (!user) return false;
  if (user.role === "admin") return true;

  // Check trial
  const now = new Date();
  if (
    user.subscription.trialEndsAt &&
    new Date(user.subscription.trialEndsAt) > now
  ) {
    return true;
  }

  // Check paid subscription
  if (
    user.subscription.plan !== "free" &&
    user.subscription.status === "active"
  ) {
    return true;
  }

  return false;
};

module.exports = { isPremium };
