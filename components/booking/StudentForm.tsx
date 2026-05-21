"use client";

import { BookingFormData } from "@/app/types/bookings";


interface StudentFormProps {
  data: BookingFormData;
  onChange: (field: keyof BookingFormData, value: string) => void;
  errors: Partial<Record<keyof BookingFormData, string>>;
}

interface InputProps {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  error?: string;
  required?: boolean;
  icon: string;
}

function FormInput({ label, id, type = "text", value, onChange, placeholder, error, required, icon }: InputProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-slate-700 mb-1.5">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base pointer-events-none">
          {icon}
        </span>
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-200 bg-white
            ${error
              ? "border-rose-300 focus:border-rose-400 bg-rose-50"
              : "border-slate-200 focus:border-indigo-400 focus:bg-white"
            }`}
        />
      </div>
      {error && (
        <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

export default function StudentForm({ data, onChange, errors }: StudentFormProps) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormInput
          label="Full Name"
          id="name"
          value={data.name}
          onChange={(v) => onChange("name", v)}
          placeholder="Arjun Kumar"
          error={errors.name}
          required
          icon="👤"
        />
        <FormInput
          label="Email Address"
          id="email"
          type="email"
          value={data.email}
          onChange={(v) => onChange("email", v)}
          placeholder="arjun@example.com"
          error={errors.email}
          required
          icon="✉️"
        />
      </div>

      <FormInput
        label="WhatsApp / Phone Number"
        id="phone"
        type="tel"
        value={data.phone}
        onChange={(v) => onChange("phone", v)}
        placeholder="+91 98765 43210"
        error={errors.phone}
        required
        icon="📱"
      />

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-semibold text-slate-700 mb-1.5">
          Additional Notes <span className="text-slate-400 font-normal">(optional)</span>
        </label>
        <div className="relative">
          <span className="absolute left-3.5 top-3.5 text-base pointer-events-none">💬</span>
          <textarea
            id="notes"
            value={data.notes}
            onChange={(e) => onChange("notes", e.target.value)}
            placeholder="Any specific topics you'd like to cover in the demo? Questions about the course?"
            rows={3}
            className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-indigo-400 resize-none"
          />
        </div>
      </div>

      {/* Privacy Note */}
      <div className="flex items-start gap-3 bg-indigo-50 rounded-xl p-4 border border-indigo-100">
        <span className="text-xl mt-0.5">🔒</span>
        <p className="text-xs text-indigo-700 leading-relaxed">
          Your details are safe with us. We&apos;ll only use them to send your Zoom link and booking confirmation.
          No spam — we promise.
        </p>
      </div>
    </div>
  );
}