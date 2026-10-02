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

const metricIconComponents = {
  attendance: CheckCircle2,
  participation: Users,
  homework: BookOpen,
  classPerformance: BarChart3,
};

const metricColors = {
  attendance: {
    bg: "bg-teal-100",
    color: "text-teal-600",
  },

  participation: {
    bg: "bg-blue-100",
    color: "text-blue-500",
  },

  homework: {
    bg: "bg-orange-100",
    color: "text-orange-500",
  },

  classPerformance: {
    bg: "bg-violet-100",
    color: "text-violet-500",
  },
};

const metricLabels = {
  attendance: "Attendance",
  participation: "Participation",
  homework: "Homework",
  classPerformance: "Class Performance",
};

export function WeekDetailsPanel({
  analytics,
  selectedWeekId,
  onPrevWeek,
  onNextWeek,
}: {
  analytics: any[];
  selectedWeekId: string | null;
  onPrevWeek: () => void;
  onNextWeek: () => void;
}) {
  const record = analytics.find(
    (item) => item._id === selectedWeekId
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 font-sans h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h2 className="text-lg font-semibold text-gray-900 tracking-tight">
          {record
            ? `Week of ${formatRange(
                record.weekStartDate,
                record.weekEndDate
              )}`
            : "No data for this week"}
        </h2>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center bg-white border border-gray-100 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={onPrevWeek}
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-50"
            >
              <ChevronLeft size={15} />
            </button>

            <div className="w-px h-4 bg-gray-100" />

            <button
              type="button"
              onClick={onNextWeek}
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-50"
            >
              <ChevronRight size={15} />
            </button>
          </div>

          {record && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-50 text-teal-600">
              <Clock3 size={13} />
              Rating Shared
            </span>
          )}
        </div>
      </div>

      {!record ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
          <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-3">
            <CalendarDays
              size={20}
              className="text-gray-300"
            />
          </div>

          <p className="text-sm font-medium text-gray-600">
            No rating available
          </p>

          <p className="text-xs text-gray-400 mt-1 max-w-[220px]">
            Your teacher hasn't shared the rating
            for this week yet.
          </p>
        </div>
      ) : (
        <>
          {/* Rating + metrics + feedback */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {/* Overall */}
            <div className="rounded-xl bg-teal-50/70 border border-teal-100 p-4 flex flex-col">
              <div className="w-9 h-9 rounded-lg bg-white border border-teal-100 flex items-center justify-center mb-3">
                <Star
                  size={17}
                  className="text-amber-400"
                  fill="currentColor"
                />
              </div>

              <p className="text-xs font-medium text-gray-500 mb-1">
                Overall Weekly Rating
              </p>

              <span className="text-2xl font-bold text-gray-900">
                {getOverallRating(record)} / 5
              </span>

              <p className="text-[11px] text-gray-500 mt-auto">
                Based on your weekly performance
              </p>
            </div>

            {/* Metrics */}
            <div className="flex flex-col gap-3 justify-center">
              {Object.entries(
                metricLabels
              ).map(([key, label]) => {
                const Icon =
                  metricIconComponents[
                    key as keyof typeof metricIconComponents
                  ];

                const colors =
                  metricColors[
                    key as keyof typeof metricColors
                  ];

                const value =
                  record[
                    key as keyof typeof record
                  ];

                return (
                  <div
                    key={key}
                    className="flex items-center gap-2.5"
                  >
                    <span
                      className={`w-6 h-6 rounded-md ${colors.bg} flex items-center justify-center shrink-0`}
                    >
                      <Icon
                        size={13}
                        className={colors.color}
                      />
                    </span>

                    <span className="text-[12px] font-medium text-gray-600 flex-1">
                      {label}
                    </span>

                    <span className="text-[12px] font-semibold text-gray-900">
                      {value}%
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Feedback */}
            <div className="rounded-xl bg-blue-50/60 border border-blue-100 p-4 flex flex-col">
              <div className="flex items-center gap-2 mb-2.5">
                <MessageSquare
                  size={14}
                  className="text-blue-500"
                />

                <p className="text-xs font-semibold text-gray-800">
                  Teacher Feedback
                </p>
              </div>

              <p className="text-[12px] text-gray-600 leading-relaxed flex-1">
                {record.feedback
                  ? `"${record.feedback}"`
                  : "No feedback provided."}
              </p>

              {record.createdBy && (
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-blue-100/70">
                  <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-[10px] font-semibold">
                    {getInitials(
                      record.createdBy.name
                    )}
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold text-gray-800">
                      {record.createdBy.name}
                    </p>

                    <p className="text-[10px] text-gray-400">
                      Teacher
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="h-px bg-gray-100 mb-5" />

          {/* Topics */}
          <p className="text-xs font-semibold text-gray-800 mb-3">
            Topics Covered This Week
          </p>

          <div className="flex flex-wrap gap-2 mb-5">
            {record.topicsCovered?.length ? (
              record.topicsCovered.map(
                (topic: string) => (
                  <span
                    key={topic}
                    className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-medium"
                  >
                    {topic}
                  </span>
                )
              )
            ) : (
              <p className="text-xs text-gray-400">
                No topics added.
              </p>
            )}
          </div>

          <div className="h-px bg-gray-100 mb-5" />

          {/* Goals */}
          <p className="text-xs font-semibold text-gray-800 mb-3">
            Weekly Goals
          </p>

          <div className="flex flex-wrap gap-x-6 gap-y-2.5">
            {record.goals?.length ? (
              record.goals.map(
                (goal: any) => (
                  <div
                    key={goal._id || goal.title}
                    className="flex items-center gap-2"
                  >
                    {goal.completed ? (
                      <span className="w-4 h-4 rounded bg-teal-500 flex items-center justify-center">
                        <CheckSquare
                          size={11}
                          className="text-white"
                        />
                      </span>
                    ) : (
                      <Square
                        size={16}
                        className="text-gray-300"
                      />
                    )}

                    <span
                      className={`text-[12px] font-medium ${
                        goal.completed
                          ? "text-gray-700 line-through"
                          : "text-gray-400"
                      }`}
                    >
                      {goal.title}
                    </span>
                  </div>
                )
              )
            ) : (
              <p className="text-xs text-gray-400">
                No goals added.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function getOverallRating(record: any) {
  const average =
    (record.attendance +
      record.participation +
      record.homework +
      record.classPerformance) /
    4;

  return (average / 20).toFixed(1);
}

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatRange(
  start: string,
  end: string
) {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const startText =
    startDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });

  const endText =
    endDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return `${startText} - ${endText}`;
}