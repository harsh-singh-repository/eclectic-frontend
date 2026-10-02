"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const legend = [
  {
    label: "Ratings Shared",
    dot: "bg-teal-500",
  },
  {
    label: "Today",
    dot: "bg-blue-400",
  },
  {
    label: "Pending (Sunday)",
    dot: "bg-red-300",
  },
];

interface WeeklyAnalytics {
  _id: string;
  weekStartDate: string;
  weekEndDate: string;
  attendance: number;
  participation: number;
  homework: number;
  classPerformance: number;
  feedback: string;
  topicsCovered: string[];
  goals: {
    _id?: string;
    title: string;
    completed: boolean;
  }[];
}

interface RatingCalendarProps {
  analytics: WeeklyAnalytics[];
  selectedWeekId: string | null;
  onSelectWeek: (weekId: string) => void;
}

export function RatingCalendar({
  analytics,
  selectedWeekId,
  onSelectWeek,
}: RatingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();

    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const today = new Date();

  const monthLabel = currentMonth.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  /**
   * Convert analytics into a quick lookup.
   *
   * Each analytics record belongs to the Sunday
   * that starts that week.
   */
  const analyticsByDate = useMemo(() => {
    const map = new Map<string, WeeklyAnalytics>();

    analytics?.forEach((record) => {
      const start = new Date(record.weekStartDate);

      map.set(getDateKey(start), record);
    });

    return map;
  }, [analytics]);

  /**
   * Generate calendar for currentMonth.
   */
  const weeks = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    /**
     * Sunday on or before first day of month.
     */
    const firstSunday = new Date(firstDay);

    firstSunday.setDate(
      firstDay.getDate() - firstDay.getDay()
    );

    const result: any[][] = [];

    const current = new Date(firstSunday);

    /**
     * Generate enough weeks to cover the month.
     */
    while (current <= lastDay || result.length < 5) {
      const week = [];

      for (let i = 0; i < 7; i++) {
        const date = new Date(current);

        const dateKey = getDateKey(date);

        /**
         * Find Sunday for this date.
         */
        const weekStart = new Date(date);

        weekStart.setDate(
          date.getDate() - date.getDay()
        );

        const weekStartKey = getDateKey(weekStart);

        const record =
          analyticsByDate.get(weekStartKey);

        const isCurrentMonth =
          date.getMonth() === month &&
          date.getFullYear() === year;

        const isToday =
          dateKey === getDateKey(today);

        week.push({
          date: date.getDate(),
          dateKey,
          otherMonth: !isCurrentMonth,
          isToday,
          record,
          weekId: record?._id ?? weekStartKey,
        });

        current.setDate(current.getDate() + 1);
      }

      result.push(week);
    }

    return result;
  }, [analyticsByDate, currentMonth]);

  /**
   * Previous month
   */
  const goToPreviousMonth = () => {
    setCurrentMonth(
      (prev) =>
        new Date(
          prev.getFullYear(),
          prev.getMonth() - 1,
          1
        )
    );
  };

  /**
   * Next month
   */
  const goToNextMonth = () => {
    setCurrentMonth(
      (prev) =>
        new Date(
          prev.getFullYear(),
          prev.getMonth() + 1,
          1
        )
    );
  };

  /**
   * Go back to current month.
   */
  const goToToday = () => {
    const now = new Date();

    setCurrentMonth(
      new Date(now.getFullYear(), now.getMonth(), 1)
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 font-sans h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          {/* Previous */}
          <button
            type="button"
            onClick={goToPreviousMonth}
            className="w-8 h-8 rounded-lg border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Month */}
          <h2 className="text-lg font-semibold text-gray-900 tracking-tight min-w-[150px] text-center">
            {monthLabel}
          </h2>

          {/* Next */}
          <button
            type="button"
            onClick={goToNextMonth}
            className="w-8 h-8 rounded-lg border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition"
          >
            <ChevronRight size={16} />
          </button>

          {/* Today */}
          <button
            type="button"
            onClick={goToToday}
            className="px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-100 rounded-lg hover:bg-gray-50 transition"
          >
            Today
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4">
          {legend.map((row) => (
            <div
              key={row.label}
              className="flex items-center gap-1.5"
            >
              <span
                className={`w-2 h-2 rounded-full ${row.dot}`}
              />

              <span className="text-[11px] text-gray-500">
                {row.label}
              </span>
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

      {/* Calendar */}
      <div className="border-l border-gray-100">
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7">
            {week.map((day, di) => {
              const isSelected =
                day.weekId &&
                day.weekId === selectedWeekId;

              return (
                <button
                  key={di}
                  type="button"
                  disabled={day.otherMonth}
                  onClick={() =>
                    day.weekId &&
                    onSelectWeek(day.weekId)
                  }
                  className={`
                    relative min-h-[68px] p-2 text-left
                    border-r border-b border-gray-100
                    transition-colors duration-150

                    ${
                      day.otherMonth
                        ? "bg-gray-50/60 cursor-default"
                        : "bg-white cursor-pointer hover:bg-gray-50"
                    }

                    ${
                      isSelected
                        ? "ring-2 ring-inset ring-teal-400"
                        : ""
                    }
                  `}
                >
                  {/* Date */}
                  <span
                    className={`
                      text-sm font-medium
                      ${
                        day.otherMonth
                          ? "text-gray-300"
                          : "text-gray-700"
                      }
                    `}
                  >
                    {day.date}
                  </span>

                  {/* Today */}
                  {day.isToday && (
                    <span className="absolute top-2 left-2 w-5 h-5 rounded flex items-center justify-center text-[11px] font-semibold bg-blue-500 text-white">
                      {day.date}
                    </span>
                  )}

                  {/* Rating exists */}
                  {day.record && !day.isToday && (
                    <span className="absolute top-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-teal-500" />
                  )}

                  {/* Today + rating */}
                  {day.record && day.isToday && (
                    <span className="absolute top-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-blue-400" />
                  )}

                  {/* Pending Sunday */}
                  {!day.record &&
                    !day.otherMonth &&
                    dateIsSunday(day.dateKey) &&
                    day.dateKey <= getDateKey(today) && (
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

function getDateKey(date: Date) {
  return `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${String(date.getDate()).padStart(
    2,
    "0"
  )}`;
}

function dateIsSunday(dateString: string) {
  const date = new Date(`${dateString}T00:00:00`);

  return date.getDay() === 0;
}