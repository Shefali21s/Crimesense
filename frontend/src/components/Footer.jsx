import React from "react";

export default function Footer() {
  return (
    <footer className="max-w-[1480px] mx-auto px-8 mt-16 mb-10">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pt-6 border-t border-white/5">
        <div className="label-mono">CrimeSense · Underreporting Intelligence · v1.0</div>
        <div className="label-mono">
          Built by <span className="text-[var(--cyan)]">Shefali</span> · Bengaluru · 2021–2024 · Academic Project
        </div>
      </div>
    </footer>
  );
}
