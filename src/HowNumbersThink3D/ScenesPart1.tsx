import { PerspectiveCamera, Text } from "@react-three/drei";
import { ThreeCanvas } from "@remotion/three";
import React, { useLayoutEffect, useMemo, useRef } from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  OffthreadVideo,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import * as THREE from "three";
import {
  C4DOctaneRig,
  create3DTextTexture,
  MinimalTopTitle,
  WhisperCaptionWord,
  WordSpacedSubtitle,
} from "./shared";

// ============================================================================
// SCENE 1 (Frames 0 to 240 / 8s): 50/50 Horizontal Split-Screen Hook
// Top Half (1080x960): Single glowing golden sphere ("0.8472") -> at frame 90,
// camera zooms back rapidly as it multiplies into an InstancedMesh cube of 4,000
// glowing golden and dark-steel nodes pulsing with light waves.
// Bottom Half (1080x960): OffthreadVideo clip-1.mp4 with native audio.
// ============================================================================
const Scene1SplitTop3DContent: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  const zoomBack = interpolate(frame, [88, 175], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });

  const orbitAngle = frame * 0.012;
  const radius = interpolate(zoomBack, [0, 1], [3.6, 16.5]);
  const camX = Math.sin(orbitAngle) * radius * (0.25 + 0.75 * zoomBack);
  const camY = interpolate(zoomBack, [0, 1], [0.25, 6.2]);
  const camZ = Math.cos(orbitAngle) * radius;

  useLayoutEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.position.set(camX, camY, camZ);
      cameraRef.current.lookAt(0, 0, 0);
      cameraRef.current.updateProjectionMatrix();
      cameraRef.current.updateMatrixWorld();
    }
  }, [camX, camY, camZ]);

  // 4,000 nodes arranged in a 20 x 20 x 10 3D cube lattice
  const nodeCoords = useMemo(() => {
    const coords: { x: number; y: number; z: number; dist: number; id: number }[] =
      [];
    let id = 0;
    for (let ix = 0; ix < 20; ix++) {
      for (let iy = 0; iy < 20; iy++) {
        for (let iz = 0; iz < 10; iz++) {
          const x = (ix - 9.5) * 0.52;
          const y = (iy - 9.5) * 0.52;
          const z = (iz - 4.5) * 0.72;
          const dist = Math.sqrt(x * x + y * y + z * z);
          coords.push({ x, y, z, dist, id: id++ });
        }
      }
    }
    return coords;
  }, []);

  const goldenInstRef = useRef<THREE.InstancedMesh>(null);
  const steelInstRef = useRef<THREE.InstancedMesh>(null);

  const sphereGeo = useMemo(() => new THREE.SphereGeometry(0.11, 12, 12), []);
  const goldenMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#ffb84d",
        emissive: "#ff9900",
        emissiveIntensity: 4,
        toneMapped: false,
      }),
    [],
  );
  const steelMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#162032",
        metalness: 0.85,
        roughness: 0.22,
      }),
    [],
  );

  const numberLabelTex = useMemo(
    () => create3DTextTexture("0.8472", "PARAMETER WEIGHT", "#FFFFFF", "#ffb84d"),
    [],
  );

  const expandProgress = interpolate(frame, [90, 148], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  useLayoutEffect(() => {
    const dummy = new THREE.Object3D();

    nodeCoords.forEach((n, i) => {
      if (expandProgress <= 0.005) {
        dummy.position.set(0, -100, 0);
        dummy.scale.set(0, 0, 0);
        dummy.updateMatrix();
        goldenInstRef.current?.setMatrixAt(i, dummy.matrix);
        steelInstRef.current?.setMatrixAt(i, dummy.matrix);
        return;
      }

      const wave = Math.sin(n.dist * 1.45 - frame * 0.18);
      const isGolden = wave > 0.28;
      const posScale = expandProgress;

      dummy.position.set(n.x * posScale, n.y * posScale, n.z * posScale);
      const nodeScale = expandProgress * (isGolden ? 1.08 : 0.86);

      if (isGolden) {
        dummy.scale.set(nodeScale, nodeScale, nodeScale);
        dummy.updateMatrix();
        goldenInstRef.current?.setMatrixAt(i, dummy.matrix);

        dummy.position.set(0, -100, 0);
        dummy.scale.set(0, 0, 0);
        dummy.updateMatrix();
        steelInstRef.current?.setMatrixAt(i, dummy.matrix);
      } else {
        dummy.scale.set(nodeScale, nodeScale, nodeScale);
        dummy.updateMatrix();
        steelInstRef.current?.setMatrixAt(i, dummy.matrix);

        dummy.position.set(0, -100, 0);
        dummy.scale.set(0, 0, 0);
        dummy.updateMatrix();
        goldenInstRef.current?.setMatrixAt(i, dummy.matrix);
      }
    });

    if (goldenInstRef.current)
      goldenInstRef.current.instanceMatrix.needsUpdate = true;
    if (steelInstRef.current)
      steelInstRef.current.instanceMatrix.needsUpdate = true;
  }, [frame, expandProgress, nodeCoords]);

  const singleSphereScale = interpolate(frame, [88, 118], [1, 0.25], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const labelOpacity = interpolate(frame, [75, 96], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const enterPop = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 130 },
  });

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
        onUpdate={(self) => self.lookAt(0, 0, 0)}
      />

      <pointLight position={[0, 0, 2]} intensity={6} distance={15} color="#ff9900" />

      {/* Center Hero Glowing Golden Sphere ("0.8472") */}
      <group scale={enterPop * singleSphereScale}>
        <mesh material={goldenMat}>
          <sphereGeometry args={[0.52, 36, 36]} />
        </mesh>
        {labelOpacity > 0.02 && (
          <mesh position={[0, 0.92, 0]}>
            <planeGeometry args={[2.5, 0.72]} />
            <meshStandardMaterial
              map={numberLabelTex}
              color="#FFFFFF"
              emissive="#ffb84d"
              emissiveIntensity={2.5}
              toneMapped={false}
              transparent
              opacity={labelOpacity}
              depthWrite={false}
            />
          </mesh>
        )}
      </group>

      {/* 4,000-Node InstancedMesh Cube (Golden + Dark Steel) */}
      <instancedMesh
        ref={goldenInstRef}
        args={[sphereGeo, goldenMat, 4000]}
        frustumCulled={false}
      />
      <instancedMesh
        ref={steelInstRef}
        args={[sphereGeo, steelMat, 4000]}
        frustumCulled={false}
      />
    </>
  );
};

export const Scene1SplitHook: React.FC<{
  captions: WhisperCaptionWord[];
}> = ({ captions }) => {
  const frame = useCurrentFrame();
  const showBillionsTitle = frame >= 92;

  return (
    <AbsoluteFill style={{ backgroundColor: "#050811", overflow: "hidden" }}>
      {/* TOP HALF (1080x960 container, top: 0) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1080,
          height: 960,
          overflow: "hidden",
          backgroundColor: "#050811",
        }}
      >
        <ThreeCanvas
          width={1080}
          height={960}
          camera={{ fov: 48, position: [0, 0.25, 3.6], near: 0.1, far: 120 }}
          style={{ width: "100%", height: "100%", backgroundColor: "#050811" }}
        >
          <Scene1SplitTop3DContent />
        </ThreeCanvas>

        <MinimalTopTitle
          title={showBillionsTitle ? "1,800,000,000,000" : "0.8472"}
          fontSize={showBillionsTitle ? 74 : 88}
          topOffset={64}
          triggerFrame={showBillionsTitle ? 92 : 0}
        />
      </div>

      {/* BOTTOM HALF (1080x960 container, top: 960) */}
      <div
        style={{
          position: "absolute",
          top: 960,
          left: 0,
          width: 1080,
          height: 960,
          borderTop: "2px solid rgba(255,184,77,0.3)",
          overflow: "hidden",
          backgroundColor: "#050811",
        }}
      >
        <OffthreadVideo
          src={staticFile("clip-1.mp4")}
          playbackRate={1}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      <WordSpacedSubtitle captions={captions} bottomOffset={135} />
    </AbsoluteFill>
  );
};

// ============================================================================
// SCENE 2 (Frames 240 to 540 / 10s): Full-Screen 3D Tokenization & Vectors
// Camera orbits 3 floating 3D glass/metallic blocks ("HOW", "SAND", "THINKS").
// Golden laser beams slice them, exploding each block into a vertical column
// of 64 glowing 3D floating numbers ([0.14, -0.92, 0.77...]).
// Giant top title: "TOKEN EMBEDDING".
// ============================================================================
const TOKEN_WORDS = ["HOW", "SAND", "THINKS"] as const;
const SAMPLE_FLOATS = [
  " 0.14",
  "-0.92",
  " 0.77",
  " 0.41",
  "-0.38",
  " 0.85",
  "-0.19",
  " 0.63",
  "-0.74",
  " 0.29",
  " 0.91",
  "-0.55",
  " 0.08",
  "-0.67",
  " 0.49",
  "-0.83",
];

const Scene2Tokenization3DContent: React.FC = () => {
  const frame = useCurrentFrame();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  const camX = interpolate(frame, [0, 300], [-1.6, 1.6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const camY = interpolate(frame, [0, 150, 300], [1.4, 0.4, -0.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const camZ = interpolate(frame, [0, 120, 300], [11.8, 11.2, 12.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  useLayoutEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.position.set(camX, camY, camZ);
      cameraRef.current.lookAt(0, -0.2, 0);
      cameraRef.current.updateProjectionMatrix();
      cameraRef.current.updateMatrixWorld();
    }
  }, [camX, camY, camZ]);

  const tokenTextures = useMemo(
    () =>
      TOKEN_WORDS.map((w, i) =>
        create3DTextTexture(w, `TOKEN #${1042 + i * 317}`, "#FFFFFF", "#00f0ff"),
      ),
    [],
  );

  const floatTextures = useMemo(
    () =>
      SAMPLE_FLOATS.map((v, i) =>
        create3DTextTexture(
          v,
          undefined,
          i % 3 === 0 ? "#ffb84d" : "#66f7ff",
        ),
      ),
    [],
  );

  // Laser slice happens from frame 52 to 95; explosion into 64 numbers from frame 82 to 290
  const sliceProgress = interpolate(frame, [45, 92], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const explodeProgress = interpolate(frame, [80, 165], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });

  const blockXPositions = [-1.68, 0, 1.68];

  return (
    <>
      <C4DOctaneRig fogDensity={0.035} sparklesColor="#00f0ff" />
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        fov={48}
        near={0.1}
        far={120}
        position={[camX, camY, camZ]}
        onUpdate={(self) => self.lookAt(0, -0.2, 0)}
      />

      <pointLight position={[0, 2, 4]} intensity={5} distance={16} color="#ff9900" />
      <pointLight position={[0, -2, 4]} intensity={4} distance={16} color="#00f0ff" />

      {/* Golden Slicing Laser Beam */}
      {sliceProgress > 0.02 && sliceProgress < 0.98 && (
        <mesh
          position={[
            interpolate(sliceProgress, [0, 1], [-4.5, 4.5]),
            0.35,
            0.65,
          ]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry args={[0.07, 0.07, 9.5, 16]} />
          <meshStandardMaterial
            color="#ffb84d"
            emissive="#ff9900"
            emissiveIntensity={4}
            toneMapped={false}
          />
        </mesh>
      )}

      {/* 3 Token Glass/Metallic Monolith Blocks + 64-Number Vertical Vector Columns */}
      {blockXPositions.map((bx, colIdx) => {
        const blockSplit = interpolate(explodeProgress, [0, 1], [0, 0.55]);
        const blockScale = interpolate(explodeProgress, [0, 1], [1, 0.78]);

        return (
          <group key={colIdx} position={[bx, 0, 0]}>
            {/* Upper & Lower Sliced Glass/Metallic Token Block Halves */}
            <group
              position={[0, 0.5 + blockSplit * 2.2, 0]}
              scale={blockScale}
            >
              <mesh>
                <boxGeometry args={[1.95, 0.95, 0.65]} />
                <meshStandardMaterial
                  color="#162032"
                  metalness={0.85}
                  roughness={0.22}
                />
              </mesh>
              {/* Glowing Cyan Edge Trim */}
              <mesh position={[0, 0, 0.34]}>
                <boxGeometry args={[1.85, 0.82, 0.02]} />
                <meshStandardMaterial
                  map={tokenTextures[colIdx]}
                  color="#FFFFFF"
                  emissive="#00f0ff"
                  emissiveIntensity={2.8}
                  toneMapped={false}
                  transparent
                />
              </mesh>
            </group>

            {/* Vertical Column of 64 Glowing 3D Vector Numbers (4 sub-columns x 16 rows = 64 values) */}
            {explodeProgress > 0.02 && (
              <group position={[0, -0.35, 0]}>
                {Array.from({ length: 64 }).map((_, nIdx) => {
                  const row = nIdx % 16; // 16 vertical tiers
                  const subCol = Math.floor(nIdx / 16); // 4 depth/x sub-lanes
                  const targetY = (7.5 - row) * 0.34;
                  const targetX = (subCol - 1.5) * 0.42;
                  const targetZ = (subCol % 2 === 0 ? 1 : -1) * 0.22;

                  const curX = targetX * explodeProgress;
                  const curY = targetY * explodeProgress;
                  const curZ = targetZ * explodeProgress;

                  const isGoldenHighlight = (nIdx + colIdx) % 3 === 0;
                  const pulse =
                    0.85 + 0.25 * Math.sin(frame * 0.14 + nIdx * 0.5 + colIdx);

                  return (
                    <group
                      key={nIdx}
                      position={[curX, curY, curZ]}
                      scale={explodeProgress * pulse}
                    >
                      {/* Glowing Vector Node Sphere */}
                      <mesh position={[-0.22, 0, 0]}>
                        <sphereGeometry args={[0.038, 8, 8]} />
                        {isGoldenHighlight ? (
                          <meshStandardMaterial
                            color="#ffb84d"
                            emissive="#ff9900"
                            emissiveIntensity={4}
                            toneMapped={false}
                          />
                        ) : (
                          <meshStandardMaterial
                            color="#66f7ff"
                            emissive="#00f0ff"
                            emissiveIntensity={3.5}
                            toneMapped={false}
                          />
                        )}
                      </mesh>

                      {/* Floating 3D Number Readout on Front Sub-Columns */}
                      {subCol >= 1 && subCol <= 2 && (
                        <mesh position={[0.08, 0, 0.05]}>
                          <planeGeometry args={[0.52, 0.16]} />
                          <meshStandardMaterial
                            map={
                              floatTextures[
                                (nIdx + colIdx * 5) % floatTextures.length
                              ]
                            }
                            color="#FFFFFF"
                            emissive={isGoldenHighlight ? "#ff9900" : "#00f0ff"}
                            emissiveIntensity={isGoldenHighlight ? 4 : 3.5}
                            toneMapped={false}
                            transparent
                            depthWrite={false}
                          />
                        </mesh>
                      )}
                    </group>
                  );
                })}

                {/* Central Golden Spine Connecting the 64 Vector Dimensions */}
                <mesh scale={[1, explodeProgress, 1]}>
                  <cylinderGeometry args={[0.025, 0.025, 5.4, 12]} />
                  <meshStandardMaterial
                    color="#ffb84d"
                    emissive="#ff9900"
                    emissiveIntensity={4}
                    toneMapped={false}
                  />
                </mesh>
              </group>
            )}
          </group>
        );
      })}
    </>
  );
};

export const Scene2Tokenization: React.FC<{
  captions: WhisperCaptionWord[];
}> = ({ captions }) => {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#050811", overflow: "hidden" }}>
      <Audio src={staticFile("clip-2.mp4")} playbackRate={1} />
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ fov: 48, position: [-3.2, 1.4, 10.5], near: 0.1, far: 120 }}
        style={{ width: "100%", height: "100%", backgroundColor: "#050811" }}
      >
        <Scene2Tokenization3DContent />
      </ThreeCanvas>

      <MinimalTopTitle
        title="TOKEN EMBEDDING"
        subtitle="[ 0.14, -0.92, 0.77, ... 64D ]"
        fontSize={68}
      />
      <WordSpacedSubtitle captions={captions} />
    </AbsoluteFill>
  );
};

// ============================================================================
// SCENE 3 (Frames 540 to 840 / 10s): Full-Screen 3D Galaxy of Meaning
// PerspectiveCamera flies smoothly through a massive 3D starfield of 2,000
// InstancedMesh glowing spheres. Camera zooms into a bright golden cluster where
// 3D <Text> labels float next to pulsing spheres: "KING", "QUEEN", "MONARCH",
// "CROWN" connected by thin golden filaments.
// ============================================================================
const ROYAL_CLUSTER_NODES = [
  { label: "KING", pos: [-1.15, 0.65, 0.2] as [number, number, number] },
  { label: "QUEEN", pos: [1.18, 0.55, -0.15] as [number, number, number] },
  { label: "MONARCH", pos: [-0.75, -0.82, -0.25] as [number, number, number] },
  { label: "CROWN", pos: [0.95, -0.75, 0.25] as [number, number, number] },
];

const Scene3Galaxy3DContent: React.FC = () => {
  const frame = useCurrentFrame();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  const flyProgress = interpolate(frame, [0, 210], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });

  const camX =
    interpolate(flyProgress, [0, 1], [-6.5, 0]) +
    Math.sin(frame * 0.015) * 0.65;
  const camY = interpolate(flyProgress, [0, 1], [5.8, 0.15]);
  const camZ = interpolate(flyProgress, [0, 1], [26.0, 5.6]);

  useLayoutEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.position.set(camX, camY, camZ);
      cameraRef.current.lookAt(0, 0, 0);
      cameraRef.current.updateProjectionMatrix();
      cameraRef.current.updateMatrixWorld();
    }
  }, [camX, camY, camZ]);

  // 2,000 InstancedMesh glowing spheres across 3D semantic space
  const starNodes = useMemo(() => {
    const arr: { x: number; y: number; z: number; scale: number; isGold: boolean }[] =
      [];
    for (let i = 0; i < 2000; i++) {
      const s1 = Math.sin(i * 12.9898) * 43758.5453;
      const s2 = Math.sin(i * 78.233) * 43758.5453;
      const s3 = Math.sin(i * 45.164) * 43758.5453;
      const r1 = s1 - Math.floor(s1);
      const r2 = s2 - Math.floor(s2);
      const r3 = s3 - Math.floor(s3);

      const radius = 2.4 + Math.pow(r1, 0.75) * 22;
      const theta = r2 * Math.PI * 2;
      const phi = Math.acos(2 * r3 - 1);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta) * 0.85;
      const z = radius * Math.cos(phi);

      arr.push({
        x,
        y,
        z,
        scale: 0.4 + (i % 5) * 0.2,
        isGold: i % 3 === 0,
      });
    }
    return arr;
  }, []);

  const goldStarRef = useRef<THREE.InstancedMesh>(null);
  const cyanStarRef = useRef<THREE.InstancedMesh>(null);

  const starGeo = useMemo(() => new THREE.SphereGeometry(0.075, 10, 10), []);
  const goldMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#ffb84d",
        emissive: "#ff9900",
        emissiveIntensity: 4,
        toneMapped: false,
      }),
    [],
  );
  const cyanMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#66f7ff",
        emissive: "#00f0ff",
        emissiveIntensity: 3.5,
        toneMapped: false,
      }),
    [],
  );

  useLayoutEffect(() => {
    const dummy = new THREE.Object3D();
    starNodes.forEach((s, i) => {
      dummy.position.set(s.x, s.y, s.z);
      dummy.scale.set(s.scale, s.scale, s.scale);
      dummy.updateMatrix();
      if (s.isGold) {
        goldStarRef.current?.setMatrixAt(i, dummy.matrix);
        dummy.scale.set(0, 0, 0);
        dummy.updateMatrix();
        cyanStarRef.current?.setMatrixAt(i, dummy.matrix);
      } else {
        cyanStarRef.current?.setMatrixAt(i, dummy.matrix);
        dummy.scale.set(0, 0, 0);
        dummy.updateMatrix();
        goldStarRef.current?.setMatrixAt(i, dummy.matrix);
      }
    });
    if (goldStarRef.current)
      goldStarRef.current.instanceMatrix.needsUpdate = true;
    if (cyanStarRef.current)
      cyanStarRef.current.instanceMatrix.needsUpdate = true;
  }, [starNodes]);

  const royalLabelTextures = useMemo(
    () =>
      ROYAL_CLUSTER_NODES.map((n) =>
        create3DTextTexture(n.label, undefined, "#FFFFFF", "#ffb84d"),
      ),
    [],
  );

  // Thin golden filament tubes connecting all 6 pairs of the 4 royal cluster nodes
  const filamentGeometries = useMemo(() => {
    const geos: THREE.TubeGeometry[] = [];
    for (let i = 0; i < ROYAL_CLUSTER_NODES.length; i++) {
      for (let j = i + 1; j < ROYAL_CLUSTER_NODES.length; j++) {
        const p1 = new THREE.Vector3(...ROYAL_CLUSTER_NODES[i].pos);
        const p2 = new THREE.Vector3(...ROYAL_CLUSTER_NODES[j].pos);
        const curve = new THREE.LineCurve3(p1, p2);
        geos.push(new THREE.TubeGeometry(curve, 12, 0.022, 8, false));
      }
    }
    return geos;
  }, []);

  return (
    <>
      <C4DOctaneRig fogDensity={0.035} sparklesColor="#ffb84d" />
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        fov={50}
        near={0.1}
        far={120}
        position={[camX, camY, camZ]}
        onUpdate={(self) => self.lookAt(0, 0, 0)}
      />

      <pointLight position={[0, 0, 1]} intensity={8} distance={14} color="#ff9900" />

      {/* 2,000 InstancedMesh Glowing Starfield Spheres */}
      <instancedMesh
        ref={goldStarRef}
        args={[starGeo, goldMat, 2000]}
        frustumCulled={false}
      />
      <instancedMesh
        ref={cyanStarRef}
        args={[starGeo, cyanMat, 2000]}
        frustumCulled={false}
      />

      {/* Golden Royal Semantic Cluster: KING, QUEEN, MONARCH, CROWN */}
      <group>
        {filamentGeometries.map((geo, idx) => (
          <mesh key={idx} geometry={geo}>
            <meshStandardMaterial
              color="#ffb84d"
              emissive="#ff9900"
              emissiveIntensity={4}
              toneMapped={false}
            />
          </mesh>
        ))}

        {ROYAL_CLUSTER_NODES.map((node, idx) => {
          const pulse = 1 + 0.14 * Math.sin(frame * 0.12 + idx * 1.4);
          return (
            <group key={node.label} position={node.pos}>
              <mesh scale={pulse}>
                <sphereGeometry args={[0.22, 28, 28]} />
                <meshStandardMaterial
                  color="#ffb84d"
                  emissive="#ff9900"
                  emissiveIntensity={4}
                  toneMapped={false}
                />
              </mesh>

              {/* Synchronous 3D Floating Label + Drei <Text> */}
              <mesh position={[0, 0.44, 0.1]}>
                <planeGeometry args={[1.38, 0.34]} />
                <meshStandardMaterial
                  map={royalLabelTextures[idx]}
                  color="#FFFFFF"
                  emissive="#ffb84d"
                  emissiveIntensity={3.2}
                  toneMapped={false}
                  transparent
                  depthWrite={false}
                />
              </mesh>
              <Text
                font={staticFile("theboldfont.ttf")}
                fontSize={0.22}
                position={[0, 0.44, 0.12]}
                anchorX="center"
                anchorY="middle"
              >
                {node.label}
                <meshStandardMaterial
                  color="#ffb84d"
                  emissive="#ff9900"
                  emissiveIntensity={4}
                  toneMapped={false}
                />
              </Text>
            </group>
          );
        })}
      </group>
    </>
  );
};

export const Scene3GalaxyOfMeaning: React.FC<{
  captions: WhisperCaptionWord[];
}> = ({ captions }) => {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#050811", overflow: "hidden" }}>
      <Audio src={staticFile("clip-3.mp4")} playbackRate={1} />
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ fov: 50, position: [-6.5, 5.8, 26.0], near: 0.1, far: 120 }}
        style={{ width: "100%", height: "100%", backgroundColor: "#050811" }}
      >
        <Scene3Galaxy3DContent />
      </ThreeCanvas>

      <MinimalTopTitle
        title="SEMANTIC SPACE"
        subtitle="SIMILAR MEANING = CLOSER COORDINATES"
        fontSize={68}
      />
      <WordSpacedSubtitle captions={captions} />
    </AbsoluteFill>
  );
};
