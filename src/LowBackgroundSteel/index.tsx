import { Caption } from "@remotion/captions";
import React, { useCallback, useEffect, useState } from "react";
import {
  AbsoluteFill,
  Audio,
  cancelRender,
  interpolate,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
  useDelayRender,
  watchStaticFile,
} from "remotion";
import { KineticSubtitleLayer } from "../CloudflareLavaLamps/KineticSubtitleLayer";
import { loadFont } from "../load-font";
import { LowBgSteelTelemetryHeader } from "./LowBgSteelTelemetryHeader";
import { Scene1ShipwreckSonarHUD } from "./Scene1ShipwreckSonarHUD";
import { Scene2RadiationSpikeChart } from "./Scene2RadiationSpikeChart";
import { Scene3MoltenSteelHUD } from "./Scene3MoltenSteelHUD";
import { Scene4GeigerComparisonHUD } from "./Scene4GeigerComparisonHUD";
import { Scene5SalvageAndLoopHUD } from "./Scene5SalvageAndLoopHUD";

// 54.63 seconds at 30fps = 1639 frames (stops immediately when voiceover finishes)
export const LOW_BG_STEEL_DURATION_FRAMES = 1639;

// Cinema-First B-Roll Layer with continuous Ken Burns Camera Drift (1.0 -> 1.08)
// Never hides the B-roll behind an opaque black background.
const KenBurnsVideoBackground: React.FC<{
  file: string;
  durationInFrames: number;
  scaleFrom?: number;
  scaleTo?: number;
  playbackRate?: number;
  startFrom?: number;
  fadeIn?: boolean;
  muted?: boolean;
  volume?: number;
}> = ({
  file,
  durationInFrames,
  scaleFrom = 1.0,
  scaleTo = 1.08,
  playbackRate = 1.0,
  startFrom = 0,
  fadeIn = true,
  muted = false,
  volume = 0.06,
}) => {
  const frame = useCurrentFrame();

  const kenBurnsScale = interpolate(
    frame,
    [0, durationInFrames],
    [scaleFrom, scaleTo],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  const cutPunch = fadeIn
    ? interpolate(frame, [0, 6], [1.03, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  const opacity = fadeIn
    ? interpolate(frame, [0, 5], [0.25, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity }}>
      <AbsoluteFill
        style={{
          transform: `scale(${kenBurnsScale * cutPunch})`,
          transformOrigin: "center center",
        }}
      >
        <OffthreadVideo
          src={staticFile(file)}
          startFrom={startFrom}
          playbackRate={playbackRate}
          muted={muted}
          volume={muted ? 0 : volume}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </AbsoluteFill>
      {/* Subtle bottom vignette only for subtitle legibility — center B-roll stays 100% clear */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(5, 8, 15, 0.25) 0%, rgba(5, 8, 15, 0.0) 30%, rgba(5, 8, 15, 0.0) 68%, rgba(5, 8, 15, 0.65) 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

export const LowBackgroundSteel: React.FC = () => {
  const [subtitles, setSubtitles] = useState<Caption[]>([]);
  const { delayRender, continueRender } = useDelayRender();
  const [handle] = useState(() => delayRender());

  const subtitlesFile = staticFile("voiceover-ww1-steel.json");

  const fetchSubtitles = useCallback(async () => {
    try {
      await loadFont();
      const res = await fetch(subtitlesFile);
      const data = (await res.json()) as Caption[];
      setSubtitles(data);
      continueRender(handle);
    } catch (e) {
      cancelRender(e);
    }
  }, [continueRender, handle, subtitlesFile]);

  useEffect(() => {
    fetchSubtitles();
    const c = watchStaticFile(subtitlesFile, () => {
      fetchSubtitles();
    });
    return () => {
      c.cancel();
    };
  }, [fetchSubtitles, subtitlesFile]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#05080F" }}>
      {/* =================================================================
          SCENE 1 (0:00 – 0:08 = Frames 0 – 240, 240 frames):
          Background public/shipwreck-sonar.mp4 + Cyan Laser Targeting Reticle
         ================================================================= */}
      <Sequence from={0} durationInFrames={240}>
        <KenBurnsVideoBackground
          file="shipwreck-sonar.mp4"
          durationInFrames={240}
          scaleFrom={1.0}
          scaleTo={1.08}
          playbackRate={0.98}
          fadeIn={false}
        />
        <Scene1ShipwreckSonarHUD />
      </Sequence>

      {/* =================================================================
          SCENE 2 (0:08 – 0:18 = Frames 240 – 540, 300 frames):
          - 0:08 – 0:13 (Frames 240 – 390, 150 frames): public/trinity-1945.mp4
          - 0:13 – 0:18 (Frames 390 – 540, 150 frames): public/earth-fallout.mp4
          - Glassmorphic Radiation Spike Chart (1900–1944 flat -> July 16, 1945 spike)
         ================================================================= */}
      <Sequence from={240} durationInFrames={150}>
        <KenBurnsVideoBackground
          file="trinity-1945.mp4"
          durationInFrames={150}
          scaleFrom={1.0}
          scaleTo={1.08}
          playbackRate={1.0}
        />
      </Sequence>
      <Sequence from={390} durationInFrames={150}>
        <KenBurnsVideoBackground
          file="earth-fallout.mp4"
          durationInFrames={150}
          scaleFrom={1.0}
          scaleTo={1.08}
          playbackRate={1.0}
        />
      </Sequence>
      <Sequence from={240} durationInFrames={300}>
        <Scene2RadiationSpikeChart />
      </Sequence>

      {/* =================================================================
          SCENE 3 (0:18 – 0:30 = Frames 540 – 900, 360 frames):
          Background public/molten-steel.mp4 (two 6s dynamic Ken Burns passes
          so the 7.93s clip never freezes) + BESSEMER / BOS 60Co Schematic Pill
         ================================================================= */}
      <Sequence from={540} durationInFrames={180}>
        <KenBurnsVideoBackground
          file="molten-steel.mp4"
          durationInFrames={180}
          scaleFrom={1.0}
          scaleTo={1.08}
          playbackRate={1.0}
        />
      </Sequence>
      <Sequence from={720} durationInFrames={180}>
        <KenBurnsVideoBackground
          file="molten-steel.mp4"
          durationInFrames={180}
          scaleFrom={1.08}
          scaleTo={1.0}
          playbackRate={1.0}
        />
      </Sequence>
      <Sequence from={540} durationInFrames={360}>
        <Scene3MoltenSteelHUD />
      </Sequence>

      {/* =================================================================
          SCENE 4 (0:30 – 0:42 = Frames 900 – 1260, 360 frames):
          Background public/medical-scanner.mp4 (two 6s dynamic Ken Burns passes, muted)
          + Split Glassmorphic Geiger-Muller Comparison Widget
         ================================================================= */}
      <Sequence from={900} durationInFrames={180}>
        <KenBurnsVideoBackground
          file="medical-scanner.mp4"
          durationInFrames={180}
          scaleFrom={1.0}
          scaleTo={1.08}
          playbackRate={1.0}
          muted
        />
      </Sequence>
      <Sequence from={1080} durationInFrames={180}>
        <KenBurnsVideoBackground
          file="medical-scanner.mp4"
          durationInFrames={180}
          scaleFrom={1.08}
          scaleTo={1.0}
          playbackRate={1.0}
          muted
        />
      </Sequence>
      <Sequence from={900} durationInFrames={360}>
        <Scene4GeigerComparisonHUD />
      </Sequence>

      {/* =================================================================
          SCENE 5 (0:42 – 0:56 = Frames 1260 – 1680, 420 frames):
          - 0:42 – 0:50 (Frames 1260 – 1500, 240 frames): public/salvage-crane.mp4
          - 0:50 – 0:56 (Frames 1500 – 1680, 180 frames): public/shipwreck-sonar-reverse.mp4
            starting at 1.93s (frame 58 at 30fps) with scale 1.08 -> 1.0 so the
            final frame at 0:56 is exact frame 0 of shipwreck-sonar.mp4 at scale 1.0!
         ================================================================= */}
      <Sequence from={1260} durationInFrames={240}>
        <KenBurnsVideoBackground
          file="salvage-crane.mp4"
          durationInFrames={240}
          scaleFrom={1.0}
          scaleTo={1.08}
          playbackRate={0.98}
        />
      </Sequence>
      <Sequence from={1500} durationInFrames={139}>
        <KenBurnsVideoBackground
          file="shipwreck-sonar-reverse.mp4"
          durationInFrames={139}
          scaleFrom={1.08}
          scaleTo={1.0}
          playbackRate={1.0}
          startFrom={99}
        />
      </Sequence>
      <Sequence from={1260} durationInFrames={379}>
        <Scene5SalvageAndLoopHUD />
      </Sequence>

      {/* =================================================================
          GLASSMORPHIC TOP TELEMETRY HEADER
         ================================================================= */}
      <LowBgSteelTelemetryHeader />

      {/* =================================================================
          KINETIC SUBTITLE LAYER (Unconditional display: 'inline-block', marginRight: '0.32em')
         ================================================================= */}
      <KineticSubtitleLayer subtitles={subtitles} />

      {/* Master Voiceover Audio Track */}
      <Audio src={staticFile("voiceover-ww1-steel.mp3")} volume={1} />
    </AbsoluteFill>
  );
};
