import z from "zod";

export const onboardingSchema = z.object({
  fullName: z.string().nonempty("Full name is required").max(100),

  // FIX: Coerce string input to a number and add better bounds checks
  age: z.coerce
    .number()
    .min(1, "Age must be at least 1")
    .max(120, "Age seems too high")
    .refine((val) => !isNaN(val), {
      message: "Age must be a valid number",
    }),

  educationLevel: z
    .string()
    .nonempty("Please select your education level") // 👈 Added
    .pipe(
      z.enum([
        "high-school",
        "undergraduate",
        "graduate",
        "professional",
      ])
    ),

  learningPath: z
    .string()
    .nonempty("Please select a learning path") // 👈 Added
    .pipe(
      z.enum([
        "technology",
        "communication",
        "business",
        "creative",
        "personal-dev",
      ])
    ),

  availableTime: z
    .string()
    .nonempty("Please select your available time") // 👈 Added
    .pipe(z.enum(["15-30", "30-60", "60-120", "120-plus"])),
    
  careerGoal: z
    .string()
    .min(
      10,
      "Please describe your career goal (at least 10 characters)"
    )
    .max(300),
});
export type OnboardingSchema = z.infer<typeof onboardingSchema>;
