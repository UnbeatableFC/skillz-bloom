"use client";

import React, { useState, useEffect } from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";
import {
  User,
  BookOpen,
  Bell,
  Database,
  Info,
  LogOut,
  Save,
  Loader2,
  RefreshCw,
  Download,
  Trash2,
  Upload,
  Moon,
  Sun,
  Monitor,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  LearningPathKey,
  RoadmapData,
  TaskDensityType,
  ThemeTypes,
  UserProfile,
} from "@/types/types";
import { learningPaths } from "@/lib/data";

// User profile interface

const SettingsPage = () => {
  const { user, isLoaded } = useUser();
  const { client, session } = useClerk();
  const router = useRouter();
  const userId = user?.id;

  // State management
  const [activeTab, setActiveTab] = useState("profile");
  const [userProfile, setUserProfile] = useState<
    UserProfile  | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    age: 0,
    username: "",
    email: "",
    profilePicture: "",
    careerGoal: "",
    learningPath: "" as LearningPathKey,
    skills: [] as string[],
  });

  // Preferences
  const [preferences, setPreferences] = useState({
    theme: "system" as "light" | "dark" | "system",
    taskDensity: "medium" as "low" | "medium" | "high",
    emailNotifications: true,
    inAppNotifications: true,
  });
  const learningPathsArray = Object.fromEntries(
    learningPaths.map((path) => [path.value, path])
  );
  // Modal states
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPathChangeDialog, setShowPathChangeDialog] =
    useState(false);
  const [newLearningPath, setNewLearningPath] =
    useState<LearningPathKey | null>(null);

  // Fetch user profile from Firebase
  useEffect(() => {
    if (!userId) return;

    const fetchUserProfile = async () => {
      try {
        const userDocRef = doc(db, "users", userId);
        const roadmapRef = doc(
          db,
          "users",
          userId,
          "userRoadmap",
          "current"
        );

        const [userDoc, roadmapDoc] = await Promise.all([
          getDoc(userDocRef),
          getDoc(roadmapRef),
        ]);

        // --- Scenario 1: User Profile Exists (Roadmap may or may not exist) ---
        if (userDoc.exists()) {
          const data = userDoc.data() as UserProfile;

          // Extract careerGoal safely (defaults to empty string if roadmapDoc doesn't exist)
          const careerGoal = roadmapDoc.exists()
            ? (roadmapDoc.data() as RoadmapData).careerGoal || ""
            : "";

          setUserProfile(data);

          // Populate form (using 'name' for the form field, based on your previous code)
          setFormData({
            name: data.fullName || "", // Assuming form key is 'name'
            username: data.username || "",
            email:
              data.email ||
              user.primaryEmailAddress?.emailAddress ||
              "",
            age: data.age || 0,
            profilePicture:
              data.profilePicture || user.imageUrl || "",

            careerGoal: careerGoal, // Safely extracted from roadmapDoc or set to ""

            learningPath:
              data.learningPath || ("" as LearningPathKey),
            skills: data.skills || [],
          });

          // Populate preferences
          if (data.preferences) {
            setPreferences(data.preferences);
          }
        }

        // --- Scenario 2: User Profile Does NOT Exist (First Time Login) ---
        else {
          // Create initial profile from Clerk data, including default state fields
          const initialProfile: UserProfile = {
            email: user.primaryEmailAddress?.emailAddress || "",
            clerkId: userId,
            createdAt: new Date().toISOString(),
            profilePicture: user.imageUrl,
            fullName: user.fullName || "",
            username: user.username || "",

            // IMPORTANT: Include required default fields for new users
            onboardingCompleted: false,
            learningPath: "" as LearningPathKey,
            skills: [],
          };

          await setDoc(userDocRef, initialProfile);
          setUserProfile(initialProfile);

          // Use functional update to populate form data
          setFormData((f) => ({
            ...f,
            email: initialProfile.email,
            profilePicture: initialProfile.profilePicture || "",
            name: initialProfile.fullName || "", // Using fullName consistently
            username: initialProfile.username || "",
            // Set other defaults if your form state requires them
            careerGoal: "",
            age: 0,
            learningPath: "" as LearningPathKey,
            skills: [],
          }));
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [
    userId,
    user?.fullName,
    user?.imageUrl,
    user?.primaryEmailAddress,
    user?.username,
    // The dependency array is now clean and correct!
  ]);

  // Sync with Clerk when profile updates
  const syncWithClerk = async (updates: Partial<UserProfile>) => {
    try {
      if (updates.fullName && user) {
        await user.update({
          firstName: updates.fullName.split(" ")[0],
          lastName: updates.fullName.split(" ").slice(1).join(" "),
        });
      }

      if (updates.username && user) {
        await user.update({
          username: updates.username,
        });
      }
    } catch (error) {
      console.error("Error syncing with Clerk:", error);
      toast.error(
        "Profile updated in database, but Clerk sync failed"
      );
    }
  };

  // Handle profile image upload
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setIsUploading(true);

    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;

        // Update Clerk profile image
        if (user) {
          await user.setProfileImage({ file });
          toast.success("Profile picture updated!");
        }

        setFormData({ ...formData, profilePicture: base64String });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  // Save profile changes
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setIsSaving(true);

    try {
      // --- 1. Updates for the main User Document (/users/userId) ---
      const userUpdates: Partial<UserProfile> = {
        fullName: formData.name,
        username: formData.username,
        profilePicture: formData.profilePicture,
        skills: formData.skills,
        // NOTE: careerGoal is removed from here as it lives in the roadmap doc
      };

      const userDocRef = doc(db, "users", userId);
      await updateDoc(userDocRef, userUpdates);

      // --- 2. Updates for the Roadmap Document (/users/userId/userRoadmap/current) ---
      // This is where careerGoal and potentially other roadmap-related fields live.
      const roadmapUpdates = {
        careerGoal: formData.careerGoal,
        // Add any other fields that live in the roadmap document here
      };

      const roadmapRef = doc(
        db,
        "users",
        userId,
        "userRoadmap",
        "current"
      );

      // Use setDoc with merge: true to update the document,
      // as updateDoc will fail if the roadmap document doesn't exist yet.
      await setDoc(roadmapRef, roadmapUpdates, { merge: true });

      // --- 3. Local State and Cleanup ---

      // Sync with Clerk (assuming this only uses fields from the main user doc)
      await syncWithClerk(userUpdates);

      // Update local state by merging updates from both documents
      setUserProfile({
        ...userProfile!,
        ...userUpdates,
        careerGoal: formData.careerGoal, // Update local careerGoal from form
      });

      toast.success("Profile and Career Goal updated successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  // Save preferences
  const handleSavePreferences = async () => {
    if (!userId) return;

    setIsSaving(true);

    try {
      const userDocRef = doc(db, "users", userId);
      await updateDoc(userDocRef, { preferences });

      toast.success("Preferences saved successfully!");
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast.error("Failed to save preferences");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle learning path change
  const handleLearningPathChange = (path: LearningPathKey) => {
    setNewLearningPath(path);
    setShowPathChangeDialog(true);
  };

  const confirmLearningPathChange = async () => {
    if (!userId || !newLearningPath) return;

    setIsSaving(true);
    setShowPathChangeDialog(false);

    try {
      // Update user profile
      const userDocRef = doc(db, "users", userId);
      await updateDoc(userDocRef, {
        learningPath: newLearningPath,
        onboardingComplete: false,
      });

      // Archive old roadmap (optional)
      const roadmapRef = doc(
        db,
        "users",
        userId,
        "userRoadmap",
        "current"
      );
      const oldRoadmap = await getDoc(roadmapRef);

      if (oldRoadmap.exists()) {
        const archiveRef = doc(
          db,
          "users",
          userId,
          "userRoadmap",
          `archive_${Date.now()}`
        );
        await setDoc(archiveRef, {
          ...oldRoadmap.data(),
          archivedAt: new Date().toISOString(),
        });
      }

      // Delete current roadmap to trigger regeneration
      await deleteDoc(roadmapRef);

      setFormData({ ...formData, learningPath: newLearningPath });
      toast.success(
        "Learning path updated! Please complete onboarding to generate your new roadmap."
      );

      // Redirect to onboarding
      router.push("/onboarding");
    } catch (error) {
      console.error("Error changing learning path:", error);
      toast.error("Failed to change learning path");
    } finally {
      setIsSaving(false);
    }
  };

  // Export data
  const handleExportData = async () => {
    if (!userId) return;

    try {
      const userDocRef = doc(db, "users", userId);
      const roadmapRef = doc(
        db,
        "users",
        userId,
        "userRoadmap",
        "current"
      );

      const [userDoc, roadmapDoc] = await Promise.all([
        getDoc(userDocRef),
        getDoc(roadmapRef),
      ]);

      const exportData = {
        profile: userDoc.data(),
        roadmap: roadmapDoc.data(),
        exportedAt: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `launchpad-data-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success("Data exported successfully!");
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.error("Failed to export data");
    }
  };

  // Reset progress
  const handleResetProgress = async () => {
    if (!userId) return;

    setShowResetDialog(false);
    setIsSaving(true);

    try {
      const roadmapRef = doc(
        db,
        "users",
        userId,
        "userRoadmap",
        "current"
      );
      await deleteDoc(roadmapRef);

      toast.success(
        "Progress reset successfully! Redirecting to onboarding..."
      );
      setTimeout(() => router.push("/onboarding"), 2000);
    } catch (error) {
      console.error("Error resetting progress:", error);
      toast.error("Failed to reset progress");
    } finally {
      setIsSaving(false);
    }
  };

  // Delete account
  const handleDeleteAccount = async () => {
    if (!userId || !user || !session) return;

    setShowDeleteDialog(false);
    setIsSaving(true);

    try {
      // 1. **CLERK RE-AUTHORIZATION STEP**
      // This prompts the user to re-verify their identity (e.g., password).
      // If successful, Clerk updates the session, allowing the delete operation.
      try {
        await session?.touch();
      } catch (reauthorizeError) {
        // Handle cancellation or failure during re-authorization
        console.error(
          "Re-authorization failed or cancelled:",
          reauthorizeError
        );
        toast.error(
          "Account deletion cancelled or verification failed."
        );
        setIsSaving(false); // Stop saving state
        return; // Exit the function if re-authorization fails
      }

      // --- Firebase Deletion (Code from previous fix) ---
      const userDocRef = doc(db, "users", userId);
      const roadmapRef = doc(
        db,
        "users",
        userId,
        "userRoadmap",
        "current"
      );

      await Promise.all([
        deleteDoc(userDocRef),
        deleteDoc(roadmapRef),
      ]);

      // 2. **Execute Clerk Deletion**
      // This should now pass because the session was just re-authorized.
      await user.delete();

      toast.success("Account deleted successfully");
      router.push("/");
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Failed to delete account");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isLoaded || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Settings
          </h1>
          <p className="text-gray-600">
            Manage your profile, preferences, and learning journey
          </p>
        </header>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger
              value="profile"
              className="flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger
              value="learning"
              className="flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Learning</span>
            </TabsTrigger>
            <TabsTrigger
              value="preferences"
              className="flex items-center gap-2"
            >
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Preferences</span>
            </TabsTrigger>
            <TabsTrigger
              value="data"
              className="flex items-center gap-2"
            >
              <Database className="w-4 h-4" />
              <span className="hidden sm:inline">Data</span>
            </TabsTrigger>
            <TabsTrigger
              value="about"
              className="flex items-center gap-2"
            >
              <Info className="w-4 h-4" />
              <span className="hidden sm:inline">About</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and profile picture
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={handleSaveProfile}
                  className="space-y-6"
                >
                  {/* Profile Picture */}
                  <div className="flex items-center gap-6">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={formData.profilePicture} />
                      <AvatarFallback>
                        {formData.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Label
                        htmlFor="profilePicture"
                        className="cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            disabled={isUploading}
                            asChild
                          >
                            <span>
                              {isUploading ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                  Uploading...
                                </>
                              ) : (
                                <>
                                  <Upload className="w-4 h-4 mr-2" />
                                  Change Picture
                                </>
                              )}
                            </span>
                          </Button>
                        </div>
                      </Label>
                      <Input
                        id="profilePicture"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                      <p className="text-sm text-gray-500 mt-2">
                        JPG, PNG or GIF. Max size 5MB.
                      </p>
                    </div>
                  </div>

                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          name: e.target.value,
                        })
                      }
                      placeholder="John Doe"
                    />
                  </div>

                  {/* Username */}
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          username: e.target.value,
                        })
                      }
                      placeholder="johndoe"
                    />
                  </div>

                  {/* Email (Read-only) */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      disabled
                      className="bg-gray-100"
                    />
                    <p className="text-sm text-gray-500">
                      Email cannot be changed here. Manage in Clerk
                      dashboard.
                    </p>
                  </div>

                  {/* Career Goal */}
                  <div className="space-y-2">
                    <Label htmlFor="careerGoal">Career Goal</Label>
                    <Textarea
                      id="careerGoal"
                      value={formData.careerGoal}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          careerGoal: e.target.value,
                        })
                      }
                      placeholder="e.g., Become a Full Stack Developer"
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t">
                    <p className="text-sm text-gray-500">
                      User ID: {userId}
                    </p>
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Logout */}
            <Card>
              <CardHeader>
                <CardTitle>Session</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  variant="destructive"
                  onClick={() => {
                    user?.delete();
                    router.push("/sign-in");
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Log Out
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Learning Tab */}
          <TabsContent value="learning" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Learning Path</CardTitle>
                <CardDescription>
                  Choose your learning focus area. Changing this will
                  reset your current progress.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  {Object.entries(learningPaths).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.learningPath === key
                            ? "border-indigo-600 bg-indigo-50"
                            : "border-gray-200 hover:border-indigo-300"
                        }`}
                        onClick={() =>
                          handleLearningPathChange(
                            key as LearningPathKey
                          )
                        }
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-3xl">
                            {value.icon}
                          </span>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">
                              {value.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {value.description}
                            </p>
                          </div>
                          {formData.learningPath === key && (
                            <div className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                              Current
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Theme</Label>
                    <p className="text-sm text-gray-500">
                      Choose your preferred theme
                    </p>
                  </div>
                  <Select
                    value={preferences.theme}
                    onValueChange={(value: ThemeTypes) =>
                      setPreferences({ ...preferences, theme: value })
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        <div className="flex items-center gap-2">
                          <Sun className="w-4 h-4" />
                          Light
                        </div>
                      </SelectItem>
                      <SelectItem value="dark">
                        <div className="flex items-center gap-2">
                          <Moon className="w-4 h-4" />
                          Dark
                        </div>
                      </SelectItem>
                      <SelectItem value="system">
                        <div className="flex items-center gap-2">
                          <Monitor className="w-4 h-4" />
                          System
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Task Display</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Daily Task Density</Label>
                    <p className="text-sm text-gray-500">
                      Number of tasks shown per day
                    </p>
                  </div>
                  <Select
                    value={preferences.taskDensity}
                    onValueChange={(value: TaskDensityType) =>
                      setPreferences({
                        ...preferences,
                        taskDensity: value,
                      })
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low (1-2)</SelectItem>
                      <SelectItem value="medium">
                        Medium (3)
                      </SelectItem>
                      <SelectItem value="high">High (4-5)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-gray-500">
                      Receive weekly progress summaries
                    </p>
                  </div>
                  <Switch
                    checked={preferences.emailNotifications}
                    onCheckedChange={(checked) =>
                      setPreferences({
                        ...preferences,
                        emailNotifications: checked,
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>In-App Notifications</Label>
                    <p className="text-sm text-gray-500">
                      Get notified about new modules and achievements
                    </p>
                  </div>
                  <Switch
                    checked={preferences.inAppNotifications}
                    onCheckedChange={(checked) =>
                      setPreferences({
                        ...preferences,
                        inAppNotifications: checked,
                      })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button
                onClick={handleSavePreferences}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Preferences
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          {/* Data Tab */}
          <TabsContent value="data" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Export Data</CardTitle>
                <CardDescription>
                  Download your complete learning data and progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleExportData} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export as JSON
                </Button>
              </CardContent>
            </Card>

            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="text-orange-800">
                  Reset Progress
                </CardTitle>
                <CardDescription className="text-orange-700">
                  This will delete your current roadmap and allow you
                  to start fresh
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="destructive"
                  onClick={() => setShowResetDialog(true)}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset Learning Progress
                </Button>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-800">
                  Delete Account
                </CardTitle>
                <CardDescription className="text-red-700">
                  Permanently delete your account and all associated
                  data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete My Account
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about">
            <Card>
              <CardHeader>
                <CardTitle>About Launchpad</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Version</span>
                    <span className="text-gray-600">1.0.0</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Last Updated</span>
                    <span className="text-gray-600">
                      November 2024
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="font-medium">
                      Account Created
                    </span>
                    <span className="text-gray-600">
                      {userProfile?.createdAt
                        ? new Date(
                            userProfile.createdAt
                          ).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Dialogs */}

        {/* Learning Path Change Confirmation */}
        <AlertDialog
          open={showPathChangeDialog}
          onOpenChange={setShowPathChangeDialog}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                Change Learning Path?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Changing your learning path will archive your current
                roadmap and progress. You&apos;ll need to complete
                onboarding again to generate a new roadmap for{" "}
                <strong>
                  {newLearningPath &&
                    learningPathsArray[newLearningPath]?.title}
                </strong>
                . Your old data will be saved and can be exported
                before proceeding.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmLearningPathChange}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Yes, Change Path
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Reset Progress Confirmation */}
        <AlertDialog
          open={showResetDialog}
          onOpenChange={setShowResetDialog}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                Reset Learning Progress?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete your current roadmap and
                all task progress. You&apos;ll be redirected to
                onboarding to start fresh. This action cannot be
                undone.
                <br />
                <br />
                <strong>Consider exporting your data first!</strong>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleResetProgress}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Yes, Reset Progress
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete Account Confirmation */}
        <AlertDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-red-600" />
                Delete Account Permanently?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete your account, profile,
                and all learning data. This includes:
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Your profile and settings</li>
                  <li>All roadmap and progress data</li>
                  <li>Your authentication credentials</li>
                </ul>
                <br />
                <strong className="text-red-600">
                  This action is IRREVERSIBLE. Your data cannot be
                  recovered.
                </strong>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteAccount}
                className="bg-red-600 hover:bg-red-700"
              >
                Yes, Delete My Account
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default SettingsPage;
