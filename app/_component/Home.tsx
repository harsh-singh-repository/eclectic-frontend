// app/(public)/page.tsx

import { Play } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
        
        {/* LEFT CONTENT */}
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-red-100 text-red-500 text-sm mb-6">
            <span className="w-2 h-2 bg-red-500 rounded-full" />
            India&apos;s #1 Learning Platform for Class 6-12
          </div>

          <h1 className="text-5xl md:text-6xl font-bold leading-tight text-[#091747]">
            Master <br />
            Every <br />
            Subject with{" "}
            <span className="text-red-500">Expert Guidance</span>
          </h1>

          <p className="mt-6 text-[#333333] max-w-md">
            Comprehensive courses for CBSE, ICSE & Olympiads. Live classes,
            video lectures, study materials and mock tests — all in one place.
          </p>

          <div className="mt-6 flex items-center gap-4">
            <button className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-medium">
              Explore Courses
            </button>

            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200">
              ↓
            </button>
          </div>
        </div>

        {/* RIGHT CARD */}
        <div className="flex justify-center">
          <div className="bg-white rounded-2xl shadow-md p-4 w-[320px]">
            
            {/* Video Preview */}
            <div className="relative rounded-xl overflow-hidden h-[180px] bg-gradient-to-br from-purple-500 to-blue-800 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-white/30 flex items-center justify-center backdrop-blur">
                <Play className="text-white" />
              </div>
            </div>

            {/* Content */}
            <div className="mt-4">
              <h3 className="font-semibold text-lg text-black">
                Class 10 — Mathematics Complete
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                CBSE Board · 120 Videos · 45 Hours
              </p>

              <div className="mt-4 flex items-center justify-between">
                <p className="text-red-500 font-bold text-lg">₹1,499</p>

                <button className="bg-gray-200 text-gray-500 px-4 py-2 rounded-lg text-sm">
                  Enroll Now
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}