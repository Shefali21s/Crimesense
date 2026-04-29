"""
CrimeSense — Master Pipeline Script
Author: Shefali
Run this once to regenerate all processed data from scratch.

Usage:
    python scripts/run_pipeline.py
"""

import sys
import os
import pandas as pd
import numpy as np
from pathlib import Path

ROOT = Path(__file__).parent.parent
DATA_RAW  = ROOT / "data" / "raw"
DATA_OUT  = ROOT / "data" / "processed"
DATA_OUT.mkdir(parents=True, exist_ok=True)

print("=" * 60)
print("  CrimeSense — Data Pipeline")
print("  Author: Shefali")
print("=" * 60)

# ─────────────────────────────────────────────────────────────
# STEP 1 — Fix & Clean Reddit Dataset
# ─────────────────────────────────────────────────────────────
print("\n[1/3] Cleaning Reddit dataset...")

df = pd.read_excel(DATA_RAW / "CrimeSense_Bangalore_Dataset.xlsx")

category_map = {
    'Cyber Crime':      'cybercrime',
    'Cybercrime':       'cybercrime',
    'Scam/Fraud':       'cybercrime',
    'Women Safety':     'women_safety',
    'Harassment':       'women_safety',
    'Assault/Violence': 'violent_crime',
    'Theft/Robbery':    'property_crime',
    'Other':            'other',
    'unknown':          'other'
}
df['category'] = df['category'].map(category_map)
df = df[df['category'] != 'other']

zone_keywords = {
    'Central':    ['mg road', 'brigade', 'majestic', 'shivajinagar', 'cubbon', 'indiranagar', 'koramangala'],
    'West':       ['rajajinagar', 'vijayanagar', 'malleshwaram'],
    'South':      ['jayanagar', 'jp nagar', 'bannerghatta', 'btm'],
    'North':      ['hebbal', 'jalahalli', 'yeshwanthpur'],
    'East':       ['marathahalli', 'kr puram', 'bellandur', 'whitefield', 'itpl'],
    'Yelahanka':  ['yelahanka', 'jakkur', 'hennur'],
}

def extract_zone(text):
    text = str(text).lower()
    for zone, keywords in zone_keywords.items():
        if any(kw in text for kw in keywords):
            return zone
    return 'Unlocated'

df['zone'] = df['text'].apply(extract_zone)
df['date'] = pd.to_datetime(df['date'], errors='coerce', utc=True)
df['year'] = df['date'].dt.year
df.to_csv(DATA_OUT / "reddit_clean.csv", index=False)
print(f"    Done — {len(df)} posts cleaned → reddit_clean.csv")

# ─────────────────────────────────────────────────────────────
# STEP 2 — Safety Scores
# ─────────────────────────────────────────────────────────────
print("\n[2/3] Computing district safety scores...")

crime = pd.read_csv(DATA_OUT / "crimesense_clean.csv")
df_2024 = crime[crime['year'] == 2024]

district_scores = []
for district in crime['district'].unique():
    d = df_2024[df_2024['district'] == district]
    total_cases   = d['cases'].sum()
    avg_risk      = d['risk_index'].mean()
    violent_cases = d[d['is_violent'] == 1]['cases'].sum()
    cyber_cases   = d[d['crime_category'] == 'cybercrime']['cases'].sum()
    detection_avg = d['detection_rate'].mean()

    raw_score = (
        total_cases   * 0.35 +
        avg_risk      * 0.30 +
        violent_cases * 0.25 +
        (100 - detection_avg if not pd.isna(detection_avg) else 50) * 0.10
    )
    district_scores.append({
        'district': district, 'total_cases': total_cases,
        'violent_cases': violent_cases, 'cyber_cases': cyber_cases,
        'avg_risk_index': round(avg_risk, 2), 'raw_score': raw_score
    })

score_df = pd.DataFrame(district_scores)
max_score = score_df['raw_score'].max()
score_df['safety_score'] = (100 - (score_df['raw_score'] / max_score * 100)).round(1)
score_df['safety_label'] = score_df['safety_score'].apply(
    lambda x: 'Safe' if x >= 60 else ('Moderate' if x >= 35 else 'High Risk')
)
score_df.to_csv(DATA_OUT / "district_safety_scores.csv", index=False)
print(f"    Done — 7 districts scored → district_safety_scores.csv")

# ─────────────────────────────────────────────────────────────
# STEP 3 — 2025 Predictions
# ─────────────────────────────────────────────────────────────
print("\n[3/3] Running prediction model...")

from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, r2_score
import warnings
warnings.filterwarnings('ignore')

predictions = []
for district in crime['district'].unique():
    for category in crime['crime_category'].unique():
        subset = crime[
            (crime['district'] == district) &
            (crime['crime_category'] == category)
        ].groupby('year')['cases'].sum().reset_index()

        if len(subset) < 3:
            continue

        X = subset['year'].values.reshape(-1, 1)
        y = subset['cases'].values
        model = LinearRegression().fit(X, y)
        pred_2025 = max(0, int(model.predict([[2025]])[0]))
        predictions.append({
            'district': district, 'category': category,
            'predicted_2025': pred_2025,
            'trend': 'Increasing' if model.coef_[0] > 0 else 'Decreasing'
        })

pred_df = pd.DataFrame(predictions)
pred_df.to_csv(DATA_OUT / "predictions_2025.csv", index=False)
print(f"    Done — {len(pred_df)} predictions → predictions_2025.csv")

print("\n" + "=" * 60)
print("  Pipeline complete! All files in data/processed/")
print("=" * 60)
