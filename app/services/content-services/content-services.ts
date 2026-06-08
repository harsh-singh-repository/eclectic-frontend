import { ContentCreate, ContentUpdate } from "@/app/types/content/content-types";
import axiosInstance from "@/lib/axiosInstance";

const CONTENT_APIS = {
  GET_CONTENT: (courseId: string) => `/content/${courseId}`,
  CREATE_CONTENT: "/content",
  UPDATE_CONTENT: (id: string) => `/content/${id}`,
  DELETE_CONTENT: (id: string) => `/content/${id}`,
  GET_CONTENT_BY_CATEGORY: (categoryId: string) => `/content/category/${categoryId}`,
  GET_CONTENT_BY_SUBJECT: (subjectId: string) => `/content/subject/${subjectId}`,
};

export const CONTENT_SERVICES = {
  // ✅ GET CONTENT TREE
  getContent: async (courseId: string) => {
    const response = await axiosInstance.get(
      CONTENT_APIS.GET_CONTENT(courseId)
    );
    console.log("Response from getContent", response.data);
    return response.data.data;
  },

  // ✅ CREATE CONTENT
  createContent: async (data: ContentCreate) => {
    
    const response = await axiosInstance.post(
      CONTENT_APIS.CREATE_CONTENT,
      data,
    );

    return response.data;
  },

  // ✅ UPDATE CONTENT
  updateContent: async (id: string, data: ContentUpdate) => {
    const form = new FormData();

    if (data.title) form.append("title", data.title);
    if (data.type) form.append("type", data.type);
    if (data.courseId) form.append("courseId", data.courseId);

    if (data.parentId !== undefined) {
      form.append("parentId", data.parentId || "");
    }

    if (data.order !== undefined) {
      form.append("order", String(data.order));
    }

    if (data.pricing) {
      form.append("pricing", JSON.stringify(data.pricing));
    }

    if (data.videoUrl) {
      form.append("videoUrl", data.videoUrl);
    }

    if (data.duration !== undefined) {
      form.append("duration", String(data.duration));
    }

    if (data.isPublished !== undefined) {
      form.append("isPublished", String(data.isPublished));
    }

    const response = await axiosInstance.put(
      CONTENT_APIS.UPDATE_CONTENT(id),
      form,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },

  // ✅ DELETE CONTENT
  deleteContent: async (id: string) => {
    const response = await axiosInstance.delete(
      CONTENT_APIS.DELETE_CONTENT(id)
    );
    return response.data;
  },

  // ✅ GET CONTENT BY FILTER
  getContentByFilter: async (data: {
    categoryId?: string;
    subjectId?: string;
    courseId?: string;
    type?: string;
    parentId?: string;
    isPublished?: boolean;
    pricingType?: string;
    search?: string;
    page?: string;
    limit?: string;
  }) => {
    const response = await axiosInstance.get("/content/filter", {
      params: data,
    });
    return response.data;
  },

  // ✅ GET CONTENT BY CATEGORY
  getContentByCategory: async (categoryId: string) => {
    const response = await axiosInstance.get(
      CONTENT_APIS.GET_CONTENT_BY_CATEGORY(categoryId)
    );
    return response.data.data;
  },

  // ✅ GET CONTENT BY SUBJECT
  getContentBySubject: async (subjectId: string) => {
    const response = await axiosInstance.get(
      CONTENT_APIS.GET_CONTENT_BY_SUBJECT(subjectId)
    );
    return response.data.data;
  },
};