import { BookOpen, CheckSquare, LayoutDashboard, Settings, TrendingUp } from "lucide-react";

export const learningPaths = [
    {
      value: "technology",
      title: "Tech Career Accelerator",
      description: "Learn coding, web development, and tech skills",
    },
    {
      value: "communication",
      title: "Communication Mastery Track",
      description: "Master presentation, writing, and interpersonal skills",
    },
    {
      value: "business",
      title: "Business Strategy & Management",
      description: "Develop business acumen and entrepreneurial mindset",
    },
    {
      value: "creative",
      title: "Creative Design & Storytelling",
      description: "Explore design thinking, creativity, and visual skills",
    },
    {
      value: "personal-dev",
      title: "Personal Development & Productivity",
      description: "Build productivity, leadership, and life skills",
    },
  ];


   export const navItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
    { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
    { icon: BookOpen, label: 'Reflections', path: '/reflections' },
    { icon: TrendingUp, label: 'Skills', path: '/skills' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];
