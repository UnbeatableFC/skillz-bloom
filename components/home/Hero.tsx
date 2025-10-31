import { Button } from "@/components/ui/button";
import { Sparkles, Target, TrendingUp } from "lucide-react";
import Image from "next/image";


const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden  not-dark:gradient-soft">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-bounce" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="text-center lg:text-left animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Your Career Growth Partner</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Unlock Your{" "}
              <span className="bg-linear-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
                Potential
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
              One task at a time. Build essential skills, track your progress, and get AI-powered guidance for career success.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Button size="lg" className="group p-2">
                Get Started Free
                <Target className="ml-2 w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              </Button>
              <Button size="lg" variant="outline" className="border-2 p-2">
                Watch Demo
              </Button>
            </div>
            
            {/* Stats */}
            <div className="flex flex-wrap gap-8 justify-center lg:justify-start">
              <div>
                <div className="text-3xl font-bold text-primary">10K+</div>
                <div className="text-sm text-muted-foreground">Active Learners</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">50+</div>
                <div className="text-sm text-muted-foreground">Skill Paths</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">95%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Right image */}
          <div className="relative animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="relative rounded-3xl overflow-hidden shadow-hover">
              <Image
                width={500}
                height={500}
                src="/hero-image.jpg" 
                loading="eager"
                alt="Students learning and growing with SkillzBloom"
                className="w-full h-auto"
              />
              
              {/* Floating cards */}
              <div className="absolute top-8 -left-4 bg-card p-4 rounded-2xl shadow-soft animate-bounce duration-200 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-orange-300" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">7 Day Streak! 🔥</div>
                    <div className="text-xs text-muted-foreground">Keep it up!</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-8 -right-4 bg-card p-4 rounded-2xl shadow-soft animate-bounce duration-500" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-warm flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">New Badge Earned!</div>
                    <div className="text-xs text-muted-foreground">Task Master</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
