// Static/mock data for the Analytics → Weekly Student Rating page.
//
// Calendar weeks are Sun-first for display, but a "rating week" is Mon→Sun
// (matches the product's real weekly-rating cycle). So each Sunday cell is
// the END of the week whose Mon–Sat lived in the row above it — every day
// below carries a `weekId` that points at its rating week's record.

export const monthLabel = "September 2026";
export const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const weeks = [
  [
    { date: 30, otherMonth: true },
    { date: 31, weekId: "w0" },
    { date: 1, weekId: "w0", hasRating: true },
    { date: 2, weekId: "w0", hasRating: true },
    { date: 3, weekId: "w0", hasRating: true },
    { date: 4, weekId: "w0", hasRating: true },
    { date: 5, weekId: "w0", hasRating: true },
  ],
  [
    { date: 6, weekId: "w0", hasRating: true },
    { date: 7, weekId: "w1", hasRating: true },
    { date: 8, weekId: "w1", hasRating: true },
    { date: 9, weekId: "w1", hasRating: true },
    { date: 10, weekId: "w1", hasRating: true },
    { date: 11, weekId: "w1", hasRating: true },
    { date: 12, weekId: "w1", hasRating: true },
  ],
  [
    { date: 13, weekId: "w1", hasRating: true },
    { date: 14, weekId: "w2", hasRating: true },
    { date: 15, weekId: "w2", hasRating: true },
    { date: 16, weekId: "w2", hasRating: true },
    { date: 17, weekId: "w2", hasRating: true },
    { date: 18, weekId: "w2", hasRating: true },
    { date: 19, weekId: "w2", hasRating: true },
  ],
  [
    { date: 20, weekId: "w2", isPending: true },
    { date: 21, weekId: "w3" },
    { date: 22, weekId: "w3" },
    { date: 23, weekId: "w3" },
    { date: 24, weekId: "w3", isToday: true, hasRating: true },
    { date: 25, weekId: "w3", hasRating: true },
    { date: 26, weekId: "w3", hasRating: true },
  ],
  [
    { date: 27, weekId: "w3", isPending: true },
    { date: 28, weekId: "w4" },
    { date: 29, weekId: "w4" },
    { date: 30, weekId: "w4" },
    { date: 1, otherMonth: true },
    { date: 2, otherMonth: true },
    { date: 3, otherMonth: true },
  ],
];

// Default week shown when the page first loads — the week containing today.
export const defaultWeekId = "w3";

const metricIcons = {
  attendance: "CheckCircle2",
  participation: "Users",
  homework: "BookOpen",
  classPerformance: "BarChart3",
};

export const metricLabels = {
  attendance: "Attendance",
  participation: "Participation",
  homework: "Homework",
  classPerformance: "Class Performance",
};

export const metricIconMap = metricIcons;

// ---- Mock "backend": one record per rating week ---------------------------
export const weekRecords = {
  w0: {
    rangeLabel: "Aug 31 – Sep 6, 2026",
    status: "shared",
    overallRating: 4.1,
    ratingChangePercent: 4,
    note: "Steady start to the month.",
    metrics: { attendance: 88, participation: 80, homework: 90, classPerformance: 84 },
    teacherFeedback: {
      quote: "Settled in well after the break. Keep up the consistent homework submissions.",
      teacher: "Rahul Sharma",
      date: "Sep 6, 2026",
    },
    topics: ["Arrays and Strings", "Time Complexity", "Stacks"],
    goals: [
      { label: "Attend all classes", checked: true },
      { label: "Complete homework", checked: true },
      { label: "Solve 10 DSA questions", checked: true },
      { label: "Prepare for quiz", checked: false },
    ],
  },
  w1: {
    rangeLabel: "Sep 7 – Sep 13, 2026",
    status: "shared",
    overallRating: 4.3,
    ratingChangePercent: 5,
    note: "Nice jump in participation this week.",
    metrics: { attendance: 90, participation: 86, homework: 92, classPerformance: 85 },
    teacherFeedback: {
      quote: "Asking sharper questions in class. Recursion is clicking now.",
      teacher: "Rahul Sharma",
      date: "Sep 13, 2026",
    },
    topics: ["Queues", "Linked List", "Recursion"],
    goals: [
      { label: "Attend all classes", checked: true },
      { label: "Complete homework", checked: true },
      { label: "Solve 10 DSA questions", checked: true },
      { label: "Prepare for quiz", checked: true },
    ],
  },
  w2: {
    rangeLabel: "Sep 14 – Sep 20, 2026",
    status: "pending",
    overallRating: 4.0,
    ratingChangePercent: -2,
    note: "Slight dip — sorting concepts need another pass.",
    metrics: { attendance: 85, participation: 78, homework: 88, classPerformance: 80 },
    teacherFeedback: {
      quote: "A bit quieter this week. Worth checking in on the sorting assignment.",
      teacher: "Rahul Sharma",
      date: "Sep 20, 2026",
    },
    topics: ["Sorting", "Searching", "Recursion"],
    goals: [
      { label: "Attend all classes", checked: true },
      { label: "Complete homework", checked: true },
      { label: "Solve 10 DSA questions", checked: false },
      { label: "Prepare for quiz", checked: false },
    ],
  },
  w3: {
    rangeLabel: "Sep 21 – Sep 27, 2026",
    status: "pending",
    overallRating: 4.5,
    ratingChangePercent: 8,
    note: "Good improvement this week!",
    metrics: { attendance: 92, participation: 88, homework: 95, classPerformance: 87 },
    teacherFeedback: {
      quote: "Good improvement in problem solving. More participation in discussions this week.",
      teacher: "Rahul Sharma",
      date: "Sep 27, 2026",
    },
    topics: ["Arrays and Strings", "Time Complexity", "Linked List", "Recursion", "Sorting"],
    goals: [
      { label: "Attend all classes", checked: true },
      { label: "Complete homework", checked: true },
      { label: "Solve 10 DSA questions", checked: false },
      { label: "Prepare for quiz", checked: false },
    ],
  },
  // w4 (Sep 28 – Oct 4) intentionally has no record yet — it's a future week.
};

// ---- Academic Performance Overview (bottom section) ------------------------
export const academicOverview = [
  {
    key: "overall",
    label: "Overall Performance",
    value: "84%",
    delta: "8.4%",
    deltaUp: true,
    subtitle: "From last month",
    progress: 84,
    icon: "Trophy",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-500",
    barColor: "bg-teal-500",
  },
  {
    key: "avgRating",
    label: "Average Weekly Rating",
    value: "4.2 / 5",
    delta: "12%",
    deltaUp: true,
    subtitle: "Based on 4 weeks",
    progress: 84,
    icon: "Star",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-500",
    barColor: "bg-blue-500",
  },
  {
    key: "assignment",
    label: "Assignment Score",
    value: "88%",
    delta: "6%",
    deltaUp: true,
    subtitle: "24 of 28 submitted",
    progress: 88,
    icon: "BookOpen",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-500",
    barColor: "bg-orange-500",
  },
  {
    key: "quiz",
    label: "Quiz/Test Performance",
    value: "82%",
    delta: "10%",
    deltaUp: true,
    subtitle: "Avg. of 12 tests",
    progress: 82,
    icon: "ClipboardList",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-500",
    barColor: "bg-violet-500",
  },
  {
    key: "goals",
    label: "Learning Goal Completion",
    value: "76%",
    delta: "15%",
    deltaUp: true,
    subtitle: "6 of 8 goals completed",
    progress: 76,
    icon: "Target",
    iconBg: "bg-red-100",
    iconColor: "text-red-500",
    barColor: "bg-red-500",
  },
];

// ---- Subject-wise Performance -----------------------------------------------
export const subjectPerformance = [
  {
    key: "ds",
    label: "Data Structures",
    percent: 92,
    icon: "Layers",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-500",
    barColor: "bg-teal-500",
  },
  {
    key: "java",
    label: "Java",
    percent: 84,
    icon: "Coffee",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-500",
    barColor: "bg-blue-500",
  },
  {
    key: "db",
    label: "Database",
    percent: 78,
    icon: "Database",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-500",
    barColor: "bg-amber-500",
  },
  {
    key: "web",
    label: "Web Development",
    percent: 88,
    icon: "Globe",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    barColor: "bg-violet-500",
  },
  {
    key: "os",
    label: "Operating System",
    percent: 72,
    icon: "Cpu",
    iconBg: "bg-red-100",
    iconColor: "text-red-500",
    barColor: "bg-red-400",
  },
];

// ---- Performance Trend (line chart) -----------------------------------------
export const performanceTrend = [
  { label: "W1", value: 62 },
  { label: "W2", value: 68 },
  { label: "W3", value: 74 },
  { label: "W4", value: 66 },
  { label: "W5", value: 78 },
  { label: "W6", value: 83 },
  { label: "W7", value: 85 },
  { label: "W8", value: 88 },
];

// ---- Strongest / needs-attention subject cards -------------------------------
export const strongestSubject = {
  label: "Data Structures",
  percent: "92%",
  note: "Consistently performing well",
};

export const needsAttentionSubject = {
  label: "Operating System",
  percent: "72%",
  note: "Needs more practice and revision",
};