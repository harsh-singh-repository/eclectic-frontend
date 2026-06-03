"use client"

import { useGetContentByFilter } from '@/app/hooks/content-hooks/content-hook'
import Image from 'next/image';
import { useParams } from 'next/navigation'
import React, { useState, useMemo, useCallback } from 'react'
import Logo from "@/app/asset/IMG_7668-removebg-preview.png";

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
    slug?: string
    description: string
    thumbnail: string
    pricing: Pricing
    isPublished: boolean
  }
  parentId: {
    _id: string
    title: string
    type: "CHAPTER" | "SUBCHAPTER" | "EXERCISE"
    order: number
  } | null
  videoId?: { _id: string; url: string; duration?: number; thumbnail?: string }
  createdAt: string
  updatedAt: string
}

interface TreeExercise {
  _id: string; title: string; isPublished: boolean
  pricing: Pricing; order: number
  videoId?: { _id: string; url: string; duration?: number; thumbnail?: string }
}
interface TreeSubchapter {
  _id: string; title: string; isPublished: boolean
  pricing: Pricing; order: number; exercises: TreeExercise[]
}
interface TreeChapter {
  _id: string; title: string; isPublished: boolean
  pricing: Pricing; order: number; subchapters: TreeSubchapter[]
}
interface CourseTree {
  courseId: string
  courseTitle: string
  courseDescription: string
  courseThumbnail: string
  coursePricing: Pricing
  courseIsPublished: boolean
  chapters: TreeChapter[]
}

// ─── Multi-Course Tree Builder ─────────────────────────────────────────────────
// Groups all content by courseId first, then builds the 3-level tree per course.

function buildMultiCourseTree(items: ContentItem[]): CourseTree[] {
  // Step 1 — collect unique courses preserving insertion order
  const courseMap = new Map<string, CourseTree>()

  for (const item of items) {
    const cid = item.courseId._id
    if (!courseMap.has(cid)) {
      courseMap.set(cid, {
        courseId: cid,
        courseTitle: item.courseId.title,
        courseDescription: item.courseId.description,
        courseThumbnail: item.courseId.thumbnail,
        coursePricing: item.courseId.pricing,
        courseIsPublished: item.courseId.isPublished,
        chapters: [],
      })
    }
  }

  // Step 2 — per-course chapter / subchapter / exercise maps
  const chapterMap: Record<string, TreeChapter> = {}
  const subchapterMap: Record<string, TreeSubchapter> = {}

  // Pass 1 — chapters
  for (const item of items) {
    if (item.type !== "CHAPTER") continue
    const ch: TreeChapter = {
      _id: item._id, title: item.title,
      isPublished: item.isPublished, pricing: item.pricing,
      order: item.order, subchapters: [],
    }
    chapterMap[item._id] = ch
    courseMap.get(item.courseId._id)!.chapters.push(ch)
  }

  // Pass 2 — subchapters
  for (const item of items) {
    if (item.type !== "SUBCHAPTER") continue
    const sub: TreeSubchapter = {
      _id: item._id, title: item.title,
      isPublished: item.isPublished, pricing: item.pricing,
      order: item.order, exercises: [],
    }
    subchapterMap[item._id] = sub
    const parentChId = item.parentId?._id
    if (parentChId && chapterMap[parentChId]) {
      chapterMap[parentChId].subchapters.push(sub)
    }
  }

  // Pass 3 — exercises
  for (const item of items) {
    if (item.type !== "EXERCISE") continue
    const ex: TreeExercise = {
      _id: item._id, title: item.title,
      isPublished: item.isPublished, pricing: item.pricing,
      order: item.order, videoId: item.videoId,
    }
    const parentSubId = item.parentId?._id
    if (parentSubId && subchapterMap[parentSubId]) {
      subchapterMap[parentSubId].exercises.push(ex)
    }
  }

  // Step 3 — sort all levels
  const courses = Array.from(courseMap.values())
  for (const course of courses) {
    course.chapters.sort((a, b) => a.order - b.order)
    for (const ch of course.chapters) {
      ch.subchapters.sort((a, b) => a.order - b.order)
      for (const sub of ch.subchapters) {
        sub.exercises.sort((a, b) => a.order - b.order)
      }
    }
  }

  return courses
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const PriceBadge = ({ pricing }: { pricing: Pricing }) =>
  pricing.type === "FREE" ? (
    <span className="text-[9px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
      Free
    </span>
  ) : (
    <span className="text-[9px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full bg-red-50 text-[#FB2C36] border border-red-200">
      {pricing.price ? `₹${pricing.price}` : 'Paid'}
    </span>
  )

const PublishedDot = ({ published }: { published: boolean }) => (
  <span
    className={`inline-block w-1.5 h-1.5 rounded-full flex-shrink-0 ${published ? 'bg-[#00786F]' : 'bg-slate-300'}`}
    title={published ? "Published" : "Draft"}
  />
)

// ─── Notes Panel ──────────────────────────────────────────────────────────────

const NotesPanel = ({
  exerciseId, exerciseTitle, notes, onSave, onClose,
}: {
  exerciseId: string; exerciseTitle: string
  notes: Record<string, string>; onSave: (id: string, note: string) => void; onClose: () => void
}) => {
  const [value, setValue] = useState(notes[exerciseId] ?? '')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    onSave(exerciseId, value)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="bg-[#fdf8f4] border-t border-[#d6ecea] px-4 py-3">
      <div className="flex items-center gap-2 mb-3">
        <svg className="w-3.5 h-3.5 text-[#00786F] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <span className="text-[10px] font-bold tracking-widest uppercase text-[#00786F] flex-1 truncate">
          Notes — {exerciseTitle}
        </span>
        <button onClick={onClose} className="p-1 rounded-md hover:bg-red-50 hover:text-[#FB2C36] text-slate-400 transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <textarea
        className="w-full min-h-[80px] border border-[#d6ecea] rounded-xl px-3 py-2.5 text-xs text-slate-700
                   bg-white placeholder-slate-400 resize-y outline-none focus:border-[#00786F]
                   focus:ring-2 focus:ring-[#00786F]/10 transition-all font-[inherit] leading-relaxed"
        placeholder="Write your notes for this video…"
        value={value}
        onChange={e => setValue(e.target.value)}
      />
      <div className="flex items-center gap-2 mt-2">
        <button
          onClick={handleSave}
          className="text-[11px] font-semibold px-3.5 py-1.5 rounded-lg bg-[#00786F] text-white hover:bg-[#005954] transition-colors"
        >
          Save
        </button>
        <button
          onClick={() => { setValue(''); onSave(exerciseId, '') }}
          className="text-[11px] font-semibold px-3.5 py-1.5 rounded-lg bg-white text-slate-500 border border-slate-200 hover:border-[#FB2C36] hover:text-[#FB2C36] transition-colors"
        >
          Clear
        </button>
        {saved && (
          <span className="text-[11px] text-[#00786F] flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            Saved!
          </span>
        )}
      </div>
    </div>
  )
}

// ─── Exercise Row ──────────────────────────────────────────────────────────────

const ExerciseRow = ({
  exercise, index, notes, onSaveNote,
}: {
  exercise: TreeExercise; index: number
  notes: Record<string, string>; onSaveNote: (id: string, note: string) => void
}) => {
  const [notesOpen, setNotesOpen] = useState(false)
  const hasNote = !!(notes[exercise._id]?.trim())

  return (
    <div>
      <div className="flex items-stretch border-b border-[#d6ecea] last:border-0 hover:bg-[#e6f5f4] transition-colors group">
        <div className="flex items-center gap-3 flex-1 min-w-0 px-4 py-3 cursor-pointer">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all
            ${exercise.isPublished
              ? 'bg-[#b3dedd] group-hover:bg-[#00786F]'
              : 'bg-slate-100 group-hover:bg-slate-200'}`}>
            {exercise.isPublished ? (
              <svg className="w-3.5 h-3.5 text-[#005954] group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            ) : (
              <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            )}
          </div>
          <span className="text-[10px] font-mono font-bold text-slate-400 w-5 flex-shrink-0">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="flex-1 text-[13px] font-medium text-slate-700 group-hover:text-[#005954] transition-colors truncate">
            {exercise.title}
          </span>
          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            <PublishedDot published={exercise.isPublished} />
            <PriceBadge pricing={exercise.pricing} />
            {exercise.isPublished && (
              <svg className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#00786F] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </div>
        </div>
        <button
          onClick={() => setNotesOpen(o => !o)}
          className={`px-3 border-l border-[#d6ecea] flex items-center justify-center transition-colors
            ${notesOpen || hasNote ? 'text-[#FB2C36] bg-red-50 hover:bg-red-100' : 'text-slate-300 hover:text-[#FB2C36] hover:bg-red-50'}`}
          title="Toggle notes"
          aria-label={`Notes for ${exercise.title}`}
        >
          <svg className="w-4 h-4" fill={hasNote ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={hasNote ? 0 : 2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </button>
      </div>
      {notesOpen && (
        <NotesPanel
          exerciseId={exercise._id}
          exerciseTitle={exercise.title}
          notes={notes}
          onSave={onSaveNote}
          onClose={() => setNotesOpen(false)}
        />
      )}
    </div>
  )
}

// ─── Subchapter Card ──────────────────────────────────────────────────────────

const SubchapterCard = ({
  sub, subIndex, notes, onSaveNote,
}: {
  sub: TreeSubchapter; subIndex: number
  notes: Record<string, string>; onSaveNote: (id: string, note: string) => void
}) => {
  const [open, setOpen] = useState(true)
  const publishedCount = sub.exercises.filter(e => e.isPublished).length

  return (
    <div className="border border-[#d6ecea] rounded-2xl overflow-hidden bg-white shadow-sm">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-4 py-3.5 bg-gradient-to-r from-[#e6f5f4] to-white
                   hover:from-[#d0eeec] transition-all text-left border-b border-[#d6ecea]"
      >
        <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-[#00786F] text-white text-[10px] font-bold flex items-center justify-center">
          {subIndex + 1}
        </div>
        <svg className="w-3.5 h-3.5 text-[#00786F] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-[13px] font-semibold text-slate-800 truncate">{sub.title}</h4>
            <PublishedDot published={sub.isPublished} />
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">{publishedCount}/{sub.exercises.length} videos available</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <PriceBadge pricing={sub.pricing} />
          <svg className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      {open && (
        <div>
          {sub.exercises.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-xs text-slate-400">No exercises yet</p>
            </div>
          ) : (
            sub.exercises.map((ex, i) => (
              <ExerciseRow key={ex._id} exercise={ex} index={i} notes={notes} onSaveNote={onSaveNote} />
            ))
          )}
        </div>
      )}
    </div>
  )
}

// ─── Chapter Section ──────────────────────────────────────────────────────────

const ChapterSection = ({
  chapter, chIndex, notes, onSaveNote,
}: {
  chapter: TreeChapter; chIndex: number
  notes: Record<string, string>; onSaveNote: (id: string, note: string) => void
}) => {
  const [open, setOpen] = useState(true)
  const totalEx = chapter.subchapters.reduce((n, s) => n + s.exercises.length, 0)
  const publishedEx = chapter.subchapters.reduce((n, s) => n + s.exercises.filter(e => e.isPublished).length, 0)
  const pct = totalEx > 0 ? Math.round((publishedEx / totalEx) * 100) : 0

  return (
    <div className="rounded-3xl overflow-hidden border-2 border-[#00786F] bg-[#0d2d2a] shadow-xl">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-4 px-6 py-5 bg-[#00786F]/20 hover:bg-[#00786F]/30 transition-all text-left"
      >
        <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-[#00786F] text-white font-black text-base flex items-center justify-center shadow-lg">
          {chIndex + 1}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[9px] font-bold tracking-widest uppercase text-[#b3dedd]">Chapter {chIndex + 1}</span>
            {!chapter.isPublished && (
              <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-yellow-900/40 text-yellow-400 border border-yellow-700/40">
                Draft
              </span>
            )}
          </div>
          <h3 className="text-base font-bold text-white truncate">{chapter.title}</h3>
          <p className="text-[11px] mt-0.5 text-[#b3dedd]">
            {chapter.subchapters.length} sections · {publishedEx}/{totalEx} videos
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <PriceBadge pricing={chapter.pricing} />
          <div className="w-7 h-7 rounded-full flex items-center justify-center border border-white/10 bg-white/5">
            <svg className={`w-3.5 h-3.5 text-white/70 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </button>

      {totalEx > 0 && (
        <div className="h-0.5 bg-white/5">
          <div className="h-full bg-[#00786F] transition-all duration-700" style={{ width: `${pct}%` }} />
        </div>
      )}

      {open && (
        <div className="p-4 space-y-3">
          {chapter.subchapters.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-8">No sections in this chapter yet.</p>
          ) : (
            chapter.subchapters.map((sub, si) => (
              <SubchapterCard key={sub._id} sub={sub} subIndex={si} notes={notes} onSaveNote={onSaveNote} />
            ))
          )}
        </div>
      )}
    </div>
  )
}

// ─── Course Stats Bar ─────────────────────────────────────────────────────────

const CourseStatsBar = ({ course }: { course: CourseTree }) => {
  const totalSubs = course.chapters.reduce((n, ch) => n + ch.subchapters.length, 0)
  const totalEx = course.chapters.reduce((n, ch) =>
    ch.subchapters.reduce((m, s) => m + s.exercises.length, n), 0)
  const publishedEx = course.chapters.reduce((n, ch) =>
    ch.subchapters.reduce((m, s) => m + s.exercises.filter(e => e.isPublished).length, n), 0)

  const stats = [
    {
      label: 'Chapters', value: course.chapters.length, bg: 'bg-[#e6f5f4]', text: 'text-[#005954]', icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      label: 'Sections', value: totalSubs, bg: 'bg-[#e6f5f4]', text: 'text-[#005954]', icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      label: 'Videos', value: totalEx, bg: 'bg-red-50', text: 'text-[#FB2C36]', icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.869v6.262a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      label: 'Available', value: publishedEx, bg: 'bg-emerald-50', text: 'text-emerald-700', icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {stats.map(s => (
        <div key={s.label} className="bg-white rounded-2xl p-3.5 shadow-sm border border-[#d6ecea] flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${s.bg} ${s.text}`}>
            {s.icon}
          </div>
          <div>
            <p className={`text-lg font-black ${s.text}`}>{s.value}</p>
            <p className="text-[11px] text-slate-500 font-medium">{s.label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const Sidebar = ({
  courses, activeCourseId, activeChapterId, onSelectCourse, onSelectChapter,
}: {
  courses: CourseTree[]
  activeCourseId: string | null
  activeChapterId: string | null
  onSelectCourse: (id: string) => void
  onSelectChapter: (chapterId: string, courseId: string) => void
}) => {
  return (
    <aside className="hidden lg:flex flex-col w-72 xl:w-80 flex-shrink-0 bg-white border-r-2 border-[#d6ecea] sticky top-0 h-screen overflow-y-auto">
      {/* Logo */}
      <div className="flex items-center gap-x-1 my-2 px-4">
        <div className="flex items-center gap-2 h-10 w-10">
          <Image
            src={Logo}
            alt="logo"
            width={80}
            height={80}
            className="object-contain"
          />
        </div>
        <div className="text-md font-semibold"
          style={{ fontFamily: "'Sora', 'DM Serif Display', Georgia, serif" }}
        >
          Eclectic Education
        </div>
      </div>
      {/* Course groups */}
      <nav className="flex-1 overflow-y-auto py-3">
        {courses.map((course, ci) => {
          const isCourseActive = activeCourseId === course.courseId
          return (
            <div key={course.courseId} className="mb-1">
              {/* Course header row */}
              <button
                onClick={() => onSelectCourse(course.courseId)}
                className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-all
                  ${isCourseActive
                    ? 'bg-[#e6f5f4] border-l-[3px] border-[#00786F]'
                    : 'hover:bg-slate-50 border-l-[3px] border-transparent'}`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black flex-shrink-0 mt-0.5
                  ${isCourseActive ? 'bg-[#00786F] text-white' : 'bg-slate-100 text-slate-500'}`}>
                  {ci + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-[12px] font-semibold leading-tight
                    ${isCourseActive ? 'text-[#005954]' : 'text-slate-700'}`}>
                    {course.courseTitle}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {course.chapters.length} chapters
                  </p>
                </div>
                <PublishedDot published={course.courseIsPublished} />
              </button>

              {/* Chapter list — shown when this course is active */}
              {isCourseActive && course.chapters.map((ch, chi) => {
                const isChActive = activeChapterId === ch._id
                return (
                  <button
                    key={ch._id}
                    onClick={() => onSelectChapter(ch._id, course.courseId)}
                    className={`w-full flex items-start gap-2.5 pl-10 pr-4 py-2.5 text-left transition-all
                      ${isChActive
                        ? 'bg-[#00786F]/10 border-l-[3px] border-[#00786F]'
                        : 'hover:bg-slate-50 border-l-[3px] border-transparent'}`}
                  >
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-bold flex-shrink-0 mt-0.5
                      ${isChActive ? 'bg-[#00786F] text-white' : 'bg-slate-100 text-slate-500'}`}>
                      {chi + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[11px] font-medium leading-tight
                        ${isChActive ? 'text-[#005954] font-semibold' : 'text-slate-600'}`}>
                        {ch.title}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {ch.subchapters.length} sections · {ch.subchapters.reduce((n, s) => n + s.exercises.length, 0)} videos
                      </p>
                    </div>
                    <PublishedDot published={ch.isPublished} />
                  </button>
                )
              })}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}

// ─── Loading Skeleton ─────────────────────────────────────────────────────────

const LoadingSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    <div className="h-12 rounded-2xl bg-slate-200 w-3/4" />
    <div className="grid grid-cols-4 gap-3">
      {[...Array(4)].map((_, i) => <div key={i} className="h-16 rounded-2xl bg-slate-200" />)}
    </div>
    {[...Array(3)].map((_, i) => <div key={i} className="h-36 rounded-3xl bg-slate-200" />)}
  </div>
)

// ─── Main Page ────────────────────────────────────────────────────────────────

const Page = () => {
  const { categoryId, subjectId } = useParams()
  const { data: contentData, isLoading, error } = useGetContentByFilter({
    subjectId: subjectId as string,
    categoryId: categoryId as string,
  })

  const [notes, setNotes] = useState<Record<string, string>>({})
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null)
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null)

  const handleSaveNote = useCallback((id: string, note: string) => {
    setNotes(prev => ({ ...prev, [id]: note }))
  }, [])

  // Build multi-course tree from flat list
  const courses: CourseTree[] = useMemo(() => {
    const items = contentData?.data ?? []
    const tree = buildMultiCourseTree(items)
    // Auto-select first course + chapter on initial load
    if (tree.length > 0 && !activeCourseId) {
      setActiveCourseId(tree[0].courseId)
      if (tree[0].chapters.length > 0) {
        setActiveChapterId(tree[0].chapters[0]._id)
      }
    }
    return tree
  }, [contentData])

  // The active course object
  const activeCourse = useMemo(
    () => courses.find(c => c.courseId === activeCourseId) ?? courses[0] ?? null,
    [courses, activeCourseId]
  )

  const handleSelectCourse = (courseId: string) => {
    setActiveCourseId(courseId)
    const course = courses.find(c => c.courseId === courseId)
    if (course?.chapters.length) setActiveChapterId(course.chapters[0]._id)
    else setActiveChapterId(null)
  }

  const handleSelectChapter = (chapterId: string, courseId: string) => {
    setActiveCourseId(courseId)
    setActiveChapterId(chapterId)
    // Scroll to the chapter section
    setTimeout(() => {
      document.getElementById(`chapter-${chapterId}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  return (
    <div className="min-h-screen bg-[#f0f9f8]">
      {/* Top accent */}
      <div className="h-1 bg-gradient-to-r from-[#00786F] via-[#00a89c] to-[#00786F]" />

      <div className="flex">
        {/* Sidebar */}
        {!isLoading && !error && courses.length > 0 && (
          <Sidebar
            courses={courses}
            activeCourseId={activeCourseId}
            activeChapterId={activeChapterId}
            onSelectCourse={handleSelectCourse}
            onSelectChapter={handleSelectChapter}
          />
        )}

        {/* Main */}
        <main className="flex-1 min-w-0">
          {/* Breadcrumb */}
          <div className="bg-white border-b border-[#d6ecea] px-6 py-3 flex items-center gap-2 text-xs text-slate-400 sticky top-0 z-10">
            <svg className="w-3.5 h-3.5 text-[#00786F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-slate-300">›</span>
            <span className="text-[#00786F] font-medium cursor-pointer hover:underline">Courses</span>
            {activeCourse && (
              <>
                <span className="text-slate-300">›</span>
                <span className="text-slate-600 font-medium truncate max-w-[200px]">{activeCourse.courseTitle}</span>
              </>
            )}
          </div>

          <div className="max-w-[80%] mx-auto px-4 sm:px-6 py-8">
            {isLoading ? (
              <LoadingSkeleton />
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-[#FB2C36] font-medium">Failed to load course content.</p>
              </div>
            ) : !activeCourse ? (
              <div className="text-center py-20">
                <p className="text-slate-500">No courses found.</p>
              </div>
            ) : (
              <>
                {/* Course title header */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold tracking-widest uppercase text-[#00786F] bg-[#e6f5f4] border border-[#b3dedd] px-3 py-1 rounded-full">
                      Course
                    </span>
                    {!activeCourse.courseIsPublished && (
                      <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-yellow-50 text-yellow-700 border border-yellow-200">
                        Draft
                      </span>
                    )}
                    <PriceBadge pricing={activeCourse.coursePricing} />
                  </div>
                  <h1 className="text-2xl font-black text-slate-800 leading-tight mb-2">
                    {activeCourse.courseTitle}
                  </h1>
                  {activeCourse.courseDescription && (
                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 max-w-2xl">
                      {activeCourse.courseDescription}
                    </p>
                  )}
                </div>

                {/* Stats */}
                <CourseStatsBar course={activeCourse} />

                {/* Section label */}
                {activeCourse.chapters.length > 0 && (
                  <div className="flex items-center gap-3 mb-5">
                    <h2 className="text-base font-black text-slate-800">Course Curriculum</h2>
                    <div className="flex-1 h-px bg-[#d6ecea]" />
                    <span className="text-[11px] text-slate-400 font-medium">
                      {activeCourse.chapters.length} chapters
                    </span>
                  </div>
                )}

                {/* Chapters */}
                {activeCourse.chapters.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="w-16 h-16 rounded-3xl bg-[#e6f5f4] border-2 border-[#d6ecea] flex items-center justify-center mx-auto mb-4">
                      <svg className="w-7 h-7 text-[#00786F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h3 className="text-base font-bold text-slate-800 mb-1">No content yet</h3>
                    <p className="text-sm text-slate-500">This course has no chapters yet.</p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {activeCourse.chapters.map((chapter, ci) => (
                      <div key={chapter._id} id={`chapter-${chapter._id}`}>
                        <ChapterSection
                          chapter={chapter}
                          chIndex={ci}
                          notes={notes}
                          onSaveNote={handleSaveNote}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Other courses hint */}
                {courses.length > 1 && (
                  <div className="mt-10 pt-6 border-t border-[#d6ecea]">
                    <p className="text-[11px] font-bold tracking-widest uppercase text-slate-400 mb-3">
                      Other courses in this subject
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {courses.filter(c => c.courseId !== activeCourseId).map(c => (
                        <button
                          key={c.courseId}
                          onClick={() => handleSelectCourse(c.courseId)}
                          className="text-[12px] font-medium px-4 py-2 rounded-xl bg-white border border-[#d6ecea]
                                     text-[#00786F] hover:bg-[#e6f5f4] hover:border-[#00786F] transition-all"
                        >
                          {c.courseTitle}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Page