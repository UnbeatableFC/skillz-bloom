"use client";

import { useState, useEffect } from "react";

const PreferencesSection = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [appNotifications, setAppNotifications] = useState(true);
  const [language, setLanguage] = useState("English");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Apply dark mode class to <html> element
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      console.log({ darkMode, emailNotifications, appNotifications, language });
      alert("Preferences saved!");
      setLoading(false);
      setIsEditing(false);
    }, 500);
  };

  return (
    <div className="mb-6 p-4 border rounded shadow-sm">
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
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option>English</option>
          <option>Spanish</option>
          <option>French</option>
          <option>Portuguese</option>
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
