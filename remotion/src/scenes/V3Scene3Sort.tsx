import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile } from "remotion";
import { loadFont } from "@remotion/google-fonts/Poppins";

const { fontFamily: poppins } = loadFont("normal", { weights: ["400", "600", "700"], subsets: ["latin"] });

export const V3Scene3Sort = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const imgScale = spring({ frame, fps, config: { damping: 15, stiffness: 80 } });

  // Scanning line effect
  const scanY = interpolate(frame, [20, 80], [-50, 1130], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const scanOpacity = interpolate(frame, [20, 25, 75, 80], [0, 1, 1, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  // Processing dots
  const dots = Math.floor(interpolate(frame, [30, 90], [0, 3], { extrapolateRight: "clamp", extrapolateLeft: "clamp" }));

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      {/* AI brain sorting image */}
      <div style={{
        width: 1050, height: 780, borderRadius: 30, overflow: "hidden",
        transform: `scale(${imgScale})`,
        boxShadow: "0 30px 80px rgba(0,0,0,0.4)",
        position: "relative",
      }}>
        <Img src={staticFile("images/v3-scene3-sorting.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        {/* Scanning line */}
        <div style={{
          position: "absolute", left: 0, right: 0, top: scanY, height: 3,
          background: "linear-gradient(90deg, transparent, #00ffa0, transparent)",
          opacity: scanOpacity,
          boxShadow: "0 0 20px 8px rgba(0,255,160,0.3)",
        }} />
      </div>

      {/* Text top */}
      <div style={{
        position: "absolute", top: 60, textAlign: "center", width: "100%",
        opacity: interpolate(frame, [10, 35], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" }),
      }}>
        <div style={{ fontSize: 22, fontFamily: poppins, fontWeight: 600, color: "#00ffa0", letterSpacing: 5, textTransform: "uppercase", marginBottom: 10 }}>
          SmartMemory AI
        </div>
        <div style={{ fontSize: 46, fontFamily: poppins, fontWeight: 700, color: "#F0FFF0", lineHeight: 1.2 }}>
          Automatically groups your
          <br />Backed photos together
        </div>
      </div>

      {/* Processing indicator */}
      <div style={{
        position: "absolute", bottom: 60, textAlign: "center", width: "100%",
        opacity: interpolate(frame, [25, 40], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" }),
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 12,
          background: "rgba(0,30,30,0.7)", borderRadius: 50,
          padding: "14px 32px", border: "1px solid rgba(0,255,160,0.2)",
        }}>
          <span style={{ fontSize: 22, fontFamily: poppins, fontWeight: 600, color: "#00ffa0" }}>
            🧠 Analyzing{".".repeat(dots)}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
