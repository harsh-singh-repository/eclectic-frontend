"use client";

import { useDeleteCategory } from "@/app/hooks/category-hooks/category-hooks";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  categoryId: string;
  categoryName: string;
}

export function DeleteCategoryDialog({
  open,
  onOpenChange,
  categoryId,
  categoryName,
}: Props) {
  const deleteCategory = useDeleteCategory();

  console.log({
    "categoryId": categoryId,
    "categoryName": categoryName,
  })

  function handleDelete() {
    deleteCategory.mutate(categoryId, {
      onSuccess: () => onOpenChange(false),
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-white rounded-xl border border-stone-200 shadow-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-base font-semibold text-stone-900">
            Delete &ldquo;{categoryName}&rdquo;?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-stone-500">
            This action cannot be undone. The category will be permanently removed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel className="text-sm border-stone-200 text-stone-600 hover:bg-stone-50 rounded-md">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteCategory.isPending}
            className="text-sm bg-red-600 hover:bg-red-700 text-white rounded-md"
          >
            {deleteCategory.isPending ? "Deleting…" : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}