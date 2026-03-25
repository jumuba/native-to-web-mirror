import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile } from "remotion";
import { loadFont } from "@remotion/google-fonts/Poppins";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";

const { fontFamily: poppins } = loadFont("normal", { weights: ["400", "600", "700"], subsets: ["latin"] });
const { fontFamily: playfair } = loadPlayfair("normal", { weights: ["700"], subsets: ["latin"] });

export const Scene6Share = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const imgScale = spring({ frame, fps, config: { damping: 15, stiffness: 80 } });

  // Typewriter for the Facebook message
  const fullMsg = '"Thank you Stephanie for the gift" ❤️';
  const msgChars = Math.min(
    Math.floor(interpolate(frame, [40, 80], [0, fullMsg.length], { extrapolateRight: "clamp", extrapolateLeft: "clamp" })),
    fullMsg.length
  );
  const typedMsg = fullMsg.slice(0, msgChars);

  // CTA at the end
  const ctaOpacity = interpolate(frame, [85, 105], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const ctaScale = spring({ frame: frame - 85, fps, config: { damping: 12 } });

  // Floating hearts
  const heartOpacity = interpolate(frame, [50, 70], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      {/* Floating hearts */}
      {frame > 50 &&
        [0, 1, 2, 3, 4].map((i) => {
          const y = interpolate(frame, [50, 110], [800, 100 + i * 120], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
          const x = 200 + i * 350 + Math.sin((frame + i * 30) * 0.06) * 40;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x,
                top: y,
                fontSize: 40,
                opacity: heartOpacity * 0.6,
              }}
            >
              💜
            </div>
          );
        })}

      {/* Facebook share image */}
      <div
        style={{
          position: "absolute",
          left: 100,
          width: 850,
          height: 780,
          borderRadius: 30,
          overflow: "hidden",
          transform: `scale(${imgScale})`,
          boxShadow: "0 30px 80px rgba(0,0,0,0.35)",
        }}
      >
        <Img src={staticFile("images/scene5-sharing.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>

      {/* Right side text */}
      <div
        style={{
          position: "absolute",
          right: 80,
          top: 180,
          width: 750,
          opacity: interpolate(frame, [15, 40], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" }),
          transform: `translateY(${interpolate(frame, [15, 40], [30, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" })}px)`,
        }}
      >
        <div style={{ fontSize: 20, fontFamily: poppins, fontWeight: 600, color: "#C4B5E0", letterSpacing: 4, marginBottom: 16 }}>
          SHARED ON FACEBOOK
        </div>
        <div
          style={{
            fontSize: 34,
            fontFamily: poppins,
            fontWeight: 400,
            color: "#E8DEFF",
            lineHeight: 1.5,
            fontStyle: "italic",
            minHeight: 100,
          }}
        >
          {typedMsg}
          {frame < 82 && frame % 16 < 10 && <span style={{ color: "#7B5EA7" }}>|</span>}
        </div>
      </div>

      {/* Final CTA / brand */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          textAlign: "center",
          width: "100%",
          opacity: ctaOpacity,
          transform: `scale(${Math.max(0, ctaScale)})`,
        }}
      >
        <div style={{ fontSize: 56, fontFamily: playfair, fontWeight: 700, color: "#F5F0FF", textShadow: "0 4px 30px rgba(86,101,201,0.5)" }}>
          SmartMemory
        </div>
        <div style={{ fontSize: 24, fontFamily: poppins, fontWeight: 400, color: "rgba(196,181,224,0.7)", marginTop: 8 }}>
          Memories that move people
        </div>
      </div>
    </AbsoluteFill>
  );
};
