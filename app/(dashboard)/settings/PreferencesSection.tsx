"use client";

import { useState, useEffect } from "react";

const PreferencesSection = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [appNotifications, setAppNotifications] = useState(true);
  const [language, setLanguage] = useState("English");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Apply dark mode to root
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Load saved language from localStorage
  useEffect(() => {
    const savedLang = localStorage.getItem("language");
    if (savedLang) setLanguage(savedLang);
  }, []);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  };

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      // Save language to localStorage
      localStorage.setItem("language", language);

      console.log({
        darkMode,
        emailNotifications,
        appNotifications,
        language,
      });
      setLoading(false);
      setIsEditing(false);
    }, 500);
  };

  return (
    <div className="mb-6 p-4 border rounded shadow-sm bg-white dark:bg-gray-800 text-black dark:text-white">
      <h2 className="font-semibold text-lg mb-4">Preferences</h2>

      {/* Theme */}
      <div className="mb-3 flex items-center justify-between">
        <label>Dark Mode</label>
        <input
          type="checkbox"
          checked={darkMode}
          disabled={!isEditing}
          onChange={(e) => setDarkMode(e.target.checked)}
        />
      </div>

      {/* Notifications */}
      <div className="mb-3">
        <label className="block mb-1 font-medium">Notifications</label>
        <div className="flex flex-col gap-1">
          <label>
            <input
              type="checkbox"
              checked={emailNotifications}
              disabled={!isEditing}
              onChange={(e) => setEmailNotifications(e.target.checked)}
            />{" "}
            Email Notifications
          </label>
          <label>
            <input
              type="checkbox"
              checked={appNotifications}
              disabled={!isEditing}
              onChange={(e) => setAppNotifications(e.target.checked)}
            />{" "}
            App Notifications
          </label>
        </div>
      </div>

      {/* Language */}
      <div className="mb-3">
        <label className="block mb-1 font-medium">Language</label>
        <select
          value={language}
          disabled={!isEditing}
          onChange={handleLanguageChange}
          className="w-full border p-2 rounded bg-white text-black dark:bg-gray-700 dark:text-white"
        >
          <option value="English">English</option>
          <option value="Spanish">Spanish</option>
          <option value="French">French</option>
          <option value="Portuguese">Portuguese</option>
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

export default PreferencesSection;
