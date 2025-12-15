"use client";

import { useEffect, useState } from "react";

import {
  doc,
  onSnapshot,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { useUser } from "@clerk/nextjs";
import {
  BookOpen,
  CheckCircle,
  Loader2,
  Target,
  Zap,
} from "lucide-react";
import RoadmapPhaseCard from "./road-map-card";
import { db } from "@/lib/firebase";
import {
  LearningPathKey,
  MasterRoadmap,
  RoadmapPhase,
} from "@/types/types";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import Link from "next/link";
import Analytics from "./analytics";

// --- Component ---
const RoadMapViewer = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  const [roadmapData, setRoadmapData] = useState<
    | (MasterRoadmap & {
        careerGoal?: string;
        learningPath?: LearningPathKey;
      })
    | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // --- Fetch Personalized Roadmap (Real-time) ---
  useEffect(() => {
    if (!isLoaded) return; // Wait for Clerk user to load
    if (!isSignedIn || !user?.id) {
      return;
    }
    const roadmapPath = doc(
      db,
      "users",
      user.id,
      "userRoadmap",
      "current"
    );

    const extraDataDocRef = doc(
      db,
      "users",
      user.id,
      "userRoadmap",
      "current"
    );

    const unsubscribe = onSnapshot(
      roadmapPath,
      async (docSnap) => {
        if (docSnap.exists()) {
          try {
            // Fetch careerGoal and learningPath from an assumed separate document or fields
            const extraDocSnap = await getDoc(extraDataDocRef);
            const extraData = extraDocSnap.exists()
              ? extraDocSnap.data()
              : {};

            // Combine roadmap data with additional fields
            const combinedData = {
              ...docSnap.data(),
              careerGoal: extraData.careerGoal ?? null,
              learningPath: extraData.learningPath ?? null,
            } as MasterRoadmap & {
              careerGoal?: string;
              learningPath?: LearningPathKey;
            };

            setRoadmapData(combinedData);
            setError("");
          } catch (error) {
            console.error("Error fetching extra data:", error);
            setError("Failed to load additional user data.");
          }
        } else {
          setRoadmapData(null);
          setError(
            "No roadmap found. Please complete the onboarding process first."
          );
        }
        setIsLoading(false);
      },
      (err) => {
        console.error("Firestore Snapshot Error:", err);
        setError("Could not load your roadmap data.");
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, isLoaded, isSignedIn]);

  // --- Helper function to navigate to specific task ---
  const handleViewDailyTasks = () => {
    // Get the first incomplete task from the active phase
    const allPhases =
      roadmapData?.roadmap ?? roadmapData?.phases ?? [];
    const activePhase = allPhases.find((p) => p.status === "active");
    const completedPhase = allPhases.find(
      (p) => p.status === "completed"
    );

    if (activePhase) {
      const activeModule = activePhase.modules.find(
        (m) => m.module_status !== "completed"
      );

      if (activeModule && activeModule.tasks.length > 0) {
        const firstTask = activeModule.tasks.find(
          (t) => t.task_status === "not-started"
        );

        if (firstTask) {
          router.push(
            `/tasks?activeTask=${encodeURIComponent(firstTask.name)}`
          );
        } else {
          router.push("/tasks");
        }
      } else {
        router.push("/tasks");
      }
    }

    if (completedPhase) {
      router.push("/dashboard/history");
    }
  };

  // --- Helper function to complete to specific phase ---
  const handleCompletePhase = async (
    completedPhase: RoadmapPhase
  ) => {
    const userId = user?.id;
    if (!db || !userId || !roadmapData || !setRoadmapData) return;

    // NOTE: This line is okay, but we'll use roadmapData.phases directly below
    // to keep the code cleaner, assuming roadmapData.phases is the primary array.
    const phases = roadmapData.roadmap || roadmapData.phases || [];
    // const currentPhases = roadmapData.phases || [];

    const currentPhaseIndex = phases.findIndex(
      (p) => p.id === completedPhase.id
    );

    if (currentPhaseIndex === -1) {
      console.error("Phase not found.");
      return;
    }

    // --- IMMUTABLE STATE UPDATE ---

    // 1. Create a copy of the phases array to modify
    const updatedPhases = [...phases];

    // 2. Mark the CURRENT phase as completed (IMMUTABLY)
    const completedPhaseUpdate = {
      ...updatedPhases[currentPhaseIndex], // Copy the existing phase
      status: "completed", // Set the new status
    } as RoadmapPhase;
    updatedPhases[currentPhaseIndex] = completedPhaseUpdate;

    // 3. Mark the NEXT phase as active (IMMUTABLY)
    const nextPhaseIndex = currentPhaseIndex + 1;
    let nextPhaseTitle = null; // Variable for the console log

    if (nextPhaseIndex < updatedPhases.length) {
      // Create a copy of the next phase object
      const nextPhaseUpdate = {
        ...updatedPhases[nextPhaseIndex], // Copy the existing phase
        status: "active", // Set the new status
      } as RoadmapPhase;
      // Replace the phase object in the array copy
      updatedPhases[nextPhaseIndex] = nextPhaseUpdate;
      nextPhaseTitle = updatedPhases[nextPhaseIndex].title;

      console.log(
        `Phase ${completedPhase.title} completed. Advancing to ${nextPhaseTitle}.`
      );
    } else {
      console.log("Roadmap completed! Congratulations!");
    }

    // 4. Update the local React state ONCE with the full set of changes
    setRoadmapData({
      ...roadmapData, // Spread existing state properties
      phases: updatedPhases, // Use the fully updated phases array
    });

    // --- FIRESTORE/DB UPDATE ---

    // 5. Update Firestore using the final updated array
    const roadmapRef = doc(
      db,
      "users",
      userId,
      "userRoadmap",
      "current"
    );

    try {
      await updateDoc(roadmapRef, {
        // Send the *updatedPhases* array, which holds both changes
        roadmap: updatedPhases,
      });
    } catch (updateError) {
      console.error(
        "Failed to update roadmap for progression:",
        updateError
      );
      setError("Failed to save progress. Please check connection.");
    }
  };

  // --- Loading State ---
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mr-3" />
        <span className="text-lg font-medium text-gray-700">
          Loading your personalized roadmap...
        </span>
      </div>
    );
  }

  // --- Error State ---
  if (error || !roadmapData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-red-50 border-t-4 border-red-500 rounded-b sm:px-6 sm:py-8">
        <Zap className="w-12 h-12 text-red-600 mb-4" />
        <h2 className="text-2xl font-bold text-red-800 mb-2">
          Roadmap Load Error
        </h2>
        <p className="text-red-700">
          {error ||
            "Data is missing. Please complete your onboarding process."}
        </p>
      </div>
    );
  }

  // --- Render Logic ---
  const { title, careerGoal, learningPath } = roadmapData;
  const phases: RoadmapPhase[] =
    roadmapData.roadmap ?? roadmapData.phases ?? [];

  return (
    <div className="min-h-screen font-sans px-4 sm:px-8 pt-8 pb-12 bg-gray-50">
      <header className="mb-10 p-6 bg-white rounded-xl shadow-lg border-b-4 border-indigo-600">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
              <span className="text-indigo-600">
                {learningPath
                  ? learningPath.charAt(0).toUpperCase() +
                    learningPath.slice(1)
                  : "N/A"}
              </span>{" "}
              Roadmap
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Target Goal:{" "}
              <span className="font-semibold text-gray-800">
                {careerGoal}
              </span>
              &nbsp;|&nbsp; Path:{" "}
              {learningPath
                ? learningPath.charAt(0).toUpperCase() +
                  learningPath.slice(1)
                : ""}
            </p>
          </div>
          <Link href={"/dashboard/ai-coach"}>
            <Button className="flex items-center">
              <Zap className="w-4 h-4 mr-2" /> Chat With Coach
            </Button>
          </Link>
        </div>
      </header>

      {/* Analytics and Progress Summary */}
      <Analytics phases={phases} />

      {/* Roadmap Phases Grid */}
      <div className="flex justify-between items-center mb-6">
        <div>
          {" "}
          <h2 className="text-2xl font-bold text-gray-800  flex items-center">
            <Target className="w-6 h-6 mr-2 text-indigo-600" />
            Learning Phases
          </h2>
        </div>
        <div>
          <Link href={"/dashboard/history"}>
            <Button>View Completed Phases</Button>
          </Link>
        </div>
      </div>
      <div className="grid gap-8 lg:grid-cols-3 md:grid-cols-2">
        {phases.map((phase: RoadmapPhase) => (
          <RoadmapPhaseCard
            key={phase.id}
            phase={phase}
            isCurrent={phase.status === "active"}
            isCompleted={phase.status === "completed"}
            isNotStarted={phase.status === "not-started"}
            viewDailyTask={handleViewDailyTasks}
            handleCompletePhase={handleCompletePhase}
          />
        ))}
      </div>

      <footer className="mt-12 text-center text-sm text-gray-500">
        <p>
          This roadmap is adaptive. Progress tracked here will
          automatically adjust the active phase/module. Click
          &ldquo;Finalize Phase & Advance&ldquo; to move to the next
          stage once all modules are complete.
        </p>
      </footer>
    </div>
  );
};

export default RoadMapViewer;
