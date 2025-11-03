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
            // ⭐️ If onboarding is NOT complete, set state to false
            setOnboardingStatus(false);
          } else {
            // If onboarding IS complete, set state to true
            setOnboardingStatus(true);
          }
        } else {
          // This case shouldn't happen if the webhook worked, but handle it
          console.error("User document not found in Firestore!");
          setOnboardingStatus(false);
        }
      } else if (isLoaded && !isSignedIn) {
        // If not signed in, let Clerk handle the sign-in redirect
        setOnboardingStatus(true); // Don't block loading
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

  // If status is true, or user is not signed in (Clerk will redirect), render children
  return (
    <div className="min-h-screen bg-background flex w-full">
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
          fixed lg:static inset-y-0 left-0 z-40 w-64 bg-card border-r border-border/50 
          transform transition-transform duration-300 ease-in-out lg:transform-none
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border/50">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 group"
            >
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-orange-300" />
              </div>
              <span className="font-heading font-bold text-xl">
                SkillzBloom
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = path === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                    ${
                      isActive
                        ? "bg-primary text-primary-foreground font-medium shadow-sm"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }
                  `}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-border/50 space-y-2">
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="font-heading font-semibold text-primary">
                  <UserButton />
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">
                  {user?.fullName}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.emailAddresses[0].emailAddress}
                </p>
              </div>
            </div>
            <SignOutButton>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive"
              >
                <LogOut className="w-4 h-4" />
                Log out
              </Button>
            </SignOutButton>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="container max-w-7xl mx-auto p-4 lg:p-8">
          <div className="flex justify-end mb-6">
            <ModeToggle />
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
