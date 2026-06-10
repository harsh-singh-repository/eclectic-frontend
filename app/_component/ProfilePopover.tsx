"use client";

import Image from "next/image";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import {
    LogOut,
    LayoutDashboard,
    User,
    Settings,
    ChevronDown,
} from "lucide-react";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function ProfilePopover() {
    const { data: session } = useSession();

    return (
        <Popover>
            <PopoverTrigger asChild>
                <button className="flex items-center gap-3 hover:bg-gray-100 transition px-3 py-2 rounded-xl">

                    {/* Profile Image */}
                    <div className="relative w-10 h-10">
                        <Image
                            src={
                                "https://ui-avatars.com/api/?name=User&background=11A79A&color=fff&format=png"
                            }
                            alt="profile"
                            fill
                            className="rounded-full object-cover"
                        />
                    </div>

                    {/* Name & Role */}
                    <div className="text-left hidden sm:block">
                        <h4 className="text-sm font-semibold leading-none">
                            {session?.user?.user?.name || "User"}
                        </h4>

                        <p className="text-xs text-gray-500 mt-1">
                            {session?.user?.user?.role || "Student"}
                        </p>
                    </div>

                    <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
            </PopoverTrigger>

            <PopoverContent
                align="end"
                className="w-64 rounded-2xl p-2"
            >
                {/* Top User Info */}
                <div className="flex items-center gap-3 p-3 border-b">

                    <div className="relative w-12 h-12">
                        <Image
                            src={
                                "https://ui-avatars.com/api/?name=User&background=11A79A&color=fff&format=png"
                            }
                            alt="profile"
                            fill
                            className="rounded-full object-cover"
                        />
                    </div>

                    <div>
                        <h3 className="font-semibold text-sm">
                            {session?.user?.user?.name}
                        </h3>

                        <p className="text-xs text-gray-500">
                            {session?.user?.user?.name}
                        </p>
                    </div>
                </div>

                {/* Menu Items */}
                <div className="flex flex-col py-2">

                    <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition text-sm"
                    >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                    </Link>

                    <Link
                        href="/profile"
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition text-sm"
                    >
                        <User className="w-4 h-4" />
                        Profile
                    </Link>

                    <Link
                        href="/settings"
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition text-sm"
                    >
                        <Settings className="w-4 h-4" />
                        Settings
                    </Link>
                </div>

                {/* Logout */}
                <div className="border-t pt-2">
                    <button
                        onClick={() => signOut({
                            callbackUrl: "/",
                        })}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 text-red-500 transition text-sm"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                </div>
            </PopoverContent>
        </Popover>
    );
}