"use client";

import { BookingConfirmation } from "@/app/types/bookings";

interface ConfirmationCardProps {
  confirmation: BookingConfirmation;
  onNewBooking: () => void;
}

export default function ConfirmationCard({
  confirmation,
  onNewBooking,
}: ConfirmationCardProps) {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(confirmation.zoomLink.joinUrl);
    alert("Zoom link copied to clipboard!");
  };

  return (
    <div className="max-w-lg mx-auto">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
          <svg className="w-10 h-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-extrabold text-slate-800 mb-2">Demo Booked! 🎉</h2>
        <p className="text-slate-500 text-sm">
          See you on your demo session, {confirmation.studentName.split(" ")[0]}!
        </p>
      </div>

      {/* Booking Details Card */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm mb-4">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-4">
          <p className="text-indigo-100 text-xs font-medium uppercase tracking-wider">Booking ID</p>
          <p className="text-white font-mono font-bold text-lg">{confirmation.bookingId}</p>
        </div>

        <div className="p-5 space-y-4">
          {/* Course */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-2xl">
              {confirmation.course.thumbnail}
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Course</p>
              <p className="text-sm font-bold text-slate-800">{confirmation.course.title}</p>
              <p className="text-xs text-slate-500">by {confirmation.course.instructor}</p>
            </div>
          </div>

          <div className="h-px bg-slate-100" />

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center text-lg">📅</div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Date</p>
                <p className="text-sm font-semibold text-slate-700">{confirmation.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-purple-50 rounded-lg flex items-center justify-center text-lg">⏰</div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Time</p>
                <p className="text-sm font-semibold text-slate-700">{confirmation.time}</p>
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100" />

          {/* Zoom Link */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 bg-sky-50 rounded-lg flex items-center justify-center text-lg">🔗</div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Zoom Meeting</p>
                <p className="text-sm font-semibold text-slate-700">ID: {confirmation.zoomLink.meetingId}</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 space-y-2 border border-slate-200">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500 font-mono break-all pr-2">
                  {confirmation.zoomLink.joinUrl}
                </p>
                <button
                  onClick={handleCopyLink}
                  className="flex-shrink-0 text-xs text-indigo-600 font-semibold hover:text-indigo-700 bg-indigo-50 px-2.5 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors"
                >
                  Copy
                </button>
              </div>
              <p className="text-xs text-slate-500">
                Password: <span className="font-mono font-bold text-slate-700">{confirmation.zoomLink.password}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Notification Status */}
      <div className={`flex items-center gap-3 rounded-xl p-4 mb-6 border ${
        confirmation.whatsappNotified
          ? "bg-emerald-50 border-emerald-200"
          : "bg-amber-50 border-amber-200"
      }`}>
        <span className="text-2xl">{confirmation.whatsappNotified ? "✅" : "⚠️"}</span>
        <div>
          <p className={`text-sm font-semibold ${confirmation.whatsappNotified ? "text-emerald-700" : "text-amber-700"}`}>
            {confirmation.whatsappNotified
              ? "Admin notified via WhatsApp"
              : "WhatsApp notification pending"}
          </p>
          <p className={`text-xs mt-0.5 ${confirmation.whatsappNotified ? "text-emerald-600" : "text-amber-600"}`}>
            {confirmation.whatsappNotified
              ? "Your instructor has been informed and will join on time."
              : "Please configure WhatsApp API to enable automatic notifications."}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <a
          href={`https://calendar.google.com/calendar/r/eventedit?text=Demo+Class&dates=&details=Zoom+ID:+${confirmation.zoomLink.meetingId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3.5 rounded-xl text-sm font-semibold bg-indigo-500 text-white text-center hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2"
        >
          📆 Add to Google Calendar
        </a>
        <button
          onClick={onNewBooking}
          className="w-full py-3.5 rounded-xl text-sm font-semibold border-2 border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Book Another Demo
        </button>
      </div>
    </div>
  );
}