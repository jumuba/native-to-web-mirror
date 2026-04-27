import React, { useState, useRef, useEffect } from "react";
import {
  ChevronLeft, ChevronRight, Share2, Download, Music, MessageSquare,
  Smile, Mic, Heart, ImageIcon, Plus, Users, Lock,
  Edit3, Trash2, MoreVertical, MicOff, Camera, Video, Mail,
  DollarSign, Ticket, X, Play,
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
  type: "photo" | "note" | "emoji" | "gif" | "voice" | "music" | "video" | "greeting" | "money" | "voucher";
  content: string;
  id: string;
  label?: string;
};

type Spread = { left: PageItem[]; right: PageItem[] };
type ShareTarget = "album";
type ShareVisibility = "private" | "public";
type ShareChannel = "whatsapp" | "email" | "facebook" | "copy";

const EMOJI_LIST = ["❤️", "😍", "🎉", "🥳", "🎂", "🌟", "💐", "🎶", "😂", "🥰", "👏", "🙌", "💕", "✨", "🎁", "🌺", "😊", "🤗", "💖", "🔥", "👶", "💒", "🎵", "🌈"];

const GIF_LIST = [
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdWd6MmVwbTl5ZnFzNXNhN2h4bHlhNXA2OGN5MGtzZXR6enoyeWN1aCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/l0HlBO7eyXzSZkJri/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcm5kNGF3d2FvMWR1aGdtOGE3YWFnZ2dtbjBwcTgwa3RzM2xhNnhjdyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3oEjI6SIIHBdRxXI40/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHB6bTVxOXF4NWRiMHVtYjl2M3VldGV6NXN6N2M0cHRzNnhtZ3p0YiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/l4FGuhL4U2WSOlhfi/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZWgxMWsxcWxsMHk5NXlpcTN2bHpuMmVtYnlqdjFuaHFkbGVscng1eCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/xT9IgG50Fb7Mi0prBC/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZWV6cnB3MXkzMWR4Y3E1NjIwY2NiY2VhYjl5cXpuY2VnZnJ0NjVyZSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/26BRv0ThflsHCqDrG/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaWI3dXdzaHhjYnplOXBtNndwcjlqZjV5OXU2cG9lOHNtdzFjdHRkZCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/l0MYt5jPR6QX5pnqM/giphy.gif",
];

// Marriage demo spreads matching reference images
const MARRIAGE_DEMO_SPREADS: Spread[] = [
  // Spread 1: Note page
  {
    left: [{ type: "note", content: "Happy Marriage to David & Ariane 💒✨\n\nWishing you a lifetime of love and happiness together!", id: "demo-note-1" }],
    right: [{ type: "photo", content: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop", id: "demo-p0" }],
  },
  // Spread 2: 4 photos (2 left, 2 right)
  {
    left: [
      { type: "photo", content: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop", id: "demo-p1" },
      { type: "photo", content: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400&h=300&fit=crop", id: "demo-p2" },
    ],
    right: [
      { type: "photo", content: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=300&fit=crop", id: "demo-p3" },
      { type: "photo", content: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400&h=300&fit=crop", id: "demo-p4" },
    ],
  },
  // Spread 3: GIF left + flowers/gift right
  {
    left: [{ type: "gif", content: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdWd6MmVwbTl5ZnFzNXNhN2h4bHlhNXA2OGN5MGtzZXR6enoyeWN1aCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/l0HlBO7eyXzSZkJri/giphy.gif", id: "demo-gif-1", label: "🎉 Happy Marriage!" }],
    right: [{ type: "photo", content: "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=400&h=500&fit=crop", id: "demo-flowers" }],
  },
  // Spread 4: 2 photos left + video & photo right
  {
    left: [
      { type: "photo", content: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&h=300&fit=crop", id: "demo-p5" },
      { type: "photo", content: "https://images.unsplash.com/photo-1529636798458-92182e662485?w=400&h=300&fit=crop", id: "demo-p6" },
    ],
    right: [
      { type: "video", content: "https://www.w3schools.com/html/mov_bbb.mp4", id: "demo-video-1", label: "🎬 click to watch this video" },
      { type: "photo", content: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop", id: "demo-p7" },
    ],
  },
  // Spread 5: Music + Voucher
  {
    left: [
      { type: "music", content: "A Thousand Years – Christina Perri", id: "demo-music-1", label: "🎵 Click to listen to the music" },
    ],
    right: [
      { type: "voucher", content: "🎟️ Gift Voucher — €200 Spa Weekend for the newlyweds!", id: "demo-voucher-1" },
    ],
  },
];

function buildPages(photos: { id: string; url: string; title: string }[], items: PageItem[]): PageItem[] {
  return [
    ...photos.map((p) => ({ type: "photo" as const, content: p.url, id: p.id })),
    ...items,
  ];
}



export default function AlbumDetail({ album, onBack, onDelete, onRename, onImportPhotos, onChangeCover, onUpdateAlbum }: AlbumDetailProps) {
  const { folders, albums } = useAppState();
  const [liked, setLiked] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [title, setTitle] = useState(album.title);
  const [showMenu, setShowMenu] = useState(false);
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [shareTarget, setShareTarget] = useState<ShareTarget>("album");
  const [selectedShareChannel, setSelectedShareChannel] = useState<ShareChannel | null>(null);
  const [showCoverPicker, setShowCoverPicker] = useState(false);
  const [coverPickerSource, setCoverPickerSource] = useState<"main" | "folders" | "albums">("main");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [currentSpread, setCurrentSpread] = useState(0);
  const [flipDirection, setFlipDirection] = useState<"next" | "prev">("next");
  const [turningPage, setTurningPage] = useState<{ direction: "next" | "prev"; item: PageItem | null } | null>(null);
  const [noteText, setNoteText] = useState("");
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [showMusicInput, setShowMusicInput] = useState(false);
  const [musicUrl, setMusicUrl] = useState("");
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [viewingScrapbook, setViewingScrapbook] = useState(false);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [viewport, setViewport] = useState(() => ({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  }));

  const [extraItems, setExtraItems] = useState<PageItem[]>(() => {
    const items: PageItem[] = [];
    album.notes.forEach((n) => items.push({ type: "note", content: n.text, id: n.id }));
    if (album.music) items.push({ type: "music", content: album.music, id: "music-default" });
    return items;
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingIntervalRef = useRef<number | null>(null);

  const photos = album.photos;
  const pages = buildPages(photos, extraItems);
  const totalPages = pages.length;
  const currentPageItem = pages[currentSpread] || null;
  const isPhone = viewport.width < 900;
  const isPhoneLandscape = isPhone && viewport.width > viewport.height;

  useEffect(() => { setTitle(album.title); }, [album.title]);
  useEffect(() => { return () => { if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current); }; }, []);
  useEffect(() => { if (currentSpread >= totalPages && totalPages > 0) setCurrentSpread(totalPages - 1); }, [totalPages, currentSpread]);
  useEffect(() => {
    const handleResize = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const goNext = () => {
    if (currentSpread < totalPages - 1 && !turningPage) {
      setFlipDirection("next");
      setTurningPage({ direction: "next", item: currentPageItem });
      window.setTimeout(() => {
        setCurrentSpread((prev) => Math.min(prev + 1, totalPages - 1));
      }, 260);
      window.setTimeout(() => {
        setTurningPage(null);
      }, 860);
    }
  };
  const goPrev = () => {
    if (currentSpread > 0 && !turningPage) {
      setFlipDirection("prev");
      setTurningPage({ direction: "prev", item: currentPageItem });
      window.setTimeout(() => {
        setCurrentSpread((prev) => Math.max(prev - 1, 0));
      }, 260);
      window.setTimeout(() => {
        setTurningPage(null);
      }, 860);
    }
  };

  const handleRenameConfirm = () => {
    setRenaming(false);
    if (title.trim() && title !== album.title) { onRename?.(title.trim()); toast.success(`Renamed to "${title.trim()}"`); }
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
    setNoteText(""); setShowNoteInput(false); toast.success("Note added!");
  };
  const handleAddEmoji = (emoji: string) => {
    setExtraItems((prev) => [...prev, { type: "emoji", content: emoji, id: `emoji-${Date.now()}` }]);
    setShowEmojiPicker(false); toast.success("Emoji added!");
  };
  const handleAddGif = (url: string) => {
    setExtraItems((prev) => [...prev, { type: "gif", content: url, id: `gif-${Date.now()}` }]);
    setShowGifPicker(false); toast.success("GIF added!");
  };
  const handleAddMusic = () => {
    if (!musicUrl.trim()) return;
    setExtraItems((prev) => [...prev, { type: "music", content: musicUrl, id: `music-${Date.now()}` }]);
    setMusicUrl(""); setShowMusicInput(false); toast.success("Music added!");
  };
  const handleAddVideo = () => videoInputRef.current?.click();
  const handleVideoSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setExtraItems((prev) => [...prev, { type: "video", content: url, id: `video-${Date.now()}` }]);
    toast.success("Video added!"); e.target.value = "";
  };
  const handleAddGreetingCard = () => {
    setExtraItems((prev) => [...prev, { type: "greeting", content: "🎉 Happy Celebration!", id: `greeting-${Date.now()}` }]);
    toast.success("Greeting card added!");
  };
  const handleDeletePhoto = (photoId: string) => {
    const nextPhotos = photos.filter((photo) => photo.id !== photoId);
    onUpdateAlbum?.({
      photos: nextPhotos,
      photoCount: nextPhotos.length,
    });
    toast.success("Photo deleted from album");
  };
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        setExtraItems((prev) => [...prev, { type: "voice", content: `🎤 Voice (${recordingTime}s)`, id: `voice-${Date.now()}` }]);
        toast.success("Voice message added!"); setRecordingTime(0);
      };
      recorder.start(); mediaRecorderRef.current = recorder; setIsRecording(true); setRecordingTime(0);
      recordingIntervalRef.current = window.setInterval(() => setRecordingTime((t) => t + 1), 1000);
    } catch { toast.error("Microphone access denied"); }
  };
  const stopRecording = () => {
    mediaRecorderRef.current?.stop(); setIsRecording(false);
    if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
  };
  const buildSharePayload = (target: ShareTarget, visibility: ShareVisibility) => {
    const shareTitle = `Album: ${title}`;
    const shareText = visibility === "private"
      ? `Private share: album "${title}" from SmartMemory App.`
      : `Public share: album "${title}" from SmartMemory App.`;
    const params = new URLSearchParams({
      shareType: target,
      visibility,
      albumId: album.id,
    });
    const shareUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;

    return { shareTitle, shareText, shareUrl };
  };

  const handleShare = async (channel: ShareChannel, visibility: ShareVisibility) => {
    const { shareTitle, shareText, shareUrl } = buildSharePayload(shareTarget, visibility);

    if (channel === "copy") {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied!");
      setShowShareSheet(false);
      setSelectedShareChannel(null);
      return;
    }

    const encodedText = encodeURIComponent(`${shareText} ${shareUrl}`);
    const encodedTitle = encodeURIComponent(shareTitle);
    const encodedBody = encodeURIComponent(`${shareText}\n\n${shareUrl}`);

    const channelUrls: Record<Exclude<ShareChannel, "native" | "copy">, string> = {
      whatsapp: `https://wa.me/?text=${encodedText}`,
      email: `mailto:?subject=${encodedTitle}&body=${encodedBody}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    };

    window.open(channelUrls[channel], "_blank", "noopener,noreferrer");
    toast.success("Share window opened");
    setShowShareSheet(false);
    setSelectedShareChannel(null);
  };

  const getChannelLabel = (channel: ShareChannel | null) => {
    if (channel === "whatsapp") return "WhatsApp";
    if (channel === "email") return "Email";
    if (channel === "facebook") return "Facebook";
    if (channel === "copy") return "Copy Link";
    return "";
  };

  // Resizable photo item component
  const ResizablePhoto = ({ item, h }: { item: PageItem; h: string }) => {
    return (
      <div key={item.id} style={{ width: "100%", height: h, borderRadius: 0, overflow: "hidden", position: "relative" }}>
        <img src={item.content} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      </div>
    );
  };

  // Render a single item inside the book spread
  const renderSpreadItem = (item: PageItem, itemCount: number, onVideoClick: (url: string) => void) => {
    const h = itemCount === 1 ? "100%" : "48%";
    switch (item.type) {
      case "photo":
        return <ResizablePhoto key={item.id} item={item} h={h} />;
      case "note":
        return (
          <div key={item.id} style={{
            width: "100%", height: h, borderRadius: isPhoneLandscape ? 0 : 6, overflow: "hidden",
            backgroundColor: "#fffdf0", border: "3px solid #1a2744",
            display: "flex", alignItems: "center", justifyContent: "center", padding: 12,
            backgroundImage: "repeating-linear-gradient(transparent, transparent 22px, #e8dfc0 22px, #e8dfc0 23px)",
          }}>
            <p style={{ fontSize: 13, color: "#5a4e1a", margin: 0, fontStyle: "italic", textAlign: "center", lineHeight: 1.6, fontWeight: 600, whiteSpace: "pre-line" }}>
              📝 {item.content}
            </p>
          </div>
        );
      case "video":
        return (
          <div key={item.id} onClick={() => onVideoClick(item.content)} style={{
            width: "100%", height: h, borderRadius: 4, overflow: "hidden",
            border: "2px solid #e74c3c", cursor: "pointer", position: "relative",
            backgroundColor: "#000",
          }}>
            {item.label && (
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 2, padding: "4px 8px", backgroundColor: "rgba(231,76,60,0.9)" }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: "#fff" }}>{item.label}</span>
              </div>
            )}
            <video src={item.content} style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
            <div style={{
              position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
              width: 40, height: 40, borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.85)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Play size={20} color="#e74c3c" fill="#e74c3c" />
            </div>
          </div>
        );
      case "gif":
        return (
          <div key={item.id} style={{ width: "100%", height: h, borderRadius: 4, overflow: "hidden", border: "3px solid #1a2744", position: "relative" }}>
            {item.label && <div style={{ position: "absolute", bottom: 6, left: 0, right: 0, textAlign: "center", zIndex: 2 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#fff", textShadow: "0 1px 4px rgba(0,0,0,0.7)", backgroundColor: "rgba(0,0,0,0.4)", padding: "2px 8px", borderRadius: 4 }}>{item.label}</span>
            </div>}
            <img src={item.content} alt="GIF" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
        );
      case "music":
        return (
          <div key={item.id} style={{
            width: "100%", height: h, borderRadius: isPhoneLandscape ? 0 : 6, overflow: "hidden",
            backgroundColor: "#f0eeff", border: "3px solid #1a2744",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 12,
          }}>
            <span style={{ fontSize: 36 }}>🎵</span>
            <p style={{ fontSize: 11, color: "#5b4fa0", margin: "8px 0 0", fontWeight: 700, textAlign: "center" }}>{item.label || item.content}</p>
            <p style={{ fontSize: 9, color: "#8b7fd0", margin: "4px 0 0" }}>Tap to play</p>
          </div>
        );
      case "voucher":
        return (
          <div key={item.id} style={{
            width: "100%", height: h, borderRadius: isPhoneLandscape ? 0 : 6, overflow: "hidden",
            backgroundColor: "#fefce8", border: "3px dashed #fbbf24",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 12,
          }}>
            <span style={{ fontSize: 30 }}>🎟️</span>
            <p style={{ fontSize: 11, color: "#854d0e", margin: "6px 0 0", fontWeight: 700, textAlign: "center" }}>{item.content}</p>
          </div>
        );
      case "emoji":
        return (
          <div key={item.id} style={{ width: "100%", height: h, display: "flex", alignItems: "center", justifyContent: "center", border: "3px solid #1a2744", borderRadius: 4 }}>
            <span style={{ fontSize: 48 }}>{item.content}</span>
          </div>
        );
      case "greeting":
        return (
          <div key={item.id} style={{
            width: "100%", height: h, borderRadius: isPhoneLandscape ? 0 : 6, backgroundColor: "#fff0f6",
            border: "3px solid #f9a8d4", display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", padding: 12,
          }}>
            <span style={{ fontSize: 30 }}>💌</span>
            <p style={{ fontSize: 11, color: "#9d174d", margin: "6px 0 0", fontWeight: 600, textAlign: "center" }}>{item.content}</p>
          </div>
        );
      case "money":
        return (
          <div key={item.id} style={{
            width: "100%", height: h, borderRadius: isPhoneLandscape ? 0 : 6, backgroundColor: "#f0fdf4",
            border: "3px solid #86efac", display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", padding: 12,
          }}>
            <span style={{ fontSize: 30 }}>💰</span>
            <p style={{ fontSize: 11, color: "#166534", margin: "6px 0 0", fontWeight: 600, textAlign: "center" }}>{item.content}</p>
          </div>
        );
      case "voice":
        return (
          <div key={item.id} style={{
            width: "100%", height: h, borderRadius: 6, backgroundColor: "#eef2fb",
            border: "3px solid #1a2744", display: "flex", alignItems: "center", justifyContent: "center", padding: 12,
          }}>
            <p style={{ fontSize: 11, color: "#394460", margin: 0 }}>{item.content}</p>
          </div>
        );
      default:
        return null;
    }
  };

  // Fullscreen album viewer with one photo per page and wave-like page turning
  const renderScrapbookOverlay = () => {
    if (!viewingScrapbook || !currentPageItem) return null;

    const pageWidth = isPhone ? Math.max(viewport.width - 18, 320) : Math.min(viewport.width - 120, 900);
    const pageHeight = isPhone ? Math.max(viewport.height - 150, 470) : Math.min(viewport.height - 120, 760);

    const renderAlbumPage = (item: PageItem | null, accentSide: "left" | "right") => (
      <div style={{
        width: pageWidth,
        height: pageHeight,
        maxWidth: "100%",
        background: "linear-gradient(180deg, #fffefc 0%, #f6f0e7 100%)",
        borderRadius: isPhone ? 14 : 18,
        border: "1px solid rgba(201, 188, 170, 0.95)",
        boxShadow: "0 18px 40px rgba(76, 57, 36, 0.18), inset 0 0 0 1px rgba(255,255,255,0.75)",
        padding: isPhone ? 12 : 20,
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          [accentSide === "left" ? "left" : "right"]: 0,
          width: isPhone ? 16 : 22,
          background: accentSide === "left"
            ? "linear-gradient(90deg, rgba(115,92,65,0.18), rgba(255,255,255,0))"
            : "linear-gradient(270deg, rgba(115,92,65,0.18), rgba(255,255,255,0))",
          pointerEvents: "none",
        }} />
        <div style={{
          width: "100%",
          height: "100%",
          borderRadius: isPhone ? 12 : 14,
          overflow: "hidden",
          backgroundColor: "#ffffff",
          boxShadow: "inset 0 0 0 1px rgba(229, 231, 235, 0.92)",
        }}>
          {item
            ? renderSpreadItem(item, 1, (url) => setPlayingVideo(url))
            : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#b7aa98", fontStyle: "italic", fontSize: isPhone ? 13 : 15 }}>Blank page</div>}
        </div>
      </div>
    );

    return (
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999,
        background: "linear-gradient(180deg, #efe6d8 0%, #e2d1b7 100%)",
        display: "flex", flexDirection: "column",
      }}>
        <style>{`
          @keyframes waveFlipForward {
            0% { opacity: 1; transform: perspective(2400px) rotateY(0deg) translateY(0) rotateZ(0deg); border-radius: 18px; }
            25% { opacity: 1; transform: perspective(2400px) rotateY(-18deg) translateY(-12px) rotateZ(-1.2deg); border-radius: 30px 18px 26px 18px; }
            60% { opacity: 0.85; transform: perspective(2400px) rotateY(-72deg) translateY(-6px) rotateZ(-4deg); border-radius: 40px 16px 38px 16px; }
            100% { opacity: 0.05; transform: perspective(2400px) rotateY(-118deg) translateY(0) rotateZ(-6deg); border-radius: 46px 14px 44px 14px; }
          }
          @keyframes waveFlipBackward {
            0% { opacity: 1; transform: perspective(2400px) rotateY(0deg) translateY(0) rotateZ(0deg); border-radius: 18px; }
            25% { opacity: 1; transform: perspective(2400px) rotateY(18deg) translateY(-12px) rotateZ(1.2deg); border-radius: 18px 30px 18px 26px; }
            60% { opacity: 0.85; transform: perspective(2400px) rotateY(72deg) translateY(-6px) rotateZ(4deg); border-radius: 16px 40px 16px 38px; }
            100% { opacity: 0.05; transform: perspective(2400px) rotateY(118deg) translateY(0) rotateZ(6deg); border-radius: 14px 46px 14px 44px; }
          }
        `}</style>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: isPhone ? "8px 12px" : "10px 16px", backgroundColor: "rgba(90,77,61,0.34)" }}>
          <button onClick={() => setViewingScrapbook(false)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
            <X size={18} color="#fff" />
            <span style={{ fontSize: 12, color: "#fff", fontWeight: 600 }}>Close</span>
          </button>
          <span style={{ fontSize: 11, color: "#fff", fontWeight: 600 }}>
            {currentSpread + 1} / {totalPages}
          </span>
        </div>

        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: isPhone ? "10px 8px" : "24px 30px", overflow: "hidden", position: "relative" }}>
          {renderAlbumPage(currentPageItem, flipDirection === "next" ? "left" : "right")}

          {turningPage?.item && (
            <div style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 5,
              transformOrigin: turningPage.direction === "next" ? "left center" : "right center",
              animation: `${turningPage.direction === "next" ? "waveFlipForward" : "waveFlipBackward"} 820ms cubic-bezier(0.22, 0.7, 0.2, 1) forwards`,
              pointerEvents: "none",
            }}>
              {renderAlbumPage(turningPage.item, turningPage.direction === "next" ? "right" : "left")}
            </div>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: isPhone ? 14 : 20, padding: isPhone ? "4px 0 10px" : "8px 0 14px" }}>
          <button onClick={goPrev} disabled={currentSpread === 0 || !!turningPage} style={{
            width: isPhone ? 48 : 44, height: isPhone ? 48 : 44, borderRadius: "50%", border: "none", cursor: currentSpread === 0 || !!turningPage ? "default" : "pointer",
            backgroundColor: currentSpread === 0 || !!turningPage ? "rgba(255,255,255,0.28)" : "rgba(255,255,255,0.88)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
          }}>
            <ChevronLeft size={isPhone ? 24 : 22} color={currentSpread === 0 || !!turningPage ? "#999" : "#333"} />
          </button>
          <span style={{ fontSize: isPhone ? 15 : 13, fontWeight: 700, color: "#5a4e3a" }}>
            Page {currentSpread + 1} of {totalPages}
          </span>
          <button onClick={goNext} disabled={currentSpread >= totalPages - 1 || !!turningPage} style={{
            width: isPhone ? 48 : 44, height: isPhone ? 48 : 44, borderRadius: "50%", border: "none", cursor: currentSpread >= totalPages - 1 || !!turningPage ? "default" : "pointer",
            backgroundColor: currentSpread >= totalPages - 1 || !!turningPage ? "rgba(255,255,255,0.28)" : "rgba(255,255,255,0.88)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
          }}>
            <ChevronRight size={isPhone ? 24 : 22} color={currentSpread >= totalPages - 1 || !!turningPage ? "#999" : "#333"} />
          </button>
        </div>
      </div>
    );
  };

  // Fullscreen video player
  const renderVideoPlayer = () => {
    if (!playingVideo) return null;
    return (
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 10000,
        backgroundColor: "#000", display: "flex", flexDirection: "column",
      }}>
        <div style={{ padding: "8px 12px" }}>
          <button onClick={() => setPlayingVideo(null)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
            <X size={20} color="#fff" />
            <span style={{ fontSize: 13, color: "#fff", fontWeight: 600 }}>Close</span>
          </button>
        </div>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <video src={playingVideo} controls autoPlay style={{ width: "100%", height: "100%", maxHeight: "80vh", objectFit: "contain" }} />
        </div>
      </div>
    );
  };

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <input ref={fileInputRef} type="file" multiple accept="image/*,video/*" style={{ display: "none" }} onChange={handleFilesSelected} />
      <input ref={coverInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleCoverFromFile} />
      <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={handleCoverFromFile} />
      <input ref={videoInputRef} type="file" accept="video/*" style={{ display: "none" }} onChange={handleVideoSelected} />

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

      {/* Cover */}
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
        <div style={{ backgroundColor: "#fff", border: "1px solid #dde3f0", borderRadius: 8, padding: 6, marginBottom: 4, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", maxHeight: 200, overflowY: "auto" }}>
          {coverPickerSource === "main" && (
            <>
              <p style={{ fontSize: 8, fontWeight: 700, color: "#394460", marginBottom: 4 }}>Choose cover</p>
              <div className="flex flex-col" style={{ gap: 2 }}>
                <button onClick={() => coverInputRef.current?.click()} style={{ width: "100%", padding: "5px", borderRadius: 5, backgroundColor: "#8fa9dd", color: "#fff", fontSize: 8, fontWeight: 600, border: "none", cursor: "pointer" }}>📁 From device</button>
                <button onClick={() => cameraInputRef.current?.click()} style={{ width: "100%", padding: "5px", borderRadius: 5, backgroundColor: "#7b9ed4", color: "#fff", fontSize: 8, fontWeight: 600, border: "none", cursor: "pointer" }}>📷 From camera roll</button>
                <button onClick={() => setCoverPickerSource("folders")} style={{ width: "100%", padding: "5px", borderRadius: 5, backgroundColor: "#e8ecf4", color: "#394460", fontSize: 8, fontWeight: 600, border: "none", cursor: "pointer" }}>📂 From a folder</button>
                <button onClick={() => setCoverPickerSource("albums")} style={{ width: "100%", padding: "5px", borderRadius: 5, backgroundColor: "#e8ecf4", color: "#394460", fontSize: 8, fontWeight: 600, border: "none", cursor: "pointer" }}>📒 From an album</button>
              </div>
              {photos.length > 0 && (
                <>
                  <p style={{ fontSize: 7, color: "#a0a8b8", marginTop: 4, marginBottom: 2 }}>This album's photos</p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 2 }}>
                    {photos.slice(0, 10).map((p) => (
                      <div key={p.id} onClick={() => { onChangeCover?.(p.url); setShowCoverPicker(false); toast.success("Cover updated!"); }}
                        style={{ aspectRatio: "1", borderRadius: 3, overflow: "hidden", cursor: "pointer" }}>
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
              <div className="flex items-center" style={{ marginBottom: 4, gap: 3 }}>
                <button onClick={() => setCoverPickerSource("main")} style={{ background: "none", border: "none", cursor: "pointer" }}><ChevronLeft size={11} color="#394460" /></button>
                <p style={{ fontSize: 8, fontWeight: 700, color: "#394460", margin: 0 }}>Pick from a folder</p>
              </div>
              {folders.filter((f) => f.photos.length > 0).map((f) => (
                <div key={f.id} style={{ marginBottom: 4 }}>
                  <p style={{ fontSize: 7, fontWeight: 600, color: "#687287", marginBottom: 2 }}>📂 {f.title}</p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 2 }}>
                    {f.photos.slice(0, 5).map((p) => (
                      <div key={p.id} onClick={() => { onChangeCover?.(p.url); setShowCoverPicker(false); setCoverPickerSource("main"); toast.success("Cover updated!"); }}
                        style={{ aspectRatio: "1", borderRadius: 3, overflow: "hidden", cursor: "pointer" }}>
                        <img src={p.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {folders.filter((f) => f.photos.length > 0).length === 0 && <p style={{ fontSize: 7, color: "#a0a8b8", textAlign: "center", padding: "8px 0" }}>No folders with photos</p>}
            </>
          )}
          {coverPickerSource === "albums" && (
            <>
              <div className="flex items-center" style={{ marginBottom: 4, gap: 3 }}>
                <button onClick={() => setCoverPickerSource("main")} style={{ background: "none", border: "none", cursor: "pointer" }}><ChevronLeft size={11} color="#394460" /></button>
                <p style={{ fontSize: 8, fontWeight: 700, color: "#394460", margin: 0 }}>Pick from an album</p>
              </div>
              {albums.filter((a) => a.photos.length > 0).map((a) => (
                <div key={a.id} style={{ marginBottom: 4 }}>
                  <p style={{ fontSize: 7, fontWeight: 600, color: "#687287", marginBottom: 2 }}>📒 {a.title}</p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 2 }}>
                    {a.photos.slice(0, 5).map((p) => (
                      <div key={p.id} onClick={() => { onChangeCover?.(p.url); setShowCoverPicker(false); setCoverPickerSource("main"); toast.success("Cover updated!"); }}
                        style={{ aspectRatio: "1", borderRadius: 3, overflow: "hidden", cursor: "pointer" }}>
                        <img src={p.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {albums.filter((a) => a.photos.length > 0).length === 0 && <p style={{ fontSize: 7, color: "#a0a8b8", textAlign: "center", padding: "8px 0" }}>No albums with photos</p>}
            </>
          )}
          <button onClick={() => { setShowCoverPicker(false); setCoverPickerSource("main"); }} style={{ width: "100%", padding: "3px", fontSize: 7, color: "#687287", background: "none", border: "none", cursor: "pointer", marginTop: 3 }}>Cancel</button>
        </div>
      )}

      {/* Toolbar Row 1 */}
      <div className="flex items-center justify-between" style={{ marginBottom: 3, padding: "3px 0" }}>
        {[
          { icon: <ImageIcon size={11} color="#687287" />, label: "Photo", action: handleAddPhotos },
          { icon: <MessageSquare size={11} color="#687287" />, label: "Note", action: () => setShowNoteInput(!showNoteInput) },
          { icon: <Music size={11} color="#687287" />, label: "Music", action: () => setShowMusicInput(!showMusicInput) },
          { icon: <Video size={11} color="#687287" />, label: "Video", action: handleAddVideo },
          { icon: <span style={{ fontSize: 12 }}>🎞️</span>, label: "GIF", action: () => setShowGifPicker(!showGifPicker) },
        ].map((btn) => (
          <button key={btn.label} onClick={btn.action} className="flex flex-col items-center" style={{ background: "none", border: "none", cursor: "pointer", padding: "2px 2px", borderRadius: 4, flex: 1 }}>
            {btn.icon}
            <span style={{ fontSize: 6, color: "#687287", marginTop: 1 }}>{btn.label}</span>
          </button>
        ))}
      </div>

      {/* Toolbar Row 2 */}
      <div className="flex items-center justify-between" style={{ marginBottom: 4, padding: "3px 0" }}>
        {[
          { icon: <Smile size={11} color="#687287" />, label: "Emoji", action: () => setShowEmojiPicker(!showEmojiPicker) },
          { icon: isRecording ? <MicOff size={11} color="#ef4444" /> : <Mic size={11} color="#687287" />, label: isRecording ? `${recordingTime}s` : "Voice", action: isRecording ? stopRecording : startRecording },
          { icon: <Mail size={11} color="#687287" />, label: "Card", action: handleAddGreetingCard },
          { icon: <DollarSign size={11} color="#687287" />, label: "Money", action: () => { setExtraItems((prev) => [...prev, { type: "money", content: "💰 Money Gift", id: `money-${Date.now()}` }]); toast.success("Money gift added!"); } },
          { icon: <Ticket size={11} color="#687287" />, label: "Voucher", action: () => { setExtraItems((prev) => [...prev, { type: "voucher", content: "🎟️ Gift Voucher", id: `voucher-${Date.now()}` }]); toast.success("Voucher added!"); } },
        ].map((btn) => (
          <button key={btn.label} onClick={btn.action} className="flex flex-col items-center" style={{ background: "none", border: "none", cursor: "pointer", padding: "2px 2px", borderRadius: 4, flex: 1 }}>
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
        <div style={{ backgroundColor: "#fff", border: "1px solid #dde3f0", borderRadius: 8, padding: 4, marginBottom: 4, display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 1, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
          {EMOJI_LIST.map((emoji) => (
            <button key={emoji} onClick={() => handleAddEmoji(emoji)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, padding: 1, borderRadius: 3 }}>{emoji}</button>
          ))}
        </div>
      )}

      {/* GIF picker */}
      {showGifPicker && (
        <div style={{ backgroundColor: "#fff", border: "1px solid #dde3f0", borderRadius: 8, padding: 4, marginBottom: 4, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
          {GIF_LIST.map((gif, i) => (
            <div key={i} onClick={() => handleAddGif(gif)} style={{ borderRadius: 4, overflow: "hidden", cursor: "pointer", aspectRatio: "1" }}>
              <img src={gif} alt="GIF" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          ))}
        </div>
      )}

      {/* Album cover preview */}
      <div onClick={() => { setCurrentSpread(0); setViewingScrapbook(true); }} style={{
        width: "100%", borderRadius: 8, overflow: "hidden", cursor: "pointer",
        border: "2px solid #d4c9b0", boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}>
        <img src={album.image} alt={title} style={{ width: "100%", height: "auto", display: "block", objectFit: "cover" }} />
      </div>

      {photos.length > 0 && (
        <div style={{
          marginTop: 6,
          backgroundColor: "rgba(255,255,255,0.92)",
          border: "1px solid #dde3f0",
          borderRadius: 8,
          padding: 6,
        }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 5 }}>
            <span style={{ fontSize: 8, fontWeight: 700, color: "#394460" }}>Album Photos</span>
            <span style={{ fontSize: 7, color: "#7b869c" }}>Delete the photos you want</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 5 }}>
            {photos.map((photo) => (
              <div key={photo.id} style={{ position: "relative", borderRadius: isPhoneLandscape ? 0 : 6, overflow: "hidden", aspectRatio: "1 / 1", backgroundColor: "#eef2f8" }}>
                <img src={photo.url} alt={photo.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                <button
                  onClick={() => handleDeletePhoto(photo.id)}
                  style={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    border: "none",
                    backgroundColor: "rgba(17,24,39,0.72)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <Trash2 size={9} color="#fff" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fullscreen scrapbook overlay */}
      {renderScrapbookOverlay()}

      {/* Fullscreen video player */}
      {renderVideoPlayer()}

      {/* Share sheet */}
      {showShareSheet && (
        <div className="absolute inset-0 flex flex-col justify-end" style={{ zIndex: 20, borderRadius: 38, overflow: "hidden" }}>
          <div className="absolute inset-0" style={{ backgroundColor: "rgba(0,0,0,0.4)" }} onClick={() => { setShowShareSheet(false); setSelectedShareChannel(null); }} />
          <div style={{ position: "relative", backgroundColor: "#fff", borderRadius: "12px 12px 0 0", padding: "10px 12px 16px" }}>
            <div className="flex items-center" style={{ marginBottom: 6, gap: 6 }}>
              <button onClick={() => { setShowShareSheet(false); setSelectedShareChannel(null); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}>
                <ChevronLeft size={14} color="#394460" />
              </button>
              <p style={{ fontSize: 10, fontWeight: 700, color: "#394460", margin: 0 }}>Share</p>
            </div>
            <div className="flex flex-col" style={{ gap: 4 }}>
              <button onClick={() => setShareTarget("album")} style={{ width: "100%", padding: "7px", borderRadius: isPhoneLandscape ? 0 : 6, backgroundColor: "#d9e4f7", color: "#394460", fontSize: 9, fontWeight: 600, border: "none", cursor: "pointer", textAlign: "left" }}>📒 Share Album "{title}"</button>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
                <button onClick={() => setSelectedShareChannel("whatsapp")} style={{ width: "100%", padding: "7px", borderRadius: isPhoneLandscape ? 0 : 6, backgroundColor: "#25D366", color: "#fff", fontSize: 9, fontWeight: 600, border: "none", cursor: "pointer" }}>WhatsApp</button>
                <button onClick={() => setSelectedShareChannel("email")} style={{ width: "100%", padding: "7px", borderRadius: isPhoneLandscape ? 0 : 6, backgroundColor: "#e8ecf4", color: "#394460", fontSize: 9, fontWeight: 600, border: "none", cursor: "pointer" }}>Email</button>
                <button onClick={() => setSelectedShareChannel("facebook")} style={{ width: "100%", padding: "7px", borderRadius: isPhoneLandscape ? 0 : 6, backgroundColor: "#1877F2", color: "#fff", fontSize: 9, fontWeight: 600, border: "none", cursor: "pointer" }}>Facebook</button>
                <button onClick={() => setSelectedShareChannel("copy")} style={{ width: "100%", padding: "7px", borderRadius: isPhoneLandscape ? 0 : 6, backgroundColor: "#dfe6f2", color: "#394460", fontSize: 9, fontWeight: 600, border: "none", cursor: "pointer" }}>Copy Link</button>
              </div>
              {selectedShareChannel && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
                  <button onClick={() => handleShare(selectedShareChannel, "private")} style={{ width: "100%", padding: "7px", borderRadius: isPhoneLandscape ? 0 : 6, backgroundColor: "#e8ecf4", color: "#394460", fontSize: 9, fontWeight: 700, border: "none", cursor: "pointer" }}>🔒 {getChannelLabel(selectedShareChannel)} Private</button>
                  <button onClick={() => handleShare(selectedShareChannel, "public")} style={{ width: "100%", padding: "7px", borderRadius: isPhoneLandscape ? 0 : 6, backgroundColor: "#d9e4f7", color: "#394460", fontSize: 9, fontWeight: 700, border: "none", cursor: "pointer" }}>🌍 {getChannelLabel(selectedShareChannel)} Public</button>
                </div>
              )}
              <button onClick={() => { setShowShareSheet(false); setSelectedShareChannel(null); }} style={{ width: "100%", padding: "5px", fontSize: 8, color: "#687287", background: "none", border: "none", cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}












