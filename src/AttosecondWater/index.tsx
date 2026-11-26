import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Background } from "../FiveHundredMileEmail/components";
import { FPS } from "../FiveHundredMileEmail/theme";
import { AttoCh0, AttoCh1, AttoCh2, AttoCh3 } from "./scenes01";
import { AttoCh4, AttoCh5, AttoCh6, AttoCh7 } from "./scenes02";
import { ATTO_TIMINGS, ATTO_TOTAL_FRAMES } from "./timing";

export const ATTO_WATER_FRAMES = ATTO_TOTAL_FRAMES;

const SCENES: Record<string, React.FC> = {
  ch0: AttoCh0,
  ch1: AttoCh1,
  ch2: AttoCh2,
  ch3: AttoCh3,
  ch4: AttoCh4,
  ch5: AttoCh5,
  ch6: AttoCh6,
  ch7: AttoCh7,
};

export const AttosecondWater: React.FC = () => {
  return (
    <AbsoluteFill>
      <Background />
      {ATTO_TIMINGS.chapters.map((c, i) => {
        const Scene = SCENES[c.id];
        if (!Scene) return null;
        const from = Math.round(c.start * FPS);
        const next = ATTO_TIMINGS.chapters[i + 1];
        const to = next ? Math.round(next.start * FPS) : ATTO_TOTAL_FRAMES;
        return (
          <Sequence key={c.id} from={from} durationInFrames={to - from} name={c.title}>
            <Scene />
          </Sequence>
        );
      })}
      <Audio src={staticFile("attowater/voiceover.wav")} />
    </AbsoluteFill>
  );
};
