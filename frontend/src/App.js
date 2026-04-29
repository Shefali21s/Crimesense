import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Filters from "./components/Filters";
import UnderreportingSpectrum from "./components/UnderreportingSpectrum";
import CategoryMix from "./components/CategoryMix";
import TemporalChart from "./components/TemporalChart";
import DistrictMatrix from "./components/DistrictMatrix";
import SignalFeed from "./components/SignalFeed";
import DetectionRates from "./components/DetectionRates";
import Methodology from "./components/Methodology";
import Footer from "./components/Footer";
import { api } from "./lib/api";

function App() {
  const [meta, setMeta] = useState(null);
  const [filters, setFilters] = useState({ category: "all", zone: "all", year: 0 });
  const [overview, setOverview] = useState(null);
  const [spectrum, setSpectrum] = useState(null);
  const [temporal, setTemporal] = useState(null);
  const [matrix, setMatrix] = useState(null);
  const [feed, setFeed] = useState(null);
  const [rates, setRates] = useState(null);
  const [mentions, setMentions] = useState(null);

  useEffect(() => {
    api.meta().then(setMeta).catch(console.error);
    api.detectionRates().then(setRates).catch(console.error);
    api.zoneMentions().then(setMentions).catch(console.error);
  }, []);

  useEffect(() => {
    const params = filters;
    api.overview(params).then(setOverview).catch(console.error);
    api.spectrum({ zone: params.zone, year: params.year }).then(setSpectrum).catch(console.error);
    api.temporal({ category: params.category, zone: params.zone }).then(setTemporal).catch(console.error);
    api.districtMatrix({ year: params.year }).then(setMatrix).catch(console.error);
    api.signalFeed({ category: params.category, zone: params.zone, limit: 40 }).then(setFeed).catch(console.error);
  }, [filters.category, filters.zone, filters.year]);

  const yearRange = useMemo(() => meta?.year_range || [2021, 2024], [meta]);

  return (
    <div className="App">
      <Header yearRange={yearRange} />
      <Hero overview={overview} />
      <Filters meta={meta} value={filters} onChange={setFilters} />

      <section className="max-w-[1480px] mx-auto px-8 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2"><UnderreportingSpectrum data={spectrum} /></div>
        <div className="lg:col-span-1"><CategoryMix data={spectrum} /></div>
      </section>

      <section className="max-w-[1480px] mx-auto px-8 mt-5">
        <TemporalChart data={temporal} range={yearRange} />
      </section>

      <section className="max-w-[1480px] mx-auto px-8 mt-5 grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2"><DistrictMatrix data={matrix} /></div>
        <div className="lg:col-span-1"><SignalFeed data={feed} /></div>
      </section>

      <section className="max-w-[1480px] mx-auto px-8 mt-5">
        <DetectionRates rates={rates?.rates} mentions={mentions} />
      </section>

      <Methodology />
      <Footer />
    </div>
  );
}

export default App;
