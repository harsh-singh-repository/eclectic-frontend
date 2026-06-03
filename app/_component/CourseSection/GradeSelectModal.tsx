"use client";

import { useEffect, useState } from "react";

interface GradeSelectModalProps {
  open: boolean;
  grades: { name: string; _id: number }[];
  selectedGrade: { name: string, _id: number } | null;
  onSelect: (grade: { name: string, _id: number }) => void;
  onClose: () => void;
  onNext: () => void;
  accentColor: string;
  courseTitle: string;
}

export default function GradeSelectModal({
  open,
  grades,
  selectedGrade,
  onSelect,
  onClose,
  onNext,
  accentColor,
  courseTitle,
}: GradeSelectModalProps) {
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
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs text-white/40 uppercase tracking-widest mb-1">{courseTitle}</p>
              <h2 className="text-xl font-bold text-white">Select Grade</h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/20 transition-colors text-sm"
            >
              ✕
            </button>
          </div>

          {/* Grade Pills */}
          <div className="flex gap-3 mb-8">
            {grades?.map((g) => {
              const isSelected = selectedGrade?._id === g._id;
              return (
                <button
                  key={g._id}
                  onClick={() => onSelect(g)}
                  className={`
                    flex-1 py-4 rounded-2xl text-2xl font-bold
                    transition-all duration-200 active:scale-95
                    border-2
                  `}
                  style={{
                    borderColor: isSelected ? accentColor : "rgba(255,255,255,0.08)",
                    background: isSelected ? accentColor + "1a" : "rgba(255,255,255,0.04)",
                    color: isSelected ? accentColor : "rgba(255,255,255,0.5)",
                    boxShadow: isSelected ? `0 0 16px ${accentColor}44` : "none",
                    transform: isSelected ? "scale(1.05)" : "scale(1)",
                  }}
                >
                  {g.name?.replace(/\D/g, "") || g.name}
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          <button
            onClick={onNext}
            disabled={!selectedGrade}
            className="w-full py-3.5 rounded-2xl text-sm font-bold transition-all duration-200 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: selectedGrade ? accentColor : "#333",
              color: selectedGrade ? "#0f0f13" : "#666",
              boxShadow: selectedGrade ? `0 4px 20px ${accentColor}55` : "none",
            }}
          >
            Continue to Subject →
          </button>
        </div>
      </div>
    </div>
  );
}