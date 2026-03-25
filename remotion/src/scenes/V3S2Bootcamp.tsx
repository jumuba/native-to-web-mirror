import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile } from "remotion";
import { loadFont } from "@remotion/google-fonts/Poppins";

const { fontFamily: poppins } = loadFont("normal", { weights: ["400", "600", "700"], subsets: ["latin"] });

export const V3S2Bootcamp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const imgScale = spring({ frame, fps, config: { damping: 12, stiffness: 80 } });
  const imgZoom = interpolate(frame, [0, 100], [1, 1.06], { extrapolateRight: "clamp" });
  const textOp = interpolate(frame, [20, 45], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  const dates = ["Jan 15", "Feb 8", "Mar 22", "Apr 10"];

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{
        width: 1100, height: 780, borderRadius: 30, overflow: "hidden",
        transform: `scale(${imgScale})`,
        boxShadow: "0 30px 80px rgba(0,0,0,0.4)",
      }}>
        <Img src={staticFile("images/v3-scene2-bootcamp.jpg")}
          style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${imgZoom})` }} />
      </div>

      {/* Date badges */}
      {dates.map((date, i) => {
        const s = spring({ frame: frame - 25 - i * 8, fps, config: { damping: 10 } });
        const positions = [
          { left: 80, top: 80 }, { right: 80, top: 120 },
          { left: 100, bottom: 100 }, { right: 100, bottom: 140 },
        ];
        return (
          <div key={i} style={{
            position: "absolute", ...positions[i],
            transform: `scale(${Math.max(0, s)})`,
            background: "rgba(224,120,48,0.9)", borderRadius: 50,
            padding: "10px 24px",
            boxShadow: "0 8px 25px rgba(224,120,48,0.3)",
          }}>
            <span style={{ fontSize: 20, fontFamily: poppins, fontWeight: 700, color: "#fff" }}>📅 {date}</span>
          </div>
        );
      })}

      <div style={{
        position: "absolute", bottom: 30, textAlign: "center", width: "100%", opacity: textOp,
      }}>
        <div style={{ fontSize: 36, fontFamily: poppins, fontWeight: 700, color: "#F0FFF0" }}>
          Backed Bootcamp — multiple sessions, different dates
        </div>
      </div>
    </AbsoluteFill>
  );
};
