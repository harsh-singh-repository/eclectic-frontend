import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { CONTENT_SERVICES } from "@/app/services/content-services/content-services";
import { ContentCreate, ContentUpdate } from "@/app/types/content/content-types";


// ✅ GET CONTENT TREE (by courseId)
export const useGetContent = (courseId: string) => {
  return useQuery({
    queryKey: ["content", courseId], // 🔥 tree cache per course
    queryFn: () => CONTENT_SERVICES.getContent(courseId),
    enabled: !!courseId,
  });
};


// ✅ CREATE CONTENT
export const useCreateContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ContentCreate) =>
      CONTENT_SERVICES.createContent(data),

    onSuccess: (_, variables) => {
      // 🔥 refresh that course content tree
      queryClient.invalidateQueries({
        queryKey: ["content", variables.courseId],
      });
    },
  });
};


// ✅ UPDATE CONTENT
export const useUpdateContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: ContentUpdate;
    }) => CONTENT_SERVICES.updateContent(id, data),

    onSuccess: (_, variables) => {
      // 🔥 refresh tree (we may not always have courseId here)
      queryClient.invalidateQueries({
        queryKey: ["content"],
      });
    },
  });
};


// ✅ DELETE CONTENT
export const useDeleteContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      CONTENT_SERVICES.deleteContent(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["content"],
      });
    },
  });
};

export const useGetContentByFilter = ({
  categoryId,
  subjectId,
  courseId,
  type,
  parentId,
  isPublished,
  pricingType,
  search,
  page = "1",
  limit = "20",
}: {
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
  return useQuery({
    queryKey: ["content"],
    queryFn: () =>
      CONTENT_SERVICES.getContentByFilter({
        categoryId,
        subjectId,
        courseId,
        type,
        parentId,
        isPublished,
        pricingType,
        search,
        page,
        limit,
      }),
  });
};  