import { Sparkles } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import React, { useLayoutEffect, useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { useEffectComposerSync } from "../FeynmanLightPath/PostprocessingBloom";

export interface WhisperCaptionWord {
  text: string;
  startMs: number;
  endMs: number;
  timestampMs?: number;
  confidence?: number;
}

// Synchronous Studio PBR Environment Map (RoomEnvironment + PMREMGenerator)
export const StudioEnvironment: React.FC = () => {
  const { gl, scene } = useThree();

  useLayoutEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    pmrem.compileEquirectangularShader();
    const room = new RoomEnvironment();
    const target = pmrem.fromScene(room, 0.04);
    scene.environment = target.texture;

    return () => {
      scene.environment = null;
      target.dispose();
      room.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);

  return null;
};

// Mandatory Three.js C4D/Octane Atmosphere, Lighting, Sparkles & Bloom Setup
export const C4DOctaneRig: React.FC<{
  fogDensity?: number;
  sparklesColor?: string;
}> = ({ fogDensity = 0.035, sparklesColor = "#99ccff" }) => {
  const frame = useCurrentFrame();
  const composerRef = useEffectComposerSync();

  return (
    <>
      <color attach="background" args={["#050811"]} />
      <fogExp2 attach="fog" args={["#050811", fogDensity]} />
      <StudioEnvironment />

      {/* Studio PBR Lighting */}
      <ambientLight intensity={0.45} color="#182844" />
      <hemisphereLight
        args={["#4da6ff", "#050811", 0.85]}
        position={[0, 25, 0]}
      />
      <directionalLight
        intensity={2.5}
        color="#4da6ff"
        position={[-10, 15, -10]}
      />
      <directionalLight
        intensity={1.6}
        color="#d8e8ff"
        position={[12, 20, 10]}
      />

      {/* Ambient 3D Sparkles for Camera Parallax */}
      <group rotation={[0, frame * 0.002, frame * 0.001]}>
        <Sparkles
          count={120}
          scale={25}
          size={2}
          speed={0.3}
          opacity={0.65}
          color={sparklesColor}
        />
      </group>

      {/* Mandatory Bloom Post-Processing */}
      <EffectComposer ref={composerRef} multisampling={0}>
        <Bloom
          intensity={2.2}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
};

// Synchronous high-DPI 3D text glyph texture for crisp 3D labels in headless renders
export function create3DTextTexture(
  text: string,
  subtext?: string,
  color = "#FFFFFF",
  subColor = "#ffb84d",
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 768;
  canvas.height = subtext ? 220 : 160;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font =
      "900 76px 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = color;
    ctx.fillText(text, canvas.width / 2, subtext ? 78 : 80);

    if (subtext) {
      ctx.font = "800 44px 'JetBrains Mono', 'Inter', monospace";
      ctx.fillStyle = subColor;
      ctx.fillText(subtext, canvas.width / 2, 162);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

// Clean, Giant, Center-Top Helvetica/Inter Bold Floating Title (Zero HUD Boxes)
export const MinimalTopTitle: React.FC<{
  title: string;
  subtitle?: string;
  accentColor?: string;
  fontSize?: number;
  topOffset?: number;
  triggerFrame?: number;
}> = ({
  title,
  subtitle,
  accentColor = "#FFFFFF",
  fontSize = 72,
  topOffset = 108,
  triggerFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame: Math.max(0, frame - triggerFrame),
    fps,
    config: { damping: 16, stiffness: 140 },
  });

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        paddingTop: topOffset,
        paddingLeft: 48,
        paddingRight: 48,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: 12,
      }}
    >
      <div
        style={{
          fontFamily:
            "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontWeight: 900,
          fontSize,
          lineHeight: 1.05,
          color: accentColor,
          letterSpacing: -1.5,
          textAlign: "center",
          opacity: interpolate(enter, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(enter, [0, 1], [-18, 0])}px) scale(${interpolate(enter, [0, 1], [0.94, 1])})`,
          textShadow: "0 10px 36px rgba(0, 0, 0, 0.9)",
        }}
      >
        {title}
      </div>
      {subtitle && (
        <div
          style={{
            fontFamily:
              "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontWeight: 700,
            fontSize: 32,
            color: "#ffb84d",
            letterSpacing: 1.5,
            textAlign: "center",
            opacity: interpolate(enter, [0, 1], [0, 0.92]),
            textShadow: "0 6px 24px rgba(0, 0, 0, 0.9)",
          }}
        >
          {subtitle}
        </div>
      )}
    </AbsoluteFill>
  );
};

// Bottom-center subtitle component where EVERY word <span> has display: 'inline-block' and marginRight: '0.32em'
export const WordSpacedSubtitle: React.FC<{
  captions: WhisperCaptionWord[];
  bottomOffset?: number;
}> = ({ captions, bottomOffset = 155 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTimeMs = (frame / fps) * 1000;

  // Group captions into readable 5-word chunks
  const chunks = useMemo(() => {
    const clean = captions
      .map((c) => ({
        text: c.text.trim(),
        startMs: c.startMs,
        endMs: c.endMs,
      }))
      .filter((c) => c.text.length > 0);

    const groups: {
      words: { text: string; startMs: number; endMs: number }[];
      startMs: number;
      endMs: number;
    }[] = [];

    const chunkSize = 5;
    for (let i = 0; i < clean.length; i += chunkSize) {
      const slice = clean.slice(i, i + chunkSize);
      if (slice.length > 0) {
        groups.push({
          words: slice,
          startMs: slice[0].startMs,
          endMs: slice[slice.length - 1].endMs,
        });
      }
    }
    return groups;
  }, [captions]);

  const activeChunk = useMemo(() => {
    for (let i = 0; i < chunks.length; i++) {
      const c = chunks[i];
      const nextStart =
        i + 1 < chunks.length ? chunks[i + 1].startMs : c.endMs + 600;
      if (currentTimeMs >= c.startMs - 120 && currentTimeMs < nextStart) {
        return c;
      }
    }
    return null;
  }, [chunks, currentTimeMs]);

  if (!activeChunk) return null;

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: bottomOffset,
        paddingLeft: 64,
        paddingRight: 64,
      }}
    >
      <div
        style={{
          textAlign: "center",
          maxWidth: 940,
          lineHeight: 1.32,
        }}
      >
        {(() => {
          let activeWordIdx = -1;
          for (let i = 0; i < activeChunk.words.length; i++) {
            if (currentTimeMs >= activeChunk.words[i].startMs - 40) {
              activeWordIdx = i;
            }
          }
          return activeChunk.words.map((wordObj, idx) => {
            const isSpoken = idx === activeWordIdx;
            return (
              <span
                key={`${wordObj.startMs}-${idx}`}
                style={{
                  display: "inline-block",
                  marginRight: "0.32em",
                  fontFamily:
                    "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                  fontWeight: 900,
                  fontSize: 48,
                  color: isSpoken ? "#F5D061" : "#FFFFFF",
                  textShadow: isSpoken
                    ? "0 0 24px rgba(245, 208, 97, 0.55), 0 6px 22px rgba(0, 0, 0, 0.95)"
                    : "0 6px 22px rgba(0, 0, 0, 0.95)",
                }}
              >
                {wordObj.text}
              </span>
            );
          });
        })()}
      </div>
    </AbsoluteFill>
  );
};
