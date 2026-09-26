"use client";

import { ArrowRight } from "lucide-react";
import { classProgress } from "./dashboardData";

const legend = [
  { key: "completed", label: "Completed", dot: "bg-teal-500", text: "text-teal-600" },
  { key: "inProgress", label: "In Progress", dot: "bg-blue-500", text: "text-blue-600" },
  { key: "pending", label: "Pending", dot: "bg-red-400", text: "text-red-500" },
];

export function ClassProgress() {
  const { percent, completed, inProgress, pending, total } = classProgress;
  const completedPct = (completed / total) * 100;
  const inProgressPct = (inProgress / total) * 100;

  const conic = `conic-gradient(
    #14b8a6 0% ${completedPct}%,
    #3b82f6 ${completedPct}% ${completedPct + inProgressPct}%,
    #f87171 ${completedPct + inProgressPct}% 100%
  )`;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 font-sans">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 tracking-tight">
          Class Progress
        </h2>
        <button
          type="button"
          className="flex items-center gap-1 text-xs font-medium text-teal-600 hover:text-teal-700 cursor-pointer"
        >
          View Details
          <ArrowRight size={13} />
        </button>
      </div>

      <div className="flex items-center gap-8">
        {/* Donut */}
        <div
          className="relative w-36 h-36 rounded-full shrink-0 flex items-center justify-center"
          style={{ background: conic }}
        >
          <div className="w-[74%] h-[74%] rounded-full bg-white flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-gray-900">{percent}%</span>
            <span className="text-[11px] text-gray-400 mt-0.5">Completed</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-3.5">
          {legend.map((row) => (
            <div key={row.key} className="flex items-center gap-2.5">
              <span className={`w-2.5 h-2.5 rounded-full ${row.dot}`} />
              <span className="text-sm font-medium text-gray-600 w-24">
                {row.label}
              </span>
              <span className="text-sm font-semibold text-gray-900">
                {classProgress[row.key]}/{total}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}