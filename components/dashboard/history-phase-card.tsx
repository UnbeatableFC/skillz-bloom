import { RoadmapPhase } from "@/types/types";
import { Award, CheckCircle2, ChevronDown, ChevronUp, Loader2, RotateCcw } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { ModuleCard } from "./history-module-card";

export const CompletedPhaseCard = ({
  phase,
  phaseIndex,
  onRestartPhase,
  onRestartModule,
  onRestartTask,
  isRestarting,
}: {
  phase: RoadmapPhase;
  phaseIndex: number;
  onRestartPhase: (phaseIndex: number) => void;
  onRestartModule: (phaseIndex: number, moduleIndex: number) => void;
  onRestartTask: (phaseIndex: number, moduleIndex: number, taskIndex: number) => void;
  isRestarting: string | null;
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const completedModules = phase.modules.filter(m => m.module_status === "completed");
  const totalTasks = phase.modules.reduce((sum, m) => sum + m.tasks.length, 0);
  const completedTasks = phase.modules.reduce(
    (sum, m) => sum + m.tasks.filter(t => t.task_status === "completed").length,
    0
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg border-2 border-green-200 overflow-hidden">
      {/* Phase Header */}
      <div className="p-6 bg-linear-to-r from-green-50 via-emerald-50 to-teal-50">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-4 flex-1">
            <div className="p-3 bg-green-100 rounded-xl">
              <Award className="w-8 h-8 text-green-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {phase.title}
              </h2>
              {/* <p className="text-gray-600 mb-3">
                {phase.description || "No description available"}
              </p> */}
              <div className="flex flex-wrap gap-3 text-sm">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Completed
                </span>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                  {completedModules.length}/{phase.modules.length} Modules
                </span>
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
                  {completedTasks}/{totalTasks} Tasks
                </span>
              </div>
            </div>
          </div>
          <Button
            onClick={() => onRestartPhase(phaseIndex)}
            disabled={isRestarting === `phase-${phaseIndex}`}
            className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
          >
            {isRestarting === `phase-${phaseIndex}` ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Restarting...
              </>
            ) : (
              <>
                <RotateCcw className="w-4 h-4" />
                Restart Phase
              </>
            )}
          </Button>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full mt-4 flex items-center justify-center gap-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-5 h-5" />
              Hide Modules
            </>
          ) : (
            <>
              <ChevronDown className="w-5 h-5" />
              View Modules & Tasks
            </>
          )}
        </button>
      </div>

      {/* Expandable Modules Section */}
      {isExpanded && (
        <div className="p-6 bg-gray-50 space-y-4">
          {phase.modules.map((module, moduleIndex) => (
            <ModuleCard
              key={moduleIndex}
              module={module}
              moduleIndex={moduleIndex}
              phaseIndex={phaseIndex}
              onRestartModule={onRestartModule}
              onRestartTask={onRestartTask}
              isRestarting={isRestarting}
            />
          ))}
        </div>
      )}
    </div>
  );
};
