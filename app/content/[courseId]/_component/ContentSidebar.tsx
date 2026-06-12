"use client";
import Image from "next/image";
import Logo from "@/app/asset/IMG_7668-removebg-preview.png";
import ChapterItem from "./ChapterItem";

export default function ContentSidebar({ content, selectedExercise, onSelectExercise }: any) {
    return (
        <aside className="
      lg:w-[330px] lg:min-w-[330px] lg:max-w-[330px] w-full
      h-screen sticky top-0
      border-r border-[#d0e0de]
      bg-[#f8fafa]
      overflow-y-auto shadow-sm
      flex flex-col
    ">
            {/* Header */}
            <div className="bg-white p-2 flex items-center gap-3 flex-shrink-0">
                <div>
                    <div className="flex items-center gap-x-1 my-2 mx-4">
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
                </div>
            </div>

            {/* Progress strip */}
            <div className="h-[3px] bg-white/10 flex-shrink-0">
                <div className="h-full w-[100%] bg-[#FB2C36]" />
            </div>

            {/* Chapters */}
            <div className="flex-1 overflow-y-auto">
                {content?.map((chapter: any, i: number) => (
                    <ChapterItem
                        key={chapter._id}
                        chapter={chapter}
                        index={i}
                        selectedExercise={selectedExercise}
                        onSelectExercise={onSelectExercise}
                    />
                ))}
            </div>
        </aside>
    );
}