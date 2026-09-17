/* eslint-disable @next/next/no-img-element */
"use client";

import { MediaItemWithUrl } from "@/src/lib/media";
import { FaCirclePlay } from "react-icons/fa6";

interface MediaGridProps {
  media: MediaItemWithUrl[];
  loading: boolean;
}

export default function MediaGrid({ media, loading }: MediaGridProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2- border-[#e97b8e]"></div>
      </div>
    );
  }

  if (media.length === 0) {
    return (
      <div className="text-center py-20 text-[#8b8888]">
        <p>No memories yet - upload your first photo!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(2,100px)] sm:grid-cols-[repeat(3,100px)] md:grid-cols-[repeat(4,120px)] lg:grid-cols-[repeat(5,140px)] xl:grid-cols-[repeat(8,160px)] justify-between gap-y-10">
      {media.map((item) => (
        <div key={item.id}>
          {item.url && item.file_type === "image" ? (
            <img
              src={item.url}
              alt={item.file_name}
              className="w-full h-25 sm:h-25 md:h-30 lg:h-35 xl:h-40 object-cover rounded-xl cursor-pointer hover:scale-105 transition duration-200"
            />
          ) : item.url && item.file_type === "video" ? (
            <div className="relative cursor-pointer hover:scale-105 transition duration-200">
              <img
                src={"/video.png"}
                alt={item.file_name}
                className="w-full h-40 object-cover rounded-xl"
              />

              <div className="absolute">
                <FaCirclePlay className="absolute left-16 bottom-16 text-[#bf4391] text-3xl" />
              </div>
            </div>
          ) : (
            <div className="w-full h-40 flex items-center justify-center bg-gray-100 rounded-xl text-xs text-gray-400">
              Couldn&apos;t load
            </div>
          )}
          <p className="text-xs mt-3 truncate">{item.file_name}</p>
        </div>
      ))}
    </div>
  );
}
