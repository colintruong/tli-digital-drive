import { supabase } from "@/src/lib/supabase";
import { MediaItem } from "@/src/types/database";

export interface MediaItemWithUrl extends MediaItem {
    url?: string;
}

export async function fetchUserMedia(): Promise<MediaItemWithUrl[]> {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("fetchUserMedia: no authenticated user");
      return [];
    }

    const { data: mediaRecords, error: mediaError } = await supabase
      .from("media")
      .select("*")
      .eq("user_id", user.id)
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    if (mediaError) {
        console.error("fetchUserMedia: failed to fetch records", mediaError);
        return [];
    }

    if (!mediaRecords || mediaRecords.length === 0) {
      return [];
    }

    const fileKeys = mediaRecords.map((record) => record.file_key);

    const response = await fetch("/api/media/signed-urls", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileKeys: fileKeys }),
    });

    if (!response.ok) {
        console.error("fetchUserMedia: failed to fetch signed URLs");
        return mediaRecords.map((record) => ({ ...record, url: undefined}));
    }

    const { urls }: { urls: Record<string, string> } = await response.json();

    return mediaRecords.map((record) => ({
        ...record,
        url: urls[record.file_key],
    }));

  } catch (error) {
    console.error("fetchUserMedia: unexpected error", error);
    return [];
  }
}
