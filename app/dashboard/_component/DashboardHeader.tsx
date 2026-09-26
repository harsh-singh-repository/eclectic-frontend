"use client";

import { Bell, ChevronDown, CalendarDays } from "lucide-react";
import { useSession } from "next-auth/react";
import { currentWeek } from "./dashboardData";

export function DashboardHeader() {
  const { data: session } = useSession();
  const name = session?.user?.user?.name?.split(" ")?.[0] || "there";

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-white via-white to-teal-50 border border-gray-100 px-7 py-6 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
          Welcome back, {name}!
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Keep learning, keep growing. You&apos;re doing great! 🚀
        </p>
      </div>

      <div className="flex items-center gap-5 shrink-0">
        <button
          type="button"
          className="relative w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center hover:border-teal-200 transition-colors duration-150 cursor-pointer"
        >
          <Bell size={17} className="text-gray-500" strokeWidth={1.8} />
          <span className="absolute top-2 right-2.5 w-1.5 h-1.5 rounded-full bg-red-500" />
        </button>

        <div className="flex items-center gap-2.5 cursor-pointer">
          <div className="w-9 h-9 rounded-full bg-teal-500 flex items-center justify-center text-white text-xs font-semibold">
            {session?.user?.user?.name
              ?.split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2) || "HS"}
          </div>
          <span className="text-sm font-medium text-gray-800">
            {session?.user?.user?.name || "Harsh Singh"}
          </span>
          <ChevronDown size={15} className="text-gray-400" />
        </div>
      </div>

      <div className="absolute -right-8 -top-10 w-40 h-40 rounded-full bg-teal-100/40 blur-2xl pointer-events-none" />
    </div>
  );
}

export function WeekBadge() {
  return (
    <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl px-4 py-2.5 shadow-sm shrink-0">
      <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center">
        <CalendarDays size={17} className="text-teal-600" strokeWidth={1.8} />
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-900 leading-tight">
          {currentWeek.label}
        </p>
        <p className="text-[11px] text-gray-500">{currentWeek.range}</p>
      </div>
    </div>
  );
}