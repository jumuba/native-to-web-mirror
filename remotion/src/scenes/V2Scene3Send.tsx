import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile } from "remotion";
import { loadFont } from "@remotion/google-fonts/Poppins";

const { fontFamily: poppins } = loadFont("normal", { weights: ["400", "600", "700"], subsets: ["latin"] });

export const V2Scene3Send = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const imgScale = spring({ frame, fps, config: { damping: 15, stiffness: 80 } });

  // Pulse ring at send moment
  const sendFrame = 40;
  const ringProgress = interpolate(frame, [sendFrame, sendFrame + 30], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const ringOpacity = interpolate(frame, [sendFrame, sendFrame + 25, sendFrame + 30], [0, 0.8, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  // Sparkle trails
  const sparkleProgress = interpolate(frame, [sendFrame + 5, 85], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      {/* Image */}
      <div
        style={{
          width: 1000,
          height: 750,
          borderRadius: 30,
          overflow: "hidden",
          transform: `scale(${imgScale})`,
          boxShadow: "0 30px 80px rgba(0,0,0,0.35)",
        }}
      >
        <Img src={staticFile("images/v2-scene3-send.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>

      {/* Pulse rings */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: 150 + ringProgress * 400 + i * 100,
            height: 150 + ringProgress * 400 + i * 100,
            borderRadius: "50%",
            border: `2px solid rgba(232,168,124,${ringOpacity * (1 - i * 0.3)})`,
          }}
        />
      ))}

      {/* Sparkle trails flying to top-right */}
      {frame > sendFrame + 5 &&
        [0, 1, 2, 3, 4, 5].map((i) => {
          const angle = -0.5 + (i / 6) * 1.2;
          const dist = sparkleProgress * 600;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 960 + Math.cos(angle) * dist,
                top: 540 + Math.sin(angle) * dist - sparkleProgress * 200,
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#e8a87c",
                opacity: 1 - sparkleProgress,
                boxShadow: "0 0 15px 5px rgba(232,168,124,0.4)",
              }}
            />
          );
        })}

      {/* Text */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          textAlign: "center",
          width: "100%",
          opacity: interpolate(frame, [10, 30], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" }),
        }}
      >
        <div style={{ fontSize: 46, fontFamily: poppins, fontWeight: 700, color: "#FFF5EB" }}>
          Sent instantly ✨
        </div>
      </div>
    </AbsoluteFill>
  );
};
