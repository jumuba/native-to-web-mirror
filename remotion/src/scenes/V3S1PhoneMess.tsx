import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile } from "remotion";
import { loadFont } from "@remotion/google-fonts/Poppins";

const { fontFamily: poppins } = loadFont("normal", { weights: ["400", "600", "700"], subsets: ["latin"] });

export const V3S1PhoneMess: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phoneScale = spring({ frame, fps, config: { damping: 15, stiffness: 80 } });
  const phoneShake = Math.sin(frame * 0.25) * 2;
  const scrollY = interpolate(frame, [15, 100], [0, -60], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  const textOp = interpolate(frame, [25, 50], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const textY = interpolate(frame, [25, 50], [40, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      {/* Phone with messy camera roll */}
      <div style={{
        position: "absolute", left: 100, top: 90,
        width: 820, height: 900, borderRadius: 30, overflow: "hidden",
        transform: `scale(${phoneScale}) rotate(${phoneShake}deg)`,
        boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
      }}>
        <Img src={staticFile("images/v3-scene1-phone-chaos.jpg")}
          style={{ width: "100%", height: "115%", objectFit: "cover", transform: `translateY(${scrollY}px)` }} />
      </div>

      {/* Frustrated emojis popping in */}
      {["😤", "🤯", "😩"].map((emoji, i) => {
        const s = spring({ frame: frame - 55 - i * 12, fps, config: { damping: 8 } });
        return (
          <div key={i} style={{
            position: "absolute", right: 120 + i * 50, top: 200 + i * 170,
            fontSize: 55, transform: `scale(${Math.max(0, s)})`,
          }}>{emoji}</div>
        );
      })}

      {/* Text */}
      <div style={{
        position: "absolute", right: 60, top: 200, width: 720,
        opacity: textOp, transform: `translateY(${textY}px)`,
      }}>
        <div style={{ fontSize: 46, fontFamily: poppins, fontWeight: 700, color: "#F0FFF0", lineHeight: 1.25, marginBottom: 20 }}>
          Your camera roll
          <br />is a total mess
        </div>
        <div style={{ fontSize: 24, fontFamily: poppins, fontWeight: 400, color: "rgba(200,240,220,0.7)", lineHeight: 1.5 }}>
          Backed bootcamp photos mixed
          <br />with food, pets, selfies...
        </div>
      </div>
    </AbsoluteFill>
  );
};
