"use client";

import { useState } from "react";
import HeroBadge from "./HeroBadge";
import CoursePreviewCard from "./CoursePreviewCard";

export default function HeroSection() {
  const [scrollHovered, setScrollHovered] = useState(false);

  return (
    <section className="relative overflow-hidden bg-white min-h-[90vh] flex items-center">
      {/* Background texture dots */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute right-0 top-0 w-1/2 h-full opacity-[0.035]"
          style={{
            backgroundImage: "radial-gradient(circle, #0d9488 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        {/* Gradient wash */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-100 rounded-full blur-3xl opacity-40 -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-100 rounded-full blur-3xl opacity-30 translate-y-1/3 -translate-x-1/4" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
        {/* Left */}
        <div className="flex flex-col">
          <HeroBadge />

          <h1
            className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight mb-6"
            style={{ fontFamily: "'Sora', 'DM Serif Display', Georgia, serif" }}
          >
            Master Every
            <br />
            Subject with{" "}
            <span className="text-teal-600 relative inline-block">
              Expert
              <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 120 8" fill="none">
                <path d="M2 6 Q60 1 118 6" stroke="#f21300" strokeWidth="3" strokeLinecap="round"/>
              </svg>
            </span>
            <br />
            <span className="text-red-500">Guidance</span>
          </h1>

          <p className="text-slate-500 text-base leading-relaxed mb-8 max-w-sm">
            Comprehensive courses for CBSE, ICSE & Olympiads. Live classes, video lectures, study
            materials and mock tests — all in one place.
          </p>

          {/* CTAs */}
          <div className="flex items-center gap-4 flex-wrap">
            <button className="group inline-flex items-center gap-2.5 bg-teal-600 text-white px-6 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 hover:bg-teal-700 hover:shadow-xl hover:shadow-teal-100 active:scale-95">
              Explore Courses
              <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </button>

            <button
              className={`inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-all duration-200 ${scrollHovered ? "text-teal-600" : ""}`}
              onMouseEnter={() => setScrollHovered(true)}
              onMouseLeave={() => setScrollHovered(false)}
            >
              <span
                className={`w-8 h-8 rounded-full border-2 border-slate-200 flex items-center justify-center transition-all duration-200 ${scrollHovered ? "border-teal-400 bg-teal-50" : ""}`}
              >
                <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${scrollHovered ? "translate-y-0.5 text-teal-500" : ""}`} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </span>
              Scroll to learn more
            </button>
          </div>

          {/* Floating trust chips */}
          <div className="flex flex-wrap gap-2 mt-8">
            {["CBSE", "ICSE", "Olympiad", "IIT-JEE", "NEET"].map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-500 tracking-wide hover:bg-teal-50 hover:text-teal-600 transition-colors duration-150 cursor-default"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Right — Course Preview Card */}
        <div className="flex flex-col gap-4 lg:pl-8">
          <CoursePreviewCard
            title="Class 10 — Mathematics Complete"
            meta="CBSE Board · 120 Videos · 45 Hours"
            price="₹1,499"
            originalPrice="₹2,999"
          />

          {/* Mini floating cards */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { emoji: "⚛️", label: "Physics", sub: "Class 11 · 89 Videos", color: "bg-indigo-50 text-indigo-700" },
              { emoji: "🧪", label: "Chemistry", sub: "Class 12 · 104 Videos", color: "bg-teal-50 text-teal-700" },
            ].map((c) => (
              <div
                key={c.label}
                className="bg-white rounded-xl border border-slate-100 shadow-sm p-3.5 flex items-center gap-3 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0 ${c.color}`}>
                  {c.emoji}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{c.label}</p>
                  <p className="text-[10px] text-slate-400">{c.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Rating pill */}
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-4 py-2 self-start">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs font-semibold text-amber-700">4.9 · 12,000+ reviews</span>
          </div>
        </div>
      </div>
    </section>
  );
}