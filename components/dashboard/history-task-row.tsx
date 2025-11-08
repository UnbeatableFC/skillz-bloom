import { Calendar, CheckCircle2, Loader2, RotateCcw } from "lucide-react";
import { Button } from "../ui/button";
import { Task } from "@/types/types";

export const TaskRow = ({
  task,
  taskIndex,
  moduleIndex,
  phaseIndex,
  onRestartTask,
  isRestarting,
}: {
  task: Task;
  taskIndex: number;
  moduleIndex: number;
  phaseIndex: number;
  onRestartTask: (phaseIndex: number, moduleIndex: number, taskIndex: number) => void;
  isRestarting: string | null;
}) => {
  const isCompleted = task.task_status === "completed";

  return (
    <div
      className={`p-3 rounded-lg border flex items-center justify-between transition-all ${
        isCompleted
          ? "bg-white border-green-200 hover:shadow-sm"
          : "bg-gray-100 border-gray-300"
      }`}
    >
      <div className="flex items-center space-x-3 flex-1">
        <CheckCircle2
          className={`w-4 h-4 shrink-0 ${
            isCompleted ? "text-green-500" : "text-gray-400"
          }`}
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-800 truncate">
            {task.name}
          </p>
          {task.completed_on && (
            <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(task.completed_on).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
      <Button
        onClick={() => onRestartTask(phaseIndex, moduleIndex, taskIndex)}
        disabled={isRestarting === `task-${phaseIndex}-${moduleIndex}-${taskIndex}`}
        className="text-xs py-1 px-3 bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-1"
      >
        {isRestarting === `task-${phaseIndex}-${moduleIndex}-${taskIndex}` ? (
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
  );
};
