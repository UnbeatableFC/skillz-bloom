import { calculateProgress } from "@/hooks/calculate-progress";
import { RoadmapPhase } from "@/types/types";
import {
  BookOpen,
  CheckCircle,
  LayoutDashboard,
  Target,
} from "lucide-react";

export const Analytics = ({ phases }: { phases: RoadmapPhase[] }) => {
  const progressMetrics = calculateProgress(phases);

  const overallProgressColor =
    progressMetrics.overallProgress === "100.0"
      ? "bg-green-600"
      : "bg-indigo-600";
  const overallProgressBg =
    progressMetrics.overallProgress === "100.0"
      ? "bg-green-100"
      : "bg-indigo-100";
  return (
    <div className="mb-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <LayoutDashboard className="w-6 h-6 mr-2 text-indigo-600" />
        Progress Summary
      </h2>

      {/* Overall Progress Bar */}
      <div
        className={`p-5 rounded-xl shadow-md ${overallProgressBg} mb-6`}
      >
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-gray-800">
            Overall Completion
          </h3>
          <span
            className={`text-xl font-extrabold ${
              progressMetrics.overallProgress === "100.0"
                ? "text-green-700"
                : "text-indigo-700"
            }`}
          >
            {progressMetrics.overallProgress}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full ${overallProgressColor} transition-all duration-500`}
            style={{ width: `${progressMetrics.overallProgress}%` }}
          ></div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Phases Completed */}
        <div className="p-4 bg-white rounded-xl shadow border border-gray-200 flex items-center">
          <Target className="w-6 h-6 text-indigo-500 mr-3" />
          <div>
            <p className="text-sm text-gray-500">Phases Completed</p>
            <p className="text-xl font-bold text-gray-800">
              {progressMetrics.completedPhases} /{" "}
              {progressMetrics.totalPhases}
            </p>
          </div>
        </div>

        {/* Modules Completed */}
        <div className="p-4 bg-white rounded-xl shadow border border-gray-200 flex items-center">
          <BookOpen className="w-6 h-6 text-indigo-500 mr-3" />
          <div>
            <p className="text-sm text-gray-500">Modules Completed</p>
            <p className="text-xl font-bold text-gray-800">
              {progressMetrics.completedModules} /{" "}
              {progressMetrics.totalModules}
            </p>
          </div>
        </div>

        {/* Tasks Completed */}
        <div className="p-4 bg-white rounded-xl shadow border border-gray-200 flex items-center">
          <CheckCircle className="w-6 h-6 text-indigo-500 mr-3" />
          <div>
            <p className="text-sm text-gray-500">Tasks Completed</p>
            <p className="text-xl font-bold text-gray-800">
              {progressMetrics.completedTasks} /{" "}
              {progressMetrics.totalTasks}
            </p>
          </div>
        </div>

        {/* Finished Status */}
        <div className="p-4 bg-white rounded-xl shadow border border-gray-200 flex items-center">
          <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
          <div>
            <p className="text-sm text-gray-500">Roadmap Status</p>
            <p className="text-xl font-bold text-green-800">
              {progressMetrics.overallProgress === "100.0"
                ? "Finished"
                : "In Progress"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
