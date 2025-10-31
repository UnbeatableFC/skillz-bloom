"use client";

import { useUser } from "@clerk/nextjs";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import OnboardingForm from "@/components/onboarding/onboarding-form";
import { useState } from "react";
import { toast } from "sonner";
import { OnboardingSchema } from "@/schema/schemas";
import { handleOnboardingSubmitIntegration } from "@/hooks/handleOnboardingSubmitIntegration";

export default function OnboardingPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter();

  if (!isLoaded) return <div>Loading...</div>;

  if (!user || !isSignedIn) {
    router.push("/sign-in");
    return null;
  }

  const handleOnboardingSubmit = async (data: OnboardingSchema) => {
    if (!user?.id) return;
    setIsSubmitting(true);

    try {
      await handleOnboardingSubmitIntegration(data, db, user?.id);
      toast.success(
        "Onboarding Successful! Your personalized plan is ready."
      );
      router.push("/dashboard");
    } catch (error) {
      console.error(
        "Failed to complete onboarding and generate roadmap:",
        error
      );
      toast.error(
        "An error occurred during submission. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      {/* Your form fields go here */}
      <OnboardingForm
        isSubmitting={isSubmitting}
        onSubmit={handleOnboardingSubmit}
      />
      {/* <p className="mb-4">Clerk User ID: {user?.id}</p> */}
    </div>
  );
}
