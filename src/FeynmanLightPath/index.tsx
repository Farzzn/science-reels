import { Caption } from "@remotion/captions";
import { getVideoMetadata } from "@remotion/media-utils";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  AbsoluteFill,
  Audio,
  CalculateMetadataFunction,
  OffthreadVideo,
  Series,
  staticFile,
  useDelayRender,
  useVideoConfig,
  watchStaticFile,
} from "remotion";
import { KineticSubtitleLayer } from "../CloudflareLavaLamps/KineticSubtitleLayer";
import { loadFont } from "../load-font";
import { Scene2BeachStraightPath3D } from "./Scene2BeachStraightPath3D";
import { Scene3SnellRefraction3D } from "./Scene3SnellRefraction3D";
import { Scene4FeynmanPathIntegral3D } from "./Scene4FeynmanPathIntegral3D";

// 6 sequential clips (clip-1.mp4 through clip-6.mp4), each ~9.963s (299 frames at 30fps)
export const CLIP_FILES = [
  "clip-1.mp4",
  "clip-2.mp4",
  "clip-3.mp4",
  "clip-4.mp4",
  "clip-5.mp4",
  "clip-6.mp4",
] as const;

export const DEFAULT_CLIP_FRAMES = 299;
export const FEYNMAN_LIGHT_PATH_DURATION_FRAMES = DEFAULT_CLIP_FRAMES * 6; // 1794 frames (~59.8s)

export type FeynmanLightPathProps = {
  clipDurations?: number[];
};

export const calculateFeynmanMetadata: CalculateMetadataFunction<
  FeynmanLightPathProps
> = async () => {
  const fps = 30;
  const durations: number[] = [];

  for (const file of CLIP_FILES) {
    try {
      const meta = await getVideoMetadata(staticFile(file));
      const frames = Math.max(1, Math.round(meta.durationInSeconds * fps));
      durations.push(frames);
    } catch {
      durations.push(DEFAULT_CLIP_FRAMES);
    }
  }

  const totalDurationInFrames = durations.reduce((acc, d) => acc + d, 0);

  return {
    durationInFrames: totalDurationInFrames,
    fps,
    props: {
      clipDurations: durations,
    },
  };
};

// Build evenly spaced fallback word-level captions if a JSON file hasn't finished transcribing yet
function buildFallbackCaptions(text: string, durationMs = 9600): Caption[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  const startOffsetMs = 140;
  const usableMs = Math.max(1000, durationMs - 320);
  const stepMs = usableMs / words.length;

  return words.map((w, i) => {
    const startMs = Math.round(startOffsetMs + i * stepMs);
    const endMs = Math.round(startOffsetMs + (i + 1) * stepMs);
    return {
      text: i === 0 ? w : ` ${w}`,
      startMs,
      endMs,
      timestampMs: Math.round((startMs + endMs) / 2),
      confidence: 1,
    };
  });
}

// Per-clip Subtitle Layer that loads clip-X.json and falls back gracefully
const ClipSubtitleLayer: React.FC<{
  jsonFile: string;
  fallbackText: string;
  durationInFrames: number;
}> = ({ jsonFile, fallbackText, durationInFrames }) => {
  const { fps } = useVideoConfig();
  const fallbackCaptions = useMemo(
    () => buildFallbackCaptions(fallbackText, (durationInFrames / fps) * 1000),
    [fallbackText, durationInFrames, fps],
  );

  const [subtitles, setSubtitles] = useState<Caption[]>(fallbackCaptions);
  const { delayRender, continueRender } = useDelayRender();
  const [handle] = useState(() => delayRender(`subtitles-${jsonFile}`));

  const subtitlesUrl = staticFile(jsonFile);

  const fetchSubtitles = useCallback(async () => {
    try {
      await loadFont();
      const res = await fetch(subtitlesUrl);
      if (res.ok) {
        const data = (await res.json()) as Caption[];
        if (Array.isArray(data) && data.length > 0) {
          setSubtitles(data);
        }
      }
      continueRender(handle);
    } catch {
      // Use fallback captions if JSON isn't present yet
      continueRender(handle);
    }
  }, [continueRender, handle, subtitlesUrl]);

  useEffect(() => {
    fetchSubtitles();
    const c = watchStaticFile(subtitlesUrl, () => {
      fetchSubtitles();
    });
    return () => {
      c.cancel();
    };
  }, [fetchSubtitles, subtitlesUrl]);

  return <KineticSubtitleLayer subtitles={subtitles} />;
};

// Full-Screen Host Video Scene with 100% native audio & playbackRate={1}
// Zero HUD boxes over the host—only the bottom subtitle layer.
const FullScreenHostClip: React.FC<{
  file: string;
  jsonFile: string;
  fallbackText: string;
  durationInFrames: number;
}> = ({ file, jsonFile, fallbackText, durationInFrames }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000000", overflow: "hidden" }}>
      <OffthreadVideo
        src={staticFile(file)}
        playbackRate={1}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
      <ClipSubtitleLayer
        jsonFile={jsonFile}
        fallbackText={fallbackText}
        durationInFrames={durationInFrames}
      />
    </AbsoluteFill>
  );
};

export const FeynmanLightPath: React.FC<FeynmanLightPathProps> = ({
  clipDurations,
}) => {
  const durations =
    clipDurations && clipDurations.length === 6
      ? clipDurations
      : [
          DEFAULT_CLIP_FRAMES,
          DEFAULT_CLIP_FRAMES,
          DEFAULT_CLIP_FRAMES,
          DEFAULT_CLIP_FRAMES,
          DEFAULT_CLIP_FRAMES,
          DEFAULT_CLIP_FRAMES,
        ];

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <Series>
        {/* =================================================================
            Series.Sequence 1 (clip-1.mp4 — Host Hook):
            Full-screen <OffthreadVideo src={staticFile('clip-1.mp4')} /> with native audio.
            ZERO HUD boxes over the host—only the bottom subtitle layer.
           ================================================================= */}
        <Series.Sequence durationInFrames={durations[0]}>
          <FullScreenHostClip
            file="clip-1.mp4"
            jsonFile="clip-1.json"
            durationInFrames={durations[0]}
            fallbackText="If you shine a laser beam into water, the light bends to take the fastest possible shortcut. But photons don't have brains—so how does light know the fastest path before it arrives?"
          />
        </Series.Sequence>

        {/* =================================================================
            Series.Sequence 2 (clip-2.mp4 Audio + Three.js 3D Beach & Straight Path):
            Background audio: <Audio src={staticFile('clip-2.mp4')} /> at playbackRate={1}.
            Visual: Full-screen <ThreeCanvas> on #000000 (Sand 8.0 m/s, Water 2.0 m/s,
            Red straight tube from [-3, 0, -4] to [3, 0, 4]).
           ================================================================= */}
        <Series.Sequence durationInFrames={durations[1]}>
          <AbsoluteFill style={{ backgroundColor: "#000000" }}>
            <Scene2BeachStraightPath3D durationInFrames={durations[1]} />
            <ClipSubtitleLayer
              jsonFile="clip-2.json"
              durationInFrames={durations[1]}
              fallbackText="Imagine you're a lifeguard on a beach and a swimmer is drowning. Running in a straight line is the shortest distance, but you swim way slower than you run on sand."
            />
            <Audio src={staticFile("clip-2.mp4")} playbackRate={1} volume={1} />
          </AbsoluteFill>
        </Series.Sequence>

        {/* =================================================================
            Series.Sequence 3 (clip-3.mp4 Audio + Three.js 3D Snell's Law Refraction):
            Background audio: <Audio src={staticFile('clip-3.mp4')} /> at playbackRate={1}.
            Visual: Full-screen <ThreeCanvas> continuing 3D terrain on #000000, dimmed red line
            (20% opacity), bright golden bent tube ("FERMAT OPTIMAL PATH // FASTEST TIME: 9.4s"),
            cyan-gold laser pulse + "SNELL'S LAW // n1 * sin(theta1) = n2 * sin(theta2)".
           ================================================================= */}
        <Series.Sequence durationInFrames={durations[2]}>
          <AbsoluteFill style={{ backgroundColor: "#000000" }}>
            <Scene3SnellRefraction3D durationInFrames={durations[2]} />
            <ClipSubtitleLayer
              jsonFile="clip-3.json"
              durationInFrames={durations[2]}
              fallbackText="So to reach them in the shortest time, you run further down the sand and cut into the water at a sharp angle. Light obeys this exact same Snell's Law equation."
            />
            <Audio src={staticFile("clip-3.mp4")} playbackRate={1} volume={1} />
          </AbsoluteFill>
        </Series.Sequence>

        {/* =================================================================
            Series.Sequence 4 (clip-4.mp4 — Host Mid-Video Pivot):
            Full-screen <OffthreadVideo src={staticFile('clip-4.mp4')} /> with native audio.
            ZERO HUD boxes over the host—only the bottom subtitle layer.
           ================================================================= */}
        <Series.Sequence durationInFrames={durations[3]}>
          <FullScreenHostClip
            file="clip-4.mp4"
            jsonFile="clip-4.json"
            durationInFrames={durations[3]}
            fallbackText="Now, you chose that path because you could see the finish line. Light has no eyes. So how does a single photon calculate the future?"
          />
        </Series.Sequence>

        {/* =================================================================
            Series.Sequence 5 (clip-5.mp4 Audio + Three.js 3D Feynman Path Integral):
            Background audio: <Audio src={staticFile('clip-5.mp4')} /> at playbackRate={1}.
            Visual: Full-screen <ThreeCanvas> on #000000. First half: 36 wild spiraling 3D
            CatmullRomCurve3 trajectories ("FEYNMAN PATH INTEGRAL // ALL PATHS AT ONCE").
            Second half: spinning phase-wave rings cancelling outer paths to red & 0% opacity
            until only the blazing golden center beam remains ("WAVE INTERFERENCE // ONLY FASTEST PATH SURVIVES").
           ================================================================= */}
        <Series.Sequence durationInFrames={durations[4]}>
          <AbsoluteFill style={{ backgroundColor: "#000000" }}>
            <Scene4FeynmanPathIntegral3D durationInFrames={durations[4]} />
            <ClipSubtitleLayer
              jsonFile="clip-5.json"
              durationInFrames={durations[4]}
              fallbackText="According to Richard Feynman, a single photon travels every possible path at once, but slower crazy paths cancel out as waves, leaving only the fastest path."
            />
            <Audio src={staticFile("clip-5.mp4")} playbackRate={1} volume={1} />
          </AbsoluteFill>
        </Series.Sequence>

        {/* =================================================================
            Series.Sequence 6 (clip-6.mp4 — Host Outro CTA):
            Full-screen <OffthreadVideo src={staticFile('clip-6.mp4')} /> with native audio.
            ZERO HUD boxes over the host—only the bottom subtitle layer.
           ================================================================= */}
        <Series.Sequence durationInFrames={durations[5]}>
          <FullScreenHostClip
            file="clip-6.mp4"
            jsonFile="clip-6.json"
            durationInFrames={durations[5]}
            fallbackText="Meaning reality is constantly testing every possibility at the exact same time. If you love crazy physics like this, hit follow."
          />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
