import { calculatePhaseProgress } from "@/hooks/calculate-phase-progress";
import { RoadmapPhase } from "@/types/types";
import { ArrowRight, CheckCircle, Clock, Zap } from "lucide-react";
import { Button } from "../ui/button";

const RoadmapPhaseCard = ({
  phase,
  isCurrent,
  isCompleted,
   viewDailyTask
}: {
  phase: RoadmapPhase;
  isCurrent: boolean;
  isCompleted: boolean;
 viewDailyTask: () => void;
}) => {
  const progress = calculatePhaseProgress(phase);

  // Determine card styling based on status
  let cardClass =
    "bg-white shadow-xl p-6 rounded-2xl border-2 transition duration-300 transform hover:scale-[1.02]";
  let borderColor = "border-gray-200";
  let icon = <Clock className="w-6 h-6 text-gray-400" />;

  if (isCompleted) {
    borderColor = "border-green-500 bg-green-50";
    icon = <CheckCircle className="w-6 h-6 text-green-600" />;
  } else if (isCurrent) {
    borderColor =
      "border-indigo-600 bg-indigo-50 shadow-indigo-200/50";
    icon = <Zap className="w-6 h-6 text-indigo-600 animate-pulse" />;
    cardClass += " ring-4 ring-indigo-200/50";
  }

  return (
    <div className={`${cardClass} ${borderColor}`}>
      <div className="flex items-center space-x-3 mb-3">
        {icon}
        <h3
          className={`text-xl font-extrabold ${
            isCurrent ? "text-indigo-800" : "text-gray-800"
          }`}
        >
          {phase.title}
        </h3>
      </div>

      <p className="text-sm text-gray-500 mb-4">
        Estimated Duration: {phase.estimated_weeks} weeks
      </p>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
        <div
          className={`h-2.5 rounded-full ${
            isCompleted ? "bg-green-500" : "bg-indigo-500"
          }`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-right text-sm font-medium text-gray-600">
        {progress}% Complete
      </p>

      {/* Modules List (showing first 3 skills) */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="font-semibold text-gray-700 mb-2">
          Key Focus Areas:
        </p>
        <ul className="space-y-1 text-sm text-gray-600">
          {phase.modules.slice(0, 3).map((module, index) => (
            <li key={index} className="flex items-center space-x-2">
              <ArrowRight className="w-4 h-4 text-indigo-400" />
              <span>{module.name}</span>
            </li>
          ))}
          {phase.modules.length > 3 && (
            <li className="text-xs text-gray-400">
              ...and {phase.modules.length - 3} more modules
            </li>
          )}
        </ul>
      </div>

      {isCurrent && (
        <div className="mt-6 text-center">
          <Button onClick={viewDailyTask} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-xl shadow-lg transition duration-150" >
            View Daily Tasks
          </Button>
        </div>
      )}
    </div>
  );
};

export default RoadmapPhaseCard;
