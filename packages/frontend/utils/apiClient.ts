import { Article } from "../types/Article";
import { Prediction } from "../types/Prediction";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string;

export const apiClient = {
  getArticles: async (): Promise<Article[]> => {
    const res = await fetch(`${BASE_URL}/api/news`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new Error(errorData?.message || "Failed to fetch articles");
    }
    return res.json();
  },

  getPredictions: async (): Promise<Prediction[]> => {
    const res = await fetch(`${BASE_URL}/api/predictions`);
    if (!res.ok) {
      throw new Error("Failed to fetch predictions");
    }
    return res.json();
  },

  // AUTH METHODS
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
};
