import { BookingConfirmation } from "@/app/types/bookings";
import axios from "axios";

export interface WhatsAppConfig {
  adminPhone: string; // e.g. "919876543210" (country code + number)
  apiKey?: string; // Twilio / Meta Cloud API key
}

// --- Twilio WhatsApp (recommended for production) ---
export async function sendWhatsAppViaTwilio(
  booking: BookingConfirmation,
  config: WhatsAppConfig,
): Promise<boolean> {
  const message = buildAdminMessage(booking);

  try {
    const response = await fetch("/api/whatsapp/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: `whatsapp:+${config.adminPhone}`,
        body: message,
        provider: "twilio",
      }),
    });
    return response.ok;
  } catch {
    console.error("WhatsApp notification failed");
    return false;
  }
}

// --- Meta Cloud API (WhatsApp Business) ---
export async function sendWhatsAppViaMeta(
  booking: BookingConfirmation,
  config: WhatsAppConfig,
): Promise<boolean> {
  const message = buildAdminMessage(booking);

  try {
    const response = await fetch("/api/whatsapp/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: config.adminPhone,
        body: message,
        provider: "meta",
      }),
    });
    return response.ok;
  } catch {
    console.error("WhatsApp notification failed");
    return false;
  }
}

// --- wa.me deep link fallback (opens WhatsApp on admin's browser) ---
export function buildWhatsAppLink(
  booking: BookingConfirmation,
  adminPhone: string,
): string {
  const message = buildAdminMessage(booking);
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${adminPhone}?text=${encoded}`;
}

function buildAdminMessage(booking: BookingConfirmation): string {
  return `📚 *New Demo Booking Alert!*

👤 *Student:* ${booking.studentName}
📘 *Course:* ${booking.course.title}
📅 *Date:* ${booking.date}
⏰ *Time:* ${booking.time}

🔗 *Zoom Meeting:*
ID: ${booking.zoomLink.meetingId}
Link: ${booking.zoomLink.joinUrl}
Password: ${booking.zoomLink.password}

🆔 *Booking ID:* ${booking.bookingId}

Please be ready 5 minutes before the session. 🙏`;
}

export const sendLeadToWhatsApp = async (booking: BookingConfirmation) => {
  const message = buildAdminMessage(booking);

  const url = "https://graph.facebook.com/v19.0/1076557282212290/messages";

  await axios.post(
    url,
    {
      messaging_product: "whatsapp",
      to: "9534913630", // 👈 your number (admin)
      type: "text",
      text: {
        body: message,
      },
    },
    {
      headers: {
        Authorization: `Bearer EAAVdFserLLYBRbm25KAZAvvtjh2fBVZADTjmRxZBYCOqDhUTMk0B4B2KLaZAz5jmj00EF6JQ3pssmJLfGwhKxiA1L1zTGVO2cJZC0feX96SIpLpaXCqmke6mFDYjagPVfzVGvbUucogZA5tJNzbCYHgBu3O3yeWUoF33jxXnZBf5ZCuVRknzCEZAvA1QNPZCh3vL7BzZBzzYzC5mhncqftRktLSXzHHmYNxr21VfxhS`,
        "Content-Type": "application/json",
      },
    },
  );
};
