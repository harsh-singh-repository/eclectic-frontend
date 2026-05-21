
import { CategoryCreate, CategoryUpdate } from "@/app/types/category";
import axiosInstance from "@/lib/axiosInstance";

const CATEGORY_APIS = {
  GET_CATEGORIES:(type?: string) => `/categories${type ? `?type=${type}` : ""}`,
  CREATE_CATEGORY: "/categories",
  UPDATE_CATEGORY: (id: string) => `/categories/${id}`,
  DELETE_CATEGORY: (id: string) => `/categories/${id}`,
};

export const CATEGORY_SERVICES = {
  // ✅ GET CATEGORIES
  getCategories: async (type?: string) => {
    const response = await axiosInstance.get(CATEGORY_APIS.GET_CATEGORIES(type));
    return response.data.data;
  },

  // ✅ CREATE CATEGORY
  createCategory: async (data: CategoryCreate) => {
    const response = await axiosInstance.post(
      CATEGORY_APIS.CREATE_CATEGORY,
      data
    );
    return response.data;
  },

  // ✅ UPDATE CATEGORY
  updateCategory: async (id: string, data: CategoryUpdate) => {
    const form = new FormData();

    if (data.name) form.append("name", data.name);
    if (data.slug) form.append("slug", data.slug);
    if (data.type) form.append("type", data.type);
    if (data.parentId) form.append("parentId", data.parentId);

    const response = await axiosInstance.put(
      CATEGORY_APIS.UPDATE_CATEGORY(id),
      form,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },

  // ✅ DELETE CATEGORY
  deleteCategory: async (id: string) => {
    const response = await axiosInstance.delete(
      CATEGORY_APIS.DELETE_CATEGORY(id)
    );
    return response.data;
  },
};