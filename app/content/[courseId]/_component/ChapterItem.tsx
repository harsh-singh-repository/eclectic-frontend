"use client";
import { ChevronDown } from "lucide-react";
import { useRef, useState } from "react";

export default function ChapterItem({
  chapter, index, selectedExercise, onSelectExercise,
}: any) {
  const [open, setOpen] = useState(true);
  const [openSubs, setOpenSubs] = useState<Record<string, boolean>>({});
  const bodyRef = useRef<HTMLDivElement>(null);

  const toggleSub = (id: string) =>
    setOpenSubs((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="border-b border-[#d8eae8]">
      {/* Chapter header */}
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-3 px-4 py-3.5 bg-white hover:bg-[#f0f9f8] transition-colors duration-150"
      >
        <div
          className={`min-w-[22px] h-[22px] rounded-[6px] flex items-center justify-center text-[11px] font-semibold text-white
            ${chapter.done ? "bg-[#FB2C36]" : "bg-[#09443E]"}`}
        >
          {index + 1}
        </div>
        <div className="flex-1 text-left">
          <p className="text-[10px] font-medium tracking-widest uppercase text-[#6aaba5] mb-0.5">
            Chapter {index + 1}
          </p>
          <h3 className="text-[13.5px] font-semibold text-[#09443E] leading-snug">
            {chapter.title}
          </h3>
        </div>
        <ChevronDown
          size={14}
          strokeWidth={2.5}
          className={`text-[#09443E] transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] flex-shrink-0
            ${open ? "rotate-180" : "rotate-0"}`}
        />
      </button>

      {/* Chapter body - animated */}
      <div
        className={`grid transition-all duration-350 ease-in-out
          ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          {chapter.children?.map((sub: any) => {
            const subOpen = openSubs[sub._id] ?? false;
            return (
              <div key={sub._id}>
                {/* Subchapter header */}
                <button
                  onClick={() => toggleSub(sub._id)}
                  aria-expanded={subOpen}
                  className="w-full flex items-center gap-2 px-4 py-2.5 bg-[#eef7f6] border-t border-[#d8eae8] hover:bg-[#dff1ef] transition-colors duration-150"
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full bg-[#09443E] flex-shrink-0 transition-opacity duration-150
                      ${subOpen ? "opacity-100" : "opacity-40"}`}
                  />
                  <span className="flex-1 text-left text-[12px] font-semibold text-[#09443E]">
                    {sub.title}
                  </span>
                  <span className="text-[10px] text-[#6aaba5] font-mono mr-2">
                    {sub.children?.length} lessons
                  </span>
                  <ChevronDown
                    size={12}
                    strokeWidth={2.5}
                    className={`text-[#09443E] transition-transform duration-250 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                      ${subOpen ? "rotate-180 opacity-100" : "rotate-0 opacity-40"}`}
                  />
                </button>

                {/* Exercises - animated */}
                <div
                  className={`grid transition-all duration-280 ease-in-out
                    ${subOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                >
                  <div className="overflow-hidden">
                    {sub.children?.map((ex: any, idx: number) => {
                      const active = selectedExercise?._id === ex._id;
                      return (
                        <button
                          key={ex._id}
                          onClick={() => onSelectExercise(ex)}
                          className={`w-full flex items-center gap-2.5 pl-6 pr-4 py-2.5 border-t border-[#e5f0ef] text-left transition-colors duration-100
                            ${active
                              ? "bg-[#d4f0ec] border-l-[3px] border-l-[#FB2C36] pl-[21px]"
                              : "hover:bg-[#e8f6f4]"
                            }`}
                        >
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 border transition-colors duration-150
                              ${active
                                ? "bg-[#FB2C36] border-[#FB2C36]"
                                : "bg-white border-[#c8e6e3]"
                              }`}
                          >
                            <svg
                              viewBox="0 0 10 10"
                              className={`w-2.5 h-2.5 ${active ? "fill-white" : "fill-[#09443E]"}`}
                            >
                              <polygon points="2,1 9,5 2,9" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className={`text-[12.5px] leading-snug ${active ? "font-semibold text-[#09443E]" : "font-medium text-[#1a3a38]"}`}>
                              {ex.title}
                            </p>
                            <span className="text-[10px] text-[#6aaba5] font-mono">
                              Lesson {idx + 1}
                            </span>
                          </div>
                          {ex.duration && (
                            <span className={`text-[10px] font-mono ${active ? "text-[#FB2C36]" : "text-[#aecfcd]"}`}>
                              {ex.duration}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}