import { ThreeCanvas } from "@remotion/three";
import React, { useLayoutEffect, useMemo } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { TheBoldFont } from "../load-font";

// Helper to create a crisp 3D CanvasTexture badge for in-scene 3D labels
function create3DBadgeTexture(
  title: string,
  subtitle: string,
  accentColor: string,
  bgColor = "rgba(6, 10, 18, 0.9)",
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 220;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Outer glow border
    const radius = 24;
    ctx.fillStyle = bgColor;
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 6;

    ctx.beginPath();
    ctx.roundRect(12, 12, canvas.width - 24, canvas.height - 24, radius);
    ctx.fill();
    ctx.stroke();

    // Left accent bar
    ctx.fillStyle = accentColor;
    ctx.beginPath();
    ctx.roundRect(28, 32, 14, canvas.height - 64, 6);
    ctx.fill();

    // Title text
    ctx.font = "900 44px 'Montserrat', 'Inter', sans-serif";
    ctx.fillStyle = "#FFFFFF";
    ctx.textBaseline = "middle";
    ctx.fillText(title, 64, subtitle ? 82 : 110);

    if (subtitle) {
      ctx.font = "700 34px 'JetBrains Mono', 'Fira Code', monospace";
      ctx.fillStyle = accentColor;
      ctx.fillText(subtitle, 64, 148);
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// Deterministic Camera Rig moving from [0, 8, 12] to [4, 6, 10]
const OrbitingIsometricCamera: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const camera = useThree((state) => state.camera);

  const camX = interpolate(frame, [0, durationInFrames], [0, 4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.sin),
  });
  const camY = interpolate(frame, [0, durationInFrames], [8, 6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.sin),
  });
  const camZ = interpolate(frame, [0, durationInFrames], [12, 10], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.sin),
  });

  useLayoutEffect(() => {
    camera.position.set(camX, camY, camZ);
    camera.lookAt(0, -0.4, 0.2);
    camera.updateProjectionMatrix();
  }, [camera, camX, camY, camZ]);

  return null;
};

// Partial tube geometry builder driven by progress (0..1)
function buildPartialTubeGeometry(
  points: THREE.Vector3[],
  progress: number,
  radius: number,
  tubularSegments = 64,
): THREE.TubeGeometry | null {
  const clamped = Math.max(0, Math.min(1, progress));
  if (clamped <= 0.01) return null;

  // Sample dense points along polyline according to arc length
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
      // Add intermediate point to keep corners sharp in CatmullRomCurve3
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
  const curve = new THREE.CatmullRomCurve3(sampled, false, "catmullrom", 0.08);
  return new THREE.TubeGeometry(curve, tubularSegments, radius, 14, false);
}

// Helper to get point along piecewise linear path at progress (0..1)
function getPointAlongPolyline(
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

const LifeguardSnell3DContent: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Coordinates required by prompt:
  // Point A: [-3, 0, -4] (in Sand, top half Z < 0)
  // Point B: [3, 0, 4]   (in Water, bottom half Z > 0)
  const pointA = useMemo(() => new THREE.Vector3(-3, 0.08, -4), []);
  const pointB = useMemo(() => new THREE.Vector3(3, 0.08, 4), []);

  // 1. Path A: Red straight line [-3, 0, -4] -> [0, 0, 0] -> [3, 0, 4]
  const pathAPoints = useMemo(
    () => [
      new THREE.Vector3(-3, 0.08, -4),
      new THREE.Vector3(0, 0.08, 0),
      new THREE.Vector3(3, 0.08, 4),
    ],
    [],
  );

  // 2. Path B: Gray L-shaped minimal swim [-3, 0, -4] -> [3, 0, 0] -> [3, 0, 4]
  const pathBPoints = useMemo(
    () => [
      new THREE.Vector3(-3, 0.1, -4),
      new THREE.Vector3(3, 0.1, 0),
      new THREE.Vector3(3, 0.1, 4),
    ],
    [],
  );

  // 3. Fermat Optimal Bent Path: [-3, 0, -4] -> [1.95, 0, 0] -> [3, 0, 4]
  const refractionPoint = useMemo(() => new THREE.Vector3(1.95, 0.14, 0), []);
  const pathFermatPoints = useMemo(
    () => [
      new THREE.Vector3(-3, 0.14, -4),
      refractionPoint,
      new THREE.Vector3(3, 0.14, 4),
    ],
    [refractionPoint],
  );

  // Timing windows inside Scene 2 (0:07 to 0:25 = 540 frames):
  // 0:07 to 0:18 = local frames 0 to 330 (Path comparison phase)
  // 0:18 to 0:25 = local frames 330 to 540 (Snell's Law laser refraction phase)
  const pathAProgress = interpolate(frame, [15, 95], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const pathBProgress = interpolate(frame, [95, 175], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const pathFermatProgress = interpolate(frame, [180, 265], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // In Snell's Law phase (frame >= 330), dim Path A & Path B so the golden laser refraction shines
  const nonOptimalOpacity = interpolate(frame, [320, 355], [0.85, 0.16], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Laser beam progress from 0:18 to 0:25 (frames 330 to 540)
  const laserShotProgress = interpolate(frame, [335, 430], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  const snellOverlayEnter = spring({
    frame: Math.max(0, frame - 330),
    fps,
    config: { damping: 16, stiffness: 140 },
  });

  const pathAGeo = useMemo(
    () => buildPartialTubeGeometry(pathAPoints, pathAProgress, 0.065),
    [pathAPoints, pathAProgress],
  );
  const pathBGeo = useMemo(
    () => buildPartialTubeGeometry(pathBPoints, pathBProgress, 0.065),
    [pathBPoints, pathBProgress],
  );
  const pathFermatGeo = useMemo(
    () => buildPartialTubeGeometry(pathFermatPoints, pathFermatProgress, 0.095),
    [pathFermatPoints, pathFermatProgress],
  );
  const laserBeamGeo = useMemo(
    () =>
      frame >= 330
        ? buildPartialTubeGeometry(pathFermatPoints, laserShotProgress, 0.15)
        : null,
    [frame, pathFermatPoints, laserShotProgress],
  );

  // Active photon / runner heads
  const runnerAPos = useMemo(
    () => getPointAlongPolyline(pathAPoints, pathAProgress),
    [pathAPoints, pathAProgress],
  );
  const runnerBPos = useMemo(
    () => getPointAlongPolyline(pathBPoints, pathBProgress),
    [pathBPoints, pathBProgress],
  );
  const runnerFermatPos = useMemo(
    () => getPointAlongPolyline(pathFermatPoints, pathFermatProgress),
    [pathFermatPoints, pathFermatProgress],
  );
  const laserHeadPos = useMemo(
    () => getPointAlongPolyline(pathFermatPoints, laserShotProgress),
    [pathFermatPoints, laserShotProgress],
  );

  // 3D Terrain & Point Badges
  const sandTexture = useMemo(
    () =>
      create3DBadgeTexture(
        "SAND // V1 = 8.0 m/s",
        "MEDIUM 1 (FAST RUN)",
        "#F5D061",
      ),
    [],
  );
  const waterTexture = useMemo(
    () =>
      create3DBadgeTexture(
        "WATER // V2 = 2.0 m/s",
        "MEDIUM 2 (REFRACTIVE VOLUME)",
        "#00F0FF",
      ),
    [],
  );
  const pointATexture = useMemo(
    () =>
      create3DBadgeTexture(
        "POINT A [-3, 0, -4]",
        "LIFEGUARD / EMITTER",
        "#F5D061",
      ),
    [],
  );
  const pointBTexture = useMemo(
    () =>
      create3DBadgeTexture(
        "POINT B [3, 0, 4]",
        "SWIMMER / TARGET",
        "#00F0FF",
      ),
    [],
  );

  // Animated water wave ripple rings
  const rippleScale = 1 + ((frame * 0.025) % 1.4);
  const rippleOpacity = interpolate((frame * 0.025) % 1.4, [0, 1.4], [0.7, 0]);

  return (
    <group scale={0.72} position={[-0.25, 0.15, 0]}>
      <OrbitingIsometricCamera durationInFrames={durationInFrames} />

      {/* Lighting */}
      <ambientLight intensity={0.75} />
      <directionalLight position={[6, 12, 8]} intensity={1.6} color="#FFFFFF" />
      <pointLight position={[-3, 2.5, -4]} intensity={2.2} color="#F5D061" />
      <pointLight position={[3, 2.5, 4]} intensity={2.2} color="#00F0FF" />
      <pointLight
        position={[1.95, 1.8, 0]}
        intensity={frame >= 330 ? 3.8 : 1.2}
        color="#F5D061"
      />

      {/* ============================================================
          TOP HALF (Z: -5.0 to 0): GOLDEN WIREFRAME GRID ("SAND // V1 = 8.0 m/s")
         ============================================================ */}
      <group position={[0, 0, -2.5]}>
        {/* Subtle dark golden base plate */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, 0]}>
          <planeGeometry args={[8.2, 5.0, 16, 10]} />
          <meshStandardMaterial
            color="#2A1F08"
            emissive="#8A6415"
            emissiveIntensity={0.35}
            roughness={0.7}
            metalness={0.2}
            transparent
            opacity={0.7}
          />
        </mesh>

        {/* Golden Wireframe Grid overlay */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[8.2, 5.0, 16, 10]} />
          <meshBasicMaterial
            color="#F5D061"
            wireframe
            transparent
            opacity={0.55}
          />
        </mesh>

        {/* 3D In-Scene Label for Sand tilted toward camera */}
        <mesh position={[-2.1, 0.38, 1.45]} rotation={[-0.65, 0, 0]}>
          <planeGeometry args={[3.4, 0.72]} />
          <meshBasicMaterial
            map={sandTexture}
            transparent
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* ============================================================
          BOTTOM HALF (Z: 0 to +5.0): TRANSLUCENT CYAN REFRACTIVE WATER VOLUME ("WATER // V2 = 2.0 m/s")
         ============================================================ */}
      <group position={[0, -0.22, 2.5]}>
        {/* 3D Translucent Refractive Water Volume Box */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[8.2, 0.44, 5.0]} />
          <meshPhysicalMaterial
            color="#0098B8"
            emissive="#004C66"
            emissiveIntensity={0.55}
            transmission={0.65}
            roughness={0.15}
            metalness={0.1}
            ior={1.333}
            transparent
            opacity={0.68}
          />
        </mesh>

        {/* Cyan surface wireframe grid on water top */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.225, 0]}>
          <planeGeometry args={[8.2, 5.0, 16, 10]} />
          <meshBasicMaterial
            color="#00F0FF"
            wireframe
            transparent
            opacity={0.38}
          />
        </mesh>

        {/* 3D In-Scene Label for Water tilted toward camera */}
        <mesh position={[-2.1, 0.56, -1.35]} rotation={[-0.65, 0, 0]}>
          <planeGeometry args={[3.4, 0.72]} />
          <meshBasicMaterial
            map={waterTexture}
            transparent
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* ============================================================
          SHORELINE / REFRACTION BOUNDARY LINE (Z = 0)
         ============================================================ */}
      <mesh position={[0, 0.03, 0]}>
        <boxGeometry args={[8.4, 0.05, 0.08]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>

      {/* ============================================================
          POINT A [-3, 0, -4] & POINT B [3, 0, 4] BEACONS
         ============================================================ */}
      {/* Point A Beacon */}
      <group position={pointA}>
        <mesh>
          <sphereGeometry args={[0.24, 32, 32]} />
          <meshBasicMaterial color="#F5D061" />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
          <ringGeometry args={[0.32, 0.44, 32]} />
          <meshBasicMaterial
            color="#F5D061"
            side={THREE.DoubleSide}
            transparent
            opacity={0.85}
          />
        </mesh>
        <mesh position={[1.1, 0.75, -0.5]} rotation={[-0.55, 0, 0]}>
          <planeGeometry args={[2.8, 0.6]} />
          <meshBasicMaterial
            map={pointATexture}
            transparent
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* Point B Beacon */}
      <group position={pointB}>
        <mesh>
          <sphereGeometry args={[0.24, 32, 32]} />
          <meshBasicMaterial color="#00F0FF" />
        </mesh>
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.05, 0]}
          scale={[rippleScale, rippleScale, 1]}
        >
          <ringGeometry args={[0.3, 0.4, 32]} />
          <meshBasicMaterial
            color="#00F0FF"
            side={THREE.DoubleSide}
            transparent
            opacity={rippleOpacity}
          />
        </mesh>
        <mesh position={[-1.2, 0.75, 0.5]} rotation={[-0.55, 0, 0]}>
          <planeGeometry args={[2.8, 0.6]} />
          <meshBasicMaterial
            map={pointBTexture}
            transparent
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* ============================================================
          3 GLOWING 3D PATH TUBES (0:07 to 0:18)
         ============================================================ */}
      {/* 1. Red Straight Path A */}
      {pathAGeo && (
        <mesh geometry={pathAGeo}>
          <meshStandardMaterial
            color="#FF3B30"
            emissive="#FF2A54"
            emissiveIntensity={1.6}
            transparent
            opacity={nonOptimalOpacity}
          />
        </mesh>
      )}
      {pathAProgress > 0.02 && pathAProgress < 0.99 && (
        <mesh position={runnerAPos}>
          <sphereGeometry args={[0.16, 24, 24]} />
          <meshBasicMaterial color="#FF5E57" />
        </mesh>
      )}

      {/* 2. Gray L-Shaped Path B */}
      {pathBGeo && (
        <mesh geometry={pathBGeo}>
          <meshStandardMaterial
            color="#94A3B8"
            emissive="#CBD5E1"
            emissiveIntensity={0.9}
            transparent
            opacity={nonOptimalOpacity}
          />
        </mesh>
      )}
      {pathBProgress > 0.02 && pathBProgress < 0.99 && (
        <mesh position={runnerBPos}>
          <sphereGeometry args={[0.16, 24, 24]} />
          <meshBasicMaterial color="#E2E8F0" />
        </mesh>
      )}

      {/* 3. Bright Golden Fermat Optimal Bent Path */}
      {pathFermatGeo && (
        <mesh geometry={pathFermatGeo}>
          <meshStandardMaterial
            color="#F5D061"
            emissive="#F5D061"
            emissiveIntensity={frame >= 330 ? 2.4 : 1.9}
            roughness={0.1}
          />
        </mesh>
      )}
      {pathFermatProgress > 0.02 && frame < 330 && (
        <mesh position={runnerFermatPos}>
          <sphereGeometry args={[0.2, 24, 24]} />
          <meshBasicMaterial color="#FFF3B0" />
        </mesh>
      )}

      {/* ============================================================
          0:18 to 0:25 (Frames 330 to 540):
          3D LASER BEAM REFRACTION + SURFACE NORMAL + THETA1 / THETA2 ARCS
         ============================================================ */}
      {frame >= 330 && (
        <group>
          {/* High-Intensity Laser Core Tube */}
          {laserBeamGeo && (
            <mesh geometry={laserBeamGeo}>
              <meshBasicMaterial color="#FFFDF0" />
            </mesh>
          )}

          {/* Traveling Laser Photon Head */}
          <group position={laserHeadPos}>
            <mesh>
              <sphereGeometry args={[0.26, 32, 32]} />
              <meshBasicMaterial color="#FFFFFF" />
            </mesh>
            <mesh>
              <sphereGeometry args={[0.45, 32, 32]} />
              <meshBasicMaterial
                color="#F5D061"
                transparent
                opacity={0.45}
              />
            </mesh>
          </group>

          {/* Refraction Boundary Point [1.95, 0, 0] Normal Line & Angle Rings */}
          <group position={refractionPoint} scale={snellOverlayEnter}>
            {/* Surface Normal Line (along Z axis from -2.6 to +2.6) */}
            {Array.from({ length: 13 }).map((_, idx) => {
              const zOffset = -2.4 + idx * 0.4;
              return (
                <mesh key={idx} position={[0, 0.05, zOffset]}>
                  <boxGeometry args={[0.05, 0.05, 0.22]} />
                  <meshBasicMaterial
                    color="#00F0FF"
                    transparent
                    opacity={0.85}
                  />
                </mesh>
              );
            })}

            {/* Incident Angle Arc (theta1 in Sand, Z < 0) */}
            <mesh
              rotation={[-Math.PI / 2, 0, Math.PI / 2]}
              position={[0, 0.06, 0]}
            >
              <ringGeometry args={[1.05, 1.18, 32, 1, 0, 0.89]} />
              <meshBasicMaterial
                color="#F5D061"
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* Refracted Angle Arc (theta2 in Water, Z > 0) */}
            <mesh
              rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
              position={[0, 0.06, 0]}
            >
              <ringGeometry args={[1.25, 1.38, 32, 1, 0, 0.26]} />
              <meshBasicMaterial
                color="#00F0FF"
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* Glowing Refraction Impact Ring */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.07, 0]}>
              <ringGeometry args={[0.22, 0.38, 32]} />
              <meshBasicMaterial color="#FFFFFF" side={THREE.DoubleSide} />
            </mesh>
          </group>
        </group>
      )}
    </group>
  );
};

export const Scene2SnellsLaw3D: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  const isSnellPhase = frame >= 330;

  // Card entrance animations for the 3 paths (0:07 to 0:18 = frames 0 to 330)
  const cardAEnter = spring({
    frame: Math.max(0, frame - 20),
    fps,
    config: { damping: 16, stiffness: 150 },
  });
  const cardBEnter = spring({
    frame: Math.max(0, frame - 100),
    fps,
    config: { damping: 16, stiffness: 150 },
  });
  const cardFermatEnter = spring({
    frame: Math.max(0, frame - 185),
    fps,
    config: { damping: 14, stiffness: 160 },
  });

  const snellHeaderEnter = spring({
    frame: Math.max(0, frame - 330),
    fps,
    config: { damping: 16, stiffness: 150 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000", overflow: "hidden" }}>
      {/* Full-Screen ThreeCanvas */}
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ fov: 54, position: [0, 8, 12], near: 0.1, far: 100 }}
        style={{ width: "100%", height: "100%", backgroundColor: "#000000" }}
      >
        <color attach="background" args={["#000000"]} />
        <LifeguardSnell3DContent durationInFrames={540} />
      </ThreeCanvas>

      {/* =================================================================
          CRISP 2D/3D TELEMETRY HUD OVERLAY LAYER
          - Phase 1 (0:07 to 0:18 / frames 0 to 330):
            Path A, Path B, and Fermat Optimal Path telemetry badges
          - Phase 2 (0:18 to 0:25 / frames 330 to 540):
            "SNELL'S LAW // n1 * sin(theta1) = n2 * sin(theta2)" header
         ================================================================= */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          paddingTop: 78,
          paddingLeft: 54,
          paddingRight: 54,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {!isSnellPhase ? (
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            {/* Terrain Speed Header Pill */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "rgba(8, 12, 22, 0.88)",
                border: "2px solid rgba(245, 208, 97, 0.45)",
                borderRadius: 16,
                padding: "14px 24px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.8)",
              }}
            >
              <span
                style={{
                  fontFamily: `'JetBrains Mono', monospace`,
                  fontWeight: 800,
                  fontSize: 24,
                  color: "#F5D061",
                  letterSpacing: 1,
                }}
              >
                SAND // V1 = 8.0 m/s
              </span>
              <span
                style={{
                  fontFamily: `'JetBrains Mono', monospace`,
                  fontWeight: 800,
                  fontSize: 22,
                  color: "#64748B",
                }}
              >
                VS
              </span>
              <span
                style={{
                  fontFamily: `'JetBrains Mono', monospace`,
                  fontWeight: 800,
                  fontSize: 24,
                  color: "#00F0FF",
                  letterSpacing: 1,
                }}
              >
                WATER // V2 = 2.0 m/s
              </span>
            </div>

            {/* 1. Red Straight Line Callout */}
            {frame >= 20 && (
              <div
                style={{
                  opacity: cardAEnter,
                  transform: `translateY(${interpolate(cardAEnter, [0, 1], [18, 0])}px)`,
                  backgroundColor: "rgba(24, 8, 12, 0.9)",
                  borderLeft: "8px solid #FF3B30",
                  border: "1px solid rgba(255, 59, 48, 0.5)",
                  borderLeftWidth: 8,
                  borderRadius: 14,
                  padding: "12px 20px",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.85)",
                }}
              >
                <div
                  style={{
                    fontFamily: `'Montserrat', ${TheBoldFont}, sans-serif`,
                    fontWeight: 900,
                    fontSize: 23,
                    color: "#FF6B6B",
                    letterSpacing: 0.6,
                  }}
                >
                  PATH A: SHORTEST DISTANCE // TIME: 14.2s (TOO MUCH SWIMMING)
                </div>
              </div>
            )}

            {/* 2. Gray L-Shaped Line Callout */}
            {frame >= 100 && (
              <div
                style={{
                  opacity: cardBEnter,
                  transform: `translateY(${interpolate(cardBEnter, [0, 1], [18, 0])}px)`,
                  backgroundColor: "rgba(15, 20, 28, 0.9)",
                  border: "1px solid rgba(148, 163, 184, 0.5)",
                  borderLeft: "8px solid #94A3B8",
                  borderRadius: 14,
                  padding: "12px 20px",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.85)",
                }}
              >
                <div
                  style={{
                    fontFamily: `'Montserrat', ${TheBoldFont}, sans-serif`,
                    fontWeight: 900,
                    fontSize: 23,
                    color: "#CBD5E1",
                    letterSpacing: 0.6,
                  }}
                >
                  PATH B: MINIMAL SWIM // TIME: 12.8s (TOO LONG)
                </div>
              </div>
            )}

            {/* 3. Bright Golden Optimal Bent Path Callout */}
            {frame >= 185 && (
              <div
                style={{
                  opacity: cardFermatEnter,
                  transform: `scale(${interpolate(cardFermatEnter, [0, 1], [0.92, 1])})`,
                  backgroundColor: "rgba(28, 22, 6, 0.94)",
                  border: "2px solid #F5D061",
                  borderLeft: "10px solid #F5D061",
                  borderRadius: 16,
                  padding: "14px 22px",
                  boxShadow:
                    "0 0 28px rgba(245, 208, 97, 0.35), 0 10px 26px rgba(0, 0, 0, 0.9)",
                }}
              >
                <div
                  style={{
                    fontFamily: `'Montserrat', ${TheBoldFont}, sans-serif`,
                    fontWeight: 900,
                    fontSize: 25,
                    color: "#F5D061",
                    letterSpacing: 0.8,
                  }}
                >
                  FERMAT OPTIMAL PATH // TIME: 9.4s (FASTEST)
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Phase 2 (0:18 to 0:25): Sleek Snell's Law HUD Header */
          <div
            style={{
              width: "100%",
              opacity: snellHeaderEnter,
              transform: `translateY(${interpolate(snellHeaderEnter, [0, 1], [-24, 0])}px)`,
              backgroundColor: "rgba(7, 12, 22, 0.92)",
              border: "2px solid #F5D061",
              borderRadius: 20,
              padding: "22px 28px",
              boxShadow:
                "0 0 38px rgba(245, 208, 97, 0.35), 0 14px 36px rgba(0, 0, 0, 0.9)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                fontFamily: `'JetBrains Mono', monospace`,
                fontWeight: 800,
                fontSize: 22,
                color: "#00F0FF",
                letterSpacing: 2.2,
              }}
            >
              OPTICAL REFRACTION AT BOUNDARY // FERMAT&apos;S PRINCIPLE
            </div>
            <div
              style={{
                fontFamily: `'Montserrat', ${TheBoldFont}, sans-serif`,
                fontWeight: 900,
                fontSize: 31,
                color: "#F5D061",
                textAlign: "center",
                letterSpacing: 0.8,
                textShadow: "0 0 20px rgba(245, 208, 97, 0.55)",
              }}
            >
              SNELL&apos;S LAW // n1 * sin(theta1) = n2 * sin(theta2)
            </div>
            <div
              style={{
                display: "flex",
                gap: 28,
                marginTop: 4,
              }}
            >
              <span
                style={{
                  fontFamily: `'JetBrains Mono', monospace`,
                  fontWeight: 700,
                  fontSize: 22,
                  color: "#F5D061",
                }}
              >
                SAND: θ1 = 51.1° (V1 = 8.0 m/s)
              </span>
              <span
                style={{
                  fontFamily: `'JetBrains Mono', monospace`,
                  fontWeight: 700,
                  fontSize: 22,
                  color: "#00F0FF",
                }}
              >
                WATER: θ2 = 14.7° (V2 = 2.0 m/s)
              </span>
            </div>
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
