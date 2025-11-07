"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";

const ProfileSection = () => {
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.fullName || "");
  const [loading, setLoading] = useState(false);

  if (!user) return <p>Loading...</p>;
const handleSave = async () => {
  setLoading(true);
  try {
    const [firstName, ...rest] = name.split(" "); // split full name
    const lastName = rest.join(" "); // rest of the words
    await user.update({ firstName, lastName }); // Clerk expects firstName & lastName
    alert("Name updated successfully!");
    setIsEditing(false); // turn off edit mode
  } catch (error) {
    console.error(error);
    alert("Failed to update name.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="mb-6 p-4 border rounded shadow-sm">
      <h2 className="font-semibold text-lg mb-4">Profile Settings</h2>

      {/* Profile Picture */}
      <div className="mb-3">
        <img
          src={user.imageUrl || ""}
          alt="Profile"
          className="w-24 h-24 rounded-full mb-2"
        />
      </div>

      {/* Name */}
      <div className="mb-3 flex items-center justify-between">
        <div className="w-full">
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            value={name}
            readOnly={!isEditing}
            onChange={(e) => setName(e.target.value)}
            className={`w-full border p-2 rounded ${
              isEditing ? "bg-white" : "bg-gray-100"
            }`}
          />
        </div>
        <button
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          disabled={loading}
          className="ml-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isEditing ? (loading ? "Saving..." : "Save") : "Edit"}
        </button>
      </div>

      {/* Email (read-only) */}
      <div className="mb-3">
        <label className="block mb-1 font-medium">Email</label>
        <input
          type="email"
          value={user.primaryEmailAddress?.emailAddress || ""}
          readOnly
          className="w-full border p-2 rounded bg-gray-100"
        />
      </div>

      <p className="text-sm text-gray-500">
        Email and password updates are managed by Clerk.
      </p>
    </div>
  );
};

export default ProfileSection;
