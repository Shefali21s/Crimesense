<<<<<<< HEAD
# CrimeSense — Underreporting Intelligence · Bengaluru

> **Author:** Shefali  
> **Type:** Academic Project  
> **Stack:** Python · FastAPI · React · Pandas · scikit-learn

A forensic analytics dashboard that compares **official Bengaluru City Police crime records (2021–2024)** with **NLP-classified Reddit chatter** to detect where real-world crime goes unreported in official statistics.

---

## Project Architecture

```
CrimeSense/
│
├── data/
│   ├── raw/                          # Original source files
│   │   └── CrimeSense_Bangalore_Dataset.xlsx   (213 raw Reddit posts)
│   │
│   └── processed/                    # Pipeline outputs (ready to use)
│       ├── crimesense_clean.csv       462 rows · 14 features · 2021-2024
│       ├── reddit_final.csv           187 posts · cleaned + zone-tagged
│       ├── district_safety_scores.csv 7 districts · safety score 0-100
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
│   └── requirements.txt              Python dependencies for scripts
│
├── backend/                          # FastAPI REST API
│   ├── server.py                      All endpoints · loads CSVs at startup
│   ├── requirements.txt              Python dependencies for backend
│   ├── .env.example                  Copy to .env and fill in values
│   └── data/                         Copy of processed CSVs for API to read
│       ├── crimesense_clean.csv
│       ├── reddit_final.csv
│       ├── district_safety_scores.csv
│       └── predictions_2025.csv
│
└── frontend/                         # React dashboard (dark analytics UI)
    ├── src/
    │   ├── App.js                     Root component + data fetching
    │   ├── components/
    │   │   ├── Header.jsx             Top navigation bar
    │   │   ├── Hero.jsx               KPI cards
    │   │   ├── Filters.jsx            Category / zone / year dropdowns
    │   │   ├── UnderreportingSpectrum.jsx  Official vs digital bar chart
    │   │   ├── CategoryMix.jsx        Donut chart · category split
    │   │   ├── TemporalChart.jsx      Year-over-year trend lines
    │   │   ├── DistrictMatrix.jsx     7×4 risk heatmap
    │   │   ├── SignalFeed.jsx         Live Reddit post feed
    │   │   ├── DetectionRates.jsx     Detection rate bars
    │   │   ├── Methodology.jsx        Pipeline explanation
    │   │   └── Footer.jsx             Credits
    │   └── lib/
    │       └── api.js                 All API calls to backend
    ├── package.json
    └── .env.example                  Copy to .env and set backend URL
```

---

## How the Data Flows

```
Raw Sources
    │
    ├── BCP / NCRB PDFs ──────────────────────────────────────────────┐
    │                                                                  │
    └── Reddit r/bangalore (reddit_scrape.py) ──┐                     │
                                                │                     │
                                          fix_reddit logic      structured build
                                                │                     │
                                         reddit_final.csv    crimesense_clean.csv
                                                │                     │
                                                └──────┬──────────────┘
                                                       │
                                              run_pipeline.py
                                                       │
                           ┌───────────────────────────┼───────────────────────┐
                           │                           │                       │
                  district_safety_scores.csv   predictions_2025.csv   bengaluru_safety_map.html
                           │                           │
                           └───────────────────────────┘
                                         │
                                   backend/data/
                                         │
                                    FastAPI server.py
                                         │
                                    React Dashboard
```

---

## Quick Start — Run Locally

### Prerequisites

| Tool    | Version  | Download |
|---------|----------|----------|
| Python  | >= 3.10  | https://python.org |
| Node.js | >= 18    | https://nodejs.org |
| Yarn    | >= 1.22  | `npm install -g yarn` |

---

### Step 1 — Install Python dependencies

```bash
# For scripts/pipeline
cd scripts
pip install -r requirements.txt

# For backend
cd ../backend
pip install -r requirements.txt
```

---

### Step 2 — Set up the Backend

```bash
cd backend

# Copy .env file
copy .env.example .env        # Windows
# cp .env.example .env        # Mac/Linux

# Start the API server
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

API will be live at: http://localhost:8001  
Swagger docs at: http://localhost:8001/docs

---

### Step 3 — Set up the Frontend

Open a **second terminal:**

```bash
cd frontend

# Copy .env file
copy .env.example .env        # Windows
# cp .env.example .env        # Mac/Linux

# Install packages (first time only — takes ~2 minutes)
yarn install

# Start the dashboard
yarn start
```

Dashboard opens at: **http://localhost:3000**

---

### Step 4 — Generate the Safety Map (optional)

```bash
cd scripts
python generate_map.py
```

Opens `data/processed/bengaluru_safety_map.html` in your browser.

---

### Re-run the Full Pipeline (if you update data)

```bash
cd scripts
python run_pipeline.py
```

Then copy the new CSVs into `backend/data/` and restart the backend.

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/meta` | Filter options (categories, zones, years) |
| GET | `/api/overview` | Top-line KPI cards |
| GET | `/api/spectrum` | Official vs digital per category |
| GET | `/api/temporal` | Year-over-year crime trend |
| GET | `/api/district-matrix` | 7×4 risk heatmap data |
| GET | `/api/signal-feed` | Reddit post signal feed |
| GET | `/api/detection-rates` | Detection rate per category |
| GET | `/api/predictions` | 2025 ML predictions |

---

## Deployment (Free Hosting)

### Option A — Render.com (recommended, fully free)

**Backend:**
1. Push this repo to GitHub
2. Go to https://render.com → New → Web Service
3. Connect your GitHub repo
4. Set Root Directory: `backend`
5. Build Command: `pip install -r requirements.txt`
6. Start Command: `uvicorn server:app --host 0.0.0.0 --port $PORT`
7. Add Environment Variable: `MONGO_URL=mongodb://localhost:27017`

**Frontend:**
1. Go to Render → New → Static Site
2. Connect same GitHub repo
3. Set Root Directory: `frontend`
4. Build Command: `yarn install && yarn build`
5. Publish Directory: `build`
6. Add Environment Variable: `REACT_APP_BACKEND_URL=https://YOUR-BACKEND.onrender.com`

Your dashboard will be live at `https://YOUR-FRONTEND.onrender.com`

---

### Option B — Vercel (frontend) + Railway (backend)

**Backend on Railway:**
1. Go to https://railway.app → New Project → Deploy from GitHub
2. Set root to `backend/`
3. Start command: `uvicorn server:app --host 0.0.0.0 --port $PORT`
4. Copy the Railway URL

**Frontend on Vercel:**
1. Go to https://vercel.com → New Project → Import GitHub repo
2. Set root to `frontend/`
3. Framework: Create React App
4. Add env variable: `REACT_APP_BACKEND_URL=https://YOUR-RAILWAY-URL`

---

## Key Findings

- **North district** has the highest cybercrime growth rate (2021-2024)
- **Women safety incidents** are significantly underreported — Reddit signals are 3-5× higher relative to official cases
- **Central district** leads in violent crime despite moderate total case count
- Only **Central and Yelahanka** score as "Moderate" safety — all others are "High Risk"
- **2025 predictions** show continued cybercrime increase across all districts

---

## Data Sources

| Source | Description |
|--------|-------------|
| Bengaluru City Police (BCP) | District-wise crime statistics 2021-2024 |
| NCRB | National Crime Records Bureau annual reports |
| Reddit r/bangalore | Scraped posts — NLP classified into 4 categories |

---

*CrimeSense · Academic Project · Shefali · 2024*
=======
# Crimesense
>>>>>>> 38cf5c1be686fae31b9fc4a98ca0c5cb48dde2ba
