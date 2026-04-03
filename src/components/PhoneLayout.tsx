import React from "react";
import type { ReactNode } from "react";
import {
  Home, ImageIcon, Bell, User, Gift, ShieldCheck, HelpCircle, Calendar,
  ChevronDown, Search, Mic, PlayCircle, Signal, Wifi, BatteryFull,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppState } from "@/lib/AppStateContext";

import bgSkyFloral from "@/assets/bg-sky-floral.png";
import avatar from "@/assets/avatar.png";

import CreateImportSheet from "@/components/CreateImportSheet";
import DashboardContent from "@/components/screens/DashboardContent";
import RemindersContent from "@/components/screens/RemindersContent";
import ProfileContent from "@/components/screens/ProfileContent";
import OffersContent from "@/components/screens/OffersContent";
import PrivacyContent from "@/components/screens/PrivacyContent";
import HelpContent from "@/components/screens/HelpContent";

interface PhoneLayoutProps {
  cards: { id: string; title: string; image: string }[];
  customContent?: React.ReactNode;
  overlay?: React.ReactNode;
}

type SidebarScreen = null | "dashboard" | "reminders" | "profile" | "offers" | "privacy" | "help" | "how-it-works";

function SideItem({ label, icon, active, singleLine, onClick }: {
  label: string; icon: ReactNode; active?: boolean; singleLine?: boolean; onClick?: () => void;
}) {
  return (
    <div
      className="flex items-center px-1 mb-[3px] rounded-[5px]"
      style={{ minHeight: 29, backgroundColor: active ? "#8da9dd" : "transparent", cursor: onClick ? "pointer" : "default" }}
      onClick={onClick}
    >
      <div className="flex items-center justify-center mr-[5px]" style={{ width: 16 }}>{icon}</div>
      <span className="flex-1 font-bold" style={{
        fontSize: 9.8, color: active ? "#ffffff" : "#687287", lineHeight: "11.8px",
        overflow: "hidden", display: "-webkit-box", WebkitLineClamp: singleLine ? 1 : 2, WebkitBoxOrient: "vertical",
      }}>{label}</span>
    </div>
  );
}

export default function PhoneLayout({ cards, customContent, overlay }: PhoneLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { createFolder, createAlbum } = useAppState();
  const [showCreateImport, setShowCreateImport] = React.useState(false);
  const [sidebarScreen, setSidebarScreen] = React.useState<SidebarScreen>(null);

  const currentPath = location.pathname;

  const sidebarItems = [
    { id: "photo-folders", label: "Photo Folders", icon: <ImageIcon size={13} />, path: "/", screen: null as SidebarScreen },
    { id: "photo-albums", label: "Photo Albums", icon: <ImageIcon size={13} />, path: "/photo-albums", screen: null as SidebarScreen },
    { id: "photo-video-edit", label: "Photo Video Edit", icon: <PlayCircle size={13} />, path: "/photo-video-edit", screen: null as SidebarScreen },
    { id: "dashboard", label: "Dashboard", icon: <Home size={13} />, path: undefined, screen: "dashboard" as SidebarScreen },
    { id: "reminders", label: "Reminders", icon: <Bell size={13} />, path: undefined, screen: "reminders" as SidebarScreen },
    { id: "profile", label: "My Profile", icon: <User size={13} />, path: undefined, screen: "profile" as SidebarScreen },
    { id: "offers", label: "Offers", icon: <Gift size={13} />, path: undefined, screen: "offers" as SidebarScreen },
    { id: "privacy", label: "Privacy & Security", icon: <ShieldCheck size={13} />, path: undefined, singleLine: true, screen: "privacy" as SidebarScreen },
    { id: "support", label: "Help & Support", icon: <HelpCircle size={13} />, path: undefined, singleLine: true, screen: "help" as SidebarScreen },
  ];

  const getIsActive = (id: string) => {
    if (sidebarScreen) {
      if (id === "dashboard") return sidebarScreen === "dashboard";
      if (id === "reminders") return sidebarScreen === "reminders";
      if (id === "profile") return sidebarScreen === "profile";
      if (id === "offers") return sidebarScreen === "offers";
      if (id === "privacy") return sidebarScreen === "privacy";
      if (id === "support") return sidebarScreen === "help";
      return false;
    }
    if (id === "photo-folders") return currentPath === "/";
    if (id === "photo-albums") return currentPath === "/photo-albums";
    if (id === "photo-video-edit") return currentPath === "/photo-video-edit";
    return false;
  };

  const getIconColor = (id: string) => getIsActive(id) ? "#ffffff" : "#7d8699";

  const handleSidebarClick = (item: typeof sidebarItems[0]) => {
    if (item.path !== undefined) { setSidebarScreen(null); navigate(item.path); }
    else if (item.screen) { setSidebarScreen(item.screen); }
  };

  const getSidebarScreenContent = (): React.ReactNode => {
    switch (sidebarScreen) {
      case "dashboard": return <DashboardContent />;
      case "reminders": return <RemindersContent />;
      case "profile": return <ProfileContent />;
      case "offers": return <OffersContent />;
      case "privacy": return <PrivacyContent />;
      case "help": return <HelpContent />;
      case "how-it-works":
        return (
          <div className="flex flex-col items-center" style={{ padding: "30px 0" }}>
            <PlayCircle size={32} color="#8fa9dd" style={{ marginBottom: 8 }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: "#394460" }}>How It Works</span>
            <span style={{ fontSize: 9, color: "#a0a8b8", marginTop: 4, textAlign: "center" }}>
              Watch tutorials on creating folders, albums, and sharing memories.
            </span>
          </div>
        );
      default: return null;
    }
  };

  const activeContent = sidebarScreen ? getSidebarScreenContent() : customContent;

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#ffffff" }}>
      <div style={{
        width: 405, minHeight: 750, backgroundColor: "#1a1a1a", borderRadius: 50,
        padding: "12px 12px", boxShadow: "0 20px 60px rgba(0,0,0,0.3), inset 0 0 0 2px #333",
        position: "relative", border: "3px solid #2a2a2a",
      }}>
        <div style={{
          width: 120, height: 28, backgroundColor: "#1a1a1a", borderRadius: 20,
          position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)", zIndex: 10,
        }} />

        <div style={{
          width: "100%", minHeight: 720, paddingTop: 14, paddingLeft: 4, paddingRight: 4, paddingBottom: 10,
          backgroundImage: `url(${bgSkyFloral})`, backgroundSize: "cover", backgroundPosition: "center",
          borderRadius: 38, overflow: "hidden", margin: "0 auto", position: "relative",
        }}>
          {/* Status Bar */}
          <div className="flex items-center justify-between" style={{ height: 24, paddingLeft: 20, paddingRight: 20, marginBottom: 18 }}>
            <span style={{ fontSize: 15, color: "#111111", fontWeight: 600, letterSpacing: -0.2 }}>9:41</span>
            <div className="flex items-center">
              <Signal size={16} color="#111111" className="mr-1" />
              <Wifi size={15} color="#111111" className="mr-1" />
              <BatteryFull size={18} color="#111111" />
            </div>
          </div>

          {/* Header */}
          <div className="text-center" style={{ marginBottom: 20 }}>
            <h1 style={{ fontSize: 24, color: "#5665c9", fontWeight: 400, letterSpacing: 0, margin: 0 }}>SmartMemory</h1>
          </div>

          {/* Content Section */}
          <div style={{ marginTop: 50 }}>
            {/* Upcoming Bar */}
            <div className="flex items-center" style={{
              height: 27, borderRadius: 6, backgroundColor: "rgba(255,255,255,0.72)",
              border: "1px solid rgba(214,223,241,0.95)", paddingLeft: 9, paddingRight: 9, marginBottom: 8,
            }}>
              <div className="flex items-center justify-center" style={{ width: 15, height: 15, borderRadius: 3, backgroundColor: "#e6ebf7", marginRight: 7 }}>
                <Calendar size={9} color="#7f89a2" />
              </div>
              <span className="flex-1" style={{ fontSize: 10.6, color: "#6a7184", fontWeight: 500 }}>
                Next upcoming event: Julie&apos;s wedding in 3 days
              </span>
              <button className="flex items-center justify-center" style={{
                width: 16, height: 16, borderRadius: 8, backgroundColor: "#9bb4e7",
                marginLeft: 4, border: "none", padding: 0, cursor: "pointer",
              }}>
                <ChevronDown size={10} color="#ffffff" />
              </button>
            </div>

            {/* Top Row */}
            <div className="flex items-center" style={{ marginBottom: 8 }}>
              <button className="flex items-center justify-center" onClick={() => setShowCreateImport(true)} style={{
                width: 126, height: 34, borderRadius: 6, backgroundColor: "#8fa9dd",
                marginRight: 7, border: "none", cursor: "pointer",
              }}>
                <span style={{ color: "#ffffff", fontSize: 12, fontWeight: 700 }}>Create/Import</span>
              </button>
              <div className="flex items-center" style={{
                width: 237, height: 34, borderRadius: 6, backgroundColor: "rgba(255,255,255,0.72)",
                border: "1px solid rgba(214,223,241,0.95)", paddingLeft: 10, paddingRight: 10, marginLeft: -3,
              }}>
                <Search size={15} color="#6f7890" className="mr-[6px]" />
                <input type="text" placeholder="Search..." className="flex-1 outline-none bg-transparent" style={{ fontSize: 12.8, color: "#6a7388", border: "none", padding: 0 }} />
                <Mic size={14} color="#6d7488" />
              </div>
            </div>

            {/* Main Section */}
            <div className="flex items-start justify-between" style={{ marginTop: 6 }}>
              {/* Sidebar */}
              <div style={{
                width: 126, height: 416, backgroundColor: "rgba(255,255,255,0.32)",
                paddingTop: 8, paddingLeft: 6, paddingRight: 6, paddingBottom: 4, marginRight: 3,
              }}>
                <div className="flex items-center" style={{ marginBottom: 8, paddingLeft: 1 }}>
                  <img src={avatar} alt="Julie" style={{ width: 28, height: 28, borderRadius: 14, marginRight: 6, objectFit: "cover" }} />
                  <span style={{ fontSize: 11.5, color: "#394460", fontWeight: 700 }}>Julie</span>
                </div>
                {sidebarItems.map((item) => (
                  <SideItem
                    key={item.id} label={item.label}
                    icon={<span style={{ color: getIconColor(item.id) }}>{item.icon}</span>}
                    active={getIsActive(item.id)} singleLine={item.singleLine}
                    onClick={() => handleSidebarClick(item)}
                  />
                ))}
                <div onClick={() => setSidebarScreen("how-it-works")} style={{
                  marginTop: 6, borderRadius: 8, backgroundColor: "rgba(255,255,255,0.48)",
                  border: "1px solid rgba(214,223,241,0.9)", overflow: "hidden", height: 78, cursor: "pointer",
                }}>
                  <div style={{ paddingTop: 6, paddingLeft: 6, paddingRight: 6, paddingBottom: 4 }}>
                    <p style={{ fontSize: 10.2, lineHeight: "10.2px", color: "#4150a9", fontWeight: 800, textAlign: "center", margin: 0 }}>HOW IT WORKS</p>
                  </div>
                  <div className="flex items-center justify-center" style={{ height: 46, backgroundColor: "#8aa2d8" }}>
                    <PlayCircle size={20} color="#ffffff" />
                  </div>
                </div>
              </div>

              {/* Grid */}
              <div style={{ width: 237, height: 432, overflowY: "auto", overflowX: "hidden", msOverflowStyle: "none", scrollbarWidth: "none" }} className="[&::-webkit-scrollbar]:hidden">
                {activeContent ? activeContent : (
                  <div className="flex flex-wrap justify-between" style={{ paddingBottom: 12 }}>
                    {cards.map((card) => (
                      <div key={card.id} className="transition-all duration-200 ease-out hover:scale-[1.03]" style={{ width: 110, marginBottom: 14, cursor: "pointer" }}>
                        <div style={{ width: 110, height: 95, borderRadius: "8px 8px 0 0", overflow: "hidden" }}>
                          <img src={card.image} alt={card.title} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                        </div>
                        <div style={{ width: 110, backgroundColor: "#ffffff", borderRadius: "0 0 8px 8px", padding: "4px 6px", minHeight: 28 }}>
                          <span style={{ fontSize: 10, color: "#4a5568", fontWeight: 500 }}>{card.title}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {overlay}

          <CreateImportSheet
            open={showCreateImport}
            onClose={() => setShowCreateImport(false)}
            onCreateFolder={createFolder}
            onCreateAlbum={createAlbum}
          />
        </div>
      </div>
    </div>
  );
}
