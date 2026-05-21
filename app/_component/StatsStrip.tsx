"use client";

import { useState } from "react";

const STATS = [
  {
    value: "50K+",
    label: "Students",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
      </svg>
    ),
    color: "text-teal-600",
    bg: "bg-teal-50",
  },
  {
    value: "1,200",
    label: "Live Classes/mo",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
      </svg>
    ),
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    value: "34%",
    label: "Avg Score Lift",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
      </svg>
    ),
    color: "text-orange-500",
    bg: "bg-orange-50",
  },
];

export default function StatsStrip() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-8 py-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 grid grid-cols-3 divide-x divide-slate-100">
        {STATS.map((s, i) => (
          <div
            key={s.label}
            className={`
              flex items-center gap-4 px-6 py-5 cursor-default
              transition-all duration-200
              ${hovered === i ? "bg-slate-50" : ""}
              ${i === 0 ? "rounded-l-2xl" : ""}
              ${i === STATS.length - 1 ? "rounded-r-2xl" : ""}
            `}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <div className={`w-11 h-11 rounded-xl ${s.bg} ${s.color} flex items-center justify-center flex-shrink-0 transition-transform duration-200 ${hovered === i ? "scale-110" : ""}`}>
              {s.icon}
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-800 leading-none">{s.value}</p>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">{s.label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}