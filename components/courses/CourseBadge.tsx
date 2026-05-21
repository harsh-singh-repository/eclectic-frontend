import { PricingType } from "@/app/types/courses/CoursesTypes";
import { Badge } from "../ui/badge";

const config: Record<PricingType, { label: string; className: string }> = {
    FREE: { label: "Free", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    PAID: { label: "Paid", className: "bg-blue-50 text-blue-700 border-blue-200" },
    SUBSCRIPTION: { label: "Subscription", className: "bg-violet-50 text-violet-700 border-violet-200" },
};

export function CourseBadge({ type }: { type?: string }) {
    const normalizedType = type?.toUpperCase() as PricingType;

    const data = config[normalizedType];

    if (!data) {
        return (
            <Badge variant="outline" className="text-xs font-medium">
                Unknown
            </Badge>
        );
    }

    return (
        <Badge
            variant="outline"
            className={`text-xs font-medium ${data.className}`}
        >
            {data.label}
        </Badge>
    );
}