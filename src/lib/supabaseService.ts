// Thin service layer between the app and Supabase.
// UI stays unchanged; these helpers mirror local state to the backend.
import { supabase } from "@/integrations/supabase/client";
import type { Album, Photo, Reminder } from "./mockData";

// ─── ALBUMS ─────────────────────────────────────────────
export async function fetchAlbums(): Promise<Album[] | null> {
  const { data: albums, error } = await supabase
    .from("albums")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !albums) return null;

  const { data: photos } = await supabase.from("photos").select("*");
  const photosByAlbum = new Map<string, Photo[]>();
  (photos ?? []).forEach((p: any) => {
    const list = photosByAlbum.get(p.album_id) ?? [];
    list.push({
      id: p.id,
      url: p.url,
      title: p.title ?? "",
      date: p.taken_at ?? "",
      place: p.place ?? "",
      event: p.event ?? "",
    });
    photosByAlbum.set(p.album_id, list);
  });

  return albums.map((a: any) => ({
    id: a.id,
    title: a.title,
    image: a.cover_image ?? "",
    category: a.category ?? "",
    photoCount: a.photo_count ?? 0,
    createdAt: (a.created_at ?? "").slice(0, 10),
    isCollaborative: !!a.is_collaborative,
    isPrivate: !!a.is_private,
    theme: a.theme ?? "",
    photos: photosByAlbum.get(a.id) ?? [],
    notes: a.notes ?? [],
    music: a.music ?? null,
  }));
}

export async function upsertAlbum(album: Album) {
  const row = {
    id: album.id,
    title: album.title,
    cover_image: album.image,
    category: album.category,
    theme: album.theme,
    is_private: album.isPrivate,
    is_collaborative: album.isCollaborative,
    photo_count: album.photoCount,
    music: album.music,
    notes: album.notes as any,
  };
  await supabase.from("albums").upsert(row);
}

export async function deleteAlbumRow(id: string) {
  await supabase.from("albums").delete().eq("id", id);
}

// ─── PHOTOS ─────────────────────────────────────────────
const PHOTO_BUCKET = "smartmemory-photos";

/**
 * Upload a single image File to Supabase Storage and return its public URL.
 * Returns null if upload fails (caller can fall back to a local data URL).
 */
export async function uploadPhotoFile(file: File, albumId?: string): Promise<string | null> {
  try {
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
    const rand = (crypto as any).randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const path = `${albumId ?? "misc"}/${rand}.${ext}`;
    const { error } = await supabase.storage
      .from(PHOTO_BUCKET)
      .upload(path, file, { contentType: file.type || "image/jpeg", upsert: false });
    if (error) {
      console.warn("Storage upload failed:", error.message);
      return null;
    }
    const { data } = supabase.storage.from(PHOTO_BUCKET).getPublicUrl(path);
    return data?.publicUrl ?? null;
  } catch (e) {
    console.warn("Storage upload exception:", e);
    return null;
  }
}

export async function insertPhotos(albumId: string, photos: Photo[]) {
  if (!photos.length) return;
  const rows = photos.map((p) => ({
    id: p.id,
    album_id: albumId,
    url: p.url,
    title: p.title,
    place: p.place,
    event: p.event,
    taken_at: p.date || null,
  }));
  await supabase.from("photos").insert(rows);
}

// ─── REMINDERS ──────────────────────────────────────────
export async function fetchReminders(): Promise<Reminder[] | null> {
  const { data, error } = await supabase
    .from("reminders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !data) return null;
  return data.map((r: any) => ({
    id: r.id,
    title: r.title,
    date: r.remind_at ?? "",
    message: r.message ?? "",
    linkedTo: r.linked_to ?? null,
    linkedType: r.linked_type ?? null,
  }));
}

export async function insertReminder(r: Reminder) {
  await supabase.from("reminders").insert({
    id: r.id,
    title: r.title,
    message: r.message,
    remind_at: r.date || null,
    linked_to: r.linkedTo,
    linked_type: r.linkedType,
  });
}

export async function deleteReminderRow(id: string) {
  await supabase.from("reminders").delete().eq("id", id);
}

// ─── SUBSCRIPTIONS (read-ready) ─────────────────────────
export async function fetchSubscription(userId: string) {
  const { data } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  return data;
}

// ─── SHARES (prepared for later) ────────────────────────
export async function createShareLink(resourceType: "album" | "folder" | "photo", resourceId: string) {
  const { data } = await supabase
    .from("shares")
    .insert({ resource_type: resourceType, resource_id: resourceId })
    .select()
    .single();
  return data;
}

// ─── USERS (profile) ────────────────────────────────────
export async function upsertUserProfile(profile: {
  id?: string;
  email?: string;
  display_name?: string;
  avatar_url?: string;
  plan?: string;
}) {
  await supabase.from("users").upsert(profile);
}
