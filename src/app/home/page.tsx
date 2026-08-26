"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import ProtectedRoute from "@/src/components/ProtectedRoute";
import UploadForm, { UploadFile } from "@/src/components/UploadForm";
import UploadModal from "@/src/components/UploadModal";
import UploadStatusBadge from "@/src/components/UploadStatusBadge";
import MediaGrid from "@/src/components/MediaGrid";
import { useAuth } from "@/src/contexts/AuthContext";
import {
  isValidFileType,
  isValidFileSize,
  MAX_FILE_SIZE,
} from "@/src/utils/file";
import { fetchUserMedia, MediaItemWithUrl } from "@/src/lib/media";

export default function HomePage() {
  const { user, signOut } = useAuth();
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [media, setMedia] = useState<MediaItemWithUrl[]>([]);
  const [mediaLoading, setMediaLoading] = useState(true);

  const loadMedia = async () => {
    setMediaLoading(true);
    const result = await fetchUserMedia();
    setMedia(result);
    setMediaLoading(false);
  };

  useEffect(() => {
    let ignore = false;

    fetchUserMedia().then((result) => {
      if (!ignore) {
        setMedia(result);
        setMediaLoading(false);
      }
    });

    return () => {
      ignore = true;
    };
  }, []);

  const handleFileSelect = (selectedFiles: File[]) => {
    const newFiles: UploadFile[] = [];

    for (const file of selectedFiles) {
      if (!isValidFileType(file.type)) {
        toast.error(`${file.name}: invalid file type`);
        continue;
      }

      if (!isValidFileSize(file.size)) {
        toast.error(
          `${file.name}: file too large (max ${
            MAX_FILE_SIZE / (1024 * 1024 * 1024)
          }GB)`,
        );
        continue;
      }

      newFiles.push({
        file,
        preview: file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : file.type.startsWith("video/")
            ? "/video.png"
            : undefined,
        status: "pending",
        progress: 0,
        uploadedBytes: 0,
      });
    }

    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const updateFileStatus = (
    index: number,
    status: UploadFile["status"],
    error?: string,
  ) => {
    setFiles((prev) =>
      prev.map((f, i) => (i === index ? { ...f, status, error } : f)),
    );
  };

  const updateFileProgress = (index: number, progress: number) => {
    setFiles((prev) =>
      prev.map((f, i) => (i === index ? { ...f, progress } : f)),
    );
  };

  const updateUploadedBytes = (index: number, uploadedBytes: number) => {
    setFiles((prev) =>
      prev.map((f, i) => (i === index ? { ...f, uploadedBytes } : f)),
    );
  };

  const handleUploadComplete = () => {
    loadMedia();
  };

  const handleUpload = async () => {
    let uploadedCount = 0;

    for (let i = 0; i < files.length; i++) {
      if (files[i].status !== "pending") {
        continue;
      }

      updateFileStatus(i, "uploading");

      try {
        const formData = new FormData();
        formData.append("file", files[i].file);

        const result = await new Promise<{
          success: boolean;
          error?: string;
        }>((resolve, reject) => {
          const xhr = new XMLHttpRequest();

          xhr.open("POST", "/api/upload");

          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const progress = Math.round((event.loaded / event.total) * 100);

              updateFileProgress(i, progress);

              updateUploadedBytes(
                i,
                Math.min(event.loaded, files[i].file.size),
              );

              if (progress === 100) {
                updateFileStatus(i, "finalizing");
              }
            }
          };

          xhr.onload = () => {
            try {
              const response = JSON.parse(xhr.responseText);

              if (xhr.status >= 200 && xhr.status < 300) {
                resolve({
                  success: true,
                });
              } else {
                resolve({
                  success: false,
                  error: response.error || "Upload failed",
                });
              }
            } catch {
              resolve({
                success: false,
                error: "Invalid server response",
              });
            }
          };

          xhr.onerror = () => {
            reject(new Error("Network error"));
          };

          xhr.send(formData);
        });

        if (!result.success) {
          updateFileStatus(i, "error", result.error);

          toast.error(
            `${files[i].file.name}: ${result.error || "Upload failed"}`,
          );

          continue;
        }

        updateFileProgress(i, 100);
        updateUploadedBytes(i, files[i].file.size);
        updateFileStatus(i, "complete");

        uploadedCount++;
      } catch (err) {
        console.error("Upload error:", err);

        updateFileStatus(i, "error", "Network error");

        toast.error(`${files[i].file.name}: Network error`);
      }
    }

    if (uploadedCount > 0) {
      toast.success(`${uploadedCount} file(s) uploaded successfully`);

      handleUploadComplete();
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center min-h-screen bg-[#fff6f1]">
        <div className="w-2/5">
          <h1>Home</h1>
          <p>Logged in as: {user?.email}</p>
          <button onClick={signOut}>Sign out</button>

          <hr />

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#e97b8e] text-white cursor-pointer"
          >
            Upload
          </button>

          {!isModalOpen && (
            <UploadStatusBadge
              files={files}
              onClick={() => setIsModalOpen(true)}
            />
          )}

          <UploadModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          >
            <UploadForm
              files={files}
              onFileSelect={handleFileSelect}
              onRemoveFile={removeFile}
              onUpload={handleUpload}
              onClear={() => setFiles([])}
            />
          </UploadModal>

          <hr />

          <MediaGrid media={media} loading={mediaLoading} />
        </div>
      </div>
    </ProtectedRoute>
  );
}
