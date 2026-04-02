import React, { useState } from "react";
import PhoneLayout from "@/components/PhoneLayout";
import FolderDetail from "@/components/screens/FolderDetail";
import { mockFolders, type Folder } from "@/lib/mockData";

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

export default function Index() {
  const [folders, setFolders] = useState<Folder[]>(mockFolders);
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);

  const handleCreateFolder = (data: { name: string; color: string; font: string; hasPassword: boolean; isPrivate: boolean }) => {
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
  };

  const handleDeleteFolder = (folderId: string) => {
    setFolders((prev) => prev.filter((f) => f.id !== folderId));
    setSelectedFolder(null);
  };

  const handleRenameFolder = (folderId: string, newName: string) => {
    setFolders((prev) => prev.map((f) => f.id === folderId ? { ...f, title: newName } : f));
  };

  const handleImportPhotos = (folderId: string, files: File[]) => {
    const newPhotos = files.map((file, i) => ({
      id: `imported-${Date.now()}-${i}`,
      url: URL.createObjectURL(file),
      title: file.name,
      date: new Date().toISOString().slice(0, 10),
      place: "Imported",
      event: "Import",
    }));
    setFolders((prev) =>
      prev.map((f) =>
        f.id === folderId
          ? { ...f, photos: [...f.photos, ...newPhotos], photoCount: f.photoCount + newPhotos.length }
          : f
      )
    );
    if (selectedFolder?.id === folderId) {
      setSelectedFolder((prev) => prev ? { ...prev, photos: [...prev.photos, ...newPhotos], photoCount: prev.photoCount + newPhotos.length } : prev);
    }
  };

  if (selectedFolder) {
    return (
      <PhoneLayout
        cards={[]}
        onCreateFolder={handleCreateFolder}
        customContent={
          <FolderDetail
            folder={selectedFolder}
            onBack={() => setSelectedFolder(null)}
            onDelete={() => handleDeleteFolder(selectedFolder.id)}
            onRename={(newName) => handleRenameFolder(selectedFolder.id, newName)}
            onImportPhotos={(files) => handleImportPhotos(selectedFolder.id, files)}
          />
        }
      />
    );
  }

  return (
    <PhoneLayout
      cards={[]}
      onCreateFolder={handleCreateFolder}
      customContent={
        <div className="flex flex-wrap justify-between" style={{ paddingBottom: 12 }}>
          {folders.map((folder) => (
            <Card
              key={folder.id}
              image={folder.image}
              title={folder.title}
              onClick={() => setSelectedFolder(folder)}
            />
          ))}
        </div>
      }
    />
  );
}
