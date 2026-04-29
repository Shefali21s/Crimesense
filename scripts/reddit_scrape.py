"""
CrimeSense — Reddit Scraper
Author: Shefali
Scrapes r/bangalore for crime-related posts using public JSON endpoints.

Usage:
    python scripts/reddit_scrape.py
Output:
    data/processed/reddit_new.csv
"""

import sys
sys.stdout.reconfigure(encoding='utf-8')

import requests
import pandas as pd
import time
from datetime import datetime
from pathlib import Path

OUT = Path(__file__).parent.parent / "data" / "processed"

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/json',
}

search_queries = [
    "harassed whitefield", "crime whitefield",
    "robbery koramangala", "harassment koramangala",
    "theft jayanagar", "crime btm layout",
    "fraud mg road", "stalked indiranagar",
    "unsafe yelahanka", "crime hebbal",
    "robbery marathahalli", "cybercrime bangalore",
    "scam bangalore", "unsafe bangalore women"
]

posts = []

for query in search_queries:
    url = f"https://www.reddit.com/r/bangalore/search.json?q={query}&limit=25&sort=new&restrict_sr=1&raw_json=1"
    try:
        r = requests.get(url, headers=headers, timeout=15)
        print(f"Query: '{query}' | Status: {r.status_code}")

        if r.status_code == 200:
            data = r.json()
            children = data['data']['children']
            for post in children:
                p = post['data']
                posts.append({
                    'text': p['title'] + ' ' + p.get('selftext', ''),
                    'date': datetime.utcfromtimestamp(p['created_utc']),
                    'source': 'reddit',
                })
            print(f"  -> {len(children)} posts collected")
        elif r.status_code == 429:
            print("  -> Rate limited! Waiting 30 seconds...")
            time.sleep(30)
        else:
            print(f"  -> Blocked: {r.text[:100]}")

    except Exception as e:
        print(f"  -> Exception: {e}")

    time.sleep(3)

print(f"\nTotal posts: {len(posts)}")

if len(posts) > 0:
    df = pd.DataFrame(posts).drop_duplicates(subset='text')
    df.to_csv(OUT / "reddit_new.csv", index=False)
    print(f"Saved: data/processed/reddit_new.csv ({len(df)} rows)")
else:
    print("No posts collected.")
