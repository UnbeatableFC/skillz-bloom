import { SkillModule } from "@/types/types";
import { CheckCircle2, ChevronDown, ChevronUp, Loader2, RotateCcw } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

export const CompletedModuleCard = ({
  module,
  onRestartTask,
  isRestarting,
}: {
  module: SkillModule;
  onRestartTask: (moduleName: string, taskName: string) => void;
  isRestarting: string | null;
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      {/* Module Header */}
      <div 
        className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 cursor-pointer hover:from-green-100 hover:to-emerald-100 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <CheckCircle2 className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                {module.name}
              </h3>
              {/* <p className="text-sm text-gray-600 line-clamp-2">
                {module.description || "No description"}
              </p> */}
              <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                  ✓ Completed
                </span>
                <span>{module.tasks.length} tasks</span>
              </div>
            </div>
          </div>
          <button className="ml-2 p-1 hover:bg-green-200 rounded transition-colors">
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600" />

            )}
          </button>
        </div>
      </div>

      {/* Expandable Tasks List */}
      {isExpanded && (
        <div className="p-5 bg-gray-50 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            Module Tasks:
          </h4>
          <div className="space-y-2">
            {module.tasks.map((task) => (
              <div
                key={task.name}
                className="bg-white p-3 rounded-lg border border-gray-200 flex items-center justify-between hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center space-x-3 flex-1">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {task.name}
                    </p>
                    {task.completed_on && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        {new Date(task.completed_on).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  onClick={() => onRestartTask(module.name, task.name)}
                  disabled={isRestarting === `${module.name}-${task.name}`}
                  className="text-xs py-1 px-3 bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-1"
                >
                  {isRestarting === `${module.name}-${task.name}` ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Restarting...
                    </>
                  ) : (
                    <>
                      <RotateCcw className="w-3 h-3" />
                      Restart
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};