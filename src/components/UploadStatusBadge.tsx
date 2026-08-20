"use client";

import { UploadFile } from "@/src/components/UploadForm";

interface UploadStatusBadgeProps {
    files: UploadFile[];
    onClick: () => void;
}

export default function UploadStatusBadge({
    files,
    onClick,
}: UploadStatusBadgeProps) {
    if (files.length === 0) {
        return null;
    }

    const totalFiles = files.length;
    const completedFiles = files.filter((f) => f.status === "complete").length;
    const erroredFiles = files.filter((f) => f.status === "error").length;

    const allDone = files.every((f) => f.status === "complete" || f.status === "error");

    const bg = allDone ? "bg-[#2ab441]" : "bg-[#e97b8e]";

    return (
        <button onClick={onClick} className={`fixed bottom-6 right-6 z-40 rounded-full px-5 py-3 text-white shadow-lg transition-colors cursor-pointer ${bg}`}>
            {allDone ? (
                <span>
                    {completedFiles}/{totalFiles} uploaded
                    {erroredFiles > 0 ? ` (${erroredFiles} failed)` : " ✓"}
                </span>
            ) : (
                <span>
                    {completedFiles}/{totalFiles} uploaded
                </span>
            )}
        </button>
    )
}