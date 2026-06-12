export type PricingType = "FREE" | "PAID" | "SUBSCRIPTION";

export interface CourseCreate {
  title: string;
  slug?: string;
  description?: string;
  thumbnail?: File;
  subjectId: string;
  categories: string[];
  pricing?: {
    type: PricingType;
    price?: number;
    discountPrice?: number;
  };
  isPublished?: boolean;
  features?: string[];
}

export type CourseUpdate = Partial<CourseCreate>;
export interface Course {
  _id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  subjectId: {
    _id: string;
    name: string;
  };
  categories: {
    _id: string;
    name: string;
  }[];
  features: string[];
  pricing: {
    type: PricingType;
    price?: number;
    discountPrice?: number;
  };
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}