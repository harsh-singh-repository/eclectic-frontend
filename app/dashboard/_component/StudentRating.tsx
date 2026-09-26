"use client";

import { Info, Star, CheckSquare, ArrowRight } from "lucide-react";
import { ratingItems } from "./dashboardData";

export function StudentRating() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 font-sans h-full">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-1.5">
          <h2 className="text-lg font-semibold text-gray-900 tracking-tight">
            Student Rating
          </h2>
          <Info size={14} className="text-gray-300" />
        </div>
        <button
          type="button"
          className="flex items-center gap-1 text-xs font-medium text-teal-600 hover:text-teal-700 cursor-pointer"
        >
          View Details
          <ArrowRight size={13} />
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {ratingItems.map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-4 h-4 rounded bg-teal-500 flex items-center justify-center shrink-0">
                <CheckSquare size={11} className="text-white" strokeWidth={2.5} />
              </span>
              <span className="text-[13px] font-medium text-gray-600">
                {item.label}
              </span>
            </div>
            <div className="flex items-center gap-0.5 shrink-0">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < item.stars ? "text-amber-400" : "text-gray-200"}
                  fill={i < item.stars ? "currentColor" : "none"}
                  strokeWidth={1.5}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}