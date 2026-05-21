export interface SubjectCreate {
    name: string;
    icon: File;
    color: string;
    slug: string;
}

export interface SubjectUpdate {
    name?: string;
    icon?: File;
    color?: string;
    slug?: string;
}