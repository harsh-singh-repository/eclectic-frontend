// app/hooks/student-hooks/StudentHook.ts

import { WeeklyAnalytics } from "@/app/services/sudent-services/student-service";
import axiosInstance from "@/lib/axiosInstance";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";


export const useGetStudents = () => {
  return useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      const response = await axiosInstance.get(
        "/students"
      );

      return response.data;
    },
  });
};

export const useGetStudentById = (
  studentId: string
) => {
  return useQuery({
    queryKey: ["student", studentId],

    queryFn: async () => {
      const response =
        await axiosInstance.get(
          `/students/${studentId}`
        );

      return response.data;
    },

    enabled: !!studentId,
  });
};

export const useSetStudentAnalytics = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      studentId,
      data,
    }: {
      studentId: string;
      data: WeeklyAnalytics;
    }) => {
      const response =
        await axiosInstance.post(
          `/students/${studentId}/analytics`,
          data
        );

      return response.data;
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["student", variables.studentId],
      });
    },
  });
};

export const useGetLoggedInStudent = () => {
  return useQuery({
    queryKey: ["logged-in-student"],

    queryFn: async () => {
      const response = await axiosInstance.get(
        "/students/me"
      );

      return response.data;
    },
  });
};