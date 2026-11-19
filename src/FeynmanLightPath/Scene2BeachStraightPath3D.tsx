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

// Minimal, borderless, unobstructed 3D floating text texture (zero box background)
export function createMinimalTextTexture(
  title: string,
  subtitle: string,
  accentColor: string,
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 180;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.shadowColor = "rgba(0, 0, 0, 0.95)";
    ctx.shadowBlur = 12;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 4;

    ctx.font = "900 44px 'Montserrat', 'Inter', sans-serif";
    ctx.fillStyle = "#FFFFFF";
    ctx.textBaseline = "middle";
    ctx.fillText(title, 24, subtitle ? 64 : 90);

    if (subtitle) {
      ctx.font = "800 34px 'JetBrains Mono', 'Fira Code', monospace";
      ctx.fillStyle = accentColor;
      ctx.fillText(subtitle, 24, 124);
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export function buildPartialTubeGeometry(
  points: THREE.Vector3[],
  progress: number,
  radius: number,
  tubularSegments = 64,
): THREE.TubeGeometry | null {
  const clamped = Math.max(0, Math.min(1, progress));
  if (clamped <= 0.01) return null;

  const segments: { start: THREE.Vector3; end: THREE.Vector3; len: number }[] =
    [];
  let totalLen = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const len = points[i].distanceTo(points[i + 1]);
    segments.push({ start: points[i], end: points[i + 1], len });
    totalLen += len;
  }

  const targetLen = totalLen * clamped;
  const sampled: THREE.Vector3[] = [points[0].clone()];
  let accum = 0;

  for (const seg of segments) {
    if (accum + seg.len <= targetLen) {
      sampled.push(seg.start.clone().lerp(seg.end, 0.5));
      sampled.push(seg.end.clone());
      accum += seg.len;
    } else {
      const remain = targetLen - accum;
      if (remain > 0.001) {
        const t = remain / seg.len;
        sampled.push(seg.start.clone().lerp(seg.end, t * 0.5));
        sampled.push(seg.start.clone().lerp(seg.end, t));
      }
      break;
    }
  }

  if (sampled.length < 2) return null;
  const curve = new THREE.CatmullRomCurve3(sampled, false, "catmullrom", 0.06);
  return new THREE.TubeGeometry(curve, tubularSegments, radius, 16, false);
}

export function getPointAlongPolyline(
  points: THREE.Vector3[],
  progress: number,
): THREE.Vector3 {
  const clamped = Math.max(0, Math.min(1, progress));
  let totalLen = 0;
  const lengths: number[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const l = points[i].distanceTo(points[i + 1]);
    lengths.push(l);
    totalLen += l;
  }
  const target = totalLen * clamped;
  let accum = 0;
  for (let i = 0; i < lengths.length; i++) {
    if (accum + lengths[i] >= target) {
      const localT = lengths[i] > 0 ? (target - accum) / lengths[i] : 0;
      return points[i].clone().lerp(points[i + 1], localT);
    }
    accum += lengths[i];
  }
  return points[points.length - 1].clone();
}

// Smooth Orbital PerspectiveCamera Rig (changing X, Y, and Z via interpolate)
const OrbitalCameraRigPart1: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  const camX = interpolate(frame, [0, durationInFrames], [-3.2, 2.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.sin),
  });
  const camY = interpolate(frame, [0, durationInFrames], [8.6, 6.8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.sin),
  });
  const camZ = interpolate(frame, [0, durationInFrames], [12.4, 10.8], {
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

const BeachStraightPath3DContent: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();

  const pointA = useMemo(() => new THREE.Vector3(-3, 0.08, -4), []);
  const pointB = useMemo(() => new THREE.Vector3(3, 0.08, 4), []);

  const straightPoints = useMemo(
    () => [
      new THREE.Vector3(-3, 0.1, -4),
      new THREE.Vector3(0, 0.1, 0),
      new THREE.Vector3(3, 0.1, 4),
    ],
    [],
  );

  // Synced to clip-2.mp4 audio: fast on Sand, 4x slower in Water
  const drawProgress = interpolate(
    frame,
    [
      Math.round(durationInFrames * 0.24),
      Math.round(durationInFrames * 0.44),
      Math.round(durationInFrames * 0.92),
    ],
    [0, 0.5, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  const straightTubeGeo = useMemo(
    () => buildPartialTubeGeometry(straightPoints, drawProgress, 0.085),
    [straightPoints, drawProgress],
  );

  const runnerPos = useMemo(
    () => getPointAlongPolyline(straightPoints, drawProgress),
    [straightPoints, drawProgress],
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
    () => createMinimalTextTexture("A [-3, 0, -4]", "LIFEGUARD", "#F5D061"),
    [],
  );
  const pointBTexture = useMemo(
    () => createMinimalTextTexture("B [3, 0, 4]", "SWIMMER", "#00F0FF"),
    [],
  );

  const rippleScale = 1 + ((frame * 0.025) % 1.4);
  const rippleOpacity = interpolate((frame * 0.025) % 1.4, [0, 1.4], [0.8, 0]);
  const composerRef = useEffectComposerSync();

  return (
    <>
      <OrbitalCameraRigPart1 durationInFrames={durationInFrames} />
      <group scale={0.74} position={[0, 0.1, 0]}>
        {/* 3D Ambient Particle Field for Real Parallax Depth */}
      <group
        rotation={[0, frame * 0.003, frame * 0.0015]}
        position={[0, Math.sin(frame * 0.02) * 0.15, 0]}
      >
        <Sparkles
          count={80}
          scale={[14, 10, 14]}
          size={3.2}
          speed={0}
          opacity={0.65}
          color="#7CE8FF"
        />
      </group>

      <ambientLight intensity={0.45} />
      <directionalLight position={[6, 12, 8]} intensity={1.1} color="#FFFFFF" />
      <pointLight position={[-3, 2.2, -4]} intensity={2.4} color="#F5D061" />
      <pointLight position={[3, 2.2, 4]} intensity={2.4} color="#00F0FF" />

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
        {/* Minimal unobstructed label on left margin of Sand */}
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
        {/* Minimal unobstructed label on left margin of Water */}
        <mesh position={[-2.65, 0.45, -1.25]} rotation={[-0.6, 0, 0]}>
          <planeGeometry args={[2.5, 0.44]} />
          <meshBasicMaterial
            map={waterTexture}
            transparent
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* SHORELINE BOUNDARY LINE (Z = 0) */}
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

      {/* GLOWING RED 3D TUBE: STRAIGHT DIAGONAL LINE WITH CINEMATIC BLOOM */}
      {straightTubeGeo && (
        <mesh geometry={straightTubeGeo}>
          <meshStandardMaterial
            color="#FF2A4B"
            emissive="#FF1E42"
            emissiveIntensity={3}
            toneMapped={false}
            roughness={0.15}
          />
        </mesh>
      )}

      {/* TRAVELING PHOTON / LIFEGUARD PULSE */}
      {drawProgress > 0.01 && (
        <mesh position={runnerPos}>
          <sphereGeometry args={[0.18, 24, 24]} />
          <meshStandardMaterial
            color="#FFFFFF"
            emissive="#FF3B5C"
            emissiveIntensity={3}
            toneMapped={false}
          />
        </mesh>
      )}

        {/* POSTPROCESSING BLOOM */}
        <EffectComposer ref={composerRef} multisampling={0}>
          <Bloom intensity={1.6} luminanceThreshold={0.15} mipmapBlur />
        </EffectComposer>
      </group>
    </>
  );
};

export const Scene2BeachStraightPath3D: React.FC<{
  durationInFrames: number;
}> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  const headerEnter = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 140 },
  });

  const elapsedSec = interpolate(
    frame,
    [
      Math.round(durationInFrames * 0.24),
      Math.round(durationInFrames * 0.92),
    ],
    [0, 14.2],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  ).toFixed(1);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000", overflow: "hidden" }}>
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ fov: 52, position: [-3.2, 8.6, 12.4], near: 0.1, far: 100 }}
        style={{ width: "100%", height: "100%", backgroundColor: "#000000" }}
      >
        <color attach="background" args={["#000000"]} />
        <BeachStraightPath3DContent durationInFrames={durationInFrames} />
      </ThreeCanvas>

      {/* MINIMAL, UNOBSTRUCTED FLOATING TOP TELEMETRY LABEL (NO BULKY BOXES) */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          paddingTop: 88,
          paddingLeft: 56,
          paddingRight: 56,
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
            fontFamily: `'JetBrains Mono', monospace`,
            fontWeight: 800,
            fontSize: 22,
            color: "#94A3B8",
            letterSpacing: 2.2,
            textShadow: "0 4px 16px rgba(0,0,0,0.95)",
          }}
        >
          <span style={{ color: "#F5D061" }}>SAND 8.0 m/s</span>
          {"  //  "}
          <span style={{ color: "#00F0FF" }}>WATER 2.0 m/s</span>
        </div>

        <div
          style={{
            fontFamily: `'Montserrat', ${TheBoldFont}, sans-serif`,
            fontWeight: 900,
            fontSize: 30,
            color: "#FF4D6D",
            letterSpacing: 0.8,
            textAlign: "center",
            textShadow:
              "0 0 24px rgba(255, 42, 75, 0.75), 0 6px 20px rgba(0,0,0,0.95)",
          }}
        >
          STRAIGHT LINE // TOO MUCH SWIMMING ({elapsedSec}s)
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
