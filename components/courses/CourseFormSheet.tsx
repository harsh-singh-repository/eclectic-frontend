"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Course, CourseCreate, PricingType } from "@/app/types/courses/CoursesTypes";
import {
  Sheet, SheetContent, SheetHeader,
  SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import {
  Form, FormControl, FormField,
  FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown, X } from "lucide-react";
import { useCreateCourse, useUpdateCourse } from "@/app/hooks/course-hooks/CoursesHook";
import Image from "next/image";
import { useGetSubjects } from "@/app/hooks/subject-hooks/SubjectHooks";
import { useGetCategories } from "@/app/hooks/category-hooks/category-hooks";
import { Checkbox } from "../ui/checkbox";
import { ScrollArea } from "../ui/scroll-area";


const schema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  slug: z.string().optional(),
  description: z.string().optional(),
  subjectId: z.string().min(1, "Subject is required"),
  pricingType: z.enum(["FREE", "PAID", "SUBSCRIPTION"]),
  thumbnail: z.any().optional(),
  price: z.number().optional(),
  isPublished: z.boolean(),
  // categories is managed separately as local state (array of IDs)
});

type FormValues = z.infer<typeof schema>;

interface CourseFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: Course | null;
}

export function CourseFormSheet({ open, onOpenChange, course }: CourseFormSheetProps) {
  const isEdit = !!course;
  const { mutate: createCourse, isPending: isCreating } = useCreateCourse();
  const { mutate: updateCourse, isPending: isUpdating } = useUpdateCourse();
  const { data: subjects } = useGetSubjects();
  const { data: categories } = useGetCategories(); // returns Category[]
  const isPending = isCreating || isUpdating;

  const [thumbnailFile, setThumbnailFile] = useState<File | undefined>(undefined);
  const [preview, setPreview] = useState<string | null>(null);

  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);

  // ── Category multi-select state ──────────────────────────────────────────
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [catPopoverOpen, setCatPopoverOpen] = useState(false);

  const toggleCategory = (id: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const removeCategory = (id: string) => {
    setSelectedCategoryIds((prev) => prev.filter((c) => c !== id));
  };

  const getCategoryName = (id: string) =>
    categories?.find(
      (c: {
        _id: string;
        name: string;
      }) => c._id === id
    )?.name ?? "Unknown Category";


  // ─────────────────────────────────────────────────────────────────────────

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      subjectId: "",
      pricingType: "FREE",
      price: undefined,
      isPublished: false,
    },
  });

  useEffect(() => {
    if (course) {
      form.reset({
        title: course.title,
        slug: course.slug,
        description: course.description,
        subjectId: course.subjectId._id,
        pricingType: course.pricing.type,
        price: course.pricing.price,
        isPublished: course.isPublished,
      });
      setSelectedCategoryIds(course.categories.map((c) => c._id));
      if (course.thumbnail) setPreview(course.thumbnail);
    } else {
      form.reset();
      setPreview(null);
      setThumbnailFile(undefined);
      setSelectedCategoryIds([]);
    }
  }, [course, open]);

  const pricingType = form.watch("pricingType");

  const handleThumbnailChange = (file: File) => {
    setThumbnailFile(file);
    setPreview(URL.createObjectURL(file));
  };

  console.log("Errors", form.formState.errors);

  const onSubmit = (values: FormValues) => {
    const payload: CourseCreate = {
      title: values.title,
      slug: values.slug,
      description: values.description,
      subjectId: values.subjectId,
      categories: selectedCategoryIds,          // ← array of category IDs
      ...(thumbnailFile instanceof File && { thumbnail: thumbnailFile }),
      pricing: {
        type: values.pricingType as PricingType,
        price: values.pricingType !== "FREE" ? values.price : undefined,
      },
      isPublished: values.isPublished,
    };

    if (isEdit) {
      updateCourse({ id: course._id, data: payload }, { onSuccess: () => onOpenChange(false) });
    } else {
      createCourse(payload, { onSuccess: () => onOpenChange(false) });
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto px-2">
        <SheetHeader className="mb-1">
          <SheetTitle className="text-base font-semibold text-zinc-900">
            {isEdit ? "Edit Course" : "New Course"}
          </SheetTitle>
          <SheetDescription className="text-sm text-zinc-400">
            {isEdit ? "Update course details below." : "Fill in the details to create a new course."}
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

            {/* ── Thumbnail ── */}
            <div className="space-y-2">
              <FormLabel className="text-xs font-medium text-zinc-600">Thumbnail</FormLabel>
              <div className="relative group w-full h-40 border border-dashed rounded-lg overflow-hidden bg-zinc-50 hover:bg-zinc-100 transition">
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleThumbnailChange(file);
                  }}
                />
                {preview ? (
                  <div className="relative w-full h-40">
                    <Image src={preview} alt="Thumbnail" fill className="object-cover" />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-zinc-400 text-xs">
                    <span className="text-sm font-medium">Upload Thumbnail</span>
                    <span>Click or drag image</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <div className="flex flex-col items-center text-white text-xs">
                    <span className="text-sm font-semibold">Change</span>
                    <span>Click to upload</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Title ── */}
            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium text-zinc-600">Title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Introduction to Physics" {...field} className="text-sm" />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )} />

            {/* ── Slug ── */}
            <FormField control={form.control} name="slug" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium text-zinc-600">
                  Slug <span className="text-zinc-300">(optional)</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="intro-to-physics" {...field} className="text-sm font-mono" />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )} />

            {/* ── Description ── */}
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium text-zinc-600">Description</FormLabel>
                <FormControl>
                  <Textarea rows={3} placeholder="Brief description of this course..." {...field} className="text-sm resize-none" />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )} />

            {/* ── Subject ── */}
            <FormField control={form.control} name="subjectId" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium text-zinc-600">Subject</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="text-sm w-full">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {subjects?.subjects?.map((subject: { _id: string; name: string }) => (
                      <SelectItem key={subject._id} value={subject._id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs" />
              </FormItem>
            )} />

            {/* ── Categories multi-select ───────────────────────────────────── */}
            <div className="space-y-2">
              <FormLabel className="text-xs font-medium text-zinc-600">
                Categories <span className="text-zinc-300">(optional)</span>
              </FormLabel>

              {/* Popover trigger */}
              <Button
                type="button"
                variant="outline"
                className="w-full justify-between"
                onClick={() => setCategoryDialogOpen(true)}
              >
                {selectedCategoryIds.length === 0
                  ? "Select categories"
                  : `${selectedCategoryIds.length} categories selected`}
                <ChevronDown className="h-4 w-4" />
              </Button>

              {/* Selected pills */}
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedCategoryIds.map((id) => (
                  <Badge key={id} variant="secondary">
                    {getCategoryName(id)}
                  </Badge>
                ))}
              </div>
            </div>
            {/* ─────────────────────────────────────────────────────────────── */}

            {/* ── Pricing ── */}
            <div className="grid grid-cols-2 w-full gap-x-2">
              <FormField control={form.control} name="pricingType" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium text-zinc-600">Pricing type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="text-sm w-full">
                        <SelectValue placeholder="Select pricing" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="FREE">Free</SelectItem>
                      <SelectItem value="PAID">Paid</SelectItem>
                      <SelectItem value="SUBSCRIPTION">Subscription</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs" />
                </FormItem>
              )} />

              {pricingType !== "FREE" && (
                <FormField control={form.control} name="price" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium text-zinc-600">Price (₹)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        placeholder="0"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? undefined
                              : Number(e.target.value)
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )} />
              )}
            </div>

            {/* ── Publish toggle ── */}
            <FormField control={form.control} name="isPublished" render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3">
                <div>
                  <FormLabel className="text-xs font-medium text-zinc-600 cursor-pointer">
                    Publish course
                  </FormLabel>
                  <p className="text-xs text-zinc-400 mt-0.5">Make this course visible to students</p>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )} />

            {/* ── Actions ── */}
            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 text-sm"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="flex-1 text-sm bg-zinc-900 hover:bg-zinc-800 text-white"
              >
                {isPending ? "Saving..." : isEdit ? "Save changes" : "Create course"}
              </Button>
            </div>
          </form>
        </Form>

        <Dialog
          open={categoryDialogOpen}
          onOpenChange={setCategoryDialogOpen}
        >
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Select Categories</DialogTitle>
            </DialogHeader>

            <div className="max-h-[400px] overflow-y-auto space-y-2">
              {categories?.map((cat) => {
                const checked = selectedCategoryIds.includes(cat._id);

                return (
                  <label
                    key={cat._id}
                    className="flex items-center gap-3 rounded-lg border p-3 cursor-pointer hover:bg-muted"
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={() => toggleCategory(cat._id)}
                    />

                    <div className="flex-1">
                      <p className="font-medium">{cat.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {cat.type}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>

            <Button
              onClick={() => setCategoryDialogOpen(false)}
              className="w-full"
            >
              Done
            </Button>
          </DialogContent>
        </Dialog>
      </SheetContent>
    </Sheet>
  );
}