"use client";

import { Bell, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useSession } from "next-auth/react";
import { monthLabel } from "./analyticsData";

export function AnalyticsHeader() {
  const { data: session } = useSession();

  return (
    <div className="flex items-start justify-between mb-5">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
          Weekly Student Rating
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Track and share weekly performance ratings with students
        </p>
      </div>

      <div className="flex items-center gap-5 shrink-0">
        <button
          type="button"
          className="relative w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center hover:border-teal-200 transition-colors duration-150 cursor-pointer"
        >
          <Bell size={17} className="text-gray-500" strokeWidth={1.8} />
          <span className="absolute top-2 right-2.5 w-1.5 h-1.5 rounded-full bg-red-500" />
        </button>

        <div className="flex items-center gap-2.5 cursor-pointer">
          <div className="w-9 h-9 rounded-full bg-teal-500 flex items-center justify-center text-white text-xs font-semibold">
            {session?.user?.user?.name
              ?.split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2) || "HS"}
          </div>
          <span className="text-sm font-medium text-gray-800">
            {session?.user?.user?.name || "Harsh Singh"}
          </span>
          <ChevronDown size={15} className="text-gray-400" />
        </div>
      </div>
    </div>
  );
}

export function MonthNav({ onToday, onPrevMonth, onNextMonth }) {
  return (
    <div className="flex items-center gap-2.5 mb-4 justify-end">
      <button
        type="button"
        onClick={onToday}
        className="px-4 py-2 rounded-lg bg-white border border-gray-100 text-sm font-medium text-gray-700 hover:border-teal-200 transition-colors duration-150 cursor-pointer"
      >
        Today
      </button>

      <div className="flex items-center bg-white border border-gray-100 rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={onPrevMonth}
          className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
        >
          <ChevronLeft size={16} />
        </button>
        <div className="w-px h-5 bg-gray-100" />
        <button
          type="button"
          onClick={onNextMonth}
          className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="px-4 py-2 rounded-lg bg-white border border-gray-100 text-sm font-semibold text-gray-900">
        {monthLabel}
      </div>
    </div>
  );
}