"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Logo from "@/app/asset/IMG_7668-removebg-preview.png";
import {
  LayoutDashboard,
  BarChart2,
  Settings,
  HelpCircle,
  ChevronDown,
  BookOpen,
  ListVideo,
  File,
  LogOut,
} from "lucide-react";
import Image from "next/image";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut } from "next-auth/react";

const TEAL = "#0EA5A0";

const mainItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Analytics", url: "/analytics", icon: BarChart2, hasDropdown: true },
  { title: "Courses", url: "/courses", icon: ListVideo },
  { title: "Batches", url: "/batches", icon: BookOpen },
  { title: "Resources", url: "/resources", icon: File },
];

const settingsItems = [
  { title: "Settings", url: "/settings", icon: Settings, hasDropdown: true },
  { title: "Help & Support", url: "/help", icon: HelpCircle },
];

type NavItemDef = {
  title: string;
  url: string;
  icon: React.ElementType;
  hasDropdown?: boolean;
};

function NavItem({ item, isActive }: { item: NavItemDef; isActive: boolean }) {
  const [hovered, setHovered] = useState(false);

  const showHover = !isActive && hovered;

  const linkStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    borderRadius: "10px",
    padding: "9px 12px",
    textDecoration: "none",
    fontWeight: 500,
    fontSize: "14px",
    transition: "background 0.18s ease, color 0.18s ease, box-shadow 0.18s ease, border-left 0.18s ease",
    cursor: "pointer",
    userSelect: "none",
    borderLeft: showHover ? `3px solid ${TEAL}` : "3px solid transparent",
    backgroundColor: isActive
      ? TEAL
      : showHover
        ? "#EDFAFA"
        : "transparent",
    color: isActive ? "#ffffff" : showHover ? TEAL : "#374151",
    boxShadow: isActive
      ? "0 2px 8px rgba(14,165,160,0.30)"
      : showHover
        ? "0 1px 4px rgba(14,165,160,0.10)"
        : "none",
  };

  const iconStyle: React.CSSProperties = {
    width: "18px",
    height: "18px",
    flexShrink: 0,
    color: isActive ? "#ffffff" : showHover ? TEAL : "#6B7280",
    transition: "color 0.18s ease",
  };

  const chevronStyle: React.CSSProperties = {
    width: "15px",
    height: "15px",
    flexShrink: 0,
    marginLeft: "auto",
    color: isActive ? "rgba(255,255,255,0.75)" : "#9CA3AF",
    transition: "color 0.18s ease",
  };

  return (
    <SidebarMenuItem style={{ listStyle: "none", margin: "1px 0" }}>
      <Link
        href={item.url}
        style={linkStyle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <item.icon style={iconStyle} />
        <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {item.title}
        </span>
        {item.hasDropdown && <ChevronDown style={chevronStyle} />}
      </Link>
    </SidebarMenuItem>
  );
}

export function AppSidebar() {
  const pathname = usePathname();

  const labelStyle: React.CSSProperties = {
    display: "block",
    padding: "0 8px",
    marginBottom: "6px",
    fontSize: "10px",
    fontWeight: 600,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#9CA3AF",
  };

  return (
    <Sidebar className="border-r border-gray-100 bg-white" style={{ width: "240px" }}>
      <SidebarContent className="bg-white" style={{ paddingTop: "8px" }}>

        <SidebarGroup style={{ padding: "16px 12px 8px" }}>
          <div className="flex items-center gap-x-1 my-2">
            <div className="flex items-center gap-2 h-10 w-10">
              <Image
                src={Logo}
                alt="logo"
                width={80}
                height={80}
                className="object-contain"
              />
            </div>
            <div className="text-md font-semibold"
              style={{ fontFamily: "'Sora', 'DM Serif Display', Georgia, serif" }}
            >
              Eclectic Education
            </div>
          </div>
          <SidebarGroupLabel style={labelStyle}>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu style={{ padding: 0, margin: 0, marginTop: "0px", gap: "10px" }}>
              {mainItems.map((item) => (
                <NavItem
                  key={item.title}
                  item={item}
                  isActive={pathname === item.url}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* ── Divider ── */}
        <div style={{ margin: "4px 16px", borderTop: "1px solid #F3F4F6" }} />

        {/* ── SETTINGS ── */}
        <SidebarGroup style={{ padding: "12px 12px 8px" }}>
          <SidebarGroupLabel style={labelStyle}>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu style={{ padding: 0, margin: 0, gap: "10px" }}>
              {settingsItems.map((item) => (
                <NavItem
                  key={item.title}
                  item={item}
                  isActive={pathname === item.url}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarFooter className="border-t bg-white p-4">

          {/* Logout Button */}
          <button
            onClick={() => signOut({
              callbackUrl: "/",
            })}
            className="
      group flex items-center gap-3
      w-full rounded-2xl
      px-4 py-3 mb-4
      text-sm font-medium
      text-red-500
      transition-all duration-300

      hover:bg-red-50
    "
          >
            <div
              className="
        flex items-center justify-center
        w-9 h-9 rounded-full
        bg-red-100
        transition-all duration-300

        group-hover:bg-red-200
      "
            >
              <LogOut className="w-5 h-5" />
            </div>

            <span>Logout</span>
          </button>

          {/* Footer Text */}
          <div className="text-center text-xs leading-5 text-gray-400">
            <p>© 2026 Eclectic Education</p>
            <p>All rights reserved</p>
          </div>

        </SidebarFooter>

      </SidebarContent>
    </Sidebar>
  );
}