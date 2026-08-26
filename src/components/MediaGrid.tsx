/* eslint-disable @next/next/no-img-element */
"use client";

import { MediaItemWithUrl } from "@/src/lib/media";

interface MediaGridProps {
    media: MediaItemWithUrl[];
    loading: boolean;
}

export default function MediaGrid({ media, loading }: MediaGridProps) {
    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {media.map((item) => (
                <div key={item.id}>
                    {item.url ? (
                        <img
                        src={item.url}
                        alt={item.file_name}
                        className="w-full h-40 object-cover rounded-xl"
                        />
                    ) : (
                        <div className="w-full h-40 flex items-center justify-center bg-gray-100 rounded-xl text-xs text-gray-400">
                            Couldn&apos;t load
                        </div>
                    )}
                    <p className="text-xs mt-1 truncate">{item.file_name}</p>
                </div>
            ))}
        </div>
    );
}