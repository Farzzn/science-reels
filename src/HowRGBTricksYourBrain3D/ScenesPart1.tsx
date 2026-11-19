import { PerspectiveCamera, RoundedBox } from "@react-three/drei";
import { ThreeCanvas } from "@remotion/three";
import React, { useLayoutEffect, useMemo, useRef } from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  interpolate,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import * as THREE from "three";
import {
  AntiWashoutRig,
  BG_VOID_COLOR,
  BlueSubpixelMaterial,
  CrispHtmlLabel,
  DarkSiliconMaterial,
  GreenSubpixelMaterial,
  HardcodedSubtitle,
  MinimalTopTitle,
  RedSubpixelMaterial,
} from "./shared";

// ============================================================================
// SCENE 1 (Frames 0 to 240 / 8s): 50/50 Horizontal Split-Screen Hook
// Top Half (1080x960):
// - Frames 0–130: Photorealistic 3D faceted low-poly yellow lemon mesh rotating
//   in center under warm studio lighting with crisp top title "YELLOW = 580nm?".
// - Frames 130–240: The yellow surface shatters away to reveal it is actually
//   made of alternating tiny Red (#ff2a2a) and Green (#00ff66) vertical subpixel
//   bars with ZERO yellow meshes.
// ============================================================================
const Scene1LemonSubpixel3DContent: React.FC = () => {
  const frame = useCurrentFrame();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  useLayoutEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 0.15, 11.2);
      cameraRef.current.lookAt(0, 0, 0);
      cameraRef.current.updateProjectionMatrix();
      cameraRef.current.updateMatrixWorld();
    }
  }, []);

  const subpixelReveal = interpolate(frame, [116, 138], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Alternating Red (#ff2a2a) and Green (#00ff66) vertical subpixel bars forming the lemon silhouette
  // ZERO yellow meshes!
  const subpixelBars = useMemo(() => {
    const bars: {
      x: number;
      y: number;
      z: number;
      height: number;
      isRed: boolean;
    }[] = [];

    const cols = 16;
    for (let c = 0; c < cols; c++) {
      const normX = (c / (cols - 1)) * 2 - 1; // [-1, 1]
      const x = normX * 1.48;
      // Lemon envelope height at x matching lemon.jpg silhouette
      const profile = Math.sqrt(Math.max(0.08, 1 - normX * normX));
      const height = profile * 1.78;

      bars.push({
        x,
        y: 0.05,
        z: 0.08,
        height: Math.max(0.24, height),
        isRed: c % 2 === 0,
      });
    }
    return bars;
  }, []);

  const rotY =
    frame < 118
      ? 0
      : Math.sin((frame - 118) * 0.035) * 0.36;
  const rotZ = frame < 118 ? 0 : Math.sin(frame * 0.02) * 0.05;

  return (
    <>
      <AntiWashoutRig fogDensity={0.04} sparklesColor="#4da6ff" />
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        fov={42}
        near={0.1}
        far={100}
        position={[0, 0.15, 11.2]}
      />

      <group rotation={[0.08, rotY, rotZ]}>
        {/* Alternating Red (#ff2a2a) and Green (#00ff66) Vertical Subpixel Bars (ZERO Yellow Meshes) */}
        {subpixelReveal > 0.01 && (
          <group scale={[1, subpixelReveal, 1]}>
            {subpixelBars.map((bar, idx) => (
              <group key={idx} position={[bar.x, bar.y, 0]}>
                {/* Dark Silicon Housing behind each subpixel bar */}
                <mesh position={[0, 0, -0.08]}>
                  <boxGeometry args={[0.145, bar.height + 0.14, 0.16]} />
                  <DarkSiliconMaterial />
                </mesh>
                {/* Lit Red (#ff2a2a) or Green (#00ff66) Subpixel Bar */}
                <mesh position={[0, 0, bar.z]}>
                  <boxGeometry args={[0.115, bar.height, 0.14]} />
                  {bar.isRed ? (
                    <RedSubpixelMaterial intensity={1.1} />
                  ) : (
                    <GreenSubpixelMaterial intensity={1.1} />
                  )}
                </mesh>
              </group>
            ))}
          </group>
        )}
      </group>

      {/* Crisp Non-Glowing HTML Labels inside Portrait Safe-Zone */}
      {frame < 128 ? (
        <CrispHtmlLabel
          position={[0, -1.55, 0]}
          text="PERCEIVED COLOR: LEMON YELLOW"
          subtext="SINGLE 580nm WAVELENGTH?"
          color="#ffffff"
          subColor="#ffd500"
          fontSize={23}
        />
      ) : (
        <CrispHtmlLabel
          position={[0, -1.55, 0]}
          text="0% YELLOW LIGHT ON SCREEN"
          subtext="ONLY RED (#FF2A2A) + GREEN (#00FF66) BARS"
          color="#ffffff"
          subColor="#00ff66"
          fontSize={23}
        />
      )}
    </>
  );
};

export const Scene1SplitHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const topHeight = 830;
  const bottomHeight = 1920 - topHeight;

  const isRevealed = frame >= 128;

  // Shatter/slice animation for the real lemon photo (public/lemon.jpg) between frames 118 and 146
  const sliceShatter = interpolate(frame, [118, 146], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const lemonFloatY = Math.sin(frame * 0.04) * 6;
  const lemonRotDeg = Math.sin(frame * 0.025) * 2.2;

  const SLICE_COUNT = 16;

  return (
    <AbsoluteFill style={{ backgroundColor: BG_VOID_COLOR, overflow: "hidden" }}>
      {/* TOP HALF (1080x830 container, top: 0) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1080,
          height: topHeight,
          overflow: "hidden",
          backgroundColor: BG_VOID_COLOR,
        }}
      >
        <ThreeCanvas
          width={width}
          height={topHeight}
          camera={{ fov: 42, position: [0, 0.15, 11.2], near: 0.1, far: 100 }}
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: BG_VOID_COLOR,
          }}
        >
          <Scene1LemonSubpixel3DContent />
        </ThreeCanvas>

        {/* Photorealistic Lemon Photo (public/lemon.jpg) in Frames 0–145 that slices apart at Frame 118 */}
        {sliceShatter < 0.99 && (
          <div
            style={{
              position: "absolute",
              top: 175,
              left: 310,
              width: 460,
              height: 460,
              pointerEvents: "none",
              mixBlendMode: "screen",
              transform: `translateY(${lemonFloatY}px) rotate(${lemonRotDeg}deg)`,
            }}
          >
            {sliceShatter <= 0.001 ? (
              <Img
                src={staticFile("lemon.jpg")}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            ) : (
              Array.from({ length: SLICE_COUNT }).map((_, i) => {
                const leftPct = (i / SLICE_COUNT) * 100;
                const rightPct = 100 - ((i + 1) / SLICE_COUNT) * 100;
                const dir = i % 2 === 0 ? -1 : 1;
                const offsetY =
                  sliceShatter * dir * (55 + (i % 4) * 18);
                const offsetX =
                  sliceShatter * ((i - (SLICE_COUNT - 1) / 2) * 5.5);
                const sliceOpacity = interpolate(
                  sliceShatter,
                  [0, 0.55, 1],
                  [1, 0.85, 0],
                );

                return (
                  <Img
                    key={i}
                    src={staticFile("lemon.jpg")}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      clipPath: `inset(0% ${rightPct.toFixed(2)}% 0% ${leftPct.toFixed(2)}%)`,
                      transform: `translate(${offsetX.toFixed(1)}px, ${offsetY.toFixed(1)}px)`,
                      opacity: sliceOpacity,
                    }}
                  />
                );
              })
            )}
          </div>
        )}

        <MinimalTopTitle
          title={isRevealed ? "ZERO YELLOW LEDS" : "YELLOW = 580nm?"}
          subtitle={
            isRevealed
              ? "ALTERNATING RED & GREEN SUBPIXELS"
              : "WHAT YOUR BRAIN SWEARS IT SEES"
          }
          fontSize={54}
          topOffset={44}
          subColor={isRevealed ? "#00ff66" : "#ffd500"}
        />
      </div>

      {/* BOTTOM HALF (1080x1090 container, top: 830, borderTop: '2px solid rgba(255,255,255,0.15)') */}
      <div
        style={{
          position: "absolute",
          top: topHeight,
          left: 0,
          width: 1080,
          height: bottomHeight,
          borderTop: "2px solid rgba(255,255,255,0.15)",
          overflow: "hidden",
          backgroundColor: "#000000",
        }}
      >
        <OffthreadVideo
          src={staticFile("clip-1.mp4")}
          playbackRate={1}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "50% 22%",
          }}
        />
      </div>

      <HardcodedSubtitle
        script="Look at this bright yellow lemon on your screen right now. Here is the crazy part—your phone screen is physically incapable of making yellow light."
        durationInFrames={240}
        bottomOffset={430}
      />
    </AbsoluteFill>
  );
};

// ============================================================================
// SCENE 2 (Frames 240 to 540 / 10s): Full-Screen 3D Macro Dive Into the Glass
// Animate PerspectiveCamera smoothly diving from z = 35 down to z = 6 into a
// dark metallic 25x25 InstancedMesh grid of pixel housings.
// Keep 85% of instances dark or dim so individual lit subpixels stay crisp.
// ============================================================================
const Scene2MacroDive3DContent: React.FC = () => {
  const frame = useCurrentFrame();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const housingMeshRef = useRef<THREE.InstancedMesh>(null);
  const redMeshRef = useRef<THREE.InstancedMesh>(null);
  const greenMeshRef = useRef<THREE.InstancedMesh>(null);
  const blueMeshRef = useRef<THREE.InstancedMesh>(null);

  const diveProgress = interpolate(frame, [0, 285], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  });

  const camZ = interpolate(diveProgress, [0, 1], [35, 6]);
  const camX = Math.sin(frame * 0.012) * interpolate(diveProgress, [0, 1], [1.2, 0.15]);
  const camY = Math.cos(frame * 0.01) * interpolate(diveProgress, [0, 1], [1.0, 0.12]);

  useLayoutEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.position.set(camX, camY, camZ);
      cameraRef.current.lookAt(0, 0, 0);
      cameraRef.current.updateProjectionMatrix();
      cameraRef.current.updateMatrixWorld();
    }
  }, [camX, camY, camZ]);

  const GRID = 25;
  const TOTAL = GRID * GRID; // 625 pixel housings

  const housingGeo = useMemo(
    () => new THREE.BoxGeometry(0.46, 0.46, 0.18),
    [],
  );
  const subpixelGeo = useMemo(
    () => new THREE.BoxGeometry(0.095, 0.34, 0.08),
    [],
  );

  const darkSiliconMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#0d111a",
        metalness: 0.85,
        roughness: 0.28,
      }),
    [],
  );
  const redMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#ff2a2a",
        emissive: "#ff1111",
        emissiveIntensity: 1.1,
        toneMapped: false,
      }),
    [],
  );
  const greenMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#00ff66",
        emissive: "#00cc44",
        emissiveIntensity: 1.1,
        toneMapped: false,
      }),
    [],
  );
  const blueMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#1a75ff",
        emissive: "#0055ff",
        emissiveIntensity: 1.1,
        toneMapped: false,
      }),
    [],
  );

  useLayoutEffect(() => {
    if (
      !housingMeshRef.current ||
      !redMeshRef.current ||
      !greenMeshRef.current ||
      !blueMeshRef.current
    ) {
      return;
    }

    const dummy = new THREE.Object3D();
    const spacing = 0.56;
    const half = (GRID - 1) / 2;

    for (let r = 0; r < GRID; r++) {
      for (let c = 0; c < GRID; c++) {
        const idx = r * GRID + c;
        const x = (c - half) * spacing;
        const y = (r - half) * spacing;
        const distFromCenter = Math.hypot(c - half, r - half);

        // Dark Silicon Pixel Housing (100% present -> 90% of scene surface area)
        dummy.position.set(x, y, -0.06);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        housingMeshRef.current.setMatrixAt(idx, dummy.matrix);

        // Keep 85% of instances dark/hidden or tiny so only crisp sparse subpixels + center triad glow
        const isCenterRing = distFromCenter <= 2.4;
        const hash = Math.abs(Math.sin(idx * 19.37 + 4.1));
        const isLit = isCenterRing || hash > 0.86;
        const pulse =
          0.75 + 0.25 * Math.sin(frame * 0.08 + idx * 0.35);
        const sY = isLit ? pulse : 0.0001;

        // Red subpixel (left slot)
        dummy.position.set(x - 0.12, y, 0.04);
        dummy.scale.set(isLit ? 1 : 0.0001, sY, 1);
        dummy.updateMatrix();
        redMeshRef.current.setMatrixAt(idx, dummy.matrix);

        // Green subpixel (center slot)
        dummy.position.set(x, y, 0.04);
        dummy.scale.set(isLit ? 1 : 0.0001, sY, 1);
        dummy.updateMatrix();
        greenMeshRef.current.setMatrixAt(idx, dummy.matrix);

        // Blue subpixel (right slot)
        dummy.position.set(x + 0.12, y, 0.04);
        dummy.scale.set(isLit ? 1 : 0.0001, sY, 1);
        dummy.updateMatrix();
        blueMeshRef.current.setMatrixAt(idx, dummy.matrix);
      }
    }

    housingMeshRef.current.instanceMatrix.needsUpdate = true;
    redMeshRef.current.instanceMatrix.needsUpdate = true;
    greenMeshRef.current.instanceMatrix.needsUpdate = true;
    blueMeshRef.current.instanceMatrix.needsUpdate = true;
  }, [frame, GRID]);

  return (
    <>
      <AntiWashoutRig fogDensity={0.04} sparklesColor="#1a75ff" />
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        fov={42}
        near={0.1}
        far={100}
        position={[camX, camY, camZ]}
      />

      {/* Dark Gunmetal Silicon Backplane */}
      <mesh position={[0, 0, -0.22]} material={darkSiliconMat}>
        <planeGeometry args={[20, 20]} />
      </mesh>

      {/* 25x25 InstancedMesh Pixel Housings + Sparse Lit RGB Subpixels */}
      <instancedMesh
        ref={housingMeshRef}
        args={[housingGeo, darkSiliconMat, TOTAL]}
        frustumCulled={false}
      />
      <instancedMesh
        ref={redMeshRef}
        args={[subpixelGeo, redMat, TOTAL]}
        frustumCulled={false}
      />
      <instancedMesh
        ref={greenMeshRef}
        args={[subpixelGeo, greenMat, TOTAL]}
        frustumCulled={false}
      />
      <instancedMesh
        ref={blueMeshRef}
        args={[subpixelGeo, blueMat, TOTAL]}
        frustumCulled={false}
      />

      {frame > 150 && (
        <CrispHtmlLabel
          position={[0, -0.82, 0.25]}
          text="25×25 SILICON PIXEL MATRIX"
          subtext="ONLY RED · GREEN · BLUE DIODES"
          color="#ffffff"
          subColor="#99b8ff"
          fontSize={24}
        />
      )}
    </>
  );
};

export const Scene2MacroDive: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const magProgress = interpolate(frame, [10, 250], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const magValue = Math.max(1, Math.round(magProgress * 1000));

  return (
    <AbsoluteFill style={{ backgroundColor: BG_VOID_COLOR, overflow: "hidden" }}>
      <Audio src={staticFile("clip-2.mp4")} playbackRate={1} />
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ fov: 42, position: [0, 0, 35], near: 0.1, far: 100 }}
        style={{ width: "100%", height: "100%", backgroundColor: BG_VOID_COLOR }}
      >
        <Scene2MacroDive3DContent />
      </ThreeCanvas>

      <MinimalTopTitle
        title={`MAGNIFICATION: ${magValue.toLocaleString("en-US")}x`}
        subtitle="MICROSCOPIC GLASS SUBSTRATE"
        fontSize={58}
      />
      <HardcodedSubtitle
        script="In fact, your screen can't make white, brown, purple, or pink either. If you put your phone under a microscope and zoom in a thousand times, the image completely disappears."
        durationInFrames={300}
      />
    </AbsoluteFill>
  );
};

// ============================================================================
// SCENE 3 (Frames 540 to 840 / 10s): Full-Screen 3D RGB Subpixel Canyon
// Camera orbits smoothly at eye-level (x = Math.sin(frame*0.015)*1.5, y = 1.2, z = 9)
// focusing on a single hero Pixel Triad sitting on a dark brushed-steel
// motherboard base: three vertical rounded-rectangle glass pillars standing
// side by side within X = [-1.4, +1.4]. Pillar 1 lights up pure Red ("R"),
// Pillar 2 lights up pure Green ("G"), Pillar 3 lights up pure Blue ("B")
// using <Html center> labels above each pillar.
// ============================================================================
const Scene3RGBSubpixelCanyon3DContent: React.FC = () => {
  const frame = useCurrentFrame();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  const camX = Math.sin(frame * 0.015) * 1.5;
  const camY = 1.2;
  const camZ = 9.0;

  useLayoutEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.position.set(camX, camY, camZ);
      cameraRef.current.lookAt(0, -0.18, 0);
      cameraRef.current.updateProjectionMatrix();
      cameraRef.current.updateMatrixWorld();
    }
  }, [camX, camY, camZ]);

  // Sequential power-up of R, G, B pillars
  const redWake = interpolate(frame, [10, 45], [0.25, 1.1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const greenWake = interpolate(frame, [45, 80], [0.25, 1.1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const blueWake = interpolate(frame, [80, 115], [0.25, 1.1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const pillars = [
    {
      label: "R",
      sub: "620nm RED",
      x: -0.95,
      color: "#ff2a2a",
      wake: redWake,
      kind: "red" as const,
    },
    {
      label: "G",
      sub: "530nm GREEN",
      x: 0.0,
      color: "#00ff66",
      wake: greenWake,
      kind: "green" as const,
    },
    {
      label: "B",
      sub: "460nm BLUE",
      x: 0.95,
      color: "#1a75ff",
      wake: blueWake,
      kind: "blue" as const,
    },
  ];

  return (
    <>
      <AntiWashoutRig fogDensity={0.04} sparklesColor="#4da6ff" />
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        fov={42}
        near={0.1}
        far={100}
        position={[camX, camY, camZ]}
      />

      {/* Dark Brushed-Steel Motherboard Base & Canyon Walls (90% Dark Gunmetal Contrast) */}
      <group position={[0, -1.15, 0]}>
        <RoundedBox args={[3.6, 0.34, 2.2]} radius={0.06} smoothness={4}>
          <DarkSiliconMaterial />
        </RoundedBox>
        {/* Recessed subpixel sockets */}
        {[-0.95, 0, 0.95].map((px, i) => (
          <mesh key={i} position={[px, 0.19, 0]}>
            <boxGeometry args={[0.72, 0.08, 0.85]} />
            <DarkSiliconMaterial />
          </mesh>
        ))}

        {/* Surrounding inactive dark gunmetal pixel canyon blocks */}
        {[-2.8, 2.8].map((cx, idx) => (
          <group key={idx} position={[cx, -0.1, -1.6]}>
            <RoundedBox args={[1.6, 0.4, 2.2]} radius={0.04} smoothness={2}>
              <DarkSiliconMaterial />
            </RoundedBox>
            {[-0.42, 0, 0.42].map((sx, sIdx) => (
              <RoundedBox
                key={sIdx}
                position={[sx, 0.95, 0]}
                args={[0.32, 1.5, 0.32]}
                radius={0.06}
                smoothness={2}
              >
                <DarkSiliconMaterial />
              </RoundedBox>
            ))}
          </group>
        ))}
      </group>

      {/* Hero Pixel Triad within X = [-1.4, +1.4] */}
      {pillars.map((p) => (
        <group key={p.label} position={[p.x, 0.18, 0]}>
          {/* Dark Silicon Structural Rear Spine */}
          <RoundedBox
            position={[0, 0, -0.22]}
            args={[0.62, 2.35, 0.14]}
            radius={0.04}
            smoothness={3}
          >
            <DarkSiliconMaterial />
          </RoundedBox>

          {/* Rounded-Rectangle Subpixel Pillar */}
          <RoundedBox args={[0.54, 2.2, 0.42]} radius={0.12} smoothness={4}>
            {p.kind === "red" && <RedSubpixelMaterial intensity={p.wake} />}
            {p.kind === "green" && <GreenSubpixelMaterial intensity={p.wake} />}
            {p.kind === "blue" && <BlueSubpixelMaterial intensity={p.wake} />}
          </RoundedBox>

          {/* Crisp <Html center> Label Above Each Pillar */}
          <CrispHtmlLabel
            position={[0, 1.55, 0]}
            text={p.label}
            subtext={p.sub}
            color="#ffffff"
            subColor={p.color}
            fontSize={38}
          />
        </group>
      ))}
    </>
  );
};

export const Scene3RGBSubpixelCanyon: React.FC = () => {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: BG_VOID_COLOR, overflow: "hidden" }}>
      <Audio src={staticFile("clip-3.mp4")} playbackRate={1} />
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ fov: 42, position: [0, 1.2, 9.0], near: 0.1, far: 100 }}
        style={{ width: "100%", height: "100%", backgroundColor: BG_VOID_COLOR }}
      >
        <Scene3RGBSubpixelCanyon3DContent />
      </ThreeCanvas>

      <MinimalTopTitle
        title="THE RGB PIXEL TRIAD"
        subtitle="PURE RED · PURE GREEN · PURE BLUE"
        fontSize={58}
      />
      <HardcodedSubtitle
        script="All that exists down here is a pitch-black city of millions of microscopic lightbulbs called subpixels. And they only come in three strict colors: pure red, pure green, and pure blue."
        durationInFrames={300}
      />
    </AbsoluteFill>
  );
};
