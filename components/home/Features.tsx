import { Target, Brain, TrendingUp, BookOpen, MessageSquare, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Target,
    title: "Daily Skill Tasks",
    description: "Practice essential career skills with structured daily tasks designed for real-world success.",
    color: "from-primary to-primary-glow"
  },
  {
    icon: Brain,
    title: "AI Learning Coach",
    description: "Get personalized learning suggestions and feedback powered by advanced AI technology.",
    color: "from-accent to-primary"
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    description: "Visualize your growth with streaks, achievements, and detailed progress analytics.",
    color: "from-primary-glow to-accent"
  },
  {
    icon: BookOpen,
    title: "Learning Roadmap",
    description: "Follow structured skill goals and weekly plans tailored to your career aspirations.",
    color: "from-accent to-primary-glow"
  },
  {
    icon: MessageSquare,
    title: "Reflection & Notes",
    description: "Document your learning journey with reflections and build better learning habits.",
    color: "from-primary to-accent"
  },
  {
    icon: Award,
    title: "Achievements System",
    description: "Earn badges and rewards as you complete tasks and reach important milestones.",
    color: "from-primary-glow to-primary"
  }
];

const Features = () => {
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Everything You Need to{" "}
            <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
              Succeed
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A complete toolkit to build real-world skills, stay consistent, and prepare for your dream career.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-hover transition-smooth border-border/50 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-smooth`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
