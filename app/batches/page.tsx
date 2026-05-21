"use client";

import { useState } from "react";
import { BookingFormData, BookingStep, BookingConfirmation, Course, TimeSlot } from "@/app/types/bookings";
import { COURSES, getTimeSlots, generateZoomLink, formatDate, generateBookingId } from "@/lib/data";
import { buildWhatsAppLink, sendLeadToWhatsApp } from "@/lib/whatsapp";
import StepIndicator from "@/components/booking/StepIndicator";
import CourseCard from "@/components/courses/CourseCard";
import Calendar from "@/components/booking/Calender";
import TimeSlotPicker from "@/components/booking/TimeSlotPicker";
import StudentForm from "@/components/booking/StudentForm";
import ConfirmationCard from "@/components/booking/ConfirmationCard";
import EnrollModal from "@/components/booking/EnrollModal";
import axios from "axios";

// Admin WhatsApp number (include country code, no + or spaces)
const ADMIN_WHATSAPP = "919876543210";

function validateForm(data: BookingFormData): Partial<Record<keyof BookingFormData, string>> {
  const errors: Partial<Record<keyof BookingFormData, string>> = {};
  if (!data.name.trim()) errors.name = "Please enter your full name";
  if (!data.email.trim()) errors.email = "Please enter your email";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = "Please enter a valid email";
  if (!data.phone.trim()) errors.phone = "Please enter your phone number";
  else if (!/^[\d\s+\-()]{8,}$/.test(data.phone)) errors.phone = "Please enter a valid phone number";
  return errors;
}

export default function BookingPage() {
  const [step, setStep] = useState<BookingStep>("course");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [enrollCourse, setEnrollCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState<BookingFormData>({
    name: "", email: "", phone: "", date: null, timeSlot: null, courseId: "", notes: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof BookingFormData, string>>>({});
  const [confirmation, setConfirmation] = useState<BookingConfirmation | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timeSlots = getTimeSlots();

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
    setFormData((p) => ({ ...p, courseId: course.id }));
  };

  const handleFieldChange = (field: keyof BookingFormData, value: string) => {
    setFormData((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: undefined }));
  };

  const handleDateSelect = (date: Date) => {
    setFormData((p) => ({ ...p, date, timeSlot: null }));
  };

  const handleTimeSelect = (slot: TimeSlot) => {
    setFormData((p) => ({ ...p, timeSlot: slot }));
  };

  const goToCalendar = () => {
    if (!selectedCourse) return;
    setStep("calendar");
  };

  const goToDetails = () => {
    if (!formData.date || !formData.timeSlot) return;
    setStep("details");
  };

  const handleSubmit = async () => {
    const errs = validateForm(formData);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setIsSubmitting(true);

    // Simulate API delay
    await new Promise((r) => setTimeout(r, 1500));

    const zoom = generateZoomLink();
    const bookingId = generateBookingId();

    const confirm: BookingConfirmation = {
      bookingId,
      studentName: formData.name,
      course: selectedCourse!,
      date: formatDate(formData.date!),
      time: `${formData.timeSlot!.time} ${formData.timeSlot!.period}`,
      zoomLink: {
        meetingId: zoom.meetingId,
        joinUrl: zoom.joinUrl,
        password: zoom.password,
        startTime: `${formData.date!.toISOString()}`,
      },
      whatsappNotified: false,
    };

    setConfirmation(confirm);
    setStep("confirm");
    setIsSubmitting(false);

    // Open WhatsApp for admin notification
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/whatsapp/lead`);
    if (response) {
      alert("Lead generated successfully");
    }
  };

  const resetBooking = () => {
    setStep("course");
    setSelectedCourse(null);
    setFormData({ name: "", email: "", phone: "", date: null, timeSlot: null, courseId: "", notes: "" });
    setErrors({});
    setConfirmation(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30">
      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-md">
              L
            </div>
            <span className="font-extrabold text-slate-800 text-lg tracking-tight">
              Learn<span className="text-indigo-500">Pro</span>
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            Live Demo Booking Open
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {step !== "confirm" && (
          <>
            {/* Hero */}
            <div className="text-center mb-10">
              <span className="inline-block bg-indigo-50 text-indigo-600 text-xs font-bold px-4 py-1.5 rounded-full border border-indigo-100 mb-4 uppercase tracking-wider">
                Free Demo Session
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-3 leading-tight">
                Book Your Free <span className="text-indigo-500">Demo Class</span>
              </h1>
              <p className="text-slate-500 text-base max-w-xl mx-auto">
                Try before you buy. Book a 1-hour free demo with our expert instructors and see if the course is right for you.
              </p>
            </div>

            {/* Step Indicator */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-8">
              <StepIndicator currentStep={step} />
            </div>
          </>
        )}

        {/* STEP 1 — Choose Course */}
        {step === "course" && (
          <div>
            <h2 className="text-xl font-bold text-slate-700 mb-5">
              1. Choose a Course to Demo
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              {COURSES.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  isSelected={selectedCourse?.id === course.id}
                  onSelect={handleCourseSelect}
                  onEnroll={(c) => setEnrollCourse(c)}
                />
              ))}
            </div>
            <div className="flex justify-end">
              <button
                onClick={goToCalendar}
                disabled={!selectedCourse}
                className="flex items-center gap-2.5 px-8 py-3.5 rounded-xl text-sm font-bold bg-indigo-500 text-white hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-200 hover:shadow-indigo-300"
              >
                Continue to Schedule
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 — Calendar & Time */}
        {step === "calendar" && (
          <div>
            <h2 className="text-xl font-bold text-slate-700 mb-5">
              2. Pick Your Date & Time
            </h2>

            {/* Selected course banner */}
            <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3 mb-6">
              <span className="text-2xl">{selectedCourse?.thumbnail}</span>
              <div>
                <p className="text-xs text-indigo-400 font-medium">Selected Course</p>
                <p className="text-sm font-bold text-indigo-700">{selectedCourse?.title}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Calendar */}
              <div>
                <p className="text-sm font-semibold text-slate-600 mb-3 flex items-center gap-2">
                  <span>📅</span> Select Date
                </p>
                <Calendar
                  selectedDate={formData.date}
                  onDateSelect={handleDateSelect}
                />
              </div>

              {/* Time Slots */}
              <div>
                <p className="text-sm font-semibold text-slate-600 mb-3 flex items-center gap-2">
                  <span>⏰</span> Select Time
                  {formData.date && (
                    <span className="text-xs text-slate-400 font-normal">
                      — {formData.date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
                    </span>
                  )}
                </p>
                {formData.date ? (
                  <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                    <TimeSlotPicker
                      slots={timeSlots}
                      selected={formData.timeSlot}
                      onSelect={handleTimeSelect}
                    />
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm flex flex-col items-center justify-center text-center h-48">
                    <span className="text-4xl mb-3">👈</span>
                    <p className="text-sm text-slate-400">Please select a date first</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setStep("course")}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-slate-600 border-2 border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
              <button
                onClick={goToDetails}
                disabled={!formData.date || !formData.timeSlot}
                className="flex items-center gap-2.5 px-8 py-3.5 rounded-xl text-sm font-bold bg-indigo-500 text-white hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-200"
              >
                Continue
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 — Student Details */}
        {step === "details" && (
          <div>
            <h2 className="text-xl font-bold text-slate-700 mb-5">
              3. Your Details
            </h2>

            {/* Booking Summary */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-6">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Booking Summary</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{selectedCourse?.thumbnail}</span>
                  <div>
                    <p className="text-xs text-slate-400">Course</p>
                    <p className="text-sm font-semibold text-slate-700 line-clamp-1">{selectedCourse?.title}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">📅</span>
                  <div>
                    <p className="text-xs text-slate-400">Date</p>
                    <p className="text-sm font-semibold text-slate-700">
                      {formData.date?.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">⏰</span>
                  <div>
                    <p className="text-xs text-slate-400">Time</p>
                    <p className="text-sm font-semibold text-slate-700">
                      {formData.timeSlot?.time} {formData.timeSlot?.period}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-8">
              <StudentForm
                data={formData}
                onChange={handleFieldChange}
                errors={errors}
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setStep("calendar")}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-slate-600 border-2 border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2.5 px-8 py-3.5 rounded-xl text-sm font-bold bg-indigo-500 text-white hover:bg-indigo-600 disabled:opacity-70 transition-all shadow-lg shadow-indigo-200 min-w-[180px] justify-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Generating Zoom Link...
                  </>
                ) : (
                  <>
                    Confirm Booking
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4 — Confirmation */}
        {step === "confirm" && confirmation && (
          <div className="py-4">
            <ConfirmationCard
              confirmation={confirmation}
              onNewBooking={resetBooking}
            />
          </div>
        )}
      </div>

      {/* Enroll Modal */}
      <EnrollModal
        course={enrollCourse}
        onClose={() => setEnrollCourse(null)}
      />
    </div>
  );
}