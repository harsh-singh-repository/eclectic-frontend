
import { CategoryCreate, CategoryUpdate } from "@/app/types/category";
import axiosInstance from "@/lib/axiosInstance";

const CATEGORY_APIS = {
  GET_CATEGORIES:(type?: string , slug?: string) => `/categories?${type ? `?type=${type}` : ""}${slug ? `slug=${slug}` : ""}`,
  GET_CHILD_CATEGORIES: (parentSlug: string) => `/categories/${parentSlug}/children`,
  CREATE_CATEGORY: "/categories",
  UPDATE_CATEGORY: (id: string) => `/categories/${id}`,
  DELETE_CATEGORY: (id: string) => `/categories/${id}`,
};

export const CATEGORY_SERVICES = {
  // ✅ GET CATEGORIES
  getCategories: async (type?: string , slug?: string) => {
    const response = await axiosInstance.get(CATEGORY_APIS.GET_CATEGORIES(type , slug));
    return response.data.data;
  },

  // ✅ GET CHILD CATEGORIES
  getChildCategories: async (parentSlug: string) => {
    const response = await axiosInstance.get(
      CATEGORY_APIS.GET_CHILD_CATEGORIES(parentSlug)
    );
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


    const response = await axiosInstance.put(
      CATEGORY_APIS.UPDATE_CATEGORY(id),
      data,
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