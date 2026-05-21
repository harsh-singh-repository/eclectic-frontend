"use client";

import { useState } from "react";

export type CourseType = "junior" | "board" | "goal";

interface CourseCardProps {
    type: CourseType;
    title: string;
    subtitle: string;
    grades: string;
    tags?: string[];
    features: string[];
    accentColor: string;
    bgGradient: string;
    icon: React.ReactNode;
    onClick: () => void;
}

export default function CourseCard({
    title,
    subtitle,
    grades,
    tags,
    features,
    accentColor,
    bgGradient,
    icon,
    onClick,
}: CourseCardProps) {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            className={`
  relative overflow-hidden rounded-2xl cursor-pointer
  bg-white border border-gray-200
  shadow-sm hover:shadow-md
  transition-all duration-300 ease-out
  hover:-translate-y-1
`}
            style={{ background: bgGradient }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={onClick}
        >
            {/* Decorative blob */}
            {/* <div
                className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-20 blur-2xl transition-all duration-500"
                style={{ background: accentColor, transform: hovered ? "scale(1.4)" : "scale(1)" }}
            /> */}

            <div className="relative z-10 p-6 flex flex-col gap-4 h-full">
                {/* Icon + Badge */}
                <div className="flex items-start justify-between">
                    <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-lg"
                        style={{ background: accentColor + "33" }}
                    >
                        {icon}
                    </div>
                    <span
                        className="text-xs font-semibold px-3 py-1 rounded-full tracking-wide"
                        style={{ background: accentColor + "22", color: accentColor }}
                    >
                        {grades}
                    </span>
                </div>

                {/* Title */}
                <div>
                    <p className="text-xs font-medium uppercase tracking-widest mb-1"
                        style={{ color: accentColor }}
                    >
                        {subtitle}
                    </p>
                    <h3 className="text-xl font-bold text-black leading-tight">{title}</h3>
                </div>

                {/* Tags */}
                {tags && (
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                            <span
                                key={tag}
                                className="text-[11px] font-semibold px-2 py-0.5 rounded-md"
                                style={{ background: accentColor + "22", color: accentColor }}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Features */}
                <ul className="flex flex-col gap-2 mt-1">
                    {features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm text-[#595E6E]">
                            <span
                                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                style={{ background: accentColor }}
                            />
                            {f}
                        </li>
                    ))}
                </ul>

                {/* CTA */}
                <div className="mt-auto pt-4">
                    <button
                        className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95"
                        style={{
                            background: accentColor,
                            color: "#ffffff",
                            boxShadow: hovered ? `0 0 20px ${accentColor}66` : "none",
                        }}
                    >
                        Explore Course →
                    </button>
                </div>
            </div>
        </div>
    );
}