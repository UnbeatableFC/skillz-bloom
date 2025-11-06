"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { doc, collection, onSnapshot, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";
import {
  Loader2,
  Plus,
  Trash2,
  TrendingUp,
  Award,
  Target,
  Zap,
  Search,
  Filter,
  ChevronUp,
} from "lucide-react";

interface Skill {
  id: string;
  name: string;
  proficiency: number; // 1-5
  category: string;
  endorsements: number;
  lastPracticed: string;
  projects: string[];
  notes: string;
  createdAt: string;
}

const categoryColors: Record<string, string> = {
  Technical: "from-blue-500 to-cyan-500",
  "Soft Skills": "from-purple-500 to-pink-500",
  "Business": "from-amber-500 to-orange-500",
  "Languages": "from-green-500 to-emerald-500",
  "Creative": "from-rose-500 to-pink-500",
  "Other": "from-gray-500 to-slate-500",
};

const categoryBgColors: Record<string, string> = {
  Technical: "bg-blue-100 text-blue-800",
  "Soft Skills": "bg-purple-100 text-purple-800",
  "Business": "bg-amber-100 text-amber-800",
  "Languages": "bg-green-100 text-green-800",
  "Creative": "bg-rose-100 text-rose-800",
  "Other": "bg-gray-100 text-gray-800",
};

const SkillsPage = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"proficiency" | "recent" | "name">(
    "proficiency"
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    proficiency: 2,
    category: "Technical",
    projects: "",
    notes: "",
  });

  const categories = Object.keys(categoryColors);

  // Fetch skills in real-time
  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user?.id) {
      setIsLoading(false);
      return;
    }

    const skillsRef = collection(db, "users", user.id, "skills");

    const unsubscribe = onSnapshot(
      skillsRef,
      (snapshot) => {
        const skillsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as Skill));

        setSkills(skillsData);
        setError(null);
        setIsLoading(false);
      },
      (err) => {
        console.error("Error fetching skills:", err);
        setError("Failed to load skills. Please try again.");
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.id, isLoaded, isSignedIn]);

  // Handle add/update skill
  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter a skill name");
      return;
    }

    if (!user?.id) {
      toast.error("User not authenticated");
      return;
    }

    try {
      const skillsRef = collection(db, "users", user.id, "skills");
      const projects = formData.projects
        .split(",")
        .map((p) => p.trim())
        .filter((p) => p.length > 0);

      if (editingId) {
        const docRef = doc(db, "users", user.id, "skills", editingId);
        await updateDoc(docRef, {
          name: formData.name,
          proficiency: formData.proficiency,
          category: formData.category,
          projects,
          notes: formData.notes,
          lastPracticed: new Date().toISOString(),
        });
        toast.success("Skill updated! 📈");
      } else {
        await addDoc(skillsRef, {
          name: formData.name,
          proficiency: formData.proficiency,
          category: formData.category,
          projects,
          notes: formData.notes,
          endorsements: 0,
          lastPracticed: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        });
        toast.success("Skill added! 🎉");
      }

      setFormData({
        name: "",
        proficiency: 2,
        category: "Technical",
        projects: "",
        notes: "",
      });
      setShowForm(false);
      setEditingId(null);
    } catch (err) {
      console.error("Error saving skill:", err);
      toast.error("Failed to save skill");
    }
  };

  // Handle delete skill
  const handleDeleteSkill = async (id: string) => {
    if (!user?.id) return;

    try {
      await deleteDoc(doc(db, "users", user.id, "skills", id));
      toast.success("Skill deleted");
    } catch (err) {
      console.error("Error deleting skill:", err);
      toast.error("Failed to delete skill");
    }
  };

  // Handle edit skill
  const handleEditSkill = (skill: Skill) => {
    setFormData({
      name: skill.name,
      proficiency: skill.proficiency,
      category: skill.category,
      projects: skill.projects.join(", "),
      notes: skill.notes,
    });
    setEditingId(skill.id);
    setShowForm(true);
  };

  // Handle increment proficiency
  const handleIncreaseSkill = async (skill: Skill) => {
    if (skill.proficiency >= 5) {
      toast.error("Already at maximum proficiency!");
      return;
    }

    if (!user?.id) return;

    try {
      await updateDoc(
        doc(db, "users", user.id, "skills", skill.id),
        {
          proficiency: skill.proficiency + 1,
          lastPracticed: new Date().toISOString(),
        }
      );
      toast.success("Great progress! 🚀");
    } catch (err) {
      toast.error("Failed to update skill");
    }
  };

  // Filter and sort skills
  let filteredSkills = skills.filter((skill) => {
    const matchesSearch = skill.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || skill.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Sort skills
  if (sortBy === "proficiency") {
    filteredSkills.sort((a, b) => b.proficiency - a.proficiency);
  } else if (sortBy === "recent") {
    filteredSkills.sort(
      (a, b) =>
        new Date(b.lastPracticed).getTime() -
        new Date(a.lastPracticed).getTime()
    );
  } else if (sortBy === "name") {
    filteredSkills.sort((a, b) => a.name.localeCompare(b.name));
  }

  const stats = {
    totalSkills: skills.length,
    avgProficiency:
      skills.length > 0
        ? (
            skills.reduce((sum, s) => sum + s.proficiency, 0) / skills.length
          ).toFixed(1)
        : 0,
    expertSkills: skills.filter((s) => s.proficiency >= 4).length,
    recentlyPracticed: skills.filter(
      (s) =>
        new Date().getTime() - new Date(s.lastPracticed).getTime() <
        24 * 60 * 60 * 1000
    ).length,
  };

  if (!isLoaded || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mr-3" />
        <span className="text-lg font-medium text-gray-700">
          Loading your skills...
        </span>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Please sign in to view your skills
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">
                🎯 Skills Tracker
              </h1>
              <p className="text-lg text-gray-600">
                Track, develop, and showcase your professional skills
              </p>
            </div>
            <button
              onClick={() => {
                setEditingId(null);
                setFormData({
                  name: "",
                  proficiency: 2,
                  category: "Technical",
                  projects: "",
                  notes: "",
                });
                setShowForm(!showForm);
              }}
              className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-200"
            >
              <Plus className="w-5 h-5" />
              <span>Add Skill</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Skills", value: stats.totalSkills, icon: Award },
              {
                label: "Avg Proficiency",
                value: `${stats.avgProficiency}/5`,
                icon: TrendingUp,
              },
              {
                label: "Expert Skills",
                value: stats.expertSkills,
                icon: Zap,
              },
              {
                label: "Today's Practice",
                value: stats.recentlyPracticed,
                icon: Target,
              },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-gray-600">
                      {stat.label}
                    </p>
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-2 border-blue-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingId ? "Edit Skill" : "Add New Skill"}
            </h2>
            <form onSubmit={handleSaveSkill} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Skill Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., React.js, Public Speaking"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none transition"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none transition"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Proficiency */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Proficiency Level: <span className="text-blue-600">{formData.proficiency}/5</span>
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, proficiency: level })
                      }
                      className={`flex-1 h-10 rounded-lg font-bold transition transform hover:scale-110 ${
                        formData.proficiency >= level
                          ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Projects */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Projects (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g., E-commerce App, Portfolio Website"
                  value={formData.projects}
                  onChange={(e) =>
                    setFormData({ ...formData, projects: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none transition"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  placeholder="Your thoughts about this skill..."
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none transition resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-lg hover:shadow-lg transform hover:scale-105 transition"
                >
                  {editingId ? "Update Skill" : "Add Skill"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none transition"
              />
            </div>

            {/* Sort */}
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as "proficiency" | "recent" | "name")
                }
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none transition"
              >
                <option value="proficiency">Highest Proficiency</option>
                <option value="recent">Recently Practiced</option>
                <option value="name">Alphabetical</option>
              </select>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mt-4">
            {["all", ...categories].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full font-semibold transition ${
                  selectedCategory === cat
                    ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat === "all" ? "All Skills" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Skills Grid */}
        {filteredSkills.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSkills.map((skill) => (
              <div
                key={skill.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition p-6 border-2 border-gray-100 group"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {skill.name}
                    </h3>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        categoryBgColors[skill.category]
                      }`}
                    >
                      {skill.category}
                    </span>
                  </div>
                  <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={() => handleEditSkill(skill)}
                      className="p-2 hover:bg-blue-100 rounded-lg transition text-blue-600"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteSkill(skill.id)}
                      className="p-2 hover:bg-red-100 rounded-lg transition text-red-600"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Proficiency Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-600">
                      Proficiency
                    </span>
                    <span className="text-sm font-bold text-blue-600">
                      {skill.proficiency}/5
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${
                        categoryColors[skill.category]
                      } transition-all duration-300`}
                      style={{ width: `${(skill.proficiency / 5) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Projects */}
                {skill.projects.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-600 mb-2">
                      Projects
                    </p>
                    <div className="space-y-1">
                      {skill.projects.slice(0, 2).map((project, idx) => (
                        <p
                          key={idx}
                          className="text-sm text-gray-700 truncate bg-gray-50 px-2 py-1 rounded"
                        >
                          • {project}
                        </p>
                      ))}
                      {skill.projects.length > 2 && (
                        <p className="text-xs text-gray-500 px-2">
                          +{skill.projects.length - 2} more
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {skill.notes && (
                  <p className="text-sm text-gray-600 mb-4 italic truncate">
                    "{skill.notes}"
                  </p>
                )}

                {/* Action Button */}
                <button
                  onClick={() => handleIncreaseSkill(skill)}
                  disabled={skill.proficiency >= 5}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-lg hover:shadow-lg transform hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronUp className="w-4 h-4" />
                  <span>
                    {skill.proficiency >= 5 ? "Mastered! 🏆" : "Level Up"}
                  </span>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No skills tracked yet
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || selectedCategory !== "all"
                ? "Try adjusting your search or filters"
                : "Start tracking your skills to monitor your growth!"}
            </p>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-lg hover:shadow-lg transform hover:scale-105 transition"
              >
                Add Your First Skill
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillsPage;