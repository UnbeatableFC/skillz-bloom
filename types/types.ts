export interface Reflection {
  id: string;
  title: string;
  content: string;
  mood: "great" | "good" | "neutral" | "challenging" | "difficult";
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  role: "user" | "model";
  text: string;
  sources?: { uri: string; title: string }[];
  isError?: boolean;
}

export type LearningPathKey =
  | "technology"
  | "communication"
  | "business"
  | "creative"
  | "personal-dev";

export interface LearningPathData {
  value: string;
  title: string;
  description: string;
  icon?: string;
}

export interface Task {
  name: string;
  type: "read" | "write" | "practice" | "project";
  difficulty: "easy" | "medium" | "hard";
  description: string;
  task_status: "not-started" | "active" | "completed";
  resources?: string[];
  completed_on?: string | null;
}

export interface SkillModule {
  name: string;
  estimated_hours: number;
  module_status: "not-started" | "active" | "completed";
  tasks: Task[];
}

export interface RoadmapPhase {
  id: string;
  title: string;
  duration_weeks: number; // Used for initial estimate
  modules: SkillModule[];
  status: "not-started" | "active" | "completed";
  estimated_weeks: number;
}

export interface MasterRoadmap {
  title: string;
  description: string;
  phases: RoadmapPhase[];
  roadmap?: RoadmapPhase[];
}

export interface UserRoadmap {
  planTitle: string;
  careerGoal: string;
  learningPath: string;
  currentPhaseId: string;
  roadmap: RoadmapPhase[];
}

export interface RoadmapData extends MasterRoadmap {
  careerGoal?: string;
  learningPath?: LearningPathKey;
}

export interface CalculatedSkill extends SkillModule {
  phaseTitle: string;
}

export type ThemeTypes = "light" | "dark" | "system";

export type TaskDensityType = "low" | "medium" | "high";

export interface UserProfile {
  fullName?: string;
  username?: string;
  age?: number;
  email: string;
  clerkId: string;
  profilePicture?: string;
  careerGoal?: string;
  learningPath?: LearningPathKey;
  skills?: string[];
  createdAt: string;
  onboardingCompleted? : boolean
  preferences?: {
    theme: ThemeTypes;
    taskDensity: TaskDensityType;
    emailNotifications: boolean;
    inAppNotifications: boolean;
  };
}

export interface ManualSkill {
  id: string; // Firestore will generate this
  name: string;
  description: string;
// We'll use a Firestore timestamp
  evidenceLink?: string;
  evidenceLabel?: string;
}
