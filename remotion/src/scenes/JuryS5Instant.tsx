import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadPoppins } from "@remotion/google-fonts/Poppins";

const { fontFamily: playfair } = loadFont("normal", { weights: ["700"], subsets: ["latin"] });
const { fontFamily: poppins } = loadPoppins("normal", { weights: ["400", "600"], subsets: ["latin"] });

export const JuryS5Instant = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1: "Taking a photo" (0-70)
  const takeOpacity = interpolate(frame, [5, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const takeY = interpolate(frame, [5, 30], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Flash (35-50)
  const flashOpacity = interpolate(frame, [35, 40, 48], [0, 0.7, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Phase 2: Real photo card (50-120)
  const photoScale = spring({ frame: frame - 50, fps, config: { damping: 14, stiffness: 90 } });
  const photoVisible = frame > 48;

  // Phase 3: Message + emoji (120-170)
  const messageSpring = spring({ frame: frame - 120, fps, config: { damping: 10, stiffness: 80 } });
  const emojiSpring = spring({ frame: frame - 145, fps, config: { damping: 8, stiffness: 100 } });

  // Phase 4: Send animation (170-230)
  const sendProgress = interpolate(frame, [180, 230], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Phase 5: Person receiving - real photo (230-320)
  const receiveOpacity = interpolate(frame, [235, 265], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const receiveScale = interpolate(frame, [235, 275], [0.9, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Phase 6: Final text (320-420)
  const finalOpacity = interpolate(frame, [325, 355], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const finalScale = interpolate(frame, [325, 365], [0.85, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const finalGlow = interpolate(frame, [365, 420], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const photoFloat = Math.sin(frame * 0.04) * 5;

  return (
    <AbsoluteFill>
      {/* Cinematic letterbox */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 80, background: "#0D1117", zIndex: 10 }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 80, background: "#0D1117", zIndex: 10 }} />

      {/* Flash */}
      <AbsoluteFill style={{ background: "white", opacity: flashOpacity, zIndex: 8 }} />

      {/* Phase 1: Take a photo text */}
      {frame < 90 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", zIndex: 5 }}>
          <div style={{
            textAlign: "center",
            opacity: takeOpacity, transform: `translateY(${takeY}px)`,
          }}>
            <div style={{ fontSize: 24, fontFamily: poppins, fontWeight: 400, color: "rgba(245,237,227,0.4)", letterSpacing: 8, textTransform: "uppercase", marginBottom: 20 }}>
              And finally
            </div>
            <div style={{ fontSize: 52, fontFamily: playfair, fontWeight: 700, color: "#F5EDE3" }}>
              Taking a photo 📸
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* Phase 2: Real photo card with couple selfie */}
      {photoVisible && frame < 240 && (
        <div style={{
          position: "absolute", left: 660, top: 240 + photoFloat,
          transform: `scale(${Math.max(0, photoScale) * (1 - sendProgress * 0.3)}) translateY(${-sendProgress * 500}px) rotate(${sendProgress * 5}deg)`,
          opacity: 1 - sendProgress,
        }}>
          <div style={{
            width: 500, height: 500,
            borderRadius: 24,
            overflow: "hidden",
            boxShadow: "0 30px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)",
          }}>
            <Img
              src={staticFile("images/couple-selfie.jpg")}
              style={{
                width: "100%", height: "100%",
                objectFit: "cover",
              }}
            />
          </div>

          {/* Message bubble */}
          {frame > 118 && (
            <div style={{
              position: "absolute", right: -200, bottom: 80,
              background: "rgba(15,12,28,0.95)",
              borderRadius: 24, padding: "16px 28px",
              border: "1px solid rgba(212,168,83,0.3)",
              transform: `scale(${Math.max(0, messageSpring)})`,
              boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
            }}>
              <div style={{ fontSize: 22, fontFamily: poppins, color: "#F5EDE3", fontWeight: 400 }}>
                Thinking of you 💛
              </div>
            </div>
          )}

          {/* Emoji */}
          {frame > 143 && (
            <div style={{
              position: "absolute", left: -50, top: -30,
              fontSize: 60,
              transform: `scale(${Math.max(0, emojiSpring)})`,
            }}>
              ❤️
            </div>
          )}
        </div>
      )}

      {/* Send particles */}
      {frame > 178 && sendProgress > 0 && sendProgress < 1 && (
        [0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
          const dist = sendProgress * 400;
          return (
            <div key={i} style={{
              position: "absolute",
              left: 910 + Math.cos(angle) * dist,
              top: 490 + Math.sin(angle) * dist - sendProgress * 150,
              width: 6, height: 6, borderRadius: "50%",
              background: "#D4A853",
              opacity: (1 - sendProgress) * 0.7,
              boxShadow: "0 0 20px 8px rgba(212,168,83,0.3)",
            }} />
          );
        })
      )}

      {/* Phase 5: Person receiving */}
      {frame > 230 && frame < 330 && (
        <div style={{
          position: "absolute", left: 460, top: 140,
          width: 1000, height: 700,
          borderRadius: 24,
          overflow: "hidden",
          opacity: receiveOpacity,
          transform: `scale(${receiveScale})`,
          boxShadow: "0 40px 100px rgba(0,0,0,0.6)",
        }}>
          <Img
            src={staticFile("images/instant-receive.jpg")}
            style={{
              width: "100%", height: "100%",
              objectFit: "cover",
              transform: `scale(${interpolate(frame, [235, 330], [1.0, 1.06], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
            }}
          />
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse at center, transparent 30%, rgba(13,17,23,0.5) 100%)",
          }} />
        </div>
      )}

      {/* Phase 6: Final text */}
      {frame > 320 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", zIndex: 5 }}>
          <div style={{
            textAlign: "center",
            opacity: finalOpacity, transform: `scale(${finalScale})`,
          }}>
            <div style={{
              fontSize: 52, fontFamily: playfair, fontWeight: 700, color: "#F5EDE3",
              lineHeight: 1.5,
              textShadow: `0 0 ${50 * finalGlow}px rgba(212,168,83,${0.6 * finalGlow}), 0 4px 30px rgba(0,0,0,0.5)`,
            }}>
              A simple photo becomes
              <br />an <span style={{ color: "#D4A853" }}>emotional moment</span>
            </div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
