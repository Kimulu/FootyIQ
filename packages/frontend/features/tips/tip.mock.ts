export const mockTips = [
  {
    id: "1",
    match: "Arsenal vs Chelsea",
    tipLabel: "Over 2.5 Goals",
    confidence: 78,
    isPremium: false,
    kickoffAt: new Date(Date.now() + 1000 * 60 * 60 * 6).toISOString(),
  },
  {
    id: "2",
    match: "Real Madrid vs Barcelona",
    tipLabel: "Both Teams To Score",
    confidence: 82,
    isPremium: true,
    kickoffAt: new Date(Date.now() + 1000 * 60 * 60 * 9).toISOString(),
  },
  {
    id: "3",
    match: "Inter vs Milan",
    tipLabel: "Home Win (1)",
    confidence: 66,
    isPremium: true,
    kickoffAt: new Date(Date.now() + 1000 * 60 * 60 * 12).toISOString(),
  },
];
