"use client";

import { useState } from "react";

interface CalendarProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function Calendar({ selectedDate, onDateSelect }: CalendarProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewMonth, setViewMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const prevMonth = () =>
    setViewMonth(new Date(year, month - 1, 1));
  const nextMonth = () =>
    setViewMonth(new Date(year, month + 1, 1));

  const isToday = (d: number) => {
    const date = new Date(year, month, d);
    return date.toDateString() === today.toDateString();
  };

  const isPast = (d: number) => {
    const date = new Date(year, month, d);
    date.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isSelected = (d: number) => {
    if (!selectedDate) return false;
    const date = new Date(year, month, d);
    return date.toDateString() === selectedDate.toDateString();
  };

  const isWeekend = (d: number) => {
    const dayOfWeek = new Date(year, month, d).getDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
  };

  // Build calendar grid
  const cells: Array<{ day: number; currentMonth: boolean }> = [];
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ day: daysInPrevMonth - i, currentMonth: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, currentMonth: true });
  }
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    cells.push({ day: d, currentMonth: false });
  }

  const canGoPrev =
    new Date(year, month - 1, 1) >= new Date(today.getFullYear(), today.getMonth(), 1);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <button
          onClick={prevMonth}
          disabled={!canGoPrev}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <h3 className="font-bold text-slate-800 text-base">
          {MONTHS[month]} {year}
        </h3>

        <button
          onClick={nextMonth}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="p-4">
        {/* Day Labels */}
        <div className="grid grid-cols-7 mb-2">
          {DAYS.map((d) => (
            <div key={d} className="text-center text-xs font-semibold text-slate-400 py-1.5">
              {d}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-y-1">
          {cells.map((cell, idx) => {
            const disabled =
              !cell.currentMonth || isPast(cell.day) || isWeekend(cell.day);
            const selected = cell.currentMonth && isSelected(cell.day);
            const today_ = cell.currentMonth && isToday(cell.day);

            return (
              <button
                key={idx}
                disabled={disabled}
                onClick={() => {
                  if (cell.currentMonth) {
                    onDateSelect(new Date(year, month, cell.day));
                  }
                }}
                className={`
                  relative mx-auto flex items-center justify-center w-9 h-9 rounded-xl text-sm font-medium transition-all duration-150
                  ${!cell.currentMonth ? "text-slate-200 cursor-default" : ""}
                  ${cell.currentMonth && !disabled && !selected ? "text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer" : ""}
                  ${cell.currentMonth && disabled && !today_ ? "text-slate-300 cursor-not-allowed" : ""}
                  ${selected ? "bg-indigo-500 text-white shadow-md shadow-indigo-200" : ""}
                  ${today_ && !selected ? "ring-2 ring-indigo-300 text-indigo-600 font-bold" : ""}
                  ${isWeekend(cell.day) && cell.currentMonth ? "text-rose-300" : ""}
                `}
              >
                {cell.day}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-100 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block" />
            Selected
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full ring-2 ring-indigo-300 inline-block" />
            Today
          </span>
          <span className="flex items-center gap-1.5 text-rose-300">
            <span className="font-bold">S</span>
            Weekends (off)
          </span>
        </div>
      </div>
    </div>
  );
}