export interface SubjectCreate {
    name: string;
    icon: string;
    color: string;
    slug: string;
}

export interface SubjectUpdate {
    name?: string;
    icon?: string;
    color?: string;
    slug?: string;
}