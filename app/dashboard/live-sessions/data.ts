import type {
  CalendarDotType,
  Countdown,
  NextSession,
  Recording,
  StatItem,
  TodaySession,
} from "./types";

export const TABS = [
  { value: "upcoming", label: "Upcoming" },
  { value: "live", label: "Live Now (1)", live: true },
  { value: "completed", label: "Completed" },
  { value: "recordings", label: "Recordings" },
];

export const nextSession: NextSession = {
  title: "Data Structures — Arrays & Searching",
  meta: "DSA • Batch 2026 • Class 4 of 20",
  startsIn: "Starts in 42 minutes",
  time: "Today, 7:00 PM - 8:00 PM",
  duration: "1 hour",
  type: "Live Class",
  teacher: { name: "Rahul Sharma", role: "Teacher", initials: "RS" },
};

export const countdown: Countdown = { hours: "00", minutes: "42", seconds: "15" };

export const stats: StatItem[] = [
  { id: "week", label: "This Week", value: 3, caption: "Upcoming Sessions", tone: "teal", icon: "calendar" },
  { id: "live", label: "Live Now", value: 1, caption: "Session in Progress", tone: "blue", icon: "radio" },
  { id: "done", label: "Completed", value: 12, caption: "Sessions Completed", tone: "purple", icon: "check" },
  { id: "rec", label: "Recordings", value: 8, caption: "Available Recordings", tone: "orange", icon: "play" },
];

export const todaySessions: TodaySession[] = [
  { id: "1", start: "10:00 AM", end: "- 11:00 AM", title: "Mathematics — Integration", subtitle: "Class 8 • Batch 2026", status: "completed", statusLabel: "Completed", icon: "book", tone: "blue" },
  { id: "2", start: "2:00 PM", end: "- 3:00 PM", title: "Physics — Laws of Motion", subtitle: "Class 9 • Batch 2026", status: "live", statusLabel: "Live Now", icon: "atom", tone: "rose" },
  { id: "3", start: "7:00 PM", end: "- 8:00 PM", title: "Data Structures — Arrays & Searching", subtitle: "Class 10 • Batch 2026", status: "starts-soon", statusLabel: "Starts in 42 min", icon: "layers", tone: "amber" },
  { id: "4", start: "8:30 PM", end: "- 9:30 PM", title: "Web Development — HTML & CSS", subtitle: "Class 11 • Batch 2026", status: "upcoming", statusLabel: "Upcoming", icon: "code", tone: "purple" },
];

export const CALENDAR = {
  year: 2026,
  month: 9, // October (0-indexed)
  today: 20,
  events: {
    1: ["upcoming"],
    2: ["upcoming"],
    6: ["upcoming", "upcoming"],
    9: ["upcoming"],
    16: ["live"],
    20: ["upcoming"],
    23: ["completed"],
    30: ["live"],
  } as Record<number, CalendarDotType[]>,
};

export const recordings: Recording[] = [
  { id: "1", title: "Binary Trees in DSA", teacher: "Rahul Sharma", date: "Oct 15, 2026", duration: "1:12:34", subject: "Data Structures", tone: "purple", gradient: "from-slate-900 to-teal-900" },
  { id: "2", title: "Integration Techniques", teacher: "Priya Mehta", date: "Oct 12, 2026", duration: "58:20", subject: "Mathematics", tone: "blue", gradient: "from-slate-400 to-slate-600" },
  { id: "3", title: "Newton's Laws of Motion", teacher: "Amit Kumar", date: "Oct 10, 2026", duration: "1:05:17", subject: "Physics", tone: "blue", gradient: "from-slate-800 to-blue-900" },
  { id: "4", title: "HTML & CSS Basics", teacher: "Neha Verma", date: "Oct 8, 2026", duration: "1:28:45", subject: "Web Development", tone: "purple", gradient: "from-zinc-900 to-slate-700" },
];