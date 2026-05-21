"use client";

import { useState } from "react";

interface CoursePreviewCardProps {
  thumbnail?: string;
  title: string;
  meta: string;
  price: string;
  originalPrice?: string;
}

export default function CoursePreviewCard({
  title,
  meta,
  price,
  originalPrice,
}: CoursePreviewCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`
        bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100
        transition-all duration-300
        ${hovered ? "shadow-2xl -translate-y-1 scale-[1.02]" : ""}
      `}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Thumbnail */}
      <div className="relative bg-gradient-to-br from-teal-600 to-teal-800 h-36 flex items-center justify-center overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-white/10" />
        <div className="absolute top-2 left-2 w-12 h-12 rounded-full bg-white/5" />

        {/* Play button */}
        <button
          className={`
            w-12 h-12 rounded-full bg-white/90 flex items-center justify-center
            transition-all duration-200 shadow-lg
            ${hovered ? "scale-110 bg-white" : "scale-100"}
          `}
        >
          <svg className="w-5 h-5 text-teal-700 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>

        {/* Live badge */}
        <span className="absolute top-3 left-3 text-[10px] font-bold bg-coral-500 text-white px-2 py-0.5 rounded-full bg-red-500">
          LIVE
        </span>
      </div>

      {/* Info */}
      <div className="p-4">
        <h4 className="font-bold text-slate-800 text-sm leading-snug mb-1">{title}</h4>
        <p className="text-xs text-slate-400 mb-3">{meta}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-[#FB2C36] font-extrabold text-lg">{price}</span>
            {originalPrice && (
              <span className="text-xs text-slate-400 line-through">{originalPrice}</span>
            )}
          </div>
          <button
            className={`
              text-xs font-bold px-4 py-1.5 rounded-lg border-2 border-teal-600 text-teal-600
              transition-all duration-200
              ${hovered ? "bg-teal-600 text-white" : "bg-transparent"}
            `}
          >
            Enroll Now
          </button>
        </div>
      </div>
    </div>
  );
}