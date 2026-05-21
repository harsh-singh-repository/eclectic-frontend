"use client";

import { useState, useMemo } from "react";
import { Loader2 } from "lucide-react";

import { DataTable } from "./DataTable";
import { CategoryFormDialog } from "./CategoryFormDialog";
import { useGetCategories } from "@/app/hooks/category-hooks/category-hooks";
import { CategoryRow, getCategoryColumns } from "./CategoryColumn";
import { DeleteCategoryDialog } from "./DeleteCategories";

export function CategoryTableSection() {
  const { data: categories, isLoading, isError } = useGetCategories();

  const [editTarget, setEditTarget] = useState<CategoryRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CategoryRow | null>(null);

  console.log({
    "editTarget": editTarget,
    "deleteTarget": deleteTarget,
  })

  // Build a lookup map for parent names
  const parentMap = useMemo(() => {
    const map: Record<string, string> = {};
    categories?.forEach((c: {
      id: string;
      name: string;
    }) => { map[c.id] = c.name; });
    return map;
  }, [categories]);

  const rows: CategoryRow[] = useMemo(
    () =>
      (categories ?? []).map((c: {
        _id: string;
        name: string;
        slug: string;
        type: "CLASS" | "BOARD" | "TYPE";
        parentId?: string;
      }) => ({
        id: c._id,
        name: c.name,
        slug: c.slug,
        type: c.type,
        parentId: c.parentId,
        parentName: c.parentId ? parentMap[c.parentId] : undefined,
      })),
    [categories, parentMap]
  );

  const columns = getCategoryColumns({
    onEdit: (row) => setEditTarget(row),
    onDelete: (row) => setDeleteTarget(row),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-stone-400">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        <span className="text-sm">Loading categories…</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-100 bg-red-50 px-6 py-8 text-center">
        <p className="text-sm text-red-600">Failed to load categories. Please try again.</p>
      </div>
    );
  }

  return (
    <>
      <DataTable
        columns={columns}
        data={rows}
        searchColumn="name"
        searchPlaceholder="Search by name…"
      />

      {/* Edit Dialog */}
      <CategoryFormDialog
        open={!!editTarget}
        onOpenChange={(v) => !v && setEditTarget(null)}
        mode="edit"
        editId={editTarget?.id}
        defaultValues={
          editTarget
            ? {
              name: editTarget.name,
              slug: editTarget.slug,
              type: editTarget.type,
              parentId:
                typeof editTarget.parentId === "object"
                  ? editTarget.parentId?._id
                  : editTarget.parentId,
            }
            : undefined
        }
      />

      {/* Delete Dialog */}
      {deleteTarget && (
        <DeleteCategoryDialog
          open={!!deleteTarget}
          onOpenChange={(v) => !v && setDeleteTarget(null)}
          categoryId={deleteTarget.id}
          categoryName={deleteTarget.name}
        />
      )}
    </>
  );
}