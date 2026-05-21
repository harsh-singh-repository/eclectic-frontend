"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// ─── Data ────────────────────────────────────────────────────────────────────

const CLASS_TABS = [
    { label: "Class 6", value: "6" },
    { label: "Class 7", value: "7" },
    { label: "Class 8", value: "8" },
    { label: "Class 9", value: "9" },
    { label: "Class 10", value: "10" },
    { label: "Class 11", value: "11" },
    { label: "Class 12", value: "12" },
    { label: "Target", value: "target" },
];

const STUDY_MATERIALS = [
  {
    titleBold: "NCERT",
    titleLight: "solutions",
    bg: "bg-amber-100",
    circle: "bg-amber-300",
    accent: "#d97706",
    books: ["NCERT", "SOLUT", "SOCIA", "SCIEN"],
  },
  {
    titleBold: "Previous year",
    titleLight: "question papers",
    bg: "bg-violet-100",
    circle: "bg-violet-400",
    accent: "#7c3aed",
    books: ["PYQ", "BOARD"],
  },
  {
    titleBold: "NCERT",
    titleLight: "Books",
    bg: "bg-teal-100",
    circle: "bg-teal-200",
    accent: "#0d9488",
    books: ["NCERT", "BOOK"],
  },
  {
    titleBold: "Important",
    titleLight: "question papers",
    bg: "bg-violet-100",
    circle: "bg-violet-400",
    accent: "#7c3aed",
    books: ["IMP", "QP"],
  },
  {
    titleBold: "Revision",
    titleLight: "notes",
    bg: "bg-rose-100",
    circle: "bg-rose-300",
    accent: "#e11d48",
    books: ["REV", "NOTE"],
  },
  {
    titleBold: "Sample",
    titleLight: "papers",
    bg: "bg-sky-100",
    circle: "bg-sky-300",
    accent: "#0284c7",
    books: ["SMP", "PAP"],
  },
  {
    titleBold: "Formula",
    titleLight: "sheets",
    bg: "bg-green-100",
    circle: "bg-green-300",
    accent: "#16a34a",
    books: ["FRM", "SHT"],
  },
  {
    titleBold: "Mind",
    titleLight: "maps",
    bg: "bg-orange-100",
    circle: "bg-orange-300",
    accent: "#ea580c",
    books: ["MIND", "MAP"],
  },
];

// ─── BookStack Illustration ───────────────────────────────────────────────────

function BookStackIllustration({
  circle,
  accent,
  books,
}: {
  circle: string;
  accent: string;
  books: string[];
}) {
  return (
    <div className="relative flex items-end justify-center h-28 mt-4 select-none pointer-events-none">
      <div
        className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-28 h-28 rounded-full ${circle} opacity-80`}
      />
      <div className="relative z-10 flex items-end gap-1 pb-2">
        {books.map((b, i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-end rounded-sm overflow-hidden shadow-md"
            style={{
              width: 28,
              height: 52 + i * 6,
              background: i % 2 === 0 ? accent : `${accent}99`,
              transform: `rotate(${(i - books.length / 2) * 3}deg)`,
            }}
          >
            <span className="text-[7px] font-black text-white/90 px-0.5 text-center leading-tight break-all">
              {b}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Material Card ────────────────────────────────────────────────────────────

function MaterialCard({
  card,
  hovered,
  onEnter,
  onLeave,
}: {
  card: (typeof STUDY_MATERIALS)[0];
  hovered: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  return (
    <div
      className={`
        relative ${card.bg} rounded-2xl p-5 cursor-pointer overflow-hidden
        w-[196px] flex-shrink-0
        transition-all duration-300
        ${hovered ? "shadow-xl -translate-y-2" : "shadow-sm"}
      `}
      style={hovered ? { boxShadow: `0 16px 36px ${card.accent}28` } : {}}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <div className="relative z-10">
        <p
          className="font-extrabold text-slate-800 text-base leading-snug"
          style={{ fontFamily: "'Sora', Georgia, serif" }}
        >
          {card.titleBold}
        </p>
        <p className="font-normal text-slate-600 text-base leading-snug">{card.titleLight}</p>
      </div>

      <BookStackIllustration circle={card.circle} accent={card.accent} books={card.books} />

      {/* Hover shine */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at 70% 20%, ${card.accent}18 0%, transparent 60%)`,
          opacity: hovered ? 1 : 0,
        }}
      />
    </div>
  );
}

// ─── Arrow Button ─────────────────────────────────────────────────────────────

function ArrowBtn({
  dir,
  enabled,
  onClick,
}: {
  dir: "left" | "right";
  enabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={!enabled}
      aria-label={dir === "left" ? "Scroll left" : "Scroll right"}
      className={`
        w-9 h-9 rounded-full border-2 flex items-center justify-center
        transition-all duration-200 active:scale-90
        ${enabled
          ? "border-slate-800 text-slate-800 hover:bg-slate-800 hover:text-white cursor-pointer"
          : "border-slate-200 text-slate-300 cursor-not-allowed"
        }
      `}
    >
      {dir === "left"
        ? <ChevronLeft size={18} strokeWidth={2.5} />
        : <ChevronRight size={18} strokeWidth={2.5} />
      }
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const CARD_WIDTH = 196;
const CARD_GAP   = 16;
const SCROLL_BY  = CARD_WIDTH + CARD_GAP;

export default function OfferingsSection() {
  const [activeTab,    setActiveTab]    = useState("11");
  const [hoveredCard,  setHoveredCard]  = useState<number | null>(null);
  const [canLeft,      setCanLeft]      = useState(false);
  const [canRight,     setCanRight]     = useState(true);

  const trackRef = useRef<HTMLDivElement>(null);

  const syncArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    syncArrows();
    el.addEventListener("scroll", syncArrows, { passive: true });
    const ro = new ResizeObserver(syncArrows);
    ro.observe(el);
    return () => { el.removeEventListener("scroll", syncArrows); ro.disconnect(); };
  }, [syncArrows]);

  const scroll = (dir: "left" | "right") => {
    trackRef.current?.scrollBy({
      left: dir === "right" ? SCROLL_BY : -SCROLL_BY,
      behavior: "smooth",
    });
  };

  return (
    <section className="bg-white py-16 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto">

        {/* ── Heading ── */}
        <h2
          className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-8"
          style={{ fontFamily: "'Sora', Georgia, serif" }}
        >
          Explore all our{" "}
          <span className="text-[#11A79A] relative inline-block">
            resources
            <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 120 8" fill="none">
              <path d="M2 6 Q60 1 118 6" stroke="#f21300" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </span>
        </h2>

        {/* ── Class Tabs ── */}
        <div className="flex flex-wrap gap-2 mb-10">
          {CLASS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`
                relative text-sm font-semibold px-4 py-2 rounded-full border
                transition-all duration-200 active:scale-95
                ${activeTab === tab.value
                  ? "bg-slate-900 text-white border-slate-900 shadow-md"
                  : "bg-white text-slate-600 border-slate-200 hover:border-teal-400 hover:text-teal-600"
                }
              `}
            >
              {/* {tab.isNew && (
                <span className="absolute -top-2.5 -right-1 bg-yellow-400 text-[9px] font-black text-slate-900 px-1.5 py-0.5 rounded-full leading-none">
                  NEW
                </span>
              )} */}
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Section header + arrows ── */}
        <div className="flex items-center justify-between mb-5">
          <h3
            className="text-xl font-bold text-slate-800"
            style={{ fontFamily: "'Sora', Georgia, serif" }}
          >
            Study Materials
          </h3>

          <div className="flex items-center gap-2">
            <ArrowBtn dir="left"  enabled={canLeft}  onClick={() => scroll("left")}  />
            <ArrowBtn dir="right" enabled={canRight} onClick={() => scroll("right")} />
          </div>
        </div>

        {/* ── Carousel ── */}
        <div className="relative">
          {/* Left fade */}
          <div
            className="pointer-events-none absolute left-0 top-0 bottom-0 w-10 z-10 transition-opacity duration-300"
            style={{
              background: "linear-gradient(to right, white, transparent)",
              opacity: canLeft ? 1 : 0,
            }}
          />

          {/* Track */}
          <div
            ref={trackRef}
            className="flex gap-4 overflow-x-auto pb-3"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {STUDY_MATERIALS.map((card, i) => (
              <MaterialCard
                key={i}
                card={card}
                hovered={hoveredCard === i}
                onEnter={() => setHoveredCard(i)}
                onLeave={() => setHoveredCard(null)}
              />
            ))}
          </div>

          {/* Right fade */}
          <div
            className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 z-10 transition-opacity duration-300"
            style={{
              background: "linear-gradient(to left, white, transparent)",
              opacity: canRight ? 1 : 0,
            }}
          />
        </div>

        {/* ── Dot indicators ── */}
        <div className="flex justify-center gap-1.5 mt-5">
          {STUDY_MATERIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                trackRef.current?.scrollTo({
                  left: i * SCROLL_BY,
                  behavior: "smooth",
                });
              }}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: hoveredCard === i ? 20 : 6,
                background: hoveredCard === i ? "#0d9488" : "#cbd5e1",
              }}
            />
          ))}
        </div>

        {/* ── Bottom CTA ── */}
        <div className="mt-10 text-center">
          <button className="group inline-flex items-center gap-2.5 border-2 border-teal-600 text-teal-600 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 hover:bg-teal-600 hover:text-white hover:shadow-lg hover:shadow-teal-100 active:scale-95">
            Browse All Materials
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