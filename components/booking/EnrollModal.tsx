"use client";

import { Course } from "@/app/types/bookings";


interface EnrollModalProps {
  course: Course | null;
  onClose: () => void;
}

export default function EnrollModal({ course, onClose }: EnrollModalProps) {
  if (!course) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
          <div className="flex items-start justify-between mb-3">
            <span className="text-5xl">{course.thumbnail}</span>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <h2 className="text-xl font-extrabold mb-1">{course.title}</h2>
          <p className="text-indigo-200 text-sm">by {course.instructor}</p>
        </div>

        <div className="p-6 space-y-5">
          {/* Pricing */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-slate-800">
              ₹{course.price.toLocaleString()}
            </span>
            {course.originalPrice && (
              <span className="text-base text-slate-400 line-through">
                ₹{course.originalPrice.toLocaleString()}
              </span>
            )}
            {course.originalPrice && (
              <span className="text-sm font-bold text-white bg-rose-500 px-2.5 py-0.5 rounded-full">
                Save ₹{(course.originalPrice - course.price).toLocaleString()}
              </span>
            )}
          </div>

          {/* What you get */}
          <div className="space-y-2">
            {[
              "Lifetime access to all course content",
              "Certificate of completion",
              "Live doubt-clearing sessions",
              "Project-based learning",
              "Community access & peer support",
            ].map((benefit) => (
              <div key={benefit} className="flex items-center gap-2.5 text-sm text-slate-600">
                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                {benefit}
              </div>
            ))}
          </div>

          {/* Topics */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Topics Covered
            </p>
            <div className="flex flex-wrap gap-1.5">
              {course.topics.map((topic) => (
                <span
                  key={topic}
                  className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-100"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={onClose}
            className="w-full py-4 rounded-xl text-base font-bold bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90 transition-opacity shadow-lg shadow-indigo-200"
          >
            Enroll Now — ₹{course.price.toLocaleString()}
          </button>

          <p className="text-center text-xs text-slate-400">
            30-day money-back guarantee · Secure payment via Razorpay
          </p>
        </div>
      </div>
    </div>
  );
}