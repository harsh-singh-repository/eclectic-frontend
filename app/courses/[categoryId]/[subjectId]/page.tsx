"use client"

import { useGetContentByFilter } from '@/app/hooks/content-hooks/content-hook';
import { useParams } from 'next/navigation'
import React, { useState, useMemo } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Pricing { type: "FREE" | "PAID"; price?: number }

interface ContentItem {
  _id: string
  title: string
  type: "CHAPTER" | "SUBCHAPTER" | "EXERCISE"
  order: number
  isPublished: boolean
  pricing: Pricing
  courseId: {
    _id: string
    title: string
    slug: string
    description: string
    thumbnail: string
    pricing: Pricing
    isPublished: boolean
  }
  parentId: ContentItem | null
  createdAt: string
  updatedAt: string
}

// ─── Tree Building ─────────────────────────────────────────────────────────────

interface TreeExercise { _id: string; title: string; isPublished: boolean; pricing: Pricing; order: number }
interface TreeSubchapter { _id: string; title: string; isPublished: boolean; pricing: Pricing; order: number; exercises: TreeExercise[] }
interface TreeChapter { _id: string; title: string; isPublished: boolean; pricing: Pricing; order: number; subchapters: TreeSubchapter[] }

function buildTree(items: ContentItem[]): TreeChapter[] {
  const chapters: TreeChapter[] = []
  const subchapterMap: Record<string, TreeSubchapter> = {}
  const chapterMap: Record<string, TreeChapter> = {}

  // Pass 1: chapters
  items.filter(i => i.type === "CHAPTER").forEach(item => {
    const ch: TreeChapter = { _id: item._id, title: item.title, isPublished: item.isPublished, pricing: item.pricing, order: item.order, subchapters: [] }
    chapterMap[item._id] = ch
    chapters.push(ch)
  })

  // Pass 2: subchapters
  items.filter(i => i.type === "SUBCHAPTER").forEach(item => {
    const sub: TreeSubchapter = { _id: item._id, title: item.title, isPublished: item.isPublished, pricing: item.pricing, order: item.order, exercises: [] }
    subchapterMap[item._id] = sub
    const parentChId = (item.parentId as any)?._id ?? item.parentId
    if (parentChId && chapterMap[parentChId]) chapterMap[parentChId].subchapters.push(sub)
  })

  // Pass 3: exercises
  items.filter(i => i.type === "EXERCISE").forEach(item => {
    const ex: TreeExercise = { _id: item._id, title: item.title, isPublished: item.isPublished, pricing: item.pricing, order: item.order }
    const parentSubId = (item.parentId as any)?._id ?? item.parentId
    if (parentSubId && subchapterMap[parentSubId]) subchapterMap[parentSubId].exercises.push(ex)
  })

  // Sort everything
  chapters.sort((a, b) => a.order - b.order)
  chapters.forEach(ch => {
    ch.subchapters.sort((a, b) => a.order - b.order)
    ch.subchapters.forEach(sub => sub.exercises.sort((a, b) => a.order - b.order))
  })

  return chapters
}

// ─── Badge ────────────────────────────────────────────────────────────────────

const PriceBadge = ({ pricing }: { pricing: Pricing }) =>
  pricing.type === "FREE" ? (
    <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">Free</span>
  ) : (
    <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">₹{pricing.price}</span>
  )

const PublishedDot = ({ published }: { published: boolean }) => (
  <span className={`inline-block w-1.5 h-1.5 rounded-full ${published ? 'bg-teal-500' : 'bg-slate-300'}`} title={published ? "Published" : "Draft"} />
)

// ─── Exercise Row ──────────────────────────────────────────────────────────────

const ExerciseRow = ({ exercise, index }: { exercise: TreeExercise; index: number }) => {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`group flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 ${
        hovered ? 'bg-teal-50 shadow-sm translate-x-1' : 'hover:bg-slate-50'
      }`}
    >
      {/* Video icon */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
        hovered ? 'bg-teal-600 shadow-md' : 'bg-teal-100'
      }`}>
        {exercise.isPublished ? (
          <svg className={`w-4 h-4 ${hovered ? 'text-white' : 'text-teal-600'}`} fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
        ) : (
          <svg className={`w-3.5 h-3.5 ${hovered ? 'text-white' : 'text-teal-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
          </svg>
        )}
      </div>

      {/* Index */}
      <span className="text-xs font-mono text-slate-400 w-5 flex-shrink-0">{String(index + 1).padStart(2, '0')}</span>

      {/* Title */}
      <span className={`flex-1 text-sm font-medium transition-colors duration-200 ${hovered ? 'text-teal-800' : 'text-slate-700'}`}>
        {exercise.title}
      </span>

      {/* Right side */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <PublishedDot published={exercise.isPublished} />
        <PriceBadge pricing={exercise.pricing} />
        {exercise.isPublished && (
          <svg className={`w-4 h-4 transition-all duration-200 ${hovered ? 'text-teal-600 translate-x-0.5' : 'text-slate-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
          </svg>
        )}
      </div>
    </div>
  )
}

// ─── Subchapter Card ───────────────────────────────────────────────────────────

const SubchapterCard = ({ sub, subIndex }: { sub: TreeSubchapter; subIndex: number }) => {
  const [open, setOpen] = useState(true)
  const publishedCount = sub.exercises.filter(e => e.isPublished).length

  return (
    <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-sm">
      {/* Header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-slate-50 to-white hover:from-teal-50 hover:to-white transition-all duration-200 text-left"
      >
        {/* Sub index pill */}
        <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-teal-600 text-white text-xs font-bold flex items-center justify-center shadow-sm">
          {subIndex + 1}
        </div>

        {/* Subchapter icon */}
        <div className="flex-shrink-0">
          <svg className="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-slate-800 truncate">{sub.title}</h4>
            <PublishedDot published={sub.isPublished} />
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {publishedCount}/{sub.exercises.length} exercises available
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <PriceBadge pricing={sub.pricing} />
          <svg
            className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
          </svg>
        </div>
      </button>

      {/* Exercises */}
      {open && (
        <div className="px-4 py-2 space-y-1 border-t border-slate-100">
          {sub.exercises.length === 0 ? (
            <div className="py-6 text-center">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-2">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.869v6.262a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                </svg>
              </div>
              <p className="text-xs text-slate-400">No exercises yet</p>
            </div>
          ) : (
            sub.exercises.map((ex, i) => <ExerciseRow key={ex._id} exercise={ex} index={i} />)
          )}
        </div>
      )}
    </div>
  )
}

// ─── Chapter Section ──────────────────────────────────────────────────────────

const CHAPTER_COLORS = [
  { ring: 'ring-teal-600', bg: 'bg-teal-600', light: 'from-teal-900/20 to-teal-800/10', text: 'text-teal-200', dot: 'bg-teal-400' },
  { ring: 'ring-cyan-600', bg: 'bg-cyan-600', light: 'from-cyan-900/20 to-cyan-800/10', text: 'text-cyan-200', dot: 'bg-cyan-400' },
  { ring: 'ring-slate-600', bg: 'bg-slate-500', light: 'from-slate-800/30 to-slate-700/10', text: 'text-slate-300', dot: 'bg-slate-400' },
]

const ChapterSection = ({ chapter, chIndex }: { chapter: TreeChapter; chIndex: number }) => {
  const [open, setOpen] = useState(true)
  const color = CHAPTER_COLORS[chIndex % CHAPTER_COLORS.length]
  const totalExercises = chapter.subchapters.reduce((n, s) => n + s.exercises.length, 0)
  const publishedExercises = chapter.subchapters.reduce((n, s) => n + s.exercises.filter(e => e.isPublished).length, 0)

  return (
    <div className={`rounded-3xl overflow-hidden border-2 ${color.ring} bg-[#0d2d2a] shadow-xl`}>
      {/* Chapter Header */}
      <button
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center gap-4 px-6 py-5 bg-gradient-to-r ${color.light} hover:brightness-110 transition-all duration-200 text-left`}
      >
        {/* Chapter number */}
        <div className={`flex-shrink-0 w-11 h-11 rounded-2xl ${color.bg} text-white font-black text-lg flex items-center justify-center shadow-lg`}>
          {chIndex + 1}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-teal-400">Chapter {chIndex + 1}</span>
            <span className={`inline-block w-1.5 h-1.5 rounded-full ${color.dot}`} />
            {!chapter.isPublished && (
              <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full bg-yellow-900/40 text-yellow-400 border border-yellow-700/40">Draft</span>
            )}
          </div>
          <h3 className="text-lg font-bold text-white truncate">{chapter.title}</h3>
          <p className={`text-xs mt-0.5 ${color.text}`}>
            {chapter.subchapters.length} sections · {publishedExercises}/{totalExercises} videos
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <PriceBadge pricing={chapter.pricing} />
          <div className={`w-8 h-8 rounded-full flex items-center justify-center border border-white/10 bg-white/5`}>
            <svg
              className={`w-4 h-4 text-white/70 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
            </svg>
          </div>
        </div>
      </button>

      {/* Progress bar */}
      {totalExercises > 0 && (
        <div className="h-0.5 bg-white/5">
          <div
            className={`h-full ${color.bg} opacity-60 transition-all duration-700`}
            style={{ width: `${(publishedExercises / totalExercises) * 100}%` }}
          />
        </div>
      )}

      {/* Subchapters */}
      {open && (
        <div className="p-5 space-y-3">
          {chapter.subchapters.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm text-slate-500">No subchapters in this chapter yet.</p>
            </div>
          ) : (
            chapter.subchapters.map((sub, si) => (
              <SubchapterCard key={sub._id} sub={sub} subIndex={si} />
            ))
          )}
        </div>
      )}
    </div>
  )
}

// ─── Course Header ─────────────────────────────────────────────────────────────

const CourseHeader = ({ courseData }: { courseData: ContentItem['courseId'] | null }) => {
  if (!courseData) return null

  return (
    <div className="relative rounded-3xl overflow-hidden mb-8 shadow-2xl">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0d4a42] via-[#0d3d38] to-[#091f1c]" />
      <div className="absolute inset-0 opacity-20"
        style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #14b8a6 0%, transparent 50%), radial-gradient(circle at 80% 20%, #0e7490 0%, transparent 40%)' }}
      />

      <div className="relative flex flex-col md:flex-row gap-6 p-8">
        {/* Thumbnail */}
        {courseData.thumbnail && (
          <div className="flex-shrink-0">
            <img
              src={courseData.thumbnail}
              alt={courseData.title}
              className="w-full md:w-52 h-36 object-cover rounded-2xl shadow-xl border border-white/10"
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-teal-400 bg-teal-900/40 px-3 py-1 rounded-full border border-teal-700/40">Course</span>
            {!courseData.isPublished && (
              <span className="text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-yellow-900/40 text-yellow-400 border border-yellow-700/40">Draft</span>
            )}
            {courseData.pricing.type === "PAID" && (
              <span className="text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-red-900/40 text-red-300 border border-red-700/40">
                ₹{courseData.pricing.price}
              </span>
            )}
          </div>

          <h1 className="text-2xl md:text-3xl font-black text-white mb-3 leading-tight">{courseData.title}</h1>
          <p className="text-sm text-teal-200/70 leading-relaxed line-clamp-3">{courseData.description}</p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-white text-sm font-bold rounded-xl shadow-lg transition-all duration-200 hover:shadow-teal-500/30 hover:shadow-xl active:scale-95">
              Enroll Now
            </button>
            <button className="px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white text-sm font-semibold rounded-xl border border-white/10 transition-all duration-200 active:scale-95">
              Preview Course
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Stats Bar ─────────────────────────────────────────────────────────────────

const StatsBar = ({ tree }: { tree: TreeChapter[] }) => {
  const totalSubs = tree.reduce((n, ch) => n + ch.subchapters.length, 0)
  const totalEx = tree.reduce((n, ch) => ch.subchapters.reduce((m, s) => m + s.exercises.length, n), 0)
  const publishedEx = tree.reduce((n, ch) => ch.subchapters.reduce((m, s) => m + s.exercises.filter(e => e.isPublished).length, n), 0)

  const stats = [
    { label: 'Chapters', value: tree.length, icon: '📚' },
    { label: 'Sections', value: totalSubs, icon: '📄' },
    { label: 'Exercises', value: totalEx, icon: '🎬' },
    { label: 'Available', value: publishedEx, icon: '✅' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
      {stats.map(s => (
        <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-3">
          <span className="text-2xl">{s.icon}</span>
          <div>
            <p className="text-xl font-black text-slate-800">{s.value}</p>
            <p className="text-xs text-slate-500 font-medium">{s.label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Empty State ───────────────────────────────────────────────────────────────

const EmptyState = () => (
  <div className="text-center py-24">
    <div className="w-20 h-20 rounded-3xl bg-teal-50 border-2 border-teal-100 flex items-center justify-center mx-auto mb-5">
      <svg className="w-9 h-9 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
      </svg>
    </div>
    <h3 className="text-lg font-bold text-slate-800 mb-1">No content yet</h3>
    <p className="text-sm text-slate-500">This course has no published content. Check back later.</p>
  </div>
)

// ─── Loading Skeleton ──────────────────────────────────────────────────────────

const LoadingSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    <div className="h-48 rounded-3xl bg-slate-200" />
    <div className="grid grid-cols-4 gap-3">
      {[...Array(4)].map((_, i) => <div key={i} className="h-20 rounded-2xl bg-slate-200" />)}
    </div>
    {[...Array(2)].map((_, i) => (
      <div key={i} className="h-40 rounded-3xl bg-slate-200" />
    ))}
  </div>
)

// ─── Main Page ─────────────────────────────────────────────────────────────────

const Page = () => {
  const { categoryId, subjectId } = useParams()
  const { data: contentTree, isLoading, error } = useGetContentByFilter({
    subjectId: subjectId as string,
  })

  const courseData: ContentItem['courseId'] | null = useMemo(() => {
    if (!contentTree?.data?.length) return null
    return contentTree?.data[0]?.courseId ?? null
  }, [contentTree])

  const tree: TreeChapter[] = useMemo(() => {
    if (!contentTree?.data?.length) return []
    return buildTree(contentTree?.data as ContentItem[])
  }, [contentTree])

  return (
    <div className="min-h-screen bg-[#f0f9f8]">
      {/* Top nav accent */}
      <div className="h-1 bg-gradient-to-r from-teal-600 via-cyan-500 to-teal-700" />

      <div className="max-w-4xl mx-auto px-4 py-10">
        {isLoading ? (
          <LoadingSkeleton />
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 font-medium">Failed to load course content.</p>
          </div>
        ) : (
          <>
            <CourseHeader courseData={courseData} />

            {tree.length > 0 && <StatsBar tree={tree} />}

            {/* Section label */}
            {tree.length > 0 && (
              <div className="flex items-center gap-3 mb-5">
                <h2 className="text-lg font-black text-slate-800">Course Curriculum</h2>
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-xs text-slate-400 font-medium">{tree.length} chapters</span>
              </div>
            )}

            {tree.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="space-y-5">
                {tree.map((chapter, ci) => (
                  <ChapterSection key={chapter._id} chapter={chapter} chIndex={ci} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Page