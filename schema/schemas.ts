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
    .pipe(z.enum(["high-school", "undergraduate", "graduate", "professional"])),

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
    .min(10, "Please describe your career goal (at least 10 characters)")
    .max(300),
});

export const manualSkillSchema = z.object({
  name: z
    .string()
    .min(2, "Skill name must be at least 2 characters")
    .max(100, "Skill name is too long"),
  description: z.string().max(300, "Description is too long").optional(),

  // --- ADD THESE NEW FIELDS ---
  evidenceLabel: z
    .string()
    .max(30, "Label is too long (e.g., GitHub, Portfolio)")
    .optional(),
  evidenceLink: z
    .string()
    .url("Please enter a valid URL (e.g., https://...)")
    .optional()
    .or(z.literal("")), // Allows the field to be empty
});

export type ManualSkillSchema = z.infer<typeof manualSkillSchema>;
export type OnboardingSchema = z.infer<typeof onboardingSchema>;
