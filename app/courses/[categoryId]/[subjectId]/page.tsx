"use client";

import { useGetCourseByCategoryId } from "@/app/hooks/course-hooks/CoursesHook";
import { BookOpen, Eye, ShoppingCart, Check, Star, Users } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

const SUBJECT_ICONS = [BookOpen, Star, Users, Check];

export default function CoursesPage() {
    const params = useParams();
    const router = useRouter();
    const categoryId = params.categoryId as string;
    const subjectId = params.subjectId as string;

    const { data, isLoading } = useGetCourseByCategoryId(categoryId, subjectId);
    const courses = data?.data || [];

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#f4faf9] p-8">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="rounded-2xl border border-[#d0e0de] bg-white overflow-hidden animate-pulse"
                        >
                            <div className="h-32 bg-[#dff2ef]" />
                            <div className="p-3 space-y-2">
                                <div className="h-3 bg-[#dff2ef] rounded w-3/4" />
                                <div className="h-3 bg-[#dff2ef] rounded w-1/2" />
                                <div className="h-8 bg-[#dff2ef] rounded mt-4" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f4faf9] md:px-14 px-6  py-8">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#6aaba5] mb-2">
                <span>Eclectic Education</span>
                <span>/</span>
                <span className="text-[#09443E] font-semibold">Courses</span>
            </div>

            {/* Header */}
            <div className="flex items-end justify-between mb-6">
                <div>
                    <h1 className="md:text-3xl text-2xl font-bold text-[#09443E] tracking-tight">
                        Available courses
                    </h1>
                    <p className="text-xs text-[#6aaba5] mt-1">
                        Browse and enroll in available courses
                    </p>
                </div>
                <span className="text-[11px] text-[#6aaba5] font-mono">
                    {courses.length} course{courses.length !== 1 ? "s" : ""}
                </span>
            </div>

            {/* Grid */}
            {courses.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {courses.map((course: any, i: number) => {
                        const isPaid = course.pricing?.type === "PAID";
                        const price = course.pricing?.price;

                        return (
                            <div
                                key={course._id}
                                className="group rounded-2xl border border-[#d0e0de] bg-white overflow-hidden flex flex-col hover:border-[#09443E] transition-colors duration-150 cursor-pointer"
                            >
                                {/* Thumbnail */}
                                <div
                                    className="relative bg-[#eef7f6] overflow-hidden flex-shrink-0 aspect-video"
                                    onClick={() => router.push(`/content/${course._id}`)}
                                >
                                    {course.thumbnail ? (
                                        <img
                                            src={course.thumbnail}
                                            alt={course.title}
                                            className="absolute inset-0 w-full h-full object-cover block"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <BookOpen size={28} className="text-[#6aaba5]" />
                                        </div>
                                    )}

                                    <span
                                        className={`absolute top-2 left-2 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide
      ${isPaid ? "bg-[#FB2C36] text-white" : "bg-[#09443E] text-white"}`}
                                    >
                                        {isPaid ? (price ? `₹${price.toLocaleString()}` : "Paid") : "Free"}
                                    </span>
                                </div>
                                {/* Body */}
                                <div className="p-3 flex flex-col flex-1">
                                    <h2 className="text-[13px] font-bold text-[#09443E] line-clamp-2 leading-snug mb-1.5">
                                        {course.title}
                                    </h2>
                                    <p className="text-[11px] text-[#6aaba5] line-clamp-2 leading-relaxed flex-1">
                                        {course.description}
                                    </p>

                                    <div className="space-y-0.5 mt-1">
                                        {course.features.map((feature: string, index:number) => (
                                            <div key={index} className="flex items-center gap-2 text-[11px] text-[#FB2C36] ">
                                                <span>✓</span>
                                                <p>{feature}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Meta row */}
                                    <div className="flex items-center gap-3 mt-2.5 pt-2.5 border-t border-[#e0eeec]">
                                        <span className="flex items-center gap-1 text-[10px] text-[#6aaba5] font-mono">
                                            <Star size={11} />
                                            {course.stats?.rating ?? "4.8"}
                                        </span>
                                        <span className="flex items-center gap-1 text-[10px] text-[#6aaba5] font-mono ml-auto">
                                            <Users size={11} />
                                            {(course.stats?.totalEnrollments ?? 0).toLocaleString()}
                                        </span>
                                    </div>

                                    {/* Price line */}
                                    {isPaid ? (
                                        <p className="text-[15px] font-bold text-[#09443E] mt-2.5">
                                            ₹{price?.toLocaleString()}{" "}
                                            <sub className="text-[10px] font-normal text-[#6aaba5] align-baseline">
                                                one-time
                                            </sub>
                                        </p>
                                    ) : (
                                        <p className="text-[15px] font-bold text-[#09443E] mt-2.5">
                                            Free{" "}
                                            <sub className="text-[10px] font-normal text-[#6aaba5] align-baseline">
                                                open access
                                            </sub>
                                        </p>
                                    )}

                                    {/* Action buttons */}
                                    <div className="flex gap-2 mt-2.5">
                                        <button
                                            onClick={() => router.push(`/content/${course._id}`)}
                                            className="flex-1 flex items-center justify-center gap-1.5 text-[11px] font-bold py-2 rounded-lg
                        bg-[#eef7f6] text-[#09443E] border border-[#c0dbd8] hover:bg-[#dff2ef] transition-colors"
                                        >
                                            <Eye size={12} />
                                            Preview
                                        </button>

                                        {isPaid ? (
                                            <button
                                                onClick={() => router.push(`/checkout/${course._id}`)}
                                                className="flex-1 flex items-center justify-center gap-1.5 text-[11px] font-bold py-2 rounded-lg
                          bg-[#FB2C36] text-white hover:opacity-90 transition-opacity"
                                            >
                                                <ShoppingCart size={12} />
                                                Buy now
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => router.push(`/enroll/${course._id}`)}
                                                className="flex-1 flex items-center justify-center gap-1.5 text-[11px] font-bold py-2 rounded-lg
                          bg-[#09443E] text-white hover:opacity-90 transition-opacity"
                                            >
                                                <Check size={12} />
                                                Enroll free
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="py-24 flex flex-col items-center gap-3 text-center">
                    <BookOpen size={36} className="text-[#c8e0dd]" />
                    <p className="text-[13px] text-[#6aaba5]">No courses found in this category.</p>
                </div>
            )}
        </div>
    );
}