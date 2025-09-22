import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function triggerHapticFeedback() {
  if (navigator.vibrate) {
    navigator.vibrate(50); // 50ms for a gentle tap
  }
}
