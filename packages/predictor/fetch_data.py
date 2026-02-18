from soccerdata import FBref
import pandas as pd
import os

# 🛠️ proxy removed, no_cache removed to prevent IP bans
fbref = FBref(
    leagues=["ENG-Premier League"],
    seasons=["2526"],
    proxy="tor"
)

def fetch_and_save_data():
    print("📦 Fetching schedule...")
    schedule = fbref.read_schedule()
    schedule.to_csv("data/schedule.csv", index=False)

    print("📦 Fetching team stats...")
    team_stats = fbref.read_team_match_stats(stat_type="summary")
    team_stats.to_csv("data/team_stats.csv", index=False)

    print("✅ Data saved to data/ folder.")

if __name__ == "__main__":
    os.makedirs("data", exist_ok=True)
    fetch_and_save_data()