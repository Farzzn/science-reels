import { PerspectiveCamera, RoundedBox } from "@react-three/drei";
import { ThreeCanvas } from "@remotion/three";
import React, { useLayoutEffect, useMemo, useRef } from "react";
import {
  AbsoluteFill,
  Audio,
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
// SCENE 4 (Frames 840 to 1080 / 8s): Full-Screen Host Pivot 1
// ============================================================================
export const Scene4HostPivot1: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000000", overflow: "hidden" }}>
      <OffthreadVideo
        src={staticFile("clip-4.mp4")}
        playbackRate={1}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <HardcodedSubtitle
        script="Even crazier—that trick works in reverse. Zap the crystal with electricity from a battery, and the rock physically flexes and vibrates on its own."
        durationInFrames={240}
      />
    </AbsoluteFill>
  );
};

// ============================================================================
// SCENE 5 (Frames 1080 to 1380 / 10s): Full-Screen 3D Microscopic Quartz Tuning Fork
// Camera orbits a decapped dark-steel SMD microchip housing at Y = [0.4],
// inside which sits a 3D U-shaped quartz tuning fork plated with gold electrodes.
// The two tines flex inward and outward in a crisp cyan standing-wave blur,
// emitting clean concentric timing rings.
// ============================================================================
const Scene5SMDTuningFork3DContent: React.FC = () => {
  const frame = useCurrentFrame();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  const orbit = Math.sin(frame * 0.015) * 0.42;
  const camX = Math.sin(orbit) * 11.5;
  const camZ = Math.cos(orbit) * 11.5;
  const camY = 0.55 + Math.cos(frame * 0.012) * 0.18;

  useLayoutEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.position.set(camX, camY, camZ);
      cameraRef.current.lookAt(0, 0.4, 0);
      cameraRef.current.updateProjectionMatrix();
      cameraRef.current.updateMatrixWorld();
    }
  }, [camX, camY, camZ]);

  const flex = Math.sin(frame * 1.65) * 0.12;

  return (
    <>
      <QuartzStudioRig fogDensity={0.038} sparklesColor="#00e5ff" />
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        fov={42}
        near={0.1}
        far={100}
        position={[camX, camY, camZ]}
      />

      <group position={[0, 0.42, 0]}>
        {/* Decapped Dark-Steel SMD Oscillator Package Housing (90% Dark Gunmetal Contrast) */}
        <RoundedBox
          position={[0, 0, -0.32]}
          args={[2.65, 3.05, 0.24]}
          radius={0.08}
          smoothness={4}
        >
          <DarkSiliconMaterial />
        </RoundedBox>
        {/* 4 Outer Cavity Walls of the Decapped SMD Package */}
        <RoundedBox
          position={[0, 1.44, -0.05]}
          args={[2.65, 0.18, 0.35]}
          radius={0.03}
          smoothness={2}
        >
          <DarkSiliconMaterial />
        </RoundedBox>
        <RoundedBox
          position={[0, -1.44, -0.05]}
          args={[2.65, 0.18, 0.35]}
          radius={0.03}
          smoothness={2}
        >
          <DarkSiliconMaterial />
        </RoundedBox>
        <RoundedBox
          position={[-1.24, 0, -0.05]}
          args={[0.18, 2.75, 0.35]}
          radius={0.03}
          smoothness={2}
        >
          <DarkSiliconMaterial />
        </RoundedBox>
        <RoundedBox
          position={[1.24, 0, -0.05]}
          args={[0.18, 2.75, 0.35]}
          radius={0.03}
          smoothness={2}
        >
          <DarkSiliconMaterial />
        </RoundedBox>

        {/* Gold Solder Contact Pads at Bottom of SMD Cavity */}
        {[-0.48, 0.48].map((px, i) => (
          <RoundedBox
            key={i}
            position={[px, -1.12, 0.04]}
            args={[0.42, 0.28, 0.14]}
            radius={0.03}
            smoothness={2}
          >
            <GoldenPulseMaterial intensity={1.0} />
          </RoundedBox>
        ))}

        {/* U-Shaped Quartz Tuning Fork Bridge */}
        <RoundedBox
          position={[0, -0.78, 0.08]}
          args={[1.22, 0.42, 0.26]}
          radius={0.06}
          smoothness={4}
        >
          <CyanPiezoMaterial intensity={1.1} />
        </RoundedBox>

        {/* Left Tine + Standing-Wave Blur Envelope + Gold Electrode */}
        <group
          position={[-0.45 - flex, 0.28, 0.08]}
          rotation={[0, 0, flex * 0.55]}
        >
          <RoundedBox args={[0.26, 1.95, 0.24]} radius={0.05} smoothness={4}>
            <CyanPiezoMaterial intensity={1.1} />
          </RoundedBox>
          <mesh position={[0, 0, 0.13]}>
            <boxGeometry args={[0.11, 1.68, 0.03]} />
            <GoldenPulseMaterial intensity={1.1} />
          </mesh>
        </group>

        {/* Right Tine + Standing-Wave Blur Envelope + Gold Electrode */}
        <group
          position={[0.45 + flex, 0.28, 0.08]}
          rotation={[0, 0, -flex * 0.55]}
        >
          <RoundedBox args={[0.26, 1.95, 0.24]} radius={0.05} smoothness={4}>
            <CyanPiezoMaterial intensity={1.1} />
          </RoundedBox>
          <mesh position={[0, 0, 0.13]}>
            <boxGeometry args={[0.11, 1.68, 0.03]} />
            <GoldenPulseMaterial intensity={1.1} />
          </mesh>
        </group>

        {/* Standing-Wave Extremum Ghost Outlines */}
        {[-0.12, 0.12].map((ghostFlex, gIdx) => (
          <React.Fragment key={gIdx}>
            <mesh
              position={[-0.45 - ghostFlex, 0.28, 0.05]}
              rotation={[0, 0, ghostFlex * 0.55]}
            >
              <boxGeometry args={[0.24, 1.92, 0.08]} />
              <CyanPiezoMaterial intensity={0.45} />
            </mesh>
            <mesh
              position={[0.45 + ghostFlex, 0.28, 0.05]}
              rotation={[0, 0, -ghostFlex * 0.55]}
            >
              <boxGeometry args={[0.24, 1.92, 0.08]} />
              <CyanPiezoMaterial intensity={0.45} />
            </mesh>
          </React.Fragment>
        ))}

        {/* Concentric Timing Rings */}
        {[0, 1, 2].map((rIdx) => {
          const phase = ((frame * 0.03 + rIdx / 3) % 1 + 1) % 1;
          const rScale = 0.65 + phase * 1.2;
          return (
            <mesh
              key={rIdx}
              position={[0, 0.35, 0.22]}
              scale={[rScale, rScale, 1]}
            >
              <torusGeometry args={[0.85, 0.016, 12, 48]} />
              {rIdx % 2 === 0 ? (
                <CyanPiezoMaterial intensity={0.95 * (1 - phase)} />
              ) : (
                <GoldenPulseMaterial intensity={0.95 * (1 - phase)} />
              )}
            </mesh>
          );
        })}
      </group>

      <CrispHtmlLabel
        position={[0, 2.22, 0.2]}
        text="DECAPPED SMD QUARTZ OSCILLATOR"
        subtext="GOLD PIEZO ELECTRODES + SiO2 TINES"
        color="#ffffff"
        subColor="#ffb84d"
        fontSize={22}
      />

      <CrispHtmlLabel
        position={[0, -1.2, 0.25]}
        text="STANDING-WAVE FLEX: 32,768 Hz"
        color="#00e5ff"
        fontSize={22}
      />
    </>
  );
};

export const Scene5MicroscopicTuningFork: React.FC = () => {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: BG_VOID_COLOR, overflow: "hidden" }}>
      <Audio src={staticFile("clip-5.mp4")} playbackRate={1} />
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ fov: 42, position: [0, 0.55, 11.5], near: 0.1, far: 100 }}
        style={{ width: "100%", height: "100%", backgroundColor: BG_VOID_COLOR }}
      >
        <Scene5SMDTuningFork3DContent />
      </ThreeCanvas>

      <MinimalTopTitle
        title="RESONANT FREQUENCY: 32,768 Hz"
        subtitle="EXACTLY 2^15 CYCLES / SEC"
        fontSize={50}
        subColor="#00e5ff"
      />
      <HardcodedSubtitle
        script="Inside your phone and wristwatch, engineers laser-carve that quartz into a microscopic tuning fork. Zap it with power, and it rings at exactly thirty-two thousand seven hundred and sixty-eight times a second."
        durationInFrames={300}
      />
    </AbsoluteFill>
  );
};

// ============================================================================
// SCENE 6 (Frames 1380 to 1680 / 10s): Full-Screen 3D 15-Stage Binary Flip-Flop Tower
// Arrange a vertical 3D cascade of 15 dark-gunmetal binary divider blocks
// ("STAGE 01" to "STAGE 15") arranged in a clean 3x5 grid inside
// X = [-1.8, +1.8] and Y = [-1.0, +2.4]. High-speed cyan pulses enter Stage 01
// at the top left ("INPUT: 32,768 Hz = 2^15") and step through the gates sequentially.
// ============================================================================
const Scene6BinaryFlipFlop3DContent: React.FC = () => {
  const frame = useCurrentFrame();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  const camX = Math.sin(frame * 0.01) * 0.38;
  useLayoutEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.position.set(camX, 0.58, 11.6);
      cameraRef.current.lookAt(0, 0.55, 0);
      cameraRef.current.updateProjectionMatrix();
      cameraRef.current.updateMatrixWorld();
    }
  }, [camX]);

  // 3 columns × 5 rows serpentine layout inside X = [-1.15, +1.15], Y = [-0.65, +1.85]
  const stages = useMemo(() => {
    const arr: {
      stageNum: number;
      x: number;
      y: number;
      freq: number;
    }[] = [];

    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 3; c++) {
        const idx = r * 3 + c;
        const stageNum = idx + 1;
        // Serpentine horizontal order per row
        const colIdx = r % 2 === 0 ? c : 2 - c;
        const x = (colIdx - 1) * 1.12;
        const y = 1.82 - r * 0.61;
        const freq = Math.round(32768 / Math.pow(2, stageNum));
        arr.push({ stageNum, x, y, freq });
      }
    }
    return arr;
  }, []);

  // Active signal front sweeping sequentially through all 15 stages
  const activeStageFloat = interpolate(frame, [10, 240], [1, 15.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <>
      <QuartzStudioRig fogDensity={0.038} sparklesColor="#00e5ff" />
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        fov={42}
        near={0.1}
        far={100}
        position={[camX, 0.58, 11.6]}
      />

      {/* Dark Gunmetal Silicon Backplane Behind 3x5 Grid */}
      <RoundedBox
        position={[0, 0.6, -0.18]}
        args={[3.55, 3.25, 0.14]}
        radius={0.07}
        smoothness={3}
      >
        <DarkSiliconMaterial />
      </RoundedBox>

      {/* Serpentine Trace Conduits Connecting Stage 01 -> Stage 15 */}
      {stages.slice(0, 14).map((st, idx) => {
        const next = stages[idx + 1];
        const midX = (st.x + next.x) / 2;
        const midY = (st.y + next.y) / 2;
        const dx = next.x - st.x;
        const dy = next.y - st.y;
        const len = Math.hypot(dx, dy);
        const angle = Math.atan2(dy, dx);
        const isLit = activeStageFloat >= st.stageNum + 0.5;

        return (
          <mesh
            key={`trace-${idx}`}
            position={[midX, midY, -0.02]}
            rotation={[0, 0, angle]}
          >
            <boxGeometry args={[len, 0.045, 0.045]} />
            {isLit ? (
              <CyanPiezoMaterial intensity={0.95} />
            ) : (
              <DarkSiliconMaterial />
            )}
          </mesh>
        );
      })}

      {/* 15 Binary Flip-Flop Divider Blocks */}
      {stages.map((st) => {
        const isReached = activeStageFloat >= st.stageNum;
        const isFinalStage = st.stageNum === 15;
        // Higher stages blink slower as frequency halves at each flip-flop
        const blinkRate = Math.max(0.08, 1.2 / Math.pow(1.35, st.stageNum - 1));
        const blink = isReached
          ? 0.55 + 0.55 * Math.abs(Math.sin(frame * blinkRate))
          : 0;

        return (
          <group key={st.stageNum} position={[st.x, st.y, 0.04]}>
            {/* Main Dark Gunmetal Flip-Flop Gate Block */}
            <RoundedBox args={[0.82, 0.42, 0.18]} radius={0.05} smoothness={3}>
              <DarkSiliconMaterial />
            </RoundedBox>

            {/* Active Status LED Strip on Gate */}
            <RoundedBox
              position={[0, 0, 0.1]}
              args={[0.68, 0.24, 0.04]}
              radius={0.03}
              smoothness={2}
            >
              {!isReached ? (
                <DarkSiliconMaterial />
              ) : isFinalStage ? (
                <GoldenPulseMaterial intensity={1.1} />
              ) : (
                <CyanPiezoMaterial intensity={Math.max(0.35, blink)} />
              )}
            </RoundedBox>
          </group>
        );
      })}

      {/* Crisp Non-Glowing HTML Labels (All strictly >= -1.15) */}
      <CrispHtmlLabel
        position={[0, 2.32, 0.2]}
        text="INPUT: 32,768 Hz = 2^15  (STAGE 01 → STAGE 08 → STAGE 15)"
        subtext="15 SEQUENTIAL BINARY FLIP-FLOP DIVIDERS (÷2 EACH)"
        color="#ffffff"
        subColor="#00e5ff"
        fontSize={21}
      />

      <CrispHtmlLabel
        position={[0, -1.08, 0.2]}
        text="STAGE 15 OUTPUT: 1.000 Hz"
        subtext="32,768 ÷ 2^15 = 1 TICK / SEC"
        color="#ffffff"
        subColor="#ffb84d"
        fontSize={21}
      />
    </>
  );
};

export const Scene6BinaryFlipFlopTower: React.FC = () => {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: BG_VOID_COLOR, overflow: "hidden" }}>
      <Audio src={staticFile("clip-6.mp4")} playbackRate={1} />
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ fov: 42, position: [0, 0.58, 11.6], near: 0.1, far: 100 }}
        style={{ width: "100%", height: "100%", backgroundColor: BG_VOID_COLOR }}
      >
        <Scene6BinaryFlipFlop3DContent />
      </ThreeCanvas>

      <MinimalTopTitle
        title="BINARY FREQUENCY DIVISION"
        subtitle="2^15 = 32,768  ·  15 FLIP-FLOP GATES"
        fontSize={52}
        subColor="#00e5ff"
      />
      <HardcodedSubtitle
        script="Why that weird, hyper-specific number? Because thirty-two thousand seven hundred and sixty-eight is two to the power of fifteen. Pass that vibration through a chain of fifteen binary switches..."
        durationInFrames={300}
      />
    </AbsoluteFill>
  );
};

// ============================================================================
// SCENE 7 (Frames 1680 to 1980 / 10s): Full-Screen 3D Halving Cascade to 1.000 Hz
// Camera tracks down a 6-step highlighted vertical column of 3D frequency bars
// inside Y = [-1.0, +2.2] with razor-sharp <Html center> labels:
// "32,768 Hz -> 16,384 Hz -> 8,192 Hz -> 4,096 Hz -> ... -> 1.000 Hz".
// Every 30 frames (1.0 second), the bottom golden master block fires a crisp
// single golden shockwave ring ("OUTPUT: 1 PULSE PER SECOND").
// ============================================================================
const Scene7HalvingCascade3DContent: React.FC = () => {
  const frame = useCurrentFrame();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  const camY = interpolate(frame, [0, 300], [0.75, 0.35]);
  const camX = Math.sin(frame * 0.01) * 0.35;

  useLayoutEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.position.set(camX, camY, 11.6);
      cameraRef.current.lookAt(0, 0.45, 0);
      cameraRef.current.updateProjectionMatrix();
      cameraRef.current.updateMatrixWorld();
    }
  }, [camX, camY]);

  const steps = [
    { label: "32,768 Hz", y: 2.02, width: 2.8, isMaster: false },
    { label: "16,384 Hz", y: 1.48, width: 2.3, isMaster: false },
    { label: "8,192 Hz", y: 0.94, width: 1.85, isMaster: false },
    { label: "4,096 Hz", y: 0.40, width: 1.45, isMaster: false },
    { label: "... ÷ 2^11 ...", y: -0.14, width: 1.1, isMaster: false },
    { label: "1.000 Hz", y: -0.72, width: 1.75, isMaster: true },
  ];

  // Every 30 frames (1.0 second at 30fps), fire a crisp golden shockwave ring
  const secPhase = (frame % 30) / 30;
  const ringScale = 0.55 + secPhase * 1.45;
  const ringIntensity = interpolate(secPhase, [0, 0.2, 1], [1.15, 1.0, 0]);

  return (
    <>
      <QuartzStudioRig fogDensity={0.038} sparklesColor="#ffb84d" />
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        fov={42}
        near={0.1}
        far={100}
        position={[camX, camY, 11.6]}
      />

      {/* Central Dark Gunmetal Spine Column */}
      <RoundedBox
        position={[0, 0.65, -0.16]}
        args={[3.35, 3.35, 0.14]}
        radius={0.07}
        smoothness={3}
      >
        <DarkSiliconMaterial />
      </RoundedBox>

      {steps.map((st, idx) => {
        const pulse =
          0.7 + 0.3 * Math.sin(frame * (0.35 / (idx + 1)) - idx * 0.6);

        return (
          <group key={st.label} position={[0, st.y, 0.05]}>
            {/* Dark Silicon Bar Housing */}
            <RoundedBox
              position={[0, 0, -0.06]}
              args={[st.width + 0.18, 0.34, 0.14]}
              radius={0.05}
              smoothness={3}
            >
              <DarkSiliconMaterial />
            </RoundedBox>

            {/* Glowing Frequency Bar */}
            <RoundedBox
              args={[st.width, 0.24, 0.16]}
              radius={0.05}
              smoothness={3}
            >
              {st.isMaster ? (
                <GoldenPulseMaterial
                  intensity={secPhase < 0.35 ? 1.15 : 0.75}
                />
              ) : (
                <CyanPiezoMaterial intensity={pulse} />
              )}
            </RoundedBox>

            <CrispHtmlLabel
              position={[0, 0, 0.18]}
              text={st.label}
              color="#ffffff"
              fontSize={22}
            />
          </group>
        );
      })}

      {/* 1.000 Hz Master Golden Shockwave Ring Fired Every 30 Frames (1 Second) */}
      <mesh
        position={[0, -0.72, 0.12]}
        scale={[ringScale, ringScale * 0.55, 1]}
      >
        <torusGeometry args={[0.95, 0.032, 14, 48]} />
        <GoldenPulseMaterial intensity={ringIntensity} />
      </mesh>

      <CrispHtmlLabel
        position={[0, -1.18, 0.2]}
        text="OUTPUT: 1 PULSE PER SECOND (1.000 Hz)"
        color="#ffb84d"
        fontSize={22}
      />
    </>
  );
};

export const Scene7HalvingCascade: React.FC = () => {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: BG_VOID_COLOR, overflow: "hidden" }}>
      <Audio src={staticFile("clip-7.mp4")} playbackRate={1} />
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ fov: 42, position: [0, 0.6, 11.6], near: 0.1, far: 100 }}
        style={{ width: "100%", height: "100%", backgroundColor: BG_VOID_COLOR }}
      >
        <Scene7HalvingCascade3DContent />
      </ThreeCanvas>

      <MinimalTopTitle
        title="HALVING CASCADE TO 1.000 Hz"
        subtitle="32,768 → 16,384 → 8,192 → ... → 1 Hz"
        fontSize={50}
        subColor="#ffb84d"
      />
      <HardcodedSubtitle
        script="...and each switch cuts the frequency exactly in half. Sixteen thousand, eight thousand, four thousand—all the way down until the fifteenth switch outputs one single, dead-accurate tick every second."
        durationInFrames={300}
      />
    </AbsoluteFill>
  );
};
