import React from "react";
import { Radio } from "lucide-react";
import { CAT_COLOR } from "../lib/api";

export default function SignalFeed({ data }) {
  const items = data?.items || [];
  return (
    <div className="panel p-6 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Radio size={16} className="text-[var(--green)]" />
          <div className="panel-title">Live Signal Feed</div>
        </div>
        <div className="label-mono flex items-center gap-2">
          <span className="live-dot" /> {data?.count}/{data?.total}
        </div>
      </div>
      <div className="label-mono mt-3 text-white/40">$ tail -f reddit_classifier.log</div>
      <div className="mt-4 space-y-5 overflow-y-auto scroll pr-2" style={{ maxHeight: 540 }}>
        {items.map((it, i) => (
          <div key={i} className="reveal">
            <div className="flex items-center gap-3 label-mono">
              <span style={{ color: CAT_COLOR[it.category] || "#fff" }}>[{(it.category || "").replace("_", " ")}]</span>
              <span className="text-white/30">·</span>
              <span className="text-white/55">{it.zone || "unlocated"}</span>
              <span className="flex-1" />
              <span className="text-white/35">{(it.date || "").slice(0, 10)}</span>
            </div>
            <p className="mt-2 text-[13.5px] leading-relaxed text-white/80">{it.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
