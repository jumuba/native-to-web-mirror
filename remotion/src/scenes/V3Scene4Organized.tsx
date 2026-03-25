import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile } from "remotion";
import { loadFont } from "@remotion/google-fonts/Poppins";

const { fontFamily: poppins } = loadFont("normal", { weights: ["400", "600", "700"], subsets: ["latin"] });

export const V3Scene4Organized = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phoneScale = spring({ frame, fps, config: { damping: 12, stiffness: 80 } });

  // Typewriter for folder name
  const fullName = "Backed";
  const chars = Math.min(
    Math.floor(interpolate(frame, [55, 75], [0, fullName.length], { extrapolateRight: "clamp", extrapolateLeft: "clamp" })),
    fullName.length
  );
  const typed = fullName.slice(0, chars);
  const cursorOn = frame % 16 < 10 && frame > 53 && frame < 78;

  const checkScale = spring({ frame: frame - 80, fps, config: { damping: 8 } });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      {/* Phone with organized events */}
      <div style={{
        position: "absolute", right: 60,
        width: 880, height: 900, borderRadius: 30, overflow: "hidden",
        transform: `scale(${phoneScale})`,
        boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
      }}>
        <Img src={staticFile("images/v3-scene4-phone-organized.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>

      {/* Left side text */}
      <div style={{
        position: "absolute", left: 80, top: 160, width: 700,
        opacity: interpolate(frame, [15, 40], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" }),
        transform: `translateY(${interpolate(frame, [15, 40], [40, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" })}px)`,
      }}>
        <div style={{ fontSize: 22, fontFamily: poppins, fontWeight: 600, color: "#00ffa0", letterSpacing: 4, textTransform: "uppercase", marginBottom: 14 }}>
          ✅ Grouped by event
        </div>
        <div style={{ fontSize: 48, fontFamily: poppins, fontWeight: 700, color: "#F0FFF0", lineHeight: 1.2, marginBottom: 24 }}>
          All Backed photos
          <br />in one place
        </div>
        <div style={{ fontSize: 24, fontFamily: poppins, fontWeight: 400, color: "rgba(200,240,220,0.7)", lineHeight: 1.5, marginBottom: 8 }}>
          Rename the folder:
        </div>

        {/* Folder name input */}
        <div style={{
          marginTop: 16, display: "inline-flex", alignItems: "center", gap: 12,
          background: "rgba(0,30,30,0.75)", borderRadius: 14,
          padding: "16px 28px", border: "1px solid rgba(224,120,48,0.4)",
          minWidth: 250,
        }}>
          <span style={{ fontSize: 30 }}>📁</span>
          <span style={{ fontSize: 30, fontFamily: poppins, fontWeight: 700, color: "#e07830" }}>
            {typed}
            {cursorOn && <span style={{ color: "#00ffa0" }}>|</span>}
          </span>
        </div>

        {frame > 80 && (
          <div style={{
            marginTop: 20, transform: `scale(${Math.max(0, checkScale)})`,
            fontSize: 22, fontFamily: poppins, fontWeight: 600, color: "#00ffa0",
          }}>
            ✓ Folder renamed successfully!
          </div>
        )}
      </div>

      {/* Satisfaction emoji */}
      {frame > 85 && (
        <div style={{
          position: "absolute", left: 350, bottom: 100,
          fontSize: 70,
          transform: `scale(${Math.max(0, spring({ frame: frame - 85, fps, config: { damping: 8 } }))})`,
        }}>
          😍
        </div>
      )}
    </AbsoluteFill>
  );
};
