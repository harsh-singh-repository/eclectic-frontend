// components/layout/Navbar.tsx
"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <div className="flex items-center justify-around px-6 py-2 border-b bg-[#F5F5F7] text-black">
      <h1 className="text-xl font-bold">LMS</h1>

      <div className="flex gap-4">
        <Link href="/">Home</Link>
        <Link href="/courses">Courses</Link>
        <Link href="/dashboard">Dashboard</Link>
      </div>

      <div>
        
      </div>
    </div>
  );
}