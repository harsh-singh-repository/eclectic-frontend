import { AxiosError } from "axios";
import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function handleAxiosError(error: unknown, action: string = "operation") {
  if (error instanceof AxiosError) {
    const errorMessage =
      error.response?.data?.message || "An unexpected error occurred.";
    toast.error(`Failed to ${action}: ${errorMessage}`);
  } else {
    toast.error("An unexpected error occurred.");
  }
}
