import { Article } from "../types/Article";
import { Prediction } from "../types/Prediction";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string;

// ── Helper: get token from localStorage ───────────────────────────
const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem("user");
  if (!user) return null;
  try {
    return JSON.parse(user).token || null;
  } catch {
    return null;
  }
};

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

export const apiClient = {
  // ── ARTICLES ──────────────────────────────────────────────────────
  getArticles: async (): Promise<Article[]> => {
    const res = await fetch(`${BASE_URL}/news`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new Error(errorData?.message || "Failed to fetch articles");
    }
    return res.json();
  },

  // ── PREDICTIONS / MATCHES ─────────────────────────────────────────
  getPredictions: async (): Promise<Prediction[]> => {
    const res = await fetch(`${BASE_URL}/predictions`);
    if (!res.ok) throw new Error("Failed to fetch predictions");
    return res.json();
  },

  async getTipOfDay(): Promise<Prediction | null> {
    const res = await fetch(`${BASE_URL}/predictions/tip-of-day`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Failed to fetch Tip of the Day");
    return res.json();
  },

  async createMatch(data: any) {
    const res = await fetch(`${BASE_URL}/admin/create-match`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Failed to create match");
    return result;
  },

  async updateMatch(id: string, data: any) {
    const res = await fetch(`${BASE_URL}/admin/matches/${id}`, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Failed to update match");
    return result;
  },

  async deleteMatch(id: string) {
    const res = await fetch(`${BASE_URL}/admin/matches/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Failed to delete match");
    return result;
  },
  async pinTipOfDay(id: string) {
    const res = await fetch(`${BASE_URL}/admin/matches/${id}/tip-of-day`, {
      method: "PATCH",
      headers: authHeaders(),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Failed to pin tip");
    return result;
  },

  async unpinTipOfDay(id: string) {
    const res = await fetch(
      `${BASE_URL}/admin/matches/${id}/unpin-tip-of-day`,
      {
        method: "PATCH",
        headers: authHeaders(),
      },
    );
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Failed to unpin tip");
    return result;
  },

  // ── AUTH ──────────────────────────────────────────────────────────
  async login(credentials: any) {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    if (!res.ok) throw new Error("Login failed");
    return res.json();
  },

  async register(data: any) {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Registration failed");
    return result;
  },

  // NEW: Fetch latest user profile (for updating bankroll UI)
  async getProfile() {
    const res = await fetch(`${BASE_URL}/users/profile`, {
      method: "GET",
      headers: authHeaders(),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Failed to fetch profile");
    return result;
  },

  // ── BANKROLL ──────────────────────────────────────────────────────
  async setBankroll(amount: number) {
    const res = await fetch(`${BASE_URL}/betslips/bankroll`, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify({ amount }),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Failed to update bankroll");
    return result;
  },

  // ── BET SLIPS ─────────────────────────────────────────────────────
  async trackBet(data: {
    predictionId: string;
    stakeAmount: number;
    oddsAtBet?: string;
    tipType?: string;
  }) {
    const res = await fetch(`${BASE_URL}/betslips`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Failed to track bet");
    return result;
  },

  async getMyBets() {
    const res = await fetch(`${BASE_URL}/betslips/me`, {
      method: "GET",
      headers: authHeaders(),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Failed to fetch bets");
    return result;
  },

  // ── LEADERBOARD ───────────────────────────────────────────────────
  async getLeaderboard() {
    const res = await fetch(`${BASE_URL}/users/leaderboard`, {
      method: "GET",
      headers: authHeaders(),
    });
    const result = await res.json();
    if (!res.ok)
      throw new Error(result.message || "Failed to fetch leaderboard");
    return result;
  },

  // ── ADMIN ONLY ────────────────────────────────────────────────────
  async resolveBets(predictionId: string, result: "Won" | "Lost" | "Void") {
    const res = await fetch(`${BASE_URL}/betslips/resolve/${predictionId}`, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify({ result }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to resolve bets");
    return data;
  },
  // ── ACCUMULATORS ──────────────────────────────────────────────────
  async getAccumulators() {
    const res = await fetch(`${BASE_URL}/accumulators`, {
      headers: authHeaders(),
    });
    return res.json();
  },

  async createAccumulator(data: {
    title: string;
    matchIds: string[];
    totalOdds: string;
  }) {
    const res = await fetch(`${BASE_URL}/accumulators`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create accumulator");
    return res.json();
  },

  async trackAccumulator(data: { accumulatorId: string; stakeAmount: number }) {
    const res = await fetch(`${BASE_URL}/accumulators/track`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to track accumulator");
    return res.json();
  },
  // ... inside apiClient object ...

  // ── AI PREDICTIONS ────────────────────────────────────────────────
  async getAiPredictions() {
    const res = await fetch(`${BASE_URL}/ai`, {
      method: "GET",
      headers: authHeaders(), // Optional if you want it public
    });
    if (!res.ok) throw new Error("Failed to fetch AI predictions");
    return res.json();
  },
  // ── USER SETTINGS ─────────────────────────────────────────────────
  async updateProfile(data: any) {
    const res = await fetch(`${BASE_URL}/users/profile`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update profile");
    return res.json();
  },

  async changePassword(data: any) {
    const res = await fetch(`${BASE_URL}/users/change-password`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Failed to change password");
    return result;
  },

  async deleteAccount() {
    const res = await fetch(`${BASE_URL}/users/me`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error("Failed to delete account");
    return res.json();
  },
  // ── PAYMENTS ──────────────────────────────────────────────────────
  async initializePayment(plan: "daily" | "monthly" | "yearly") {
    const res = await fetch(`${BASE_URL}/payment/initialize`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ plan }),
    });

    if (!res.ok) throw new Error("Failed to start payment");

    const data = await res.json();
    return data.authorization_url; // We need this URL to redirect the user
  },

  async forgotPassword(email: string) {
    const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    return res.json();
  },

  async resetPassword(data: any) {
    const res = await fetch(`${BASE_URL}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to reset password");
    }
    return res.json();
  },
};
