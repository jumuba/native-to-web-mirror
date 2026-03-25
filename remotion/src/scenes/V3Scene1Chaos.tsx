import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile } from "remotion";
import { loadFont } from "@remotion/google-fonts/Poppins";

const { fontFamily: poppins } = loadFont("normal", { weights: ["400", "600", "700"], subsets: ["latin"] });

export const V3Scene1Chaos = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const imgScale = spring({ frame, fps, config: { damping: 15, stiffness: 80 } });
  const shake = Math.sin(frame * 0.3) * 3;

  const textOpacity = interpolate(frame, [30, 55], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const textY = interpolate(frame, [30, 55], [40, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  // Question marks floating
  const qOpacity = interpolate(frame, [50, 70], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      {/* Chaotic gallery image */}
      <div
        style={{
          position: "absolute",
          left: 60,
          width: 950,
          height: 880,
          borderRadius: 30,
          overflow: "hidden",
          transform: `scale(${imgScale}) rotate(${shake}deg)`,
          boxShadow: "0 30px 80px rgba(0,0,0,0.4)",
        }}
      >
        <Img src={staticFile("images/v3-scene1-chaos.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>

      {/* Floating question marks */}
      {[0, 1, 2].map((i) => {
        const y = 200 + i * 200 + Math.sin((frame + i * 30) * 0.06) * 20;
        return (
          <div key={i} style={{
            position: "absolute", right: 120 + i * 60, top: y,
            fontSize: 60, opacity: qOpacity * (0.4 + i * 0.2),
            color: "#e07830",
          }}>❓</div>
        );
      })}

      {/* Text */}
      <div style={{
        position: "absolute", right: 60, top: 200, width: 750,
        opacity: textOpacity, transform: `translateY(${textY}px)`,
      }}>
        <div style={{ fontSize: 48, fontFamily: poppins, fontWeight: 700, color: "#F0FFF0", lineHeight: 1.2, marginBottom: 20 }}>
          Your photos are
          <br />all mixed up...
        </div>
        <div style={{ fontSize: 24, fontFamily: poppins, fontWeight: 400, color: "rgba(200,240,220,0.7)", lineHeight: 1.5 }}>
          Backed bootcamp photos lost
          <br />among hundreds of random shots
        </div>
      </div>
    </AbsoluteFill>
  );
};
