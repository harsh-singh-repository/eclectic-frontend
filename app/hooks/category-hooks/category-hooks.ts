
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { CATEGORY_SERVICES } from "@/app/services/category-services/CategoryServices";
import { CategoryCreate, CategoryUpdate } from "@/app/types/category";

// ✅ GET CATEGORIES
export const useGetCategories = (type?: string , slug?: string) => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => CATEGORY_SERVICES.getCategories(type , slug),
  });
};

// ✅ CREATE CATEGORY
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CategoryCreate) =>
      CATEGORY_SERVICES.createCategory(data),

    onSuccess: () => {
      // 🔥 refresh tree (we may not always have courseId here)
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
  });
};

// ✅ UPDATE CATEGORY
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: CategoryUpdate;
    }) => CATEGORY_SERVICES.updateCategory(id, data),

    onSuccess: () => {
      // 🔥 refresh tree (we may not always have courseId here)
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
  });
};

// ✅ DELETE CATEGORY
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      CATEGORY_SERVICES.deleteCategory(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
  });
};  

// ✅ GET CHILD CATEGORIES
export const useGetChildCategoriesByParentSlug = (parentSlug: string) => {
  return useQuery({
    queryKey: ["childCategories", parentSlug],
    queryFn: () => CATEGORY_SERVICES.getChildCategories(parentSlug),
  });
};