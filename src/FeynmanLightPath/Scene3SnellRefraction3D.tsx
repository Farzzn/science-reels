import { PerspectiveCamera, Sparkles } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { ThreeCanvas } from "@remotion/three";
import React, { useLayoutEffect, useMemo, useRef } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import * as THREE from "three";
import { TheBoldFont } from "../load-font";
import { useEffectComposerSync } from "./PostprocessingBloom";
import {
  buildPartialTubeGeometry,
  createMinimalTextTexture,
  getPointAlongPolyline,
} from "./Scene2BeachStraightPath3D";

// Smooth Orbital PerspectiveCamera Rig continuing across X, Y, and Z via interpolate
const OrbitalCameraRigPart2: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  const camX = interpolate(frame, [0, durationInFrames], [2.4, -2.6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.sin),
  });
  const camY = interpolate(frame, [0, durationInFrames], [6.8, 5.8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.sin),
  });
  const camZ = interpolate(frame, [0, durationInFrames], [10.8, 9.6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.sin),
  });

  useLayoutEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.position.set(camX, camY, camZ);
      cameraRef.current.lookAt(0, -0.3, 0.2);
      cameraRef.current.updateProjectionMatrix();
      cameraRef.current.updateMatrixWorld();
    }
  }, [camX, camY, camZ]);

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      fov={52}
      position={[camX, camY, camZ]}
      onUpdate={(self) => self.lookAt(0, -0.3, 0.2)}
      near={0.1}
      far={100}
    />
  );
};

const SnellRefraction3DContent: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pointA = useMemo(() => new THREE.Vector3(-3, 0.08, -4), []);
  const pointB = useMemo(() => new THREE.Vector3(3, 0.08, 4), []);

  // Dimmed Red Straight Line (20% opacity)
  const straightPoints = useMemo(
    () => [
      new THREE.Vector3(-3, 0.08, -4),
      new THREE.Vector3(0, 0.08, 0),
      new THREE.Vector3(3, 0.08, 4),
    ],
    [],
  );

  // Bright Golden Bent Fermat Path: [-3, 0, -4] -> [1.95, 0, 0] -> [3, 0, 4]
  const refractionPoint = useMemo(() => new THREE.Vector3(1.95, 0.14, 0), []);
  const fermatPoints = useMemo(
    () => [
      new THREE.Vector3(-3, 0.14, -4),
      refractionPoint,
      new THREE.Vector3(3, 0.14, 4),
    ],
    [refractionPoint],
  );

  const fermatDrawProgress = interpolate(
    frame,
    [8, Math.round(durationInFrames * 0.58)],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    },
  );

  const laserStartFrame = Math.round(durationInFrames * 0.6);
  const laserPulseProgress = interpolate(
    frame,
    [laserStartFrame, Math.round(durationInFrames * 0.94)],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.quad),
    },
  );

  const snellAnglesEnter = spring({
    frame: Math.max(0, frame - Math.round(durationInFrames * 0.25)),
    fps,
    config: { damping: 16, stiffness: 140 },
  });

  const straightGeo = useMemo(
    () => buildPartialTubeGeometry(straightPoints, 1, 0.06),
    [straightPoints],
  );
  const fermatGeo = useMemo(
    () => buildPartialTubeGeometry(fermatPoints, fermatDrawProgress, 0.095),
    [fermatPoints, fermatDrawProgress],
  );
  const laserCoreGeo = useMemo(
    () =>
      frame >= laserStartFrame
        ? buildPartialTubeGeometry(fermatPoints, laserPulseProgress, 0.13)
        : null,
    [frame, laserStartFrame, fermatPoints, laserPulseProgress],
  );

  const fermatHeadPos = useMemo(
    () => getPointAlongPolyline(fermatPoints, fermatDrawProgress),
    [fermatPoints, fermatDrawProgress],
  );
  const laserHeadPos = useMemo(
    () => getPointAlongPolyline(fermatPoints, laserPulseProgress),
    [fermatPoints, laserPulseProgress],
  );

  const sandTexture = useMemo(
    () => createMinimalTextTexture("SAND", "V1 = 8.0 m/s", "#F5D061"),
    [],
  );
  const waterTexture = useMemo(
    () => createMinimalTextTexture("WATER", "V2 = 2.0 m/s", "#00F0FF"),
    [],
  );
  const pointATexture = useMemo(
    () => createMinimalTextTexture("A [-3, 0, -4]", "EMITTER", "#F5D061"),
    [],
  );
  const pointBTexture = useMemo(
    () => createMinimalTextTexture("B [3, 0, 4]", "TARGET", "#00F0FF"),
    [],
  );

  const rippleScale = 1 + ((frame * 0.025) % 1.4);
  const rippleOpacity = interpolate((frame * 0.025) % 1.4, [0, 1.4], [0.8, 0]);
  const composerRef = useEffectComposerSync();

  return (
    <>
      <OrbitalCameraRigPart2 durationInFrames={durationInFrames} />
      <group scale={0.74} position={[0, 0.1, 0]}>
        {/* 3D Ambient Particle Field for Real Parallax Depth */}
      <group
        rotation={[0, 0.9 + frame * 0.003, frame * 0.0015]}
        position={[0, Math.cos(frame * 0.02) * 0.15, 0]}
      >
        <Sparkles
          count={80}
          scale={[14, 10, 14]}
          size={3.2}
          speed={0}
          opacity={0.65}
          color="#F5D061"
        />
      </group>

      <ambientLight intensity={0.45} />
      <directionalLight position={[6, 12, 8]} intensity={1.1} color="#FFFFFF" />
      <pointLight position={[-3, 2.2, -4]} intensity={2.2} color="#F5D061" />
      <pointLight position={[3, 2.2, 4]} intensity={2.2} color="#00F0FF" />
      <pointLight position={[1.95, 1.8, 0]} intensity={3.2} color="#F5D061" />

      {/* TOP HALF (Z < 0): GOLDEN WIREFRAME GRID */}
      <group position={[0, 0, -2.5]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, 0]}>
          <planeGeometry args={[8.2, 5.0, 16, 10]} />
          <meshStandardMaterial
            color="#1B1304"
            emissive="#4A3408"
            emissiveIntensity={0.25}
            roughness={0.8}
            metalness={0.2}
            transparent
            opacity={0.65}
          />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[8.2, 5.0, 16, 10]} />
          <meshStandardMaterial
            color="#F5D061"
            emissive="#F5D061"
            emissiveIntensity={0.8}
            wireframe
            transparent
            opacity={0.42}
          />
        </mesh>
        <mesh position={[-2.65, 0.25, 1.35]} rotation={[-0.6, 0, 0]}>
          <planeGeometry args={[2.5, 0.44]} />
          <meshBasicMaterial
            map={sandTexture}
            transparent
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* BOTTOM HALF (Z > 0): TRANSLUCENT CYAN WATER VOLUME */}
      <group position={[0, -0.22, 2.5]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[8.2, 0.44, 5.0]} />
          <meshPhysicalMaterial
            color="#005F78"
            emissive="#002D3D"
            emissiveIntensity={0.35}
            transmission={0.68}
            roughness={0.15}
            metalness={0.1}
            ior={1.333}
            transparent
            opacity={0.62}
          />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.225, 0]}>
          <planeGeometry args={[8.2, 5.0, 16, 10]} />
          <meshStandardMaterial
            color="#00F0FF"
            emissive="#00F0FF"
            emissiveIntensity={0.85}
            wireframe
            transparent
            opacity={0.36}
          />
        </mesh>
        <mesh position={[-2.65, 0.45, -1.25]} rotation={[-0.6, 0, 0]}>
          <planeGeometry args={[2.5, 0.44]} />
          <meshBasicMaterial
            map={waterTexture}
            transparent
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* SHORELINE BOUNDARY (Z = 0) */}
      <mesh position={[0, 0.03, 0]}>
        <boxGeometry args={[8.4, 0.035, 0.05]} />
        <meshStandardMaterial
          color="#FFFFFF"
          emissive="#FFFFFF"
          emissiveIntensity={1.6}
          toneMapped={false}
        />
      </mesh>

      {/* POINT A [-3, 0, -4] BEACON */}
      <group position={pointA}>
        <mesh>
          <sphereGeometry args={[0.2, 32, 32]} />
          <meshStandardMaterial
            color="#F5D061"
            emissive="#F5D061"
            emissiveIntensity={3}
            toneMapped={false}
          />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
          <ringGeometry args={[0.28, 0.36, 32]} />
          <meshStandardMaterial
            color="#F5D061"
            emissive="#F5D061"
            emissiveIntensity={2.5}
            toneMapped={false}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh position={[1.35, 0.45, -0.25]} rotation={[-0.55, 0, 0]}>
          <planeGeometry args={[2.2, 0.4]} />
          <meshBasicMaterial
            map={pointATexture}
            transparent
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* POINT B [3, 0, 4] BEACON */}
      <group position={pointB}>
        <mesh>
          <sphereGeometry args={[0.2, 32, 32]} />
          <meshStandardMaterial
            color="#00F0FF"
            emissive="#00F0FF"
            emissiveIntensity={3}
            toneMapped={false}
          />
        </mesh>
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.05, 0]}
          scale={[rippleScale, rippleScale, 1]}
        >
          <ringGeometry args={[0.28, 0.36, 32]} />
          <meshStandardMaterial
            color="#00F0FF"
            emissive="#00F0FF"
            emissiveIntensity={2.5}
            toneMapped={false}
            side={THREE.DoubleSide}
            transparent
            opacity={rippleOpacity}
          />
        </mesh>
        <mesh position={[-1.4, 0.45, 0.2]} rotation={[-0.55, 0, 0]}>
          <planeGeometry args={[2.2, 0.4]} />
          <meshBasicMaterial
            map={pointBTexture}
            transparent
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* RED STRAIGHT LINE DIMMED TO 20% OPACITY */}
      {straightGeo && (
        <mesh geometry={straightGeo}>
          <meshStandardMaterial
            color="#FF3B30"
            emissive="#FF2A54"
            emissiveIntensity={0.6}
            transparent
            opacity={0.2}
          />
        </mesh>
      )}

      {/* BRIGHT GOLDEN OPTIMAL BENT TUBE WITH CINEMATIC BLOOM */}
      {fermatGeo && (
        <mesh geometry={fermatGeo}>
          <meshStandardMaterial
            color="#F5D061"
            emissive="#F5D061"
            emissiveIntensity={3}
            toneMapped={false}
            roughness={0.1}
          />
        </mesh>
      )}

      {/* Fermat Path Drawing Head */}
      {fermatDrawProgress > 0.01 && frame < laserStartFrame && (
        <mesh position={fermatHeadPos}>
          <sphereGeometry args={[0.18, 24, 24]} />
          <meshStandardMaterial
            color="#FFFFFF"
            emissive="#F5D061"
            emissiveIntensity={3}
            toneMapped={false}
          />
        </mesh>
      )}

      {/* GLOWING CYAN-GOLD LASER PULSE ALONG BENT TRAJECTORY */}
      {frame >= laserStartFrame && (
        <group>
          {laserCoreGeo && (
            <mesh geometry={laserCoreGeo}>
              <meshStandardMaterial
                color="#FFFFFF"
                emissive="#00F0FF"
                emissiveIntensity={3}
                toneMapped={false}
              />
            </mesh>
          )}
          <mesh position={laserHeadPos}>
            <sphereGeometry args={[0.24, 32, 32]} />
            <meshStandardMaterial
              color="#FFFFFF"
              emissive="#00F0FF"
              emissiveIntensity={3}
              toneMapped={false}
            />
          </mesh>
        </group>
      )}

      {/* REFRACTION BOUNDARY NORMAL & THETA1 / THETA2 ARCS */}
      <group position={refractionPoint} scale={snellAnglesEnter}>
        {Array.from({ length: 13 }).map((_, idx) => {
          const zOffset = -2.4 + idx * 0.4;
          return (
            <mesh key={idx} position={[0, 0.05, zOffset]}>
              <boxGeometry args={[0.045, 0.045, 0.2]} />
              <meshStandardMaterial
                color="#00F0FF"
                emissive="#00F0FF"
                emissiveIntensity={2.4}
                toneMapped={false}
              />
            </mesh>
          );
        })}

        {/* Incident Angle Arc (theta1 in Sand, Z < 0) */}
        <mesh
          rotation={[-Math.PI / 2, 0, Math.PI / 2]}
          position={[0, 0.06, 0]}
        >
          <ringGeometry args={[1.05, 1.16, 32, 1, 0, 0.89]} />
          <meshStandardMaterial
            color="#F5D061"
            emissive="#F5D061"
            emissiveIntensity={3}
            toneMapped={false}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Refracted Angle Arc (theta2 in Water, Z > 0) */}
        <mesh
          rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
          position={[0, 0.06, 0]}
        >
          <ringGeometry args={[1.25, 1.36, 32, 1, 0, 0.26]} />
          <meshStandardMaterial
            color="#00F0FF"
            emissive="#00F0FF"
            emissiveIntensity={3}
            toneMapped={false}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Glowing Refraction Impact Ring */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.07, 0]}>
          <ringGeometry args={[0.2, 0.34, 32]} />
          <meshStandardMaterial
            color="#FFFFFF"
            emissive="#F5D061"
            emissiveIntensity={3}
            toneMapped={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

        {/* POSTPROCESSING BLOOM */}
        <EffectComposer ref={composerRef} multisampling={0}>
          <Bloom intensity={1.6} luminanceThreshold={0.15} mipmapBlur />
        </EffectComposer>
      </group>
    </>
  );
};

export const Scene3SnellRefraction3D: React.FC<{
  durationInFrames: number;
}> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  const headerEnter = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 150 },
  });

  const isSnellFormulaVisible = frame >= Math.round(durationInFrames * 0.58);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000", overflow: "hidden" }}>
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ fov: 52, position: [2.4, 6.8, 10.8], near: 0.1, far: 100 }}
        style={{ width: "100%", height: "100%", backgroundColor: "#000000" }}
      >
        <color attach="background" args={["#000000"]} />
        <SnellRefraction3DContent durationInFrames={durationInFrames} />
      </ThreeCanvas>

      {/* MINIMAL, UNOBSTRUCTED FLOATING TOP TELEMETRY LABEL (NO BULKY BOXES) */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          paddingTop: 88,
          paddingLeft: 52,
          paddingRight: 52,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          opacity: headerEnter,
          transform: `translateY(${interpolate(headerEnter, [0, 1], [-14, 0])}px)`,
        }}
      >
        <div
          style={{
            fontFamily: `'Montserrat', ${TheBoldFont}, sans-serif`,
            fontWeight: 900,
            fontSize: 30,
            color: "#F5D061",
            letterSpacing: 0.9,
            textAlign: "center",
            textShadow:
              "0 0 26px rgba(245, 208, 97, 0.75), 0 6px 20px rgba(0,0,0,0.95)",
          }}
        >
          FERMAT OPTIMAL PATH // FASTEST TIME: 9.4s
        </div>

        {isSnellFormulaVisible && (
          <div
            style={{
              fontFamily: `'JetBrains Mono', monospace`,
              fontWeight: 800,
              fontSize: 25,
              color: "#00F0FF",
              letterSpacing: 1.2,
              textAlign: "center",
              textShadow:
                "0 0 22px rgba(0, 240, 255, 0.8), 0 4px 16px rgba(0,0,0,0.95)",
            }}
          >
            SNELL&apos;S LAW // n1 * sin(theta1) = n2 * sin(theta2)
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
