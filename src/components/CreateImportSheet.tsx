import React, { useState, useEffect } from "react";
import {
  FolderPlus,
  BookOpen,
  ImagePlus,
  Video,
  Smartphone,
  Cloud,
  Monitor,
  Link,
  Music,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

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

type SheetState = "idle" | "uploading" | "success" | "error";

interface CreateImportSheetProps {
  open: boolean;
  onClose: () => void;
  onCreateFolder?: () => void;
  onCreateAlbum?: () => void;
}

export default function CreateImportSheet({ open, onClose, onCreateFolder, onCreateAlbum }: CreateImportSheetProps) {
  const [state, setState] = useState<SheetState>("idle");
  const [progress, setProgress] = useState(0);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setState("idle");
      setProgress(0);
      setSelectedAction(null);
    }
  }, [open]);

  const handleAction = (id: string) => {
    setSelectedAction(id);

    if (id === "create-folder") {
      onCreateFolder?.();
      onClose();
      return;
    }
    if (id === "create-album") {
      onCreateAlbum?.();
      onClose();
      return;
    }

    // Simulate upload/import
    setState("uploading");
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          // 80% success, 20% error
          setState(Math.random() > 0.2 ? "success" : "error");
          return 100;
        }
        return p + Math.random() * 15 + 5;
      });
    }, 200);
  };

  if (!open) return null;

  return (
    <div
      className="absolute inset-0 flex flex-col justify-end"
      style={{ zIndex: 70, borderRadius: 38, overflow: "hidden" }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        onClick={state === "idle" ? onClose : undefined}
      />

      {/* Sheet */}
      <div
        style={{
          position: "relative",
          backgroundColor: "#ffffff",
          borderRadius: "16px 16px 0 0",
          padding: "12px 14px 20px",
          animation: "albumZoomIn 0.3s ease-out",
        }}
      >
        {/* Handle */}
        <div className="flex justify-center" style={{ marginBottom: 8 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: "#d0d5dd" }} />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#394460" }}>Create / Import</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
            <X size={16} color="#687287" />
          </button>
        </div>

        {state === "idle" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => handleAction(opt.id)}
                className="flex flex-col items-center transition-transform hover:scale-105"
                style={{
                  background: "none",
                  border: "1px solid #e8ecf4",
                  borderRadius: 10,
                  padding: "10px 4px",
                  cursor: "pointer",
                }}
              >
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    backgroundColor: `${opt.color}22`,
                    marginBottom: 4,
                  }}
                >
                  <opt.icon size={16} color={opt.color} />
                </div>
                <span style={{ fontSize: 8, color: "#5b6585", fontWeight: 600, textAlign: "center", lineHeight: "10px" }}>
                  {opt.label}
                </span>
              </button>
            ))}
          </div>
        )}

        {state === "uploading" && (
          <div className="flex flex-col items-center" style={{ padding: "16px 0" }}>
            <Loader2 size={28} color="#8fa9dd" className="animate-spin" style={{ marginBottom: 10 }} />
            <span style={{ fontSize: 12, color: "#5b6585", fontWeight: 600, marginBottom: 8 }}>
              Importing...
            </span>
            <div style={{ width: "100%", height: 6, borderRadius: 3, backgroundColor: "#e8ecf4", overflow: "hidden" }}>
              <div
                style={{
                  width: `${Math.min(progress, 100)}%`,
                  height: "100%",
                  backgroundColor: "#8fa9dd",
                  borderRadius: 3,
                  transition: "width 0.2s",
                }}
              />
            </div>
            <span style={{ fontSize: 10, color: "#8fa9dd", marginTop: 4 }}>{Math.min(Math.round(progress), 100)}%</span>
          </div>
        )}

        {state === "success" && (
          <div className="flex flex-col items-center" style={{ padding: "16px 0" }}>
            <CheckCircle size={32} color="#1db954" style={{ marginBottom: 8 }} />
            <span style={{ fontSize: 13, color: "#1db954", fontWeight: 700 }}>Import Successful!</span>
            <span style={{ fontSize: 10, color: "#687287", marginTop: 4 }}>Your files have been added.</span>
            <button
              onClick={onClose}
              style={{
                marginTop: 12,
                padding: "6px 24px",
                borderRadius: 6,
                backgroundColor: "#8fa9dd",
                color: "#fff",
                fontSize: 11,
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
              }}
            >
              Done
            </button>
          </div>
        )}

        {state === "error" && (
          <div className="flex flex-col items-center" style={{ padding: "16px 0" }}>
            <AlertCircle size={32} color="#ef4444" style={{ marginBottom: 8 }} />
            <span style={{ fontSize: 13, color: "#ef4444", fontWeight: 700 }}>Import Failed</span>
            <span style={{ fontSize: 10, color: "#687287", marginTop: 4 }}>Network error. Please try again.</span>
            <button
              onClick={() => { setState("idle"); setProgress(0); }}
              style={{
                marginTop: 12,
                padding: "6px 24px",
                borderRadius: 6,
                backgroundColor: "#ef4444",
                color: "#fff",
                fontSize: 11,
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
              }}
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
