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
              module_status: "not-started",
              tasks: [
                {
                  name: "Variables & Control Flow Practice",
                  type: "practice",
                  difficulty: "easy",
                  description:
                    "Complete 5 small coding challenges on loops and conditionals.",
                  task_status: "not-started",
                  resources: [
                    "https://www.codecademy.com/learn/learn-python-3",
                    "https://javascript.info/intro",
                    "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/",
                    "https://www.w3schools.com/python/python_conditions.asp",
                  ],
                },
                {
                  name: "Git & Version Control Setup",
                  type: "read",
                  difficulty: "easy",
                  description:
                    "Set up a GitHub account and complete first commit.",
                  task_status: "not-started",
                  resources: [
                    "https://guides.github.com/introduction/git-handbook/",
                    "https://www.atlassian.com/git/tutorials/what-is-version-control",
                    "https://www.youtube.com/watch?v=RGOj5yH7evk",
                    "https://learngitbranching.js.org/",
                  ],
                },
              ],
            },

            // Module 2
            {
              name: "Cloud & Data Intro",
              estimated_hours: 8,
              module_status: "not-started",
              tasks: [
                {
                  name: "Firestore Document Structure Review",
                  type: "read",
                  difficulty: "medium",
                  description:
                    "Read documentation on NoSQL vs SQL and Firestore data models.",
                  task_status: "not-started",
                  resources: [
                    "https://firebase.google.com/docs/firestore/data-model",
                    "https://www.mongodb.com/nosql-explained/nosql-vs-sql",
                    "https://cloud.google.com/firestore/docs/concepts",
                    "https://www.youtube.com/watch?v=v_hR4K4auoQ",
                  ],
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
              module_status: "not-started",
              tasks: [
                {
                  name: "Build a Simple Component Library",
                  type: "project",
                  difficulty: "medium",
                  description:
                    "Create a functional component (e.g., a modal or notification banner) using React/Tailwind.",
                  task_status: "not-started",
                  resources: [
                    "https://react.dev/learn",
                    "https://tailwindcss.com/docs/utility-first",
                    "https://www.youtube.com/watch?v=bMknfKXIFA8",
                    "https://ui.shadcn.com/docs/components",
                    "https://www.patterns.dev/posts/react-component-patterns",
                  ],
                },
              ],
            },

            // Module 2
            {
              name: "Algorithms & Data Structures",
              estimated_hours: 15,
              module_status: "not-started",
              tasks: [
                {
                  name: "Practice 5 Array/String manipulation problems",
                  type: "practice",
                  difficulty: "medium",
                  description:
                    "Solve medium-level problems on a coding platform.",
                  task_status: "not-started",
                  resources: [
                    "https://leetcode.com/problemset/all/",
                    "https://www.hackerrank.com/domains/data-structures",
                    "https://www.youtube.com/watch?v=8hly31xKli0",
                    "https://visualgo.net/en",
                    "https://neetcode.io/practice",
                  ],
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
              module_status: "not-started",
              tasks: [
                {
                  name: "Finalize one major project for portfolio",
                  type: "project",
                  difficulty: "hard",
                  description:
                    "Polish code, write documentation, and deploy the project.",
                  task_status: "not-started",
                  resources: [
                    "https://www.freecodecamp.org/news/how-to-build-a-developer-portfolio-website/",
                    "https://vercel.com/docs",
                    "https://docs.github.com/en/pages",
                    "https://www.youtube.com/watch?v=OXGznpKZ_sA",
                    "https://readme.so/",
                  ],
                },
              ],
            },

            // Module 2
            {
              name: "Mock Technical Interviews",
              estimated_hours: 6,
              module_status: "not-started",
              tasks: [
                {
                  name: "Complete two 30-minute mock behavioral interviews (AI Feedback)",
                  type: "practice",
                  difficulty: "medium",
                  description:
                    "Focus on articulating project challenges and successes.",
                  task_status: "not-started",
                  resources: [
                    "https://www.pramp.com/",
                    "https://interviewing.io/",
                    "https://www.youtube.com/watch?v=1qw5ITr3k9E",
                    "https://www.techinterviewhandbook.org/behavioral-interview/",
                    "https://www.themuse.com/advice/star-interview-method",
                  ],
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
              module_status: "not-started",
              tasks: [
                {
                  name: "Summarize a TED Talk (Reflection)",
                  type: "write",
                  difficulty: "easy",
                  description:
                    "Watch a 15-minute TED Talk and write a 100-word summary and reflection.",
                  task_status: "not-started",
                  resources: [
                    "https://www.ted.com/talks",
                    "https://www.mindtools.com/CommSkll/ActiveListening.htm",
                    "https://www.youtube.com/watch?v=rzsVh8YwZEQ",
                    "https://hbr.org/2016/07/what-great-listeners-actually-do",
                  ],
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
              module_status: "not-started",
              tasks: [
                {
                  name: "Write a Clear Message",
                  type: "write",
                  difficulty: "medium",
                  description:
                    "Draft a 150-word message clearly conveying an idea, avoiding jargon.",
                  task_status: "not-started",
                  resources: [
                    "https://owl.purdue.edu/owl/general_writing/academic_writing/conciseness/index.html",
                    "https://www.grammarly.com/blog/clear-communication/",
                    "https://writingcenter.unc.edu/tips-and-tools/word-choice/",
                    "https://www.youtube.com/watch?v=eIho2S0ZahI",
                  ],
                },
                {
                  name: "Peer Feedback Exercise",
                  type: "practice",
                  difficulty: "medium",
                  description:
                    "Exchange messages with a peer and provide constructive feedback.",
                  task_status: "not-started",
                  resources: [
                    "https://www.edutopia.org/article/how-give-students-specific-feedback-improves-learning",
                    "https://hbr.org/2019/03/the-feedback-fallacy",
                    "https://www.ccl.org/articles/leading-effectively-articles/closing-the-gap-between-intent-and-impact/",
                    "https://www.youtube.com/watch?v=wtl5UrrgU8c",
                  ],
                },
              ],
            },

            // Module 2
            {
              name: "Non-Verbal Communication",
              estimated_hours: 4,
              module_status: "not-started",
              tasks: [
                {
                  name: "Observe and Note Body Language",
                  type: "practice",
                  difficulty: "easy",
                  description:
                    "Watch a 10-minute video on communication and note key non-verbal cues.",
                  task_status: "not-started",
                  resources: [
                    "https://www.verywellmind.com/types-of-nonverbal-communication-2795397",
                    "https://www.youtube.com/watch?v=1RPyANP_Y7Y",
                    "https://www.skillsyouneed.com/ips/nonverbal-communication.html",
                    "https://www.ted.com/talks/amy_cuddy_your_body_language_may_shape_who_you_are",
                  ],
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
              module_status: "not-started",
              tasks: [
                {
                  name: "Role-Play Conflict Scenarios",
                  type: "practice",
                  difficulty: "medium",
                  description:
                    "Participate in a role-play to practice managing conflict respectfully.",
                  task_status: "not-started",
                  resources: [
                    "https://www.mindtools.com/pages/article/newLDR_81.htm",
                    "https://www.youtube.com/watch?v=o2O7z8VE_dE",
                    "https://www.helpguide.org/articles/relationships-communication/conflict-resolution-skills.htm",
                    "https://www.pon.harvard.edu/daily/conflict-resolution/types-conflict/",
                  ],
                },
                {
                  name: "Reflect on a Past Conflict",
                  type: "write",
                  difficulty: "medium",
                  description:
                    "Write 200 words reflecting on a past conflict and lessons learned.",
                  task_status: "not-started",
                  resources: [
                    "https://www.psychologytoday.com/us/blog/resolution-not-conflict/201303/what-is-conflict-resolution",
                    "https://positivepsychology.com/conflict-resolution/",
                    "https://www.edutopia.org/blog/restorative-justice-resources-matt-davis",
                    "https://greatergood.berkeley.edu/article/item/how_to_have_difficult_conversations",
                  ],
                },
              ],
            },

            // Module 2
            {
              name: "Emotional Intelligence",
              estimated_hours: 5,
              module_status: "not-started",
              tasks: [
                {
                  name: "Emotional Awareness Journal",
                  type: "write",
                  difficulty: "easy",
                  description:
                    "Keep a journal for 3 days noting your emotional responses to triggers.",
                  task_status: "not-started",
                  resources: [
                    "https://www.verywellmind.com/what-is-emotional-intelligence-2795423",
                    "https://www.youtube.com/watch?v=Y7m9eNoB3NU",
                    "https://hbr.org/2017/02/emotional-intelligence-has-12-elements-which-do-you-need-to-work-on",
                    "https://positivepsychology.com/emotional-intelligence-frameworks/",
                  ],
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
              module_status: "not-started",
              tasks: [
                {
                  name: "SWOT Analysis of a major company",
                  type: "write",
                  difficulty: "medium",
                  description:
                    "Complete a Strengths, Weaknesses, Opportunities, and Threats analysis.",
                  task_status: "not-started",
                  resources: [
                    "https://www.mindtools.com/pages/article/newTMC_05.htm",
                    "https://www.youtube.com/watch?v=JXXHqM6RzZQ",
                    "https://www.investopedia.com/terms/s/swot.asp",
                    "https://www.businessnewsdaily.com/4245-swot-analysis.html",
                    "https://www.smartsheet.com/what-swot-analysis-and-how-do-one",
                  ],
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
              module_status: "not-started",
              tasks: [
                {
                  name: "Process Mapping",
                  type: "write",
                  difficulty: "medium",
                  description:
                    "Map the core operations process of a chosen business.",
                  task_status: "not-started",
                  resources: [
                    "https://www.lucidchart.com/pages/process-mapping",
                    "https://www.youtube.com/watch?v=7IMz8ooGEFs",
                    "https://www.processexcellencenetwork.com/business-process-management-bpm/articles/what-is-process-mapping",
                    "https://asq.org/quality-resources/process-mapping",
                  ],
                },
                {
                  name: "Cost Control Exercise",
                  type: "practice",
                  difficulty: "hard",
                  description:
                    "Analyze methods to reduce operational costs without compromising quality.",
                  task_status: "not-started",
                  resources: [
                    "https://www.investopedia.com/terms/c/cost-control.asp",
                    "https://www.youtube.com/watch?v=9g8P3b6Ydw0",
                    "https://www.netsuite.com/portal/resource/articles/financial-management/cost-reduction-strategies.shtml",
                    "https://www.accountingtools.com/articles/cost-control.html",
                  ],
                },
              ],
            },

            // Module 2
            {
              name: "Marketing Basics",
              estimated_hours: 8,
              module_status: "not-started",
              tasks: [
                {
                  name: "Marketing Mix Analysis",
                  type: "write",
                  difficulty: "medium",
                  description:
                    "Analyze the 4Ps (Product, Price, Place, Promotion) of a selected brand.",
                  task_status: "not-started",
                  resources: [
                    "https://www.investopedia.com/terms/f/four-ps.asp",
                    "https://www.youtube.com/watch?v=Mco8vBAwOmA",
                    "https://www.smartinsights.com/marketing-planning/marketing-models/how-to-use-the-7ps-marketing-mix/",
                    "https://blog.hubspot.com/marketing/marketing-mix-4ps",
                  ],
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
              module_status: "not-started",
              tasks: [
                {
                  name: "Cash Flow Statement Preparation",
                  type: "write",
                  difficulty: "hard",
                  description:
                    "Prepare a basic cash flow statement for a small business.",
                  task_status: "not-started",
                  resources: [
                    "https://www.investopedia.com/investing/what-is-a-cash-flow-statement/",
                    "https://www.youtube.com/watch?v=7c_XO3Ouzts",
                    "https://www.accountingcoach.com/cash-flow-statement/explanation",
                    "https://corporatefinanceinstitute.com/resources/accounting/cash-flow-statement/",
                  ],
                },
                {
                  name: "Budget Planning Exercise",
                  type: "practice",
                  difficulty: "medium",
                  description:
                    "Create a simple budget plan to manage monthly expenses.",
                  task_status: "not-started",
                  resources: [
                    "https://www.nerdwallet.com/article/finance/how-to-budget",
                    "https://www.youtube.com/watch?v=7lHNMGoACdQ",
                    "https://www.investopedia.com/articles/pf/06/budgeting.asp",
                    "https://mint.intuit.com/budgeting-3",
                  ],
                },
              ],
            },

            // Module 2
            {
              name: "Human Resource Basics",
              estimated_hours: 7,
              module_status: "not-started",
              tasks: [
                {
                  name: "Recruitment Strategy",
                  type: "write",
                  difficulty: "medium",
                  description:
                    "Outline a recruitment plan for a new team member.",
                  task_status: "not-started",
                  resources: [
                    "https://www.shrm.org/resourcesandtools/tools-and-samples/toolkits/pages/recruitmentstrategies.aspx",
                    "https://www.youtube.com/watch?v=yxAX7s5onb0",
                    "https://www.indeed.com/hire/c/info/recruitment-strategies",
                    "https://www.bamboohr.com/resources/guides/recruiting-strategies",
                  ],
                },
                {
                  name: "Employee Motivation Reflection",
                  type: "write",
                  difficulty: "easy",
                  description:
                    "Reflect on factors that motivate employees to perform effectively.",
                  task_status: "not-started",
                  resources: [
                    "https://www.verywellmind.com/what-is-motivation-2795378",
                    "https://www.youtube.com/watch?v=LFlvor6ZHdY",
                    "https://www.psychologytoday.com/us/basics/motivation",
                    "https://hbr.org/2018/03/employee-motivation-a-powerful-new-model",
                  ],
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
              module_status: "not-started",
              tasks: [
                {
                  name: "Critique 3 website layouts",
                  type: "write",
                  difficulty: "easy",
                  description:
                    "Analyze three websites based on use of color, contrast, and spacing.",
                  task_status: "not-started",
                  resources: [
                    "https://www.interaction-design.org/literature/article/visual-hierarchy-organizing-content-to-follow-natural-eye-movement-patterns",
                    "https://www.youtube.com/watch?v=qZWDJqY27bw",
                    "https://99designs.com/blog/tips/6-principles-of-visual-hierarchy/",
                    "https://www.awwwards.com/",
                  ],
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
              module_status: "not-started",
              tasks: [
                {
                  name: "Identify Typeface Families",
                  type: "write",
                  difficulty: "medium",
                  description:
                    "Research and write about 5 typeface families and their use cases.",
                  task_status: "not-started",
                  resources: [
                    "https://www.fonts.com/content/learning/fontology/level-1/type-anatomy",
                    "https://www.youtube.com/watch?v=sByzHoiYFX0",
                    "https://practicaltypography.com/",
                    "https://fonts.google.com/knowledge",
                  ],
                },
                {
                  name: "Create a Typographic Poster",
                  type: "practice",
                  difficulty: "hard",
                  description:
                    "Design a poster using typography to convey a message effectively, focusing on readability and style.",
                  task_status: "not-started",
                  resources: [
                    "https://www.canva.com/learn/typography-design/",
                    "https://www.youtube.com/watch?v=QrNi9FmdlxY",
                    "https://www.creativebloq.com/typography/free-typography-tutorials-1132693",
                    "https://www.figma.com/blog/typography-tips-for-beginners/",
                  ],
                },
              ],
            },

            // Module 2
            {
              name: "Color Theory",
              estimated_hours: 8,
              module_status: "not-started",
              tasks: [
                {
                  name: "Color Palette Analysis",
                  type: "write",
                  difficulty: "medium",
                  description:
                    "Analyze three color palettes and explain their emotional impact.",
                  task_status: "not-started",
                  resources: [
                    "https://www.canva.com/colors/color-wheel/",
                    "https://www.youtube.com/watch?v=_2LLXnUdUIc",
                    "https://www.colormatters.com/color-and-design/basic-color-theory",
                    "https://coolors.co/",
                  ],
                },
                {
                  name: "Create a Brand Color Scheme",
                  type: "practice",
                  difficulty: "hard",
                  description:
                    "Develop a cohesive brand color scheme for a fictional company, justifying color choices.",
                  task_status: "not-started",
                  resources: [
                    "https://www.designhill.com/design-blog/brand-color-guide/",
                    "https://www.youtube.com/watch?v=KMS3VwGh3HY",
                    "https://www.smashingmagazine.com/2010/01/color-theory-for-designers-part-1-the-meaning-of-color/",
                    "https://color.adobe.com/create/color-wheel",
                  ],
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
              module_status: "not-started",
              tasks: [
                {
                  name: "Design a Mobile App Wireframe",
                  type: "project",
                  difficulty: "medium",
                  description:
                    "Create wireframes for a mobile app focused on usability.",
                  task_status: "not-started",
                  resources: [
                    "https://www.nngroup.com/articles/wireflows/",
                    "https://www.youtube.com/watch?v=KdfO_e0yK-g",
                    "https://balsamiq.com/learn/articles/what-are-wireframes/",
                    "https://www.figma.com/templates/wireframe-kits/",
                  ],
                },
                {
                  name: "Usability Testing Exercise",
                  type: "practice",
                  difficulty: "medium",
                  description:
                    "Conduct a usability test and write a report on findings.",
                  task_status: "not-started",
                  resources: [
                    "https://www.nngroup.com/articles/usability-testing-101/",
                    "https://www.youtube.com/watch?v=BrIk37bXbNs",
                    "https://www.usability.gov/how-to-and-tools/methods/usability-testing.html",
                    "https://maze.co/guides/usability-testing/",
                  ],
                },
              ],
            },

            // Module 2
            {
              name: "Prototyping",
              estimated_hours: 10,
              module_status: "not-started",
              tasks: [
                {
                  name: "Build a Clickable Prototype",
                  type: "project",
                  difficulty: "hard",
                  description:
                    "Develop a clickable prototype for a website or app using Figma or similar tools.",
                  task_status: "not-started",
                  resources: [
                    "https://www.figma.com/prototyping/",
                    "https://www.youtube.com/watch?v=jk1T0CdLxwU",
                    "https://www.interaction-design.org/literature/article/prototyping-learn-eight-common-methods-and-best-practices",
                    "https://www.uxpin.com/studio/blog/guide-to-prototyping-in-figma/",
                  ],
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
              module_status: "not-started",
              tasks: [
                {
                  name: "Implement a 30-minute 'Deep Work' session",
                  type: "practice",
                  difficulty: "easy",
                  description:
                    "Track 3 successful focused sessions using time blocking.",
                  task_status: "not-started",
                  resources: [
                    "https://todoist.com/productivity-methods/time-blocking",
                    "https://www.youtube.com/watch?v=WXBA4eWskrc",
                    "https://www.calnewport.com/books/deep-work/",
                    "https://zapier.com/blog/time-blocking/",
                  ],
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
              module_status: "not-started",
              tasks: [
                {
                  name: "Create a habit tracker",
                  type: "practice",
                  difficulty: "medium",
                  description:
                    "Design and use a habit tracker to monitor daily routines for 7 days.",
                  task_status: "not-started",
                  resources: [
                    "https://jamesclear.com/habit-tracker",
                    "https://www.youtube.com/watch?v=mNeXuCYiE0U",
                    "https://habitica.com/",
                    "https://www.notion.so/templates/habit-tracker",
                  ],
                },
                {
                  name: "Reflect on habit triggers",
                  type: "write",
                  difficulty: "medium",
                  description:
                    "Write about environmental and emotional triggers affecting your habits.",
                  task_status: "not-started",
                  resources: [
                    "https://jamesclear.com/three-steps-habit-change",
                    "https://www.youtube.com/watch?v=W1eYrhGeffc",
                    "https://www.psychologytoday.com/us/blog/creatures-habit/201504/how-break-bad-habit",
                    "https://www.verywellmind.com/what-is-a-habit-2795922",
                  ],
                },
              ],
            },

            // Module 2
            {
              name: "Mindfulness & Focus",
              estimated_hours: 6,
              module_status: "not-started",
              tasks: [
                {
                  name: "Practice mindful breathing",
                  type: "practice",
                  difficulty: "easy",
                  description:
                    "Engage in 5-minute mindful breathing exercises daily for 5 days.",
                  task_status: "not-started",
                  resources: [
                    "https://www.headspace.com/meditation/breathing-exercises",
                    "https://www.youtube.com/watch?v=SEfs5TJZ6Nk",
                    "https://www.mindful.org/mindfulness-how-to-do-it/",
                    "https://www.calm.com/blog/breathing-exercises",
                  ],
                },
                {
                  name: "Focus journaling",
                  type: "write",
                  difficulty: "hard",
                  description:
                    "Journal daily distractions and devise strategies to minimize them over 3 days.",
                  task_status: "not-started",
                  resources: [
                    "https://www.developgoodhabits.com/focus-journal/",
                    "https://www.youtube.com/watch?v=SqGRnlXplx0",
                    "https://zenhabits.net/simple-productivity-the-zenbits-way/",
                    "https://www.psychologytoday.com/us/blog/changepower/201811/7-ways-improve-your-focus-and-concentration",
                  ],
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
              module_status: "not-started",
              tasks: [
                {
                  name: "Design a personalized habit stack",
                  type: "write",
                  difficulty: "hard",
                  description:
                    "Create and implement a custom 5-step habit stacking routine for a week.",
                  task_status: "not-started",
                  resources: [
                    "https://jamesclear.com/habit-stacking",
                    "https://www.youtube.com/watch?v=Wcs2PFz5q6g",
                    "https://www.developgoodhabits.com/habit-stacking/",
                    "https://www.lifehack.org/849609/habit-stacking",
                  ],
                },
                {
                  name: "Experiment with habit stacking variations",
                  type: "practice",
                  difficulty: "hard",
                  description:
                    "Try different stacking routines to find what works best; document outcomes.",
                  task_status: "not-started",
                  resources: [
                    "https://alifeofproductivity.com/habit-stacking/",
                    "https://www.youtube.com/watch?v=ks1TY7dbHxk",
                    "https://tinybuddha.com/blog/how-to-create-lasting-change-through-habit-stacking/",
                    "https://www.artofmanliness.com/character/behavior/get-1-better-every-day-the-kaizen-approach-to-self-improvement/",
                  ],
                },
              ],
            },

            // Module 2
            {
              name: "Focus Optimization",
              estimated_hours: 7,
              module_status: "not-started",
              tasks: [
                {
                  name: "Tech distraction audit",
                  type: "write",
                  difficulty: "medium",
                  description:
                    "Analyze and reduce technology distractions in your work environment.",
                  task_status: "not-started",
                  resources: [
                    "https://www.rescuetime.com/blog/digital-distractions",
                    "https://www.youtube.com/watch?v=wf2VxeIm1no",
                    "https://freedom.to/blog/how-to-avoid-digital-distractions/",
                    "https://www.nirandfar.com/indistractable/",
                  ],
                },
                {
                  name: "Long focus session",
                  type: "practice",
                  difficulty: "medium",
                  description:
                    "Complete one 90-minute uninterrupted deep work session.",
                  task_status: "not-started",
                  resources: [
                    "https://www.calnewport.com/blog/2013/12/21/deep-habits-the-importance-of-planning-every-minute-of-your-work-day/",
                    "https://www.youtube.com/watch?v=b6xQpoVgN68",
                    "https://todoist.com/inspiration/deep-work",
                    "https://alifeofproductivity.com/book-notes-deep-work-cal-newport/",
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  };