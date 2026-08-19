/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { formatFileSize } from "@/src/utils/file";
import { IoCloudUpload } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import { LuDot } from "react-icons/lu";

export interface UploadFile {
  file: File;
  preview?: string;
  status: "pending" | "uploading" | "finalizing" | "complete" | "error";
  progress: number;
  uploadedBytes: number;
  error?: string;
}

interface UploadFormProps {
  files: UploadFile[];
  onFileSelect: (selectedFiles: File[]) => void;
  onRemoveFile: (index: number) => void;
  onUpload: () => void;
  onClear: () => void;
}

export default function UploadForm({
  files,
  onFileSelect,
  onRemoveFile,
  onUpload,
  onClear,
}: UploadFormProps) {
  const [isDragging, setIsDragging] = useState(false);

  const statusColors = {
    pending: {
      bg: "bg-[#e2dddd]",
      text: "text-[#757474]",
      bar: "bg-[#e2dddd]",
    },
    uploading: {
      bg: "bg-[#e2dddd]",
      text: "text-[#757474]",
      bar: "bg-[#fc73c3]",
    },
    finalizing: {
      bg: "bg-[#ddf7e1]",
      text: "text-[#1970b7]",
      bar: "bg-[#1970b7]",
    },
    complete: {
      bg: "bg-[#ddf7e1]",
      text: "text-[#2ab441]",
      bar: "bg-[#2ab441]",
    },
    error: {
      bg: "bg-[#f8c8c8]",
      text: "text-[#f34444]",
      bar: "bg-[#f34444]",
    },
  };

  const isUploading = files.some(
    (f) => f.status === "uploading" || f.status === "finalizing",
  );

  const successCount = files.filter((f) => f.status === "complete").length;

  const hasFiles = files.length > 0;

  const isComplete =
    hasFiles &&
    files.every((f) => f.status === "complete" || f.status === "error");

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (isUploading) {
      return;
    }

    const droppedFiles = Array.from(e.dataTransfer.files);

    onFileSelect(droppedFiles);
  };

  const totalSize = files.reduce((total, f) => total + f.file.size, 0);

  return (
    <div className="flex flex-col min-h-0 h-full">
      <div className="flex-1 min-h-0 overflow-y-auto pr-2 mt-6">
        {/* Header */}
        <h1 className="font-heading text-3xl font-bold mb-1">Upload Files</h1>

        <p className="font-sans text-xs text-[#777373] mb-8">
          Upload your pictures and videos here! Maximum file size is 5GB each.
          You can upload multiple files at once.
        </p>

        {/* Upload area */}
        <label
          htmlFor="file-upload"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center cursor-pointer rounded-xl border-2 border-dashed px-6 py-12 mb-6 duration-200 hover:border-[#e07b99] hover:bg-[#faf9f9] transition ${
            isDragging ? "border-[#e07b99] bg-[#f2f0f3]" : "border-[#c0b3b3]"
          }`}
        >
          <div className="px-4 py-4 rounded-2xl mb-4 bg-[#eedaf3]">
            <IoCloudUpload className="text-[#e97b8e] size-8" />
          </div>

          <p className="text-xl">
            {isDragging ? "Drop files here" : "Drag files here"}
          </p>

          <p className="text-gray-400 mb-4">or</p>

          <div className="border border-[#c0b3b3] px-6 py-3 rounded-xl mb-6">
            <p>Choose files</p>
          </div>

          <p className="text-xs text-gray-400">
            Supported photos: JPEG, JPG, PNG, GIF, WEBP, HEIC, SVG, TIF
          </p>

          <p className="text-xs text-gray-400">
            Supported videos: MP4, MOV, MKV, WEBM, AVI
          </p>
        </label>

        <input
          id="file-upload"
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={(e) => {
            onFileSelect(Array.from(e.target.files || []));
            e.target.value = "";
          }}
          disabled={isUploading}
          className="hidden"
        />

        {/* File count */}
        <div className="mb-4 font-medium flex items-center">
          {hasFiles && (
            <>
              <span>
                {files.length} file
                {files.length > 1 ? "s" : ""}
              </span>

              <LuDot className="mx-0.5 text-[#7c7575]" />

              <span className="text-[#7c7575]">
                {formatFileSize(totalSize)}
              </span>
            </>
          )}
        </div>

        {/* Files */}
        {hasFiles && (
          <div>
            {files.map((f, i) => {
              const colors = statusColors[f.status];

              return (
                <div
                  key={i}
                  className="flex items-center rounded-3xl border border-gray-300 mb-4 px-4 py-3"
                >
                  {/* Preview */}
                  {f.preview && (
                    <img
                      src={f.preview}
                      alt={f.file.name}
                      className="w-20 h-20 rounded-xl object-cover shrink-0"
                    />
                  )}

                  {/* Middle */}
                  <div className="flex flex-col ml-4 flex-1 font-medium">
                    <div className="flex justify-between text-sm">
                      <p>{f.file.name}</p>

                      <div
                        className={`rounded-xl px-1.5 h-5 text-xs ${colors.bg} ${colors.text}`}
                      >
                        <p>{f.status}</p>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-1 mt-4 mb-5 bg-[#e2dddd] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-200 ${colors.bar}`}
                        style={{
                          width: `${f.progress}%`,
                        }}
                      />
                    </div>

                    {/* File size */}
                    <div className="text-xs text-[#8b8888]">
                      <p>
                        {f.status === "pending"
                          ? formatFileSize(f.file.size)
                          : `${formatFileSize(
                              f.uploadedBytes,
                            )}/${formatFileSize(f.file.size)}`}
                      </p>
                    </div>
                  </div>

                  {/* Remove */}
                  <span
                    className="ml-5 mr-2 text-gray-500 px-1.5 py-1.5 rounded-lg transition-colors duration-200 hover:bg-[#eedaf3] hover:text-[#f01616]"
                    onClick={() => onRemoveFile(i)}
                  >
                    <RxCross1 />
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Fixed footer */}
      {hasFiles && (
        <div className="shrink-0">
          <hr className="border-[#c5c1c1] mt-6 mb-4" />

          <div className="flex justify-between">
            <div className="text-[#7c7575] text-sm mt-5">
              {successCount} of {files.length} uploaded
            </div>

            <div>
              {/* Before uploading */}
              {!isUploading && !isComplete && (
                <>
                  <button
                    onClick={onClear}
                    className="px-2 py-2 rounded-xl bg-[#fff6f1] border border-[#a8a6a6] cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={onUpload}
                    className="ml-3 px-2 py-2 rounded-xl bg-[#e97b8e] text-white cursor-pointer"
                  >
                    Upload
                  </button>
                </>
              )}

              {/* During uploading */}
              {isUploading && (
                <button
                  onClick={onClear}
                  className="px-2 py-2 rounded-xl bg-[#fff6f1] border border-[#a8a6a6] cursor-pointer"
                >
                  Cancel
                </button>
              )}

              {/* After uploading */}
              {isComplete && (
                <button
                  onClick={onClear}
                  className="ml-3 px-2 py-2 rounded-xl bg-[#e97b8e] text-white cursor-pointer"
                >
                  Done
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
