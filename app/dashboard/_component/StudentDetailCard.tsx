"use client";

import { UserRound, RefreshCw, Clock, UserX } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";

const statCards = [
  {
    label: "Total Attendance",
    value: "13 Days",
    icon: UserRound,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-500",
    cardHover: "hover:bg-blue-50 hover:border-blue-200 hover:shadow-blue-100",
  },
  {
    label: "Late Attendance",
    value: "7 Days",
    icon: RefreshCw,
    iconBg: "bg-green-100",
    iconColor: "text-green-500",
    cardHover:
      "hover:bg-green-50 hover:border-green-200 hover:shadow-green-100",
  },
  {
    label: "Undertime Attendance",
    value: "1 Days",
    icon: Clock,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-500",
    cardHover:
      "hover:bg-amber-50 hover:border-amber-200 hover:shadow-amber-100",
  },
  {
    label: "Total Absent",
    value: "2 Days",
    icon: UserX,
    iconBg: "bg-red-100",
    iconColor: "text-red-400",
    cardHover: "hover:bg-red-50 hover:border-red-200 hover:shadow-red-100",
  },
];

export function StudentDetails() {
  const { data: session } = useSession();

  const infoFields = [
    { label: "Mobile Number", value: session?.user?.user?.mobileNumber },
    { label: "Email", value: session?.user?.user?.email },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 font-sans">
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-gray-900 tracking-tight">
          Student Details
        </h2>

        <div className="flex items-center gap-2.5">
          {/* Period dropdown */}
          {/* <div className="relative">
                        <button
                            onClick={() => setDropOpen((o) => !o)}
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:border-[#0EA5A0] hover:text-[#0EA5A0] transition-colors duration-150 cursor-pointer"
                        >
                            {period}
                            <ChevronDown size={14} />
                        </button>

                        {dropOpen && (
                            <div className="absolute top-[calc(100%+6px)] right-0 z-50 min-w-[110px] bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                                {periods.map((p) => (
                                    <div
                                        key={p}
                                        onClick={() => { setPeriod(p); setDropOpen(false); }}
                                        className={`
                      px-4 py-2.5 text-sm cursor-pointer transition-colors duration-100
                      ${p === period
                                                ? "bg-[#EDFAFA] text-[#0EA5A0] font-semibold"
                                                : "text-gray-600 hover:bg-gray-50 font-medium"
                                            }
                    `}
                                    >
                                        {p}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div> */}

          {/* Download button */}
          {/* <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0EA5A0] hover:bg-[#0C8F8A] text-white text-sm font-semibold shadow-md shadow-[#0EA5A0]/25 hover:shadow-[#0EA5A0]/40 hover:-translate-y-0.5 transition-all duration-150 cursor-pointer">
                        <Download size={15} />
                        Download
                    </button> */}
        </div>
      </div>

      {/* ── Student info ── */}
      <div className="flex items-center gap-5 px-5 py-4 rounded-xl bg-gray-50 border border-gray-100 mb-5">
        {/* Avatar */}
        <div className="relative w-20 h-20">
          <Image
            src={
              "https://ui-avatars.com/api/?name=User&background=11A79A&color=fff&format=png"
            }
            alt="profile"
            // fill
            height={100}
            width={100}
            className="rounded-full object-cover"
          />
        </div>

        {/* Name + fields */}
        <div className="flex-1">
          <p className="text-base font-medium text-gray-900 mb-2">
            {session?.user?.user?.name}
          </p>
          <div className="flex gap-8 flex-wrap">
            {infoFields.map(({ label, value }) => (
              <div key={label}>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-0.5">
                  {label}
                </p>
                <p className="text-[13px] font-medium text-gray-600">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-4 gap-3.5">
        {statCards.map((card) => (
          <div
            key={card.label}
            className={`
              flex items-center gap-3.5 p-4 rounded-xl
              bg-white border border-gray-100
              shadow-sm hover:shadow-md hover:-translate-y-0.5
              transition-all duration-200 cursor-default
              ${card.cardHover}
            `}
          >
            {/* Icon */}
            <div
              className={`w-11 h-11 rounded-full ${card.iconBg} flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110`}
            >
              <card.icon
                size={20}
                className={card.iconColor}
                strokeWidth={1.8}
              />
            </div>

            {/* Text */}
            <div>
              <p className="text-[17px] font-semibold text-gray-900 leading-tight">
                {card.value.toLocaleString()}
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5">{card.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
