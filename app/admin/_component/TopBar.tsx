"use client";

import ProfilePopover from "@/app/_component/ProfilePopover";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function Topbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b px-6">
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        <h1 className="text-lg font-semibold">Admin</h1>
      </div>

      <div className="flex items-center gap-3">
        <ProfilePopover/>
      </div>
    </header>
  );
}