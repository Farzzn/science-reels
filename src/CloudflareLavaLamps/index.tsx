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
import { loadFont } from "../load-font";
import { DeterministicMathScene } from "./DeterministicMathScene";
import { KineticSubtitleLayer } from "./KineticSubtitleLayer";
import { PixelHexScannerOverlay } from "./PixelHexScannerOverlay";
import { TelemetryLayer } from "./TelemetryLayer";

// 85 seconds at 30fps = 2550 frames
export const CLOUDFLARE_REEL_DURATION_FRAMES = 85 * 30;

const ScaledVideoBackground: React.FC<{
  file: string;
  playbackRate: number;
  zoomFrom?: number;
  zoomTo?: number;
  durationInFrames: number;
  darken?: number;
  fadeIn?: boolean;
}> = ({
  file,
  playbackRate,
  zoomFrom = 1.0,
  zoomTo = 1.07,
  durationInFrames,
  darken = 0.25,
  fadeIn = true,
}) => {
  const frame = useCurrentFrame();

  // Fix 4: 6-frame scale-punch (interpolate(frame, [0, 6], [1.04, 1])) + optional 6-frame crossfade
  const cutPunch = interpolate(frame, [0, 6], [1.04, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const enterOpacity = fadeIn
    ? interpolate(frame, [0, 6], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  const slowZoom = interpolate(
    frame,
    [0, durationInFrames],
    [zoomFrom, zoomTo],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        backgroundColor: "#050508",
        opacity: enterOpacity,
      }}
    >
      <AbsoluteFill
        style={{
          transform: `scale(${slowZoom * cutPunch})`,
          transformOrigin: "center center",
        }}
      >
        <OffthreadVideo
          src={staticFile(file)}
          playbackRate={playbackRate}
          volume={0.14}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </AbsoluteFill>
      {/* Subtle dark contrast overlay + bottom subtitle gradient */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, rgba(5,5,8,${
            darken + 0.2
          }) 0%, rgba(5,5,8,${darken}) 45%, rgba(5,5,8,0.82) 100%)`,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

export const CloudflareLavaLamps: React.FC = () => {
  const [subtitles, setSubtitles] = useState<Caption[]>([]);
  const { delayRender, continueRender } = useDelayRender();
  const [handle] = useState(() => delayRender());

  const subtitlesFile = staticFile("voiceover-for-cloudflare-lava-lambs.json");

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
    <AbsoluteFill style={{ backgroundColor: "#050508" }}>
      {/* =================================================================
          LAYER 1: Background Video / Canvas Layer
         ================================================================= */}
      <AbsoluteFill>
        {/* 0:00 - 0:08 (Frames 0 - 240): Hook - Lava Lamp Wall in San Francisco */}
        <Sequence from={0} durationInFrames={240}>
          <ScaledVideoBackground
            file="lava-wall.mp4"
            playbackRate={0.98}
            zoomFrom={1.0}
            zoomTo={1.06}
            durationInFrames={240}
            darken={0.18}
            fadeIn={false}
          />
        </Sequence>

        {/* 0:08 - 0:38 (Frames 240 - 1140): Pure #050508 Dark Grid Canvas (No Video B-Roll) */}
        <Sequence from={240} durationInFrames={900}>
          <AbsoluteFill style={{ backgroundColor: "#050508" }} />
        </Sequence>

        {/* 0:38 - 0:52 (Frames 1140 - 1560): camera-scan.mp4 (14s segment = 420 frames) */}
        <Sequence from={1140} durationInFrames={210}>
          <ScaledVideoBackground
            file="camera-scan.mp4"
            playbackRate={1.0}
            zoomFrom={1.0}
            zoomTo={1.06}
            durationInFrames={210}
            darken={0.22}
          />
        </Sequence>
        <Sequence from={1350} durationInFrames={210}>
          <ScaledVideoBackground
            file="camera-scan.mp4"
            playbackRate={1.0}
            zoomFrom={1.1}
            zoomTo={1.02}
            durationInFrames={210}
            darken={0.22}
          />
        </Sequence>

        {/* 0:52 - 1:10 (Frames 1560 - 2100): wax-macro.mp4 (18s segment = 540 frames) */}
        <Sequence from={1560} durationInFrames={270}>
          <ScaledVideoBackground
            file="wax-macro.mp4"
            playbackRate={0.85}
            zoomFrom={1.0}
            zoomTo={1.08}
            durationInFrames={270}
            darken={0.35}
          />
        </Sequence>
        <Sequence from={1830} durationInFrames={270}>
          <ScaledVideoBackground
            file="wax-macro.mp4"
            playbackRate={0.85}
            zoomFrom={1.1}
            zoomTo={1.0}
            durationInFrames={270}
            darken={0.38}
          />
        </Sequence>

        {/* Fix 3: Seamless Loop Matching (1:10 - 1:25):
            - Play camera-scan.mp4 from 1:10 to 1:18 (Frames 2100 - 2340, 240 frames)
            - Switch to lava-wall.mp4 from 1:18 to 1:25 (Frames 2340 - 2550, 210 frames)
              zooming back to 1.0 with darken={0.18} so the final frame matches 0:00 */}
        <Sequence from={2100} durationInFrames={240}>
          <ScaledVideoBackground
            file="camera-scan.mp4"
            playbackRate={0.98}
            zoomFrom={1.0}
            zoomTo={1.07}
            durationInFrames={240}
            darken={0.32}
          />
        </Sequence>
        <Sequence from={2340} durationInFrames={210}>
          <ScaledVideoBackground
            file="lava-wall.mp4"
            playbackRate={1.0}
            zoomFrom={1.06}
            zoomTo={1.0}
            durationInFrames={210}
            darken={0.18}
          />
        </Sequence>
      </AbsoluteFill>

      {/* =================================================================
          LAYER 2: Procedural Math & HUD Animation Layer
         ================================================================= */}
      <AbsoluteFill>
        {/* 0:08 - 0:38 (Frames 240 - 1140): Deterministic Math vs. Hacker Scene */}
        <Sequence from={240} durationInFrames={900}>
          <DeterministicMathScene />
        </Sequence>

        {/* 0:38 - 1:10 (Frames 1140 - 2100): Live Pixel-to-Hex Scanner Overlay */}
        <Sequence from={1140} durationInFrames={960}>
          <PixelHexScannerOverlay />
        </Sequence>
      </AbsoluteFill>

      {/* =================================================================
          LAYER 3: Telemetry Callouts Layer
         ================================================================= */}
      <TelemetryLayer />

      {/* =================================================================
          LAYER 4: Bottom-Center Kinetic Subtitle Layer (64px, marginRight: 0.32em)
         ================================================================= */}
      <KineticSubtitleLayer subtitles={subtitles} />

      {/* Master Voiceover Audio Track */}
      <Audio
        src={staticFile("voiceover-for-cloudflare-lava-lambs.mp3")}
        volume={1}
      />
    </AbsoluteFill>
  );
};
