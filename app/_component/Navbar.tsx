// components/layout/Navbar.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import Logo from "@/app/asset/IMG_7668-removebg-preview.png";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import AuthCard from "./authForm";
import { usePathname } from "next/navigation";
import ProfilePopover from "./ProfilePopover";
import { useSession } from "next-auth/react";
import {
    Search, Bell, Home, BookOpen, LayoutDashboard,
    Users, UserCircle, Menu, X, ChevronDown,
} from "lucide-react";

const guestLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Courses", href: "/courses", icon: BookOpen },
];

const authLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Courses", href: "/courses", icon: BookOpen },
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Community", href: "/community", icon: Users },
];

export default function Navbar() {
    const [openLogin, setOpenLogin] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const isAuth = status === "authenticated";
    const navLinks = isAuth ? authLinks : guestLinks;

    const initials = session?.user?.name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() ?? "?";

    return (
        <>
            {/* ── Desktop & Tablet Navbar ── */}
            <header className="sticky top-0 z-40 hidden md:flex items-center justify-between
        px-6 h-[60px] bg-white border-b border-[#d0e0de]">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 flex-shrink-0">
                    <Image src={Logo} alt="Eclectic Education" width={40} height={40} className="object-contain" />
                    <div className="text-md font-semibold"
                        style={{ fontFamily: "'Sora', 'DM Serif Display', Georgia, serif" }}
                    >
                        Eclectic Education
                    </div>
                </Link>

                {/* Nav links */}
                <nav className="flex items-center gap-1">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`relative px-3 py-1.5 text-[14px] font-medium rounded-lg transition-colors duration-150
                  ${isActive
                                        ? "text-[#09443E] bg-[#eef7f6]"
                                        : "text-[#3a6a67] hover:text-[#09443E] hover:bg-[#eef7f6]"
                                    }`}
                            >
                                {link.name}
                                {isActive && (
                                    <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#09443E] rounded-full" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Right section */}
                <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Search — always visible */}
                    <button
                        className="w-[34px] h-[34px] rounded-[9px] border border-[#d0e0de] bg-white
              flex items-center justify-center hover:bg-[#eef7f6] hover:border-[#09443E] transition-colors"
                        aria-label="Search"
                    >
                        <Search size={15} className="text-[#09443E]" />
                    </button>

                    {isAuth ? (
                        <>
                            {/* Notifications */}
                            <button
                                className="relative w-[34px] h-[34px] rounded-[9px] border border-[#d0e0de] bg-white
                  flex items-center justify-center hover:bg-[#eef7f6] hover:border-[#09443E] transition-colors"
                                aria-label="Notifications"
                            >
                                <Bell size={15} className="text-[#09443E]" />
                                <span className="absolute top-[7px] right-[7px] w-[7px] h-[7px] rounded-full bg-[#FB2C36] border-2 border-white" />
                            </button>

                            {/* My Learning shortcut */}
                            <Link
                                href="/my-learning"
                                className="hidden lg:flex items-center gap-1.5 px-3 h-[34px] rounded-[9px]
                  border border-[#d0e0de] text-[12px] font-semibold text-[#09443E]
                  hover:bg-[#eef7f6] hover:border-[#09443E] transition-colors"
                            >
                                <BookOpen size={13} />
                                My Learning
                            </Link>

                            <div className="w-px h-5 bg-[#d0e0de]" />

                            {/* Avatar */}
                            <ProfilePopover />
                        </>
                    ) : (
                        <>
                            <div className="w-px h-5 bg-[#d0e0de]" />
                            <button
                                onClick={() => setOpenLogin(true)}
                                className="h-[34px] px-4 text-[12px] font-semibold text-[#09443E]
                  border border-[#09443E] rounded-[9px] hover:bg-[#eef7f6] transition-colors"
                            >
                                Sign in
                            </button>
                            <button
                                onClick={() => setOpenLogin(true)}
                                className="h-[34px] px-4 text-[12px] font-semibold text-white
                  bg-[#09443E] rounded-[9px] hover:opacity-90 transition-opacity"
                            >
                                Get started
                            </button>
                        </>
                    )}
                </div>
            </header>

            {/* ── Mobile Topbar ── */}
            <header className="md:hidden sticky top-0 z-40 flex items-center justify-between
        px-4 h-[54px] bg-white border-b border-[#d0e0de]">

                <Link href="/" className="flex items-center gap-2">
                    <Image src={Logo} alt="Eclectic Education" width={32} height={32} className="object-contain" />
                    <p className="text-[13px] font-bold text-[#09443E]">Eclectic</p>
                </Link>

                <div className="flex items-center gap-2">
                    <button
                        className="w-[30px] h-[30px] rounded-[8px] border border-[#d0e0de] flex items-center justify-center"
                        aria-label="Search"
                    >
                        <Search size={14} className="text-[#09443E]" />
                    </button>

                    {isAuth ? (
                        <>
                            <button
                                className="relative w-[30px] h-[30px] rounded-[8px] border border-[#d0e0de] flex items-center justify-center"
                                aria-label="Notifications"
                            >
                                <Bell size={14} className="text-[#09443E]" />
                                <span className="absolute top-[6px] right-[6px] w-[6px] h-[6px] rounded-full bg-[#FB2C36] border-[1.5px] border-white" />
                            </button>
                            <ProfilePopover />
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => setOpenLogin(true)}
                                className="text-[11px] font-semibold text-[#09443E] px-3 py-1.5
                  border border-[#09443E] rounded-[8px]"
                            >
                                Sign in
                            </button>
                            <button
                                onClick={() => setOpenLogin(true)}
                                className="text-[11px] font-semibold text-white px-3 py-1.5
                  bg-[#09443E] rounded-[8px]"
                            >
                                Get started
                            </button>
                        </>
                    )}
                </div>
            </header>

            {/* ── Mobile Bottom Nav ── */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white
        border-t border-[#d0e0de] flex items-center justify-around px-2 py-2 safe-area-pb">
                {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    const Icon = link.icon;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors"
                        >
                            <Icon
                                size={20}
                                className={isActive ? "text-[#09443E]" : "text-[#6aaba5]"}
                            />
                            <span className={`text-[9px] font-${isActive ? "600" : "500"}
                ${isActive ? "text-[#09443E]" : "text-[#6aaba5]"}`}>
                                {link.name}
                            </span>
                        </Link>
                    );
                })}
                {isAuth && (
                    <Link href="/profile" className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg">
                        <UserCircle size={20} className={pathname === "/profile" ? "text-[#09443E]" : "text-[#6aaba5]"} />
                        <span className={`text-[9px] font-500 ${pathname === "/profile" ? "text-[#09443E]" : "text-[#6aaba5]"}`}>
                            Profile
                        </span>
                    </Link>
                )}
            </nav>

            {/* Auth Dialog */}
            <Dialog open={openLogin} onOpenChange={setOpenLogin}>
                <DialogContent>
                    <AuthCard />
                </DialogContent>
            </Dialog>
        </>
    );
}