"use client";

import React from "react";

import { StudentDetails } from "./_component/StudentDetailCard";
import { StudentRating } from "./_component/StudentRating";
import { ClassProgress } from "./_component/ClassProgress";
import { PopularCourses } from "./_component/PopularCourses";
import { MyResources } from "./_component/MyResources";
import { PendingClasses } from "./_component/PendingClasses";
import { CalendarDays } from "lucide-react";
import { currentWeek } from "./_component/dashboardData";
import { DashboardHeader } from "./_component/DashboardHeader";

export function WeekBadge() {
  return (
    <div className="flex w-fit shrink-0 items-center gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-2.5 shadow-sm">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50">
        <CalendarDays
          size={17}
          className="text-teal-600"
          strokeWidth={1.8}
        />
      </div>

      <div>
        <p className="text-sm font-semibold leading-tight text-gray-900">
          {currentWeek.label}
        </p>

        <p className="text-[11px] text-gray-500">
          {currentWeek.range}
        </p>
      </div>
    </div>
  );
}

const Page = () => {
  return (
    <div className="min-h-screen w-full bg-gray-50 p-4 sm:p-5 lg:p-6">
      
      {/* Header */}
      <div className="mb-5 flex flex-col gap-4 lg:relative lg:block">
        <DashboardHeader />

        <div className="lg:absolute lg:right-7 lg:top-6">
          <WeekBadge />
        </div>
      </div>

      {/* Student Details + Rating */}
      <div className="mb-5 grid w-full grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="min-w-0 lg:col-span-2">
          <StudentDetails />
        </div>

        <div className="min-w-0 lg:col-span-1">
          <StudentRating />
        </div>
      </div>

      {/* Class Progress + Popular Courses */}
      <div className="mb-5 grid w-full grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="min-w-0 lg:col-span-1">
          <ClassProgress />
        </div>

        <div className="min-w-0 lg:col-span-2">
          <PopularCourses />
        </div>
      </div>

      {/* Resources + Pending Classes */}
      <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="min-w-0">
          <MyResources />
        </div>

        <div className="min-w-0">
          <PendingClasses />
        </div>
      </div>
    </div>
  );
};

export default Page;