/**
 * Onboarding Submit Logic for Firestore Seeding
 * This code demonstrates how to take the onboarding data (data) and the
 * static roadmap (MASTER_ROADMAPS) and create a personalized user document.
 */
import { OnboardingSchema } from "@/schema/schemas";
import { LearningPathKey } from "@/types/types";
import {
  getFirestore,
  doc,
  setDoc,
  Firestore,
} from "firebase/firestore";
import { calculateAdjustedDuration } from "./calculate-adjusted-durations";
import { toast } from "sonner";
import { MASTER_ROADMAPS } from "@/lib/master-roadmap";

// --- Main Integration Function ---

// NOTE: This function would be asynchronous and called after a successful form submit.
// It assumes the user is already authenticated (e.g., via Clerk and __initial_auth_token).

export async function handleOnboardingSubmitIntegration(
  data: OnboardingSchema,
  db: Firestore = getFirestore(), // Firebase Firestore instance
  userId: string // Current Clerk user ID
): Promise<void> {
  const selectedPath = data.learningPath as LearningPathKey; // Narrowing type for lookup
  const masterRoadmap = MASTER_ROADMAPS[selectedPath];

  if (!masterRoadmap) {
    console.error(
      "Error: Master roadmap not found for path:",
      data.learningPath
    );
    return;
  }

  // 1. Create the personalized, mutable plan
  const initialUserPlan = masterRoadmap.phases.map((phase) => {
    const adjustedWeeks = calculateAdjustedDuration(
      phase.duration_weeks,
      data.availableTime
    );
    const estimatedEndDate = new Date();
    estimatedEndDate.setDate(
      estimatedEndDate.getDate() + adjustedWeeks * 7
    );

    return {
      ...phase,
      // Add status tracking for the user
      status:
        phase.id === masterRoadmap.phases[0].id
          ? "active"
          : "not-started",
      completed_at: null,
      estimated_weeks: adjustedWeeks,
      estimated_end_date: estimatedEndDate.toISOString(), // Store as string
      progress_percent: 0,

      // Add task tracking to modules and tasks
      modules: phase.modules.map((module) => ({
        ...module,
        module_status: "not-started",
        tasks: module.tasks.map((task) => ({
          ...task,
          task_status: "not-started",
          completed_on: null,
        })),
      })),
    };
  });

  // 2. Store the personalized plan in Firestore
  // Path: users/{userId}/userRoadmap/current
  try {
    const roadmapRef = doc(
      db,
      "users",
      userId,
      "userRoadmap",
      "current"
    );

    await setDoc(roadmapRef, {
      planTitle: masterRoadmap.title,
      careerGoal: data.careerGoal,
      learningPath: data.learningPath,
      last_updated: new Date().toISOString(),
      currentPhaseId: masterRoadmap.phases[0].id,
      totalPhases: masterRoadmap.phases.length,
      roadmap: initialUserPlan, // The array of phases
    });

    // 3. Update the main user document to mark onboarding complete
    const userRef = doc(db, "users", userId);
    await setDoc(
      userRef,
      {
        onboardingComplete: true,
        fullName: data.fullName,
        age: data.age,
        educationLevel: data.educationLevel, // Default for z.enum()
        availableTime: data.availableTime,
      },
      { merge: true }
    );

    console.log(
      `Personalized roadmap created successfully for user ${userId}`
    );
    toast.success(
      "Personalized roadmap created successfully for you"
    );
  } catch (error) {
    console.error(
      "FIREBASE ERROR: Failed to seed user roadmap:",
      error
    );
    toast.error("Failed to seed user roadmap");

    throw new Error("Database update failed.");
  }
}
