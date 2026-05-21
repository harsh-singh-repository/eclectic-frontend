"use client";

import { Course } from "@/app/types/bookings";
import { getDiscount } from "@/lib/data";

interface CourseCardProps {
  course: Course;
  isSelected: boolean;
  onSelect: (course: Course) => void;
  onEnroll: (course: Course) => void;
}

const levelColors: Record<string, string> = {
  Beginner: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Intermediate: "bg-amber-50 text-amber-700 border border-amber-200",
  Advanced: "bg-rose-50 text-rose-700 border border-rose-200",
};

export default function CourseCard({
  course,
  isSelected,
  onSelect,
  onEnroll,
}: CourseCardProps) {
  const discount = course.originalPrice
    ? getDiscount(course.price, course.originalPrice)
    : 0;

  return (
    <div
      onClick={() => onSelect(course)}
      className={`relative rounded-2xl border-2 cursor-pointer transition-all duration-300 overflow-hidden group ${
        isSelected
          ? "border-indigo-500 shadow-lg shadow-indigo-100 bg-white scale-[1.02]"
          : "border-slate-100 bg-white hover:border-indigo-200 hover:shadow-md"
      }`}
    >
      {/* Top Accent */}
      <div
        className={`h-1 w-full transition-all duration-300 ${
          isSelected
            ? "bg-gradient-to-r from-indigo-500 to-purple-500"
            : "bg-slate-100 group-hover:bg-gradient-to-r group-hover:from-indigo-300 group-hover:to-purple-300"
        }`}
      />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="text-4xl">{course.thumbnail}</div>
          <div className="flex flex-col items-end gap-1.5">
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-full ${levelColors[course.level]}`}
            >
              {course.level}
            </span>
            {discount > 0 && (
              <span className="text-xs font-bold text-white bg-rose-500 px-2 py-0.5 rounded-full">
                {discount}% OFF
              </span>
            )}
          </div>
        </div>

        {/* Title & Instructor */}
        <h3 className="font-bold text-slate-800 text-base leading-snug mb-1">
          {course.title}
        </h3>
        <p className="text-xs text-slate-500 mb-3">by {course.instructor}</p>

        {/* Description */}
        <p className="text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">
          {course.description}
        </p>

        {/* Topics */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {course.topics.slice(0, 3).map((topic) => (
            <span
              key={topic}
              className="text-xs bg-slate-50 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200"
            >
              {topic}
            </span>
          ))}
          {course.topics.length > 3 && (
            <span className="text-xs text-slate-400 px-2 py-0.5">
              +{course.topics.length - 3} more
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
          <span className="flex items-center gap-1">
            <span className="text-amber-400">★</span>
            <span className="font-semibold text-slate-700">{course.rating}</span>
          </span>
          <span>·</span>
          <span>{course.students.toLocaleString()} students</span>
          <span>·</span>
          <span>{course.duration}</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-slate-800">
              ₹{course.price.toLocaleString()}
            </span>
            {course.originalPrice && (
              <span className="text-sm text-slate-400 line-through">
                ₹{course.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {course.demoAvailable && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect(course);
              }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border-2 ${
                isSelected
                  ? "bg-indigo-500 text-white border-indigo-500"
                  : "border-indigo-200 text-indigo-600 hover:bg-indigo-50"
              }`}
            >
              {isSelected ? "✓ Selected" : "Book Demo"}
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEnroll(course);
            }}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-slate-800 text-white hover:bg-slate-700 transition-colors duration-200"
          >
            Enroll Now
          </button>
        </div>
      </div>

      {/* Selected Indicator */}
      {isSelected && (
        <div className="absolute top-3 right-3 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </div>
  );
}