"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { SubjectUpdate } from "@/app/types/subject/subjectTypes";
import { useCreateSubject, useUpdateSubject } from "@/app/hooks/subject-hooks/SubjectHooks";

const subjectSchema = z.object({
  name: z.string().min(1, "Name is required"),
  icon: z.file().min(1, "Icon is required"),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, or dashes"),
});

type SubjectFormValues = z.infer<typeof subjectSchema>;

interface SubjectFormProps {
  mode: "create" | "edit";
  editId?: string | null;
  defaults?: SubjectUpdate | null;
  onSuccess: () => void;
}

export function SubjectForm({ mode, editId, defaults, onSuccess }: SubjectFormProps) {
  const queryClient = useQueryClient();
  const { mutate: createSubject, isPending: isCreating } = useCreateSubject();
  const { mutate: updateSubject, isPending: isUpdating } = useUpdateSubject();

  const form = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      name: defaults?.name ?? "",
      color: defaults?.color ?? "#000000",
      slug: defaults?.slug ?? "",
    },
  });

  const isPending = isCreating || isUpdating;

  function onSubmit(values: SubjectFormValues) {
    if (mode === "create") {
      createSubject(values, {
        onSuccess: () => {
          toast.success("Subject created successfully");
          queryClient.invalidateQueries({ queryKey: ["subjects"] });
          form.reset();
          onSuccess();
        },
        onError: () => toast.error("Failed to create subject"),
      });
    } else if (mode === "edit" && editId) {
      updateSubject(
        { id: editId, data: values },
        {
          onSuccess: () => {
            toast.success("Subject updated successfully");
            queryClient.invalidateQueries({ queryKey: ["subjects"] });
            onSuccess();
          },
          onError: () => toast.error("Failed to update subject"),
        }
      );
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-neutral-700 text-sm font-medium">Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Mathematics"
                  className="border-neutral-200 focus-visible:ring-neutral-400 rounded-lg"
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
              <FormLabel className="text-neutral-700 text-sm font-medium">Slug</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. mathematics"
                  className="border-neutral-200 focus-visible:ring-neutral-400 rounded-lg"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        {/* Icon */}
        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-neutral-700 text-sm font-medium">Icon</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => field.onChange(e.target.files?.[0])}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        {/* Color */}
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-neutral-700 text-sm font-medium">Color</FormLabel>
              <FormControl>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={field.value}
                    onChange={field.onChange}
                    className="w-10 h-10 rounded-lg border border-neutral-200 cursor-pointer p-0.5 bg-white"
                  />
                  <Input
                    placeholder="#3b82f6"
                    className="border-neutral-200 focus-visible:ring-neutral-400 rounded-lg font-mono text-sm"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <div className="pt-2">
          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-neutral-900 hover:bg-neutral-700 text-white rounded-lg"
          >
            {isPending ? "Saving..." : mode === "create" ? "Create Subject" : "Update Subject"}
          </Button>
        </div>
      </form>
    </Form>
  );
}