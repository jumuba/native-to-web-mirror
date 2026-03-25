import { AbsoluteFill, useCurrentFrame, interpolate, Series, Sequence } from "remotion";
import { V3S1PhoneMess } from "./scenes/V3S1PhoneMess";
import { V3S2Bootcamp } from "./scenes/V3S2Bootcamp";
import { V3S3AiSort } from "./scenes/V3S3AiSort";
import { V3S4Result } from "./scenes/V3S4Result";
import { V3S5Outro } from "./scenes/V3S5Outro";

export const MainVideo3 = () => {
  const frame = useCurrentFrame();
  const hue = interpolate(frame, [0, 540], [0, 20]);

  return (
    <AbsoluteFill>
      {/* Background gradient */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(${130 + hue}deg, #0a2e2e 0%, #0d4f4f 30%, #1a6b5a 60%, #e07830 100%)`,
        }}
      />
      {/* Floating orbs */}
      {[0, 1, 2, 3].map((i) => {
        const y = interpolate(frame, [0, 540], [250 + i * 200, 80 + i * 200]);
        const x = 350 + i * 400 + Math.sin((frame + i * 45) * 0.015) * 50;
        return (
          <div key={i} style={{
            position: "absolute", left: x, top: y,
            width: 90 + i * 30, height: 90 + i * 30, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(224,120,48,0.1), transparent)",
          }} />
        );
      })}
      {/* Scenes using Series (back-to-back, no overlap issues) */}
      <Series>
        <Series.Sequence durationInFrames={120}>
          <V3S1PhoneMess />
        </Series.Sequence>
        <Series.Sequence durationInFrames={100}>
          <V3S2Bootcamp />
        </Series.Sequence>
        <Series.Sequence durationInFrames={120}>
          <V3S3AiSort />
        </Series.Sequence>
        <Series.Sequence durationInFrames={120}>
          <V3S4Result />
        </Series.Sequence>
        <Series.Sequence durationInFrames={80}>
          <V3S5Outro />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
