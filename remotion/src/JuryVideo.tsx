import { AbsoluteFill, useCurrentFrame, interpolate, Series } from "remotion";
import { JuryS1Hook } from "./scenes/JuryS1Hook";
import { JuryS2SmartGroup } from "./scenes/JuryS2SmartGroup";
import { JuryS3Birthday } from "./scenes/JuryS3Birthday";
import { JuryS4Tribute } from "./scenes/JuryS4Tribute";
import { JuryS5Instant } from "./scenes/JuryS5Instant";
import { JuryS6Outro } from "./scenes/JuryS6Outro";

export const JuryVideo = () => {
  const frame = useCurrentFrame();
  const hue = interpolate(frame, [0, 2700], [0, 15]);

  return (
    <AbsoluteFill>
      {/* Persistent dark cinematic background */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(${140 + hue}deg, #0D1117 0%, #131922 30%, #1A1F2E 60%, #0D1117 100%)`,
        }}
      />

      {/* Subtle floating orbs */}
      {[0, 1, 2, 3].map((i) => {
        const y = interpolate(frame, [0, 2700], [400 + i * 200, 100 + i * 200]);
        const x = 400 + i * 400 + Math.sin((frame + i * 80) * 0.006) * 100;
        const size = 150 + i * 50;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x, top: y,
              width: size, height: size,
              borderRadius: "50%",
              background: `radial-gradient(circle, rgba(212,168,83,${0.02 + i * 0.008}), transparent)`,
            }}
          />
        );
      })}

      {/* Scenes - total: 2700 frames = 90 seconds */}
      <Series>
        <Series.Sequence durationInFrames={150}>
          <JuryS1Hook />
        </Series.Sequence>
        <Series.Sequence durationInFrames={500}>
          <JuryS2SmartGroup />
        </Series.Sequence>
        <Series.Sequence durationInFrames={470}>
          <JuryS3Birthday />
        </Series.Sequence>
        <Series.Sequence durationInFrames={650}>
          <JuryS4Tribute />
        </Series.Sequence>
        <Series.Sequence durationInFrames={420}>
          <JuryS5Instant />
        </Series.Sequence>
        <Series.Sequence durationInFrames={510}>
          <JuryS6Outro />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
