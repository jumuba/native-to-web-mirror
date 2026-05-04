import React, { useState, useEffect, useRef } from "react";
import {
  FolderPlus, BookOpen, ImagePlus, Video, Smartphone,
  Cloud, Monitor, Link, Music, X, CheckCircle, AlertCircle,
  Loader2, Lock, Globe, EyeOff, Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { mockFolders, mockAlbums } from "@/lib/mockData";
import { suggestAlbumTitles } from "@/lib/aiService";
import { useAppState } from "@/lib/AppStateContext";

const options = [
  { id: "create-folder", label: "Create Folder", icon: FolderPlus, color: "#8fa9dd" },
  { id: "create-album", label: "Create Album", icon: BookOpen, color: "#8b5cf6" },
  { id: "import-photos", label: "Import Photos", icon: ImagePlus, color: "#1db954" },
  { id: "import-videos", label: "Import Videos", icon: Video, color: "#e8b4b8" },
  { id: "import-phone", label: "Import from Phone", icon: Smartphone, color: "#6b9fff" },
  { id: "import-icloud", label: "Import from iCloud", icon: Cloud, color: "#a9c9d2" },
  { id: "import-pc", label: "Import from PC", icon: Monitor, color: "#d2c9a9" },
  { id: "add-link", label: "Add External Link", icon: Link, color: "#c9a9d2" },
  { id: "add-music", label: "Add Music", icon: Music, color: "#d2a9b8" },
];

const folderColors = ["#8fa9dd", "#e8b4b8", "#c9a9d2", "#a9c9d2", "#d2c9a9", "#b8d2a9", "#d2a9b8", "#6b9fff"];
const fontStyles = ["Default", "Serif", "Rounded", "Monospace"];
const albumCategories = ["Birthday", "Wedding", "Memorial", "Holiday", "Family", "Friends", "Travel", "Other"];
const albumThemes = ["classic", "elegant", "playful", "romantic", "fun", "modern"];

type FlowState = "idle" | "create-folder" | "create-album" | "uploading" | "save-to" | "success" | "error" | "add-link" | "add-music";

interface CreateImportSheetProps {
  open: boolean;
  onClose: () => void;
  onCreateFolder?: (data: { name: string; color: string; font: string; hasPassword: boolean; isPrivate: boolean }) => void;
  onCreateAlbum?: (data: { title: string; category: string; theme: string; isPrivate: boolean }) => void;
}

export default function CreateImportSheet({ open, onClose, onCreateFolder, onCreateAlbum }: CreateImportSheetProps) {
  const { albums, folders } = useAppState();
  const [flow, setFlow] = useState<FlowState>("idle");
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importedFiles, setImportedFiles] = useState<File[]>([]);
  const [currentImportType, setCurrentImportType] = useState("");

  // Create Folder state
  const [folderName, setFolderName] = useState("");
  const [folderColor, setFolderColor] = useState(folderColors[0]);
  const [folderFont, setFolderFont] = useState("Default");
  const [folderPassword, setFolderPassword] = useState(false);
  const [folderPrivate, setFolderPrivate] = useState(false);

  // Create Album state
  const [albumTitle, setAlbumTitle] = useState("");
  const [albumCategory, setAlbumCategory] = useState("Birthday");
  const [albumTheme, setAlbumTheme] = useState("classic");
  const [albumPrivate, setAlbumPrivate] = useState(false);
  const [suggestingAlbumTitle, setSuggestingAlbumTitle] = useState(false);
  const [albumTitleSuggestions, setAlbumTitleSuggestions] = useState<string[]>([]);
  const [albumAiError, setAlbumAiError] = useState<string | null>(null);

  // Add Link state
  const [linkUrl, setLinkUrl] = useState("");
  const [linkType, setLinkType] = useState("YouTube");

  // Add Music state
  const [musicSource, setMusicSource] = useState("YouTube");
  const [musicInput, setMusicInput] = useState("");

  // Save-to state
  const [saveTarget, setSaveTarget] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setFlow("idle"); setProgress(0); setFolderName(""); setFolderColor(folderColors[0]);
      setFolderFont("Default"); setFolderPassword(false); setFolderPrivate(false);
      setAlbumTitle(""); setAlbumCategory("Birthday"); setAlbumTheme("classic"); setAlbumPrivate(false);
      setAlbumTitleSuggestions([]); setAlbumAiError(null); setSuggestingAlbumTitle(false);
      setLinkUrl(""); setLinkType("YouTube"); setMusicSource("YouTube"); setMusicInput("");
      setSaveTarget(null); setImportedFiles([]); setCurrentImportType("");
    }
  }, [open]);

  const handleAction = (id: string) => {
    if (id === "create-folder") { setFlow("create-folder"); return; }
    if (id === "create-album") { setFlow("create-album"); return; }
    if (id === "add-link") { setFlow("add-link"); return; }
    if (id === "add-music") { setFlow("add-music"); return; }

    // For import actions, open real file picker for photos/videos/pc
    setCurrentImportType(id);
    if (["import-photos", "import-videos", "import-pc"].includes(id)) {
      const accept = id === "import-videos" ? "video/*" : "image/*";
      if (fileInputRef.current) {
        fileInputRef.current.accept = accept;
        fileInputRef.current.click();
      }
      return;
    }

    // For phone/iCloud — simulate
    simulateUpload();
  };

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setImportedFiles(files);
    simulateUpload();
    // Reset input so the same file can be selected again
    e.target.value = "";
  };

  const simulateUpload = () => {
    setFlow("uploading");
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setFlow("save-to");
          return 100;
        }
        return p + Math.random() * 15 + 5;
      });
    }, 200);
  };

  const handleCreateFolder = () => {
    if (!folderName.trim()) { toast.error("Please enter a folder name"); return; }
    onCreateFolder?.({ name: folderName.trim(), color: folderColor, font: folderFont, hasPassword: folderPassword, isPrivate: folderPrivate });
    toast.success(`Folder "${folderName.trim()}" created!`);
    onClose();
  };

  const handleCreateAlbum = () => {
    if (!albumTitle.trim()) { toast.error("Please enter an album title"); return; }
    onCreateAlbum?.({ title: albumTitle.trim(), category: albumCategory, theme: albumTheme, isPrivate: albumPrivate });
    toast.success(`Album "${albumTitle.trim()}" created!`);
    onClose();
  };

  const handleSuggestAlbumTitle = async () => {
    setSuggestingAlbumTitle(true);
    setAlbumAiError(null);
    try {
      const titles = await suggestAlbumTitles({ albums, folders, category: albumCategory, theme: albumTheme });
      if (titles.length === 0) throw new Error("No suggestions returned");
      setAlbumTitleSuggestions(titles);
      setAlbumTitle(titles[0]);
    } catch (e: any) {
      setAlbumAiError(e.message ?? "Could not suggest a title");
    } finally {
      setSuggestingAlbumTitle(false);
    }
  };

  const handleSaveLink = () => {
    if (!linkUrl.trim()) { toast.error("Please enter a URL"); return; }
    toast.success("Link added");
    onClose();
  };

  const handleSaveMusic = () => {
    if (!musicInput.trim()) { toast.error("Please enter a music source"); return; }
    toast.success("Music added");
    onClose();
  };

  const handleSaveTo = () => {
    if (!saveTarget) { toast.error("Please select a destination"); return; }
    const count = importedFiles.length || 1;
    toast.success(`${count} file${count > 1 ? "s" : ""} imported successfully!`);
    onClose();
  };

  if (!open) return null;

  const inputStyle: React.CSSProperties = {
    width: "100%", height: 32, borderRadius: 6, border: "1px solid #d0d5dd",
    padding: "0 8px", fontSize: 11, color: "#394460", outline: "none", backgroundColor: "#f9fafb",
  };
  const labelStyle: React.CSSProperties = { fontSize: 10, fontWeight: 600, color: "#5b6585", marginBottom: 3, display: "block" };
  const submitBtnStyle: React.CSSProperties = {
    width: "100%", height: 34, borderRadius: 8, backgroundColor: "#8fa9dd",
    color: "#fff", fontSize: 12, fontWeight: 700, border: "none", cursor: "pointer",
    marginTop: 10, transition: "opacity 0.15s",
  };

  const toggleRow = (label: string, icon: React.ReactNode, value: boolean, onChange: (v: boolean) => void) => (
    <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
      <div className="flex items-center" style={{ gap: 5 }}>
        {icon}
        <span style={{ fontSize: 10, color: "#5b6585", fontWeight: 600 }}>{label}</span>
      </div>
      <button onClick={() => onChange(!value)} style={{
        width: 36, height: 20, borderRadius: 10, border: "none", cursor: "pointer",
        backgroundColor: value ? "#8fa9dd" : "#d0d5dd", position: "relative", transition: "background-color 0.2s",
      }}>
        <div style={{
          width: 16, height: 16, borderRadius: 8, backgroundColor: "#fff",
          position: "absolute", top: 2, left: value ? 18 : 2, transition: "left 0.2s",
          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
        }} />
      </button>
    </div>
  );

  return (
    <div className="absolute inset-0 flex flex-col justify-end" style={{ zIndex: 70, borderRadius: 38, overflow: "hidden" }}>
      <div className="absolute inset-0" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onClick={flow === "idle" ? onClose : undefined} />

      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" multiple style={{ display: "none" }} onChange={handleFilesSelected} />

      <div style={{
        position: "relative", backgroundColor: "#ffffff", borderRadius: "16px 16px 0 0",
        padding: "12px 14px 20px", animation: "albumZoomIn 0.3s ease-out",
      }}>
        {/* Handle */}
        <div className="flex justify-center" style={{ marginBottom: 8 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: "#d0d5dd" }} />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#394460" }}>
            {flow === "idle" && "Create / Import"}
            {flow === "create-folder" && "New Folder"}
            {flow === "create-album" && "New Album"}
            {flow === "uploading" && "Importing..."}
            {flow === "save-to" && "Save to..."}
            {flow === "success" && "Done"}
            {flow === "error" && "Error"}
            {flow === "add-link" && "Add Link"}
            {flow === "add-music" && "Add Music"}
          </span>
          <div className="flex items-center" style={{ gap: 6 }}>
            {flow !== "idle" && flow !== "uploading" && (
              <button onClick={() => setFlow("idle")} style={{ background: "none", border: "none", cursor: "pointer", padding: 2, fontSize: 10, color: "#8fa9dd", fontWeight: 600 }}>Back</button>
            )}
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
              <X size={16} color="#687287" />
            </button>
          </div>
        </div>

        {/* ── IDLE: Grid ── */}
        {flow === "idle" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {options.map((opt) => (
              <button key={opt.id} onClick={() => handleAction(opt.id)}
                className="flex flex-col items-center transition-all duration-150 hover:scale-105 active:scale-95"
                style={{ background: "none", border: "1px solid #e8ecf4", borderRadius: 10, padding: "10px 4px", cursor: "pointer" }}>
                <div className="flex items-center justify-center" style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: `${opt.color}22`, marginBottom: 4 }}>
                  <opt.icon size={16} color={opt.color} />
                </div>
                <span style={{ fontSize: 8, color: "#5b6585", fontWeight: 600, textAlign: "center", lineHeight: "10px" }}>{opt.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* ── CREATE FOLDER FORM ── */}
        {flow === "create-folder" && (
          <div style={{ animation: "albumZoomIn 0.2s ease-out" }}>
            <div style={{ marginBottom: 8 }}>
              <label style={labelStyle}>Folder Name</label>
              <input style={inputStyle} value={folderName} onChange={(e) => setFolderName(e.target.value)} placeholder="My Folder" autoFocus />
            </div>
            <div style={{ marginBottom: 8 }}>
              <label style={labelStyle}>Color</label>
              <div className="flex" style={{ gap: 6 }}>
                {folderColors.map((c) => (
                  <button key={c} onClick={() => setFolderColor(c)} style={{
                    width: 24, height: 24, borderRadius: 12, backgroundColor: c,
                    border: folderColor === c ? "2px solid #394460" : "2px solid transparent",
                    cursor: "pointer", transition: "border-color 0.15s",
                  }} />
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 8 }}>
              <label style={labelStyle}>Font Style</label>
              <div className="flex" style={{ gap: 4 }}>
                {fontStyles.map((f) => (
                  <button key={f} onClick={() => setFolderFont(f)} style={{
                    padding: "4px 8px", borderRadius: 6, fontSize: 9, fontWeight: 600, cursor: "pointer",
                    backgroundColor: folderFont === f ? "#8fa9dd" : "#f0f2f5",
                    color: folderFont === f ? "#fff" : "#5b6585", border: "none", transition: "all 0.15s",
                  }}>{f}</button>
                ))}
              </div>
            </div>
            {toggleRow("Password Lock", <Lock size={12} color="#687287" />, folderPassword, setFolderPassword)}
            {toggleRow("Private", <EyeOff size={12} color="#687287" />, folderPrivate, setFolderPrivate)}
            <button onClick={handleCreateFolder} style={submitBtnStyle} className="active:opacity-80">Create Folder</button>
          </div>
        )}

        {/* ── CREATE ALBUM FORM ── */}
        {flow === "create-album" && (
          <div style={{ animation: "albumZoomIn 0.2s ease-out" }}>
            <div style={{ marginBottom: 8 }}>
              <label style={labelStyle}>Album Title</label>
              <input style={inputStyle} value={albumTitle} onChange={(e) => setAlbumTitle(e.target.value)} placeholder="My Album" autoFocus />
              <button onClick={handleSuggestAlbumTitle} disabled={suggestingAlbumTitle} className="flex items-center justify-center" style={{
                width: "100%", height: 28, borderRadius: 6, backgroundColor: "#f0eeff",
                color: "#6d55c7", fontSize: 10, fontWeight: 700, border: "none",
                cursor: suggestingAlbumTitle ? "default" : "pointer", marginTop: 5, opacity: suggestingAlbumTitle ? 0.7 : 1,
                gap: 4,
              }}>
                {suggestingAlbumTitle ? <Loader2 size={11} className="animate-spin" /> : <Sparkles size={11} />}
                {suggestingAlbumTitle ? "Suggesting..." : "AI Suggest"}
              </button>
              {albumAiError && <p style={{ fontSize: 9, color: "#c0392b", margin: "4px 0 0" }}>{albumAiError}</p>}
              {albumTitleSuggestions.length > 0 && (
                <div className="flex flex-wrap" style={{ gap: 4, marginTop: 5 }}>
                  {albumTitleSuggestions.map((title) => (
                    <button key={title} onClick={() => setAlbumTitle(title)} style={{
                      padding: "3px 6px", borderRadius: 6, fontSize: 8.5, fontWeight: 600,
                      backgroundColor: albumTitle === title ? "#8b5cf6" : "#f0f2f5",
                      color: albumTitle === title ? "#fff" : "#5b6585", border: "none", cursor: "pointer",
                    }}>{title}</button>
                  ))}
                </div>
              )}
            </div>
            <div style={{ marginBottom: 8 }}>
              <label style={labelStyle}>Category</label>
              <div className="flex flex-wrap" style={{ gap: 4 }}>
                {albumCategories.map((c) => (
                  <button key={c} onClick={() => setAlbumCategory(c)} style={{
                    padding: "4px 8px", borderRadius: 6, fontSize: 9, fontWeight: 600, cursor: "pointer",
                    backgroundColor: albumCategory === c ? "#8b5cf6" : "#f0f2f5",
                    color: albumCategory === c ? "#fff" : "#5b6585", border: "none", transition: "all 0.15s",
                  }}>{c}</button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 8 }}>
              <label style={labelStyle}>Theme</label>
              <div className="flex flex-wrap" style={{ gap: 4 }}>
                {albumThemes.map((t) => (
                  <button key={t} onClick={() => setAlbumTheme(t)} style={{
                    padding: "4px 8px", borderRadius: 6, fontSize: 9, fontWeight: 600, cursor: "pointer",
                    backgroundColor: albumTheme === t ? "#8b5cf6" : "#f0f2f5",
                    color: albumTheme === t ? "#fff" : "#5b6585", border: "none", transition: "all 0.15s", textTransform: "capitalize",
                  }}>{t}</button>
                ))}
              </div>
            </div>
            {toggleRow("Private Album", <EyeOff size={12} color="#687287" />, albumPrivate, setAlbumPrivate)}
            <button onClick={handleCreateAlbum} style={{ ...submitBtnStyle, backgroundColor: "#8b5cf6" }} className="active:opacity-80">Create Album</button>
          </div>
        )}

        {/* ── UPLOADING ── */}
        {flow === "uploading" && (
          <div className="flex flex-col items-center" style={{ padding: "16px 0" }}>
            <Loader2 size={28} color="#8fa9dd" className="animate-spin" style={{ marginBottom: 10 }} />
            <span style={{ fontSize: 12, color: "#5b6585", fontWeight: 600, marginBottom: 8 }}>
              {importedFiles.length > 0 ? `Importing ${importedFiles.length} file${importedFiles.length > 1 ? "s" : ""}...` : "Importing..."}
            </span>
            <div style={{ width: "100%", height: 6, borderRadius: 3, backgroundColor: "#e8ecf4", overflow: "hidden" }}>
              <div style={{ width: `${Math.min(progress, 100)}%`, height: "100%", backgroundColor: "#8fa9dd", borderRadius: 3, transition: "width 0.2s" }} />
            </div>
            <span style={{ fontSize: 10, color: "#8fa9dd", marginTop: 4 }}>{Math.min(Math.round(progress), 100)}%</span>
          </div>
        )}

        {/* ── SAVE TO ── */}
        {flow === "save-to" && (
          <div style={{ animation: "albumZoomIn 0.2s ease-out" }}>
            <span style={{ fontSize: 10, color: "#687287", marginBottom: 8, display: "block" }}>Where should we save your files?</span>
            <div style={{ maxHeight: 180, overflowY: "auto" }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: "#394460", marginBottom: 4, display: "block" }}>Folders</span>
              {mockFolders.map((f) => (
                <button key={f.id} onClick={() => setSaveTarget(f.id)} className="flex items-center justify-between" style={{
                  width: "100%", padding: "6px 8px", borderRadius: 6, marginBottom: 3, cursor: "pointer",
                  backgroundColor: saveTarget === f.id ? "#8fa9dd15" : "transparent",
                  border: saveTarget === f.id ? "1px solid #8fa9dd" : "1px solid #e8ecf4", transition: "all 0.15s",
                }}>
                  <span style={{ fontSize: 10, color: "#394460", fontWeight: 600 }}>{f.title}</span>
                  {saveTarget === f.id && <CheckCircle size={12} color="#8fa9dd" />}
                </button>
              ))}
              <span style={{ fontSize: 9, fontWeight: 700, color: "#394460", marginBottom: 4, marginTop: 6, display: "block" }}>Albums</span>
              {mockAlbums.map((a) => (
                <button key={a.id} onClick={() => setSaveTarget(a.id)} className="flex items-center justify-between" style={{
                  width: "100%", padding: "6px 8px", borderRadius: 6, marginBottom: 3, cursor: "pointer",
                  backgroundColor: saveTarget === a.id ? "#8b5cf615" : "transparent",
                  border: saveTarget === a.id ? "1px solid #8b5cf6" : "1px solid #e8ecf4", transition: "all 0.15s",
                }}>
                  <span style={{ fontSize: 10, color: "#394460", fontWeight: 600 }}>{a.title}</span>
                  {saveTarget === a.id && <CheckCircle size={12} color="#8b5cf6" />}
                </button>
              ))}
            </div>
            <button onClick={handleSaveTo} style={submitBtnStyle} className="active:opacity-80">Save Here</button>
          </div>
        )}

        {/* ── ERROR ── */}
        {flow === "error" && (
          <div className="flex flex-col items-center" style={{ padding: "16px 0", animation: "albumZoomIn 0.2s ease-out" }}>
            <AlertCircle size={32} color="#ef4444" style={{ marginBottom: 8 }} />
            <span style={{ fontSize: 13, color: "#ef4444", fontWeight: 700 }}>Import Failed</span>
            <span style={{ fontSize: 10, color: "#687287", marginTop: 4 }}>Network error. Please try again.</span>
            <button onClick={() => { setFlow("idle"); setProgress(0); }} style={{ ...submitBtnStyle, backgroundColor: "#ef4444" }} className="active:opacity-80">Retry</button>
          </div>
        )}

        {/* ── ADD LINK ── */}
        {flow === "add-link" && (
          <div style={{ animation: "albumZoomIn 0.2s ease-out" }}>
            <div style={{ marginBottom: 8 }}>
              <label style={labelStyle}>URL</label>
              <input style={inputStyle} value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://..." autoFocus />
            </div>
            <div style={{ marginBottom: 8 }}>
              <label style={labelStyle}>Type</label>
              <div className="flex" style={{ gap: 4 }}>
                {["YouTube", "TikTok", "Other"].map((t) => (
                  <button key={t} onClick={() => setLinkType(t)} style={{
                    padding: "4px 10px", borderRadius: 6, fontSize: 9, fontWeight: 600, cursor: "pointer",
                    backgroundColor: linkType === t ? "#c9a9d2" : "#f0f2f5",
                    color: linkType === t ? "#fff" : "#5b6585", border: "none", transition: "all 0.15s",
                  }}>{t}</button>
                ))}
              </div>
            </div>
            <button onClick={handleSaveLink} style={{ ...submitBtnStyle, backgroundColor: "#c9a9d2" }} className="active:opacity-80">Save Link</button>
          </div>
        )}

        {/* ── ADD MUSIC ── */}
        {flow === "add-music" && (
          <div style={{ animation: "albumZoomIn 0.2s ease-out" }}>
            <div style={{ marginBottom: 8 }}>
              <label style={labelStyle}>Source</label>
              <div className="flex" style={{ gap: 4 }}>
                {["YouTube", "MP3"].map((s) => (
                  <button key={s} onClick={() => setMusicSource(s)} style={{
                    padding: "4px 10px", borderRadius: 6, fontSize: 9, fontWeight: 600, cursor: "pointer",
                    backgroundColor: musicSource === s ? "#d2a9b8" : "#f0f2f5",
                    color: musicSource === s ? "#fff" : "#5b6585", border: "none", transition: "all 0.15s",
                  }}>{s}</button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 8 }}>
              <label style={labelStyle}>{musicSource === "YouTube" ? "YouTube URL" : "MP3 File Name"}</label>
              <input style={inputStyle} value={musicInput} onChange={(e) => setMusicInput(e.target.value)}
                placeholder={musicSource === "YouTube" ? "https://youtube.com/..." : "song.mp3"} autoFocus />
            </div>
            <button onClick={handleSaveMusic} style={{ ...submitBtnStyle, backgroundColor: "#d2a9b8" }} className="active:opacity-80">Save Music</button>
          </div>
        )}
      </div>
    </div>
  );
}
