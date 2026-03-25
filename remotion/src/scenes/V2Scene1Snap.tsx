import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadPoppins } from "@remotion/google-fonts/Poppins";

const { fontFamily: playfair } = loadFont("normal", { weights: ["700"], subsets: ["latin"] });
const { fontFamily: poppins } = loadPoppins("normal", { weights: ["400", "600"], subsets: ["latin"] });

export const V2Scene1Snap = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Camera flash effect
  const flashOpacity = interpolate(frame, [35, 38, 42], [0, 0.8, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  const imgScale = spring({ frame, fps, config: { damping: 15, stiffness: 80 } });
  const titleOpacity = interpolate(frame, [45, 65], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const titleY = interpolate(frame, [45, 65], [40, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  // Subtle zoom on image
  const imgZoom = interpolate(frame, [0, 110], [1, 1.08], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      {/* Main image with slow zoom */}
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 60,
          width: 920,
          height: 900,
          borderRadius: 30,
          overflow: "hidden",
          transform: `scale(${imgScale})`,
          boxShadow: "0 30px 80px rgba(0,0,0,0.35)",
        }}
      >
        <Img
          src={staticFile("images/v2-scene1-snap.jpg")}
          style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${imgZoom})` }}
        />
      </div>

      {/* Camera flash overlay */}
      <AbsoluteFill style={{ backgroundColor: "#ffffff", opacity: flashOpacity, borderRadius: 30 }} />

      {/* Text right side */}
      <div
        style={{
          position: "absolute",
          right: 80,
          top: 220,
          width: 750,
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        <div style={{ fontSize: 58, fontFamily: playfair, fontWeight: 700, color: "#FFF5EB", lineHeight: 1.2, marginBottom: 20 }}>
          📸 Snap a photo
        </div>
        <div style={{ fontSize: 26, fontFamily: poppins, fontWeight: 400, color: "rgba(255,240,220,0.75)", lineHeight: 1.5 }}>
          A beautiful moment
          <br />captured in an instant
        </div>
      </div>

      {/* Shutter circle animation */}
      {frame < 45 && (
        <div
          style={{
            position: "absolute",
            left: 520,
            top: 510,
            width: 80,
            height: 80,
            borderRadius: "50%",
            border: "4px solid rgba(255,255,255,0.6)",
            transform: `scale(${interpolate(frame, [30, 38], [1, 1.5], { extrapolateRight: "clamp", extrapolateLeft: "clamp" })})`,
            opacity: interpolate(frame, [30, 38, 45], [0, 1, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" }),
          }}
        />
      )}
    </AbsoluteFill>
  );
};
