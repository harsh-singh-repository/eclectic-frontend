"use client";

import { Eye, Search, UserRound } from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Student } from "@/app/services/sudent-services/student-service";

interface StudentTableProps {
  students: Student[];
  isLoading?: boolean;
}

const typeStyles = {
  REGULAR: "bg-zinc-100 text-zinc-700",
  SCHOLAR: "bg-blue-50 text-blue-700",
  ECLECTIC: "bg-purple-50 text-purple-700",
};

export function StudentTable({
  students,
  isLoading,
}: StudentTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        student.name
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        student.email
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        student.mobileNumber?.includes(search);

      const matchesType =
        typeFilter === "ALL" ||
        student.studentType === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [students, search, typeFilter]);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 border-b border-zinc-200">
        <div className="relative w-full md:w-80">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search students..."
            className="w-full h-10 rounded-lg border border-zinc-200 bg-zinc-50 pl-9 pr-3 text-sm outline-none focus:border-zinc-400"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="h-10 rounded-lg border border-zinc-200 bg-white px-3 text-sm outline-none"
        >
          <option value="ALL">All Students</option>
          <option value="REGULAR">Regular</option>
          <option value="SCHOLAR">Scholar</option>
          <option value="ECLECTIC">Eclectic</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50/70">
              <th className="text-left px-5 py-3 font-medium text-zinc-500">
                Student
              </th>

              <th className="text-left px-5 py-3 font-medium text-zinc-500">
                Mobile
              </th>

              <th className="text-left px-5 py-3 font-medium text-zinc-500">
                Grade
              </th>

              <th className="text-left px-5 py-3 font-medium text-zinc-500">
                Type
              </th>

              <th className="text-left px-5 py-3 font-medium text-zinc-500">
                Courses
              </th>

              <th className="text-right px-5 py-3 font-medium text-zinc-500">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <tr key={index} className="border-b border-zinc-100">
                  {Array.from({ length: 6 }).map((_, cell) => (
                    <td key={cell} className="px-5 py-4">
                      <div className="h-4 w-full max-w-[120px] rounded bg-zinc-100 animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : filteredStudents.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-12 text-center text-zinc-500"
                >
                  No students found
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => (
                <tr
                  key={student._id}
                  className="border-b border-zinc-100 hover:bg-zinc-50/70 transition"
                >
                  {/* Student */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {student.image ? (
                        <img
                          src={student.image}
                          alt={student.name}
                          className="h-9 w-9 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-9 w-9 rounded-full bg-zinc-100 flex items-center justify-center">
                          <UserRound
                            size={17}
                            className="text-zinc-500"
                          />
                        </div>
                      )}

                      <div>
                        <p className="font-medium text-zinc-900">
                          {student.name || "Unnamed Student"}
                        </p>

                        <p className="text-xs text-zinc-400">
                          {student.email || "No email"}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Mobile */}
                  <td className="px-5 py-4 text-zinc-600">
                    {student.mobileNumber}
                  </td>

                  {/* Grade */}
                  <td className="px-5 py-4 text-zinc-600">
                    {student.grade || "-"}
                  </td>

                  {/* Type */}
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                        typeStyles[student.studentType]
                      }`}
                    >
                      {student.studentType}
                    </span>
                  </td>

                  {/* Courses */}
                  <td className="px-5 py-4 text-zinc-600">
                    {student.stats?.coursesEnrolled ?? 0}
                  </td>

                  {/* Action */}
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() =>
                        router.push(
                          `/admin/students/${student._id}`
                        )
                      }
                      className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100 transition"
                    >
                      <Eye size={14} />
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-zinc-200 text-xs text-zinc-400">
        Showing {filteredStudents.length} of {students.length} students
      </div>
    </div>
  );
}