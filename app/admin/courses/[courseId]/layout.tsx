 
import type { ReactNode } from "react";
 
export default function ContentLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans rounded-lg">
      <div className="border-b border-zinc-200 bg-white px-8 py-4">
        <p className="text-xs font-medium uppercase tracking-widest text-zinc-400">
          Admin Panel
        </p>
        <h1 className="mt-0.5 text-xl font-semibold text-zinc-900">
          Course Content Manager
        </h1>
      </div>
      <main className="px-4 py-4">{children}</main>
    </div>
  );
}
 