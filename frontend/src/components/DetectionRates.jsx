import React from "react";
import { ShieldCheck } from "lucide-react";
import { CAT_COLOR, CAT_LABEL } from "../lib/api";

export default function DetectionRates({ rates, mentions }) {
  const order = ["cybercrime", "women_safety", "violent_crime", "property_crime"];
  return (
    <div className="panel p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-[var(--cyan)]" />
          <div className="panel-title">Detection Rate · Reddit Mentions</div>
        </div>
        <div className="label-mono">// case clearance + zone signal</div>
      </div>
      <div className="label-mono mt-5">avg detection rate (case clearance) by category</div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-3">
        {order.map((c) => {
          const v = rates?.[c] ?? 0;
          return (
            <div key={c} className="panel p-4">
              <div className="label-mono">{CAT_LABEL[c]}</div>
              <div className="serif text-[36px] mt-2" style={{ color: CAT_COLOR[c] }}>{v}%</div>
              <div className="bar-track mt-3"><div className="bar-fill" style={{ width: `${Math.min(100, v)}%`, background: CAT_COLOR[c] }} /></div>
            </div>
          );
        })}
      </div>
      <div className="label-mono mt-7">reddit mentions by zone (NLP-extracted)</div>
      <div className="flex flex-wrap gap-2 mt-3">
        {(mentions?.items || []).map((m) => (
          <div key={m.zone} className="chip">
            <span>{m.zone}</span>
            <span className="text-[var(--green)] mono">{m.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
