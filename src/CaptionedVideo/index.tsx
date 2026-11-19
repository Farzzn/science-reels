import { Caption, createTikTokStyleCaptions } from "@remotion/captions";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AbsoluteFill,
  Audio,
  CalculateMetadataFunction,
  cancelRender,
  Easing,
  getStaticFiles,
  interpolate,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
  useDelayRender,
  useVideoConfig,
  watchStaticFile,
} from "remotion";
import { z } from "zod";
import { loadFont } from "../load-font";
import { NoCaptionFile } from "./NoCaptionFile";
import SubtitlePage from "./SubtitlePage";

export type SubtitleProp = {
  startInSeconds: number;
  text: string;
};

export const captionedVideoSchema = z.object({
  src: z.string(),
});

const TOTAL_DURATION_MS = 91000;
const CLIP_RAW_DURATION_MS = 8000;

type BeatClip = {
  id: string;
  file: string;
  startMs: number;
  endMs: number;
  zoomFrom: number;
  zoomTo: number;
};

const BEAT_CLIPS: BeatClip[] = [
  {
    id: "beat-1-hook-toaster",
    file: "Hand_holding_glowing_smartphone_18559dc6_1080p.mp4",
    startMs: 0,
    endMs: 7400,
    zoomFrom: 1.0,
    zoomTo: 1.07,
  },
  {
    id: "beat-2-heat-tax",
    file: "Holographic_frames_shatter_into_c0b1d48e_1080p.mp4",
    startMs: 7400,
    endMs: 12960,
    zoomFrom: 1.05,
    zoomTo: 1.0,
  },
  {
    id: "beat-3-15b-transistors",
    file: "Microchip_city_gates_flipping_eeef2574_1080p.mp4",
    startMs: 12960,
    endMs: 21720,
    zoomFrom: 1.0,
    zoomTo: 1.08,
  },
  {
    id: "beat-4-electrons-silicon",
    file: "Golden_light_colliding_with_spheres_80a51bb6_1080p.mp4",
    startMs: 21720,
    endMs: 30480,
    zoomFrom: 1.06,
    zoomTo: 1.0,
  },
  {
    id: "beat-5-sealed-phone-radiator",
    file: "Hand_holding_thermal_smartphone_bacfa354_1080p.mp4",
    startMs: 30480,
    endMs: 38480,
    zoomFrom: 1.0,
    zoomTo: 1.06,
  },
  {
    id: "beat-6-ice-cold-processor",
    file: "Processor_cracking_and_bursting_4aee95ce_1080p.mp4",
    startMs: 38480,
    endMs: 47320,
    zoomFrom: 1.0,
    zoomTo: 1.08,
  },
  {
    id: "beat-7-binary-monoliths",
    file: "Glowing_binary_monoliths_float_dfbe970e_1080p.mp4",
    startMs: 47320,
    endMs: 55280,
    zoomFrom: 1.05,
    zoomTo: 1.0,
  },
  {
    id: "beat-8-cubes-merge",
    file: "Cubes_merge_releasing_golden_sho_9bdc36ac_1080p.mp4",
    startMs: 55280,
    endMs: 60080,
    zoomFrom: 1.0,
    zoomTo: 1.09,
  },
  {
    id: "beat-9a-quantum-entropy",
    file: "Quantum_particles_compressing_in_88fcdb12_1080p.mp4",
    startMs: 60080,
    endMs: 68800,
    zoomFrom: 1.0,
    zoomTo: 1.06,
  },
  {
    id: "beat-9b-forgetting-frames",
    file: "Holographic_frames_shatter_into_c0b1d48e_1080p.mp4",
    startMs: 68800,
    endMs: 76200,
    zoomFrom: 1.08,
    zoomTo: 1.0,
  },
  {
    id: "beat-10a-wire-friction",
    file: "Golden_light_colliding_with_spheres_80a51bb6_1080p.mp4",
    startMs: 76200,
    endMs: 80640,
    zoomFrom: 1.0,
    zoomTo: 1.08,
  },
  {
    id: "beat-10b-single-atom-cosmos",
    file: "Golden_atom_zooming_to_cosmos_99748ec4_1080p.mp4",
    startMs: 80640,
    endMs: TOTAL_DURATION_MS,
    zoomFrom: 1.0,
    zoomTo: 1.05,
  },
];

export const calculateCaptionedVideoMetadata: CalculateMetadataFunction<
  z.infer<typeof captionedVideoSchema>
> = async () => {
  const fps = 30;
  return {
    fps,
    durationInFrames: Math.round((TOTAL_DURATION_MS / 1000) * fps),
  };
};

const getFileExists = (file: string) => {
  const files = getStaticFiles();
  const fileExists = files.find((f) => {
    return f.src === file || f.name === file;
  });
  return Boolean(fileExists);
};

// Fast 2-4 word viral TikTok/Reels caption cadence
const SWITCH_CAPTIONS_EVERY_MS = 750;

const SceneClip: React.FC<{
  clip: BeatClip;
  durationInFrames: number;
}> = ({ clip, durationInFrames }) => {
  const frame = useCurrentFrame();
  const beatDurationMs = clip.endMs - clip.startMs;

  // Adjust playback rate so the 8s clip spans the exact beat duration without freezing
  const rawRate = CLIP_RAW_DURATION_MS / beatDurationMs;
  const playbackRate = Math.min(Math.max(rawRate, 0.76), 1.45);

  const scaleVal = interpolate(
    frame,
    [0, durationInFrames],
    [clip.zoomFrom, clip.zoomTo],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  // Subtle flash impact on cut-in (first 5 frames)
  const cutFlashOpacity = interpolate(frame, [0, 5], [0.22, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#050508" }}>
      <AbsoluteFill
        style={{
          transform: `scale(${scaleVal})`,
          transformOrigin: "center center",
        }}
      >
        <OffthreadVideo
          src={staticFile(clip.file)}
          playbackRate={playbackRate}
          volume={0.14}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </AbsoluteFill>
      {/* Bottom gradient vignette for subtitle contrast */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.15) 65%, rgba(0,0,0,0.72) 100%)",
          pointerEvents: "none",
        }}
      />
      {/* Subtle golden flash on beat transition */}
      <AbsoluteFill
        style={{
          backgroundColor: "#FFB800",
          opacity: cutFlashOpacity,
          mixBlendMode: "screen",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

export const CaptionedVideo: React.FC<{
  src: string;
}> = ({ src }) => {
  const [subtitles, setSubtitles] = useState<Caption[]>([]);
  const { delayRender, continueRender } = useDelayRender();
  const [handle] = useState(() => delayRender());
  const { fps } = useVideoConfig();

  const subtitlesFile = staticFile("voice-over-reel.json");

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
  }, [fetchSubtitles, src, subtitlesFile]);

  const { pages } = useMemo(() => {
    return createTikTokStyleCaptions({
      combineTokensWithinMilliseconds: SWITCH_CAPTIONS_EVERY_MS,
      captions: subtitles ?? [],
    });
  }, [subtitles]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#050508" }}>
      {/* Sequenced B-Roll Video Clips */}
      {BEAT_CLIPS.map((clip) => {
        const startFrame = Math.round((clip.startMs / 1000) * fps);
        const endFrame = Math.round((clip.endMs / 1000) * fps);
        const durationInFrames = Math.max(1, endFrame - startFrame);

        return (
          <Sequence
            key={clip.id}
            from={startFrame}
            durationInFrames={durationInFrames}
          >
            <SceneClip clip={clip} durationInFrames={durationInFrames} />
          </Sequence>
        );
      })}

      {/* Main Tightened Voiceover Track */}
      <Audio src={staticFile("voice-over-reel.mp3")} volume={1} />

      {/* Synchronized Word-by-Word Animated Subtitles */}
      {pages.map((page, index) => {
        const nextPage = pages[index + 1] ?? null;
        const subtitleStartFrame = (page.startMs / 1000) * fps;
        const subtitleEndFrame = Math.min(
          nextPage ? (nextPage.startMs / 1000) * fps : Infinity,
          subtitleStartFrame + (SWITCH_CAPTIONS_EVERY_MS / 1000) * fps + 15,
        );
        const durationInFrames = Math.round(
          subtitleEndFrame - subtitleStartFrame,
        );
        if (durationInFrames <= 0) {
          return null;
        }

        return (
          <Sequence
            key={index}
            from={Math.round(subtitleStartFrame)}
            durationInFrames={durationInFrames}
          >
            <SubtitlePage key={index} page={page} />
          </Sequence>
        );
      })}
      {getFileExists("voice-over-reel.json") || subtitles.length > 0 ? null : (
        <NoCaptionFile />
      )}
    </AbsoluteFill>
  );
};
