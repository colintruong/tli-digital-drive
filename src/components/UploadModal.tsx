"use client";

import { useEffect, useRef } from "react";
import { RxCross1 } from "react-icons/rx";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function UploadModal({
  isOpen,
  onClose,
  children,
}: UploadModalProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        contentRef.current &&
        !contentRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000]/40 backdrop-blur-xs px-4">
      <div
        ref={contentRef}
        className="relative w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-2xl bg-white p-6 flex flex-col animate-fade-in-up animate-duration-300 animate-fill-mode-both"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-700 transition-colors"
        >
          <RxCross1 size={20} />
        </button>

        {children}
      </div>
    </div>
  );
}
