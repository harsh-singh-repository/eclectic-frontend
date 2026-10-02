"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, UserRound } from "lucide-react";
import { useGetStudentById } from "@/app/hooks/students-hooks/studentHooks";
import { WeeklyAnalyticsForm } from "@/components/students/WeeklyAnalyticsForm";
import { WeeklyAnalytics } from "@/app/services/sudent-services/student-service";

export default function StudentDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const studentId = params.studentId as string;

  const {
    data,
    isLoading,
    refetch,
  } = useGetStudentById(studentId);

  const student = data?.student;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-5 w-32 bg-zinc-100 rounded animate-pulse" />
        <div className="h-32 bg-zinc-100 rounded-xl animate-pulse" />
        <div className="h-96 bg-zinc-100 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="py-20 text-center">
        <p className="text-zinc-500">
          Student not found
        </p>

        <button
          onClick={() => router.push("/students")}
          className="mt-4 text-sm underline"
        >
          Back to students
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push("/students")}
          className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 mb-5"
        >
          <ArrowLeft size={16} />
          Back to Students
        </button>

        <p className="text-xs text-zinc-400 uppercase tracking-widest mb-1">
          Students / Profile
        </p>

        <h1 className="text-2xl font-semibold text-zinc-900">
          Student Details
        </h1>
      </div>

      {/* Student Card */}
      <div className="rounded-xl border border-zinc-200 bg-white p-5 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {student.image ? (
            <img
              src={student.image}
              alt={student.name}
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-zinc-100 flex items-center justify-center">
              <UserRound
                size={25}
                className="text-zinc-500"
              />
            </div>
          )}

          <div className="flex-1">
            <h2 className="text-lg font-semibold text-zinc-900">
              {student.name}
            </h2>

            <p className="text-sm text-zinc-500">
              {student.email || "No email"}
            </p>

            <p className="text-sm text-zinc-500">
              {student.mobileNumber}
            </p>
          </div>

          <div className="flex gap-2">
            <span className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-700">
              Grade {student.grade}
            </span>

            <span className="rounded-full bg-purple-50 px-3 py-1.5 text-xs font-medium text-purple-700">
              {student.studentType}
            </span>
          </div>
        </div>
      </div>

      {/* Analytics */}
      {student.studentType === "ECLECTIC" ? (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6">
          {/* Previous Analytics */}
          <div className="rounded-xl border border-zinc-200 bg-white">
            <div className="p-5 border-b border-zinc-200">
              <h2 className="font-semibold text-zinc-900">
                Weekly Analytics
              </h2>

              <p className="text-sm text-zinc-500 mt-1">
                Track weekly academic performance
              </p>
            </div>

            <div className="p-5 space-y-4">
              {student.weeklyAnalytics?.length ===
              0 ? (
                <div className="py-12 text-center">
                  <p className="text-sm text-zinc-500">
                    No weekly analytics yet.
                  </p>

                  <p className="text-xs text-zinc-400 mt-1">
                    Add the first weekly report using
                    the form.
                  </p>
                </div>
              ) : (
                student.weeklyAnalytics
                  .slice()
                  .reverse()
                  .map((analytics) => (
                    <AnalyticsCard
                      key={analytics._id}
                      analytics={analytics}
                    />
                  ))
              )}
            </div>
          </div>

          {/* Add Analytics */}
          <div className="rounded-xl border border-zinc-200 bg-white h-fit">
            <div className="p-5 border-b border-zinc-200">
              <h2 className="font-semibold text-zinc-900">
                Add Weekly Analytics
              </h2>

              <p className="text-sm text-zinc-500 mt-1">
                Sunday → Saturday
              </p>
            </div>

            <div className="p-5">
              <WeeklyAnalyticsForm
                studentId={studentId}
                onSuccess={() => refetch()}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-zinc-200 bg-white p-10 text-center">
          <h2 className="font-medium text-zinc-900">
            Weekly analytics unavailable
          </h2>

          <p className="text-sm text-zinc-500 mt-1">
            Weekly analytics are currently available
            only for Eclectic students.
          </p>
        </div>
      )}
    </div>
  );
}

function AnalyticsCard({
  analytics,
}: {
  analytics: WeeklyAnalytics;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 p-4">
      {/* Week */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-semibold text-zinc-900">
            {formatDate(analytics.weekStartDate)}{" "}
            →{" "}
            {formatDate(analytics.weekEndDate)}
          </p>

          <p className="text-xs text-zinc-400 mt-0.5">
            Weekly Performance
          </p>
        </div>
      </div>

      {/* Ratings */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Metric
          label="Attendance"
          value={analytics.attendance}
        />

        <Metric
          label="Participation"
          value={analytics.participation}
        />

        <Metric
          label="Homework"
          value={analytics.homework}
        />

        <Metric
          label="Performance"
          value={analytics.classPerformance}
        />
      </div>

      {/* Feedback */}
      {analytics.feedback && (
        <div className="mt-5">
          <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
            Feedback
          </p>

          <p className="text-sm text-zinc-600 mt-1">
            {analytics.feedback}
          </p>
        </div>
      )}

      {/* Topics */}
      {analytics.topicsCovered?.length > 0 && (
        <div className="mt-5">
          <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-2">
            Topics Covered
          </p>

          <div className="flex flex-wrap gap-2">
            {analytics.topicsCovered.map(
              (topic: string) => (
                <span
                  key={topic}
                  className="rounded-md bg-zinc-100 px-2.5 py-1 text-xs text-zinc-600"
                >
                  {topic}
                </span>
              )
            )}
          </div>
        </div>
      )}

      {/* Goals */}
      {analytics.goals?.length > 0 && (
        <div className="mt-5">
          <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-2">
            Weekly Goals
          </p>

          <div className="space-y-2">
            {analytics.goals.map(
              (goal: any) => (
                <div
                  key={goal._id}
                  className="flex items-center gap-2 text-sm"
                >
                  <span
                    className={
                      goal.completed
                        ? "text-green-600"
                        : "text-zinc-300"
                    }
                  >
                    {goal.completed ? "✓" : "○"}
                  </span>

                  <span
                    className={
                      goal.completed
                        ? "text-zinc-500 line-through"
                        : "text-zinc-700"
                    }
                  >
                    {goal.title}
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-lg bg-zinc-50 p-3">
      <p className="text-xs text-zinc-400">
        {label}
      </p>

      <p className="text-xl font-semibold text-zinc-900 mt-1">
        {value}%
      </p>
    </div>
  );
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}