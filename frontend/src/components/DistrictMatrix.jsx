import React from "react";
import { MapPin } from "lucide-react";
import { fmt } from "../lib/api";

function heatColor(v, max) {
  if (!max) return "rgba(255,255,255,0.04)";
  const t = Math.min(1, v / max);
  // green -> yellow -> orange -> red
  const stops = [
    [t < 0.34, [52, 211, 153]],
    [t < 0.55, [251, 191, 36]],
    [t < 0.78, [251, 146, 60]],
    [true, [239, 68, 68]],
  ];
  const c = stops.find((s) => s[0])[1];
  const a = 0.18 + t * 0.6;
  return `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${a})`;
}

export default function DistrictMatrix({ data }) {
  const rows = data?.rows || [];
  const cols = ["cybercrime", "women_safety", "violent_crime", "property_crime"];
  const colLabels = ["cybercrime", "women", "violent", "property"];
  const maxes = cols.map((c) => Math.max(...rows.map((r) => r[c] || 0), 1));
  const maxRisk = Math.max(...rows.map((r) => r.risk_index || 0), 1);

  return (
    <div className="panel p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-[var(--orange)]" />
          <div className="panel-title">District Risk Matrix</div>
        </div>
        <div className="label-mono">// 7 zones × 4 categories</div>
      </div>

      <div className="mt-6 grid grid-cols-14 label-mono gap-2" style={{ gridTemplateColumns: "1.6fr 1fr 1fr 1fr 1fr 1fr 1fr" }}>
        <div>district</div>
        {colLabels.map((l) => (<div key={l} className="text-center">{l}</div>))}
        <div className="text-right">total</div>
        <div className="text-right">risk</div>
      </div>

      <div className="mt-3 space-y-2">
        {rows.map((r) => (
          <div key={r.district} className="grid items-center gap-2" style={{ gridTemplateColumns: "1.6fr 1fr 1fr 1fr 1fr 1fr 1fr" }}>
            <div className="font-semibold">{r.district}</div>
            {cols.map((c, i) => (
              <div key={c}>
                <div className="heat" style={{ background: heatColor(r[c], maxes[i]), color: "rgba(255,255,255,0.95)" }}>{fmt(r[c])}</div>
              </div>
            ))}
            <div className="text-right mono text-[var(--cyan)]">{fmt(r.total)}</div>
            <div className="text-right mono" style={{ color: r.risk_index > 12 ? "#ef4444" : r.risk_index > 6 ? "#fb923c" : "#34d399" }}>{r.risk_index?.toFixed(2)}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-3">
        <div className="label-mono">intensity</div>
        <div className="flex-1 h-2 rounded-sm" style={{ background: "linear-gradient(90deg,#34d399,#fbbf24,#fb923c,#ef4444)" }} />
        <div className="label-mono">low → critical</div>
      </div>
    </div>
  );
}
