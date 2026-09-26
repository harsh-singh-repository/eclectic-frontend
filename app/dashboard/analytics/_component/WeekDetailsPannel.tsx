"use client";

import {
  Star,
  ChevronLeft,
  ChevronRight,
  Clock3,
  CheckCircle2,
  Users,
  BookOpen,
  BarChart3,
  MessageSquare,
  CheckSquare,
  Square,
  CalendarDays,
} from "lucide-react";
import { weekRecords, metricLabels } from "./analyticsData";

const metricIconComponents = {
  attendance: CheckCircle2,
  participation: Users,
  homework: BookOpen,
  classPerformance: BarChart3,
};

const metricColors = {
  attendance: { bg: "bg-teal-100", color: "text-teal-600" },
  participation: { bg: "bg-blue-100", color: "text-blue-500" },
  homework: { bg: "bg-orange-100", color: "text-orange-500" },
  classPerformance: { bg: "bg-violet-100", color: "text-violet-500" },
};

function StaticStars({ value }) {
  const rounded = Math.round(value);
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={15}
          className={i < rounded ? "text-amber-400" : "text-gray-200"}
          fill={i < rounded ? "currentColor" : "none"}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

export function WeekDetailsPanel({
  selectedWeekId,
  onPrevWeek,
  onNextWeek,
}) {
  const record = weekRecords[selectedWeekId];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 font-sans h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h2 className="text-lg font-semibold text-gray-900 tracking-tight">
          {record ? `Week of ${record.rangeLabel}` : "No data for this week"}
        </h2>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center bg-white border border-gray-100 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={onPrevWeek}
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
            >
              <ChevronLeft size={15} />
            </button>
            <div className="w-px h-4 bg-gray-100" />
            <button
              type="button"
              onClick={onNextWeek}
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
            >
              <ChevronRight size={15} />
            </button>
          </div>

          {record && (
            <span
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                ${record.status === "pending" ? "bg-red-50 text-red-500" : "bg-teal-50 text-teal-600"}
              `}
            >
              <Clock3 size={13} />
              {record.status === "pending" ? "Pending Rating" : "Rating Shared"}
            </span>
          )}
        </div>
      </div>

      {!record ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
          <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-3">
            <CalendarDays size={20} className="text-gray-300" strokeWidth={1.6} />
          </div>
          <p className="text-sm font-medium text-gray-600">
            This week hasn&apos;t started yet
          </p>
          <p className="text-xs text-gray-400 mt-1 max-w-[220px]">
            Attendance and ratings will appear here once the week begins.
          </p>
        </div>
      ) : (
        <>
          {/* Overall rating + metrics + feedback */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {/* Overall Weekly Rating */}
            <div className="rounded-xl bg-teal-50/70 border border-teal-100 p-4 flex flex-col">
              <div className="w-9 h-9 rounded-lg bg-white border border-teal-100 flex items-center justify-center mb-3">
                <Star size={17} className="text-amber-400" fill="currentColor" strokeWidth={1} />
              </div>
              <p className="text-xs font-medium text-gray-500 mb-1">
                Overall Weekly Rating
              </p>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl font-bold text-gray-900">
                  {record.overallRating} / 5
                </span>
                <span
                  className={`
                    flex items-center gap-0.5 text-[11px] font-semibold px-1.5 py-0.5 rounded-md
                    ${record.ratingChangePercent >= 0 ? "bg-teal-100 text-teal-600" : "bg-red-100 text-red-500"}
                  `}
                >
                  {record.ratingChangePercent >= 0 ? "↑" : "↓"}
                  {Math.abs(record.ratingChangePercent)}%
                </span>
              </div>
              <p className="text-[11px] text-gray-500 mt-auto">{record.note}</p>
            </div>

            {/* Metrics list */}
            <div className="flex flex-col gap-3 justify-center">
              {Object.keys(metricLabels).map((key) => {
                const Icon = metricIconComponents[key];
                const colors = metricColors[key];
                return (
                  <div key={key} className="flex items-center gap-2.5">
                    <span
                      className={`w-6 h-6 rounded-md ${colors.bg} flex items-center justify-center shrink-0`}
                    >
                      <Icon size={13} className={colors.color} strokeWidth={2} />
                    </span>
                    <span className="text-[12px] font-medium text-gray-600 flex-1">
                      {metricLabels[key]}
                    </span>
                    <span className="text-[12px] font-semibold text-gray-900">
                      {record.metrics[key]}%
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Teacher feedback */}
            <div className="rounded-xl bg-blue-50/60 border border-blue-100 p-4 flex flex-col">
              <div className="flex items-center gap-2 mb-2.5">
                <MessageSquare size={14} className="text-blue-500" strokeWidth={1.8} />
                <p className="text-xs font-semibold text-gray-800">Teacher Feedback</p>
              </div>
              <p className="text-[12px] text-gray-600 leading-relaxed flex-1">
                &ldquo;{record.teacherFeedback.quote}&rdquo;
              </p>
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-blue-100/70">
                <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-[10px] font-semibold shrink-0">
                  {record.teacherFeedback.teacher
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-gray-800 leading-tight">
                    {record.teacherFeedback.teacher}
                  </p>
                  <p className="text-[10px] text-gray-400">{record.teacherFeedback.date}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-100 mb-5" />

          {/* Topics covered */}
          <p className="text-xs font-semibold text-gray-800 mb-3">Topics Covered This Week</p>
          <div className="flex flex-wrap gap-2 mb-5">
            {record.topics.map((topic) => (
              <span
                key={topic}
                className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-medium"
              >
                {topic}
              </span>
            ))}
          </div>

          <div className="h-px bg-gray-100 mb-5" />

          {/* Weekly goals */}
          <p className="text-xs font-semibold text-gray-800 mb-3">Weekly Goals</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2.5">
            {record.goals.map((goal) => (
              <div key={goal.label} className="flex items-center gap-2">
                {goal.checked ? (
                  <span className="w-4 h-4 rounded bg-teal-500 flex items-center justify-center shrink-0">
                    <CheckSquare size={11} className="text-white" strokeWidth={2.5} />
                  </span>
                ) : (
                  <Square size={16} className="text-gray-300 shrink-0" strokeWidth={1.8} />
                )}
                <span
                  className={`text-[12px] font-medium ${
                    goal.checked ? "text-gray-700" : "text-gray-400"
                  }`}
                >
                  {goal.label}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}