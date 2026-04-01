import React, { useState } from "react";
import {
  ChevronLeft,
  Share2,
  Download,
  Music,
  MessageSquare,
  Link as LinkIcon,
  Smile,
  Mic,
  Heart,
  ImageIcon,
  Plus,
  Users,
  Lock,
} from "lucide-react";
import type { Album } from "@/lib/mockData";

interface AlbumDetailProps {
  album: Album;
  onBack: () => void;
}

type AlbumTab = "photos" | "notes" | "music" | "share";

export default function AlbumDetail({ album, onBack }: AlbumDetailProps) {
  const [activeTab, setActiveTab] = useState<AlbumTab>("photos");
  const [liked, setLiked] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [notes, setNotes] = useState(album.notes);
  const [showShareSheet, setShowShareSheet] = useState(false);

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    setNotes([...notes, { id: `n-${Date.now()}`, text: noteText, createdAt: new Date().toISOString().slice(0, 10) }]);
    setNoteText("");
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {/* Header */}
      <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
        <div className="flex items-center">
          <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
            <ChevronLeft size={14} color="#394460" />
          </button>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#394460", marginLeft: 4 }}>{album.title}</span>
        </div>
        <div className="flex items-center" style={{ gap: 6 }}>
          <button onClick={() => setLiked(!liked)} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <Heart size={13} color={liked ? "#ef4444" : "#687287"} fill={liked ? "#ef4444" : "none"} />
          </button>
          <button onClick={() => setShowShareSheet(true)} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <Share2 size={13} color="#687287" />
          </button>
        </div>
      </div>

      {/* Cover */}
      <div style={{ width: "100%", height: 100, borderRadius: 8, overflow: "hidden", marginBottom: 6, position: "relative" }}>
        <img src={album.image} alt={album.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "4px 8px", background: "linear-gradient(transparent, rgba(0,0,0,0.6))" }}>
          <span style={{ fontSize: 8, color: "#fff", fontWeight: 600 }}>{album.category} · {album.photoCount} photos</span>
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
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "3px 8px",
              borderRadius: 10,
              fontSize: 8,
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              backgroundColor: activeTab === tab ? "#8fa9dd" : "#e8ecf4",
              color: activeTab === tab ? "#fff" : "#687287",
              textTransform: "capitalize",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Photos tab */}
      {activeTab === "photos" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 3 }}>
          {album.photos.slice(0, 18).map((photo) => (
            <div key={photo.id} style={{ aspectRatio: "1", borderRadius: 4, overflow: "hidden" }}>
              <img src={photo.url} alt={photo.title} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          ))}
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
          {notes.map((n) => (
            <div key={n.id} style={{ backgroundColor: "rgba(255,255,255,0.8)", borderRadius: 6, padding: "6px 8px", marginBottom: 4, border: "1px solid rgba(214,223,241,0.6)" }}>
              <p style={{ fontSize: 9, color: "#394460", margin: 0 }}>{n.text}</p>
              <span style={{ fontSize: 7, color: "#a0a8b8" }}>{n.createdAt}</span>
            </div>
          ))}
          <div className="flex items-center" style={{ marginTop: 6, gap: 4 }}>
            <input
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Add a note..."
              style={{ flex: 1, fontSize: 9, border: "1px solid #dde3f0", borderRadius: 4, padding: "4px 6px", outline: "none" }}
            />
            <button onClick={handleAddNote} style={{ padding: "4px 8px", borderRadius: 4, backgroundColor: "#8fa9dd", color: "#fff", fontSize: 8, fontWeight: 600, border: "none", cursor: "pointer" }}>
              Add
            </button>
          </div>
          <div className="flex items-center" style={{ gap: 8, marginTop: 6 }}>
            <Smile size={14} color="#687287" style={{ cursor: "pointer" }} />
            <Mic size={14} color="#687287" style={{ cursor: "pointer" }} />
            <LinkIcon size={14} color="#687287" style={{ cursor: "pointer" }} />
          </div>
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
              <button style={{ marginTop: 8, padding: "4px 12px", borderRadius: 4, backgroundColor: "#8fa9dd", color: "#fff", fontSize: 9, fontWeight: 600, border: "none", cursor: "pointer" }}>
                Add Music
              </button>
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
            <div className="flex" style={{ gap: 4 }}>
              {["Link", "Email", "WhatsApp"].map((m) => (
                <button
                  key={m}
                  style={{ padding: "3px 8px", borderRadius: 6, backgroundColor: "#e8ecf4", color: "#687287", fontSize: 8, fontWeight: 600, border: "none", cursor: "pointer" }}
                >
                  {m}
                </button>
              ))}
            </div>
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
        <div
          className="absolute inset-0 flex flex-col justify-end"
          style={{ zIndex: 10, borderRadius: 38, overflow: "hidden" }}
        >
          <div className="absolute inset-0" style={{ backgroundColor: "rgba(0,0,0,0.4)" }} onClick={() => setShowShareSheet(false)} />
          <div style={{ position: "relative", backgroundColor: "#fff", borderRadius: "12px 12px 0 0", padding: "12px 14px 20px" }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#394460", marginBottom: 8 }}>Share "{album.title}"</p>
            <div className="flex" style={{ gap: 6 }}>
              {["Copy Link", "Email", "WhatsApp", "Message"].map((m) => (
                <button
                  key={m}
                  onClick={() => setShowShareSheet(false)}
                  style={{ flex: 1, padding: "6px 4px", borderRadius: 6, backgroundColor: "#e8ecf4", color: "#687287", fontSize: 8, fontWeight: 600, border: "none", cursor: "pointer" }}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
