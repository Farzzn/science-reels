import { PerspectiveCamera, RoundedBox } from "@react-three/drei";
import { ThreeCanvas } from "@remotion/three";
import React, { useLayoutEffect, useMemo, useRef } from "react";
import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import * as THREE from "three";
import {
  AntiWashoutRig,
  BG_VOID_COLOR,
  CrispHtmlLabel,
  DarkSiliconMaterial,
  HardcodedSubtitle,
  MinimalTopTitle,
} from "./shared";

// ============================================================================
// SCENE 8 (Frames 1980 to 2220 / 8s): Full-Screen Host Pivot 2
// ============================================================================
export const Scene8HostPivot2: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000000", overflow: "hidden" }}>
      <OffthreadVideo
        src={staticFile("clip-8.mp4")}
        playbackRate={1}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <HardcodedSubtitle
        script="One pixel is just three tiny colored dots. So what happens when you pack eight million of them onto a sheet of glass and fire them in sync?"
        durationInFrames={240}
      />
    </AbsoluteFill>
  );
};

// ============================================================================
// SCENE 9 (Frames 2220 to 2520 / 10s): Full-Screen 3D OLED True-Black Contrast Canyon
// Camera glides over a 30x30 InstancedMesh OLED subpixel grid. Left half of
// the grid has power completely cut (0% emissive, dark gunmetal steel labeled
// "OLED OFF = TRUE BLACK (0.00 NITS)"). Right half lights up a crisp crescent
// ring of Red, Green, and Blue subpixels forming a star cluster without any
// background bleed.
// ============================================================================
const Scene9OLEDContrast3DContent: React.FC = () => {
  const frame = useCurrentFrame();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const darkMeshRef = useRef<THREE.InstancedMesh>(null);
  const redMeshRef = useRef<THREE.InstancedMesh>(null);
  const greenMeshRef = useRef<THREE.InstancedMesh>(null);
  const blueMeshRef = useRef<THREE.InstancedMesh>(null);

  const camX = Math.sin(frame * 0.012) * 0.55;
  const camY = -0.55 + Math.cos(frame * 0.01) * 0.25;
  const camZ = 11.4;

  useLayoutEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.position.set(camX, camY, 11.8);
      cameraRef.current.lookAt(0, -0.32, 0);
      cameraRef.current.updateProjectionMatrix();
      cameraRef.current.updateMatrixWorld();
    }
  }, [camX, camY, camZ]);

  const GRID = 30;
  const TOTAL = GRID * GRID; // 900 OLED subpixel cells

  const baseGeo = useMemo(
    () => new THREE.BoxGeometry(0.105, 0.125, 0.09),
    [],
  );
  const diodeGeo = useMemo(
    () => new THREE.BoxGeometry(0.082, 0.102, 0.14),
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
      !darkMeshRef.current ||
      !redMeshRef.current ||
      !greenMeshRef.current ||
      !blueMeshRef.current
    ) {
      return;
    }

    const dummy = new THREE.Object3D();
    const spacingX = 0.128;
    const spacingY = 0.148;
    const half = (GRID - 1) / 2;

    for (let r = 0; r < GRID; r++) {
      for (let c = 0; c < GRID; c++) {
        const idx = r * GRID + c;
        const x = (c - half) * spacingX;
        const y = (r - half) * spacingY;

        // Every cell has its dark gunmetal OLED transistor base (90% dark contrast)
        dummy.position.set(x, y, 0);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        darkMeshRef.current.setMatrixAt(idx, dummy.matrix);

        // Left half (c < 15): 0% emissive, power completely cut
        let isCrescentOrStar = false;
        if (c >= 15) {
          // Crescent ring centered in right half around (cx = 0.92, cy = 0.15)
          const dx = x - 0.88;
          const dy = y - 0.12;
          const distMain = Math.hypot(dx, dy);
          const distCutout = Math.hypot(dx - 0.26, dy + 0.12);
          const inCrescent =
            distMain <= 0.78 && distMain >= 0.28 && distCutout >= 0.56;

          // Sparse star cluster points around crescent
          const star1 = Math.hypot(x - 1.32, y - 0.65) < 0.14;
          const star2 = Math.hypot(x - 0.42, y + 1.12) < 0.14;
          const star3 = Math.hypot(x - 1.45, y - 1.05) < 0.14;
          const star4 = Math.hypot(x - 0.55, y - 1.25) < 0.13;

          isCrescentOrStar = inCrescent || star1 || star2 || star3 || star4;
        }

        const channel = c % 3; // 0 = R, 1 = G, 2 = B
        const pulse = 0.85 + 0.15 * Math.sin(frame * 0.08 + idx * 0.2);

        // Hide inactive colour meshes via scale 0.0001
        dummy.position.set(x, y, 0.06);
        dummy.scale.set(
          isCrescentOrStar && channel === 0 ? 1 : 0.0001,
          isCrescentOrStar && channel === 0 ? 1 : 0.0001,
          isCrescentOrStar && channel === 0 ? pulse : 0.0001,
        );
        dummy.updateMatrix();
        redMeshRef.current.setMatrixAt(idx, dummy.matrix);

        dummy.scale.set(
          isCrescentOrStar && channel === 1 ? 1 : 0.0001,
          isCrescentOrStar && channel === 1 ? 1 : 0.0001,
          isCrescentOrStar && channel === 1 ? pulse : 0.0001,
        );
        dummy.updateMatrix();
        greenMeshRef.current.setMatrixAt(idx, dummy.matrix);

        dummy.scale.set(
          isCrescentOrStar && channel === 2 ? 1 : 0.0001,
          isCrescentOrStar && channel === 2 ? 1 : 0.0001,
          isCrescentOrStar && channel === 2 ? pulse : 0.0001,
        );
        dummy.updateMatrix();
        blueMeshRef.current.setMatrixAt(idx, dummy.matrix);
      }
    }

    darkMeshRef.current.instanceMatrix.needsUpdate = true;
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

      {/* Dark Gunmetal OLED Substrate Chassis */}
      <RoundedBox
        position={[0, 0, -0.12]}
        args={[4.1, 4.7, 0.16]}
        radius={0.06}
        smoothness={3}
      >
        <DarkSiliconMaterial />
      </RoundedBox>

      {/* Center Divider Line Between True-Black Half and Active Crescent Half */}
      <mesh position={[0, 0, 0.08]}>
        <boxGeometry args={[0.02, 4.5, 0.04]} />
        <DarkSiliconMaterial />
      </mesh>

      {/* 30x30 InstancedMesh OLED Grid */}
      <instancedMesh
        ref={darkMeshRef}
        args={[baseGeo, darkSiliconMat, TOTAL]}
        frustumCulled={false}
      />
      <instancedMesh
        ref={redMeshRef}
        args={[diodeGeo, redMat, TOTAL]}
        frustumCulled={false}
      />
      <instancedMesh
        ref={greenMeshRef}
        args={[diodeGeo, greenMat, TOTAL]}
        frustumCulled={false}
      />
      <instancedMesh
        ref={blueMeshRef}
        args={[diodeGeo, blueMat, TOTAL]}
        frustumCulled={false}
      />

      {/* Crisp <Html center> Label on Left Half */}
      <CrispHtmlLabel
        position={[-0.95, 0.15, 0.25]}
        text="OLED OFF = TRUE BLACK"
        subtext="(0.00 NITS · POWER CUT)"
        color="#ffffff"
        subColor="#88a4cc"
        fontSize={22}
      />

      {/* Crisp <Html center> Label on Right Half */}
      <CrispHtmlLabel
        position={[0.92, -1.58, 0.25]}
        text="SELF-EMISSIVE SUBPIXELS"
        subtext="ZERO BACKLIGHT BLEED"
        color="#ffffff"
        subColor="#00ff66"
        fontSize={22}
      />
    </>
  );
};

export const Scene9OLEDTrueBlack: React.FC = () => {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: BG_VOID_COLOR, overflow: "hidden" }}>
      <Audio src={staticFile("clip-9.mp4")} playbackRate={1} />
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ fov: 42, position: [0, -0.55, 11.4], near: 0.1, far: 100 }}
        style={{ width: "100%", height: "100%", backgroundColor: BG_VOID_COLOR }}
      >
        <Scene9OLEDContrast3DContent />
      </ThreeCanvas>

      <MinimalTopTitle
        title="OLED TRUE-BLACK CONTRAST"
        subtitle="NO BACKLIGHT · PIXEL-LEVEL POWER CUT"
        fontSize={54}
      />
      <HardcodedSubtitle
        script="In a modern OLED screen, there isn't even a backlight. When a pixel needs to show pitch black space, its transistors completely cut the power—leaving true darkness right next to glowing stars."
        durationInFrames={300}
      />
    </AbsoluteFill>
  );
};

// ============================================================================
// SCENE 10 (Frames 2520 to 2820 / 10s): Full-Screen 3D 120Hz Raster Scan Wave
// Camera pulls high above a 40x40 InstancedMesh grid of RGB subpixels. Animate
// a thin, crisp cyan horizontal scanline bar sweeping rapidly from top
// (y = +2.45) to bottom (y = -2.45) repeatedly ("REFRESH RATE: 120 Hz //
// 24,000,000 SUBPIXELS"). As the bar sweeps down, each row of RGB subpixels
// flips its brightness to form a recognizable 3D glowing eye mosaic.
// ============================================================================
const Scene10RasterScan3DContent: React.FC = () => {
  const frame = useCurrentFrame();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const darkMeshRef = useRef<THREE.InstancedMesh>(null);
  const redMeshRef = useRef<THREE.InstancedMesh>(null);
  const greenMeshRef = useRef<THREE.InstancedMesh>(null);
  const blueMeshRef = useRef<THREE.InstancedMesh>(null);

  const camX = Math.sin(frame * 0.01) * 0.4;
  useLayoutEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.position.set(camX, -0.32, 12.0);
      cameraRef.current.lookAt(0, -0.35, 0);
      cameraRef.current.updateProjectionMatrix();
      cameraRef.current.updateMatrixWorld();
    }
  }, [camX]);

  const GRID = 40;
  const TOTAL = GRID * GRID; // 1,600 subpixel cells

  // Repeatedly sweep cyan scanline from top (y = +2.4) to bottom (y = -2.4) every 45 frames
  const cycleProgress = (frame % 45) / 45;
  const scanY = 2.4 - cycleProgress * 4.8;
  const completedFirstPass = frame >= 45;

  const baseGeo = useMemo(
    () => new THREE.BoxGeometry(0.082, 0.098, 0.07),
    [],
  );
  const subpixelGeo = useMemo(
    () => new THREE.BoxGeometry(0.066, 0.082, 0.12),
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
      !darkMeshRef.current ||
      !redMeshRef.current ||
      !greenMeshRef.current ||
      !blueMeshRef.current
    ) {
      return;
    }

    const dummy = new THREE.Object3D();
    const spacingX = 0.095;
    const spacingY = 0.115;
    const half = (GRID - 1) / 2;

    for (let r = 0; r < GRID; r++) {
      for (let c = 0; c < GRID; c++) {
        const idx = r * GRID + c;
        const x = (c - half) * spacingX;
        const y = (r - half) * spacingY;

        // Normalized coordinates nx, ny in [-1, 1]
        const nx = (c - half) / half;
        const ny = (r - half) / half;

        // Dark Silicon housing for every cell (90% dark gunmetal contrast)
        dummy.position.set(x, y, 0);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        darkMeshRef.current.setMatrixAt(idx, dummy.matrix);

        // Recognizable 3D Glowing Eye Mosaic Geometry:
        // 1. Almond eyelid curves: upper & lower arcs y = ±0.52 * (1 - 0.85 * nx^2)
        const lidCurveY = 0.54 * (1 - 0.82 * nx * nx);
        const onUpperLid =
          Math.abs(nx) <= 0.92 && Math.abs(ny - lidCurveY) <= 0.085;
        const onLowerLid =
          Math.abs(nx) <= 0.92 && Math.abs(ny + lidCurveY) <= 0.085;

        // 2. Iris ring: radius in [0.18, 0.44], pupil < 0.18 is true black
        const radialDist = Math.hypot(nx * 1.05, ny * 1.15);
        const inIris = radialDist >= 0.18 && radialDist <= 0.45;
        const inCatchlight =
          Math.hypot(nx - 0.14, ny - 0.14) <= 0.09;

        const isEyeActive =
          completedFirstPass || y >= scanY;

        let activeChannel = -1; // -1 = dark steel off
        if (isEyeActive) {
          if (inCatchlight) {
            activeChannel = c % 3; // R, G, B triad catchlight
          } else if (inIris) {
            // Cyan-emerald iris made of alternating Green (1) and Blue (2) subpixels
            activeChannel = (c + r) % 2 === 0 ? 1 : 2;
          } else if (onUpperLid || onLowerLid) {
            // Warm eyelid contour made of Red (0) and Green (1) subpixels
            activeChannel = c % 2 === 0 ? 0 : 1;
          }
        }

        // Boost z height slightly when scanline passes over the row
        const scanDist = Math.abs(y - scanY);
        const zPop = scanDist < 0.22 ? 1.35 : 1.0;

        dummy.position.set(x, y, 0.055);

        dummy.scale.set(
          activeChannel === 0 ? 1 : 0.0001,
          activeChannel === 0 ? 1 : 0.0001,
          activeChannel === 0 ? zPop : 0.0001,
        );
        dummy.updateMatrix();
        redMeshRef.current.setMatrixAt(idx, dummy.matrix);

        dummy.scale.set(
          activeChannel === 1 ? 1 : 0.0001,
          activeChannel === 1 ? 1 : 0.0001,
          activeChannel === 1 ? zPop : 0.0001,
        );
        dummy.updateMatrix();
        greenMeshRef.current.setMatrixAt(idx, dummy.matrix);

        dummy.scale.set(
          activeChannel === 2 ? 1 : 0.0001,
          activeChannel === 2 ? 1 : 0.0001,
          activeChannel === 2 ? zPop : 0.0001,
        );
        dummy.updateMatrix();
        blueMeshRef.current.setMatrixAt(idx, dummy.matrix);
      }
    }

    darkMeshRef.current.instanceMatrix.needsUpdate = true;
    redMeshRef.current.instanceMatrix.needsUpdate = true;
    greenMeshRef.current.instanceMatrix.needsUpdate = true;
    blueMeshRef.current.instanceMatrix.needsUpdate = true;
  }, [frame, GRID, scanY, completedFirstPass]);

  return (
    <>
      <AntiWashoutRig fogDensity={0.04} sparklesColor="#1a75ff" />
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        fov={42}
        near={0.1}
        far={100}
        position={[camX, 0, 11.6]}
      />

      {/* Dark Gunmetal Display Backplane */}
      <RoundedBox
        position={[0, 0, -0.1]}
        args={[4.05, 4.85, 0.14]}
        radius={0.06}
        smoothness={3}
      >
        <DarkSiliconMaterial />
      </RoundedBox>

      {/* 40x40 InstancedMesh RGB Subpixel Matrix */}
      <instancedMesh
        ref={darkMeshRef}
        args={[baseGeo, darkSiliconMat, TOTAL]}
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

      {/* Crisp Cyan Horizontal Scanline Bar Sweeping Top to Bottom */}
      <group position={[0, scanY, 0.16]}>
        <mesh>
          <boxGeometry args={[3.95, 0.055, 0.055]} />
          <meshStandardMaterial
            color="#33ccff"
            emissive="#0088ff"
            emissiveIntensity={1.15}
            toneMapped={false}
          />
        </mesh>
        <CrispHtmlLabel
          position={[0, 0.24, 0]}
          text="120 Hz VOLTAGE SCANLINE"
          color="#ffffff"
          subColor="#33ccff"
          fontSize={20}
        />
      </group>
    </>
  );
};

export const Scene10RasterScanWave: React.FC = () => {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: BG_VOID_COLOR, overflow: "hidden" }}>
      <Audio src={staticFile("clip-10.mp4")} playbackRate={1} />
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ fov: 42, position: [0, 0, 11.6], near: 0.1, far: 100 }}
        style={{ width: "100%", height: "100%", backgroundColor: BG_VOID_COLOR }}
      >
        <Scene10RasterScan3DContent />
      </ThreeCanvas>

      <MinimalTopTitle
        title="REFRESH RATE: 120 Hz"
        subtitle="24,000,000 SUBPIXELS UPDATED PER FRAME"
        fontSize={54}
      />
      <HardcodedSubtitle
        script="Then, a control chip sweeps electric voltage down the grid one hundred and twenty times every single second—updating twenty-four million red, green, and blue switches faster than your optic nerve can blink."
        durationInFrames={300}
      />
    </AbsoluteFill>
  );
};

// ============================================================================
// SCENE 11 (Frames 2820 to 3120 / 10s): Full-Screen Host Outro CTA
// ============================================================================
export const Scene11HostOutro: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000000", overflow: "hidden" }}>
      <OffthreadVideo
        src={staticFile("clip-11.mp4")}
        playbackRate={1}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <HardcodedSubtitle
        script="You have never actually seen a real sunset or a face on your phone—just twenty-four million tiny red, green, and blue flashlights tricking your brain. Hit follow for more."
        durationInFrames={300}
      />
    </AbsoluteFill>
  );
};
