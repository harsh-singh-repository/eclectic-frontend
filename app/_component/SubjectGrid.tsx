"use client";

import { useState } from "react";
import {
  BookOpen,
  Calculator,
  Globe,
  FlaskConical,
  Atom,
  Zap,
  DollarSign,
} from "lucide-react";

const subjects = [
  {
    name: "Mathematics",
    videos: 420,
    classes: 7,
    icon: Calculator,
    accent: "#0d9488",
    bg: "bg-teal-50",
    text: "text-teal-600",
    bar: "bg-teal-500",
    tag: "Foundation + JEE",
  },
  {
    name: "Science",
    videos: 380,
    classes: 7,
    icon: FlaskConical,
    accent: "#16a34a",
    bg: "bg-green-50",
    text: "text-green-600",
    bar: "bg-green-500",
    tag: "CBSE · ICSE",
  },
  {
    name: "Social Studies",
    videos: 290,
    classes: 5,
    icon: Globe,
    accent: "#7c3aed",
    bg: "bg-violet-50",
    text: "text-violet-600",
    bar: "bg-violet-500",
    tag: "History · Civics · Geo",
  },
  {
    name: "English",
    videos: 240,
    classes: 7,
    icon: BookOpen,
    accent: "#2563eb",
    bg: "bg-blue-50",
    text: "text-blue-600",
    bar: "bg-blue-500",
    tag: "Grammar · Literature",
  },
  {
    name: "Chemistry",
    videos: 310,
    classes: 4,
    icon: FlaskConical,
    accent: "#db2777",
    bg: "bg-pink-50",
    text: "text-pink-600",
    bar: "bg-pink-500",
    tag: "NEET · JEE",
  },
  {
    name: "Biology",
    videos: 280,
    classes: 4,
    icon: Atom,
    accent: "#059669",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    bar: "bg-emerald-500",
    tag: "NEET · Olympiad",
  },
  {
    name: "Physics",
    videos: 340,
    classes: 4,
    icon: Zap,
    accent: "#4f46e5",
    bg: "bg-indigo-50",
    text: "text-indigo-600",
    bar: "bg-indigo-500",
    tag: "JEE · Olympiad",
  },
  {
    name: "Accountancy",
    videos: 190,
    classes: 2,
    icon: DollarSign,
    accent: "#ea580c",
    bg: "bg-orange-50",
    text: "text-orange-600",
    bar: "bg-orange-500",
    tag: "Class 11 · 12",
  },
];

export default function SubjectGrid() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="bg-white py-20 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-12">
          <p className="text-xs font-bold tracking-[0.2em] text-teal-500 uppercase mb-3">
            What we cover
          </p>
          <h2
            className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight"
            style={{ fontFamily: "'Sora', 'DM Serif Display', Georgia, serif" }}
          >
            Browse by{" "}
            <span className="text-teal-600 relative inline-block">
              Subject
              <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 120 8" fill="none">
                <path d="M2 6 Q60 1 118 6" stroke="#F21300" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </span>
          </h2>
          <p className="text-slate-400 mt-4 text-base max-w-md mx-auto leading-relaxed">
            Choose from 15+ subjects across Class 6–12 for CBSE, ICSE, and Olympiad preparation.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {subjects.map((subject, i) => {
            const Icon = subject.icon;
            const isHovered = hovered === i;

            return (
              <div
                key={i}
                className={`
                  relative bg-white rounded-2xl p-5 border border-slate-100 cursor-pointer
                  transition-all duration-300 overflow-hidden group
                  ${isHovered ? "shadow-xl -translate-y-1.5 border-transparent" : "shadow-sm"}
                `}
                style={isHovered ? { boxShadow: `0 16px 40px ${subject.accent}22` } : {}}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Hover background wash */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                  style={{ background: `${subject.accent}07` }}
                />

                <div className="relative z-10">
                  {/* Icon */}
                  <div
                    className={`
                      w-12 h-12 rounded-xl flex items-center justify-center mb-4
                      ${subject.bg} ${subject.text}
                      transition-transform duration-300
                      ${isHovered ? "scale-110" : "scale-100"}
                    `}
                  >
                    <Icon size={22} strokeWidth={2} />
                  </div>

                  {/* Tag */}
                  <span
                    className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${subject.bg} ${subject.text} mb-3 inline-block`}
                  >
                    {subject.tag}
                  </span>

                  {/* Title */}
                  <h3 className="font-bold text-slate-800 text-base leading-snug mt-1">
                    {subject.name}
                  </h3>

                  {/* Meta */}
                  <p className="text-xs text-slate-400 mt-1 font-medium">
                    {subject.videos} Videos · {subject.classes} Classes
                  </p>

                  {/* Animated underline bar */}
                  <div className="mt-4 h-0.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${subject.bar}`}
                      style={{ width: isHovered ? "100%" : "0%" }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer CTA */}
        <div className="mt-10 text-center">
          <button className="group inline-flex items-center gap-2.5 border-2 border-teal-600 text-teal-600 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 hover:bg-teal-600 hover:text-white hover:shadow-lg hover:shadow-teal-100 active:scale-95">
            View All Subjects
            <svg
              className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
              fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}