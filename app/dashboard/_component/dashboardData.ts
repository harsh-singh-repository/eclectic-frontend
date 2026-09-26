// Static/mock data for the dashboard. Swap these out for API data later —
// every component below only expects the shapes defined here.

export const navItems = {
  main: [
    { label: "Dashboard", icon: "LayoutGrid", active: true },
    { label: "Analytics", icon: "BarChart3" },
    { label: "Courses", icon: "BookOpen" },
    { label: "Batches", icon: "Layers" },
    { label: "Resources", icon: "FileText" },
  ],
  settings: [
    { label: "Settings", icon: "Settings" },
    { label: "Help & Support", icon: "HelpCircle" },
  ],
};

export const currentWeek = {
  label: "Week 4",
  range: "22 – 28 Sept 2026",
};

export const ratingItems = [
  { label: "Attendance", stars: 5 },
  { label: "Answers to general questions", stars: 4 },
  { label: "Answers upon call", stars: 4 },
  { label: "Assignment accomplishment", stars: 5 },
];

export const classProgress = {
  percent: 60,
  completed: 7,
  inProgress: 3,
  pending: 2,
  total: 12,
};

export const popularCourses = [
  {
    id: 1,
    name: "Mathematics (Class 8)",
    students: "2.4K students",
    percent: 92,
    icon: "PlayCircle",
    iconBg: "bg-slate-900",
    iconColor: "text-white",
  },
  {
    id: 2,
    name: "Science (Class 9)",
    students: "1.8K students",
    percent: 78,
    icon: "Atom",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-500",
  },
  {
    id: 3,
    name: "Linear Equations (Class 10)",
    students: "1.5K students",
    percent: 65,
    icon: "LineChart",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-500",
  },
  {
    id: 4,
    name: "Set Theory (Class 11)",
    students: "1.2K students",
    percent: 60,
    icon: "CircleDot",
    iconBg: "bg-cyan-100",
    iconColor: "text-cyan-600",
  },
  {
    id: 5,
    name: "Venn Diagram (Class 11)",
    students: "980 students",
    percent: 55,
    icon: "BarChart3",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-500",
  },
];

export const myResources = [
  {
    id: 1,
    name: "Linear Equations – Notes",
    type: "PDF",
    size: "2.4 MB",
    date: "15 Sept 2026",
    badgeBg: "bg-red-100",
    badgeColor: "text-red-500",
  },
  {
    id: 2,
    name: "Set Theory – Mind Map",
    type: "PNG",
    size: "1.1 MB",
    date: "12 Sept 2026",
    badgeBg: "bg-teal-100",
    badgeColor: "text-teal-600",
  },
  {
    id: 3,
    name: "Venn Diagram – Question Bank",
    type: "PDF",
    size: "3.2 MB",
    date: "10 Sept 2026",
    badgeBg: "bg-red-100",
    badgeColor: "text-red-500",
  },
  {
    id: 4,
    name: "Solved Examples – Worksheet",
    type: "PDF",
    size: "1.8 MB",
    date: "8 Sept 2026",
    badgeBg: "bg-red-100",
    badgeColor: "text-red-500",
  },
  {
    id: 5,
    name: "Class 8–10 Formula Sheet",
    type: "PDF",
    size: "900 KB",
    date: "5 Sept 2026",
    badgeBg: "bg-violet-100",
    badgeColor: "text-violet-500",
  },
];

export const pendingClasses = [
  {
    id: 1,
    title: "Linear Equations – Practice",
    subtitle: "Mathematics • Week 4",
    date: "27 Sept 2026",
    time: "10:00 AM – 11:00 AM",
    icon: "BookOpen",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-500",
  },
  {
    id: 2,
    title: "Set Theory – Advanced",
    subtitle: "Mathematics • Week 4",
    date: "28 Sept 2026",
    time: "10:00 AM – 11:00 AM",
    icon: "BookOpenCheck",
    iconBg: "bg-red-100",
    iconColor: "text-red-500",
  },
  {
    id: 3,
    title: "Venn Diagram – Questions",
    subtitle: "Mathematics • Week 4",
    date: "29 Sept 2026",
    time: "10:00 AM – 11:00 AM",
    icon: "FileQuestion",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-500",
  },
  {
    id: 4,
    title: "Revision & Doubt Session",
    subtitle: "Mathematics • Week 4",
    date: "30 Sept 2026",
    time: "10:00 AM – 11:00 AM",
    icon: "FileEdit",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-500",
  },
];