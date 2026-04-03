import React, { useState, useRef } from "react";
import {
  Camera,
  ImageIcon,
  ChevronLeft,
  Video,
  Sparkles,
  Wand2,
  Scissors,
  Palette,
  Eraser,
  UserRound,
  Layers,
  Type,
  Smile,
  Star,
  Paintbrush,
  RefreshCw,
  Heart,
  Gem,
  Frame,
  SunMedium,
  Contrast,
  CircleDot,
  MoreHorizontal,
  Timer,
  FlipHorizontal,
  X,
} from "lucide-react";
import PhoneLayout from "@/components/PhoneLayout";

/* ─── Feature grid (shown on main Photo Video Edit screen) ─── */
const features = [
  { icon: <Eraser size={18} />, label: "AI Removal" },
  { icon: <UserRound size={18} />, label: "Face Reshape" },
  { icon: <Layers size={18} />, label: "Collage" },
  { icon: <Smile size={18} />, label: "Face Swap" },
  { icon: <Sparkles size={18} />, label: "Photo Enhance" },
  { icon: <Wand2 size={18} />, label: "Taller" },
  { icon: <Video size={18} />, label: "Video Enhance" },
  { icon: <Paintbrush size={18} />, label: "Facelift" },
  { icon: <Palette size={18} />, label: "Makeup" },
  { icon: <Star size={18} />, label: "Effects" },
  { icon: <Layers size={18} />, label: "Collage" },
  { icon: <Scissors size={18} />, label: "AI Hairstyle" },
  { icon: <Eraser size={18} />, label: "Remove BG" },
  { icon: <Gem size={18} />, label: "Teeth Whitener" },
  { icon: <SunMedium size={18} />, label: "Smooth" },
  { icon: <Type size={18} />, label: "Text to Image" },
  { icon: <Wand2 size={18} />, label: "Photo Repair" },
  { icon: <Scissors size={18} />, label: "AI Hairstyle" },
  { icon: <RefreshCw size={18} />, label: "AI Replace" },
];

/* ─── Beautify items (horizontal scroll) ─── */
const beautifyItems = [
  { icon: <RefreshCw size={16} />, label: "Reset" },
  { icon: <SunMedium size={16} />, label: "Smooth" },
  { icon: <Heart size={16} />, label: "Lip Color" },
  { icon: <UserRound size={16} />, label: "Face Shaper" },
  { icon: <Contrast size={16} />, label: "Chin Shape" },
  { icon: <CircleDot size={16} />, label: "Cheeks" },
  { icon: <Gem size={16} />, label: "Teeth Whitener" },
  { icon: <Sparkles size={16} />, label: "Eye Bright" },
  { icon: <Paintbrush size={16} />, label: "Nose" },
];

/* ─── Effects categories ─── */
const effectCategories = ["HOT", "Portrait", "Love", "Daily", "Trendy", "Food", "Gentle", "Cool", "Retro", "Forest", "Fresh"];

/* ─── Frames categories ─── */
const frameCategories = ["Art", "Food", "Zodiac", "Birthday", "Cartoon", "Classic"];

/* ─── Placeholder preview colors for effects/frames thumbnails ─── */
const previewColors = ["#e8b4b8", "#c9a9d2", "#a9c9d2", "#d2c9a9", "#b8d2a9", "#d2a9b8"];

type EditorMode = null | "camera" | "photo";
type EditorTab = "beautify" | "effects" | "frames";

function FeatureIcon({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center" style={{ width: 54, marginBottom: 10 }}>
      <div
        className="flex items-center justify-center"
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          backgroundColor: "#f0f2f8",
          marginBottom: 3,
          color: "#5b6585",
        }}
      >
        {icon}
      </div>
      <span
        style={{
          fontSize: 7.5,
          color: "#5b6585",
          textAlign: "center",
          lineHeight: "9px",
          fontWeight: 500,
        }}
      >
        {label}
      </span>
    </div>
  );
}

function EditorOverlay({
  mode,
  onClose,
  imageUrl,
}: {
  mode: "camera" | "photo";
  onClose: () => void;
  imageUrl: string | null;
}) {
  const [activeTab, setActiveTab] = useState<EditorTab>("beautify");
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturate, setSaturate] = useState(100);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [activeFrame, setActiveFrame] = useState<number | null>(null);
  const isCamera = mode === "camera";
  const modeLabel = isCamera ? "Camera" : "Photo Edit";
  const ModeIcon = isCamera ? Camera : ImageIcon;

  const filterStyle = (): React.CSSProperties => ({
    filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%)${activeFilter ? ` ${activeFilter}` : ""}`,
    width: "100%",
    height: "100%",
    objectFit: "cover" as const,
    display: "block",
    borderRadius: 8,
  });

  return (
    <div
      className="absolute inset-0 flex flex-col"
      style={{
        backgroundColor: "#1a1a1a",
        borderRadius: 38,
        zIndex: 60,
        overflow: "hidden",
      }}
    >
      {/* Top bar */}
      <div
        className="flex items-center"
        style={{ padding: "38px 14px 8px 14px" }}
      >
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
          <ChevronLeft size={20} color="#ffffff" />
        </button>
        <div className="flex items-center ml-2">
          <div
            className="flex items-center justify-center"
            style={{
              width: 26,
              height: 26,
              borderRadius: 6,
              backgroundColor: "#333",
              marginRight: 8,
            }}
          >
            <ModeIcon size={14} color="#ffffff" />
          </div>
          <span style={{ color: "#6b9fff", fontSize: 13, fontWeight: 600 }}>
            You are using {modeLabel}
          </span>
        </div>
      </div>

      {/* Preview area (simulated camera/photo) */}
      <div
        className="flex-1 flex items-center justify-center"
        style={{
          background: isCamera
            ? "linear-gradient(135deg, #2a2a3e 0%, #1a1a2e 100%)"
            : "linear-gradient(135deg, #3a2a2e 0%, #2a1a2e 100%)",
          margin: "0 4px",
          borderRadius: 8,
          position: "relative",
        }}
      >
        <div className="text-center" style={{ color: "#555", fontSize: 12 }}>
          {isCamera ? (
            <Camera size={48} color="#444" />
          ) : (
            <ImageIcon size={48} color="#444" />
          )}
          <p style={{ marginTop: 8 }}>{isCamera ? "Camera Preview" : "Photo Preview"}</p>
        </div>
      </div>

      {/* Bottom toolbar icons */}
      <div
        className="flex items-center justify-center"
        style={{ padding: "8px 10px 4px", gap: 14 }}
      >
        <Video size={18} color="#aaa" />
        <div
          className="flex items-center justify-center"
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: "#1db954",
            border: "2px solid #1db954",
          }}
        >
          <Camera size={16} color="#fff" />
        </div>
        <Contrast size={16} color="#aaa" />
        <Sparkles size={16} color="#aaa" />
        <Wand2 size={14} color="#aaa" />
        <MoreHorizontal size={16} color="#aaa" />
        <Timer size={16} color="#aaa" />
        <FlipHorizontal size={16} color="#aaa" />
      </div>

      {/* Tabs: BEAUTIFY | EFFECTS | FRAMES */}
      <div
        className="flex items-center justify-center"
        style={{ padding: "6px 14px 2px", gap: 20 }}
      >
        {(["beautify", "effects", "frames"] as EditorTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: activeTab === tab ? "#1db954" : "#888",
              fontSize: 12,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 0.5,
              paddingBottom: 4,
              borderBottom: activeTab === tab ? "2px solid #1db954" : "2px solid transparent",
            }}
          >
            {tab}
          </button>
        ))}
        <button style={{ background: "none", border: "none", cursor: "pointer" }}>
          <X size={14} color="#888" />
        </button>
      </div>

      {/* Tab content */}
      <div style={{ padding: "4px 8px 16px", minHeight: 80 }}>
        {activeTab === "beautify" && (
          <>
            {/* Slider */}
            <div className="flex items-center" style={{ padding: "2px 6px 6px", gap: 8 }}>
              <div
                style={{
                  flex: 1,
                  height: 3,
                  backgroundColor: "#333",
                  borderRadius: 2,
                  position: "relative",
                }}
              >
                <div
                  style={{
                    width: "50%",
                    height: "100%",
                    backgroundColor: "#1db954",
                    borderRadius: 2,
                  }}
                />
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: "#1db954",
                    position: "absolute",
                    top: -3.5,
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                />
              </div>
              <span style={{ color: "#aaa", fontSize: 10, minWidth: 18 }}>50</span>
              <div
                style={{
                  backgroundColor: "#6b9fff",
                  borderRadius: 4,
                  padding: "2px 8px",
                  fontSize: 9,
                  color: "#fff",
                  fontWeight: 600,
                }}
              >
                + preset
              </div>
            </div>
            {/* Scrollable beautify icons */}
            <div
              className="flex items-start [&::-webkit-scrollbar]:hidden"
              style={{
                overflowX: "auto",
                gap: 12,
                paddingBottom: 6,
                scrollbarWidth: "none",
              }}
            >
              {beautifyItems.map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center flex-shrink-0"
                  style={{ width: 48 }}
                >
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: i === 1 ? "#333" : "#2a2a2a",
                      marginBottom: 3,
                      color: "#ccc",
                      border: i === 1 ? "1.5px solid #1db954" : "none",
                    }}
                  >
                    {item.icon}
                  </div>
                  <span
                    style={{
                      fontSize: 7.5,
                      color: i === 1 ? "#1db954" : "#888",
                      textAlign: "center",
                      lineHeight: "9px",
                      fontWeight: 500,
                    }}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "effects" && (
          <>
            {/* Category chips */}
            <div
              className="flex items-center [&::-webkit-scrollbar]:hidden"
              style={{
                overflowX: "auto",
                gap: 6,
                paddingBottom: 6,
                scrollbarWidth: "none",
              }}
            >
              <div
                className="flex items-center justify-center flex-shrink-0"
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 11,
                  backgroundColor: "#333",
                }}
              >
                <Heart size={12} color="#ff6b8a" />
              </div>
              {effectCategories.map((cat, i) => (
                <div
                  key={cat}
                  className="flex-shrink-0"
                  style={{
                    padding: "3px 10px",
                    borderRadius: 12,
                    backgroundColor: i === 1 ? "#8b5cf6" : "#2a2a2a",
                    color: i === 1 ? "#fff" : "#aaa",
                    fontSize: 10,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {cat}
                </div>
              ))}
            </div>
            {/* Effect thumbnails */}
            <div
              className="flex items-start [&::-webkit-scrollbar]:hidden"
              style={{
                overflowX: "auto",
                gap: 8,
                paddingTop: 4,
                scrollbarWidth: "none",
              }}
            >
              <div
                className="flex items-center justify-center flex-shrink-0"
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 8,
                  backgroundColor: "#2a2a2a",
                }}
              >
                <X size={16} color="#888" />
              </div>
              {previewColors.map((color, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center flex-shrink-0"
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 8,
                      background: `linear-gradient(135deg, ${color}, ${color}88)`,
                      marginBottom: 3,
                    }}
                  />
                  <span style={{ fontSize: 7, color: "#888" }}>
                    {["Gentle", "Cool", "Retro", "Forest", "Fresh", "Warm"][i]}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "frames" && (
          <>
            {/* Frame category chips */}
            <div
              className="flex items-center [&::-webkit-scrollbar]:hidden"
              style={{
                overflowX: "auto",
                gap: 6,
                paddingBottom: 6,
                scrollbarWidth: "none",
              }}
            >
              {frameCategories.map((cat, i) => (
                <div
                  key={cat}
                  className="flex-shrink-0"
                  style={{
                    padding: "3px 10px",
                    borderRadius: 12,
                    backgroundColor: i === 0 ? "#8b5cf6" : "#2a2a2a",
                    color: i === 0 ? "#fff" : "#aaa",
                    fontSize: 10,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {cat}
                </div>
              ))}
            </div>
            {/* Frame thumbnails */}
            <div
              className="flex items-start [&::-webkit-scrollbar]:hidden"
              style={{
                overflowX: "auto",
                gap: 8,
                paddingTop: 4,
                scrollbarWidth: "none",
              }}
            >
              <div
                className="flex items-center justify-center flex-shrink-0"
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 8,
                  backgroundColor: "#2a2a2a",
                }}
              >
                <X size={16} color="#888" />
              </div>
              {["🐰", "🎨", "🎂", "⭐", "🌸", "🎭"].map((emoji, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center flex-shrink-0"
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 8,
                    backgroundColor: "#2a2a2a",
                    border: "2px solid #444",
                    fontSize: 20,
                  }}
                >
                  {emoji}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function PhotoVideoEdit() {
  const [editorMode, setEditorMode] = useState<EditorMode>(null);

  /* Custom content for the grid area of PhoneLayout */
  const customContent = (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* Two main icons: Camera & Photo */}
      <div className="flex items-center justify-center" style={{ gap: 24, marginBottom: 16 }}>
        <div
          className="flex flex-col items-center cursor-pointer transition-transform hover:scale-105"
          onClick={() => setEditorMode("camera")}
        >
          <div
            className="flex items-center justify-center"
            style={{
              width: 64,
              height: 64,
              borderRadius: 14,
              backgroundColor: "#3a3f55",
              marginBottom: 4,
            }}
          >
            <Camera size={28} color="#ffffff" />
          </div>
          <span style={{ fontSize: 10, color: "#5b6585", fontWeight: 600 }}>Camera</span>
        </div>

        <div
          className="flex flex-col items-center cursor-pointer transition-transform hover:scale-105"
          onClick={() => setEditorMode("photo")}
        >
          <div
            className="flex items-center justify-center"
            style={{
              width: 64,
              height: 64,
              borderRadius: 14,
              backgroundColor: "#3a3f55",
              marginBottom: 4,
            }}
          >
            <ImageIcon size={28} color="#ffffff" />
          </div>
          <span style={{ fontSize: 10, color: "#5b6585", fontWeight: 600 }}>Photos</span>
        </div>
      </div>

      {/* Feature grid */}
      <div
        className="flex flex-wrap justify-start"
        style={{ gap: 4, paddingBottom: 12 }}
      >
        {features.map((f, i) => (
          <FeatureIcon key={i} icon={f.icon} label={f.label} />
        ))}
      </div>
    </div>
  );

  return (
    <PhoneLayout
      cards={[]}
      customContent={customContent}
      overlay={
        editorMode ? (
          <EditorOverlay mode={editorMode} onClose={() => setEditorMode(null)} />
        ) : null
      }
    />
  );
}
