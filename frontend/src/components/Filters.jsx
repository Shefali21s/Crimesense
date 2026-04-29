import React from "react";
import { Filter, RotateCcw } from "lucide-react";

export default function Filters({ meta, value, onChange }) {
  const cats = meta?.categories || [];
  const districts = meta?.districts || [];
  const years = meta?.years || [];
  const set = (k) => (e) => onChange({ ...value, [k]: e.target.value });
  const reset = () => onChange({ category: "all", zone: "all", year: 0 });

  return (
    <section className="max-w-[1480px] mx-auto px-8 mt-2">
      <div className="panel p-5 grid grid-cols-12 gap-5 items-end">
        <div className="col-span-12 md:col-span-3 flex items-center gap-3 self-center">
          <Filter size={16} className="text-[var(--cyan)]" />
          <div>
            <div className="label-mono">query</div>
            <div className="text-[15px] font-semibold tracking-tight">Cross-reference filters</div>
          </div>
        </div>
        <div className="col-span-12 md:col-span-3">
          <div className="label-mono mb-2">crime category</div>
          <select className="chip-select" value={value.category} onChange={set("category")}>
            <option value="all">ALL</option>
            {cats.map((c) => (<option key={c.id} value={c.id}>{c.label.toUpperCase()}</option>))}
          </select>
        </div>
        <div className="col-span-12 md:col-span-2">
          <div className="label-mono mb-2">zone</div>
          <select className="chip-select" value={value.zone} onChange={set("zone")}>
            <option value="all">ALL</option>
            {districts.map((d) => (<option key={d} value={d}>{d.toUpperCase()}</option>))}
          </select>
        </div>
        <div className="col-span-12 md:col-span-2">
          <div className="label-mono mb-2">year</div>
          <select className="chip-select" value={value.year} onChange={(e) => onChange({ ...value, year: parseInt(e.target.value) })}>
            <option value={0}>ALL</option>
            {years.map((y) => (<option key={y} value={y}>{y}</option>))}
          </select>
        </div>
        <div className="col-span-12 md:col-span-2 flex md:justify-end">
          <button onClick={reset} className="chip" aria-label="reset">
            <RotateCcw size={12} /> reset
          </button>
        </div>
      </div>
    </section>
  );
}
