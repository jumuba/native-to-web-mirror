import React, { useState } from "react";
import { Lock, Eye, EyeOff, Shield, Download, Key } from "lucide-react";

export default function PrivacyContent() {
  const [toggles, setToggles] = useState({
    twoFactor: false,
    downloadPermission: true,
    shareAnalytics: false,
    autoLock: true,
  });
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [passwordResetDone, setPasswordResetDone] = useState(false);

  const toggle = (key: keyof typeof toggles) => {
    setToggles({ ...toggles, [key]: !toggles[key] });
  };

  const handlePasswordReset = () => {
    setPasswordResetDone(true);
    setTimeout(() => {
      setPasswordResetDone(false);
      setShowPasswordReset(false);
    }, 2000);
  };

  const ToggleRow = ({ label, icon: Icon, value, onToggle }: { label: string; icon: any; value: boolean; onToggle: () => void }) => (
    <div className="flex items-center justify-between" style={{ padding: "8px 0", borderBottom: "1px solid rgba(214,223,241,0.5)" }}>
      <div className="flex items-center">
        <Icon size={11} color="#687287" style={{ marginRight: 6 }} />
        <span style={{ fontSize: 10, color: "#394460", fontWeight: 600 }}>{label}</span>
      </div>
      <div
        onClick={onToggle}
        style={{
          width: 28,
          height: 16,
          borderRadius: 8,
          backgroundColor: value ? "#1db954" : "#d0d5dd",
          padding: 2,
          cursor: "pointer",
          transition: "all 0.2s",
        }}
      >
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: "#fff",
            transition: "transform 0.2s",
            transform: value ? "translateX(12px)" : "translateX(0)",
          }}
        />
      </div>
    </div>
  );

  return (
    <div style={{ padding: "0 4px" }}>
      <p style={{ fontSize: 13, fontWeight: 700, color: "#394460", marginBottom: 10 }}>Privacy & Security</p>

      <div style={{ backgroundColor: "rgba(255,255,255,0.8)", border: "1px solid rgba(214,223,241,0.9)", borderRadius: 10, padding: "6px 10px", marginBottom: 10 }}>
        <ToggleRow label="Two-Factor Auth" icon={Shield} value={toggles.twoFactor} onToggle={() => toggle("twoFactor")} />
        <ToggleRow label="Download Permission" icon={Download} value={toggles.downloadPermission} onToggle={() => toggle("downloadPermission")} />
        <ToggleRow label="Share Analytics" icon={Eye} value={toggles.shareAnalytics} onToggle={() => toggle("shareAnalytics")} />
        <ToggleRow label="Auto-Lock Folders" icon={Lock} value={toggles.autoLock} onToggle={() => toggle("autoLock")} />
      </div>

      {/* Password Reset */}
      <div style={{ backgroundColor: "rgba(255,255,255,0.8)", border: "1px solid rgba(214,223,241,0.9)", borderRadius: 10, padding: "10px", marginBottom: 10 }}>
        <div className="flex items-center" style={{ marginBottom: 6 }}>
          <Key size={11} color="#687287" style={{ marginRight: 4 }} />
          <span style={{ fontSize: 10, color: "#394460", fontWeight: 600 }}>Password</span>
        </div>
        {!showPasswordReset ? (
          <button
            onClick={() => setShowPasswordReset(true)}
            style={{ padding: "5px 12px", borderRadius: 6, backgroundColor: "#8fa9dd", color: "#fff", fontSize: 9, fontWeight: 600, border: "none", cursor: "pointer" }}
          >
            Reset Password
          </button>
        ) : passwordResetDone ? (
          <span style={{ fontSize: 10, color: "#1db954", fontWeight: 600 }}>✓ Reset link sent to your email!</span>
        ) : (
          <div>
            <input placeholder="Current password" type="password" style={{ width: "100%", fontSize: 9, border: "1px solid #dde3f0", borderRadius: 4, padding: "4px 6px", marginBottom: 4, outline: "none" }} />
            <input placeholder="New password" type="password" style={{ width: "100%", fontSize: 9, border: "1px solid #dde3f0", borderRadius: 4, padding: "4px 6px", marginBottom: 4, outline: "none" }} />
            <button
              onClick={handlePasswordReset}
              style={{ width: "100%", padding: "4px", borderRadius: 4, backgroundColor: "#8fa9dd", color: "#fff", fontSize: 9, fontWeight: 600, border: "none", cursor: "pointer" }}
            >
              Confirm Reset
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
