import React from "react";
import { Crosshair, Activity } from "lucide-react";

export default function Header({ yearRange = [2021, 2024] }) {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-black/60 border-b border-white/5">
      <div className="max-w-[1480px] mx-auto px-8 h-[68px] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-sm border border-white/15 flex items-center justify-center text-[var(--cyan)]">
            <Crosshair size={16} strokeWidth={1.6} />
          </div>
          <div className="flex flex-col leading-tight">
            <div className="font-semibold tracking-[0.04em] text-white text-[15px]">
              CRIMESENSE<span className="text-[var(--cyan)]">.</span>
            </div>
            <div className="label-mono">underreporting intelligence&nbsp;//&nbsp;Bengaluru</div>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-7">
          <div className="label-mono text-white/50">
            by&nbsp;<span className="text-[var(--cyan)]">Shefali</span>
          </div>
          <div className="flex items-center gap-2 label-mono">
            <span className="live-dot" />
            <span>signal&nbsp;//&nbsp;active</span>
          </div>
          <div className="flex items-center gap-2 label-mono">
            <Activity size={13} className="text-[var(--green)]" />
            <span className="text-white/80">{yearRange[0]} &mdash; {yearRange[1]}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
