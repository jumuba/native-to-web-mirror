import React, { useState } from "react";
import { ChevronLeft, ArrowUpDown, Plus, Trash2, Edit3, Lock, Share2, Palette, MoreVertical, ImageIcon } from "lucide-react";
import type { Folder, Photo } from "@/lib/mockData";

interface FolderDetailProps {
  folder: Folder;
  onBack: () => void;
}

type SortMode = "date" | "place" | "event";

export default function FolderDetail({ folder, onBack }: FolderDetailProps) {
  const [sort, setSort] = useState<SortMode>("date");
  const [showMenu, setShowMenu] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [name, setName] = useState(folder.title);
  const [photos, setPhotos] = useState<Photo[]>(folder.photos);
  const [addingPhoto, setAddingPhoto] = useState(false);

  const sorted = [...photos].sort((a, b) => {
    if (sort === "date") return a.date.localeCompare(b.date);
    if (sort === "place") return a.place.localeCompare(b.place);
    return a.event.localeCompare(b.event);
  });

  const handleAddPhoto = () => {
    setAddingPhoto(true);
    setTimeout(() => {
      setPhotos([
        ...photos,
        {
          id: `new-${Date.now()}`,
          url: `https://picsum.photos/seed/${Date.now()}/300/300`,
          title: "New Photo",
          date: "2026-04-01",
          place: "London",
          event: "Added",
        },
      ]);
      setAddingPhoto(false);
    }, 800);
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {/* Header */}
      <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
        <div className="flex items-center">
          <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
            <ChevronLeft size={14} color="#394460" />
          </button>
          {renaming ? (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setRenaming(false)}
              onKeyDown={(e) => e.key === "Enter" && setRenaming(false)}
              autoFocus
              style={{ fontSize: 12, fontWeight: 700, color: "#394460", border: "1px solid #8fa9dd", borderRadius: 4, padding: "2px 4px", outline: "none", width: 100 }}
            />
          ) : (
            <span style={{ fontSize: 12, fontWeight: 700, color: "#394460", marginLeft: 4 }}>{name}</span>
          )}
        </div>
        <div className="flex items-center" style={{ gap: 4 }}>
          <button onClick={handleAddPhoto} style={{ background: "none", border: "none", cursor: "pointer" }} disabled={addingPhoto}>
            <Plus size={14} color={addingPhoto ? "#c0c8d8" : "#8fa9dd"} />
          </button>
          <button onClick={() => setShowMenu(!showMenu)} style={{ background: "none", border: "none", cursor: "pointer", position: "relative" }}>
            <MoreVertical size={14} color="#687287" />
          </button>
        </div>
      </div>

      {/* Context menu */}
      {showMenu && (
        <div
          style={{
            position: "absolute",
            right: 10,
            top: 30,
            backgroundColor: "#fff",
            border: "1px solid #dde3f0",
            borderRadius: 8,
            padding: "4px 0",
            zIndex: 10,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            minWidth: 120,
          }}
        >
          {[
            { label: "Rename", icon: Edit3, action: () => { setRenaming(true); setShowMenu(false); } },
            { label: "Customize", icon: Palette, action: () => setShowMenu(false) },
            { label: "Password Lock", icon: Lock, action: () => setShowMenu(false) },
            { label: "Share", icon: Share2, action: () => setShowMenu(false) },
            { label: "Delete", icon: Trash2, action: () => { setShowDelete(true); setShowMenu(false); }, color: "#ef4444" },
          ].map((item) => (
            <button
              key={item.label}
              onClick={item.action}
              className="flex items-center"
              style={{ width: "100%", padding: "6px 10px", background: "none", border: "none", cursor: "pointer", gap: 6 }}
            >
              <item.icon size={10} color={item.color || "#687287"} />
              <span style={{ fontSize: 9, color: item.color || "#394460", fontWeight: 600 }}>{item.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Delete confirmation */}
      {showDelete && (
        <div style={{ backgroundColor: "#fff3f3", border: "1px solid #fecaca", borderRadius: 8, padding: 10, marginBottom: 8 }}>
          <p style={{ fontSize: 10, color: "#ef4444", fontWeight: 600, marginBottom: 6 }}>Delete "{name}"?</p>
          <div className="flex" style={{ gap: 6 }}>
            <button onClick={() => { setShowDelete(false); onBack(); }} style={{ flex: 1, padding: "4px", borderRadius: 4, backgroundColor: "#ef4444", color: "#fff", fontSize: 9, fontWeight: 600, border: "none", cursor: "pointer" }}>
              Delete
            </button>
            <button onClick={() => setShowDelete(false)} style={{ flex: 1, padding: "4px", borderRadius: 4, backgroundColor: "#e8ecf4", color: "#687287", fontSize: 9, fontWeight: 600, border: "none", cursor: "pointer" }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Sort controls */}
      <div className="flex items-center" style={{ gap: 4, marginBottom: 8 }}>
        <ArrowUpDown size={10} color="#687287" />
        {(["date", "place", "event"] as SortMode[]).map((s) => (
          <button
            key={s}
            onClick={() => setSort(s)}
            style={{
              padding: "2px 8px",
              borderRadius: 10,
              fontSize: 8,
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              backgroundColor: sort === s ? "#8fa9dd" : "#e8ecf4",
              color: sort === s ? "#fff" : "#687287",
              textTransform: "capitalize",
            }}
          >
            {s}
          </button>
        ))}
        <span style={{ fontSize: 8, color: "#a0a8b8", marginLeft: "auto" }}>{photos.length} photos</span>
      </div>

      {/* Photo grid */}
      {photos.length === 0 ? (
        <div className="flex flex-col items-center" style={{ padding: "30px 0" }}>
          <ImageIcon size={28} color="#c0c8d8" style={{ marginBottom: 8 }} />
          <span style={{ fontSize: 11, color: "#8fa9dd", fontWeight: 600 }}>No photos yet</span>
          <span style={{ fontSize: 9, color: "#a0a8b8" }}>Tap + to add photos</span>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 3 }}>
          {sorted.slice(0, 18).map((photo) => (
            <div key={photo.id} style={{ aspectRatio: "1", borderRadius: 4, overflow: "hidden" }}>
              <img src={photo.url} alt={photo.title} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          ))}
        </div>
      )}

      {addingPhoto && (
        <div className="flex items-center justify-center" style={{ padding: "8px 0" }}>
          <div className="animate-spin" style={{ width: 16, height: 16, border: "2px solid #8fa9dd", borderTop: "2px solid transparent", borderRadius: "50%" }} />
          <span style={{ fontSize: 9, color: "#8fa9dd", marginLeft: 6 }}>Adding photo...</span>
        </div>
      )}
    </div>
  );
}
