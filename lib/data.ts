import { Course, TimeSlot } from "@/app/types/bookings";


export const COURSES: Course[] = [
  {
    id: "react-mastery",
    title: "React & Next.js Mastery",
    description: "Build production-grade apps with React 18, Next.js 14 App Router, TypeScript, and Tailwind CSS.",
    instructor: "Arjun Sharma",
    duration: "48 Hours",
    level: "Intermediate",
    price: 4999,
    originalPrice: 9999,
    thumbnail: "⚛️",
    rating: 4.9,
    students: 2840,
    topics: ["React Hooks", "Next.js 14", "TypeScript", "Tailwind CSS", "API Routes"],
    demoAvailable: true,
  },
  {
    id: "python-fullstack",
    title: "Python Full Stack",
    description: "Master Python, Django, REST APIs, PostgreSQL, and deploy full-stack apps on AWS.",
    instructor: "Priya Mehta",
    duration: "60 Hours",
    level: "Beginner",
    price: 5499,
    originalPrice: 11999,
    thumbnail: "🐍",
    rating: 4.8,
    students: 3120,
    topics: ["Python 3", "Django", "REST API", "PostgreSQL", "AWS"],
    demoAvailable: true,
  },
  {
    id: "data-science-ai",
    title: "Data Science & AI",
    description: "From data analysis to deploying ML models. Pandas, Scikit-learn, TensorFlow & more.",
    instructor: "Rohit Kapoor",
    duration: "72 Hours",
    level: "Advanced",
    price: 6999,
    originalPrice: 14999,
    thumbnail: "🤖",
    rating: 4.9,
    students: 1980,
    topics: ["Pandas", "Scikit-learn", "TensorFlow", "NLP", "MLOps"],
    demoAvailable: true,
  },
  {
    id: "uiux-design",
    title: "UI/UX Design Pro",
    description: "Figma, design systems, user research, prototyping and a complete portfolio project.",
    instructor: "Sneha Joshi",
    duration: "36 Hours",
    level: "Beginner",
    price: 3999,
    originalPrice: 7999,
    thumbnail: "🎨",
    rating: 4.7,
    students: 2250,
    topics: ["Figma", "Design Systems", "User Research", "Prototyping", "Accessibility"],
    demoAvailable: true,
  },
];

export function getTimeSlots(): TimeSlot[] {
  const slots: TimeSlot[] = [
    { id: "1", time: "09:00", period: "AM", available: true },
    { id: "2", time: "10:00", period: "AM", available: false },
    { id: "3", time: "11:00", period: "AM", available: true },
    { id: "4", time: "12:00", period: "PM", available: true },
    { id: "5", time: "02:00", period: "PM", available: false },
    { id: "6", time: "03:00", period: "PM", available: true },
    { id: "7", time: "04:00", period: "PM", available: true },
    { id: "8", time: "05:00", period: "PM", available: false },
    { id: "9", time: "06:00", period: "PM", available: true },
    { id: "10", time: "07:00", period: "PM", available: true },
  ];
  return slots;
}

export function generateZoomLink(): {
  meetingId: string;
  joinUrl: string;
  password: string;
} {
  const meetingId = Math.floor(Math.random() * 9000000000 + 1000000000).toString();
  const password = Math.random().toString(36).substring(2, 8).toUpperCase();
  return {
    meetingId,
    joinUrl: `https://zoom.us/j/${meetingId}?pwd=${password}`,
    password,
  };
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function generateBookingId(): string {
  return "BK" + Date.now().toString(36).toUpperCase();
}

export function getDiscount(price: number, original: number): number {
  return Math.round(((original - price) / original) * 100);
}