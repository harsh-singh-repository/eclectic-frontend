"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useSubjectSheet } from "./SubjecrSheetContext";
import { SubjectForm } from "./Subject-form";

export function SubjectSheet() {
  const { isOpen, mode, editId, editDefaults, close } = useSubjectSheet();

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && close()}>
      <SheetContent className="sm:max-w-md w-full bg-white border-l border-neutral-100 p-6">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-lg font-semibold text-neutral-900">
            {mode === "create" ? "Create Subject" : "Edit Subject"}
          </SheetTitle>
          <SheetDescription className="text-sm text-neutral-500">
            {mode === "create"
              ? "Fill in the details to add a new subject."
              : "Update the subject's information."}
          </SheetDescription>
        </SheetHeader>

        <SubjectForm
          mode={mode}
          editId={editId}
          defaults={editDefaults}
          onSuccess={close}
        />
      </SheetContent>
    </Sheet>
  );
}