// components/OnboardingGatekeeper.tsx
"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {  Loader } from "lucide-react";


const OnboardingGatekeeper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) {
      // If not loaded or not signed in, do nothing (Clerk will handle auth redirect)
      setIsChecking(false);
      return;
    }

    const checkAndSeedUser = async () => {
      const userId = user?.id;
      const userRef = doc(db, "users", userId);

      try {
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          // A. User exists in Firestore (Standard Login Check)
          const userData = userSnap.data();

          if (
            userData.onboardingComplete === false &&
            pathname !== "/onboarding"
          ) {
            // Redirect if not complete and user isn't already on the onboarding page
            router.push("/onboarding");
          }

          if (userData.onboardingComplete === true) {
            // Redirect if complete and user has already onboarded
           router.push("/dashboard");
          }
        } else {
          // B. User does NOT exist (First-Time Sign-Up/Sign-In)
          await setDoc(userRef, {
            clerkId: userId,
            email: user.emailAddresses[0].emailAddress,
            onboardingComplete: false, // Initial flag
            createdAt: new Date(),
          });

          // Force redirection to onboarding page after creation
          if (pathname !== "/onboarding") {
            router.push("/onboarding");
          }
        }
      } catch (error) {
        console.error(
          "Error during onboarding check/seeding:",
          error
        );
      } finally {
        setIsChecking(false);
      }
    };

    // Only run if the user is loaded and signed in
    if (isLoaded && isSignedIn) {
      checkAndSeedUser();
    }
  } , []);

  // Block rendering while checking status or if user state is unknown
  if (isChecking || !isLoaded) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-semibold italic text-gray-500/60 mb-6">
          Loading...
        </h1>
        <Loader className="w-12 h-12 text-orange-600/40 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
};

export default OnboardingGatekeeper;
