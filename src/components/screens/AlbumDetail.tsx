import React, { useState, useRef, useEffect } from "react";
import {
  ChevronLeft, ChevronRight, Share2, Download, Music, MessageSquare,
  Smile, Mic, Heart, ImageIcon, Plus, Users, Lock,
  Edit3, Trash2, MoreVertical, MicOff, Camera,
} from "lucide-react";
import { toast } from "sonner";
import type { Album, Note } from "@/lib/mockData";
import { useAppState } from "@/lib/AppStateContext";

interface AlbumDetailProps {
  album: Album;
  onBack: () => void;
  onDelete?: () => void;
  onRename?: (newTitle: string) => void;
  onImportPhotos?: (files: File[]) => void;
  onChangeCover?: (image: string) => void;
  onUpdateAlbum?: (updates: Partial<Album>) => void;
}

type PageItem = {
  type: "photo" | "note" | "emoji" | "gif" | "voice" | "music" | "video";
  content: string;
  id: string;
};

const EMOJI_LIST = ["❤️", "😍", "🎉", "🥳", "🎂", "🌟", "💐", "🎶", "😂", "🥰", "👏", "🙌", "💕", "✨", "🎁", "🌺", "😊", "🤗", "💖", "🔥", "👶", "💒", "🎵", "🌈"];

const GIF_LIST = [
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdWd6MmVwbTl5ZnFzNXNhN2h4bHlhNXA2OGN5MGtzZXR6enoyeWN1aCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/l0HlBO7eyXzSZkJri/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcm5kNGF3d2FvMWR1aGdtOGE3YWFnZ2dtbjBwcTgwa3RzM2xhNnhjdyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3oEjI6SIIHBdRxXI40/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHB6bTVxOXF4NWRiMHVtYjl2M3VldGV6NXN6N2M0cHRzNnhtZ3p0YiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/l4FGuhL4U2WSOlhfi/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZWgxMWsxcWxsMHk5NXlpcTN2bHpuMmVtYnlqdjFuaHFkbGVscng1eCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/xT9IgG50Fb7Mi0prBC/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZWV6cnB3MXkzMWR4Y3E1NjIwY2NiY2VhYjl5cXpuY2VnZnJ0NjVyZSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/26BRv0ThflsHCqDrG/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaWI3dXdzaHhjYnplOXBtNndwcjlqZjV5OXU2cG9lOHNtdzFjdHRkZCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/l0MYt5jPR6QX5pnqM/giphy.gif",
];

// Build album pages from photos + content items
function buildPages(photos: { id: string; url: string; title: string }[], items: PageItem[]): PageItem[][] {
  const allItems: PageItem[] = [
    ...photos.map((p) => ({ type: "photo" as const, content: p.url, id: p.id })),
    ...items,
  ];
  if (allItems.length === 0) return [[]];
  const pages: PageItem[][] = [];
  let i = 0;
  while (i < allItems.length) {
    // 2 items per page max for album feel
    pages.push(allItems.slice(i, i + 2));
    i += 2;
  }
  return pages;
}

export default function AlbumDetail({ album, onBack, onDelete, onRename, onImportPhotos, onChangeCover, onUpdateAlbum }: AlbumDetailProps) {
  const { folders, albums } = useAppState();
  const [liked, setLiked] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [title, setTitle] = useState(album.title);
  const [showMenu, setShowMenu] = useState(false);
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [showCoverPicker, setShowCoverPicker] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [noteText, setNoteText] = useState("");
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [showMusicInput, setShowMusicInput] = useState(false);
  const [musicUrl, setMusicUrl] = useState("");

  // Extra content items added to pages
  const [extraItems, setExtraItems] = useState<PageItem[]>(() => {
    const items: PageItem[] = [];
    album.notes.forEach((n) => items.push({ type: "note", content: n.text, id: n.id }));
    if (album.music) items.push({ type: "music", content: album.music, id: "music-default" });
    return items;
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingIntervalRef = useRef<number | null>(null);

  const photos = album.photos;
  const pages = buildPages(photos, extraItems);
  const totalPages = pages.length;

  useEffect(() => {
    setTitle(album.title);
  }, [album.title]);

  useEffect(() => {
    return () => { if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current); };
  }, []);

  // Keep currentPage in bounds
  useEffect(() => {
    if (currentPage >= totalPages && totalPages > 0) setCurrentPage(totalPages - 1);
  }, [totalPages, currentPage]);

  const goNext = () => { if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1); };
  const goPrev = () => { if (currentPage > 0) setCurrentPage(currentPage - 1); };

  const handleRenameConfirm = () => {
    setRenaming(false);
    if (title.trim() && title !== album.title) {
      onRename?.(title.trim());
      toast.success(`Renamed to "${title.trim()}"`);
    }
  };

  const handleAddPhotos = () => fileInputRef.current?.click();
  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    toast.success(`${files.length} photo${files.length > 1 ? "s" : ""} added!`);
    onImportPhotos?.(files);
    e.target.value = "";
  };

  const handleCoverFromFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onChangeCover?.(URL.createObjectURL(file));
    toast.success("Cover photo updated!");
    setShowCoverPicker(false);
    e.target.value = "";
  };

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    setExtraItems((prev) => [...prev, { type: "note", content: noteText, id: `note-${Date.now()}` }]);
    setNoteText("");
    setShowNoteInput(false);
    toast.success("Note added to album!");
    // Jump to last page
    setTimeout(() => setCurrentPage(Math.max(0, Math.ceil((photos.length + extraItems.length + 1) / 2) - 1)), 50);
  };

  const handleAddEmoji = (emoji: string) => {
    setExtraItems((prev) => [...prev, { type: "emoji", content: emoji, id: `emoji-${Date.now()}` }]);
    setShowEmojiPicker(false);
    toast.success("Emoji added!");
    setTimeout(() => setCurrentPage(Math.max(0, Math.ceil((photos.length + extraItems.length + 1) / 2) - 1)), 50);
  };

  const handleAddGif = (url: string) => {
    setExtraItems((prev) => [...prev, { type: "gif", content: url, id: `gif-${Date.now()}` }]);
    setShowGifPicker(false);
    toast.success("GIF added!");
    setTimeout(() => setCurrentPage(Math.max(0, Math.ceil((photos.length + extraItems.length + 1) / 2) - 1)), 50);
  };

  const handleAddMusic = () => {
    if (!musicUrl.trim()) return;
    setExtraItems((prev) => [...prev, { type: "music", content: musicUrl, id: `music-${Date.now()}` }]);
    setMusicUrl("");
    setShowMusicInput(false);
    toast.success("Music added!");
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunks, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setExtraItems((prev) => [...prev, { type: "voice", content: `🎤 Voice (${recordingTime}s)`, id: `voice-${Date.now()}` }]);
        toast.success("Voice message added!");
        setRecordingTime(0);
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordingTime(0);
      recordingIntervalRef.current = window.setInterval(() => setRecordingTime((t) => t + 1), 1000);
    } catch {
      toast.error("Microphone access denied");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
  };

  const handleShare = async (type: "album" | "folder" | "photos") => {
    const shareTitle = type === "album" ? `Album: ${title}` : "Selected photos";
    if (navigator.share) {
      try { await navigator.share({ title: shareTitle, text: `Check out ${shareTitle} on SmartMemory!`, url: window.location.href }); } catch {}
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied!");
    }
    setShowShareSheet(false);
  };

  const renderPageItem = (item: PageItem) => {
    switch (item.type) {
      case "photo":
        return (
          <div key={item.id} style={{ width: "100%", borderRadius: 6, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.12)", marginBottom: 6 }}>
            <img src={item.content} alt="" style={{ width: "100%", height: 110, objectFit: "cover", display: "block" }} />
          </div>
        );
      case "note":
        return (
          <div key={item.id} style={{ backgroundColor: "#fffbe6", borderRadius: 6, padding: "6px 8px", marginBottom: 6, border: "1px solid #f0e6b8", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <p style={{ fontSize: 9, color: "#5a4e1a", margin: 0, fontStyle: "italic" }}>📝 {item.content}</p>
          </div>
        );
      case "emoji":
        return (
          <div key={item.id} className="flex items-center justify-center" style={{ marginBottom: 6 }}>
            <span style={{ fontSize: 32 }}>{item.content}</span>
          </div>
        );
      case "gif":
        return (
          <div key={item.id} style={{ width: "100%", borderRadius: 6, overflow: "hidden", marginBottom: 6 }}>
            <img src={item.content} alt="GIF" style={{ width: "100%", height: 80, objectFit: "cover", display: "block" }} />
          </div>
        );
      case "voice":
        return (
          <div key={item.id} style={{ backgroundColor: "#eef2fb", borderRadius: 6, padding: "6px 8px", marginBottom: 6 }}>
            <p style={{ fontSize: 9, color: "#394460", margin: 0 }}>{item.content}</p>
          </div>
        );
      case "music":
        return (
          <div key={item.id} style={{ backgroundColor: "#f0eeff", borderRadius: 6, padding: "6px 8px", marginBottom: 6, border: "1px solid #d8d0f8" }}>
            <p style={{ fontSize: 9, color: "#5b4fa0", margin: 0 }}>🎵 {item.content}</p>
          </div>
        );
      default:
        return null;
    }
  };

  const currentPageItems = pages[currentPage] || [];

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <input ref={fileInputRef} type="file" multiple accept="image/*,video/*" style={{ display: "none" }} onChange={handleFilesSelected} />
      <input ref={coverInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleCoverFromFile} />

      {/* Header */}
      <div className="flex items-center justify-between" style={{ marginBottom: 4 }}>
        <div className="flex items-center">
          <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
            <ChevronLeft size={14} color="#394460" />
          </button>
          {renaming ? (
            <input value={title} onChange={(e) => setTitle(e.target.value)} onBlur={handleRenameConfirm}
              onKeyDown={(e) => e.key === "Enter" && handleRenameConfirm()} autoFocus
              style={{ fontSize: 11, fontWeight: 700, color: "#394460", border: "1px solid #8fa9dd", borderRadius: 4, padding: "2px 4px", outline: "none", width: 90 }} />
          ) : (
            <span style={{ fontSize: 11, fontWeight: 700, color: "#394460", marginLeft: 4 }}>{title}</span>
          )}
        </div>
        <div className="flex items-center" style={{ gap: 4 }}>
          <button onClick={() => setLiked(!liked)} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <Heart size={12} color={liked ? "#ef4444" : "#687287"} fill={liked ? "#ef4444" : "none"} />
          </button>
          <button onClick={() => setShowMenu(!showMenu)} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <MoreVertical size={12} color="#687287" />
          </button>
        </div>
      </div>

      {/* Context menu */}
      {showMenu && (
        <div style={{
          position: "absolute", right: 8, top: 24, backgroundColor: "#fff", border: "1px solid #dde3f0",
          borderRadius: 8, padding: "4px 0", zIndex: 30, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", minWidth: 120,
        }}>
          {[
            { label: "Rename", icon: Edit3, action: () => { setRenaming(true); setShowMenu(false); } },
            { label: "Change Cover", icon: Camera, action: () => { setShowCoverPicker(true); setShowMenu(false); } },
            { label: "Add Photos", icon: Plus, action: () => { handleAddPhotos(); setShowMenu(false); } },
            { label: "Share", icon: Share2, action: () => { setShowShareSheet(true); setShowMenu(false); } },
            { label: "Delete", icon: Trash2, action: () => { onDelete?.(); toast.success("Album deleted"); }, color: "#ef4444" },
          ].map((item) => (
            <button key={item.label} onClick={item.action} className="flex items-center"
              style={{ width: "100%", padding: "5px 10px", background: "none", border: "none", cursor: "pointer", gap: 5 }}>
              <item.icon size={9} color={item.color || "#687287"} />
              <span style={{ fontSize: 8, color: item.color || "#394460", fontWeight: 600 }}>{item.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Cover with change */}
      <div style={{ width: "100%", height: 70, borderRadius: 8, overflow: "hidden", marginBottom: 4, position: "relative" }}>
        <img src={album.image} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "3px 6px", background: "linear-gradient(transparent, rgba(0,0,0,0.5))" }}>
          <span style={{ fontSize: 7, color: "#fff", fontWeight: 600 }}>{album.category} · {photos.length} items</span>
        </div>
        <button onClick={() => setShowCoverPicker(true)} style={{
          position: "absolute", top: 4, right: 4, backgroundColor: "rgba(0,0,0,0.5)", border: "none",
          borderRadius: 10, padding: "2px 5px", cursor: "pointer", display: "flex", alignItems: "center", gap: 2,
        }}>
          <Camera size={7} color="#fff" />
          <span style={{ fontSize: 6, color: "#fff", fontWeight: 600 }}>Change</span>
        </button>
        {album.isCollaborative && (
          <div className="flex items-center" style={{ position: "absolute", top: 4, left: 4, backgroundColor: "rgba(0,0,0,0.5)", borderRadius: 8, padding: "2px 5px" }}>
            <Users size={7} color="#fff" style={{ marginRight: 2 }} />
            <span style={{ fontSize: 6, color: "#fff" }}>Collab</span>
          </div>
        )}
      </div>

      {/* Cover picker */}
      {showCoverPicker && (
        <div style={{ backgroundColor: "#fff", border: "1px solid #dde3f0", borderRadius: 8, padding: 6, marginBottom: 4, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
          <p style={{ fontSize: 8, fontWeight: 700, color: "#394460", marginBottom: 4 }}>Choose cover</p>
          <button onClick={() => coverInputRef.current?.click()} style={{
            width: "100%", padding: "5px", borderRadius: 5, backgroundColor: "#8fa9dd", color: "#fff",
            fontSize: 8, fontWeight: 600, border: "none", cursor: "pointer", marginBottom: 3,
          }}>📁 From device</button>
          {photos.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 2, marginTop: 3 }}>
              {photos.slice(0, 10).map((p) => (
                <div key={p.id} onClick={() => { onChangeCover?.(p.url); setShowCoverPicker(false); toast.success("Cover updated!"); }}
                  style={{ aspectRatio: "1", borderRadius: 3, overflow: "hidden", cursor: "pointer" }}>
                  <img src={p.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ))}
            </div>
          )}
          <button onClick={() => setShowCoverPicker(false)} style={{
            width: "100%", padding: "3px", fontSize: 7, color: "#687287", background: "none", border: "none", cursor: "pointer", marginTop: 3,
          }}>Cancel</button>
        </div>
      )}

      {/* ── Toolbar: Row 1 (add content) ── */}
      <div className="flex items-center justify-between" style={{ marginBottom: 3, padding: "3px 0" }}>
        {[
          { icon: <ImageIcon size={11} color="#687287" />, label: "Photo", action: handleAddPhotos },
          { icon: <MessageSquare size={11} color="#687287" />, label: "Note", action: () => setShowNoteInput(!showNoteInput) },
          { icon: <Music size={11} color="#687287" />, label: "Music", action: () => setShowMusicInput(!showMusicInput) },
        ].map((btn) => (
          <button key={btn.label} onClick={btn.action} className="flex flex-col items-center" style={{
            background: "none", border: "none", cursor: "pointer", padding: "2px 4px", borderRadius: 4, flex: 1,
          }}>
            {btn.icon}
            <span style={{ fontSize: 6, color: "#687287", marginTop: 1 }}>{btn.label}</span>
          </button>
        ))}
      </div>

      {/* ── Toolbar: Row 2 (add content) ── */}
      <div className="flex items-center justify-between" style={{ marginBottom: 4, padding: "3px 0" }}>
        {[
          { icon: <span style={{ fontSize: 12 }}>🎞️</span>, label: "GIF", action: () => setShowGifPicker(!showGifPicker) },
          { icon: <Smile size={11} color="#687287" />, label: "Emoji", action: () => setShowEmojiPicker(!showEmojiPicker) },
          { icon: isRecording ? <MicOff size={11} color="#ef4444" /> : <Mic size={11} color="#687287" />, label: isRecording ? `${recordingTime}s` : "Voice", action: isRecording ? stopRecording : startRecording },
        ].map((btn) => (
          <button key={btn.label} onClick={btn.action} className="flex flex-col items-center" style={{
            background: "none", border: "none", cursor: "pointer", padding: "2px 4px", borderRadius: 4, flex: 1,
          }}>
            {btn.icon}
            <span style={{ fontSize: 6, color: isRecording && btn.label.includes("s") ? "#ef4444" : "#687287", marginTop: 1 }}>{btn.label}</span>
          </button>
        ))}
      </div>

      {/* Note input */}
      {showNoteInput && (
        <div className="flex items-center" style={{ gap: 3, marginBottom: 4 }}>
          <input value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="Write a note..."
            onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
            style={{ flex: 1, fontSize: 8, border: "1px solid #dde3f0", borderRadius: 4, padding: "3px 5px", outline: "none" }} />
          <button onClick={handleAddNote} style={{ padding: "3px 6px", borderRadius: 4, backgroundColor: "#8fa9dd", color: "#fff", fontSize: 7, fontWeight: 600, border: "none", cursor: "pointer" }}>Add</button>
        </div>
      )}

      {/* Music input */}
      {showMusicInput && (
        <div className="flex items-center" style={{ gap: 3, marginBottom: 4 }}>
          <input value={musicUrl} onChange={(e) => setMusicUrl(e.target.value)} placeholder="Song name or URL..."
            onKeyDown={(e) => e.key === "Enter" && handleAddMusic()}
            style={{ flex: 1, fontSize: 8, border: "1px solid #dde3f0", borderRadius: 4, padding: "3px 5px", outline: "none" }} />
          <button onClick={handleAddMusic} style={{ padding: "3px 6px", borderRadius: 4, backgroundColor: "#8fa9dd", color: "#fff", fontSize: 7, fontWeight: 600, border: "none", cursor: "pointer" }}>Add</button>
        </div>
      )}

      {/* Emoji picker */}
      {showEmojiPicker && (
        <div style={{
          backgroundColor: "#fff", border: "1px solid #dde3f0", borderRadius: 8, padding: 4,
          marginBottom: 4, display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 1,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}>
          {EMOJI_LIST.map((emoji) => (
            <button key={emoji} onClick={() => handleAddEmoji(emoji)} style={{
              background: "none", border: "none", cursor: "pointer", fontSize: 12, padding: 1, borderRadius: 3,
            }}>{emoji}</button>
          ))}
        </div>
      )}

      {/* GIF picker */}
      {showGifPicker && (
        <div style={{
          backgroundColor: "#fff", border: "1px solid #dde3f0", borderRadius: 8, padding: 4,
          marginBottom: 4, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 3,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}>
          {GIF_LIST.map((gif, i) => (
            <div key={i} onClick={() => handleAddGif(gif)} style={{ borderRadius: 4, overflow: "hidden", cursor: "pointer", aspectRatio: "1" }}>
              <img src={gif} alt="GIF" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          ))}
        </div>
      )}

      {/* ── Album Page View ── */}
      <div style={{
        backgroundColor: "#faf8f5", borderRadius: 8, border: "1px solid #e8e2d8",
        minHeight: 160, position: "relative", padding: "8px 10px",
        boxShadow: "inset 0 1px 4px rgba(0,0,0,0.06), 2px 2px 8px rgba(0,0,0,0.08)",
      }}>
        {/* Page spine effect */}
        <div style={{ position: "absolute", left: "50%", top: 4, bottom: 4, width: 1, backgroundColor: "rgba(0,0,0,0.06)" }} />

        {totalPages === 0 || (currentPageItems.length === 0 && photos.length === 0) ? (
          <div className="flex flex-col items-center justify-center" style={{ minHeight: 140 }}>
            <ImageIcon size={20} color="#c0c8d8" style={{ marginBottom: 4 }} />
            <span style={{ fontSize: 9, color: "#8fa9dd", fontWeight: 600 }}>Empty album</span>
            <span style={{ fontSize: 7, color: "#a0a8b8" }}>Add photos, notes, GIFs using the toolbar above</span>
          </div>
        ) : (
          <div>
            {currentPageItems.map((item) => renderPageItem(item))}
          </div>
        )}

        {/* Page navigation */}
        <div className="flex items-center justify-between" style={{ marginTop: 6 }}>
          <button onClick={goPrev} disabled={currentPage === 0} style={{
            background: "none", border: "none", cursor: currentPage === 0 ? "default" : "pointer", opacity: currentPage === 0 ? 0.3 : 1,
          }}>
            <ChevronLeft size={14} color="#687287" />
          </button>
          <span style={{ fontSize: 7, color: "#a0a8b8" }}>Page {currentPage + 1} / {Math.max(1, totalPages)}</span>
          <button onClick={goNext} disabled={currentPage >= totalPages - 1} style={{
            background: "none", border: "none", cursor: currentPage >= totalPages - 1 ? "default" : "pointer", opacity: currentPage >= totalPages - 1 ? 0.3 : 1,
          }}>
            <ChevronRight size={14} color="#687287" />
          </button>
        </div>
      </div>

      {/* Share sheet */}
      {showShareSheet && (
        <div className="absolute inset-0 flex flex-col justify-end" style={{ zIndex: 20, borderRadius: 38, overflow: "hidden" }}>
          <div className="absolute inset-0" style={{ backgroundColor: "rgba(0,0,0,0.4)" }} onClick={() => setShowShareSheet(false)} />
          <div style={{ position: "relative", backgroundColor: "#fff", borderRadius: "12px 12px 0 0", padding: "10px 12px 16px" }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: "#394460", marginBottom: 6 }}>Share</p>
            <div className="flex flex-col" style={{ gap: 4 }}>
              <button onClick={() => handleShare("album")}
                style={{ width: "100%", padding: "7px", borderRadius: 6, backgroundColor: "#e8ecf4", color: "#394460", fontSize: 9, fontWeight: 600, border: "none", cursor: "pointer", textAlign: "left" }}>
                📒 Share Album "{title}"
              </button>
              <button onClick={() => handleShare("folder")}
                style={{ width: "100%", padding: "7px", borderRadius: 6, backgroundColor: "#e8ecf4", color: "#394460", fontSize: 9, fontWeight: 600, border: "none", cursor: "pointer", textAlign: "left" }}>
                📁 Share Folder
              </button>
              <button onClick={() => handleShare("photos")}
                style={{ width: "100%", padding: "7px", borderRadius: 6, backgroundColor: "#e8ecf4", color: "#394460", fontSize: 9, fontWeight: 600, border: "none", cursor: "pointer", textAlign: "left" }}>
                🖼️ Share Selected Photos
              </button>
              <button onClick={() => setShowShareSheet(false)}
                style={{ width: "100%", padding: "5px", fontSize: 8, color: "#687287", background: "none", border: "none", cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
