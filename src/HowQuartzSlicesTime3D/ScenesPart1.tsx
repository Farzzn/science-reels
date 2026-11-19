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
  BG_VOID_COLOR,
  CrispHtmlLabel,
  CyanPiezoMaterial,
  DarkSiliconMaterial,
  GoldenPulseMaterial,
  HardcodedSubtitle,
  MinimalTopTitle,
  QuartzStudioRig,
  RedErrorMaterial,
} from "./shared";

// ============================================================================
// SCENE 1 (Frames 0 to 240 / 8s): 50/50 Horizontal Split-Screen Hook
// Top Half (1080x960, top: 0, background: '#000000'):
// - Frames 0–125: Display <Img src={staticFile('quartz.jpg')} /> centered with
//   a subtle floating scale drift (1.0 to 1.05) and crisp top title
//   "RAW SiO2 QUARTZ CRYSTAL".
// - Frames 125–240: Smoothly crossfade/slice the quartz photo into a 3D glowing
//   cyan and golden laser-carved microscopic quartz tuning fork vibrating
//   rapidly inside a <ThreeCanvas>, with top title "32,768 VIBRATIONS / SECOND".
// ============================================================================
const Scene1TuningFork3DContent: React.FC = () => {
  const frame = useCurrentFrame();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  useLayoutEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 0.1, 11.2);
      cameraRef.current.lookAt(0, 0.05, 0);
      cameraRef.current.updateProjectionMatrix();
      cameraRef.current.updateMatrixWorld();
    }
  }, []);

  const reveal = interpolate(frame, [115, 145], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // High-frequency tine flex oscillation
  const flex = Math.sin(frame * 1.45) * 0.11 * reveal;
  const rotY = Math.sin(frame * 0.025) * 0.28;

  return (
    <>
      <QuartzStudioRig fogDensity={0.038} sparklesColor="#00e5ff" />
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        fov={42}
        near={0.1}
        far={100}
        position={[0, 0.1, 11.2]}
      />

      {reveal > 0.01 && (
        <group
          position={[0, 0.15, 0]}
          rotation={[0.1, rotY, 0]}
          scale={interpolate(reveal, [0, 1], [0.78, 1])}
        >
          {/* Dark Gunmetal SMD Mount Base */}
          <RoundedBox
            position={[0, -1.25, 0]}
            args={[1.8, 0.36, 0.75]}
            radius={0.06}
            smoothness={3}
          >
            <DarkSiliconMaterial />
          </RoundedBox>

          {/* U-Shape Base Bridge of the Quartz Tuning Fork */}
          <RoundedBox
            position={[0, -0.82, 0]}
            args={[1.18, 0.42, 0.28]}
            radius={0.07}
            smoothness={4}
          >
            <CyanPiezoMaterial intensity={1.1} />
          </RoundedBox>

          {/* Left Quartz Tine + Gold Piezo Electrode Stripe */}
          <group position={[-0.42 - flex, 0.22, 0]} rotation={[0, 0, flex * 0.6]}>
            <RoundedBox args={[0.26, 1.95, 0.26]} radius={0.05} smoothness={4}>
              <CyanPiezoMaterial intensity={1.1} />
            </RoundedBox>
            <mesh position={[0, 0, 0.14]}>
              <boxGeometry args={[0.11, 1.65, 0.03]} />
              <GoldenPulseMaterial intensity={1.1} />
            </mesh>
          </group>

          {/* Right Quartz Tine + Gold Piezo Electrode Stripe */}
          <group position={[0.42 + flex, 0.22, 0]} rotation={[0, 0, -flex * 0.6]}>
            <RoundedBox args={[0.26, 1.95, 0.26]} radius={0.05} smoothness={4}>
              <CyanPiezoMaterial intensity={1.1} />
            </RoundedBox>
            <mesh position={[0, 0, 0.14]}>
              <boxGeometry args={[0.11, 1.65, 0.03]} />
              <GoldenPulseMaterial intensity={1.1} />
            </mesh>
          </group>

          {/* Concentric Golden & Cyan Timing Wave Rings */}
          {[0, 1].map((rIdx) => {
            const wavePhase = ((frame * 0.035 + rIdx * 0.5) % 1 + 1) % 1;
            const ringScale = 0.75 + wavePhase * 1.35;
            return (
              <mesh
                key={rIdx}
                position={[0, 0.3, -0.15]}
                scale={[ringScale, ringScale, 1]}
              >
                <torusGeometry args={[0.85, 0.018, 12, 48]} />
                {rIdx === 0 ? (
                  <CyanPiezoMaterial intensity={1.0 * (1 - wavePhase)} />
                ) : (
                  <GoldenPulseMaterial intensity={1.0 * (1 - wavePhase)} />
                )}
              </mesh>
            );
          })}

          <CrispHtmlLabel
            position={[0, -1.32, 0.2]}
            text="LASER-CARVED QUARTZ TUNING FORK"
            subtext="PIEZO RESONANCE: 32,768 Hz"
            color="#ffffff"
            subColor="#00e5ff"
            fontSize={23}
          />
        </group>
      )}
    </>
  );
};

export const Scene1SplitHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const halfHeight = 960;

  const isRevealed = frame >= 125;

  // Subtle floating scale drift (1.0 to 1.05) on quartz.jpg in Frames 0–125
  const quartzScale = interpolate(frame, [0, 125], [1.0, 1.05], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Slice/crossfade transition from quartz.jpg to 3D tuning fork around Frame 120–148
  const sliceTransition = interpolate(frame, [118, 146], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  const SLICE_COUNT = 14;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000", overflow: "hidden" }}>
      {/* TOP HALF (1080x960 container, top: 0, background: '#000000') */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1080,
          height: halfHeight,
          overflow: "hidden",
          backgroundColor: "#000000",
        }}
      >
        <ThreeCanvas
          width={width}
          height={halfHeight}
          camera={{ fov: 42, position: [0, 0.1, 11.2], near: 0.1, far: 100 }}
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#000000",
          }}
        >
          <Scene1TuningFork3DContent />
        </ThreeCanvas>

        {/* Frames 0–146: Photorealistic Raw Quartz Photo (public/quartz.jpg) */}
        {sliceTransition < 0.99 && (
          <div
            style={{
              position: "absolute",
              top: 170,
              left: 190,
              width: 700,
              height: 760,
              pointerEvents: "none",
              mixBlendMode: "screen",
              transform: `scale(${quartzScale.toFixed(4)})`,
            }}
          >
            {sliceTransition <= 0.001 ? (
              <Img
                src={staticFile("quartz.jpg")}
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
                const offsetY = sliceTransition * dir * (60 + (i % 3) * 20);
                const offsetX =
                  sliceTransition * ((i - (SLICE_COUNT - 1) / 2) * 6);
                const opacity = interpolate(
                  sliceTransition,
                  [0, 0.5, 1],
                  [1, 0.8, 0],
                );

                return (
                  <Img
                    key={i}
                    src={staticFile("quartz.jpg")}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      clipPath: `inset(0% ${rightPct.toFixed(2)}% 0% ${leftPct.toFixed(2)}%)`,
                      transform: `translate(${offsetX.toFixed(1)}px, ${offsetY.toFixed(1)}px)`,
                      opacity,
                    }}
                  />
                );
              })
            )}
          </div>
        )}

        <MinimalTopTitle
          title={
            isRevealed
              ? "32,768 VIBRATIONS / SECOND"
              : "RAW SiO2 QUARTZ CRYSTAL"
          }
          subtitle={
            isRevealed
              ? "MICROSCOPIC QUARTZ TUNING FORK"
              : "NATURAL SILICON DIOXIDE MINERAL"
          }
          fontSize={52}
          topOffset={48}
          subColor={isRevealed ? "#ffb84d" : "#00e5ff"}
        />
      </div>

      {/* BOTTOM HALF (1080x960 container, top: 960, borderTop: '2px solid rgba(255,255,255,0.15)') */}
      <div
        style={{
          position: "absolute",
          top: halfHeight,
          left: 0,
          width: 1080,
          height: halfHeight,
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
            objectPosition: "50% 18.5%",
          }}
        />
      </div>

      <HardcodedSubtitle
        script="This is an ordinary piece of quartz rock. Squeeze it with electricity, and it turns into a microscopic machine that slices time into billions."
        durationInFrames={240}
      />
    </AbsoluteFill>
  );
};

// ============================================================================
// SCENE 2 (Frames 240 to 540 / 10s): Full-Screen 3D Mechanical Gears & Thermal Drift
// Render 3 interlocking dark-metallic 3D clock gears and a swinging brass
// pendulum between Y = [-1.0, +2.2]. As a red thermal heat wave rises across
// the gears, the pendulum swing desynchronizes from a cyan reference grid, and
// a clean top header ticks red: "MECHANICAL DRIFT: +14.8 SECONDS / WEEK (FRICTION + HEAT)".
// ============================================================================
const ClockGear3D: React.FC<{
  position: [number, number, number];
  radius: number;
  teeth: number;
  rotationZ: number;
  heatLevel: number;
}> = ({ position, radius, teeth, rotationZ, heatLevel }) => {
  return (
    <group position={position} rotation={[0, 0, rotationZ]}>
      {/* Main Dark Gunmetal Gear Wheel */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[radius, radius, 0.22, 36]} />
        <DarkSiliconMaterial />
      </mesh>
      {/* Inner Hub Ring (warms to Red Error Material as heat wave rises) */}
      <mesh position={[0, 0, 0.12]}>
        <torusGeometry args={[radius * 0.52, 0.045, 14, 36]} />
        {heatLevel > 0.35 ? (
          <RedErrorMaterial intensity={0.4 + heatLevel * 0.6} />
        ) : (
          <GoldenPulseMaterial intensity={0.85} />
        )}
      </mesh>
      {/* Gear Teeth around Perimeter */}
      {Array.from({ length: teeth }).map((_, i) => {
        const angle = (i / teeth) * Math.PI * 2;
        const tx = Math.cos(angle) * (radius + 0.08);
        const ty = Math.sin(angle) * (radius + 0.08);
        return (
          <mesh
            key={i}
            position={[tx, ty, 0]}
            rotation={[0, 0, angle]}
          >
            <boxGeometry args={[0.18, 0.12, 0.2]} />
            <DarkSiliconMaterial />
          </mesh>
        );
      })}
    </group>
  );
};

const Scene2MechanicalDrift3DContent: React.FC = () => {
  const frame = useCurrentFrame();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  const camX = Math.sin(frame * 0.01) * 0.45;
  useLayoutEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.position.set(camX, 0.45, 11.6);
      cameraRef.current.lookAt(0, 0.35, 0);
      cameraRef.current.updateProjectionMatrix();
      cameraRef.current.updateMatrixWorld();
    }
  }, [camX]);

  // Thermal heat wave rises starting at frame 70
  const heatProgress = interpolate(frame, [65, 220], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  // Ideal reference phase vs drifting mechanical phase
  const idealAngle = Math.sin(frame * 0.105) * 0.42;
  const driftedAngle =
    Math.sin(frame * 0.105 - heatProgress * 1.15) * (0.42 - heatProgress * 0.07);

  const gearAngle = frame * 0.024 - heatProgress * 0.35;

  return (
    <>
      <QuartzStudioRig fogDensity={0.038} sparklesColor="#ffb84d" />
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        fov={42}
        near={0.1}
        far={100}
        position={[camX, 0.45, 11.6]}
      />

      {/* 3 Interlocking Dark-Metallic 3D Clock Gears between Y = [+0.5, +2.1] */}
      <ClockGear3D
        position={[-0.78, 1.48, -0.15]}
        radius={0.68}
        teeth={14}
        rotationZ={gearAngle}
        heatLevel={heatProgress}
      />
      <ClockGear3D
        position={[0.62, 1.58, -0.15]}
        radius={0.58}
        teeth={12}
        rotationZ={-gearAngle * (14 / 12)}
        heatLevel={heatProgress}
      />
      <ClockGear3D
        position={[0.0, 0.72, -0.05]}
        radius={0.48}
        teeth={10}
        rotationZ={gearAngle * (14 / 10)}
        heatLevel={heatProgress}
      />

      {/* Cyan Reference Grid Arc + Ideal Reference Pointer */}
      <group position={[0, 0.72, 0.05]}>
        <mesh position={[0, -1.45, -0.1]}>
          <boxGeometry args={[2.5, 0.03, 0.03]} />
          <CyanPiezoMaterial intensity={0.95} />
        </mesh>
        {[-0.8, -0.4, 0, 0.4, 0.8].map((tickX, idx) => (
          <mesh key={idx} position={[tickX, -1.45, -0.08]}>
            <boxGeometry args={[0.03, 0.18, 0.03]} />
            <CyanPiezoMaterial intensity={1.0} />
          </mesh>
        ))}

        {/* Ideal Ghost Cyan Reference Pendulum Line */}
        <group rotation={[0, 0, idealAngle]}>
          <mesh position={[0, -0.75, -0.06]}>
            <boxGeometry args={[0.025, 1.45, 0.02]} />
            <CyanPiezoMaterial intensity={0.85} />
          </mesh>
        </group>

        {/* Swinging Brass/Gold Mechanical Pendulum (Desynchronizes under Thermal Drift) */}
        <group rotation={[0, 0, driftedAngle]}>
          {/* Pendulum Rod */}
          <mesh position={[0, -0.72, 0.08]}>
            <cylinderGeometry args={[0.04, 0.04, 1.42, 16]} />
            <DarkSiliconMaterial />
          </mesh>
          {/* Pendulum Bob at Y ≈ -0.73 relative to world (stays >= -1.0) */}
          <mesh position={[0, -1.42, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.34, 0.34, 0.14, 32]} />
            {heatProgress > 0.45 ? (
              <RedErrorMaterial intensity={1.0} />
            ) : (
              <GoldenPulseMaterial intensity={1.1} />
            )}
          </mesh>
        </group>
      </group>

      {/* Rising Red Thermal Heat Wave Bar across the Gears */}
      {heatProgress > 0.05 && (
        <mesh
          position={[
            0,
            interpolate(heatProgress, [0, 1], [-0.8, 1.65]),
            0.25,
          ]}
        >
          <boxGeometry args={[2.9, 0.04, 0.04]} />
          <RedErrorMaterial intensity={1.0} />
        </mesh>
      )}

      {/* Crisp Non-Glowing HTML Labels (All strictly >= -1.15) */}
      <CrispHtmlLabel
        position={[0, 2.25, 0.2]}
        text={
          heatProgress > 0.35
            ? "THERMAL EXPANSION + FRICTION"
            : "MECHANICAL ESCAPEMENT GEARS"
        }
        color="#ffffff"
        subColor={heatProgress > 0.35 ? "#ff3333" : "#ffb84d"}
        fontSize={22}
      />

      <CrispHtmlLabel
        position={[0, -1.08, 0.2]}
        text="CYAN = IDEAL TIME  ·  GOLD/RED = DRIFTING PENDULUM"
        subtext="PHASE DESYNCHRONIZATION"
        color="#ffffff"
        subColor="#00e5ff"
        fontSize={21}
      />
    </>
  );
};

export const Scene2MechanicalDrift: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const driftProgress = interpolate(frame, [45, 250], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const driftSeconds = (driftProgress * 14.8).toFixed(1);
  const isDrifting = frame >= 75;

  return (
    <AbsoluteFill style={{ backgroundColor: BG_VOID_COLOR, overflow: "hidden" }}>
      <Audio src={staticFile("clip-2.mp4")} playbackRate={1} />
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ fov: 42, position: [0, 0.45, 11.6], near: 0.1, far: 100 }}
        style={{ width: "100%", height: "100%", backgroundColor: BG_VOID_COLOR }}
      >
        <Scene2MechanicalDrift3DContent />
      </ThreeCanvas>

      <MinimalTopTitle
        title={`MECHANICAL DRIFT: +${driftSeconds}s / WEEK`}
        subtitle="FRICTION + HEAT EXPANSION"
        fontSize={50}
        accentColor={isDrifting ? "#ff4d4d" : "#ffffff"}
        subColor={isDrifting ? "#ffb84d" : "#00e5ff"}
      />
      <HardcodedSubtitle
        script="For centuries, humans measured time using swinging pendulums and mechanical gears. Beautiful, sure—but friction and temperature make every mechanical clock drift."
        durationInFrames={300}
      />
    </AbsoluteFill>
  );
};

// ============================================================================
// SCENE 3 (Frames 540 to 840 / 10s): Full-Screen 3D Piezoelectric Crystal Lattice
// Render a 3D hexagonal molecular lattice of Silicon (cyan spheres) and Oxygen
// (dark steel spheres) connected by metallic struts at Y = [0.5]. Two dark steel
// compression plates squeeze the lattice vertically; each squeeze shifts the
// charge center and fires a crisp golden voltage waveform pulse across an
// oscilloscope line above it. Top title:
// "PIEZOELECTRIC EFFECT // MECHANICAL STRESS = VOLTAGE SPARK".
// ============================================================================
const Scene3PiezoelectricLattice3DContent: React.FC = () => {
  const frame = useCurrentFrame();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  const camX = Math.sin(frame * 0.012) * 0.55;
  useLayoutEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.position.set(camX, 0.5, 11.6);
      cameraRef.current.lookAt(0, 0.45, 0);
      cameraRef.current.updateProjectionMatrix();
      cameraRef.current.updateMatrixWorld();
    }
  }, [camX]);

  // Cyclic mechanical compression pulse (squeezes 3 times across 300 frames)
  const squeezeWave = Math.pow(Math.max(0, Math.sin(frame * 0.075)), 2);
  const scaleY = 1 - squeezeWave * 0.24;
  const scaleX = 1 + squeezeWave * 0.14;

  // Hexagonal SiO2 lattice nodes centered at (0, 0.35, 0)
  const hexNodes = useMemo(() => {
    const nodes: {
      baseX: number;
      baseY: number;
      z: number;
      isSilicon: boolean;
    }[] = [];

    const radius = 0.92;
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2 + Math.PI / 6;
      nodes.push({
        baseX: Math.cos(angle) * radius,
        baseY: Math.sin(angle) * radius,
        z: (i % 2 === 0 ? 1 : -1) * 0.14,
        isSilicon: i % 2 === 0, // 3 Cyan Silicon (Si4+) + 3 Dark Steel Oxygen (O2-)
      });
    }
    return nodes;
  }, []);

  // Golden oscilloscope waveform geometry above the lattice at Y = +1.95
  const scopeGeo = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const steps = 72;
    const pulseCenter = ((frame * 0.032) % 1) * 3.0 - 1.5;

    for (let i = 0; i <= steps; i++) {
      const x = -1.55 + (i / steps) * 3.1;
      const dist = x - pulseCenter;
      const packet =
        Math.exp(-(dist * dist) / 0.08) *
        Math.sin(dist * 14) *
        (0.12 + squeezeWave * 0.32);
      pts.push(new THREE.Vector3(x, 1.92 + packet, 0.1));
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    return new THREE.TubeGeometry(curve, 64, 0.035, 10, false);
  }, [frame, squeezeWave]);

  const topPlateY = 0.35 + 1.05 * scaleY;
  const bottomPlateY = 0.35 - 1.05 * scaleY;

  return (
    <>
      <QuartzStudioRig fogDensity={0.038} sparklesColor="#00e5ff" />
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        fov={42}
        near={0.1}
        far={100}
        position={[camX, 0.5, 11.6]}
      />

      {/* Oscilloscope Backing Rail & Golden Voltage Waveform Pulse at Y = +1.92 */}
      <RoundedBox
        position={[0, 1.92, -0.08]}
        args={[3.35, 0.68, 0.12]}
        radius={0.05}
        smoothness={3}
      >
        <DarkSiliconMaterial />
      </RoundedBox>
      <mesh geometry={scopeGeo}>
        <GoldenPulseMaterial intensity={0.85 + squeezeWave * 0.3} />
      </mesh>
      <CrispHtmlLabel
        position={[0, 2.38, 0.15]}
        text="GOLDEN VOLTAGE WAVEFORM PULSE"
        color="#ffb84d"
        fontSize={21}
      />

      {/* Top & Bottom Dark Steel Compression Plates */}
      <RoundedBox
        position={[0, topPlateY, 0]}
        args={[2.6, 0.18, 0.9]}
        radius={0.04}
        smoothness={3}
      >
        <DarkSiliconMaterial />
      </RoundedBox>
      <RoundedBox
        position={[0, bottomPlateY, 0]}
        args={[2.6, 0.18, 0.9]}
        radius={0.04}
        smoothness={3}
      >
        <DarkSiliconMaterial />
      </RoundedBox>

      {/* 3D Hexagonal SiO2 Molecular Lattice at Y = 0.35 */}
      <group position={[0, 0.35, 0]}>
        {/* Center Dipole Charge Indicator */}
        <mesh position={[0, squeezeWave * 0.18, 0]}>
          <sphereGeometry args={[0.14, 20, 20]} />
          <GoldenPulseMaterial intensity={0.6 + squeezeWave * 0.55} />
        </mesh>

        {/* Metallic Bond Struts around Hexagon */}
        {hexNodes.map((n, i) => {
          const next = hexNodes[(i + 1) % hexNodes.length];
          const p1 = new THREE.Vector3(n.baseX * scaleX, n.baseY * scaleY, n.z);
          const p2 = new THREE.Vector3(
            next.baseX * scaleX,
            next.baseY * scaleY,
            next.z,
          );
          const mid = p1.clone().add(p2).multiplyScalar(0.5);
          const len = p1.distanceTo(p2);
          const dir = p2.clone().sub(p1).normalize();
          const quat = new THREE.Quaternion().setFromUnitVectors(
            new THREE.Vector3(0, 1, 0),
            dir,
          );
          const euler = new THREE.Euler().setFromQuaternion(quat);

          return (
            <mesh
              key={`strut-${i}`}
              position={[mid.x, mid.y, mid.z]}
              rotation={euler}
            >
              <cylinderGeometry args={[0.045, 0.045, len, 12]} />
              <DarkSiliconMaterial />
            </mesh>
          );
        })}

        {/* Silicon (Cyan) & Oxygen (Dark Steel) Atoms */}
        {hexNodes.map((n, i) => (
          <mesh
            key={`atom-${i}`}
            position={[n.baseX * scaleX, n.baseY * scaleY, n.z]}
          >
            <sphereGeometry args={[n.isSilicon ? 0.21 : 0.18, 28, 28]} />
            {n.isSilicon ? (
              <CyanPiezoMaterial intensity={1.1} />
            ) : (
              <DarkSiliconMaterial />
            )}
          </mesh>
        ))}
      </group>

      <CrispHtmlLabel
        position={[0, -1.05, 0.2]}
        text="CYAN = SILICON (Si⁴⁺)  ·  STEEL = OXYGEN (O²⁻)"
        subtext="COMPRESSION SHIFTS ATOMIC CHARGE CENTER"
        color="#ffffff"
        subColor="#00e5ff"
        fontSize={21}
      />
    </>
  );
};

export const Scene3PiezoelectricLattice: React.FC = () => {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: BG_VOID_COLOR, overflow: "hidden" }}>
      <Audio src={staticFile("clip-3.mp4")} playbackRate={1} />
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ fov: 42, position: [0, 0.5, 11.6], near: 0.1, far: 100 }}
        style={{ width: "100%", height: "100%", backgroundColor: BG_VOID_COLOR }}
      >
        <Scene3PiezoelectricLattice3DContent />
      </ThreeCanvas>

      <MinimalTopTitle
        title="PIEZOELECTRIC EFFECT"
        subtitle="MECHANICAL STRESS = VOLTAGE SPARK"
        fontSize={56}
        subColor="#ffb84d"
      />
      <HardcodedSubtitle
        script="Then physicists discovered a weird glitch in quartz crystals called piezoelectricity. If you physically crush a quartz crystal, its atoms shift and shoot out a spark of voltage."
        durationInFrames={300}
      />
    </AbsoluteFill>
  );
};
