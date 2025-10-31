"use client";

import { useEffect, useState } from "react";

import { doc, onSnapshot, getDoc } from "firebase/firestore";
import { useUser } from "@clerk/nextjs";
import { Loader2, Zap } from "lucide-react";
import RoadmapPhaseCard from "./road-map-card";
import { db } from "@/lib/firebase";
import { LearningPathKey, MasterRoadmap, RoadmapPhase } from "@/types/types";

// --- Component ---
const RoadMapViewer = () => {
  const { user, isLoaded, isSignedIn } = useUser();

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

  // --- Loading State ---
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
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
        <p className="text-red-700">;
          {error ||
            "Data is missing. Please complete your onboarding process."}
        </p>
      </div>
    );
  }

  // --- Render Logic ---
  const { title, careerGoal, learningPath, roadmap } = roadmapData;

  return (
    <div className="min-h-screen bg-gray-50 font-sans p-4 sm:p-8">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
          Your <span className="text-indigo-600">{title}</span>{" "}
          Roadmap
        </h1>
        <p className="mt-2 text-xl text-gray-600">
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
      </header>

      <div className="grid gap-8 lg:grid-cols-3 md:grid-cols-2">
        {roadmap.map((phase : RoadmapPhase) => (
          <RoadmapPhaseCard
            key={phase.id}
            phase={phase}
            isCurrent={phase.status === "active"}
            isCompleted={phase.status === "completed"}
          />
        ))}
      </div>

      <footer className="mt-12 text-center text-sm text-gray-500">
        <p>
          This roadmap is adaptive. Progress tracked here will
          automatically adjust tasks provided by your AI Learning
          Coach.
        </p>
      </footer>
    </div>
  );
};

export default RoadMapViewer;
