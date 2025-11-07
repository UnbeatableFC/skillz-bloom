"use client";

import { useState, useEffect } from "react";

const LearningPreferences = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // State for preferences
  const [subjects, setSubjects] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState("Beginner");
  const [learningMode, setLearningMode] = useState("Video");

  // Load saved preferences from localStorage
  useEffect(() => {
    const savedSubjects = localStorage.getItem("subjects");
    const savedDifficulty = localStorage.getItem("difficulty");
    const savedLearningMode = localStorage.getItem("learningMode");

    if (savedSubjects) setSubjects(JSON.parse(savedSubjects));
    if (savedDifficulty) setDifficulty(savedDifficulty);
    if (savedLearningMode) setLearningMode(savedLearningMode);
  }, []);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem("subjects", JSON.stringify(subjects));
      localStorage.setItem("difficulty", difficulty);
      localStorage.setItem("learningMode", learningMode);

      console.log({ subjects, difficulty, learningMode });
      setIsEditing(false);
      setLoading(false);
    }, 500);
  };

  // Toggle subject selection
  const toggleSubject = (subject: string) => {
    if (!isEditing) return;
    setSubjects((prev) =>
      prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]
    );
  };

  return (
    <div className="mb-6 p-4 border rounded shadow-sm bg-white dark:bg-gray-800 text-black dark:text-white">
      <h2 className="font-semibold text-lg mb-4">Learning Preferences</h2>

      {/* Subjects */}
      <div className="mb-3">
        <label className="block mb-1 font-medium">Subjects</label>
        <div className="flex flex-wrap gap-2">
          {["Math", "Science", "English", "History", "Coding"].map((subject) => (
            <button
              key={subject}
              onClick={() => toggleSubject(subject)}
              className={`px-3 py-1 rounded border ${
                subjects.includes(subject)
                  ? "bg-blue-500 text-white"
                  : "bg-white dark:bg-gray-700 text-black dark:text-white"
              }`}
            >
              {subject}
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty */}
      <div className="mb-3">
        <label className="block mb-1 font-medium">Difficulty Level</label>
        <select
          value={difficulty}
          disabled={!isEditing}
          onChange={(e) => setDifficulty(e.target.value)}
          className="w-full border p-2 rounded bg-white text-black dark:bg-gray-700 dark:text-white"
        >
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>
      </div>

      {/* Learning Mode */}
      <div className="mb-3">
        <label className="block mb-1 font-medium">Learning Mode</label>
        <select
          value={learningMode}
          disabled={!isEditing}
          onChange={(e) => setLearningMode(e.target.value)}
          className="w-full border p-2 rounded bg-white text-black dark:bg-gray-700 dark:text-white"
        >
          <option>Video</option>
          <option>Quizzes</option>
          <option>Text</option>
        </select>
      </div>

      {/* Buttons */}
      <div className="mt-3">
        <button
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isEditing ? (loading ? "Saving..." : "Save") : "Edit"}
        </button>
      </div>
    </div>
  );
};

export default LearningPreferences;
