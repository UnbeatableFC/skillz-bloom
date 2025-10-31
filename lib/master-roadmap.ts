/**
 * Master Roadmap Definitions
 * This data structure serves as the static curriculum source.
 * The backend logic will clone and customize the appropriate path for the user.
 * * Note: Estimated Durations are relative to an average time commitment. The
 * customization logic will adjust these based on the user's 'availableTime'.
 */

import { LearningPathKey, MasterRoadmap } from "@/types/types";

export const MASTER_ROADMAPS: Record<LearningPathKey, MasterRoadmap> =
  {
    // Technology Road Map
    technology: {
      title: "Tech Career Accelerator",
      description:
        "Build a robust foundation in coding, data, and system design.",
      phases: [
        // Phase 1
        {
          id: "tech_foundation",
          title: "Phase 1: Foundational Literacy & Tools",
          duration_weeks: 4,
          status: "not-started",
          estimated_weeks: 0,
          modules: [
            // Module 1
            {
              name: "Coding Basics (Python/JS)",
              estimated_hours: 12,
              module_status : "not-started",
              tasks: [
                {
                  name: "Variables & Control Flow Practice",
                  type: "practice",
                  difficulty: "easy",
                  description:
                    "Complete 5 small coding challenges on loops and conditionals.",
                  task_status: "not-started",
                },
                {
                  name: "Git & Version Control Setup",
                  type: "read",
                  difficulty: "easy",
                  description:
                    "Set up a GitHub account and complete first commit.",
                  task_status: "not-started",
                },
              ],
            },

            // Module 2
            {
              name: "Cloud & Data Intro",
              estimated_hours: 8,
              module_status : "not-started",
              tasks: [
                {
                  name: "Firestore Document Structure Review",
                  type: "read",
                  difficulty: "medium",
                  description:
                    "Read documentation on NoSQL vs SQL and Firestore data models.",
                  task_status: "not-started",
                },
              ],
            },
          ],
        },

        // Phase 2
        {
          id: "tech_deep_dive",
          title: "Phase 2: Project & Specialization",
          duration_weeks: 8,
          estimated_weeks: 0,
          status: "not-started",
          modules: [
            // Module 1
            {
              name: "Web App Development (Frontend)",
              estimated_hours: 20,
              module_status : "not-started",
              tasks: [
                {
                  name: "Build a Simple Component Library",
                  type: "project",
                  difficulty: "medium",
                  description:
                    "Create a functional component (e.g., a modal or notification banner) using React/Tailwind.",
                  task_status: "not-started",
                },
              ],
            },

            // Module 2
            {
              name: "Algorithms & Data Structures",
              estimated_hours: 15,
              module_status : "not-started",
              tasks: [
                {
                  name: "Practice 5 Array/String manipulation problems",
                  type: "practice",
                  difficulty: "medium",
                  description:
                    "Solve medium-level problems on a coding platform.",
                  task_status: "not-started",
                },
              ],
            },
          ],
        },

        // Phase 3
        {
          id: "tech_career_launch",
          title: "Phase 3: Portfolio & Interview Prep",
          duration_weeks: 4,
          estimated_weeks: 0,
          status: "not-started",
          modules: [
            // Module 1
            {
              name: "Portfolio Creation",
              estimated_hours: 10,
              module_status : "not-started",
              tasks: [
                {
                  name: "Finalize one major project for portfolio",
                  type: "project",
                  difficulty: "hard",
                  description:
                    "Polish code, write documentation, and deploy the project.",
                  task_status: "not-started",
                },
              ],
            },

            // Module 2
            {
              name: "Mock Technical Interviews",
              estimated_hours: 6,
              module_status : "not-started",
              tasks: [
                {
                  name: "Complete two 30-minute mock behavioral interviews (AI Feedback)",
                  type: "practice",
                  difficulty: "medium",
                  description:
                    "Focus on articulating project challenges and successes.",
                  task_status: "not-started",
                },
              ],
            },
          ],
        },
      ],
    },

    // Communication Road Map
    communication: {
      title: "Communication Mastery Track",
      description:
        "Develop skills in persuasive writing, active listening, and presentation.",
      phases: [
        // Phase 1
        {
          id: "comm_foundation",
          title: "Phase 1: Active Listening & Clarity",
          duration_weeks: 3,
          estimated_weeks: 0,
          status: "not-started",
          modules: [
            // Module 1
            {
              name: "Active Listening",
              estimated_hours: 6,
              module_status : "not-started",
              tasks: [
                {
                  name: "Summarize a TED Talk (Reflection)",
                  type: "write",
                  difficulty: "easy",
                  description:
                    "Watch a 15-minute TED Talk and write a 100-word summary and reflection.",
                  task_status: "not-started",
                },
              ],
            },
          ],
        },

        // Phase 2
        {
          id: "comm_expression",
          title: "Phase 2: Effective Expression & Feedback",
          duration_weeks: 4,
          estimated_weeks: 0,
          status: "not-started",
          modules: [
            // Module 1
            {
              name: "Clear Communication",
              estimated_hours: 8,
              module_status : "not-started",
              tasks: [
                {
                  name: "Write a Clear Message",
                  type: "write",
                  difficulty: "medium",
                  description:
                    "Draft a 150-word message clearly conveying an idea, avoiding jargon.",
                  task_status: "not-started",
                },
                {
                  name: "Peer Feedback Exercise",
                  type: "practice",
                  difficulty: "medium",
                  description:
                    "Exchange messages with a peer and provide constructive feedback.",
                  task_status: "not-started",
                },
              ],
            },

            // Module 2
            {
              name: "Non-Verbal Communication",
              estimated_hours: 4,
              module_status : "not-started",
              tasks: [
                {
                  name: "Observe and Note Body Language",
                  type: "practice",
                  difficulty: "easy",
                  description:
                    "Watch a 10-minute video on communication and note key non-verbal cues.",
                  task_status: "not-started",
                },
              ],
            },
          ],
        },

        // Phase 3
        {
          id: "comm_conflict_resolution",
          title:
            "Phase 3: Conflict Resolution & Emotional Intelligence",
          duration_weeks: 4,
          estimated_weeks: 0,
          status: "not-started",
          modules: [
            // Module 1
            {
              name: "Conflict Management",
              estimated_hours: 7,
              module_status : "not-started",
              tasks: [
                {
                  name: "Role-Play Conflict Scenarios",
                  type: "practice",
                  difficulty: "medium",
                  description:
                    "Participate in a role-play to practice managing conflict respectfully.",
                  task_status: "not-started",
                },
                {
                  name: "Reflect on a Past Conflict",
                  type: "write",
                  difficulty: "medium",
                  description:
                    "Write 200 words reflecting on a past conflict and lessons learned.",
                  task_status: "not-started",
                },
              ],
            },

            // Module 2
            {
              name: "Emotional Intelligence",
              estimated_hours: 5,
              module_status : "not-started",
              tasks: [
                {
                  name: "Emotional Awareness Journal",
                  type: "write",
                  difficulty: "easy",
                  description:
                    "Keep a journal for 3 days noting your emotional responses to triggers.",
                  task_status: "not-started",
                },
              ],
            },
          ],
        },
      ],
    },

    // Business Road Map
    business: {
      title: "Business Strategy & Management",
      description:
        "Learn core concepts in marketing, finance, and product development.",
      phases: [
        // Phase 1
        {
          id: "biz_foundation",
          title: "Phase 1: Market & Finance Basics",
          duration_weeks: 4,
          estimated_weeks: 0,
          status: "not-started",
          modules: [
            // Module 1
            {
              name: "Market Analysis",
              estimated_hours: 10,
              module_status : "not-started",
              tasks: [
                {
                  name: "SWOT Analysis of a major company",
                  type: "write",
                  difficulty: "medium",
                  description:
                    "Complete a Strengths, Weaknesses, Opportunities, and Threats analysis.",
                  task_status: "not-started",
                },
              ],
            },
          ],
        },

        // Phase 2
        {
          id: "biz_operations",
          title: "Phase 2: Operations & Marketing Fundamentals",
          duration_weeks: 5,
          estimated_weeks: 0,
          status: "not-started",
          modules: [
            // Module 1
            {
              name: "Operations Management",
              estimated_hours: 12,
              module_status : "not-started",
              tasks: [
                {
                  name: "Process Mapping",
                  type: "write",
                  difficulty: "medium",
                  description:
                    "Map the core operations process of a chosen business.",
                  task_status: "not-started",
                },
                {
                  name: "Cost Control Exercise",
                  type: "practice",
                  difficulty: "hard",
                  description:
                    "Analyze methods to reduce operational costs without compromising quality.",
                  task_status: "not-started",
                },
              ],
            },

            // Module 2
            {
              name: "Marketing Basics",
              estimated_hours: 8,
              module_status : "not-started",
              tasks: [
                {
                  name: "Marketing Mix Analysis",
                  type: "write",
                  difficulty: "medium",
                  description:
                    "Analyze the 4Ps (Product, Price, Place, Promotion) of a selected brand.",
                  task_status: "not-started",
                },
              ],
            },
          ],
        },

        // Phase 3
        {
          id: "biz_finance_hr",
          title: "Phase 3: Financial Management & Human Resources",
          duration_weeks: 5,
          estimated_weeks: 0,
          status: "not-started",
          modules: [
            // Module 1
            {
              name: "Financial Management",
              estimated_hours: 10,
              module_status : "not-started",
              tasks: [
                {
                  name: "Cash Flow Statement Preparation",
                  type: "write",
                  difficulty: "hard",
                  description:
                    "Prepare a basic cash flow statement for a small business.",
                  task_status: "not-started",
                },
                {
                  name: "Budget Planning Exercise",
                  type: "practice",
                  difficulty: "medium",
                  description:
                    "Create a simple budget plan to manage monthly expenses.",
                  task_status: "not-started",
                },
              ],
            },

            // Module 2
            {
              name: "Human Resource Basics",
              estimated_hours: 7,
              module_status : "not-started",
              tasks: [
                {
                  name: "Recruitment Strategy",
                  type: "write",
                  difficulty: "medium",
                  description:
                    "Outline a recruitment plan for a new team member.",
                  task_status: "not-started",
                },
                {
                  name: "Employee Motivation Reflection",
                  type: "write",
                  difficulty: "easy",
                  description:
                    "Reflect on factors that motivate employees to perform effectively.",
                  task_status: "not-started",
                },
              ],
            },
          ],
        },
      ],
    },

    // Creative Road Map
    creative: {
      title: "Creative Design & Storytelling",
      description:
        "Focus on visual literacy, design principles, and narrative construction.",
      phases: [
        // Phase 1
        {
          id: "crea_foundation",
          title: "Phase 1: Design Principles",
          duration_weeks: 3,
          estimated_weeks: 0,
          status: "not-started",
          modules: [
            // Module 1
            {
              name: "Visual Hierarchy",
              estimated_hours: 8,
              module_status : "not-started",
              tasks: [
                {
                  name: "Critique 3 website layouts",
                  type: "write",
                  difficulty: "easy",
                  description:
                    "Analyze three websites based on use of color, contrast, and spacing.",
                  task_status: "not-started",
                },
              ],
            },
          ],
        },

        // Phase 2
        {
          id: "crea_typography",
          title: "Phase 2: Typography & Color Theory",
          duration_weeks: 4,
          estimated_weeks: 0,
          status: "not-started",
          modules: [
            // Module 1
            {
              name: "Typography Basics",
              estimated_hours: 10,
              module_status : "not-started",
              tasks: [
                {
                  name: "Identify Typeface Families",
                  type: "write",
                  difficulty: "medium",
                  description:
                    "Research and write about 5 typeface families and their use cases.",
                  task_status: "not-started",
                },
                {
                  name: "Create a Typographic Poster",
                  type: "practice",
                  difficulty: "hard",
                  description:
                    "Design a poster using typography to convey a message effectively, focusing on readability and style.",
                  task_status: "not-started",
                },
              ],
            },

            // Module 2
            {
              name: "Color Theory",
              estimated_hours: 8,
              module_status : "not-started",
              tasks: [
                {
                  name: "Color Palette Analysis",
                  type: "write",
                  difficulty: "medium",
                  description:
                    "Analyze three color palettes and explain their emotional impact.",
                  task_status: "not-started",
                },
                {
                  name: "Create a Brand Color Scheme",
                  type: "practice",
                  difficulty: "hard",
                  description:
                    "Develop a cohesive brand color scheme for a fictional company, justifying color choices.",
                  task_status: "not-started",
                },
              ],
            },
          ],
        },

        // Phase 3
        {
          id: "crea_uiux",
          title: "Phase 3: UI/UX Design & Prototyping",
          duration_weeks: 5,
          estimated_weeks: 0,
          status: "not-started",
          modules: [
            // Module 1
            {
              name: "User Interface Design",
              estimated_hours: 12,
              module_status : "not-started",
              tasks: [
                {
                  name: "Design a Mobile App Wireframe",
                  type: "project",
                  difficulty: "medium",
                  description:
                    "Create wireframes for a mobile app focused on usability.",
                  task_status: "not-started",
                },
                {
                  name: "Usability Testing Exercise",
                  type: "practice",
                  difficulty: "medium",
                  description:
                    "Conduct a usability test and write a report on findings.",
                  task_status: "not-started",
                },
              ],
            },

            // Module 2
            {
              name: "Prototyping",
              estimated_hours: 10,
              module_status : "not-started",
              tasks: [
                {
                  name: "Build a Clickable Prototype",
                  type: "project",
                  difficulty: "hard",
                  description:
                    "Develop a clickable prototype for a website or app using Figma or similar tools.",
                  task_status: "not-started",
                },
              ],
            },
          ],
        },
      ],
    },

    // Personal Dev Road Map
    "personal-dev": {
      title: "Personal Development & Productivity",
      description:
        "Master habits, time management, and emotional intelligence.",
      phases: [
        // Phase 1
        {
          id: "pd_foundation",
          title: "Phase 1: Habit Stacking & Focus",
          duration_weeks: 2,
          estimated_weeks: 0,
          status: "not-started",
          modules: [
            // Module 1
            {
              name: "Time Blocking",
              estimated_hours: 5,
              module_status : "not-started",
              tasks: [
                {
                  name: "Implement a 30-minute 'Deep Work' session",
                  type: "practice",
                  difficulty: "easy",
                  description:
                    "Track 3 successful focused sessions using time blocking.",
                  task_status: "not-started",
                },
              ],
            },
          ],
        },

        // Phase 2
        {
          id: "pd_habit_formation",
          title: "Phase 2: Building Consistency & Awareness",
          duration_weeks: 3,
          estimated_weeks: 0,
          status: "not-started",
          modules: [
            // Module 1
            {
              name: "Habit Tracking",
              estimated_hours: 7,
              module_status : "not-started",
              tasks: [
                {
                  name: "Create a habit tracker",
                  type: "practice",
                  difficulty: "medium",
                  description:
                    "Design and use a habit tracker to monitor daily routines for 7 days.",
                  task_status: "not-started",
                },
                {
                  name: "Reflect on habit triggers",
                  type: "write",
                  difficulty: "medium",
                  description:
                    "Write about environmental and emotional triggers affecting your habits.",
                  task_status: "not-started",
                },
              ],
            },

            // Module 2
            {
              name: "Mindfulness & Focus",
              estimated_hours: 6,
              module_status : "not-started",
              tasks: [
                {
                  name: "Practice mindful breathing",
                  type: "practice",
                  difficulty: "easy",
                  description:
                    "Engage in 5-minute mindful breathing exercises daily for 5 days.",
                  task_status: "not-started",
                },
                {
                  name: "Focus journaling",
                  type: "write",
                  difficulty: "hard",
                  description:
                    "Journal daily distractions and devise strategies to minimize them over 3 days.",
                  task_status: "not-started",
                },
              ],
            },
          ],
        },

        // Phase 3
        {
          id: "pd_optimization",
          title: "Phase 3: Advanced Techniques & Habit Optimization",
          duration_weeks: 4,
          estimated_weeks: 0,
          status: "not-started",
          modules: [
            // Module 1
            {
              name: "Habit Stacking Mastery",
              estimated_hours: 8,
              module_status : "not-started",
              tasks: [
                {
                  name: "Design a personalized habit stack",
                  type: "write",
                  difficulty: "hard",
                  description:
                    "Create and implement a custom 5-step habit stacking routine for a week.",
                  task_status: "not-started",
                },
                {
                  name: "Experiment with habit stacking variations",
                  type: "practice",
                  difficulty: "hard",
                  description:
                    "Try different stacking routines to find what works best; document outcomes.",
                  task_status: "not-started",
                },
              ],
            },

            // Module 2
            {
              name: "Focus Optimization",
              estimated_hours: 7,
              module_status : "not-started",
              tasks: [
                {
                  name: "Tech distraction audit",
                  type: "write",
                  difficulty: "medium",
                  description:
                    "Analyze and reduce technology distractions in your work environment.",
                  task_status: "not-started",
                },
                {
                  name: "Long focus session",
                  type: "practice",
                  difficulty: "medium",
                  description:
                    "Complete one 90-minute uninterrupted deep work session.",
                  task_status: "not-started",
                },
              ],
            },
          ],
        },
      ],
    },
  };
