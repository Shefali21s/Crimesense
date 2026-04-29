import React from "react";
import { Database, MessageSquare, AlertTriangle, ShieldCheck } from "lucide-react";
import { fmt, CAT_LABEL } from "../lib/api";

function Kpi({ label, value, sub, accent, icon: Icon }) {
  return (
    <div className="panel p-6 reveal relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div className="label-mono">{label}</div>
        <Icon size={16} className="text-white/35" />
      </div>
      <div className="serif mt-3 text-[58px] leading-none" style={{ color: accent }}>{value}</div>
      <div className="label-mono mt-3">{sub}</div>
      <div aria-hidden className="absolute -bottom-12 -right-10 w-40 h-40 rounded-full opacity-[0.06]" style={{ background: accent }} />
    </div>
  );
}

export default function Hero({ overview }) {
  if (!overview) return null;
  const top = overview.top_underreported || {};
  return (
    <section className="max-w-[1480px] mx-auto px-8 pt-16 pb-12 grid-bg">
      <div className="label-mono text-[var(--cyan)]">// forensic overview</div>
      <h1 className="serif mt-6 text-[68px] md:text-[92px] leading-[1.02] tracking-tight max-w-[1100px]">
        The gap between <span className="text-[var(--cyan)] italic">official reports</span>
        <br />
        and the <span className="text-[var(--green)] italic">digital signal</span>.
      </h1>
      <p className="mt-6 max-w-[680px] text-white/65 text-[15px] leading-relaxed">
        CrimeSense compares Bengaluru police records with NLP-classified Reddit chatter to surface categories and
        zones where lived experience outpaces what the system records.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
        <Kpi
          label="official cases"
          value={fmt(overview.official_cases)}
          sub={`${overview.year_range[0]}–${overview.year_range[1]} • ${overview.districts_count} districts`}
          accent="#38bdf8"
          icon={Database}
        />
        <Kpi
          label="digital signals"
          value={fmt(overview.digital_signals)}
          sub={`${overview.digital_signals} reddit posts NLP-classified`}
          accent="#34d399"
          icon={MessageSquare}
        />
        <Kpi
          label="top underreported"
          value={top.label || "—"}
          sub={`${top.per_1k ?? 0}× digital / 1k official`}
          accent="#fb923c"
          icon={AlertTriangle}
        />
        <Kpi
          label="avg detection rate"
          value={`${overview.avg_detection_rate}%`}
          sub="across all categories"
          accent="#ffffff"
          icon={ShieldCheck}
        />
      </div>
    </section>
  );
}
