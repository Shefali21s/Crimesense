# FILE: safety_score.py

import pandas as pd
import numpy as np

df       = pd.read_csv('crimesense_clean.csv')
df_2024  = df[df['year'] == 2024]

# ── Calculate safety score per district ──────────────────────
district_scores = []

for district in df['district'].unique():

    d = df_2024[df_2024['district'] == district]

    total_cases    = d['cases'].sum()
    avg_risk       = d['risk_index'].mean()
    violent_cases  = d[d['is_violent'] == 1]['cases'].sum()
    cyber_cases    = d[d['crime_category'] == 'cybercrime']['cases'].sum()
    detection_avg  = d['detection_rate'].mean()

    # Normalize risk to 0-100 safety score (higher = safer)
    raw_score = (
        total_cases    * 0.35 +
        avg_risk       * 0.30 +
        violent_cases  * 0.25 +
        (100 - detection_avg if not pd.isna(detection_avg) else 50) * 0.10
    )

    district_scores.append({
        'district':       district,
        'total_cases':    total_cases,
        'violent_cases':  violent_cases,
        'cyber_cases':    cyber_cases,
        'avg_risk_index': round(avg_risk, 2),
        'raw_score':      raw_score
    })

score_df = pd.DataFrame(district_scores)

# Normalize: invert so HIGH score = SAFER
max_score = score_df['raw_score'].max()
score_df['safety_score'] = (
    100 - (score_df['raw_score'] / max_score * 100)
).round(1)

score_df['safety_label'] = score_df['safety_score'].apply(
    lambda x: 'Safe' if x >= 60 else ('Moderate' if x >= 35 else 'High Risk')
)

print(score_df[['district','safety_score','safety_label','total_cases','avg_risk_index']]
      .sort_values('safety_score', ascending=False).to_string())

score_df.to_csv('district_safety_scores.csv', index=False)