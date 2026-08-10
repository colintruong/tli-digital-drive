/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  isValidFileType,
  isValidFileSize,
  MAX_FILE_SIZE,
} from "@/src/utils/file";

interface UploadFile {
  file: File;
  preview?: string;
  status: "pending" | "uploading" | "complete" | "error";
  error?: string;
}

interface UploadFormProps {
  onUploadComplete: () => void;
}

export default function UploadForm({ onUploadComplete }: UploadFormProps) {
  const [files, setFiles] = useState<UploadFile[]>([]);

  const isUploading = files.some((f) => f.status === "uploading");

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);

    const newFiles: UploadFile[] = [];

    for (const file of selected) {
      if (!isValidFileType(file.type)) {
        toast.error(`${file.name}: invalid file type`);
        continue;
      }

      if (!isValidFileSize(file.size)) {
        toast.error(
          `${file.name}: file too large (max ${MAX_FILE_SIZE / (1024 * 1024 * 1024)}GB)`,
        );
        continue;
      }

      newFiles.push({
        file,
        preview: file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : undefined,
        status: "pending",
      });
    }

    setFiles((prev) => [...prev, ...newFiles]);

    e.target.value = "";
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

  const handleUpload = async () => {
    let successCount = 0;

    for (let i = 0; i < files.length; i++) {
      if (files[i].status !== "pending") {
        continue;
      }

      updateFileStatus(i, "uploading");

      try {
        const formData = new FormData();
        formData.append("file", files[i].file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
          updateFileStatus(i, "error", result.error || "Upload failed");
          toast.error(
            `${files[i].file.name}: ${result.error || "Upload failed"}`,
          );
          continue;
        }

        updateFileStatus(i, "complete");
        successCount++;
      } catch (err) {
        console.error("Upload error:", err);
        updateFileStatus(i, "error", "Network error");
        toast.error(`${files[i].file.name}: Network error`);
      }
    }

    if (successCount > 0) {
      toast.success(`${successCount} file(s) uploaded successfully`);
      onUploadComplete();
    }
  };

  return (
    <div className="flex flex-col">
      <div>
        <label htmlFor="file-upload" className="border border-black">
          <span>
            hello
          </span>
        </label>

        <input
          id="file-upload"
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleFileSelect}
          disabled={isUploading}
          className="hidden"
        />

        {files.length > 0 && (
          <div>
            {files.map((f, i) => (
              <div key={i}>
                {f.preview && (
                  <img
                    src={f.preview}
                    alt={f.file.name}
                    width={60}
                    height={60}
                  />
                )}
                <span>{f.file.name}</span>
                <span>- {f.status}</span>
                {f.status === "error" && <span>({f.error})</span>}
                {f.status === "pending" && (
                  <button onClick={() => removeFile(i)}>Remove</button>
                )}
              </div>
            ))}

            <button onClick={handleUpload} disabled={isUploading}>
              {isUploading ? "Uploading" : "Upload"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
