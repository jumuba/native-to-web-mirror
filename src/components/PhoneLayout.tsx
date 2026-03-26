import type React from "react";
import {
  Home,
  ImageIcon,
  Bell,
  User,
  Gift,
  ShieldCheck,
  HelpCircle,
  Calendar,
  ChevronDown,
  Search,
  Mic,
  PlayCircle,
  Signal,
  Wifi,
  BatteryFull,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

import bgSkyFloral from "@/assets/bg-sky-floral.png";
import avatar from "@/assets/avatar.png";

interface AlbumCard {
  id: string;
  title: string;
  image: string;
}

interface PhoneLayoutProps {
  cards: AlbumCard[];
}

function SideItem({
  label,
  icon,
  active,
  singleLine,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  singleLine?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      className="flex items-center px-1 mb-[3px] rounded-[5px]"
      style={{
        minHeight: 29,
        backgroundColor: active ? "#8da9dd" : "transparent",
        cursor: onClick ? "pointer" : "default",
      }}
      onClick={onClick}
    >
      <div className="flex items-center justify-center mr-[5px]" style={{ width: 16 }}>
        {icon}
      </div>
      <span
        className="flex-1 font-bold"
        style={{
          fontSize: 9.8,
          color: active ? "#ffffff" : "#687287",
          lineHeight: "11.8px",
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: singleLine ? 1 : 2,
          WebkitBoxOrient: "vertical",
        }}
      >
        {label}
      </span>
    </div>
  );
}

function Card({ image, title }: { image: string; title: string }) {
  return (
    <div
      className="transition-transform duration-200 hover:scale-105"
      style={{
        width: 115,
        height: 136,
        borderRadius: 8,
        overflow: "hidden",
        marginBottom: 7,
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        cursor: "pointer",
      }}
    >
      <img src={image} alt={title} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
    </div>
  );
}

export default function PhoneLayout({ cards }: PhoneLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname;

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: <Home size={13} />, path: "/" },
    { id: "memories", label: "My Memories", icon: <ImageIcon size={13} />, path: "/" },
    { id: "photo-albums", label: "Photo Albums", icon: <ImageIcon size={13} />, path: "/photo-albums" },
    { id: "reminders", label: "Reminders", icon: <Bell size={13} />, path: undefined },
    { id: "profile", label: "My Profile", icon: <User size={13} />, path: undefined },
    { id: "offers", label: "Offers", icon: <Gift size={13} />, path: undefined },
    { id: "privacy", label: "Privacy & Security", icon: <ShieldCheck size={13} />, path: undefined, singleLine: true },
    { id: "support", label: "Help & Support", icon: <HelpCircle size={13} />, path: undefined, singleLine: true },
  ];

  const getIsActive = (id: string) => {
    if (id === "memories") return currentPath === "/";
    if (id === "photo-albums") return currentPath === "/photo-albums";
    return false;
  };

  const getIconColor = (id: string) => {
    return getIsActive(id) ? "#ffffff" : "#7d8699";
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#ffffff" }}>
      <div
        style={{
          width: 405,
          minHeight: 750,
          backgroundColor: "#1a1a1a",
          borderRadius: 50,
          padding: "12px 12px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3), inset 0 0 0 2px #333",
          position: "relative",
          border: "3px solid #2a2a2a",
        }}
      >
        <div
          style={{
            width: 120,
            height: 28,
            backgroundColor: "#1a1a1a",
            borderRadius: 20,
            position: "absolute",
            top: 10,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
          }}
        />

        <div
          style={{
            width: "100%",
            minHeight: 720,
            paddingTop: 14,
            paddingLeft: 4,
            paddingRight: 4,
            paddingBottom: 10,
            backgroundImage: `url(${bgSkyFloral})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: 38,
            overflow: "hidden",
            margin: "0 auto",
          }}
        >
          {/* Status Bar */}
          <div
            className="flex items-center justify-between"
            style={{ height: 24, paddingLeft: 20, paddingRight: 20, marginBottom: 18 }}
          >
            <span style={{ fontSize: 15, color: "#111111", fontWeight: 600, letterSpacing: -0.2 }}>
              9:41
            </span>
            <div className="flex items-center">
              <Signal size={16} color="#111111" className="mr-1" />
              <Wifi size={15} color="#111111" className="mr-1" />
              <BatteryFull size={18} color="#111111" />
            </div>
          </div>

          {/* Header */}
          <div className="text-center" style={{ marginBottom: 20 }}>
            <h1 style={{ fontSize: 30, color: "#5665c9", fontWeight: 400, letterSpacing: 0, margin: 0 }}>
              Spark
            </h1>
          </div>

          {/* Content Section */}
          <div style={{ marginTop: 50 }}>
            {/* Upcoming Bar */}
            <div
              className="flex items-center"
              style={{
                height: 27,
                borderRadius: 6,
                backgroundColor: "rgba(255,255,255,0.72)",
                border: "1px solid rgba(214,223,241,0.95)",
                paddingLeft: 9,
                paddingRight: 9,
                marginBottom: 8,
              }}
            >
              <div
                className="flex items-center justify-center"
                style={{
                  width: 15,
                  height: 15,
                  borderRadius: 3,
                  backgroundColor: "#e6ebf7",
                  marginRight: 7,
                }}
              >
                <Calendar size={9} color="#7f89a2" />
              </div>
              <span className="flex-1" style={{ fontSize: 10.6, color: "#6a7184", fontWeight: 500 }}>
                Next upcoming event: Julie&apos;s wedding in 3 days
              </span>
              <button
                className="flex items-center justify-center"
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  backgroundColor: "#9bb4e7",
                  marginLeft: 4,
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                }}
              >
                <ChevronDown size={10} color="#ffffff" />
              </button>
            </div>

            {/* Top Row */}
            <div className="flex items-center" style={{ marginBottom: 8 }}>
              <button
                className="flex items-center justify-center"
                style={{
                  width: 126,
                  height: 34,
                  borderRadius: 6,
                  backgroundColor: "#8fa9dd",
                  marginRight: 7,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <span style={{ color: "#ffffff", fontSize: 12, fontWeight: 700 }}>Create/Import</span>
              </button>

              <div
                className="flex items-center"
                style={{
                  width: 237,
                  height: 34,
                  borderRadius: 6,
                  backgroundColor: "rgba(255,255,255,0.72)",
                  border: "1px solid rgba(214,223,241,0.95)",
                  paddingLeft: 10,
                  paddingRight: 10,
                  marginLeft: -3,
                }}
              >
                <Search size={15} color="#6f7890" className="mr-[6px]" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="flex-1 outline-none bg-transparent"
                  style={{
                    fontSize: 12.8,
                    color: "#6a7388",
                    border: "none",
                    padding: 0,
                  }}
                />
                <Mic size={14} color="#6d7488" />
              </div>
            </div>

            {/* Main Section */}
            <div className="flex items-start justify-between" style={{ marginTop: 6 }}>
              {/* Sidebar */}
              <div
                style={{
                  width: 126,
                  height: 416,
                  backgroundColor: "rgba(255,255,255,0.32)",
                  paddingTop: 8,
                  paddingLeft: 6,
                  paddingRight: 6,
                  paddingBottom: 4,
                  marginRight: 3,
                }}
              >
                {/* Profile */}
                <div className="flex items-center" style={{ marginBottom: 8, paddingLeft: 1 }}>
                  <img
                    src={avatar}
                    alt="Julie"
                    style={{ width: 28, height: 28, borderRadius: 14, marginRight: 6, objectFit: "cover" }}
                  />
                  <span style={{ fontSize: 11.5, color: "#394460", fontWeight: 700 }}>Julie</span>
                </div>

                {sidebarItems.map((item) => (
                  <SideItem
                    key={item.id}
                    label={item.label}
                    icon={
                      <span style={{ color: getIconColor(item.id) }}>
                        {item.icon}
                      </span>
                    }
                    active={getIsActive(item.id)}
                    singleLine={item.singleLine}
                    onClick={item.path !== undefined ? () => navigate(item.path!) : undefined}
                  />
                ))}

                {/* How It Works */}
                <div
                  style={{
                    marginTop: 6,
                    borderRadius: 8,
                    backgroundColor: "rgba(255,255,255,0.48)",
                    border: "1px solid rgba(214,223,241,0.9)",
                    overflow: "hidden",
                    height: 126,
                  }}
                >
                  <div style={{ paddingTop: 6, paddingLeft: 6, paddingRight: 6, paddingBottom: 4 }}>
                    <p
                      style={{
                        fontSize: 10.2,
                        lineHeight: "10.2px",
                        color: "#4150a9",
                        fontWeight: 800,
                        textAlign: "center",
                        margin: 0,
                      }}
                    >
                      HOW IT WORKS
                    </p>
                  </div>
                  <div
                    className="flex items-center justify-center"
                    style={{ height: 96, backgroundColor: "#8aa2d8" }}
                  >
                    <PlayCircle size={20} color="#ffffff" />
                  </div>
                </div>
              </div>

              {/* Grid */}
              <div
                style={{
                  width: 237,
                  height: 432,
                  overflowY: "auto",
                  overflowX: "hidden",
                  msOverflowStyle: "none",
                  scrollbarWidth: "none",
                }}
                className="[&::-webkit-scrollbar]:hidden"
              >
                <div
                  className="flex flex-wrap justify-between"
                  style={{ paddingBottom: 12 }}
                >
                  {cards.map((card) => (
                    <Card key={card.id} image={card.image} title={card.title} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
