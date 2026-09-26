"use client";

import { ArrowRight, Download, MoreVertical, FileText, Image as ImageIcon } from "lucide-react";
import { myResources } from "./dashboardData";

export function MyResources() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 font-sans">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 tracking-tight">
          Resource Center
        </h2>
        <button
          type="button"
          className="flex items-center gap-1 text-xs font-medium text-teal-600 hover:text-teal-700 cursor-pointer"
        >
          View All
          <ArrowRight size={13} />
        </button>
      </div>

      <div className="flex flex-col">
        {myResources.map((file) => {
          const FileIcon = file.type === "PNG" ? ImageIcon : FileText;
          return (
            <div
              key={file.id}
              className="flex items-center gap-3.5 py-3 border-b border-gray-50 last:border-0"
            >
              <div
                className={`w-10 h-10 rounded-lg ${file.badgeBg} flex flex-col items-center justify-center shrink-0`}
              >
                <FileIcon size={15} className={file.badgeColor} strokeWidth={1.8} />
                <span className={`text-[7px] font-bold ${file.badgeColor} mt-0.5`}>
                  {file.type}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-gray-900 truncate">
                  {file.name}
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  {file.type} • {file.size} • {file.date}
                </p>
              </div>

              <button
                type="button"
                className="w-8 h-8 rounded-lg hover:bg-gray-50 flex items-center justify-center text-gray-400 shrink-0 cursor-pointer"
              >
                <Download size={15} strokeWidth={1.8} />
              </button>
              <button
                type="button"
                className="w-8 h-8 rounded-lg hover:bg-gray-50 flex items-center justify-center text-gray-400 shrink-0 cursor-pointer"
              >
                <MoreVertical size={15} strokeWidth={1.8} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}