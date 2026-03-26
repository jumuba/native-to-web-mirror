import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadPoppins } from "@remotion/google-fonts/Poppins";

const { fontFamily: playfair } = loadFont("normal", { weights: ["700"], subsets: ["latin"] });
const { fontFamily: poppins } = loadPoppins("normal", { weights: ["400", "600"], subsets: ["latin"] });

const MONTAGE_IMAGES = [
  "images/event-friends.jpg",
  "images/birthday-celebration.jpg",
  "images/father-child.jpg",
  "images/family-sharing.jpg",
  "images/couple-selfie.jpg",
];

export const JuryS6Outro = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1: "Spark doesn't just store memories" (0-100)
  const storeOpacity = interpolate(frame, [5, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const storeY = interpolate(frame, [5, 40], [40, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const storeFade = interpolate(frame, [90, 110], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Phase 2: "It helps people..." with Feel/Share/Reconnect (110-260)
  const helpsOpacity = interpolate(frame, [115, 140], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const feelSpring = spring({ frame: frame - 150, fps, config: { damping: 12, stiffness: 100 } });
  const shareSpring = spring({ frame: frame - 175, fps, config: { damping: 12, stiffness: 100 } });
  const reconnectSpring = spring({ frame: frame - 200, fps, config: { damping: 12, stiffness: 100 } });
  const phase2Fade = interpolate(frame, [280, 310], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Phase 3: Photo montage (260-380)
  const montageVisible = frame > 255 && frame < 400;

  // Phase 4: Logo reveal (380-500)
  const logoScale = spring({ frame: frame - 390, fps, config: { damping: 15, stiffness: 70 } });
  const taglineOpacity = interpolate(frame, [430, 460], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const taglineY = interpolate(frame, [430, 460], [25, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const finalGlow = interpolate(frame, [440, 500], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      {/* Cinematic letterbox */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 80, background: "#0D1117", zIndex: 10 }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 80, background: "#0D1117", zIndex: 10 }} />

      {/* Warm radial glow */}
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse at center, rgba(212,168,83,${0.02 + finalGlow * 0.08}) 0%, transparent 60%)`,
      }} />

      {/* Phase 1: Store text */}
      {frame < 115 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", zIndex: 5 }}>
          <div style={{
            textAlign: "center",
            opacity: storeOpacity * storeFade,
            transform: `translateY(${storeY}px)`,
          }}>
            <div style={{ fontSize: 44, fontFamily: poppins, fontWeight: 400, color: "rgba(245,237,227,0.7)", lineHeight: 1.6 }}>
              Spark doesn't just
              <br /><span style={{ fontWeight: 600, color: "#F5EDE3" }}>store memories</span>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* Phase 2: Feel, Share, Reconnect */}
      {frame > 108 && frame < 320 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", zIndex: 5 }}>
          <div style={{ textAlign: "center", opacity: helpsOpacity * phase2Fade }}>
            <div style={{ fontSize: 30, fontFamily: poppins, fontWeight: 400, color: "rgba(245,237,227,0.4)", marginBottom: 50 }}>
              It helps people
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 80 }}>
              {[
                { word: "Feel", color: "#D4A853", spring: feelSpring },
                { word: "Share", color: "#E8735A", spring: shareSpring },
                { word: "Reconnect", color: "#F4A261", spring: reconnectSpring },
              ].map((item) => (
                <div key={item.word} style={{
                  fontSize: 64, fontFamily: playfair, fontWeight: 700,
                  color: item.color,
                  transform: `scale(${Math.max(0, item.spring)})`,
                  textShadow: `0 0 40px ${item.color}55, 0 4px 20px rgba(0,0,0,0.3)`,
                }}>
                  {item.word}
                </div>
              ))}
            </div>
            <div style={{
              fontSize: 28, fontFamily: poppins, fontWeight: 400,
              color: "rgba(245,237,227,0.4)", marginTop: 50,
              opacity: interpolate(frame, [220, 250], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
              fontStyle: "italic",
            }}>
              through them
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* Phase 3: Photo montage */}
      {montageVisible && MONTAGE_IMAGES.map((img, i) => {
        const montageSpring = spring({ frame: frame - 265 - i * 10, fps, config: { damping: 14, stiffness: 80 } });
        const positions = [
          { x: 160, y: 200, w: 350, h: 280 },
          { x: 560, y: 160, w: 380, h: 300 },
          { x: 1000, y: 220, w: 340, h: 260 },
          { x: 300, y: 530, w: 400, h: 300 },
          { x: 760, y: 560, w: 360, h: 280 },
        ];
        const pos = positions[i];
        const montageFade = interpolate(frame, [380, 400], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div key={i} style={{
            position: "absolute",
            left: pos.x, top: pos.y,
            width: pos.w, height: pos.h,
            borderRadius: 16,
            overflow: "hidden",
            transform: `scale(${Math.max(0, montageSpring)}) rotate(${Math.sin(i * 2) * 4}deg)`,
            opacity: montageFade,
            boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(212,168,83,0.15)",
          }}>
            <Img
              src={staticFile(img)}
              style={{
                width: "100%", height: "100%",
                objectFit: "cover",
                transform: `scale(${interpolate(frame, [265, 400], [1.0, 1.06], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
              }}
            />
          </div>
        );
      })}

      {/* Phase 4: Logo */}
      {frame > 380 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", zIndex: 5 }}>
          <div style={{
            textAlign: "center",
            transform: `scale(${Math.max(0, logoScale)})`,
          }}>
            <div style={{
              fontSize: 100, fontFamily: playfair, fontWeight: 700, color: "#F5EDE3",
              letterSpacing: -3,
              textShadow: `0 0 ${80 * finalGlow}px rgba(212,168,83,${0.5 * finalGlow}), 0 4px 30px rgba(0,0,0,0.4)`,
            }}>
              SmartMemory
            </div>
            <div style={{
              fontSize: 28, fontFamily: poppins, fontWeight: 400,
              color: "#D4A853", marginTop: 20, letterSpacing: 8,
              opacity: taglineOpacity,
              transform: `translateY(${taglineY}px)`,
            }}>
              YOUR MEMORIES, ALIVE.
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* Sparkles */}
      {frame > 385 && [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => {
        const angle = (i / 10) * Math.PI * 2 + frame * 0.008;
        const radius = 320 + Math.sin(frame * 0.025 + i * 2) * 60;
        const sparkOpacity = interpolate(frame, [390, 420], [0, 0.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div key={i} style={{
            position: "absolute",
            left: 960 + Math.cos(angle) * radius,
            top: 540 + Math.sin(angle) * radius,
            width: 5, height: 5, borderRadius: "50%",
            background: "#D4A853",
            opacity: sparkOpacity * (0.2 + Math.sin(frame * 0.07 + i) * 0.3),
            boxShadow: "0 0 20px 8px rgba(212,168,83,0.25)",
          }} />
        );
      })}
    </AbsoluteFill>
  );
};
