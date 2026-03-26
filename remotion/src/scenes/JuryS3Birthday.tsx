import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadPoppins } from "@remotion/google-fonts/Poppins";

const { fontFamily: playfair } = loadFont("normal", { weights: ["700"], subsets: ["latin"] });
const { fontFamily: poppins } = loadPoppins("normal", { weights: ["400", "600"], subsets: ["latin"] });

const enrichments = [
  { icon: "🎵", label: "Music", delay: 0 },
  { icon: "🎤", label: "Voice Note", delay: 15 },
  { icon: "💌", label: "Personal Message", delay: 30 },
];

export const JuryS3Birthday = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1: "Imagine creating a birthday memory" (0-80)
  const titleOpacity = interpolate(frame, [5, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [5, 30], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titleFade = interpolate(frame, [70, 90], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Phase 2: Album card appears (80-140)
  const albumScale = spring({ frame: frame - 80, fps, config: { damping: 15, stiffness: 80 } });
  const albumVisible = frame > 75;

  // Phase 3: Enrichment badges fly in (140-220)
  const enrichmentsVisible = frame > 130;

  // Phase 4: "The person receives it, feels it" (230-310)
  const receivesOpacity = interpolate(frame, [230, 260], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const receivesY = interpolate(frame, [230, 260], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Phase 5: "A real emotional experience" (300-380)
  const emotionalOpacity = interpolate(frame, [300, 330], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const emotionalScale = interpolate(frame, [300, 340], [0.9, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const emotionalGlow = interpolate(frame, [330, 380], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Album float
  const albumFloat = Math.sin(frame * 0.04) * 6;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      {/* Phase 1: Title */}
      {frame < 95 && (
        <div style={{
          position: "absolute", textAlign: "center", width: "100%",
          opacity: titleOpacity * titleFade,
          transform: `translateY(${titleY}px)`,
        }}>
          <div style={{ fontSize: 28, fontFamily: poppins, fontWeight: 400, color: "rgba(245,237,227,0.5)", letterSpacing: 6, textTransform: "uppercase", marginBottom: 20 }}>
            Imagine
          </div>
          <div style={{ fontSize: 52, fontFamily: playfair, fontWeight: 700, color: "#F5EDE3", lineHeight: 1.3 }}>
            Creating a <span style={{ color: "#D4A853" }}>birthday memory</span>
          </div>
        </div>
      )}

      {/* Phase 2: Album card */}
      {albumVisible && (
        <div style={{
          position: "absolute", left: 260, top: 160 + albumFloat,
          width: 500, height: 620,
          borderRadius: 24,
          background: "linear-gradient(160deg, #1E1428 0%, #2A1F3D 50%, #1A1428 100%)",
          border: "1px solid rgba(212,168,83,0.2)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(212,168,83,0.1)",
          transform: `scale(${Math.max(0, albumScale)})`,
          display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
          padding: 40,
        }}>
          <div style={{ fontSize: 80, marginBottom: 20 }}>🎂</div>
          <div style={{ fontSize: 36, fontFamily: playfair, fontWeight: 700, color: "#F5EDE3", textAlign: "center", marginBottom: 10 }}>
            Birthday
          </div>
          <div style={{ fontSize: 18, fontFamily: poppins, fontWeight: 400, color: "rgba(245,237,227,0.4)" }}>
            Memory Album
          </div>

          {/* Photo grid inside card */}
          <div style={{ display: "flex", gap: 8, marginTop: 30, flexWrap: "wrap", justifyContent: "center" }}>
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const colors = ["#E8735A", "#D4A853", "#5B8C6E", "#7B5EA7", "#5665C9", "#C97B5A"];
              const photoScale = spring({ frame: frame - 95 - i * 5, fps, config: { damping: 12 } });
              return (
                <div key={i} style={{
                  width: 70, height: 70, borderRadius: 8,
                  background: `linear-gradient(135deg, ${colors[i]}, ${colors[i]}88)`,
                  transform: `scale(${Math.max(0, photoScale)})`,
                }} />
              );
            })}
          </div>
        </div>
      )}

      {/* Phase 3: Enrichment badges */}
      {enrichmentsVisible && enrichments.map((item, i) => {
        const badgeSpring = spring({ frame: frame - 140 - item.delay, fps, config: { damping: 10, stiffness: 80 } });
        const positions = [
          { right: 200, top: 220 },
          { right: 160, top: 420 },
          { right: 220, top: 600 },
        ];
        return (
          <div key={item.label} style={{
            position: "absolute", ...positions[i],
            transform: `scale(${Math.max(0, badgeSpring)}) translateX(${(1 - Math.max(0, badgeSpring)) * 100}px)`,
            background: "rgba(20,15,35,0.85)",
            borderRadius: 60, padding: "18px 36px",
            display: "flex", alignItems: "center", gap: 14,
            border: "1px solid rgba(212,168,83,0.2)",
            boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
          }}>
            <span style={{ fontSize: 36 }}>{item.icon}</span>
            <span style={{ fontSize: 24, fontFamily: poppins, color: "#F5EDE3", fontWeight: 600 }}>{item.label}</span>
          </div>
        );
      })}

      {/* Phase 4: Receives text */}
      {frame > 220 && frame < 310 && (
        <div style={{
          position: "absolute", right: 120, bottom: 160, textAlign: "right",
          opacity: receivesOpacity, transform: `translateY(${receivesY}px)`,
        }}>
          <div style={{ fontSize: 38, fontFamily: poppins, fontWeight: 600, color: "#F5EDE3", lineHeight: 1.4 }}>
            The person receives it,
            <br /><span style={{ color: "#D4A853" }}>feels it</span>, and shares it
          </div>
        </div>
      )}

      {/* Phase 5: Emotional experience */}
      {frame > 290 && (
        <div style={{
          position: "absolute", textAlign: "center", width: "100%",
          opacity: emotionalOpacity,
          transform: `scale(${emotionalScale})`,
        }}>
          <div style={{
            fontSize: 52, fontFamily: playfair, fontWeight: 700, color: "#F5EDE3",
            textShadow: `0 0 ${50 * emotionalGlow}px rgba(212,168,83,${0.6 * emotionalGlow})`,
          }}>
            A real <span style={{ color: "#D4A853" }}>emotional experience</span>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
