import React from "react";
import { PieChart } from "lucide-react";
import { CAT_COLOR } from "../lib/api";

function StackBar({ rows, totalKey, label, totalLabel }) {
  const total = rows.reduce((a, r) => a + r[totalKey], 0) || 1;
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="label-mono">{label}</div>
        <div className="mono text-[13px] text-white/85">{totalLabel}</div>
      </div>
      <div className="mt-2 h-2.5 rounded-sm overflow-hidden flex">
        {rows.map((r) => (
          <div key={r.category} className="h-full" style={{ width: `${(r[totalKey] / total) * 100}%`, background: CAT_COLOR[r.category] }} />
        ))}
      </div>
    </div>
  );
}

export default function CategoryMix({ data }) {
  const rows = data?.rows || [];
  const totalOff = rows.reduce((a, r) => a + r.official, 0);
  const totalDig = rows.reduce((a, r) => a + r.digital, 0);
  return (
    <div className="panel p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PieChart size={16} className="text-[var(--green)]" />
          <div className="panel-title">Category Mix</div>
        </div>
        <div className="label-mono">// shares</div>
      </div>
      <div className="mt-6 space-y-5">
        <StackBar rows={rows} totalKey="official" label="official cases" totalLabel={totalOff.toLocaleString()} />
        <StackBar rows={rows} totalKey="digital" label="digital mentions" totalLabel={totalDig.toLocaleString()} />
      </div>
      <div className="mt-7 divide-y divide-white/5">
        {rows.map((r) => (
          <div key={r.category} className="flex items-center py-3">
            <span className="w-3 h-3 rounded-sm mr-3" style={{ background: CAT_COLOR[r.category] }} />
            <span className="flex-1 font-semibold">{r.label}</span>
            <div className="grid grid-cols-3 gap-6 text-right mono text-[12px]">
              <span className="text-[var(--cyan)] w-14">{r.official_share.toFixed(1)}%</span>
              <span className="text-[var(--green)] w-14">{r.digital_share.toFixed(1)}%</span>
              <span className={"w-14 " + (r.delta >= 0 ? "text-[var(--orange)]" : "text-white/45")}>
                {r.delta >= 0 ? "+" : ""}{r.delta.toFixed(1)}%
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="label-mono mt-4 text-white/40">
        Δ &gt; 0 → overrepresented online vs official record (signal of attention, potential under-reporting).
      </div>
    </div>
  );
}
