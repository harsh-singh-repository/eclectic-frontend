"use client";

import { createContext, useContext, useState, ReactNode, JSX } from "react";
import { SubjectUpdate } from "@/app/types/subject/subjectTypes";

type SheetMode = "create" | "edit";

interface SubjectSheetContextType {
  isOpen: boolean;
  mode: SheetMode;
  editId: string | null;
  editDefaults: SubjectUpdate | null;
  openCreate: () => void;
  openEdit: (id: string, defaults: SubjectUpdate) => void;
  close: () => void;
}

const SubjectSheetContext = createContext<SubjectSheetContextType | null>(null);

export function SubjectSheetProvider({ children }: { children: ReactNode }): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<SheetMode>("create");
  const [editId, setEditId] = useState<string | null>(null);
  const [editDefaults, setEditDefaults] = useState<SubjectUpdate | null>(null);

  const openCreate = () => {
    setMode("create");
    setEditId(null);
    setEditDefaults(null);
    setIsOpen(true);
  };

  const openEdit = (id: string, defaults: SubjectUpdate) => {
    setMode("edit");
    setEditId(id);
    setEditDefaults(defaults);
    setIsOpen(true);
  };

  const close = () => setIsOpen(false);

  return (
    <SubjectSheetContext.Provider value={{ isOpen, mode, editId, editDefaults, openCreate, openEdit, close }}>
      {children}
    </SubjectSheetContext.Provider>
  );
}

export function useSubjectSheet() {
  const ctx = useContext(SubjectSheetContext);
  if (!ctx) throw new Error("useSubjectSheet must be used within SubjectSheetProvider");
  return ctx;
}