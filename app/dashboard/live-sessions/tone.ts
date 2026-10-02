import type { Tone } from "./types";

// Soft tile background + icon color per tone
export const toneTile: Record<Tone, string> = {
  teal: "bg-teal-50 text-teal-600",
  blue: "bg-blue-50 text-blue-600",
  purple: "bg-violet-50 text-violet-600",
  orange: "bg-orange-50 text-orange-500",
  rose: "bg-rose-50 text-rose-500",
  amber: "bg-amber-50 text-amber-500",
};

export const toneText: Record<Tone, string> = {
  teal: "text-teal-700",
  blue: "text-blue-600",
  purple: "text-violet-600",
  orange: "text-orange-600",
  rose: "text-rose-600",
  amber: "text-amber-600",
};

export const toneChip: Record<Tone, string> = {
  teal: "bg-teal-50 text-teal-700",
  blue: "bg-blue-50 text-blue-600",
  purple: "bg-violet-50 text-violet-600",
  orange: "bg-orange-50 text-orange-600",
  rose: "bg-rose-50 text-rose-600",
  amber: "bg-amber-50 text-amber-600",
};