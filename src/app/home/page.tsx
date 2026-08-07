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
      <div className="flex flex-col min-h-screen items-center justify-center">
        <h1>Home</h1>
        <p>Logged in as: {user?.email}</p>
        <button onClick={signOut}>Sign out</button>

        <hr style={{ margin: "2rem 0"}} />
        <UploadForm onUploadComplete={handleUploadComplete} />
      </div>
    </ProtectedRoute>
  );
}
