import { CalendarDays, CheckCircle2, Play, Radio } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { toneText, toneTile } from "../tone";
import type { StatItem } from "../types";

const icons = { calendar: CalendarDays, radio: Radio, check: CheckCircle2, play: Play };

export function StatsRow({ stats }: { stats: StatItem[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((s) => {
        const Icon = icons[s.icon];
        return (
          <Card key={s.id} className="shadow-none">
            <CardContent className="flex items-center gap-4 p-5">
              <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${toneTile[s.tone]}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className={`text-sm ${s.tone === "blue" ? "text-blue-600" : "text-slate-600"}`}>{s.label}</p>
                <p className={`text-2xl font-bold ${toneText[s.tone]}`}>{s.value}</p>
                <p className="text-xs text-slate-500">{s.caption}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}