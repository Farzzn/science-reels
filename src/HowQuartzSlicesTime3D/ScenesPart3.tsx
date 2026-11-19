import { PerspectiveCamera, RoundedBox } from "@react-three/drei";
import { ThreeCanvas } from "@remotion/three";
import React, { useLayoutEffect, useMemo, useRef } from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import * as THREE from "three";
import {
  BG_VOID_COLOR,
  CrispHtmlLabel,
  CyanPiezoMaterial,
  DarkSiliconMaterial,
  GoldenPulseMaterial,
  HardcodedSubtitle,
  MinimalTopTitle,
  QuartzStudioRig,
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
        script="For your watch, losing a millisecond a month is fine. But for GPS satellites, a one-millisecond error throws your map off by three hundred kilometers."
        durationInFrames={240}
      />
    </AbsoluteFill>
  );
};

// ============================================================================
// SCENE 9 (Frames 2220 to 2520 / 10s): Full-Screen 3D Cesium-133 Hyperfine Transition
// Render a 3D Cesium-133 atom at Y = [0.6]: a glowing golden nucleus surrounded
// by dark-metallic orbital rings and a single bright cyan outer valence electron.
// A golden microwave laser beam sweeps across the atom; when locked, the outer
// electron jumps between two distinct 3D orbital shells ("HYPERFINE GROUND STATE FLIP").
// ============================================================================
const Scene9CesiumAtom3DContent: React.FC = () => {
  const frame = useCurrentFrame();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  const camX = Math.sin(frame * 0.012) * 0.45;
  useLayoutEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.position.set(camX, 0.55, 11.6);
      cameraRef.current.lookAt(0, 0.5, 0);
      cameraRef.current.updateProjectionMatrix();
      cameraRef.current.updateMatrixWorld();
    }
  }, [camX]);

  // Microwave laser lock-in around frame 45
  const laserLock = interpolate(frame, [20, 65], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Outer valence electron jumps rhythmically between inner hyperfine shell (r = 1.05) and outer shell (r = 1.48)
  const flipSquare =
    laserLock > 0.5 ? (Math.sin(frame * 0.32) >= 0 ? 1 : 0) : 0;
  const smoothShellRadius = interpolate(
    Math.sin(frame * 0.32),
    [-0.3, 0.3],
    [1.05, 1.48],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  const activeRadius = laserLock > 0.5 ? smoothShellRadius : 1.05;

  const electronAngle = frame * 0.14;
  const ex = Math.cos(electronAngle) * activeRadius;
  const ey = Math.sin(electronAngle) * activeRadius;

  // Golden sinusoidal microwave laser beam geometry entering from left (-1.85) to atom center (0)
  const microwaveGeo = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const steps = 56;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = -1.85 + t * 1.85;
      const waveY = Math.sin(t * 22 - frame * 0.45) * 0.14 * laserLock;
      pts.push(new THREE.Vector3(x, waveY, 0.12));
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    return new THREE.TubeGeometry(curve, 56, 0.032, 10, false);
  }, [frame, laserLock]);

  return (
    <>
      <QuartzStudioRig fogDensity={0.038} sparklesColor="#00e5ff" />
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        fov={42}
        near={0.1}
        far={100}
        position={[camX, 0.55, 11.6]}
      />

      <group position={[0, 0.6, 0]}>
        {/* Glowing Golden Cesium-133 Nucleus Cluster */}
        <mesh>
          <sphereGeometry args={[0.28, 32, 32]} />
          <GoldenPulseMaterial intensity={1.1} />
        </mesh>

        {/* 3 Inner Dark-Metallic Core Electron Orbital Rings (90% Dark Gunmetal Contrast) */}
        {[
          [0.55, 0.4, 0.2],
          [-0.55, 0.3, -0.3],
          [0.2, -0.6, 0.5],
        ].map(([rx, ry, rz], idx) => (
          <mesh
            key={idx}
            rotation={[
              rx + frame * 0.015,
              ry + frame * 0.012,
              rz,
            ]}
          >
            <torusGeometry args={[0.65, 0.032, 14, 48]} />
            <DarkSiliconMaterial />
          </mesh>
        ))}

        {/* Inner Hyperfine Ground State Shell (F = 3, r = 1.05) */}
        <mesh>
          <torusGeometry args={[1.05, 0.026, 16, 64]} />
          {flipSquare === 0 ? (
            <CyanPiezoMaterial intensity={0.95} />
          ) : (
            <DarkSiliconMaterial />
          )}
        </mesh>

        {/* Outer Hyperfine Ground State Shell (F = 4, r = 1.48) */}
        <mesh>
          <torusGeometry args={[1.48, 0.026, 16, 64]} />
          {flipSquare === 1 ? (
            <CyanPiezoMaterial intensity={0.95} />
          ) : (
            <DarkSiliconMaterial />
          )}
        </mesh>

        {/* Single Bright Cyan Outer Valence Electron (6s1) */}
        <mesh position={[ex, ey, 0.08]}>
          <sphereGeometry args={[0.14, 24, 24]} />
          <CyanPiezoMaterial intensity={1.15} />
        </mesh>

        {/* Golden Microwave Laser Beam Exciting the Atom */}
        {laserLock > 0.05 && (
          <mesh geometry={microwaveGeo}>
            <GoldenPulseMaterial intensity={1.05} />
          </mesh>
        )}
      </group>

      {/* Crisp Non-Glowing HTML Labels (Strictly within Y = [-1.15, +2.35]) */}
      <CrispHtmlLabel
        position={[0, 2.32, 0.2]}
        text="CESIUM-133 OUTER VALENCE ELECTRON"
        subtext={
          flipSquare === 1
            ? "STATE: F = 4 (EXCITED HYPERFINE SHELL)"
            : "STATE: F = 3 (LOWER HYPERFINE SHELL)"
        }
        color="#ffffff"
        subColor="#00e5ff"
        fontSize={22}
      />

      <CrispHtmlLabel
        position={[0, -1.08, 0.2]}
        text="HYPERFINE GROUND STATE FLIP"
        subtext="MICROWAVE RESONANCE LOCK"
        color="#ffffff"
        subColor="#ffb84d"
        fontSize={22}
      />
    </>
  );
};

export const Scene9CesiumHyperfine: React.FC = () => {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: BG_VOID_COLOR, overflow: "hidden" }}>
      <Audio src={staticFile("clip-9.mp4")} playbackRate={1} />
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ fov: 42, position: [0, 0.55, 11.6], near: 0.1, far: 100 }}
        style={{ width: "100%", height: "100%", backgroundColor: BG_VOID_COLOR }}
      >
        <Scene9CesiumAtom3DContent />
      </ThreeCanvas>

      <MinimalTopTitle
        title="CESIUM-133 ATOMIC LOCK"
        subtitle="QUANTUM METRONOME"
        fontSize={56}
        subColor="#ffb84d"
      />
      <HardcodedSubtitle
        script="To fix that, scientists lock the quartz crystal to a Cesium-133 atom. When hit with the exact right microwave frequency, its outer electron flips energy states like a cosmic metronome."
        durationInFrames={300}
      />
    </AbsoluteFill>
  );
};

// ============================================================================
// SCENE 10 (Frames 2520 to 2820 / 10s): Full-Screen 3D 9.19 Billion Hz Global Sync
// Camera pulls back to reveal the Cesium atom at the center of a dark-metallic
// 3D Earth wireframe surrounded by 6 orbiting GPS satellite nodes within
// X = [-1.8, +1.8], Y = [-1.0, +2.0], all pulsing in locked golden unison.
// Giant top counter: "9,192,631,770 Hz // DRIFT: < 1 SEC IN 300,000,000 YEARS".
// ============================================================================
const Scene10GlobalSync3DContent: React.FC = () => {
  const frame = useCurrentFrame();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  const camZ = interpolate(frame, [0, 90], [10.4, 11.8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const camX = Math.sin(frame * 0.01) * 0.4;

  useLayoutEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.position.set(camX, 0.52, camZ);
      cameraRef.current.lookAt(0, 0.48, 0);
      cameraRef.current.updateProjectionMatrix();
      cameraRef.current.updateMatrixWorld();
    }
  }, [camX, camZ]);

  const SATELLITE_COUNT = 6;
  const orbitRadius = 1.48;
  const syncPulse = 0.75 + 0.35 * Math.sin(frame * 0.35);

  return (
    <>
      <QuartzStudioRig fogDensity={0.038} sparklesColor="#ffb84d" />
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        fov={42}
        near={0.1}
        far={100}
        position={[camX, 0.52, camZ]}
      />

      <group position={[0, 0.52, 0]}>
        {/* Dark-Metallic 3D Earth Core & Wireframe Meridian Rings */}
        <mesh>
          <sphereGeometry args={[0.78, 28, 28]} />
          <DarkSiliconMaterial />
        </mesh>

        {/* Glowing Cesium-133 Heartbeat Core at Center */}
        <mesh position={[0, 0, 0.8]}>
          <sphereGeometry args={[0.16, 20, 20]} />
          <CyanPiezoMaterial intensity={1.1} />
        </mesh>

        {/* Dark Metallic & Cyan Geodesic Latitude/Longitude Rings */}
        {[0, Math.PI / 3, (2 * Math.PI) / 3].map((rot, idx) => (
          <mesh
            key={`meridian-${idx}`}
            rotation={[0.25, rot + frame * 0.008, 0]}
          >
            <torusGeometry args={[0.82, 0.018, 12, 48]} />
            <CyanPiezoMaterial intensity={0.65} />
          </mesh>
        ))}

        {/* Outer Orbital Track Ring (radius = 1.48, stays strictly inside [-1.8, +1.8]) */}
        <mesh rotation={[0.18, 0, 0]}>
          <torusGeometry args={[orbitRadius, 0.02, 12, 64]} />
          <DarkSiliconMaterial />
        </mesh>

        {/* 6 Orbiting GPS Satellite Nodes Pulsing in Locked Golden Unison */}
        {Array.from({ length: SATELLITE_COUNT }).map((_, i) => {
          const angle =
            (i / SATELLITE_COUNT) * Math.PI * 2 + frame * 0.012;
          const sx = Math.cos(angle) * orbitRadius;
          const sy = Math.sin(angle) * orbitRadius * 0.92;
          const sz = Math.sin(angle) * 0.25;

          const midX = sx * 0.5;
          const midY = sy * 0.5;
          const len = Math.hypot(sx, sy);

          return (
            <React.Fragment key={i}>
              {/* Golden Atomic Sync Beam from Earth Core to Satellite */}
              <mesh
                position={[midX, midY, sz * 0.5]}
                rotation={[0, 0, Math.atan2(sy, sx) - Math.PI / 2]}
              >
                <cylinderGeometry args={[0.016, 0.016, len, 8]} />
                <GoldenPulseMaterial intensity={syncPulse} />
              </mesh>

              {/* Satellite Body + Dark Silicon Solar Wings */}
              <group position={[sx, sy, sz]} rotation={[0, 0, angle]}>
                {/* Solar Panels */}
                <RoundedBox
                  args={[0.48, 0.12, 0.04]}
                  radius={0.01}
                  smoothness={2}
                >
                  <DarkSiliconMaterial />
                </RoundedBox>
                {/* Golden Atomic Clock Core Node */}
                <mesh>
                  <sphereGeometry args={[0.11, 20, 20]} />
                  <GoldenPulseMaterial intensity={syncPulse} />
                </mesh>
              </group>
            </React.Fragment>
          );
        })}
      </group>

      <CrispHtmlLabel
        position={[0, 2.25, 0.2]}
        text="GLOBAL GPS ATOMIC CLOCK CONSTELLATION"
        color="#ffffff"
        fontSize={22}
      />

      <CrispHtmlLabel
        position={[0, -1.12, 0.2]}
        text="6× SATELLITE NODES PULSING IN LOCKED UNISON"
        subtext="ZERO CUMULATIVE TIME DRIFT"
        color="#ffffff"
        subColor="#ffb84d"
        fontSize={21}
      />
    </>
  );
};

export const Scene10GlobalAtomicSync: React.FC = () => {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: BG_VOID_COLOR, overflow: "hidden" }}>
      <Audio src={staticFile("clip-10.mp4")} playbackRate={1} />
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ fov: 42, position: [0, 0.52, 11.8], near: 0.1, far: 100 }}
        style={{ width: "100%", height: "100%", backgroundColor: BG_VOID_COLOR }}
      >
        <Scene10GlobalSync3DContent />
      </ThreeCanvas>

      <MinimalTopTitle
        title="9,192,631,770 Hz"
        subtitle="DRIFT: < 1 SEC IN 300,000,000 YEARS"
        fontSize={56}
        subColor="#ffb84d"
      />
      <HardcodedSubtitle
        script="That atom ticks over nine billion times every single second—creating an atomic clock so precise it wouldn't lose a single second in three hundred million years."
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
        script="From stock markets to satellites, the entire modern world runs on a vibrating piece of rock locked to an atom. Hit follow for more crazy engineering."
        durationInFrames={300}
      />
    </AbsoluteFill>
  );
};
