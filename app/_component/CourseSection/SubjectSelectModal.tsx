"use client";

import { useEffect, useState } from "react";

interface Subject {
  _id: number;
  name: string;
  icon: string;
  color: string;
}

interface SubjectSelectModalProps {
  open: boolean;
  subjects: Subject[];
  selectedSubject: { _id: number, name: string } | null;
  onSelect: (subject: { _id: number, name: string }) => void;
  onClose: () => void;
  onBack: () => void;
  onConfirm: () => void;
  accentColor: string;
  grade: {
    _id: number;
    name: string;
  } | null;
  courseTitle: string;
}

export default function SubjectSelectModal({
  open,
  subjects,
  selectedSubject,
  onSelect,
  onClose,
  onBack,
  onConfirm,
  accentColor,
  grade,
  courseTitle,
}: SubjectSelectModalProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 transition-all duration-300 ${visible ? "bg-black/60 backdrop-blur-sm" : "bg-transparent"
        }`}
      onClick={onClose}
    >
      <div
        className={`w-full max-w-sm bg-[#161620] rounded-3xl border border-white/10 shadow-2xl transition-all duration-300 ${visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
          }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-4">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        <div className="p-6 pb-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-xs text-white/40 uppercase tracking-widest mb-1">
                {courseTitle} · Grade {grade?.name}
              </p>
              <h2 className="text-xl font-bold text-white">Select Subject</h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/20 transition-colors text-sm"
            >
              ✕
            </button>
          </div>

          {/* Subject Grid */}
          <div className="grid grid-cols-2 gap-2.5 my-6">
            {subjects?.map((s) => {
              const isSelected = selectedSubject?._id === s._id;
              return (
                <button
                  key={s.name}
                  onClick={() => onSelect(s)}
                  className="relative flex items-center gap-3 p-3 rounded-2xl border-2 text-left transition-all duration-200 active:scale-95"
                  style={{
                    borderColor: isSelected ? accentColor : "rgba(255,255,255,0.07)",
                    background: isSelected ? `${accentColor}18` : "rgba(255,255,255,0.03)",
                    boxShadow: isSelected ? `0 0 14px ${accentColor}33` : "none",
                    transform: isSelected ? "scale(1.03)" : "scale(1)",
                  }}
                >
                  {/* <span
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: s.color + "25" }}
                  >
                    {s.icon}
                  </span> */}
                  <span
                    className="text-sm font-semibold"
                    style={{ color: isSelected ? accentColor : "rgba(255,255,255,0.65)" }}
                  >
                    {s.name}
                  </span>
                  {isSelected && (
                    <span
                      className="absolute top-2 right-2 w-2 h-2 rounded-full"
                      style={{ background: s.color }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onBack}
              className="flex-1 py-3 rounded-2xl text-sm font-semibold bg-white/8 text-white/60 hover:bg-white/12 transition-colors border border-white/10 active:scale-95"
            >
              ← Back
            </button>
            <button
              onClick={onConfirm}
              disabled={!selectedSubject}
              className="flex-[2] py-3 rounded-2xl text-sm font-bold transition-all duration-200 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                background: selectedSubject ? accentColor : "#333",
                color: selectedSubject ? "#0f0f13" : "#666",
                boxShadow: selectedSubject ? `0 4px 20px ${accentColor}55` : "none",
              }}
            >
              Start Learning 🚀
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}