"use client";

import { Trophy, Star, BookOpen, ClipboardList, Target, ChevronDown } from "lucide-react";
import { academicOverview } from "./analyticsData";

const iconMap = { Trophy, Star, BookOpen, ClipboardList, Target };

export function AcademicPerformanceOverview() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 font-sans">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-gray-900 tracking-tight">
          Academic Performance Overview
        </h2>
        <button
          type="button"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:border-teal-200 transition-colors duration-150 cursor-pointer"
        >
          This Month
          <ChevronDown size={14} />
        </button>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {academicOverview.map((card) => {
          const Icon = iconMap[card.icon];
          return (
            <div
              key={card.key}
              className="rounded-xl border border-gray-100 p-4 flex flex-col"
            >
              <div
                className={`w-10 h-10 rounded-lg ${card.iconBg} flex items-center justify-center mb-3`}
              >
                <Icon size={18} className={card.iconColor} strokeWidth={1.8} />
              </div>

              <p className="text-[12px] text-gray-500 mb-1.5">{card.label}</p>

              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl font-bold text-gray-900">{card.value}</span>
                <span className="flex items-center gap-0.5 text-[11px] font-semibold px-1.5 py-0.5 rounded-md bg-teal-100 text-teal-600">
                  ↑{card.delta}
                </span>
              </div>

              <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden mb-2">
                <div
                  className={`h-full rounded-full ${card.barColor}`}
                  style={{ width: `${card.progress}%` }}
                />
              </div>

              <p className="text-[11px] text-gray-400">{card.subtitle}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}