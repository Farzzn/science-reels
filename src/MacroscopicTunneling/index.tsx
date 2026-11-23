import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Background } from "../FiveHundredMileEmail/components";
import { FPS } from "../FiveHundredMileEmail/theme";
import { TunnelCh0, TunnelCh1, TunnelCh2, TunnelCh3 } from "./scenes01";
import { TunnelCh4, TunnelCh5, TunnelCh6, TunnelCh7 } from "./scenes02";
import { TUNNEL_TIMINGS, TUNNEL_TOTAL_FRAMES } from "./timing";

export const MACRO_TUNNEL_FRAMES = TUNNEL_TOTAL_FRAMES;

const SCENES: Record<string, React.FC> = {
  ch0: TunnelCh0,
  ch1: TunnelCh1,
  ch2: TunnelCh2,
  ch3: TunnelCh3,
  ch4: TunnelCh4,
  ch5: TunnelCh5,
  ch6: TunnelCh6,
  ch7: TunnelCh7,
};

export const MacroscopicTunneling: React.FC = () => {
  return (
    <AbsoluteFill>
      <Background />
      {TUNNEL_TIMINGS.chapters.map((c, i) => {
        const Scene = SCENES[c.id];
        if (!Scene) return null;
        const from = Math.round(c.start * FPS);
        const next = TUNNEL_TIMINGS.chapters[i + 1];
        const to = next ? Math.round(next.start * FPS) : TUNNEL_TOTAL_FRAMES;
        return (
          <Sequence key={c.id} from={from} durationInFrames={to - from} name={c.title}>
            <Scene />
          </Sequence>
        );
      })}
      <Audio src={staticFile("macrotunnel/voiceover.wav")} />
    </AbsoluteFill>
  );
};
