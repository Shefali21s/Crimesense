# 🔍 CrimeSense — Crime Underreporting Intelligence · Bengaluru

> **Type:** Academic Project
> **Stack:** Python · FastAPI · React · Pandas · scikit-learn

A forensic analytics dashboard that compares **official Bengaluru City Police crime records (2021–2024)** with **NLP-classified Reddit chatter** to surface where real-world crime goes unreported in official statistics.

---

## 🌐 Live Links

| Service | URL |
|---|---|
| 📊 Live Dashboard | [crimesense-frontend.onrender.com](https://crimesense-frontend.onrender.com) |
| ⚙️ Backend API | [crimesense-5tf9.onrender.com](https://crimesense-5tf9.onrender.com) |
| 📖 API Docs (Swagger) | [crimesense-5tf9.onrender.com/docs](https://crimesense-5tf9.onrender.com/docs) |

> **Note:** Both services are hosted on Render's free tier. The first request may take ~30 seconds to wake up from sleep.

---

## ✨ Features

- 📈 **Year-over-year crime trend** analysis (2021–2024)
- 🗺️ **District-level risk heatmap** across 7 Bengaluru districts
- 🤖 **2025 ML crime forecasts** using linear regression
- 📱 **Reddit signal feed** — NLP-classified posts from r/bangalore
- 🚨 **Underreporting gap analysis** — official records vs. digital chatter
- 🧮 **Safety scores** (0–100) per district and category
- 🔍 **Interactive filters** by category, zone, and year

---

## 🏗️ Project Architecture

```
CrimeSense/
│
├── data/
│   ├── raw/                          # Original source files
│   │   └── CrimeSense_Bangalore_Dataset.xlsx   (213 raw Reddit posts)
│   │
│   └── processed/                    # Pipeline outputs (ready to use)
│       ├── crimesense_clean.csv       462 rows · 14 features · 2021–2024
│       ├── reddit_final.csv           187 posts · cleaned + zone-tagged
│       ├── district_safety_scores.csv 7 districts · safety score 0–100
│       ├── predictions_2025.csv       28 ML predictions · district × category
│       ├── bengaluru_safety_map.html  Interactive Folium map
│       └── prediction_2025.png        Prediction chart
│
├── notebooks/                        # Jupyter analysis (open in order)
│   ├── 01_data_cleaning.ipynb         Structured data build + feature engineering
│   ├── 03_prediction_model.ipynb      Linear regression · 2025 forecasts
│   └── 04_comparison_analysis.ipynb   Official vs Reddit underreporting gap
│
├── scripts/                          # Standalone Python scripts
│   ├── run_pipeline.py                Master script — regenerates all CSVs
│   ├── reddit_scrape.py               Scrapes r/bangalore (no API key needed)
│   ├── generate_map.py                Builds Folium HTML safety map
│   └── requirements.txt
│
├── backend/                          # FastAPI REST API
│   ├── server.py                      All endpoints · loads CSVs at startup
│   ├── requirements.txt
│   ├── .env.example
│   └── data/                         Copy of processed CSVs for API
│       ├── crimesense_clean.csv
│       ├── reddit_final.csv
│       ├── district_safety_scores.csv
│       └── predictions_2025.csv
│
└── frontend/                         # React dashboard (dark analytics UI)
    ├── src/
    │   ├── App.js
    │   └── components/
    │       ├── Header.jsx
    │       ├── Hero.jsx               KPI cards
    │       ├── Filters.jsx            Category / zone / year dropdowns
    │       ├── UnderreportingSpectrum.jsx
    │       ├── CategoryMix.jsx        Donut chart
    │       ├── TemporalChart.jsx      Year-over-year trend lines
    │       ├── DistrictMatrix.jsx     7×4 risk heatmap
    │       ├── SignalFeed.jsx         Live Reddit post feed
    │       ├── DetectionRates.jsx
    │       ├── Methodology.jsx
    │       └── Footer.jsx
    └── package.json
```

---

## 🔄 Data Flow

```
Raw Sources
    │
    ├── BCP / NCRB PDFs ──────────────────────────────────────────────┐
    │                                                                  │
    └── Reddit r/bangalore (reddit_scrape.py) ──┐                     │
                                                │                     │
                                          NLP Classification    Structured Build
                                                │                     │
                                         reddit_final.csv    crimesense_clean.csv
                                                │                     │
                                                └──────┬──────────────┘
                                                       │
                                              run_pipeline.py
                                                       │
                     ┌─────────────────────────────────┼───────────────────────┐
                     │                                 │                       │
            district_safety_scores.csv      predictions_2025.csv   safety_map.html
                     │                                 │
                     └─────────────────────────────────┘
                                       │
                                 backend/data/
                                       │
                                FastAPI server.py
                                       │
                               React Dashboard
```

---

## 🚀 Quick Start — Run Locally

### Prerequisites

| Tool | Version | Install |
|---|---|---|
| Python | >= 3.10 | [python.org](https://python.org) |
| Node.js | >= 18 | [nodejs.org](https://nodejs.org) |
| Yarn | >= 1.22 | `npm install -g yarn` |

---

### Step 1 — Install Python dependencies

```bash
# For scripts / pipeline
cd scripts
pip install -r requirements.txt

# For backend
cd ../backend
pip install -r requirements.txt
```

### Step 2 — Start the Backend

```bash
cd backend

# Mac/Linux
cp .env.example .env

# Windows
copy .env.example .env

uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

- API live at: http://localhost:8001
- Swagger docs at: http://localhost:8001/docs

### Step 3 — Start the Frontend

Open a **second terminal:**

```bash
cd frontend

# Mac/Linux
cp .env.example .env

# Windows
copy .env.example .env

yarn install   # First time only (~2 mins)
yarn start
```

Dashboard opens at: **http://localhost:3000**

### Step 4 — Generate Safety Map (optional)

```bash
cd scripts
python generate_map.py
# Opens data/processed/bengaluru_safety_map.html
```

### Re-run the Full Pipeline

If you update or add data:

```bash
cd scripts
python run_pipeline.py
# Then copy new CSVs into backend/data/ and restart the backend
```

---

## 📡 API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/meta` | Filter options (categories, zones, years) |
| GET | `/api/overview` | Top-line KPI cards |
| GET | `/api/spectrum` | Official vs digital per category |
| GET | `/api/temporal` | Year-over-year crime trend |
| GET | `/api/district-matrix` | 7×4 risk heatmap data |
| GET | `/api/signal-feed` | Reddit post signal feed |
| GET | `/api/detection-rates` | Detection rate per category |
| GET | `/api/predictions` | 2025 ML predictions |

Full interactive docs available at the [live Swagger UI](https://crimesense-5tf9.onrender.com/docs).

---

## 🧠 Key Findings

- **North district** has the highest cybercrime growth rate (2021–2024)
- **Women's safety incidents** are significantly underreported — Reddit signals run 3–5× higher relative to official case counts
- **Central district** leads in violent crime despite a moderate total case count
- Only **Central and Yelahanka** score as "Moderate" safety — all other districts are rated "High Risk"
- **2025 predictions** indicate continued cybercrime increases across all districts

---

## 📊 Data Sources

| Source | Description |
|---|---|
| Bengaluru City Police (BCP) | District-wise crime statistics, 2021–2024 |
| NCRB | National Crime Records Bureau annual reports |
| Reddit r/bangalore | Scraped posts, NLP-classified into 4 crime categories |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Data Processing | Python, Pandas, scikit-learn |
| NLP Classification | Python (custom classifier) |
| Backend API | FastAPI, Uvicorn |
| Frontend | React, Recharts |
| Maps | Folium |
| Hosting | Render.com (free tier) |

---

## ☁️ Deployment

Both services are deployed on **Render.com** (free tier).

**Backend (Web Service)**
- Root Directory: `backend`
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn server:app --host 0.0.0.0 --port $PORT`

**Frontend (Static Site)**
- Root Directory: `frontend`
- Build Command: `yarn install && yarn build`
- Publish Directory: `build`
- Environment Variable: `REACT_APP_BACKEND_URL=https://crimesense-5tf9.onrender.com`

---

## 📁 Languages

![Jupyter Notebook]
![JavaScript]
![Python]

---

*CrimeSense · Academic Project ·*
