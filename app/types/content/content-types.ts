export type ContentType =
  | "CHAPTER"
  | "SUBCHAPTER"
  | "EXERCISE";

export type PricingType = "FREE" | "PAID";

export interface ContentCreate {
  title: string;
  type: ContentType;
  courseId: string;
  parentId?: string | null;

  order?: number;

  pricing?: {
    type: PricingType;
    price?: number;
  };

  videoUrl?: string;
  duration?: number;

  isPublished?: boolean;
}

export type ContentUpdate = Partial<ContentCreate>;

export interface Content {
  _id: string;
  title: string;
  type: ContentType;
  courseId: string;
  parentId: string | null;
  order: number;
  
  pricing?: {
    type: PricingType;
    price?: number;
  };

  videoId?: string;
  duration?: number;
  isPublished: boolean;

  children?: Content[];

  createdAt: string;
  updatedAt: string;
}