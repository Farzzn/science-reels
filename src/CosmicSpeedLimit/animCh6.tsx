import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, glow, INTER, MONO, svgGlow } from "../FiveHundredMileEmail/theme";
import { CleanPhotoPlate, MinimalLabel } from "./ui";

// ===========================================================================
// PURE ES2015 HELPERS (zero padStart / includes / Object.values)
// ===========================================================================
const clamp = (v: number, lo: number, hi: number): number =>
  Math.max(lo, Math.min(hi, v));

const normP = (frame: number, start: number, end: number): number =>
  clamp((frame - start) / Math.max(1, end - start), 0, 1);

const smoothstep = (u: number): number => {
  const c = clamp(u, 0, 1);
  return c * c * (3 - 2 * c);
};

function mulberry32(seed: number): () => number {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function lerpRgb(
  a: [number, number, number],
  b: [number, number, number],
  t: number
): string {
  const u = clamp(t, 0, 1);
  const r = Math.round(a[0] + (b[0] - a[0]) * u);
  const g = Math.round(a[1] + (b[1] - a[1]) * u);
  const bl = Math.round(a[2] + (b[2] - a[2]) * u);
  return `rgb(${r}, ${g}, ${bl})`;
}

// Smooth cosmological redshift ramp: starlight white -> amber orange -> deep crimson
function redshiftColor(p: number): string {
  const white: [number, number, number] = [238, 245, 255];
  const orange: [number, number, number] = [255, 174, 78];
  const crimson: [number, number, number] = [214, 38, 58];
  const deepRed: [number, number, number] = [104, 12, 24];
  if (p < 0.35) return lerpRgb(white, orange, p / 0.35);
  if (p < 0.72) return lerpRgb(orange, crimson, (p - 0.35) / 0.37);
  return lerpRgb(crimson, deepRed, (p - 0.72) / 0.28);
}

// Spectrum ramp for bottom redshift wave: crisp cyan-blue -> warm orange -> deep fading red
function waveRedshiftColor(p: number): string {
  const cyanBlue: [number, number, number] = [62, 224, 255];
  const warmGold: [number, number, number] = [255, 178, 72];
  const crimson: [number, number, number] = [255, 68, 86];
  const deepRed: [number, number, number] = [148, 22, 38];
  if (p < 0.42) return lerpRgb(cyanBlue, warmGold, p / 0.42);
  if (p < 0.78) return lerpRgb(warmGold, crimson, (p - 0.42) / 0.36);
  return lerpRgb(crimson, deepRed, (p - 0.78) / 0.22);
}

// ===========================================================================
// 1. CH 6A — 5% REACHABLE CORE VS 95% GONE FOREVER (SIDE-BY-SIDE -> MERGE!)
// ===========================================================================
interface VolumeGalaxy {
  x: number; // unit-sphere 3D coords in [-1, 1]
  y: number;
  z: number;
  rNorm: number; // radial distance in [0, 1] (1 = 46.5 B ly)
  size: number;
  tilt: number;
  inner: boolean;
}

const VOLUME_GALAXIES: VolumeGalaxy[] = (() => {
  const rand = mulberry32(6042);
  const innerCutoff = 16.5 / 46.5; // ~0.3548 -> ~4.5% volume (~5%)
  const list: VolumeGalaxy[] = [];
  for (let i = 0; i < 128; i++) {
    const u = rand();
    const rNorm = 0.08 + Math.cbrt(u) * 0.9;
    const cosTheta = 2 * rand() - 1;
    const sinTheta = Math.sqrt(Math.max(0, 1 - cosTheta * cosTheta));
    const phi = rand() * Math.PI * 2;
    list.push({
      x: rNorm * sinTheta * Math.cos(phi),
      y: rNorm * cosTheta,
      z: rNorm * sinTheta * Math.sin(phi),
      rNorm,
      size: 2.3 + rand() * 3.1,
      tilt: rand() * 180,
      inner: rNorm <= innerCutoff,
    });
  }
  return list;
})();

export const ReachableVolumeAnim: React.FC<{
  fiveAt: number;
  ninetyFiveAt: number;
  beamAt: number;
}> = ({ fiveAt, ninetyFiveAt, beamAt }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const totalDur = Math.max(240, durationInFrames);
  const tFive = Math.max(36, fiveAt);
  const tNinetyFive = Math.max(tFive + 45, ninetyFiveAt);
  const tBeam = Math.max(tNinetyFive + 45, beamAt);

  const centerX = 960;
  const centerY = 540;
  const rOuterBase = 426;
  const innerRatio = 16.5 / 46.5;

  const enterP = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 105 },
  });

  // 0 -> fiveAt: Spheres start side-by-side, hold briefly while rotating, then merge concentrically!
  const mergeStart = Math.round(tFive * 0.42);
  const mergeU = Easing.inOut(Easing.cubic)(normP(frame, mergeStart, tFive));
  const innerCx = interpolate(mergeU, [0, 1], [445, centerX]);
  const outerCx = interpolate(mergeU, [0, 1], [1235, centerX]);

  // Continuous monotonic 3D rotation & gentle cosmic expansion across ENTIRE scene (zero static frames!)
  const stageU = normP(frame, 0, totalDur);
  const rotY = stageU * 0.44; // ~25 deg smooth monotonic turn
  const cosR = Math.cos(rotY);
  const sinR = Math.sin(rotY);

  const rOuter = rOuterBase * (0.95 + 0.04 * enterP + 0.03 * stageU);
  const rInner = rOuter * innerRatio;

  // fiveAt -> ninetyFiveAt: Smooth radial cyan illumination of 5% core
  const fivePop = spring({
    frame: Math.max(0, frame - tFive),
    fps,
    config: { damping: 16, stiffness: 115 },
  });
  const coreFillSweep = Easing.out(Easing.cubic)(
    normP(frame, tFive, tFive + Math.min(72, tNinetyFive - tFive))
  );

  // ninetyFiveAt -> beamAt: Expanding crimson wave from inner sphere outward across 120 outer galaxies
  // + live bold percentage readout climbing 5% -> 95%!
  const ninetyFivePop = spring({
    frame: Math.max(0, frame - tNinetyFive),
    fps,
    config: { damping: 16, stiffness: 115 },
  });
  const waveSpan = Math.max(60, Math.min(180, tBeam - tNinetyFive - 12));
  const waveU = Easing.out(Easing.quad)(normP(frame, tNinetyFive, tNinetyFive + waveSpan));
  const waveRNorm = innerRatio + waveU * (1.06 - innerRatio); // sweeps 0.355 -> 1.06
  const liveGonePct = Math.round(5 + 90 * Easing.out(Easing.cubic)(waveU));

  // beamAt -> end: Blazing golden beam launches along +26 deg (clean unobstructed lower-right path!),
  // crosses 16.5 B ly boundary, stretches redder, and fades out short of receding outer galaxy!
  const beamSpan = Math.max(90, totalDur - tBeam - 10);
  const beamU = normP(frame, tBeam, tBeam + beamSpan);
  const beamEased = Easing.out(Easing.quad)(beamU);
  const beamAngle = (26 * Math.PI) / 180;
  const beamHeadR = beamEased * (rOuter * 0.72);
  const beamTailR = Math.max(0, beamHeadR - 155);

  const crossedCore = beamHeadR >= rInner;
  const crossRippleP = crossedCore ? clamp((beamHeadR - rInner) / 90, 0, 1) : 0;

  // Redshift progress once beam passes 16.5 B ly Event Horizon
  const beamRedP = crossedCore
    ? clamp((beamHeadR - rInner) / (rOuter * 0.36), 0, 1)
    : 0;
  const beamColor =
    beamHeadR <= rInner
      ? C.gold
      : lerpRgb([255, 194, 77], [255, 58, 78], beamRedP);

  const beamOpacity =
    frame < tBeam
      ? 0
      : interpolate(
          beamHeadR,
          [0, rInner * 0.75, rInner * 1.18, rOuter * 0.69],
          [0, 1, 0.94, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

  // Target distant galaxy receding monotonically outward along beam sightline
  const targetGalR = rOuter * (0.83 + 0.08 * beamEased);
  const targetGalX = centerX + targetGalR * Math.cos(beamAngle);
  const targetGalY = centerY + targetGalR * Math.sin(beamAngle);

  const beamHeadX = centerX + beamHeadR * Math.cos(beamAngle);
  const beamHeadY = centerY + beamHeadR * Math.sin(beamAngle);
  const beamTailX = centerX + beamTailR * Math.cos(beamAngle);
  const beamTailY = centerY + beamTailR * Math.sin(beamAngle);
  const crossPtX = centerX + rInner * Math.cos(beamAngle);
  const crossPtY = centerY + rInner * Math.sin(beamAngle);

  // Sinusoidal wave packet along beam tip — wavelength visibly stretches as it reddens!
  const wavePts: string[] = [];
  if (beamOpacity > 0.02 && beamHeadR > 18) {
    const segLen = Math.min(92, beamHeadR);
    const cycles = 5.4 - 2.6 * beamRedP; // stretches longer wavelength as it crosses horizon!
    const samples = 26;
    for (let i = 0; i <= samples; i++) {
      const u = i / samples;
      const dist = beamHeadR - u * segLen;
      const env = Math.sin(u * Math.PI);
      const perp =
        Math.sin(u * Math.PI * cycles - (frame - tBeam) * 0.32) * 8 * env;
      const wx =
        centerX + dist * Math.cos(beamAngle) - perp * Math.sin(beamAngle);
      const wy =
        centerY + dist * Math.sin(beamAngle) + perp * Math.cos(beamAngle);
      wavePts.push(`${i === 0 ? "M" : "L"} ${wx.toFixed(1)} ${wy.toFixed(1)}`);
    }
  }

  // Project and depth-sort all 128 volumetric 3D galaxies (tracking their own sphere during side-by-side!)
  const projected = VOLUME_GALAXIES.map((g) => {
    const rx = g.x * cosR + g.z * sinR;
    const rz = -g.x * sinR + g.z * cosR;
    const ry = g.y;
    const depth = (rz + 1) * 0.5;
    const driftBoost = g.inner ? 1 : 1 + 0.032 * stageU;
    const sphereCenterX = g.inner ? innerCx : outerCx;
    return {
      sx: sphereCenterX + rx * rOuter * driftBoost,
      sy: centerY + ry * rOuter * driftBoost,
      rz,
      rNorm: g.rNorm,
      depth,
      size: g.size * (0.68 + 0.52 * depth),
      tilt: g.tilt,
      inner: g.inner,
    };
  }).sort((a, b) => a.rz - b.rz);

  // Clean leader anchor points (upper-left for 5%, upper-right for 95% -> beam shoots lower-right, zero clash!)
  const coreAnchorX = centerX - rInner * 0.94;
  const coreAnchorY = centerY - rInner * 0.34;
  const outerAnchorX = centerX + rOuter * 0.88;
  const outerAnchorY = centerY - rOuter * 0.25;

  const sideBySideLabelAlpha = enterP * (1 - smoothstep(normP(frame, mergeStart, mergeStart + 28)));
  const neverArrivesDelay = tBeam + Math.round(beamSpan * 0.52);

  return (
    <AbsoluteFill>
      <svg
        viewBox="0 0 1920 1080"
        style={{ width: "100%", height: "100%", overflow: "hidden" }}
      >
        <defs>
          <radialGradient id="outerVolSphere6A" cx="38%" cy="32%" r="68%">
            <stop offset="0%" stopColor="#ff4d5e" stopOpacity="0.04" />
            <stop offset="56%" stopColor="#a8162a" stopOpacity="0.11" />
            <stop offset="88%" stopColor="#ff3b52" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#ff4d5e" stopOpacity="0.34" />
          </radialGradient>
          <radialGradient id="innerVolCore6A" cx="36%" cy="32%" r="68%">
            <stop offset="0%" stopColor="#b0f5ff" stopOpacity="0.45" />
            <stop offset="58%" stopColor={C.cyan} stopOpacity="0.26" />
            <stop offset="100%" stopColor={C.cyan} stopOpacity="0.54" />
          </radialGradient>
          <linearGradient
            id="beamGradOut6A"
            x1={beamTailX}
            y1={beamTailY}
            x2={beamHeadX}
            y2={beamHeadY}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor={beamColor} stopOpacity="0" />
            <stop offset="100%" stopColor={beamColor} stopOpacity="0.96" />
          </linearGradient>
        </defs>

        {/* Colossal 46.5 B ly Observable Universe 3D Sphere */}
        <g opacity={enterP}>
          <circle
            cx={outerCx}
            cy={centerY}
            r={rOuter}
            fill="url(#outerVolSphere6A)"
            stroke={C.red}
            strokeWidth={3.2}
            strokeOpacity={0.82}
            style={{ filter: svgGlow(C.red, 10) }}
          />
          <ellipse
            cx={outerCx}
            cy={centerY}
            rx={rOuter}
            ry={rOuter * 0.28}
            fill="none"
            stroke={C.red}
            strokeWidth={1.3}
            strokeDasharray="8 10"
            opacity={0.22}
          />
          <ellipse
            cx={outerCx}
            cy={centerY}
            rx={rOuter * 0.34}
            ry={rOuter}
            fill="none"
            stroke={C.red}
            strokeWidth={1.2}
            strokeDasharray="8 10"
            opacity={0.18}
          />
        </g>

        {/* Expanding crimson wave shell across outer 95% volume on ninetyFiveAt */}
        {frame >= tNinetyFive && waveU < 0.99 && (
          <circle
            cx={centerX}
            cy={centerY}
            r={Math.min(rOuter, waveRNorm * rOuter)}
            fill="none"
            stroke={C.red}
            strokeWidth={4.5}
            opacity={(1 - waveU) * 0.85}
            style={{ filter: svgGlow(C.red, 10) }}
          />
        )}

        {/* Back-half distant outer galaxies */}
        {projected
          .filter((p) => p.rz < 0 && !p.inner)
          .map((g, i) => {
            const waveHit =
              frame >= tNinetyFive
                ? clamp((waveRNorm - g.rNorm) / 0.14, 0, 1)
                : 0;
            const pulseBoost =
              frame >= tNinetyFive
                ? Math.exp(-Math.pow((waveRNorm - g.rNorm) / 0.065, 2))
                : 0;
            const col = lerpRgb([245, 226, 200], [255, 86, 104], waveHit * 0.92);
            const sz = g.size * (1 + 0.55 * pulseBoost);
            return (
              <g
                key={`b-${i}`}
                transform={`translate(${g.sx.toFixed(1)}, ${g.sy.toFixed(1)}) rotate(${g.tilt})`}
                opacity={enterP * (0.28 + 0.42 * g.depth + 0.25 * pulseBoost)}
              >
                <ellipse rx={sz * 1.5} ry={sz * 0.6} fill={col} />
              </g>
            );
          })}

        {/* Glowing Cyan 16.5 B ly Reachable Core Sphere (5% Volume!) */}
        <g opacity={enterP}>
          {/* Smooth radial cyan illumination fill sweeping outward on fiveAt */}
          <circle
            cx={innerCx}
            cy={centerY}
            r={Math.max(6, rInner * (0.3 + 0.7 * coreFillSweep))}
            fill="url(#innerVolCore6A)"
            opacity={0.28 + 0.72 * coreFillSweep}
          />
          <circle
            cx={innerCx}
            cy={centerY}
            r={rInner}
            fill="none"
            stroke={C.cyan}
            strokeWidth={3.8}
            style={{ filter: svgGlow(C.cyan, 11) }}
          />
          <ellipse
            cx={innerCx}
            cy={centerY}
            rx={rInner}
            ry={rInner * 0.28}
            fill="none"
            stroke={C.cyan}
            strokeWidth={1.3}
            opacity={0.45}
          />
          <ellipse
            cx={innerCx}
            cy={centerY}
            rx={rInner * 0.34}
            ry={rInner}
            fill="none"
            stroke={C.cyan}
            strokeWidth={1.2}
            opacity={0.36}
          />
        </g>

        {/* Inner reachable galaxies (bright cyan-white) */}
        {projected
          .filter((p) => p.inner)
          .map((g, i) => (
            <g
              key={`in-${i}`}
              transform={`translate(${g.sx.toFixed(1)}, ${g.sy.toFixed(1)}) rotate(${g.tilt})`}
              opacity={enterP * (0.65 + 0.35 * g.depth)}
            >
              <ellipse rx={g.size * 1.5} ry={g.size * 0.62} fill={C.cyan} opacity={0.78} />
              <circle r={g.size * 0.48} fill="#ffffff" />
            </g>
          ))}

        {/* Front-half distant outer galaxies pulsing crimson as wave sweeps outward */}
        {projected
          .filter((p) => p.rz >= 0 && !p.inner)
          .map((g, i) => {
            const waveHit =
              frame >= tNinetyFive
                ? clamp((waveRNorm - g.rNorm) / 0.14, 0, 1)
                : 0;
            const pulseBoost =
              frame >= tNinetyFive
                ? Math.exp(-Math.pow((waveRNorm - g.rNorm) / 0.065, 2))
                : 0;
            const col = lerpRgb([255, 224, 178], [255, 77, 94], waveHit * 0.94);
            const sz = g.size * (1 + 0.65 * pulseBoost);
            return (
              <g
                key={`f-${i}`}
                transform={`translate(${g.sx.toFixed(1)}, ${g.sy.toFixed(1)}) rotate(${g.tilt})`}
                opacity={enterP * clamp(0.46 + 0.48 * g.depth + 0.35 * pulseBoost, 0, 1)}
              >
                <ellipse rx={sz * 1.65} ry={sz * 0.64} fill={col} opacity={0.7} />
                <circle r={sz * 0.5} fill="#fff2f4" opacity={0.9} />
              </g>
            );
          })}

        {/* Side-by-side initial scale captions before spheres merge */}
        {sideBySideLabelAlpha > 0.01 && (
          <g opacity={sideBySideLabelAlpha}>
            <text
              x={innerCx}
              y={centerY + rInner + 48}
              textAnchor="middle"
              fill={C.cyan}
              fontFamily={MONO}
              fontWeight={700}
              fontSize={28}
              letterSpacing={1.5}
              style={{ filter: svgGlow(C.cyan, 6) }}
            >
              16.5 B ly
            </text>
            <text
              x={innerCx}
              y={centerY + rInner + 76}
              textAnchor="middle"
              fill={C.dim}
              fontFamily={INTER}
              fontWeight={700}
              fontSize={16}
              letterSpacing={2}
            >
              EVENT HORIZON
            </text>
            <text
              x={outerCx}
              y={centerY + rOuter + 44}
              textAnchor="middle"
              fill={C.red}
              fontFamily={MONO}
              fontWeight={700}
              fontSize={28}
              letterSpacing={1.5}
              style={{ filter: svgGlow(C.red, 6) }}
            >
              46.5 B ly
            </text>
          </g>
        )}

        {/* Highlighted Distant Outer Target Galaxy along lower-right outbound beam path */}
        {frame >= tBeam - 10 && (
          <g
            transform={`translate(${targetGalX.toFixed(1)}, ${targetGalY.toFixed(1)}) rotate(18)`}
            opacity={clamp((frame - (tBeam - 10)) / 24, 0, 1)}
          >
            <circle
              r={20}
              fill="none"
              stroke={C.red}
              strokeWidth={2}
              strokeDasharray="5 4"
              opacity={0.82}
            />
            <ellipse
              rx={13}
              ry={6}
              fill={C.red}
              style={{ filter: svgGlow(C.red, 6) }}
            />
            <circle r={3.8} fill="#ffffff" />
          </g>
        )}

        {/* Outbound Golden Light Beam firing from Earth -> stretches redder & fades short! */}
        {beamOpacity > 0.01 && (
          <g opacity={beamOpacity}>
            <line
              x1={beamTailX}
              y1={beamTailY}
              x2={beamHeadX}
              y2={beamHeadY}
              stroke="url(#beamGradOut6A)"
              strokeWidth={4.6}
              strokeLinecap="round"
              style={{ filter: svgGlow(beamColor, 8) }}
            />
            {wavePts.length > 1 && (
              <path
                d={wavePts.join(" ")}
                fill="none"
                stroke={beamColor}
                strokeWidth={2.9}
                strokeLinecap="round"
                style={{ filter: svgGlow(beamColor, 6) }}
              />
            )}
            <circle
              cx={beamHeadX}
              cy={beamHeadY}
              r={5.8}
              fill="#ffffff"
              style={{ filter: svgGlow(beamColor, 9) }}
            />
          </g>
        )}

        {/* Crossing ripple where beam exits 16.5 B ly Event Horizon */}
        {crossedCore && crossRippleP < 1 && (
          <circle
            cx={crossPtX}
            cy={crossPtY}
            r={8 + crossRippleP * 44}
            fill="none"
            stroke={C.cyan}
            strokeWidth={2.6}
            opacity={(1 - crossRippleP) * 0.88}
          />
        )}

        {/* Center Earth Beacon */}
        <circle
          cx={innerCx}
          cy={centerY}
          r={8.5}
          fill="#ffffff"
          stroke={C.cyan}
          strokeWidth={3}
          style={{ filter: svgGlow(C.cyan, 10) }}
        />

        {/* Clean pointer leader lines for 5% REACHABLE & 95% GONE FOREVER */}
        {fivePop > 0.02 && (
          <g opacity={fivePop}>
            <polyline
              points={`425,432 630,432 ${coreAnchorX.toFixed(1)},${coreAnchorY.toFixed(1)}`}
              fill="none"
              stroke={C.cyan}
              strokeWidth={2.2}
            />
            <circle cx={coreAnchorX} cy={coreAnchorY} r={5.5} fill={C.cyan} />
          </g>
        )}
        {ninetyFivePop > 0.02 && (
          <g opacity={ninetyFivePop}>
            <polyline
              points={`1475,432 1395,432 ${outerAnchorX.toFixed(1)},${outerAnchorY.toFixed(1)}`}
              fill="none"
              stroke={C.red}
              strokeWidth={2.2}
            />
            <circle cx={outerAnchorX} cy={outerAnchorY} r={5.5} fill={C.red} />
          </g>
        )}
      </svg>

      {/* Bold minimal volume readouts */}
      <MinimalLabel
        text="5% REACHABLE"
        sub="16.5 B ly CORE"
        color={C.cyan}
        x={82}
        y={398}
        align="left"
        size={36}
        delay={tFive}
      />
      <MinimalLabel
        text={`${liveGonePct}% GONE FOREVER`}
        sub="46.5 B ly SPHERE"
        color={C.red}
        x={1838}
        y={398}
        align="right"
        size={36}
        delay={tNinetyFive}
      />
      {frame >= neverArrivesDelay && (
        <MinimalLabel
          text="NEVER ARRIVES ✕"
          color={C.red}
          x={1838}
          y={758}
          align="right"
          size={34}
          delay={neverArrivesDelay}
        />
      )}
    </AbsoluteFill>
  );
};

// ===========================================================================
// 2. CH 6B — LONELY FUTURE SKY (HORIZON FADE, REDSHIFT WAVE, LOCAL GROUP, v<=c)
// ===========================================================================
interface OuterGalaxyDef {
  angle: number;
  baseR: number;
  rx: number;
  ry: number;
  tilt: number;
  stagger: number;
  speed: number;
  isSpiral: boolean;
}

const OUTER_FUTURE_GALAXIES: OuterGalaxyDef[] = (() => {
  const rand = mulberry32(6889);
  const out: OuterGalaxyDef[] = [];
  for (let i = 0; i < 48; i++) {
    const angle = (i / 48) * Math.PI * 2 + (rand() - 0.5) * 0.14;
    // Start inside/near the horizon ring (335..545px) so galaxies visibly cross rHorizon ~ 465px one by one!
    const baseR = 335 + rand() * 245;
    const distBias = clamp((baseR - 335) / 245, 0, 1);
    out.push({
      angle,
      baseR,
      rx: 4.5 + rand() * 6.5,
      ry: 1.8 + rand() * 2.4,
      tilt: rand() * 180,
      stagger: clamp(1 - distBias * 0.72 + (rand() - 0.5) * 0.22, 0, 1),
      speed: 195 + rand() * 210,
      isSpiral: rand() > 0.35,
    });
  }
  return out;
})();

interface LocalStarMote {
  angle: number;
  r0: number;
  size: number;
  driftSpeed: number;
  alpha: number;
}

const LOCAL_STAR_MOTES: LocalStarMote[] = (() => {
  const rand = mulberry32(6917);
  const out: LocalStarMote[] = [];
  for (let i = 0; i < 28; i++) {
    out.push({
      angle: rand() * Math.PI * 2,
      r0: 55 + rand() * 215,
      size: 1.2 + rand() * 2.0,
      driftSpeed: 0.015 + rand() * 0.025,
      alpha: 0.28 + rand() * 0.55,
    });
  }
  return out;
})();

export const LonelyFutureSkyAnim: React.FC<{
  fadeAt: number;
  stretchAt: number;
  localAt: number;
  finalLineAt: number;
}> = ({ fadeAt, stretchAt, localAt, finalLineAt }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const totalDur = Math.max(360, durationInFrames);
  const tFade = Math.max(16, fadeAt);
  const tStretch = Math.max(tFade + 45, stretchAt);
  const tLocal = Math.max(tStretch + 60, localAt);
  const tFinal = Math.max(tLocal + 60, finalLineAt);

  const cx = 960;
  const cy = 540;
  const rHorizonRing = 465;

  // Monotonic progression across every beat (ZERO static holds anywhere in 35s!)
  const preFadeU = normP(frame, 0, tFade);
  const fadeSpanFrames = Math.max(fps * 4.5, tLocal - tFade);
  const stretchU = normP(frame, tStretch, tLocal);
  const localU = normP(frame, tLocal, tFinal);
  const finalU = normP(frame, tFinal, totalDur);

  // Smooth continuous camera zoom on the central Milky Way + Andromeda galaxy!
  const camZoom =
    1.0 +
    0.04 * normP(frame, 0, tLocal) +
    0.15 * Easing.inOut(Easing.cubic)(localU) +
    0.05 * finalU;

  // Background plate dim darkens subtly on finalLineAt for monumental closing graphic
  const plateDim =
    frame < tLocal
      ? 0.34
      : frame < tFinal
        ? interpolate(localU, [0, 1], [0.34, 0.16])
        : interpolate(finalU, [0, 0.45, 1], [0.16, 0.68, 0.92], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

  // Faint horizon ring fades smoothly out as outer galaxies vanish by tLocal
  const horizonRingOpacity =
    0.42 *
    clamp(frame / 24, 0, 1) *
    (1 - smoothstep(normP(frame, tLocal - 45, tLocal + 15)));

  // Bottom cosmological redshift wave (stretchAt -> localAt):
  // Smoothly stretches monotonically from crisp cyan-blue -> orange -> deep fading red!
  const waveIn = clamp((frame - tStretch) / 24, 0, 1);
  const waveOut = 1 - normP(frame, tLocal - 24, tLocal + 12);
  const waveAlpha = frame >= tStretch && frame <= tLocal + 16 ? waveIn * waveOut : 0;
  const waveColor = waveRedshiftColor(stretchU);
  const wavePts: string[] = [];
  if (waveAlpha > 0.01) {
    const xStart = 430;
    const xSpan = 1060;
    const yBase = 922;
    const cycles = interpolate(stretchU, [0, 1], [11.5, 2.2]); // smooth monotonic wavelength stretch!
    const amp = interpolate(stretchU, [0, 0.72, 1], [32, 22, 11]);
    const phase = (frame - tStretch) * 0.085;
    const samples = 110;
    for (let i = 0; i <= samples; i++) {
      const u = i / samples;
      const env = Math.sin(u * Math.PI);
      const wx = xStart + u * xSpan;
      const wy = yBase + Math.sin(u * Math.PI * 2 * cycles - phase) * amp * env;
      wavePts.push(`${i === 0 ? "M" : "L"} ${wx.toFixed(1)} ${wy.toFixed(1)}`);
    }
  }

  // Local Milky Way + Andromeda label visibility (localAt -> finalLineAt)
  const localLabelAlpha =
    frame >= tLocal
      ? clamp((frame - tLocal) / 26, 0, 1) *
        (1 - normP(frame, tFinal - 16, tFinal + 8))
      : 0;

  // Final Line (10:47.7 -> 10:54.7):
  //   Part 1: Crisp glowing "v ≤ c ✓" fades cleanly in
  //   Part 2: Expanding faint coordinate grid lines stretch monotonically outward & recede into black!
  const vLimitIn = spring({
    frame: Math.max(0, frame - tFinal),
    fps,
    config: { damping: 16, stiffness: 105 },
  });
  const vLimitFadeOut = 1 - smoothstep(normP(frame, tFinal + Math.round((totalDur - tFinal) * 0.56), totalDur - 12));
  const vLimitAlpha = frame >= tFinal ? clamp(vLimitIn * 1.25, 0, 1) * vLimitFadeOut : 0;

  const gridExpandStart = tFinal + Math.round((totalDur - tFinal) * 0.24);
  const gridU = normP(frame, gridExpandStart, totalDur);
  const gridFadeEnv =
    clamp(gridU / 0.22, 0, 1) *
    (1 - smoothstep(clamp((gridU - 0.52) / 0.48, 0, 1)));
  const gridSpacing = 96 * (1 + 1.85 * Easing.in(Easing.quad)(gridU));

  return (
    <AbsoluteFill style={{ backgroundColor: "#030612", overflow: "hidden" }}>
      {/* Smoothly zooming photo plate + outer galaxies + central solitary halo */}
      <AbsoluteFill
        style={{
          transform: `scale(${camZoom.toFixed(4)})`,
          transformOrigin: "50% 50%",
        }}
      >
        <CleanPhotoPlate
          src="cosmiclimit/lonely-sky.jpg"
          kenBurnsFrom={1.0}
          kenBurnsTo={1.06}
          dim={plateDim}
        >
          <svg
            viewBox="0 0 1920 1080"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              overflow: "hidden",
            }}
          >
            <defs>
              <radialGradient id="obsidianEdgeVoid6B" cx="50%" cy="50%" r="62%">
                <stop offset="0%" stopColor="#030612" stopOpacity="0" />
                <stop offset="44%" stopColor="#030612" stopOpacity="0.14" />
                <stop offset="78%" stopColor="#02040c" stopOpacity="0.72" />
                <stop offset="100%" stopColor="#010308" stopOpacity="0.98" />
              </radialGradient>
              <radialGradient id="solitaryHalo6B" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#bce4ff" stopOpacity="0.22" />
                <stop offset="52%" stopColor="#5898ff" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#050a18" stopOpacity="0" />
              </radialGradient>
              <filter
                id="galSoftBlur6B"
                x="-140%"
                y="-140%"
                width="380%"
                height="380%"
              >
                <feGaussianBlur stdDeviation="2.6" />
              </filter>
              <filter
                id="galCoreBlur6B"
                x="-120%"
                y="-120%"
                width="340%"
                height="340%"
              >
                <feGaussianBlur stdDeviation="0.85" />
              </filter>
            </defs>

            {/* Quiet deepening obsidian void framing the lone galaxy on localAt */}
            <rect
              x={0}
              y={0}
              width={1920}
              height={1080}
              fill="url(#obsidianEdgeVoid6B)"
              opacity={0.34 + 0.56 * smoothstep(localU)}
            />

            {/* Faint circular Cosmic Event Horizon ring (0 -> localAt) */}
            {horizonRingOpacity > 0.01 && (
              <circle
                cx={cx}
                cy={cy}
                r={rHorizonRing}
                fill="none"
                stroke={C.red}
                strokeWidth={1.8}
                strokeDasharray="12 14"
                opacity={horizonRingOpacity}
                style={{ filter: svgGlow(C.red, 5) }}
              />
            )}

            {/* Delicate luminous halo + drifting local starlight around merged Milky Way–Andromeda */}
            {frame >= tLocal && (
              <g opacity={clamp((frame - tLocal) / 36, 0, 1) * (1 - finalU * 0.72)}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={225 + 68 * localU + 24 * finalU}
                  fill="url(#solitaryHalo6B)"
                  opacity={0.75}
                />
                {LOCAL_STAR_MOTES.map((m, idx) => {
                  const rNow = m.r0 * (1 + 0.08 * localU);
                  const ang = m.angle + localU * m.driftSpeed * 14;
                  const mx = cx + rNow * Math.cos(ang);
                  const my = cy + rNow * Math.sin(ang) * 0.72;
                  return (
                    <circle
                      key={idx}
                      cx={mx}
                      cy={my}
                      r={m.size}
                      fill="#e6f4ff"
                      opacity={m.alpha * 0.7}
                    />
                  );
                })}
              </g>
            )}

            {/* Photographic Gaussian-blurred outer galaxies drifting across horizon ring, redshifting & fading to 0 */}
            {OUTER_FUTURE_GALAXIES.map((g, idx) => {
              const startF = tFade + g.stagger * fadeSpanFrames * 0.42;
              const durF = fadeSpanFrames * 0.54;
              const gFade = clamp((frame - startF) / Math.max(1, durF), 0, 1);

              const alpha =
                frame < startF ? 0.82 : Math.pow(1 - gFade, 1.48) * 0.82;
              if (alpha <= 0.008) return null;

              const rNow =
                g.baseR + preFadeU * 48 + gFade * gFade * g.speed + gFade * 72;
              const gx = cx + rNow * Math.cos(g.angle);
              const gy = cy + rNow * Math.sin(g.angle);
              if (gx < -60 || gx > 1980 || gy < -60 || gy > 1140) return null;

              // Crossing horizon triggers soft crimson glint + accelerated redshift
              const crossFrac = clamp((rNow - (rHorizonRing - 35)) / 120, 0, 1);
              const crossGlint = Math.exp(-Math.pow((rNow - rHorizonRing) / 26, 2));
              const redShiftP = clamp(preFadeU * 0.1 + crossFrac * 0.45 + gFade * 0.55, 0, 1);
              const col = redshiftColor(redShiftP);
              const coreCol = lerpRgb([255, 255, 255], [220, 42, 60], redShiftP);
              const shrink = 1 - 0.28 * gFade;

              return (
                <g
                  key={idx}
                  transform={`translate(${gx.toFixed(1)}, ${gy.toFixed(1)}) rotate(${g.tilt}) scale(${shrink.toFixed(3)})`}
                  opacity={alpha * 0.88}
                >
                  {crossGlint > 0.15 && (
                    <circle
                      r={g.rx * 2.2}
                      fill="none"
                      stroke={C.red}
                      strokeWidth={1.3}
                      opacity={crossGlint * 0.55}
                    />
                  )}
                  <ellipse
                    rx={g.isSpiral ? g.rx * 1.45 : g.rx * 1.25}
                    ry={g.isSpiral ? g.ry * 1.1 : g.ry * 1.3}
                    fill={col}
                    opacity={0.44}
                    filter="url(#galSoftBlur6B)"
                  />
                  <ellipse
                    rx={g.rx * 0.62}
                    ry={g.ry * 0.68}
                    fill={col}
                    opacity={0.8}
                    filter="url(#galCoreBlur6B)"
                  />
                  <circle
                    r={Math.max(1.0, g.ry * 0.34)}
                    fill={coreCol}
                    opacity={0.94}
                  />
                </g>
              );
            })}
          </svg>
        </CleanPhotoPlate>
      </AbsoluteFill>

      {/* UN-ZOOMED CRISP FOREGROUND OVERLAY LAYER (Redshift Wave + Final v<=c + Expanding Grid) */}
      <svg
        viewBox="0 0 1920 1080"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        {/* Sleek minimal bottom cosmological redshift wave (stretchAt -> localAt) */}
        {waveAlpha > 0.01 && wavePts.length > 1 && (
          <g opacity={waveAlpha * (1 - 0.45 * stretchU)}>
            <path
              d={wavePts.join(" ")}
              fill="none"
              stroke={waveColor}
              strokeWidth={4}
              strokeLinecap="round"
              style={{ filter: svgGlow(waveColor, 9) }}
            />
            <text
              x={960}
              y={986}
              textAnchor="middle"
              fill={waveColor}
              fontFamily={MONO}
              fontWeight={700}
              fontSize={21}
              letterSpacing={3}
              opacity={0.88}
            >
              WAVELENGTH STRETCHING · REDSHIFT
            </text>
          </g>
        )}

        {/* Final Line (finalLineAt -> end): Faint expanding coordinate grid receding into black */}
        {gridFadeEnv > 0.005 && (
          <g opacity={gridFadeEnv * 0.42}>
            {[-9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(
              (k) => {
                const vx = cx + k * gridSpacing;
                const hy = cy + k * gridSpacing;
                return (
                  <g key={k}>
                    {vx >= -20 && vx <= 1940 && (
                      <line
                        x1={vx}
                        y1={0}
                        x2={vx}
                        y2={1080}
                        stroke={C.cyan}
                        strokeWidth={k === 0 ? 1.8 : 1.1}
                        opacity={k === 0 ? 0.55 : 0.3}
                      />
                    )}
                    {hy >= -20 && hy <= 1080 && (
                      <line
                        x1={0}
                        y1={hy}
                        x2={1920}
                        y2={hy}
                        stroke={C.cyan}
                        strokeWidth={k === 0 ? 1.8 : 1.1}
                        opacity={k === 0 ? 0.55 : 0.3}
                      />
                    )}
                  </g>
                );
              }
            )}
          </g>
        )}
      </svg>

      {/* Solitary Merged Local Galaxy Anchor Label (localAt -> finalLineAt) */}
      {localLabelAlpha > 0.01 && (
        <div style={{ opacity: localLabelAlpha }}>
          <MinimalLabel
            text="MILKY WAY + ANDROMEDA"
            sub="GRAVITATIONALLY BOUND"
            color={C.white}
            x={960}
            y={848}
            align="center"
            size={34}
            delay={tLocal}
          />
        </div>
      )}

      {/* Final Line Ultra-Minimal Glowing "v ≤ c ✓" dissolving into expanding space grid */}
      {vLimitAlpha > 0.01 && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "49%",
            transform: `translate(-50%, -50%) scale(${(0.92 + 0.08 * vLimitIn + 0.08 * finalU).toFixed(4)})`,
            opacity: vLimitAlpha,
            textAlign: "center",
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        >
          <div
            style={{
              fontFamily: MONO,
              fontWeight: 700,
              fontSize: 96,
              color: C.cyan,
              letterSpacing: 6,
              textShadow: `0 6px 28px rgba(5, 10, 24, 0.96), ${glow(C.cyan, 18)}`,
            }}
          >
            v ≤ c <span style={{ color: C.green, textShadow: glow(C.green, 16) }}>✓</span>
          </div>
          <div
            style={{
              fontFamily: INTER,
              fontWeight: 700,
              fontSize: 22,
              color: C.dim,
              letterSpacing: 5,
              marginTop: 14,
              textShadow: "0 4px 16px rgba(5, 10, 24, 0.96)",
            }}
          >
            EINSTEIN&apos;S SPEED LIMIT UNBROKEN
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ===========================================================================
// 3. CH 6C — CLEAN MINIMAL COSMIC SUBSCRIBE OUTRO (CONTINUOUS SUBTLE MOTION)
// ===========================================================================
export const CosmicSubscribeOutroAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const totalDur = Math.max(180, durationInFrames);
  const fullU = normP(frame, 0, totalDur);

  const enterP = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 105 },
  });
  const ctaP = spring({
    frame: Math.max(0, frame - 14),
    fps,
    config: { damping: 16, stiffness: 120 },
  });
  const cardP = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 18, stiffness: 105 },
  });

  // Smooth continuous Ken Burns zoom & gentle scale drifts across ENTIRE outro (zero loops, zero static!)
  const cardZoom = 1.0 + 0.12 * fullU;
  const subScaleDrift = 1.0 + 0.036 * fullU;
  const playScaleDrift = 1.0 + 0.08 * fullU;

  // One-shot light sheen sweep across the SUBSCRIBE pill
  const sheenX = interpolate(frame, [38, 94], [-180, 440], {
    easing: Easing.inOut(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Realistic one-shot damped bell chime starting around frame 36 (settles cleanly, zero loop!)
  const bellStart = 36;
  const bellDt = Math.max(0, (frame - bellStart) / fps);
  const bellSwing =
    frame >= bellStart
      ? Math.sin(bellDt * 15.5) * Math.exp(-bellDt * 1.1) * 20
      : 0;
  const bellActive = frame >= bellStart;
  const bellRing1 = normP(frame, bellStart, bellStart + 42);
  const bellRing2 = normP(frame, bellStart + 16, bellStart + 62);

  // Smooth monotonic border glow progression on WATCH NEXT frame
  const nextGlowP = 0.34 + 0.34 * fullU;

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 140px",
      }}
    >
      {/* LEFT SIDE: Vignetted JWST Deep-Field Card + SUBSCRIBE & Chime Bell */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          width: 680,
          opacity: enterP,
          transform: `translateY(${(1 - enterP) * 22}px)`,
        }}
      >
        <div
          style={{
            position: "relative",
            width: 680,
            height: 382,
            borderRadius: 24,
            overflow: "hidden",
            border: "1.5px solid rgba(62, 224, 255, 0.38)",
            boxShadow: `0 26px 64px rgba(0, 0, 0, 0.85), ${glow(C.cyan, 8)}`,
          }}
        >
          <Img
            src={staticFile("cosmiclimit/jwst-deepfield.jpg")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `scale(${cardZoom.toFixed(4)})`,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at 50% 48%, rgba(5,10,24,0.02) 42%, rgba(5,10,24,0.58) 82%, rgba(5,10,24,0.92) 100%)",
              pointerEvents: "none",
            }}
          />
        </div>

        {/* Crisp SUBSCRIBE Pill + Ringing Bell Icon */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 26,
            marginTop: 42,
            opacity: ctaP,
            transform: `translateY(${(1 - ctaP) * 16}px) scale(${subScaleDrift.toFixed(4)})`,
            transformOrigin: "left center",
          }}
        >
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              padding: "20px 56px",
              borderRadius: 999,
              background: "linear-gradient(135deg, #ff3352 0%, #d91c38 100%)",
              border: "2px solid rgba(255, 145, 160, 0.65)",
              boxShadow: `${glow("#ff2e4c", 14)}, 0 14px 36px rgba(0, 0, 0, 0.72)`,
              fontFamily: INTER,
              fontWeight: 900,
              fontSize: 30,
              color: "#ffffff",
              letterSpacing: 2.2,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -20,
                bottom: -20,
                left: sheenX,
                width: 72,
                background:
                  "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.34) 50%, rgba(255,255,255,0) 100%)",
                transform: "skewX(-22deg)",
                pointerEvents: "none",
              }}
            />
            SUBSCRIBE
          </div>

          <div
            style={{
              position: "relative",
              width: 76,
              height: 76,
              borderRadius: "50%",
              background: "rgba(10, 20, 46, 0.92)",
              border: `2px solid ${bellActive ? C.gold : "rgba(127, 147, 196, 0.45)"}`,
              boxShadow: bellActive ? glow(C.gold, 12) : "0 10px 26px rgba(0,0,0,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width={44}
              height={44}
              viewBox="0 0 44 44"
              style={{ overflow: "visible" }}
            >
              {bellActive && bellRing1 < 1 && (
                <circle
                  cx={22}
                  cy={22}
                  r={22 + bellRing1 * 24}
                  fill="none"
                  stroke={C.gold}
                  strokeWidth={2}
                  opacity={(1 - bellRing1) * 0.78}
                />
              )}
              {bellActive && bellRing2 > 0 && bellRing2 < 1 && (
                <circle
                  cx={22}
                  cy={22}
                  r={22 + bellRing2 * 34}
                  fill="none"
                  stroke={C.gold}
                  strokeWidth={1.6}
                  opacity={(1 - bellRing2) * 0.58}
                />
              )}
              <g
                transform={`translate(22, 10) rotate(${bellSwing.toFixed(2)}) translate(-22, -10)`}
              >
                <path
                  d="M 22 7 C 15.5 7 12 11.8 12 18.2 V 25.2 L 8.5 30 H 35.5 L 32 25.2 V 18.2 C 32 11.8 28.5 7 22 7 Z"
                  fill={bellActive ? "rgba(255, 194, 77, 0.22)" : "none"}
                  stroke={bellActive ? C.gold : C.white}
                  strokeWidth={2.6}
                  strokeLinejoin="round"
                />
                <path
                  d="M 18 33 C 19 36.2 25 36.2 26 33"
                  fill="none"
                  stroke={bellActive ? C.gold : C.white}
                  strokeWidth={2.6}
                  strokeLinecap="round"
                />
              </g>
            </svg>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Minimalist 720x405 YouTube End-Screen Safe Frame */}
      <div
        style={{
          position: "relative",
          width: 720,
          height: 405,
          borderRadius: 24,
          border: `2px dashed rgba(62, 224, 255, ${nextGlowP.toFixed(3)})`,
          background: "rgba(6, 14, 34, 0.44)",
          boxShadow: `0 22px 58px rgba(0, 0, 0, 0.72), inset 0 0 36px rgba(62, 224, 255, 0.06)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 18,
          opacity: cardP,
          transform: `translateY(${(1 - cardP) * 20}px)`,
        }}
      >
        <svg
          width={720}
          height={405}
          viewBox="0 0 720 405"
          style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        >
          <path
            d="M 24 44 V 24 H 44 M 676 24 H 696 V 44 M 24 361 V 381 H 44 M 676 381 H 696 V 361"
            fill="none"
            stroke={C.cyan}
            strokeWidth={2.4}
            strokeLinecap="round"
            opacity={0.72 + 0.2 * fullU}
          />
        </svg>

        <div
          style={{
            width: 68,
            height: 68,
            borderRadius: "50%",
            border: "2px solid rgba(62, 224, 255, 0.58)",
            background: "rgba(62, 224, 255, 0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: glow(C.cyan, 8),
            transform: `scale(${playScaleDrift.toFixed(4)})`,
          }}
        >
          <svg width={26} height={26} viewBox="0 0 26 26">
            <polygon points="7,4 22,13 7,22" fill={C.cyan} />
          </svg>
        </div>

        <div
          style={{
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 24,
            color: C.cyan,
            letterSpacing: 4,
            textShadow: glow(C.cyan, 8),
          }}
        >
          WATCH NEXT
        </div>
      </div>
    </AbsoluteFill>
  );
};
