"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Content, ContentType } from "@/app/types/content/content-types";
import { useCreateContent, useUpdateContent } from "@/app/hooks/content-hooks/content-hook";
import { VideoUploadField, UploadedVideo } from "@/components/content/video-upload-field";
import { VideoPlayer } from "./VideoPlayer";

// ─── Zod schema ─────────────────────────────────────────────────────
const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  type: z.enum(["CHAPTER", "SUBCHAPTER", "EXERCISE"]),
  order: z.number().int().min(0).optional(),
  pricingType: z.enum(["FREE", "PAID"]).optional(),
  price: z.number().min(0).optional(),
  isPublished: z.boolean(),
});

type FormValues = z.input<typeof formSchema>;

// ─── Props ──────────────────────────────────────────────────────────
interface ContentFormProps {
  courseId: string;
  parentId?: string | null;
  forcedType?: ContentType;
  editingContent?: Content;
  onSuccess?: () => void;
}

export function ContentForm({
  courseId,
  parentId,
  forcedType,
  editingContent,
  onSuccess,
}: ContentFormProps) {
  const createContent = useCreateContent();
  const updateContent = useUpdateContent();
  const isEditing = !!editingContent;
  const isPending = createContent.isPending || updateContent.isPending;

  console.log("Editing content:", editingContent);

  const [watchedType, setWatchedType] = useState(editingContent?.type);
  const [watchedPricingType, setWatchedPricingType] = useState(editingContent?.pricing?.type);



  // Uploaded video state — lives outside react-hook-form
  // because it's set async after the Cloudinary upload completes
  const [uploadedVideo, setUploadedVideo] = useState<UploadedVideo | null>(
    editingContent?.videoId
      ? {
        videoId: editingContent.videoId as string,
        cloudinaryPublicId: "",   // not needed for display in edit mode
        title: editingContent.title,
        duration: editingContent.duration,
      }
      : null
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      type: forcedType ?? "CHAPTER",
      order: 0,
      pricingType: "FREE",
      price: 0,
      isPublished: false,
    },
  });

  useEffect(() => {
    if (editingContent) {
      setWatchedType(editingContent.type);
      form.setValue("type", editingContent.type);
      setWatchedPricingType(editingContent.pricing?.type);
      form.setValue("pricingType", editingContent.pricing?.type);
    }
  }, []);

  // Populate form when editing
  useEffect(() => {
    if (editingContent) {
      form.reset({
        title: editingContent.title,
        type: editingContent.type,
        order: editingContent.order,
        pricingType: editingContent.pricing?.type ?? "FREE",
        price: editingContent.pricing?.price ?? 0,
        isPublished: editingContent.isPublished,
      });
    }
  }, [editingContent, form]);

  const watchedTitle = form.watch("title");
  const showVideoUpload = watchedType === "EXERCISE";
  const showPricing = watchedType !== "CHAPTER";

  function onSubmit(values: FormValues) {
    const payload = {
      title: values.title,
      type: values.type,
      courseId,
      parentId: parentId ?? null,
      order: values.order,
      isPublished: values.isPublished,
      ...(showPricing && {
        pricing: {
          type: values.pricingType ?? "FREE",
          ...(values.pricingType === "PAID" && { price: values.price }),
        },
      }),
      // Link the video that was uploaded via the upload field
      ...(showVideoUpload && uploadedVideo && {
        videoId: uploadedVideo.videoId,
      }),
    };

    if (isEditing) {
      updateContent.mutate(
        { id: editingContent!._id, data: payload },
        { onSuccess }
      );
    } else {
      createContent.mutate(payload as any, { onSuccess });
    }
  }

  console.log("Errors", form.formState.errors);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Introduction to React" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Type + Order row */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select
                  value={field.value || "" || editingContent?.type}
                  onValueChange={field.onChange}
                  disabled={!!forcedType}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="CHAPTER">Chapter</SelectItem>
                    <SelectItem value="SUBCHAPTER">Sub-chapter</SelectItem>
                    <SelectItem value="EXERCISE">Exercise</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="order"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Order</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? undefined : Number(e.target.value)
                      )
                    }
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Pricing — only for SUBCHAPTER / EXERCISE */}
        {showPricing && (
          <>
            <Separator />
            <p className="text-xs font-medium uppercase tracking-widest text-zinc-400">
              Pricing
            </p>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="pricingType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pricing type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || "" || editingContent?.pricing?.type}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="FREE">Free</SelectItem>
                        <SelectItem value="PAID">Paid</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {watchedPricingType === "PAID" && (
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (₹)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          value={field.value || "" || editingContent?.pricing?.price}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === "" ? undefined : Number(e.target.value)
                            )
                          }
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </>
        )}

        {/* Video — only for EXERCISE */}
        {showVideoUpload && (
          <>
            <Separator />
            <p className="text-xs font-medium uppercase tracking-widest text-zinc-400">
              Video
            </p>

            {/* ── If editing and a video is already linked, show the player ── */}
            {isEditing && editingContent?.videoId && !uploadedVideo?.videoId && (
              <FormItem>
                <FormLabel>Current video</FormLabel>
                <FormDescription>
                  This exercise already has a video. Upload a new one below to replace it.
                </FormDescription>
                <VideoPlayer
                  videoId={editingContent.videoId}
                  contentTitle={editingContent.title}
                />
              </FormItem>
            )}

            {/* ── Show player for the freshly uploaded video ── */}
            {uploadedVideo?.videoId && (
              <FormItem>
                <FormLabel>Uploaded video</FormLabel>
                <VideoPlayer
                  videoId={uploadedVideo.videoId}
                  contentTitle={uploadedVideo.title}
                />
              </FormItem>
            )}

            {/* ── Upload field ── */}
            <FormItem>
              <FormLabel>
                {isEditing && editingContent?.videoId
                  ? "Replace video"
                  : "Upload video"}
              </FormLabel>
              <FormDescription>
                Uploaded directly to Cloudinary. Processing happens in the background after upload.
              </FormDescription>

              <VideoUploadField
                courseId={courseId}
                contentId={editingContent?._id}
                contentTitle={watchedTitle || editingContent?.title || ""}
                isFree={watchedPricingType === "FREE"}
                existingVideo={uploadedVideo ?? undefined}
                onUploadComplete={(video) => setUploadedVideo(video)}
                onClear={() => setUploadedVideo(null)}
              />

              {showVideoUpload && !uploadedVideo && !editingContent?.videoId && (
                <p className="mt-1.5 text-xs text-amber-600">
                  No video attached. You can save the content and upload a video later.
                </p>
              )}
            </FormItem>
          </>
        )}

        <Separator />

        {/* Published toggle */}
        <FormField
          control={form.control}
          name="isPublished"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border border-zinc-200 px-4 py-3">
              <div>
                <FormLabel className="text-sm font-medium text-zinc-800">
                  Published
                </FormLabel>
                <FormDescription className="text-xs text-zinc-500">
                  Make this visible to students.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Submit */}
        <Button
          type="submit"
          disabled={isPending}
          className="w-full bg-zinc-900 text-white hover:bg-zinc-700"
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? "Save changes" : "Create content"}
        </Button>
      </form>
    </Form>
  );
}