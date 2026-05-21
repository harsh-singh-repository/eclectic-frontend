"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Course } from "@/app/types/courses/CoursesTypes";
import { CourseBadge } from "./CourseBadge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

interface ColumnsProps {
  onEdit: (course: Course) => void;
  onDelete: (course: Course) => void;
}

export const getCourseColumns = ({ onEdit, onDelete }: ColumnsProps): ColumnDef<Course>[] => [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <div>
        <Link href={`/admin/courses/${row.original._id}`}>
          <p className="text-sm font-medium text-zinc-800">{row.original.title}</p>
        </Link>
        <p className="text-xs text-zinc-400">{row.original.slug}</p>
      </div>
    ),
  },
  {
    accessorKey: "subjectId",
    header: "Subject",
    cell: ({ row }) => (
      <span className="text-sm text-zinc-600">{row.original.subjectId?.name ?? "—"}</span>
    ),
  },
  {
    accessorKey: "pricing",
    header: "Pricing",
    cell: ({ row }) => <CourseBadge type={row.original?.pricing?.type} />,
  },
  {
    accessorKey: "isPublished",
    header: "Status",
    cell: ({ row }) => (
      <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${
        row.original.isPublished
          ? "text-emerald-700"
          : "text-zinc-400"
      }`}>
        <span className={`w-1.5 h-1.5 rounded-full ${
          row.original.isPublished ? "bg-emerald-500" : "bg-zinc-300"
        }`} />
        {row.original.isPublished ? "Published" : "Draft"}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => (
      <span className="text-xs text-zinc-400">
        {new Date(row.original.createdAt).toLocaleDateString()}
      </span>
    ),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="w-4 h-4 text-zinc-400" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-36">
          <DropdownMenuItem onClick={() => onEdit(row.original)}>
            <Pencil className="w-3.5 h-3.5 mr-2" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onDelete(row.original)}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];