"use client";

import { useState } from "react";
import { Course } from "@/app/types/courses/CoursesTypes";
import { useDeleteCourse, useGetCourses } from "@/app/hooks/course-hooks/CoursesHook";
import { CourseTable } from "@/components/courses/CourseTable";
import { CourseFormSheet } from "@/components/courses/CourseFormSheet";
import { DeleteDialog } from "@/components/courses/DeleteDialog";

export default function CoursesPage() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Course | null>(null);

  const { data, isLoading } = useGetCourses();
  const { mutate: deleteCourse, isPending: isDeleting } = useDeleteCourse();

  const courses = data?.data ?? [];

  const handleEdit = (course: Course) => {
    setSelectedCourse(course);
    setSheetOpen(true);
  };

  const handleCreate = () => {
    setSelectedCourse(null);
    setSheetOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    deleteCourse(deleteTarget._id, { onSuccess: () => setDeleteTarget(null) });
  };

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs text-zinc-400 uppercase tracking-widest mb-1">Admin / Courses</p>
        <h1 className="text-2xl font-semibold text-zinc-900">Courses</h1>
        <p className="text-sm text-zinc-500 mt-1">Manage all published and draft courses</p>
      </div>
      <CourseTable
        courses={courses}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={setDeleteTarget}
        onCreateNew={handleCreate}
      />

      <CourseFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        course={selectedCourse}
      />

      <DeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        courseName={deleteTarget?.title ?? ""}
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}