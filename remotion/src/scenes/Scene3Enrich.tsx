import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile } from "remotion";
import { loadFont } from "@remotion/google-fonts/Poppins";

const { fontFamily: poppins } = loadFont("normal", { weights: ["400", "600", "700"], subsets: ["latin"] });

const features = [
  { icon: "🎵", label: "Music", delay: 15 },
  { icon: "🎤", label: "Voice Message", delay: 30 },
  { icon: "📝", label: "Personal Notes", delay: 45 },
];

export const Scene3Enrich = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const imgScale = spring({ frame, fps, config: { damping: 20, stiffness: 120 } });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      {/* Center: phone mockup with enrichment */}
      <div
        style={{
          width: 900,
          height: 850,
          borderRadius: 30,
          overflow: "hidden",
          transform: `scale(${imgScale})`,
          boxShadow: "0 40px 100px rgba(0,0,0,0.4)",
        }}
      >
        <Img src={staticFile("images/scene2-adding.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>

      {/* Floating feature badges */}
      {features.map((feat, i) => {
        const s = spring({ frame: frame - feat.delay, fps, config: { damping: 10, stiffness: 100 } });
        const positions = [
          { right: 80, top: 180 },
          { right: 60, top: 420 },
          { right: 100, top: 660 },
        ];
        const pos = positions[i];
        return (
          <div
            key={feat.label}
            style={{
              position: "absolute",
              ...pos,
              transform: `scale(${Math.max(0, s)})`,
              background: "rgba(30,20,60,0.8)",
              borderRadius: 60,
              padding: "16px 36px",
              display: "flex",
              alignItems: "center",
              gap: 14,
              border: "1px solid rgba(196,181,224,0.25)",
              boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
            }}
          >
            <span style={{ fontSize: 36 }}>{feat.icon}</span>
            <span style={{ fontSize: 26, fontFamily: poppins, color: "#E8DEFF", fontWeight: 600 }}>
              {feat.label}
            </span>
          </div>
        );
      })}

      {/* Title */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 100,
          opacity: interpolate(frame, [10, 35], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" }),
          transform: `translateY(${interpolate(frame, [10, 35], [30, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" })}px)`,
        }}
      >
        <div style={{ fontSize: 20, fontFamily: poppins, fontWeight: 600, color: "#C4B5E0", letterSpacing: 5, textTransform: "uppercase", marginBottom: 12 }}>
          Step 2
        </div>
        <div style={{ fontSize: 46, fontFamily: poppins, fontWeight: 700, color: "#F5F0FF", lineHeight: 1.2 }}>
          She adds music,
          <br />voice & notes
        </div>
      </div>
    </AbsoluteFill>
  );
};
