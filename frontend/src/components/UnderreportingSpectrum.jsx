import React from "react";
import { Scale } from "lucide-react";
import { CAT_COLOR, fmt } from "../lib/api";

export default function UnderreportingSpectrum({ data }) {
  const rows = data?.rows || [];
  const max = data?.max_per_1k || 1;
  return (
    <div className="panel p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Scale size={16} className="text-[var(--orange)]" />
          <div className="panel-title">Underreporting Spectrum</div>
        </div>
        <div className="label-mono">// official vs digital</div>
      </div>
      <div className="mt-6 grid grid-cols-12 label-mono px-1">
        <div className="col-span-3">category</div>
        <div className="col-span-2 text-right">official</div>
        <div className="col-span-2 text-right">digital</div>
        <div className="col-span-2 text-right">per 1k</div>
        <div className="col-span-3 pl-4">signal intensity</div>
      </div>
      <div className="mt-3 divide-y divide-white/5">
        {rows.map((r, i) => (
          <div key={r.category} className="grid grid-cols-12 items-center py-4 px-1">
            <div className="col-span-3 flex items-center gap-3">
              <span className="label-mono text-white/35">{String(i + 1).padStart(2, "0")}</span>
              <span className="font-semibold">{r.label}</span>
            </div>
            <div className="col-span-2 text-right mono text-[var(--cyan)]">{fmt(r.official)}</div>
            <div className="col-span-2 text-right mono text-[var(--green)]">{fmt(r.digital)}</div>
            <div className="col-span-2 text-right mono" style={{ color: CAT_COLOR[r.category] }}>{r.per_1k.toFixed(2)}</div>
            <div className="col-span-3 pl-4">
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${Math.min(100, (r.per_1k / (max || 1)) * 100)}%`, background: CAT_COLOR[r.category] }} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex gap-4 text-[12px] text-white/55">
        <span className="label-mono">reading:</span>
        <span>Higher <span className="mono text-[var(--orange)]">per 1k</span> = stronger digital chatter relative to recorded cases. Used as a proxy for under-reporting pressure.</span>
      </div>
    </div>
  );
}
