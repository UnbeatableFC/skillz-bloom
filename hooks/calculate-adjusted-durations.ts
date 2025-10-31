import { OnboardingSchema } from "@/schema/schemas";

/**
 * Adjusts duration based on user's available time.
 * Logic: Less time available extends the duration. More time shortens it.
 */

export function calculateAdjustedDuration(
  originalWeeks: number,
  availableTime: OnboardingSchema["availableTime"]
): number {
  switch (availableTime) {
    case "15-30":
      return originalWeeks * 1.5; // Extend 50%
    case "120-plus":
      return Math.ceil(originalWeeks * 0.75); // Shorten 25%
    default:
      return originalWeeks; // Default for average time
  }
}
