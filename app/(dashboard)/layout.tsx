"use client";

import { SignOutButton, UserButton, useUser } from "@clerk/nextjs";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { redirect, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut, Menu, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";

import { navItems } from "@/lib/data";
import ModeToggle from "@/components/general/mode-toggle";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoaded, isSignedIn } = useUser();
  const [onboardingStatus, setOnboardingStatus] = useState<
    boolean | null
  >(null);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const path = usePathname();

  useEffect(() => {
    const checkOnboarding = async () => {
      if (isLoaded && isSignedIn && user?.id) {
        const userRef = doc(db, "users", user.id);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          if (userData.onboardingComplete === false) {
            setOnboardingStatus(false);
          } else {
            setOnboardingStatus(true);
          }
        } else {
          console.error("User document not found in Firestore!");
          setOnboardingStatus(false);
        }
      } else if (isLoaded && !isSignedIn) {
        setOnboardingStatus(true);
      }
    };
    checkOnboarding();
  }, [isLoaded, isSignedIn, user?.id]);

  // Loading state while checking DB
  if (!isLoaded || onboardingStatus === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-semibold italic text-gray-500/60 mb-6">
          Loading User Profile...
        </h1>
        <Spinner className="w-12 h-12 text-orange-600/40 animate-spin" />
      </div>
    );
  }

  // Redirection Logic
  if (onboardingStatus === false) {
    redirect("/onboarding");
  }

  return (
    <div className="h-screen bg-background flex w-full overflow-hidden">
      {/* Mobile Menu Button */}
      <Button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-card border border-border/50 shadow-lg"
      >
        {sidebarOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <Menu className="w-5 h-5" />
        )}
      </Button>

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40 w-72 bg-card border-r border-border/50 
          transform transition-transform duration-300 ease-in-out lg:transform-none
          h-screen flex flex-col
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        {/* Logo - Fixed at top */}
        <div className="shrink-0 p-6 border-b border-border/50">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 group"
          >
            <div className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center group-hover:scale-105 transition-transform shadow-md">
              <Sparkles className="w-6 h-6 text-orange-300" />
            </div>
            <span className="font-heading font-bold text-xl bg-linear-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
              SkillzBloom
            </span>
          </Link>
        </div>

        {/* Navigation - Scrollable */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = path === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group
                    ${
                      isActive
                        ? "bg-primary text-primary-foreground font-medium shadow-sm scale-[1.02]"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-[1.02]"
                    }
                  `}
                >
                  <item.icon
                    className={`w-5 h-5 ${
                      isActive
                        ? ""
                        : "group-hover:scale-110 transition-transform"
                    }`}
                  />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Section - Fixed at bottom */}
        <div className="shrink-0 p-4 border-t border-border/50 bg-muted/30">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-background/50 mb-3">
            <div className="shrink-0">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10 rounded-full",
                  },
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate text-foreground">
                {user?.fullName || "User"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.emailAddresses[0]?.emailAddress || ""}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <SignOutButton>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-medium">Log out</span>
              </Button>
            </SignOutButton>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="w-full">
        <header className="w-full h-12 pt-3 pr-12">
          <div className="flex justify-end items-center">
            <ModeToggle />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto scro h-screen">
          <div className="min-h-full">
            <div className="container max-w-7xl mx-auto p-4 lg:p-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
