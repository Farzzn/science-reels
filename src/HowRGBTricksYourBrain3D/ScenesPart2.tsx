import { PerspectiveCamera, RoundedBox } from "@react-three/drei";
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
import {
  AntiWashoutRig,
  BG_VOID_COLOR,
  BlueSubpixelMaterial,
  CrispHtmlLabel,
  DarkSiliconMaterial,
  GreenSubpixelMaterial,
  HardcodedSubtitle,
  MinimalTopTitle,
  RedSubpixelMaterial,
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
        script="So if there is zero yellow light coming out of your glass, why do you swear you're looking at yellow right now? Because engineers are hacking a glitch in your eyeballs."
        durationInFrames={240}
      />
    </AbsoluteFill>
  );
};

// ============================================================================
// SCENE 5 (Frames 1080 to 1380 / 10s): Full-Screen 3D Retinal Cone Wavelength Overlap
// Stacked vertically inside the portrait safe zone (X between -1.8 and +1.8):
// three 3D bell-curve wave ribbons representing human eye cone sensitivity:
// S-Cone (Blue, top), M-Cone (Green, middle), and L-Cone (Red, bottom).
// A vertical golden marker line ("REAL YELLOW: 580nm") sweeps across and
// intersects both the Red and Green curves simultaneously, with crisp
// <Html center> tags: "RED CONE: 85% ACTIVE" and "GREEN CONE: 85% ACTIVE".
// ============================================================================
const Scene5ConeOverlap3DContent: React.FC = () => {
  const frame = useCurrentFrame();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  const camX = Math.sin(frame * 0.01) * 0.35;
  useLayoutEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.position.set(camX, -0.35, 11.6);
      cameraRef.current.lookAt(0, -0.4, 0);
      cameraRef.current.updateProjectionMatrix();
      cameraRef.current.updateMatrixWorld();
    }
  }, [camX]);

  // Gaussian bell-curve helper
  const bellCurve = (x: number, peakX: number, sigma: number) =>
    Math.exp(-Math.pow(x - peakX, 2) / (2 * sigma * sigma));

  // Build 3D TubeGeometry for each cone sensitivity curve within X = [-1.7, +1.7]
  const { blueTube, greenTube, redTube } = useMemo(() => {
    const makeCurveGeo = (yBase: number, peakX: number, sigma: number) => {
      const pts: THREE.Vector3[] = [];
      const steps = 64;
      for (let i = 0; i <= steps; i++) {
        const x = -1.7 + (i / steps) * 3.4;
        const y = yBase + bellCurve(x, peakX, sigma) * 0.78;
        pts.push(new THREE.Vector3(x, y, 0.12));
      }
      const path = new THREE.CatmullRomCurve3(pts);
      return new THREE.TubeGeometry(path, 64, 0.055, 12, false);
    };

    return {
      // S-Cone (Blue, top): peak at x = -0.95 (440nm)
      blueTube: makeCurveGeo(1.15, -0.95, 0.42),
      // M-Cone (Green, middle): peak at x = +0.12 (535nm)
      greenTube: makeCurveGeo(-0.25, 0.12, 0.46),
      // L-Cone (Red, bottom): peak at x = +0.62 (575nm)
      redTube: makeCurveGeo(-1.65, 0.62, 0.46),
    };
  }, []);

  // Golden 580nm marker sweeps from left (-1.55) to the exact Red/Green 85% overlap point (x = +0.37)
  const sweepProgress = interpolate(frame, [20, 110], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });
  const markerX = interpolate(sweepProgress, [0, 1], [-1.55, 0.37]);

  const greenYAtMarker = -0.25 + bellCurve(markerX, 0.12, 0.46) * 0.78;
  const redYAtMarker = -1.65 + bellCurve(markerX, 0.62, 0.46) * 0.78;

  const greenPct = Math.round(bellCurve(markerX, 0.12, 0.46) * 100);
  const redPct = Math.round(bellCurve(markerX, 0.62, 0.46) * 100);

  return (
    <>
      <AntiWashoutRig fogDensity={0.04} sparklesColor="#4da6ff" />
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        fov={42}
        near={0.1}
        far={100}
        position={[camX, 0, 11.4]}
      />

      {/* 3 Dark Gunmetal #0d111a Spectral Graph Rails (90% Dark Contrast) */}
      {[
        { y: 1.15, label: "S-CONE (BLUE)" },
        { y: -0.25, label: "M-CONE (GREEN)" },
        { y: -1.65, label: "L-CONE (RED)" },
      ].map((rail, idx) => (
        <group key={idx} position={[0, rail.y, 0]}>
          {/* Dark Silicon Backing Plate */}
          <RoundedBox
            position={[0, 0.36, -0.12]}
            args={[3.65, 1.05, 0.14]}
            radius={0.05}
            smoothness={3}
          >
            <DarkSiliconMaterial />
          </RoundedBox>
          {/* Baseline Bar */}
          <mesh position={[0, 0, 0.02]}>
            <boxGeometry args={[3.5, 0.045, 0.08]} />
            <DarkSiliconMaterial />
          </mesh>
        </group>
      ))}

      {/* S-Cone (Blue, top) Bell Curve Ribbon */}
      <mesh geometry={blueTube}>
        <BlueSubpixelMaterial intensity={1.1} />
      </mesh>
      <CrispHtmlLabel
        position={[-0.65, 1.88, 0.2]}
        text="S-CONE (BLUE): 0% ACTIVE"
        color="#ffffff"
        subColor="#1a75ff"
        fontSize={21}
      />

      {/* M-Cone (Green, middle) Bell Curve Ribbon */}
      <mesh geometry={greenTube}>
        <GreenSubpixelMaterial intensity={1.1} />
      </mesh>
      <CrispHtmlLabel
        position={[-0.55, 0.72, 0.2]}
        text={
          sweepProgress > 0.85
            ? "GREEN CONE: 85% ACTIVE"
            : `GREEN CONE: ${greenPct}% ACTIVE`
        }
        color="#ffffff"
        subColor="#00ff66"
        fontSize={22}
      />

      {/* L-Cone (Red, bottom) Bell Curve Ribbon */}
      <mesh geometry={redTube}>
        <RedSubpixelMaterial intensity={1.1} />
      </mesh>
      <CrispHtmlLabel
        position={[-0.55, -0.68, 0.2]}
        text={
          sweepProgress > 0.85
            ? "RED CONE: 85% ACTIVE"
            : `RED CONE: ${redPct}% ACTIVE`
        }
        color="#ffffff"
        subColor="#ff2a2a"
        fontSize={22}
      />

      {/* Vertical Golden Marker Line ("REAL YELLOW: 580nm") */}
      <group position={[markerX, -0.2, 0.2]}>
        <mesh>
          <boxGeometry args={[0.045, 3.65, 0.045]} />
          <meshStandardMaterial
            color="#ffd500"
            emissive="#ffaa00"
            emissiveIntensity={1.1}
            toneMapped={false}
          />
        </mesh>

        {/* Intersection Node on M-Cone (Green) */}
        <mesh position={[0, greenYAtMarker + 0.2, 0.05]}>
          <sphereGeometry args={[0.11, 20, 20]} />
          <GreenSubpixelMaterial intensity={1.15} />
        </mesh>

        {/* Intersection Node on L-Cone (Red) */}
        <mesh position={[0, redYAtMarker + 0.2, 0.05]}>
          <sphereGeometry args={[0.11, 20, 20]} />
          <RedSubpixelMaterial intensity={1.15} />
        </mesh>

        <CrispHtmlLabel
          position={[0.35, 1.98, 0]}
          text="REAL YELLOW: 580nm"
          subtext="TRIGGERS BOTH RED & GREEN"
          color="#ffd500"
          subColor="#ffffff"
          fontSize={22}
        />
      </group>
    </>
  );
};

export const Scene5RetinalConeOverlap: React.FC = () => {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: BG_VOID_COLOR, overflow: "hidden" }}>
      <Audio src={staticFile("clip-5.mp4")} playbackRate={1} />
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ fov: 42, position: [0, 0, 11.4], near: 0.1, far: 100 }}
        style={{ width: "100%", height: "100%", backgroundColor: BG_VOID_COLOR }}
      >
        <Scene5ConeOverlap3DContent />
      </ThreeCanvas>

      <MinimalTopTitle
        title="RETINAL CONE OVERLAP"
        subtitle="HUMAN EYE SENSITIVITY (S · M · L CONES)"
        fontSize={56}
      />
      <HardcodedSubtitle
        script="At the back of your eye, you only have three types of color sensors: red, green, and blue cones. When a real yellow lemon reflects light, that single wavelength triggers both your red and green cones at once."
        durationInFrames={300}
      />
    </AbsoluteFill>
  );
};

// ============================================================================
// SCENE 6 (Frames 1380 to 1680 / 10s): Full-Screen 3D The RGB Fakeout
// At the bottom (y = -1.8), render the 3D Pixel Triad: Red Pillar ON (255),
// Green Pillar ON (255), Blue Pillar OFF (0, dark steel). Two clean 3D
// particle streams (one Red from x = -1.0, one Green from x = 0.0) travel
// upward and converge into a single cortical node at y = +1.8 labeled via
// <Html center>: "BRAIN PERCEPTION: YELLOW (#FFFF00)".
// ============================================================================
const Scene6RGBFakeout3DContent: React.FC = () => {
  const frame = useCurrentFrame();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  const camX = Math.sin(frame * 0.012) * 0.45;
  useLayoutEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.position.set(camX, -0.32, 11.8);
      cameraRef.current.lookAt(0, -0.38, 0);
      cameraRef.current.updateProjectionMatrix();
      cameraRef.current.updateMatrixWorld();
    }
  }, [camX]);

  // Bezier curves from Red (-1.0, -1.2) and Green (0.0, -1.2) converging into Cortical Node (-0.25, +1.65)
  const { redCurve, greenCurve, redGuideGeo, greenGuideGeo } = useMemo(() => {
    const rCurve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(-1.0, -1.15, 0),
      new THREE.Vector3(-1.0, 0.25, 0.25),
      new THREE.Vector3(-0.5, 0.95, 0.15),
      new THREE.Vector3(-0.2, 1.65, 0),
    );
    const gCurve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(0.0, -1.15, 0),
      new THREE.Vector3(0.0, 0.25, 0.25),
      new THREE.Vector3(-0.1, 0.95, 0.15),
      new THREE.Vector3(-0.2, 1.65, 0),
    );

    return {
      redCurve: rCurve,
      greenCurve: gCurve,
      redGuideGeo: new THREE.TubeGeometry(rCurve, 48, 0.022, 8, false),
      greenGuideGeo: new THREE.TubeGeometry(gCurve, 48, 0.022, 8, false),
    };
  }, []);

  const PARTICLE_COUNT = 18;

  return (
    <>
      <AntiWashoutRig fogDensity={0.04} sparklesColor="#00ff66" />
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        fov={42}
        near={0.1}
        far={100}
        position={[camX, 0.05, 11.4]}
      />

      {/* Bottom (y = -1.8): 3D Pixel Triad on Dark Silicon Chassis */}
      <group position={[0, -1.8, 0]}>
        <RoundedBox
          position={[0, -0.58, 0]}
          args={[3.3, 0.28, 1.4]}
          radius={0.05}
          smoothness={3}
        >
          <DarkSiliconMaterial />
        </RoundedBox>

        {/* Red Pillar ON (255) at x = -1.0 */}
        <group position={[-1.0, 0, 0]}>
          <RoundedBox args={[0.48, 0.95, 0.36]} radius={0.09} smoothness={4}>
            <RedSubpixelMaterial intensity={1.1} />
          </RoundedBox>
          <CrispHtmlLabel
            position={[0, -0.82, 0.2]}
            text="R: 255"
            subtext="ON (100%)"
            color="#ffffff"
            subColor="#ff2a2a"
            fontSize={22}
          />
        </group>

        {/* Green Pillar ON (255) at x = 0.0 */}
        <group position={[0.0, 0, 0]}>
          <RoundedBox args={[0.48, 0.95, 0.36]} radius={0.09} smoothness={4}>
            <GreenSubpixelMaterial intensity={1.1} />
          </RoundedBox>
          <CrispHtmlLabel
            position={[0, -0.82, 0.2]}
            text="G: 255"
            subtext="ON (100%)"
            color="#ffffff"
            subColor="#00ff66"
            fontSize={22}
          />
        </group>

        {/* Blue Pillar OFF (0, dark steel) at x = +1.0 */}
        <group position={[1.0, 0, 0]}>
          <RoundedBox args={[0.48, 0.95, 0.36]} radius={0.09} smoothness={4}>
            <DarkSiliconMaterial />
          </RoundedBox>
          <CrispHtmlLabel
            position={[0, -0.82, 0.2]}
            text="B: 0"
            subtext="OFF (DARK STEEL)"
            color="#8899b0"
            subColor="#55667a"
            fontSize={22}
          />
        </group>
      </group>

      {/* Dark Silicon Conduit Guide Rails + Flowing Red & Green Particle Streams */}
      <mesh geometry={redGuideGeo}>
        <DarkSiliconMaterial />
      </mesh>
      <mesh geometry={greenGuideGeo}>
        <DarkSiliconMaterial />
      </mesh>

      {Array.from({ length: PARTICLE_COUNT }).map((_, i) => {
        const tRed = ((frame * 0.016 + i / PARTICLE_COUNT) % 1 + 1) % 1;
        const tGreen =
          ((frame * 0.016 + (i + 0.5) / PARTICLE_COUNT) % 1 + 1) % 1;
        const rPos = redCurve.getPointAt(tRed);
        const gPos = greenCurve.getPointAt(tGreen);

        return (
          <React.Fragment key={i}>
            <mesh position={[rPos.x, rPos.y, rPos.z]}>
              <sphereGeometry args={[0.068, 14, 14]} />
              <RedSubpixelMaterial intensity={1.1} />
            </mesh>
            <mesh position={[gPos.x, gPos.y, gPos.z]}>
              <sphereGeometry args={[0.068, 14, 14]} />
              <GreenSubpixelMaterial intensity={1.1} />
            </mesh>
          </React.Fragment>
        );
      })}

      {/* Cortical Perception Node at y = +1.65 (within safe zone) */}
      <group position={[-0.2, 1.65, 0]}>
        {/* Outer Dark Gunmetal Cortical Ring */}
        <mesh rotation={[Math.PI / 2, 0, frame * 0.02]}>
          <torusGeometry args={[0.46, 0.055, 16, 48]} />
          <DarkSiliconMaterial />
        </mesh>
        {/* Perceived Yellow Cortical Sphere (capped emissiveIntensity = 1.0) */}
        <mesh>
          <sphereGeometry args={[0.32, 32, 32]} />
          <meshStandardMaterial
            color="#ffdd00"
            emissive="#ffaa00"
            emissiveIntensity={1.0}
            toneMapped={false}
          />
        </mesh>
        <CrispHtmlLabel
          position={[0.15, 0.72, 0]}
          text="BRAIN PERCEPTION: YELLOW (#FFFF00)"
          subtext="RED SIGNAL + GREEN SIGNAL CONVERGE"
          color="#ffffff"
          subColor="#ffd500"
          fontSize={23}
        />
      </group>
    </>
  );
};

export const Scene6RGBFakeout: React.FC = () => {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: BG_VOID_COLOR, overflow: "hidden" }}>
      <Audio src={staticFile("clip-6.mp4")} playbackRate={1} />
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ fov: 42, position: [0, 0.05, 11.4], near: 0.1, far: 100 }}
        style={{ width: "100%", height: "100%", backgroundColor: BG_VOID_COLOR }}
      >
        <Scene6RGBFakeout3DContent />
      </ThreeCanvas>

      <MinimalTopTitle
        title="THE RGB FAKEOUT"
        subtitle="RED (255) + GREEN (255) + BLUE (0)"
        fontSize={58}
      />
      <HardcodedSubtitle
        script="Your phone fakes this. It turns off the blue subpixel and fires pure red and pure green right next to each other. Your brain gets the exact same double signal and hallucinates the color yellow."
        durationInFrames={300}
      />
    </AbsoluteFill>
  );
};

// ============================================================================
// SCENE 7 (Frames 1680 to 1980 / 10s): Full-Screen 3D 8-Bit PWM Brightness Steps
// Render the 3 vertical RGB pillars acting as 3D sliding faders (heights
// smoothly animating between 0 and 255) driven by 3 golden FinFET transistor
// switches underneath them. Top clean HTML counter updates live:
// "R: 255 × G: 255 × B: 255 = 16,777,216 COLORS".
// ============================================================================
const usePWMChannelValues = (frame: number) => {
  const lockFull = interpolate(frame, [195, 250], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const rawR = Math.round(
    135 + 120 * Math.sin(frame * 0.055 + 0.4),
  );
  const rawG = Math.round(
    130 + 125 * Math.sin(frame * 0.07 - 1.1),
  );
  const rawB = Math.round(
    130 + 125 * Math.cos(frame * 0.06 + 0.8),
  );

  const rVal = Math.round(interpolate(lockFull, [0, 1], [rawR, 255]));
  const gVal = Math.round(interpolate(lockFull, [0, 1], [rawG, 255]));
  const bVal = Math.round(interpolate(lockFull, [0, 1], [rawB, 255]));

  return { rVal, gVal, bVal };
};

const Scene7PWMFaders3DContent: React.FC = () => {
  const frame = useCurrentFrame();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  const camX = Math.sin(frame * 0.012) * 0.65;
  useLayoutEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.position.set(camX, -0.25, 11.8);
      cameraRef.current.lookAt(0, -0.38, 0);
      cameraRef.current.updateProjectionMatrix();
      cameraRef.current.updateMatrixWorld();
    }
  }, [camX]);

  const { rVal, gVal, bVal } = usePWMChannelValues(frame);

  const channels = [
    { label: "R", val: rVal, x: -1.05, kind: "red" as const, hex: "#ff2a2a" },
    { label: "G", val: gVal, x: 0.0, kind: "green" as const, hex: "#00ff66" },
    { label: "B", val: bVal, x: 1.05, kind: "blue" as const, hex: "#1a75ff" },
  ];

  const maxBarHeight = 2.45;
  const baseBottomY = -1.15;

  return (
    <>
      <AntiWashoutRig fogDensity={0.04} sparklesColor="#4da6ff" />
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        fov={42}
        near={0.1}
        far={100}
        position={[camX, 0.15, 11.4]}
      />

      {/* Dark Silicon Base Platform */}
      <RoundedBox
        position={[0, -2.05, 0]}
        args={[3.6, 0.3, 1.8]}
        radius={0.05}
        smoothness={3}
      >
        <DarkSiliconMaterial />
      </RoundedBox>

      {channels.map((ch) => {
        const norm = Math.max(0.06, ch.val / 255);
        const h = norm * maxBarHeight;
        const barCenterY = baseBottomY + h / 2;

        return (
          <group key={ch.label} position={[ch.x, 0, 0]}>
            {/* Graduated Dark Gunmetal Fader Track Behind Pillar */}
            <RoundedBox
              position={[0, baseBottomY + maxBarHeight / 2, -0.18]}
              args={[0.64, maxBarHeight + 0.18, 0.14]}
              radius={0.04}
              smoothness={3}
            >
              <DarkSiliconMaterial />
            </RoundedBox>

            {/* 8-Bit Tick Marks along Dark Track */}
            {[0, 0.25, 0.5, 0.75, 1].map((tick, tIdx) => (
              <mesh
                key={tIdx}
                position={[0.35, baseBottomY + tick * maxBarHeight, -0.1]}
              >
                <boxGeometry args={[0.1, 0.025, 0.04]} />
                <DarkSiliconMaterial />
              </mesh>
            ))}

            {/* Animated RGB Sliding Fader Pillar */}
            <RoundedBox
              position={[0, barCenterY, 0]}
              args={[0.48, h, 0.36]}
              radius={0.08}
              smoothness={4}
            >
              {ch.kind === "red" && (
                <RedSubpixelMaterial intensity={0.35 + norm * 0.75} />
              )}
              {ch.kind === "green" && (
                <GreenSubpixelMaterial intensity={0.35 + norm * 0.75} />
              )}
              {ch.kind === "blue" && (
                <BlueSubpixelMaterial intensity={0.35 + norm * 0.75} />
              )}
            </RoundedBox>

            {/* Golden FinFET Transistor Switch Underneath Each Pillar */}
            <group position={[0, -1.62, 0]}>
              {/* 3 horizontal dark silicon nano-channels */}
              {[-0.08, 0, 0.08].map((ny, nIdx) => (
                <mesh
                  key={nIdx}
                  position={[0, ny, 0]}
                  rotation={[0, 0, Math.PI / 2]}
                >
                  <cylinderGeometry args={[0.025, 0.025, 0.62, 12]} />
                  <DarkSiliconMaterial />
                </mesh>
              ))}
              {/* Golden Transistor Gate Arch (capped emissiveIntensity <= 1.1) */}
              <RoundedBox args={[0.26, 0.34, 0.32]} radius={0.04} smoothness={3}>
                <meshStandardMaterial
                  color="#ffb84d"
                  emissive="#ff9900"
                  emissiveIntensity={0.4 + norm * 0.7}
                  toneMapped={false}
                />
              </RoundedBox>
            </group>

            {/* Crisp <Html center> Readout Above Fader */}
            <CrispHtmlLabel
              position={[0, baseBottomY + h + 0.38, 0.15]}
              text={`${ch.label}: ${ch.val}`}
              subtext="256 STEPS"
              color="#ffffff"
              subColor={ch.hex}
              fontSize={25}
            />
          </group>
        );
      })}

      <CrispHtmlLabel
        position={[0, -2.42, 0.2]}
        text="3× FINFET PWM TRANSISTOR GATES"
        color="#99b8ff"
        fontSize={21}
      />
    </>
  );
};

export const Scene7PWMBrightnessSteps: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const { rVal, gVal, bVal } = usePWMChannelValues(frame);
  const combinations = Math.max(1, rVal + 1) * Math.max(1, gVal + 1) * Math.max(1, bVal + 1);

  return (
    <AbsoluteFill style={{ backgroundColor: BG_VOID_COLOR, overflow: "hidden" }}>
      <Audio src={staticFile("clip-7.mp4")} playbackRate={1} />
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ fov: 42, position: [0, 0.15, 11.4], near: 0.1, far: 100 }}
        style={{ width: "100%", height: "100%", backgroundColor: BG_VOID_COLOR }}
      >
        <Scene7PWMFaders3DContent />
      </ThreeCanvas>

      <MinimalTopTitle
        title={`R: ${rVal} × G: ${gVal} × B: ${bVal}`}
        subtitle={`= ${combinations.toLocaleString("en-US")} COLORS`}
        fontSize={52}
        subColor="#ffd500"
      />
      <HardcodedSubtitle
        script="To unlock every other shade in reality, a transistor under each bulb dims its brightness across two hundred and fifty-six exact steps—giving a single pixel over sixteen million possible combinations."
        durationInFrames={300}
      />
    </AbsoluteFill>
  );
};
