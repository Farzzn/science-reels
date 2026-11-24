import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Background } from "../FiveHundredMileEmail/components";
import { FPS } from "../FiveHundredMileEmail/theme";
import { RelCh0, RelCh1, RelCh2, RelCh3 } from "./scenes01";
import { RelCh4, RelCh5, RelCh6, RelCh7 } from "./scenes02";
import { REL_TIMINGS, REL_TOTAL_FRAMES } from "./timing";

export const REL_BONDS_FRAMES = REL_TOTAL_FRAMES;

const SCENES: Record<string, React.FC> = {
  ch0: RelCh0,
  ch1: RelCh1,
  ch2: RelCh2,
  ch3: RelCh3,
  ch4: RelCh4,
  ch5: RelCh5,
  ch6: RelCh6,
  ch7: RelCh7,
};

export const RelativityChemicalBonds: React.FC = () => {
  return (
    <AbsoluteFill>
      <Background />
      {REL_TIMINGS.chapters.map((c, i) => {
        const Scene = SCENES[c.id];
        if (!Scene) return null;
        const from = Math.round(c.start * FPS);
        const next = REL_TIMINGS.chapters[i + 1];
        const to = next ? Math.round(next.start * FPS) : REL_TOTAL_FRAMES;
        return (
          <Sequence key={c.id} from={from} durationInFrames={to - from} name={c.title}>
            <Scene />
          </Sequence>
        );
      })}
      <Audio src={staticFile("relbonds/voiceover.wav")} />
    </AbsoluteFill>
  );
};
