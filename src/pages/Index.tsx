import React, { useState, useRef } from "react";
import PhoneLayout from "@/components/PhoneLayout";
import FolderDetail from "@/components/screens/FolderDetail";
import { useAppState } from "@/lib/AppStateContext";
import type { Folder } from "@/lib/mockData";

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

export default function Index() {
  const { folders, createFolder, deleteFolder, renameFolder, addPhotosToFolder, updateFolderCover } = useAppState();
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  const selectedFolder = selectedFolderId ? folders.find((f) => f.id === selectedFolderId) || null : null;

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

  const handleImportPhotos = async (folderId: string, files: File[]) => {
    const newPhotos = await Promise.all(
      files.map(async (file, i) => ({
        id: `imported-${Date.now()}-${i}`,
        url: await compressImage(file),
        title: file.name,
        date: new Date().toISOString().slice(0, 10),
        place: "Imported",
        event: "Import",
      }))
    );
    addPhotosToFolder(folderId, newPhotos);
  };

  if (selectedFolder) {
    return (
      <PhoneLayout
        cards={[]}
        customContent={
          <FolderDetail
            folder={selectedFolder}
            onBack={() => setSelectedFolderId(null)}
            onDelete={() => { deleteFolder(selectedFolder.id); setSelectedFolderId(null); }}
            onRename={(n) => renameFolder(selectedFolder.id, n)}
            onImportPhotos={(files) => handleImportPhotos(selectedFolder.id, files)}
            onChangeCover={(img) => updateFolderCover(selectedFolder.id, img)}
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
          {folders.map((folder) => (
            <Card key={folder.id} image={folder.image} title={folder.title} onClick={() => setSelectedFolderId(folder.id)} />
          ))}
        </div>
      }
    />
  );
}
