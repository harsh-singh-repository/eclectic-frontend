
import { CategoryPageHeader } from "@/components/categories/CategoriesPageHeader";
import { CategoryTableSection } from "@/components/categories/CategoryTableSection";

export default function CategoriesPage() {
  return (
    <main className="min-h-screen">
      {/* Top nav bar */}
      <nav className="border-b border-stone-200 bg-white px-0 md:px-2 py-3 flex items-center gap-3">
        <span className="text-xs font-semibold tracking-widest text-stone-400 uppercase">
          Admin
        </span>
        <span className="text-stone-300">/</span>
        <span className="text-xs font-medium text-stone-600">Categories</span>
      </nav>

      <div className="max-w-8xl mx-auto px-2 py-10 space-y-8">
        <CategoryPageHeader />
        <CategoryTableSection />
      </div>
    </main>
  );
}