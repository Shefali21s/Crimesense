import React from "react";
import { TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

export default function TemporalChart({ data, range = [2021, 2024] }) {
  const series = data?.series || [];
  return (
    <div className="panel p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp size={16} className="text-[var(--cyan)]" />
          <div className="panel-title">Temporal Signal vs Record</div>
        </div>
        <div className="label-mono">// all categories · {range[0]}–{range[1]}</div>
      </div>
      <div className="mt-6 h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={series} margin={{ top: 10, right: 50, left: 10, bottom: 20 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="year" stroke="rgba(255,255,255,0.4)" tick={{ fontFamily: "JetBrains Mono", fontSize: 11 }} tickLine={false} axisLine={{ stroke: "rgba(255,255,255,0.1)" }} />
            <YAxis yAxisId="left" stroke="rgba(255,255,255,0.4)" tick={{ fontFamily: "JetBrains Mono", fontSize: 10 }} tickLine={false} axisLine={false} label={{ value: "OFFICIAL", angle: -90, position: "insideLeft", style: { fill: "rgba(255,255,255,0.45)", fontFamily: "JetBrains Mono", fontSize: 10, letterSpacing: 2 } }} />
            <YAxis yAxisId="right" orientation="right" stroke="rgba(255,255,255,0.4)" tick={{ fontFamily: "JetBrains Mono", fontSize: 10 }} tickLine={false} axisLine={false} label={{ value: "DIGITAL", angle: 90, position: "insideRight", style: { fill: "rgba(255,255,255,0.45)", fontFamily: "JetBrains Mono", fontSize: 10, letterSpacing: 2 } }} />
            <Tooltip contentStyle={{ background: "#0c0e11", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 2, fontFamily: "JetBrains Mono", fontSize: 12 }} cursor={{ stroke: "rgba(56,189,248,0.25)" }} />
            <Legend wrapperStyle={{ fontFamily: "JetBrains Mono", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.6)" }} iconType="square" />
            <Line yAxisId="left" type="monotone" dataKey="official" name="OFFICIAL" stroke="#38bdf8" strokeWidth={2} dot={{ r: 4, fill: "#38bdf8" }} activeDot={{ r: 6 }} />
            <Line yAxisId="right" type="monotone" dataKey="digital" name="DIGITAL" stroke="#34d399" strokeWidth={2} strokeDasharray="6 4" dot={{ r: 4, fill: "#34d399" }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
