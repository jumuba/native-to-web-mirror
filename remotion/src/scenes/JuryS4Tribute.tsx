import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadPoppins } from "@remotion/google-fonts/Poppins";

const { fontFamily: playfair } = loadFont("normal", { weights: ["700"], subsets: ["latin"] });
const { fontFamily: poppins } = loadPoppins("normal", { weights: ["400", "600"], subsets: ["latin"] });

export const JuryS4Tribute = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1: "Imagine a child..." (0-120)
  const childOpacity = interpolate(frame, [5, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const childY = interpolate(frame, [5, 40], [50, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const honourOpacity = interpolate(frame, [45, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const honourY = interpolate(frame, [45, 80], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const phase1Fade = interpolate(frame, [110, 130], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Phase 2: Father-child photo with cinematic reveal (120-220)
  const photoOpacity = interpolate(frame, [125, 160], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const photoScale = interpolate(frame, [125, 170], [0.9, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const kenBurns = interpolate(frame, [125, 600], [1.0, 1.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Phase 3: Gathering elements overlay (200-300)
  const gatherIcons = ["📸", "🎵", "🎤", "📝"];

  // Phase 4: "Something truly meaningful" (300-380)
  const meaningfulOpacity = interpolate(frame, [305, 340], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const meaningfulFade = interpolate(frame, [375, 395], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Phase 5: Family sharing - real photo (390-500)
  const familyPhotoOpacity = interpolate(frame, [395, 430], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const shareTextOpacity = interpolate(frame, [420, 450], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Phase 6: "Feel and relive together" (500-580)
  const togetherOpacity = interpolate(frame, [505, 540], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const togetherGlow = interpolate(frame, [540, 600], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Phase 7: "Even if not in the same place" (580-650)
  const evenIfOpacity = interpolate(frame, [585, 620], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      {/* Cinematic letterbox */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 80, background: "#0D1117", zIndex: 10 }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 80, background: "#0D1117", zIndex: 10 }} />

      {/* Warm emotional overlay */}
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse at center, rgba(212,168,83,${0.02 + interpolate(frame, [0, 650], [0, 0.06], { extrapolateRight: "clamp" })}) 0%, transparent 70%)`,
      }} />

      {/* Phase 1: Imagine text */}
      {frame < 135 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", zIndex: 5 }}>
          <div style={{ textAlign: "center", opacity: phase1Fade }}>
            <div style={{
              fontSize: 44, fontFamily: poppins, fontWeight: 400, color: "rgba(245,237,227,0.7)",
              opacity: childOpacity, transform: `translateY(${childY}px)`,
              marginBottom: 20,
            }}>
              Imagine a child
            </div>
            <div style={{
              fontSize: 52, fontFamily: playfair, fontWeight: 700, color: "#F5EDE3",
              opacity: honourOpacity, transform: `translateY(${honourY}px)`,
              lineHeight: 1.4,
            }}>
              honouring their father
              <br /><span style={{ color: "#D4A853", fontSize: 44 }}>who passed away</span>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* Phase 2: Father-child photo - cinematic reveal */}
      {frame > 120 && frame < 400 && (
        <div style={{
          position: "absolute", left: 560, top: 180,
          width: 800, height: 600,
          borderRadius: 20,
          overflow: "hidden",
          opacity: photoOpacity,
          transform: `scale(${photoScale})`,
          boxShadow: "0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,168,83,0.15)",
        }}>
          <Img
            src={staticFile("images/father-child.jpg")}
            style={{
              width: "100%", height: "100%",
              objectFit: "cover",
              transform: `scale(${kenBurns})`,
              filter: `sepia(0.15) brightness(0.9)`,
            }}
          />
          {/* Emotional vignette */}
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse at center, transparent 40%, rgba(13,17,23,0.6) 100%)",
          }} />
        </div>
      )}

      {/* Phase 3: Gathering icons */}
      {frame > 195 && frame < 400 && (
        <div style={{
          position: "absolute", left: 100, top: 300,
          display: "flex", flexDirection: "column", gap: 30,
        }}>
          {gatherIcons.map((icon, i) => {
            const iconSpring = spring({ frame: frame - 205 - i * 15, fps, config: { damping: 12, stiffness: 80 } });
            const float = Math.sin((frame + i * 30) * 0.04) * 6;
            return (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 16,
                transform: `scale(${Math.max(0, iconSpring)}) translateY(${float}px) translateX(${(1 - Math.max(0, iconSpring)) * -80}px)`,
              }}>
                <div style={{
                  width: 70, height: 70, borderRadius: 18,
                  background: "rgba(15,12,28,0.9)",
                  border: "1px solid rgba(212,168,83,0.2)",
                  display: "flex", justifyContent: "center", alignItems: "center",
                  fontSize: 34, boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
                }}>
                  {icon}
                </div>
                <div style={{
                  fontSize: 18, fontFamily: poppins, fontWeight: 600,
                  color: "rgba(245,237,227,0.6)", letterSpacing: 2,
                }}>
                  {["Photos", "Music", "Voice", "Notes"][i]}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Phase 4: Meaningful text */}
      {frame > 295 && frame < 400 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", zIndex: 5 }}>
          <div style={{
            textAlign: "center",
            opacity: meaningfulOpacity * meaningfulFade,
          }}>
            <div style={{
              fontSize: 52, fontFamily: playfair, fontWeight: 700, color: "#F5EDE3",
              textShadow: "0 4px 30px rgba(0,0,0,0.5)",
            }}>
              Creating something
              <br /><span style={{ color: "#D4A853" }}>truly meaningful</span>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* Phase 5: Family sharing photo */}
      {frame > 390 && frame < 600 && (
        <>
          <div style={{
            position: "absolute", left: 460, top: 160,
            width: 1000, height: 650,
            borderRadius: 24,
            overflow: "hidden",
            opacity: familyPhotoOpacity,
            boxShadow: "0 40px 100px rgba(0,0,0,0.6)",
          }}>
            <Img
              src={staticFile("images/family-sharing.jpg")}
              style={{
                width: "100%", height: "100%",
                objectFit: "cover",
                transform: `scale(${interpolate(frame, [395, 600], [1.0, 1.08], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
                filter: "brightness(0.85) contrast(1.05)",
              }}
            />
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to top, rgba(13,17,23,0.7) 0%, transparent 50%)",
            }} />
          </div>
          <div style={{
            position: "absolute", left: 480, bottom: 180, zIndex: 5,
            opacity: shareTextOpacity,
          }}>
            <div style={{
              fontSize: 36, fontFamily: poppins, fontWeight: 600, color: "#F5EDE3",
              textShadow: "0 2px 20px rgba(0,0,0,0.8)",
              lineHeight: 1.5,
            }}>
              And instantly share it with
              <br /><span style={{ color: "#D4A853" }}>their mother, brothers, and sisters</span>
            </div>
          </div>
        </>
      )}

      {/* Phase 6: Feel and relive together */}
      {frame > 495 && frame < 590 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", zIndex: 5 }}>
          <div style={{ textAlign: "center", opacity: togetherOpacity }}>
            <div style={{
              fontSize: 52, fontFamily: playfair, fontWeight: 700, color: "#F5EDE3",
              textShadow: `0 0 ${50 * togetherGlow}px rgba(212,168,83,${0.6 * togetherGlow}), 0 4px 30px rgba(0,0,0,0.5)`,
              lineHeight: 1.5,
            }}>
              So they can all <span style={{ color: "#D4A853" }}>feel</span> and{" "}
              <span style={{ color: "#D4A853" }}>relive</span>
              <br />that moment together
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* Phase 7: Even if not in the same place */}
      {frame > 580 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", zIndex: 5 }}>
          <div style={{ textAlign: "center", opacity: evenIfOpacity }}>
            <div style={{
              fontSize: 36, fontFamily: poppins, fontWeight: 400, color: "rgba(245,237,227,0.5)",
              fontStyle: "italic",
              textShadow: "0 2px 20px rgba(0,0,0,0.5)",
            }}>
              even if they are not in the same place
            </div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
