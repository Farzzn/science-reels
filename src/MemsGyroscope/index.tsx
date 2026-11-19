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
import { MemsTelemetryHeader } from "./MemsTelemetryHeader";
import { Scene1GimbalReticleHUD } from "./Scene1GimbalReticleHUD";
import { Scene2MemsScaleHUD } from "./Scene2MemsScaleHUD";
import { Scene3ResonantForkHUD } from "./Scene3ResonantForkHUD";
import { Scene4CoriolisVectorHUD } from "./Scene4CoriolisVectorHUD";
import { Scene5CombDriveAndLoopHUD } from "./Scene5CombDriveAndLoopHUD";

// 52.93 seconds at 30fps = 1588 frames (stops immediately when voiceover finishes)
export const MEMS_GYRO_DURATION_FRAMES = 1588;

// Cinema-First B-Roll Layer with continuous Ken Burns Drift (1.0 -> 1.07)
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
  scaleTo = 1.07,
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

export const MemsGyroscope: React.FC = () => {
  const [subtitles, setSubtitles] = useState<Caption[]>([]);
  const { delayRender, continueRender } = useDelayRender();
  const [handle] = useState(() => delayRender());

  const subtitlesFile = staticFile("voiceover-phone-tilt.json");

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
          Background public/phone-tilt-xray.mp4 + 3-Axis Pitch / Roll / Yaw Gimbal Reticle
         ================================================================= */}
      <Sequence from={0} durationInFrames={240}>
        <KenBurnsVideoBackground
          file="phone-tilt-xray.mp4"
          durationInFrames={240}
          scaleFrom={1.0}
          scaleTo={1.07}
          playbackRate={0.98}
          fadeIn={false}
        />
        <Scene1GimbalReticleHUD />
      </Sequence>

      {/* =================================================================
          SCENE 2 (0:08 – 0:18 = Frames 240 – 540, 300 frames):
          Background public/mems-grain-macro.mp4 (two 5s dynamic Ken Burns passes
          so the 7.93s clip never freezes) + Scale-Comparison Card & Cyan Laser Box
         ================================================================= */}
      <Sequence from={240} durationInFrames={150}>
        <KenBurnsVideoBackground
          file="mems-grain-macro.mp4"
          durationInFrames={150}
          scaleFrom={1.0}
          scaleTo={1.07}
          playbackRate={1.0}
        />
      </Sequence>
      <Sequence from={390} durationInFrames={150}>
        <KenBurnsVideoBackground
          file="mems-grain-macro.mp4"
          durationInFrames={150}
          scaleFrom={1.07}
          scaleTo={1.0}
          playbackRate={1.0}
        />
      </Sequence>
      <Sequence from={240} durationInFrames={300}>
        <Scene2MemsScaleHUD />
      </Sequence>

      {/* =================================================================
          SCENE 3 (0:18 – 0:30 = Frames 540 – 900, 360 frames):
          Background public/silicon-fork-vibrate.mp4 (two 6s dynamic Ken Burns passes)
          + Live Procedural Schematic Card (RESONANT FREQUENCY: 28,000 Hz)
         ================================================================= */}
      <Sequence from={540} durationInFrames={180}>
        <KenBurnsVideoBackground
          file="silicon-fork-vibrate.mp4"
          durationInFrames={180}
          scaleFrom={1.0}
          scaleTo={1.07}
          playbackRate={1.0}
        />
      </Sequence>
      <Sequence from={720} durationInFrames={180}>
        <KenBurnsVideoBackground
          file="silicon-fork-vibrate.mp4"
          durationInFrames={180}
          scaleFrom={1.07}
          scaleTo={1.0}
          playbackRate={1.0}
        />
      </Sequence>
      <Sequence from={540} durationInFrames={360}>
        <Scene3ResonantForkHUD />
      </Sequence>

      {/* =================================================================
          SCENE 4 (0:30 – 0:42 = Frames 900 – 1260, 360 frames):
          Background public/coriolis-hurricane.mp4 (two 6s dynamic Ken Burns passes)
          + Red/Golden Coriolis Physics Telemetry Card (F_c = -2m(Ω × v))
         ================================================================= */}
      <Sequence from={900} durationInFrames={180}>
        <KenBurnsVideoBackground
          file="coriolis-hurricane.mp4"
          durationInFrames={180}
          scaleFrom={1.0}
          scaleTo={1.07}
          playbackRate={1.0}
        />
      </Sequence>
      <Sequence from={1080} durationInFrames={180}>
        <KenBurnsVideoBackground
          file="coriolis-hurricane.mp4"
          durationInFrames={180}
          scaleFrom={1.07}
          scaleTo={1.0}
          playbackRate={1.0}
        />
      </Sequence>
      <Sequence from={900} durationInFrames={360}>
        <Scene4CoriolisVectorHUD />
      </Sequence>

      {/* =================================================================
          SCENE 5 (0:42 – 0:52.93 = Frames 1260 – 1588, 328 frames):
          - 0:42 – 0:50 (Frames 1260 – 1500, 240 frames): public/capacitive-comb-teeth.mp4
          - 0:50 – 0:52.93 (Frames 1500 – 1588, 88 frames): public/phone-tilt-xray-reverse.mp4
            starting at frame 150 with scale 1.07 -> 1.0 so the final frame at 1588
            matches frame 0:00 of phone-tilt-xray.mp4 at scale 1.0 right as the voice ends!
         ================================================================= */}
      <Sequence from={1260} durationInFrames={240}>
        <KenBurnsVideoBackground
          file="capacitive-comb-teeth.mp4"
          durationInFrames={240}
          scaleFrom={1.0}
          scaleTo={1.07}
          playbackRate={0.98}
        />
      </Sequence>
      <Sequence from={1500} durationInFrames={88}>
        <KenBurnsVideoBackground
          file="phone-tilt-xray-reverse.mp4"
          durationInFrames={88}
          scaleFrom={1.07}
          scaleTo={1.0}
          playbackRate={1.0}
          startFrom={150}
        />
      </Sequence>
      <Sequence from={1260} durationInFrames={328}>
        <Scene5CombDriveAndLoopHUD />
      </Sequence>

      {/* =================================================================
          GLASSMORPHIC TOP TELEMETRY HEADER
         ================================================================= */}
      <MemsTelemetryHeader />

      {/* =================================================================
          KINETIC SUBTITLE LAYER (Unconditional display: 'inline-block', marginRight: '0.32em')
         ================================================================= */}
      <KineticSubtitleLayer subtitles={subtitles} />

      {/* Master Voiceover Audio Track */}
      <Audio src={staticFile("voiceover-phone-tilt.mp3")} volume={1} />
    </AbsoluteFill>
  );
};
