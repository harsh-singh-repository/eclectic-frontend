import axiosInstance from "@/lib/axiosInstance";

// app/types/students/StudentTypes.ts

export type StudentType = "REGULAR" | "SCHOLAR" | "ECLECTIC";

export interface WeeklyGoal {
  _id?: string;
  title: string;
  completed: boolean;
}

export interface WeeklyAnalytics {
  _id: string;
  weekStartDate: string;
  weekEndDate: string;

  attendance: number;
  participation: number;
  homework: number;
  classPerformance: number;

  feedback: string;

  topicsCovered: string[];

  goals: WeeklyGoal[];

  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
}

export interface Student {
  _id: string;
  name: string;
  email?: string;
  mobileNumber: string;
  image?: string;
  city?: string;
  grade: number;

  studentType: StudentType;

  isVerified: boolean;
  isBlocked: boolean;

  stats: {
    totalSpent: number;
    coursesEnrolled: number;
  };

  weeklyAnalytics: WeeklyAnalytics[];

  createdAt: string;
}

const SUBJECT_APIS = {
  GET_SUBJECTS: "/student",
  GET_STUNDENT_BY_ID: (id: string) => `/student/${id}`,
  STUNDET_ANALYTICS:(id: string) => `/student/${id}/analytics`,
};

export const STUDENT_SERVICES = {
  getStudentById: async (id: string) => {
    const response = await axiosInstance.get(SUBJECT_APIS.GET_STUNDENT_BY_ID(id));
    return response.data;
  },
  getStudentAnalytics: async (id: string) => {
    const response = await axiosInstance.get(SUBJECT_APIS.STUNDET_ANALYTICS(id));
    return response.data;
  },
  createStudentAnalytics: async (data: WeeklyAnalytics) => {
    const response = await axiosInstance.post("/student/analytics", data);
    return response.data;
  },
}; 