"use client";

import { ArrowUp, ArrowDown } from "lucide-react";
import { strongestSubject, needsAttentionSubject } from "./analyticsData";

export function SubjectHighlights() {
  return (
    <div className="flex flex-col gap-5 h-full">
      <div className="flex-1 rounded-2xl bg-teal-50/70 border border-teal-100 p-5 flex items-start gap-3.5">
        <span className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center shrink-0">
          <ArrowUp size={18} className="text-white" strokeWidth={2.2} />
        </span>
        <div className="flex-1">
          <p className="text-[12px] font-medium text-gray-500 mb-0.5">Strongest Subject</p>
          <p className="text-base font-bold text-gray-900">{strongestSubject.label}</p>
          <p className="text-[12px] text-gray-500 mt-0.5">{strongestSubject.note}</p>
        </div>
        <span className="text-xl font-bold text-teal-600 shrink-0">
          {strongestSubject.percent}
        </span>
      </div>

      <div className="flex-1 rounded-2xl bg-red-50/70 border border-red-100 p-5 flex items-start gap-3.5">
        <span className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center shrink-0">
          <ArrowDown size={18} className="text-white" strokeWidth={2.2} />
        </span>
        <div className="flex-1">
          <p className="text-[12px] font-medium text-gray-500 mb-0.5">Needs Attention</p>
          <p className="text-base font-bold text-gray-900">{needsAttentionSubject.label}</p>
          <p className="text-[12px] text-gray-500 mt-0.5">{needsAttentionSubject.note}</p>
        </div>
        <span className="text-xl font-bold text-red-500 shrink-0">
          {needsAttentionSubject.percent}
        </span>
      </div>
    </div>
  );
}