import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Background } from "../FiveHundredMileEmail/components";
import { FPS } from "../FiveHundredMileEmail/theme";
import { CosmicCh0, CosmicCh1, CosmicCh2 } from "./scenes01";
import { CosmicCh3, CosmicCh4, CosmicCh5 } from "./scenes02";
import { CosmicCh6, CosmicCh7, CosmicCh8 } from "./scenes03";
import { COSMIC_TIMINGS, COSMIC_TOTAL_FRAMES } from "./timing";

export const COSMIC_MARIO_FRAMES = COSMIC_TOTAL_FRAMES;

const SCENES: Record<string, React.FC> = {
  ch0: CosmicCh0,
  ch1: CosmicCh1,
  ch2: CosmicCh2,
  ch3: CosmicCh3,
  ch4: CosmicCh4,
  ch5: CosmicCh5,
  ch6: CosmicCh6,
  ch7: CosmicCh7,
  ch8: CosmicCh8,
};

export const CosmicMarioBitFlip: React.FC = () => {
  return (
    <AbsoluteFill>
      <Background />
      {COSMIC_TIMINGS.chapters.map((c, i) => {
        const Scene = SCENES[c.id];
        if (!Scene) return null;
        const from = Math.round(c.start * FPS);
        const next = COSMIC_TIMINGS.chapters[i + 1];
        const to = next ? Math.round(next.start * FPS) : COSMIC_TOTAL_FRAMES;
        return (
          <Sequence key={c.id} from={from} durationInFrames={to - from} name={c.title}>
            <Scene />
          </Sequence>
        );
      })}
      <Audio src={staticFile("cosmic/voiceover.wav")} />
    </AbsoluteFill>
  );
};
