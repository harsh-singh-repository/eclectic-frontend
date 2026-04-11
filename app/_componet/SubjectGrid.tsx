// components/subject/SubjectGrid.tsx

import { BookOpen, Calculator, Globe, FlaskConical, Atom, Zap, DollarSign } from "lucide-react";

const subjects = [
  {
    name: "Mathematics",
    videos: 420,
    classes: 7,
    icon: Calculator,
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    name: "Science",
    videos: 380,
    classes: 7,
    icon: FlaskConical,
    color: "bg-green-100 text-green-600",
  },
  {
    name: "Social Studies",
    videos: 290,
    classes: 5,
    icon: Globe,
    color: "bg-purple-100 text-purple-600",
  },
  {
    name: "English",
    videos: 240,
    classes: 7,
    icon: BookOpen,
    color: "bg-blue-100 text-blue-600",
  },
  {
    name: "Chemistry",
    videos: 310,
    classes: 4,
    icon: FlaskConical,
    color: "bg-pink-100 text-pink-600",
  },
  {
    name: "Biology",
    videos: 280,
    classes: 4,
    icon: Atom,
    color: "bg-green-100 text-green-600",
  },
  {
    name: "Physics",
    videos: 340,
    classes: 4,
    icon: Zap,
    color: "bg-indigo-100 text-indigo-600",
  },
  {
    name: "Accountancy",
    videos: 190,
    classes: 2,
    icon: DollarSign,
    color: "bg-orange-100 text-orange-600",
  },
];

export default function SubjectGrid() {
  return (
    <section className="py-16 bg-[#f5f5f7]">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1d1d2e]">
            Browse by Subject
          </h2>
          <p className="text-gray-500 mt-3">
            Choose from 15+ subjects across Class 6–12 for CBSE, ICSE, and Olympiad preparation
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {subjects.map((subject, i) => {
            const Icon = subject.icon;

            return (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 text-center border hover:shadow-lg transition-all cursor-pointer"
              >
                {/* Icon */}
                <div
                  className={`w-14 h-14 mx-auto flex items-center justify-center rounded-xl ${subject.color}`}
                >
                  <Icon size={24} />
                </div>

                {/* Title */}
                <h3 className="mt-4 font-semibold text-lg">
                  {subject.name}
                </h3>

                {/* Meta */}
                <p className="text-sm text-gray-500 mt-1">
                  {subject.videos} Videos · {subject.classes} Classes
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}