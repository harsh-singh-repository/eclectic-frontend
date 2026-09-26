"use client";

import { ReactNode } from "react";
import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";

import { AppSidebar } from "./_component/app-sidebar";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-white">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />

          <SidebarInset className="min-w-0 flex-1">
            {children}
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}