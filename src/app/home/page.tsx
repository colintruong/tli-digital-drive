"use client";

import ProtectedRoute from "@/src/components/ProtectedRoute";
import UploadForm from "@/src/components/UploadForm";
import { useAuth } from "@/src/contexts/AuthContext";

export default function DashboardPage() {
  const { user, signOut } = useAuth();

  const handleUploadComplete = () => {
    console.log("Upload complete - would refresh media grid here later");
  };
  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center min-h-screen bg-[#fff6f1]">
        <div className="w-2/5">
          <h1>Home</h1>
          <p>Logged in as: {user?.email}</p>
          <button onClick={signOut}>Sign out</button>

          
          <UploadForm onUploadComplete={handleUploadComplete} />
        </div>
      </div>
    </ProtectedRoute>
  );
}
