import { PerspectiveCamera } from "@react-three/drei";
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
import { buildPartialTubeGeometry } from "../FeynmanLightPath/Scene2BeachStraightPath3D";
import {
  C4DOctaneRig,
  create3DTextTexture,
  MinimalTopTitle,
  WhisperCaptionWord,
  WordSpacedSubtitle,
} from "./shared";

// ============================================================================
// SCENE 8 (Frames 1980 to 2220 / 8s): Full-Screen Host Pivot 2
// ============================================================================
export const Scene8HostPivot2: React.FC<{
  captions: WhisperCaptionWord[];
}> = ({ captions }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000000", overflow: "hidden" }}>
      <OffthreadVideo
        src={staticFile("clip-8.mp4")}
        playbackRate={1}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <WordSpacedSubtitle captions={captions} />
    </AbsoluteFill>
  );
};

// ============================================================================
// SCENE 9 (Frames 2220 to 2520 / 10s): Full-Screen 3D 96-Layer Transformer Skyscraper
// Monumental 96-story 3D glass-and-steel skyscraper monolith in the center of the void.
// Camera tracks upward along the tower as a blinding golden shockwave of light
// cascades rapidly from Layer 01 at the bottom up to Layer 96 at the top.
// Giant top counter ticks up live from "0" to "1,800,000,000,000 PARAMETERS".
// ============================================================================
const TOTAL_LAYERS = 96;
const LAYER_STEP_Y = 0.24;

const Scene9Skyscraper3DContent: React.FC = () => {
  const frame = useCurrentFrame();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  // Shockwave travels from Layer 01 (index 0) to Layer 96 (index 95)
  const currentLayerFloat = interpolate(frame, [10, 275], [0, TOTAL_LAYERS - 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  const waveY = currentLayerFloat * LAYER_STEP_Y;
  const orbitAngle = frame * 0.015;
  const camRadius = interpolate(frame, [0, 150, 300], [10.8, 9.8, 11.2]);
  const camX = Math.sin(orbitAngle) * camRadius;
  const camZ = Math.cos(orbitAngle) * camRadius;
  const camY = waveY + 1.1;

  useLayoutEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.position.set(camX, camY, camZ);
      cameraRef.current.lookAt(0, waveY + 0.35, 0);
      cameraRef.current.updateProjectionMatrix();
      cameraRef.current.updateMatrixWorld();
    }
  }, [camX, camY, camZ, waveY]);

  const darkFloorRef = useRef<THREE.InstancedMesh>(null);
  const glowFloorRef = useRef<THREE.InstancedMesh>(null);

  const slabGeo = useMemo(() => new THREE.BoxGeometry(2.85, 0.14, 2.85), []);
  const glowSlabGeo = useMemo(
    () => new THREE.BoxGeometry(2.96, 0.16, 2.96),
    [],
  );

  const darkMetalMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#162032",
        metalness: 0.85,
        roughness: 0.22,
      }),
    [],
  );

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

  // Populate static 96-story dark metallic floor slabs
  useLayoutEffect(() => {
    const dummy = new THREE.Object3D();
    for (let i = 0; i < TOTAL_LAYERS; i++) {
      dummy.position.set(0, i * LAYER_STEP_Y, 0);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      darkFloorRef.current?.setMatrixAt(i, dummy.matrix);
    }
    if (darkFloorRef.current)
      darkFloorRef.current.instanceMatrix.needsUpdate = true;
  }, []);

  // Update cascading golden shockwave across the 96 floors
  useLayoutEffect(() => {
    const dummy = new THREE.Object3D();
    for (let i = 0; i < TOTAL_LAYERS; i++) {
      const distFromWave = currentLayerFloat - i;
      // Blinding shockwave crest + trailing lit floors
      const isWaveCrest = distFromWave >= -1.8 && distFromWave <= 5.5;
      const isAlreadyLit = distFromWave > 5.5 && i % 2 === 0;

      if (isWaveCrest) {
        const crestScale =
          1.0 +
          0.12 *
            Math.exp(-Math.pow(distFromWave - 0.8, 2) / 3.5);
        dummy.position.set(0, i * LAYER_STEP_Y, 0);
        dummy.scale.set(crestScale, 1.05, crestScale);
      } else if (isAlreadyLit) {
        dummy.position.set(0, i * LAYER_STEP_Y, 0);
        dummy.scale.set(1.01, 0.65, 1.01);
      } else {
        dummy.position.set(0, -100, 0);
        dummy.scale.set(0, 0, 0);
      }
      dummy.updateMatrix();
      glowFloorRef.current?.setMatrixAt(i, dummy.matrix);
    }
    if (glowFloorRef.current)
      glowFloorRef.current.instanceMatrix.needsUpdate = true;
  }, [currentLayerFloat]);

  const activeLayerNumber = Math.min(
    96,
    Math.max(1, Math.round(currentLayerFloat + 1)),
  );
  const layerBadgeTex = useMemo(
    () =>
      create3DTextTexture(
        `LAYER ${activeLayerNumber < 10 ? "0" + activeLayerNumber : activeLayerNumber} / 96`,
        "TRANSFORMER BLOCK",
        "#FFFFFF",
        "#ffb84d",
      ),
    [activeLayerNumber],
  );

  const totalHeight = TOTAL_LAYERS * LAYER_STEP_Y;

  return (
    <>
      <C4DOctaneRig fogDensity={0.035} sparklesColor="#ffb84d" />
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        fov={48}
        near={0.1}
        far={120}
        position={[camX, camY, camZ]}
        onUpdate={(self) => self.lookAt(0, waveY + 0.35, 0)}
      />

      {/* Travelling Golden Shockwave PointLight */}
      <pointLight
        position={[0, waveY, 2.8]}
        intensity={10}
        distance={14}
        color="#ff9900"
      />

      {/* 4 Corner Structural Steel Columns & Cyan Data Conduits */}
      {[
        [-1.42, -1.42],
        [1.42, -1.42],
        [-1.42, 1.42],
        [1.42, 1.42],
      ].map(([cx, cz], idx) => (
        <group key={idx} position={[cx, totalHeight / 2, cz]}>
          <mesh material={darkMetalMat}>
            <boxGeometry args={[0.22, totalHeight + 1, 0.22]} />
          </mesh>
          <mesh position={[cx > 0 ? 0.12 : -0.12, 0, cz > 0 ? 0.12 : -0.12]}>
            <boxGeometry args={[0.04, totalHeight + 1, 0.04]} />
            <meshStandardMaterial
              color="#66f7ff"
              emissive="#00f0ff"
              emissiveIntensity={3.5}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}

      {/* 96-Story Instanced Skyscraper Floors */}
      <instancedMesh
        ref={darkFloorRef}
        args={[slabGeo, darkMetalMat, TOTAL_LAYERS]}
        frustumCulled={false}
      />
      <instancedMesh
        ref={glowFloorRef}
        args={[glowSlabGeo, goldenEmissiveMat, TOTAL_LAYERS]}
        frustumCulled={false}
      />

      {/* Floating 3D Layer Readout Tracking the Shockwave Crest */}
      <mesh
        position={[0, waveY + 0.3, 1.95]}
        rotation={[0, orbitAngle, 0]}
      >
        <planeGeometry args={[2.5, 0.68]} />
        <meshStandardMaterial
          map={layerBadgeTex}
          color="#FFFFFF"
          emissive="#ff9900"
          emissiveIntensity={4}
          toneMapped={false}
          transparent
          depthWrite={false}
        />
      </mesh>
    </>
  );
};

export const Scene9TransformerSkyscraper: React.FC<{
  captions: WhisperCaptionWord[];
}> = ({ captions }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Live parameter counter ticking from 0 to 1,800,000,000,000
  const countProgress = interpolate(frame, [8, 250], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const paramCount = Math.round(countProgress * 1_800_000_000_000);
  const formattedParams = paramCount.toLocaleString("en-US");

  return (
    <AbsoluteFill style={{ backgroundColor: "#050811", overflow: "hidden" }}>
      <Audio src={staticFile("clip-9.mp4")} playbackRate={1} />
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ fov: 48, position: [0, 1.1, 8.2], near: 0.1, far: 120 }}
        style={{ width: "100%", height: "100%", backgroundColor: "#050811" }}
      >
        <Scene9Skyscraper3DContent />
      </ThreeCanvas>

      <MinimalTopTitle
        title={formattedParams}
        subtitle="PARAMETERS  ·  96 TRANSFORMER LAYERS"
        fontSize={62}
      />
      <WordSpacedSubtitle captions={captions} />
    </AbsoluteFill>
  );
};

// ============================================================================
// SCENE 10 (Frames 2520 to 2820 / 10s): Full-Screen 3D Next-Token Probability Wave
// Camera arrives at the crown of the 96-layer tower, where 50 vertical 3D
// probability bars rise and fall like a golden equalizer. The center bar
// ("THINK" - 94.2%) shoots skyward in blazing golden emissive light, firing a
// golden beam back down to the base of the tower (autoregressive loop).
// ============================================================================
const Scene10ProbabilityWave3DContent: React.FC = () => {
  const frame = useCurrentFrame();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  const orbitAngle = interpolate(frame, [0, 300], [-0.42, 0.48]);
  const camX = Math.sin(orbitAngle) * 9.8;
  const camY = interpolate(frame, [0, 180, 300], [3.6, 2.8, 4.4]);
  const camZ = Math.cos(orbitAngle) * 9.8;

  useLayoutEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.position.set(camX, camY, camZ);
      cameraRef.current.lookAt(0, 1.2, 0);
      cameraRef.current.updateProjectionMatrix();
      cameraRef.current.updateMatrixWorld();
    }
  }, [camX, camY, camZ]);

  // Center winner bar ("THINK" - 94.2%) shoots skyward starting around frame 65
  const winnerShoot = interpolate(frame, [55, 130], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });

  // Autoregressive golden feedback loop beam shooting from crown back down to tower base
  const loopBeamProgress = interpolate(frame, [145, 245], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const feedbackCurvePoints = useMemo(
    () => [
      new THREE.Vector3(0, 2.2, 0),
      new THREE.Vector3(2.8, 1.9, 1.8),
      new THREE.Vector3(3.6, -0.8, 2.2),
      new THREE.Vector3(1.8, -5.0, 1.2),
      new THREE.Vector3(0, -8.5, 0),
    ],
    [],
  );

  const feedbackTubeGeo = useMemo(
    () =>
      buildPartialTubeGeometry(feedbackCurvePoints, loopBeamProgress, 0.095),
    [feedbackCurvePoints, loopBeamProgress],
  );

  const thinkLabelTex = useMemo(
    () =>
      create3DTextTexture("THINK — 94.2%", "NEXT TOKEN SELECTED", "#FFFFFF", "#ffb84d"),
    [],
  );

  const darkMetalMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#162032",
        metalness: 0.85,
        roughness: 0.22,
      }),
    [],
  );

  return (
    <>
      <C4DOctaneRig fogDensity={0.035} sparklesColor="#ffb84d" />
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        fov={48}
        near={0.1}
        far={120}
        position={[camX, camY, camZ]}
        onUpdate={(self) => self.lookAt(0, 1.2, 0)}
      />

      <pointLight position={[0, 3.5, 2]} intensity={8} distance={16} color="#ff9900" />

      {/* Crown Pedestal of the 96-Layer Skyscraper */}
      <group position={[0, -1.9, 0]}>
        {[0, 1, 2, 3, 4, 5].map((tier) => (
          <mesh
            key={tier}
            position={[0, -tier * 0.42, 0]}
            material={darkMetalMat}
          >
            <boxGeometry args={[5.8, 0.24, 3.4]} />
          </mesh>
        ))}
      </group>

      {/* 50 Vertical 3D Probability Bars (Equalizer Array) */}
      <group position={[0, -1.65, 0]}>
        {Array.from({ length: 50 }).map((_, idx) => {
          const isWinner = idx === 25; // Center bar
          const isRunnerUp = idx === 21 || idx === 29;
          const x = (idx - 24.5) * 0.16;
          const z = (idx % 2 === 0 ? 1 : -1) * 0.18;

          const equalizerWave =
            0.35 +
            0.35 *
              Math.abs(
                Math.sin(frame * 0.14 + idx * 0.45) *
                  Math.cos(frame * 0.08 - idx * 0.25),
              );

          const suppressOthers = interpolate(winnerShoot, [0, 1], [1, 0.35]);
          const barHeight = isWinner
            ? interpolate(winnerShoot, [0, 1], [1.1, 3.35])
            : isRunnerUp
              ? (0.9 + equalizerWave * 0.6) * suppressOthers
              : (0.25 + equalizerWave * 0.85) * suppressOthers;

          return (
            <group key={idx} position={[x, barHeight / 2, z]}>
              <mesh>
                <boxGeometry
                  args={[
                    isWinner ? 0.24 : 0.1,
                    barHeight,
                    isWinner ? 0.24 : 0.1,
                  ]}
                />
                {isWinner ? (
                  <meshStandardMaterial
                    color="#ffb84d"
                    emissive="#ff9900"
                    emissiveIntensity={4}
                    toneMapped={false}
                  />
                ) : isRunnerUp ? (
                  <meshStandardMaterial
                    color="#66f7ff"
                    emissive="#00f0ff"
                    emissiveIntensity={3.5}
                    toneMapped={false}
                  />
                ) : (
                  <meshStandardMaterial
                    color="#162032"
                    metalness={0.85}
                    roughness={0.22}
                  />
                )}
              </mesh>

              {/* Floating "THINK - 94.2%" Label Above Center Winner Bar */}
              {isWinner && (
                <mesh
                  position={[0, barHeight / 2 + 0.58, 0.2]}
                  rotation={[0, -orbitAngle, 0]}
                >
                  <planeGeometry args={[2.8, 0.75]} />
                  <meshStandardMaterial
                    map={thinkLabelTex}
                    color="#FFFFFF"
                    emissive="#ff9900"
                    emissiveIntensity={4}
                    toneMapped={false}
                    transparent
                    depthWrite={false}
                  />
                </mesh>
              )}
            </group>
          );
        })}
      </group>

      {/* Autoregressive Golden Feedback Beam Shooting Back Down to Base */}
      {feedbackTubeGeo && (
        <mesh geometry={feedbackTubeGeo}>
          <meshStandardMaterial
            color="#ffb84d"
            emissive="#ff9900"
            emissiveIntensity={4}
            toneMapped={false}
          />
        </mesh>
      )}
    </>
  );
};

export const Scene10ProbabilityWave: React.FC<{
  captions: WhisperCaptionWord[];
}> = ({ captions }) => {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#050811", overflow: "hidden" }}>
      <Audio src={staticFile("clip-10.mp4")} playbackRate={1} />
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ fov: 48, position: [-4.0, 3.6, 9.0], near: 0.1, far: 120 }}
        style={{ width: "100%", height: "100%", backgroundColor: "#050811" }}
      >
        <Scene10ProbabilityWave3DContent />
      </ThreeCanvas>

      <MinimalTopTitle
        title="NEXT-TOKEN PROBABILITY"
        subtitle='"THINK" = 94.2%  ·  AUTOREGRESSIVE LOOP'
        fontSize={60}
      />
      <WordSpacedSubtitle captions={captions} />
    </AbsoluteFill>
  );
};

// ============================================================================
// SCENE 11 (Frames 2820 to 3120 / 10s): Full-Screen Host Outro CTA
// ============================================================================
export const Scene11HostOutro: React.FC<{
  captions: WhisperCaptionWord[];
}> = ({ captions }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000000", overflow: "hidden" }}>
      <OffthreadVideo
        src={staticFile("clip-11.mp4")}
        playbackRate={1}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <WordSpacedSubtitle captions={captions} />
    </AbsoluteFill>
  );
};
