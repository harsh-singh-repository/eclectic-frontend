"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";

interface WeeklyGoal {
  title: string;
  completed: boolean;
}

interface WeeklyAnalyticsFormProps {
  studentId: string;
  onSuccess?: () => void;
}

export function WeeklyAnalyticsForm({
  studentId,
  onSuccess,
}: WeeklyAnalyticsFormProps) {
  const [weekStartDate, setWeekStartDate] = useState("");

  const [attendance, setAttendance] = useState(0);
  const [participation, setParticipation] = useState(0);
  const [homework, setHomework] = useState(0);
  const [classPerformance, setClassPerformance] = useState(0);

  const [feedback, setFeedback] = useState("");

  const [topics, setTopics] = useState<string[]>([""]);

  const [goals, setGoals] = useState<WeeklyGoal[]>([
    {
      title: "",
      completed: false,
    },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const addTopic = () => {
    setTopics((prev) => [...prev, ""]);
  };

  const updateTopic = (index: number, value: string) => {
    setTopics((prev) => prev.map((topic, i) => (i === index ? value : topic)));
  };

  const removeTopic = (index: number) => {
    setTopics((prev) => prev.filter((_, i) => i !== index));
  };

  const addGoal = () => {
    setGoals((prev) => [
      ...prev,
      {
        title: "",
        completed: false,
      },
    ]);
  };

  const updateGoal = (index: number, value: string) => {
    setGoals((prev) =>
      prev.map((goal, i) => (i === index ? { ...goal, title: value } : goal)),
    );
  };

  const toggleGoal = (index: number) => {
    setGoals((prev) =>
      prev.map((goal, i) =>
        i === index
          ? {
              ...goal,
              completed: !goal.completed,
            }
          : goal,
      ),
    );
  };

  const removeGoal = (index: number) => {
    setGoals((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      const response = await axiosInstance.post(
        `/students/${studentId}/analytics`,
        {
          weekStartDate,

          attendance,
          participation,
          homework,
          classPerformance,

          feedback,

          topicsCovered: topics.filter(Boolean),

          goals: goals
            .filter((goal) => goal.title.trim())
            .map((goal) => ({
              title: goal.title.trim(),
              completed: goal.completed,
            })),
        },
      );

      console.log("Analytics saved:", response.data);

      onSuccess?.();
    } catch (error: any) {
      console.error("Save analytics error:", error);

      const message =
        error?.response?.data?.message || "Failed to save analytics";

      // If you have a toast library
      // toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Week */}
      <div>
        <label className="text-sm font-medium text-zinc-800">
          Week Starting
        </label>

        <p className="text-xs text-zinc-400 mb-2">
          Select Sunday. The week will automatically end on Saturday.
        </p>

        <input
          type="date"
          value={weekStartDate}
          onChange={(e) => setWeekStartDate(e.target.value)}
          className="h-10 w-full rounded-lg border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-400"
          required
        />
      </div>

      {/* Ratings */}
      <div>
        <h3 className="text-sm font-semibold text-zinc-900 mb-3">
          Weekly Ratings
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <RatingInput
            label="Attendance"
            value={attendance}
            onChange={setAttendance}
          />

          <RatingInput
            label="Participation"
            value={participation}
            onChange={setParticipation}
          />

          <RatingInput
            label="Homework"
            value={homework}
            onChange={setHomework}
          />

          <RatingInput
            label="Class Performance"
            value={classPerformance}
            onChange={setClassPerformance}
          />
        </div>
      </div>

      {/* Feedback */}
      <div>
        <label className="text-sm font-medium text-zinc-800">
          Teacher Feedback
        </label>

        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Write feedback for this week..."
          rows={4}
          className="mt-2 w-full rounded-lg border border-zinc-200 p-3 text-sm outline-none resize-none focus:border-zinc-400"
        />
      </div>

      {/* Topics */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900">
              Topics Covered
            </h3>

            <p className="text-xs text-zinc-400">
              Topics taught during this week
            </p>
          </div>

          <button
            type="button"
            onClick={addTopic}
            className="flex items-center gap-1 text-xs font-medium text-zinc-700 hover:text-zinc-900"
          >
            <Plus size={14} />
            Add Topic
          </button>
        </div>

        <div className="space-y-2">
          {topics.map((topic, index) => (
            <div key={index} className="flex gap-2">
              <input
                value={topic}
                onChange={(e) => updateTopic(index, e.target.value)}
                placeholder="e.g. Binary Search"
                className="h-10 flex-1 rounded-lg border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-400"
              />

              {topics.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTopic(index)}
                  className="h-10 w-10 flex items-center justify-center rounded-lg border border-zinc-200 text-zinc-400 hover:text-red-500 hover:bg-red-50"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Goals */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900">
              Weekly Goals
            </h3>

            <p className="text-xs text-zinc-400">
              Set multiple goals and track completion
            </p>
          </div>

          <button
            type="button"
            onClick={addGoal}
            className="flex items-center gap-1 text-xs font-medium text-zinc-700 hover:text-zinc-900"
          >
            <Plus size={14} />
            Add Goal
          </button>
        </div>

        <div className="space-y-2">
          {goals.map((goal, index) => (
            <div key={index} className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={goal.completed}
                onChange={() => toggleGoal(index)}
                className="h-4 w-4"
              />

              <input
                value={goal.title}
                onChange={(e) => updateGoal(index, e.target.value)}
                placeholder="Enter weekly goal..."
                className="h-10 flex-1 rounded-lg border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-400"
              />

              {goals.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeGoal(index)}
                  className="h-10 w-10 flex items-center justify-center rounded-lg border border-zinc-200 text-zinc-400 hover:text-red-500 hover:bg-red-50"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save Weekly Analytics"}
        </button>
      </div>
    </form>
  );
}

function RatingInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-zinc-600">{label}</label>

      <div className="relative mt-1">
        <input
          type="number"
          min={0}
          max={100}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="h-11 w-full rounded-lg border border-zinc-200 px-3 pr-8 text-sm outline-none focus:border-zinc-400"
        />

        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-zinc-400">
          %
        </span>
      </div>
    </div>
  );
}
