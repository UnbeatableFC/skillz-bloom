// components/dashboard/add-skill-dialog.tsx
"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "@clerk/nextjs";
import { db } from "@/lib/firebase"; // Your colleague set this up
import { collection, addDoc, serverTimestamp } from "firebase/firestore"; // Firestore functions
import { toast } from "sonner";

import { ManualSkillSchema, manualSkillSchema } from "@/schema/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Using Textarea for description
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Spinner } from "../ui/spinner";

// We pass `open` and `onOpenChange` so the parent (Skills page) can control it
interface AddSkillDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSkillAdded: () => void; // A function to tell the parent to refetch data
}

export const AddSkillDialog = ({
  open,
  onOpenChange,
  onSkillAdded,
}: AddSkillDialogProps) => {
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ManualSkillSchema>({
    resolver: zodResolver(manualSkillSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (data: ManualSkillSchema) => {
    if (!user) {
      toast.error("You must be logged in to add a skill.");
      return;
    }
    setIsSubmitting(true);

    try {
      // --- THIS IS THE FIRESTORE PART ---
      // 1. Get a "reference" to the new collection path
      // This path is: users/{the-user-id}/manualSkills
      const skillsCollectionRef = collection(
        db,
        "users",
        user.id,
        "manualSkills"
      );

      // 2. Add a new document to that collection
      await addDoc(skillsCollectionRef, {
        name: data.name,
        description: data.description || "",
        createdAt: serverTimestamp(), // Asks Firestore to add the current time
      });
      // --- END OF FIRESTORE PART ---

      toast.success("Manual skill added!");
      form.reset(); // Clear the form
      onSkillAdded(); // Tell the parent to refetch
      onOpenChange(false); // Close the dialog
    } catch (error) {
      console.error("Error adding manual skill:", error);
      toast.error("Failed to add skill. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Manual Skill</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skill Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Public Speaking" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., 'Gave a presentation at...' or 'Read...' "
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Spinner className="mr-2 h-4 w-4" /> : null}
                Save Skill
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
