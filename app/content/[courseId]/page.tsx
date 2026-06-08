"use client";

import { useParams } from "next/navigation";
import { useState } from "react";


import { useGetContent } from "@/app/hooks/content-hooks/content-hook";
import ContentSidebar from "./_component/ContentSidebar";
import VideoPlayer from "./_component/VideoPlayer";

export default function ContentPage() {
  const { courseId } = useParams();

  const { data, isLoading } = useGetContent(courseId as string);

  const [selectedExercise, setSelectedExercise] =
    useState<any>(null);

  console.log("ContentPage", data);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-screen bg-[#eef7f5]">
      <div className="flex h-screen bg-slate-50">
        <ContentSidebar
          content={data}
          selectedExercise={selectedExercise}
          onSelectExercise={setSelectedExercise}
        />

        <main className="flex-1 overflow-y-auto">
          <VideoPlayer exercise={selectedExercise} />
        </main>
      </div>
    </div>
  );
}