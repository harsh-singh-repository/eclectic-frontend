"use client";
 
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSubjectSheet } from "./SubjecrSheetContext";
 
export function SubjectsHeader() {
  const { openCreate } = useSubjectSheet();
 
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">Subjects</h1>
        <p className="text-sm text-neutral-500 mt-0.5">Manage all subjects on your platform.</p>
      </div>
      <Button onClick={openCreate} size="sm" className="gap-1.5 bg-neutral-900 hover:bg-neutral-700 text-white rounded-lg">
        <Plus className="w-4 h-4" />
        New Subject
      </Button>
    </div>
  );
}
 