"use client";

import React, { useState } from "react";
import { AnalyticsHeader, MonthNav } from "./_component/AnalyticsHeader";
import { AcademicPerformanceOverview } from "./_component/AcademicPerformanceOverview";
import { SubjectPerformance } from "./_component/SubjectPerformance";
import { defaultWeekId } from "./_component/analyticsData";
import { RatingCalendar } from "./_component/RatingCalender";
import { WeekDetailsPanel } from "./_component/WeekDetailsPannel";
import { PerformanceTrendChart } from "./_component/PerformanceTrendsChart";
import { SubjectHighlights } from "./_component/SubjectHighlight";

const WEEK_ORDER = ["w0", "w1", "w2", "w3", "w4"];

const AnalyticsPage = () => {
  const [selectedWeekId, setSelectedWeekId] = useState(defaultWeekId);

  const handleToday = () => setSelectedWeekId(defaultWeekId);
  const handlePrevMonth = () => {};
  const handleNextMonth = () => {};

  const stepWeek = (dir) => {
    const idx = WEEK_ORDER.indexOf(selectedWeekId);
    const next = WEEK_ORDER[Math.min(Math.max(idx + dir, 0), WEEK_ORDER.length - 1)];
    setSelectedWeekId(next);
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">


      <main className="flex-1 p-6 flex flex-col gap-5">
        <div>
          <AnalyticsHeader />
          <MonthNav
            onToday={handleToday}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
          />
        </div>

        <div className="grid grid-cols-2 gap-5 items-stretch">
          <RatingCalendar selectedWeekId={selectedWeekId} onSelectWeek={setSelectedWeekId} />
          <WeekDetailsPanel
            selectedWeekId={selectedWeekId}
            onPrevWeek={() => stepWeek(-1)}
            onNextWeek={() => stepWeek(1)}
          />
        </div>

        <AcademicPerformanceOverview />

        <div className="grid grid-cols-[1.1fr_1.4fr_1fr] gap-5 items-stretch">
          <SubjectPerformance />
          <PerformanceTrendChart />
          <SubjectHighlights />
        </div>
      </main>
    </div>
  );
};

export default AnalyticsPage;