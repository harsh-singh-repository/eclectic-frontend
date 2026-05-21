"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  type: "CLASS" | "BOARD" | "TYPE";
  parentId:{
    _id: string;
    name: string;
    type: "CLASS" | "BOARD" | "TYPE";
  }
};

const TYPE_COLORS: Record<string, string> = {
  CLASS: "bg-blue-50 text-blue-700 border-blue-100",
  BOARD: "bg-amber-50 text-amber-700 border-amber-100",
  TYPE: "bg-emerald-50 text-emerald-700 border-emerald-100",
};

interface ActionHandlers {
  onEdit: (row: CategoryRow) => void;
  onDelete: (row: CategoryRow) => void;
}

export function getCategoryColumns({
  onEdit,
  onDelete,
}: ActionHandlers): ColumnDef<CategoryRow>[] {
  return [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <span className="font-medium text-stone-800 text-sm">
          {row.original.name}
        </span>
      ),
    },
    {
      accessorKey: "slug",
      header: "Slug",
      cell: ({ row }) => (
        <span className="font-mono text-xs text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
          {row.original.slug}
        </span>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className={`text-xs font-medium ${TYPE_COLORS[row.original.type]}`}
        >
          {row.original.type}
        </Badge>
      ),
    },
    {
      accessorKey: "parentId",
      header: "Parent",
      cell: ({ row }) =>
        row.original.parentId ? (
          <span className="text-sm text-stone-500">{row.original.parentId?.name}</span>
        ) : (
          <span className="text-xs text-stone-300">—</span>
        ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-stone-400 hover:text-stone-700 hover:bg-stone-100"
            onClick={() => onEdit(row.original)}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-stone-400 hover:text-red-600 hover:bg-red-50"
            onClick={() => onDelete(row.original)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ];
}