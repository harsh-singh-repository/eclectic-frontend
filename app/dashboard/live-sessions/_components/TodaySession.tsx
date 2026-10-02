import { ArrowRight, Atom, BookOpen, CalendarDays, Check, Clock, Code2, Layers, MoreVertical, Radio } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { toneTile } from "../tone";
import type { SessionIcon, TodaySession } from "../types";

const icons: Record<SessionIcon, typeof BookOpen> = {
  book: BookOpen,
  atom: Atom,
  layers: Layers,
  code: Code2,
};

function SessionAction({ session }: { session: TodaySession }) {
  switch (session.status) {
    case "completed":
      return (
        <Badge variant="outline" className="gap-1 rounded-full border-teal-200 bg-teal-50/60 px-3 font-normal text-teal-700">
          <Check className="h-3 w-3" /> {session.statusLabel}
        </Badge>
      );
    case "live":
      return (
        <>
          <Badge variant="outline" className="gap-1 rounded-full border-teal-200 bg-white px-3 font-normal text-teal-600">
            <Radio className="h-3 w-3" /> {session.statusLabel}
          </Badge>
          <Button size="sm" className="bg-teal-600 px-6 hover:bg-teal-700">Join</Button>
        </>
      );
    case "starts-soon":
      return (
        <>
          <Badge variant="outline" className="gap-1 rounded-full border-teal-200 bg-white px-3 font-normal text-teal-600">
            <Clock className="h-3 w-3" /> {session.statusLabel}
          </Badge>
          <Button size="sm" variant="outline" className="border-teal-300 px-6 text-teal-700">Join</Button>
        </>
      );
    default:
      return (
        <Badge variant="secondary" className="gap-1 rounded-full bg-slate-100 px-3 font-normal text-slate-500 hover:bg-slate-100">
          <Clock className="h-3 w-3" /> {session.statusLabel}
        </Badge>
      );
  }
}

export function TodaysSessions({ sessions }: { sessions: TodaySession[] }) {
  return (
    <Card className="shadow-none">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-3 text-base font-semibold">
          <CalendarDays className="h-5 w-5 text-teal-600" /> Weekend&apos;s Maths Practice Lab
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {sessions.map((s) => {
          const Icon = icons[s.icon];
          return (
            <div
              key={s.id}
              className={cn(
                "flex items-center gap-4 rounded-lg border px-4 py-3",
                s.status === "live" && "border-teal-100 bg-teal-50/70"
              )}
            >
              <div className="w-20 shrink-0 text-sm">
                <p className={cn("font-medium", s.status === "live" ? "text-teal-600" : "text-slate-800")}>{s.start}</p>
                <p className="text-slate-500">{s.end}</p>
              </div>

              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${toneTile[s.tone]}`}>
                <Icon className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900">{s.title}</p>
                <p className="text-xs text-slate-500">{s.subtitle}</p>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <SessionAction session={s} />
                {(s.status === "completed" || s.status === "upcoming") && (
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400" aria-label="More options">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}