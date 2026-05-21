"use client";

import { BookingStep } from "@/app/types/bookings";


interface StepIndicatorProps {
  currentStep: BookingStep;
}

const STEPS: { key: BookingStep; label: string; icon: string }[] = [
  { key: "course", label: "Choose Course", icon: "📘" },
  { key: "calendar", label: "Pick Date & Time", icon: "📅" },
  { key: "details", label: "Your Details", icon: "👤" },
  { key: "confirm", label: "Confirmed!", icon: "🎉" },
];

const ORDER: BookingStep[] = ["course", "calendar", "details", "confirm"];

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const currentIndex = ORDER.indexOf(currentStep);

  return (
    <div className="w-full">
      {/* Desktop */}
      <div className="hidden md:flex items-center justify-center">
        {STEPS.map((step, idx) => {
          const done = idx < currentIndex;
          const active = idx === currentIndex;

          return (
            <div key={step.key} className="flex items-center">
              <div className="flex flex-col items-center">
                {/* Circle */}
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center text-lg border-2 transition-all duration-300 ${
                    done
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : active
                      ? "bg-indigo-500 border-indigo-500 text-white shadow-lg shadow-indigo-200"
                      : "bg-white border-slate-200 text-slate-400"
                  }`}
                >
                  {done ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="text-base">{step.icon}</span>
                  )}
                </div>
                {/* Label */}
                <p
                  className={`text-xs font-semibold mt-2 whitespace-nowrap ${
                    active ? "text-indigo-600" : done ? "text-emerald-600" : "text-slate-400"
                  }`}
                >
                  {step.label}
                </p>
              </div>

              {/* Connector */}
              {idx < STEPS.length - 1 && (
                <div
                  className={`w-16 lg:w-24 h-0.5 mx-2 mt-[-20px] transition-all duration-500 ${
                    idx < currentIndex ? "bg-emerald-400" : "bg-slate-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile */}
      <div className="md:hidden flex items-center justify-between px-1">
        {STEPS.map((step, idx) => {
          const done = idx < currentIndex;
          const active = idx === currentIndex;

          return (
            <div key={step.key} className="flex flex-col items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 transition-all duration-300 ${
                  done
                    ? "bg-emerald-500 border-emerald-500 text-white"
                    : active
                    ? "bg-indigo-500 border-indigo-500 text-white"
                    : "bg-white border-slate-200 text-slate-400"
                }`}
              >
                {done ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  String(idx + 1)
                )}
              </div>
              <p className={`text-[10px] mt-1 text-center leading-tight ${active ? "text-indigo-600 font-semibold" : "text-slate-400"}`}>
                {step.label.split(" ")[0]}
              </p>
              {/* connector line */}
              {idx < STEPS.length - 1 && (
                <div className="absolute" style={{ display: "none" }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}