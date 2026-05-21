import { SubjectCreate, SubjectUpdate } from "@/app/types/subject/subjectTypes";
import axiosInstance from "@/lib/axiosInstance";

const SUBJECT_APIS = {
  GET_SUBJECTS: "/subject",
  CREATE_SUBJECT: "/subject",
  UPDATE_SUBJECT: (id: string) => `/subject/${id}`,
  DELETE_SUBJECT: (id: string) => `/subject/${id}`,
  GET_SUBJECT_BY_ID: (id: string) => `/subject/${id}`,
};

export const SUBJECT_SERVICES = {
    getSubjects: async () => {
        const response = await axiosInstance.get(SUBJECT_APIS.GET_SUBJECTS);
        return response.data;
    },
    createSubject: async (data: SubjectCreate) => {
        const form = new FormData();
        form.append("file", data.icon);
        form.append("name", data.name);
        form.append("color", data.color);
        form.append("slug", data.slug);
        const response = await axiosInstance.post(SUBJECT_APIS.CREATE_SUBJECT, form ,{
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },
    updateSubject: async (id: string, data: SubjectUpdate) => {
        const form = new FormData();
        form.append("file", data?.icon as File);
        form.append("name", data?.name as string);
        form.append("color", data?.color as string);
        form.append("slug", data?.slug as string);
        const response = await axiosInstance.put(SUBJECT_APIS.UPDATE_SUBJECT(id), form,{
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },
    deleteSubject: async (id: string) => {
        const response = await axiosInstance.delete(SUBJECT_APIS.DELETE_SUBJECT(id));
        return response.data;
    },
    getSubjectById: async (id: string) => {
        const response = await axiosInstance.get(SUBJECT_APIS.GET_SUBJECT_BY_ID(id));
        return response.data;
    },
}
