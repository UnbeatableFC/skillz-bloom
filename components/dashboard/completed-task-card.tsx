import { Task } from "@/types/types";
import { CheckCircle2, MessageSquare } from "lucide-react";
import { Button } from "../ui/button";

export const CompletedTaskCard = ({
  task,
  onReflectionClick,
}: {
  task: Task;
  onReflectionClick: (task: string) => void;
}) => (
  <div className="bg-white p-4 rounded-lg shadow border border-green-200 flex justify-between items-center transition-all hover:bg-green-50">
    <div className="flex items-center">
      <CheckCircle2 className="w-5 h-5 text-green-600 mr-3 shrink-0" />
      <div>
        <p className="text-base font-semibold text-gray-800 line-clamp-1">
          {task.name}
        </p>
        <p className="text-xs text-gray-500 mt-0.5">
          Completed:{" "}
          {task.completed_on
            ? new Date(task.completed_on).toLocaleDateString()
            : "N/A"}
        </p>
      </div>
    </div>
    <Button
      onClick={() => onReflectionClick(task.name)}
      className="text-xs py-1 px-3 bg-green-500 hover:bg-green-600 text-white"
    >
      <MessageSquare className="w-3 h-3 mr-1" /> Reflect
    </Button>
  </div>
);