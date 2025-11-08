
"use client";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminDashboard() {
  const { user } = useUser();
 
  const router = useRouter();

  // Redirect non-admins to sign-in
  // useEffect(() => {
  //   if (!user) return;
  //   if (user.unsafeMetadata?.role !== "admin") {
  //     router.push("/sign-in");
  //   }
  // }, [user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="w-full max-w-2xl rounded-2xl shadow border border-gray-200 bg-white/90 px-6 py-10 space-y-8">
        <div className="flex items-center gap-4 mb-4">
          <img
            src={user?.imageUrl || "/avatar.png"}
            alt="Admin Avatar"
            className="w-16 h-16 rounded-full border border-gray-300"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <div className="text-gray-500 font-medium">{user?.fullName || "Admin"}</div>
            <div className="text-xs bg-gray-100 rounded px-2 py-0.5 text-purple-600 font-semibold mt-1 inline-block">admin</div>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border bg-white p-5 flex flex-col items-start gap-1 shadow-sm">
            <h2 className="font-semibold text-gray-600 mb-2">Manage Roadmaps</h2>
            <p className="text-sm text-gray-400 mb-4">Create, edit, and assign learning journeys.</p>
            <button className="text-sm font-semibold px-3 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded transition-all shadow">
              Go to Roadmaps
            </button>
          </div>
          <div className="rounded-lg border bg-white p-5 flex flex-col items-start gap-1 shadow-sm">
            <h2 className="font-semibold text-gray-600 mb-2">Resources</h2>
            <p className="text-sm text-gray-400 mb-4">Upload and manage learning materials and links.</p>
            <button className="text-sm font-semibold px-3 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded transition-all shadow" onClick={() => router.push("/admin/resources")}>
              Go to Resources
            </button>
          </div>
          <div className="rounded-lg border bg-white p-5 flex flex-col items-start gap-1 shadow-sm">
            <h2 className="font-semibold text-gray-600 mb-2">Users</h2>
            <p className="text-sm text-gray-400 mb-4">View/manage user roles and progress.</p>
            <button className="text-sm font-semibold px-3 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded transition-all shadow">
              Go to Users
            </button>
          </div>
          <div className="rounded-lg border bg-white p-5 flex flex-col items-start gap-1 shadow-sm">
            <h2 className="font-semibold text-gray-600 mb-2">Analytics</h2>
            <p className="text-sm text-gray-400 mb-4">See engagement and activity stats.</p>
            <button className="text-sm font-semibold px-3 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded transition-all shadow">
              Go to Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
