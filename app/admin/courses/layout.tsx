export default function CoursesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="px-2 py-8">
        {children}
      </div>
    </div>
  );
}