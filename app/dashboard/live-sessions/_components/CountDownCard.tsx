import { Radio } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Countdown } from "../types";

export function CountdownCard({ countdown }: { countdown: Countdown }) {
  const units = [
    { label: "Hours", value: countdown.hours },
    { label: "Minutes", value: countdown.minutes },
    { label: "Seconds", value: countdown.seconds },
  ];

  return (
    <Card className="relative h-full overflow-hidden shadow-none">
      <div className="pointer-events-none absolute -right-6 top-6 flex h-20 w-20 items-center justify-center rounded-full bg-teal-50 text-teal-500">
        <Radio className="h-8 w-8" />
      </div>
      <CardContent className="flex h-full flex-col justify-between gap-4 p-6">
        <p className="flex items-center gap-2 text-sm text-slate-600">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
          </span>
          Live in
        </p>

        <div className="flex gap-6">
          {units.map((u) => (
            <div key={u.label} className="text-center">
              <p className="text-3xl font-bold tabular-nums text-teal-700">{u.value}</p>
              <p className="mt-1 text-xs text-slate-500">{u.label}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-slate-400">Be ready! Your session will start soon.</p>
      </CardContent>
    </Card>
  );
}