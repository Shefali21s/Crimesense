"""
CrimeSense — Folium Safety Map Generator
Author: Shefali
Generates an interactive HTML safety map for Bengaluru districts.

Usage:
    python scripts/generate_map.py
Output:
    data/processed/bengaluru_safety_map.html
"""

import folium
import pandas as pd
from pathlib import Path

DATA = Path(__file__).parent.parent / "data" / "processed"

score_df = pd.read_csv(DATA / "district_safety_scores.csv")

district_coords = {
    'Central':    [12.9716, 77.5946],
    'West':       [12.9762, 77.5504],
    'South':      [12.9198, 77.6187],
    'North':      [13.0358, 77.5970],
    'East':       [12.9868, 77.6473],
    'Whitefield': [12.9698, 77.7499],
    'Yelahanka':  [13.1005, 77.5963],
}

color_map = {'Safe': 'green', 'Moderate': 'orange', 'High Risk': 'red'}

m = folium.Map(location=[12.9716, 77.5946], zoom_start=11, tiles='CartoDB positron')

for _, row in score_df.iterrows():
    district = row['district']
    score    = row['safety_score']
    label    = row['safety_label']
    coords   = district_coords.get(district, [12.9716, 77.5946])
    color    = color_map[label]

    folium.CircleMarker(
        location=coords,
        radius=22,
        color=color,
        fill=True,
        fill_color=color,
        fill_opacity=0.65,
        popup=folium.Popup(
            f"""<b style='font-size:14px'>{district}</b><br>
            Safety Score: <b>{score}/100</b><br>
            Status: <b>{label}</b><br>
            Total Cases (2024): {int(row['total_cases'])}<br>
            Avg Risk Index: {row['avg_risk_index']}""",
            max_width=220
        ),
        tooltip=f"{district} - {label} ({score}/100)"
    ).add_to(m)

legend_html = """
<div style="position:fixed; bottom:30px; left:30px; z-index:1000;
     background:white; padding:15px; border-radius:8px; border:1px solid #ccc;
     font-family:Arial; font-size:13px;">
  <b>Safety Level</b><br>
  <span style="color:green; font-size:18px">&#9679;</span> Safe (60-100)<br>
  <span style="color:orange; font-size:18px">&#9679;</span> Moderate (35-59)<br>
  <span style="color:red; font-size:18px">&#9679;</span> High Risk (0-34)<br>
  <br><small>CrimeSense by Shefali</small>
</div>"""
m.get_root().html.add_child(folium.Element(legend_html))

out = DATA / "bengaluru_safety_map.html"
m.save(str(out))
print(f"Map saved: {out}")
