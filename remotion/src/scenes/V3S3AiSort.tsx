import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile } from "remotion";
import { loadFont } from "@remotion/google-fonts/Poppins";

const { fontFamily: poppins } = loadFont("normal", { weights: ["400", "600", "700"], subsets: ["latin"] });

export const V3S3AiSort: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const imgScale = spring({ frame, fps, config: { damping: 15, stiffness: 80 } });

  // Scanning line
  const scanY = interpolate(frame, [15, 80], [-50, 830], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const scanOp = interpolate(frame, [15, 20, 75, 80], [0, 1, 1, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  // Processing dots animation
  const dotCount = Math.floor((frame / 10) % 4);

  // Done checkmark
  const doneOp = interpolate(frame, [90, 100], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const doneScale = spring({ frame: frame - 90, fps, config: { damping: 10 } });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      {/* AI brain image */}
      <div style={{
        width: 1000, height: 750, borderRadius: 30, overflow: "hidden",
        transform: `scale(${imgScale})`, position: "relative",
        boxShadow: "0 30px 80px rgba(0,0,0,0.4)",
      }}>
        <Img src={staticFile("images/v3-scene3-sorting.jpg")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        {/* Scan line */}
        <div style={{
          position: "absolute", left: 0, right: 0, top: scanY, height: 3,
          background: "linear-gradient(90deg, transparent, #00ffa0, transparent)",
          opacity: scanOp,
          boxShadow: "0 0 20px 8px rgba(0,255,160,0.3)",
        }} />
      </div>

      {/* Top title */}
      <div style={{
        position: "absolute", top: 50, textAlign: "center", width: "100%",
        opacity: interpolate(frame, [8, 30], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" }),
      }}>
        <div style={{ fontSize: 22, fontFamily: poppins, fontWeight: 600, color: "#00ffa0", letterSpacing: 5, textTransform: "uppercase", marginBottom: 10 }}>
          SmartMemory AI
        </div>
        <div style={{ fontSize: 44, fontFamily: poppins, fontWeight: 700, color: "#F0FFF0", lineHeight: 1.2 }}>
          Recognizes & groups your
          <br />Backed photos automatically
        </div>
      </div>

      {/* Processing / Done indicator */}
      <div style={{
        position: "absolute", bottom: 50, textAlign: "center", width: "100%",
      }}>
        {frame < 90 ? (
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 12,
            background: "rgba(0,30,30,0.7)", borderRadius: 50,
            padding: "14px 32px", border: "1px solid rgba(0,255,160,0.2)",
            opacity: interpolate(frame, [20, 35], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" }),
          }}>
            <span style={{ fontSize: 22, fontFamily: poppins, fontWeight: 600, color: "#00ffa0" }}>
              🧠 Grouping by event{".".repeat(dotCount)}
            </span>
          </div>
        ) : (
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 12,
            background: "rgba(0,60,30,0.7)", borderRadius: 50,
            padding: "14px 32px", border: "1px solid rgba(0,255,160,0.4)",
            opacity: doneOp, transform: `scale(${Math.max(0, doneScale)})`,
          }}>
            <span style={{ fontSize: 22, fontFamily: poppins, fontWeight: 600, color: "#00ffa0" }}>
              ✅ 47 Backed photos found & grouped!
            </span>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
