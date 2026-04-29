"""
CrimeSense — Underreporting Intelligence backend.
Loads pre-cleaned Bengaluru crime stats and NLP-classified Reddit chatter,
exposes aggregated metrics for the dashboard.
"""
from fastapi import FastAPI, APIRouter, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import math
from pathlib import Path
from typing import Optional, List, Dict, Any
import pandas as pd

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

DATA_DIR = ROOT_DIR / "data"

# --- MongoDB (kept for parity with template; not strictly required) ---------
mongo_url = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get("DB_NAME", "crimesense")]

# --- Data loading ----------------------------------------------------------
def _load_data():
    crime = pd.read_csv(DATA_DIR / "crimesense_clean.csv")
    reddit = pd.read_csv(DATA_DIR / "reddit_final.csv")
    safety = pd.read_csv(DATA_DIR / "district_safety_scores.csv")
    pred = pd.read_csv(DATA_DIR / "predictions_2025.csv")
    # Cast year to int
    crime["year"] = crime["year"].astype(int)
    reddit["year"] = pd.to_numeric(reddit["year"], errors="coerce").fillna(0).astype(int)
    return crime, reddit, safety, pred


CRIME_DF, REDDIT_DF, SAFETY_DF, PRED_DF = _load_data()

CATEGORY_LABEL = {
    "violent_crime": "Violent Crime",
    "women_safety": "Women Safety",
    "cybercrime": "Cybercrime",
    "property_crime": "Property Crime",
}
CATEGORIES = ["violent_crime", "women_safety", "cybercrime", "property_crime"]
DISTRICTS = sorted(CRIME_DF["district"].unique().tolist())
YEARS = sorted(CRIME_DF["year"].unique().tolist())


def _filter(df: pd.DataFrame, category: Optional[str], zone: Optional[str], year: Optional[int]):
    out = df
    if category and category != "all":
        col = "crime_category" if "crime_category" in out.columns else "category"
        out = out[out[col] == category]
    if zone and zone != "all":
        col = "district" if "district" in out.columns else "zone"
        out = out[out[col] == zone]
    if year and year != 0:
        out = out[out["year"] == year]
    return out


def _safe_float(x, default=0.0):
    try:
        v = float(x)
        if math.isnan(v) or math.isinf(v):
            return default
        return v
    except Exception:
        return default


# --- FastAPI app -----------------------------------------------------------
app = FastAPI(title="CrimeSense API", version="1.0.0")
api_router = APIRouter(prefix="/api")


@api_router.get("/")
async def root():
    return {"service": "CrimeSense", "version": "1.0.0"}


@api_router.get("/meta")
async def meta():
    return {
        "categories": [{"id": c, "label": CATEGORY_LABEL[c]} for c in CATEGORIES],
        "districts": DISTRICTS,
        "years": YEARS,
        "year_range": [int(min(YEARS)), int(max(YEARS))],
    }


@api_router.get("/overview")
async def overview(
    category: Optional[str] = Query("all"),
    zone: Optional[str] = Query("all"),
    year: Optional[int] = Query(0),
):
    crime = _filter(CRIME_DF, category, zone, year)
    reddit = _filter(REDDIT_DF, category, zone, year)

    official_total = int(crime["cases"].sum())
    digital_total = int(len(reddit))

    # Per-category aggregates for ratio computation
    per_cat = []
    for c in CATEGORIES:
        oc = int(CRIME_DF[CRIME_DF["crime_category"] == c]["cases"].sum())
        dc = int((REDDIT_DF["category"] == c).sum())
        per_1k = round((dc / oc) * 1000, 2) if oc else 0.0
        per_cat.append({"category": c, "label": CATEGORY_LABEL[c], "official": oc, "digital": dc, "per_1k": per_1k})

    top = max(per_cat, key=lambda r: r["per_1k"])

    # Avg detection rate across categories that have detection data
    det = CRIME_DF.groupby("crime_category")["detection_rate"].mean().dropna()
    avg_det = round(float(det.mean()), 1) if len(det) else 0.0

    return {
        "official_cases": official_total,
        "digital_signals": digital_total,
        "top_underreported": {
            "category": top["category"],
            "label": top["label"],
            "per_1k": top["per_1k"],
        },
        "avg_detection_rate": avg_det,
        "districts_count": len(DISTRICTS),
        "year_range": [int(min(YEARS)), int(max(YEARS))],
    }


@api_router.get("/spectrum")
async def spectrum(
    zone: Optional[str] = Query("all"),
    year: Optional[int] = Query(0),
):
    crime = _filter(CRIME_DF, None, zone, year)
    reddit = _filter(REDDIT_DF, None, zone, year)

    rows = []
    max_per_1k = 0.0
    # Compute official+digital share %
    total_off = int(crime["cases"].sum()) or 1
    total_dig = int(len(reddit)) or 1
    for c in CATEGORIES:
        oc = int(crime[crime["crime_category"] == c]["cases"].sum())
        dc = int((reddit["category"] == c).sum())
        per_1k = round((dc / oc) * 1000, 2) if oc else 0.0
        if per_1k > max_per_1k:
            max_per_1k = per_1k
        rows.append({
            "category": c,
            "label": CATEGORY_LABEL[c],
            "official": oc,
            "digital": dc,
            "per_1k": per_1k,
            "official_share": round((oc / total_off) * 100, 1),
            "digital_share": round((dc / total_dig) * 100, 1),
            "delta": round(((dc / total_dig) - (oc / total_off)) * 100, 1),
        })
    rows.sort(key=lambda r: r["per_1k"], reverse=True)
    return {"rows": rows, "max_per_1k": max_per_1k}


@api_router.get("/temporal")
async def temporal(
    category: Optional[str] = Query("all"),
    zone: Optional[str] = Query("all"),
):
    crime = _filter(CRIME_DF, category, zone, None)
    reddit = _filter(REDDIT_DF, category, zone, None)
    series = []
    for y in YEARS:
        official = int(crime[crime["year"] == y]["cases"].sum())
        digital = int((reddit["year"] == y).sum())
        series.append({"year": int(y), "official": official, "digital": digital})
    return {"series": series}


@api_router.get("/district-matrix")
async def district_matrix(year: Optional[int] = Query(0)):
    crime = _filter(CRIME_DF, None, None, year)
    rows = []
    for d in DISTRICTS:
        sub = crime[crime["district"] == d]
        cats = {c: int(sub[sub["crime_category"] == c]["cases"].sum()) for c in CATEGORIES}
        total = sum(cats.values())
        # risk index = mean(risk_index) weighted by cases (proxy)
        risk = float(sub["risk_index"].mean()) if len(sub) else 0.0
        rows.append({
            "district": d,
            "cybercrime": cats["cybercrime"],
            "women_safety": cats["women_safety"],
            "violent_crime": cats["violent_crime"],
            "property_crime": cats["property_crime"],
            "total": total,
            "risk_index": round(_safe_float(risk), 2),
        })
    rows.sort(key=lambda r: r["total"], reverse=True)
    # safety scores from precomputed
    safety = SAFETY_DF.set_index("district").to_dict(orient="index")
    for r in rows:
        s = safety.get(r["district"], {})
        r["safety_score"] = _safe_float(s.get("safety_score"))
        r["safety_label"] = s.get("safety_label", "—")
    return {"rows": rows}


@api_router.get("/signal-feed")
async def signal_feed(
    limit: int = Query(40, le=200),
    category: Optional[str] = Query("all"),
    zone: Optional[str] = Query("all"),
):
    df = _filter(REDDIT_DF, category, zone, None).copy()
    df = df.sort_values("date", ascending=False).head(limit)
    items = []
    for _, r in df.iterrows():
        text = str(r.get("text", "")).strip()
        if len(text) > 280:
            text = text[:277] + "…"
        items.append({
            "category": r.get("category", ""),
            "zone": r.get("zone", "Unlocated"),
            "date": str(r.get("date", "")),
            "text": text,
        })
    return {"items": items, "count": len(items), "total": int(len(REDDIT_DF))}


@api_router.get("/detection-rates")
async def detection_rates():
    out = {}
    for c in CATEGORIES:
        sub = CRIME_DF[CRIME_DF["crime_category"] == c]["detection_rate"].dropna()
        out[c] = round(float(sub.mean()), 1) if len(sub) else 0.0
    return {"rates": out}


@api_router.get("/zone-mentions")
async def zone_mentions():
    counts = REDDIT_DF["zone"].fillna("Unlocated").value_counts().to_dict()
    # Ensure all districts present
    items = []
    for z in ["Unlocated"] + DISTRICTS:
        items.append({"zone": z, "count": int(counts.get(z, 0))})
    return {"items": items}


@api_router.get("/predictions")
async def predictions():
    out = []
    for _, r in PRED_DF.iterrows():
        out.append({
            "district": r["district"],
            "category": r["category"],
            "predicted_2025": int(r["predicted_2025"]),
            "trend": r["trend"],
        })
    return {"items": out}


# --- App wiring ------------------------------------------------------------
app.include_router(api_router)
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s %(message)s")
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
