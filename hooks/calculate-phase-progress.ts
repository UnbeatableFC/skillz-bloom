import { RoadmapPhase } from "@/types/types";

// Function to calculate progress percentage for a phase
export const calculatePhaseProgress = (phase : RoadmapPhase) => {
    if (phase.status === 'completed') return 100;
    
    let totalTasks = 0;
    let completedTasks = 0;
    
    phase.modules.forEach(module => {
        module.tasks.forEach(task => {
            totalTasks++;
            if (task.task_status === 'completed') {
                completedTasks++;
            }
        });
    });

    return totalTasks === 0 ? 0 : Math.floor((completedTasks / totalTasks) * 100);
};
