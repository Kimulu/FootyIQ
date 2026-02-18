# packages/predictor/predictor.py

import pandas as pd

def predict():
    print("📊 Loading data...")
    schedule = pd.read_csv("data/schedule.csv")
    stats = pd.read_csv("data/team_stats.csv")

    # Simple predictor based on xG difference
    print("🔮 Making predictions...")
    merged = pd.merge(
        schedule,
        stats[['team', 'opponent', 'date', 'xg', 'xga']],
        how='left',
        left_on=['home_team', 'away_team', 'date'],
        right_on=['team', 'opponent', 'date'],
    )

    merged['xG_diff'] = merged['xg'] - merged['xga']
    merged['prediction'] = merged['xG_diff'].apply(lambda x: 'Home Win' if x > 0.5 else 'Draw' if abs(x) < 0.5 else 'Away Win')

    print(merged[['date', 'home_team', 'away_team', 'prediction']].head(10))

if __name__ == "__main__":
    predict()
