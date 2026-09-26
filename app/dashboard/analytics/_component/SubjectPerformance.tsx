"use client";

import { Layers, Coffee, Database, Globe, Cpu } from "lucide-react";
import { subjectPerformance } from "./analyticsData";

const iconMap = { Layers, Coffee, Database, Globe, Cpu };

export function SubjectPerformance() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 font-sans h-full">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-gray-900 tracking-tight">
          Subject-wise Performance
        </h2>
        <button
          type="button"
          className="px-3.5 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:border-teal-200 transition-colors duration-150 cursor-pointer"
        >
          View All
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {subjectPerformance.map((subject) => {
          const Icon = iconMap[subject.icon];
          return (
            <div key={subject.key} className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-lg ${subject.iconBg} flex items-center justify-center shrink-0`}
              >
                <Icon size={15} className={subject.iconColor} strokeWidth={1.8} />
              </div>

              <span className="text-[13px] font-medium text-gray-700 w-[110px] shrink-0">
                {subject.label}
              </span>

              <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className={`h-full rounded-full ${subject.barColor}`}
                  style={{ width: `${subject.percent}%` }}
                />
              </div>

              <span className="text-[13px] font-semibold text-gray-900 w-9 text-right shrink-0">
                {subject.percent}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}