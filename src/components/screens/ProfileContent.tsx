import React, { useState } from "react";
import { Camera, Palette, Type, Globe, Edit3 } from "lucide-react";
import { mockUser } from "@/lib/mockData";

export default function ProfileContent() {
  const [user, setUser] = useState(mockUser);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(user.name);

  const handleSave = () => {
    setUser({ ...user, name: editName });
    setEditing(false);
  };

  const languages = ["English", "French", "Spanish", "Arabic"];
  const fonts = ["Default", "Serif", "Mono", "Rounded"];
  const colors = ["#5665c9", "#8b5cf6", "#1db954", "#ef4444", "#f59e0b", "#e8b4b8"];

  return (
    <div style={{ padding: "0 4px" }}>
      <p style={{ fontSize: 13, fontWeight: 700, color: "#394460", marginBottom: 10 }}>My Profile</p>

      {/* Banner + Avatar */}
      <div style={{ position: "relative", marginBottom: 30 }}>
        <div
          style={{
            width: "100%",
            height: 60,
            borderRadius: 8,
            background: "linear-gradient(135deg, #8fa9dd, #5665c9)",
            overflow: "hidden",
          }}
        >
          <img src={user.banner} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.5 }} />
        </div>
        <div style={{ position: "absolute", bottom: -16, left: 10 }}>
          <div style={{ position: "relative" }}>
            <img
              src={user.avatar}
              alt={user.name}
              style={{ width: 40, height: 40, borderRadius: 20, border: "2px solid #fff", objectFit: "cover" }}
            />
            <div
              className="flex items-center justify-center"
              style={{
                position: "absolute",
                bottom: -2,
                right: -2,
                width: 16,
                height: 16,
                borderRadius: 8,
                backgroundColor: "#8fa9dd",
                cursor: "pointer",
              }}
            >
              <Camera size={8} color="#fff" />
            </div>
          </div>
        </div>
      </div>

      {/* Name */}
      <div style={{ backgroundColor: "rgba(255,255,255,0.8)", border: "1px solid rgba(214,223,241,0.9)", borderRadius: 8, padding: "8px 10px", marginBottom: 8 }}>
        <div className="flex items-center justify-between">
          <span style={{ fontSize: 9, color: "#687287", fontWeight: 600 }}>Name</span>
          <button onClick={() => setEditing(!editing)} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <Edit3 size={10} color="#8fa9dd" />
          </button>
        </div>
        {editing ? (
          <div className="flex items-center" style={{ marginTop: 4, gap: 4 }}>
            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              style={{ flex: 1, fontSize: 11, border: "1px solid #dde3f0", borderRadius: 4, padding: "3px 6px", outline: "none" }}
            />
            <button onClick={handleSave} style={{ padding: "3px 8px", borderRadius: 4, backgroundColor: "#8fa9dd", color: "#fff", fontSize: 9, border: "none", cursor: "pointer", fontWeight: 600 }}>
              Save
            </button>
          </div>
        ) : (
          <span style={{ fontSize: 12, fontWeight: 700, color: "#394460" }}>{user.name}</span>
        )}
      </div>

      {/* Language */}
      <div style={{ backgroundColor: "rgba(255,255,255,0.8)", border: "1px solid rgba(214,223,241,0.9)", borderRadius: 8, padding: "8px 10px", marginBottom: 8 }}>
        <div className="flex items-center" style={{ marginBottom: 4 }}>
          <Globe size={10} color="#687287" style={{ marginRight: 4 }} />
          <span style={{ fontSize: 9, color: "#687287", fontWeight: 600 }}>Language</span>
        </div>
        <div className="flex flex-wrap" style={{ gap: 4 }}>
          {languages.map((l) => (
            <button
              key={l}
              onClick={() => setUser({ ...user, language: l })}
              style={{
                padding: "3px 8px",
                borderRadius: 10,
                fontSize: 8.5,
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
                backgroundColor: user.language === l ? "#8fa9dd" : "#e8ecf4",
                color: user.language === l ? "#fff" : "#687287",
              }}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Theme Color */}
      <div style={{ backgroundColor: "rgba(255,255,255,0.8)", border: "1px solid rgba(214,223,241,0.9)", borderRadius: 8, padding: "8px 10px", marginBottom: 8 }}>
        <div className="flex items-center" style={{ marginBottom: 4 }}>
          <Palette size={10} color="#687287" style={{ marginRight: 4 }} />
          <span style={{ fontSize: 9, color: "#687287", fontWeight: 600 }}>Theme Color</span>
        </div>
        <div className="flex" style={{ gap: 6 }}>
          {colors.map((c) => (
            <div
              key={c}
              onClick={() => setUser({ ...user, themeColor: c })}
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                backgroundColor: c,
                cursor: "pointer",
                border: user.themeColor === c ? "2px solid #394460" : "2px solid transparent",
              }}
            />
          ))}
        </div>
      </div>

      {/* Font */}
      <div style={{ backgroundColor: "rgba(255,255,255,0.8)", border: "1px solid rgba(214,223,241,0.9)", borderRadius: 8, padding: "8px 10px", marginBottom: 8 }}>
        <div className="flex items-center" style={{ marginBottom: 4 }}>
          <Type size={10} color="#687287" style={{ marginRight: 4 }} />
          <span style={{ fontSize: 9, color: "#687287", fontWeight: 600 }}>Font</span>
        </div>
        <div className="flex flex-wrap" style={{ gap: 4 }}>
          {fonts.map((f) => (
            <button
              key={f}
              onClick={() => setUser({ ...user, font: f })}
              style={{
                padding: "3px 8px",
                borderRadius: 10,
                fontSize: 8.5,
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
                backgroundColor: user.font === f ? "#8fa9dd" : "#e8ecf4",
                color: user.font === f ? "#fff" : "#687287",
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
