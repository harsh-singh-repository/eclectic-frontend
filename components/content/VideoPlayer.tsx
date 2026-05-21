"use client";

import { useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Loader2,
  Lock,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";

// ─── Types ──────────────────────────────────────────────────────────

interface VideoData {
  _id: string;
  title: string;
  description?: string;
  duration?: number;
  thumbnail?: string;
  streamUrl: string | null;
  hasAccess: boolean;
  uploadStatus: "pending" | "processing" | "ready" | "failed";
  pricing: { isFree: boolean; price?: number };
}

interface VideoPlayerProps {
  videoId: string;
  contentTitle: string;
}

// ─── Helpers ────────────────────────────────────────────────────────

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// ─── Component ──────────────────────────────────────────────────────

export function VideoPlayer({ videoId, contentTitle }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Player state
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [seeking, setSeeking] = useState(false);

  // ── Fetch signed stream URL from GET /video/:id ──────────────────
  useEffect(() => {
    if (!videoId) return;

    setLoading(true);
    setError(null);

    axiosInstance
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/video/${videoId}`)
      .then((res) => {
        setVideoData(res.data.data);
      })
      .catch((err) => {
        const msg =
          err?.response?.data?.message ?? err?.message ?? "Failed to load video";
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, [videoId]);

  // ── Auto-hide controls ───────────────────────────────────────────
  function resetControlsTimer() {
    setShowControls(true);
    if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    if (playing) {
      controlsTimerRef.current = setTimeout(() => setShowControls(false), 3000);
    }
  }

  // ── Video event handlers ─────────────────────────────────────────
  function onTimeUpdate() {
    const v = videoRef.current;
    if (!v || seeking) return;
    setCurrentTime(v.currentTime);
    if (v.buffered.length > 0) {
      setBuffered((v.buffered.end(v.buffered.length - 1) / v.duration) * 100);
    }
  }

  function onLoadedMetadata() {
    if (videoRef.current) setDuration(videoRef.current.duration);
  }

  function onEnded() {
    setPlaying(false);
    setShowControls(true);
  }

  function togglePlay() {
    const v = videoRef.current;
    if (!v) return;
    if (playing) {
      v.pause();
      setPlaying(false);
      setShowControls(true);
    } else {
      v.play();
      setPlaying(true);
      resetControlsTimer();
    }
  }

  function toggleMute() {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !muted;
    setMuted(!muted);
  }

  function onVolumeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = parseFloat(e.target.value);
    if (videoRef.current) videoRef.current.volume = val;
    setVolume(val);
    setMuted(val === 0);
  }

  function onSeekStart() {
    setSeeking(true);
  }

  function onSeek(e: React.ChangeEvent<HTMLInputElement>) {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (videoRef.current) videoRef.current.currentTime = val;
  }

  function onSeekEnd() {
    setSeeking(false);
  }

  function toggleFullscreen() {
    if (!containerRef.current) return;
    if (!fullscreen) {
      containerRef.current.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setFullscreen(!fullscreen);
  }

  // ── Loading state ────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-xl bg-zinc-950">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
          <p className="text-sm text-zinc-500">Loading video…</p>
        </div>
      </div>
    );
  }

  // ── Error state ──────────────────────────────────────────────────
  if (error || !videoData) {
    return (
      <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-xl bg-zinc-950">
        <AlertCircle className="h-8 w-8 text-red-400" />
        <p className="text-sm font-medium text-red-400">{error ?? "Video unavailable"}</p>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-1.5 rounded-lg bg-zinc-800 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-700"
        >
          <RotateCcw className="h-3 w-3" />
          Retry
        </button>
      </div>
    );
  }

  // ── Still processing ─────────────────────────────────────────────
  if (videoData.uploadStatus === "processing" || videoData.uploadStatus === "pending") {
    return (
      <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-xl bg-zinc-950">
        <div className="relative flex h-16 w-16 items-center justify-center">
          <div className="absolute inset-0 animate-ping rounded-full bg-zinc-700 opacity-40" />
          <Loader2 className="h-7 w-7 animate-spin text-zinc-400" />
        </div>
        <p className="text-sm font-medium text-zinc-400">Video is being processed</p>
        <p className="text-xs text-zinc-600">This usually takes a few minutes. Check back soon.</p>
      </div>
    );
  }

  // ── No access (paid content) ─────────────────────────────────────
  if (!videoData.hasAccess || !videoData.streamUrl) {
    return (
      <div
        className="relative flex aspect-video w-full flex-col items-center justify-center gap-4 overflow-hidden rounded-xl bg-zinc-950"
        style={{
          backgroundImage: videoData.thumbnail ? `url(${videoData.thumbnail})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Blur overlay */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

        <div className="relative z-10 flex flex-col items-center gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900/80">
            <Lock className="h-7 w-7 text-zinc-300" />
          </div>
          <div>
            <p className="text-base font-semibold text-white">{contentTitle}</p>
            <p className="mt-1 text-sm text-zinc-400">
              {videoData.pricing?.price
                ? `Purchase for ₹${videoData.pricing.price} to watch`
                : "Purchase this content to watch"}
            </p>
          </div>
          <button className="rounded-lg bg-white px-5 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100">
            Unlock Video
          </button>
        </div>
      </div>
    );
  }

  // ── Player ───────────────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      onMouseMove={resetControlsTimer}
      onMouseLeave={() => playing && setShowControls(false)}
      className="group relative aspect-video w-full overflow-hidden rounded-xl bg-black"
    >
      {/* Video element */}
      <video
        ref={videoRef}
        src={videoData.streamUrl}
        className="h-full w-full object-contain"
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={onEnded}
        onClick={togglePlay}
        playsInline
        preload="metadata"
        poster={videoData.thumbnail ?? undefined}
      />

      {/* Centre play/pause flash */}
      {!playing && (
        <div
          className="absolute inset-0 flex cursor-pointer items-center justify-center"
          onClick={togglePlay}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm transition hover:bg-black/70">
            <Play className="h-7 w-7 translate-x-0.5 fill-white text-white" />
          </div>
        </div>
      )}

      {/* Controls bar */}
      <div
        className={[
          "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent px-4 pb-3 pt-8 transition-opacity duration-300",
          showControls ? "opacity-100" : "opacity-0",
        ].join(" ")}
      >
        {/* Progress bar */}
        <div className="relative mb-3 flex items-center">
          {/* Buffered track */}
          <div className="absolute h-1 rounded-full bg-zinc-600" style={{ width: `${buffered}%` }} />
          <input
            type="range"
            min={0}
            max={duration || 1}
            step={0.1}
            value={currentTime}
            onMouseDown={onSeekStart}
            onChange={onSeek}
            onMouseUp={onSeekEnd}
            className="relative z-10 h-1 w-full cursor-pointer appearance-none rounded-full bg-zinc-700 accent-white"
          />
        </div>

        {/* Bottom row */}
        <div className="flex items-center gap-3">
          {/* Play/pause */}
          <button
            onClick={togglePlay}
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-white hover:bg-white/10"
          >
            {playing ? (
              <Pause className="h-4 w-4 fill-white" />
            ) : (
              <Play className="h-4 w-4 translate-x-px fill-white" />
            )}
          </button>

          {/* Volume */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="flex h-8 w-8 items-center justify-center rounded-full text-white hover:bg-white/10"
            >
              {muted || volume === 0 ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={muted ? 0 : volume}
              onChange={onVolumeChange}
              className="h-1 w-16 cursor-pointer appearance-none rounded-full bg-zinc-600 accent-white"
            />
          </div>

          {/* Time */}
          <span className="ml-1 flex-shrink-0 font-mono text-xs text-zinc-300">
            {formatTime(currentTime)}
            <span className="text-zinc-500"> / {formatTime(duration)}</span>
          </span>

          {/* Title */}
          <p className="min-w-0 flex-1 truncate text-center text-xs font-medium text-zinc-300">
            {videoData.title}
          </p>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-white hover:bg-white/10"
          >
            {fullscreen ? (
              <Minimize className="h-4 w-4" />
            ) : (
              <Maximize className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}