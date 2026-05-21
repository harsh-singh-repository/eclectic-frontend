// components/content/delete-content-dialog.tsx
"use client";

import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteContent } from "@/app/hooks/content-hooks/content-hook";
import { Content } from "@/app/types/content/content-types";

interface DeleteContentDialogProps {
  content: Content | null;
  onClose: () => void;
}

export function DeleteContentDialog({
  content,
  onClose,
}: DeleteContentDialogProps) {
  const deleteContent = useDeleteContent();

  function handleConfirm() {
    if (!content) return;
    deleteContent.mutate(content._id, { onSuccess: onClose });
  }

  return (
    <AlertDialog open={!!content} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete &quot;{content?.title}&quot;?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this item and all its children. This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteContent.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={deleteContent.isPending}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
          >
            {deleteContent.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}