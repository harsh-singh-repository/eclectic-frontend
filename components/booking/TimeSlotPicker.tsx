"use client";

import { TimeSlot } from "@/app/types/bookings";

interface TimeSlotPickerProps {
  slots: TimeSlot[];
  selected: TimeSlot | null;
  onSelect: (slot: TimeSlot) => void;
}

export default function TimeSlotPicker({
  slots,
  selected,
  onSelect,
}: TimeSlotPickerProps) {
  const amSlots = slots.filter((s) => s.period === "AM");
  const pmSlots = slots.filter((s) => s.period === "PM");

  const SlotButton = ({ slot }: { slot: TimeSlot }) => {
    const isSelected = selected?.id === slot.id;

    return (
      <button
        disabled={!slot.available}
        onClick={() => slot.available && onSelect(slot)}
        className={`
          relative px-4 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all duration-200 min-w-[80px]
          ${
            isSelected
              ? "bg-indigo-500 text-white border-indigo-500 shadow-md shadow-indigo-100"
              : slot.available
              ? "bg-white text-slate-700 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
              : "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed line-through"
          }
        `}
      >
        {slot.time}
        {!slot.available && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-slate-300 rounded-full flex items-center justify-center">
            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🌅</span>
          <p className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
            Morning
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {amSlots.map((slot) => (
            <SlotButton key={slot.id} slot={slot} />
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🌇</span>
          <p className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
            Afternoon & Evening
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {pmSlots.map((slot) => (
            <SlotButton key={slot.id} slot={slot} />
          ))}
        </div>
      </div>

      {/* Availability Key */}
      <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block" />
          Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-slate-200 inline-block" />
          Booked
        </span>
      </div>
    </div>
  );
}