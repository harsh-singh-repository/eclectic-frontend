"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryFormDialog } from "./CategoryFormDialog";

export function CategoryPageHeader() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-end justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-stone-900">
          Categories
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          Manage classes, boards, and types for your platform.
        </p>
      </div>

      <Button
        onClick={() => setOpen(true)}
        className="gap-2 bg-stone-900 text-white hover:bg-stone-700 rounded-md text-sm"
      >
        <Plus className="h-4 w-4" />
        New Category
      </Button>

      <CategoryFormDialog open={open} onOpenChange={setOpen} mode="create" />
    </div>
  );
}