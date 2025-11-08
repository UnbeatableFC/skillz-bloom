"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";

const AccountSecurity = () => {
  const { user, update } = useUser(); // useUser provides update method
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false); 
  const [password, setPassword] = useState("");

  if (!user) return <p>Loading...</p>;

  const handleSave = async () => {
    setLoading(true);
    try {
      if (password) {
        await update({ password });  // Use update method from useUser
        alert("Password updated successfully!");
      }

      console.log("2FA enabled:", twoFAEnabled);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      alert("Failed to update account settings.");
    } finally {
      setLoading(false);
      setPassword("");
    }
  };

  return (
    <div className="mb-6 p-4 border rounded shadow-sm bg-white dark:bg-gray-800 text-black dark:text-white">
      <h2 className="font-semibold text-lg mb-4">Account & Security</h2>

      {/* Email (read-only) */}
      <div className="mb-3">
        <label className="block mb-1 font-medium">Email</label>
        <input
          type="email"
          value={user.primaryEmailAddress?.emailAddress || ""}
          readOnly
          className="w-full border p-2 rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
        />
      </div>

      {/* Password */}
      <div className="mb-3">
        <label className="block mb-1 font-medium">New Password</label>
        <input
          type="password"
          value={password}
          readOnly={!isEditing}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={isEditing ? "Enter new password" : "********"}
          className={`w-full border p-2 rounded ${
            isEditing ? "bg-white dark:bg-gray-700" : "bg-gray-100 dark:bg-gray-700"
          } text-black dark:text-white`}
        />
      </div>

      {/* 2FA toggle */}
      <div className="mb-3 flex items-center justify-between">
        <label>Two‑Factor Authentication</label>
        <input
          type="checkbox"
          checked={twoFAEnabled}
          disabled={!isEditing}
          onChange={(e) => setTwoFAEnabled(e.target.checked)}
        />
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

export default AccountSecurity;
