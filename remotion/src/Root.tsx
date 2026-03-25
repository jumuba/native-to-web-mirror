import { Composition } from "remotion";
import { MainVideo } from "./MainVideo";
import { MainVideo2 } from "./MainVideo2";
import { MainVideo3 } from "./MainVideo3";

export const RemotionRoot = () => (
  <>
    <Composition id="main" component={MainVideo} durationInFrames={520} fps={30} width={1920} height={1080} />
    <Composition id="instant-moment" component={MainVideo2} durationInFrames={480} fps={30} width={1920} height={1080} />
    <Composition id="smart-grouping" component={MainVideo3} durationInFrames={540} fps={30} width={1920} height={1080} />
  </>
);
