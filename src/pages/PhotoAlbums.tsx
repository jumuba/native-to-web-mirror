import React, { useState } from "react";
import PhoneLayout from "@/components/PhoneLayout";
import AlbumDetail from "@/components/screens/AlbumDetail";
import { mockAlbums, type Album } from "@/lib/mockData";

function Card({ image, title, onClick }: { image: string; title: string; onClick?: () => void }) {
  return (
    <div
      className="transition-all duration-200 ease-out hover:scale-[1.03]"
      onClick={onClick}
      style={{ width: 110, marginBottom: 14, cursor: "pointer" }}
    >
      <div style={{ width: 110, height: 95, borderRadius: "8px 8px 0 0", overflow: "hidden" }}>
        <img src={image} alt={title} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      </div>
      <div style={{ width: 110, backgroundColor: "#ffffff", borderRadius: "0 0 8px 8px", padding: "4px 6px", minHeight: 28 }}>
        <span style={{ fontSize: 10, color: "#4a5568", fontWeight: 500 }}>{title}</span>
      </div>
    </div>
  );
}

export default function PhotoAlbums() {
  const [albums, setAlbums] = useState<Album[]>(mockAlbums);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);

  const handleCreateAlbum = (data: { title: string; category: string; theme: string; isPrivate: boolean }) => {
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
    setAlbums((prev) => [newAlbum, ...prev]);
  };

  const handleDeleteAlbum = (albumId: string) => {
    setAlbums((prev) => prev.filter((a) => a.id !== albumId));
    setSelectedAlbum(null);
  };

  const handleRenameAlbum = (albumId: string, newTitle: string) => {
    setAlbums((prev) => prev.map((a) => a.id === albumId ? { ...a, title: newTitle } : a));
  };

  const handleImportPhotos = (albumId: string, files: File[]) => {
    const newPhotos = files.map((file, i) => ({
      id: `imported-${Date.now()}-${i}`,
      url: URL.createObjectURL(file),
      title: file.name,
      date: new Date().toISOString().slice(0, 10),
      place: "Imported",
      event: "Import",
    }));
    setAlbums((prev) =>
      prev.map((a) =>
        a.id === albumId
          ? { ...a, photos: [...a.photos, ...newPhotos], photoCount: a.photoCount + newPhotos.length }
          : a
      )
    );
    if (selectedAlbum?.id === albumId) {
      setSelectedAlbum((prev) => prev ? { ...prev, photos: [...prev.photos, ...newPhotos], photoCount: prev.photoCount + newPhotos.length } : prev);
    }
  };

  if (selectedAlbum) {
    return (
      <PhoneLayout
        cards={[]}
        onCreateAlbum={handleCreateAlbum}
        customContent={
          <AlbumDetail
            album={selectedAlbum}
            onBack={() => setSelectedAlbum(null)}
            onDelete={() => handleDeleteAlbum(selectedAlbum.id)}
            onRename={(newTitle) => handleRenameAlbum(selectedAlbum.id, newTitle)}
            onImportPhotos={(files) => handleImportPhotos(selectedAlbum.id, files)}
          />
        }
      />
    );
  }

  return (
    <PhoneLayout
      cards={[]}
      onCreateAlbum={handleCreateAlbum}
      customContent={
        <div className="flex flex-wrap justify-between" style={{ paddingBottom: 12 }}>
          {albums.map((album) => (
            <Card
              key={album.id}
              image={album.image}
              title={album.title}
              onClick={() => setSelectedAlbum(album)}
            />
          ))}
        </div>
      }
    />
  );
}
