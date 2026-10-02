import { Clock, MoreVertical, Radio, UserRound, Video, CalendarDays, Code2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { NextSession } from "../types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function NextSessionCard({ session }: { session: NextSession }) {
  return (
    <Card className="border-teal-100 bg-gradient-to-br from-teal-50/80 to-white shadow-none">
      <CardContent className="flex flex-col gap-6 p-6 md:flex-row md:justify-between">
        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-2 text-sm font-medium text-teal-700">
              <Radio className="h-4 w-4" /> Next Live Session
            </span>
            <Badge variant="secondary" className="bg-teal-100/70 font-normal text-teal-700 hover:bg-teal-100/70">
              {session.startsIn}
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
              <Code2 className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-xl font-bold text-slate-900">{session.title}</h2>
              <p className="text-sm text-slate-500">{session.meta}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500">
            <span className="flex items-center gap-2"><CalendarDays className="h-4 w-4" />{session.time}</span>
            <span className="flex items-center gap-2"><Clock className="h-4 w-4" />{session.duration}</span>
            <span className="flex items-center gap-2"><UserRound className="h-4 w-4" />{session.type}</span>
          </div>
        </div>

        <div className="flex flex-col items-start gap-4 md:items-end">
          <div className="flex w-full items-center gap-3 md:w-auto">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-slate-200 font-semibold text-slate-700">
                {session.teacher.initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold text-slate-900">{session.teacher.name}</p>
              <p className="text-xs text-slate-400">{session.teacher.role}</p>
            </div>
            <Button variant="ghost" size="icon" className="ml-auto h-8 w-8 text-slate-400" aria-label="More options">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex gap-3">
            <Button className="bg-teal-600 hover:bg-teal-700">
              <Video className="mr-2 h-4 w-4" /> Join Session
            </Button>
            <Button variant="outline">View Details</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}