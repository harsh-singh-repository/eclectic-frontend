import { CourseCreate, CourseUpdate } from "@/app/types/courses/CoursesTypes";
import axiosInstance from "@/lib/axiosInstance";

const COURSE_APIS = {
  GET_COURSES: "/course",
  CREATE_COURSE: "/course",
  GET_COURSE_BY_CATEGORY:(categoryId: string , subjectId?: string) => `/course/category?categoryId=${categoryId}${subjectId ? `&subjectId=${subjectId}` : ""}`,
  UPDATE_COURSE: (id: string) => `/course/${id}`,
  DELETE_COURSE: (id: string) => `/course/${id}`,
  GET_COURSE_BY_ID: (id: string) => `/course/${id}`,
};

export const COURSE_SERVICES = {
  // ✅ GET ALL COURSES (with filters)
  getCourses: async (params?: {
    subjectId?: string;
    categoryId?: string;
    isPublished?: boolean;
  }) => {
    const response = await axiosInstance.get(COURSE_APIS.GET_COURSES, {
      params,
    });
    return response.data;
  },

  // ✅ CREATE COURSE
  createCourse: async (data: CourseCreate) => {
    const form = new FormData();

    if (data.thumbnail) {
      form.append("thumbnail", data.thumbnail); // ✅ ONLY ONCE
    }

    form.append("title", data.title);
    if (data.slug) form.append("slug", data.slug);
    if (data.description) form.append("description", data.description);

    form.append("subjectId", data.subjectId);

    data.categories.forEach((cat) => {
      form.append("categories", cat);
    });

    if (data.pricing) {
      form.append("pricing", JSON.stringify(data.pricing));
    }

    if (data.isPublished !== undefined) {
      form.append("isPublished", String(data.isPublished));
    }

    const response = await axiosInstance.post(COURSE_APIS.CREATE_COURSE, form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  // ✅ UPDATE COURSE
  updateCourse: async (id: string, data: CourseUpdate) => {
    const form = new FormData();

    if (data.thumbnail) {
      form.append("thumbnail", data.thumbnail); // ✅ ONLY ONCE
    }

    if (data.title) form.append("title", data.title);
    if (data.slug) form.append("slug", data.slug);
    if (data.description) form.append("description", data.description);
    if (data.subjectId) form.append("subjectId", data.subjectId);

    if (data.categories) {
      data.categories.forEach((cat) => {
        form.append("categories", cat);
      });
    }

    if (data.pricing) {
      form.append("pricing", JSON.stringify(data.pricing));
    }

    if (data.isPublished !== undefined) {
      form.append("isPublished", String(data.isPublished));
    }

    const response = await axiosInstance.put(
      COURSE_APIS.UPDATE_COURSE(id),
      form,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  },

  // ✅ DELETE COURSE
  deleteCourse: async (id: string) => {
    const response = await axiosInstance.delete(COURSE_APIS.DELETE_COURSE(id));
    return response.data;
  },

  // ✅ GET COURSE BY ID
  getCourseById: async (id: string) => {
    const response = await axiosInstance.get(COURSE_APIS.GET_COURSE_BY_ID(id));
    return response.data;
  },
  getCourseByCategoryId: async (categoryId: string, subjectId?: string) => {
    const response = await axiosInstance.get(
      COURSE_APIS.GET_COURSE_BY_CATEGORY(categoryId, subjectId)
    );
    return response.data;
  },
};
