"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AnalyticsHeader, MonthNav } from "./_component/AnalyticsHeader";
import { AcademicPerformanceOverview } from "./_component/AcademicPerformanceOverview";
import { SubjectPerformance } from "./_component/SubjectPerformance";
import { defaultWeekId } from "./_component/analyticsData";
import { RatingCalendar } from "./_component/RatingCalender";
import { WeekDetailsPanel } from "./_component/WeekDetailsPannel";
import { PerformanceTrendChart } from "./_component/PerformanceTrendsChart";
import { SubjectHighlights } from "./_component/SubjectHighlight";
import { useGetLoggedInStudent } from "@/app/hooks/students-hooks/studentHooks";


const AnalyticsPage = () => {


  const { data, isLoading, isError } = useGetLoggedInStudent();

  const student = data?.student;

  const analytics = student?.weeklyAnalytics ?? [];

  const [selectedWeekId, setSelectedWeekId] = useState<string | null>(null);

  /**
   * Select latest analytics automatically.
   */
  useEffect(() => {
    if (analytics.length > 0 && !selectedWeekId) {
      const latest = [...analytics].sort(
        (a, b) =>
          new Date(b.weekStartDate).getTime() -
          new Date(a.weekStartDate).getTime(),
      )[0];

      setSelectedWeekId(latest._id);
    }
  }, [analytics, selectedWeekId]);

  /**
   * Find selected week.
   */
  const selectedIndex = useMemo(() => {
    return analytics.findIndex((item) => item._id === selectedWeekId);
  }, [analytics, selectedWeekId]);

  const stepWeek = (direction: number) => {
    if (analytics.length === 0) return;

    const currentIndex = selectedIndex === -1 ? 0 : selectedIndex;

    const nextIndex = currentIndex + direction;

    if (nextIndex >= 0 && nextIndex < analytics.length) {
      setSelectedWeekId(analytics[nextIndex]._id);
    }
  };

  const handleToday = () => setSelectedWeekId(defaultWeekId);
  const handlePrevMonth = () => {};
  const handleNextMonth = () => {};


  return (
    <div className="flex bg-gray-50 min-h-screen">
      <main className="flex-1 p-6 flex flex-col gap-5">
        <div>
          <AnalyticsHeader />
          {/* <MonthNav
            onToday={handleToday}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
          /> */}
        </div>

        <div className="grid grid-cols-[40%_60%] gap-5">
          <RatingCalendar
            analytics={analytics}
            selectedWeekId={selectedWeekId}
            onSelectWeek={setSelectedWeekId}
          />

          <WeekDetailsPanel
            analytics={analytics}
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
