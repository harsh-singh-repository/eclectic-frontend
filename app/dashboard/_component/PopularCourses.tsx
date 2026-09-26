"use client";

import {
  ArrowRight,
  PlayCircle,
  Atom,
  LineChart,
  CircleDot,
  BarChart3,
} from "lucide-react";
import { popularCourses } from "./dashboardData";

const iconMap = { PlayCircle, Atom, LineChart, CircleDot, BarChart3 };

export function PopularCourses() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 font-sans">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-gray-900 tracking-tight">
          Popular Courses
        </h2>
        <button
          type="button"
          className="flex items-center gap-1 text-xs font-medium text-teal-600 hover:text-teal-700 cursor-pointer"
        >
          View All
          <ArrowRight size={13} />
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {popularCourses.map((course, idx) => {
          const Icon = iconMap[course.icon];
          return (
            <div key={course.id} className="flex items-center gap-3.5">
              <span className="w-5 text-xs font-semibold text-gray-300 shrink-0">
                {idx + 1}
              </span>

              <div
                className={`w-9 h-9 rounded-lg ${course.iconBg} flex items-center justify-center shrink-0`}
              >
                <Icon size={16} className={course.iconColor} strokeWidth={1.8} />
              </div>

              <div className="min-w-[150px]">
                <p className="text-[13px] font-semibold text-gray-900 leading-tight">
                  {course.name}
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  {course.students}
                </p>
              </div>

              <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-teal-500"
                  style={{ width: `${course.percent}%` }}
                />
              </div>

              <span className="text-[13px] font-semibold text-gray-700 w-9 text-right shrink-0">
                {course.percent}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}