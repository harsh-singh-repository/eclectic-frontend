"use client";

import { useDeleteSubject } from "@/app/hooks/subject-hooks/SubjectHooks";
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
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface DeleteSubjectDialogProps {
  id: string | null;
  name?: string;
  open: boolean;
  onClose: () => void;
}

export function DeleteSubjectDialog({ id, name, open, onClose }: DeleteSubjectDialogProps) {
  const queryClient = useQueryClient();
  const { mutate: deleteSubject, isPending } = useDeleteSubject();

  function handleDelete() {
    if (!id) return;
    deleteSubject(id, {
      onSuccess: () => {
        toast.success("Subject deleted");
        queryClient.invalidateQueries({ queryKey: ["subjects"] });
        onClose();
      },
      onError: () => toast.error("Failed to delete subject"),
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={(v) => !v && onClose()}>
      <AlertDialogContent className="rounded-xl border border-neutral-100 bg-white shadow-sm max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-neutral-900 font-semibold">
            Delete Subject
          </AlertDialogTitle>
          <AlertDialogDescription className="text-neutral-500 text-sm">
            Are you sure you want to delete{" "}
            <span className="font-medium text-neutral-800">{name ?? "this subject"}</span>?
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-lg border-neutral-200 text-neutral-600 hover:bg-neutral-50">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="rounded-lg bg-red-500 hover:bg-red-600 text-white border-0"
          >
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}