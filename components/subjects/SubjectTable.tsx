"use client";

import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetSubjects } from "@/app/hooks/subject-hooks/SubjectHooks";
import { getSubjectColumns, Subject } from "./SubjectColumn";
import { DeleteSubjectDialog } from "./DeleteSubjectDialog";
import { useSubjectSheet } from "./SubjecrSheetContext";
import { SubjectSheet } from "./SubjectSheet";


export function SubjectsTable() {
  const { data, isLoading, isError } = useGetSubjects();
  const { openEdit } = useSubjectSheet();


  const [deleteTarget, setDeleteTarget] = useState<Subject | null>(null);

  const columns = getSubjectColumns({
    onEdit: (subject) =>
      openEdit(subject.id, {
        name: subject.name,
        icon: subject.icon,
        color: subject.color,
        slug: subject.slug,
      }),
    onDelete: (subject) => setDeleteTarget(subject),
  });

  const table = useReactTable({
    data: data?.subjects ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <div className="rounded-xl border border-neutral-100 bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="border-b border-neutral-100 hover:bg-transparent">
                {hg.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-xs font-medium text-neutral-400 uppercase tracking-wide h-10 px-4"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i} className="border-b border-neutral-50">
                  {columns.map((_, j) => (
                    <TableCell key={j} className="px-4 py-3">
                      <Skeleton className="h-4 w-full rounded-md" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-10 text-sm text-red-400">
                  Failed to load subjects.
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-12 text-sm text-neutral-400">
                  No subjects yet. Create your first one.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-b border-neutral-50 hover:bg-neutral-50/60 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Footer row count */}
        {data && data.length > 0 && (
          <div className="px-4 py-2.5 border-t border-neutral-50 text-xs text-neutral-400">
            {data.length} subject{data.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>

      {/* Sheet */}
      <SubjectSheet/>

      {/* Delete Dialog */}
      <DeleteSubjectDialog
        id={deleteTarget?.id ?? null}
        name={deleteTarget?.name}
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
      />
    </>
  );
}