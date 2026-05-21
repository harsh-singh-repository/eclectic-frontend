"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export type Subject = {
  id: string;
  name: string;
  icon: File;
  color: string;
  slug: string;
};

interface ColumnActions {
  onEdit: (subject: Subject) => void;
  onDelete: (subject: Subject) => void;
}

export function getSubjectColumns({ onEdit, onDelete }: ColumnActions): ColumnDef<Subject>[] {
  return [
    {
      accessorKey: "icon",
      header: "Icon",
      size: 60,
      cell: ({ row }) => {
        const icon = row.original.icon;

        return (
          <div className="w-10 h-10 relative">
            <Image
              src={URL.createObjectURL(icon)}
              alt="icon"
              fill
              className="object-contain rounded-md"
            />
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <span className="font-medium text-neutral-900 text-sm">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "slug",
      header: "Slug",
      cell: ({ row }) => (
        <code className="text-xs bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-md font-mono">
          {row.original.slug}
        </code>
      ),
    },
    {
      accessorKey: "color",
      header: "Color",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-5 h-5 rounded-full border border-neutral-200 shrink-0"
            style={{ backgroundColor: row.original.color }}
          />
          <span className="text-xs font-mono text-neutral-500">{row.original.color}</span>
        </div>
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
            className="h-8 w-8 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100"
            onClick={() => onEdit(row.original)}
          >
            <Pencil className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-neutral-400 hover:text-red-500 hover:bg-red-50"
            onClick={() => onDelete(row.original)}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      ),
    },
  ];
}