import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadPoppins } from "@remotion/google-fonts/Poppins";

const { fontFamily: playfair } = loadFont("normal", { weights: ["700"], subsets: ["latin"] });
const { fontFamily: poppins } = loadPoppins("normal", { weights: ["400", "600"], subsets: ["latin"] });

export const JuryS1Hook = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const line1Opacity = interpolate(frame, [10, 35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line1Y = interpolate(frame, [10, 35], [40, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const line2Opacity = interpolate(frame, [30, 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line2Y = interpolate(frame, [30, 55], [40, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const glowIntensity = interpolate(frame, [55, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Floating particles
  const particles = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
    const angle = (i / 8) * Math.PI * 2 + frame * 0.008;
    const radius = 350 + Math.sin(frame * 0.03 + i * 2) * 40;
    const opacity = interpolate(frame, [5, 30], [0, 0.4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return { x: 960 + Math.cos(angle) * radius, y: 540 + Math.sin(angle) * radius, opacity: opacity * (0.3 + Math.sin(frame * 0.06 + i) * 0.3) };
  });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      {/* Particles */}
      {particles.map((p, i) => (
        <div key={i} style={{
          position: "absolute", left: p.x, top: p.y,
          width: 6, height: 6, borderRadius: "50%",
          background: "#D4A853", opacity: p.opacity,
          boxShadow: "0 0 20px 8px rgba(212,168,83,0.3)",
        }} />
      ))}

      {/* Main text */}
      <div style={{ textAlign: "center" }}>
        <div style={{
          fontSize: 56, fontFamily: poppins, fontWeight: 400, color: "rgba(245,237,227,0.7)",
          opacity: line1Opacity, transform: `translateY(${line1Y}px)`,
          letterSpacing: 2,
        }}>
          What if your memories
        </div>
        <div style={{
          fontSize: 72, fontFamily: playfair, fontWeight: 700, color: "#F5EDE3",
          opacity: line2Opacity, transform: `translateY(${line2Y}px)`,
          marginTop: 16,
          textShadow: `0 0 ${40 * glowIntensity}px rgba(212,168,83,${0.5 * glowIntensity})`,
        }}>
          could do more?
        </div>
      </div>
    </AbsoluteFill>
  );
};
