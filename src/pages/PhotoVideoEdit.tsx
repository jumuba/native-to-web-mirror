import React, { useEffect, useRef, useState } from "react";
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
type SelectedMediaType = "image" | "video";
type FacingMode = "user" | "environment";
type CaptureMode = "video" | "photo";

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
  mediaUrl,
  mediaType,
}: {
  mode: "camera" | "photo";
  onClose: () => void;
  mediaUrl: string | null;
  mediaType: SelectedMediaType;
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
        {mediaUrl ? (
          mediaType === "video" ? (
            <video src={mediaUrl} controls style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", borderRadius: 8 }} />
          ) : (
            <img src={mediaUrl} alt="Preview" style={filterStyle()} />
          )
        ) : (
          <div className="text-center" style={{ color: "#555", fontSize: 12 }}>
            {isCamera ? (
              <Camera size={48} color="#444" />
            ) : (
              <ImageIcon size={48} color="#444" />
            )}
            <p style={{ marginTop: 8 }}>{isCamera ? "Camera Preview" : "Photo Preview"}</p>
          </div>
        )}
        {activeFrame !== null && mediaUrl && mediaType === "image" && (
          <div style={{
            position: "absolute",
            inset: 0,
            borderRadius: 8,
            border: `4px solid ${previewColors[activeFrame % previewColors.length]}`,
            pointerEvents: "none",
            boxShadow: `inset 0 0 20px ${previewColors[activeFrame % previewColors.length]}44`,
          }} />
        )}
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
            {/* Brightness slider */}
            <div className="flex items-center" style={{ padding: "2px 6px 4px", gap: 8 }}>
              <span style={{ color: "#888", fontSize: 9, minWidth: 50 }}>Brightness</span>
              <input type="range" min={50} max={150} value={brightness}
                onChange={e => setBrightness(Number(e.target.value))}
                style={{ flex: 1, accentColor: "#1db954", height: 3 }} />
              <span style={{ color: "#aaa", fontSize: 10, minWidth: 18 }}>{brightness}</span>
            </div>
            {/* Contrast slider */}
            <div className="flex items-center" style={{ padding: "2px 6px 4px", gap: 8 }}>
              <span style={{ color: "#888", fontSize: 9, minWidth: 50 }}>Contrast</span>
              <input type="range" min={50} max={150} value={contrast}
                onChange={e => setContrast(Number(e.target.value))}
                style={{ flex: 1, accentColor: "#1db954", height: 3 }} />
              <span style={{ color: "#aaa", fontSize: 10, minWidth: 18 }}>{contrast}</span>
            </div>
            {/* Saturation slider */}
            <div className="flex items-center" style={{ padding: "2px 6px 6px", gap: 8 }}>
              <span style={{ color: "#888", fontSize: 9, minWidth: 50 }}>Saturation</span>
              <input type="range" min={0} max={200} value={saturate}
                onChange={e => setSaturate(Number(e.target.value))}
                style={{ flex: 1, accentColor: "#1db954", height: 3 }} />
              <span style={{ color: "#aaa", fontSize: 10, minWidth: 18 }}>{saturate}</span>
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
                  className="flex flex-col items-center flex-shrink-0 cursor-pointer"
                  style={{ width: 48 }}
                  onClick={() => {
                    if (item.label === "Reset") {
                      setBrightness(100); setContrast(100); setSaturate(100); setActiveFilter(null);
                    }
                  }}
                >
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: "#2a2a2a",
                      marginBottom: 3,
                      color: "#ccc",
                    }}
                  >
                    {item.icon}
                  </div>
                  <span
                    style={{
                      fontSize: 7.5,
                      color: "#888",
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
                className="flex items-center justify-center flex-shrink-0 cursor-pointer"
                onClick={() => setActiveFilter(null)}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 8,
                  backgroundColor: "#2a2a2a",
                  border: activeFilter === null ? "2px solid #1db954" : "none",
                }}
              >
                <X size={16} color="#888" />
              </div>
              {[
                { name: "Gentle", filter: "sepia(30%) brightness(105%)" },
                { name: "Cool", filter: "hue-rotate(180deg) saturate(80%)" },
                { name: "Retro", filter: "sepia(60%) contrast(90%)" },
                { name: "Forest", filter: "hue-rotate(90deg) saturate(120%)" },
                { name: "Fresh", filter: "brightness(110%) saturate(130%)" },
                { name: "Warm", filter: "sepia(20%) saturate(140%) brightness(105%)" },
              ].map((effect, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center flex-shrink-0 cursor-pointer"
                  onClick={() => setActiveFilter(effect.filter)}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 8,
                      background: `linear-gradient(135deg, ${previewColors[i]}, ${previewColors[i]}88)`,
                      marginBottom: 3,
                      border: activeFilter === effect.filter ? "2px solid #1db954" : "none",
                    }}
                  />
                  <span style={{ fontSize: 7, color: activeFilter === effect.filter ? "#1db954" : "#888" }}>
                    {effect.name}
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
                className="flex items-center justify-center flex-shrink-0 cursor-pointer"
                onClick={() => setActiveFrame(null)}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 8,
                  backgroundColor: "#2a2a2a",
                  border: activeFrame === null ? "2px solid #1db954" : "none",
                }}
              >
                <X size={16} color="#888" />
              </div>
              {["🐰", "🎨", "🎂", "⭐", "🌸", "🎭"].map((emoji, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center flex-shrink-0 cursor-pointer"
                  onClick={() => setActiveFrame(i)}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 8,
                    backgroundColor: "#2a2a2a",
                    border: activeFrame === i ? "2px solid #1db954" : "2px solid #444",
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

function LiveCaptureOverlay({
  mode,
  facingMode,
  stream,
  onClose,
  onSwitchFacing,
  onTakePhoto,
  onToggleRecording,
  isRecording,
}: {
  mode: CaptureMode;
  facingMode: FacingMode;
  stream: MediaStream | null;
  onClose: () => void;
  onSwitchFacing: () => void;
  onTakePhoto: (video: HTMLVideoElement) => void;
  onToggleRecording: () => void;
  isRecording: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isVideoMode = mode === "video";

  useEffect(() => {
    if (!videoRef.current || !stream) return;
    videoRef.current.srcObject = stream;
    void videoRef.current.play().catch(() => {});
  }, [stream]);

  return (
    <div
      className="absolute inset-0 flex flex-col"
      style={{ backgroundColor: "#111", borderRadius: 38, zIndex: 70, overflow: "hidden" }}
    >
      <div className="flex items-center justify-between" style={{ padding: "38px 14px 8px" }}>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
          <ChevronLeft size={20} color="#fff" />
        </button>
        <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>
          {isVideoMode ? "Record Video" : "Take Photo"}
        </span>
        <button onClick={onSwitchFacing} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
          <FlipHorizontal size={18} color="#fff" />
        </button>
      </div>

      <div className="flex-1" style={{ margin: "0 6px", borderRadius: 10, overflow: "hidden", position: "relative", backgroundColor: "#000" }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover", transform: facingMode === "user" ? "scaleX(-1)" : "none" }}
        />
        <div style={{ position: "absolute", top: 10, left: 10, padding: "5px 8px", borderRadius: 12, backgroundColor: "rgba(0,0,0,0.45)" }}>
          <span style={{ color: "#fff", fontSize: 9, fontWeight: 700 }}>
            {facingMode === "user" ? "Front Camera" : "Back Camera"}
          </span>
        </div>
        {isRecording && (
          <div style={{ position: "absolute", top: 10, right: 10, padding: "5px 8px", borderRadius: 12, backgroundColor: "rgba(220,38,38,0.92)" }}>
            <span style={{ color: "#fff", fontSize: 9, fontWeight: 700 }}>REC</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center" style={{ padding: "12px 14px 18px", gap: 14 }}>
        <button
          onClick={onSwitchFacing}
          style={{ width: 42, height: 42, borderRadius: 21, border: "1px solid #555", backgroundColor: "#202020", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <FlipHorizontal size={18} color="#fff" />
        </button>
        <button
          onClick={() => {
            if (!videoRef.current) return;
            if (isVideoMode) onToggleRecording();
            else onTakePhoto(videoRef.current);
          }}
          style={{
            width: 66,
            height: 66,
            borderRadius: 33,
            border: isVideoMode ? "4px solid #fff" : "4px solid #d1d5db",
            backgroundColor: isVideoMode ? (isRecording ? "#dc2626" : "#ef4444") : "#fff",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isVideoMode ? (
            <div style={{ width: isRecording ? 20 : 28, height: isRecording ? 20 : 28, borderRadius: isRecording ? 5 : 14, backgroundColor: "#fff" }} />
          ) : (
            <Camera size={24} color="#394460" />
          )}
        </button>
        <div style={{ width: 42, height: 42 }} />
      </div>
    </div>
  );
}

export default function PhotoVideoEdit() {
  const [editorMode, setEditorMode] = useState<EditorMode>(null);
  const [selectedMediaUrl, setSelectedMediaUrl] = useState<string | null>(null);
  const [selectedMediaType, setSelectedMediaType] = useState<SelectedMediaType>("image");
  const [showCameraChooser, setShowCameraChooser] = useState(false);
  const [cameraAction, setCameraAction] = useState<CaptureMode | null>(null);
  const [liveMode, setLiveMode] = useState<CaptureMode | null>(null);
  const [liveFacingMode, setLiveFacingMode] = useState<FacingMode>("environment");
  const [liveStream, setLiveStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<BlobPart[]>([]);
  const photoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => () => stopStream(), []);

  const stopStream = (stream?: MediaStream | null) => {
    (stream || liveStream)?.getTracks().forEach((track) => track.stop());
  };

  const openEditor = (mode: EditorMode, mediaUrl: string, mediaType: SelectedMediaType) => {
    setSelectedMediaUrl(mediaUrl);
    setSelectedMediaType(mediaType);
    setEditorMode(mode);
  };

  const handleDesktopPhotoSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      openEditor("photo", reader.result as string, "image");
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const startLiveCapture = async (mode: CaptureMode, facing: FacingMode) => {
    try {
      stopStream();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing },
        audio: mode === "video",
      });
      setLiveStream(stream);
      setLiveMode(mode);
      setLiveFacingMode(facing);
      setShowCameraChooser(false);
      setCameraAction(null);
      setIsRecording(false);
    } catch {
      setShowCameraChooser(false);
      setCameraAction(null);
    }
  };

  const closeLiveCapture = () => {
    recorderRef.current?.stop();
    recorderRef.current = null;
    recordedChunksRef.current = [];
    setIsRecording(false);
    stopStream();
    setLiveStream(null);
    setLiveMode(null);
  };

  const switchFacing = async () => {
    if (!liveMode) return;
    const nextFacing = liveFacingMode === "user" ? "environment" : "user";
    await startLiveCapture(liveMode, nextFacing);
  };

  const takePhotoFromVideo = (video: HTMLVideoElement) => {
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 720;
    canvas.height = video.videoHeight || 1280;
    const context = canvas.getContext("2d");
    if (!context) return;

    if (liveFacingMode === "user") {
      context.translate(canvas.width, 0);
      context.scale(-1, 1);
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/png");
    closeLiveCapture();
    openEditor("photo", dataUrl, "image");
  };

  const toggleRecording = () => {
    if (!liveStream) return;

    if (isRecording) {
      recorderRef.current?.stop();
      setIsRecording(false);
      return;
    }

    const recorder = new MediaRecorder(liveStream);
    recordedChunksRef.current = [];
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) recordedChunksRef.current.push(event.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
      const videoUrl = URL.createObjectURL(blob);
      closeLiveCapture();
      openEditor("camera", videoUrl, "video");
    };
    recorderRef.current = recorder;
    recorder.start();
    setIsRecording(true);
  };

  const customContent = (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <input
        ref={photoInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleDesktopPhotoSelected}
      />
      {/* Two main icons: Camera & Photo */}
      <div className="flex items-center justify-center" style={{ gap: 24, marginBottom: 16 }}>
        <div
          className="flex flex-col items-center cursor-pointer transition-transform hover:scale-105"
          onClick={() => { setShowCameraChooser(true); setCameraAction(null); }}
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
          onClick={() => photoInputRef.current?.click()}
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

      {showCameraChooser && (
        <div style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.28)",
          borderRadius: 38,
          zIndex: 40,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          padding: 12,
        }}>
          <div style={{
            width: "100%",
            backgroundColor: "#fff",
            borderRadius: 14,
            padding: "14px 12px 12px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
          }}>
            <p style={{ margin: "0 0 10px", fontSize: 11, fontWeight: 700, color: "#394460", textAlign: "center" }}>
              {cameraAction ? "Choose Camera Side" : "Open Camera"}
            </p>
            {!cameraAction ? (
              <div className="flex items-center justify-center" style={{ gap: 12, marginBottom: 10 }}>
                <button
                  onClick={() => setCameraAction("video")}
                  style={{
                    flex: 1,
                    border: "none",
                    borderRadius: 12,
                    padding: "14px 10px",
                    backgroundColor: "#eef2fb",
                    cursor: "pointer",
                  }}
                >
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center" style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: "#3a3f55", marginBottom: 6 }}>
                      <Video size={20} color="#fff" />
                    </div>
                    <span style={{ fontSize: 10, color: "#394460", fontWeight: 700 }}>Camera</span>
                    <span style={{ fontSize: 8, color: "#7d8699", marginTop: 2 }}>Record video</span>
                  </div>
                </button>
                <button
                  onClick={() => setCameraAction("photo")}
                  style={{
                    flex: 1,
                    border: "none",
                    borderRadius: 12,
                    padding: "14px 10px",
                    backgroundColor: "#eef2fb",
                    cursor: "pointer",
                  }}
                >
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center" style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: "#3a3f55", marginBottom: 6 }}>
                      <Camera size={20} color="#fff" />
                    </div>
                    <span style={{ fontSize: 10, color: "#394460", fontWeight: 700 }}>Photo</span>
                    <span style={{ fontSize: 8, color: "#7d8699", marginTop: 2 }}>Take picture</span>
                  </div>
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center" style={{ gap: 12, marginBottom: 10 }}>
                <button
                  onClick={() => void startLiveCapture(cameraAction, "user")}
                  style={{
                    flex: 1,
                    border: "none",
                    borderRadius: 12,
                    padding: "14px 10px",
                    backgroundColor: "#eef2fb",
                    cursor: "pointer",
                  }}
                >
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center" style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: "#3a3f55", marginBottom: 6 }}>
                      {cameraAction === "video" ? <Video size={20} color="#fff" /> : <Camera size={20} color="#fff" />}
                    </div>
                    <span style={{ fontSize: 10, color: "#394460", fontWeight: 700 }}>Front Camera</span>
                  </div>
                </button>
                <button
                  onClick={() => void startLiveCapture(cameraAction, "environment")}
                  style={{
                    flex: 1,
                    border: "none",
                    borderRadius: 12,
                    padding: "14px 10px",
                    backgroundColor: "#eef2fb",
                    cursor: "pointer",
                  }}
                >
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center" style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: "#3a3f55", marginBottom: 6 }}>
                      {cameraAction === "video" ? <Video size={20} color="#fff" /> : <Camera size={20} color="#fff" />}
                    </div>
                    <span style={{ fontSize: 10, color: "#394460", fontWeight: 700 }}>Back Camera</span>
                  </div>
                </button>
              </div>
            )}
            <button
              onClick={() => {
                if (cameraAction) setCameraAction(null);
                else setShowCameraChooser(false);
              }}
              style={{
                width: "100%",
                border: "none",
                background: "none",
                color: "#687287",
                fontSize: 10,
                fontWeight: 600,
                cursor: "pointer",
                padding: "4px 0 0",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {liveMode && (
        <LiveCaptureOverlay
          mode={liveMode}
          facingMode={liveFacingMode}
          stream={liveStream}
          onClose={closeLiveCapture}
          onSwitchFacing={() => void switchFacing()}
          onTakePhoto={takePhotoFromVideo}
          onToggleRecording={toggleRecording}
          isRecording={isRecording}
        />
      )}

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
          <EditorOverlay
            mode={editorMode}
            mediaUrl={selectedMediaUrl}
            mediaType={selectedMediaType}
            onClose={() => { setEditorMode(null); setSelectedMediaUrl(null); }}
          />
        ) : null
      }
    />
  );
}
