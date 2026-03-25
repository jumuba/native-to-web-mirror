import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { V3Scene1Chaos } from "./scenes/V3Scene1Chaos";
import { V3Scene2Bootcamp } from "./scenes/V3Scene2Bootcamp";
import { V3Scene3Sort } from "./scenes/V3Scene3Sort";
import { V3Scene4Organized } from "./scenes/V3Scene4Organized";
import { V3Scene5Share } from "./scenes/V3Scene5Share";
import { V3Scene6Close } from "./scenes/V3Scene6Close";

export const MainVideo3 = () => {
  const frame = useCurrentFrame();
  const hue = interpolate(frame, [0, 500], [0, 20]);

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `linear-gradient(${130 + hue}deg, #0a2e2e 0%, #0d4f4f 25%, #1a6b5a 55%, #e07830 100%)`,
        }}
      />
      {[0, 1, 2, 3].map((i) => {
        const y = interpolate(frame, [0, 500], [250 + i * 200, 50 + i * 200]);
        const x = 350 + i * 400 + Math.sin((frame + i * 45) * 0.015) * 50;
        return (
          <div key={i} style={{
            position: "absolute", left: x, top: y,
            width: 90 + i * 30, height: 90 + i * 30, borderRadius: "50%",
            background: `radial-gradient(circle, rgba(224,120,48,0.1), transparent)`,
          }} />
        );
      })}
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={100}>
          <V3Scene1Chaos />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={springTiming({ config: { damping: 200 }, durationInFrames: 20 })} />
        <TransitionSeries.Sequence durationInFrames={100}>
          <V3Scene2Bootcamp />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={wipe({ direction: "from-right" })} timing={springTiming({ config: { damping: 200 }, durationInFrames: 20 })} />
        <TransitionSeries.Sequence durationInFrames={110}>
          <V3Scene3Sort />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-left" })} timing={springTiming({ config: { damping: 200 }, durationInFrames: 20 })} />
        <TransitionSeries.Sequence durationInFrames={110}>
          <V3Scene4Organized />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={springTiming({ config: { damping: 200 }, durationInFrames: 20 })} />
        <TransitionSeries.Sequence durationInFrames={100}>
          <V3Scene5Share />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={springTiming({ config: { damping: 200 }, durationInFrames: 20 })} />
        <TransitionSeries.Sequence durationInFrames={100}>
          <V3Scene6Close />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
