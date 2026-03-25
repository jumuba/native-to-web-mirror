import { Composition } from "remotion";
import { MainVideo } from "./MainVideo";

// 5 scenes: 120+120+100+120+140 = 600 frames, minus 4 transitions x 20 = 80 => 520 frames ~17s
export const RemotionRoot = () => (
  <Composition
    id="main"
    component={MainVideo}
    durationInFrames={520}
    fps={30}
    width={1920}
    height={1080}
  />
);
