import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, glow, INTER, MONO, svgGlow } from "../FiveHundredMileEmail/theme";
import { MinimalLabel } from "./ui";

// ===========================================================================
// SHARED PURE HELPERS (ES2015 safe — zero padStart / includes / Object.values)
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

// Clean stylized vector ant facing right; leg stride driven strictly by distance walked
const VectorAnt: React.FC<{
  x: number;
  y: number;
  color: string;
  scale?: number;
  stride?: number;
  opacity?: number;
}> = ({ x, y, color, scale = 1, stride = 0, opacity = 1 }) => {
  const s1 = Math.sin(stride) * 4.5;
  const s2 = Math.sin(stride + Math.PI) * 4.5;
  return (
    <g
      transform={`translate(${x}, ${y}) scale(${scale})`}
      opacity={opacity}
      style={{ filter: svgGlow(color, 5) }}
    >
      <g stroke={color} strokeWidth={2.4} strokeLinecap="round" fill="none">
        <path d={`M -8 3 L ${-14 + s1} 15 L ${-20 + s1} 20`} />
        <path d={`M -1 4 L ${-2 + s2} 16 L ${-4 + s2} 20`} />
        <path d={`M 6 3 L ${11 + s1} 15 L ${16 + s1} 20`} />
        <path d={`M -9 1 L ${-16 + s2} 13`} opacity={0.6} />
        <path d={`M 0 2 L ${2 + s1} 14`} opacity={0.6} />
        <path d={`M 7 1 L ${14 + s2} 13`} opacity={0.6} />
      </g>
      <ellipse cx={-15} cy={-2} rx={11} ry={7.5} fill={color} />
      <ellipse cx={0} cy={-1} rx={6.8} ry={5.2} fill={color} />
      <circle cx={12.5} cy={-3.5} r={5.4} fill={color} />
      <path
        d="M 16 -7 Q 22 -14 27 -13 M 17 -5 Q 24 -9 28 -6"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
      />
    </g>
  );
};

// Clean glowing Earth beacon
const EarthBeacon: React.FC<{
  cx: number;
  cy: number;
  r?: number;
  label?: boolean;
  labelOpacity?: number;
}> = ({ cx, cy, r = 18, label = true, labelOpacity = 1 }) => (
  <g transform={`translate(${cx}, ${cy})`}>
    <circle
      r={r * 2.15}
      fill="rgba(62, 224, 255, 0.14)"
      stroke="rgba(62, 224, 255, 0.28)"
      strokeWidth={1.2}
    />
    <circle
      r={r}
      fill="#1b79ff"
      stroke={C.cyan}
      strokeWidth={2.4}
      style={{ filter: svgGlow(C.cyan, 8) }}
    />
    <path
      d={`M ${-r * 0.45} ${-r * 0.3} Q ${-r * 0.1} ${-r * 0.55} ${r * 0.35} ${-r * 0.18} Q ${r * 0.12} ${r * 0.12} ${-r * 0.25} ${r * 0.2} Z`}
      fill="#3dffa0"
      opacity={0.78}
    />
    <circle cx={-r * 0.28} cy={-r * 0.28} r={r * 0.28} fill="#ffffff" opacity={0.35} />
    {label && (
      <text
        x={0}
        y={r + 30}
        textAnchor="middle"
        fill={C.cyan}
        fontFamily={MONO}
        fontWeight={700}
        fontSize={18}
        letterSpacing={2.2}
        opacity={labelOpacity}
      >
        EARTH
      </text>
    )}
  </g>
);

// Clean glowing spiral galaxy icon
const SpiralGalaxyIcon: React.FC<{
  cx: number;
  cy: number;
  r?: number;
  color?: string;
  coreColor?: string;
  rotation?: number;
  opacity?: number;
  dashedGhost?: boolean;
}> = ({
  cx,
  cy,
  r = 28,
  color = C.gold,
  coreColor = "#ffffff",
  rotation = -18,
  opacity = 1,
  dashedGhost = false,
}) => {
  const s = r / 28;
  return (
    <g transform={`translate(${cx}, ${cy}) rotate(${rotation}) scale(${s})`} opacity={opacity}>
      {dashedGhost ? (
        <>
          <ellipse
            rx={30}
            ry={14}
            fill="rgba(62, 224, 255, 0.06)"
            stroke={color}
            strokeWidth={2.2}
            strokeDasharray="6 5"
          />
          <circle r={5.5} fill="none" stroke={color} strokeWidth={2} strokeDasharray="3 3" />
        </>
      ) : (
        <>
          <ellipse rx={34} ry={16} fill={color} opacity={0.14} />
          <path
            d="M 0 0 C 8 -10, 22 -10, 28 -2 C 22 4, 10 2, 0 0"
            fill="none"
            stroke={color}
            strokeWidth={2.6}
            strokeLinecap="round"
            style={{ filter: svgGlow(color, 5) }}
          />
          <path
            d="M 0 0 C -8 10, -22 10, -28 2 C -22 -4, -10 -2, 0 0"
            fill="none"
            stroke={color}
            strokeWidth={2.6}
            strokeLinecap="round"
            style={{ filter: svgGlow(color, 5) }}
          />
          <path
            d="M 4 -2 C 14 -14, 30 -11, 33 1 M -4 2 C -14 14, -30 11, -33 -1"
            fill="none"
            stroke={color}
            strokeWidth={1.6}
            opacity={0.7}
            strokeLinecap="round"
          />
          <circle r={6.5} fill={coreColor} style={{ filter: svgGlow(color, 8) }} />
        </>
      )}
    </g>
  );
};

// Clean directional sinusoidal photon wave packet
const PhotonWavePacket: React.FC<{
  x: number;
  y: number;
  angleDeg: number;
  color: string;
  phase?: number;
  length?: number;
  amp?: number;
  opacity?: number;
}> = ({
  x,
  y,
  angleDeg,
  color,
  phase = 0,
  length = 66,
  amp = 9,
  opacity = 1,
}) => {
  const pts: string[] = [];
  const samples = 24;
  for (let i = 0; i <= samples; i++) {
    const u = i / samples;
    const px = -u * length;
    const env = Math.sin(u * Math.PI);
    const py = Math.sin(u * Math.PI * 5.2 - phase) * amp * env;
    pts.push(`${i === 0 ? "M" : "L"} ${px.toFixed(1)} ${py.toFixed(1)}`);
  }
  return (
    <g transform={`translate(${x}, ${y}) rotate(${angleDeg})`} opacity={opacity}>
      <path
        d={pts.join(" ")}
        fill="none"
        stroke={color}
        strokeWidth={3.2}
        strokeLinecap="round"
        style={{ filter: svgGlow(color, 7) }}
      />
      <polygon
        points="11,0 -3,-6.5 0,0 -3,6.5"
        fill={color}
        style={{ filter: svgGlow(color, 7) }}
      />
      <circle cx={2} cy={0} r={4.5} fill="#ffffff" />
    </g>
  );
};

// ===========================================================================
// 0. CH 4 INTRO — ANY DISTANCE? (GROWING HUBBLE SPHERE SWEEPING PAST GALAXIES)
// ===========================================================================
interface IntroGalaxySpec {
  distBly: number;
  angleDeg: number;
  label: string;
  color: string;
}

const INTRO_GALAXIES: IntroGalaxySpec[] = [
  { distBly: 15, angleDeg: -14, label: "15 B ly", color: "#9eeeff" },
  { distBly: 20, angleDeg: 4, label: "20 B ly", color: C.gold },
  { distBly: 30, angleDeg: 15, label: "30 B ly", color: "#ff9b70" },
];

export const AnyDistanceQuestionAnim: React.FC<{
  askAt: number;
}> = ({ askAt }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const totalDur = Math.max(150, durationInFrames);
  const fullU = normP(frame, 0, totalDur);
  const enterP = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 105 },
  });

  const earthX = 210;
  const earthY = 560;
  const pxPerBly = 43.5;

  // Monotonic expanding cyan Hubble Sphere sweeping from 12.2 B ly smoothly past 15, 20, toward 31.5 B ly
  const rHubbleBly = 12.2 + 19.6 * Easing.inOut(Easing.quad)(fullU);
  const rHubblePx = rHubbleBly * pxPerBly;

  // Speculative dashed frontier sweeping even farther outward
  const rSpeculativePx = (rHubbleBly + 3.2 + 4.5 * fullU) * pxPerBly;

  // Kinetic arc + "ANY DISTANCE?" headline growing smoothly across the scene from askAt
  const tAsk = Math.max(18, Math.min(askAt, totalDur - 45));
  const askPop = spring({
    frame: Math.max(0, frame - tAsk),
    fps,
    config: { damping: 14, stiffness: 115 },
  });
  const askAfterU = normP(frame, tAsk, totalDur);

  // Arc sweeping smoothly overhead from left to right across the full 10s span
  const arcDrawU = Easing.out(Easing.cubic)(normP(frame, 8, totalDur * 0.92));
  const arcLen = 1380;

  return (
    <AbsoluteFill>
      <svg
        viewBox="0 0 1920 1080"
        style={{ width: "100%", height: "100%", overflow: "hidden" }}
      >
        <defs>
          <radialGradient id="introHubbleFill" cx="0%" cy="50%" r="100%">
            <stop offset="0%" stopColor={C.cyan} stopOpacity="0.16" />
            <stop offset="78%" stopColor={C.cyan} stopOpacity="0.06" />
            <stop offset="100%" stopColor={C.cyan} stopOpacity="0.24" />
          </radialGradient>
          <linearGradient
            id="askArcGrad"
            gradientUnits="userSpaceOnUse"
            x1={310}
            y1={236}
            x2={1620}
            y2={236}
          >
            <stop offset="0%" stopColor={C.cyan} stopOpacity="0.25" />
            <stop offset="55%" stopColor={C.cyan} stopOpacity="0.95" />
            <stop offset="100%" stopColor={C.gold} stopOpacity="0.95" />
          </linearGradient>
        </defs>

        {/* Subtle trailing concentric growth wake behind Hubble Sphere */}
        {[0, 1, 2].map((idx) => {
          const rTrail = Math.max(80, rHubblePx - (idx + 1) * 115);
          return (
            <circle
              key={idx}
              cx={earthX}
              cy={earthY}
              r={rTrail}
              fill="none"
              stroke={C.cyan}
              strokeWidth={1.3}
              opacity={enterP * (0.14 - idx * 0.035)}
            />
          );
        })}

        {/* Speculative dashed "forever growing?" frontier */}
        <circle
          cx={earthX}
          cy={earthY}
          r={rSpeculativePx}
          fill="none"
          stroke={C.gold}
          strokeWidth={2.2}
          strokeDasharray="14 14"
          opacity={enterP * (0.28 + 0.35 * askPop)}
        />

        {/* Growing Cyan Hubble Sphere */}
        <circle
          cx={earthX}
          cy={earthY}
          r={rHubblePx}
          fill="url(#introHubbleFill)"
          stroke={C.cyan}
          strokeWidth={4}
          opacity={enterP}
          style={{ filter: svgGlow(C.cyan, 10) }}
        />

        {/* Crisp overhead kinetic sweep arc framing ANY DISTANCE? cleanly beneath headline */}
        <path
          d="M 310 308 Q 960 174 1620 284"
          fill="none"
          stroke="url(#askArcGrad)"
          strokeWidth={3.2}
          strokeLinecap="round"
          strokeDasharray={arcLen}
          strokeDashoffset={arcLen * (1 - arcDrawU)}
          opacity={0.78}
          style={{ filter: svgGlow(C.cyan, 6) }}
        />

        {/* Three target galaxies at 15, 20, 30 B ly + faint golden photons trying to reach Earth */}
        {INTRO_GALAXIES.map((g, idx) => {
          const angRad = (g.angleDeg * Math.PI) / 180;
          const cosA = Math.cos(angRad);
          const sinA = Math.sin(angRad);
          const galDistNow = g.distBly + fullU * (1.2 + idx * 0.65);
          const gx = earthX + galDistNow * pxPerBly * cosA;
          const gy = earthY + galDistNow * pxPerBly * sinA;

          const overtaken = rHubbleBly >= g.distBly;
          const overtakeDelta = Math.max(0, rHubbleBly - g.distBly);
          const rescueRippleP = clamp(overtakeDelta / 3.6, 0, 1);

          // Photon starts at galaxy, briefly drifts right while outside Hubble Sphere,
          // then turns and swims left toward Earth once swept up!
          const swimIn = overtaken ? Math.min(g.distBly - 2.5, overtakeDelta * 0.72) : 0;
          const dragOut = overtaken ? 0.55 : Math.min(0.55, fullU * (0.9 + idx * 0.3));
          const photonDist = Math.max(2.2, g.distBly + dragOut - swimIn);
          const px = earthX + photonDist * pxPerBly * cosA;
          const py = earthY + photonDist * pxPerBly * sinA;

          const originX = earthX + g.distBly * pxPerBly * cosA;
          const originY = earthY + g.distBly * pxPerBly * sinA;

          return (
            <g key={idx} opacity={enterP}>
              {/* Radial sightline */}
              <line
                x1={earthX}
                y1={earthY}
                x2={gx}
                y2={gy}
                stroke={overtaken ? "rgba(62, 224, 255, 0.22)" : "rgba(255, 194, 77, 0.16)"}
                strokeWidth={1.6}
                strokeDasharray="6 8"
              />

              {/* Overtake ripple when Hubble Sphere sweeps past galaxy */}
              {overtaken && rescueRippleP < 1 && (
                <circle
                  cx={originX}
                  cy={originY}
                  r={16 + rescueRippleP * 58}
                  fill="none"
                  stroke={C.cyan}
                  strokeWidth={2.8}
                  opacity={(1 - rescueRippleP) * 0.85}
                />
              )}

              {/* Faint golden photon swimming toward Earth */}
              <PhotonWavePacket
                x={px}
                y={py}
                angleDeg={180 + g.angleDeg}
                color={overtaken ? C.gold : "#ffaa5c"}
                phase={frame * 0.28 + idx * 1.4}
                length={overtaken ? 64 : 50}
                amp={overtaken ? 8.5 : 6.5}
                opacity={overtaken ? 0.94 : 0.62}
              />

              {/* Galaxy body */}
              <SpiralGalaxyIcon
                cx={gx}
                cy={gy}
                r={24}
                color={overtaken ? C.cyan : g.color}
                rotation={-18 + idx * 15 + fullU * 14}
                opacity={0.95}
              />

              {/* Crisp distance tag */}
              <text
                x={gx}
                y={gy + (idx === 0 ? -38 : 48)}
                textAnchor="middle"
                fill={overtaken ? C.cyan : g.color}
                fontFamily={MONO}
                fontWeight={700}
                fontSize={22}
                letterSpacing={1}
                style={{ filter: svgGlow(overtaken ? C.cyan : g.color, 4) }}
              >
                {g.label}
              </text>
            </g>
          );
        })}

        {/* Bottom subtle distance ruler */}
        <line
          x1={earthX}
          y1={985}
          x2={1760}
          y2={985}
          stroke="rgba(127, 147, 196, 0.28)"
          strokeWidth={1.5}
        />
        {[
          { d: 0, lbl: "0" },
          { d: 15, lbl: "15" },
          { d: 20, lbl: "20" },
          { d: 30, lbl: "30 B ly" },
        ].map((m, i) => {
          const mx = earthX + m.d * pxPerBly;
          const active = rHubbleBly >= m.d;
          return (
            <g key={i} transform={`translate(${mx}, 985)`}>
              <line
                y1={-7}
                y2={7}
                stroke={active ? C.cyan : C.dim}
                strokeWidth={2}
              />
              <text
                x={0}
                y={30}
                textAnchor="middle"
                fill={active ? C.cyan : C.dim}
                fontFamily={MONO}
                fontWeight={700}
                fontSize={18}
              >
                {m.lbl}
              </text>
            </g>
          );
        })}

        {/* Earth beacon */}
        <EarthBeacon cx={earthX} cy={earthY} r={22} />
      </svg>

      {/* Live growing Hubble Sphere readout top-left */}
      <MinimalLabel
        text={`${rHubbleBly.toFixed(1)} B ly`}
        sub="HUBBLE SPHERE GROWING"
        color={C.cyan}
        x={120}
        y={82}
        align="left"
        size={34}
        delay={0}
      />

      {/* Crisp kinetic "ANY DISTANCE?" punch growing smoothly across the scene */}
      {frame >= tAsk - 2 && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 74,
            transform: `translate(-50%, ${(1 - askPop) * 20}px) scale(${(0.88 + 0.12 * askPop + 0.06 * askAfterU).toFixed(4)})`,
            opacity: clamp(askPop * 1.25, 0, 1),
            textAlign: "center",
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        >
          <div
            style={{
              fontFamily: INTER,
              fontWeight: 900,
              fontSize: 72,
              letterSpacing: 3,
              color: C.gold,
              textShadow: `0 6px 26px rgba(5, 10, 24, 0.96), ${glow(C.gold, 14)}`,
            }}
          >
            ANY DISTANCE?
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ===========================================================================
// 1. CH 4A — STEADY VS EXPONENTIAL RUBBER BAND RACE (PER-BEAT CONTINUOUS)
// ===========================================================================
export const SteadyVsExponentialBandAnim: React.FC<{
  steadyAt: number;
  tenXAt: number;
  expAt: number;
  explodeAt: number;
  trappedAt: number;
}> = ({ steadyAt, tenXAt, expAt, explodeAt, trappedAt }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const totalDur = Math.max(300, durationInFrames);

  // Enforce strictly monotonic internal milestones while honoring exact passed props
  const tSteady = Math.max(20, steadyAt);
  const tTenX = Math.max(tSteady + 30, tenXAt);
  const tExp = Math.max(tTenX + 45, expAt);
  const tExplode = Math.max(tExp + 45, explodeAt);
  const tTrapped = Math.max(tExplode + 30, trappedAt);

  const leftX = 165;
  const baseLen = 400;
  const topY = 338;
  const botY = 788;

  // --- 0 -> steadyAt: Top band draws smoothly in, ant steps on ---
  const bandDrawP = Easing.out(Easing.cubic)(normP(frame, 0, Math.min(tSteady * 0.72, 55)));
  const preWaitU = normP(frame, 0, tSteady);

  // --- TOP BAND: STEADY LINEAR STRETCH ---
  // Smooth continuous progress across:
  //   0 -> steadyAt: 0% -> 4% (ant steps onto track & leans in)
  //   steadyAt -> tenXAt: 4% -> 40%
  //   tenXAt -> (expAt - 22): 40% -> 100% (reaches finish flag right before expAt!)
  const topFinishFrame = Math.max(tTenX + 30, tExp - 22);
  const uSteadyToTenX = normP(frame, tSteady, tTenX);
  const uTenXToFinish = normP(frame, tTenX, topFinishFrame);
  const uPostTop = normP(frame, topFinishFrame, totalDur);

  // Monotonic linear rubber band factor: 1.0 -> 3.68 (topEndX: 565 -> 1637, cleanly inside 1920!)
  const linearFactor =
    frame < tSteady
      ? 0.92 + 0.08 * preWaitU
      : frame < tTenX
        ? 1.0 + 1.05 * uSteadyToTenX
        : frame < topFinishFrame
          ? 2.05 + 1.53 * uTenXToFinish
          : 3.58 + 0.14 * uPostTop;

  const topLen = baseLen * linearFactor * bandDrawP;
  const topEndX = leftX + topLen;

  // Monotonic ant fraction: 0 -> 0.04 -> 0.40 -> 1.00
  const fTop =
    frame < tSteady
      ? 0.04 * preWaitU
      : frame < tTenX
        ? 0.04 + 0.36 * Math.pow(uSteadyToTenX, 0.92)
        : 0.4 + 0.6 * Math.pow(uTenXToFinish, 0.86);

  const topAntX = leftX + fTop * topLen;
  const topReached = frame >= topFinishFrame;

  const tenXPop = spring({
    frame: Math.max(0, frame - tTenX),
    fps,
    config: { damping: 15, stiffness: 130 },
  });
  const reachPop = spring({
    frame: Math.max(0, frame - topFinishFrame),
    fps,
    config: { damping: 14, stiffness: 135 },
  });
  const reachRingR = interpolate(reachPop, [0, 1], [16, 74]);
  const reachRingO = interpolate(reachPop, [0, 0.7, 1], [0.88, 0.35, 0]);

  // Subtle top lane dim once focus moves strongly to bottom exponential track
  const topDimFactor = interpolate(normP(frame, tExp, tExp + 30), [0, 1], [1, 0.62]);

  // --- BOTTOM BAND: EXPONENTIAL STRETCH ---
  //   0 -> expAt: subtle dormant outline priming
  //   expAt -> explodeAt: ignites crimson, doubles cleanly (1x -> 2x -> 4x), ant walks 0% -> 21%
  //   explodeAt -> trappedAt: new crimson rubber explodes ahead of ant, progress stalls ~28.0%
  //   trappedAt -> end: crimson cutoff barrier slams down ("TRAPPED FOREVER ✕") + flag blasts off-screen!
  const botIgniteP = spring({
    frame: Math.max(0, frame - tExp),
    fps,
    config: { damping: 16, stiffness: 120 },
  });
  const uExpToExplode = normP(frame, tExp, tExplode);
  const uExplodeToTrapped = normP(frame, tExplode, tTrapped);
  const uTrappedToEnd = normP(frame, tTrapped, totalDur);

  const botOpacity = interpolate(botIgniteP, [0, 1], [0.16, 1]);

  // True exponential stretch factor:
  //   At expAt: 1.0 (400px)
  //   Mid expAt->explodeAt: 2.0 (2x doubling tick!)
  //   At explodeAt: 4.0 (4x doubling tick! = 1600px -> right end approaching screen edge)
  //   explodeAt -> trappedAt: rockets from 4.0 -> 11.5 (flag flies smoothly off-screen!)
  //   trappedAt -> end: keeps accelerating smoothly 11.5 -> 19.0
  const expDoublings =
    frame < tExp
      ? 0
      : frame < tExplode
        ? 2.0 * Math.pow(uExpToExplode, 1.08) // 2^0 = 1x -> 2^1 = 2x -> 2^2 = 4x
        : frame < tTrapped
          ? 2.0 + 1.52 * Math.pow(uExplodeToTrapped, 1.15) // 4x -> ~11.5x
          : 3.52 + 0.72 * uTrappedToEnd; // 11.5x -> ~18.9x

  const expFactor = Math.pow(2, expDoublings);
  const botLen = baseLen * expFactor;
  const botEndX = leftX + botLen;

  // Ant fractional progress on exponential band: climbs quickly at first, then stalls asymptotically around 28.0%!
  // Keep physical ant X cleanly on the left-mid screen (x ~ 165 -> 790) so cutoff barrier fits cleanly ahead!
  const fBot =
    frame < tExp
      ? 0
      : frame < tExplode
        ? 0.215 * (1 - Math.exp(-2.3 * uExpToExplode)) / (1 - Math.exp(-2.3))
        : frame < tTrapped
          ? 0.215 + 0.064 * (1 - Math.exp(-3.1 * uExplodeToTrapped)) / (1 - Math.exp(-3.1))
          : 0.279 + 0.004 * (1 - Math.exp(-2.8 * uTrappedToEnd));

  // Map ant physical position smoothly (since 28% of 7000px would exceed 1920px, use gentle logarithmic screen mapping once band shoots off-screen)
  const rawAntOffset = fBot * botLen;
  const botAntOffset =
    rawAntOffset <= 520
      ? rawAntOffset
      : 520 + 215 * (1 - Math.exp(-(rawAntOffset - 520) / 560));
  const botAntX = leftX + botAntOffset;

  const explodeP = normP(frame, tExplode, tExplode + 24);
  const trappedPop = spring({
    frame: Math.max(0, frame - tTrapped),
    fps,
    config: { damping: 12, stiffness: 165 },
  });
  const barrierX = botAntX + 165;
  const flagOffScreen = botEndX > 1760;

  // Top ticks (10 equal fractions)
  const topTicks: number[] = [];
  for (let i = 1; i <= 9; i++) topTicks.push(i / 10);

  // Bottom doubling markers (1x, 2x, 4x) & exploding new rubber segments
  const botTicks: number[] = [];
  for (let i = 1; i <= 48; i++) {
    const tx = leftX + (i / 16) * botLen;
    if (tx <= 1940) botTicks.push(tx);
  }

  // Exploding newly created crimson rubber segment pulses streaming rightward ahead of ant
  const surgeSegments: { x: number; w: number; alpha: number }[] = [];
  if (frame >= tExplode - 8) {
    const tExSec = Math.max(0, (frame - tExplode) / fps);
    for (let s = 0; s < 5; s++) {
      const startOff = s * 0.42;
      const age = tExSec - startOff;
      if (age > 0) {
        const segX = botAntX + 38 + age * 145 + age * age * 46;
        const segW = 36 + age * 88;
        if (segX < 1940) {
          surgeSegments.push({
            x: segX,
            w: Math.min(segW, Math.max(0, 1940 - segX)),
            alpha: clamp(age / 0.35, 0, 1) * clamp((1920 - segX) / 220, 0, 1) * 0.72,
          });
        }
      }
    }
  }

  return (
    <AbsoluteFill>
      <svg
        viewBox="0 0 1920 1080"
        style={{ width: "100%", height: "100%", overflow: "hidden" }}
      >
        <defs>
          <linearGradient
            id="topBandClaimed4A"
            gradientUnits="userSpaceOnUse"
            x1={leftX}
            y1={topY}
            x2={Math.max(leftX + 10, topAntX)}
            y2={topY}
          >
            <stop offset="0%" stopColor={C.cyan} />
            <stop offset="100%" stopColor={C.green} />
          </linearGradient>
          <linearGradient
            id="botBandHot4A"
            gradientUnits="userSpaceOnUse"
            x1={leftX}
            y1={botY}
            x2={1880}
            y2={botY}
          >
            <stop offset="0%" stopColor="#ff7b52" />
            <stop offset="45%" stopColor={C.red} />
            <stop offset="100%" stopColor="#ff1448" />
          </linearGradient>
          <linearGradient
            id="cutoffWallGrad"
            gradientUnits="userSpaceOnUse"
            x1={0}
            y1={640}
            x2={0}
            y2={910}
          >
            <stop offset="0%" stopColor={C.red} stopOpacity="0" />
            <stop offset="20%" stopColor={C.red} stopOpacity="0.95" />
            <stop offset="80%" stopColor={C.red} stopOpacity="0.95" />
            <stop offset="100%" stopColor={C.red} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Subtle mid divider */}
        <line
          x1={115}
          y1={530}
          x2={1805}
          y2={530}
          stroke="rgba(127, 147, 196, 0.18)"
          strokeWidth={1.5}
          strokeDasharray="10 12"
        />

        {/* ============================================================= */}
        {/* TOP TRACK: STEADY LINEAR STRETCH                              */}
        {/* ============================================================= */}
        <g opacity={topDimFactor}>
          <line
            x1={leftX}
            y1={topY}
            x2={1760}
            y2={topY}
            stroke="rgba(62, 224, 255, 0.09)"
            strokeWidth={2}
          />

          {/* Cyan elastic band */}
          <rect
            x={leftX}
            y={topY - 9}
            width={Math.max(4, topLen)}
            height={18}
            rx={9}
            fill="rgba(62, 224, 255, 0.22)"
            stroke={C.cyan}
            strokeWidth={2.5}
            style={{ filter: svgGlow(C.cyan, 6) }}
          />

          {/* Permanently locked-in claimed fraction behind ant */}
          <rect
            x={leftX}
            y={topY - 9}
            width={Math.max(4, topAntX - leftX)}
            height={18}
            rx={9}
            fill="url(#topBandClaimed4A)"
            opacity={0.94}
            style={{ filter: svgGlow(C.green, 7) }}
          />

          {/* Elastic fraction ticks — flash softly bright green as ant locks each one in */}
          {topTicks.map((frac, idx) => {
            const tx = leftX + frac * topLen;
            const claimed = frac <= fTop;
            return (
              <line
                key={idx}
                x1={tx}
                y1={topY - 15}
                x2={tx}
                y2={topY + 15}
                stroke={claimed ? C.green : C.cyan}
                strokeWidth={claimed ? 2.6 : 1.8}
                opacity={claimed ? 0.92 : 0.45}
              />
            );
          })}

          {/* Left fixed anchor */}
          <circle
            cx={leftX}
            cy={topY}
            r={12}
            fill={C.bg0}
            stroke={C.cyan}
            strokeWidth={3.5}
          />

          {/* Moving right end + finish flag */}
          <g transform={`translate(${topEndX}, ${topY})`}>
            {topReached && (
              <circle
                r={reachRingR}
                fill="none"
                stroke={C.green}
                strokeWidth={3.5}
                opacity={reachRingO}
              />
            )}
            <line
              x1={0}
              y1={14}
              x2={0}
              y2={-70}
              stroke={topReached ? C.green : C.white}
              strokeWidth={3.5}
              strokeLinecap="round"
            />
            <polygon
              points="0,-70 50,-53 0,-36"
              fill={topReached ? C.green : C.gold}
              style={{ filter: svgGlow(topReached ? C.green : C.gold, 8) }}
            />
            <circle
              r={10}
              fill={topReached ? C.green : C.cyan}
              style={{ filter: svgGlow(topReached ? C.green : C.cyan, 6) }}
            />
          </g>

          {/* 10x ANT SPEED moving velocity callout cleanly below right end */}
          {frame >= tTenX - 2 && (
            <g
              transform={`translate(${Math.min(topEndX, 1610)}, ${topY + 54})`}
              opacity={tenXPop * (topReached ? 0.55 : 0.96)}
            >
              <line
                x1={-48}
                y1={0}
                x2={44}
                y2={0}
                stroke={C.gold}
                strokeWidth={3}
                strokeLinecap="round"
                style={{ filter: svgGlow(C.gold, 6) }}
              />
              <polygon points="56,0 40,-8 40,8" fill={C.gold} />
              <text
                x={0}
                y={30}
                textAnchor="middle"
                fill={C.gold}
                fontFamily={MONO}
                fontWeight={700}
                fontSize={20}
                letterSpacing={1.4}
              >
                10× ANT SPEED
              </text>
            </g>
          )}

          {/* Crisp Vector Ant on top band */}
          <VectorAnt
            x={topAntX}
            y={topY - 26}
            color={topReached ? C.green : C.white}
            scale={1.15}
            stride={fTop * 95 + preWaitU * 3}
          />

          {/* Live fractional progress readout cleanly ABOVE ant & finish flag (zero overlap!) */}
          <text
            x={topAntX}
            y={topY - 98}
            textAnchor="middle"
            fill={topReached ? C.green : C.cyan}
            fontFamily={MONO}
            fontWeight={700}
            fontSize={26}
            letterSpacing={1}
            style={{ filter: svgGlow(topReached ? C.green : C.cyan, 5) }}
          >
            {Math.round(fTop * 100)}%
          </text>
        </g>

        {/* ============================================================= */}
        {/* BOTTOM TRACK: EXPONENTIAL STRETCH                             */}
        {/* ============================================================= */}
        <g opacity={botOpacity}>
          <line
            x1={leftX}
            y1={botY}
            x2={1920}
            y2={botY}
            stroke="rgba(255, 77, 94, 0.1)"
            strokeWidth={2}
          />

          {/* Crimson exponentially stretching rubber band */}
          <rect
            x={leftX}
            y={botY - 10}
            width={Math.min(1820, botLen)}
            height={20}
            rx={10}
            fill="rgba(255, 77, 94, 0.24)"
            stroke="url(#botBandHot4A)"
            strokeWidth={2.8}
            style={{ filter: svgGlow(C.red, 8) }}
          />

          {/* Newly created glowing crimson rubber segments erupting ahead of ant on explodeAt */}
          {surgeSegments.map((seg, i) => (
            <rect
              key={i}
              x={seg.x}
              y={botY - 8}
              width={seg.w}
              height={16}
              rx={8}
              fill="#ff335c"
              opacity={seg.alpha}
              style={{ filter: svgGlow(C.red, 8) }}
            />
          ))}

          {/* Small claimed fraction behind ant (stalls around ~28%!) */}
          <rect
            x={leftX}
            y={botY - 10}
            width={Math.max(4, botAntX - leftX)}
            height={20}
            rx={10}
            fill={C.gold}
            opacity={0.85}
            style={{ filter: svgGlow(C.gold, 5) }}
          />

          {/* Streaming crimson ticks */}
          {botTicks.map((tx, idx) => {
            const behind = tx <= botAntX;
            return (
              <line
                key={idx}
                x1={tx}
                y1={botY - 15}
                x2={tx}
                y2={botY + 15}
                stroke={behind ? "#fff2cc" : C.red}
                strokeWidth={2}
                opacity={behind ? 0.8 : 0.48}
              />
            );
          })}

          {/* Crisp doubling markers (2×, 4×) visibly spawning & expanding below band */}
          {frame >= tExp + 12 &&
            [
              { mult: 2, lbl: "2×" },
              { mult: 4, lbl: "4×" },
            ].map((dm, idx) => {
              const mx = leftX + baseLen * dm.mult;
              const reachedMult = expFactor >= dm.mult * 0.72;
              if (!reachedMult || mx > 1860) return null;
              const vis = clamp((expFactor - dm.mult * 0.72) / (dm.mult * 0.28), 0, 1);
              return (
                <g key={idx} transform={`translate(${mx}, ${botY + 48})`} opacity={vis * 0.9}>
                  <line
                    x1={0}
                    y1={-28}
                    x2={0}
                    y2={-8}
                    stroke={C.red}
                    strokeWidth={2}
                    strokeDasharray="4 4"
                  />
                  <text
                    x={0}
                    y={16}
                    textAnchor="middle"
                    fill="#ff8f9b"
                    fontFamily={MONO}
                    fontWeight={700}
                    fontSize={22}
                    style={{ filter: svgGlow(C.red, 4) }}
                  >
                    {dm.lbl}
                  </text>
                </g>
              );
            })}

          {/* Left anchor post */}
          <circle
            cx={leftX}
            cy={botY}
            r={12}
            fill={C.bg0}
            stroke={C.red}
            strokeWidth={3.5}
          />

          {/* Finish flag rocketing rightward off-screen */}
          {botEndX < 2040 && (
            <g transform={`translate(${botEndX}, ${botY})`}>
              <line
                x1={0}
                y1={14}
                x2={0}
                y2={-72}
                stroke={C.red}
                strokeWidth={3.5}
                strokeLinecap="round"
              />
              <polygon
                points="0,-72 52,-54 0,-36"
                fill={C.red}
                style={{ filter: svgGlow(C.red, 8) }}
              />
              <circle r={10} fill={C.red} style={{ filter: svgGlow(C.red, 7) }} />
            </g>
          )}

          {/* Off-screen right-edge crimson speed chevrons once flag flies off */}
          {flagOffScreen && (
            <g
              transform={`translate(${1838 + uTrappedToEnd * 16}, ${botY})`}
              opacity={clamp((botEndX - 1760) / 180, 0, 1)}
            >
              <path
                d="M -26 -16 L -6 0 L -26 16 M -2 -16 L 18 0 L -2 16 M 22 -16 L 42 0 L 22 16"
                fill="none"
                stroke={C.red}
                strokeWidth={3.6}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ filter: svgGlow(C.red, 8) }}
              />
            </g>
          )}

          {/* Bold Crimson CUTOFF Barrier slamming down on trappedAt */}
          {frame >= tTrapped - 2 && (
            <g opacity={trappedPop}>
              <line
                x1={barrierX}
                y1={645}
                x2={barrierX}
                y2={645 + 265 * trappedPop}
                stroke="url(#cutoffWallGrad)"
                strokeWidth={7}
                strokeLinecap="round"
                style={{ filter: svgGlow(C.red, 12) }}
              />
              <line
                x1={barrierX}
                y1={655}
                x2={barrierX}
                y2={655 + 245 * trappedPop}
                stroke="#ffffff"
                strokeWidth={2.2}
                opacity={0.75}
              />
              <text
                x={barrierX}
                y={936}
                textAnchor="middle"
                fill={C.red}
                fontFamily={MONO}
                fontWeight={700}
                fontSize={21}
                letterSpacing={2}
                style={{ filter: svgGlow(C.red, 6) }}
              >
                CUTOFF DISTANCE
              </text>
            </g>
          )}

          {/* Bottom Vector Ant walking hard yet stalled at ~28% */}
          <VectorAnt
            x={botAntX}
            y={botY - 26}
            color={C.gold}
            scale={1.15}
            stride={Math.max(0, (frame - tExp) / fps) * 9.2}
          />

          {/* Live stalled fractional progress readout */}
          <text
            x={botAntX}
            y={botY - 70}
            textAnchor="middle"
            fill={frame >= tExplode ? C.red : C.gold}
            fontFamily={MONO}
            fontWeight={700}
            fontSize={26}
            letterSpacing={1}
            style={{ filter: svgGlow(frame >= tExplode ? C.red : C.gold, 5) }}
          >
            {(fBot * 100).toFixed(1)}%
          </text>

          {/* Subtle "NEW RUBBER EXPLODING" callout ahead of ant during explodeAt -> trappedAt */}
          {frame >= tExplode && frame < tTrapped + 18 && (
            <text
              x={Math.min(1440, botAntX + 350)}
              y={botY - 48}
              textAnchor="middle"
              fill="#ff8f9b"
              fontFamily={MONO}
              fontWeight={700}
              fontSize={20}
              letterSpacing={2}
              opacity={
                explodeP *
                interpolate(normP(frame, tTrapped, tTrapped + 18), [0, 1], [0.92, 0])
              }
            >
              NEW SPACE EXPLODING »»
            </text>
          )}
        </g>
      </svg>

      {/* Crisp minimal anchor labels */}
      <MinimalLabel
        text="STEADY STRETCH"
        sub="LINEAR · 1 + a·t"
        color={C.cyan}
        x={165}
        y={104}
        align="left"
        size={34}
        delay={4}
      />
      {topReached && (
        <MinimalLabel
          text="REACHES ✓"
          color={C.green}
          x={1755}
          y={112}
          align="right"
          size={36}
          delay={topFinishFrame}
        />
      )}
      <MinimalLabel
        text="EXPONENTIAL STRETCH"
        sub="DOUBLES EVERY INTERVAL · 2ᵗ"
        color={C.red}
        x={165}
        y={566}
        align="left"
        size={34}
        delay={tExp}
      />
      {frame >= tTrapped && (
        <MinimalLabel
          text="TRAPPED FOREVER ✕"
          color={C.red}
          x={1755}
          y={574}
          align="right"
          size={38}
          delay={tTrapped}
        />
      )}
    </AbsoluteFill>
  );
};

// ===========================================================================
// 2. CH 4B — DARK ENERGY, 17.5 B LY LIMIT & 16.5 B LY COSMIC EVENT HORIZON
// ===========================================================================
export const DarkEnergyEventHorizonAnim: React.FC<{
  accelAt: number;
  darkAt: number;
  maxAt: number;
  horizonAt: number;
  goodPhotonAt: number;
  lostPhotonAt: number;
  neverAt: number;
}> = ({
  accelAt,
  darkAt,
  maxAt,
  horizonAt,
  goodPhotonAt,
  lostPhotonAt,
  neverAt,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const totalDur = Math.max(360, durationInFrames);

  // Order-safe milestone timing (handles darkAt before or after accelAt cleanly!)
  const tCurveFlip = Math.max(24, Math.min(accelAt, darkAt));
  const tDarkPush = Math.max(20, Math.min(accelAt, darkAt));
  const tMax = Math.max(tCurveFlip + 45, maxAt);
  const tHorizon = Math.max(tMax + 45, horizonAt);
  const tGood = Math.max(tHorizon + 45, goodPhotonAt);
  const tLost = Math.max(tGood + 60, lostPhotonAt);
  const tNever = Math.max(tLost + 24, neverAt);

  const earthX = 210;
  const earthY = 540;
  const pxPerBly = 72;

  const rLimit = 17.5;
  const rHorizon = 16.5;

  // --- STAGE 1 (0 -> maxAt): Cosmic Expansion Curve transitioning Decel -> 1998 -> Accel ---
  const curveDrawU = Easing.out(Easing.cubic)(normP(frame, 0, Math.max(60, tMax - 20)));
  const curveOutU = normP(frame, tMax - 18, tMax + 26);
  const curveAlpha = 1 - smoothstep(curveOutU);
  const inflectPop = spring({
    frame: Math.max(0, frame - Math.round(tCurveFlip * 0.55)),
    fps,
    config: { damping: 14, stiffness: 130 },
  });

  // Build smooth expansion curve a(t): gently decelerating until x=960 (1998), then unmistakable upward curve!
  const curvePts: string[] = [];
  const decelGhostPts: string[] = [];
  const curveSamples = 48;
  const maxSample = Math.max(1, Math.round(curveDrawU * curveSamples));
  for (let i = 0; i <= curveSamples; i++) {
    const u = i / curveSamples; // 0..1 across x=380..1580
    const cxPt = 380 + u * 1200;
    // Decelerating trajectory (concave down)
    const decelY = 820 - 310 * Math.pow(u, 0.66);
    // Accelerating kick after u = 0.46 (1998 inflection!)
    const accelKick = u > 0.46 ? 355 * Math.pow((u - 0.46) / 0.54, 2.05) : 0;
    const realY = decelY - accelKick;

    if (i <= maxSample) {
      curvePts.push(`${i === 0 ? "M" : "L"} ${cxPt.toFixed(1)} ${realY.toFixed(1)}`);
    }
    if (u >= 0.46) {
      decelGhostPts.push(
        `${decelGhostPts.length === 0 ? "M" : "L"} ${cxPt.toFixed(1)} ${decelY.toFixed(1)}`
      );
    }
  }
  const inflectX = 380 + 0.46 * 1200; // 932
  const inflectY = 820 - 310 * Math.pow(0.46, 0.66); // ~634

  // --- DARK ENERGY OUTWARD PUSH ARROWS (accelAt/darkAt -> end, subtle monotonic expansion) ---
  const darkP = spring({
    frame: Math.max(0, frame - tDarkPush),
    fps,
    config: { damping: 18, stiffness: 105 },
  });
  const darkFlowU = normP(frame, tDarkPush, totalDur);

  // --- RADIAL HUBBLE SPHERE & HORIZON STAGE (smoothly fades into foreground on maxAt) ---
  const sphereStageP = smoothstep(normP(frame, tMax - 24, tMax + 22));
  const maxGrowU = normP(frame, tMax, tHorizon);
  const postHorizonU = normP(frame, tHorizon, totalDur);

  // Hubble Sphere grows visibly during maxAt -> horizonAt and asymptotically brakes toward 17.5 B ly!
  const rHubble =
    frame < tMax
      ? 14.0 + 0.4 * normP(frame, 0, tMax)
      : frame < tHorizon
        ? 14.4 + 2.52 * (1 - Math.exp(-2.85 * maxGrowU)) / (1 - Math.exp(-2.85))
        : 16.92 + 0.52 * (1 - Math.exp(-2.4 * postHorizonU));

  const limitPop = spring({
    frame: Math.max(0, frame - tMax),
    fps,
    config: { damping: 17, stiffness: 115 },
  });
  const horizonPop = spring({
    frame: Math.max(0, frame - tHorizon),
    fps,
    config: { damping: 15, stiffness: 120 },
  });
  const goodPop = spring({
    frame: Math.max(0, frame - tGood),
    fps,
    config: { damping: 16, stiffness: 130 },
  });
  const lostPop = spring({
    frame: Math.max(0, frame - tLost),
    fps,
    config: { damping: 16, stiffness: 130 },
  });
  const neverPop = spring({
    frame: Math.max(0, frame - tNever),
    fps,
    config: { damping: 11, stiffness: 175 },
  });
  const neverDrift = normP(frame, tNever, totalDur);

  // Two radial sightlines: upper (-11 deg) for 15.5 B ly, lower (+11 deg) for 17.0 B ly
  const angA = (-11 * Math.PI) / 180;
  const angB = (11 * Math.PI) / 180;
  const toXY = (distBly: number, angRad: number) => ({
    x: earthX + distBly * pxPerBly * Math.cos(angRad),
    y: earthY + distBly * pxPerBly * Math.sin(angRad),
  });

  // --- GOOD PHOTON (15.5 B ly -> rescues inside Hubble Sphere -> swims home to Earth!) ---
  const goodDurFrames = Math.max(120, Math.min(240, tLost - tGood + 18));
  const goodU = normP(frame, tGood, tGood + goodDurFrames);
  const turnaroundU = 0.24;
  const rGoldAt = (u: number): number => {
    if (u <= 0) return 15.5;
    if (u <= turnaroundU) {
      return 15.5 + 0.42 * Math.sin((u / turnaroundU) * (Math.PI / 2));
    }
    const v = clamp((u - turnaroundU) / (1 - turnaroundU), 0, 1);
    return 15.92 * (1 - smoothstep(v));
  };
  const goldDist = rGoldAt(goodU);
  const goldArrived = goodU >= 0.985;
  const goldTrailPts: string[] = [];
  if (goodU > 0.01) {
    const steps = 40;
    for (let i = 0; i <= steps; i++) {
      const us = (i / steps) * goodU;
      const pt = toXY(rGoldAt(us), angA);
      goldTrailPts.push(`${i === 0 ? "M" : "L"} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`);
    }
  }
  const rescueFlashP = clamp((goodU - turnaroundU) / 0.16, 0, 1);
  const arriveFlashP = normP(frame, tGood + goodDurFrames - 4, tGood + goodDurFrames + 42);

  // --- LOST PHOTON (17.0 B ly -> swept monotonically rightward off screen!) ---
  const tLostSec = Math.max(0, (frame - tLost) / fps);
  const redDist = 17.0 + 0.65 * tLostSec + 0.19 * tLostSec * tLostSec;

  const galADist = 15.5 + 0.35 * Math.max(0, (frame - tGood) / fps);
  const galBDist = 17.0 + 0.42 * tLostSec;

  const goldPos = toXY(goldDist, angA);
  const redPos = toXY(redDist, angB);
  const galAOrigin = toXY(15.5, angA);
  const galBOrigin = toXY(17.0, angB);
  const galAPos = toXY(galADist, angA);
  const galBPos = toXY(galBDist, angB);
  const rescuePos = toXY(15.92, angA);

  const rulerMarks = [
    { d: 0, lbl: "0" },
    { d: 14.4, lbl: "14.4" },
    { d: 16.5, lbl: "16.5" },
    { d: 17.5, lbl: "17.5 B ly" },
  ];

  // Clean leader anchor points on the 3 arcs
  const hubbleTopX =
    earthX + Math.sqrt(Math.max(1, (rHubble * pxPerBly) ** 2 - 380 ** 2));
  const horizonTopX =
    earthX + Math.sqrt(Math.max(1, (rHorizon * pxPerBly) ** 2 - 295 ** 2));
  const limitBotX =
    earthX + Math.sqrt(Math.max(1, (rLimit * pxPerBly) ** 2 - 340 ** 2));

  // Dark energy radial push vector angles
  const deArrows = [
    { angDeg: -26, baseD: 5.5 },
    { angDeg: -14, baseD: 9.2 },
    { angDeg: 0, baseD: 12.2 },
    { angDeg: 14, baseD: 8.6 },
    { angDeg: 26, baseD: 6.2 },
    { angDeg: -8, baseD: 15.0 },
    { angDeg: 9, baseD: 14.6 },
  ];

  return (
    <AbsoluteFill>
      <svg
        viewBox="0 0 1920 1080"
        style={{ width: "100%", height: "100%", overflow: "hidden" }}
      >
        <defs>
          <radialGradient id="hubbleFill4B" cx="0%" cy="50%" r="100%">
            <stop offset="0%" stopColor={C.cyan} stopOpacity="0.12" />
            <stop offset="82%" stopColor={C.cyan} stopOpacity="0.05" />
            <stop offset="100%" stopColor={C.cyan} stopOpacity="0.2" />
          </radialGradient>
          <linearGradient
            id="beyondRedZone4B"
            gradientUnits="userSpaceOnUse"
            x1={earthX + rHorizon * pxPerBly - 60}
            y1={0}
            x2={1920}
            y2={0}
          >
            <stop offset="0%" stopColor={C.red} stopOpacity="0" />
            <stop offset="100%" stopColor={C.red} stopOpacity="0.15" />
          </linearGradient>
          <linearGradient
            id="accelCurveGrad4B"
            gradientUnits="userSpaceOnUse"
            x1={380}
            y1={820}
            x2={1580}
            y2={180}
          >
            <stop offset="0%" stopColor={C.cyan} />
            <stop offset="46%" stopColor={C.cyan} />
            <stop offset="56%" stopColor={C.gold} />
            <stop offset="100%" stopColor={C.red} />
          </linearGradient>
        </defs>

        {/* ============================================================= */}
        {/* SUBTLE DARK ENERGY OUTWARD PUSH ARROWS (accelAt -> end)       */}
        {/* ============================================================= */}
        {darkP > 0.01 && (
          <g opacity={darkP * (curveAlpha > 0.1 ? 0.55 : 0.24)}>
            {deArrows.map((ar, idx) => {
              const rad = (ar.angDeg * Math.PI) / 180;
              const dStart = (ar.baseD + darkFlowU * 5.8) * pxPerBly;
              const len = 54 + 26 * darkFlowU;
              const x1 = earthX + dStart * Math.cos(rad);
              const x2 = earthX + (dStart + len) * Math.cos(rad);
              const y2 = earthY + (dStart + len) * Math.sin(rad);
              if (x1 > 1920) return null;
              return (
                <g key={idx} transform={`translate(${x2.toFixed(1)}, ${y2.toFixed(1)}) rotate(${ar.angDeg})`}>
                  <line
                    x1={-len}
                    y1={0}
                    x2={-6}
                    y2={0}
                    stroke="#d56bff"
                    strokeWidth={2.4}
                    strokeLinecap="round"
                  />
                  <polyline
                    points="-16,-8 -4,0 -16,8"
                    fill="none"
                    stroke="#d56bff"
                    strokeWidth={2.4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              );
            })}
          </g>
        )}

        {/* ============================================================= */}
        {/* STAGE 1 (0 -> maxAt): 1998 EXPANSION CURVE (DECEL -> ACCEL)   */}
        {/* ============================================================= */}
        {curveAlpha > 0.01 && (
          <g opacity={curveAlpha}>
            {/* Clean subtle axes */}
            <line
              x1={380}
              y1={820}
              x2={1620}
              y2={820}
              stroke="rgba(127, 147, 196, 0.35)"
              strokeWidth={2}
            />
            <line
              x1={380}
              y1={820}
              x2={380}
              y2={180}
              stroke="rgba(127, 147, 196, 0.35)"
              strokeWidth={2}
            />
            <text
              x={1605}
              y={862}
              textAnchor="end"
              fill={C.dim}
              fontFamily={MONO}
              fontWeight={700}
              fontSize={20}
              letterSpacing={2}
            >
              COSMIC TIME →
            </text>
            <text
              x={355}
              y={200}
              textAnchor="end"
              fill={C.dim}
              fontFamily={MONO}
              fontWeight={700}
              fontSize={19}
              letterSpacing={1.8}
            >
              SIZE OF SPACE
            </text>

            {/* Dashed expected deceleration curve */}
            {decelGhostPts.length > 1 && curveDrawU > 0.46 && (
              <path
                d={decelGhostPts.join(" ")}
                fill="none"
                stroke={C.dim}
                strokeWidth={2.5}
                strokeDasharray="10 10"
                opacity={clamp((curveDrawU - 0.46) / 0.2, 0, 0.52)}
              />
            )}

            {/* Real accelerating expansion curve bending sharply upward after 1998 */}
            {curvePts.length > 1 && (
              <path
                d={curvePts.join(" ")}
                fill="none"
                stroke="url(#accelCurveGrad4B)"
                strokeWidth={6}
                strokeLinecap="round"
                style={{ filter: svgGlow(C.red, 8) }}
              />
            )}

            {/* 1998 Inflection Point Marker */}
            {curveDrawU > 0.44 && (
              <g opacity={inflectPop}>
                <circle
                  cx={inflectX}
                  cy={inflectY}
                  r={11}
                  fill={C.gold}
                  stroke="#ffffff"
                  strokeWidth={2.5}
                  style={{ filter: svgGlow(C.gold, 10) }}
                />
                <circle
                  cx={inflectX}
                  cy={inflectY}
                  r={14 + (1 - inflectPop) * 32}
                  fill="none"
                  stroke={C.gold}
                  strokeWidth={2}
                  opacity={0.55}
                />
                <text
                  x={inflectX}
                  y={inflectY + 46}
                  textAnchor="middle"
                  fill={C.gold}
                  fontFamily={MONO}
                  fontWeight={700}
                  fontSize={24}
                  letterSpacing={2}
                >
                  1998 DISCOVERY
                </text>
              </g>
            )}

            {/* Decelerating vs Accelerating minimal tags */}
            <text
              x={640}
              y={745}
              textAnchor="middle"
              fill={C.cyan}
              fontFamily={MONO}
              fontWeight={700}
              fontSize={22}
              letterSpacing={1.8}
              opacity={clamp(curveDrawU / 0.35, 0, 0.85)}
            >
              DECELERATING
            </text>
            {curveDrawU > 0.65 && (
              <text
                x={1410}
                y={245}
                textAnchor="middle"
                fill={C.red}
                fontFamily={MONO}
                fontWeight={700}
                fontSize={32}
                letterSpacing={2}
                opacity={clamp((curveDrawU - 0.65) / 0.22, 0, 1)}
                style={{ filter: svgGlow(C.red, 9) }}
              >
                ACCELERATING ↑
              </text>
            )}
            {darkP > 0.05 && (
              <text
                x={1370}
                y={585}
                textAnchor="middle"
                fill="#e296ff"
                fontFamily={MONO}
                fontWeight={700}
                fontSize={28}
                letterSpacing={2.2}
                opacity={darkP}
                style={{ filter: svgGlow("#d56bff", 8) }}
              >
                DARK ENERGY »
              </text>
            )}
          </g>
        )}

        {/* ============================================================= */}
        {/* STAGE 2 (maxAt -> end): HUBBLE SPHERE + 16.5 HORIZON + RACE   */}
        {/* ============================================================= */}
        {sphereStageP > 0.01 && (
          <g opacity={sphereStageP}>
            {/* Subtle crimson forbidden zone tint right of 16.5 B ly Event Horizon */}
            <rect
              x={earthX + rHorizon * pxPerBly - 60}
              y={0}
              width={680}
              height={1080}
              fill="url(#beyondRedZone4B)"
              opacity={horizonPop * 0.92}
            />

            {/* Expanding Cyan Hubble Sphere decelerating smoothly to 17.5 B ly */}
            <circle
              cx={earthX}
              cy={earthY}
              r={rHubble * pxPerBly}
              fill="url(#hubbleFill4B)"
              stroke={C.cyan}
              strokeWidth={3.8}
              style={{ filter: svgGlow(C.cyan, 9) }}
            />

            {/* Dashed 17.5 B ly Max Limit Asymptote */}
            <circle
              cx={earthX}
              cy={earthY}
              r={rLimit * pxPerBly}
              fill="none"
              stroke={C.cyan}
              strokeWidth={2.5}
              strokeDasharray="13 11"
              opacity={limitPop * 0.72}
            />

            {/* Blazing Crimson 16.5 B ly Cosmic Event Horizon */}
            <circle
              cx={earthX}
              cy={earthY}
              r={rHorizon * pxPerBly}
              fill="none"
              stroke={C.red}
              strokeWidth={5}
              opacity={horizonPop}
              style={{ filter: svgGlow(C.red, 12) }}
            />

            {/* Radial sightlines for test photons */}
            {goodPop > 0.01 && (
              <line
                x1={earthX}
                y1={earthY}
                x2={earthX + 1620 * Math.cos(angA)}
                y2={earthY + 1620 * Math.sin(angA)}
                stroke="rgba(255, 194, 77, 0.2)"
                strokeWidth={1.6}
                strokeDasharray="6 8"
                opacity={goodPop}
              />
            )}
            {lostPop > 0.01 && (
              <line
                x1={earthX}
                y1={earthY}
                x2={earthX + 1740 * Math.cos(angB)}
                y2={earthY + 1740 * Math.sin(angB)}
                stroke="rgba(255, 77, 94, 0.22)"
                strokeWidth={1.6}
                strokeDasharray="6 8"
                opacity={lostPop}
              />
            )}

            {/* GOOD PHOTON (15.5 B ly -> rescued & reaches Earth!) */}
            {goodPop > 0.01 && (
              <g opacity={goodPop}>
                <circle
                  cx={galAOrigin.x}
                  cy={galAOrigin.y}
                  r={6}
                  fill="none"
                  stroke={C.gold}
                  strokeWidth={2}
                  opacity={0.55}
                />
                <SpiralGalaxyIcon
                  cx={galAPos.x}
                  cy={galAPos.y}
                  r={24}
                  color={C.gold}
                  rotation={-22}
                  opacity={0.95}
                />
                {goldTrailPts.length > 1 && (
                  <path
                    d={goldTrailPts.join(" ")}
                    fill="none"
                    stroke={C.gold}
                    strokeWidth={3.2}
                    strokeLinecap="round"
                    opacity={0.68}
                    style={{ filter: svgGlow(C.gold, 5) }}
                  />
                )}
                {goodU >= turnaroundU && rescueFlashP < 1 && (
                  <circle
                    cx={rescuePos.x}
                    cy={rescuePos.y}
                    r={12 + rescueFlashP * 56}
                    fill="none"
                    stroke={C.cyan}
                    strokeWidth={3}
                    opacity={(1 - rescueFlashP) * 0.9}
                  />
                )}
                {!goldArrived && (
                  <PhotonWavePacket
                    x={goldPos.x}
                    y={goldPos.y}
                    angleDeg={180 - 11}
                    color={C.gold}
                    phase={(frame - tGood) * 0.34}
                    length={74}
                    amp={9}
                  />
                )}
              </g>
            )}

            {/* Arrival glow at Earth when 15.5 B ly photon arrives */}
            {goldArrived && arriveFlashP < 1 && (
              <circle
                cx={earthX}
                cy={earthY}
                r={24 + arriveFlashP * 68}
                fill="none"
                stroke={C.gold}
                strokeWidth={4}
                opacity={(1 - arriveFlashP) * 0.95}
                style={{ filter: svgGlow(C.gold, 10) }}
              />
            )}

            {/* LOST PHOTON (17.0 B ly -> swept monotonically rightward off-screen!) */}
            {lostPop > 0.01 && (
              <g opacity={lostPop}>
                <circle
                  cx={galBOrigin.x}
                  cy={galBOrigin.y}
                  r={6}
                  fill="none"
                  stroke={C.red}
                  strokeWidth={2}
                  opacity={0.55}
                />
                {galBPos.x < 1960 && (
                  <SpiralGalaxyIcon
                    cx={galBPos.x}
                    cy={galBPos.y}
                    r={24}
                    color={C.red}
                    rotation={18}
                    opacity={0.94}
                  />
                )}
                {tLostSec > 0.04 && (
                  <line
                    x1={galBOrigin.x}
                    y1={galBOrigin.y}
                    x2={Math.min(1960, redPos.x)}
                    y2={
                      earthY +
                      ((Math.min(1960, redPos.x) - earthX) / Math.cos(angB)) *
                        Math.sin(angB)
                    }
                    stroke={C.red}
                    strokeWidth={3.2}
                    strokeDasharray="8 6"
                    opacity={0.68}
                  />
                )}
                {redPos.x < 2000 && (
                  <PhotonWavePacket
                    x={redPos.x}
                    y={redPos.y}
                    angleDeg={180 + 11}
                    color={C.red}
                    phase={tLostSec * 8.5}
                    length={74}
                    amp={9}
                    opacity={clamp((1980 - redPos.x) / 140, 0, 1)}
                  />
                )}
              </g>
            )}

            {/* Earth Beacon */}
            <EarthBeacon cx={earthX} cy={earthY} r={22} />

            {/* Clean non-overlapping leader lines for 3 arcs */}
            <line
              x1={hubbleTopX}
              y1={160}
              x2={980}
              y2={118}
              stroke={C.cyan}
              strokeWidth={1.6}
              opacity={0.78}
            />
            <circle cx={hubbleTopX} cy={160} r={4.5} fill={C.cyan} />

            {horizonPop > 0.05 && (
              <g opacity={horizonPop}>
                <line
                  x1={horizonTopX}
                  y1={245}
                  x2={1515}
                  y2={166}
                  stroke={C.red}
                  strokeWidth={1.8}
                  opacity={0.85}
                />
                <circle cx={horizonTopX} cy={245} r={5} fill={C.red} />
              </g>
            )}

            {limitPop > 0.05 && (
              <g opacity={limitPop * 0.85}>
                <line
                  x1={limitBotX}
                  y1={880}
                  x2={1535}
                  y2={896}
                  stroke={C.cyan}
                  strokeWidth={1.5}
                  strokeDasharray="5 5"
                />
                <circle cx={limitBotX} cy={880} r={4} fill={C.cyan} />
              </g>
            )}

            {/* Crisp minimal bottom distance ruler (16.5 right-aligned, 17.5 B ly left-aligned — zero overlap!) */}
            <line
              x1={earthX}
              y1={995}
              x2={1660}
              y2={995}
              stroke="rgba(127, 147, 196, 0.28)"
              strokeWidth={1.5}
            />
            {rulerMarks.map((m, i) => {
              const mx = earthX + m.d * pxPerBly;
              const col = m.d === 16.5 ? C.red : m.d === 17.5 ? C.cyan : C.dim;
              const textX = m.d === 16.5 ? -8 : m.d === 17.5 ? 8 : 0;
              const anchor = m.d === 16.5 ? "end" : m.d === 17.5 ? "start" : "middle";
              return (
                <g key={i} transform={`translate(${mx}, 995)`}>
                  <line y1={-7} y2={7} stroke={col} strokeWidth={2} />
                  <text
                    x={textX}
                    y={30}
                    textAnchor={anchor}
                    fill={col}
                    stroke="#050a18"
                    strokeWidth={7}
                    strokeLinejoin="round"
                    paintOrder="stroke"
                    fontFamily={MONO}
                    fontWeight={700}
                    fontSize={18}
                  >
                    {m.lbl}
                  </text>
                </g>
              );
            })}
          </g>
        )}
      </svg>

      {/* Clean radial stage minimal labels (only mount once radial stage enters!) */}
      {frame >= tMax - 12 && (
        <>
          <MinimalLabel
            text={`${rHubble.toFixed(1)} B ly`}
            sub="HUBBLE SPHERE"
            color={C.cyan}
            x={962}
            y={78}
            align="right"
            size={34}
            delay={Math.max(0, tMax - 12)}
          />
          <MinimalLabel
            text="17.5 B ly"
            sub="MAX LIMIT"
            color={C.cyan}
            x={1550}
            y={862}
            align="left"
            size={26}
            delay={tMax}
          />
        </>
      )}
      {frame >= tHorizon && (
        <MinimalLabel
          text="16.5 B ly"
          sub="EVENT HORIZON"
          color={C.red}
          x={1532}
          y={128}
          align="left"
          size={36}
          delay={tHorizon}
        />
      )}
      {frame >= tGood + 10 && (
        <MinimalLabel
          text={goldArrived ? "15.5 B ly ✓" : "15.5 B ly"}
          color={goldArrived ? C.green : C.gold}
          x={640}
          y={268}
          align="center"
          size={32}
          delay={tGood + 10}
        />
      )}
      {frame >= tLost + 10 && (
        <MinimalLabel
          text="17.0 B ly ✕"
          color={C.red}
          x={1555}
          y={728}
          align="left"
          size={32}
          delay={tLost + 10}
        />
      )}

      {/* Sleek bold crimson NEVER. ✕ kinetic punch over the disappearing photon on neverAt */}
      {frame >= tNever - 2 && (
        <div
          style={{
            position: "absolute",
            left: 1525,
            top: 525,
            transform: `translate(-50%, -50%) scale(${(0.76 + 0.26 * neverPop + 0.06 * neverDrift).toFixed(4)})`,
            opacity: clamp(neverPop * 1.35, 0, 1),
            pointerEvents: "none",
            whiteSpace: "nowrap",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: INTER,
              fontWeight: 900,
              fontSize: 82,
              letterSpacing: 3.5,
              color: C.red,
              textShadow: `0 8px 30px rgba(5, 10, 24, 0.98), ${glow(C.red, 18)}`,
            }}
          >
            NEVER. ✕
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ===========================================================================
// 3. CH 5A — THREE NESTED COSMIC SHELLS (CONTINUOUS 36S CAMERA PULL-OUT)
// ===========================================================================
interface ShellGalaxy {
  rBly: number;
  angle: number;
  size: number;
  tilt: number;
  alpha: number;
  revealU: number; // radial stagger 0..1 inside outer observable shell
}

const SHELL_GALAXIES: ShellGalaxy[] = (() => {
  const rand = mulberry32(5149);
  const out: ShellGalaxy[] = [];
  for (let i = 0; i < 112; i++) {
    const u = rand();
    const rBly = 2.0 + Math.sqrt(u) * 43.8;
    out.push({
      rBly,
      angle: rand() * Math.PI * 2,
      size: 2.1 + rand() * 3.5,
      tilt: rand() * 180,
      alpha: 0.45 + rand() * 0.5,
      revealU: clamp((rBly - 16.5) / 29.5, 0, 1),
    });
  }
  return out;
})();

export const ThreeNestedShellsAnim: React.FC<{
  hubAt: number;
  ehAt: number;
  obsAt: number;
  diamAt: number;
}> = ({ hubAt, ehAt, obsAt, diamAt }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const totalDur = Math.max(300, durationInFrames);
  const tHub = Math.max(24, hubAt);
  const tEh = Math.max(tHub + 45, ehAt);
  const tObs = Math.max(tEh + 45, obsAt);
  const tDiam = Math.max(tObs + 45, diamAt);

  const cx = 960;
  const cy = 502; // slightly elevated to give bottom 93 B ly caliper clean breathing room!

  // Continuous smooth camera pull-out across ALL 36 seconds (ZERO static segments!)
  const fullU = normP(frame, 0, totalDur);
  const uIntro = normP(frame, 0, tHub);
  const uHubSpan = normP(frame, tHub, tEh);
  const uEhZoom = Easing.inOut(Easing.cubic)(normP(frame, tEh, tEh + Math.min(84, tObs - tEh)));
  const uObsZoom = Easing.inOut(Easing.cubic)(normP(frame, tObs, tObs + Math.min(108, Math.max(60, tDiam - tObs + 18))));

  // Final zoomed-out pxPerBly ~ 8.75 -> rObsPx ~ 407px (fits y=95..909 with generous margins!)
  const pxPerBly =
    26.4 - 1.2 * fullU - 1.4 * uHubSpan - 4.1 * uEhZoom - 10.95 * uObsZoom;

  const rHubblePx = 14.4 * pxPerBly;
  const rEhPx = 16.5 * pxPerBly;
  const rObsPx = 46.5 * pxPerBly;

  // Perimeter sweep animations (0° -> 360°) for each shell!
  const earthEnter = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 105 },
  });
  const hubSweep = Easing.out(Easing.cubic)(normP(frame, tHub, tHub + 52));
  const hubFill = normP(frame, tHub + 16, tHub + 58);

  const ehSweep = Easing.out(Easing.cubic)(normP(frame, tEh, tEh + 54));
  const ehFill = normP(frame, tEh + 16, tEh + 58);

  const obsSweep = Easing.out(Easing.cubic)(normP(frame, tObs, tObs + 64));
  const obsFill = normP(frame, tObs + 18, tObs + 74);
  const obsPopWave = normP(frame, tObs + 10, tDiam);

  // Caliper draw symmetrically from center outward on diamAt!
  const caliperDraw = Easing.out(Easing.cubic)(normP(frame, tDiam, tDiam + 46));
  const diamValue = Math.round(93 * caliperDraw);

  // Subtle continuous celestial rotation + mild outward galaxy drift (non-looping!)
  const rotRad = (frame / fps) * 0.019;

  // Leader anchor points on shell perimeters
  const hubbleEdgeX = cx - rHubblePx * Math.cos(0.32);
  const hubbleEdgeY = cy - rHubblePx * Math.sin(0.32);
  const ehEdgeX = cx - rEhPx * Math.cos(0.32);
  const ehEdgeY = cy + rEhPx * Math.sin(0.32);
  const obsEdgeX = cx + rObsPx * Math.cos(0.28);
  const obsEdgeY = cy - rObsPx * Math.sin(0.28);

  const circHub = 2 * Math.PI * rHubblePx;
  const circEh = 2 * Math.PI * rEhPx;
  const circObs = 2 * Math.PI * rObsPx;

  const caliperY = cy + rObsPx + 42;
  const caliperHalf = rObsPx * caliperDraw;

  return (
    <AbsoluteFill>
      <svg
        viewBox="0 0 1920 1080"
        style={{ width: "100%", height: "100%", overflow: "hidden" }}
      >
        <defs>
          <radialGradient id="obsShellGrad5A" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={C.gold} stopOpacity="0.02" />
            <stop offset="68%" stopColor={C.gold} stopOpacity="0.06" />
            <stop offset="94%" stopColor={C.gold} stopOpacity="0.14" />
            <stop offset="100%" stopColor={C.gold} stopOpacity="0.24" />
          </radialGradient>
          <radialGradient id="ehShellGrad5A" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={C.red} stopOpacity="0.02" />
            <stop offset="82%" stopColor={C.red} stopOpacity="0.1" />
            <stop offset="100%" stopColor={C.red} stopOpacity="0.24" />
          </radialGradient>
          <radialGradient id="hubShellGrad5A" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={C.cyan} stopOpacity="0.16" />
            <stop offset="85%" stopColor={C.cyan} stopOpacity="0.07" />
            <stop offset="100%" stopColor={C.cyan} stopOpacity="0.24" />
          </radialGradient>
        </defs>

        {/* 0 -> hubAt: 3 subtle concentric priming guide rings gently expanding around Earth */}
        {uIntro < 1 && (
          <g opacity={(1 - smoothstep(normP(frame, tHub - 12, tHub + 18))) * 0.42}>
            {[1, 2, 3].map((k) => {
              const rGuide = (k * 105 + uIntro * 42 * k) * earthEnter;
              return (
                <circle
                  key={k}
                  cx={cx}
                  cy={cy}
                  r={rGuide}
                  fill="none"
                  stroke={k === 1 ? C.cyan : k === 2 ? C.red : C.gold}
                  strokeWidth={1.5}
                  strokeDasharray="8 12"
                  opacity={0.7 - k * 0.14}
                />
              );
            })}
          </g>
        )}

        {/* STAGE 3: Colossal Golden 46.5 B ly Observable Universe (sweeps 0 -> 360 deg!) */}
        {obsSweep > 0.005 && (
          <g>
            <circle
              cx={cx}
              cy={cy}
              r={rObsPx}
              fill="url(#obsShellGrad5A)"
              opacity={obsFill}
            />
            <circle
              cx={cx}
              cy={cy}
              r={rObsPx}
              fill="none"
              stroke={C.gold}
              strokeWidth={4.2}
              strokeDasharray={circObs}
              strokeDashoffset={circObs * (1 - obsSweep)}
              transform={`rotate(-90 ${cx} ${cy})`}
              style={{ filter: svgGlow(C.gold, 11) }}
            />
          </g>
        )}

        {/* Sparkling galaxies scattered across all 3 shells (continuously populating & drifting!) */}
        {SHELL_GALAXIES.map((g, idx) => {
          const isInner = g.rBly <= 14.2;
          const isMid = g.rBly > 14.2 && g.rBly <= 16.3;
          const vis = isInner
            ? hubFill
            : isMid
              ? ehFill
              : clamp((obsPopWave - g.revealU * 0.65) / 0.35, 0, 1);
          if (vis < 0.02) return null;

          // Inner & outer galaxies drift very gently radially outward over the 36s span
          const radialDrift = isInner ? 1 + 0.035 * uHubSpan : 1 + 0.02 * fullU;
          const rPx = g.rBly * pxPerBly * radialDrift;
          const gx = cx + rPx * Math.cos(g.angle + rotRad);
          const gy = cy + rPx * Math.sin(g.angle + rotRad);
          if (gx < -20 || gx > 1940 || gy < -20 || gy > 1100) return null;

          const col = isInner ? "#c9f4ff" : isMid ? "#ff98a4" : "#ffd884";
          const rx = g.size * (0.9 + 0.32 * (1 - uObsZoom));
          return (
            <g
              key={idx}
              transform={`translate(${gx.toFixed(1)}, ${gy.toFixed(1)}) rotate(${g.tilt})`}
              opacity={vis * g.alpha}
            >
              <ellipse rx={rx * 1.65} ry={rx * 0.65} fill={col} opacity={0.58} />
              <circle r={rx * 0.52} fill="#ffffff" />
            </g>
          );
        })}

        {/* STAGE 2: Blazing Crimson 16.5 B ly Event Horizon (sweeps 0 -> 360 deg!) */}
        {ehSweep > 0.005 && (
          <g>
            <circle
              cx={cx}
              cy={cy}
              r={rEhPx}
              fill="url(#ehShellGrad5A)"
              opacity={ehFill}
            />
            <circle
              cx={cx}
              cy={cy}
              r={rEhPx}
              fill="none"
              stroke={C.red}
              strokeWidth={4}
              strokeDasharray={circEh}
              strokeDashoffset={circEh * (1 - ehSweep)}
              transform={`rotate(-90 ${cx} ${cy})`}
              style={{ filter: svgGlow(C.red, 10) }}
            />
          </g>
        )}

        {/* STAGE 1: Cyan 14.4 B ly Hubble Sphere (sweeps 0 -> 360 deg!) */}
        {hubSweep > 0.005 && (
          <g>
            <circle
              cx={cx}
              cy={cy}
              r={rHubblePx}
              fill="url(#hubShellGrad5A)"
              opacity={hubFill}
            />
            <circle
              cx={cx}
              cy={cy}
              r={rHubblePx}
              fill="none"
              stroke={C.cyan}
              strokeWidth={3.6}
              strokeDasharray={circHub}
              strokeDashoffset={circHub * (1 - hubSweep)}
              transform={`rotate(-90 ${cx} ${cy})`}
              style={{ filter: svgGlow(C.cyan, 9) }}
            />
          </g>
        )}

        {/* Crisp Golden Bottom Caliper Bar (93 B ly DIAMETER) drawing full width on diamAt */}
        {caliperDraw > 0.01 && (
          <g opacity={clamp(caliperDraw * 1.4, 0, 1)}>
            {/* Left caliper arm */}
            <line
              x1={cx - 188}
              y1={caliperY}
              x2={Math.min(cx - 188, cx - caliperHalf)}
              y2={caliperY}
              stroke={C.gold}
              strokeWidth={2.8}
              style={{ filter: svgGlow(C.gold, 6) }}
            />
            {/* Right caliper arm */}
            <line
              x1={cx + 188}
              y1={caliperY}
              x2={Math.max(cx + 188, cx + caliperHalf)}
              y2={caliperY}
              stroke={C.gold}
              strokeWidth={2.8}
              style={{ filter: svgGlow(C.gold, 6) }}
            />
            {/* End caps */}
            {caliperHalf > 196 && (
              <>
                <line
                  x1={cx - caliperHalf}
                  y1={caliperY - 14}
                  x2={cx - caliperHalf}
                  y2={caliperY + 14}
                  stroke={C.gold}
                  strokeWidth={2.8}
                />
                <line
                  x1={cx + caliperHalf}
                  y1={caliperY - 14}
                  x2={cx + caliperHalf}
                  y2={caliperY + 14}
                  stroke={C.gold}
                  strokeWidth={2.8}
                />
              </>
            )}
            <text
              x={cx}
              y={caliperY + 9}
              textAnchor="middle"
              fill={C.gold}
              fontFamily={MONO}
              fontWeight={700}
              fontSize={28}
              letterSpacing={2}
              style={{ filter: svgGlow(C.gold, 8) }}
            >
              {diamValue} B ly DIAMETER
            </text>
          </g>
        )}

        {/* Center Earth Beacon */}
        <g opacity={earthEnter}>
          <EarthBeacon
            cx={cx}
            cy={cy}
            r={interpolate(uObsZoom, [0, 1], [17, 9])}
            label={true}
            labelOpacity={interpolate(uObsZoom, [0, 0.65], [0.95, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })}
          />
        </g>

        {/* Clean leader lines connecting side callouts to exact ring perimeters */}
        {hubFill > 0.05 && (
          <g opacity={hubFill * 0.9}>
            <polyline
              points={`425,368 ${Math.min(hubbleEdgeX - 24, 508)},368 ${hubbleEdgeX.toFixed(1)},${hubbleEdgeY.toFixed(1)}`}
              fill="none"
              stroke={C.cyan}
              strokeWidth={2}
            />
            <circle cx={hubbleEdgeX} cy={hubbleEdgeY} r={4.5} fill={C.cyan} />
          </g>
        )}

        {ehFill > 0.05 && (
          <g opacity={ehFill * 0.92}>
            <polyline
              points={`425,624 ${Math.min(ehEdgeX - 24, 508)},624 ${ehEdgeX.toFixed(1)},${ehEdgeY.toFixed(1)}`}
              fill="none"
              stroke={C.red}
              strokeWidth={2}
            />
            <circle cx={ehEdgeX} cy={ehEdgeY} r={5} fill={C.red} />
          </g>
        )}

        {obsFill > 0.05 && uObsZoom > 0.25 && (
          <g opacity={clamp((uObsZoom - 0.25) / 0.45, 0, 1)}>
            <polyline
              points={`1485,368 ${Math.max(obsEdgeX + 24, 1412)},368 ${obsEdgeX.toFixed(1)},${obsEdgeY.toFixed(1)}`}
              fill="none"
              stroke={C.gold}
              strokeWidth={2.2}
            />
            <circle cx={obsEdgeX} cy={obsEdgeY} r={5.5} fill={C.gold} />
          </g>
        )}
      </svg>

      {/* Clean non-overlapping perimeter labels */}
      <MinimalLabel
        text="14.4 B ly"
        sub="HUBBLE SPHERE"
        color={C.cyan}
        x={115}
        y={334}
        align="left"
        size={36}
        delay={tHub}
      />
      <MinimalLabel
        text="16.5 B ly"
        sub="EVENT HORIZON"
        color={C.red}
        x={115}
        y={590}
        align="left"
        size={36}
        delay={tEh}
      />
      <MinimalLabel
        text="46.5 B ly"
        sub="OBSERVABLE UNIVERSE"
        color={C.gold}
        x={1805}
        y={334}
        align="right"
        size={38}
        delay={tObs + 14}
      />
    </AbsoluteFill>
  );
};

// ===========================================================================
// 4. CH 5B — JADES-GS-z14-0 LIGHT JOURNEY (REWIND 33.8 -> 2.2 -> 33.8 B LY)
// ===========================================================================
export const JadesLightJourneyAnim: React.FC<{
  rewindAt: number;
  emitAt: number;
  sweepAt: number;
  stretchAt: number;
  babyAt: number;
}> = ({ rewindAt, emitAt, sweepAt, stretchAt, babyAt }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const totalDur = Math.max(360, durationInFrames);

  // Strictly monotonic milestone guards honoring passed props
  const tRewind = Math.max(30, rewindAt);
  const tEmit = Math.max(tRewind + 45, emitAt);
  const tSweep = Math.max(tEmit + 36, sweepAt);
  const tStretch = Math.max(tSweep + 45, stretchAt);
  const tBaby = Math.max(tStretch + 60, babyAt);

  const mwX = 225;
  const midY = 560;
  const basePxPerBly = 1440 / 33.8; // 42.6035 px/B ly -> 33.8 B ly lands at x = 1665

  // Normalized stage progresses
  const uIntro = normP(frame, 0, tRewind);
  const uRewind = smoothstep(normP(frame, tRewind, tEmit - 10));
  const uEmitToSweep = normP(frame, tEmit, tSweep);
  const uSweepToStretch = normP(frame, tSweep, tStretch);
  const uStretchToBaby = normP(frame, tStretch, tBaby - 12);
  const uAfterBaby = normP(frame, tBaby, totalDur);

  // Smooth camera scale:
  //   0 -> rewindAt: modern full view (1.0 -> 1.03 gentle drift)
  //   rewindAt -> emitAt: zooms smoothly IN as universe contracts (1.03 -> 1.72)
  //   emitAt -> stretchAt: holds intimate early-universe scale with mild pull-back (1.72 -> 1.54)
  //   stretchAt -> babyAt: zooms smoothly OUT as universe expands back to modern scale (1.54 -> 1.0)
  //   babyAt -> end: gentle 1.0 -> 0.985 settling drift
  const camScale =
    frame < tRewind
      ? 1.0 + 0.03 * uIntro
      : frame < tEmit
        ? 1.03 + 0.69 * uRewind
        : frame < tStretch
          ? 1.72 - 0.06 * uEmitToSweep - 0.12 * uSweepToStretch
          : frame < tBaby
            ? 1.54 - 0.54 * smoothstep(uStretchToBaby)
            : 1.0 - 0.015 * uAfterBaby;

  const pxScale = basePxPerBly * camScale;

  // Physical distance of JADES-GS-z14-0 (in B ly):
  //   0 -> rewindAt: 33.2 -> 33.8 B ly (today!)
  //   rewindAt -> emitAt: dramatic rewind 33.8 -> 2.2 B ly!
  //   emitAt -> sweepAt: 2.2 -> 3.3 B ly
  //   sweepAt -> stretchAt: 3.3 -> 6.8 B ly
  //   stretchAt -> babyAt: 6.8 -> 33.8 B ly
  //   babyAt -> end: 33.8 -> 34.4 B ly (continuing expansion!)
  const dJades =
    frame < tRewind
      ? 33.0 + 0.8 * uIntro
      : frame < tEmit
        ? 33.8 - 31.6 * uRewind
        : frame < tSweep
          ? 2.2 + 1.1 * uEmitToSweep
          : frame < tStretch
            ? 3.3 + 3.5 * uSweepToStretch
            : frame < tBaby
              ? 6.8 + 27.0 * Math.pow(uStretchToBaby, 1.06)
              : 33.8 + 0.6 * uAfterBaby;

  // Expanding early cyan Hubble Sphere arc during emitAt -> stretchAt (visibly overtakes golden photon!)
  const rEarlyHubbleBly =
    frame < tEmit
      ? 1.4
      : frame < tSweep
        ? 1.4 + 0.95 * uEmitToSweep // 1.4 -> 2.35 (just behind photon!)
        : frame < tStretch
          ? 2.35 + 4.45 * uSweepToStretch // sweeps visibly right past photon at ~2.75 B ly!
          : 6.8 + 7.6 * smoothstep(uStretchToBaby); // expands to modern 14.4 B ly

  // Golden photon trajectory:
  //   emitAt -> sweepAt: emitted at 2.2, slightly dragged outward to 2.72 while outside early Hubble Sphere
  //   sweepAt -> stretchAt: overtaken around uSweepToStretch=0.22 (turnaround at 2.86!), turns homeward -> 2.15
  //   stretchAt -> babyAt: travels smoothly from 2.15 -> 0.0 right as JADES hits 33.8 B ly!
  const photonLaunched = frame >= tEmit;
  const photonArrived = frame >= tBaby - 12;
  const dPhoton =
    frame < tEmit
      ? dJades
      : frame < tSweep
        ? 2.2 + 0.52 * uEmitToSweep
        : frame < tStretch
          ? uSweepToStretch < 0.25
            ? 2.72 + 0.14 * Math.sin((uSweepToStretch / 0.25) * (Math.PI / 2))
            : 2.86 - 0.76 * smoothstep((uSweepToStretch - 0.25) / 0.75)
          : 2.1 * (1 - smoothstep(uStretchToBaby)) +
            5.8 * uStretchToBaby * (1 - uStretchToBaby) * (1 - uStretchToBaby);

  const jadesX = mwX + dJades * pxScale;
  const photonX = mwX + dPhoton * pxScale;
  const ghostX = mwX + 2.2 * pxScale;
  const ehLineX = mwX + 16.5 * pxScale;
  const earlyHubbleX = mwX + rEarlyHubbleBly * pxScale;

  const emitFlashP = normP(frame, tEmit, tEmit + 28);
  const overtakeFrame = tSweep + Math.round((tStretch - tSweep) * 0.22);
  const overtakeFlashP = normP(frame, overtakeFrame, overtakeFrame + 32);
  const arrivalFlashP = normP(frame, tBaby - 14, tBaby + 28);
  const babyPop = spring({
    frame: Math.max(0, frame - tBaby),
    fps,
    config: { damping: 16, stiffness: 115 },
  });

  // Dim red "light emitted TODAY" photon after babyAt -> immediately blocked with ✕ and swept rightward!
  const tAfterBabySec = Math.max(0, (frame - tBaby) / fps);
  const blockedPhotonStart = jadesX - 28;
  const blockedPhotonX =
    tAfterBabySec < 1.1
      ? blockedPhotonStart - 16 * Math.sin((tAfterBabySec / 1.1) * (Math.PI / 2))
      : blockedPhotonStart - 16 + (tAfterBabySec - 1.1) * 44;

  // Live top-center cosmic clock
  let clockMain = "TODAY · 33.8 B ly";
  let clockSub = "MORE THAN 2× BEYOND HORIZON";
  let clockColor = C.red;
  if (frame >= tRewind && frame < tEmit) {
    const yrsAgo = (13.5 * uRewind).toFixed(1);
    clockMain = `« ${yrsAgo} B YRS AGO`;
    clockSub = "REWINDING COSMIC TIME";
    clockColor = C.cyan;
  } else if (frame >= tEmit && frame < tStretch) {
    clockMain = "13.5 B YRS AGO";
    clockSub = frame < tSweep ? "EARLY UNIVERSE · 2.2 B ly" : "HUBBLE SPHERE OVERTAKES PHOTON";
    clockColor = C.cyan;
  } else if (frame >= tStretch && frame < tBaby) {
    const elapsed = (13.5 * uStretchToBaby).toFixed(1);
    clockMain = `${elapsed} B YRS`;
    clockSub = "LIGHT CROSSING EXPANDING SPACE";
    clockColor = C.gold;
  } else if (frame >= tBaby) {
    clockMain = "13.5 B YRS · ARRIVED";
    clockSub = "ANCIENT BABY PHOTO";
    clockColor = C.gold;
  }

  // Elastic comoving space grid lines pinned to JADES spacing
  const gridLinesX: { x: number; major: boolean }[] = [];
  const cellSpanPx = Math.max(36, dJades * pxScale);
  const subStep = Math.max(24, cellSpanPx / 4);
  for (let k = -2; k <= 40; k++) {
    const gx = mwX + k * subStep;
    if (gx >= 60 && gx <= 1870) {
      gridLinesX.push({ x: gx, major: k % 4 === 0 });
    }
  }

  const railYs = [360, 460, 560, 660, 760];

  // Physical color shift of JADES: infant hot blue-white at 2.2 B ly -> gold -> deep crimson at 33.8 B ly
  const jadesColor =
    dJades < 9
      ? lerpRgb([169, 232, 255], [255, 194, 77], clamp((dJades - 2.2) / 6.8, 0, 1))
      : lerpRgb([255, 194, 77], [255, 77, 94], clamp((dJades - 9) / 14, 0, 1));

  // Show 16.5 B ly crimson horizon whenever it's cleanly in frame
  const showHorizon = ehLineX > mwX + 95 && ehLineX < 1850;
  const horizonAlpha = showHorizon
    ? clamp((1850 - ehLineX) / 200, 0, 1) * clamp((dJades - 12) / 5, 0, 0.8)
    : 0;

  // Show expanding cyan Hubble Sphere arc vividly during emitAt -> babyAt
  const showHubbleArc = frame >= tEmit && frame < tBaby + 20 && earlyHubbleX < 1880;
  const hubbleArcAlpha = showHubbleArc
    ? clamp((frame - tEmit) / 24, 0, 1) *
      interpolate(normP(frame, tStretch + 90, tBaby), [0, 1], [0.85, 0.25])
    : 0;

  // Intro 2x bracket visibility
  const introBracketAlpha =
    frame < tRewind + 18
      ? clamp(uIntro / 0.28, 0, 1) * (1 - normP(frame, tRewind - 6, tRewind + 14))
      : 0;

  return (
    <AbsoluteFill>
      <svg
        viewBox="0 0 1920 1080"
        style={{ width: "100%", height: "100%", overflow: "hidden" }}
      >
        <defs>
          <linearGradient
            id="photonTrailJades5B"
            gradientUnits="userSpaceOnUse"
            x1={photonX}
            y1={midY}
            x2={Math.max(photonX + 1, jadesX)}
            y2={midY}
          >
            <stop offset="0%" stopColor={C.gold} stopOpacity="0.95" />
            <stop offset="100%" stopColor={C.red} stopOpacity="0.22" />
          </linearGradient>
          <linearGradient
            id="gridMaskFade5B"
            gradientUnits="userSpaceOnUse"
            x1={0}
            y1={350}
            x2={0}
            y2={770}
          >
            <stop offset="0%" stopColor={C.cyan} stopOpacity="0.06" />
            <stop offset="50%" stopColor={C.cyan} stopOpacity="0.32" />
            <stop offset="100%" stopColor={C.cyan} stopOpacity="0.06" />
          </linearGradient>
        </defs>

        {/* Elastic Comoving Space Grid contracting during rewind & expanding during flight */}
        <g>
          {railYs.map((ry, i) => (
            <line
              key={i}
              x1={80}
              y1={ry}
              x2={1840}
              y2={ry}
              stroke={ry === midY ? "rgba(62, 224, 255, 0.34)" : "rgba(62, 224, 255, 0.14)"}
              strokeWidth={ry === midY ? 2 : 1.3}
            />
          ))}
          {gridLinesX.map((gl, idx) => (
            <line
              key={idx}
              x1={gl.x}
              y1={350}
              x2={gl.x}
              y2={770}
              stroke="url(#gridMaskFade5B)"
              strokeWidth={gl.major ? 2.2 : 1.1}
              opacity={gl.major ? 0.9 : 0.44}
            />
          ))}
        </g>

        {/* Intro comparison bracket (0 -> rewindAt): 16.5 B ly vs 33.8 B ly (> 2x beyond horizon!) */}
        {introBracketAlpha > 0.01 && (
          <g opacity={introBracketAlpha}>
            <line
              x1={mwX}
              y1={305}
              x2={ehLineX}
              y2={305}
              stroke={C.red}
              strokeWidth={2.4}
            />
            <line
              x1={ehLineX}
              y1={305}
              x2={jadesX}
              y2={305}
              stroke={C.gold}
              strokeWidth={2.4}
              strokeDasharray="8 6"
            />
            <text
              x={(ehLineX + jadesX) * 0.5}
              y={284}
              textAnchor="middle"
              fill={C.gold}
              fontFamily={MONO}
              fontWeight={700}
              fontSize={22}
              letterSpacing={1.5}
              style={{ filter: svgGlow(C.gold, 5) }}
            >
              &gt; 2× BEYOND HORIZON
            </text>
          </g>
        )}

        {/* Expanding Cyan Hubble Sphere Arc sweeping past golden photon! */}
        {showHubbleArc && (
          <g opacity={hubbleArcAlpha}>
            <circle
              cx={mwX}
              cy={midY}
              r={Math.max(20, rEarlyHubbleBly * pxScale)}
              fill="rgba(62, 224, 255, 0.06)"
              stroke={C.cyan}
              strokeWidth={3.4}
              style={{ filter: svgGlow(C.cyan, 8) }}
            />
            <text
              x={Math.min(1760, earlyHubbleX + 16)}
              y={334}
              textAnchor="start"
              fill={C.cyan}
              fontFamily={MONO}
              fontWeight={700}
              fontSize={19}
              letterSpacing={1.5}
            >
              HUBBLE SPHERE
            </text>
          </g>
        )}

        {/* Vertical 16.5 B ly Cosmic Event Horizon reference line */}
        {horizonAlpha > 0.01 && (
          <g opacity={horizonAlpha}>
            <line
              x1={ehLineX}
              y1={325}
              x2={ehLineX}
              y2={795}
              stroke={C.red}
              strokeWidth={2.4}
              strokeDasharray="10 9"
              style={{ filter: svgGlow(C.red, 5) }}
            />
            <text
              x={ehLineX}
              y={826}
              textAnchor="middle"
              fill={C.red}
              fontFamily={MONO}
              fontWeight={700}
              fontSize={19}
              letterSpacing={1.4}
            >
              16.5 B ly HORIZON
            </text>
          </g>
        )}

        {/* Ghost Outline on babyAt showing 2.2 B ly BABY PHOTO vs 33.8 B ly TODAY */}
        {babyPop > 0.01 && (
          <g opacity={babyPop}>
            <SpiralGalaxyIcon
              cx={ghostX}
              cy={midY}
              r={26}
              color={C.cyan}
              rotation={-16}
              dashedGhost={true}
            />
            {/* Clean arched bridge peaking well left of JADES label so ZERO arch/digit overlap! */}
            <path
              d={`M ${ghostX.toFixed(1)} ${midY - 38} Q ${((ghostX + jadesX) * 0.48).toFixed(1)} ${midY - 190} ${(jadesX - 42).toFixed(1)} ${midY - 22}`}
              fill="none"
              stroke={C.gold}
              strokeWidth={2.4}
              strokeDasharray="9 8"
              opacity={0.78}
            />
            <line
              x1={ghostX}
              y1={midY + 34}
              x2={ghostX}
              y2={midY + 132}
              stroke={C.cyan}
              strokeWidth={1.8}
              strokeDasharray="5 5"
              opacity={0.85}
            />
            <text
              x={ghostX + 12}
              y={midY + 162}
              textAnchor="start"
              fill={C.cyan}
              fontFamily={MONO}
              fontWeight={700}
              fontSize={22}
              letterSpacing={1}
            >
              2.2 B ly (BABY PHOTO)
            </text>
          </g>
        )}

        {/* Emission flash ring on emitAt */}
        {photonLaunched && emitFlashP < 1 && (
          <circle
            cx={jadesX}
            cy={midY}
            r={18 + emitFlashP * 68}
            fill="none"
            stroke={C.gold}
            strokeWidth={3.2}
            opacity={(1 - emitFlashP) * 0.92}
          />
        )}

        {/* Hubble Sphere overtake rescue ripple during sweepAt -> stretchAt */}
        {frame >= overtakeFrame && overtakeFlashP < 1 && (
          <circle
            cx={photonX}
            cy={midY}
            r={14 + overtakeFlashP * 64}
            fill="none"
            stroke={C.cyan}
            strokeWidth={3.2}
            opacity={(1 - overtakeFlashP) * 0.92}
          />
        )}

        {/* Golden photon flight trail & wave packet */}
        {photonLaunched && !photonArrived && (
          <>
            <line
              x1={photonX}
              y1={midY}
              x2={jadesX}
              y2={midY}
              stroke="url(#photonTrailJades5B)"
              strokeWidth={3}
              strokeDasharray="6 7"
              opacity={0.55}
            />
            <PhotonWavePacket
              x={photonX}
              y={midY}
              angleDeg={180}
              color={C.gold}
              phase={(frame - tEmit) * 0.34}
              length={74}
              amp={10}
            />
          </>
        )}

        {/* Arrival glow at Milky Way telescope right before babyAt */}
        {photonArrived && arrivalFlashP < 1 && (
          <circle
            cx={mwX}
            cy={midY}
            r={28 + arrivalFlashP * 76}
            fill="none"
            stroke={C.gold}
            strokeWidth={4}
            opacity={(1 - arrivalFlashP) * 0.95}
            style={{ filter: svgGlow(C.gold, 10) }}
          />
        )}

        {/* Dim red photon leaving JADES *today* -> blocked with crisp ✕ ("NEVER REACHES")! */}
        {tAfterBabySec > 0.25 && (
          <g opacity={clamp((tAfterBabySec - 0.25) / 0.5, 0, 1)}>
            {blockedPhotonX < 1895 && (
              <PhotonWavePacket
                x={blockedPhotonX}
                y={midY + 95}
                angleDeg={180}
                color={C.red}
                phase={tAfterBabySec * 7.5}
                length={54}
                amp={7}
                opacity={clamp((1895 - blockedPhotonX) / 140, 0, 0.85)}
              />
            )}
            {/* Tiny crimson block barrier + ✕ NEVER REACHES cleanly below JADES */}
            <g transform={`translate(${jadesX - 72}, ${midY + 95})`}>
              <line
                x1={0}
                y1={-22}
                x2={0}
                y2={22}
                stroke={C.red}
                strokeWidth={3.5}
                strokeLinecap="round"
                style={{ filter: svgGlow(C.red, 6) }}
              />
              <text
                x={-14}
                y={8}
                textAnchor="end"
                fill={C.red}
                fontFamily={MONO}
                fontWeight={700}
                fontSize={21}
                letterSpacing={1.2}
                style={{ filter: svgGlow(C.red, 5) }}
              >
                ✕ NEVER REACHES
              </text>
            </g>
          </g>
        )}

        {/* Pinned Milky Way (Left) */}
        <SpiralGalaxyIcon
          cx={mwX}
          cy={midY}
          r={34}
          color={C.cyan}
          coreColor="#ffffff"
          rotation={-20 + frame * 0.04}
        />
        <text
          x={mwX}
          y={midY + 62}
          textAnchor="middle"
          fill={C.cyan}
          fontFamily={MONO}
          fontWeight={700}
          fontSize={20}
          letterSpacing={1.8}
        >
          MILKY WAY
        </text>

        {/* JADES-GS-z14-0 contracting on rewind & riding expanding space rightward */}
        <SpiralGalaxyIcon
          cx={jadesX}
          cy={midY}
          r={27}
          color={jadesColor}
          coreColor="#fff8e8"
          rotation={14 - frame * 0.05}
        />
        {/* Distance readout positioned cleanly ABOVE galaxy & clear of dashed gold arch! */}
        <text
          x={jadesX}
          y={midY - 94}
          textAnchor="middle"
          fill={jadesColor}
          fontFamily={MONO}
          fontWeight={700}
          fontSize={27}
          style={{ filter: svgGlow(jadesColor, 6) }}
        >
          {dJades.toFixed(1)} B ly
        </text>
        <text
          x={Math.max(jadesX, 425)}
          y={midY + 58}
          textAnchor="middle"
          fill={C.white}
          fontFamily={INTER}
          fontWeight={800}
          fontSize={19}
          letterSpacing={1.2}
          opacity={0.92}
        >
          {frame >= tBaby ? "JADES · TODAY" : "JADES-GS-z14-0"}
        </text>
      </svg>

      {/* Top center live cosmic clock */}
      <MinimalLabel
        text={clockMain}
        sub={clockSub}
        color={clockColor}
        x={960}
        y={78}
        align="center"
        size={40}
        delay={0}
      />

      {/* Clean bottom summary anchor on babyAt */}
      <MinimalLabel
        text="2.2 → 33.8 B ly"
        color={C.gold}
        x={960}
        y={928}
        align="center"
        size={38}
        delay={tBaby}
      />
    </AbsoluteFill>
  );
};
