import { useMutation, useQuery } from "@tanstack/react-query";

import { SUBJECT_SERVICES } from "@/app/services/subject-services/subject-services";
import { SubjectCreate, SubjectUpdate } from "@/app/types/subject/subjectTypes";

export const useGetSubjects = () => {
    return useQuery({
        queryKey: ["subjects"],
        queryFn: SUBJECT_SERVICES.getSubjects,
    });
}

export const useCreateSubject = () => {
    return useMutation({
        mutationFn: (data: SubjectCreate) => SUBJECT_SERVICES.createSubject(data),
    });
}

export const useUpdateSubject = () => {
    return useMutation({
        mutationFn: ({ id, data }: { id: string, data: SubjectUpdate }) => SUBJECT_SERVICES.updateSubject(id, data),
    });
}

export const useDeleteSubject = () => {
    return useMutation({
        mutationFn: SUBJECT_SERVICES.deleteSubject,
    });
}

export const useGetSubjectById = (id: string) => {
    return useQuery({
        queryKey: ["subject"],
        queryFn:()=> SUBJECT_SERVICES.getSubjectById(id),
    });
}