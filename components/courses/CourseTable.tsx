"use client";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Course } from "@/app/types/courses/CoursesTypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { getCourseColumns } from "./column";

interface CourseTableProps {
  courses: Course[];
  isLoading: boolean;
  onEdit: (course: Course) => void;
  onDelete: (course: Course) => void;
  onCreateNew: () => void;
}

export function CourseTable({ courses, isLoading, onEdit, onDelete, onCreateNew }: CourseTableProps) {
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = getCourseColumns({ onEdit, onDelete });

  const table = useReactTable({
    data: courses,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
          <Input
            placeholder="Search courses..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-8 h-8 text-sm border-zinc-200 bg-zinc-50 focus-visible:ring-1"
          />
        </div>
        <Button onClick={onCreateNew} size="sm" className="h-8 gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs">
          <Plus className="w-3.5 h-3.5" /> New Course
        </Button>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id} className="bg-zinc-50 hover:bg-zinc-50">
              {hg.headers.map((header) => (
                <TableHead key={header.id} className="text-xs font-medium text-zinc-500 h-9">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <TableRow key={i}>
                {columns.map((_, j) => (
                  <TableCell key={j}>
                    <div className="h-4 bg-zinc-100 rounded animate-pulse w-24" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : table.getRowModel().rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-12 text-sm text-zinc-400">
                No courses found.
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="hover:bg-zinc-50/50 transition-colors">
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-zinc-100 text-xs text-zinc-400">
        {table.getFilteredRowModel().rows.length} course{table.getFilteredRowModel().rows.length !== 1 ? "s" : ""}
      </div>
    </div>
  );
}