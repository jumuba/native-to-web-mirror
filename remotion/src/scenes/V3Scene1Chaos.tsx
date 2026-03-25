import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile } from "remotion";
import { loadFont } from "@remotion/google-fonts/Poppins";

const { fontFamily: poppins } = loadFont("normal", { weights: ["400", "600", "700"], subsets: ["latin"] });

export const V3Scene1Chaos = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phoneScale = spring({ frame, fps, config: { damping: 15, stiffness: 80 } });
  const phoneShake = Math.sin(frame * 0.25) * 2;

  const textOpacity = interpolate(frame, [30, 55], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const textY = interpolate(frame, [30, 55], [40, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  // Scroll effect on the phone image
  const scrollY = interpolate(frame, [15, 90], [0, -80], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      {/* Phone with messy gallery */}
      <div
        style={{
          position: "absolute",
          left: 100,
          width: 850,
          height: 900,
          borderRadius: 30,
          overflow: "hidden",
          transform: `scale(${phoneScale}) rotate(${phoneShake}deg)`,
          boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
        }}
      >
        <Img
          src={staticFile("images/v3-scene1-phone-chaos.jpg")}
          style={{
            width: "100%",
            height: "110%",
            objectFit: "cover",
            transform: `translateY(${scrollY}px)`,
          }}
        />
      </div>

      {/* Frustrated emoji */}
      {[0, 1, 2].map((i) => {
        const emojis = ["😤", "🤯", "😩"];
        const s = spring({ frame: frame - 55 - i * 12, fps, config: { damping: 8 } });
        return (
          <div key={i} style={{
            position: "absolute",
            right: 130 + i * 50,
            top: 180 + i * 180,
            fontSize: 55,
            transform: `scale(${Math.max(0, s)})`,
          }}>
            {emojis[i]}
          </div>
        );
      })}

      {/* Text right side */}
      <div style={{
        position: "absolute", right: 60, top: 200, width: 720,
        opacity: textOpacity, transform: `translateY(${textY}px)`,
      }}>
        <div style={{ fontSize: 46, fontFamily: poppins, fontWeight: 700, color: "#F0FFF0", lineHeight: 1.25, marginBottom: 20 }}>
          Your phone gallery
          <br />is a total mess
        </div>
        <div style={{ fontSize: 24, fontFamily: poppins, fontWeight: 400, color: "rgba(200,240,220,0.7)", lineHeight: 1.5 }}>
          Backed bootcamp photos mixed
          <br />with food pics, selfies, random shots...
        </div>
      </div>
    </AbsoluteFill>
  );
};
