import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile } from "remotion";
import { loadFont } from "@remotion/google-fonts/Poppins";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";

const { fontFamily: poppins } = loadFont("normal", { weights: ["400", "600", "700"], subsets: ["latin"] });
const { fontFamily: playfair } = loadPlayfair("normal", { weights: ["700"], subsets: ["latin"] });

export const Scene5Receive = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const imgScale = spring({ frame, fps, config: { damping: 12, stiffness: 80 } });
  const imgX = interpolate(frame, [0, 35], [300, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  // Confetti
  const confettiColors = ["#FFD700", "#FF69B4", "#7B5EA7", "#5665C9", "#C4B5E0", "#FF6B6B"];

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      {/* Confetti */}
      {frame > 30 &&
        Array.from({ length: 20 }).map((_, i) => {
          const progress = interpolate(frame, [30, 110], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
          const startX = 960 + (Math.random() * 2 - 1) * 200;
          const x = startX + Math.sin(i * 1.5) * 300 * progress;
          const y = -20 + progress * 1200;
          const rotation = progress * 720 + i * 45;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x,
                top: y,
                width: 12,
                height: 18,
                borderRadius: 2,
                background: confettiColors[i % confettiColors.length],
                transform: `rotate(${rotation}deg)`,
                opacity: 1 - progress * 0.5,
              }}
            />
          );
        })}

      {/* Image */}
      <div
        style={{
          position: "absolute",
          right: 80,
          width: 850,
          height: 800,
          borderRadius: 30,
          overflow: "hidden",
          transform: `scale(${imgScale}) translateX(${imgX}px)`,
          boxShadow: "0 30px 80px rgba(0,0,0,0.35)",
        }}
      >
        <Img src={staticFile("images/scene4-receiving.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>

      {/* Text */}
      <div
        style={{
          position: "absolute",
          left: 100,
          top: 200,
          width: 700,
          opacity: interpolate(frame, [20, 50], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" }),
          transform: `translateY(${interpolate(frame, [20, 50], [40, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" })}px)`,
        }}
      >
        <div style={{ fontSize: 22, fontFamily: poppins, fontWeight: 600, color: "#FFD700", letterSpacing: 3, marginBottom: 16 }}>
          🔔 NOTIFICATION
        </div>
        <div style={{ fontSize: 52, fontFamily: playfair, fontWeight: 700, color: "#F5F0FF", lineHeight: 1.2, marginBottom: 20 }}>
          A gift from
          <br />Stephanie!
        </div>
        <div style={{ fontSize: 26, fontFamily: poppins, fontWeight: 400, color: "rgba(196,181,224,0.8)", lineHeight: 1.5 }}>
          The recipient opens the album...
          <br />surprised and delighted! 😍
        </div>
      </div>
    </AbsoluteFill>
  );
};
