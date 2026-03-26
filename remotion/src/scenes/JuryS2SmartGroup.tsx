import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadPoppins } from "@remotion/google-fonts/Poppins";

const { fontFamily: playfair } = loadFont("normal", { weights: ["700"], subsets: ["latin"] });
const { fontFamily: poppins } = loadPoppins("normal", { weights: ["400", "600"], subsets: ["latin"] });

// Real photos: event photos mixed with random daily photos
const PHOTOS = [
  { src: "images/event-friends.jpg", isEvent: true },
  { src: "images/food-photo.jpg", isEvent: false },
  { src: "images/landscape.jpg", isEvent: false },
  { src: "images/event-friends.jpg", isEvent: true },
  { src: "images/dog-photo.jpg", isEvent: false },
  { src: "images/couple-selfie.jpg", isEvent: false },
  { src: "images/event-friends.jpg", isEvent: true },
  { src: "images/birthday-celebration.jpg", isEvent: false },
  { src: "images/event-friends.jpg", isEvent: true },
];

export const JuryS2SmartGroup = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1: "Imagine" text (0-100)
  const imagineOpacity = interpolate(frame, [5, 35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const imagineY = interpolate(frame, [5, 35], [40, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const imagineFade = interpolate(frame, [90, 110], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Phase 2: Camera roll - scattered photos (100-200)
  const photosVisible = frame > 90;

  // Phase 3: "Mixed randomly" text (180-260)
  const mixedOpacity = interpolate(frame, [180, 210], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const mixedFade = interpolate(frame, [260, 280], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Phase 4: Photos reorganize - event photos group, others fade (280-380)
  const organizeProgress = interpolate(frame, [280, 380], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Phase 5: "Spark groups them" text (360-500)
  const sparkOpacity = interpolate(frame, [370, 400], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Scattered positions (camera roll style grid)
  const scatteredPositions = PHOTOS.map((_, i) => ({
    x: 280 + (i % 3) * 460 + Math.sin(i * 3.7) * 40,
    y: 140 + Math.floor(i / 3) * 280 + Math.cos(i * 2.3) * 30,
    rotation: Math.sin(i * 1.5) * 8,
    scale: 0.85,
  }));

  // Organized: event photos center, others shrink away
  const organizedPositions = PHOTOS.map((photo, i) => {
    if (photo.isEvent) {
      const eventIndex = PHOTOS.slice(0, i + 1).filter(p => p.isEvent).length - 1;
      return {
        x: 500 + (eventIndex % 2) * 480,
        y: 280 + Math.floor(eventIndex / 2) * 380,
        rotation: 0,
        scale: 1.1,
      };
    }
    return {
      x: scatteredPositions[i].x,
      y: scatteredPositions[i].y,
      rotation: scatteredPositions[i].rotation + 20,
      scale: 0,
    };
  });

  return (
    <AbsoluteFill>
      {/* Cinematic letterbox */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 80, background: "#0D1117", zIndex: 10 }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 80, background: "#0D1117", zIndex: 10 }} />

      {/* Phase 1: Imagine text */}
      {frame < 115 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", zIndex: 5 }}>
          <div style={{
            textAlign: "center",
            opacity: imagineOpacity * imagineFade,
            transform: `translateY(${imagineY}px)`,
          }}>
            <div style={{ fontSize: 24, fontFamily: poppins, fontWeight: 400, color: "rgba(245,237,227,0.4)", letterSpacing: 8, textTransform: "uppercase", marginBottom: 24 }}>
              Imagine
            </div>
            <div style={{ fontSize: 54, fontFamily: playfair, fontWeight: 700, color: "#F5EDE3", lineHeight: 1.4 }}>
              You attend an event
              <br /><span style={{ color: "#D4A853" }}>across several days</span>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* Phase 2-4: Real photos */}
      {photosVisible && PHOTOS.map((photo, i) => {
        const delay = i * 4;
        const appearProgress = spring({ frame: frame - 100 - delay, fps, config: { damping: 15, stiffness: 80 } });
        const scattered = scatteredPositions[i];
        const organized = organizedPositions[i];

        const x = interpolate(organizeProgress, [0, 1], [scattered.x, organized.x]);
        const y = interpolate(organizeProgress, [0, 1], [scattered.y, organized.y]);
        const rotation = interpolate(organizeProgress, [0, 1], [scattered.rotation, organized.rotation]);
        const scale = interpolate(organizeProgress, [0, 1], [scattered.scale, organized.scale]);

        const floatX = organizeProgress < 1 ? Math.sin((frame + i * 20) * 0.03) * 4 * (1 - organizeProgress) : 0;
        const floatY = organizeProgress < 1 ? Math.cos((frame + i * 15) * 0.025) * 3 * (1 - organizeProgress) : 0;

        const isGlowing = photo.isEvent && organizeProgress > 0.6;

        return (
          <div key={i} style={{
            position: "absolute",
            left: x + floatX, top: y + floatY,
            width: 260, height: 200,
            borderRadius: 16,
            overflow: "hidden",
            transform: `scale(${Math.max(0, appearProgress) * scale}) rotate(${rotation}deg)`,
            boxShadow: isGlowing
              ? "0 12px 50px rgba(212,168,83,0.4), 0 0 0 2px rgba(212,168,83,0.5)"
              : "0 8px 30px rgba(0,0,0,0.5)",
          }}>
            <Img
              src={staticFile(photo.src)}
              style={{
                width: "100%", height: "100%",
                objectFit: "cover",
                filter: !photo.isEvent && organizeProgress > 0.3
                  ? `grayscale(${organizeProgress * 0.8}) brightness(${1 - organizeProgress * 0.5})`
                  : "none",
              }}
            />
          </div>
        );
      })}

      {/* Phase 3: Mixed randomly text */}
      {frame > 170 && frame < 290 && (
        <div style={{
          position: "absolute", bottom: 120, textAlign: "center", width: "100%", zIndex: 5,
          opacity: mixedOpacity * mixedFade,
        }}>
          <div style={{
            fontSize: 36, fontFamily: poppins, fontWeight: 600, color: "#E8735A",
            textShadow: "0 2px 20px rgba(0,0,0,0.8)",
          }}>
            Your photos are all mixed randomly
          </div>
        </div>
      )}

      {/* Phase 5: Spark groups text */}
      {frame > 360 && (
        <div style={{
          position: "absolute", bottom: 120, textAlign: "center", width: "100%", zIndex: 5,
          opacity: sparkOpacity,
        }}>
          <div style={{
            fontSize: 22, fontFamily: poppins, fontWeight: 400, color: "rgba(245,237,227,0.4)",
            letterSpacing: 6, textTransform: "uppercase", marginBottom: 16,
            textShadow: "0 2px 10px rgba(0,0,0,0.8)",
          }}>
            Spark
          </div>
          <div style={{
            fontSize: 42, fontFamily: playfair, fontWeight: 700, color: "#F5EDE3",
            textShadow: "0 2px 30px rgba(0,0,0,0.8)",
          }}>
            Groups them into <span style={{ color: "#D4A853" }}>one meaningful moment</span>
          </div>
        </div>
      )}

      {/* Golden glow around grouped photos */}
      {organizeProgress > 0.5 && (
        <div style={{
          position: "absolute",
          left: 480, top: 260, width: 1000, height: 800,
          borderRadius: 28,
          border: `2px solid rgba(212,168,83,${(organizeProgress - 0.5) * 0.5})`,
          boxShadow: `0 0 ${80 * (organizeProgress - 0.5)}px rgba(212,168,83,${(organizeProgress - 0.5) * 0.15}), inset 0 0 ${40 * (organizeProgress - 0.5)}px rgba(212,168,83,${(organizeProgress - 0.5) * 0.05})`,
          pointerEvents: "none",
        }} />
      )}
    </AbsoluteFill>
  );
};
