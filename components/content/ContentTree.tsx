// components/content/content-tree.tsx
"use client";

import { Loader2, TreePine } from "lucide-react";
import { ContentTreeNode } from "./ContentTreeNode";
import { Content } from "@/app/types/content/content-types";

interface ContentTreeProps {
  data: Content[] | undefined;
  isLoading: boolean;
  onEdit: (node: Content) => void;
  onDelete: (node: Content) => void;
  onAddChild: (parent: Content) => void;
}

export function ContentTree({
  data,
  isLoading,
  onEdit,
  onDelete,
  onAddChild,
}: ContentTreeProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-zinc-400">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="ml-2 text-sm">Loading content…</span>
      </div>
    );
  }

  if (!data || data?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
        <TreePine className="mb-2 h-8 w-8 opacity-40" />
        <p className="text-sm">No content yet. Add a chapter to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-0.5">
      {data?.map((node) => (
        <ContentTreeNode
          key={node._id}
          node={node}
          depth={0}
          onEdit={onEdit}
          onDelete={onDelete}
          onAddChild={onAddChild}
        />
      ))}
    </div>
  );
}