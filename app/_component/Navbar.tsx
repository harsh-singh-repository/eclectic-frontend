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

export default function Navbar() {
    const [openLogin, setOpenLogin] = useState(false);
    const [openSignup, setOpenSignup] = useState(false);

    const { data: session  , status} = useSession();

    const pathname = usePathname();

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Courses", href: "/courses" },
        { name: "Dashboard", href: "/dashboard" },
    ];

    return (
        <div className="flex items-center justify-around px-6 py-2 border-b bg-[#FAFAFA] text-black sticky top-0 z-10">

            {/* Logo */}
            <div className="flex items-center gap-2">
                <Image
                    src={Logo}
                    alt="logo"
                    width={80}
                    height={80}
                    className="object-contain"
                />
            </div>

            {/* Navigation */}
            <div className="flex gap-8">
                {navLinks.map((link) => {
                    const isActive = pathname === link.href;

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`group relative pb-1 text-sm font-medium transition-colors duration-300
                                ${isActive
                                    ? "text-[#11A79A]"
                                    : "text-black hover:text-[#11A79A]"
                                }`}
                        >
                            {link.name}

                            {/* Underline */}
                            <span
                                className={`absolute left-0 -bottom-1 h-[2px] bg-[#11A79A] transition-all duration-300
                                    ${isActive
                                        ? "w-full"
                                        : "w-0 group-hover:w-full"
                                    }`}
                            />
                        </Link>
                    );
                })}
            </div>

            {/* Right Section */}
            <div className="flex gap-2 items-center">

                {status === "authenticated" ? (
                   <ProfilePopover/>
                ) : (
                    <>
                        <button
                            className="text-black py-2 px-4 border border-[#11A79A] bg-transparent text-sm rounded-md font-medium"
                            onClick={() => setOpenLogin(true)}
                        >
                            Sign In
                        </button>

                        <button
                            className="bg-[#11A79A] text-white py-2 px-4 text-sm rounded-md font-medium"
                            onClick={() => setOpenSignup(true)}
                        >
                            Sign Up
                        </button>
                    </>
                )}
            </div>

            {/* Login Dialog */}
            <Dialog open={openLogin} onOpenChange={setOpenLogin}>
                <DialogContent>
                    <AuthCard />
                </DialogContent>
            </Dialog>
        </div>
    );
}