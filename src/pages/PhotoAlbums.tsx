import React, { useState } from "react";
import PhoneLayout from "@/components/PhoneLayout";
import AlbumDetail from "@/components/screens/AlbumDetail";
import { useAppState } from "@/lib/AppStateContext";
import { uploadPhotoFile } from "@/lib/supabaseService";

function Card({ image, title, onClick }: { image: string; title: string; onClick?: () => void }) {
  return (
    <div className="transition-all duration-200 ease-out hover:scale-[1.02]" onClick={onClick} style={{ width: 110, marginBottom: 14, cursor: "pointer" }}>
      <div style={{
        width: 110,
        backgroundColor: "rgba(255,255,255,0.96)",
        borderRadius: 8,
        padding: 3,
        boxShadow: "0 3px 10px rgba(124, 142, 174, 0.08)",
      }}>
        <div style={{ width: 104, height: 95, borderRadius: 6, overflow: "hidden", margin: "0 auto" }}>
          <img src={image} alt={title} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </div>
        <div style={{ width: "100%", padding: "5px 5px 4px", minHeight: 26, display: "flex", alignItems: "flex-start" }}>
          <span style={{ fontSize: 10, color: "#4a5568", fontWeight: 500, lineHeight: "11px" }}>{title}</span>
        </div>
      </div>
    </div>
  );
}

export default function PhotoAlbums() {
  const { albums, deleteAlbum, renameAlbum, addPhotosToAlbum, updateAlbumCover, updateAlbum } = useAppState();
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);

  const selectedAlbum = selectedAlbumId ? albums.find((a) => a.id === selectedAlbumId) || null : null;

  const compressImage = (file: File, maxWidth = 800, quality = 0.7): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ratio = Math.min(maxWidth / img.width, 1);
          canvas.width = img.width * ratio;
          canvas.height = img.height * ratio;
          const ctx = canvas.getContext("2d")!;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", quality));
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImportPhotos = async (albumId: string, files: File[]) => {
    const newPhotos = await Promise.all(
      files.map(async (file, i) => {
        // Try Supabase Storage first; fall back to compressed local data URL
        const publicUrl = await uploadPhotoFile(file, albumId);
        const url = publicUrl ?? (await compressImage(file));
        return {
          id: `imported-${Date.now()}-${i}`,
          url,
          title: file.name,
          date: new Date().toISOString().slice(0, 10),
          place: "Imported",
          event: "Import",
        };
      })
    );
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
        <div className="flex flex-wrap justify-between" style={{ paddingBottom: 12, alignItems: "flex-start" }}>
          {albums.map((album) => (
            <Card key={album.id} image={album.image} title={album.title} onClick={() => setSelectedAlbumId(album.id)} />
          ))}
        </div>
      }
    />
  );
}
