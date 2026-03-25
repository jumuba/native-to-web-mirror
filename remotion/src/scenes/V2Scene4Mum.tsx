import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadPoppins } from "@remotion/google-fonts/Poppins";

const { fontFamily: playfair } = loadFont("normal", { weights: ["700"], subsets: ["latin"] });
const { fontFamily: poppins } = loadPoppins("normal", { weights: ["400", "600"], subsets: ["latin"] });

export const V2Scene4Mum = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const imgScale = spring({ frame, fps, config: { damping: 12, stiffness: 80 } });
  const imgX = interpolate(frame, [0, 35], [300, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  // Warm glow pulse
  const glowOpacity = 0.15 + Math.sin(frame * 0.08) * 0.08;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      {/* Warm glow overlay */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 70% 50%, rgba(232,168,124,${glowOpacity}), transparent 60%)`,
        }}
      />

      {/* Image */}
      <div
        style={{
          position: "absolute",
          right: 60,
          width: 900,
          height: 850,
          borderRadius: 30,
          overflow: "hidden",
          transform: `scale(${imgScale}) translateX(${imgX}px)`,
          boxShadow: "0 30px 80px rgba(0,0,0,0.35)",
        }}
      >
        <Img src={staticFile("images/v2-scene4-mum.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>

      {/* Text left side */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 200,
          width: 680,
          opacity: interpolate(frame, [25, 50], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" }),
          transform: `translateY(${interpolate(frame, [25, 50], [40, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" })}px)`,
        }}
      >
        <div style={{ fontSize: 56, fontFamily: playfair, fontWeight: 700, color: "#FFF5EB", lineHeight: 1.2, marginBottom: 20 }}>
          Mum receives
          <br />the surprise
        </div>
        <div style={{ fontSize: 26, fontFamily: poppins, fontWeight: 400, color: "rgba(255,240,220,0.75)", lineHeight: 1.5, marginBottom: 30 }}>
          A simple photo becomes
          <br />an emotional moment 🥹
        </div>
      </div>

      {/* Floating hearts */}
      {frame > 40 &&
        [0, 1, 2].map((i) => {
          const heartY = interpolate(frame, [40 + i * 10, 120], [700, 100 + i * 150], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
          const heartX = 150 + i * 200 + Math.sin((frame + i * 25) * 0.07) * 30;
          const heartOpacity = interpolate(frame, [40 + i * 10, 60 + i * 10], [0, 0.7], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
          return (
            <div key={i} style={{ position: "absolute", left: heartX, top: heartY, fontSize: 44, opacity: heartOpacity }}>
              🧡
            </div>
          );
        })}
    </AbsoluteFill>
  );
};
