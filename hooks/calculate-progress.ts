import { RoadmapPhase } from "@/types/types";

// --- Progress Calculation Utility ---
export const calculateProgress = (phases: RoadmapPhase[]) => {
  let totalTasks = 0;
  let completedTasks = 0;
  let totalModules = 0;
  let completedModules = 0;
  let completedPhases = 0;

  phases.forEach((phase) => {
    if (phase.status === "completed") {
      completedPhases++;
    }
    totalModules += phase.modules.length;
    phase.modules.forEach((module) => {
      if (module.module_status === "completed") {
        completedModules++;
      }
      totalTasks += module.tasks.length;
      module.tasks.forEach((task) => {
        if (task.task_status === "completed") {
          completedTasks++;
        }
      });
    });
  });

  const overallProgress =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return {
    overallProgress: overallProgress.toFixed(1),
    completedPhases,
    totalPhases: phases.length,
    completedModules,
    totalModules,
    completedTasks,
    totalTasks,
  };
};