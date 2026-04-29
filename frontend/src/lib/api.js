import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const inst = axios.create({ baseURL: API, timeout: 20000 });

export const api = {
  meta: () => inst.get("/meta").then((r) => r.data),
  overview: (params) => inst.get("/overview", { params }).then((r) => r.data),
  spectrum: (params) => inst.get("/spectrum", { params }).then((r) => r.data),
  temporal: (params) => inst.get("/temporal", { params }).then((r) => r.data),
  districtMatrix: (params) => inst.get("/district-matrix", { params }).then((r) => r.data),
  signalFeed: (params) => inst.get("/signal-feed", { params }).then((r) => r.data),
  detectionRates: () => inst.get("/detection-rates").then((r) => r.data),
  zoneMentions: () => inst.get("/zone-mentions").then((r) => r.data),
  predictions: () => inst.get("/predictions").then((r) => r.data),
};

export const CAT_COLOR = {
  violent_crime: "#fb923c",
  women_safety: "#34d399",
  cybercrime: "#38bdf8",
  property_crime: "#f472b6",
};

export const CAT_LABEL = {
  violent_crime: "Violent Crime",
  women_safety: "Women Safety",
  cybercrime: "Cybercrime",
  property_crime: "Property Crime",
};

export const fmt = (n) => (n ?? 0).toLocaleString("en-IN");
