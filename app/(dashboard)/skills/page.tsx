// app/(dashboard)/skills/page.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  doc,
  onSnapshot,
  DocumentData,
  collection,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";
import { useUser } from "@clerk/nextjs";
import { db } from "@/lib/firebase";
import {
  SkillModule,
  UserRoadmap,
  RoadmapPhase,
  ManualSkill,
  CalculatedSkill,
} from "@/types/types";
import { ManualSkillSchema, manualSkillSchema } from "@/schema/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

// UI Imports
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle,
  Zap,
  Plus,
  Award,
  BarChart,
  Brain,
  CheckSquare,
  Trash2,
  LinkIcon,
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { SkillDetailsDialog } from "@/components/dashboard/skill-details-dialog";

// --- Add Skill Dialog Component (Bundled in for simplicity) ---
interface AddSkillDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isSubmitting: boolean;
  onSubmit: (data: ManualSkillSchema) => void;
  form: ReturnType<typeof useForm<ManualSkillSchema>>;
}

const AddSkillDialogComponent = ({
  open,
  onOpenChange,
  isSubmitting,
  onSubmit,
  form,
}: AddSkillDialogProps) => {
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
            <FormField
              control={form.control}
              name="evidenceLabel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Evidence Label (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., GitHub, Portfolio, YouTube"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="evidenceLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Evidence Link (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://github.com/your-repo"
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

// --- Main Skills Page Component ---
const SkillsPage = () => {
  const { user, isLoaded } = useUser();

  // State for our data
  const [roadmapData, setRoadmapData] = useState<DocumentData | null>(null);
  const [manualSkills, setManualSkills] = useState<ManualSkill[]>([]);
  const [isLoadingRoadmap, setIsLoadingRoadmap] = useState(true);
  const [isLoadingManual, setIsLoadingManual] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for our dialogs
  const [isAddSkillOpen, setIsAddSkillOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<CalculatedSkill | null>(
    null
  );

  // --- React Hook Form for the "Add Skill" Dialog ---
  const form = useForm<ManualSkillSchema>({
    resolver: zodResolver(manualSkillSchema),
    defaultValues: {
      name: "",
      description: "",
      evidenceLabel: "",
      evidenceLink: "",
    },
  });

  // --- Firestore: Add Manual Skill ---
  const onAddSkillSubmit = async (data: ManualSkillSchema) => {
    if (!user) {
      toast.error("You must be logged in to add a skill.");
      return;
    }
    setIsSubmitting(true);

    try {
      const skillsCollectionRef = collection(
        db,
        "users",
        user.id,
        "manualSkills"
      );

      await addDoc(skillsCollectionRef, {
        name: data.name,
        description: data.description || "",
        evidenceLabel: data.evidenceLabel || "",
        evidenceLink: data.evidenceLink || "",
        createdAt: serverTimestamp(),
      });

      toast.success("Manual skill added!");
      form.reset();
      setIsAddSkillOpen(false);
    } catch (error) {
      console.error("Error adding manual skill:", error);
      toast.error("Failed to add skill. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Firestore: Delete Manual Skill ---
  const handleDeleteSkill = async () => {
    if (!user?.id || !selectedSkillId) {
      toast.error("Error: No user or skill selected.");
      return;
    }

    try {
      const skillDocRef = doc(
        db,
        "users",
        user.id,
        "manualSkills",
        selectedSkillId
      );
      await deleteDoc(skillDocRef);
      toast.success("Skill successfully deleted.");
    } catch (error) {
      console.error("Error deleting skill:", error);
      toast.error("Failed to delete skill. Please try again.");
    } finally {
      setIsDeleteAlertOpen(false);
      setSelectedSkillId(null);
    }
  };

  // --- Data Fetching: Roadmap Skills (Effect 1) ---
  useEffect(() => {
    if (!isLoaded) return;
    if (!user?.id) {
      setIsLoadingRoadmap(false);
      return;
    }
    const roadmapRef = doc(db, "users", user.id, "userRoadmap", "current");
    const unsubscribe = onSnapshot(
      roadmapRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setRoadmapData(docSnap.data());
          setError(null);
        } else {
          setError("No roadmap found. Please complete onboarding.");
          setRoadmapData(null);
        }
        setIsLoadingRoadmap(false);
      },
      (err) => {
        console.error("Firestore roadmap error:", err);
        setError("Failed to fetch roadmap data.");
        setIsLoadingRoadmap(false);
      }
    );
    return () => unsubscribe();
  }, [user, isLoaded]);

  // --- Data Fetching: Manual Skills (Effect 2) ---
  useEffect(() => {
    if (!user?.id) {
      setIsLoadingManual(false);
      return;
    }
    const skillsCollectionRef = collection(
      db,
      "users",
      user.id,
      "manualSkills"
    );
    const q = query(skillsCollectionRef, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const skills: ManualSkill[] = [];
        querySnapshot.forEach((doc) => {
          skills.push({ id: doc.id, ...doc.data() } as ManualSkill);
        });
        setManualSkills(skills);
        setIsLoadingManual(false);
      },
      (err) => {
        console.error("Firestore manual skills error:", err);
        setError("Failed to fetch manual skills.");
        setIsLoadingManual(false);
      }
    );
    return () => unsubscribe();
  }, [user?.id]);

  // --- Skill Calculation Logic ---
  const { completedSkills, inProgressSkills, avgProficiency, expertSkillName } =
    useMemo(() => {
      const skills: {
        completedSkills: CalculatedSkill[];
        inProgressSkills: CalculatedSkill[];
      } = {
        completedSkills: [],
        inProgressSkills: [],
      };

      let proficiencyScores: number[] = [];
      let topSkill = { name: "N/A", proficiency: 0 };

      const roadmap = roadmapData?.roadmap as RoadmapPhase[];
      if (!roadmap) {
        return {
          ...skills,
          avgProficiency: 0,
          expertSkillName: "N/A",
        };
      }

      roadmap.forEach((phase) => {
        phase.modules.forEach((module) => {
          let completedTasks = 0;
          let totalTasks = module.tasks.length;
          if (totalTasks === 0) return; // Skip modules with no tasks

          module.tasks.forEach((task) => {
            if (task.task_status === "completed") {
              completedTasks++;
            }
          });

          // --- NEW PROFICIENCY LOGIC ---
          const proficiency = Math.round((completedTasks / totalTasks) * 100);
          proficiencyScores.push(proficiency);

          if (proficiency > topSkill.proficiency) {
            topSkill = { name: module.name, proficiency: proficiency };
          }
          // --- END NEW LOGIC ---

          const skillToAdd: CalculatedSkill = {
            ...module,
            phaseTitle: phase.title,
          };

          if (proficiency === 100) {
            skills.completedSkills.push(skillToAdd);
          } else if (completedTasks > 0) {
            skills.inProgressSkills.push(skillToAdd);
          }
        });
      });

      // Calculate average proficiency
      const totalProficiency = proficiencyScores.reduce((acc, p) => acc + p, 0);
      const avgProficiency =
        proficiencyScores.length > 0
          ? Math.round(totalProficiency / proficiencyScores.length)
          : 0;

      // --- THIS IS THE FIX ---
      return {
        completedSkills: skills.completedSkills, // Return the array from the 'skills' object
        inProgressSkills: skills.inProgressSkills, // Return the array from the 'skills' object
        avgProficiency,
        expertSkillName: topSkill.proficiency > 0 ? topSkill.name : "N/A",
      };
      // --- END OF FIX ---
    }, [roadmapData]);

  // --- Calculation: Tasks Completed Today ---
  const tasksCompletedToday = useMemo(() => {
    let count = 0;
    const roadmap = roadmapData?.roadmap as RoadmapPhase[];
    if (!roadmap) return 0;

    const today = new Date().toISOString().split("T")[0];

    roadmap.forEach((phase) => {
      phase.modules.forEach((module) => {
        module.tasks.forEach((task) => {
          if (
            task.task_status === "completed" &&
            task.completed_on?.startsWith(today)
          ) {
            count++;
          }
        });
      });
    });

    return count;
  }, [roadmapData]);

  // --- Render Logic ---
  const isLoading = isLoadingRoadmap || isLoadingManual;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-100 text-red-700 rounded-lg">
        {error}
      </div>
    );
  }

  const allCompletedSkillsCount = completedSkills.length + manualSkills.length;
  const allSkillsCount = allCompletedSkillsCount + inProgressSkills.length;

  return (
    <div className="space-y-8">
      {/* --- DIALOGS --- */}
      <AddSkillDialogComponent
        open={isAddSkillOpen}
        onOpenChange={setIsAddSkillOpen}
        isSubmitting={isSubmitting}
        onSubmit={onAddSkillSubmit}
        form={form}
      />

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              manually added skill.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedSkillId(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSkill}>
              Yes, delete it
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <SkillDetailsDialog
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        skill={selectedSkill}
      />

      {/* --- PAGE CONTENT --- */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Your Skills</h1>
        <Button onClick={() => setIsAddSkillOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Manual Skill
        </Button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/tasks" className="lg:col-span-1">
          <Card className="h-full hover:shadow-lg hover:border-primary transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Today's Practice
              </CardTitle>
              <CheckSquare className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {tasksCompletedToday} Task{tasksCompletedToday !== 1 ? "s" : ""}
              </div>
              <p className="text-xs text-muted-foreground">
                Completed today. Keep it up!
              </p>
            </CardContent>
          </Card>
        </Link>

        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Skills</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allSkillsCount}</div>
            <p className="text-xs text-muted-foreground">
              {allCompletedSkillsCount} acquired, {inProgressSkills.length} in
              progress
            </p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Proficiency
            </CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgProficiency}%</div>
            <p className="text-xs text-muted-foreground">
              Across all roadmap skills
            </p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Skill</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate">{expertSkillName}</div>
            <p className="text-xs text-muted-foreground">
              Your highest proficiency skill
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Acquired Skills Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <CheckCircle className="mr-2 text-green-500" /> Acquired Skills
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allCompletedSkillsCount === 0 ? (
            <Card className="border-dashed col-span-full">
              <CardContent className="p-6 text-center text-muted-foreground">
                No acquired skills yet. Keep working on your tasks or add one
                manually!
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Render skills from roadmap */}
              {completedSkills.map((skill) => (
                <Card
                  key={skill.name}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{skill.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      From Phase: {skill.phaseTitle} (Roadmap)
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Tasks Completed: {skill.tasks.length}
                    </p>
                    <Button
                      variant="link"
                      className="p-0 h-auto mt-2"
                      onClick={() => {
                        setSelectedSkill(skill);
                        setIsDetailsOpen(true);
                      }}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}

              {/* Render manual skills */}
              {manualSkills.map((skill) => (
                <Card
                  key={skill.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{skill.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {skill.description || "No description provided."}
                    </p>
                    <p className="text-xs text-muted-foreground pt-2">
                      (Manually Added)
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      {skill.evidenceLink ? (
                        <Button
                          asChild
                          variant="link"
                          className="p-0 h-auto text-primary"
                        >
                          <a
                            href={skill.evidenceLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <LinkIcon className="mr-1 h-3 w-3" />
                            {skill.evidenceLabel || "View Evidence"}
                          </a>
                        </Button>
                      ) : (
                        <div /> // Empty div to keep alignment
                      )}
                      <Button
                        variant="link"
                        className="p-0 h-auto text-red-500 hover:text-red-700"
                        onClick={() => {
                          setSelectedSkillId(skill.id);
                          setIsDeleteAlertOpen(true);
                        }}
                      >
                        <Trash2 className="mr-1 h-3 w-3" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          )}
        </div>
      </div>

      {/* In Progress Skills Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <Zap className="mr-2 text-yellow-500" /> Skills In Progress
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {inProgressSkills.length > 0 ? (
            inProgressSkills.map((skill) => (
              <Card
                key={skill.name}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <CardTitle className="text-lg">{skill.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    From Phase: {skill.phaseTitle}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Tasks Completed:{" "}
                    {
                      skill.tasks.filter((t) => t.task_status === "completed")
                        .length
                    }{" "}
                    / {skill.tasks.length}
                  </p>
                  <Link href="/tasks" passHref>
                    <Button variant="link" className="p-0 h-auto mt-2">
                      View Tasks
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="border-dashed col-span-full">
              <CardContent className="p-6 text-center text-muted-foreground">
                Start a task to see your progress here!
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillsPage;
