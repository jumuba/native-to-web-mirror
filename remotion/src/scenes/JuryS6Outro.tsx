import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadPoppins } from "@remotion/google-fonts/Poppins";

const { fontFamily: playfair } = loadFont("normal", { weights: ["700"], subsets: ["latin"] });
const { fontFamily: poppins } = loadPoppins("normal", { weights: ["400", "600"], subsets: ["latin"] });

export const JuryS6Outro = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1: "Spark doesn't just store memories" (0-80)
  const storeOpacity = interpolate(frame, [5, 35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const storeY = interpolate(frame, [5, 35], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const storeFade = interpolate(frame, [75, 95], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Phase 2: "It helps people..." (90-150)
  const helpsOpacity = interpolate(frame, [95, 120], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Phase 3: Feel, Share, Reconnect — one by one (130-220)
  const feelSpring = spring({ frame: frame - 135, fps, config: { damping: 12, stiffness: 100 } });
  const shareSpring = spring({ frame: frame - 160, fps, config: { damping: 12, stiffness: 100 } });
  const reconnectSpring = spring({ frame: frame - 185, fps, config: { damping: 12, stiffness: 100 } });

  const wordsPhase = frame > 125 && frame < 280;

  // Phase 4: "through them" (220-280)
  const throughOpacity = interpolate(frame, [225, 255], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const phase234Fade = interpolate(frame, [275, 300], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Phase 5: Logo (300-410)
  const logoScale = spring({ frame: frame - 305, fps, config: { damping: 15, stiffness: 80 } });
  const taglineOpacity = interpolate(frame, [340, 370], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const taglineY = interpolate(frame, [340, 370], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const finalGlow = interpolate(frame, [350, 410], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Sparkle particles for outro
  const sparkles = frame > 300;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      {/* Warm radial glow */}
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse at center, rgba(212,168,83,${0.02 + finalGlow * 0.06}) 0%, transparent 60%)`,
      }} />

      {/* Phase 1: Store text */}
      {frame < 100 && (
        <div style={{
          position: "absolute", textAlign: "center", width: "100%",
          opacity: storeOpacity * storeFade,
          transform: `translateY(${storeY}px)`,
        }}>
          <div style={{ fontSize: 42, fontFamily: poppins, fontWeight: 400, color: "rgba(245,237,227,0.7)", lineHeight: 1.5 }}>
            Spark doesn't just
            <br /><span style={{ fontWeight: 600, color: "#F5EDE3" }}>store memories</span>
          </div>
        </div>
      )}

      {/* Phase 2-4: It helps people feel, share, reconnect */}
      {wordsPhase && (
        <div style={{
          position: "absolute", textAlign: "center", width: "100%",
          opacity: helpsOpacity * phase234Fade,
        }}>
          <div style={{ fontSize: 32, fontFamily: poppins, fontWeight: 400, color: "rgba(245,237,227,0.5)", marginBottom: 40 }}>
            It helps people
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 60 }}>
            {[
              { word: "Feel", color: "#D4A853", spring: feelSpring },
              { word: "Share", color: "#E8735A", spring: shareSpring },
              { word: "Reconnect", color: "#F4A261", spring: reconnectSpring },
            ].map((item) => (
              <div key={item.word} style={{
                fontSize: 56, fontFamily: playfair, fontWeight: 700,
                color: item.color,
                transform: `scale(${Math.max(0, item.spring)})`,
                textShadow: `0 0 30px ${item.color}44`,
              }}>
                {item.word}
              </div>
            ))}
          </div>
          <div style={{
            fontSize: 30, fontFamily: poppins, fontWeight: 400,
            color: "rgba(245,237,227,0.5)", marginTop: 40,
            opacity: throughOpacity, fontStyle: "italic",
          }}>
            through them
          </div>
        </div>
      )}

      {/* Phase 5: Logo */}
      {frame > 295 && (
        <div style={{
          position: "absolute", textAlign: "center",
          transform: `scale(${Math.max(0, logoScale)})`,
        }}>
          <div style={{
            fontSize: 90, fontFamily: playfair, fontWeight: 700, color: "#F5EDE3",
            letterSpacing: -2,
            textShadow: `0 0 ${60 * finalGlow}px rgba(212,168,83,${0.4 * finalGlow}), 0 4px 20px rgba(0,0,0,0.3)`,
          }}>
            SmartMemory
          </div>
          <div style={{
            fontSize: 26, fontFamily: poppins, fontWeight: 400,
            color: "#D4A853", marginTop: 16, letterSpacing: 6,
            opacity: taglineOpacity,
            transform: `translateY(${taglineY}px)`,
          }}>
            YOUR MEMORIES, ALIVE.
          </div>
        </div>
      )}

      {/* Sparkles */}
      {sparkles && [0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const angle = (i / 8) * Math.PI * 2 + frame * 0.01;
        const radius = 300 + Math.sin(frame * 0.03 + i * 2) * 50;
        const sparkOpacity = interpolate(frame, [305, 330], [0, 0.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div key={i} style={{
            position: "absolute",
            left: 960 + Math.cos(angle) * radius,
            top: 540 + Math.sin(angle) * radius,
            width: 6, height: 6, borderRadius: "50%",
            background: "#D4A853",
            opacity: sparkOpacity * (0.3 + Math.sin(frame * 0.08 + i) * 0.3),
            boxShadow: "0 0 15px 5px rgba(212,168,83,0.3)",
          }} />
        );
      })}
    </AbsoluteFill>
  );
};
