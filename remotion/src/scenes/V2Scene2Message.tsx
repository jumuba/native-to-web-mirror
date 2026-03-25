import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile } from "remotion";
import { loadFont } from "@remotion/google-fonts/Poppins";

const { fontFamily: poppins } = loadFont("normal", { weights: ["400", "600", "700"], subsets: ["latin"] });

export const V2Scene2Message = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const imgScale = spring({ frame, fps, config: { damping: 15, stiffness: 100 } });

  // Typewriter: "Love you Mum ❤️"
  const fullText = "Love you Mum ❤️";
  const chars = Math.min(
    Math.floor(interpolate(frame, [40, 70], [0, fullText.length], { extrapolateRight: "clamp", extrapolateLeft: "clamp" })),
    fullText.length
  );
  const typed = fullText.slice(0, chars);
  const cursorOn = frame % 16 < 10 && frame > 38 && frame < 75;

  // Emoji pop
  const emojiScale = spring({ frame: frame - 72, fps, config: { damping: 8, stiffness: 120 } });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      {/* Phone with message */}
      <div
        style={{
          width: 950,
          height: 850,
          borderRadius: 30,
          overflow: "hidden",
          transform: `scale(${imgScale})`,
          boxShadow: "0 40px 100px rgba(0,0,0,0.4)",
        }}
      >
        <Img src={staticFile("images/v2-scene2-message.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>

      {/* Text overlay */}
      <div
        style={{
          position: "absolute",
          right: 60,
          top: 140,
          width: 700,
          opacity: interpolate(frame, [15, 35], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" }),
          transform: `translateY(${interpolate(frame, [15, 35], [30, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" })}px)`,
        }}
      >
        <div style={{ fontSize: 22, fontFamily: poppins, fontWeight: 600, color: "rgba(255,220,180,0.8)", letterSpacing: 4, textTransform: "uppercase", marginBottom: 14 }}>
          Add a personal touch
        </div>
        <div style={{ fontSize: 48, fontFamily: poppins, fontWeight: 700, color: "#FFF5EB", lineHeight: 1.2, marginBottom: 30 }}>
          Write a message
          <br />or add an emoji
        </div>
      </div>

      {/* Typed message bubble */}
      <div
        style={{
          position: "absolute",
          left: 120,
          bottom: 100,
          background: "rgba(45,27,61,0.85)",
          borderRadius: 20,
          padding: "20px 36px",
          border: "1px solid rgba(232,168,124,0.3)",
          boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
        }}
      >
        <span style={{ fontSize: 32, fontFamily: poppins, fontWeight: 600, color: "#FFF5EB", fontStyle: "italic" }}>
          "{typed}
          {cursorOn && <span style={{ color: "#e8a87c" }}>|</span>}
          "
        </span>
      </div>

      {/* Big floating emoji */}
      {frame > 72 && (
        <div
          style={{
            position: "absolute",
            right: 200,
            bottom: 180,
            fontSize: 90,
            transform: `scale(${Math.max(0, emojiScale)})`,
          }}
        >
          ❤️
        </div>
      )}
    </AbsoluteFill>
  );
};
