"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import type { CategoryCreate, CategoryUpdate } from "@/app/types/category";
import { useCreateCategory, useGetCategories, useUpdateCategory } from "@/app/hooks/category-hooks/category-hooks";

// ─── Schema ──────────────────────────────────────────────────────────────────

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug may only contain lowercase letters, numbers, and dashes"),
  type: z.enum(["CLASS", "BOARD", "TYPE"]),
  parentId: z.string().nullable().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// ─── Props ───────────────────────────────────────────────────────────────────

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mode: "create" | "edit";
  editId?: string;
  defaultValues?: Partial<FormValues>;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function CategoryFormDialog({
  open,
  onOpenChange,
  mode,
  editId,
  defaultValues,
}: Props) {
  const { data: categories } = useGetCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
      type: "CLASS",
      parentId: undefined,
      ...defaultValues,
    },
  });

  useEffect(() => {
    if (defaultValues && mode === "edit") {
      form.setValue("name", defaultValues.name as string);
      form.setValue("slug", defaultValues.slug as string);
      form.setValue("type", defaultValues.type as "CLASS" | "BOARD" | "TYPE");
      form.setValue("parentId", defaultValues.parentId);
    }
  }, [defaultValues]);

  // Auto-generate slug from name
  const nameValue = form.watch("name");
  useEffect(() => {
    if (mode === "create") {
      form.setValue(
        "slug",
        nameValue
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "")
      );
    }
  }, [nameValue, mode, form]);

  // Reset when dialog closes
  useEffect(() => {
    if (!open) form.reset({ name: "", slug: "", type: "CLASS", parentId: undefined, ...defaultValues });
  }, [open]);

  const isPending = createCategory.isPending || updateCategory.isPending;

  function onSubmit(values: FormValues) {
    if (mode === "create") {
      const payload: CategoryCreate = {
        name: values.name,
        slug: values.slug,
        type: values.type,
        parentId: values.parentId || undefined,
      };
      createCategory.mutate(payload, { onSuccess: () => onOpenChange(false) });
    } else if (editId) {
      const payload: CategoryUpdate = {
        name: values.name,
        slug: values.slug,
        type: values.type,
        parentId: values.parentId || undefined,
      };
      updateCategory.mutate(
        { id: editId, data: payload },
        { onSuccess: () => onOpenChange(false) }
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white rounded-xl shadow-lg border border-stone-200">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-stone-900">
            {mode === "create" ? "Create Category" : "Edit Category"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium text-stone-600">Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Class 10"
                      className="rounded-md border-stone-200 text-sm focus-visible:ring-stone-400"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Slug */}
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium text-stone-600">Slug</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. class-10"
                      className="rounded-md border-stone-200 text-sm font-mono focus-visible:ring-stone-400"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium text-stone-600">Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-md border-stone-200 text-sm focus:ring-stone-400">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="CLASS">CLASS</SelectItem>
                      <SelectItem value="BOARD">BOARD</SelectItem>
                      <SelectItem value="TYPE">TYPE</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Parent */}
            <FormField
              control={form.control}
              name="parentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium text-stone-600">
                    Parent Category{" "}
                    <span className="text-stone-400 font-normal">(optional)</span>
                  </FormLabel>
                  <Select
                    onValueChange={(v) => field.onChange(v === "none" ? null : v)}
                    value={field.value ?? "none"}
                  >
                    <FormControl>
                      <SelectTrigger className="rounded-md border-stone-200 text-sm focus:ring-stone-400">
                        <SelectValue placeholder="None" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {categories?.map((cat: {
                        _id: string;
                        name: string;
                      }) => (
                        <SelectItem key={cat._id} value={cat._id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-2 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="text-sm border-stone-200 text-stone-600 hover:bg-stone-50 rounded-md"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="text-sm bg-stone-900 text-white hover:bg-stone-700 rounded-md"
              >
                {isPending
                  ? mode === "create"
                    ? "Creating…"
                    : "Saving…"
                  : mode === "create"
                    ? "Create"
                    : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}