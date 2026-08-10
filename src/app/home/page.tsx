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
      <div className="flex flex-col items-center min-h-screen">
        <div className="w-3/4">
          <h1>Home</h1>
          <p>Logged in as: {user?.email}</p>
          <button onClick={signOut}>Sign out</button>

          <h1 className="font-heading text-3xl font-bold mb-1">Upload Files</h1>
          <p className="font-sans text-xs text-[#777373] mb-8">
            Upload your pictures and videos here! Maximum file size is 5GB each. You
            can upload multiple files at once.
          </p>
          <UploadForm onUploadComplete={handleUploadComplete} />
        </div>
      </div>
    </ProtectedRoute>
  );
}
