"use client";

import { ContentPanel } from "@/components/content/Content-Pannel";
import { useParams } from "next/navigation";



export default function ContentPage() {

    const { courseId } = useParams();

    return <ContentPanel courseId={courseId as string} />;
}
