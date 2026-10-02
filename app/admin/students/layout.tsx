"use client";

import { ReactNode } from "react";

export default function AdminLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <main className="p-6">
            {children}
        </main>
    );
}