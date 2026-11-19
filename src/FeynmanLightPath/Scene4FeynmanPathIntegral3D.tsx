import { PerspectiveCamera, Sparkles } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
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

// Minimal, unobstructed 3D floating text label (no bulky rectangle/border box)
function createMinimalNodeLabelTexture(
  label: string,
  sublabel: string,
  accent: string,
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 768;
  canvas.height = 150;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.shadowColor = "rgba(0, 0, 0, 0.95)";
    ctx.shadowBlur = 14;

    ctx.font = "900 40px 'Montserrat', 'Inter', sans-serif";
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, canvas.width / 2, 54);

    ctx.font = "700 28px 'JetBrains Mono', monospace";
    ctx.fillStyle = accent;
    ctx.fillText(sublabel, canvas.width / 2, 106);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453123;
  return x - Math.floor(x);
}

interface QuantumTrajectoryData {
  id: number;
  curve: THREE.CatmullRomCurve3;
  isCyan: boolean;
  radialSpread: number;
  phaseSpeed: number;
  initialPhase: number;
  midPoint: THREE.Vector3;
}

// Smooth orbital PerspectiveCamera changing X, Y, and Z via interpolate
const OrbitalCameraRig: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  const camX = interpolate(frame, [0, durationInFrames], [-4.4, 4.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const camY = interpolate(frame, [0, durationInFrames], [1.6, -1.1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const camZ = interpolate(
    frame,
    [0, Math.round(durationInFrames * 0.5), durationInFrames],
    [12.8, 11.4, 10.6],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  useLayoutEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.position.set(camX, camY, camZ);
      cameraRef.current.lookAt(0, -0.1, 0);
      cameraRef.current.updateProjectionMatrix();
      cameraRef.current.updateMatrixWorld();
    }
  }, [camX, camY, camZ]);

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      fov={50}
      near={0.1}
      far={100}
      position={[camX, camY, camZ]}
      onUpdate={(self) => self.lookAt(0, -0.1, 0)}
    />
  );
};

// Spinning 3D Phase-Wave Ring + Phasor Hand with emissive Bloom
const PhaseWaveRing3D: React.FC<{
  position: [number, number, number];
  angle: number;
  color: string;
  opacity: number;
  scale?: number;
}> = ({ position, angle, color, opacity, scale = 1 }) => {
  if (opacity <= 0.01) return null;
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0, 0.015]}>
        <ringGeometry args={[0.31, 0.39, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={3}
          toneMapped={false}
          transparent
          opacity={opacity}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <group rotation={[0, 0, angle]} position={[0, 0, 0.03]}>
        <mesh position={[0, 0.12, 0]}>
          <boxGeometry args={[0.055, 0.24, 0.02]} />
          <meshStandardMaterial
            color="#FFFFFF"
            emissive="#FFFFFF"
            emissiveIntensity={3}
            toneMapped={false}
            transparent
            opacity={opacity}
          />
        </mesh>
        <mesh position={[0, 0.27, 0]}>
          <coneGeometry args={[0.095, 0.14, 12]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={3}
            toneMapped={false}
            transparent
            opacity={opacity}
          />
        </mesh>
      </group>
    </group>
  );
};

const Feynman3DSceneContent: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const halfFrame = Math.round(durationInFrames * 0.5);

  const sourcePos = useMemo(() => new THREE.Vector3(0, -1.95, 0), []);
  const targetPos = useMemo(() => new THREE.Vector3(0, 2.25, 0), []);

  // Build 36 wild, looping, spiraling 3D CatmullRomCurve3 neon quantum trajectories
  const trajectories = useMemo<QuantumTrajectoryData[]>(() => {
    const list: QuantumTrajectoryData[] = [];
    const count = 36;

    for (let i = 0; i < count; i++) {
      const s1 = seededRandom(i * 11 + 1);
      const s2 = seededRandom(i * 17 + 3);
      const s3 = seededRandom(i * 23 + 7);
      const s4 = seededRandom(i * 31 + 13);

      const baseAzimuth = (i / count) * Math.PI * 2 + (s1 - 0.5) * 0.25;
      const radialSpread = 0.45 + Math.pow(s2, 0.85) * 2.2;
      const spiralTurns = (s3 > 0.5 ? 1 : -1) * (0.6 + s4 * 1.65);

      const controlPoints: THREE.Vector3[] = [sourcePos.clone()];
      const numInternal = 6;

      for (let step = 1; step <= numInternal; step++) {
        const u = step / (numInternal + 1);
        const envelope = Math.sin(u * Math.PI);
        const theta = baseAzimuth + u * Math.PI * 2 * spiralTurns;

        const loopWiggle =
          Math.sin(u * Math.PI * (2 + Math.floor(s1 * 3)) + s2 * 6) *
          0.42 *
          envelope;
        const r = (radialSpread + loopWiggle) * envelope;

        const x = Math.cos(theta) * r;
        const z = Math.sin(theta) * r * 0.85;
        const yBase = THREE.MathUtils.lerp(sourcePos.y, targetPos.y, u);
        const yLoop =
          radialSpread > 1.7
            ? Math.sin(u * Math.PI * 3 + s3 * 5) * 0.38 * envelope
            : 0;

        controlPoints.push(new THREE.Vector3(x, yBase + yLoop, z));
      }

      controlPoints.push(targetPos.clone());
      const curve = new THREE.CatmullRomCurve3(
        controlPoints,
        false,
        "catmullrom",
        0.5,
      );

      list.push({
        id: i,
        curve,
        isCyan: i % 2 === 0,
        radialSpread,
        phaseSpeed: 0.16 + radialSpread * 0.09 + s4 * 0.14,
        initialPhase: s1 * Math.PI * 2,
        midPoint: curve.getPoint(0.26 + (i % 5) * 0.11),
      });
    }
    return list;
  }, [sourcePos, targetPos]);

  // First half: Erupt all 36 wild trajectories across 3D space
  const eruptionProgress = interpolate(
    frame,
    [4, Math.round(halfFrame * 0.45)],
    [0.02, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    },
  );

  // Second half: Wave interference phase
  const isInterferencePhase = frame >= halfFrame;

  const centralBeamEnter = spring({
    frame: Math.max(0, frame - halfFrame),
    fps,
    config: { damping: 14, stiffness: 130 },
  });

  const centralLineCurve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        sourcePos.clone(),
        new THREE.Vector3(0, 0.15, 0),
        targetPos.clone(),
      ]),
    [sourcePos, targetPos],
  );

  const centralBeamGeo = useMemo(
    () => new THREE.TubeGeometry(centralLineCurve, 48, 0.11, 18, false),
    [centralLineCurve],
  );
  const centralHaloGeo = useMemo(
    () => new THREE.TubeGeometry(centralLineCurve, 48, 0.24, 18, false),
    [centralLineCurve],
  );

  const fullCurveGeometries = useMemo(() => {
    return trajectories.map((t) =>
      new THREE.TubeGeometry(t.curve, 52, 0.03, 8, false),
    );
  }, [trajectories]);

  const sourceLabelTex = useMemo(
    () =>
      createMinimalNodeLabelTexture(
        "PHOTON SOURCE A",
        "EMITTER [t = 0]",
        "#00F0FF",
      ),
    [],
  );
  const targetLabelTex = useMemo(
    () =>
      createMinimalNodeLabelTexture(
        "TARGET B",
        "DETECTOR [x_B, t_B]",
        "#F5D061",
      ),
    [],
  );

  const cyanColor = useMemo(() => new THREE.Color("#00F0FF"), []);
  const magentaColor = useMemo(() => new THREE.Color("#FF2A85"), []);
  const redCancelColor = useMemo(() => new THREE.Color("#FF2438"), []);

  const sparklesRotY = interpolate(frame, [0, durationInFrames], [0, 0.55]);
  const composerRef = useEffectComposerSync();

  return (
    <>
      <OrbitalCameraRig durationInFrames={durationInFrames} />
      <group position={[0, 0.15, 0]}>

      <ambientLight intensity={0.65} />
      <pointLight position={[0, -1.95, 1.5]} intensity={2.6} color="#00F0FF" />
      <pointLight position={[0, 2.25, 1.5]} intensity={2.6} color="#F5D061" />
      <pointLight
        position={[0, 0, 2.5]}
        intensity={isInterferencePhase ? 3.2 : 1.8}
        color={isInterferencePhase ? "#F5D061" : "#D946EF"}
      />

      {/* Ambient 3D Particle Field for Parallax Depth */}
      <group rotation={[0, sparklesRotY, 0]}>
        <Sparkles
          count={80}
          scale={[12, 12, 12]}
          size={3.2}
          speed={0}
          opacity={0.65}
          color={isInterferencePhase ? "#F5D061" : "#00F0FF"}
        />
      </group>

      {/* 36 WILD, LOOPING, SPIRALING 3D CATMULLROMCURVE3 NEON TRAJECTORIES */}
      {trajectories.map((traj, idx) => {
        const cancelStart =
          halfFrame + (1 - traj.radialSpread / 2.8) * (halfFrame * 0.28);
        const cancelEnd = cancelStart + halfFrame * 0.55;

        const cancelProgress = interpolate(
          frame,
          [cancelStart, cancelEnd],
          [0, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          },
        );

        const baseCol = traj.isCyan ? cyanColor : magentaColor;
        const activeColor = baseCol
          .clone()
          .lerp(redCancelColor, Math.min(1, cancelProgress * 1.45));

        const curveOpacity = interpolate(
          cancelProgress,
          [0, 0.62, 1],
          [0.82, 0.68, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          },
        );

        if (curveOpacity <= 0.01) return null;

        const packetU =
          ((frame * (0.02 + (idx % 5) * 0.004) + idx * 0.07) % 1) *
          eruptionProgress;
        const packetPos = traj.curve.getPoint(Math.min(0.99, packetU));

        return (
          <group key={traj.id}>
            <group
              position={[0, sourcePos.y, 0]}
              scale={[1, eruptionProgress, 1]}
            >
              <group position={[0, -sourcePos.y, 0]}>
                <mesh geometry={fullCurveGeometries[idx]}>
                  <meshStandardMaterial
                    color={activeColor}
                    emissive={activeColor}
                    emissiveIntensity={3}
                    toneMapped={false}
                    transparent
                    opacity={curveOpacity}
                    depthWrite={false}
                  />
                </mesh>
              </group>
            </group>

            {eruptionProgress > 0.25 && curveOpacity > 0.15 && (
              <mesh position={packetPos}>
                <sphereGeometry args={[0.068, 12, 12]} />
                <meshStandardMaterial
                  color="#FFFFFF"
                  emissive={activeColor}
                  emissiveIntensity={3}
                  toneMapped={false}
                  transparent
                  opacity={curveOpacity}
                />
              </mesh>
            )}

            {/* Second Half: Spinning Phase-Wave Rings Cancelling Out Outer Curves */}
            {isInterferencePhase && idx % 2 === 0 && (
              <PhaseWaveRing3D
                position={[
                  traj.midPoint.x,
                  traj.midPoint.y,
                  traj.midPoint.z + 0.25,
                ]}
                angle={
                  traj.initialPhase +
                  frame * traj.phaseSpeed * (idx % 4 === 0 ? 1 : -1)
                }
                color={cancelProgress > 0.2 ? "#FF2E4C" : "#00F0FF"}
                opacity={curveOpacity}
                scale={0.82}
              />
            )}
          </group>
        );
      })}

      {/* SINGLE BLAZING GOLDEN CENTER BEAM (SECOND HALF) */}
      {isInterferencePhase && (
        <group scale={[centralBeamEnter, 1, centralBeamEnter]}>
          <mesh geometry={centralBeamGeo}>
            <meshStandardMaterial
              color="#FFFDF2"
              emissive="#F5D061"
              emissiveIntensity={3}
              toneMapped={false}
            />
          </mesh>
          <mesh geometry={centralHaloGeo}>
            <meshStandardMaterial
              color="#F5D061"
              emissive="#F5D061"
              emissiveIntensity={3}
              toneMapped={false}
              transparent
              opacity={0.45 * centralBeamEnter}
              depthWrite={false}
            />
          </mesh>

          {[-1.1, -0.3, 0.5, 1.3].map((yPos, i) => (
            <PhaseWaveRing3D
              key={i}
              position={[0.78, yPos, 0.35]}
              angle={0}
              color="#F5D061"
              opacity={centralBeamEnter}
              scale={0.88}
            />
          ))}
        </group>
      )}

      {/* BOTTOM CYAN SPHERE ("PHOTON SOURCE A") */}
      <group position={sourcePos}>
        <mesh>
          <sphereGeometry args={[0.26, 32, 32]} />
          <meshStandardMaterial
            color="#FFFFFF"
            emissive="#00F0FF"
            emissiveIntensity={3}
            toneMapped={false}
          />
        </mesh>
        <mesh position={[0, -0.58, 0.45]}>
          <planeGeometry args={[2.7, 0.55]} />
          <meshBasicMaterial
            map={sourceLabelTex}
            transparent
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* TOP GOLDEN SPHERE ("TARGET B") */}
      <group position={targetPos}>
        <mesh>
          <sphereGeometry args={[0.26, 32, 32]} />
          <meshStandardMaterial
            color="#FFFFFF"
            emissive="#F5D061"
            emissiveIntensity={3}
            toneMapped={false}
          />
        </mesh>
        <mesh position={[0, 0.58, 0.45]}>
          <planeGeometry args={[2.7, 0.55]} />
          <meshBasicMaterial
            map={targetLabelTex}
            transparent
            depthWrite={false}
          />
        </mesh>
      </group>

        {/* Postprocessing Cinematic Bloom */}
        <EffectComposer ref={composerRef} multisampling={0}>
          <Bloom intensity={1.6} luminanceThreshold={0.15} mipmapBlur />
        </EffectComposer>
      </group>
    </>
  );
};

export const Scene4FeynmanPathIntegral3D: React.FC<{
  durationInFrames: number;
}> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  const halfFrame = Math.round(durationInFrames * 0.5);
  const isInterferencePhase = frame >= halfFrame;

  const headerEnter = spring({
    frame: isInterferencePhase ? frame - halfFrame : frame,
    fps,
    config: { damping: 16, stiffness: 150 },
  });

  const activePathCount = isInterferencePhase
    ? Math.max(
        1,
        Math.round(
          interpolate(
            frame,
            [halfFrame, Math.round(durationInFrames * 0.88)],
            [36, 1],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            },
          ),
        ),
      )
    : Math.round(
        interpolate(frame, [4, Math.round(halfFrame * 0.45)], [1, 36], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      );

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000", overflow: "hidden" }}>
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ fov: 50, position: [-4.4, 1.6, 12.8], near: 0.1, far: 100 }}
        style={{ width: "100%", height: "100%", backgroundColor: "#000000" }}
      >
        <color attach="background" args={["#000000"]} />
        <Feynman3DSceneContent durationInFrames={durationInFrames} />
      </ThreeCanvas>

      {/* Minimal, unobstructed floating top label (no bulky 2D HTML boxes) */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          paddingTop: 84,
          paddingLeft: 48,
          paddingRight: 48,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
        }}
      >
        <div
          style={{
            opacity: headerEnter,
            transform: `translateY(${interpolate(headerEnter, [0, 1], [-14, 0])}px)`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
          }}
        >
          <div
            style={{
              fontFamily: `'Montserrat', ${TheBoldFont}, sans-serif`,
              fontWeight: 900,
              fontSize: 28,
              color: isInterferencePhase ? "#F5D061" : "#00F0FF",
              textAlign: "center",
              letterSpacing: 1.4,
              textShadow: isInterferencePhase
                ? "0 2px 18px rgba(0, 0, 0, 0.95), 0 0 22px rgba(245, 208, 97, 0.55)"
                : "0 2px 18px rgba(0, 0, 0, 0.95), 0 0 22px rgba(0, 240, 255, 0.55)",
            }}
          >
            {isInterferencePhase
              ? "WAVE INTERFERENCE // ONLY FASTEST PATH SURVIVES"
              : "FEYNMAN PATH INTEGRAL // ALL PATHS AT ONCE"}
          </div>
          <div
            style={{
              fontFamily: `'JetBrains Mono', monospace`,
              fontWeight: 700,
              fontSize: 22,
              color: "#FFFFFF",
              letterSpacing: 1.4,
              textShadow: "0 2px 14px rgba(0, 0, 0, 0.95)",
            }}
          >
            {isInterferencePhase
              ? `∑ exp(iS/ℏ) → 0  ·  PATHS SURVIVING: ${activePathCount}`
              : `PATHS EXPLORED: ${activePathCount} / 36  ·  ψ = ∑ exp(iS/ℏ)`}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
