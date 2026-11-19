import { CubicBezierLine, PerspectiveCamera } from "@react-three/drei";
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
// SCENE 4 (Frames 840 to 1080 / 8s): Full-Screen Host Pivot 1
// Zero overlays except bottom subtitles.
// ============================================================================
export const Scene4HostPivot1: React.FC<{
  captions: WhisperCaptionWord[];
}> = ({ captions }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000000", overflow: "hidden" }}>
      <OffthreadVideo
        src={staticFile("clip-4.mp4")}
        playbackRate={1}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <WordSpacedSubtitle captions={captions} />
    </AbsoluteFill>
  );
};

// ============================================================================
// SCENE 5 (Frames 1080 to 1380 / 10s): Full-Screen 3D Vector Arithmetic & Context Ambiguity
// First 150 frames: 3D parallelogram vector path shooting from "KING" -> minus "MAN"
//   -> plus "WOMAN" -> landing on a blazing golden sphere "QUEEN".
// Next 150 frames: Camera pans to a cyan sphere labeled "APPLE" being pulled in
//   two opposite directions by glowing red tether lines toward a "FRUIT CLUSTER"
//   on the left and a "SILICON TECH CLUSTER" on the right.
// ============================================================================
const Scene5VectorArithmetic3DContent: React.FC = () => {
  const frame = useCurrentFrame();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  // Smooth camera pan from Vector Arithmetic cluster (x = 0) to Ambiguity cluster (x = 12) at frame 145..178
  const panToApple = interpolate(frame, [142, 178], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });

  const targetX = interpolate(panToApple, [0, 1], [0, 12]);
  const orbitX = Math.sin(frame * 0.018) * 1.4;
  const camX = targetX + orbitX;
  const camY = interpolate(panToApple, [0, 1], [1.2, 0.85]);
  const camZ = interpolate(panToApple, [0, 1], [8.8, 9.2]);

  useLayoutEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.position.set(camX, camY, camZ);
      cameraRef.current.lookAt(targetX, 0, 0);
      cameraRef.current.updateProjectionMatrix();
      cameraRef.current.updateMatrixWorld();
    }
  }, [camX, camY, camZ, targetX]);

  // First 150 frames: Parallelogram vertices
  const pKing = useMemo(() => new THREE.Vector3(-1.8, 1.25, 0), []);
  const pMan = useMemo(() => new THREE.Vector3(-2.1, -1.25, 0.3), []);
  const pWoman = useMemo(() => new THREE.Vector3(1.65, -1.25, -0.2), []);
  const pQueen = useMemo(() => new THREE.Vector3(1.95, 1.25, 0.1), []);

  const vectorPathPoints = useMemo(
    () => [pKing, pMan, pWoman, pQueen],
    [pKing, pMan, pWoman, pQueen],
  );

  const vectorDrawProgress = interpolate(frame, [10, 110], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const vectorTubeGeo = useMemo(
    () => buildPartialTubeGeometry(vectorPathPoints, vectorDrawProgress, 0.085),
    [vectorPathPoints, vectorDrawProgress],
  );

  // Dashed reference line from KING directly to QUEEN
  const directBridgeGeo = useMemo(
    () =>
      buildPartialTubeGeometry(
        [pKing, pQueen],
        interpolate(frame, [95, 130], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        0.04,
      ),
    [frame, pKing, pQueen],
  );

  const texKing = useMemo(
    () => create3DTextTexture("KING", "[+ROYAL, +MALE]", "#FFFFFF", "#00f0ff"),
    [],
  );
  const texMan = useMemo(
    () => create3DTextTexture("- MAN", "[-MALE]", "#FFFFFF", "#66f7ff"),
    [],
  );
  const texWoman = useMemo(
    () => create3DTextTexture("+ WOMAN", "[+FEMALE]", "#FFFFFF", "#00f0ff"),
    [],
  );
  const texQueen = useMemo(
    () =>
      create3DTextTexture("= QUEEN", "[+ROYAL, +FEMALE]", "#FFFFFF", "#ffb84d"),
    [],
  );

  // Second 150 frames: APPLE ambiguity tug-of-war at x = 12
  const tugOscillation =
    frame >= 150 ? Math.sin((frame - 150) * 0.14) * 0.65 : 0;
  const applePos = useMemo(
    () => new THREE.Vector3(12 + tugOscillation, 0.1, 0),
    [tugOscillation],
  );
  const fruitClusterPos = useMemo(() => new THREE.Vector3(9.1, 0.55, -0.3), []);
  const techClusterPos = useMemo(() => new THREE.Vector3(14.9, 0.55, 0.3), []);

  const leftRedTetherGeo = useMemo(
    () => buildPartialTubeGeometry([applePos, fruitClusterPos], 1, 0.065),
    [applePos, fruitClusterPos],
  );
  const rightRedTetherGeo = useMemo(
    () => buildPartialTubeGeometry([applePos, techClusterPos], 1, 0.065),
    [applePos, techClusterPos],
  );

  const texApple = useMemo(
    () => create3DTextTexture("APPLE", "AMBIGUOUS TOKEN", "#FFFFFF", "#00f0ff"),
    [],
  );
  const texFruit = useMemo(
    () =>
      create3DTextTexture(
        "FRUIT CLUSTER",
        "ORCHARD / SWEET",
        "#FFFFFF",
        "#ffb84d",
      ),
    [],
  );
  const texTech = useMemo(
    () =>
      create3DTextTexture(
        "SILICON TECH CLUSTER",
        "M-SERIES / CPU",
        "#FFFFFF",
        "#00f0ff",
      ),
    [],
  );

  const queenPulse =
    frame >= 100 ? 1 + 0.22 * Math.sin((frame - 100) * 0.2) : 0.85;

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
        onUpdate={(self) => self.lookAt(targetX, 0, 0)}
      />

      <pointLight position={[0, 1, 3]} intensity={6} distance={15} color="#ff9900" />
      <pointLight position={[12, 1, 3]} intensity={6} distance={15} color="#00f0ff" />

      {/* PART 1 (x = 0): KING - MAN + WOMAN = QUEEN */}
      <group position={[0, 0, 0]}>
        {vectorTubeGeo && (
          <mesh geometry={vectorTubeGeo}>
            <meshStandardMaterial
              color="#ffb84d"
              emissive="#ff9900"
              emissiveIntensity={4}
              toneMapped={false}
            />
          </mesh>
        )}
        {directBridgeGeo && (
          <mesh geometry={directBridgeGeo}>
            <meshStandardMaterial
              color="#66f7ff"
              emissive="#00f0ff"
              emissiveIntensity={3.5}
              toneMapped={false}
            />
          </mesh>
        )}

        {[
          { pos: pKing, tex: texKing, isQueen: false },
          { pos: pMan, tex: texMan, isQueen: false },
          { pos: pWoman, tex: texWoman, isQueen: false },
          { pos: pQueen, tex: texQueen, isQueen: true },
        ].map((item, idx) => (
          <group key={idx} position={item.pos}>
            <mesh scale={item.isQueen ? queenPulse * 1.25 : 1}>
              <sphereGeometry args={[0.28, 28, 28]} />
              {item.isQueen ? (
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
            <mesh position={[0, 0.58, 0.1]}>
              <planeGeometry args={[1.95, 0.52]} />
              <meshStandardMaterial
                map={item.tex}
                color="#FFFFFF"
                emissive={item.isQueen ? "#ff9900" : "#00f0ff"}
                emissiveIntensity={3}
                toneMapped={false}
                transparent
                depthWrite={false}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* PART 2 (x = 12): "APPLE" PULLED TOWARD FRUIT CLUSTER vs SILICON TECH CLUSTER */}
      <group>
        {/* Glowing Red Tether Lines */}
        {leftRedTetherGeo && (
          <mesh geometry={leftRedTetherGeo}>
            <meshStandardMaterial
              color="#ff4d6d"
              emissive="#ff1e42"
              emissiveIntensity={4}
              toneMapped={false}
            />
          </mesh>
        )}
        {rightRedTetherGeo && (
          <mesh geometry={rightRedTetherGeo}>
            <meshStandardMaterial
              color="#ff4d6d"
              emissive="#ff1e42"
              emissiveIntensity={4}
              toneMapped={false}
            />
          </mesh>
        )}

        {/* Center Cyan Sphere: APPLE */}
        <group position={applePos}>
          <mesh>
            <sphereGeometry args={[0.36, 32, 32]} />
            <meshStandardMaterial
              color="#66f7ff"
              emissive="#00f0ff"
              emissiveIntensity={3.5}
              toneMapped={false}
            />
          </mesh>
          <mesh position={[0, -0.68, 0.1]}>
            <planeGeometry args={[2.1, 0.56]} />
            <meshStandardMaterial
              map={texApple}
              color="#FFFFFF"
              emissive="#00f0ff"
              emissiveIntensity={3.5}
              toneMapped={false}
              transparent
              depthWrite={false}
            />
          </mesh>
        </group>

        {/* Left Cluster: FRUIT CLUSTER */}
        <group position={fruitClusterPos}>
          {[-0.35, 0, 0.35].map((ox, i) => (
            <mesh
              key={i}
              position={[ox, (i - 1) * 0.25, (i % 2) * 0.2]}
            >
              <sphereGeometry args={[0.2, 20, 20]} />
              <meshStandardMaterial
                color="#ffb84d"
                emissive="#ff9900"
                emissiveIntensity={4}
                toneMapped={false}
              />
            </mesh>
          ))}
          <mesh position={[0, 0.78, 0.1]}>
            <planeGeometry args={[2.3, 0.6]} />
            <meshStandardMaterial
              map={texFruit}
              color="#FFFFFF"
              emissive="#ff9900"
              emissiveIntensity={3.5}
              toneMapped={false}
              transparent
              depthWrite={false}
            />
          </mesh>
        </group>

        {/* Right Cluster: SILICON TECH CLUSTER */}
        <group position={techClusterPos}>
          {[-0.35, 0, 0.35].map((ox, i) => (
            <mesh
              key={i}
              position={[ox, (1 - i) * 0.25, (i % 2) * -0.2]}
            >
              <boxGeometry args={[0.32, 0.32, 0.32]} />
              <meshStandardMaterial
                color="#66f7ff"
                emissive="#00f0ff"
                emissiveIntensity={3.5}
                toneMapped={false}
              />
            </mesh>
          ))}
          <mesh position={[0, 0.78, 0.1]}>
            <planeGeometry args={[2.5, 0.6]} />
            <meshStandardMaterial
              map={texTech}
              color="#FFFFFF"
              emissive="#00f0ff"
              emissiveIntensity={3.5}
              toneMapped={false}
              transparent
              depthWrite={false}
            />
          </mesh>
        </group>
      </group>
    </>
  );
};

export const Scene5VectorArithmetic: React.FC<{
  captions: WhisperCaptionWord[];
}> = ({ captions }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const isPart2 = frame >= 150;

  return (
    <AbsoluteFill style={{ backgroundColor: "#050811", overflow: "hidden" }}>
      <Audio src={staticFile("clip-5.mp4")} playbackRate={1} />
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ fov: 48, position: [0, 1.2, 8.8], near: 0.1, far: 120 }}
        style={{ width: "100%", height: "100%", backgroundColor: "#050811" }}
      >
        <Scene5VectorArithmetic3DContent />
      </ThreeCanvas>

      <MinimalTopTitle
        title={isPart2 ? "CONTEXT AMBIGUITY" : "KING - MAN + WOMAN = QUEEN"}
        subtitle={
          isPart2
            ? "WHICH 'APPLE' DOES THE SENTENCE MEAN?"
            : "GEOMETRIC REASONING IN VECTOR SPACE"
        }
        fontSize={isPart2 ? 68 : 54}
        triggerFrame={isPart2 ? 150 : 0}
      />
      <WordSpacedSubtitle captions={captions} />
    </AbsoluteFill>
  );
};

// ============================================================================
// SCENE 6 (Frames 1380 to 1680 / 10s): Full-Screen 3D Self-Attention Matrix
// Arrange 8 glowing 3D monolith pillars in a circle representing words in a sentence.
// Erupt dozens of curved 3D golden and cyan CubicBezierLine laser beams shooting
// between the pillars, pulsing with high-intensity Bloom as related words
// magnetically glide closer together. Giant top title: "SELF-ATTENTION".
// ============================================================================
const SENTENCE_PILLARS = [
  { word: "APPLE", related: true },
  { word: "DESIGNED", related: false },
  { word: "A", related: false },
  { word: "NEW", related: false },
  { word: "SILICON", related: true },
  { word: "CHIP", related: true },
  { word: "TODAY", related: false },
  { word: "FAST", related: false },
];

const Scene6SelfAttention3DContent: React.FC = () => {
  const frame = useCurrentFrame();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  const orbitAngle = interpolate(frame, [0, 300], [-0.55, 0.65]);
  const camX = Math.sin(orbitAngle) * 9.5;
  const camY = interpolate(frame, [0, 150, 300], [5.8, 4.4, 5.2]);
  const camZ = Math.cos(orbitAngle) * 9.5;

  useLayoutEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.position.set(camX, camY, camZ);
      cameraRef.current.lookAt(0, 0.3, 0);
      cameraRef.current.updateProjectionMatrix();
      cameraRef.current.updateMatrixWorld();
    }
  }, [camX, camY, camZ]);

  const wordTextures = useMemo(
    () =>
      SENTENCE_PILLARS.map((p) =>
        create3DTextTexture(
          p.word,
          p.related ? "ATTN = 0.96" : "ATTN = 0.08",
          "#FFFFFF",
          p.related ? "#ffb84d" : "#00f0ff",
        ),
      ),
    [],
  );

  // Magnetic pull brings related pillars ("APPLE", "SILICON", "CHIP") closer toward the center
  const magneticPull = interpolate(frame, [95, 220], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });

  const pillarPositions = useMemo(() => {
    return SENTENCE_PILLARS.map((p, idx) => {
      const angle = (idx / SENTENCE_PILLARS.length) * Math.PI * 2;
      const baseRadius = 3.25;
      const r = p.related
        ? interpolate(magneticPull, [0, 1], [baseRadius, 1.65])
        : baseRadius;
      return new THREE.Vector3(Math.cos(angle) * r, 0, Math.sin(angle) * r);
    });
  }, [magneticPull]);

  // All 28 pairs of pillars connected by curved 3D CubicBezierLine + emissive tube arcs
  const attentionArcs = useMemo(() => {
    const list: {
      start: [number, number, number];
      end: [number, number, number];
      midA: [number, number, number];
      midB: [number, number, number];
      isStrongGolden: boolean;
      tubeGeo: THREE.TubeGeometry;
    }[] = [];

    for (let i = 0; i < SENTENCE_PILLARS.length; i++) {
      for (let j = i + 1; j < SENTENCE_PILLARS.length; j++) {
        const p1 = pillarPositions[i];
        const p2 = pillarPositions[j];
        const isStrongGolden =
          SENTENCE_PILLARS[i].related && SENTENCE_PILLARS[j].related;

        const archHeight = isStrongGolden ? 2.35 : 1.35 + ((i + j) % 3) * 0.35;
        const mid1 = new THREE.Vector3()
          .lerpVectors(p1, p2, 0.33)
          .add(new THREE.Vector3(0, archHeight, 0));
        const mid2 = new THREE.Vector3()
          .lerpVectors(p1, p2, 0.66)
          .add(new THREE.Vector3(0, archHeight, 0));

        const curve = new THREE.CubicBezierCurve3(
          new THREE.Vector3(p1.x, 0.85, p1.z),
          mid1,
          mid2,
          new THREE.Vector3(p2.x, 0.85, p2.z),
        );

        list.push({
          start: [p1.x, 0.85, p1.z],
          end: [p2.x, 0.85, p2.z],
          midA: [mid1.x, mid1.y, mid1.z],
          midB: [mid2.x, mid2.y, mid2.z],
          isStrongGolden,
          tubeGeo: new THREE.TubeGeometry(
            curve,
            24,
            isStrongGolden ? 0.055 : 0.018,
            8,
            false,
          ),
        });
      }
    }
    return list;
  }, [pillarPositions]);

  const beamsEnter = interpolate(frame, [18, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
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
        onUpdate={(self) => self.lookAt(0, 0.3, 0)}
      />

      <pointLight position={[0, 2.5, 0]} intensity={7} distance={15} color="#ff9900" />

      {/* Circular Reference Platform */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.75, 0]}>
        <ringGeometry args={[1.4, 3.65, 64]} />
        <meshStandardMaterial
          color="#162032"
          metalness={0.85}
          roughness={0.22}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 8 Glowing 3D Monolith Pillars */}
      {SENTENCE_PILLARS.map((item, idx) => {
        const pos = pillarPositions[idx];
        return (
          <group key={idx} position={pos}>
            {/* Monolith Base Body */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.58, 1.5, 0.58]} />
              <meshStandardMaterial
                color="#162032"
                metalness={0.85}
                roughness={0.22}
              />
            </mesh>

            {/* Glowing Crown Cap */}
            <mesh position={[0, 0.8, 0]}>
              <boxGeometry args={[0.64, 0.14, 0.64]} />
              {item.related ? (
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

            {/* Floating Word Label */}
            <mesh
              position={[0, 1.38, 0]}
              rotation={[0, -orbitAngle, 0]}
            >
              <planeGeometry args={[1.55, 0.42]} />
              <meshStandardMaterial
                map={wordTextures[idx]}
                color="#FFFFFF"
                emissive={item.related ? "#ff9900" : "#00f0ff"}
                emissiveIntensity={item.related ? 4 : 3.5}
                toneMapped={false}
                transparent
                depthWrite={false}
              />
            </mesh>
          </group>
        );
      })}

      {/* Curved 3D CubicBezierLine + Emissive Laser Arcs Shooting Between Pillars */}
      {beamsEnter > 0.02 && (
        <group scale={[1, beamsEnter, 1]}>
          {attentionArcs.map((arc, idx) => (
            <React.Fragment key={idx}>
              <CubicBezierLine
                start={arc.start}
                end={arc.end}
                midA={arc.midA}
                midB={arc.midB}
                color={arc.isStrongGolden ? "#ffb84d" : "#00f0ff"}
                lineWidth={arc.isStrongGolden ? 3.5 : 1.2}
              />
              <mesh geometry={arc.tubeGeo}>
                {arc.isStrongGolden ? (
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
                    transparent
                    opacity={0.42}
                  />
                )}
              </mesh>
            </React.Fragment>
          ))}
        </group>
      )}
    </>
  );
};

export const Scene6SelfAttention: React.FC<{
  captions: WhisperCaptionWord[];
}> = ({ captions }) => {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#050811", overflow: "hidden" }}>
      <Audio src={staticFile("clip-6.mp4")} playbackRate={1} />
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ fov: 48, position: [-5.0, 5.8, 8.0], near: 0.1, far: 120 }}
        style={{ width: "100%", height: "100%", backgroundColor: "#050811" }}
      >
        <Scene6SelfAttention3DContent />
      </ThreeCanvas>

      <MinimalTopTitle
        title="SELF-ATTENTION"
        subtitle="WORDS MAGNETICALLY LINK ACROSS CONTEXT"
        fontSize={72}
      />
      <WordSpacedSubtitle captions={captions} />
    </AbsoluteFill>
  );
};

// ============================================================================
// SCENE 7 (Frames 1680 to 1980 / 10s): Full-Screen 3D Neural Weights City
// Camera dives low through an InstancedMesh canyon of 3,000 dark-metallic neural
// switch gates (similar to the FinFET transistor city). Golden electrical pulses
// surge along 3D pathways—some gates glow blindingly bright (weight = +1.0, "1")
// while others turn dark steel (weight = 0.0, "0").
// ============================================================================
const Scene7NeuralWeightsCity3DContent: React.FC = () => {
  const frame = useCurrentFrame();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  // Camera dives low and glides forward through the canyon of 3,000 neural switch gates
  const camX = Math.sin(frame * 0.02) * 1.45;
  const camY = interpolate(frame, [0, 90, 300], [11.5, 2.35, 1.95], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const camZ = interpolate(frame, [0, 300], [22, -12]);

  useLayoutEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.position.set(camX, camY, camZ);
      cameraRef.current.lookAt(camX * 0.3, 0.9, camZ - 9);
      cameraRef.current.updateProjectionMatrix();
      cameraRef.current.updateMatrixWorld();
    }
  }, [camX, camY, camZ]);

  // 3,000 neural switch gates (50 cols x 60 rows = 3,000 instances)
  const gateCoords = useMemo(() => {
    const list: { col: number; row: number; x: number; z: number }[] = [];
    for (let row = -30; row < 30; row++) {
      for (let col = -25; col < 25; col++) {
        // Leave a central flight canyon avenue between col = -1 and col = 0
        const offsetX = col >= 0 ? col + 0.85 : col - 0.85;
        list.push({
          col,
          row,
          x: offsetX * 1.15,
          z: row * 1.25,
        });
      }
    }
    return list;
  }, []);

  const darkGateRef = useRef<THREE.InstancedMesh>(null);
  const activeGateRef = useRef<THREE.InstancedMesh>(null);
  const pillarRef = useRef<THREE.InstancedMesh>(null);

  const gateGeo = useMemo(() => new THREE.BoxGeometry(0.42, 0.95, 0.42), []);
  const pillarGeo = useMemo(
    () => new THREE.CylinderGeometry(0.08, 0.09, 0.48, 10),
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

  useLayoutEffect(() => {
    const dummy = new THREE.Object3D();
    gateCoords.forEach((g, i) => {
      dummy.scale.set(1, 1, 1);
      dummy.position.set(g.x, 0.48, g.z);
      dummy.updateMatrix();
      darkGateRef.current?.setMatrixAt(i, dummy.matrix);

      dummy.position.set(g.x, 1.18, g.z);
      dummy.updateMatrix();
      pillarRef.current?.setMatrixAt(i, dummy.matrix);
    });
    if (darkGateRef.current)
      darkGateRef.current.instanceMatrix.needsUpdate = true;
    if (pillarRef.current) pillarRef.current.instanceMatrix.needsUpdate = true;
  }, [gateCoords]);

  useLayoutEffect(() => {
    const dummy = new THREE.Object3D();
    gateCoords.forEach((g, i) => {
      const signalWave = Math.sin(g.row * 0.45 + frame * 0.22 + g.col * 0.35);
      const isActive = signalWave > 0.38;

      if (isActive) {
        dummy.position.set(g.x, 0.5, g.z);
        dummy.scale.set(1.05, 1.05, 1.05);
      } else {
        dummy.position.set(0, -100, 0);
        dummy.scale.set(0, 0, 0);
      }
      dummy.updateMatrix();
      activeGateRef.current?.setMatrixAt(i, dummy.matrix);
    });
    if (activeGateRef.current)
      activeGateRef.current.instanceMatrix.needsUpdate = true;
  }, [frame, gateCoords]);

  return (
    <>
      <C4DOctaneRig fogDensity={0.035} sparklesColor="#ffb84d" />
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        fov={52}
        near={0.1}
        far={120}
        position={[camX, camY, camZ]}
        onUpdate={(self) => self.lookAt(camX * 0.3, 0.9, camZ - 9)}
      />

      <pointLight
        position={[0, 2.5, camZ - 4]}
        intensity={8}
        distance={18}
        color="#ff9900"
      />

      {/* Silicon Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[90, 90]} />
        <meshStandardMaterial
          color="#0b111d"
          metalness={0.88}
          roughness={0.26}
        />
      </mesh>

      {/* Golden Electrical Pulse Pathways Along Canyon Floor */}
      {[-0.45, 0, 0.45].map((lx, idx) => (
        <mesh key={idx} position={[lx, 0.04, 0]}>
          <boxGeometry args={[0.08, 0.04, 80]} />
          <meshStandardMaterial
            color="#ffb84d"
            emissive="#ff9900"
            emissiveIntensity={4}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* 3,000 Instanced Neural Switch Gates */}
      <instancedMesh
        ref={darkGateRef}
        args={[gateGeo, darkMetalMat, 3000]}
        frustumCulled={false}
      />
      <instancedMesh
        ref={pillarRef}
        args={[pillarGeo, darkMetalMat, 3000]}
        frustumCulled={false}
      />
      <instancedMesh
        ref={activeGateRef}
        args={[gateGeo, goldenEmissiveMat, 3000]}
        frustumCulled={false}
      />
    </>
  );
};

export const Scene7NeuralWeightsCity: React.FC<{
  captions: WhisperCaptionWord[];
}> = ({ captions }) => {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#050811", overflow: "hidden" }}>
      <Audio src={staticFile("clip-7.mp4")} playbackRate={1} />
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ fov: 52, position: [0, 11.5, 22], near: 0.1, far: 120 }}
        style={{ width: "100%", height: "100%", backgroundColor: "#050811" }}
      >
        <Scene7NeuralWeightsCity3DContent />
      </ThreeCanvas>

      <MinimalTopTitle
        title="NEURAL WEIGHTS"
        subtitle="WEIGHT = +1.0 (FIRE)  |  WEIGHT = 0.0 (BLOCK)"
        fontSize={68}
      />
      <WordSpacedSubtitle captions={captions} />
    </AbsoluteFill>
  );
};
