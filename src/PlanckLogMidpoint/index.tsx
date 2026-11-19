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
import { Scene2BQuantumFoamScanner } from "./Scene2BQuantumFoamScanner";
import { Scene2LogScaleDesert } from "./Scene2LogScaleDesert";
import { Scene4SplitComparison } from "./Scene4SplitComparison";
import { Scene5AMidpointCollision } from "./Scene5AMidpointCollision";

// Stops immediately when voiceover-plank-length-vs-cosmos.mp3 ends (53.43s = 1603 frames at 30fps)
export const PLANCK_MIDPOINT_DURATION_FRAMES = 1603;

// Pure Video Scene Component:
// Strict Rule 1: NEVER Overlap HUDs on Video Clips.
// Whenever an AI video clip (<OffthreadVideo>) is playing on screen,
// render ZERO HUD boxes, zero top headers, and zero telemetry cards over it—
// only the bottom subtitle layer is allowed on video scenes.
const PureVideoScene: React.FC<{
  file: string;
  durationInFrames: number;
  scaleFrom?: number;
  scaleTo?: number;
  playbackRate?: number;
  startFrom?: number;
  volume?: number;
}> = ({
  file,
  durationInFrames,
  scaleFrom = 1.0,
  scaleTo = 1.06,
  playbackRate = 0.98,
  startFrom = 0,
  volume = 0.06,
}) => {
  const frame = useCurrentFrame();

  const scale = interpolate(
    frame,
    [0, durationInFrames],
    [scaleFrom, scaleTo],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000", overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "center center",
        }}
      >
        <OffthreadVideo
          src={staticFile(file)}
          startFrom={startFrom}
          playbackRate={playbackRate}
          volume={volume}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const PlanckLogMidpoint: React.FC = () => {
  const [subtitles, setSubtitles] = useState<Caption[]>([]);
  const { delayRender, continueRender } = useDelayRender();
  const [handle] = useState(() => delayRender());

  const subtitlesFile = staticFile("voiceover-plank-length-vs-cosmos.json");

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
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      {/* =================================================================
          SCENE 1 (0:00.00 – 0:09.27 = Frames 0 – 278, 278 frames — Pure Video):
          "If you shrink down to the smallest possible pixel of reality, and your friend
           grew to the size of the entire observable universe, where would you meet if
           you raced toward the middle?"
          Full-screen public/planck-to-universe.mp4 with slow 1.0 to 1.06 scale drift.
          ZERO HUD overlays.
         ================================================================= */}
      <Sequence from={0} durationInFrames={278}>
        <PureVideoScene
          file="planck-to-universe.mp4"
          durationInFrames={278}
          scaleFrom={1.0}
          scaleTo={1.06}
          playbackRate={0.85}
        />
      </Sequence>

      {/* =================================================================
          SCENE 2A (0:09.27 – 0:17.00 = Frames 278 – 510, 232 frames — Pure #000000 Code Animation):
          "Every single second, you grow 10 times larger, and your friend shrinks 10 times
           smaller. For the first 10 seconds, your side is a complete desert."
          Vertical logarithmic scale 10^-35 m (PLANCK LENGTH) to 10^27 m (OBSERVABLE UNIVERSE),
          QUANTUM DESERT // 0 PARTICLES FOUND bracket, YOU: ×10/sec vs FRIEND: ÷10/sec,
          live stopwatch T = 00.0s to T = 10.0s.
         ================================================================= */}
      <Sequence from={278} durationInFrames={232}>
        <Scene2LogScaleDesert />
      </Sequence>

      {/* =================================================================
          SCENE 2B (0:17.00 – 0:23.27 = Frames 510 – 698, 188 frames — Pure #000000 Code Animation):
          "Between the Planck length and a subatomic neutrino, there is literally nothing,
           just 35 powers of empty quantum foam."
          2-stage Void Microscope Scanner + 35-Power Quantum Foam Fluctuation Matrix right
          before galaxy-shrink.mp4 starts at 23.27s!
         ================================================================= */}
      <Sequence from={510} durationInFrames={188}>
        <Scene2BQuantumFoamScanner />
      </Sequence>

      {/* =================================================================
          SCENE 3 (0:23.27 – 0:29.43 = Frames 698 – 883, 185 frames — Pure Video):
          "Meanwhile, your friend is already blasting past cosmic superclusters,
           the Andromeda galaxy, and the Milky Way."
          Full-screen public/galaxy-shrink.mp4 starting right at 23.27s!
          ZERO HUD overlays.
         ================================================================= */}
      <Sequence from={698} durationInFrames={185}>
        <PureVideoScene
          file="galaxy-shrink.mp4"
          durationInFrames={185}
          scaleFrom={1.0}
          scaleTo={1.06}
          playbackRate={1.0}
        />
      </Sequence>

      {/* =================================================================
          SCENE 4 (0:29.43 – 0:42.23 = Frames 883 – 1267, 384 frames — Pure #000000 Code Animation):
          3-stage split comparison cards snapping in with spring() physics at exact audio cues:
          - 29.43s – 34.67s (T = 10 SECONDS): NEUTRINO (10^-24 m) vs RING NEBULA (10^16 m)
          - 34.67s – 38.03s (T = 20 SECONDS): PROTON (10^-15 m) vs THE MOON (10^6 m)
          - 38.03s – 42.23s (T = 24 SECONDS): OXYGEN ATOM (10^-10 m) vs GREAT PYRAMID OF GIZA (10^2 m)
         ================================================================= */}
      <Sequence from={883} durationInFrames={384}>
        <Scene4SplitComparison />
      </Sequence>

      {/* =================================================================
          SCENE 5A (0:42.23 – 0:45.43 = Frames 1267 – 1363, 96 frames — Pure #000000 Collision Animation):
          "Finally, at 31 seconds, you collide dead in the middle,"
          Cyan and gold markers slam together at exact center
          (T = 31.0 SECONDS // MIDPOINT COLLISION: 10^-4 METERS / 0.1 mm) with golden shockwave ring.
         ================================================================= */}
      <Sequence from={1267} durationInFrames={96}>
        <Scene5AMidpointCollision />
      </Sequence>

      {/* =================================================================
          SCENE 5B (0:45.43 – 0:49.60 = Frames 1363 – 1488, 125 frames — Pure Video):
          "not in space, but at the exact size of a single human egg cell."
          Full-screen public/egg-cell-macro.mp4 with slow 1.0 to 1.06 scale drift.
          ZERO HUD overlays.
         ================================================================= */}
      <Sequence from={1363} durationInFrames={125}>
        <PureVideoScene
          file="egg-cell-macro.mp4"
          durationInFrames={125}
          scaleFrom={1.0}
          scaleTo={1.06}
          playbackRate={1.0}
        />
      </Sequence>

      {/* =================================================================
          SCENE 6 (0:49.60 – 0:53.43 = Frames 1488 – 1603, 115 frames — Seamless Loop Video):
          "Meaning, you are actually larger than the midpoint of the cosmos, which is why..."
          Play public/planck-to-universe-reverse.mp4 with no HUD overlays so the final
          frame matches frame 0 seamlessly right as the voiceover ends.
         ================================================================= */}
      <Sequence from={1488} durationInFrames={115}>
        <PureVideoScene
          file="planck-to-universe-reverse.mp4"
          durationInFrames={115}
          scaleFrom={1.06}
          scaleTo={1.0}
          playbackRate={1.0}
          startFrom={122}
        />
      </Sequence>

      {/* =================================================================
          BOTTOM KINETIC SUBTITLE LAYER (Unconditional display: 'inline-block', marginRight: '0.32em')
         ================================================================= */}
      <KineticSubtitleLayer subtitles={subtitles} />

      {/* Master Voiceover Audio Track */}
      <Audio
        src={staticFile("voiceover-plank-length-vs-cosmos.mp3")}
        volume={1}
      />
    </AbsoluteFill>
  );
};
