import { COURSE_SERVICES } from "@/app/services/course-services/course-service";
import { CourseCreate, CourseUpdate } from "@/app/types/courses/CoursesTypes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ✅ GET COURSES (with filters)
export const useGetCourses = (params?: {
  subjectId?: string;
  categoryId?: string;
  isPublished?: boolean;
}) => {
  return useQuery({
    queryKey: ["courses", params], // 🔥 important for caching per filter
    queryFn: () => COURSE_SERVICES.getCourses(params),
  });
};

// ✅ GET COURSE BY ID
export const useGetCourseById = (id: string) => {
  return useQuery({
    queryKey: ["course", id],
    queryFn: () => COURSE_SERVICES.getCourseById(id),
    enabled: !!id, // 🔥 prevents running if id is undefined
  });
};

// ✅ CREATE COURSE
export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CourseCreate) =>
      COURSE_SERVICES.createCourse(data),

    onSuccess: () => {
      // 🔥 invalidate all course lists
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};

// ✅ UPDATE COURSE
export const useUpdateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: CourseUpdate;
    }) => COURSE_SERVICES.updateCourse(id, data),

    onSuccess: (_, variables) => {
      // refresh list
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      // refresh single course
      queryClient.invalidateQueries({
        queryKey: ["course", variables.id],
      });
    },
  });
};

// ✅ DELETE COURSE
export const useDeleteCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      COURSE_SERVICES.deleteCourse(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};

// ✅ GET COURSE BY CATEGORY ID
export const useGetCourseByCategoryId = (categoryId: string, subjectId?: string) => {
  return useQuery({
    queryKey: ["course", categoryId, subjectId],
    queryFn: () => COURSE_SERVICES.getCourseByCategoryId(categoryId, subjectId),
    enabled: !!categoryId || !!subjectId,
  });
};