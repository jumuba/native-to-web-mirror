import React, { useState, useRef, useEffect } from "react";
import {
  ChevronLeft, Share2, Download, Music, MessageSquare,
  Link as LinkIcon, Smile, Mic, Heart, ImageIcon, Plus, Users, Lock,
  Edit3, Trash2, MoreVertical, Square, MicOff,
} from "lucide-react";
import { toast } from "sonner";
import type { Album } from "@/lib/mockData";

interface AlbumDetailProps {
  album: Album;
  onBack: () => void;
  onDelete?: () => void;
  onRename?: (newTitle: string) => void;
  onImportPhotos?: (files: File[]) => void;
}

type AlbumTab = "photos" | "notes" | "music" | "share";

const EMOJI_LIST = ["❤️", "😍", "🎉", "🥳", "🎂", "🌟", "💐", "🎶", "😂", "🥰", "👏", "🙌", "💕", "✨", "🎁", "🌺", "😊", "🤗", "💖", "🔥", "👶", "💒", "🎵", "🌈"];

export default function AlbumDetail({ album, onBack, onDelete, onRename, onImportPhotos }: AlbumDetailProps) {
  const [activeTab, setActiveTab] = useState<AlbumTab>("photos");
  const [liked, setLiked] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [notes, setNotes] = useState(album.notes);
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [photos, setPhotos] = useState(album.photos);
  const [renaming, setRenaming] = useState(false);
  const [title, setTitle] = useState(album.title);
  const [showMenu, setShowMenu] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());
  const [selectMode, setSelectMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingIntervalRef = useRef<number | null>(null);

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    setNotes([...notes, { id: `n-${Date.now()}`, text: noteText, createdAt: new Date().toISOString().slice(0, 10) }]);
    setNoteText("");
  };

  const handleAddEmoji = (emoji: string) => {
    setNoteText((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleAddPhotos = () => {
    fileInputRef.current?.click();
  };

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const newPhotos = files.map((file, i) => ({
      id: `new-${Date.now()}-${i}`,
      url: URL.createObjectURL(file),
      title: file.name,
      date: new Date().toISOString().slice(0, 10),
      place: "Added",
      event: "Added",
    }));
    setPhotos((prev) => [...prev, ...newPhotos]);
    toast.success(`${files.length} photo${files.length > 1 ? "s" : ""} added!`);
    onImportPhotos?.(files);
    e.target.value = "";
  };

  const handleRenameConfirm = () => {
    setRenaming(false);
    if (title.trim() && title !== album.title) {
      onRename?.(title.trim());
      toast.success(`Renamed to "${title.trim()}"`);
    }
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
        setNotes((prev) => [...prev, { id: `voice-${Date.now()}`, text: `🎤 Voice message (${recordingTime}s)`, createdAt: new Date().toISOString().slice(0, 10) }]);
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

  const handleShare = async (type: "album" | "photos") => {
    const shareTitle = type === "album" ? `Album: ${title}` : `${selectedPhotos.size} selected photos`;
    if (navigator.share) {
      try {
        await navigator.share({ title: shareTitle, text: `Check out ${shareTitle} on SmartMemory!`, url: window.location.href });
      } catch { /* cancelled */ }
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

  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
    };
  }, []);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <input ref={fileInputRef} type="file" multiple accept="image/*,video/*" style={{ display: "none" }} onChange={handleFilesSelected} />

      {/* Header */}
      <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
        <div className="flex items-center">
          <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
            <ChevronLeft size={14} color="#394460" />
          </button>
          {renaming ? (
            <input value={title} onChange={(e) => setTitle(e.target.value)} onBlur={handleRenameConfirm}
              onKeyDown={(e) => e.key === "Enter" && handleRenameConfirm()} autoFocus
              style={{ fontSize: 12, fontWeight: 700, color: "#394460", border: "1px solid #8fa9dd", borderRadius: 4, padding: "2px 4px", outline: "none", width: 100 }} />
          ) : (
            <span style={{ fontSize: 12, fontWeight: 700, color: "#394460", marginLeft: 4 }}>{title}</span>
          )}
        </div>
        <div className="flex items-center" style={{ gap: 6 }}>
          <button onClick={() => setLiked(!liked)} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <Heart size={13} color={liked ? "#ef4444" : "#687287"} fill={liked ? "#ef4444" : "none"} />
          </button>
          <button onClick={() => setShowMenu(!showMenu)} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <MoreVertical size={13} color="#687287" />
          </button>
        </div>
      </div>

      {/* Context menu */}
      {showMenu && (
        <div style={{
          position: "absolute", right: 10, top: 30, backgroundColor: "#fff", border: "1px solid #dde3f0",
          borderRadius: 8, padding: "4px 0", zIndex: 20, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", minWidth: 130,
        }}>
          {[
            { label: "Rename", icon: Edit3, action: () => { setRenaming(true); setShowMenu(false); } },
            { label: "Add Photos", icon: Plus, action: () => { handleAddPhotos(); setShowMenu(false); } },
            { label: "Select Photos", icon: ImageIcon, action: () => { setSelectMode(!selectMode); setSelectedPhotos(new Set()); setShowMenu(false); } },
            { label: "Share Album", icon: Share2, action: () => { setShowShareSheet(true); setShowMenu(false); } },
            { label: "Delete", icon: Trash2, action: () => { onDelete?.(); toast.success("Album deleted"); }, color: "#ef4444" },
          ].map((item) => (
            <button key={item.label} onClick={item.action} className="flex items-center"
              style={{ width: "100%", padding: "6px 10px", background: "none", border: "none", cursor: "pointer", gap: 6 }}>
              <item.icon size={10} color={item.color || "#687287"} />
              <span style={{ fontSize: 9, color: item.color || "#394460", fontWeight: 600 }}>{item.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Cover */}
      <div style={{ width: "100%", height: 100, borderRadius: 8, overflow: "hidden", marginBottom: 6, position: "relative" }}>
        <img src={album.image} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "4px 8px", background: "linear-gradient(transparent, rgba(0,0,0,0.6))" }}>
          <span style={{ fontSize: 8, color: "#fff", fontWeight: 600 }}>{album.category} · {photos.length} photos</span>
        </div>
        {album.isCollaborative && (
          <div className="flex items-center" style={{ position: "absolute", top: 4, right: 4, backgroundColor: "rgba(0,0,0,0.5)", borderRadius: 8, padding: "2px 6px" }}>
            <Users size={8} color="#fff" style={{ marginRight: 2 }} />
            <span style={{ fontSize: 7, color: "#fff" }}>Collaborative</span>
          </div>
        )}
        {album.isPrivate && (
          <div className="flex items-center" style={{ position: "absolute", top: 4, left: 4, backgroundColor: "rgba(0,0,0,0.5)", borderRadius: 8, padding: "2px 6px" }}>
            <Lock size={8} color="#fff" style={{ marginRight: 2 }} />
            <span style={{ fontSize: 7, color: "#fff" }}>Private</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center" style={{ gap: 4, marginBottom: 8 }}>
        {(["photos", "notes", "music", "share"] as AlbumTab[]).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: "3px 8px", borderRadius: 10, fontSize: 8, fontWeight: 600, border: "none", cursor: "pointer",
            backgroundColor: activeTab === tab ? "#8fa9dd" : "#e8ecf4",
            color: activeTab === tab ? "#fff" : "#687287", textTransform: "capitalize",
          }}>{tab}</button>
        ))}
      </div>

      {/* Select mode bar */}
      {selectMode && activeTab === "photos" && (
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

      {/* Photos tab */}
      {activeTab === "photos" && (
        <div>
          <div className="flex items-center justify-between" style={{ marginBottom: 4 }}>
            <span style={{ fontSize: 8, color: "#a0a8b8" }}>{photos.length} items</span>
            <button onClick={handleAddPhotos} style={{ background: "none", border: "none", cursor: "pointer" }}>
              <Plus size={12} color="#8fa9dd" />
            </button>
          </div>
          {photos.length === 0 ? (
            <div className="flex flex-col items-center" style={{ padding: "20px 0" }}>
              <ImageIcon size={24} color="#c0c8d8" style={{ marginBottom: 6 }} />
              <span style={{ fontSize: 10, color: "#8fa9dd", fontWeight: 600 }}>No photos yet</span>
              <button onClick={handleAddPhotos} style={{ marginTop: 6, padding: "4px 12px", borderRadius: 4, backgroundColor: "#8fa9dd", color: "#fff", fontSize: 9, fontWeight: 600, border: "none", cursor: "pointer" }}>Add Photos</button>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 3 }}>
              {photos.slice(0, 24).map((photo) => (
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
        </div>
      )}

      {/* Notes tab */}
      {activeTab === "notes" && (
        <div>
          {notes.length === 0 && !noteText && (
            <div className="flex flex-col items-center" style={{ padding: "20px 0" }}>
              <MessageSquare size={24} color="#c0c8d8" style={{ marginBottom: 6 }} />
              <span style={{ fontSize: 10, color: "#8fa9dd", fontWeight: 600 }}>No notes yet</span>
            </div>
          )}
          <div style={{ maxHeight: 160, overflowY: "auto" }}>
            {notes.map((n) => (
              <div key={n.id} style={{ backgroundColor: "rgba(255,255,255,0.8)", borderRadius: 6, padding: "6px 8px", marginBottom: 4, border: "1px solid rgba(214,223,241,0.6)" }}>
                <p style={{ fontSize: 9, color: "#394460", margin: 0 }}>{n.text}</p>
                <span style={{ fontSize: 7, color: "#a0a8b8" }}>{n.createdAt}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center" style={{ marginTop: 6, gap: 4 }}>
            <input value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="Add a note..."
              onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
              style={{ flex: 1, fontSize: 9, border: "1px solid #dde3f0", borderRadius: 4, padding: "4px 6px", outline: "none" }} />
            <button onClick={handleAddNote} style={{ padding: "4px 8px", borderRadius: 4, backgroundColor: "#8fa9dd", color: "#fff", fontSize: 8, fontWeight: 600, border: "none", cursor: "pointer" }}>Add</button>
          </div>
          <div className="flex items-center" style={{ gap: 6, marginTop: 6, position: "relative" }}>
            <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} style={{ background: "none", border: "none", cursor: "pointer" }}>
              <Smile size={14} color={showEmojiPicker ? "#8fa9dd" : "#687287"} />
            </button>
            <button onClick={() => toast.info("GIF search coming soon!")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 10, fontWeight: 700, color: "#687287", padding: "2px 4px", borderRadius: 3, backgroundColor: "#e8ecf4" }}>GIF</button>
            <button onClick={isRecording ? stopRecording : startRecording} style={{ background: "none", border: "none", cursor: "pointer" }}>
              {isRecording ? <MicOff size={14} color="#ef4444" /> : <Mic size={14} color="#687287" />}
            </button>
            {isRecording && <span style={{ fontSize: 8, color: "#ef4444", fontWeight: 600 }}>● {recordingTime}s</span>}
            <button onClick={() => setShowShareSheet(true)} style={{ background: "none", border: "none", cursor: "pointer", marginLeft: "auto" }}>
              <Share2 size={14} color="#687287" />
            </button>
          </div>

          {/* Emoji picker */}
          {showEmojiPicker && (
            <div style={{
              backgroundColor: "#fff", border: "1px solid #dde3f0", borderRadius: 8, padding: 6,
              marginTop: 4, display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 2,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}>
              {EMOJI_LIST.map((emoji) => (
                <button key={emoji} onClick={() => handleAddEmoji(emoji)} style={{
                  background: "none", border: "none", cursor: "pointer", fontSize: 14, padding: 2,
                  borderRadius: 4, transition: "background-color 0.1s",
                }} className="hover:bg-gray-100">{emoji}</button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Music tab */}
      {activeTab === "music" && (
        <div className="flex flex-col items-center" style={{ padding: "16px 0" }}>
          <Music size={24} color={album.music ? "#8fa9dd" : "#c0c8d8"} style={{ marginBottom: 8 }} />
          {album.music ? (
            <>
              <span style={{ fontSize: 11, color: "#394460", fontWeight: 600 }}>🎵 {album.music}</span>
              <span style={{ fontSize: 9, color: "#a0a8b8", marginTop: 2 }}>Playing with album</span>
            </>
          ) : (
            <>
              <span style={{ fontSize: 10, color: "#8fa9dd", fontWeight: 600 }}>No music added</span>
              <button style={{ marginTop: 8, padding: "4px 12px", borderRadius: 4, backgroundColor: "#8fa9dd", color: "#fff", fontSize: 9, fontWeight: 600, border: "none", cursor: "pointer" }}>Add Music</button>
            </>
          )}
        </div>
      )}

      {/* Share tab */}
      {activeTab === "share" && (
        <div>
          <div style={{ backgroundColor: "rgba(255,255,255,0.8)", borderRadius: 8, padding: "8px 10px", marginBottom: 6, border: "1px solid rgba(214,223,241,0.6)" }}>
            <div className="flex items-center justify-between" style={{ marginBottom: 4 }}>
              <span style={{ fontSize: 9, color: "#394460", fontWeight: 600 }}>Share Album</span>
              <Share2 size={10} color="#8fa9dd" />
            </div>
            <button onClick={() => handleShare("album")} style={{
              width: "100%", padding: "6px", borderRadius: 6, backgroundColor: "#8fa9dd", color: "#fff",
              fontSize: 9, fontWeight: 600, border: "none", cursor: "pointer", marginBottom: 4,
            }}>Share "{title}"</button>
          </div>
          <div style={{ backgroundColor: "rgba(255,255,255,0.8)", borderRadius: 8, padding: "8px 10px", marginBottom: 6, border: "1px solid rgba(214,223,241,0.6)" }}>
            <span style={{ fontSize: 9, color: "#394460", fontWeight: 600, display: "block", marginBottom: 4 }}>Share Selected Photos</span>
            <button onClick={() => { setActiveTab("photos"); setSelectMode(true); }}
              style={{ width: "100%", padding: "6px", borderRadius: 6, backgroundColor: "#e8ecf4", color: "#687287", fontSize: 9, fontWeight: 600, border: "none", cursor: "pointer" }}>
              Select photos to share
            </button>
          </div>
          <div style={{ backgroundColor: "rgba(255,255,255,0.8)", borderRadius: 8, padding: "8px 10px", border: "1px solid rgba(214,223,241,0.6)" }}>
            <div className="flex items-center justify-between">
              <span style={{ fontSize: 9, color: "#394460", fontWeight: 600 }}>Allow Download</span>
              <Download size={10} color="#8fa9dd" />
            </div>
          </div>
        </div>
      )}

      {/* Share sheet */}
      {showShareSheet && (
        <div className="absolute inset-0 flex flex-col justify-end" style={{ zIndex: 10, borderRadius: 38, overflow: "hidden" }}>
          <div className="absolute inset-0" style={{ backgroundColor: "rgba(0,0,0,0.4)" }} onClick={() => setShowShareSheet(false)} />
          <div style={{ position: "relative", backgroundColor: "#fff", borderRadius: "12px 12px 0 0", padding: "12px 14px 20px" }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#394460", marginBottom: 8 }}>Share</p>
            <div className="flex flex-col" style={{ gap: 6 }}>
              <button onClick={() => handleShare("album")}
                style={{ width: "100%", padding: "8px", borderRadius: 6, backgroundColor: "#e8ecf4", color: "#394460", fontSize: 10, fontWeight: 600, border: "none", cursor: "pointer", textAlign: "left" }}>
                📒 Share Album "{title}"
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
