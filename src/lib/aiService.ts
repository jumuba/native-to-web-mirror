import { supabase } from "@/integrations/supabase/client";
import type { Album, Folder, Photo } from "@/lib/mockData";

export type AiPhotoSearchResult = Pick<Photo, "id" | "title" | "url" | "event" | "place"> & {
  album_id: string | null;
  taken_at: string | null;
};

export async function suggestAlbumTitles(context: { albums: Album[]; folders: Folder[]; category: string; theme: string }) {
  const compactContext = {
    category: context.category,
    theme: context.theme,
    albums: context.albums.slice(0, 8).map((album) => ({
      title: album.title,
      category: album.category,
      notes: album.notes?.map((note) => note.text).slice(0, 3),
      photos: album.photos.slice(0, 8).map((photo) => ({
        title: photo.title,
        event: photo.event,
        place: photo.place,
        date: photo.date,
      })),
    })),
    folders: context.folders.slice(0, 6).map((folder) => ({
      title: folder.title,
      photos: folder.photos.slice(0, 8).map((photo) => ({
        title: photo.title,
        event: photo.event,
        place: photo.place,
        date: photo.date,
      })),
    })),
  };

  const { data, error } = await supabase.functions.invoke("smartmemory-ai", {
    body: {
      action: "suggest-album-title",
      context: compactContext,
    },
  });

  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return (data?.titles ?? []) as string[];
}

export async function searchPhotosWithAi(query: string) {
  const { data, error } = await supabase.functions.invoke("smartmemory-ai", {
    body: {
      action: "search-photos",
      query,
    },
  });

  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return (data?.results ?? []) as AiPhotoSearchResult[];
}
