export interface Prediction {
  _id: string;
  homeTeam: string;
  awayTeam: string;
  kickoffTime: string;
  prediction: string;
  type: "Free" | "Premium";
  status: "Upcoming" | "Won" | "Lost";
  league?: string;
  logoHome?: string;
  logoAway?: string;
  createdAt: string;
  updatedAt: string;
}
