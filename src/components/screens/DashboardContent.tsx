import React from "react";
import {
  FolderOpen,
  BookOpen,
  ImageIcon,
  Bell,
  HardDrive,
  Crown,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { mockDashboardStats } from "@/lib/mockData";

const stats = [
  { label: "Folders", value: mockDashboardStats.folders, icon: FolderOpen, color: "#8fa9dd" },
  { label: "Albums", value: mockDashboardStats.albums, icon: BookOpen, color: "#8b5cf6" },
  { label: "Media", value: mockDashboardStats.media, icon: ImageIcon, color: "#1db954" },
  { label: "Reminders", value: mockDashboardStats.reminders, icon: Bell, color: "#e8b4b8" },
  { label: "Storage", value: mockDashboardStats.storageUsed, icon: HardDrive, color: "#6b9fff" },
  { label: "Plan", value: mockDashboardStats.plan, icon: Crown, color: "#d2a9b8" },
];

export default function DashboardContent() {
  return (
    <div style={{ padding: "0 4px" }}>
      <p style={{ fontSize: 13, fontWeight: 700, color: "#394460", marginBottom: 10 }}>Dashboard</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
        {stats.map((s) => (
          <div
            key={s.label}
            style={{
              backgroundColor: "rgba(255,255,255,0.8)",
              border: "1px solid rgba(214,223,241,0.9)",
              borderRadius: 10,
              padding: "10px 10px",
            }}
          >
            <div className="flex items-center" style={{ marginBottom: 6 }}>
              <div
                className="flex items-center justify-center"
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 6,
                  backgroundColor: `${s.color}22`,
                  marginRight: 6,
                }}
              >
                <s.icon size={12} color={s.color} />
              </div>
              <span style={{ fontSize: 8.5, color: "#687287", fontWeight: 600 }}>{s.label}</span>
            </div>
            <span style={{ fontSize: 16, fontWeight: 800, color: "#394460" }}>
              {typeof s.value === "number" ? s.value : s.value}
            </span>
          </div>
        ))}
      </div>

      {/* Activity placeholder */}
      <div
        style={{
          backgroundColor: "rgba(255,255,255,0.8)",
          border: "1px solid rgba(214,223,241,0.9)",
          borderRadius: 10,
          padding: "10px",
        }}
      >
        <div className="flex items-center" style={{ marginBottom: 6 }}>
          <TrendingUp size={12} color="#8fa9dd" style={{ marginRight: 4 }} />
          <span style={{ fontSize: 9, color: "#687287", fontWeight: 600 }}>Recent Activity</span>
        </div>
        <div style={{ fontSize: 8.5, color: "#8fa9dd", lineHeight: "14px" }}>
          <p style={{ margin: "2px 0" }}>📸 Added 3 photos to "Family"</p>
          <p style={{ margin: "2px 0" }}>💌 Shared "Dad Remembrance" album</p>
          <p style={{ margin: "2px 0" }}>🎂 Reminder: Clara's Birthday in 2 months</p>
        </div>
      </div>
    </div>
  );
}
