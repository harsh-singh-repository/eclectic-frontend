"use client";

import { useRef, useState, useCallback } from "react";
import {
  CheckCircle2,
  CloudUpload,
  FileVideo,
  Loader2,
  X,
  AlertCircle,
  RefreshCw,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import axios from "axios";
import { getSession } from "next-auth/react";
import axiosInstance from "@/lib/axiosInstance";

// ─── Types ──────────────────────────────────────────────────────────

type UploadStatus = "idle" | "uploading" | "confirming" | "ready" | "error";

export interface UploadedVideo {
  videoId: string;
  cloudinaryPublicId: string;
  title: string;
  duration?: number;
  thumbnail?: string;
}

interface VideoUploadFieldProps {
  courseId: string;
  contentId?: string;
  contentTitle: string;
  isFree: boolean;
  onUploadComplete: (video: UploadedVideo) => void;
  onClear?: () => void;
  existingVideo?: UploadedVideo;
}

// ─── Helpers ────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const ACCEPTED = ["video/mp4", "video/quicktime", "video/x-msvideo", "video/webm", "video/x-matroska"];
const MAX_SIZE_BYTES = 2 * 1024 * 1024 * 1024; // 2 GB

// ─── Component ──────────────────────────────────────────────────────

export function VideoUploadField({
  courseId,
  contentId,
  contentTitle,
  isFree,
  onUploadComplete,
  onClear,
  existingVideo,
}: VideoUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<UploadStatus>(existingVideo ? "ready" : "idle");
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploaded, setUploaded] = useState<UploadedVideo | null>(existingVideo ?? null);
  const [isDragging, setIsDragging] = useState(false);

  // ── Step 1: get signature from your backend ──────────────────────
  async function fetchSignature() {
    const res = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/upload/signature`,
      { courseId, contentId, title: contentTitle, isFree },
      {
        withCredentials: true,
      },
    );
    return res.data.data as {
      signature: string;
      timestamp: number;
      apiKey: string;
      cloudName: string;
      folder: string;
      public_id: string;
      resource_type: string;
      allowed_formats: string;
      type: string;
      tags: string;
    };
  }

  // ── Step 2: upload directly to Cloudinary ───────────────────────
  async function uploadToCloudinary(
    file: File,
    sig: Awaited<ReturnType<typeof fetchSignature>>
  ) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", sig.apiKey);
    formData.append("timestamp", String(sig.timestamp));
    formData.append("signature", sig.signature);
    formData.append("folder", sig.folder);
    formData.append("public_id", sig.public_id);
    formData.append("type", sig.type);
    formData.append("tags", sig.tags);

    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${sig.cloudName}/video/upload`,
      formData,
      {
        onUploadProgress: (e) =>
          setProgress(Math.round(((e.loaded ?? 0) * 100) / (e.total ?? 1))),
      }
    );

    return res.data as {
      public_id: string;
      secure_url: string;
      duration?: number;
    };
  }

  // ── Step 3: confirm with your backend ───────────────────────────
  async function confirmWithBackend(
    file: File,
    cloudRes: { public_id: string; secure_url: string; duration?: number }
  ) {
    const res = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/upload/confirm`,
      {
        cloudinaryPublicId: cloudRes.public_id,
        courseId,
        contentId,
        title: contentTitle || file.name.replace(/\.[^.]+$/, ""),
        duration: cloudRes.duration,
        // thumbnail: cloudRes.secure_url.replace(/\.[^.]+$/, ".jpg"),
        isFree,
        order: 0,
      },
      { withCredentials: true }
    );
    return res.data.data as { _id: string; cloudinaryPublicId: string; title: string; duration?: number; thumbnail?: string };
  }

  // ── Main upload orchestrator ─────────────────────────────────────
  const runUpload = useCallback(async (file: File) => {
    setErrorMsg(null);

    // Client-side validation
    if (!ACCEPTED.includes(file.type)) {
      setErrorMsg("Unsupported format. Use MP4, MOV, AVI, MKV, or WebM.");
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setErrorMsg("File exceeds 2 GB limit.");
      return;
    }

    setFile(file);
    setStatus("uploading");
    setProgress(0);

    try {
      const sig = await fetchSignature();
      const cloudRes = await uploadToCloudinary(file, sig);

      setStatus("confirming");

      const saved = await confirmWithBackend(file, cloudRes);

      const video: UploadedVideo = {
        videoId: saved._id,
        cloudinaryPublicId: saved.cloudinaryPublicId,
        title: saved.title,
        duration: saved.duration,
        thumbnail: saved.thumbnail,
      };

      setUploaded(video);
      setStatus("ready");
      onUploadComplete(video);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ?? err?.message ?? "Upload failed";
      setErrorMsg(msg);
      setStatus("error");
    }
  }, [courseId, contentId, contentTitle, isFree, onUploadComplete]);

  // ── File picked via input ────────────────────────────────────────
  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) runUpload(f);
    e.target.value = "";
  }

  // ── Drag-and-drop ────────────────────────────────────────────────
  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) runUpload(f);
  }

  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function onDragLeave() {
    setIsDragging(false);
  }

  // ── Clear / retry ────────────────────────────────────────────────
  function handleClear() {
    setStatus("idle");
    setFile(null);
    setUploaded(null);
    setProgress(0);
    setErrorMsg(null);
    onClear?.();
  }

  // ────────────────────────────────────────────────────────────────
  // Render states
  // ────────────────────────────────────────────────────────────────

  // ── READY ────────────────────────────────────────────────────────
  if (status === "ready" && uploaded) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
        <div className="flex items-start gap-3">
          {/* Thumbnail or icon */}
          <div className="relative flex h-16 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-md bg-zinc-200">
            {uploaded.thumbnail ? (
              <img
                src={uploaded.thumbnail}
                alt={uploaded.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <FileVideo className="h-6 w-6 text-zinc-400" />
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <Play className="h-5 w-5 fill-white text-white" />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-500" />
              <p className="truncate text-sm font-medium text-zinc-800">
                {uploaded.title}
              </p>
            </div>
            <div className="mt-1 flex flex-wrap gap-3 text-xs text-zinc-500">
              {uploaded.duration && (
                <span>{formatDuration(uploaded.duration)}</span>
              )}
              {file && <span>{formatBytes(file.size)}</span>}
              <span className="text-emerald-600">Processing in background</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClear}
            className="ml-auto flex-shrink-0 rounded p-1 text-zinc-400 hover:bg-zinc-200 hover:text-zinc-600"
            aria-label="Remove video"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  // ── UPLOADING / CONFIRMING ───────────────────────────────────────
  if (status === "uploading" || status === "confirming") {
    return (
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-zinc-900">
            <Loader2 className="h-4 w-4 animate-spin text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-zinc-800">
              {file?.name}
            </p>
            <p className="mt-0.5 text-xs text-zinc-500">
              {status === "uploading"
                ? `Uploading — ${progress}%`
                : "Saving to server…"}
            </p>
          </div>
          <span className="flex-shrink-0 text-sm font-medium text-zinc-700">
            {status === "uploading" ? `${progress}%` : ""}
          </span>
        </div>

        {status === "uploading" && (
          <Progress
            value={progress}
            className="mt-3 h-1.5 bg-zinc-200 [&>div]:bg-zinc-900"
          />
        )}
      </div>
    );
  }

  // ── ERROR ────────────────────────────────────────────────────────
  if (status === "error") {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-700">Upload failed</p>
            <p className="mt-0.5 text-xs text-red-600">{errorMsg}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setStatus("idle");
              setErrorMsg(null);
              setFile(null);
            }}
            className="flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-100"
          >
            <RefreshCw className="h-3 w-3" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ── IDLE — drop zone ─────────────────────────────────────────────
  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onClick={() => inputRef.current?.click()}
      className={[
        "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed px-6 py-10 transition-colors",
        isDragging
          ? "border-zinc-400 bg-zinc-100"
          : "border-zinc-300 bg-zinc-50 hover:border-zinc-400 hover:bg-zinc-100",
      ].join(" ")}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(",")}
        className="hidden"
        onChange={onFileChange}
      />

      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-200">
        <CloudUpload className="h-5 w-5 text-zinc-500" />
      </div>

      <div className="text-center">
        <p className="text-sm font-medium text-zinc-700">
          Drop video here or{" "}
          <span className="text-zinc-900 underline underline-offset-2">
            browse
          </span>
        </p>
        <p className="mt-1 text-xs text-zinc-400">
          MP4, MOV, AVI, MKV, WebM — up to 2 GB
        </p>
      </div>
    </div>
  );
}