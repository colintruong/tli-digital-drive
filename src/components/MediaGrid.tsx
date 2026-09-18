"use client";

import { MediaItemWithUrl } from "@/src/lib/media";
import MediaCard from "@/src/components/MediaCard";

interface MediaGridProps {
  media: MediaItemWithUrl[];
  loading: boolean;
}

export default function MediaGrid({ media, loading }: MediaGridProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#e97b8e]"></div>
      </div>
    );
  }

  if (media.length === 0) {
    return (
      <div className="text-center py-20 text-[#8b8888]">
        <p>Upload your first photo!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(2,100px)] sm:grid-cols-[repeat(3,100px)] md:grid-cols-[repeat(4,120px)] lg:grid-cols-[repeat(5,140px)] xl:grid-cols-[repeat(8,160px)] justify-between gap-y-10">
      {media.map((item) => (
        <div key={item.id}>
          <MediaCard key={item.id} item={item} />
        </div>
      ))}
    </div>
  );
}
