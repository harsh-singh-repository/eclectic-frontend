import { ArrowRight, BookOpen, MoreVertical, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toneChip } from "../tone";
import type { Recording } from "../types";

function RecordingCard({ rec }: { rec: Recording }) {
  return (
    <div className="flex gap-3 rounded-lg border p-2">
      <div className={`relative h-24 w-24 shrink-0 overflow-hidden rounded-md bg-gradient-to-br ${rec.gradient}`}>
        <button
          type="button"
          aria-label={`Play ${rec.title}`}
          className="absolute left-1/2 top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-900"
        >
          <Play className="h-4 w-4 fill-current" />
        </button>
        <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white">
          {rec.duration}
        </span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
        <div className="flex items-start justify-between gap-1">
          <p className="text-sm font-semibold leading-snug text-slate-900">{rec.title}</p>
          <MoreVertical className="h-4 w-4 shrink-0 text-slate-400" />
        </div>
        <div>
          <p className="text-xs text-slate-500">{rec.teacher}</p>
          <p className="text-xs text-slate-400">{rec.date}</p>
        </div>
        <span className={`flex w-fit items-center gap-1 rounded px-2 py-0.5 text-[11px] ${toneChip[rec.tone]}`}>
          <BookOpen className="h-3 w-3" /> {rec.subject}
        </span>
      </div>
    </div>
  );
}

export function RecentRecordings({ recordings }: { recordings: Recording[] }) {
  return (
    <Card className="shadow-none">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-3 text-base font-semibold">
          <Play className="h-5 w-5 text-red-500" /> Recent Session Recordings
        </CardTitle>
        <Button variant="outline" size="sm">
          View All <ArrowRight className="ml-1 h-3.5 w-3.5" />
        </Button>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {recordings.map((r) => (
          <RecordingCard key={r.id} rec={r} />
        ))}
      </CardContent>
    </Card>
  );
}