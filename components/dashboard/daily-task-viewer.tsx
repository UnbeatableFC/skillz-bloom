"use client";

import React, { useState, useEffect } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { LearningPathKey, MasterRoadmap, Task } from "@/types/types";
import { db } from "@/lib/firebase";
import { toast } from "sonner";
import { Loader2, Zap } from "lucide-react";
import DailyTaskCard from "./daily-task-card";

// --- CORE COMPONENT ---

const DailyTaskViewer = () => {
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
  const [error, setError] = useState<string | null>(null);
  const [dailyTasks, setDailyTasks] = useState<Task[]>([]);
  const [hoursPerTask, setHoursPerTask] = useState<number | null>(
    null
  ); // ADD THIS
  const [completingTask, setCompletingTask] = useState<string | null>(
    null
  );

  const userId = user?.id;

  // 1. LOGIC TO IDENTIFY CURRENT TASKS
  const extractDailyTasks = (data: MasterRoadmap) => {
    // Check for phases in either data.phases or data.roadmap
    const phases = data.roadmap ?? data.phases ?? [];

    if (!data || phases.length === 0) {
      setDailyTasks([]);
      setHoursPerTask(null); // RESET
      return;
    }

    // Find the active phase
    const currentPhase = phases.find((p) => p.status === "active");

    if (!currentPhase) {
      setDailyTasks([]);
      setHoursPerTask(null); // RESET
      return;
    }

    // Find the first module that is not yet completed
    const currentModule = currentPhase?.modules?.find(
      (m) => m.module_status !== "completed"
    );

    if (!currentModule) {
      setDailyTasks([]);
      setHoursPerTask(null); // RESET
      return;
    }

    // Get the top 3 pending tasks from the current module
    const tasksForToday = currentModule.tasks
      .filter((t) => t.task_status === "not-started")
      .slice(0, 3); // Limit tasks to avoid overwhelming the user

    // Calculate hours per task
    const totalTasks = currentModule.tasks.length;
    const estimatedHoursPerTask =
      totalTasks > 0
        ? Number(
            (currentModule.estimated_hours / totalTasks).toFixed(1)
          )
        : null;

    setDailyTasks(tasksForToday);
    setHoursPerTask(estimatedHoursPerTask);
  };

  // 2. REAL-TIME DATA SUBSCRIPTION
  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn || !userId) {
      setError("Please sign in to view your tasks.");
      setIsLoading(false);
      return;
    }

    if (typeof db === "undefined") {
      setError("Database connection failed.");
      setIsLoading(false);
      return;
    }

    const roadmapRef = doc(
      db,
      "users",
      userId,
      "userRoadmap",
      "current"
    );

    const unsubscribe = onSnapshot(
      roadmapRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as MasterRoadmap & {
            careerGoal?: string;
            learningPath?: LearningPathKey;
          };
          setRoadmapData(data);
          extractDailyTasks(data);
          setError(null);
          setIsLoading(false);
        } else {
          setError(
            "No personalized roadmap found. Please complete onboarding."
          );
          setRoadmapData(null);
          setDailyTasks([]);
          setHoursPerTask(null);
          setIsLoading(false);
        }
      },
      (err) => {
        console.error("Firestore error:", err);
        setError("Failed to fetch roadmap data.");
        setIsLoading(false);
      }
    );

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, [userId, isLoaded, isSignedIn]);

  // 3. TASK COMPLETION HANDLER (Updates Firestore)
  const handleTaskComplete = async (taskName: string) => {
    if (!roadmapData || !userId || typeof db === "undefined") return;

    setCompletingTask(taskName);

    try {
      // Clone the current roadmap to modify it
      const newRoadmapData: MasterRoadmap = JSON.parse(
        JSON.stringify(roadmapData)
      );

      const phases =
        newRoadmapData.roadmap ?? newRoadmapData.phases ?? [];
      let taskFound = false;

      // Find and update the specific task within the roadmap structure
      for (const phase of phases) {
        if (phase.status === "active") {
          for (const mod of phase.modules) {
            const task = mod.tasks.find(
              (t) =>
                t.name === taskName && t.task_status === "not-started"
            );
            if (task) {
              task.task_status = "completed";
              task.completed_on = new Date().toISOString();
              taskFound = true;
              break;
            }
          }
        }
        if (taskFound) break;
      }

      if (taskFound) {
        const roadmapRef = doc(
          db,
          "users",
          userId,
          "userRoadmap",
          "current"
        );

        await setDoc(roadmapRef, newRoadmapData);
        toast.success(
          `Task completed: ${taskName}! Keep the streak going!`
        );

        // Re-extract tasks immediately to update the list
        extractDailyTasks(newRoadmapData);
      } else {
        toast.error("Task not found or already completed.");
      }
    } catch (err) {
      console.error("Failed to update task status:", err);
      toast.error("Failed to save progress. Check your connection.");
    } finally {
      setCompletingTask(null);
    }
  };

  // 4. NAVIGATE TO SPECIFIC TASK PAGE
  const handleViewTask = (taskName: string) => {
    // Navigate to tasks page with the task name as query parameter
    // This allows the tasks page to highlight or scroll to this specific task
    router.push(`/tasks?activeTask=${encodeURIComponent(taskName)}`);
  };

  // --- RENDER LOGIC ---

  if (!isLoaded || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mr-3" />
        <span className="text-lg font-medium text-gray-700">
          Loading your personalized plan...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-red-50 border-t-4 border-red-500 rounded-b sm:px-6 sm:py-8">
        <Zap className="w-12 h-12 text-red-600 mb-4" />
        <h2 className="text-2xl font-bold text-red-800 mb-2">
          Error Loading Tasks
        </h2>
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (!roadmapData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-gray-50">
        <Zap className="w-12 h-12 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          No Roadmap Found
        </h2>
        <p className="text-gray-600">
          Please complete your onboarding to get started.
        </p>
      </div>
    );
  }

  const allPhases = roadmapData.roadmap ?? roadmapData.phases ?? [];
  const activePhase = allPhases.find((p) => p.status === "active");
  const activeModule = activePhase?.modules?.find(
    (m) => m.module_status !== "completed"
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3">
            Today&apos;s Launchpad Tasks
          </h1>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-lg text-gray-600">
                <span className="font-semibold">
                  {activePhase?.title}
                </span>
              </p>
              {activeModule && (
                <p className="text-base text-indigo-600 font-medium mt-1">
                  Focus: {activeModule.name}
                </p>
              )}
            </div>
            {roadmapData?.careerGoal && (
              <div className="inline-block px-4 py-2 text-sm font-semibold text-indigo-800 bg-indigo-100 rounded-full">
                🎯 Goal: {roadmapData.careerGoal}
              </div>
            )}
          </div>
        </header>

        {dailyTasks.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {dailyTasks.map((task) => (
              <DailyTaskCard
                key={task.name}
                task={task}
                onComplete={handleTaskComplete}
                isCompleting={completingTask === task.name}
                estimatedHours={hoursPerTask ?? undefined}
                onTaskClick={() => handleViewTask(task.name)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center p-16 bg-linear-to-br from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-200">
            <div className="inline-block p-4 bg-indigo-100 rounded-full mb-6">
              <svg
                className="w-8 h-8 text-indigo-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-indigo-900 mb-2">
              All caught up! 🎉
            </h3>
            <p className="text-lg text-indigo-700">
              You&apos;ve completed all your daily tasks. Check out
              the
              <span className="font-semibold">
                {" "}
                Learning Roadmap
              </span>{" "}
              for what&apos;s next, or talk to your{" "}
              <span className="font-semibold">
                AI Learning Coach
              </span>{" "}
              for bonus challenges!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyTaskViewer;
