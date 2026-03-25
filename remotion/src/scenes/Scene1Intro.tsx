import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadPoppins } from "@remotion/google-fonts/Poppins";

const { fontFamily: playfair } = loadFont("normal", { weights: ["700"], subsets: ["latin"] });
const { fontFamily: poppins } = loadPoppins("normal", { weights: ["400", "600"], subsets: ["latin"] });

export const Scene1Intro = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame, fps, config: { damping: 12, stiffness: 100 } });
  const titleOpacity = interpolate(frame, [20, 45], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const titleY = interpolate(frame, [20, 45], [40, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const subtitleOpacity = interpolate(frame, [40, 65], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const subtitleY = interpolate(frame, [40, 65], [30, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  // Sparkles
  const sparkleOpacity = interpolate(frame, [50, 70, 90, 110], [0, 1, 1, 0.6], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      {/* Sparkle accents */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i / 6) * Math.PI * 2 + frame * 0.015;
        const radius = 280 + Math.sin(frame * 0.05 + i) * 30;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 960 + Math.cos(angle) * radius,
              top: 540 + Math.sin(angle) * radius,
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#C4B5E0",
              opacity: sparkleOpacity * (0.5 + Math.sin(frame * 0.1 + i) * 0.5),
              boxShadow: "0 0 20px 6px rgba(196,181,224,0.4)",
            }}
          />
        );
      })}

      {/* Logo */}
      <div
        style={{
          transform: `scale(${logoScale})`,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 82,
            fontFamily: playfair,
            fontWeight: 700,
            color: "#E8DEFF",
            letterSpacing: -1,
            textShadow: "0 4px 30px rgba(86,101,201,0.5)",
          }}
        >
          SmartMemory
        </div>
      </div>

      {/* Subtitle */}
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
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            fontSize: 36,
            fontFamily: poppins,
            fontWeight: 600,
            color: "#C4B5E0",
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          Create. Share. Surprise.
        </div>
        <div
          style={{
            opacity: subtitleOpacity,
            transform: `translateY(${subtitleY}px)`,
            fontSize: 22,
            fontFamily: poppins,
            fontWeight: 400,
            color: "rgba(196,181,224,0.7)",
            marginTop: 12,
          }}
        >
          Your memories, beautifully gifted
        </div>
      </div>
    </AbsoluteFill>
  );
};
