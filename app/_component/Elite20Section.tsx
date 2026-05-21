"use client";

import { useState } from "react";

const WHY_ITEMS = [
  {
    icon: "👥",
    title: "Limited Seats, Maximum Attention",
    desc: "We don't believe in crowded classrooms. With only 20 students, your doubts are never ignored.",
    color: "bg-teal-50 text-teal-600",
    bar: "bg-teal-500",
  },
  {
    icon: "📚",
    title: "Comprehensive Coverage",
    desc: "From NCERT basics to advanced concepts like Cengage and R.S. Aggarwal.",
    color: "bg-indigo-50 text-indigo-600",
    bar: "bg-indigo-500",
  },
  {
    icon: "🎯",
    title: "Targeted Excellence",
    desc: "Specialized modules for Olympiads (DCO/ION) and IIT-JEE Foundation.",
    color: "bg-orange-50 text-orange-600",
    bar: "bg-orange-500",
  },
  {
    icon: "🏛️",
    title: "The MIT Pune Edge",
    desc: "Curriculum designed by a CS Engineer & UPSC Mains veteran with deep exam insight.",
    color: "bg-rose-50 text-rose-600",
    bar: "bg-rose-500",
  },
];

export default function Elite20Section() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="bg-slate-50 py-20 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Top Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left Text */}
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-teal-500 uppercase mb-4">
              Premium Mentorship
            </p>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight mb-6"
              style={{ fontFamily: "'Sora', 'DM Serif Display', Georgia, serif" }}
            >
              Join the{" "}
              <span className="text-teal-600 relative">
                Elite 20
                <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 120 8" fill="none">
                  <path d="M2 6 Q60 2 118 6" stroke="#f21300" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </span>
              <br />
              Where Top Performers
              <br />
              are{" "}
              <span className="text-red-500">Built.</span>
            </h2>
            <p className="text-slate-500 text-base leading-relaxed mb-8 max-w-md">
              Not just a class, but a high-performance mentorship program limited to 20 ambitious
              students per batch. Master Maths, Science, and Social Science for School, IIT-JEE
              Foundation, and Olympiads.
            </p>
            <button className="group inline-flex items-center gap-3 bg-red-600 text-white px-6 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 hover:bg-red-700 hover:shadow-lg hover:shadow-red-200 active:scale-95">
              Book Your Free Demo Session
              <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>

          {/* Right Orbital Graphic */}
          <div className="flex items-center justify-center">
            <div className="relative w-64 h-64">
              {/* Outer orbit */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-teal-200 animate-spin" style={{ animationDuration: "20s" }} />
              {/* Inner orbit */}
              <div className="absolute inset-6 rounded-full border border-teal-100" />

              {/* Center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-36 h-36 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex flex-col items-center justify-center text-white text-center shadow-xl shadow-teal-200">
                  <span className="text-3xl mb-1">🎓</span>
                  <span className="text-xs font-bold leading-tight px-4">Elite Learning Experience</span>
                </div>
              </div>

              {/* Orbiting dot */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-4 h-4 rounded-full bg-red-400 shadow-md shadow-red-200 border-2 border-white" />
              </div>
              <div className="absolute bottom-4 right-0">
                <div className="w-3 h-3 rounded-full bg-teal-400 border-2 border-white shadow" />
              </div>
            </div>
          </div>
        </div>

        {/* Why Elite 20 */}
        <div className="text-center mb-10">
          <h3 className="text-2xl font-extrabold text-slate-800">
            Why <span className="text-teal-600">"Elite 20"</span>?
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {WHY_ITEMS.map((item, i) => (
            <div
              key={item.title}
              className={`
                bg-white rounded-2xl p-5 border border-slate-100
                cursor-default transition-all duration-300
                ${hovered === i ? "shadow-lg -translate-y-1" : "shadow-sm"}
              `}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-4 ${item.color} transition-transform duration-200 ${hovered === i ? "scale-110" : ""}`}>
                {item.icon}
              </div>
              <h4 className="font-bold text-slate-800 text-sm mb-2 leading-snug">{item.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">{item.desc}</p>
              <div className="h-0.5 w-12 rounded-full bg-slate-100 overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${item.bar} ${hovered === i ? "w-full" : "w-0"}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}