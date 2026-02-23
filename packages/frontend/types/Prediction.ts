export interface Prediction {
  _id: string;
  homeTeam: string;
  awayTeam: string;
  competition: string;
  kickoffTime: string;
  prediction: string;
  type: "Free" | "Premium";
  status: "Upcoming" | "Won" | "Lost" | "Pending" | "Void";
  league?: string;
  logoHome?: string;
  logoAway?: string;
  createdAt: string;
  updatedAt: string;
  odds?: string;
  isTipOfDay?: boolean;
}
