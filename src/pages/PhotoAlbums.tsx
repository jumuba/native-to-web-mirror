import React, { useState } from "react";
import PhoneLayout from "@/components/PhoneLayout";
import AlbumDetail from "@/components/screens/AlbumDetail";
import { useAppState } from "@/lib/AppStateContext";

function Card({ image, title, onClick }: { image: string; title: string; onClick?: () => void }) {
  return (
    <div className="transition-all duration-200 ease-out hover:scale-[1.03]" onClick={onClick} style={{ width: 110, marginBottom: 14, cursor: "pointer" }}>
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
  const { albums, deleteAlbum, renameAlbum, addPhotosToAlbum, updateAlbumCover, updateAlbum } = useAppState();
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);

  const selectedAlbum = selectedAlbumId ? albums.find((a) => a.id === selectedAlbumId) || null : null;

  const handleImportPhotos = (albumId: string, files: File[]) => {
    const newPhotos = files.map((file, i) => ({
      id: `imported-${Date.now()}-${i}`,
      url: URL.createObjectURL(file),
      title: file.name,
      date: new Date().toISOString().slice(0, 10),
      place: "Imported",
      event: "Import",
    }));
    addPhotosToAlbum(albumId, newPhotos);
  };

  if (selectedAlbum) {
    return (
      <PhoneLayout
        cards={[]}
        customContent={
          <AlbumDetail
            album={selectedAlbum}
            onBack={() => setSelectedAlbumId(null)}
            onDelete={() => { deleteAlbum(selectedAlbum.id); setSelectedAlbumId(null); }}
            onRename={(t) => renameAlbum(selectedAlbum.id, t)}
            onImportPhotos={(files) => handleImportPhotos(selectedAlbum.id, files)}
            onChangeCover={(img) => updateAlbumCover(selectedAlbum.id, img)}
            onUpdateAlbum={(updates) => updateAlbum(selectedAlbum.id, updates)}
          />
        }
      />
    );
  }

  return (
    <PhoneLayout
      cards={[]}
      customContent={
        <div className="flex flex-wrap justify-between" style={{ paddingBottom: 12 }}>
          {albums.map((album) => (
            <Card key={album.id} image={album.image} title={album.title} onClick={() => setSelectedAlbumId(album.id)} />
          ))}
        </div>
      }
    />
  );
}
