import { calculatePhaseProgress } from "@/hooks/calculate-phase-progress";
import { RoadmapPhase } from "@/types/types";
import { ArrowRight, Check, CheckCircle, Clock, Zap } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

const RoadmapPhaseCard = ({
  phase,
  isCurrent,
  isCompleted,
  isNotStarted,
  viewDailyTask,
  handleCompletePhase,
}: {
  phase: RoadmapPhase;
  isCurrent: boolean;
  isCompleted: boolean;
  isNotStarted: boolean;
  viewDailyTask: () => void;
  handleCompletePhase: (phase: RoadmapPhase) => void;
}) => {
  const progress = calculatePhaseProgress(phase);
  const allModulesCompleted = phase.modules.every(
    (m) => m.module_status === "completed"
  );

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
  } else if (isNotStarted) {
    borderColor = "border-gray-300 bg-gray-50";
    icon = (
      <Clock className="w-6 h-6 text-gray-400 animate-pulse-slow" />
    );
    cardClass += " opacity-70 hover:opacity-100 transition-opacity";
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
      {
        
        isCompleted && (<div className="flex justify-end mt-1"><Badge className={"bg-green-200/75 text-slate-600"}><Check /> Completed</Badge></div>)
      }
      {
        
        isNotStarted && (<div className="flex justify-end mt-1"><Badge className={"bg-gray-200/75 text-slate-600"}><Clock /> Not Started</Badge></div>)
      }
      {
        
        isCurrent && (<div className="flex justify-end mt-1"><Badge className={"bg-purple-200/75 text-slate-600"}><Zap /> Active</Badge></div>)
      }

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

      {/* {isCurrent && (
        <div className="mt-6 text-center">
          <Button onClick={viewDailyTask} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-xl shadow-lg transition duration-150" >
            View Daily Tasks
          </Button>
        </div>
      )} */}
      {isCurrent && allModulesCompleted && !isCompleted ? (
        // ✅ Case: Current phase completed → show finalize button
        <div className="mt-6 text-center">
          <Button
            onClick={() => handleCompletePhase(phase)}
            className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white"
          >
            Finalize Phase & Advance
          </Button>
        </div>
      ) : (
        // 🟣 Case: Otherwise show "View Tasks" (disabled if not started)
        <div className="mt-6 text-center">
          <Button
            onClick={viewDailyTask}
            disabled={isNotStarted}
            className={`w-full font-bold py-2 px-4 rounded-xl shadow-lg transition duration-150 
        ${
          isNotStarted
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-700 text-white"
        }`}
          >
            {isNotStarted ? "Not Started Yet" : "View Tasks"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default RoadmapPhaseCard;
