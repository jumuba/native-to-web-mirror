import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadPoppins } from "@remotion/google-fonts/Poppins";

const { fontFamily: playfair } = loadFont("normal", { weights: ["700"], subsets: ["latin"] });
const { fontFamily: poppins } = loadPoppins("normal", { weights: ["400", "600"], subsets: ["latin"] });

export const V2Scene5Close = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame: frame - 10, fps, config: { damping: 12, stiffness: 100 } });
  const taglineOpacity = interpolate(frame, [40, 65], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const taglineY = interpolate(frame, [40, 65], [30, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const subOpacity = interpolate(frame, [65, 85], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  // Warm sparkle ring
  const sparkleOpacity = interpolate(frame, [30, 50], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      {/* Sparkle ring */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const angle = (i / 8) * Math.PI * 2 + frame * 0.012;
        const radius = 260 + Math.sin(frame * 0.04 + i) * 25;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 960 + Math.cos(angle) * radius,
              top: 480 + Math.sin(angle) * radius,
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#e8a87c",
              opacity: sparkleOpacity * (0.4 + Math.sin(frame * 0.08 + i) * 0.4),
              boxShadow: "0 0 16px 4px rgba(232,168,124,0.3)",
            }}
          />
        );
      })}

      {/* Logo */}
      <div style={{ transform: `scale(${Math.max(0, logoScale)})`, textAlign: "center" }}>
        <div
          style={{
            fontSize: 82,
            fontFamily: playfair,
            fontWeight: 700,
            color: "#FFF5EB",
            textShadow: "0 4px 30px rgba(201,123,90,0.4)",
          }}
        >
          SmartMemory
        </div>
      </div>

      {/* Tagline */}
      <div
        style={{
          position: "absolute",
          top: 580,
          textAlign: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            opacity: taglineOpacity,
            transform: `translateY(${taglineY}px)`,
            fontSize: 36,
            fontFamily: poppins,
            fontWeight: 600,
            color: "#e8a87c",
            letterSpacing: 3,
          }}
        >
          Every photo tells a story
        </div>
        <div
          style={{
            opacity: subOpacity,
            fontSize: 24,
            fontFamily: poppins,
            fontWeight: 400,
            color: "rgba(255,240,220,0.6)",
            marginTop: 14,
          }}
        >
          Turn simple moments into emotional connections
        </div>
      </div>
    </AbsoluteFill>
  );
};
