"use client";

import { BookOpen, FileText, Video, CheckCircle } from "lucide-react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { useRouter } from "next/navigation";

export default function VideoPlayer({ exercise, content, courseData }: {
    exercise: any;
    content: any;
    courseData: {
        _id: string;
        title: string;
        slug: string;
        description: string;
        thumbnail: string;
        pricing: {
            type: string;
            price: number;
            discountPrice: number;
        };
        isPublished: boolean;
    }
}) {
    const router = useRouter();
    const chapters = content?.length ?? 0;
    const sections = content?.reduce(
        (a: number, ch: any) => a + ch.children.length, 0
    ) ?? 0;
    const videos = content?.reduce(
        (a: number, ch: any) =>
            a + ch.children.reduce((b: number, s: any) => b + s.children.length, 0),
        0
    ) ?? 0;

    return (
        <div className="bg-[#f0f9f8] min-h-full">

            {/* Breadcrumb */}
            <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 px-4  py-3 text-sm text-[#2B7772] overflow-hidden">
                    <Link
                        href="/"
                        className="flex items-center hover:text-[#18A49A] transition-colors"
                    >
                        <Home className="w-4 h-4" />
                    </Link>

                    <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />

                    <button
                        onClick={() => router.back()}
                        className="hover:text-[#18A49A] transition-colors font-medium shrink-0 cursor-pointer"
                    >
                        Courses
                    </button>

                    <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />

                    <span className="truncate font-medium text-gray-700">
                        {courseData?.title}
                    </span>
                </div>
            </div>

            {/* ── Always-visible course header ── */}
            <div className="p-4 md:p-12">
                <div className="flex gap-2 mb-4">
                    <span className="rounded-full border bg-[#0A3D38] px-4 py-1 text-xs font-semibold tracking-wide text-white">
                        COURSE
                    </span>
                    <span className={`rounded-full border px-4 py-1 text-xs font-semibold tracking-wide 
             ${courseData?.pricing?.type === "FREE" ? "bg-transparent text-[#18A49A] border-[#18A49A]" : "bg-trasparent text-red-600  border-red-600"}`}>
                        {courseData?.pricing?.type === "FREE" ? "FREE" : "PAID"}
                    </span>
                </div>

                <h1 className=" text-2xl sm:text-3xl lg:text-4xl font-extrabold text-black leading-tight mb-4">
                    {courseData?.title}
                </h1>

                <p className="text-gray-500  leading-relaxed mb-10 max-w-2xl md:max-w-4xl text-sm md:text-base">
                    {courseData?.description}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard
                        icon={<BookOpen className="w-5 h-5 text-[#09443E]" />}
                        iconBg="bg-[#09443E]/10"
                        value={chapters}
                        label="Chapters"
                        valueColor="text-[#045953]"
                    />
                    <StatCard
                        icon={<FileText className="w-5 h-5 text-[#09443E]" />}
                        iconBg="bg-[#09443E]/10"
                        value={sections}
                        label="Sections"
                        valueColor="text-[#045953]"
                    />
                    <StatCard
                        icon={<Video className="w-5 h-5 text-[#FB2C36]" />}
                        iconBg="bg-[#EEF7F6]"
                        value={videos}
                        label="Videos"
                        valueColor="text-[#FB2C36]"
                    />
                    <StatCard
                        icon={<CheckCircle className="w-5 h-5 text-[#09443E]" />}
                        iconBg="bg-[#09443E]/10"
                        value={videos}
                        label="Available"
                        valueColor="text-[#045953]"
                    />
                </div>

                {/* ── Exercise section — only when selected ── */}
                {exercise && (
                    <div className="mt-8">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-8">
                            <h2 className="text-lg sm:text-xl font-bold text-[#1E2A4A] break-words">
                                {exercise?.title}
                            </h2>

                            <div className="hidden sm:block flex-1 h-px bg-gray-300" />

                            <span className="text-sm sm:text-base text-gray-400 font-semibold whitespace-nowrap">
                                {videos} lessons
                            </span>
                        </div>
                        {/* Video player */}
                        <div className="max-w-5xl">
                            <div className="overflow-hidden rounded-3xl border bg-black shadow-xl aspect-video">
                                <video
                                    controls
                                    className="h-full w-full"
                                    src={exercise?.videoUrl}
                                />
                            </div>
                        </div>

                        {/* Exercise meta */}
                        <div className="mt-8">
                            {/* <div className="flex gap-2 mb-3">
                                <span className="rounded-full border border-gray-400 px-4 py-1 text-xs font-semibold tracking-wide text-gray-600">
                                    {exercise.type}
                                </span>
                                <span className="rounded-full border border-gray-400 px-4 py-1 text-xs font-semibold tracking-wide text-gray-600">
                                    {exercise.pricing.type}
                                </span>
                            </div>
                            <h2 className="text-2xl font-extrabold text-gray-900">
                                {exercise.title}
                            </h2> */}
                            <p className="mt-4 text-gray-500 leading-relaxed">
                                {exercise.description || "No description available."}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function StatCard({
    icon,
    iconBg,
    value,
    label,
    valueColor,
}: {
    icon: React.ReactNode;
    iconBg: string;
    value: number;
    label: string;
    valueColor: string;
}) {
    return (
        <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4">
            <div className={`${iconBg} rounded-xl p-2.5 shrink-0`}>{icon}</div>
            <div>
                <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
                <p className="text-sm text-gray-400">{label}</p>
            </div>
        </div>
    );
}