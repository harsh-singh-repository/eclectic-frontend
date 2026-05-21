// components/content/content-table.tsx
"use client";

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from "@tanstack/react-table";
import { useState, useMemo } from "react";
import {
  ArrowUpDown,
  Pencil,
  Trash2,
  BookOpen,
  FileText,
  Dumbbell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Content, ContentType } from "@/app/types/content/content-types";

// ─── Flatten tree for table ─────────────────────────────────────────
function flattenTree(nodes: Content[], depth = 0): (Content & { depth: number })[] {
  return nodes.flatMap((n) => [
    { ...n, depth },
    ...(n.children ? flattenTree(n.children, depth + 1) : []),
  ]);
}

// ─── Type badge ─────────────────────────────────────────────────────
const TYPE_ICON: Record<ContentType, React.ElementType> = {
  CHAPTER: BookOpen,
  SUBCHAPTER: FileText,
  EXERCISE: Dumbbell,
};
const TYPE_COLOR: Record<ContentType, string> = {
  CHAPTER: "text-blue-600 bg-blue-50 border-blue-200",
  SUBCHAPTER: "text-violet-600 bg-violet-50 border-violet-200",
  EXERCISE: "text-amber-600 bg-amber-50 border-amber-200",
};

// ─── Column helper ──────────────────────────────────────────────────
const col = createColumnHelper<Content & { depth: number }>();

// ─── Props ──────────────────────────────────────────────────────────
interface ContentTableProps {
  data: Content[] | undefined;
  onEdit: (node: Content) => void;
  onDelete: (node: Content) => void;
}

export function ContentTable({ data, onEdit, onDelete }: ContentTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const flatData = useMemo(() => flattenTree(data ?? []), [data]);

  const columns = useMemo(
    () => [
      col.accessor("title", {
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 text-xs font-medium text-zinc-500 hover:text-zinc-800"
            onClick={() => column.toggleSorting()}
          >
            Title <ArrowUpDown className="h-3 w-3" />
          </button>
        ),
        cell: ({ row }) => {
          const indent = row.original.depth * 20;
          return (
            <span
              className="block truncate text-sm font-medium text-zinc-800"
              style={{ paddingLeft: indent }}
            >
              {row.original.title}
            </span>
          );
        },
      }),

      col.accessor("type", {
        header: () => (
          <span className="text-xs font-medium text-zinc-500">Type</span>
        ),
        cell: ({ getValue }) => {
          const type = getValue();
          const Icon = TYPE_ICON[type];
          return (
            <Badge
              variant="outline"
              className={cn("gap-1 px-2 py-0.5 text-xs font-medium", TYPE_COLOR[type])}
            >
              <Icon className="h-3 w-3" />
              {type.charAt(0) + type.slice(1).toLowerCase()}
            </Badge>
          );
        },
      }),

      col.accessor("order", {
        header: () => (
          <span className="text-xs font-medium text-zinc-500">Order</span>
        ),
        cell: ({ getValue }) => (
          <span className="text-sm text-zinc-500">{getValue()}</span>
        ),
      }),

      col.accessor("pricing", {
        header: () => (
          <span className="text-xs font-medium text-zinc-500">Pricing</span>
        ),
        cell: ({ getValue }) => {
          const pricing = getValue();
          if (!pricing) return <span className="text-sm text-zinc-300">—</span>;
          return pricing.type === "PAID" ? (
            <span className="text-sm font-medium text-emerald-700">
              ₹{pricing.price ?? "—"}
            </span>
          ) : (
            <span className="text-sm text-zinc-400">Free</span>
          );
        },
      }),

      col.accessor("isPublished", {
        header: () => (
          <span className="text-xs font-medium text-zinc-500">Status</span>
        ),
        cell: ({ getValue }) =>
          getValue() ? (
            <Badge className="bg-green-50 text-green-700 border border-green-200 text-xs font-medium hover:bg-green-50">
              Published
            </Badge>
          ) : (
            <Badge className="bg-zinc-100 text-zinc-500 border-0 text-xs font-medium hover:bg-zinc-100">
              Draft
            </Badge>
          ),
      }),

      col.display({
        id: "actions",
        header: () => null,
        cell: ({ row }) => (
          <div className="flex justify-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-zinc-400 hover:text-zinc-700"
              onClick={() => onEdit(row.original)}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-zinc-400 hover:text-red-600"
              onClick={() => onDelete(row.original)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        ),
      }),
    ],
    [onEdit, onDelete]
  );

  const table = useReactTable({
    data: flatData,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="space-y-3">
      {/* Search */}
      <Input
        placeholder="Search content…"
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="h-8 w-64 text-sm"
      />

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-zinc-200">
        <table className="w-full text-left">
          <thead className="border-b border-zinc-200 bg-zinc-50">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => (
                  <th
                    key={h.id}
                    className="px-4 py-2.5 first:w-1/2"
                  >
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-sm text-zinc-400"
                >
                  No content found.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="bg-white transition-colors hover:bg-zinc-50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-2.5">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-right text-xs text-zinc-400">
        {table.getRowModel().rows.length} item
        {table.getRowModel().rows.length !== 1 && "s"}
      </p>
    </div>
  );
}