/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { MediaItemWithUrl } from "@/src/lib/media";
import { FaCirclePlay } from "react-icons/fa6";

interface MediaCardProps {
  item: MediaItemWithUrl;
}

export default function MediaCard({ item }: MediaCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div>
      {item.url && item.file_type === "image" && !imgError ? (
        <img
          src={item.url}
          alt={item.file_name}
          onError={() => setImgError(true)}
          className="w-full h-25 sm:h-25 md:h-30 lg:h-35 xl:h-40 object-cover rounded-xl cursor-pointer hover:scale-105 transition duration-200"
        />
      ) : item.url && item.file_type === "video" ? (
        <div className="relative w-full h-25 sm:h-25 md:h-30 lg:h-35 xl:h-40 cursor-pointer hover:scale-105 transition duration-200">
          <img
            src={"/video.png"}
            alt={item.file_name}
            className="w-full h-full object-cover rounded-xl"
          />

          <div className="absolute inset-0 flex items-center justify-center">
            <FaCirclePlay className="text-[#bf4391] text-3xl" />
          </div>
        </div>
      ) : (
        <div className="w-full h-25 sm:h-25 md:h-30 lg:h-35 xl:h-40 flex items-center justify-center bg-gray-100 rounded-xl text-xs text-black">
          Couldn&apos;t load
        </div>
      )}
      <p className="text-xs mt-3 truncate">{item.file_name}</p>
    </div>
  );
}
