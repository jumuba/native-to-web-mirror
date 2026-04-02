import React, { useState, useRef } from "react";
import { ChevronLeft, ArrowUpDown, Plus, Trash2, Edit3, Lock, Share2, Palette, MoreVertical, ImageIcon, Camera, FolderOpen } from "lucide-react";
import { toast } from "sonner";
import type { Folder, Photo } from "@/lib/mockData";
import { useAppState } from "@/lib/AppStateContext";

interface FolderDetailProps {
  folder: Folder;
  onBack: () => void;
  onDelete?: () => void;
  onRename?: (newName: string) => void;
  onImportPhotos?: (files: File[]) => void;
  onChangeCover?: (image: string) => void;
}

type SortMode = "date" | "place" | "event";

export default function FolderDetail({ folder, onBack, onDelete, onRename, onImportPhotos, onChangeCover }: FolderDetailProps) {
  const { folders, albums } = useAppState();
  const [sort, setSort] = useState<SortMode>("date");
  const [showMenu, setShowMenu] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [name, setName] = useState(folder.title);
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());
  const [selectMode, setSelectMode] = useState(false);
  const [showCoverPicker, setShowCoverPicker] = useState(false);
  const [coverPickerSource, setCoverPickerSource] = useState<"main" | "folders" | "albums">("main");
  const [addingPhoto, setAddingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const photos = folder.photos;
  const sorted = [...photos].sort((a, b) => {
    if (sort === "date") return a.date.localeCompare(b.date);
    if (sort === "place") return a.place.localeCompare(b.place);
    return a.event.localeCompare(b.event);
  });

  const handleAddPhoto = () => fileInputRef.current?.click();

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setAddingPhoto(true);
    setTimeout(() => {
      setAddingPhoto(false);
      toast.success(`${files.length} photo${files.length > 1 ? "s" : ""} added!`);
      onImportPhotos?.(files);
    }, 800);
    e.target.value = "";
  };

  const handleRenameConfirm = () => {
    setRenaming(false);
    if (name.trim() && name !== folder.title) {
      onRename?.(name.trim());
      toast.success(`Renamed to "${name.trim()}"`);
    }
  };

  const handleCoverFromFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onChangeCover?.(url);
    toast.success("Cover photo updated!");
    setShowCoverPicker(false);
    e.target.value = "";
  };

  const handleCoverFromPhoto = (url: string) => {
    onChangeCover?.(url);
    toast.success("Cover photo updated!");
    setShowCoverPicker(false);
  };

  const handleShare = async (type: "folder" | "photos") => {
    const title = type === "folder" ? `Folder: ${name}` : `${selectedPhotos.size} selected photos`;
    if (navigator.share) {
      try { await navigator.share({ title, text: `Check out ${title} on SmartMemory App!`, url: window.location.href }); } catch {}
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied!");
    }
    setShowShareSheet(false);
  };

  const toggleSelectPhoto = (id: string) => {
    setSelectedPhotos((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <input ref={fileInputRef} type="file" multiple accept="image/*" style={{ display: "none" }} onChange={handleFilesSelected} />
      <input ref={coverInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleCoverFromFile} />

      {/* Header */}
      <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
        <div className="flex items-center">
          <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
            <ChevronLeft size={14} color="#394460" />
          </button>
          {renaming ? (
            <input value={name} onChange={(e) => setName(e.target.value)} onBlur={handleRenameConfirm}
              onKeyDown={(e) => e.key === "Enter" && handleRenameConfirm()} autoFocus
              style={{ fontSize: 12, fontWeight: 700, color: "#394460", border: "1px solid #8fa9dd", borderRadius: 4, padding: "2px 4px", outline: "none", width: 100 }} />
          ) : (
            <span style={{ fontSize: 12, fontWeight: 700, color: "#394460", marginLeft: 4 }}>{name}</span>
          )}
        </div>
        <div className="flex items-center" style={{ gap: 4 }}>
          <button onClick={handleAddPhoto} style={{ background: "none", border: "none", cursor: "pointer" }} disabled={addingPhoto}>
            <Plus size={14} color={addingPhoto ? "#c0c8d8" : "#8fa9dd"} />
          </button>
          <button onClick={() => setShowMenu(!showMenu)} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <MoreVertical size={14} color="#687287" />
          </button>
        </div>
      </div>

      {/* Cover with change button */}
      <div style={{ width: "100%", height: 70, borderRadius: 8, overflow: "hidden", marginBottom: 6, position: "relative" }}>
        <img src={folder.image} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <button onClick={() => setShowCoverPicker(true)} style={{
          position: "absolute", bottom: 4, right: 4, backgroundColor: "rgba(0,0,0,0.5)", border: "none",
          borderRadius: 12, padding: "2px 6px", cursor: "pointer", display: "flex", alignItems: "center", gap: 3,
        }}>
          <Camera size={8} color="#fff" />
          <span style={{ fontSize: 7, color: "#fff", fontWeight: 600 }}>Change</span>
        </button>
      </div>

      <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={handleCoverFromFile} />

      {/* Cover picker */}
      {showCoverPicker && (
        <div style={{ backgroundColor: "#fff", border: "1px solid #dde3f0", borderRadius: 8, padding: 8, marginBottom: 6, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", maxHeight: 220, overflowY: "auto" }}>
          {coverPickerSource === "main" && (
            <>
              <p style={{ fontSize: 9, fontWeight: 700, color: "#394460", marginBottom: 6 }}>Choose cover photo</p>
              <div className="flex flex-col" style={{ gap: 3 }}>
                <button onClick={() => coverInputRef.current?.click()} style={{
                  width: "100%", padding: "6px", borderRadius: 6, backgroundColor: "#8fa9dd", color: "#fff",
                  fontSize: 9, fontWeight: 600, border: "none", cursor: "pointer",
                }}>📁 From device</button>
                <button onClick={() => cameraInputRef.current?.click()} style={{
                  width: "100%", padding: "6px", borderRadius: 6, backgroundColor: "#7b9ed4", color: "#fff",
                  fontSize: 9, fontWeight: 600, border: "none", cursor: "pointer",
                }}>📷 From camera roll</button>
                <button onClick={() => setCoverPickerSource("folders")} style={{
                  width: "100%", padding: "6px", borderRadius: 6, backgroundColor: "#e8ecf4", color: "#394460",
                  fontSize: 9, fontWeight: 600, border: "none", cursor: "pointer",
                }}>📂 From a folder</button>
                <button onClick={() => setCoverPickerSource("albums")} style={{
                  width: "100%", padding: "6px", borderRadius: 6, backgroundColor: "#e8ecf4", color: "#394460",
                  fontSize: 9, fontWeight: 600, border: "none", cursor: "pointer",
                }}>📒 From an album</button>
              </div>
              {photos.length > 0 && (
                <>
                  <p style={{ fontSize: 8, color: "#a0a8b8", marginTop: 6, marginBottom: 3 }}>This folder's photos</p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 3 }}>
                    {photos.slice(0, 10).map((p) => (
                      <div key={p.id} onClick={() => handleCoverFromPhoto(p.url)} style={{ aspectRatio: "1", borderRadius: 4, overflow: "hidden", cursor: "pointer" }}>
                        <img src={p.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
          {coverPickerSource === "folders" && (
            <>
              <div className="flex items-center" style={{ marginBottom: 6, gap: 4 }}>
                <button onClick={() => setCoverPickerSource("main")} style={{ background: "none", border: "none", cursor: "pointer" }}>
                  <ChevronLeft size={12} color="#394460" />
                </button>
                <p style={{ fontSize: 9, fontWeight: 700, color: "#394460", margin: 0 }}>Pick from a folder</p>
              </div>
              {folders.filter((f) => f.photos.length > 0).map((f) => (
                <div key={f.id} style={{ marginBottom: 6 }}>
                  <p style={{ fontSize: 8, fontWeight: 600, color: "#687287", marginBottom: 3 }}>📂 {f.title}</p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 2 }}>
                    {f.photos.slice(0, 5).map((p) => (
                      <div key={p.id} onClick={() => { handleCoverFromPhoto(p.url); setCoverPickerSource("main"); }} style={{ aspectRatio: "1", borderRadius: 3, overflow: "hidden", cursor: "pointer" }}>
                        <img src={p.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {folders.filter((f) => f.photos.length > 0).length === 0 && (
                <p style={{ fontSize: 8, color: "#a0a8b8", textAlign: "center", padding: "10px 0" }}>No folders with photos</p>
              )}
            </>
          )}
          {coverPickerSource === "albums" && (
            <>
              <div className="flex items-center" style={{ marginBottom: 6, gap: 4 }}>
                <button onClick={() => setCoverPickerSource("main")} style={{ background: "none", border: "none", cursor: "pointer" }}>
                  <ChevronLeft size={12} color="#394460" />
                </button>
                <p style={{ fontSize: 9, fontWeight: 700, color: "#394460", margin: 0 }}>Pick from an album</p>
              </div>
              {albums.filter((a) => a.photos.length > 0).map((a) => (
                <div key={a.id} style={{ marginBottom: 6 }}>
                  <p style={{ fontSize: 8, fontWeight: 600, color: "#687287", marginBottom: 3 }}>📒 {a.title}</p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 2 }}>
                    {a.photos.slice(0, 5).map((p) => (
                      <div key={p.id} onClick={() => { handleCoverFromPhoto(p.url); setCoverPickerSource("main"); }} style={{ aspectRatio: "1", borderRadius: 3, overflow: "hidden", cursor: "pointer" }}>
                        <img src={p.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {albums.filter((a) => a.photos.length > 0).length === 0 && (
                <p style={{ fontSize: 8, color: "#a0a8b8", textAlign: "center", padding: "10px 0" }}>No albums with photos</p>
              )}
            </>
          )}
          <button onClick={() => { setShowCoverPicker(false); setCoverPickerSource("main"); }} style={{
            width: "100%", padding: "4px", borderRadius: 6, backgroundColor: "transparent", color: "#687287",
            fontSize: 8, fontWeight: 600, border: "none", cursor: "pointer", marginTop: 4,
          }}>Cancel</button>
        </div>
      )}

      {/* Context menu */}
      {showMenu && (
        <div style={{
          position: "absolute", right: 10, top: 30, backgroundColor: "#fff", border: "1px solid #dde3f0",
          borderRadius: 8, padding: "4px 0", zIndex: 20, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", minWidth: 130,
        }}>
          {[
            { label: "Rename", icon: Edit3, action: () => { setRenaming(true); setShowMenu(false); } },
            { label: "Change Cover", icon: Camera, action: () => { setShowCoverPicker(true); setShowMenu(false); } },
            { label: "Select Photos", icon: ImageIcon, action: () => { setSelectMode(!selectMode); setSelectedPhotos(new Set()); setShowMenu(false); } },
            { label: "Share Folder", icon: Share2, action: () => { setShowShareSheet(true); setShowMenu(false); } },
            { label: "Customize", icon: Palette, action: () => setShowMenu(false) },
            { label: "Password Lock", icon: Lock, action: () => setShowMenu(false) },
            { label: "Delete", icon: Trash2, action: () => { setShowDelete(true); setShowMenu(false); }, color: "#ef4444" },
          ].map((item) => (
            <button key={item.label} onClick={item.action} className="flex items-center"
              style={{ width: "100%", padding: "6px 10px", background: "none", border: "none", cursor: "pointer", gap: 6 }}>
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
            <button onClick={() => { onDelete?.(); toast.success("Folder deleted"); }} style={{ flex: 1, padding: "4px", borderRadius: 4, backgroundColor: "#ef4444", color: "#fff", fontSize: 9, fontWeight: 600, border: "none", cursor: "pointer" }}>Delete</button>
            <button onClick={() => setShowDelete(false)} style={{ flex: 1, padding: "4px", borderRadius: 4, backgroundColor: "#e8ecf4", color: "#687287", fontSize: 9, fontWeight: 600, border: "none", cursor: "pointer" }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Select mode bar */}
      {selectMode && (
        <div className="flex items-center justify-between" style={{ marginBottom: 6, padding: "4px 6px", backgroundColor: "#eef2fb", borderRadius: 6 }}>
          <span style={{ fontSize: 9, color: "#394460", fontWeight: 600 }}>{selectedPhotos.size} selected</span>
          <div className="flex" style={{ gap: 4 }}>
            <button onClick={() => { if (selectedPhotos.size > 0) setShowShareSheet(true); else toast.error("Select photos first"); }}
              style={{ padding: "3px 8px", borderRadius: 6, backgroundColor: "#8fa9dd", color: "#fff", fontSize: 8, fontWeight: 600, border: "none", cursor: "pointer" }}>
              Share Selected
            </button>
            <button onClick={() => { setSelectMode(false); setSelectedPhotos(new Set()); }}
              style={{ padding: "3px 8px", borderRadius: 6, backgroundColor: "#e8ecf4", color: "#687287", fontSize: 8, fontWeight: 600, border: "none", cursor: "pointer" }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Sort controls */}
      <div className="flex items-center" style={{ gap: 4, marginBottom: 8 }}>
        <ArrowUpDown size={10} color="#687287" />
        {(["date", "place", "event"] as SortMode[]).map((s) => (
          <button key={s} onClick={() => setSort(s)} style={{
            padding: "2px 8px", borderRadius: 10, fontSize: 8, fontWeight: 600, border: "none", cursor: "pointer",
            backgroundColor: sort === s ? "#8fa9dd" : "#e8ecf4", color: sort === s ? "#fff" : "#687287", textTransform: "capitalize",
          }}>{s}</button>
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
          {sorted.slice(0, 30).map((photo) => (
            <div key={photo.id} style={{ aspectRatio: "1", borderRadius: 4, overflow: "hidden", position: "relative", cursor: selectMode ? "pointer" : "default" }}
              onClick={() => selectMode && toggleSelectPhoto(photo.id)}>
              <img src={photo.url} alt={photo.title} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              {selectMode && (
                <div style={{
                  position: "absolute", top: 2, right: 2, width: 16, height: 16, borderRadius: 8,
                  backgroundColor: selectedPhotos.has(photo.id) ? "#8fa9dd" : "rgba(255,255,255,0.7)",
                  border: "1.5px solid #fff", display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {selectedPhotos.has(photo.id) && <span style={{ color: "#fff", fontSize: 10, fontWeight: 700 }}>✓</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {addingPhoto && (
        <div className="flex items-center justify-center" style={{ padding: "8px 0" }}>
          <div className="animate-spin" style={{ width: 16, height: 16, border: "2px solid #8fa9dd", borderTop: "2px solid transparent", borderRadius: "50%" }} />
          <span style={{ fontSize: 9, color: "#8fa9dd", marginLeft: 6 }}>Adding photos...</span>
        </div>
      )}

      {/* Share sheet */}
      {showShareSheet && (
        <div className="absolute inset-0 flex flex-col justify-end" style={{ zIndex: 10, borderRadius: 38, overflow: "hidden" }}>
          <div className="absolute inset-0" style={{ backgroundColor: "rgba(0,0,0,0.4)" }} onClick={() => setShowShareSheet(false)} />
          <div style={{ position: "relative", backgroundColor: "#fff", borderRadius: "12px 12px 0 0", padding: "12px 14px 20px" }}>
            <div className="flex items-center" style={{ marginBottom: 8, gap: 6 }}>
              <button onClick={() => setShowShareSheet(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}>
                <ChevronLeft size={14} color="#394460" />
              </button>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#394460", margin: 0 }}>Share</p>
              <span style={{ fontSize: 8, color: "#687287", marginLeft: "auto" }}>SmartMemory App</span>
            </div>
            <div className="flex flex-col" style={{ gap: 6 }}>
              <button onClick={() => handleShare("folder")}
                style={{ width: "100%", padding: "8px", borderRadius: 6, backgroundColor: "#e8ecf4", color: "#394460", fontSize: 10, fontWeight: 600, border: "none", cursor: "pointer", textAlign: "left" }}>
                📁 Share Folder "{name}"
              </button>
              {selectedPhotos.size > 0 && (
                <button onClick={() => handleShare("photos")}
                  style={{ width: "100%", padding: "8px", borderRadius: 6, backgroundColor: "#e8ecf4", color: "#394460", fontSize: 10, fontWeight: 600, border: "none", cursor: "pointer", textAlign: "left" }}>
                  🖼️ Share {selectedPhotos.size} Selected Photo{selectedPhotos.size > 1 ? "s" : ""}
                </button>
              )}
              <button onClick={() => setShowShareSheet(false)}
                style={{ width: "100%", padding: "6px", borderRadius: 6, backgroundColor: "transparent", color: "#687287", fontSize: 9, fontWeight: 600, border: "none", cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
