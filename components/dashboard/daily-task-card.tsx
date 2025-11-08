import React from "react";
import { Task } from "@/types/types";
import { CheckCircle2, ExternalLink, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

interface DailyTaskCardProps {
  task: Task;
  onComplete: (taskName: string) => void;
  isCompleting?: boolean;
  onTaskClick?: () => void;
  estimatedHours?: number;
}

const DailyTaskCard: React.FC<DailyTaskCardProps> = ({
  task,
  onComplete,
  isCompleting = false,
  onTaskClick,
  estimatedHours,
}) => {
  return (
    <div
      onClick={onTaskClick}
      className="flex flex-col bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition duration-200 overflow-hidden hover:border-indigo-300 cursor-pointer hover:scale-105 transform"
    >
      {/* Header with gradient */}
      <div className="bg-linear-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className="mt-1">
              <svg
                className="w-6 h-6 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                ></path>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-gray-900 wrap-break-word line-clamp-2">
                {task.name}
              </h3>
              {task.description && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {task.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-4 flex-1">
        {/* Resources Section */}
        {task.resources && task.resources.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2 flex items-center gap-1">
              📚 Learning Resources
            </p>
            <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {task.resources.map((resource, idx: number) => (
                <Link
                  key={idx}
                  href={resource}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center text-sm text-indigo-600 hover:text-indigo-800 hover:underline group transition-colors p-2 rounded-lg hover:bg-indigo-50"
                >
                  <ExternalLink className="w-3.5 h-3.5 mr-2 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="truncate">Resource {idx + 1}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Estimated Hours */}
        {estimatedHours && (
          <div className="flex items-center space-x-2 text-sm text-gray-600 mt-3 pt-3 border-t border-gray-100">
            <Clock className="w-4 h-4 text-gray-500 shrink-0" />
            <span>
              Est. Time: <strong>{estimatedHours}</strong>{" "}
              {estimatedHours === 1 ? "hour" : "hours"}
            </span>
          </div>
        )}
      </div>

      {/* Footer with action button */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between gap-3">
        <span
          className={`inline-block px-3 py-1 text-xs font-semibold rounded-full shrink-0 ${
            task.task_status === "not-started"
              ? "text-indigo-800 bg-indigo-100"
              : "text-green-800 bg-green-100"
          }`}
        >
          {task.task_status === "not-started"
            ? "Not Started"
            : "Completed"}
        </span>
        {task.task_status === "not-started" && (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onComplete(task.name);
            }}
            disabled={isCompleting}
            className="px-3 py-2 bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-600 transition duration-150 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 whitespace-nowrap text-sm"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isCompleting ? "..." : "Done"}</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default DailyTaskCard;
