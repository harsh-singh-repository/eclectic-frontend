"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";

import { useGetContent } from "@/app/hooks/content-hooks/content-hook";
import ContentSidebar from "./_component/ContentSidebar";
import VideoPlayer from "./_component/VideoPlayer";

import { Button } from "@/components/ui/button";
import { useGetCourseById } from "@/app/hooks/course-hooks/CoursesHook";

export default function ContentPage() {
  const { courseId } = useParams();

  const { data, isLoading } = useGetContent(courseId as string);

  const {data:courseData} = useGetCourseById(courseId as string);

  console.log("Course Data", courseData);

  const [selectedExercise, setSelectedExercise] = useState<any>(null);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#eef7f5]">
      {/* Desktop Layout */}
      <div className="hidden lg:flex h-full bg-slate-50">
        <aside className="w-[350px] shrink-0 border-r bg-white">
          <ContentSidebar
            content={data}
            selectedExercise={selectedExercise}
            onSelectExercise={setSelectedExercise}
          />
        </aside>

        <main className="flex-1 overflow-y-auto">
          <VideoPlayer exercise={selectedExercise} courseData={courseData?.data} content={data}/>
        </main>
      </div>

      {/* Mobile / Tablet Layout */}
      <div className="lg:hidden h-full bg-slate-50">
        {!selectedExercise ? (
          <div className="h-full overflow-y-auto bg-white">
            <ContentSidebar
              content={data}
              selectedExercise={selectedExercise}
              onSelectExercise={setSelectedExercise}
            />
          </div>
        ) : (
          <div className="flex h-full flex-col">
            <div className="border-b bg-white p-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedExercise(null)}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Contents
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <VideoPlayer exercise={selectedExercise} content={data} courseData={courseData?.data} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}