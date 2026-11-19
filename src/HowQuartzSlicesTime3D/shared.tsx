import { Sparkles } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
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

// ============================================================================
// STRICT ANTI-WASHOUT MATERIAL CONSTANTS FOR QUARTZ & ATOMIC TIME
// ============================================================================
export const BG_VOID_COLOR = "#05070d";
export const DARK_SILICON_COLOR = "#0d111a";

// Dark Silicon / Steel Base (90% of geometry)
export const DarkSiliconMaterial: React.FC = () => (
  <meshStandardMaterial color="#0d111a" metalness={0.85} roughness={0.28} />
);

// Cyan Piezo / Atomic Highlight (capped emissiveIntensity <= 1.1)
export const CyanPiezoMaterial: React.FC<{ intensity?: number }> = ({
  intensity = 1.1,
}) => (
  <meshStandardMaterial
    color="#00e5ff"
    emissive="#00b8d4"
    emissiveIntensity={Math.min(1.15, intensity)}
    toneMapped={false}
  />
);

// Golden Clock Pulse Material (capped emissiveIntensity <= 1.1)
export const GoldenPulseMaterial: React.FC<{ intensity?: number }> = ({
  intensity = 1.1,
}) => (
  <meshStandardMaterial
    color="#ffb84d"
    emissive="#ff9900"
    emissiveIntensity={Math.min(1.15, intensity)}
    toneMapped={false}
  />
);

// Red Error Material (capped emissiveIntensity <= 1.0)
export const RedErrorMaterial: React.FC<{ intensity?: number }> = ({
  intensity = 1.0,
}) => (
  <meshStandardMaterial
    color="#ff3333"
    emissive="#cc0000"
    emissiveIntensity={Math.min(1.05, intensity)}
    toneMapped={false}
  />
);

// Synchronous Studio PBR Environment Map for Dark Gunmetal Specular Contrast
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

// ============================================================================
// CONTROLLED BLOOM & STUDIO RIG (intensity=0.58, luminanceThreshold=0.85)
// ============================================================================
export const QuartzStudioRig: React.FC<{
  fogDensity?: number;
  sparklesColor?: string;
}> = ({ fogDensity = 0.038, sparklesColor = "#00e5ff" }) => {
  const frame = useCurrentFrame();
  const composerRef = useEffectComposerSync();

  return (
    <>
      <color attach="background" args={[BG_VOID_COLOR]} />
      <fogExp2 attach="fog" args={[BG_VOID_COLOR, fogDensity]} />
      <StudioEnvironment />

      {/* Controlled Studio PBR Lighting for Dark Gunmetal #0d111a Contrast */}
      <ambientLight intensity={0.36} color="#141e30" />
      <hemisphereLight
        args={["#3a6ea5", "#05070d", 0.68]}
        position={[0, 20, 0]}
      />
      <directionalLight
        intensity={1.85}
        color="#4da6ff"
        position={[-8, 14, -8]}
      />
      <directionalLight
        intensity={1.35}
        color="#dbe9ff"
        position={[10, 16, 10]}
      />

      {/* Subtle Ambient 3D Sparkles */}
      <group rotation={[0, frame * 0.0018, frame * 0.0009]}>
        <Sparkles
          count={70}
          scale={18}
          size={1.4}
          speed={0.2}
          opacity={0.35}
          color={sparklesColor}
        />
      </group>

      {/* Controlled Anti-Washout Bloom (intensity=0.58, luminanceThreshold=0.85) */}
      <EffectComposer ref={composerRef} multisampling={0}>
        <Bloom
          intensity={0.58}
          luminanceThreshold={0.85}
          luminanceSmoothing={0.4}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
};

// ============================================================================
// RAZOR-SHARP NON-GLOWING 3D HTML LABEL (Synchronous DOM Overlay)
// Strictly clamps Y >= -1.35 so labels never enter the bottom 420px subtitle zone
// ============================================================================
export const CrispHtmlLabel: React.FC<{
  position: [number, number, number];
  text: string;
  subtext?: string;
  color?: string;
  subColor?: string;
  fontSize?: number;
}> = ({
  position,
  text,
  subtext,
  color = "#ffffff",
  subColor = "#00e5ff",
  fontSize = 24,
}) => {
  const { gl, camera, size } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const [el] = useState(() => document.createElement("div"));

  const safePosition: [number, number, number] = [
    Math.max(-1.95, Math.min(1.95, position[0])),
    Math.max(-1.35, Math.min(3.1, position[1])),
    position[2],
  ];

  useLayoutEffect(() => {
    const target = gl.domElement.parentElement;
    if (!target) return;
    target.style.position = "relative";
    el.style.cssText =
      "position:absolute;top:0;left:0;pointer-events:none;user-select:none;z-index:25;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;white-space:nowrap;";
    target.appendChild(el);
    return () => {
      if (el.parentElement === target) {
        target.removeChild(el);
      }
    };
  }, [gl, el]);

  useLayoutEffect(() => {
    el.innerHTML = "";
    const titleDiv = document.createElement("div");
    titleDiv.textContent = text;
    titleDiv.style.cssText = `color:${color};font-weight:800;font-family:'Inter','Helvetica Neue',Helvetica,Arial,sans-serif;font-size:${fontSize}px;line-height:1.15;letter-spacing:-0.3px;text-shadow:0 4px 12px rgba(0,0,0,0.95),0 2px 6px rgba(0,0,0,0.95);white-space:nowrap;`;
    el.appendChild(titleDiv);

    if (subtext) {
      const subDiv = document.createElement("div");
      subDiv.textContent = subtext;
      const subSize = Math.max(15, Math.round(fontSize * 0.68));
      subDiv.style.cssText = `color:${subColor};font-weight:800;font-family:'Inter','Helvetica Neue',Helvetica,sans-serif;font-size:${subSize}px;line-height:1.15;letter-spacing:0.6px;margin-top:4px;text-shadow:0 4px 12px rgba(0,0,0,0.95),0 2px 6px rgba(0,0,0,0.95);white-space:nowrap;`;
      el.appendChild(subDiv);
    }
  }, [el, text, subtext, color, subColor, fontSize]);

  const syncTransform = (activeCam: THREE.Camera, w: number, h: number) => {
    if (!groupRef.current) return;
    activeCam.updateMatrixWorld();
    groupRef.current.updateWorldMatrix(true, false);
    const worldPos = new THREE.Vector3().setFromMatrixPosition(
      groupRef.current.matrixWorld,
    );
    // Enforce world Y >= -1.35 so even nested group labels never enter the bottom 420px subtitle zone
    if (worldPos.y < -1.35) {
      worldPos.y = -1.35;
    }
    worldPos.project(activeCam);
    const xPx = (worldPos.x * 0.5 + 0.5) * w;
    const yPx = (-(worldPos.y * 0.5) + 0.5) * h;
    el.style.transform = `translate3d(${xPx.toFixed(1)}px, ${yPx.toFixed(1)}px, 0) translate(-50%, -50%)`;
  };

  useLayoutEffect(() => {
    syncTransform(camera, size.width, size.height);
  });

  useFrame((state) => {
    syncTransform(state.camera, state.size.width, state.size.height);
  });

  return <group ref={groupRef} position={safePosition} />;
};

// ============================================================================
// FLAT 2D TOP HEADER OUTSIDE BLOOM PASS (ZERO HUD BOXES, >=45px MARGIN ABOVE GRAPHS)
// ============================================================================
export const MinimalTopTitle: React.FC<{
  title: string;
  subtitle?: string;
  accentColor?: string;
  subColor?: string;
  fontSize?: number;
  topOffset?: number;
  triggerFrame?: number;
}> = ({
  title,
  subtitle,
  accentColor = "#ffffff",
  subColor = "#00e5ff",
  fontSize = 56,
  topOffset = 92,
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
        paddingLeft: 44,
        paddingRight: 44,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: 10,
      }}
    >
      <div
        style={{
          fontFamily:
            "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontWeight: 900,
          fontSize,
          lineHeight: 1.06,
          color: accentColor,
          letterSpacing: -1.2,
          textAlign: "center",
          opacity: interpolate(enter, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(enter, [0, 1], [-16, 0])}px)`,
          textShadow:
            "0 6px 24px rgba(0, 0, 0, 0.95), 0 2px 8px rgba(0, 0, 0, 0.95)",
        }}
      >
        {title}
      </div>
      {subtitle && (
        <div
          style={{
            fontFamily:
              "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontWeight: 800,
            fontSize: 26,
            color: subColor,
            letterSpacing: 1.2,
            textAlign: "center",
            opacity: interpolate(enter, [0, 1], [0, 0.95]),
            textShadow: "0 4px 16px rgba(0, 0, 0, 0.95)",
          }}
        >
          {subtitle}
        </div>
      )}
    </AbsoluteFill>
  );
};

// ============================================================================
// HARDCODED SUBTITLE (ZERO WHISPER TYPOS, EVERY WORD <span> HAS
// display: 'inline-block' AND marginRight: '0.32em')
// Placed inside the reserved bottom 420px safe zone (above Instagram UI overlay)
// ============================================================================
export const HardcodedSubtitle: React.FC<{
  script: string;
  durationInFrames: number;
  bottomOffset?: number;
}> = ({ script, durationInFrames, bottomOffset = 310 }) => {
  const frame = useCurrentFrame();

  const chunks = useMemo(() => {
    const rawWords = script
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 0);

    const weights = rawWords.map((w) => {
      let weight = Math.max(2.5, w.length * 0.75);
      if (/[.!?]$/.test(w)) weight += 3.2;
      else if (/[,;:\u2014-]$/.test(w) || w.includes("\u2014")) weight += 2.0;
      return weight;
    });

    const totalWeight = weights.reduce((acc, v) => acc + v, 0);
    const startFrame = 4;
    const endFrame = Math.max(startFrame + 30, durationInFrames - 8);
    const activeWindow = endFrame - startFrame;

    let cumulative = 0;
    const timedWords = rawWords.map((text, idx) => {
      const wStart = startFrame + (cumulative / totalWeight) * activeWindow;
      cumulative += weights[idx];
      const wEnd = startFrame + (cumulative / totalWeight) * activeWindow;
      return {
        text,
        startFrame: wStart,
        endFrame: wEnd,
      };
    });

    const chunkSize = 5;
    const grouped: {
      words: typeof timedWords;
      startFrame: number;
      endFrame: number;
    }[] = [];

    for (let i = 0; i < timedWords.length; i += chunkSize) {
      const slice = timedWords.slice(i, i + chunkSize);
      if (slice.length > 0) {
        grouped.push({
          words: slice,
          startFrame: slice[0].startFrame,
          endFrame: slice[slice.length - 1].endFrame,
        });
      }
    }

    return grouped;
  }, [script, durationInFrames]);

  const activeChunk = useMemo(() => {
    for (let i = 0; i < chunks.length; i++) {
      const c = chunks[i];
      const nextStart =
        i + 1 < chunks.length ? chunks[i + 1].startFrame : durationInFrames;
      if (frame >= c.startFrame - 4 && frame < nextStart) {
        return c;
      }
    }
    return chunks[chunks.length - 1] ?? null;
  }, [chunks, frame, durationInFrames]);

  if (!activeChunk) return null;

  let activeWordIdx = 0;
  for (let i = 0; i < activeChunk.words.length; i++) {
    if (frame >= activeChunk.words[i].startFrame - 1) {
      activeWordIdx = i;
    }
  }

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: bottomOffset,
        paddingLeft: 60,
        paddingRight: 60,
      }}
    >
      <div
        style={{
          textAlign: "center",
          maxWidth: 940,
          lineHeight: 1.32,
        }}
      >
        {activeChunk.words.map((wordObj, idx) => {
          const isSpoken = idx === activeWordIdx;
          return (
            <span
              key={`${idx}-${wordObj.text}`}
              style={{
                display: "inline-block",
                marginRight: "0.32em",
                fontFamily:
                  "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontWeight: 900,
                fontSize: 46,
                color: isSpoken ? "#ffb84d" : "#ffffff",
                textShadow:
                  "0 6px 20px rgba(0, 0, 0, 0.95), 0 2px 6px rgba(0, 0, 0, 0.95)",
              }}
            >
              {wordObj.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
