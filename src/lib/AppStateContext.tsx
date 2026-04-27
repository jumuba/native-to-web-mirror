import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { mockFolders, mockAlbums, normalizeAlbums, type Folder, type Album, type Photo } from "./mockData";

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
  } catch {}
  return fallback;
}

interface AppState {
  folders: Folder[];
  albums: Album[];
  createFolder: (data: { name: string; color: string; font: string; hasPassword: boolean; isPrivate: boolean }) => void;
  createAlbum: (data: { title: string; category: string; theme: string; isPrivate: boolean }) => void;
  deleteFolder: (id: string) => void;
  deleteAlbum: (id: string) => void;
  renameFolder: (id: string, name: string) => void;
  renameAlbum: (id: string, title: string) => void;
  addPhotosToFolder: (id: string, photos: Photo[]) => void;
  addPhotosToAlbum: (id: string, photos: Photo[]) => void;
  updateFolderCover: (id: string, image: string) => void;
  updateAlbumCover: (id: string, image: string) => void;
  updateAlbum: (id: string, updates: Partial<Album>) => void;
}

const AppStateContext = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [folders, setFolders] = useState<Folder[]>(() => loadFromStorage("folders", mockFolders));
  const [albums, setAlbums] = useState<Album[]>(() => normalizeAlbums(loadFromStorage("albums", mockAlbums)));

  useEffect(() => { try { localStorage.setItem("folders", JSON.stringify(folders)); } catch (e) { console.warn("localStorage full, folders not saved"); } }, [folders]);
  useEffect(() => { try { localStorage.setItem("albums", JSON.stringify(normalizeAlbums(albums))); } catch (e) { console.warn("localStorage full, albums not saved"); } }, [albums]);

  const createFolder = useCallback((data: { name: string; color: string; font: string; hasPassword: boolean; isPrivate: boolean }) => {
    const newFolder: Folder = {
      id: `folder-${Date.now()}`,
      title: data.name,
      image: `https://picsum.photos/seed/${Date.now()}/300/300`,
      color: data.color,
      photoCount: 0,
      createdAt: new Date().toISOString().slice(0, 10),
      isLocked: data.hasPassword,
      photos: [],
    };
    setFolders((prev) => [newFolder, ...prev]);
  }, []);

  const createAlbum = useCallback((data: { title: string; category: string; theme: string; isPrivate: boolean }) => {
    const newAlbum: Album = {
      id: `album-${Date.now()}`,
      title: data.title,
      image: `https://picsum.photos/seed/${Date.now()}/300/300`,
      category: data.category,
      photoCount: 0,
      createdAt: new Date().toISOString().slice(0, 10),
      isCollaborative: false,
      isPrivate: data.isPrivate,
      theme: data.theme,
      photos: [],
      notes: [],
      music: null,
    };
    setAlbums((prev) => normalizeAlbums([newAlbum, ...prev]));
  }, []);

  const deleteFolder = useCallback((id: string) => setFolders((p) => p.filter((f) => f.id !== id)), []);
  const deleteAlbum = useCallback((id: string) => setAlbums((p) => normalizeAlbums(p.filter((a) => a.id !== id))), []);
  const renameFolder = useCallback((id: string, name: string) => setFolders((p) => p.map((f) => f.id === id ? { ...f, title: name } : f)), []);
  const renameAlbum = useCallback((id: string, title: string) => setAlbums((p) => normalizeAlbums(p.map((a) => a.id === id ? { ...a, title } : a))), []);

  const addPhotosToFolder = useCallback((id: string, photos: Photo[]) => {
    setFolders((p) => p.map((f) => f.id === id ? { ...f, photos: [...f.photos, ...photos], photoCount: f.photoCount + photos.length } : f));
  }, []);

  const addPhotosToAlbum = useCallback((id: string, photos: Photo[]) => {
    setAlbums((p) => normalizeAlbums(p.map((a) => a.id === id ? { ...a, photos: [...a.photos, ...photos], photoCount: a.photoCount + photos.length } : a)));
  }, []);

  const updateFolderCover = useCallback((id: string, image: string) => {
    setFolders((p) => p.map((f) => f.id === id ? { ...f, image } : f));
  }, []);

  const updateAlbumCover = useCallback((id: string, image: string) => {
    setAlbums((p) => normalizeAlbums(p.map((a) => a.id === id ? { ...a, image } : a)));
  }, []);

  const updateAlbum = useCallback((id: string, updates: Partial<Album>) => {
    setAlbums((p) => normalizeAlbums(p.map((a) => a.id === id ? { ...a, ...updates } : a)));
  }, []);

  return (
    <AppStateContext.Provider value={{
      folders, albums, createFolder, createAlbum, deleteFolder, deleteAlbum,
      renameFolder, renameAlbum, addPhotosToFolder, addPhotosToAlbum,
      updateFolderCover, updateAlbumCover, updateAlbum,
    }}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState(): AppState {
  const ctx = useContext(AppStateContext);
  if (!ctx) {
    throw new Error("useAppState must be used within AppStateProvider");
  }
  return ctx;
}

