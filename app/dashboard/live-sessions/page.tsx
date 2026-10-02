import { CountdownCard } from "./_components/CountDownCard";
import { NextSessionCard } from "./_components/NextSessionCard";
import { PageHeader } from "./_components/PageHeader";
import { RecentRecordings } from "./_components/RecentRecording";
import { ScheduleCalendar } from "./_components/ScheduledCalender";
import { StatsRow } from "./_components/StatsRow";
import { TodaysSessions } from "./_components/TodaySession";
import {
  countdown,
  nextSession,
  recordings,
  stats,
  todaySessions,
} from "./data";

export default function LiveSessionsPage() {
  return (
    <div className="space-y-6 bg-slate-50/50 p-6">
      <PageHeader />

      <section className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <NextSessionCard session={nextSession} />
        <CountdownCard countdown={countdown} />
      </section>

      <StatsRow stats={stats} />

      <section className="grid gap-4 lg:grid-cols-[1.45fr_1fr]">
        <TodaysSessions sessions={todaySessions} />
        <ScheduleCalendar />
      </section>

      <RecentRecordings recordings={recordings} />
    </div>
  );
}
