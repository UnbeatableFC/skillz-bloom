"use client";

import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Menu, X, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import ModeToggle from "../general/mode-toggle";


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-orange-300" />
            </div>
            <div>
              <div className="font-bold text-xl font-heading">
                SkillzBloom
              </div>
              <div className="text-xs text-muted-foreground hidden sm:block">
                Unlock Your Potential
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="#features"
              className="text-sm font-medium hover:text-primary transition-smooth"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium hover:text-primary transition-smooth"
            >
              How It Works
            </Link>
            <Link
              href="#testimonials"
              className="text-sm font-medium hover:text-primary transition-smooth"
            >
              Success Stories
            </Link>
            <ModeToggle />
            <SignInButton>
              <Button variant="ghost" size="sm" className="hover:scale-110 cursor-pointer">
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton>
              <Button size="sm" className="shadow-soft">
                Get Started
              </Button>
            </SignUpButton>
          </div>

          {/* Mobile menu button */}
          <Button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-smooth"
          >
            {isOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 animate-fade-in">
            <div className="flex flex-col gap-4">
              <Link
                href="#features"
                className="text-sm font-medium hover:text-primary transition-smooth py-2"
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="text-sm font-medium hover:text-primary transition-smooth py-2"
              >
                How It Works
              </Link>
              <Link
                href="#testimonials"
                className="text-sm font-medium hover:text-primary transition-smooth py-2"
              >
                Success Stories
              </Link>
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                <SignInButton>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                  >
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton>
                  <Button size="sm" className="w-full">
                    Get Started
                  </Button>
                </SignUpButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
