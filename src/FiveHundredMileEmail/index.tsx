import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Background } from "./components";
import { Ch0, Ch1 } from "./scenes01";
import { Ch2, Ch3, Ch4 } from "./scenes02";
import { Ch5, Ch6 } from "./scenes03";
import { Ch7, Ch8 } from "./scenes04";
import { FPS } from "./theme";
import { TIMINGS, TOTAL_FRAMES } from "./timing";

export const FIVE_HUNDRED_MILE_FRAMES = TOTAL_FRAMES;

const SCENES: Record<string, React.FC> = {
  ch0: Ch0,
  ch1: Ch1,
  ch2: Ch2,
  ch3: Ch3,
  ch4: Ch4,
  ch5: Ch5,
  ch6: Ch6,
  ch7: Ch7,
  ch8: Ch8,
};

export const FiveHundredMileEmail: React.FC = () => {
  return (
    <AbsoluteFill>
      <Background />
      {TIMINGS.chapters.map((c, i) => {
        const Scene = SCENES[c.id];
        if (!Scene) return null;
        const from = Math.round(c.start * FPS);
        const next = TIMINGS.chapters[i + 1];
        const to = next ? Math.round(next.start * FPS) : TOTAL_FRAMES;
        return (
          <Sequence key={c.id} from={from} durationInFrames={to - from} name={c.title}>
            <Scene />
          </Sequence>
        );
      })}
      <Audio src={staticFile("email500/voiceover.wav")} />
    </AbsoluteFill>
  );
};
