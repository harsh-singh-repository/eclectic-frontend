import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CALENDAR } from "../data";
import type { CalendarDotType } from "../types";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const dotColor: Record<CalendarDotType, string> = {
  upcoming: "bg-teal-500",
  live: "bg-blue-500",
  completed: "bg-rose-400",
};

const legend: { label: string; type: CalendarDotType }[] = [
  { label: "Upcoming", type: "upcoming" },
  { label: "Live Session", type: "live" },
  { label: "Completed", type: "completed" },
];

interface Cell {
  day: number;
  muted: boolean;
}

function buildCells(year: number, month: number): Cell[] {
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();

  const cells: Cell[] = [];
  for (let i = firstWeekday - 1; i >= 0; i--) cells.push({ day: daysInPrev - i, muted: true });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, muted: false });
  const trailing = (7 - (cells.length % 7)) % 7;
  for (let d = 1; d <= trailing; d++) cells.push({ day: d, muted: true });
  return cells;
}

export function ScheduleCalendar() {
  const { year, month, today, events } = CALENDAR;
  const cells = buildCells(year, month);
  const monthLabel = new Date(year, month).toLocaleString("en-US", { month: "long", year: "numeric" });

  return (
    <Card className="shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-3 text-base font-semibold">
          <CalendarDays className="h-5 w-5 text-teal-600" /> My Schedule
        </CardTitle>
        <div className="flex items-center justify-between pt-2">
          <p className="text-base font-semibold text-slate-900">{monthLabel}</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8" aria-label="Previous month">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8" aria-label="Next month">
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">Today</Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-7 overflow-hidden rounded-lg border text-center text-sm">
          {WEEKDAYS.map((d) => (
            <div key={d} className="border-b bg-slate-50 py-2 text-xs text-slate-500">{d}</div>
          ))}
          {cells.map((cell, i) => {
            const isToday = !cell.muted && cell.day === today;
            const dots = cell.muted ? [] : events[cell.day] ?? [];
            return (
              <div key={i} className="flex h-11 items-center justify-center p-1">
                <div
                  className={cn(
                    "flex h-full w-full flex-col items-center justify-center rounded-md",
                    cell.muted && "text-slate-300",
                    !cell.muted && !isToday && "text-slate-700",
                    isToday && "bg-teal-600 font-semibold text-white"
                  )}
                >
                  <span className="leading-none">{cell.day}</span>
                  {dots.length > 0 && (
                    <span className="mt-1 flex gap-0.5">
                      {dots.map((t, idx) => (
                        <span
                          key={idx}
                          className={cn("h-1 w-1 rounded-full", isToday ? "bg-white" : dotColor[t])}
                        />
                      ))}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
          {legend.map((l) => (
            <li key={l.type} className="flex items-center gap-2">
              <span className={cn("h-2 w-2 rounded-full", dotColor[l.type])} />
              {l.label}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}