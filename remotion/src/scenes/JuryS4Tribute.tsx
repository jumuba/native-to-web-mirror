import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadPoppins } from "@remotion/google-fonts/Poppins";

const { fontFamily: playfair } = loadFont("normal", { weights: ["700"], subsets: ["latin"] });
const { fontFamily: poppins } = loadPoppins("normal", { weights: ["400", "600"], subsets: ["latin"] });

const familyMembers = [
  { label: "Mother", emoji: "👩", delay: 0 },
  { label: "Brothers", emoji: "👦", delay: 12 },
  { label: "Sisters", emoji: "👧", delay: 24 },
];

export const JuryS4Tribute = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1: "Imagine a child..." (0-100)
  const childOpacity = interpolate(frame, [5, 35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const childY = interpolate(frame, [5, 35], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const honourOpacity = interpolate(frame, [40, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const honourY = interpolate(frame, [40, 70], [25, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const phase1Fade = interpolate(frame, [95, 115], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Phase 2: Visual - gathering memories (110-200)
  const gatherVisible = frame > 105;
  const gatherIcons = ["📸", "🎵", "🎤", "📝"];

  // Phase 3: "Something truly meaningful" (190-260)
  const meaningfulOpacity = interpolate(frame, [195, 225], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const meaningfulFade = interpolate(frame, [255, 275], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Phase 4: "Share with family" (270-360)
  const shareOpacity = interpolate(frame, [275, 305], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const familyVisible = frame > 310;

  // Phase 5: "Feel and relive together" (360-440)
  const togetherOpacity = interpolate(frame, [365, 395], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const togetherGlow = interpolate(frame, [395, 450], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Phase 6: "Even if not in the same place" (440-510)
  const evenIfOpacity = interpolate(frame, [440, 470], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      {/* Subtle warm overlay for emotional tone */}
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse at center, rgba(212,168,83,${0.03 + interpolate(frame, [0, 510], [0, 0.05], { extrapolateRight: "clamp" })}) 0%, transparent 70%)`,
      }} />

      {/* Phase 1: Imagine text */}
      {frame < 120 && (
        <div style={{
          position: "absolute", textAlign: "center", width: "100%",
          opacity: phase1Fade,
        }}>
          <div style={{
            fontSize: 42, fontFamily: poppins, fontWeight: 400, color: "rgba(245,237,227,0.8)",
            opacity: childOpacity, transform: `translateY(${childY}px)`,
            marginBottom: 16,
          }}>
            Imagine a child
          </div>
          <div style={{
            fontSize: 48, fontFamily: playfair, fontWeight: 700, color: "#F5EDE3",
            opacity: honourOpacity, transform: `translateY(${honourY}px)`,
            lineHeight: 1.3,
          }}>
            honouring their father
            <br /><span style={{ color: "#D4A853", fontSize: 40 }}>who passed away</span>
          </div>
        </div>
      )}

      {/* Phase 2: Gathering icons */}
      {gatherVisible && frame < 270 && (
        <div style={{ position: "absolute", display: "flex", gap: 60, justifyContent: "center", width: "100%" }}>
          {gatherIcons.map((icon, i) => {
            const iconSpring = spring({ frame: frame - 115 - i * 12, fps, config: { damping: 12, stiffness: 80 } });
            const float = Math.sin((frame + i * 30) * 0.05) * 8;
            return (
              <div key={i} style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
                transform: `scale(${Math.max(0, iconSpring)}) translateY(${float}px)`,
              }}>
                <div style={{
                  width: 100, height: 100, borderRadius: 24,
                  background: "rgba(20,15,35,0.8)",
                  border: "1px solid rgba(212,168,83,0.2)",
                  display: "flex", justifyContent: "center", alignItems: "center",
                  fontSize: 48, boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
                }}>
                  {icon}
                </div>
                <div style={{
                  fontSize: 16, fontFamily: poppins, fontWeight: 600,
                  color: "rgba(245,237,227,0.5)", letterSpacing: 2, textTransform: "uppercase",
                }}>
                  {["Photos", "Music", "Voice", "Notes"][i]}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Phase 3: Meaningful text */}
      {frame > 185 && frame < 280 && (
        <div style={{
          position: "absolute", textAlign: "center", width: "100%",
          opacity: meaningfulOpacity * meaningfulFade,
        }}>
          <div style={{ fontSize: 46, fontFamily: playfair, fontWeight: 700, color: "#F5EDE3" }}>
            Creating something
            <br /><span style={{ color: "#D4A853" }}>truly meaningful</span>
          </div>
        </div>
      )}

      {/* Phase 4: Share with family */}
      {frame > 265 && frame < 400 && (
        <div style={{
          position: "absolute", textAlign: "center", width: "100%",
          opacity: shareOpacity,
        }}>
          <div style={{ fontSize: 38, fontFamily: poppins, fontWeight: 400, color: "rgba(245,237,227,0.7)", marginBottom: 30 }}>
            And instantly share it with
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 50 }}>
            {familyMembers.map((member, i) => {
              const memberSpring = spring({ frame: frame - 320 - member.delay, fps, config: { damping: 10 } });
              return (
                <div key={member.label} style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
                  transform: `scale(${Math.max(0, memberSpring)})`,
                }}>
                  <div style={{
                    width: 90, height: 90, borderRadius: "50%",
                    background: "rgba(212,168,83,0.15)",
                    border: "2px solid rgba(212,168,83,0.3)",
                    display: "flex", justifyContent: "center", alignItems: "center",
                    fontSize: 42,
                  }}>
                    {member.emoji}
                  </div>
                  <div style={{ fontSize: 20, fontFamily: poppins, fontWeight: 600, color: "#D4A853" }}>
                    {member.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Phase 5: Feel and relive together */}
      {frame > 355 && frame < 450 && (
        <div style={{
          position: "absolute", textAlign: "center", width: "100%",
          opacity: togetherOpacity,
        }}>
          <div style={{
            fontSize: 46, fontFamily: playfair, fontWeight: 700, color: "#F5EDE3",
            textShadow: `0 0 ${40 * togetherGlow}px rgba(212,168,83,${0.5 * togetherGlow})`,
            lineHeight: 1.4,
          }}>
            So they can all <span style={{ color: "#D4A853" }}>feel</span> and{" "}
            <span style={{ color: "#D4A853" }}>relive</span>
            <br />that moment together
          </div>
        </div>
      )}

      {/* Phase 6: Even if not in the same place */}
      {frame > 430 && (
        <div style={{
          position: "absolute", textAlign: "center", width: "100%",
          opacity: evenIfOpacity,
        }}>
          <div style={{
            fontSize: 34, fontFamily: poppins, fontWeight: 400, color: "rgba(245,237,227,0.6)",
            fontStyle: "italic",
          }}>
            even if they are not in the same place
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
