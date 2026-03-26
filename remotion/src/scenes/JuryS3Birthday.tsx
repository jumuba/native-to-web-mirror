import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadPoppins } from "@remotion/google-fonts/Poppins";

const { fontFamily: playfair } = loadFont("normal", { weights: ["700"], subsets: ["latin"] });
const { fontFamily: poppins } = loadPoppins("normal", { weights: ["400", "600"], subsets: ["latin"] });

const enrichments = [
  { icon: "🎵", label: "Music", color: "#E8735A" },
  { icon: "🎤", label: "Voice Note", color: "#D4A853" },
  { icon: "💌", label: "Personal Message", color: "#F4A261" },
];

export const JuryS3Birthday = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1: Title (0-100)
  const titleOpacity = interpolate(frame, [5, 35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [5, 35], [50, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titleFade = interpolate(frame, [90, 110], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Phase 2: Album card with real photo (100-180)
  const albumScale = spring({ frame: frame - 100, fps, config: { damping: 15, stiffness: 70 } });
  const albumVisible = frame > 95;

  // Phase 3: Enrichment badges fly in (180-280)
  const enrichmentsVisible = frame > 170;

  // Phase 4: "The person receives it, feels it" (280-370)
  const receivesOpacity = interpolate(frame, [285, 315], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const receivesY = interpolate(frame, [285, 315], [40, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Phase 5: "A real emotional experience" (370-470)
  const emotionalOpacity = interpolate(frame, [375, 405], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const emotionalScale = interpolate(frame, [375, 420], [0.85, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const emotionalGlow = interpolate(frame, [405, 470], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const albumFloat = Math.sin(frame * 0.03) * 6;
  const kenBurns = interpolate(frame, [100, 470], [1.0, 1.12], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      {/* Cinematic letterbox */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 80, background: "#0D1117", zIndex: 10 }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 80, background: "#0D1117", zIndex: 10 }} />

      {/* Phase 1: Title */}
      {frame < 115 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", zIndex: 5 }}>
          <div style={{
            textAlign: "center",
            opacity: titleOpacity * titleFade,
            transform: `translateY(${titleY}px)`,
          }}>
            <div style={{ fontSize: 24, fontFamily: poppins, fontWeight: 400, color: "rgba(245,237,227,0.4)", letterSpacing: 8, textTransform: "uppercase", marginBottom: 24 }}>
              Imagine
            </div>
            <div style={{ fontSize: 54, fontFamily: playfair, fontWeight: 700, color: "#F5EDE3", lineHeight: 1.4 }}>
              Creating a <span style={{ color: "#D4A853" }}>birthday memory</span>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* Phase 2: Album card with real birthday photo */}
      {albumVisible && frame < 380 && (
        <div style={{
          position: "absolute", left: 200, top: 150 + albumFloat,
          width: 550, height: 650,
          borderRadius: 28,
          background: "linear-gradient(160deg, #1A1020 0%, #221830 50%, #1A1020 100%)",
          border: "1px solid rgba(212,168,83,0.25)",
          boxShadow: "0 40px 100px rgba(0,0,0,0.6), inset 0 1px 0 rgba(212,168,83,0.1)",
          transform: `scale(${Math.max(0, albumScale)})`,
          overflow: "hidden",
          display: "flex", flexDirection: "column",
        }}>
          {/* Real birthday photo */}
          <div style={{ width: "100%", height: 380, overflow: "hidden" }}>
            <Img
              src={staticFile("images/birthday-celebration.jpg")}
              style={{
                width: "100%", height: "100%",
                objectFit: "cover",
                transform: `scale(${kenBurns})`,
              }}
            />
          </div>
          <div style={{ padding: "28px 32px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ fontSize: 14, fontFamily: poppins, fontWeight: 600, color: "#D4A853", letterSpacing: 4, textTransform: "uppercase", marginBottom: 10 }}>
              Memory Album
            </div>
            <div style={{ fontSize: 32, fontFamily: playfair, fontWeight: 700, color: "#F5EDE3" }}>
              Happy Birthday 🎂
            </div>
            <div style={{ fontSize: 16, fontFamily: poppins, fontWeight: 400, color: "rgba(245,237,227,0.4)", marginTop: 8 }}>
              12 photos · 3 enrichments
            </div>
          </div>
        </div>
      )}

      {/* Phase 3: Enrichment badges */}
      {enrichmentsVisible && frame < 380 && enrichments.map((item, i) => {
        const badgeSpring = spring({ frame: frame - 180 - i * 20, fps, config: { damping: 10, stiffness: 70 } });
        const positions = [
          { right: 180, top: 240 },
          { right: 140, top: 430 },
          { right: 200, top: 620 },
        ];
        const floatY = Math.sin((frame + i * 40) * 0.04) * 5;
        return (
          <div key={item.label} style={{
            position: "absolute", ...positions[i],
            transform: `scale(${Math.max(0, badgeSpring)}) translateX(${(1 - Math.max(0, badgeSpring)) * 120}px) translateY(${floatY}px)`,
            background: "rgba(15,12,28,0.9)",
            borderRadius: 60, padding: "20px 40px",
            display: "flex", alignItems: "center", gap: 16,
            border: `1px solid ${item.color}44`,
            boxShadow: `0 12px 50px rgba(0,0,0,0.5), 0 0 30px ${item.color}15`,
          }}>
            <span style={{ fontSize: 38 }}>{item.icon}</span>
            <span style={{ fontSize: 22, fontFamily: poppins, color: "#F5EDE3", fontWeight: 600 }}>{item.label}</span>
          </div>
        );
      })}

      {/* Phase 4: Receives text */}
      {frame > 270 && frame < 380 && (
        <div style={{
          position: "absolute", right: 100, bottom: 160, textAlign: "right", zIndex: 5,
          opacity: receivesOpacity, transform: `translateY(${receivesY}px)`,
        }}>
          <div style={{
            fontSize: 38, fontFamily: poppins, fontWeight: 600, color: "#F5EDE3", lineHeight: 1.5,
            textShadow: "0 2px 20px rgba(0,0,0,0.8)",
          }}>
            The person receives it,
            <br /><span style={{ color: "#D4A853" }}>feels it</span>, and shares it
          </div>
        </div>
      )}

      {/* Phase 5: Emotional experience */}
      {frame > 365 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", zIndex: 5 }}>
          <div style={{
            textAlign: "center",
            opacity: emotionalOpacity,
            transform: `scale(${emotionalScale})`,
          }}>
            <div style={{
              fontSize: 58, fontFamily: playfair, fontWeight: 700, color: "#F5EDE3",
              textShadow: `0 0 ${60 * emotionalGlow}px rgba(212,168,83,${0.7 * emotionalGlow}), 0 4px 30px rgba(0,0,0,0.5)`,
              lineHeight: 1.4,
            }}>
              A real <span style={{ color: "#D4A853" }}>emotional experience</span>
            </div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
