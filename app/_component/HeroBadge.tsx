"use client";

export default function HeroBadge() {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-yellow-200 bg-[#FFFBEB] mb-6 group cursor-default">
      <span className="w-1.5 h-1.5 rounded-full bg-[#FFB900] animate-pulse" />
      <span className="text-xs font-semibold text-[#C14D00] tracking-wide">
        India&apos;s #1 Learning Platform for Excellence
      </span>
    </div>
  );
}