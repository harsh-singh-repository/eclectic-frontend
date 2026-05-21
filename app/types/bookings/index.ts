export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
  period: "AM" | "PM";
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  price: number;
  originalPrice?: number;
  thumbnail: string;
  rating: number;
  students: number;
  topics: string[];
  demoAvailable: boolean;
}

export interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  date: Date | null;
  timeSlot: TimeSlot | null;
  courseId: string;
  notes: string;
}

export interface ZoomLink {
  meetingId: string;
  joinUrl: string;
  password: string;
  startTime: string;
}

export interface BookingConfirmation {
  bookingId: string;
  studentName: string;
  course: Course;
  date: string;
  time: string;
  zoomLink: ZoomLink;
  whatsappNotified: boolean;
}

export type BookingStep = "course" | "calendar" | "details" | "confirm";