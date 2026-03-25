import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile } from "remotion";
import { loadFont } from "@remotion/google-fonts/Poppins";

const { fontFamily: poppins } = loadFont("normal", { weights: ["400", "600", "700"], subsets: ["latin"] });

export const V3Scene5Share = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const imgScale = spring({ frame, fps, config: { damping: 15, stiffness: 80 } });

  // Action badges
  const actions = [
    { icon: "🔍", label: "Find", delay: 20 },
    { icon: "🎬", label: "Relive", delay: 35 },
    { icon: "🔗", label: "Share", delay: 50 },
  ];

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      {/* Share image */}
      <div style={{
        width: 950, height: 800, borderRadius: 30, overflow: "hidden",
        transform: `scale(${imgScale})`,
        boxShadow: "0 30px 80px rgba(0,0,0,0.4)",
      }}>
        <Img src={staticFile("images/v3-scene5-share.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>

      {/* Action badges */}
      {actions.map((act, i) => {
        const s = spring({ frame: frame - act.delay, fps, config: { damping: 10, stiffness: 120 } });
        const xPos = [100, 1400, 100];
        const yPos = [120, 120, 780];
        return (
          <div key={i} style={{
            position: "absolute", left: xPos[i], top: yPos[i],
            transform: `scale(${Math.max(0, s)})`,
            background: "rgba(0,30,30,0.85)", borderRadius: 60,
            padding: "16px 36px", display: "flex", alignItems: "center", gap: 14,
            border: "1px solid rgba(224,120,48,0.3)",
            boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
          }}>
            <span style={{ fontSize: 34 }}>{act.icon}</span>
            <span style={{ fontSize: 26, fontFamily: poppins, fontWeight: 700, color: "#e07830" }}>{act.label}</span>
          </div>
        );
      })}

      {/* Title */}
      <div style={{
        position: "absolute", bottom: 40, textAlign: "center", width: "100%",
        opacity: interpolate(frame, [15, 40], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" }),
      }}>
        <div style={{ fontSize: 42, fontFamily: poppins, fontWeight: 700, color: "#F0FFF0" }}>
          Find, relive & share your memories
        </div>
      </div>
    </AbsoluteFill>
  );
};
