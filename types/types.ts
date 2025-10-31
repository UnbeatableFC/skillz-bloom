export type LearningPathKey = "technology" | "communication" | "business" | "creative" | "personal-dev";

export interface Task {
  name: string;
  type: 'read' | 'write' | 'practice' | 'project';
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  task_status : "not-started" | "active" | "completed"
}

export interface SkillModule {
  name: string;
  estimated_hours: number;
  module_status: "not-started" | "active" | "completed"
  tasks: Task[];
}

export interface RoadmapPhase {
  id: string;
  title: string;
  duration_weeks: number; // Used for initial estimate
  modules: SkillModule[];
  status : "not-started" | "active" | "completed"
  estimated_weeks : number
}

export interface MasterRoadmap {
  title: string;
  description: string;
  phases: RoadmapPhase[];
}