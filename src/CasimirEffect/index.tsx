import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Background } from "../FiveHundredMileEmail/components";
import { FPS } from "../FiveHundredMileEmail/theme";
import { CasimirCh0, CasimirCh1, CasimirCh2 } from "./scenes01";
import { CasimirCh3, CasimirCh4, CasimirCh5 } from "./scenes02";
import { CasimirCh6, CasimirCh7, CasimirCh8 } from "./scenes03";
import { CASIMIR_TIMINGS, CASIMIR_TOTAL_FRAMES } from "./timing";

export const CASIMIR_EFFECT_FRAMES = CASIMIR_TOTAL_FRAMES;

const SCENES: Record<string, React.FC> = {
  ch0: CasimirCh0,
  ch1: CasimirCh1,
  ch2: CasimirCh2,
  ch3: CasimirCh3,
  ch4: CasimirCh4,
  ch5: CasimirCh5,
  ch6: CasimirCh6,
  ch7: CasimirCh7,
  ch8: CasimirCh8,
};

export const CasimirEffect: React.FC = () => {
  return (
    <AbsoluteFill>
      <Background />
      {CASIMIR_TIMINGS.chapters.map((c, i) => {
        const Scene = SCENES[c.id];
        if (!Scene) return null;
        const from = Math.round(c.start * FPS);
        const next = CASIMIR_TIMINGS.chapters[i + 1];
        const to = next ? Math.round(next.start * FPS) : CASIMIR_TOTAL_FRAMES;
        return (
          <Sequence key={c.id} from={from} durationInFrames={to - from} name={c.title}>
            <Scene />
          </Sequence>
        );
      })}
      <Audio src={staticFile("casimir/voiceover.wav")} />
    </AbsoluteFill>
  );
};
