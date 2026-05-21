// components/content/content-tree-node.tsx
"use client";

import { useState } from "react";
import {
  ChevronRight,
  BookOpen,
  FileText,
  Dumbbell,
  MoreHorizontal,
  Pencil,
  Trash2,
  Plus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Content, ContentType } from "@/app/types/content/content-types";

// ─── Icon & label map ───────────────────────────────────────────────
const TYPE_META: Record<
  ContentType,
  { icon: React.ElementType; label: string; color: string }
> = {
  CHAPTER: {
    icon: BookOpen,
    label: "Chapter",
    color: "text-blue-600",
  },
  SUBCHAPTER: {
    icon: FileText,
    label: "Sub-chapter",
    color: "text-violet-600",
  },
  EXERCISE: {
    icon: Dumbbell,
    label: "Exercise",
    color: "text-amber-600",
  },
};

// ─── Props ──────────────────────────────────────────────────────────
interface ContentTreeNodeProps {
  node: Content;
  depth?: number;
  onEdit: (node: Content) => void;
  onDelete: (node: Content) => void;
  onAddChild: (parent: Content) => void;
}

export function ContentTreeNode({
  node,
  depth = 0,
  onEdit,
  onDelete,
  onAddChild,
}: ContentTreeNodeProps) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;
  const { icon: Icon, label, color } = TYPE_META[node.type];

  return (
    <div>
      {/* ── Node row ── */}
      <div
        className={cn(
          "group flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-zinc-100",
          depth > 0 && "ml-5 border-l border-zinc-200 pl-3"
        )}
      >
        {/* Expand toggle */}
        <button
          onClick={() => setExpanded((e) => !e)}
          className={cn(
            "flex h-4 w-4 shrink-0 items-center justify-center rounded transition-transform text-zinc-400",
            hasChildren ? "opacity-100" : "opacity-0 pointer-events-none",
            expanded && "rotate-90"
          )}
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>

        {/* Type icon */}
        <Icon className={cn("h-4 w-4 shrink-0", color)} />

        {/* Title */}
        <span className="flex-1 truncate text-sm font-medium text-zinc-800">
          {node.title}
        </span>

        {/* Badges */}
        <div className="flex items-center gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
          <Badge
            variant="outline"
            className="h-5 border-zinc-200 px-1.5 py-0 text-[10px] font-normal text-zinc-500"
          >
            {label}
          </Badge>

          {node.pricing?.type === "PAID" && (
            <Badge className="h-5 bg-emerald-50 px-1.5 py-0 text-[10px] font-medium text-emerald-700 border border-emerald-200 hover:bg-emerald-50">
              ₹{node.pricing.price ?? "—"}
            </Badge>
          )}

          {!node.isPublished && (
            <Badge className="h-5 bg-zinc-100 px-1.5 py-0 text-[10px] font-medium text-zinc-500 border-0 hover:bg-zinc-100">
              Draft
            </Badge>
          )}
        </div>

        {/* Actions dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex h-6 w-6 shrink-0 items-center justify-center rounded opacity-0 transition-opacity hover:bg-zinc-200 group-hover:opacity-100">
              <MoreHorizontal className="h-3.5 w-3.5 text-zinc-500" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44 text-sm">
            {node.type !== "EXERCISE" && (
              <DropdownMenuItem
                onClick={() => onAddChild(node)}
                className="gap-2 text-zinc-700"
              >
                <Plus className="h-3.5 w-3.5" />
                Add child
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => onEdit(node)}
              className="gap-2 text-zinc-700"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(node)}
              className="gap-2 text-red-600 focus:text-red-600"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* ── Children ── */}
      {expanded && hasChildren && (
        <div>
          {node.children!.map((child) => (
            <ContentTreeNode
              key={child._id}
              node={child}
              depth={depth + 1}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddChild={onAddChild}
            />
          ))}
        </div>
      )}
    </div>
  );
}