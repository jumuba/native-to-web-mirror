import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile } from "remotion";
import { loadFont } from "@remotion/google-fonts/Poppins";

const { fontFamily: poppins } = loadFont("normal", { weights: ["400", "600", "700"], subsets: ["latin"] });

export const Scene2Create = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const imgScale = spring({ frame, fps, config: { damping: 15, stiffness: 80 } });
  const imgX = interpolate(frame, [0, 40], [-200, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  const textOpacity = interpolate(frame, [25, 50], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const textY = interpolate(frame, [25, 50], [50, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  const badgeScale = spring({ frame: frame - 55, fps, config: { damping: 10 } });

  // Typing effect for "Birthday"
  const fullText = '"Birthday"';
  const chars = Math.min(Math.floor(interpolate(frame, [60, 85], [0, fullText.length], { extrapolateRight: "clamp", extrapolateLeft: "clamp" })), fullText.length);
  const typedText = fullText.slice(0, chars);
  const cursorVisible = frame % 16 < 10 && frame > 58;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      {/* Left: illustration */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 80,
          width: 850,
          height: 900,
          borderRadius: 30,
          overflow: "hidden",
          transform: `scale(${imgScale}) translateX(${imgX}px)`,
          boxShadow: "0 30px 80px rgba(0,0,0,0.3)",
        }}
      >
        <Img src={staticFile("images/scene1-creating.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>

      {/* Right: text */}
      <div
        style={{
          position: "absolute",
          right: 100,
          top: 200,
          width: 780,
          opacity: textOpacity,
          transform: `translateY(${textY}px)`,
        }}
      >
        <div
          style={{
            fontSize: 20,
            fontFamily: poppins,
            fontWeight: 600,
            color: "#C4B5E0",
            letterSpacing: 5,
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          Step 1
        </div>
        <div
          style={{
            fontSize: 52,
            fontFamily: poppins,
            fontWeight: 700,
            color: "#F5F0FF",
            lineHeight: 1.2,
            marginBottom: 24,
          }}
        >
          Stephanie creates
          <br />a new album
        </div>
        <div
          style={{
            fontSize: 28,
            fontFamily: poppins,
            fontWeight: 400,
            color: "rgba(196,181,224,0.8)",
            lineHeight: 1.5,
          }}
        >
          She names it{" "}
          <span style={{ color: "#E8DEFF", fontWeight: 600 }}>
            {typedText}
            {cursorVisible && <span style={{ color: "#7B5EA7" }}>|</span>}
          </span>
        </div>

        {/* Badge */}
        {frame > 55 && (
          <div
            style={{
              marginTop: 40,
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              background: "rgba(86,101,201,0.3)",
              borderRadius: 50,
              padding: "12px 28px",
              transform: `scale(${Math.max(0, badgeScale)})`,
              border: "1px solid rgba(196,181,224,0.3)",
            }}
          >
            <span style={{ fontSize: 30 }}>🎂</span>
            <span style={{ fontSize: 22, fontFamily: poppins, color: "#E8DEFF", fontWeight: 600 }}>
              Birthday Album
            </span>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
