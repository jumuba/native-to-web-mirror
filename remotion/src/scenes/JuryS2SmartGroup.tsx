import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadPoppins } from "@remotion/google-fonts/Poppins";

const { fontFamily: playfair } = loadFont("normal", { weights: ["700"], subsets: ["latin"] });
const { fontFamily: poppins } = loadPoppins("normal", { weights: ["400", "600"], subsets: ["latin"] });

const PHOTO_COLORS = [
  "#E8735A", "#D4A853", "#5B8C6E", "#7B5EA7", "#5665C9", "#C97B5A",
  "#E8A87C", "#6D8BA4", "#A85C6B", "#8B9D6B", "#D4A853", "#7B8FA8",
];

export const JuryS2SmartGroup = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1: "Imagine" text (0-80)
  const imagineOpacity = interpolate(frame, [5, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const imagineY = interpolate(frame, [5, 30], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const imagineFade = interpolate(frame, [70, 90], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Phase 2: Scattered photos appear (80-160)
  const photosVisible = frame > 70;

  // Phase 3: "Mixed randomly" text (140-200)
  const mixedOpacity = interpolate(frame, [130, 155], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const mixedFade = interpolate(frame, [200, 220], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Phase 4: Photos reorganize (220-300)
  const organizeProgress = interpolate(frame, [220, 300], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Phase 5: "Spark groups them" text (280-380)
  const sparkOpacity = interpolate(frame, [280, 310], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Scattered positions
  const scatteredPositions = PHOTO_COLORS.map((_, i) => ({
    x: 200 + (i % 4) * 420 + Math.sin(i * 3.7) * 120,
    y: 150 + Math.floor(i / 4) * 320 + Math.cos(i * 2.3) * 80,
    rotation: Math.sin(i * 1.5) * 25,
    scale: 0.7 + Math.sin(i * 2) * 0.2,
  }));

  // Organized positions (neat 4x3 grid)
  const organizedPositions = PHOTO_COLORS.map((_, i) => ({
    x: 520 + (i % 4) * 240,
    y: 220 + Math.floor(i / 4) * 240,
    rotation: 0,
    scale: 1,
  }));

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      {/* Phase 1: Imagine text */}
      {frame < 90 && (
        <div style={{
          position: "absolute", textAlign: "center", width: "100%",
          opacity: imagineOpacity * imagineFade,
          transform: `translateY(${imagineY}px)`,
        }}>
          <div style={{ fontSize: 28, fontFamily: poppins, fontWeight: 400, color: "rgba(245,237,227,0.5)", letterSpacing: 6, textTransform: "uppercase", marginBottom: 20 }}>
            Imagine
          </div>
          <div style={{ fontSize: 52, fontFamily: playfair, fontWeight: 700, color: "#F5EDE3", lineHeight: 1.3 }}>
            You attend an event
            <br /><span style={{ color: "#D4A853" }}>across several days</span>
          </div>
        </div>
      )}

      {/* Phase 2-4: Photos */}
      {photosVisible && PHOTO_COLORS.map((color, i) => {
        const delay = i * 3;
        const appearProgress = spring({ frame: frame - 75 - delay, fps, config: { damping: 15, stiffness: 100 } });
        const scattered = scatteredPositions[i];
        const organized = organizedPositions[i];

        const x = interpolate(organizeProgress, [0, 1], [scattered.x, organized.x]);
        const y = interpolate(organizeProgress, [0, 1], [scattered.y, organized.y]);
        const rotation = interpolate(organizeProgress, [0, 1], [scattered.rotation, organized.rotation]);
        const scale = interpolate(organizeProgress, [0, 1], [scattered.scale, organized.scale]);

        // Subtle float when scattered
        const floatX = organizeProgress < 1 ? Math.sin((frame + i * 20) * 0.04) * 5 * (1 - organizeProgress) : 0;
        const floatY = organizeProgress < 1 ? Math.cos((frame + i * 15) * 0.035) * 4 * (1 - organizeProgress) : 0;

        return (
          <div key={i} style={{
            position: "absolute",
            left: x + floatX, top: y + floatY,
            width: 180, height: 180,
            borderRadius: 12,
            background: `linear-gradient(135deg, ${color}, ${color}aa)`,
            transform: `scale(${Math.max(0, appearProgress) * scale}) rotate(${rotation}deg)`,
            boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
            border: organizeProgress > 0.8 ? "2px solid rgba(212,168,83,0.3)" : "none",
          }} />
        );
      })}

      {/* Phase 3: Mixed randomly text */}
      {frame > 120 && frame < 230 && (
        <div style={{
          position: "absolute", bottom: 80, textAlign: "center", width: "100%",
          opacity: mixedOpacity * mixedFade,
        }}>
          <div style={{ fontSize: 36, fontFamily: poppins, fontWeight: 600, color: "#E8735A" }}>
            Your photos are all mixed randomly
          </div>
        </div>
      )}

      {/* Phase 5: Spark groups text */}
      {frame > 270 && (
        <div style={{
          position: "absolute", bottom: 60, textAlign: "center", width: "100%",
          opacity: sparkOpacity,
        }}>
          <div style={{ fontSize: 24, fontFamily: poppins, fontWeight: 400, color: "rgba(245,237,227,0.5)", letterSpacing: 4, textTransform: "uppercase", marginBottom: 12 }}>
            Spark
          </div>
          <div style={{ fontSize: 40, fontFamily: playfair, fontWeight: 700, color: "#F5EDE3" }}>
            Groups them into <span style={{ color: "#D4A853" }}>one meaningful moment</span>
          </div>
        </div>
      )}

      {/* Organize glow effect */}
      {organizeProgress > 0.5 && (
        <div style={{
          position: "absolute",
          left: 520, top: 220, width: 960, height: 720,
          borderRadius: 24,
          border: `2px solid rgba(212,168,83,${(organizeProgress - 0.5) * 0.4})`,
          boxShadow: `0 0 ${60 * (organizeProgress - 0.5)}px rgba(212,168,83,${(organizeProgress - 0.5) * 0.15})`,
          pointerEvents: "none",
        }} />
      )}
    </AbsoluteFill>
  );
};
