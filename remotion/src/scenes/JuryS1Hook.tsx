import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadPoppins } from "@remotion/google-fonts/Poppins";

const { fontFamily: playfair } = loadFont("normal", { weights: ["700"], subsets: ["latin"] });
const { fontFamily: poppins } = loadPoppins("normal", { weights: ["400", "600"], subsets: ["latin"] });

const IMAGES = [
  "images/event-friends.jpg",
  "images/birthday-celebration.jpg",
  "images/father-child.jpg",
  "images/family-sharing.jpg",
  "images/couple-selfie.jpg",
  "images/landscape.jpg",
];

export const JuryS1Hook = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Slow cinematic photo montage in background with ken burns
  const bgOpacity = interpolate(frame, [0, 40], [0, 0.25], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bgScale = interpolate(frame, [0, 150], [1.05, 1.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bgIndex = Math.floor(frame / 50) % IMAGES.length;

  // Text animations - slower, more dramatic
  const line1Opacity = interpolate(frame, [20, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line1Y = interpolate(frame, [20, 50], [60, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const line2Opacity = interpolate(frame, [55, 85], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line2Y = interpolate(frame, [55, 85], [60, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const glowIntensity = interpolate(frame, [85, 140], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Cinematic letterbox bars
  const barHeight = interpolate(frame, [0, 30], [120, 80], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      {/* Background photo with ken burns */}
      <AbsoluteFill style={{ opacity: bgOpacity }}>
        <Img
          src={staticFile(IMAGES[bgIndex])}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${bgScale})`,
            filter: "blur(8px) saturate(0.6)",
          }}
        />
      </AbsoluteFill>

      {/* Dark vignette overlay */}
      <AbsoluteFill style={{
        background: "radial-gradient(ellipse at center, rgba(13,17,23,0.5) 0%, rgba(13,17,23,0.9) 70%)",
      }} />

      {/* Cinematic letterbox bars */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: barHeight, background: "#0D1117" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: barHeight, background: "#0D1117" }} />

      {/* Main text */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            fontSize: 48, fontFamily: poppins, fontWeight: 400, color: "rgba(245,237,227,0.6)",
            opacity: line1Opacity, transform: `translateY(${line1Y}px)`,
            letterSpacing: 3,
          }}>
            What if your memories
          </div>
          <div style={{
            fontSize: 80, fontFamily: playfair, fontWeight: 700, color: "#F5EDE3",
            opacity: line2Opacity, transform: `translateY(${line2Y}px)`,
            marginTop: 20,
            textShadow: `0 0 ${60 * glowIntensity}px rgba(212,168,83,${0.6 * glowIntensity}), 0 4px 30px rgba(0,0,0,0.5)`,
          }}>
            could do <span style={{ color: "#D4A853" }}>more</span>?
          </div>
        </div>
      </AbsoluteFill>

      {/* Floating light particles */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const pOpacity = interpolate(frame, [10 + i * 5, 40 + i * 5], [0, 0.4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const pY = 200 + i * 140 - frame * (0.3 + i * 0.1);
        const pX = 300 + i * 280 + Math.sin(frame * 0.02 + i * 2) * 50;
        return (
          <div key={i} style={{
            position: "absolute", left: pX, top: pY,
            width: 4 + i * 1, height: 4 + i * 1, borderRadius: "50%",
            background: "#D4A853",
            opacity: pOpacity * (0.3 + Math.sin(frame * 0.06 + i) * 0.3),
            boxShadow: "0 0 20px 8px rgba(212,168,83,0.2)",
          }} />
        );
      })}
    </AbsoluteFill>
  );
};
