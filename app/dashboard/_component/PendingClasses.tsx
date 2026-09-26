"use client";

import {
  ArrowRight,
  BookOpen,
  BookOpenCheck,
  FileQuestion,
  FileEdit,
  CalendarDays,
} from "lucide-react";
import { pendingClasses } from "./dashboardData";

const iconMap = { BookOpen, BookOpenCheck, FileQuestion, FileEdit };

export function PendingClasses() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 font-sans">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 tracking-tight">
          Pending Lectures
        </h2>
        <button
          type="button"
          className="flex items-center gap-1 text-xs font-medium text-teal-600 hover:text-teal-700 cursor-pointer"
        >
          View All
          <ArrowRight size={13} />
        </button>
      </div>

      <div className="flex flex-col">
        {pendingClasses.map((item) => {
          const Icon = iconMap[item.icon];
          return (
            <div
              key={item.id}
              className="flex items-center gap-3.5 py-3 border-b border-gray-50 last:border-0"
            >
              <div
                className={`w-10 h-10 rounded-lg ${item.iconBg} flex items-center justify-center shrink-0`}
              >
                <Icon size={17} className={item.iconColor} strokeWidth={1.8} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-gray-900 truncate">
                  {item.title}
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">{item.subtitle}</p>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-gray-500 shrink-0 w-36">
                <CalendarDays size={13} className="text-gray-300" />
                <div>
                  <p>{item.date}</p>
                  <p>{item.time}</p>
                </div>
              </div>

              <button
                type="button"
                className="px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-600 text-white text-xs font-semibold shrink-0 transition-colors duration-150 cursor-pointer"
              >
                Join Class
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}