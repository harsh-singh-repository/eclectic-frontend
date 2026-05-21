"use client";

import { ReactNode } from "react";
import {
    SidebarProvider,
    SidebarInset,
} from "@/components/ui/sidebar";

import { AppSidebar } from "./_component/app-sidebar";
import Navbar from "../_component/Navbar";

export default function AdminLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <div className="min-h-screen bg-white">
            <div className="pt-20">
                <SidebarProvider>
                    <div className="flex">
                        <AppSidebar />
                        <SidebarInset>
                            <main className="p-6">
                                {children}
                            </main>
                        </SidebarInset>
                    </div>
                </SidebarProvider>
            </div>
        </div>
    );
}