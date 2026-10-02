"use client";

import { useGetStudents } from "@/app/hooks/students-hooks/studentHooks";
import { StudentTable } from "@/components/students/Student-Table";


export default function StudentsPage() {
  const { data, isLoading } = useGetStudents();

  const students = data?.students ?? [];

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs text-zinc-400 uppercase tracking-widest mb-1">
          Admin / Students
        </p>

        <h1 className="text-2xl font-semibold text-zinc-900">
          Students
        </h1>

        <p className="text-sm text-zinc-500 mt-1">
          Manage students and view their academic analytics
        </p>
      </div>

      <StudentTable
        students={students}
        isLoading={isLoading}
      />
    </div>
  );
}