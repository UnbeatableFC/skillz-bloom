"use client";

import React, { useState, useEffect } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { RoadmapData, SkillModule, Task } from "@/types/types";
import { db } from "@/lib/firebase";
import { toast } from "sonner";
import { CheckCircle2, ListChecks, Loader2, Zap } from "lucide-react";

import { CompletedTaskCard } from "./completed-task-card";
import DailyTaskCard from "./daily-task-card";
import { CompletedModuleCard } from "./completed-module-card";

// --- CORE COMPONENT ---
const DailyTaskViewer = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dailyTasks, setDailyTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [hoursPerTask, setHoursPerTask] = useState<number | null>(
    null
  );
  const [startingTask, setStartingTask] = useState<string | null>(
    null
  );
  const [completingTask, setCompletingTask] = useState<string | null>(
    null
  );
  const [activeModule, setActiveModule] =
    useState<SkillModule | null>(null);
  const [completedModules, setCompletedModules] = useState<
    SkillModule[]
  >([]);
  const [restartingTask, setRestartingTask] = useState<string | null>(
    null
  );

  const userId = user?.id;

  // 1. LOGIC TO IDENTIFY CURRENT TASKS AND SEPARATE COMPLETED TASKS
  const extractTasks = (data: RoadmapData) => {
    const phases = data.roadmap ?? data.phases ?? [];

    if (phases.length === 0) {
      setDailyTasks([]);
      setCompletedTasks([]);
      setActiveModule(null);
      setHoursPerTask(null);
      setCompletedModules([]);
      return;
    }

    const currentPhase = phases.find((p) => p.status === "active");

    if (!currentPhase) {
      setDailyTasks([]);
      setCompletedTasks([]);
      setActiveModule(null);
      setHoursPerTask(null);
      setCompletedModules([]);
      return;
    }

    const finishedModules = currentPhase.modules.filter(
      (m) => m.module_status === "completed"
    );
    setCompletedModules(finishedModules);

    let currentModuleIndex = currentPhase.modules.findIndex(
      (m) => m.module_status === "active"
    );

    if (currentModuleIndex === -1) {
      currentModuleIndex = currentPhase.modules.findIndex(
        (m) => m.module_status === "not-started"
      );
    }

    if (currentModuleIndex === -1) {
      setDailyTasks([]);
      setCompletedTasks([]);
      setActiveModule(null);
      setHoursPerTask(null);
      return;
    }

    const currentModule = currentPhase.modules[currentModuleIndex];
    const allTasksInActiveModule = currentModule.tasks;

    // Show not-started and active tasks (limit to 3)
    const pendingTasksForToday = allTasksInActiveModule
      .filter(
        (t) =>
          t.task_status === "not-started" ||
          t.task_status === "active"
      )
      .slice(0, 3);

    const finishedTasks = allTasksInActiveModule.filter(
      (t) => t.task_status === "completed"
    );

    const totalTasks = allTasksInActiveModule.length;
    const estimatedHoursPerTask =
      totalTasks > 0
        ? Number(
            (currentModule.estimated_hours / totalTasks).toFixed(1)
          )
        : null;

    setDailyTasks(pendingTasksForToday);
    setCompletedTasks(finishedTasks);
    setActiveModule(currentModule);
    setHoursPerTask(estimatedHoursPerTask);
  };

  // 2. REAL-TIME DATA SUBSCRIPTION
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
          extractTasks(data);
          setError(null);
        } else {
          setError(
            "No personalized roadmap found. Please complete onboarding."
          );
          setRoadmapData(null);
          setDailyTasks([]);
          setCompletedTasks([]);
          setActiveModule(null);
          setHoursPerTask(null);
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

  // 3. START TASK HANDLER (NEW)
  const handleTaskStart = async (taskName: string) => {
    if (!roadmapData || !userId || !db) return;

    setStartingTask(taskName);

    try {
      const updatedData: RoadmapData = JSON.parse(
        JSON.stringify(roadmapData)
      );
      const phases = updatedData.roadmap ?? updatedData.phases ?? [];
      let taskFound = false;

      const activePhaseIndex = phases.findIndex(
        (p) => p.status === "active"
      );

      if (activePhaseIndex !== -1) {
        const activePhase = phases[activePhaseIndex];

        let currentModuleIndex = activePhase.modules.findIndex(
          (m) => m.module_status === "active"
        );

        if (currentModuleIndex === -1) {
          currentModuleIndex = activePhase.modules.findIndex(
            (m) => m.module_status === "not-started"
          );
        }

        if (currentModuleIndex !== -1) {
          const mod = activePhase.modules[currentModuleIndex];

          const taskIndex = mod.tasks.findIndex(
            (t) =>
              t.name === taskName && t.task_status === "not-started"
          );

          if (taskIndex !== -1) {
            // Mark task as active
            mod.tasks[taskIndex].task_status = "active";
            taskFound = true;
          }
        }
      }

      if (!taskFound) {
        toast.error("Task not found or already started.");
        setStartingTask(null);
        return;
      }

      const roadmapRef = doc(
        db,
        "users",
        userId,
        "userRoadmap",
        "current"
      );
      await setDoc(roadmapRef, updatedData);

      toast.success(`Task "${taskName}" started! 🚀`);
    } catch (err) {
      console.error("Failed to start task:", err);
      toast.error("Failed to start task. Check your connection.");
    } finally {
      setStartingTask(null);
    }
  };

  // 4. TASK COMPLETION HANDLER
  const handleTaskComplete = async (taskName: string) => {
    if (!roadmapData || !userId || !db) return;

    setCompletingTask(taskName);

    try {
      const firstUpdateData: RoadmapData = JSON.parse(
        JSON.stringify(roadmapData)
      );
      const phases =
        firstUpdateData.roadmap ?? firstUpdateData.phases ?? [];
      let taskFound = false;
      let needsModuleProgression = false;
      let completedModuleName = "";
      let currentModuleIndex = -1;
      let activePhaseIndex = -1;

      activePhaseIndex = phases.findIndex(
        (p) => p.status === "active"
      );

      if (activePhaseIndex !== -1) {
        const activePhase = phases[activePhaseIndex];

        currentModuleIndex = activePhase.modules.findIndex(
          (m) => m.module_status === "active"
        );

        if (currentModuleIndex === -1) {
          currentModuleIndex = activePhase.modules.findIndex(
            (m) => m.module_status === "not-started"
          );
        }

        if (currentModuleIndex !== -1) {
          const mod = activePhase.modules[currentModuleIndex];

          const taskIndex = mod.tasks.findIndex(
            (t) => t.name === taskName && t.task_status === "active"
          );

          if (taskIndex !== -1) {
            mod.tasks[taskIndex].task_status = "completed";
            mod.tasks[taskIndex].completed_on =
              new Date().toISOString();
            taskFound = true;

            const pendingTasksCount = mod.tasks.filter(
              (t) => t.task_status !== "completed"
            ).length;

            if (pendingTasksCount === 0) {
              mod.module_status = "completed";
              completedModuleName = mod.name;
              needsModuleProgression = true;
            }
          }
        }
      }

      if (!taskFound) {
        toast.error("Task not found or not active.");
        setCompletingTask(null);
        return;
      }

      const roadmapRef = doc(
        db,
        "users",
        userId,
        "userRoadmap",
        "current"
      );
      await setDoc(roadmapRef, firstUpdateData);

      if (needsModuleProgression) {
        toast.success(
          `Task & Module "${completedModuleName}" completed! ✅`
        );
      } else {
        toast.success(
          `Task completed: ${taskName}! Keep the streak going!`
        );
      }

      if (
        needsModuleProgression &&
        activePhaseIndex !== -1 &&
        currentModuleIndex !== -1
      ) {
        await new Promise((resolve) => setTimeout(resolve, 500));

        const secondUpdateData: RoadmapData = JSON.parse(
          JSON.stringify(firstUpdateData)
        );

        const secondPhases =
          secondUpdateData.roadmap ?? secondUpdateData.phases ?? [];
        const secondActivePhase = secondPhases[activePhaseIndex];

        const nextModuleIndex = currentModuleIndex + 1;
        if (nextModuleIndex < secondActivePhase.modules.length) {
          const nextModule =
            secondActivePhase.modules[nextModuleIndex];

          if (nextModule.module_status === "not-started") {
            nextModule.module_status = "active";
            await setDoc(roadmapRef, secondUpdateData);
            toast.success(`Starting "${nextModule.name}"... 🚀`);
          }
        } else {
          toast.success(
            `All modules in this phase complete! Visit Dashboard to advance.`
          );
        }
      }
    } catch (err) {
      console.error("Failed to update task status:", err);
      toast.error("Failed to save progress. Check your connection.");
    } finally {
      setCompletingTask(null);
    }
  };

  // 5. NAVIGATE TO REFLECTION PAGE
  const handleReflect = (taskName: string) => {
    router.push(`/reflections?task=${encodeURIComponent(taskName)}`);
  };

  // 6. NAVIGATE TO SPECIFIC TASK PAGE
  const handleViewTask = (taskName: string) => {
    router.push(`/tasks?activeTask=${encodeURIComponent(taskName)}`);
  };

  // 7. RESTART TASK HANDLER
  const handleRestartTask = async (
    moduleName: string,
    taskName: string
  ) => {
    if (!roadmapData || !userId || !db) return;

    const restartKey = `${moduleName}-${taskName}`;
    setRestartingTask(restartKey);

    try {
      const updatedData: RoadmapData = JSON.parse(
        JSON.stringify(roadmapData)
      );
      const phases = updatedData.roadmap ?? updatedData.phases ?? [];
      const activePhase = phases.find((p) => p.status === "active");

      if (!activePhase) {
        toast.error("No active phase found.");
        setRestartingTask(null);
        return;
      }

      const moduleIndex = activePhase.modules.findIndex(
        (m) => m.name === moduleName
      );

      if (moduleIndex === -1) {
        toast.error("Module not found.");
        setRestartingTask(null);
        return;
      }

      const targetModule = activePhase.modules[moduleIndex];
      const taskIndex = targetModule.tasks.findIndex(
        (t) => t.name === taskName
      );

      if (taskIndex === -1) {
        toast.error("Task not found.");
        setRestartingTask(null);
        return;
      }

      targetModule.tasks[taskIndex].task_status = "not-started";
      targetModule.tasks[taskIndex].completed_on = null;
      targetModule.module_status = "active";

      const currentlyActiveModuleIndex =
        activePhase.modules.findIndex(
          (m) => m.module_status === "active" && m.name !== moduleName
        );

      if (
        currentlyActiveModuleIndex !== -1 &&
        currentlyActiveModuleIndex > moduleIndex
      ) {
        activePhase.modules[
          currentlyActiveModuleIndex
        ].module_status = "not-started";
      }

      const roadmapRef = doc(
        db,
        "users",
        userId,
        "userRoadmap",
        "current"
      );
      await setDoc(roadmapRef, updatedData);

      toast.success(
        `Task "${taskName}" restarted! Module "${moduleName}" is now active.`
      );
    } catch (err) {
      console.error("Failed to restart task:", err);
      toast.error("Failed to restart task. Check your connection.");
    } finally {
      setRestartingTask(null);
    }
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

  let focusStatus = "Finding your next steps...";
  if (activePhase && activeModule) {
    focusStatus = `Focus: ${activeModule.name}`;
  } else if (activePhase && !activeModule) {
    focusStatus = `Phase ${activePhase.title} Complete! Proceed to Dashboard to advance the Phase.`;
  } else {
    focusStatus = "No active Phase found.";
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3">
            Today&apos;s Launchpad Tasks
          </h1>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 bg-white rounded-xl shadow-md">
            <div>
              <p className="text-lg text-gray-600">
                <span className="font-semibold text-gray-800">
                  Current Phase: {activePhase?.title || "N/A"}
                </span>
              </p>
              <p
                className={`text-base font-medium mt-1 ${
                  activeModule ? "text-indigo-600" : "text-green-600"
                }`}
              >
                {focusStatus}
              </p>
            </div>
            {roadmapData?.careerGoal && (
              <div className="inline-block px-4 py-2 text-sm font-semibold text-indigo-800 bg-indigo-100 rounded-full">
                🎯 Goal: {roadmapData.careerGoal}
              </div>
            )}
          </div>
        </header>

        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <ListChecks className="w-6 h-6 mr-2 text-indigo-600" />
          Pending Tasks ({dailyTasks.length})
        </h2>

        {dailyTasks.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
            {dailyTasks.map((task) => (
              <DailyTaskCard
                key={task.name}
                task={task}
                onStart={handleTaskStart}
                onComplete={handleTaskComplete}
                isStarting={startingTask === task.name}
                isCompleting={completingTask === task.name}
                estimatedHours={hoursPerTask ?? undefined}
                onTaskClick={() => handleViewTask(task.name)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center p-16 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-200 mb-12">
            <div className="inline-block p-4 bg-indigo-100 rounded-full mb-6">
              <Zap className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-3xl font-bold text-indigo-900 mb-2">
              All caught up! 🎉
            </h3>
            <p className="text-lg text-indigo-700">
              You&apos;ve completed all your daily tasks for this
              module.
            </p>
          </div>
        )}

        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center border-t pt-8">
          <CheckCircle2 className="w-6 h-6 mr-2 text-green-600" />
          Completed Tasks in Current Module ({completedTasks.length})
        </h2>

        {completedTasks.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-12">
            {completedTasks.map((task) => (
              <CompletedTaskCard
                key={task.name}
                task={task}
                onReflectionClick={handleReflect}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-600 italic mb-12">
            No tasks completed in the current module yet.
          </p>
        )}

        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center border-t pt-8">
          <CheckCircle2 className="w-6 h-6 mr-2 text-emerald-600" />
          Completed Modules ({completedModules.length})
        </h2>

        {completedModules.length > 0 ? (
          <div className="space-y-4">
            {completedModules.map((module) => (
              <CompletedModuleCard
                key={module.name}
                module={module}
                onRestartTask={handleRestartTask}
                isRestarting={restartingTask}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-600 italic">
            No modules completed yet. Keep going! 💪
          </p>
        )}
      </div>
    </div>
  );
};

export default DailyTaskViewer;
