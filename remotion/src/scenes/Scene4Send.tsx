import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile } from "remotion";
import { loadFont } from "@remotion/google-fonts/Poppins";

const { fontFamily: poppins } = loadFont("normal", { weights: ["400", "600", "700"], subsets: ["latin"] });

export const Scene4Send = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const imgEntry = spring({ frame, fps, config: { damping: 15, stiffness: 80 } });
  const sendPulse = frame > 50 ? Math.sin((frame - 50) * 0.15) * 0.08 + 1 : 0;
  const sendOpacity = interpolate(frame, [45, 55], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  // Particles flying out
  const particleProgress = interpolate(frame, [55, 95], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      {/* Main image */}
      <div
        style={{
          width: 1000,
          height: 700,
          borderRadius: 30,
          overflow: "hidden",
          transform: `scale(${imgEntry})`,
          boxShadow: "0 30px 80px rgba(0,0,0,0.35)",
        }}
      >
        <Img src={staticFile("images/scene3-sending.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>

      {/* Send pulse ring */}
      {frame > 50 && (
        <div
          style={{
            position: "absolute",
            width: 200,
            height: 200,
            borderRadius: "50%",
            border: "3px solid rgba(196,181,224,0.4)",
            opacity: sendOpacity * (1 - particleProgress),
            transform: `scale(${sendPulse + particleProgress * 3})`,
          }}
        />
      )}

      {/* Flying sparkles */}
      {frame > 55 &&
        [0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const angle = (i / 8) * Math.PI * 2;
          const dist = particleProgress * 500;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 960 + Math.cos(angle) * dist,
                top: 540 + Math.sin(angle) * dist,
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#C4B5E0",
                opacity: 1 - particleProgress,
                boxShadow: "0 0 15px 5px rgba(196,181,224,0.4)",
              }}
            />
          );
        })}

      {/* Text */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          textAlign: "center",
          width: "100%",
          opacity: interpolate(frame, [15, 40], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" }),
        }}
      >
        <div style={{ fontSize: 20, fontFamily: poppins, fontWeight: 600, color: "#C4B5E0", letterSpacing: 5, textTransform: "uppercase", marginBottom: 12 }}>
          Step 3
        </div>
        <div style={{ fontSize: 46, fontFamily: poppins, fontWeight: 700, color: "#F5F0FF" }}>
          Send the gift ✨
        </div>
      </div>
    </AbsoluteFill>
  );
};
