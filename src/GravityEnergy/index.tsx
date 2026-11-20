import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Background } from "../FiveHundredMileEmail/components";
import { FPS } from "../FiveHundredMileEmail/theme";
import { GravityCh0, GravityCh1, GravityCh2 } from "./scenes01";
import { GravityCh3, GravityCh4, GravityCh5 } from "./scenes02";
import { GravityCh6, GravityCh7, GravityCh8 } from "./scenes03";
import { GRAVITY_TIMINGS, GRAVITY_TOTAL_FRAMES } from "./timing";

export const GRAVITY_ENERGY_FRAMES = GRAVITY_TOTAL_FRAMES;

const SCENES: Record<string, React.FC> = {
  ch0: GravityCh0,
  ch1: GravityCh1,
  ch2: GravityCh2,
  ch3: GravityCh3,
  ch4: GravityCh4,
  ch5: GravityCh5,
  ch6: GravityCh6,
  ch7: GravityCh7,
  ch8: GravityCh8,
};

export const GravityEnergy: React.FC = () => {
  return (
    <AbsoluteFill>
      <Background />
      {GRAVITY_TIMINGS.chapters.map((c, i) => {
        const Scene = SCENES[c.id];
        if (!Scene) return null;
        const from = Math.round(c.start * FPS);
        const next = GRAVITY_TIMINGS.chapters[i + 1];
        const to = next ? Math.round(next.start * FPS) : GRAVITY_TOTAL_FRAMES;
        return (
          <Sequence key={c.id} from={from} durationInFrames={to - from} name={c.title}>
            <Scene />
          </Sequence>
        );
      })}
      <Audio src={staticFile("gravity/voiceover.wav")} />
    </AbsoluteFill>
  );
};
