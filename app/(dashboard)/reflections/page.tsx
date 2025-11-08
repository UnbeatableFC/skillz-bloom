"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { doc, collection, onSnapshot, addDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";
import { Loader2, Heart, MessageCircle, Trash2, Plus, Calendar, Search } from "lucide-react";
import { Reflection } from "@/types/types";
import { Button } from "@/components/ui/button";



const ReflectionsPage = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMood, setSelectedMood] = useState<string>("all");
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    mood: "good" as string,
    tags: "",
  });

  const moodEmojis: Record<string, string> = {
    great: "🌟",
    good: "😊",
    neutral: "😐",
    challenging: "😕",
    difficult: "😰",
  };

  const moodColors: Record<string, string> = {
    great: "from-emerald-100 to-teal-100 border-emerald-300",
    good: "from-blue-100 to-cyan-100 border-blue-300",
    neutral: "from-gray-100 to-slate-100 border-gray-300",
    challenging: "from-amber-100 to-orange-100 border-amber-300",
    difficult: "from-red-100 to-pink-100 border-red-300",
  };

  // Fetch reflections in real-time
  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user?.id) {
      
      return;
    }

    const reflectionsRef = collection(
      db,
      "users",
      user?.id,
      "reflections"
    );

    const unsubscribe = onSnapshot(
      reflectionsRef,
      (snapshot) => {
        const reflectionsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as Reflection));

        // Sort by newest first
        reflectionsData.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setReflections(reflectionsData);
        setError(null);
        setIsLoading(false);
      },
      (err) => {
        console.error("Error fetching reflections:", err);
        setError("Failed to load reflections. Please try again.");
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.id, isLoaded, isSignedIn]);

  // Handle add reflection
  const handleAddReflection = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error("Please fill in title and reflection");
      return;
    }

    if (!user?.id) {
      toast.error("User not authenticated");
      return;
    }

    try {
      const reflectionsRef = collection(
        db,
        "users",
        user?.id,
        "reflections"
      );

      const now = new Date().toISOString();
      const tags = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      await addDoc(reflectionsRef, {
        title: formData.title,
        content: formData.content,
        mood: formData.mood,
        tags,
        createdAt: now,
        updatedAt: now,
      });

      toast.success("Reflection saved! 🌟");
      setFormData({
        title: "",
        content: "",
        mood: "good",
        tags: "",
      });
      setShowForm(false);
    } catch (err) {
      console.error("Error adding reflection:", err);
      toast.error("Failed to save reflection");
    }
  };

  // Handle delete reflection
  const handleDeleteReflection = async (id: string) => {
    if (!user?.id) return;

    try {
      const docRef = doc(db, "users", user.id, "reflections", id);
      await deleteDoc(docRef);
      toast.success("Reflection deleted");
    } catch (err) {
      console.error("Error deleting reflection:", err);
      toast.error("Failed to delete reflection");
    }
  };

  // Filter reflections
  const filteredReflections = reflections.filter((reflection) => {
    const matchesSearch =
      reflection.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reflection.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reflection.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesMood =
      selectedMood === "all" || reflection.mood === selectedMood;

    return matchesSearch && matchesMood;
  });

  if (!isLoaded || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600 mr-3" />
        <span className="text-lg font-medium text-gray-700">
          Loading your reflections...
        </span>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Please sign in to view reflections
          </h2>
          <p className="text-gray-600">
            Sign in to track your learning journey and growth
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">
                ✨ Learning Reflections
              </h1>
              <p className="text-lg text-gray-600">
                Document your growth, celebrate wins, and learn from challenges
              </p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-200"
            >
              <Plus className="w-5 h-5" />
              <span>New Reflection</span>
            </button>
          </div>
        </div>

        {/* Add Reflection Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-2 border-purple-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Share Your Reflection
            </h2>
            <form onSubmit={handleAddReflection} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Reflection Title
                </label>
                <input
                  type="text"
                  placeholder="e.g., Today's breakthrough moment"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-600 focus:outline-none transition"
                />
              </div>

              {/* Mood */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  How are you feeling today?
                </label>
                <div className="grid grid-cols-5 gap-3">
                  {Object.entries(moodEmojis).map(([mood, emoji]) => (
                    <button
                      key={mood}
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          mood: mood,
                        })
                      }
                      className={`p-3 rounded-lg font-semibold text-2xl transition transform ${
                        formData.mood === mood
                          ? "ring-2 ring-purple-600 scale-110"
                          : "hover:scale-105"
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Reflection
                </label>
                <textarea
                  placeholder="Write about your learning experience, challenges overcome, or insights gained..."
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  rows={6}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-600 focus:outline-none transition resize-none"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g., JavaScript, Problem-solving, Teamwork"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-600 focus:outline-none transition"
                />
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg hover:shadow-lg transform hover:scale-105 transition"
                >
                  Save Reflection
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search reflections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-600 focus:outline-none transition"
              />
            </div>

            {/* Mood Filter */}
            <div className="flex flex-wrap gap-2 items-center">
              {["all", ...Object.keys(moodEmojis)].map((mood) => (
                <button
                  key={mood}
                  onClick={() => setSelectedMood(mood)}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    selectedMood === mood
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {mood === "all"
                    ? "All Moods"
                    : `${moodEmojis[mood as keyof typeof moodEmojis]}`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Reflections List */}
        {filteredReflections.length > 0 ? (
          <div className="grid gap-6">
            {filteredReflections.map((reflection) => (
              <div
                key={reflection.id}
                className={`bg-gradient-to-br ${
                  moodColors[reflection.mood]
                } rounded-2xl shadow-lg hover:shadow-xl transition p-6 border-2`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-3xl">
                        {moodEmojis[reflection.mood]}
                      </span>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {reflection.title}
                      </h3>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 space-x-2">
                      <Calendar className="w-4 h-4" />
                      <time>
                        {new Date(reflection.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </time>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleDeleteReflection(reflection.id)}
                    className="p-2 hover:bg-red-100 rounded-lg transition text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>

                {/* Content */}
                <p className="text-gray-800 leading-relaxed mb-4 whitespace-pre-wrap">
                  {reflection.content}
                </p>

                {/* Tags */}
                {reflection.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {reflection.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-block px-3 py-1 bg-white bg-opacity-60 text-gray-700 rounded-full text-sm font-semibold"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center space-x-4 text-sm text-gray-600 pt-4 border-t-2 border-white border-opacity-40">
                  <button className="flex items-center space-x-1 hover:text-purple-600 transition">
                    <Heart className="w-4 h-4" />
                    <span>Love this moment</span>
                  </button>
                  <button className="flex items-center space-x-1 hover:text-purple-600 transition">
                    <MessageCircle className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No reflections yet
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || selectedMood !== "all"
                ? "Try adjusting your search or filters"
                : "Start documenting your learning journey today!"}
            </p>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg hover:shadow-lg transform hover:scale-105 transition"
              >
                Write Your First Reflection
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReflectionsPage;