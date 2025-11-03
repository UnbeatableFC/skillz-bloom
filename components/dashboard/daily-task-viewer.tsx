"use client"

import React, { useState, useEffect } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { useUser } from "@clerk/nextjs";
import { LearningPathKey, MasterRoadmap, Task } from "@/types/types";
import { db } from "@/lib/firebase";
import { toast } from "sonner";


// --- CORE COMPONENT ---

const DailyTaskViewer = () => {
  const { user, isLoaded, isSignedIn } = useUser();

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

  const userId = user?.id;

   // 1. LOGIC TO IDENTIFY CURRENT TASKS
  const extractDailyTasks = (data: MasterRoadmap) => {
    if (!data || !data.phases) {
      setDailyTasks([]);
      return;
    }

    const currentPhase = data.phases.find(
      (p) => p.status === "active"
    );

    if (!currentPhase) {
      setDailyTasks([]);
      return;
    }

    // Find the first module that is not yet completed
    const currentModule = currentPhase.modules.find(
      (m) => m.module_status !== "completed"
    );

    if (!currentModule) {
      // Logic to advance phase would go here
      setDailyTasks([]);
      return;
    }

    // Get the top 3 pending tasks from the current module
    const tasksForToday = currentModule.tasks
      .filter((t) => t.task_status === "not-started")
      .slice(0, 3); // Limit tasks to avoid overwhelming the user

    setDailyTasks(tasksForToday);
  };

  // 2. REAL-TIME DATA SUBSCRIPTION
  useEffect(() => {
    if (!userId || typeof db === "undefined") {
      if (isLoaded)
      return;
    }

    const roadmapRef = doc(
      db,
      "users",
      userId!,
      "userRoadmap",
      "current"
    );

    const unsubscribe = onSnapshot(
      roadmapRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as MasterRoadmap;
          setRoadmapData(data);
          extractDailyTasks(data);
          setIsLoading(false);
        } else {
          setError(
            "No personalized roadmap found. Please complete onboarding."
          );
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
  }, [userId, isLoaded]);

 

  // 3. TASK COMPLETION HANDLER (Updates Firestore)
  const handleTaskComplete = async (taskName: string) => {
    if (!roadmapData || !userId || typeof db === "undefined") return;

    // Clone the current roadmap to modify it
    const newRoadmapData: MasterRoadmap = JSON.parse(
      JSON.stringify(roadmapData)
    );
    let taskFound = false;

    // Find and update the specific task within the roadmap structure
    for (const phase of newRoadmapData.phases) {
      if (phase.status === "active") {
        for (const mod of phase.modules) {
          const task = mod.tasks.find(
            (t) => t.name === taskName && t.task_status === "not-started"
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
      try {
        const roadmapRef = doc(
          db,
          "users",
          userId,
          "userRoadmap",
          "current"
        );

        // Note: We are replacing the entire roadmap document with the updated data.
        // In a production app, you might use arrayUnion/arrayRemove for smaller updates.
        await setDoc(roadmapRef, newRoadmapData);
        toast.success(
          `Task completed: ${taskName}! Keep the streak going!`
        );
        // Re-extract tasks immediately to update the list
        extractDailyTasks(newRoadmapData);
      } catch (err) {
        console.error("Failed to update task status:", err);
        toast.error(
          "Failed to save progress. Check your connection."
        );
      }
    }
  };

  // --- RENDER LOGIC ---

  if (!isLoaded || isLoading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading your personalized plan...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600 bg-red-100 rounded-xl m-4">
        Error: {error}
      </div>
    );
  }

  const activePhase = roadmapData?.phases?.find(
    (p) => p.status === "active"
  );
  const activeModule = activePhase?.modules.find(
    (m) => m.module_status !== "completed"
  );

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-slate-700">
          Today&apos;s Launchpad Tasks
        </h1>
        <p className="text-gray-500 mt-2">
          {roadmapData?.title}: **{activePhase?.title}**
          <span className="ml-4 px-3 py-1 text-xs font-semibold text-indigo-800 bg-indigo-100 rounded-full">
            Goal: {roadmapData?.careerGoal}
          </span>
        </p>

        {activeModule && (
          <p className="mt-4 text-lg font-semibold text-gray-700">
            Current Focus: {activeModule.name}
          </p>
        )}
      </header>

      {dailyTasks.length > 0 ? (
        <div className="space-y-4">
          {dailyTasks.map((task) => (
            <div
              key={task.name}
              className="flex items-center justify-between bg-white p-5 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition duration-200"
            >
              <div className="flex items-center space-x-4">
                <svg
                  className="w-6 h-6 text-indigo-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  ></path>
                </svg>
                <span className="text-lg font-medium text-gray-800">
                  {task.name}
                </span>
              </div>
              <button
                onClick={() => handleTaskComplete(task.name)}
                className="px-4 py-2 bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-600 transition duration-150 transform hover:scale-105"
              >
                Complete
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-12 bg-gray-100 rounded-xl">
          <h3 className="text-xl font-semibold text-gray-700">
            All caught up! 🎉
          </h3>
          <p className="text-gray-500 mt-2">
            You&apos;ve completed your current daily tasks. Check out the
            **Learning Roadmap** for what&apos;s next, or talk to your **AI
            Learning Coach** for bonus challenges!
          </p>
        </div>
      )}
    </div>
  );
};

export default DailyTaskViewer;
