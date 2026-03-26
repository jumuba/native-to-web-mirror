import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadPoppins } from "@remotion/google-fonts/Poppins";

const { fontFamily: playfair } = loadFont("normal", { weights: ["700"], subsets: ["latin"] });
const { fontFamily: poppins } = loadPoppins("normal", { weights: ["400", "600"], subsets: ["latin"] });

export const JuryS5Instant = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1: "Take a photo" (0-60)
  const takeOpacity = interpolate(frame, [5, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const takeY = interpolate(frame, [5, 25], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Flash effect (30-40)
  const flashOpacity = interpolate(frame, [30, 35, 40], [0, 0.6, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Phase 2: Photo card appears (40-90)
  const photoScale = spring({ frame: frame - 40, fps, config: { damping: 12, stiffness: 100 } });
  const photoVisible = frame > 38;

  // Phase 3: Message + emoji attach (90-140)
  const messageSpring = spring({ frame: frame - 90, fps, config: { damping: 10, stiffness: 80 } });
  const emojiSpring = spring({ frame: frame - 110, fps, config: { damping: 8, stiffness: 100 } });

  // Phase 4: Send animation (140-200)
  const sendProgress = interpolate(frame, [150, 200], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Phase 5: "A simple photo becomes an emotional moment" (200-300)
  const finalOpacity = interpolate(frame, [210, 240], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const finalScale = interpolate(frame, [210, 250], [0.9, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const finalGlow = interpolate(frame, [250, 300], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Photo float
  const photoFloat = Math.sin(frame * 0.05) * 5;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      {/* Flash */}
      <AbsoluteFill style={{
        background: "white",
        opacity: flashOpacity,
      }} />

      {/* Phase 1: Take a photo text */}
      {frame < 80 && (
        <div style={{
          position: "absolute", top: 140, textAlign: "center", width: "100%",
          opacity: takeOpacity, transform: `translateY(${takeY}px)`,
        }}>
          <div style={{ fontSize: 28, fontFamily: poppins, fontWeight: 400, color: "rgba(245,237,227,0.5)", letterSpacing: 6, textTransform: "uppercase", marginBottom: 16 }}>
            Imagine
          </div>
          <div style={{ fontSize: 48, fontFamily: playfair, fontWeight: 700, color: "#F5EDE3" }}>
            Taking a photo 📸
          </div>
        </div>
      )}

      {/* Phase 2: Photo card */}
      {photoVisible && (
        <div style={{
          position: "absolute",
          transform: `scale(${Math.max(0, photoScale) * (1 - sendProgress * 0.3)}) translateY(${photoFloat - sendProgress * 400}px) rotate(${sendProgress * 5}deg)`,
          opacity: 1 - sendProgress,
        }}>
          <div style={{
            width: 400, height: 400,
            borderRadius: 20,
            background: "linear-gradient(135deg, #E8735A 0%, #D4A853 50%, #F4A261 100%)",
            boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
            display: "flex", justifyContent: "center", alignItems: "center",
          }}>
            <div style={{ fontSize: 80 }}>📷</div>
          </div>

          {/* Message bubble */}
          {frame > 88 && (
            <div style={{
              position: "absolute", right: -180, bottom: 60,
              background: "rgba(20,15,35,0.9)",
              borderRadius: 20, padding: "14px 24px",
              border: "1px solid rgba(212,168,83,0.3)",
              transform: `scale(${Math.max(0, messageSpring)})`,
              boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
            }}>
              <div style={{ fontSize: 20, fontFamily: poppins, color: "#F5EDE3", fontWeight: 400 }}>
                Thinking of you 💛
              </div>
            </div>
          )}

          {/* Emoji reaction */}
          {frame > 108 && (
            <div style={{
              position: "absolute", left: -60, top: -30,
              fontSize: 56,
              transform: `scale(${Math.max(0, emojiSpring)})`,
            }}>
              ❤️
            </div>
          )}
        </div>
      )}

      {/* Send particles */}
      {frame > 148 && sendProgress > 0 && (
        [0, 1, 2, 3, 4, 5].map((i) => {
          const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
          const dist = sendProgress * 300;
          return (
            <div key={i} style={{
              position: "absolute",
              left: 960 + Math.cos(angle) * dist,
              top: 540 + Math.sin(angle) * dist - sendProgress * 100,
              width: 8, height: 8, borderRadius: "50%",
              background: "#D4A853",
              opacity: 1 - sendProgress,
              boxShadow: "0 0 15px 5px rgba(212,168,83,0.4)",
            }} />
          );
        })
      )}

      {/* Phase 5: Final text */}
      {frame > 200 && (
        <div style={{
          position: "absolute", textAlign: "center", width: "100%",
          opacity: finalOpacity, transform: `scale(${finalScale})`,
        }}>
          <div style={{
            fontSize: 46, fontFamily: playfair, fontWeight: 700, color: "#F5EDE3",
            lineHeight: 1.4,
            textShadow: `0 0 ${40 * finalGlow}px rgba(212,168,83,${0.5 * finalGlow})`,
          }}>
            A simple photo becomes
            <br />an <span style={{ color: "#D4A853" }}>emotional moment</span>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
