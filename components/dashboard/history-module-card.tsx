import { SkillModule } from "@/types/types";
import { CheckCircle2, ChevronDown, ChevronUp, Loader2, RotateCcw } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { TaskRow } from "./history-task-row";

export const ModuleCard = ({
  module,
  moduleIndex,
  phaseIndex,
  onRestartModule,
  onRestartTask,
  isRestarting,
}: {
  module: SkillModule;
  moduleIndex: number;
  phaseIndex: number;
  onRestartModule: (phaseIndex: number, moduleIndex: number) => void;
  onRestartTask: (phaseIndex: number, moduleIndex: number, taskIndex: number) => void;
  isRestarting: string | null;
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const completedTasks = module.tasks.filter(t => t.task_status === "completed").length;
  const isCompleted = module.module_status === "completed";

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
      {/* Module Header */}
      <div
        className={`p-4 cursor-pointer transition-colors ${
          isCompleted
            ? "bg-linear-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100"
            : "bg-gray-50 hover:bg-gray-100"
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <CheckCircle2
              className={`w-5 h-5 mt-1 shrink-0 ${
                isCompleted ? "text-green-600" : "text-gray-400"
              }`}
            />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                {module.name}
              </h3>
              {/* <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                {module.description || "No description"}
              </p> */}
              <div className="flex items-center gap-2 text-xs">
                <span
                  className={`px-2 py-1 rounded-full font-medium ${
                    isCompleted
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {module.module_status}
                </span>
                <span className="text-gray-500">
                  {completedTasks}/{module.tasks.length} tasks
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-2">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onRestartModule(phaseIndex, moduleIndex);
              }}
              disabled={isRestarting === `module-${phaseIndex}-${moduleIndex}`}
              className="text-xs py-1 px-3 bg-orange-500 hover:bg-orange-600 text-white"
            >
              {isRestarting === `module-${phaseIndex}-${moduleIndex}` ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin mr-1" />
                  Restarting...
                </>
              ) : (
                <>
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Restart
                </>
              )}
            </Button>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            )}
          </div>
        </div>
      </div>

      {/* Expandable Tasks */}
      {isExpanded && (
        <div className="p-4 bg-gray-50 space-y-2">
          {module.tasks.map((task, taskIndex) => (
            <TaskRow
              key={taskIndex}
              task={task}
              taskIndex={taskIndex}
              moduleIndex={moduleIndex}
              phaseIndex={phaseIndex}
              onRestartTask={onRestartTask}
              isRestarting={isRestarting}
            />
          ))}
        </div>
      )}
    </div>
  );
};