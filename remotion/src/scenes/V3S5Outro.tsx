import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadPoppins } from "@remotion/google-fonts/Poppins";

const { fontFamily: playfair } = loadFont("normal", { weights: ["700"], subsets: ["latin"] });
const { fontFamily: poppins } = loadPoppins("normal", { weights: ["400", "600"], subsets: ["latin"] });

export const V3S5Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame: frame - 5, fps, config: { damping: 12, stiffness: 100 } });
  const tagOp = interpolate(frame, [30, 50], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const tagY = interpolate(frame, [30, 50], [25, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const subOp = interpolate(frame, [50, 65], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      {/* Sparkle ring */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const angle = (i / 8) * Math.PI * 2 + frame * 0.015;
        const radius = 260 + Math.sin(frame * 0.04 + i) * 20;
        return (
          <div key={i} style={{
            position: "absolute",
            left: 960 + Math.cos(angle) * radius,
            top: 480 + Math.sin(angle) * radius,
            width: 7, height: 7, borderRadius: "50%",
            background: "#e07830",
            opacity: 0.3 + Math.sin(frame * 0.08 + i) * 0.3,
            boxShadow: "0 0 16px 4px rgba(224,120,48,0.3)",
          }} />
        );
      })}

      <div style={{ transform: `scale(${Math.max(0, logoScale)})`, textAlign: "center" }}>
        <div style={{
          fontSize: 82, fontFamily: playfair, fontWeight: 700, color: "#F0FFF0",
          textShadow: "0 4px 30px rgba(224,120,48,0.4)",
        }}>SmartMemory</div>
      </div>

      <div style={{ position: "absolute", top: 580, textAlign: "center", width: "100%" }}>
        <div style={{
          opacity: tagOp, transform: `translateY(${tagY}px)`,
          fontSize: 34, fontFamily: poppins, fontWeight: 600, color: "#e07830", letterSpacing: 3,
        }}>Your memories, intelligently organized</div>
        <div style={{
          opacity: subOp, fontSize: 22, fontFamily: poppins, fontWeight: 400,
          color: "rgba(200,240,220,0.6)", marginTop: 14,
        }}>Never lose a moment again</div>
      </div>
    </AbsoluteFill>
  );
};
