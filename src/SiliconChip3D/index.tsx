import { PerspectiveCamera, Text } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { ThreeCanvas } from "@remotion/three";
import React, { useLayoutEffect, useMemo, useRef } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { useEffectComposerSync } from "../FeynmanLightPath/PostprocessingBloom";

export const SILICON_CHIP_3D_DURATION_FRAMES = 450; // 15 seconds @ 30fps

const GRID_SIZE = 30; // 30x30 = 900 FinFET transistors
const HALF_GRID = GRID_SIZE / 2; // 15
const SPACING_X = 1.38;
const SPACING_Z = 1.48;

// Deterministic pseudo-random helper
function hash2D(col: number, row: number, seed = 0): number {
  const h = Math.sin(col * 127.1 + row * 311.7 + seed * 74.7) * 43758.5453123;
  return h - Math.floor(h);
}

// Compute whether transistor (col, row) is active (0..1) at a given frame
function getTransistorActivation(
  col: number,
  row: number,
  frame: number,
): number {
  const isCenter = col === 0 && row === 0;

  // STAGE 1: Frames 0 to 150 (Macro Die Zoom-In)
  if (frame < 150) {
    if (isCenter) {
      // At frame 110, pulse the center transistor [0,0,0] gate arch with blinding golden light
      if (frame < 98) return 0;
      return interpolate(
        frame,
        [98, 108, 115, 145, 150],
        [0, 1, 1, 0.95, 1],
        {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        },
      );
    }

    // Subtle high-altitude data wave ripples across outer rows during initial macro dive (frames 0..95)
    if (frame < 95) {
      const fadeOut = interpolate(frame, [65, 95], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      const wave = Math.sin(col * 0.55 + row * 0.35 - frame * 0.22);
      const rnd = hash2D(col, row, 1);
      return wave > 0.78 && rnd > 0.45 ? fadeOut : 0;
    }
    return 0;
  }

  // STAGE 2: Frames 150 to 300 (Single FinFET Gate On/Off Switch)
  if (frame < 300) {
    if (isCenter) {
      // Frames 150-225 ("ON = 1"), Frames 225-300 ("OFF = 0")
      if (frame < 222) return 1;
      return interpolate(frame, [222, 232], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
    }
    return 0;
  }

  // STAGE 3: Frames 300 to 450 (The Binary Sea Pull-Back)
  // Hundreds of transistors flickering randomly between glowing golden "1"s and dark "0"s
  const enterStage3 = interpolate(frame, [300, 316], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rate = 0.14 + hash2D(col, row, 2) * 0.22;
  const phase = hash2D(col, row, 3) * Math.PI * 2;
  const harmonic =
    Math.sin(frame * rate + phase) +
    0.45 * Math.cos(frame * (rate * 1.7) - phase * 1.3);
  const isBitOne = harmonic > 0.15 ? 1 : 0;
  return isBitOne * enterStage3;
}

// Create crisp high-DPI glyph texture for synchronous 3D floating "1" and "0" labels
function createBitGlyphTexture(bit: "1" | "0"): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.clearRect(0, 0, 256, 256);
    ctx.font =
      "900 185px 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(bit, 128, 134);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

// Studio PBR Environment setup using Three.js RoomEnvironment + PMREMGenerator
const StudioEnvironmentMap: React.FC = () => {
  const { gl, scene } = useThree();

  useLayoutEffect(() => {
    const pmremGenerator = new THREE.PMREMGenerator(gl);
    pmremGenerator.compileEquirectangularShader();
    const roomEnv = new RoomEnvironment();
    const envTarget = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envTarget.texture;

    return () => {
      scene.environment = null;
      envTarget.dispose();
      roomEnv.dispose();
      pmremGenerator.dispose();
    };
  }, [gl, scene]);

  return null;
};

// 3-Stage Continuous 3D Camera Choreography (Frames 0 to 450)
const SiliconCameraChoreography: React.FC = () => {
  const frame = useCurrentFrame();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  // Stage 2 orbit position at frame 150: [Math.sin(150 * 0.02) * 2, 1.5, 4.5]
  const stage2StartX = Math.sin(150 * 0.02) * 2;
  // Stage 2 orbit position at frame 300: [Math.sin(300 * 0.02) * 2, 1.5, 4.5]
  const stage2EndX = Math.sin(300 * 0.02) * 2;

  let camX = 0;
  let camY = 35;
  let camZ = 35;
  let lookX = 0;
  let lookY = 0.5;
  let lookZ = 0;

  if (frame < 150) {
    // Stage 1: The Macro Die Zoom-In (Frames 0 to 150)
    // Smoothly diving from [0, 35, 35] down to [0, 2.2, 5.5]
    const diveProgress = interpolate(frame, [0, 108], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.2, 0.9, 0.25, 1),
    });

    const baseCamY = interpolate(diveProgress, [0, 1], [35, 2.2]);
    const baseCamZ = interpolate(diveProgress, [0, 1], [35, 5.5]);

    // Smooth blend between frame 132..150 into Stage 2's eye-level orbit start
    const handoff = interpolate(frame, [132, 150], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    });

    camX = interpolate(handoff, [0, 1], [0, stage2StartX]);
    camY = interpolate(handoff, [0, 1], [baseCamY, 1.5]);
    camZ = interpolate(handoff, [0, 1], [baseCamZ, 4.5]);

    lookX = 0;
    lookY = interpolate(diveProgress, [0, 1], [0, 0.65]);
    lookZ = 0;
  } else if (frame < 300) {
    // Stage 2: The Single FinFET Gate On/Off Switch (Frames 150 to 300)
    // Camera orbits smoothly at eye-level [Math.sin(frame*0.02)*2, 1.5, 4.5]
    camX = Math.sin(frame * 0.02) * 2;
    camY = 1.5;
    camZ = 4.5;
    lookX = Math.sin(frame * 0.02) * 0.22;
    lookY = 0.68;
    lookZ = 0;
  } else {
    // Stage 3: The Binary Sea Pull-Back (Frames 300 to 450)
    // Camera pulls back and tilts up to [0, 18, 18]
    const pullProgress = interpolate(frame, [300, 415], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.22, 1, 0.36, 1),
    });
    const slowDriftX = interpolate(frame, [300, 450], [0, 1.2], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    camX =
      interpolate(pullProgress, [0, 1], [stage2EndX, 0]) +
      slowDriftX * pullProgress;
    camY = interpolate(pullProgress, [0, 1], [1.5, 18]);
    camZ = interpolate(pullProgress, [0, 1], [4.5, 18]);

    lookX = 0;
    lookY = interpolate(pullProgress, [0, 1], [0.68, 0.2]);
    lookZ = interpolate(pullProgress, [0, 1], [0, -1.5]);
  }

  useLayoutEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.position.set(camX, camY, camZ);
      cameraRef.current.lookAt(lookX, lookY, lookZ);
      cameraRef.current.updateProjectionMatrix();
      cameraRef.current.updateMatrixWorld();
    }
  }, [camX, camY, camZ, lookX, lookY, lookZ]);

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      fov={46}
      near={0.1}
      far={140}
      position={[camX, camY, camZ]}
      onUpdate={(self) => self.lookAt(lookX, lookY, lookZ)}
    />
  );
};

// Detailed Hero Row of 5 FinFET Transistors (row = 0, col = -2, -1, 0, 1, 2)
const HeroFiveFinFETRow: React.FC<{
  darkMetalMat: THREE.MeshStandardMaterial;
  substrateMetalMat: THREE.MeshStandardMaterial;
  bitOneMat: THREE.MeshStandardMaterial;
  bitZeroMat: THREE.MeshStandardMaterial;
}> = ({ darkMetalMat, substrateMetalMat, bitOneMat, bitZeroMat }) => {
  const frame = useCurrentFrame();

  const heroCols = useMemo(() => [-2, -1, 0, 1, 2], []);
  const nanoSheetHeights = useMemo(() => [0.26, 0.48, 0.7], []);

  // Golden electron particles surging through the 3 horizontal nano-channels of [0,0,0] in Stage 2 (frames 150-225)
  const particleStreamOpacity =
    frame >= 148 && frame <= 230
      ? interpolate(frame, [148, 156, 220, 228], [0, 1, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;

  // Stage 2 floating label state above center transistor
  const showStage2FloatingBit = frame >= 150 && frame < 300;
  const isStage2One = frame < 225;
  const bitFlipPop = spring({
    frame: frame >= 225 ? frame - 225 : Math.max(0, frame - 150),
    fps: 30,
    config: { damping: 14, stiffness: 180 },
  });

  // Face the orbiting Stage 2 camera cleanly
  const camAngleY =
    frame >= 150 && frame < 300 ? Math.atan2(Math.sin(frame * 0.02) * 2, 4.5) : 0;

  return (
    <group>
      {heroCols.map((col) => {
        const x = col * SPACING_X;
        const z = 0;
        const isCenter = col === 0;
        const activation = getTransistorActivation(col, 0, frame);

        // At frame 110, pulse the center transistor [0,0,0] gate arch with blinding golden emissiveIntensity={4.5}
        const gateEmissiveIntensity = isCenter
          ? frame < 150
            ? activation * 4.5
            : activation * 4.0
          : activation * 4.0;

        const isGateGlowing = gateEmissiveIntensity > 0.02;

        return (
          <group key={col} position={[x, 0, z]}>
            {/* Raised Silicon Oxide Fin Pedestal */}
            <mesh position={[0, 0.06, 0]} material={substrateMetalMat}>
              <boxGeometry args={[1.18, 0.12, 0.62]} />
            </mesh>

            {/* Source & Drain Vertical Terminal Blocks */}
            <mesh position={[-0.5, 0.44, 0]} material={darkMetalMat}>
              <boxGeometry args={[0.14, 0.74, 0.28]} />
            </mesh>
            <mesh position={[0.5, 0.44, 0]} material={darkMetalMat}>
              <boxGeometry args={[0.14, 0.74, 0.28]} />
            </mesh>

            {/* 3 Horizontal Dark-Metallic Nano-Sheet Cylinders */}
            {nanoSheetHeights.map((ny, sIdx) => {
              const channelGlow =
                isCenter && particleStreamOpacity > 0.01
                  ? particleStreamOpacity * 3.2
                  : isCenter && frame >= 98 && frame < 150
                    ? activation * 2.2
                    : 0;

              return (
                <group key={sIdx} position={[0, ny, 0]}>
                  <mesh rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.056, 0.056, 1.02, 24]} />
                    {channelGlow > 0.05 ? (
                      <meshStandardMaterial
                        color="#ffb84d"
                        emissive="#ff9900"
                        emissiveIntensity={channelGlow}
                        toneMapped={false}
                        metalness={0.3}
                        roughness={0.2}
                      />
                    ) : (
                      <meshStandardMaterial
                        color="#1a2436"
                        metalness={0.85}
                        roughness={0.25}
                      />
                    )}
                  </mesh>

                  {/* Golden Particle Stream surging through the 3 horizontal nano-channels (Frames 150-225) */}
                  {isCenter && particleStreamOpacity > 0.02 && (
                    <group>
                      {Array.from({ length: 10 }).map((_, pIdx) => {
                        const u =
                          ((frame * 0.065 + pIdx / 10 + sIdx * 0.17) % 1) - 0.5;
                        const px = u * 0.96;
                        const pulseScale =
                          (0.95 + 0.3 * Math.sin(frame * 0.3 + pIdx)) *
                          particleStreamOpacity;
                        return (
                          <mesh
                            key={pIdx}
                            position={[px, 0, 0.062]}
                            scale={pulseScale}
                          >
                            <sphereGeometry args={[0.04, 14, 14]} />
                            <meshStandardMaterial
                              color="#ffb84d"
                              emissive="#ff9900"
                              emissiveIntensity={4}
                              toneMapped={false}
                            />
                          </mesh>
                        );
                      })}
                    </group>
                  )}
                </group>
              );
            })}

            {/* Vertical Gate Arch Bridging the 3 Nano-Sheet Cylinders */}
            <group>
              {/* Left Gate Arch Pillar */}
              <mesh position={[0, 0.48, -0.2]}>
                <boxGeometry args={[0.24, 0.84, 0.12]} />
                {isGateGlowing ? (
                  <meshStandardMaterial
                    color="#ffb84d"
                    emissive="#ff9900"
                    emissiveIntensity={gateEmissiveIntensity}
                    toneMapped={false}
                  />
                ) : (
                  <meshStandardMaterial
                    color="#1a2436"
                    metalness={0.85}
                    roughness={0.25}
                  />
                )}
              </mesh>

              {/* Right Gate Arch Pillar */}
              <mesh position={[0, 0.48, 0.2]}>
                <boxGeometry args={[0.24, 0.84, 0.12]} />
                {isGateGlowing ? (
                  <meshStandardMaterial
                    color="#ffb84d"
                    emissive="#ff9900"
                    emissiveIntensity={gateEmissiveIntensity}
                    toneMapped={false}
                  />
                ) : (
                  <meshStandardMaterial
                    color="#1a2436"
                    metalness={0.85}
                    roughness={0.25}
                  />
                )}
              </mesh>

              {/* Top Gate Arch Bridge */}
              <mesh position={[0, 0.92, 0]}>
                <boxGeometry args={[0.28, 0.16, 0.52]} />
                {isGateGlowing ? (
                  <meshStandardMaterial
                    color="#ffb84d"
                    emissive="#ff9900"
                    emissiveIntensity={gateEmissiveIntensity}
                    toneMapped={false}
                  />
                ) : (
                  <meshStandardMaterial
                    color="#1a2436"
                    metalness={0.85}
                    roughness={0.25}
                  />
                )}
              </mesh>

              {/* Inner High-K Gate Dielectric Collar */}
              <mesh position={[0, 0.48, 0]}>
                <boxGeometry args={[0.2, 0.68, 0.28]} />
                {isGateGlowing ? (
                  <meshStandardMaterial
                    color="#ffb84d"
                    emissive="#ff9900"
                    emissiveIntensity={gateEmissiveIntensity}
                    toneMapped={false}
                  />
                ) : (
                  <meshStandardMaterial
                    color="#1a2436"
                    metalness={0.85}
                    roughness={0.25}
                  />
                )}
              </mesh>
            </group>

            {/* Top Contact Pillar */}
            <mesh position={[0, 1.15, 0]} material={darkMetalMat}>
              <cylinderGeometry args={[0.085, 0.095, 0.34, 24]} />
            </mesh>
            {/* Top Contact Pad */}
            <mesh position={[0, 1.33, 0]}>
              <cylinderGeometry args={[0.13, 0.11, 0.05, 24]} />
              {isGateGlowing ? (
                <meshStandardMaterial
                  color="#ffb84d"
                  emissive="#ff9900"
                  emissiveIntensity={gateEmissiveIntensity}
                  toneMapped={false}
                />
              ) : (
                <meshStandardMaterial
                  color="#1a2436"
                  metalness={0.85}
                  roughness={0.25}
                />
              )}
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

// 30x30 Grid (900 Instances) of 3D FinFET Transistors + Stage 3 Floating "1" / "0" Labels
const FinFETGrid900: React.FC<{
  darkMetalMat: THREE.MeshStandardMaterial;
  substrateMetalMat: THREE.MeshStandardMaterial;
  goldenEmissiveMat: THREE.MeshStandardMaterial;
  bitOneMat: THREE.MeshStandardMaterial;
  bitZeroMat: THREE.MeshStandardMaterial;
}> = ({
  darkMetalMat,
  substrateMetalMat,
  goldenEmissiveMat,
  bitOneMat,
  bitZeroMat,
}) => {
  const frame = useCurrentFrame();

  // All grid coordinates excluding the 5 hero transistors at row=0, col=-2..2
  const gridCells = useMemo(() => {
    const cells: { col: number; row: number; x: number; z: number }[] = [];
    for (let row = -HALF_GRID; row < HALF_GRID; row++) {
      for (let col = -HALF_GRID; col < HALF_GRID; col++) {
        if (row === 0 && col >= -2 && col <= 2) continue;
        cells.push({
          col,
          row,
          x: col * SPACING_X,
          z: row * SPACING_Z,
        });
      }
    }
    return cells;
  }, []);

  // Visible grid cells for Stage 3 floating binary labels
  const labelCells = useMemo(() => {
    const list: { col: number; row: number; x: number; z: number }[] = [];
    for (let row = -11; row <= 8; row++) {
      for (let col = -8; col <= 8; col++) {
        list.push({
          col,
          row,
          x: col * SPACING_X,
          z: row * SPACING_Z,
        });
      }
    }
    return list;
  }, []);

  const count = gridCells.length; // 895 background instances + 5 hero instances = 900 total

  const sheet1Ref = useRef<THREE.InstancedMesh>(null);
  const sheet2Ref = useRef<THREE.InstancedMesh>(null);
  const sheet3Ref = useRef<THREE.InstancedMesh>(null);
  const sourceRef = useRef<THREE.InstancedMesh>(null);
  const drainRef = useRef<THREE.InstancedMesh>(null);
  const pillarRef = useRef<THREE.InstancedMesh>(null);
  const gateDarkRef = useRef<THREE.InstancedMesh>(null);
  const gateGlowRef = useRef<THREE.InstancedMesh>(null);

  // Stage 3 Instanced floating 3D "1" and "0" labels hovering over each transistor pillar
  const bitOneLabelRef = useRef<THREE.InstancedMesh>(null);
  const bitZeroLabelRef = useRef<THREE.InstancedMesh>(null);

  const nanoSheetGeo = useMemo(() => {
    const geo = new THREE.CylinderGeometry(0.055, 0.055, 0.96, 14);
    geo.rotateZ(Math.PI / 2);
    return geo;
  }, []);
  const terminalGeo = useMemo(
    () => new THREE.BoxGeometry(0.14, 0.72, 0.26),
    [],
  );
  const pillarGeo = useMemo(
    () => new THREE.CylinderGeometry(0.085, 0.095, 0.38, 14),
    [],
  );
  const gateArchGeo = useMemo(
    () => new THREE.BoxGeometry(0.26, 0.88, 0.48),
    [],
  );
  const bitLabelGeo = useMemo(() => new THREE.PlaneGeometry(0.62, 0.62), []);

  // Update FinFET structure matrices & Stage 3 floating "1"/"0" labels per frame
  // During Stage 1 end & Stage 2 (frames 85..315), smoothly recess the immediate foreground cells
  // directly between the camera (z = 4.5) and the hero 5-transistor row (z = 0) so the hero row is 100% unobstructed.
  useLayoutEffect(() => {
    const dummy = new THREE.Object3D();

    const foregroundClearance =
      frame < 300
        ? interpolate(frame, [75, 102], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        : interpolate(frame, [300, 325], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

    gridCells.forEach((cell, i) => {
      const isInCameraCorridor =
        cell.row >= 1 && cell.row <= 3 && cell.col >= -2 && cell.col <= 2;
      const cellScale = isInCameraCorridor ? foregroundClearance : 1;

      if (cellScale <= 0.01) {
        dummy.position.set(0, -50, 0);
        dummy.scale.set(0, 0, 0);
        dummy.updateMatrix();
        sheet1Ref.current?.setMatrixAt(i, dummy.matrix);
        sheet2Ref.current?.setMatrixAt(i, dummy.matrix);
        sheet3Ref.current?.setMatrixAt(i, dummy.matrix);
        sourceRef.current?.setMatrixAt(i, dummy.matrix);
        drainRef.current?.setMatrixAt(i, dummy.matrix);
        pillarRef.current?.setMatrixAt(i, dummy.matrix);
        gateDarkRef.current?.setMatrixAt(i, dummy.matrix);
        gateGlowRef.current?.setMatrixAt(i, dummy.matrix);
        return;
      }

      dummy.scale.set(1, cellScale, 1);
      dummy.rotation.set(0, 0, 0);

      dummy.position.set(cell.x, 0.26 * cellScale, cell.z);
      dummy.updateMatrix();
      sheet1Ref.current?.setMatrixAt(i, dummy.matrix);

      dummy.position.set(cell.x, 0.48 * cellScale, cell.z);
      dummy.updateMatrix();
      sheet2Ref.current?.setMatrixAt(i, dummy.matrix);

      dummy.position.set(cell.x, 0.7 * cellScale, cell.z);
      dummy.updateMatrix();
      sheet3Ref.current?.setMatrixAt(i, dummy.matrix);

      dummy.position.set(cell.x - 0.46, 0.44 * cellScale, cell.z);
      dummy.updateMatrix();
      sourceRef.current?.setMatrixAt(i, dummy.matrix);

      dummy.position.set(cell.x + 0.46, 0.44 * cellScale, cell.z);
      dummy.updateMatrix();
      drainRef.current?.setMatrixAt(i, dummy.matrix);

      dummy.position.set(cell.x, 1.15 * cellScale, cell.z);
      dummy.updateMatrix();
      pillarRef.current?.setMatrixAt(i, dummy.matrix);

      dummy.position.set(cell.x, 0.52 * cellScale, cell.z);
      dummy.updateMatrix();
      gateDarkRef.current?.setMatrixAt(i, dummy.matrix);

      const act = getTransistorActivation(cell.col, cell.row, frame);
      if (act > 0.02) {
        dummy.position.set(cell.x, 0.52 * cellScale, cell.z);
        dummy.scale.set(1.03 * act, 1.03 * act * cellScale, 1.03 * act);
      } else {
        dummy.position.set(0, -50, 0);
        dummy.scale.set(0, 0, 0);
      }
      dummy.updateMatrix();
      gateGlowRef.current?.setMatrixAt(i, dummy.matrix);
    });

    if (sheet1Ref.current) sheet1Ref.current.instanceMatrix.needsUpdate = true;
    if (sheet2Ref.current) sheet2Ref.current.instanceMatrix.needsUpdate = true;
    if (sheet3Ref.current) sheet3Ref.current.instanceMatrix.needsUpdate = true;
    if (sourceRef.current) sourceRef.current.instanceMatrix.needsUpdate = true;
    if (drainRef.current) drainRef.current.instanceMatrix.needsUpdate = true;
    if (pillarRef.current) pillarRef.current.instanceMatrix.needsUpdate = true;
    if (gateDarkRef.current)
      gateDarkRef.current.instanceMatrix.needsUpdate = true;
    if (gateGlowRef.current)
      gateGlowRef.current.instanceMatrix.needsUpdate = true;

    // Stage 3 Floating "1" and "0" labels hovering over each transistor pillar
    const stage3Scale =
      frame >= 300
        ? interpolate(frame, [302, 322], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        : 0;

    labelCells.forEach((cell, i) => {
      if (stage3Scale <= 0.01) {
        dummy.position.set(0, -50, 0);
        dummy.scale.set(0, 0, 0);
        dummy.updateMatrix();
        bitOneLabelRef.current?.setMatrixAt(i, dummy.matrix);
        bitZeroLabelRef.current?.setMatrixAt(i, dummy.matrix);
        return;
      }

      const act = getTransistorActivation(cell.col, cell.row, frame);
      const isOne = act > 0.45;
      const hoverY =
        1.78 + 0.08 * Math.sin(frame * 0.1 + cell.col * 0.7 + cell.row * 0.5);

      // Face camera at [0, 18, 18] -> tilt -0.68 rad around X
      dummy.rotation.set(-0.68, 0, 0);

      if (isOne) {
        dummy.position.set(cell.x, hoverY, cell.z);
        dummy.scale.set(stage3Scale, stage3Scale, stage3Scale);
        dummy.updateMatrix();
        bitOneLabelRef.current?.setMatrixAt(i, dummy.matrix);

        dummy.position.set(0, -50, 0);
        dummy.scale.set(0, 0, 0);
        dummy.updateMatrix();
        bitZeroLabelRef.current?.setMatrixAt(i, dummy.matrix);
      } else {
        dummy.position.set(cell.x, hoverY, cell.z);
        dummy.scale.set(
          stage3Scale * 0.88,
          stage3Scale * 0.88,
          stage3Scale * 0.88,
        );
        dummy.updateMatrix();
        bitZeroLabelRef.current?.setMatrixAt(i, dummy.matrix);

        dummy.position.set(0, -50, 0);
        dummy.scale.set(0, 0, 0);
        dummy.updateMatrix();
        bitOneLabelRef.current?.setMatrixAt(i, dummy.matrix);
      }
    });

    if (bitOneLabelRef.current) {
      bitOneLabelRef.current.instanceMatrix.needsUpdate = true;
    }
    if (bitZeroLabelRef.current) {
      bitZeroLabelRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [frame, gridCells, labelCells]);

  return (
    <group>
      {/* Dark Silicon Wafer Base Floor */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.02, 0]}
        material={substrateMetalMat}
      >
        <planeGeometry args={[64, 64]} />
      </mesh>

      {/* Silicon Wafer Interconnect Traces along X */}
      {Array.from({ length: GRID_SIZE }).map((_, idx) => {
        const row = idx - HALF_GRID;
        const z = row * SPACING_Z;
        return (
          <mesh
            key={`trace-x-${idx}`}
            position={[0, 0.01, z]}
            material={darkMetalMat}
          >
            <boxGeometry args={[GRID_SIZE * SPACING_X, 0.03, 0.12]} />
          </mesh>
        );
      })}

      {/* 895 Background FinFET Instances (completing the 30x30 = 900 array) */}
      <instancedMesh
        ref={sheet1Ref}
        args={[nanoSheetGeo, darkMetalMat, count]}
        frustumCulled={false}
      />
      <instancedMesh
        ref={sheet2Ref}
        args={[nanoSheetGeo, darkMetalMat, count]}
        frustumCulled={false}
      />
      <instancedMesh
        ref={sheet3Ref}
        args={[nanoSheetGeo, darkMetalMat, count]}
        frustumCulled={false}
      />
      <instancedMesh
        ref={sourceRef}
        args={[terminalGeo, darkMetalMat, count]}
        frustumCulled={false}
      />
      <instancedMesh
        ref={drainRef}
        args={[terminalGeo, darkMetalMat, count]}
        frustumCulled={false}
      />
      <instancedMesh
        ref={pillarRef}
        args={[pillarGeo, darkMetalMat, count]}
        frustumCulled={false}
      />
      <instancedMesh
        ref={gateDarkRef}
        args={[gateArchGeo, darkMetalMat, count]}
        frustumCulled={false}
      />
      <instancedMesh
        ref={gateGlowRef}
        args={[gateArchGeo, goldenEmissiveMat, count]}
        frustumCulled={false}
      />

      {/* Stage 3 Floating "1" and "0" 3D Labels Hovering Over Each Transistor Pillar */}
      <instancedMesh
        ref={bitOneLabelRef}
        args={[bitLabelGeo, bitOneMat, labelCells.length]}
        frustumCulled={false}
      />
      <instancedMesh
        ref={bitZeroLabelRef}
        args={[bitLabelGeo, bitZeroMat, labelCells.length]}
        frustumCulled={false}
      />
    </group>
  );
};

const SiliconChipSceneContent: React.FC = () => {
  const frame = useCurrentFrame();
  const composerRef = useEffectComposerSync();

  // Rule 4: Inactive silicon structures MUST use dark brushed metallic PBR
  const darkMetalMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#1a2436",
        metalness: 0.85,
        roughness: 0.25,
      }),
    [],
  );

  const substrateMetalMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#0c121e",
        metalness: 0.88,
        roughness: 0.32,
      }),
    [],
  );

  // Rule 4: Active transistor gate / "1" state MUST use golden emissiveIntensity={4} toneMapped={false}
  const goldenEmissiveMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#ffb84d",
        emissive: "#ff9900",
        emissiveIntensity: 4,
        toneMapped: false,
      }),
    [],
  );

  const bitOneTex = useMemo(() => createBitGlyphTexture("1"), []);
  const bitZeroTex = useMemo(() => createBitGlyphTexture("0"), []);

  const bitOneMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: bitOneTex,
        color: "#ffb84d",
        emissive: "#ff9900",
        emissiveIntensity: 4,
        toneMapped: false,
        transparent: true,
        alphaTest: 0.05,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    [bitOneTex],
  );

  const bitZeroMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: bitZeroTex,
        color: "#7393b8",
        emissive: "#243b59",
        emissiveIntensity: 0.85,
        metalness: 0.85,
        roughness: 0.25,
        transparent: true,
        alphaTest: 0.05,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    [bitZeroTex],
  );

  // Warm golden pointLight intensity near active gates
  const centerActivation = getTransistorActivation(0, 0, frame);
  const centerPointLightIntensity =
    frame < 150
      ? centerActivation * 9.0
      : frame < 300
        ? centerActivation * 7.5
        : 4.5;

  return (
    <>
      {/* Rule 1: Scene Atmosphere - Background '#060a12' & Exponential Depth Fog */}
      <color attach="background" args={["#060a12"]} />
      <fogExp2 attach="fog" args={["#060a12", 0.045]} />

      <StudioEnvironmentMap />
      <SiliconCameraChoreography />

      {/* Rule 2: Studio PBR Lighting */}
      <ambientLight intensity={0.45} color="#1a2c47" />
      <hemisphereLight
        args={["#4da6ff", "#060a12", 0.85]}
        position={[0, 25, 0]}
      />
      {/* Cool Blue Rim directionalLight */}
      <directionalLight
        intensity={2.5}
        color="#4da6ff"
        position={[-10, 15, -10]}
      />
      {/* Studio Key Light for metallic specularity */}
      <directionalLight
        intensity={1.6}
        color="#cce2ff"
        position={[12, 20, 10]}
      />

      {/* Warm Golden PointLights near active gates */}
      <pointLight
        position={[0, 1.65, 0.35]}
        intensity={centerPointLightIntensity}
        distance={9}
        color="#ff9900"
      />
      {frame >= 300 && (
        <>
          <pointLight
            position={[-4.5, 2.5, -3.5]}
            intensity={5.5}
            distance={14}
            color="#ff9900"
          />
          <pointLight
            position={[4.5, 2.5, -2.5]}
            intensity={5.5}
            distance={14}
            color="#ffb84d"
          />
          <pointLight
            position={[0, 2.8, 3.5]}
            intensity={5.0}
            distance={14}
            color="#ff9900"
          />
        </>
      )}

      {/* 30x30 Grid (900 Instances) of 3D FinFET Transistor Structures */}
      <FinFETGrid900
        darkMetalMat={darkMetalMat}
        substrateMetalMat={substrateMetalMat}
        goldenEmissiveMat={goldenEmissiveMat}
        bitOneMat={bitOneMat}
        bitZeroMat={bitZeroMat}
      />

      {/* Detailed Hero Row of 5 FinFET Transistors Centered at [0, 0, 0] */}
      <HeroFiveFinFETRow
        darkMetalMat={darkMetalMat}
        substrateMetalMat={substrateMetalMat}
        bitOneMat={bitOneMat}
        bitZeroMat={bitZeroMat}
      />

      {/* Rule 3: Mandatory Bloom Post-Processing */}
      <EffectComposer ref={composerRef} multisampling={0}>
        <Bloom
          intensity={2.2}
          luminanceThreshold={0.25}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
};

// Subtitle segments for the 15-second (450-frame) composition
interface SubtitleSegment {
  startFrame: number;
  endFrame: number;
  words: string[];
  highlightWords: string[];
}

const SUBTITLE_SEGMENTS: SubtitleSegment[] = [
  {
    startFrame: 0,
    endFrame: 95,
    words: [
      "Inside",
      "your",
      "chip",
      "sits",
      "a",
      "city",
      "of",
      "100",
      "billion",
      "switches.",
    ],
    highlightWords: ["100", "billion", "switches."],
  },
  {
    startFrame: 95,
    endFrame: 150,
    words: [
      "Each",
      "FinFET",
      "gate",
      "bridges",
      "three",
      "atomic",
      "silicon",
      "nano-channels.",
    ],
    highlightWords: ["FinFET", "gate", "nano-channels."],
  },
  {
    startFrame: 150,
    endFrame: 225,
    words: [
      "Apply",
      "voltage",
      "and",
      "current",
      "surges",
      "through—",
      "that",
      "state",
      "is",
      "1.",
    ],
    highlightWords: ["voltage", "surges", "1."],
  },
  {
    startFrame: 225,
    endFrame: 300,
    words: [
      "Drop",
      "the",
      "voltage",
      "and",
      "the",
      "gate",
      "locks",
      "shut—",
      "flipping",
      "to",
      "0.",
    ],
    highlightWords: ["locks", "shut—", "0."],
  },
  {
    startFrame: 300,
    endFrame: 450,
    words: [
      "Billions",
      "of",
      "1s",
      "and",
      "0s",
      "firing",
      "at",
      "once",
      "create",
      "every",
      "thought.",
    ],
    highlightWords: ["Billions", "1s", "0s"],
  },
];

export const SiliconChip3D: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  // Determine center-top giant clean white label
  let topTitle = "100,000,000,000";
  let topChangeFrame = 0;

  if (frame >= 150 && frame < 225) {
    topTitle = "1";
    topChangeFrame = 150;
  } else if (frame >= 225 && frame < 300) {
    topTitle = "0";
    topChangeFrame = 225;
  } else if (frame >= 300) {
    topTitle = "100,000,000,000";
    topChangeFrame = 300;
  }

  const titleSpring = spring({
    frame: Math.max(0, frame - topChangeFrame),
    fps,
    config: { damping: 16, stiffness: 150 },
  });

  const activeSegment =
    SUBTITLE_SEGMENTS.find(
      (s) => frame >= s.startFrame && frame < s.endFrame,
    ) ?? SUBTITLE_SEGMENTS[SUBTITLE_SEGMENTS.length - 1];

  const isSingleDigitHeader = topTitle === "1" || topTitle === "0";

  return (
    <AbsoluteFill style={{ backgroundColor: "#060a12", overflow: "hidden" }}>
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ fov: 46, position: [0, 35, 35], near: 0.1, far: 140 }}
        style={{ width: "100%", height: "100%", backgroundColor: "#060a12" }}
      >
        <SiliconChipSceneContent />
      </ThreeCanvas>

      {/* Rule 5: ZERO HUD boxes, ZERO borders, ZERO technical clutter.
          Clean, giant, center-top Helvetica/Inter Bold white text labels */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          paddingTop: 115,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <div
          style={{
            fontFamily:
              "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontWeight: 900,
            fontSize: isSingleDigitHeader ? 168 : 96,
            lineHeight: 1.0,
            color: "#FFFFFF",
            letterSpacing: isSingleDigitHeader ? 0 : -2.5,
            textAlign: "center",
            opacity: interpolate(titleSpring, [0, 1], [0.25, 1]),
            transform: `translateY(${interpolate(titleSpring, [0, 1], [-18, 0])}px) scale(${interpolate(titleSpring, [0, 1], [0.92, 1])})`,
            textShadow: "0 10px 36px rgba(0, 0, 0, 0.85)",
          }}
        >
          {topTitle}
        </div>
      </AbsoluteFill>

      {/* Clean Bottom Subtitles with marginRight: '0.32em' on every word */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: 170,
          paddingLeft: 72,
          paddingRight: 72,
        }}
      >
        <div
          style={{
            textAlign: "center",
            maxWidth: 920,
            lineHeight: 1.32,
          }}
        >
          {activeSegment.words.map((word, idx) => {
            const isHighlighted = activeSegment.highlightWords.includes(word);
            return (
              <span
                key={`${activeSegment.startFrame}-${idx}`}
                style={{
                  display: "inline-block",
                  marginRight: "0.32em",
                  fontFamily:
                    "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                  fontWeight: 800,
                  fontSize: 48,
                  color: isHighlighted ? "#F5D061" : "#FFFFFF",
                  textShadow: "0 6px 24px rgba(0, 0, 0, 0.92)",
                }}
              >
                {word}
              </span>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
