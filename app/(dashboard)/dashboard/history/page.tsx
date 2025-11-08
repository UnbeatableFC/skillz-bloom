"use client";

import { useState, useEffect } from "react";
import { Loader2, Award, Target, ArrowLeft } from "lucide-react";
import { RoadmapData, RoadmapPhase } from "@/types/types";

import { db } from "@/lib/firebase";
import { useUser } from "@clerk/nextjs";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CompletedPhaseCard } from "@/components/dashboard/history-phase-card";



// --- MAIN COMPONENT ---
const CompletedPhasesPage = () => {
  const { user } = useUser();
  const userId = user?.id;

  // Stub router
  const router = useRouter();

  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [completedPhases, setCompletedPhases] = useState<
    RoadmapPhase[]
  >([]);
  const [restartingItem, setRestartingItem] = useState<string | null>(
    null
  );

  // Real-time data subscription
  useEffect(() => {
    if (!userId || !db) return;

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
          const data = docSnap.data() as RoadmapData;
          setRoadmapData(data);

          // Extract completed phases
          const phases = data.roadmap ?? data.phases ?? [];
          const finished = phases.filter(
            (p) => p.status === "completed"
          );
          setCompletedPhases(finished);

          setError(null);
        } else {
          setError("No roadmap found. Please complete onboarding.");
          setRoadmapData(null);
          setCompletedPhases([]);
        }
        setIsLoading(false);
      },
      (err) => {
        console.error("Firestore error:", err);
        setError("Failed to fetch roadmap data.");
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  // Restart Phase Handler
  const handleRestartPhase = async (phaseIndex: number) => {
    if (!roadmapData || !userId || !db) return;

    setRestartingItem(`phase-${phaseIndex}`);

    try {
      const updatedData: RoadmapData = JSON.parse(
        JSON.stringify(roadmapData)
      );
      const phases = updatedData.roadmap ?? updatedData.phases ?? [];

      if (phaseIndex >= phases.length) {
        toast.error("Phase not found.");
        setRestartingItem(null);
        return;
      }

      const targetPhase = phases[phaseIndex];

      // Restart phase: set to active
      targetPhase.status = "active";

      // Restart all modules in the phase
      targetPhase.modules.forEach((module, idx) => {
        module.module_status = idx === 0 ? "active" : "not-started";
        // Restart all tasks
        module.tasks.forEach((task) => {
          task.task_status = "not-started";
          task.completed_on = null;
        });
      });

      // Set any phase after this one to not-started
      for (let i = phaseIndex + 1; i < phases.length; i++) {
        phases[i].status = "not-started";
        phases[i].modules.forEach((module) => {
          module.module_status = "not-started";
          module.tasks.forEach((task) => {
            task.task_status = "not-started";
            task.completed_on = null;
          });
        });
      }

      // Save to database
      const roadmapRef = doc(
        db,
        "users",
        userId,
        "userRoadmap",
        "current"
      );
      await setDoc(roadmapRef, updatedData);

      toast.success(
        `Phase "${targetPhase.title}" restarted successfully! 🚀`
      );
    } catch (err) {
      console.error("Failed to restart phase:", err);
      toast.error("Failed to restart phase. Check your connection.");
    } finally {
      setRestartingItem(null);
    }
  };

  // Restart Module Handler
  const handleRestartModule = async (
    phaseIndex: number,
    moduleIndex: number
  ) => {
    if (!roadmapData || !userId || !db) return;

    setRestartingItem(`module-${phaseIndex}-${moduleIndex}`);

    try {
      const updatedData: RoadmapData = JSON.parse(
        JSON.stringify(roadmapData)
      );
      const phases = updatedData.roadmap ?? updatedData.phases ?? [];

      if (phaseIndex >= phases.length) {
        toast.error("Phase not found.");
        setRestartingItem(null);
        return;
      }

      const targetPhase = phases[phaseIndex];

      if (moduleIndex >= targetPhase.modules.length) {
        toast.error("Module not found.");
        setRestartingItem(null);
        return;
      }

      const targetModule = targetPhase.modules[moduleIndex];

      // Restart module
      targetModule.module_status = "active";

      // Restart all tasks in the module
      targetModule.tasks.forEach((task) => {
        task.task_status = "not-started";
        task.completed_on = null;
      });

      // Set phase to active if it was completed
      if (targetPhase.status === "completed") {
        targetPhase.status = "active";
      }

      // Set modules after this one in the same phase to not-started
      for (
        let i = moduleIndex + 1;
        i < targetPhase.modules.length;
        i++
      ) {
        targetPhase.modules[i].module_status = "not-started";
        targetPhase.modules[i].tasks.forEach((task) => {
          task.task_status = "not-started";
          task.completed_on = null;
        });
      }

      // Set any phase after this one to not-started
      for (let i = phaseIndex + 1; i < phases.length; i++) {
        phases[i].status = "not-started";
        phases[i].modules.forEach((module) => {
          module.module_status = "not-started";
          module.tasks.forEach((task) => {
            task.task_status = "not-started";
            task.completed_on = null;
          });
        });
      }

      // Save to database
      const roadmapRef = doc(
        db,
        "users",
        userId,
        "userRoadmap",
        "current"
      );
      await setDoc(roadmapRef, updatedData);

      toast.success(
        `Module "${targetModule.name}" restarted successfully! 🔄`
      );
    } catch (err) {
      console.error("Failed to restart module:", err);
      toast.error("Failed to restart module. Check your connection.");
    } finally {
      setRestartingItem(null);
    }
  };

  // Restart Task Handler
const handleRestartTask = async (
  phaseIndex: number,
  moduleIndex: number,
  taskIndex: number
) => {
  if (!roadmapData || !userId || !db) return;

  setRestartingItem(`task-${phaseIndex}-${moduleIndex}-${taskIndex}`);

  try {
    const updatedData: RoadmapData = JSON.parse(JSON.stringify(roadmapData));
    const phases = updatedData.roadmap ?? updatedData.phases ?? [];

    if (phaseIndex >= phases.length) {
      toast.error("Phase not found.");
      setRestartingItem(null);
      return;
    }

    const targetPhase = phases[phaseIndex];

    if (moduleIndex >= targetPhase.modules.length) {
      toast.error("Module not found.");
      setRestartingItem(null);
      return;
    }

    const targetModule = targetPhase.modules[moduleIndex];

    if (taskIndex >= targetModule.tasks.length) {
      toast.error("Task not found.");
      setRestartingItem(null);
      return;
    }

    const targetTask = targetModule.tasks[taskIndex];

    // ✅ Restart the selected task
    targetTask.task_status = "not-started";
    targetTask.completed_on = null;

    // ✅ Iterate through all phases
    phases.forEach((phase, pIdx) => {
      if (pIdx < phaseIndex) {
        // 🟢 Phases before remain completed
        phase.status = "completed";
      } else if (pIdx === phaseIndex) {
        // 🟣 Target phase becomes in-progress
        phase.status = "active";

        phase.modules.forEach((module, mIdx) => {
          if (mIdx < moduleIndex) {
            // 🟢 Modules before remain completed
            module.module_status = "completed";
          } else if (mIdx === moduleIndex) {
            // 🚀 Target module becomes in-progress
            module.module_status = "active";

            // Reset all tasks inside the restarted module
            module.tasks.forEach((task, tIdx) => {
              task.task_status = "not-started";
              task.completed_on = null;
            });

            // 🚀 Automatically start the first task
            if (module.tasks.length > 0) {
              module.tasks[0].task_status = "active";
            }

            // 🧠 If the restarted task is the first task, mark it in-progress too
            if (taskIndex === 0) {
              targetTask.task_status = "not-started";
            }
          } else {
            // 🔘 Modules after become not-started
            module.module_status = "not-started";
            module.tasks.forEach((task) => {
              task.task_status = "not-started";
              task.completed_on = null;
            });
          }
        });
      } else {
        // 🔴 Phases after become not-started
        phase.status = "not-started";

        phase.modules.forEach((module) => {
          module.module_status = "not-started";
          module.tasks.forEach((task) => {
            task.task_status = "not-started";
            task.completed_on = null;
          });
        });
      }
    });

    // ✅ Save changes to Firestore
    const roadmapRef = doc(db, "users", userId, "userRoadmap", "current");
    await setDoc(roadmapRef, updatedData);

    toast.success(`Task "${targetTask.name}" restarted successfully! ✨`);
  } catch (err) {
    console.error("Failed to restart task:", err);
    toast.error("Failed to restart task. Check your connection.");
  } finally {
    setRestartingItem(null);
  }
};



  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mr-3" />
        <span className="text-lg font-medium text-gray-700">
          Loading completed phases...
        </span>
      </div>
    );
  }

  // Error state
  if (error || !roadmapData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-red-50">
        <Target className="w-12 h-12 text-red-600 mb-4" />
        <h2 className="text-2xl font-bold text-red-800 mb-2">
          Error
        </h2>
        <p className="text-red-700">
          {error ||
            "No roadmap data found. Please complete onboarding."}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => router.push("/dashboard")}
            className="mb-4 bg-gray-200 hover:bg-gray-300 text-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-green-500">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <Award className="w-10 h-10 text-green-600" />
              </div>
              <div>
                <h1 className="text-4xl font-extrabold text-gray-900">
                  Completed Phases History
                </h1>
                <p className="text-gray-600 mt-2">
                  Review your achievements and restart any phase,
                  module, or task
                </p>
              </div>
            </div>

            {roadmapData?.careerGoal && (
              <div className="mt-4 inline-block px-4 py-2 text-sm font-semibold text-indigo-800 bg-indigo-100 rounded-full">
                🎯 Goal: {roadmapData.careerGoal}
              </div>
            )}
          </div>
        </div>

        {/* Completed Phases List */}
        {completedPhases.length > 0 ? (
          <div className="space-y-6">
            {completedPhases.map((phase) => {
              // Find the actual index in the full roadmap
              const phases =
                roadmapData.roadmap ?? roadmapData.phases ?? [];
              const actualIndex = phases.findIndex(
                (p) => p.title === phase.title
              );

              return (
                <CompletedPhaseCard
                  key={actualIndex}
                  phase={phase}
                  phaseIndex={actualIndex}
                  onRestartPhase={handleRestartPhase}
                  onRestartModule={handleRestartModule}
                  onRestartTask={handleRestartTask}
                  isRestarting={restartingItem}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center p-16 bg-white rounded-2xl shadow-lg border-2 border-dashed border-gray-300">
            <div className="inline-block p-4 bg-gray-100 rounded-full mb-6">
              <Target className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              No Completed Phases Yet
            </h3>
            <p className="text-gray-500">
              Keep working on your current phase. Completed phases
              will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompletedPhasesPage;
