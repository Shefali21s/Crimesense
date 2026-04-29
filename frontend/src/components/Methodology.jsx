import React from "react";
import { Database, Filter, Cpu, Compass, Scale, Code2 } from "lucide-react";

const STEPS = [
  { n: "01", title: "Ingest", icon: Database, body: "Collected Reddit r/bangalore posts via web scraping + Bengaluru City Police district-wise crime stats 2021–2024 (NCRB + BCP official records)." },
  { n: "02", title: "Clean", icon: Filter, body: "Standardized 9 messy Reddit categories into 4 canonical ones. Removed 'other' and unknown entries. Fixed date parsing with UTC timezone normalization." },
  { n: "03", title: "Classify", icon: Cpu, body: "Rule-based NLP classifier maps post text to 4 categories: cybercrime, women_safety, violent_crime, property_crime using keyword matching." },
  { n: "04", title: "Geo-extract", icon: Compass, body: "Locality keyword dictionary maps area names to zones (Whitefield→East, Koramangala/Indiranagar→Central, Jayanagar/BTM→South…)." },
  { n: "05", title: "Compare", icon: Scale, body: "Aggregate digital mentions per category and zone, compute digital-per-1k-official ratio to surface underreporting gaps." },
  { n: "06", title: "Predict", icon: Code2, body: "Linear regression model trained on 2021–2024 data predicts 2025 case counts per district and category. Risk index computed from severity and growth rate." },
];

export default function Methodology() {
  return (
    <section className="max-w-[1480px] mx-auto px-8 mt-12">
      <div className="panel p-8 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="panel-title flex items-center gap-2"><Cpu size={16} className="text-[var(--cyan)]" /> Methodology · NLP Pipeline</div>
          <div className="label-mono">v1.0 // 187 posts · 462 official records</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-7">
          {STEPS.map((s) => (
            <div key={s.n} className="border border-white/10 rounded-sm p-5 bg-white/[0.012] hover:border-[var(--cyan)]/30 transition-colors">
              <div className="flex items-center justify-between">
                <div className="label-mono">step {s.n}</div>
                <s.icon size={16} className="text-white/35" />
              </div>
              <div className="panel-title mt-2">{s.title}</div>
              <p className="text-[13.5px] text-white/65 mt-2 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-6 border-t border-white/5">
          <div>
            <div className="label-mono">inputs</div>
            <div className="mono text-[12.5px] mt-2 text-white/80 leading-7">
              crimesense_clean.csv (462 rows)<br/>
              reddit_final.csv (187 posts)<br/>
              district_safety_scores.csv (7 districts)<br/>
              predictions_2025.csv (28 predictions)
            </div>
          </div>
          <div>
            <div className="label-mono">engine</div>
            <div className="mono text-[12.5px] mt-2 text-white/80">
              Python · Pandas · scikit-learn<br/>
              Linear Regression · Rule-based NLP<br/>
              Regex zone-extractor · Risk Index formula
            </div>
          </div>
          <div>
            <div className="label-mono">author note</div>
            <div className="text-[12.5px] mt-2 text-white/65 leading-relaxed">
              Built by Shefali as an academic project exploring the gap between official crime reporting and digital signals in Bengaluru. Reddit is not a representative sample — ratios indicate relative attention, not absolute underreporting.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
