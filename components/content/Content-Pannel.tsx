// components/content/content-panel.tsx
"use client";

import { useState } from "react";
import { Plus, LayoutList, Network } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Content, ContentType } from "@/app/types/content/content-types";
import { useGetContent } from "@/app/hooks/content-hooks/content-hook";
import { ContentTree } from "./ContentTree";
import { ContentTable } from "./ContentTable";
import { ContentForm } from "./ContentForm";
import { DeleteContentDialog } from "./DeleteContentDialog";


// ─── Sheet state ─────────────────────────────────────────────────────
type SheetMode =
  | { mode: "create"; parentId?: string; forcedType?: ContentType }
  | { mode: "edit"; content: Content }
  | null;

// ─── Helper: what type can a parent's child be? ───────────────────────
function childTypeOf(parent: Content): ContentType {
  if (parent.type === "CHAPTER") return "SUBCHAPTER";
  if (parent.type === "SUBCHAPTER") return "EXERCISE";
  return "EXERCISE"; // fallback (EXERCISE has no children anyway)
}

// ─── Component ───────────────────────────────────────────────────────
interface ContentPanelProps {
  courseId: string;
}

export function ContentPanel({ courseId }: ContentPanelProps) {
  const { data, isLoading } = useGetContent(courseId);

  const [sheetState, setSheetState] = useState<SheetMode>(null);
  const [deleteTarget, setDeleteTarget] = useState<Content | null>(null);

  // ── Handlers ────────────────────────────────────────────────────────
  function openCreate() {
    setSheetState({ mode: "create" });
  }

  function openAddChild(parent: Content) {
    setSheetState({
      mode: "create",
      parentId: parent._id,
      forcedType: childTypeOf(parent),
    });
  }

  function openEdit(node: Content) {
    setSheetState({ mode: "edit", content: node });
  }

  function closeSheet() {
    setSheetState(null);
  }

  // ── Sheet meta ───────────────────────────────────────────────────────
  const sheetTitle =
    sheetState?.mode === "edit"
      ? `Edit: ${sheetState.content.title}`
      : sheetState?.mode === "create" && sheetState.parentId
      ? "Add child content"
      : "Add chapter";

  const sheetDescription =
    sheetState?.mode === "edit"
      ? "Update the details below."
      : "Fill in the details to create new content.";

  // ── Render ───────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Header bar ── */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-zinc-900">
            Content structure
          </h2>
          <p className="text-sm text-zinc-500">
            Manage chapters, sub-chapters and exercises.
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="gap-2 bg-zinc-900 text-white hover:bg-zinc-700"
          size="sm"
        >
          <Plus className="h-4 w-4" />
          Add chapter
        </Button>
      </div>

      {/* ── Tabs: Tree / Table ── */}
      <Tabs defaultValue="tree">
        <TabsList className="mb-4 h-8 gap-1 bg-zinc-100 p-0.5">
          <TabsTrigger
            value="tree"
            className="gap-1.5 px-3 py-1 text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <Network className="h-3.5 w-3.5" />
            Tree view
          </TabsTrigger>
          <TabsTrigger
            value="table"
            className="gap-1.5 px-3 py-1 text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <LayoutList className="h-3.5 w-3.5" />
            Table view
          </TabsTrigger>
        </TabsList>

        {/* Tree */}
        <TabsContent value="tree">
          <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
            <ContentTree
              data={data || []}
              isLoading={isLoading}
              onEdit={openEdit}
              onDelete={setDeleteTarget}
              onAddChild={openAddChild}
            />
          </div>
        </TabsContent>

        {/* Table */}
        <TabsContent value="table">
          <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
            <ContentTable
              data={data}
              onEdit={openEdit}
              onDelete={setDeleteTarget}
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* ── Create / Edit sheet ── */}
      <Sheet open={!!sheetState} onOpenChange={(open) => !open && closeSheet()}>
        <SheetContent className="w-[420px] overflow-y-auto sm:max-w-[420px]">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-base font-semibold text-zinc-900">
              {sheetTitle}
            </SheetTitle>
            <SheetDescription className="text-sm text-zinc-500">
              {sheetDescription}
            </SheetDescription>
          </SheetHeader>

          {sheetState?.mode === "create" && (
            <ContentForm
              courseId={courseId}
              parentId={sheetState.parentId}
              forcedType={sheetState.forcedType}
              onSuccess={closeSheet}
            />
          )}

          {sheetState?.mode === "edit" && (
            <ContentForm
              courseId={courseId}
              editingContent={sheetState.content}
              onSuccess={closeSheet}
            />
          )}
        </SheetContent>
      </Sheet>

      {/* ── Delete dialog ── */}
      <DeleteContentDialog
        content={deleteTarget}
        onClose={() => setDeleteTarget(null)}
      />
    </>
  );
}