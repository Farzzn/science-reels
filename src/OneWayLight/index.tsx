import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { FPS } from "../FiveHundredMileEmail/theme";
import { Chapter0Hook } from "./Chapter0Hook";
import { Chapter1Trap } from "./Chapter1Trap";
import { Chapter2Illusion } from "./Chapter2Illusion";
import { Chapter3Einstein } from "./Chapter3Einstein";
import { Chapter4Simultaneity } from "./Chapter4Simultaneity";
import { Chapter5Andromeda } from "./Chapter5Andromeda";
import { Chapter6LightCones } from "./Chapter6LightCones";
import { ONE_WAY_LIGHT_FRAMES, OWL_TIMINGS } from "./timing";
import { SpaceBackground } from "../CosmicSpeedLimit/ui";

export { ONE_WAY_LIGHT_FRAMES };

const SCENES: Record<string, React.FC> = {
  ch0: Chapter0Hook,
  ch1: Chapter1Trap,
  ch2: Chapter2Illusion,
  ch3: Chapter3Einstein,
  ch4: Chapter4Simultaneity,
  ch5: Chapter5Andromeda,
  ch6: Chapter6LightCones,
};

export const OneWayLight: React.FC = () => {
  return (
    <AbsoluteFill>
      <SpaceBackground starSeed={73} />
      {OWL_TIMINGS.chapters.map((c, i) => {
        const Scene = SCENES[c.id];
        if (!Scene) return null;
        const from = Math.round(c.start * FPS);
        const next = OWL_TIMINGS.chapters[i + 1];
        const to = next ? Math.round(next.start * FPS) : ONE_WAY_LIGHT_FRAMES;
        return (
          <Sequence
            key={c.id}
            from={from}
            durationInFrames={Math.max(30, to - from)}
            name={c.title}
          >
            <Scene />
          </Sequence>
        );
      })}
      <Audio src={staticFile("onewaylight/voiceover.wav")} />
    </AbsoluteFill>
  );
};
