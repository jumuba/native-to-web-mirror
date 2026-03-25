import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { V2Scene1Snap } from "./scenes/V2Scene1Snap";
import { V2Scene2Message } from "./scenes/V2Scene2Message";
import { V2Scene3Send } from "./scenes/V2Scene3Send";
import { V2Scene4Mum } from "./scenes/V2Scene4Mum";
import { V2Scene5Close } from "./scenes/V2Scene5Close";

export const MainVideo2 = () => {
  const frame = useCurrentFrame();
  const warmShift = interpolate(frame, [0, 480], [0, 25]);

  return (
    <AbsoluteFill>
      {/* Warm gradient background */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(${140 + warmShift}deg, #2d1b3d ${0}%, #5c3d6e ${25}%, #c97b5a ${60}%, #e8a87c ${100}%)`,
        }}
      />

      {/* Soft floating orbs */}
      {[0, 1, 2, 3].map((i) => {
        const y = interpolate(frame, [0, 480], [300 + i * 200, 50 + i * 200]);
        const x = 400 + i * 380 + Math.sin((frame + i * 50) * 0.018) * 50;
        const size = 100 + i * 50;
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
              background: `radial-gradient(circle, rgba(232,168,124,0.12), transparent)`,
            }}
          />
        );
      })}

      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={110}>
          <V2Scene1Snap />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 20 })}
        />
        <TransitionSeries.Sequence durationInFrames={110}>
          <V2Scene2Message />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-left" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 20 })}
        />
        <TransitionSeries.Sequence durationInFrames={90}>
          <V2Scene3Send />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 20 })}
        />
        <TransitionSeries.Sequence durationInFrames={120}>
          <V2Scene4Mum />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 20 })}
        />
        <TransitionSeries.Sequence durationInFrames={130}>
          <V2Scene5Close />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
