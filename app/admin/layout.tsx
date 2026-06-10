"use client";

import { ReactNode } from "react";
import {
    SidebarProvider,
    SidebarInset,
} from "@/components/ui/sidebar";

import { AppSidebar } from "@/app/admin/_component/app-sidebar";
import { Topbar } from "@/app/admin/_component/TopBar";

export default function AdminLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <SidebarProvider>
            <AppSidebar />

            <SidebarInset>
                <Topbar />

                <main className="p-2 md:p-4">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}