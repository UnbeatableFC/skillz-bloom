import { UserPlus, Target, TrendingUp, Sparkles } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Sign Up & Set Goals",
    description: "Create your account and pick your learning focus areas to get started.",
    color: "bg-primary"
  },
  {
    icon: Target,
    title: "Complete Daily Tasks",
    description: "Practice essential skills through bite-sized, actionable daily tasks.",
    color: "bg-accent"
  },
  {
    icon: TrendingUp,
    title: "Track Your Progress",
    description: "Build streaks, earn badges, and see your skills grow over time.",
    color: "bg-primary-glow"
  },
  {
    icon: Sparkles,
    title: "Get AI Feedback",
    description: "Receive personalized suggestions to improve and reach your goals faster.",
    color: "bg-gradient-to-br from-primary to-accent"
  }
];

const HowItWorks = () => {
  return (
    <section className="py-24 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-lg bg-pr text-muted-foreground max-w-2xl mx-auto">
            Your journey to career success in four simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="relative animate-fade-in"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="text-center">
                {/* Icon container */}
                <div className={`w-20 h-20 ${step.color} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-soft hover:shadow-hover transition-smooth hover:scale-110`}>
                  <step.icon className="w-10 h-10 text-white" />
                </div>
                
                {/* Step number */}
                <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-soft">
                  {index + 1}
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </div>

              {/* Connector line (hidden on last item and mobile) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-1/2 w-full h-0.5 bg-linear-to-r from-primary/50 to-transparent" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
