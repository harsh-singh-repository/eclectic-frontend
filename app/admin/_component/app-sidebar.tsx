"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

import {
  LayoutDashboard,
  BookOpen,
  Users,
  Settings,
  Book,
  List,
} from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Categories",
    url: "/admin/categories",
    icon: List,
  },
  {
    title: "Subjects",
    url: "/admin/subjects",
    icon: BookOpen,
  },
  {
    title: "Courses",
    url: "/admin/courses",
    icon: Book,
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: Users,
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r border-zinc-200 bg-white">
      <SidebarContent>
        {/* Logo Section */}
        <div className="px-4 py-6 border-b border-zinc-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#18A49A] text-white font-bold">
              A
            </div>

            <div>
              <h2 className="font-semibold text-zinc-900">
                Admin Panel
              </h2>
              <p className="text-xs text-zinc-500">
                Eclectic Education
              </p>
            </div>
          </div>
        </div>

        <SidebarGroup className="px-3 py-4">
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {items.map((item) => {
                const isActive =
                  item.url === "/admin"
                    ? pathname === "/admin"
                    : pathname === item.url ||
                    pathname.startsWith(`${item.url}/`);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={`
                        h-11 rounded-xl transition-all duration-200
                        ${isActive
                          ? "bg-[#18A49A]/10 text-[#18A49A] font-medium border border-[#18A49A]/20"
                          : "text-zinc-600 hover:bg-[#18A49A]/5 hover:text-[#18A49A]"
                        }
                      `}
                    >
                      <Link
                        href={item.url}
                        className="flex items-center gap-3"
                      >
                        <item.icon
                          className={`h-5 w-5 ${isActive
                              ? "text-[#18A49A]"
                              : "text-zinc-500"
                            }`}
                        />

                        <span>{item.title}</span>

                        {isActive && (
                          <div className="ml-auto h-2 w-2 rounded-full bg-[#18A49A]" />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Footer */}
        <div className="mt-auto p-4">
          <div className="rounded-xl border border-[#FB2C36]/10 bg-[#FB2C36]/5 p-3">
            <p className="text-sm font-medium text-[#FB2C36]">
              System Status
            </p>
            <p className="mt-1 text-xs text-zinc-600">
              Monitor platform health and updates.
            </p>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}