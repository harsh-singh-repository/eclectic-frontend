"use client";

import { weeks, weekdayLabels, monthLabel } from "./analyticsData";

const legend = [
  { label: "Ratings Shared", dot: "bg-teal-500" },
  { label: "Today", dot: "bg-blue-400" },
  { label: "Pending (Sunday)", dot: "bg-red-300" },
];

export function RatingCalendar({ selectedWeekId, onSelectWeek }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 font-sans h-full">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h2 className="text-lg font-semibold text-gray-900 tracking-tight">
          {monthLabel}
        </h2>
        <div className="flex items-center gap-4">
          {legend.map((row) => (
            <div key={row.label} className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${row.dot}`} />
              <span className="text-[11px] text-gray-500">{row.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Weekday header */}
      <div className="grid grid-cols-7 border-t border-l border-gray-100 rounded-t-xl overflow-hidden">
        {weekdayLabels.map((label) => (
          <div
            key={label}
            className="py-2 text-center text-xs font-medium text-gray-500 border-r border-b border-gray-100 bg-gray-50"
          >
            {label}
          </div>
        ))}
      </div>

      {/* Weeks */}
      <div className="border-l border-gray-100">
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7">
            {week.map((day, di) => {
              const isSelected = day.weekId && day.weekId === selectedWeekId;

              return (
                <button
                  key={di}
                  type="button"
                  disabled={day.otherMonth}
                  onClick={() => day.weekId && onSelectWeek(day.weekId)}
                  className={`
                    relative min-h-[68px] p-2 text-left border-r border-b border-gray-100
                    transition-colors duration-150
                    ${day.otherMonth ? "bg-gray-50/60 cursor-default" : "bg-white cursor-pointer hover:bg-gray-50"}
                    ${day.isPending && !day.otherMonth ? "bg-red-50 hover:bg-red-100/70" : ""}
                    ${isSelected ? "ring-2 ring-inset ring-teal-400" : ""}
                  `}
                >
                  <span
                    className={`
                      text-sm font-medium
                      ${day.otherMonth ? "text-gray-300" : "text-gray-700"}
                      ${day.isPending ? "text-red-500 font-semibold" : ""}
                    `}
                  >
                    {day.date}
                  </span>

                  {day.isToday && (
                    <span className="absolute top-2 left-2 w-5 h-5 rounded flex items-center justify-center text-[11px] font-semibold bg-blue-500 text-white">
                      {day.date}
                    </span>
                  )}

                  {day.hasRating && !day.isToday && (
                    <span className="absolute top-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-teal-500" />
                  )}

                  {day.isToday && (
                    <span className="absolute top-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-blue-400" />
                  )}

                  {day.isPending && !day.otherMonth && (
                    <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-red-400">
                      Pending
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}