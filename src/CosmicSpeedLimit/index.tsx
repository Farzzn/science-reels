import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { FPS } from "../FiveHundredMileEmail/theme";
import {
  CosmicCh0,
  CosmicCh1,
  CosmicCh2,
  CosmicCh3,
  CosmicCh4,
  CosmicCh5,
  CosmicCh6,
} from "./scenes";
import { COSMIC_TIMINGS, COSMIC_TOTAL_FRAMES } from "./timing";
import { SpaceBackground } from "./ui";

export const COSMIC_LIMIT_FRAMES = COSMIC_TOTAL_FRAMES;

const SCENES: Record<string, React.FC> = {
  ch0: CosmicCh0,
  ch1: CosmicCh1,
  ch2: CosmicCh2,
  ch3: CosmicCh3,
  ch4: CosmicCh4,
  ch5: CosmicCh5,
  ch6: CosmicCh6,
};

export const CosmicSpeedLimit: React.FC = () => {
  return (
    <AbsoluteFill>
      <SpaceBackground />
      {COSMIC_TIMINGS.chapters.map((c, i) => {
        const Scene = SCENES[c.id];
        if (!Scene) return null;
        const from = Math.round(c.start * FPS);
        const next = COSMIC_TIMINGS.chapters[i + 1];
        const to = next ? Math.round(next.start * FPS) : COSMIC_TOTAL_FRAMES;
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
      <Audio src={staticFile("cosmiclimit/voiceover.wav")} />
    </AbsoluteFill>
  );
};
