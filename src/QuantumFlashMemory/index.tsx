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
import { QuantumTelemetryHeader } from "./QuantumTelemetryHeader";
import { Scene1BatteryHUD } from "./Scene1BatteryHUD";
import { Scene2DramBuckets } from "./Scene2DramBuckets";
import { Scene3FloatingGateCallout } from "./Scene3FloatingGateCallout";
import { Scene4QuantumTunneling } from "./Scene4QuantumTunneling";
import { Scene5OxideWear } from "./Scene5OxideWear";

// 85 seconds at 30fps = 2550 frames
export const QUANTUM_FLASH_DURATION_FRAMES = 85 * 30;

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
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, rgba(5,5,8,${
            darken + 0.2
          }) 0%, rgba(5,5,8,${darken}) 45%, rgba(5,5,8,0.84) 100%)`,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

export const QuantumFlashMemory: React.FC = () => {
  const [subtitles, setSubtitles] = useState<Caption[]>([]);
  const { delayRender, continueRender } = useDelayRender();
  const [handle] = useState(() => delayRender());

  const subtitlesFile = staticFile("voiceover-memory-in-phone.json");

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
          SCENE 1 (0:00 - 0:08 = Frames 0 - 240):
          Background public/dead-phone-xray.mp4 + Red->Cyan Battery HUD
         ================================================================= */}
      <Sequence from={0} durationInFrames={240}>
        <ScaledVideoBackground
          file="dead-phone-xray.mp4"
          playbackRate={0.98}
          zoomFrom={1.0}
          zoomTo={1.06}
          durationInFrames={240}
          darken={0.22}
          fadeIn={false}
        />
        <Scene1BatteryHUD />
      </Sequence>

      {/* =================================================================
          SCENE 2 (0:08 - 0:22 = Frames 240 - 660, 420 frames):
          Pure Code Animation — DRAM CELL 01-04 Buckets & POWER_OFF Drain
         ================================================================= */}
      <Sequence from={240} durationInFrames={420}>
        <Scene2DramBuckets />
      </Sequence>

      {/* =================================================================
          SCENE 3 (0:22 - 0:36 = Frames 660 - 1080, 420 frames):
          Background public/nand-cathedral.mp4 + 2D/SVG Floating Gate Trap Callout
         ================================================================= */}
      <Sequence from={660} durationInFrames={210}>
        <ScaledVideoBackground
          file="nand-cathedral.mp4"
          playbackRate={1.0}
          zoomFrom={1.0}
          zoomTo={1.07}
          durationInFrames={210}
          darken={0.32}
        />
      </Sequence>
      <Sequence from={870} durationInFrames={210}>
        <ScaledVideoBackground
          file="nand-cathedral.mp4"
          playbackRate={1.0}
          zoomFrom={1.09}
          zoomTo={1.01}
          durationInFrames={210}
          darken={0.35}
        />
      </Sequence>
      <Sequence from={660} durationInFrames={420}>
        <Scene3FloatingGateCallout />
      </Sequence>

      {/* =================================================================
          SCENE 4 (0:36 - 1:10 = Frames 1080 - 2100, 1020 frames):
          The Quantum Tunneling Code Animation (Classical Bounce -> ψ(x) Wave)
         ================================================================= */}
      <Sequence from={1080} durationInFrames={1020}>
        <Scene4QuantumTunneling />
      </Sequence>

      {/* =================================================================
          SCENE 5A (1:10 - 1:18 = Frames 2100 - 2340, 240 frames):
          Oxide Wear & Breakdown (P/E CYCLES: 10,000 // OXIDE BREAKDOWN)
         ================================================================= */}
      <Sequence from={2100} durationInFrames={240}>
        <Scene5OxideWear />
      </Sequence>

      {/* =================================================================
          SCENE 5B (1:18 - 1:25 = Frames 2340 - 2550, 210 frames):
          Cut to public/dead-phone-xray.mp4 for Seamless Loop to 0:00
         ================================================================= */}
      <Sequence from={2340} durationInFrames={210}>
        <ScaledVideoBackground
          file="dead-phone-xray.mp4"
          playbackRate={1.0}
          zoomFrom={1.06}
          zoomTo={1.0}
          durationInFrames={210}
          darken={0.22}
        />
      </Sequence>

      {/* =================================================================
          TOP HUD HEADER (NAND_FLASH // QUANTUM_TUNNEL_ARRAY)
         ================================================================= */}
      <QuantumTelemetryHeader />

      {/* =================================================================
          KINETIC SUBTITLE LAYER (display: 'inline-block', marginRight: '0.32em')
         ================================================================= */}
      <KineticSubtitleLayer subtitles={subtitles} />

      {/* Master Voiceover Audio Track */}
      <Audio src={staticFile("voiceover-memory-in-phone.mp3")} volume={1} />
    </AbsoluteFill>
  );
};
