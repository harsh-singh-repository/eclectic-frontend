import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { CONTENT_SERVICES } from "@/app/services/content-services/content-services";
import {
  ContentCreate,
  ContentUpdate,
} from "@/app/types/content/content-types";
import axios from "axios";

interface Pricing { type: "FREE" | "PAID"; price?: number }
interface ContentItem {
  _id: string;
  title: string;
  type: "CHAPTER" | "SUBCHAPTER" | "EXERCISE";
  order: number;
  isPublished: boolean;
  pricing: Pricing;
  courseId: {
    _id: string;
    title: string;
    slug: string;
    description: string;
    thumbnail: string;
    pricing: Pricing;
    isPublished: boolean;
  };
  parentId: ContentItem | null;
  createdAt: string;
  updatedAt: string;
}
export interface ContentFilterResponse {
  success: boolean;
  total: number;
  data: ContentItem[];
  // flat mode only
  page?: number;
  limit?: number;
  totalPages?: number;
}

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
    mutationFn: (data: ContentCreate) => CONTENT_SERVICES.createContent(data),

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
    mutationFn: ({ id, data }: { id: string; data: ContentUpdate }) =>
      CONTENT_SERVICES.updateContent(id, data),

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
    mutationFn: (id: string) => CONTENT_SERVICES.deleteContent(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["content"],
      });
    },
  });
};

export function useGetContentByFilter(params: {
  categoryId?: string;
  subjectId?: string;
  courseId?: string;
  type?: string;
  parentId?: string;
  isPublished?: boolean;
  pricingType?: string;
  search?: string;
  treeMode?: boolean;
  page?: string;
  limit?: string;
  // treeMode only
}) {
  const {
    categoryId,
    subjectId,
    courseId,
    type,
    parentId,
    isPublished,
    pricingType,
    search,
    treeMode = true,
    page = 1,
    limit = 20,
  } = params;

  return useQuery<ContentFilterResponse>({
    queryKey: [
      "content-filter",
      categoryId,
      subjectId,
      courseId,
      type,
      parentId,
      isPublished,
      pricingType,
      search,
      treeMode,
      treeMode ? null : page,
      treeMode ? null : limit,
    ],
    queryFn: async () => {
      const queryParams = new URLSearchParams();

      if (categoryId) queryParams.set("categoryId", categoryId);
      if (subjectId) queryParams.set("subjectId", subjectId);
      if (courseId) queryParams.set("courseId", courseId);
      if (type) queryParams.set("type", type);
      if (parentId) queryParams.set("parentId", parentId);
      if (isPublished !== undefined)
        queryParams.set("isPublished", String(isPublished));
      if (pricingType) queryParams.set("pricingType", pricingType);
      if (search) queryParams.set("search", search);
      queryParams.set("treeMode", String(treeMode));

      if (!treeMode) {
        queryParams.set("page", String(page));
        queryParams.set("limit", String(limit));
      }

      const { data } = await axios.get<ContentFilterResponse>(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/content/filter?${queryParams.toString()}`,
      );
      return data;
    },
    enabled: !!(categoryId || subjectId || courseId), // don't fire without at least one course filter
    staleTime: 1000 * 60 * 5, // 5 min — content trees don't change often
    gcTime: 1000 * 60 * 10,
  });
}

export function useContentByCategory(categoryId: string) {
  return useQuery({
    queryKey: ["contentByCategory", categoryId],
    queryFn: async () => {
      const { data } = await axios.get<ContentFilterResponse>(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/content/category/${categoryId}`,
      );
      return data;
    },
    enabled: !!categoryId,
  });
}

export function useContentBySubject(subjectId: string) {
  return useQuery({
    queryKey: ["contentBySubject", subjectId],
    queryFn: async () => {
      const { data } = await axios.get<ContentFilterResponse>(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/content/subject/${subjectId}`,
      );
      return data;
    },
    enabled: !!subjectId,
  });
}
