"use client";

import { useState } from "react";
import GradeSelectModal from "./GradeSelectModal";
import SubjectSelectModal from "./SubjectSelectModal";
import CourseCard, { CourseType } from "./CourseCard";
import { Users, Video, TrendingUp } from "lucide-react";
import { useGetCategories, useGetChildCategoriesByParentSlug } from "@/app/hooks/category-hooks/category-hooks";
import { useGetSubjects } from "@/app/hooks/subject-hooks/SubjectHooks";
import { useRouter } from "next/navigation";

// ─── Data ────────────────────────────────────────────────────────────────────

const COURSES = [
    {
        type: "junior" as CourseType,
        title: "Junior Foundation",
        slug: "juniour-foundation",
        subtitle: "Build Strong Roots",
        grades: "Grade 6 – 8",
        bgGradient: "#FEFEFE",
        accentColor: "#11A79A",           // emerald
        icon: "🌱",
        features: [
            "Concept-first learning modules",
            "Animated explainers & quizzes",
            "Weekly progress reports",
            "NCERT + extra practice sets",
        ],
        // gradeList: [6, 7, 8],
        // subjectList: [
        //     { name: "Maths", icon: "📐", color: "#34d399" },
        //     { name: "Science", icon: "🔬", color: "#6ee7b7" },
        //     { name: "English", icon: "📖", color: "#a7f3d0" },
        //     { name: "History", icon: "🏛️", color: "#34d399" },
        //     { name: "Civics", icon: "⚖️", color: "#6ee7b7" },
        //     { name: "Geography", icon: "🌍", color: "#a7f3d0" },
        // ],
    },
    {
        type: "board" as CourseType,
        title: "Ace the Board",
        slug: "ace-the-boards",
        subtitle: "Score What Matters",
        grades: "Grade 9 – 12",
        accentColor: "#4277F5",           // indigo
        bgGradient: "#FEFEFE",
        icon: "🎯",
        features: [
            "Board exam pattern drills",
            "Previous year paper analysis",
            "Live doubt-clearing sessions",
            "Chapter-wise performance tracker",
        ],
        // gradeList: [9, 10, 11, 12],
        // subjectList: [
        //     { name: "Maths", icon: "📐", color: "#818cf8" },
        //     { name: "Physics", icon: "⚛️", color: "#a5b4fc" },
        //     { name: "Chemistry", icon: "🧪", color: "#c7d2fe" },
        //     { name: "Biology", icon: "🧬", color: "#818cf8" },
        //     { name: "History", icon: "🏛️", color: "#a5b4fc" },
        //     { name: "Geography", icon: "🌍", color: "#c7d2fe" },
        // ],
    },
    {
        type: "goal" as CourseType,
        title: "Hit the Goal",
        slug: "hit-the-goal",
        subtitle: "Olympiad · IIT · NEET",
        grades: "Competitive",
        tags: ["Olympiad", "IIT-JEE", "NEET"],
        accentColor: "#FE8439",           // orange
        bgGradient: "#FEFEFE",
        icon: "🏆",
        features: [
            "Advanced problem-solving tracks",
            "Mock tests with percentile ranking",
            "Mentorship from IIT / AIIMS grads",
            "Adaptive difficulty engine",
        ],
        // gradeList: [9, 10, 11, 12],
        // subjectList: [
        //     { name: "Maths", icon: "📐", color: "#fb923c" },
        //     { name: "Physics", icon: "⚛️", color: "#fdba74" },
        //     { name: "Chemistry", icon: "🧪", color: "#fed7aa" },
        //     { name: "Biology", icon: "🧬", color: "#fb923c" },
        // ],
    },
];

const stats = [
    { label: "Students", value: "50K+", icon: Users, color: "teal" },
    { label: "Live Classes/mo", value: "1,200", icon: Video, color: "blue" },
    { label: "Avg Score Lift", value: "34%", icon: TrendingUp, color: "green" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CoursesSection() {

    const router = useRouter();
    const [activeCourse, setActiveCourse] = useState<(typeof COURSES)[0] | null>(null);
    const [step, setStep] = useState<"grade" | "subject" | null>(null);
    const [selectedGrade, setSelectedGrade] = useState<{ _id: number, name: string } | null>(null);
    const [selectedSubject, setSelectedSubject] = useState<{ _id: number, name: string } | null>(null);

    const { data: categories } =
        useGetChildCategoriesByParentSlug(activeCourse?.slug || "");
    const { data: subjects } = useGetSubjects();

    const openCourse = (course: (typeof COURSES)[0]) => {
        setActiveCourse(course);
        setSelectedGrade(null);
        setSelectedSubject(null);
        setStep("grade");
    };

    const closeAll = () => {
        setStep(null);
        setActiveCourse(null);
    };

    const handleConfirm = () => {
        router.push(`/courses/${selectedGrade?._id}/${selectedSubject?._id}`);
        closeAll();
    };

    return (
        <main className="min-h-screen bg-[#F7FBFC] px-4 py-16 sm:px-8">
            {/* ── Header ── */}
            <div className="max-w-5xl mx-auto mb-12">
                <p className="text-xs font-semibold tracking-[0.20em] text-[#11A79A] uppercase mb-3">
                    What we offer
                </p>
                <h1
                    className="text-4xl sm:text-5xl font-bold text-black leading-tight"
                    style={{ fontFamily: "'Sora', 'DM Serif Display', Georgia, serif" }}
                >
                    Courses
                    <span
                        className="inline-block ml-3 w-10 h-1.5 rounded-full align-middle"
                        style={{ background: "linear-gradient(90deg, #34d399, #f21300)" }}
                    />
                </h1>
                <p className="mt-3 text-gray-500 text-base max-w-lg">
                    Tailored learning tracks from school foundation to competitive excellence.
                </p>
            </div>

            {/* ── Cards Grid ── */}
            <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {COURSES.map((course) => (
                    <CourseCard
                        key={course.type}
                        {...course}
                        onClick={() => openCourse(course)}
                    />
                ))}
            </div>

            {/* ── Stats Strip ── */}
            <div className="max-w-5xl mx-auto mt-14">
                <div className="bg-slate-100 border border-gray-200 rounded-2xl px-6 py-5 flex items-center justify-between">

                    {stats.map((s, i) => (
                        <div
                            key={s.label}
                            className={`
      flex items-center gap-4 flex-1 px-6
      ${i !== stats.length - 1 ? "border-r border-gray-200" : ""}
    `}
                        >
                            {/* Icon */}
                            <div
                                className={`
        w-12 h-12 rounded-full flex items-center justify-center
        ${s.color === "teal"
                                        ? "bg-teal-100/70"
                                        : s.color === "blue"
                                            ? "bg-blue-100/70"
                                            : "bg-orange-100/70"
                                    }
      `}
                            >
                                <s.icon
                                    className={`
          w-5 h-5
          ${s.color === "teal"
                                            ? "text-teal-600"
                                            : s.color === "blue"
                                                ? "text-blue-600"
                                                : "text-orange-600"
                                        }
        `}
                                />
                            </div>

                            {/* Text */}
                            <div className="leading-tight">
                                <p
                                    className={`
          text-[26px] font-semibold
          ${s.color === "teal"
                                            ? "text-teal-600"
                                            : s.color === "blue"
                                                ? "text-blue-600"
                                                : "text-orange-600"
                                        }
        `}
                                >
                                    {s.value}
                                </p>

                                <p className="text-[13px] text-gray-500 mt-[2px]">
                                    {s.label}
                                </p>
                            </div>
                        </div>
                    ))}

                </div>
            </div>

            {/* ── Modals ── */}
            {activeCourse && (
                <>
                    <GradeSelectModal
                        open={step === "grade"}
                        grades={categories}
                        selectedGrade={selectedGrade}
                        onSelect={setSelectedGrade}
                        onClose={closeAll}
                        onNext={() => setStep("subject")}
                        accentColor={activeCourse.accentColor}
                        courseTitle={activeCourse.title}
                    />
                    <SubjectSelectModal
                        open={step === "subject"}
                        subjects={subjects?.subjects}
                        selectedSubject={selectedSubject}
                        onSelect={setSelectedSubject}
                        onClose={closeAll}
                        onBack={() => setStep("grade")}
                        onConfirm={handleConfirm}
                        accentColor={activeCourse.accentColor}
                        grade={selectedGrade}
                        courseTitle={activeCourse.title}
                    />
                </>
            )}
        </main>
    );
}