export type Tone = "teal" | "blue" | "purple" | "orange" | "rose" | "amber";

export type SessionStatus = "completed" | "live" | "starts-soon" | "upcoming";

export type SessionIcon = "book" | "atom" | "layers" | "code";

export interface NextSession {
  title: string;
  meta: string;
  startsIn: string;
  time: string;
  duration: string;
  type: string;
  teacher: { name: string; role: string; initials: string };
}

export interface Countdown {
  hours: string;
  minutes: string;
  seconds: string;
}

export interface StatItem {
  id: string;
  label: string;
  value: number;
  caption: string;
  tone: Tone;
  icon: "calendar" | "radio" | "check" | "play";
}

export interface TodaySession {
  id: string;
  start: string;
  end: string;
  title: string;
  subtitle: string;
  status: SessionStatus;
  statusLabel: string;
  icon: SessionIcon;
  tone: Tone;
}

export type CalendarDotType = "upcoming" | "live" | "completed";

export interface Recording {
  id: string;
  title: string;
  teacher: string;
  date: string;
  duration: string;
  subject: string;
  tone: Tone;
  gradient: string;
}