import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { fade } from "@remotion/transitions/fade";
import { Scene1Intro } from "./scenes/Scene1Intro";
import { Scene2Create } from "./scenes/Scene2Create";
import { Scene3Enrich } from "./scenes/Scene3Enrich";
import { Scene4Send } from "./scenes/Scene4Send";
import { Scene5Receive } from "./scenes/Scene5Receive";
import { Scene6Share } from "./scenes/Scene6Share";

export const MainVideo = () => {
  const frame = useCurrentFrame();

  // Persistent animated gradient background
  const hueShift = interpolate(frame, [0, 600], [0, 30]);

  return (
    <AbsoluteFill>
      {/* Animated gradient background */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(${135 + hueShift}deg, #1a0a2e ${0}%, #2d1b69 ${30}%, #5665c9 ${70}%, #7B5EA7 ${100}%)`,
        }}
      />

      {/* Floating accent circles */}
      {[0, 1, 2, 3, 4].map((i) => {
        const y = interpolate(
          frame,
          [0, 600],
          [200 + i * 180, -100 + i * 180],
        );
        const x = 300 + i * 350 + Math.sin((frame + i * 40) * 0.02) * 60;
        const size = 80 + i * 40;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: "50%",
              background: `radial-gradient(circle, rgba(198,180,230,0.15), transparent)`,
            }}
          />
        );
      })}

      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={110}>
          <Scene1Intro />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 20 })}
        />
        <TransitionSeries.Sequence durationInFrames={110}>
          <Scene2Create />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 20 })}
        />
        <TransitionSeries.Sequence durationInFrames={100}>
          <Scene3Enrich />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-left" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 20 })}
        />
        <TransitionSeries.Sequence durationInFrames={100}>
          <Scene4Send />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 20 })}
        />
        <TransitionSeries.Sequence durationInFrames={110}>
          <Scene5Receive />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-bottom" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 20 })}
        />
        <TransitionSeries.Sequence durationInFrames={110}>
          <Scene6Share />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
