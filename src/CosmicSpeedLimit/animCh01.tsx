import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, glow, INTER, MONO, svgGlow } from "../FiveHundredMileEmail/theme";
import { CleanPhotoPlate, CleanPortrait, MinimalLabel } from "./ui";

// ===========================================================================
// Shared Math & Clean Vector Helpers (ES2015-safe, monotonic, zero loops)
// ===========================================================================
function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function easeOutCubic(t: number): number {
  const u = 1 - clamp01(t);
  return 1 - u * u * u;
}

function easeInOutCubic(t: number): number {
  const u = clamp01(t);
  return u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * clamp01(t);
}

function formatCommas(n: number): string {
  const s = String(Math.max(0, Math.round(n)));
  let out = "";
  for (let i = 0; i < s.length; i++) {
    const rem = s.length - i;
    if (i > 0 && rem % 3 === 0) out += ",";
    out += s[i];
  }
  return out;
}

function mixHex(hexA: string, hexB: string, t: number): string {
  const u = clamp01(t);
  const a = parseInt(hexA.slice(1), 16);
  const b = parseInt(hexB.slice(1), 16);
  const r = Math.round(((a >> 16) & 255) + (((b >> 16) & 255) - ((a >> 16) & 255)) * u);
  const g = Math.round(((a >> 8) & 255) + (((b >> 8) & 255) - ((a >> 8) & 255)) * u);
  const bl = Math.round((a & 255) + ((b & 255) - (a & 255)) * u);
  const toHex = (n: number) => {
    const s = Math.max(0, Math.min(255, n)).toString(16);
    return s.length < 2 ? "0" + s : s;
  };
  return "#" + toHex(r) + toHex(g) + toHex(bl);
}

function redshiftColor(zNorm: number): string {
  const u = clamp01(zNorm);
  if (u < 0.5) {
    return mixHex("#eaf3ff", "#ff9e44", u * 2);
  }
  return mixHex("#ff9e44", "#ff4358", (u - 0.5) * 2);
}

// Crisp minimalist vector rocket pointing right, nose at (0, 0)
const SleekRocket: React.FC<{
  x: number;
  y: number;
  scale?: number;
  thrust?: number;
  opacity?: number;
  angle?: number;
  flameColor?: string;
}> = ({
  x,
  y,
  scale = 1,
  thrust = 0.7,
  opacity = 1,
  angle = 0,
  flameColor = C.cyan,
}) => {
  const flameLen = 28 + clamp01(thrust) * 86;
  return (
    <g
      transform={`translate(${x}, ${y}) rotate(${angle}) scale(${scale})`}
      opacity={opacity}
    >
      {thrust > 0.02 && (
        <g>
          <path
            d={`M -72 -10 Q ${-72 - flameLen * 0.55} -5.5 ${-72 - flameLen} 0 Q ${-72 - flameLen * 0.55} 5.5 -72 10 Z`}
            fill={flameColor}
            opacity={0.48 + 0.42 * clamp01(thrust)}
            style={{ filter: svgGlow(flameColor, 7) }}
          />
          <path
            d={`M -72 -4.8 Q ${-72 - flameLen * 0.35} -2 ${-72 - flameLen * 0.64} 0 Q ${-72 - flameLen * 0.35} 2 -72 4.8 Z`}
            fill="#ffffff"
            opacity={0.92}
          />
        </g>
      )}
      <path
        d="M -68 -11 L -80 -26 L -54 -14 Z"
        fill="#3b82f6"
        stroke={C.cyan}
        strokeWidth={1.2}
      />
      <path
        d="M -68 11 L -80 26 L -54 14 Z"
        fill="#3b82f6"
        stroke={C.cyan}
        strokeWidth={1.2}
      />
      <path
        d="M 0 0 C -14 -12 -38 -15 -68 -12 L -74 -7 L -74 7 L -68 12 C -38 15 -14 12 0 0 Z"
        fill="#eaf2ff"
        stroke="#9cc7ff"
        strokeWidth={1.6}
      />
      <path
        d="M -2 0 C -14 -7 -32 -9 -56 -8"
        fill="none"
        stroke="#ffffff"
        strokeWidth={2}
        opacity={0.78}
      />
      <ellipse
        cx={-28}
        cy={0}
        rx={7}
        ry={4.5}
        fill="#081634"
        stroke={C.cyan}
        strokeWidth={1.5}
      />
    </g>
  );
};

// Crisp glowing spiral galaxy marker
const SpiralGalaxy: React.FC<{
  x: number;
  y: number;
  radius?: number;
  color?: string;
  angle?: number;
  opacity?: number;
}> = ({ x, y, radius = 22, color = "#eaf3ff", angle = 0, opacity = 1 }) => {
  const s = radius / 22;
  return (
    <g
      transform={`translate(${x}, ${y}) rotate(${angle}) scale(${s})`}
      opacity={opacity}
    >
      <circle cx={0} cy={0} r={22} fill={color} opacity={0.16} />
      <circle cx={0} cy={0} r={12} fill={color} opacity={0.3} />
      <path
        d="M 0 0 C 7 -2 13 -9 18 -14 C 12 -4 6 2 0 3"
        fill="none"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        opacity={0.88}
      />
      <path
        d="M 0 0 C -7 2 -13 9 -18 14 C -12 4 -6 -2 0 -3"
        fill="none"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        opacity={0.88}
      />
      <path
        d="M 0 0 C 2 7 9 12 14 14"
        fill="none"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        opacity={0.56}
      />
      <path
        d="M 0 0 C -2 -7 -9 -12 -14 -14"
        fill="none"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        opacity={0.56}
      />
      <circle cx={0} cy={0} r={4.8} fill="#ffffff" />
    </g>
  );
};

// Animated crisp crimson cross stamp (monotonic draw-in + shock ring)
const CrimsonCross: React.FC<{
  x: number;
  y: number;
  size?: number;
  progress: number;
  color?: string;
}> = ({ x, y, size = 34, progress, color = C.red }) => {
  if (progress <= 0.01) return null;
  const s1 = easeOutCubic(progress * 1.9);
  const s2 = easeOutCubic((progress - 0.25) * 1.9);
  const ring = easeOutCubic(progress);
  const diag = size * 2.85;
  return (
    <g transform={`translate(${x}, ${y})`}>
      <circle
        cx={0}
        cy={0}
        r={size * (0.7 + ring * 1.15)}
        fill="none"
        stroke={color}
        strokeWidth={3}
        opacity={0.75 * (1 - ring * 0.78)}
      />
      <line
        x1={-size}
        y1={-size}
        x2={size}
        y2={size}
        stroke={color}
        strokeWidth={Math.max(6, size * 0.24)}
        strokeLinecap="round"
        strokeDasharray={`${diag}`}
        strokeDashoffset={`${diag * (1 - s1)}`}
        style={{ filter: svgGlow(color, 7) }}
      />
      <line
        x1={size}
        y1={-size}
        x2={-size}
        y2={size}
        stroke={color}
        strokeWidth={Math.max(6, size * 0.24)}
        strokeLinecap="round"
        strokeDasharray={`${diag}`}
        strokeDashoffset={`${diag * (1 - s2)}`}
        style={{ filter: svgGlow(color, 7) }}
      />
    </g>
  );
};

// Sleek space telescope hexagonal dish facing right
const TelescopeDish: React.FC<{ x: number; y: number; scale?: number }> = ({
  x,
  y,
  scale = 1,
}) => {
  const hexOffsets = [
    { ox: 0, oy: 0 },
    { ox: -10, oy: -34 },
    { ox: 10, oy: 34 },
    { ox: -30, oy: -14 },
    { ox: -20, oy: 20 },
    { ox: 20, oy: -20 },
    { ox: 30, oy: 14 },
  ];
  const hexPoly = (cx: number, cy: number, rx: number, ry: number) => {
    const pts: string[] = [];
    for (let k = 0; k < 6; k++) {
      const a = (k * Math.PI) / 3 + Math.PI / 6;
      pts.push(
        (cx + Math.cos(a) * rx).toFixed(1) + "," + (cy + Math.sin(a) * ry).toFixed(1),
      );
    }
    return pts.join(" ");
  };
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <polygon
        points="-120,82 15,58 130,90 -8,125"
        fill="rgba(18, 36, 78, 0.8)"
        stroke="rgba(62, 224, 255, 0.4)"
        strokeWidth={1.8}
      />
      <g transform="rotate(-14)">
        {hexOffsets.map((h, i) => (
          <polygon
            key={i}
            points={hexPoly(h.ox, h.oy, 18, 20)}
            fill="rgba(255, 194, 77, 0.85)"
            stroke="#fff4c4"
            strokeWidth={1.8}
            style={i === 0 ? { filter: svgGlow(C.gold, 8) } : undefined}
          />
        ))}
      </g>
      <line x1={-6} y1={-54} x2={116} y2={-18} stroke="#94a3b8" strokeWidth={2.5} />
      <line x1={18} y1={52} x2={116} y2={-18} stroke="#94a3b8" strokeWidth={2.5} />
      <circle cx={116} cy={-18} r={9} fill="#1e293b" stroke={C.gold} strokeWidth={2.4} />
    </g>
  );
};

// ===========================================================================
// 1. SpeedLimitWallAnim — Ch 0 (0:00.4–0:06.2): Golden Photon Racing to c Wall
// ===========================================================================
export const SpeedLimitWallAnim: React.FC<{ wallAt: number }> = ({ wallAt }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const dur = Math.max(60, durationInFrames);
  const startX = 165;
  const wallX = 1510;
  const cy = 535;

  // Photon races smoothly from startX to wallX right by wallAt, then surges into barrier
  const hitFrame = Math.max(36, Math.min(dur - 18, wallAt));
  const raceP = clamp01(frame / hitFrame);
  const photonX = lerp(startX, wallX - 8, easeOutCubic(raceP * 0.35) * 0.25 + raceP * 0.75);

  // Speedometer climbs monotonically to 300,000 km/s
  const speedNorm = clamp01(raceP);
  const curKmS = Math.round(speedNorm * 300000);
  const curBeta = speedNorm;

  // Wall barrier blooms intensely at wallAt and expands shockwave all the way to dur
  const wallBoost = spring({
    frame: Math.max(0, frame - hitFrame + 8),
    fps,
    config: { damping: 14, stiffness: 120 },
  });
  const postHitT =
    frame > hitFrame
      ? clamp01((frame - hitFrame) / Math.max(18, dur - hitFrame))
      : 0;
  const wallOpacity = 0.28 + 0.72 * wallBoost;

  // Golden sinusoidal light wave behind photon
  const waveLen = Math.min(540, Math.max(85, photonX - startX));
  const wavePts: string[] = [];
  const waveSteps = 56;
  for (let i = 0; i <= waveSteps; i++) {
    const frac = i / waveSteps;
    const wx = photonX - waveLen * (1 - frac);
    const env = Math.sin(frac * Math.PI);
    const wy = cy + Math.sin((wx - frame * 11) * 0.085) * 18 * env;
    wavePts.push((i === 0 ? "M " : "L ") + wx.toFixed(1) + " " + wy.toFixed(1));
  }
  const wavePath = wavePts.join(" ");

  // Ambient cosmic speed ticks scrolling smoothly leftward
  const speedTicks = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <AbsoluteFill>
      <svg
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <linearGradient
            id="csl01PhotonBeam"
            gradientUnits="userSpaceOnUse"
            x1={Math.max(startX, photonX - 680)}
            y1={cy}
            x2={Math.max(startX + 4, photonX)}
            y2={cy}
          >
            <stop offset="0%" stopColor={C.gold} stopOpacity={0} />
            <stop offset="52%" stopColor={C.gold} stopOpacity={0.78} />
            <stop offset="100%" stopColor="#fff8dc" stopOpacity={1} />
          </linearGradient>
          <linearGradient
            id="csl01WallGrad"
            gradientUnits="userSpaceOnUse"
            x1={wallX}
            y1={120}
            x2={wallX}
            y2={960}
          >
            <stop offset="0%" stopColor={C.gold} stopOpacity={0} />
            <stop offset="14%" stopColor={C.gold} stopOpacity={0.95} />
            <stop offset="50%" stopColor="#ffffff" stopOpacity={1} />
            <stop offset="86%" stopColor={C.gold} stopOpacity={0.95} />
            <stop offset="100%" stopColor={C.gold} stopOpacity={0} />
          </linearGradient>
          <linearGradient
            id="csl01MeterGrad"
            gradientUnits="userSpaceOnUse"
            x1={startX}
            y1={740}
            x2={wallX}
            y2={740}
          >
            <stop offset="0%" stopColor={C.cyan} />
            <stop offset="65%" stopColor={C.gold} />
            <stop offset="100%" stopColor="#fff4cc" />
          </linearGradient>
        </defs>

        {/* Subtle space track + tick ruler */}
        <line
          x1={startX}
          y1={cy}
          x2={wallX}
          y2={cy}
          stroke="rgba(127, 147, 196, 0.22)"
          strokeWidth={2}
          strokeDasharray="8 14"
        />
        {speedTicks.map((t) => {
          const tx = lerp(startX, wallX, t / 10);
          return (
            <line
              key={t}
              x1={tx}
              y1={cy + 98}
              x2={tx}
              y2={cy + (t % 5 === 0 ? 116 : 108)}
              stroke="rgba(127, 147, 196, 0.34)"
              strokeWidth={t % 5 === 0 ? 2 : 1.3}
            />
          );
        })}

        {/* Forbidden crimson zone right of c wall */}
        <rect
          x={wallX}
          y={120}
          width={410}
          height={840}
          fill="rgba(255, 77, 94, 0.065)"
          opacity={wallOpacity}
        />

        {/* Glowing Vertical c Light Barrier */}
        <g opacity={wallOpacity}>
          <rect
            x={wallX - 24}
            y={140}
            width={48}
            height={800}
            fill={C.gold}
            opacity={0.1 + 0.16 * wallBoost + 0.12 * postHitT}
            style={{ filter: svgGlow(C.gold, 16) }}
          />
          <line
            x1={wallX}
            y1={120}
            x2={wallX}
            y2={960}
            stroke="url(#csl01WallGrad)"
            strokeWidth={6 + postHitT * 3}
            style={{ filter: svgGlow(C.gold, 10) }}
          />
          {/* Expanding barrier impact shockwaves when photon hits c */}
          {postHitT > 0 && (
            <g>
              <ellipse
                cx={wallX}
                cy={cy}
                rx={12 + easeOutCubic(postHitT) * 44}
                ry={36 + easeOutCubic(postHitT) * 340}
                fill="none"
                stroke={C.gold}
                strokeWidth={3.5}
                opacity={0.9 * (1 - postHitT * 0.72)}
                style={{ filter: svgGlow(C.gold, 8) }}
              />
              <ellipse
                cx={wallX}
                cy={cy}
                rx={6 + postHitT * 78}
                ry={22 + postHitT * 210}
                fill="none"
                stroke={C.red}
                strokeWidth={2.5}
                opacity={0.75 * (1 - postHitT * 0.6)}
              />
            </g>
          )}
        </g>

        {/* Golden Photon Beam + Sinusoidal Light Wave */}
        <line
          x1={Math.max(startX, photonX - 680)}
          y1={cy}
          x2={photonX}
          y2={cy}
          stroke="url(#csl01PhotonBeam)"
          strokeWidth={8}
          strokeLinecap="round"
          style={{ filter: svgGlow(C.gold, 9) }}
        />
        <path
          d={wavePath}
          fill="none"
          stroke="#fff0b8"
          strokeWidth={3}
          opacity={0.92}
        />
        <circle
          cx={photonX}
          cy={cy}
          r={18 + postHitT * 8}
          fill={C.gold}
          opacity={0.42}
          style={{ filter: svgGlow(C.gold, 12) }}
        />
        <circle cx={photonX} cy={cy} r={7} fill="#ffffff" />

        {/* Live Speedometer Bar below track */}
        <rect
          x={startX}
          y={732}
          width={wallX - startX}
          height={16}
          rx={8}
          fill="rgba(127, 147, 196, 0.16)"
        />
        <rect
          x={startX}
          y={732}
          width={Math.max(12, (wallX - startX) * speedNorm)}
          height={16}
          rx={8}
          fill="url(#csl01MeterGrad)"
          style={{ filter: svgGlow(C.gold, 6) }}
        />

        {/* Live Digital Speed Readout */}
        <text
          x={840}
          y={848}
          textAnchor="middle"
          fill={speedNorm > 0.94 ? C.gold : C.white}
          fontFamily={MONO}
          fontWeight={700}
          fontSize={64}
          style={{ filter: svgGlow(speedNorm > 0.94 ? C.gold : C.cyan, 10) }}
        >
          {formatCommas(curKmS)} km/s
        </text>
        <text
          x={840}
          y={892}
          textAnchor="middle"
          fill={C.dim}
          fontFamily={MONO}
          fontWeight={700}
          fontSize={24}
        >
          {curBeta.toFixed(2)} c
        </text>

        {/* Forbidden Zone Symbol */}
        <text
          x={wallX + 190}
          y={cy + 14}
          textAnchor="middle"
          fill={C.red}
          fontFamily={MONO}
          fontWeight={700}
          fontSize={44}
          opacity={wallOpacity * (0.45 + 0.55 * postHitT)}
          style={{ filter: svgGlow(C.red, 8) }}
        >
          v &gt; c
        </text>
      </svg>

      <MinimalLabel
        text="c = 300,000 km/s"
        sub="UNBREAKABLE LIMIT"
        color={C.gold}
        x={wallX}
        y={46}
        align="center"
        size={34}
        delay={Math.max(0, Math.round(hitFrame * 0.4))}
      />
      <MinimalLabel
        text="LIGHT"
        color={C.gold}
        x={startX}
        y={438}
        align="left"
        size={26}
        delay={0}
      />
    </AbsoluteFill>
  );
};

// ===========================================================================
// 2. BlockedBySpeedLimitAnim — Ch 0 (0:09.4–0:14.7): 3-Lane Race vs c Wall
// ===========================================================================
export const BlockedBySpeedLimitAnim: React.FC<{
  radioAt: number;
  particleAt: number;
}> = ({ radioAt, particleAt }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const dur = Math.max(90, durationInFrames);
  const startX = 165;
  const wallX = 1480;

  // Lane 1: Rocket (0 -> hits wall quickly around 26f, then strains continuously)
  const rHit = Math.max(20, Math.min(34, radioAt * 0.72));
  const rP = clamp01(frame / rHit);
  const rStrain = frame > rHit ? clamp01((frame - rHit) / Math.max(20, dur - rHit)) : 0;
  const rocketX =
    lerp(startX + 45, wallX - 78, easeOutCubic(rP)) + rStrain * 14;
  const rocketCrossP = frame >= rHit - 2 ? clamp01((frame - (rHit - 2)) / 20) : 0;

  // Lane 2: Radio Wave (radioAt -> hits wall & caps at c)
  const radHit = Math.max(radioAt + 18, Math.min(radioAt + 32, particleAt * 0.92));
  const radVisible = frame >= radioAt - 2;
  const radP = clamp01((frame - radioAt) / Math.max(14, radHit - radioAt));
  const radStrain =
    frame > radHit ? clamp01((frame - radHit) / Math.max(20, dur - radHit)) : 0;
  const radioX = lerp(startX + 55, wallX - 36, easeOutCubic(radP)) + radStrain * 8;
  const radioCrossP =
    frame >= radHit - 2 ? clamp01((frame - (radHit - 2)) / 20) : 0;

  // Lane 3: Subatomic Particle (particleAt -> hits wall & gets X)
  const partHit = Math.min(dur - 12, particleAt + 22);
  const partVisible = frame >= particleAt - 2;
  const partP = clamp01((frame - particleAt) / Math.max(14, partHit - particleAt));
  const partStrain =
    frame > partHit ? clamp01((frame - partHit) / Math.max(16, dur - partHit)) : 0;
  const partX = lerp(startX + 40, wallX - 28, easeOutCubic(partP)) + partStrain * 6;
  const partCrossP =
    frame >= partHit - 2 ? clamp01((frame - (partHit - 2)) / 18) : 0;

  const wallEnergy = 0.55 + 0.45 * clamp01(frame / dur);

  return (
    <AbsoluteFill>
      <svg
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <linearGradient
            id="csl02Wall"
            gradientUnits="userSpaceOnUse"
            x1={wallX}
            y1={120}
            x2={wallX}
            y2={965}
          >
            <stop offset="0%" stopColor={C.gold} stopOpacity={0} />
            <stop offset="12%" stopColor={C.gold} stopOpacity={0.95} />
            <stop offset="50%" stopColor="#ffffff" stopOpacity={1} />
            <stop offset="88%" stopColor={C.gold} stopOpacity={0.95} />
            <stop offset="100%" stopColor={C.gold} stopOpacity={0} />
          </linearGradient>
          <linearGradient
            id="csl02PartBeam"
            gradientUnits="userSpaceOnUse"
            x1={Math.max(startX, partX - 360)}
            y1={810}
            x2={Math.max(startX + 4, partX)}
            y2={810}
          >
            <stop offset="0%" stopColor="#a855f7" stopOpacity={0} />
            <stop offset="60%" stopColor="#c084fc" stopOpacity={0.78} />
            <stop offset="100%" stopColor={C.cyan} stopOpacity={1} />
          </linearGradient>
        </defs>

        {/* 3 Lane guide hairlines */}
        {[290, 550, 810].map((ly, idx) => (
          <line
            key={idx}
            x1={startX}
            y1={ly}
            x2={wallX}
            y2={ly}
            stroke="rgba(127, 147, 196, 0.18)"
            strokeWidth={2}
            strokeDasharray="6 14"
          />
        ))}

        {/* Forbidden zone beyond wall */}
        <rect
          x={wallX}
          y={120}
          width={440}
          height={845}
          fill="rgba(255, 77, 94, 0.06)"
        />

        {/* Vertical c Barrier */}
        <rect
          x={wallX - 18}
          y={135}
          width={36}
          height={815}
          fill={C.gold}
          opacity={0.14 + 0.12 * wallEnergy}
          style={{ filter: svgGlow(C.gold, 14) }}
        />
        <line
          x1={wallX}
          y1={120}
          x2={wallX}
          y2={965}
          stroke="url(#csl02Wall)"
          strokeWidth={6}
          style={{ filter: svgGlow(C.gold, 9) }}
        />

        {/* LANE 1: ROCKET (y = 290) */}
        <g>
          {rocketCrossP > 0.01 && (
            <path
              d={`M ${wallX - 10} 230 Q ${wallX - 72} 290 ${wallX - 10} 350`}
              fill="none"
              stroke={C.red}
              strokeWidth={4}
              opacity={rocketCrossP * 0.9}
              style={{ filter: svgGlow(C.red, 7) }}
            />
          )}
          <SleekRocket
            x={rocketX}
            y={290}
            scale={1.32}
            thrust={0.55 + 0.45 * rP}
            flameColor={rocketCrossP > 0.2 ? C.gold : C.cyan}
          />
          <CrimsonCross x={wallX + 95} y={290} size={32} progress={rocketCrossP} />
          {rocketCrossP > 0.2 && (
            <text
              x={wallX + 195}
              y={299}
              fill={C.red}
              fontFamily={MONO}
              fontWeight={700}
              fontSize={28}
              opacity={rocketCrossP}
            >
              &lt; c
            </text>
          )}
        </g>

        {/* LANE 2: RADIO WAVE (y = 550) */}
        {radVisible && (
          <g opacity={clamp01((frame - radioAt + 2) / 10)}>
            {[0, 1, 2, 3, 4].map((k) => {
              const ax = radioX - k * 28;
              const rad = 46 - k * 6;
              return (
                <path
                  key={k}
                  d={`M ${ax - 16} ${550 - rad} A ${rad} ${rad} 0 0 1 ${ax - 16} ${550 + rad}`}
                  fill="none"
                  stroke={radioCrossP > 0.3 && k === 0 ? C.gold : C.cyan}
                  strokeWidth={3.8 - k * 0.55}
                  strokeLinecap="round"
                  opacity={1 - k * 0.18}
                  style={k === 0 ? { filter: svgGlow(C.cyan, 7) } : undefined}
                />
              );
            })}
            {radioCrossP > 0.01 && (
              <ellipse
                cx={wallX}
                cy={550}
                rx={10 + radStrain * 22}
                ry={34 + radStrain * 64}
                fill="none"
                stroke={C.gold}
                strokeWidth={3}
                opacity={0.85 * (1 - radStrain * 0.55)}
              />
            )}
            <CrimsonCross x={wallX + 95} y={550} size={32} progress={radioCrossP} />
            {radioCrossP > 0.2 && (
              <text
                x={wallX + 195}
                y={559}
                fill={C.gold}
                fontFamily={MONO}
                fontWeight={700}
                fontSize={28}
                opacity={radioCrossP}
              >
                MAX c
              </text>
            )}
          </g>
        )}

        {/* LANE 3: SUBATOMIC PARTICLE (y = 810) */}
        {partVisible && (
          <g opacity={clamp01((frame - particleAt + 2) / 10)}>
            <line
              x1={Math.max(startX, partX - 360)}
              y1={810}
              x2={partX}
              y2={810}
              stroke="url(#csl02PartBeam)"
              strokeWidth={6}
              strokeLinecap="round"
              style={{ filter: svgGlow("#c084fc", 7) }}
            />
            <circle
              cx={partX}
              cy={810}
              r={15}
              fill={C.cyan}
              opacity={0.38}
              style={{ filter: svgGlow(C.cyan, 10) }}
            />
            <circle cx={partX} cy={810} r={6} fill="#ffffff" />
            {partCrossP > 0.01 && (
              <circle
                cx={wallX - 6}
                cy={810}
                r={14 + partStrain * 68}
                fill="none"
                stroke="#c084fc"
                strokeWidth={3}
                opacity={0.85 * (1 - partStrain * 0.65)}
              />
            )}
            <CrimsonCross x={wallX + 95} y={810} size={32} progress={partCrossP} />
            {partCrossP > 0.2 && (
              <text
                x={wallX + 195}
                y={819}
                fill={C.red}
                fontFamily={MONO}
                fontWeight={700}
                fontSize={28}
                opacity={partCrossP}
              >
                &lt; c
              </text>
            )}
          </g>
        )}
      </svg>

      <MinimalLabel
        text="c = 300,000 km/s"
        color={C.gold}
        x={wallX}
        y={48}
        align="center"
        size={34}
        delay={0}
      />
      <MinimalLabel
        text="ROCKET"
        color={C.cyan}
        x={startX}
        y={224}
        align="left"
        size={24}
        delay={0}
      />
      <MinimalLabel
        text="RADIO WAVE"
        color={C.cyan}
        x={startX}
        y={484}
        align="left"
        size={24}
        delay={Math.max(0, radioAt - 4)}
      />
      <MinimalLabel
        text="PARTICLE"
        color="#c084fc"
        x={startX}
        y={744}
        align="left"
        size={24}
        delay={Math.max(0, particleAt - 4)}
      />
    </AbsoluteFill>
  );
};

// ===========================================================================
// 3. JwstParadoxAnim — Ch 0 (0:14.7–0:31.4): Continuous Zoom on JADES-GS-z14-0
// ===========================================================================
export const JwstParadoxAnim: React.FC<{
  zoomAt: number;
  arrowAt: number;
}> = ({ zoomAt, arrowAt }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const dur = Math.max(120, durationInFrames);

  // Exact crimson pinpoint galaxy center in jwst-deepfield.jpg: (1298, 540)
  const gx = 1298;
  const gy = 540;

  // Continuous monotonic zoom across 100% of durationInFrames, locked on (gx, gy)
  const safeZoomAt = Math.max(12, zoomAt);
  const preZoom = interpolate(frame, [0, safeZoomAt], [1.0, 1.11], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const postZoomU = clamp01((frame - safeZoomAt) / Math.max(30, dur - safeZoomAt));
  const postZoom =
    frame > safeZoomAt
      ? 0.42 * (0.45 * easeOutCubic(Math.min(1, postZoomU * 2.2)) + 0.55 * postZoomU)
      : 0;
  const totalZoom = preZoom + postZoom; // 1.0 -> 1.53 continuously!

  // Target reticle locks on zoomAt + continuous subtle vernier turn to scene end
  const lockP = spring({
    frame: Math.max(0, frame - safeZoomAt),
    fps,
    config: { damping: 16, stiffness: 115 },
  });
  const reticleOpacity = frame < safeZoomAt - 2 ? 0 : Math.min(1, lockP * 1.25);
  const reticleR = lerp(128, 46, lockP);
  const reticleRot = lerp(-36, 0, lockP) + postZoomU * 28;

  // Outward velocity arrow stretches continuously 1x c -> 2.3x c ALL THE WAY to dur!
  const safeArrowAt = Math.max(safeZoomAt + 12, arrowAt);
  const arrowU = clamp01((frame - safeArrowAt) / Math.max(30, dur - safeArrowAt));
  // Reaches ~2.05x quickly so viewer sees >2x right away, then climbs continuously to 2.36x
  const arrowProgress =
    frame >= safeArrowAt
      ? 0.82 * easeOutCubic(Math.min(1, arrowU * 2.4)) + 0.18 * arrowU
      : 0;

  const arrowStartX = gx + 58;
  const arrowMaxLen = 452;
  const arrowCurLen = arrowMaxLen * arrowProgress;
  const arrowTipX = arrowStartX + arrowCurLen;

  const speedMult = lerp(0.35, 2.36, arrowProgress);
  const oneCX = arrowStartX + arrowMaxLen * (1.0 / 2.36);
  const twoCX = arrowStartX + arrowMaxLen * (2.0 / 2.36);
  const passedC = speedMult >= 1.0;

  return (
    <AbsoluteFill style={{ backgroundColor: "#050a18", overflow: "hidden" }}>
      {/* Full-bleed JWST deep-field plate zooming strictly around (1298, 540) */}
      <AbsoluteFill
        style={{
          transformOrigin: `${gx}px ${gy}px`,
          transform: `scale(${totalZoom})`,
        }}
      >
        <CleanPhotoPlate
          src="cosmiclimit/jwst-deepfield.jpg"
          kenBurnsFrom={1.0}
          kenBurnsTo={1.0}
          dim={0.2}
        />
      </AbsoluteFill>

      <svg
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <linearGradient
            id="csl03JadesArrow"
            gradientUnits="userSpaceOnUse"
            x1={arrowStartX}
            y1={gy}
            x2={arrowStartX + arrowMaxLen}
            y2={gy}
          >
            <stop offset="0%" stopColor={C.cyan} />
            <stop offset="44%" stopColor={C.gold} />
            <stop offset="100%" stopColor={C.red} />
          </linearGradient>
        </defs>

        {/* Subtle crimson accent halo around pinpoint galaxy */}
        <circle
          cx={gx}
          cy={gy}
          r={24 + postZoomU * 10}
          fill={C.red}
          opacity={0.18 + postZoomU * 0.1}
          style={{ filter: svgGlow(C.red, 10) }}
        />

        {/* Sleek Target Reticle locking onto JADES-GS-z14-0 */}
        {reticleOpacity > 0.01 && (
          <g
            transform={`translate(${gx}, ${gy}) rotate(${reticleRot})`}
            opacity={reticleOpacity}
          >
            <circle
              cx={0}
              cy={0}
              r={reticleR}
              fill="none"
              stroke={C.red}
              strokeWidth={2.5}
              strokeDasharray="10 8"
              style={{ filter: svgGlow(C.red, 7) }}
            />
            <circle
              cx={0}
              cy={0}
              r={reticleR + 14}
              fill="none"
              stroke={C.gold}
              strokeWidth={1.3}
              strokeDasharray="4 14"
              opacity={0.62}
            />
            {[0, 90, 180, 270].map((deg) => (
              <g key={deg} transform={`rotate(${deg})`}>
                <path
                  d={`M ${reticleR - 14} ${-reticleR} L ${reticleR} ${-reticleR} L ${reticleR} ${-reticleR + 14}`}
                  fill="none"
                  stroke={C.gold}
                  strokeWidth={3.4}
                  strokeLinecap="round"
                />
              </g>
            ))}
          </g>
        )}

        {/* Outward velocity arrow stretching continuously 1x c -> 2.3x c */}
        {frame >= safeArrowAt && arrowCurLen > 4 && (
          <g>
            {/* 1x c reference tick */}
            {arrowTipX >= oneCX - 18 && (
              <g opacity={clamp01((arrowTipX - (oneCX - 18)) / 32)}>
                <line
                  x1={oneCX}
                  y1={gy - 42}
                  x2={oneCX}
                  y2={gy + 42}
                  stroke={C.cyan}
                  strokeWidth={2.5}
                  strokeDasharray="5 5"
                />
                <text
                  x={oneCX}
                  y={gy + 74}
                  textAnchor="middle"
                  fill={C.cyan}
                  fontFamily={MONO}
                  fontWeight={700}
                  fontSize={22}
                >
                  1× c
                </text>
              </g>
            )}

            {/* 2x c reference tick */}
            {arrowTipX >= twoCX - 18 && (
              <g opacity={clamp01((arrowTipX - (twoCX - 18)) / 32)}>
                <line
                  x1={twoCX}
                  y1={gy - 36}
                  x2={twoCX}
                  y2={gy + 36}
                  stroke={C.gold}
                  strokeWidth={2.4}
                  strokeDasharray="4 6"
                  opacity={0.85}
                />
                <text
                  x={twoCX}
                  y={gy + 72}
                  textAnchor="middle"
                  fill={C.gold}
                  fontFamily={MONO}
                  fontWeight={700}
                  fontSize={22}
                >
                  2× c
                </text>
              </g>
            )}

            {/* Glowing velocity vector shaft */}
            <line
              x1={arrowStartX}
              y1={gy}
              x2={Math.max(arrowStartX + 4, arrowTipX - 18)}
              y2={gy}
              stroke="url(#csl03JadesArrow)"
              strokeWidth={8.5}
              strokeLinecap="round"
              style={{ filter: svgGlow(passedC ? C.red : C.cyan, 8) }}
            />
            <polygon
              points="0,0 -24,-13 -24,13"
              fill={passedC ? C.red : C.cyan}
              transform={`translate(${arrowTipX}, ${gy})`}
              style={{ filter: svgGlow(passedC ? C.red : C.cyan, 7) }}
            />

            {/* Live crisp velocity readout above arrow tip */}
            <text
              x={Math.min(1765, arrowTipX - 8)}
              y={gy - 36}
              textAnchor="middle"
              fill={passedC ? C.gold : C.cyan}
              fontFamily={MONO}
              fontWeight={700}
              fontSize={46}
              style={{ filter: svgGlow(passedC ? C.gold : C.cyan, 8) }}
            >
              {speedMult.toFixed(2)}× c
            </text>
          </g>
        )}
      </svg>

      <MinimalLabel
        text="JADES-GS-z14-0"
        sub="JWST · REAL GALAXY"
        color={C.gold}
        x={gx}
        y={gy - 144}
        align="center"
        size={34}
        delay={safeZoomAt + 2}
      />
    </AbsoluteFill>
  );
};

// ===========================================================================
// 4. ManyGalaxiesRecedingAnim — Ch 0 (0:31.4–0:39.4): 24 Galaxies Ignite > c
// ===========================================================================
const COSMOS_24_GALAXIES = [
  // First entry is JADES-GS-z14-0 anchor near right-center
  { ang: -4, r0: 290, tilt: 12, size: 22 },
  { ang: -162, r0: 255, tilt: -22, size: 17 },
  { ang: -132, r0: 310, tilt: 34, size: 18 },
  { ang: -98, r0: 270, tilt: -14, size: 16 },
  { ang: -56, r0: 280, tilt: 28, size: 18 },
  { ang: -24, r0: 350, tilt: -18, size: 17 },
  { ang: 16, r0: 335, tilt: 22, size: 18 },
  { ang: 46, r0: 295, tilt: -30, size: 16 },
  { ang: 84, r0: 265, tilt: 16, size: 17 },
  { ang: 124, r0: 300, tilt: -24, size: 18 },
  { ang: 158, r0: 295, tilt: 19, size: 17 },
  { ang: 176, r0: 410, tilt: -12, size: 19 },
  { ang: -172, r0: 545, tilt: 25, size: 18 },
  { ang: -148, r0: 495, tilt: -28, size: 19 },
  { ang: -116, r0: 440, tilt: 14, size: 17 },
  { ang: -38, r0: 515, tilt: -16, size: 19 },
  { ang: -14, r0: 580, tilt: 32, size: 20 },
  { ang: 8, r0: 535, tilt: -20, size: 19 },
  { ang: 28, r0: 490, tilt: 12, size: 18 },
  { ang: 60, r0: 445, tilt: -34, size: 17 },
  { ang: 112, r0: 435, tilt: 24, size: 18 },
  { ang: 142, r0: 510, tilt: -18, size: 19 },
  { ang: 166, r0: 615, tilt: 20, size: 18 },
  { ang: -158, r0: 670, tilt: -15, size: 18 },
];

export const ManyGalaxiesRecedingAnim: React.FC<{ mostAt: number }> = ({
  mostAt,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const dur = Math.max(90, durationInFrames);
  const cx = 960;
  const cy = 555;

  // Starts zoomed near JADES-GS-z14-0 (cx + 290, cy - 20) and pulls continuously wide!
  const pullU = clamp01(frame / dur);
  const camScale = lerp(1.72, 1.0, easeOutCubic(Math.min(1, pullU * 1.45)) * 0.8 + pullU * 0.2);
  const camShiftX = lerp(-245, 0, easeOutCubic(Math.min(1, pullU * 1.6)));
  const camShiftY = lerp(16, 0, easeOutCubic(Math.min(1, pullU * 1.6)));

  // Continuous radial cosmic drift
  const driftScale = 1.0 + 0.17 * pullU;

  // JADES initial label fades cleanly as we zoom wide
  const jadesLabelO = interpolate(frame, [0, Math.max(24, mostAt)], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Progressive crimson ignition of all 24 galaxies
  const igniteSpan = Math.max(48, dur - mostAt * 0.45);

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <svg
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", inset: 0 }}
      >
        <g
          transform={`translate(${cx + camShiftX}, ${cy + camShiftY}) scale(${camScale}) translate(${-cx}, ${-cy})`}
        >
          {/* Faint radial reference rings */}
          {[240, 440, 650].map((r, i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={r * driftScale}
              fill="none"
              stroke="rgba(62, 224, 255, 0.1)"
              strokeWidth={1.4}
              strokeDasharray="6 14"
            />
          ))}

          {/* 24 Galaxies progressively igniting crimson with outward > c arrows */}
          {COSMOS_24_GALAXIES.map((g, idx) => {
            const rad = (g.ang * Math.PI) / 180;
            const rCur = g.r0 * driftScale;
            const gx = cx + Math.cos(rad) * rCur;
            const gy = cy + Math.sin(rad) * rCur;

            const startF =
              idx === 0
                ? 0
                : Math.max(6, mostAt * 0.25 + ((idx - 1) / 23) * igniteSpan * 0.72);
            const igniteP =
              idx === 0 ? 1 : easeOutCubic((frame - startF) / 26);

            const col = mixHex("#cfe5ff", C.red, igniteP);
            const vecLen =
              (idx === 0 ? 96 : 36 + g.r0 * 0.12) *
              igniteP *
              (0.85 + 0.35 * pullU);

            const sx = gx + Math.cos(rad) * (g.size + 4);
            const sy = gy + Math.sin(rad) * (g.size + 4);
            const ex = sx + Math.cos(rad) * vecLen;
            const ey = sy + Math.sin(rad) * vecLen;

            return (
              <g key={idx}>
                {/* Highlight ring on JADES-GS-z14-0 */}
                {idx === 0 && (
                  <g opacity={0.35 + 0.65 * jadesLabelO}>
                    <circle
                      cx={gx}
                      cy={gy}
                      r={34}
                      fill="none"
                      stroke={C.gold}
                      strokeWidth={2.2}
                      strokeDasharray="7 6"
                    />
                  </g>
                )}

                {/* Crimson ignition halo */}
                {igniteP > 0.05 && (
                  <circle
                    cx={gx}
                    cy={gy}
                    r={g.size * (0.9 + igniteP * 0.65)}
                    fill={C.red}
                    opacity={0.14 * igniteP}
                  />
                )}

                <SpiralGalaxy
                  x={gx}
                  y={gy}
                  radius={g.size}
                  color={col}
                  angle={g.tilt}
                />

                {/* Outward > c vector */}
                {vecLen > 5 && (
                  <g opacity={igniteP * 0.92}>
                    <line
                      x1={sx}
                      y1={sy}
                      x2={ex}
                      y2={ey}
                      stroke={C.red}
                      strokeWidth={idx === 0 ? 4.5 : 3}
                      strokeLinecap="round"
                      style={{ filter: svgGlow(C.red, 5) }}
                    />
                    <polygon
                      points="0,0 -13,-6 -13,6"
                      fill={C.red}
                      transform={`translate(${ex}, ${ey}) rotate(${g.ang})`}
                    />
                  </g>
                )}
              </g>
            );
          })}

          {/* Central Observer Reference (Milky Way) */}
          <SpiralGalaxy x={cx} y={cy} radius={22} color={C.cyan} angle={16} />
          <text
            x={cx}
            y={cy + 44}
            textAnchor="middle"
            fill={C.cyan}
            fontFamily={MONO}
            fontWeight={700}
            fontSize={18}
          >
            EARTH
          </text>
        </g>
      </svg>

      {jadesLabelO > 0.02 && (
        <div style={{ opacity: jadesLabelO }}>
          <MinimalLabel
            text="JADES-GS-z14-0 · 2.3× c"
            color={C.gold}
            x={960}
            y={94}
            align="center"
            size={34}
            delay={0}
          />
        </div>
      )}

      <MinimalLabel
        text="MOST GALAXIES > c"
        sub="RECEDING FASTER THAN LIGHT"
        color={C.red}
        x={960}
        y={56}
        align="center"
        size={42}
        delay={Math.max(12, mostAt)}
      />
    </AbsoluteFill>
  );
};

// ===========================================================================
// 5. HowLightReachedTeaserAnim — Ch 0 (0:42.2–0:53.3): Shield -> Photon Mystery
// ===========================================================================
export const HowLightReachedTeaserAnim: React.FC<{ reachAt: number }> = ({
  reachAt,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const dur = Math.max(90, durationInFrames);
  const safeReach = Math.max(24, Math.min(dur - 36, reachAt));
  const morphP = easeInOutCubic((frame - safeReach) / 26);

  // Act 1: Intact glowing Einstein v <= c shield (left) next to receding > c galaxy (right)
  const act1U = clamp01(frame / safeReach);
  const shieldX = 560;
  const cy = 560;
  const shieldPulseR = 148 + act1U * 48;

  // Act 2: Telescope on left, receding crimson galaxy on right, golden photon swimming left!
  const act2U = clamp01((frame - safeReach) / Math.max(24, dur - safeReach));
  const galaxyX =
    frame < safeReach
      ? lerp(1260, 1410, act1U)
      : lerp(1410, 1665, act2U);

  const teleX = 275;
  const photonStart = 1410;
  const photonX = lerp(photonStart - 24, teleX + 185, easeOutCubic(act2U * 0.72) * 0.45 + act2U * 0.55);

  // Photon sinusoidal wave facing LEFT toward telescope
  const pktLen = 115;
  const pktPts: string[] = [];
  for (let i = 0; i <= 38; i++) {
    const frac = i / 38;
    const px = photonX + frac * pktLen;
    const env = Math.sin(frac * Math.PI);
    const py = cy + Math.sin(frac * Math.PI * 6 - frame * 0.36) * 15 * env;
    pktPts.push((i === 0 ? "M " : "L ") + px.toFixed(1) + " " + py.toFixed(1));
  }
  const pktPath = pktPts.join(" ");

  return (
    <AbsoluteFill>
      <svg
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <linearGradient
            id="csl05PhotonTrail"
            gradientUnits="userSpaceOnUse"
            x1={photonStart}
            y1={cy}
            x2={Math.min(photonStart - 4, photonX)}
            y2={cy}
          >
            <stop offset="0%" stopColor={C.gold} stopOpacity={0.12} />
            <stop offset="100%" stopColor={C.gold} stopOpacity={0.95} />
          </linearGradient>
        </defs>

        {/* ACT 1: Einstein's Unbroken v <= c Shield */}
        {morphP < 0.99 && (
          <g opacity={1 - morphP}>
            {/* Expanding golden protection aura */}
            <circle
              cx={shieldX}
              cy={cy}
              r={shieldPulseR}
              fill="none"
              stroke={C.gold}
              strokeWidth={2.5}
              opacity={0.45 * (1 - act1U * 0.65)}
            />
            {/* Hexagonal shield emblem */}
            <polygon
              points={`${shieldX},${cy - 135} ${shieldX + 118},${cy - 68} ${shieldX + 118},${cy + 68} ${shieldX},${cy + 135} ${shieldX - 118},${cy + 68} ${shieldX - 118},${cy - 68}`}
              fill="rgba(255, 194, 77, 0.08)"
              stroke={C.gold}
              strokeWidth={4.5}
              style={{ filter: svgGlow(C.gold, 10) }}
            />
            <polygon
              points={`${shieldX},${cy - 112} ${shieldX + 98},${cy - 56} ${shieldX + 98},${cy + 56} ${shieldX},${cy + 112} ${shieldX - 98},${cy + 56} ${shieldX - 98},${cy - 56}`}
              fill="none"
              stroke={C.cyan}
              strokeWidth={1.8}
              strokeDasharray="10 8"
              opacity={0.75}
            />
            <text
              x={shieldX}
              y={cy + 12}
              textAnchor="middle"
              fill={C.gold}
              fontFamily={MONO}
              fontWeight={700}
              fontSize={58}
              style={{ filter: svgGlow(C.gold, 8) }}
            >
              v ≤ c
            </text>
            <text
              x={shieldX}
              y={cy + 64}
              textAnchor="middle"
              fill={C.green}
              fontFamily={MONO}
              fontWeight={700}
              fontSize={22}
            >
              UNBROKEN ✓
            </text>
          </g>
        )}

        {/* ACT 2: Telescope on Left + Photon Launching From Receding Galaxy */}
        {morphP > 0.01 && (
          <g opacity={morphP}>
            {/* Subtle horizontal light-path track */}
            <line
              x1={teleX + 135}
              y1={cy}
              x2={galaxyX - 35}
              y2={cy}
              stroke="rgba(127, 147, 196, 0.25)"
              strokeWidth={2.5}
              strokeDasharray="8 12"
            />
            {/* Red space expansion flow chevrons opposing the photon */}
            {[0, 1, 2, 3, 4].map((idx) => {
              const bx = 560 + ((idx * 220 + frame * 2.2) % 980);
              return (
                <path
                  key={idx}
                  d={`M ${bx} ${cy - 76} L ${bx + 22} ${cy - 60} L ${bx} ${cy - 44}`}
                  fill="none"
                  stroke={C.red}
                  strokeWidth={2.4}
                  strokeLinecap="round"
                  opacity={0.28}
                />
              );
            })}

            {/* Space Telescope on Left */}
            <TelescopeDish x={teleX} y={cy} scale={1.15} />
            <text
              x={teleX}
              y={cy + 168}
              textAnchor="middle"
              fill={C.cyan}
              fontFamily={MONO}
              fontWeight={700}
              fontSize={22}
            >
              TELESCOPE
            </text>

            {/* Golden Photon Beam Racing Leftward */}
            <line
              x1={photonStart}
              y1={cy}
              x2={photonX}
              y2={cy}
              stroke="url(#csl05PhotonTrail)"
              strokeWidth={4.5}
              strokeLinecap="round"
              opacity={0.75}
            />
            <path
              d={pktPath}
              fill="none"
              stroke={C.gold}
              strokeWidth={4.8}
              strokeLinecap="round"
              style={{ filter: svgGlow(C.gold, 9) }}
            />
            <polygon
              points="0,0 18,-9 18,9"
              fill="#fff7d6"
              transform={`translate(${photonX - 4}, ${cy})`}
              style={{ filter: svgGlow(C.gold, 8) }}
            />
            <text
              x={photonX + 46}
              y={cy - 34}
              textAnchor="middle"
              fill={C.gold}
              fontFamily={MONO}
              fontWeight={700}
              fontSize={22}
            >
              LIGHT · c
            </text>
          </g>
        )}

        {/* Receding Crimson Galaxy on Right (continuous across both acts!) */}
        <g>
          <SpiralGalaxy x={galaxyX} y={cy} radius={34} color={C.red} angle={-18} />
          <line
            x1={galaxyX + 44}
            y1={cy}
            x2={Math.min(1870, galaxyX + 150)}
            y2={cy}
            stroke={C.red}
            strokeWidth={6}
            strokeLinecap="round"
            style={{ filter: svgGlow(C.red, 7) }}
          />
          <polygon
            points="0,0 -20,-10 -20,10"
            fill={C.red}
            transform={`translate(${Math.min(1884, galaxyX + 162)}, ${cy})`}
          />
          <text
            x={galaxyX}
            y={cy + 78}
            textAnchor="middle"
            fill={C.red}
            fontFamily={MONO}
            fontWeight={700}
            fontSize={30}
            style={{ filter: svgGlow(C.red, 6) }}
          >
            &gt; c
          </text>
        </g>
      </svg>

      {morphP < 0.85 && (
        <div style={{ opacity: 1 - morphP }}>
          <MinimalLabel
            text="EINSTEIN'S LAW STILL HOLDS"
            color={C.gold}
            x={960}
            y={72}
            align="center"
            size={38}
            delay={2}
          />
        </div>
      )}

      <MinimalLabel
        text="HOW DID LIGHT REACH US?"
        sub="RECEDING FASTER THAN LIGHT"
        color={C.gold}
        x={960}
        y={66}
        align="center"
        size={42}
        delay={safeReach}
      />
    </AbsoluteFill>
  );
};

// ===========================================================================
// 6. TwoMotionsIntroAnim — Ch 0 (0:53.3–1:06.3): THROUGH vs OF SPACE -> ~95%
// ===========================================================================
export const TwoMotionsIntroAnim: React.FC<{
  splitAt: number;
  pctAt: number;
}> = ({ splitAt, pctAt }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const dur = Math.max(120, durationInFrames);
  const splitP = spring({
    frame: Math.max(0, frame - splitAt),
    fps,
    config: { damping: 16, stiffness: 105 },
  });

  const pctP = spring({
    frame: Math.max(0, frame - pctAt),
    fps,
    config: { damping: 16, stiffness: 95 },
  });
  const bgPanelsOpacity = interpolate(pctP, [0, 1], [1, 0.12]);
  const bgPanelsScale = interpolate(pctP, [0, 1], [1, 0.93]);

  // Left Panel: THROUGH SPACE — continuous motion up to wall + wall compression pulse
  const leftOriginX = 160;
  const leftOriginY = 555;
  const leftCell = 88;
  const leftWallX = leftOriginX + 6.5 * leftCell;
  const leftU = clamp01(frame / Math.max(60, dur));
  const leftDotX =
    leftOriginX +
    0.5 * leftCell +
    (leftWallX - 24 - (leftOriginX + 0.5 * leftCell)) *
      (0.76 * easeOutCubic(Math.min(1, leftU * 2.2)) + 0.24 * leftU);

  // Right Panel: OF SPACE — elastic grid stretches continuously across 100% of dur
  const rightOriginX = 1090;
  const rightOriginY = 555;
  const rightU = clamp01(
    (frame - splitAt) / Math.max(40, dur - splitAt),
  );
  const preStretch = interpolate(frame, [0, Math.max(1, splitAt)], [1.0, 1.08], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rightScale =
    preStretch + (frame > splitAt ? 1.24 * (0.45 * easeOutCubic(Math.min(1, rightU * 1.9)) + 0.55 * rightU) : 0);
  const rightCell = 88 * rightScale;
  const rightRefCX = rightOriginX + 4.8 * 88;
  const rightGalaxyX = rightOriginX + 3 * rightCell;
  const rightOpacity = 0.42 + 0.58 * splitP;

  // ~95% ring sweeps continuously through dur
  const ringR = 238;
  const ringCirc = 2 * Math.PI * ringR;
  const pctU = clamp01((frame - pctAt) / Math.max(36, dur - pctAt));
  const ringSweep = 0.85 * easeOutCubic(Math.min(1, pctU * 2.0)) + 0.15 * pctU;
  const redArcLen = ringCirc * 0.95 * ringSweep;
  const cyanArcLen = ringCirc * 0.042 * ringSweep;
  const displayPct = Math.round(95 * ringSweep);

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          opacity: bgPanelsOpacity,
          transform: `scale(${bgPanelsScale})`,
        }}
      >
        <svg
          width={1920}
          height={1080}
          viewBox="0 0 1920 1080"
          style={{ position: "absolute", inset: 0 }}
        >
          <defs>
            <clipPath id="csl06LeftClip">
              <rect x={90} y={225} width={810} height={660} rx={20} />
            </clipPath>
            <clipPath id="csl06RightClip">
              <rect x={1020} y={225} width={810} height={660} rx={20} />
            </clipPath>
            <linearGradient
              id="csl06LeftTrail"
              gradientUnits="userSpaceOnUse"
              x1={leftOriginX + 0.5 * leftCell}
              y1={leftOriginY}
              x2={Math.max(leftOriginX + 0.5 * leftCell + 4, leftDotX)}
              y2={leftOriginY}
            >
              <stop offset="0%" stopColor={C.cyan} stopOpacity={0} />
              <stop offset="100%" stopColor={C.cyan} stopOpacity={0.92} />
            </linearGradient>
          </defs>

          <line
            x1={960}
            y1={115}
            x2={960}
            y2={955}
            stroke="rgba(127, 147, 196, 0.25)"
            strokeWidth={2}
            opacity={0.35 + 0.65 * splitP}
          />

          {/* LEFT PANEL: THROUGH SPACE */}
          <g clipPath="url(#csl06LeftClip)">
            {[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8].map((col) => {
              const gx = leftOriginX + col * leftCell;
              return (
                <line
                  key={"lv" + col}
                  x1={gx}
                  y1={225}
                  x2={gx}
                  y2={885}
                  stroke="rgba(62, 224, 255, 0.2)"
                  strokeWidth={1.5}
                />
              );
            })}
            {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map((row) => {
              const gy = leftOriginY + row * leftCell;
              return (
                <line
                  key={"lh" + row}
                  x1={90}
                  y1={gy}
                  x2={900}
                  y2={gy}
                  stroke="rgba(62, 224, 255, 0.2)"
                  strokeWidth={1.5}
                />
              );
            })}

            <line
              x1={leftWallX}
              y1={250}
              x2={leftWallX}
              y2={860}
              stroke={C.gold}
              strokeWidth={4.2}
              strokeDasharray="10 8"
              style={{ filter: svgGlow(C.gold, 7) }}
            />
            <text
              x={leftWallX + 18}
              y={300}
              fill={C.gold}
              fontFamily={MONO}
              fontWeight={700}
              fontSize={28}
            >
              c
            </text>

            <line
              x1={leftOriginX + 0.5 * leftCell}
              y1={leftOriginY}
              x2={leftDotX}
              y2={leftOriginY}
              stroke="url(#csl06LeftTrail)"
              strokeWidth={5.5}
              strokeLinecap="round"
            />
            <circle
              cx={leftDotX}
              cy={leftOriginY}
              r={18}
              fill={C.cyan}
              opacity={0.32}
              style={{ filter: svgGlow(C.cyan, 8) }}
            />
            <circle cx={leftDotX} cy={leftOriginY} r={8.5} fill="#ffffff" />
          </g>

          {/* RIGHT PANEL: OF SPACE */}
          <g clipPath="url(#csl06RightClip)" opacity={rightOpacity}>
            {[-1, 0, 1, 2, 3, 4, 5, 6, 7].map((col) => {
              const gx = rightOriginX + col * rightCell;
              return (
                <line
                  key={"rv" + col}
                  x1={gx}
                  y1={225}
                  x2={gx}
                  y2={885}
                  stroke="rgba(255, 194, 77, 0.3)"
                  strokeWidth={1.9}
                />
              );
            })}
            {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map((row) => {
              const gy = rightOriginY + row * rightCell;
              return (
                <line
                  key={"rh" + row}
                  x1={1020}
                  y1={gy}
                  x2={1830}
                  y2={gy}
                  stroke="rgba(255, 194, 77, 0.25)"
                  strokeWidth={1.7}
                />
              );
            })}

            <line
              x1={rightRefCX}
              y1={250}
              x2={rightRefCX}
              y2={860}
              stroke="rgba(255, 77, 94, 0.48)"
              strokeWidth={2.5}
              strokeDasharray="8 10"
            />
            <text
              x={rightRefCX + 12}
              y={300}
              fill={C.red}
              fontFamily={MONO}
              fontWeight={700}
              fontSize={24}
            >
              c
            </text>

            <SpiralGalaxy
              x={rightOriginX}
              y={rightOriginY}
              radius={18}
              color={C.cyan}
              angle={15}
            />
            <circle
              cx={rightGalaxyX}
              cy={rightOriginY}
              r={26}
              fill="none"
              stroke={C.gold}
              strokeWidth={2}
              strokeDasharray="5 5"
              opacity={0.8}
            />
            <SpiralGalaxy
              x={rightGalaxyX}
              y={rightOriginY}
              radius={20}
              color={rightGalaxyX > rightRefCX ? C.red : C.gold}
              angle={-22}
            />
            <text
              x={rightGalaxyX}
              y={rightOriginY + 54}
              textAnchor="middle"
              fill={C.gold}
              fontFamily={MONO}
              fontWeight={700}
              fontSize={20}
            >
              LOCAL v = 0
            </text>
          </g>
        </svg>

        <MinimalLabel
          text="THROUGH SPACE"
          sub="LIMITED BY c"
          color={C.cyan}
          x={495}
          y={112}
          align="center"
          size={36}
          delay={4}
        />
        <MinimalLabel
          text="OF SPACE"
          sub="NO SPEED LIMIT"
          color={C.gold}
          x={1425}
          y={112}
          align="center"
          size={36}
          delay={Math.max(0, splitAt - 4)}
        />
      </AbsoluteFill>

      {/* Dramatic ~95% Vanishing Crimson Ring on pctAt */}
      {frame >= pctAt - 1 && (
        <AbsoluteFill
          style={{
            opacity: Math.min(1, pctP * 1.2),
            transform: `scale(${interpolate(pctP, [0, 1], [0.86, 1]) + pctU * 0.05})`,
          }}
        >
          <svg
            width={1920}
            height={1080}
            viewBox="0 0 1920 1080"
            style={{ position: "absolute", inset: 0 }}
          >
            {/* Expanding crimson outer aura */}
            <circle
              cx={960}
              cy={540}
              r={ringR + 34 + pctU * 95}
              fill="none"
              stroke={C.red}
              strokeWidth={2.5}
              opacity={0.42 * (1 - pctU * 0.65)}
            />
            <circle
              cx={960}
              cy={540}
              r={ringR}
              fill="rgba(5, 10, 24, 0.78)"
              stroke="rgba(127, 147, 196, 0.16)"
              strokeWidth={28}
            />
            <circle
              cx={960}
              cy={540}
              r={ringR}
              fill="none"
              stroke={C.red}
              strokeWidth={28}
              strokeLinecap="round"
              strokeDasharray={`${redArcLen} ${ringCirc}`}
              transform="rotate(-90 960 540)"
              style={{ filter: svgGlow(C.red, 12) }}
            />
            <circle
              cx={960}
              cy={540}
              r={ringR}
              fill="none"
              stroke={C.cyan}
              strokeWidth={28}
              strokeLinecap="round"
              strokeDasharray={`${cyanArcLen} ${ringCirc}`}
              transform="rotate(253 960 540)"
              style={{ filter: svgGlow(C.cyan, 8) }}
            />
          </svg>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                fontFamily: MONO,
                fontWeight: 700,
                fontSize: 124,
                color: C.white,
                letterSpacing: -3,
                lineHeight: 1,
                textShadow: glow(C.red, 18),
              }}
            >
              ~{displayPct}%
            </div>
            <div
              style={{
                fontFamily: INTER,
                fontWeight: 800,
                fontSize: 28,
                color: C.red,
                letterSpacing: 4.5,
                marginTop: 14,
                textShadow: glow(C.red, 8),
              }}
            >
              GONE FOREVER
            </div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// ===========================================================================
// 7. SpecialRelativityShipAnim — Ch 1 (1:07.2–1:39.7): 5-Phase Continuous Arc
// ===========================================================================
export const SpecialRelativityShipAnim: React.FC<{
  einsteinAt: number;
  shipAt: number;
  speedAt: number;
  infAt: number;
  wallAt: number;
}> = ({ einsteinAt, shipAt, speedAt, infAt, wallAt }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const dur = Math.max(180, durationInFrames);
  const safeShip = Math.max(einsteinAt + 20, shipAt);
  const safeSpeed = Math.max(safeShip + 20, speedAt);
  const safeInf = Math.max(safeSpeed + 20, infAt);
  const safeWall = Math.max(safeInf + 20, wallAt);

  // Einstein smoothly glides left & dims slightly when spacecraft ignites on shipAt
  const shiftP = spring({
    frame: Math.max(0, frame - safeShip),
    fps,
    config: { damping: 18, stiffness: 90 },
  });
  const einsteinLeft = lerp(210, 62, shiftP);
  const einsteinScale = lerp(1.06, 0.9, shiftP);
  const einsteinOpacity = lerp(1.0, 0.74, shiftP);

  // Plot & flight region on right
  const plotLeft = 525;
  const plotRight = 1715;
  const plotW = plotRight - plotLeft; // 1190
  const plotBottom = 640;
  const plotTop = 148;
  const plotH = plotBottom - plotTop;

  // Reveal plot cleanly on shipAt
  const shipReveal = easeOutCubic((frame - safeShip) / 24);

  // 5-stage continuous monotonic beta(frame): NEVER freezes across all 32.5s!
  let beta = 0.04;
  if (frame < safeShip) {
    beta = lerp(0.02, 0.08, clamp01(frame / Math.max(1, safeShip)));
  } else if (frame < safeSpeed) {
    const u = clamp01((frame - safeShip) / Math.max(1, safeSpeed - safeShip));
    beta = lerp(0.08, 0.5, easeInOutCubic(u));
  } else if (frame < safeInf) {
    const u = clamp01((frame - safeSpeed) / Math.max(1, safeInf - safeSpeed));
    beta = lerp(0.5, 0.9, easeInOutCubic(u));
  } else if (frame < safeWall) {
    const u = clamp01((frame - safeInf) / Math.max(1, safeWall - safeInf));
    beta = lerp(0.9, 0.992, easeOutCubic(u));
  } else {
    const u = clamp01((frame - safeWall) / Math.max(18, dur - safeWall));
    beta = lerp(0.992, 0.999, u);
  }

  const shipX = plotLeft + beta * plotW;

  // Relativistic kinetic energy curve y(b)
  const energyY = (b: number) => {
    const safeB = Math.min(0.995, Math.max(0, b));
    const gammaMinus1 = 1 / Math.sqrt(1 - safeB * safeB) - 1;
    const norm = Math.min(1, gammaMinus1 / 7.2);
    return plotBottom - norm * plotH;
  };

  const curvePts: string[] = [];
  const samples = 92;
  for (let i = 0; i <= samples; i++) {
    const b = (beta * i) / samples;
    const px = plotLeft + b * plotW;
    const py = energyY(b);
    curvePts.push((i === 0 ? "M " : "L ") + px.toFixed(1) + " " + py.toFixed(1));
  }
  const curvePath = curvePts.join(" ");
  const tipY = energyY(beta);

  const kmPerSec = Math.round(beta * 300000);
  const kmLabel = formatCommas(kmPerSec) + " km/s";

  // Force-field fabric glow on wallAt -> dur
  const wallP = easeOutCubic((frame - safeWall) / 26);
  const wallTailU = clamp01((frame - safeWall) / Math.max(24, dur - safeWall));

  // Intro decorative golden spacetime blueprint lines while Einstein introduces 1905
  const introDraw = clamp01((frame - einsteinAt) / Math.max(30, safeShip - einsteinAt));

  return (
    <AbsoluteFill>
      {/* Left: Albert Einstein Portrait (1905) */}
      <div
        style={{
          position: "absolute",
          left: einsteinLeft,
          top: 268,
          zIndex: 10,
          opacity: einsteinOpacity,
          transform: `scale(${einsteinScale})`,
          transformOrigin: "left center",
        }}
      >
        <CleanPortrait
          src="cosmiclimit/portraits/einstein.jpg"
          name="Albert Einstein"
          year="1905"
          credit="Public Domain · Wikimedia"
          accent={C.gold}
          width={365}
          height={475}
          objectPosition="56% 18%"
          delay={einsteinAt}
        />
      </div>

      {/* Intro 1905 subtle formula on right before spacecraft enters */}
      {shipReveal < 0.98 && (
        <div style={{ opacity: 1 - shipReveal }}>
          <MinimalLabel
            text="SPECIAL RELATIVITY"
            sub="1905 · THE SPEED LIMIT"
            color={C.gold}
            x={1160}
            y={420}
            align="center"
            size={54}
            delay={einsteinAt + 8}
          />
          <MinimalLabel
            text="v < c"
            color={C.cyan}
            x={1160}
            y={555}
            align="center"
            size={68}
            delay={einsteinAt + 28}
          />
        </div>
      )}

      <svg
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <linearGradient
            id="csl07EnergyGrad"
            gradientUnits="userSpaceOnUse"
            x1={plotLeft}
            y1={0}
            x2={plotRight}
            y2={0}
          >
            <stop offset="0%" stopColor={C.cyan} />
            <stop offset="65%" stopColor={C.gold} />
            <stop offset="100%" stopColor={C.red} />
          </linearGradient>
          <linearGradient
            id="csl07ForceWall"
            gradientUnits="userSpaceOnUse"
            x1={plotRight}
            y1={115}
            x2={plotRight}
            y2={945}
          >
            <stop offset="0%" stopColor={C.red} stopOpacity={0} />
            <stop offset="18%" stopColor={C.gold} stopOpacity={0.95} />
            <stop offset="50%" stopColor="#ffffff" stopOpacity={1} />
            <stop offset="82%" stopColor={C.red} stopOpacity={0.95} />
            <stop offset="100%" stopColor={C.red} stopOpacity={0} />
          </linearGradient>
        </defs>

        {/* Subtle intro drafting arcs on right before ship enters */}
        {shipReveal < 0.98 && (
          <g opacity={(1 - shipReveal) * 0.22}>
            <circle
              cx={1160}
              cy={540}
              r={180 + introDraw * 130}
              fill="none"
              stroke={C.gold}
              strokeWidth={1.8}
              strokeDasharray="10 12"
            />
            <circle
              cx={1160}
              cy={540}
              r={260 + introDraw * 150}
              fill="none"
              stroke={C.cyan}
              strokeWidth={1.4}
              strokeDasharray="6 18"
            />
          </g>
        )}

        {/* Active Relativistic Plot + Spacecraft + Fabric Force-Field */}
        {shipReveal > 0.01 && (
          <g opacity={shipReveal}>
            {/* Fabric of Space Lattice lighting up on wallAt */}
            {wallP > 0.01 && (
              <g opacity={wallP * 0.32}>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((col) => {
                  const gx = plotLeft + col * (plotW / 8);
                  return (
                    <line
                      key={"fv" + col}
                      x1={gx}
                      y1={120}
                      x2={gx}
                      y2={910}
                      stroke={col >= 6 ? C.red : C.cyan}
                      strokeWidth={col === 8 ? 3 : 1.5}
                    />
                  );
                })}
                {[0, 1, 2, 3, 4, 5].map((row) => {
                  const gy = 160 + row * 145;
                  return (
                    <line
                      key={"fh" + row}
                      x1={plotLeft}
                      y1={gy}
                      x2={plotRight}
                      y2={gy}
                      stroke={C.cyan}
                      strokeWidth={1.4}
                    />
                  );
                })}
              </g>
            )}

            {/* Plot grid hairlines */}
            {[0.25, 0.5, 0.75, 1.0].map((frac, idx) => {
              const gy = plotBottom - frac * plotH;
              return (
                <line
                  key={idx}
                  x1={plotLeft}
                  y1={gy}
                  x2={plotRight}
                  y2={gy}
                  stroke="rgba(127, 147, 196, 0.14)"
                  strokeWidth={1.2}
                  strokeDasharray="5 12"
                />
              );
            })}

            {/* Axes */}
            <line
              x1={plotLeft}
              y1={plotTop}
              x2={plotLeft}
              y2={plotBottom}
              stroke="rgba(127, 147, 196, 0.45)"
              strokeWidth={2}
            />
            <line
              x1={plotLeft}
              y1={plotBottom}
              x2={plotRight + 24}
              y2={plotBottom}
              stroke="rgba(127, 147, 196, 0.45)"
              strokeWidth={2}
            />

            {/* Vertical c Asymptote Wall -> intensifies into solid force-field on wallAt */}
            <line
              x1={plotRight}
              y1={plotTop - 20}
              x2={plotRight}
              y2={925}
              stroke={wallP > 0.1 ? "url(#csl07ForceWall)" : C.gold}
              strokeWidth={4 + wallP * 5}
              strokeDasharray={wallP > 0.35 ? undefined : "10 8"}
              style={{ filter: svgGlow(wallP > 0.2 ? C.red : C.gold, 10) }}
            />
            {wallP > 0.02 && (
              <g>
                <rect
                  x={plotRight - 24}
                  y={125}
                  width={48}
                  height={805}
                  fill={C.red}
                  opacity={0.14 * wallP + 0.08 * wallTailU}
                  style={{ filter: svgGlow(C.red, 16) }}
                />
                {/* Expanding compression bow-arcs at nose against unbreakable wall */}
                {[0, 1, 2].map((ringIdx) => {
                  const rU = clamp01((wallTailU - ringIdx * 0.25) / 0.55);
                  if (rU <= 0.01) return null;
                  return (
                    <path
                      key={ringIdx}
                      d={`M ${plotRight - 8} ${795 - 55 - rU * 85} Q ${plotRight - 55 - rU * 48} 795 ${plotRight - 8} ${795 + 55 + rU * 85}`}
                      fill="none"
                      stroke={ringIdx % 2 === 0 ? C.gold : C.red}
                      strokeWidth={3.2}
                      opacity={0.85 * (1 - rU * 0.72)}
                    />
                  );
                })}
              </g>
            )}

            {/* Glowing Relativistic Energy Curve E(v) */}
            <path
              d={curvePath}
              fill="none"
              stroke="url(#csl07EnergyGrad)"
              strokeWidth={6.5}
              strokeLinecap="round"
              style={{ filter: svgGlow(beta > 0.85 ? C.red : C.cyan, 8) }}
            />

            {/* Vertical dashed drop-line from curve point to rocket */}
            <line
              x1={shipX}
              y1={tipY + 10}
              x2={shipX}
              y2={772}
              stroke={beta > 0.85 ? C.gold : C.cyan}
              strokeWidth={2}
              strokeDasharray="6 8"
              opacity={0.55}
            />

            {/* Curve dot */}
            <circle
              cx={shipX}
              cy={tipY}
              r={14}
              fill={beta > 0.85 ? C.red : C.cyan}
              opacity={0.38}
              style={{ filter: svgGlow(beta > 0.85 ? C.red : C.cyan, 8) }}
            />
            <circle cx={shipX} cy={tipY} r={6} fill="#ffffff" />

            {/* Speed streaks rushing past spacecraft */}
            {[0, 1, 2, 3, 4, 5].map((sIdx) => {
              const sx =
                plotLeft +
                ((plotW - ((frame * (3 + beta * 14) + sIdx * 210) % plotW)) % plotW);
              const sy = 738 + (sIdx % 3) * 48;
              return (
                <line
                  key={sIdx}
                  x1={sx}
                  y1={sy}
                  x2={sx + 24 + beta * 44}
                  y2={sy}
                  stroke={beta > 0.85 ? C.gold : C.cyan}
                  strokeWidth={1.6}
                  opacity={0.22 * shipReveal}
                />
              );
            })}

            {/* Spacecraft Track & Rocket */}
            <line
              x1={plotLeft}
              y1={795}
              x2={plotRight}
              y2={795}
              stroke="rgba(127, 147, 196, 0.18)"
              strokeWidth={2}
            />
            <SleekRocket
              x={Math.min(plotRight - 14, shipX)}
              y={795}
              scale={1.18}
              thrust={0.3 + 0.7 * clamp01(beta / 0.92)}
              flameColor={beta > 0.88 ? C.gold : C.cyan}
            />

            {/* Live Speedometer Bar */}
            <rect
              x={plotLeft}
              y={888}
              width={plotW}
              height={14}
              rx={7}
              fill="rgba(127, 147, 196, 0.16)"
            />
            <rect
              x={plotLeft}
              y={888}
              width={Math.max(12, beta * plotW)}
              height={14}
              rx={7}
              fill="url(#csl07EnergyGrad)"
              style={{ filter: svgGlow(beta > 0.85 ? C.gold : C.cyan, 6) }}
            />

            <text
              x={plotLeft}
              y={938}
              fill={C.dim}
              fontFamily={MONO}
              fontWeight={700}
              fontSize={20}
            >
              0
            </text>
            <text
              x={plotRight}
              y={938}
              textAnchor="middle"
              fill={C.gold}
              fontFamily={MONO}
              fontWeight={700}
              fontSize={26}
            >
              c
            </text>

            {/* Live Readout */}
            <text
              x={Math.min(plotRight - 130, Math.max(plotLeft + 115, shipX))}
              y={952}
              textAnchor="middle"
              fill={beta > 0.88 ? C.gold : C.cyan}
              fontFamily={MONO}
              fontWeight={700}
              fontSize={34}
            >
              {beta >= 0.99 ? beta.toFixed(3) : beta.toFixed(2)} c
            </text>
            <text
              x={Math.min(plotRight - 130, Math.max(plotLeft + 115, shipX))}
              y={984}
              textAnchor="middle"
              fill={C.dim}
              fontFamily={MONO}
              fontWeight={700}
              fontSize={20}
            >
              {kmLabel}
            </text>
          </g>
        )}
      </svg>

      <MinimalLabel
        text="ENERGY"
        color={C.dim}
        x={plotLeft}
        y={96}
        align="left"
        size={22}
        delay={safeShip}
      />
      <MinimalLabel
        text="c = 300,000 km/s"
        color={C.gold}
        x={plotRight}
        y={68}
        align="center"
        size={30}
        delay={safeSpeed}
      />
      <MinimalLabel
        text="E → ∞"
        color={C.red}
        x={1520}
        y={190}
        align="center"
        size={52}
        delay={safeInf}
      />
      <MinimalLabel
        text="UNBREAKABLE LIMIT"
        color={C.gold}
        x={1120}
        y={68}
        align="center"
        size={36}
        delay={safeWall}
      />
    </AbsoluteFill>
  );
};

// ===========================================================================
// 8. WhatPushesGalaxiesAnim — Ch 1 (1:39.7–1:46.5): Engine / Explosion / Force X
// ===========================================================================
export const WhatPushesGalaxiesAnim: React.FC<{
  expAt: number;
  forceAt: number;
}> = ({ expAt, forceAt }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const dur = Math.max(90, durationInFrames);
  const cy = 540;
  const colX = [380, 960, 1540];

  // Column 1: Engine (starts frame 0, X slams at expAt * 0.55)
  const c1XAt = Math.max(16, Math.round(expAt * 0.55));
  const c1Thrust = easeOutCubic(frame / c1XAt);
  const c1Cross = frame >= c1XAt ? clamp01((frame - c1XAt) / 18) : 0;

  // Column 2: Supernova Explosion (starts expAt, X slams mid-phase)
  const c2Visible = frame >= expAt - 2;
  const c2XAt = Math.max(expAt + 16, Math.round((expAt + forceAt) * 0.55));
  const c2Burst = easeOutCubic((frame - expAt) / Math.max(14, c2XAt - expAt));
  const c2Cross = frame >= c2XAt ? clamp01((frame - c2XAt) / 18) : 0;

  // Column 3: Giant Force Arrow (starts forceAt, X slams before end)
  const c3Visible = frame >= forceAt - 2;
  const c3XAt = Math.min(dur - 16, forceAt + Math.max(16, Math.round((dur - forceAt) * 0.45)));
  const c3Push = easeOutCubic((frame - forceAt) / Math.max(14, c3XAt - forceAt));
  const c3Cross = frame >= c3XAt ? clamp01((frame - c3XAt) / 18) : 0;

  const driftU = clamp01(frame / dur);

  return (
    <AbsoluteFill>
      <svg
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", inset: 0 }}
      >
        {/* Subtle vertical column dividers */}
        <line x1={670} y1={220} x2={670} y2={840} stroke="rgba(127, 147, 196, 0.16)" strokeWidth={1.8} />
        <line x1={1250} y1={220} x2={1250} y2={840} stroke="rgba(127, 147, 196, 0.16)" strokeWidth={1.8} />

        {/* COLUMN 1: ROCKET ENGINE X */}
        <g>
          {/* c limit marker on right of pod */}
          <line x1={colX[0] + 150} y1={370} x2={colX[0] + 150} y2={690} stroke={C.gold} strokeWidth={2.5} strokeDasharray="8 8" opacity={0.55} />
          <SleekRocket
            x={colX[0] - 26 + c1Thrust * 24}
            y={cy}
            scale={1.08}
            thrust={c1Cross > 0.4 ? 0.15 : 0.85}
            flameColor={C.cyan}
          />
          <SpiralGalaxy
            x={colX[0] + 54 + c1Thrust * 22}
            y={cy}
            radius={30}
            color="#d8ecff"
            angle={18 + driftU * 25}
          />
          <CrimsonCross x={colX[0]} y={cy} size={74} progress={c1Cross} />
        </g>

        {/* COLUMN 2: EXPLOSION X */}
        {c2Visible && (
          <g opacity={clamp01((frame - expAt + 2) / 10)}>
            <line x1={colX[1] + 150} y1={370} x2={colX[1] + 150} y2={690} stroke={C.gold} strokeWidth={2.5} strokeDasharray="8 8" opacity={0.55} />
            {/* Fiery supernova shock rings & shards */}
            <circle
              cx={colX[1] - 58}
              cy={cy}
              r={18 + c2Burst * 88}
              fill={C.gold}
              opacity={0.28 * (1 - c2Cross * 0.45)}
              style={{ filter: svgGlow(C.gold, 12) }}
            />
            <circle
              cx={colX[1] - 58}
              cy={cy}
              r={26 + c2Burst * 116}
              fill="none"
              stroke="#ff8a3d"
              strokeWidth={4}
              strokeDasharray="14 10"
              opacity={0.85 * (1 - c2Cross * 0.45)}
            />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
              const rad = (deg * Math.PI) / 180;
              const r1 = 22 + c2Burst * 36;
              const r2 = r1 + 36 + c2Burst * 34;
              return (
                <line
                  key={deg}
                  x1={colX[1] - 58 + Math.cos(rad) * r1}
                  y1={cy + Math.sin(rad) * r1}
                  x2={colX[1] - 58 + Math.cos(rad) * r2}
                  y2={cy + Math.sin(rad) * r2}
                  stroke={C.gold}
                  strokeWidth={3.5}
                  strokeLinecap="round"
                  opacity={0.8 * (1 - c2Cross * 0.5)}
                />
              );
            })}
            <SpiralGalaxy
              x={colX[1] + 58 + c2Burst * 24}
              y={cy}
              radius={30}
              color="#ffe4b8"
              angle={-22 + driftU * 25}
            />
            <CrimsonCross x={colX[1]} y={cy} size={74} progress={c2Cross} />
          </g>
        )}

        {/* COLUMN 3: GIANT FORCE ARROW X */}
        {c3Visible && (
          <g opacity={clamp01((frame - forceAt + 2) / 10)}>
            <line x1={colX[2] + 150} y1={370} x2={colX[2] + 150} y2={690} stroke={C.gold} strokeWidth={2.5} strokeDasharray="8 8" opacity={0.55} />
            <line
              x1={colX[2] - 185}
              y1={cy}
              x2={colX[2] - 185 + 175 * c3Push}
              y2={cy}
              stroke={C.cyan}
              strokeWidth={14}
              strokeLinecap="round"
              style={{ filter: svgGlow(C.cyan, 9) }}
            />
            <polygon
              points="0,0 -32,-20 -32,20"
              fill={C.cyan}
              transform={`translate(${colX[2] - 170 + 185 * c3Push}, ${cy})`}
              style={{ filter: svgGlow(C.cyan, 8) }}
            />
            <SpiralGalaxy
              x={colX[2] + 58 + c3Push * 24}
              y={cy}
              radius={30}
              color="#d8f2ff"
              angle={32 + driftU * 25}
            />
            <CrimsonCross x={colX[2]} y={cy} size={74} progress={c3Cross} />
          </g>
        )}
      </svg>

      <MinimalLabel
        text="NO ENGINE"
        color={c1Cross > 0.2 ? C.red : C.cyan}
        x={colX[0]}
        y={742}
        align="center"
        size={34}
        delay={0}
      />
      <MinimalLabel
        text="NO EXPLOSION"
        color={c2Cross > 0.2 ? C.red : C.gold}
        x={colX[1]}
        y={742}
        align="center"
        size={34}
        delay={Math.max(0, expAt - 2)}
      />
      <MinimalLabel
        text="NO FORCE"
        color={c3Cross > 0.2 ? C.red : C.cyan}
        x={colX[2]}
        y={742}
        align="center"
        size={34}
        delay={Math.max(0, forceAt - 2)}
      />
    </AbsoluteFill>
  );
};

// ===========================================================================
// 9. SpaceBendCurveStretchAnim — Ch 1 (1:55.1–2:08.8): HERO FIX FOR 2:07!
//    Rigid Fixed Stage -> Shatters -> Dramatic Full-Screen BEND / CURVE / STRETCH
// ===========================================================================
export const SpaceBendCurveStretchAnim: React.FC<{
  bendAt: number;
  curveAt: number;
  stretchAt: number;
}> = ({ bendAt, curveAt, stretchAt }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const dur = Math.max(150, durationInFrames);
  const cx = 960;
  const cy = 548;

  const safeBend = Math.max(40, bendAt);
  const safeCurve = Math.max(safeBend + 14, curveAt);
  const safeStretch = Math.max(safeCurve + 14, stretchAt);

  // Stage 0: Rigid white box-frame grid -> cracks & shatters into flexible cyan fabric!
  const introZoom = lerp(0.95, 1.0, clamp01(frame / Math.max(24, safeBend * 0.45)));
  const crackStart = safeBend * 0.42;
  const shatterStart = safeBend * 0.64;
  const crackP = easeInOutCubic((frame - crackStart) / Math.max(16, shatterStart - crackStart));
  const shatterP = easeInOutCubic((frame - shatterStart) / Math.max(18, safeBend - shatterStart));
  const fabricCyanMix = clamp01(shatterP * 1.15);

  // Stage 1: BEND — unmistakable dramatic full-screen 3D wave (snappy 8f in / 6f out)
  const bendRampIn = 8;
  const bendRampOut = 6;
  const bendIn = easeOutCubic((frame - safeBend) / bendRampIn);
  const bendOut = 1 - easeInOutCubic((frame - safeCurve) / bendRampOut);
  const bendAmp = bendIn * bendOut;
  const bendPhase = (frame - safeBend) * 0.085;

  // Stage 2: CURVE — luminous golden sphere drops & deeply curves grid into gravity funnel!
  const curveRampIn = 8;
  const curveRampOut = 6;
  const curveIn = easeOutCubic((frame - safeCurve) / curveRampIn);
  const curveOut = 1 - easeInOutCubic((frame - safeStretch) / curveRampOut);
  const curveAmp = curveIn * curveOut;

  // Stage 3: STRETCH — entire grid pulls dramatically outward (1.0x -> 2.15x) right to dur!
  const stretchDur = Math.max(20, dur - safeStretch);
  const stretchU = clamp01((frame - safeStretch) / stretchDur);
  const stretchScale =
    frame >= safeStretch
      ? 1.0 + 1.05 * easeOutCubic(stretchU) + 0.14 * stretchU
      : 1.0;
  const stretchArrowP = easeOutCubic((frame - safeStretch) / 16);

  // Deform any base grid coordinate (bx, by) through active stage transforms
  const deformPoint = (bx: number, by: number) => {
    // Apply Stage 3 Stretch outward from center
    let x = cx + (bx - cx) * stretchScale * introZoom;
    let y = cy + (by - cy) * stretchScale * introZoom;

    // Gentle living ripple as fabric unlocks right before bendAt
    if (shatterP > 0.05 && frame < safeBend + 12) {
      const unlockWave = shatterP * (1 - bendIn) * 18;
      y += Math.sin((x - cx) * 0.0055 + frame * 0.05) * unlockWave;
    }

    // Apply Stage 1 BEND: Dramatic sweeping full-screen 3D sinusoidal wave
    if (bendAmp > 0.002) {
      const waveArg = (x - cx) * 0.0068 - bendPhase;
      const depthFactor = 1 + ((y - cy) / 520) * 0.28;
      y += Math.sin(waveArg) * 158 * bendAmp * depthFactor;
      x += Math.cos(waveArg) * 34 * bendAmp;
    }

    // Apply Stage 2 CURVE: Iconic deep Einstein gravity funnel/bowl around center
    if (curveAmp > 0.002) {
      const dx = x - cx;
      const dy = y - (cy - 35);
      const r2 = dx * dx + dy * dy;
      const well = Math.exp(-r2 / (295 * 295));
      const deepFunnel = well * 268 * curveAmp;
      // Radial pinch inward toward gravity center + deep vertical drop
      const pinch = 1 - 0.24 * well * curveAmp;
      x = cx + dx * pinch;
      y = cy - 35 + dy * pinch + deepFunnel;
    }

    return { x, y };
  };

  // Build dense high-resolution full-screen spacetime mesh (19 vertical x 11 horizontal)
  const baseStep = 104;
  const cols = [-9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const rows = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5];
  const segs = 44;

  const gridLineColor =
    curveAmp > 0.35
      ? mixHex(C.cyan, C.gold, curveAmp * 0.6)
      : stretchScale > 1.06
        ? mixHex(C.cyan, C.green, clamp01((stretchScale - 1) * 0.7))
        : mixHex("#dbe6ff", C.cyan, fabricCyanMix);

  const vertPaths: { d: string; isCenter: boolean }[] = [];
  for (let i = 0; i < cols.length; i++) {
    const cIdx = cols[i];
    const bx = cx + cIdx * baseStep;
    const pts: string[] = [];
    for (let s = 0; s <= segs; s++) {
      const by = cy - 5 * baseStep + (10 * baseStep * s) / segs;
      const p = deformPoint(bx, by);
      pts.push((s === 0 ? "M " : "L ") + p.x.toFixed(1) + " " + p.y.toFixed(1));
    }
    vertPaths.push({ d: pts.join(" "), isCenter: Math.abs(cIdx) <= 2 });
  }

  const horizPaths: { d: string; isCenter: boolean }[] = [];
  for (let i = 0; i < rows.length; i++) {
    const rIdx = rows[i];
    const by = cy + rIdx * baseStep;
    const pts: string[] = [];
    for (let s = 0; s <= segs; s++) {
      const bx = cx - 9 * baseStep + (18 * baseStep * s) / segs;
      const p = deformPoint(bx, by);
      pts.push((s === 0 ? "M " : "L ") + p.x.toFixed(1) + " " + p.y.toFixed(1));
    }
    horizPaths.push({ d: pts.join(" "), isCenter: Math.abs(rIdx) <= 1 });
  }

  // Rigid stage border box bounds (visible during Stage 0, cracks & explodes on shatterP)
  const frameBoxOpacity = clamp01(1 - shatterP * 1.15);
  const boxL = 215;
  const boxR = 1705;
  const boxT = 175;
  const boxB = 920;

  // Golden heavy sphere for Stage 2 CURVE
  const sphereY = lerp(120, cy - 22, curveIn) - (1 - curveOut) * 180;

  // Active Hero Word
  const activeStage =
    frame >= safeStretch
      ? "STRETCH"
      : frame >= safeCurve
        ? "CURVE"
        : frame >= safeBend
          ? "BEND"
          : "FIXED";

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <svg
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <radialGradient id="csl09FunnelGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={C.gold} stopOpacity={0.52} />
            <stop offset="48%" stopColor={C.cyan} stopOpacity={0.22} />
            <stop offset="100%" stopColor={C.cyan} stopOpacity={0} />
          </radialGradient>
          <radialGradient id="csl09MassSphere" cx="38%" cy="34%" r="65%">
            <stop offset="0%" stopColor="#fffbe6" />
            <stop offset="45%" stopColor={C.gold} />
            <stop offset="100%" stopColor="#d96b1f" />
          </radialGradient>
        </defs>

        {/* Deep glowing aura inside gravity funnel during CURVE */}
        {curveAmp > 0.02 && (
          <g opacity={curveAmp}>
            <ellipse
              cx={cx}
              cy={cy + 95}
              rx={330}
              ry={185}
              fill="url(#csl09FunnelGlow)"
            />
            {[95, 175, 255].map((rr, idx) => (
              <ellipse
                key={idx}
                cx={cx}
                cy={cy + 145 - idx * 45}
                rx={rr}
                ry={rr * 0.42}
                fill="none"
                stroke={idx === 0 ? C.gold : C.cyan}
                strokeWidth={2.2}
                strokeDasharray="8 10"
                opacity={0.55 - idx * 0.12}
              />
            ))}
          </g>
        )}

        {/* Full-Screen Deforming Spacetime Mesh */}
        <g>
          {vertPaths.map((p, idx) => (
            <path
              key={"v" + idx}
              d={p.d}
              fill="none"
              stroke={gridLineColor}
              strokeWidth={
                p.isCenter
                  ? 2.8 + (bendAmp + curveAmp + stretchArrowP) * 1.1
                  : 1.8 + (bendAmp + curveAmp + stretchArrowP) * 0.6
              }
              opacity={
                frameBoxOpacity > 0.2
                  ? 0.36
                  : p.isCenter
                    ? 0.88
                    : 0.48
              }
              style={
                p.isCenter && fabricCyanMix > 0.3
                  ? { filter: svgGlow(gridLineColor, 5) }
                  : undefined
              }
            />
          ))}
          {horizPaths.map((p, idx) => (
            <path
              key={"h" + idx}
              d={p.d}
              fill="none"
              stroke={gridLineColor}
              strokeWidth={
                p.isCenter
                  ? 2.8 + (bendAmp + curveAmp + stretchArrowP) * 1.1
                  : 1.8 + (bendAmp + curveAmp + stretchArrowP) * 0.6
              }
              opacity={
                frameBoxOpacity > 0.2
                  ? 0.36
                  : p.isCenter
                    ? 0.88
                    : 0.48
              }
              style={
                p.isCenter && fabricCyanMix > 0.3
                  ? { filter: svgGlow(gridLineColor, 5) }
                  : undefined
              }
            />
          ))}
        </g>

        {/* Stage 0 Rigid Metallic Outer Box Frame + Corner Clamps (shatters before BEND) */}
        {frameBoxOpacity > 0.01 && (
          <g
            opacity={frameBoxOpacity}
            transform={`translate(${cx}, ${cy}) scale(${introZoom + shatterP * 0.14}) translate(${-cx}, ${-cy})`}
          >
            <rect
              x={boxL}
              y={boxT}
              width={boxR - boxL}
              height={boxB - boxT}
              fill="none"
              stroke="#cbd5e1"
              strokeWidth={6}
              strokeDasharray={crackP > 0.1 ? "180 14 95 18 220 16" : undefined}
            />
            {/* 4 Corner Steel Brackets pulling apart as frame cracks */}
            {[
              { x: boxL, y: boxT, dx: -1, dy: -1 },
              { x: boxR, y: boxT, dx: 1, dy: -1 },
              { x: boxL, y: boxB, dx: -1, dy: 1 },
              { x: boxR, y: boxB, dx: 1, dy: 1 },
            ].map((c, idx) => {
              const ox = c.dx * shatterP * 85;
              const oy = c.dy * shatterP * 65;
              return (
                <path
                  key={idx}
                  d={`M ${c.x + ox} ${c.y + oy - c.dy * 42} L ${c.x + ox} ${c.y + oy} L ${c.x + ox - c.dx * 42} ${c.y + oy}`}
                  fill="none"
                  stroke={crackP > 0.3 ? C.cyan : "#ffffff"}
                  strokeWidth={9}
                  strokeLinecap="square"
                />
              );
            })}
            {/* Glowing cyan fracture zig-zags during crackP */}
            {crackP > 0.05 && (
              <g opacity={crackP} style={{ filter: svgGlow(C.cyan, 8) }}>
                <path
                  d={`M ${boxL} 390 L ${boxL + 46} 418 L ${boxL + 18} 456 L ${boxL + 74} 495`}
                  fill="none"
                  stroke={C.cyan}
                  strokeWidth={4}
                />
                <path
                  d={`M ${boxR} 610 L ${boxR - 52} 642 L ${boxR - 22} 678 L ${boxR - 86} 715`}
                  fill="none"
                  stroke={C.cyan}
                  strokeWidth={4}
                />
                <path
                  d={`M 910 ${boxT} L 944 ${boxT + 44} L 922 ${boxT + 82}`}
                  fill="none"
                  stroke={C.cyan}
                  strokeWidth={4}
                />
                <path
                  d={`M 1030 ${boxB} L 992 ${boxB - 48} L 1020 ${boxB - 86}`}
                  fill="none"
                  stroke={C.cyan}
                  strokeWidth={4}
                />
              </g>
            )}
          </g>
        )}

        {/* Stage 1 BEND: Curved Wave Motion Arrows — hidden cleanly on CURVE */}
        {bendAmp > 0.08 && frame < safeCurve + 3 && (
          <g opacity={bendAmp * 0.92}>
            <path
              d="M 520 345 Q 690 250 860 345"
              fill="none"
              stroke={C.cyan}
              strokeWidth={5}
              strokeLinecap="round"
              style={{ filter: svgGlow(C.cyan, 8) }}
            />
            <polygon points="0,0 -20,-10 -15,12" fill={C.cyan} transform="translate(866, 348) rotate(26)" />
            <path
              d="M 1060 755 Q 1230 850 1400 755"
              fill="none"
              stroke={C.cyan}
              strokeWidth={5}
              strokeLinecap="round"
              style={{ filter: svgGlow(C.cyan, 8) }}
            />
            <polygon points="0,0 -20,-12 -15,10" fill={C.cyan} transform="translate(1406, 752) rotate(-26)" />
          </g>
        )}

        {/* Stage 2 CURVE: Luminous Golden Massive Sphere Sitting in Gravity Funnel */}
        {curveAmp > 0.02 && (
          <g opacity={curveAmp}>
            <circle
              cx={cx}
              cy={sphereY}
              r={104}
              fill={C.gold}
              opacity={0.22}
              style={{ filter: svgGlow(C.gold, 18) }}
            />
            <circle
              cx={cx}
              cy={sphereY}
              r={68}
              fill="url(#csl09MassSphere)"
              stroke="#fff6d6"
              strokeWidth={2.5}
              style={{ filter: svgGlow(C.gold, 12) }}
            />
          </g>
        )}

        {/* Stage 3 STRETCH: 8 Blazing Outward Stretch Arrows Pulling Fabric Apart */}
        {stretchArrowP > 0.02 && (
          <g opacity={stretchArrowP}>
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
              const rad = (deg * Math.PI) / 180;
              const isCard = deg % 90 === 0;
              const isVert = deg === 90 || deg === 270;
              const rStart = isVert
                ? 145 + stretchU * 70
                : (isCard ? 165 : 190) + stretchU * 140;
              const len = isVert
                ? 135 * stretchArrowP + stretchU * 40
                : (isCard ? 195 : 145) * stretchArrowP + stretchU * 125;
              const rEnd = isVert ? Math.min(390, rStart + len) : rStart + len;
              const x1 = cx + Math.cos(rad) * rStart;
              const y1 = cy + Math.sin(rad) * rStart;
              const x2 = cx + Math.cos(rad) * rEnd;
              const rawY2 = cy + Math.sin(rad) * rEnd;
              const y2 =
                deg === 270
                  ? Math.max(158, rawY2)
                  : deg === 90
                    ? Math.min(1030, rawY2)
                    : rawY2;
              return (
                <g key={deg}>
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={isCard ? C.green : C.cyan}
                    strokeWidth={isCard ? 8 : 5.5}
                    strokeLinecap="round"
                    style={{ filter: svgGlow(isCard ? C.green : C.cyan, 9) }}
                  />
                  <polygon
                    points={isCard ? "0,0 -26,-14 -26,14" : "0,0 -20,-10 -20,10"}
                    fill={isCard ? C.green : C.cyan}
                    transform={`translate(${x2}, ${y2}) rotate(${deg})`}
                    style={{ filter: svgGlow(isCard ? C.green : C.cyan, 8) }}
                  />
                </g>
              );
            })}
          </g>
        )}
      </svg>

      {/* Subtle top dark linear fade so BEND / CURVE / STRETCH titles stay 100% crisp above grid */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 162,
          background:
            "linear-gradient(180deg, rgba(5, 10, 24, 0.94) 0%, rgba(5, 10, 24, 0.72) 58%, rgba(5, 10, 24, 0) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Clean Minimal Floating Stage Title (Never Cluttered, Always Bold!) */}
      {activeStage === "FIXED" && (
        <div style={{ opacity: clamp01(1 - shatterP * 1.1) }}>
          <MinimalLabel
            text={crackP > 0.25 ? "NOT A FIXED STAGE" : "FIXED STAGE?"}
            sub="1915 · GENERAL RELATIVITY"
            color={crackP > 0.25 ? C.cyan : C.white}
            x={960}
            y={52}
            align="center"
            size={42}
            delay={4}
          />
        </div>
      )}
      {activeStage === "BEND" && (
        <MinimalLabel
          text="BEND"
          color={C.cyan}
          x={960}
          y={44}
          align="center"
          size={72}
          delay={Math.max(0, safeBend - 3)}
        />
      )}
      {activeStage === "CURVE" && (
        <MinimalLabel
          text="CURVE"
          color={C.gold}
          x={960}
          y={44}
          align="center"
          size={72}
          delay={Math.max(0, safeCurve - 2)}
        />
      )}
      {activeStage === "STRETCH" && (
        <MinimalLabel
          text="STRETCH"
          color={C.green}
          x={960}
          y={44}
          align="center"
          size={72}
          delay={Math.max(0, safeStretch - 2)}
        />
      )}
    </AbsoluteFill>
  );
};

// ===========================================================================
// 10. LemaitreHubbleExpansionAnim — Ch 1 (2:08.8–2:25.6): Expanding Cosmos + Portraits
// ===========================================================================
const EXPAND_GALAXIES_14 = [
  { ang: -152, r0: 122, tilt: 14 },
  { ang: -116, r0: 162, tilt: -28 },
  { ang: -78, r0: 132, tilt: 32 },
  { ang: -42, r0: 178, tilt: -12 },
  { ang: -14, r0: 146, tilt: 22 },
  { ang: 18, r0: 172, tilt: -36 },
  { ang: 48, r0: 138, tilt: 18 },
  { ang: 82, r0: 176, tilt: -20 },
  { ang: 114, r0: 128, tilt: 40 },
  { ang: 148, r0: 168, tilt: -15 },
  { ang: 176, r0: 136, tilt: 28 },
  { ang: -176, r0: 210, tilt: -24 },
  { ang: -58, r0: 218, tilt: 16 },
  { ang: 128, r0: 214, tilt: -26 },
];

export const LemaitreHubbleExpansionAnim: React.FC<{
  lemaitreAt: number;
  hubbleAt: number;
  driftAt: number;
}> = ({ lemaitreAt, hubbleAt, driftAt }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const dur = Math.max(120, durationInFrames);
  const cx = 960;
  const cy = 548;

  // Continuous monotonic cosmic expansion spanning 100% of dur (1.0 -> 2.18)
  const uTotal = clamp01(frame / dur);
  const scaleFactor =
    1.0 + 1.18 * (0.35 * easeOutCubic(Math.min(1, uTotal * 1.8)) + 0.65 * uTotal);

  const driftU = clamp01((frame - driftAt) / Math.max(30, dur - driftAt));
  const arrowBloom = easeOutCubic((frame - driftAt) / 36);

  const step = 96 * scaleFactor;
  const lineIndices = [-7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7];

  return (
    <AbsoluteFill>
      <svg
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", inset: 0 }}
      >
        {/* Expanding Coordinate Mesh */}
        {lineIndices.map((idx) => {
          const gx = cx + idx * step;
          if (gx < -40 || gx > 1960) return null;
          return (
            <line
              key={"v" + idx}
              x1={gx}
              y1={0}
              x2={gx}
              y2={1080}
              stroke="rgba(62, 224, 255, 0.18)"
              strokeWidth={1.6}
            />
          );
        })}
        {lineIndices.map((idx) => {
          const gy = cy + idx * step;
          if (gy < -40 || gy > 1120) return null;
          return (
            <line
              key={"h" + idx}
              x1={0}
              y1={gy}
              x2={1920}
              y2={gy}
              stroke="rgba(62, 224, 255, 0.18)"
              strokeWidth={1.6}
            />
          );
        })}

        {/* Expanding radial pulse rings blooming on driftAt */}
        {driftU > 0.01 &&
          [0, 1, 2].map((rIdx) => {
            const localR = clamp01((driftU - rIdx * 0.22) / 0.62);
            if (localR <= 0.01) return null;
            return (
              <circle
                key={rIdx}
                cx={cx}
                cy={cy}
                r={70 + localR * 560}
                fill="none"
                stroke={C.red}
                strokeWidth={2}
                strokeDasharray="10 14"
                opacity={0.34 * (1 - localR * 0.78)}
              />
            );
          })}

        {/* Central Milky Way Reference */}
        <SpiralGalaxy x={cx} y={cy} radius={26} color={C.cyan} angle={18} />
        <text
          x={cx}
          y={cy + 48}
          textAnchor="middle"
          fill={C.cyan}
          fontFamily={MONO}
          fontWeight={700}
          fontSize={18}
        >
          MILKY WAY
        </text>

        {/* 14 Galaxies Drifting Radially Outward + Smooth Redshift + Outward Arrows */}
        {EXPAND_GALAXIES_14.map((g, idx) => {
          const rad = (g.ang * Math.PI) / 180;
          const rStart = g.r0;
          const rCur = g.r0 * scaleFactor;
          const x0 = cx + Math.cos(rad) * rStart;
          const y0 = cy + Math.sin(rad) * rStart;
          const x1 = cx + Math.cos(rad) * rCur;
          const y1 = cy + Math.sin(rad) * rCur;
          const zNorm = clamp01((rCur - 120) / 270);
          const col = redshiftColor(zNorm);

          const vecLen = (26 + rCur * 0.16) * arrowBloom * (0.85 + 0.35 * driftU);
          const ax = x1 + Math.cos(rad) * (22 + vecLen);
          const ay = y1 + Math.sin(rad) * (22 + vecLen);

          return (
            <g key={idx}>
              {rCur - rStart > 4 && (
                <line
                  x1={x0}
                  y1={y0}
                  x2={x1}
                  y2={y1}
                  stroke={col}
                  strokeWidth={1.8}
                  strokeDasharray="4 6"
                  opacity={0.5}
                />
              )}
              <SpiralGalaxy x={x1} y={y1} radius={18} color={col} angle={g.tilt} />
              {arrowBloom > 0.03 && (
                <g opacity={arrowBloom * 0.94}>
                  <line
                    x1={x1 + Math.cos(rad) * 22}
                    y1={y1 + Math.sin(rad) * 22}
                    x2={ax}
                    y2={ay}
                    stroke={col}
                    strokeWidth={3}
                    strokeLinecap="round"
                    style={{ filter: svgGlow(col, 4) }}
                  />
                  <polygon
                    points="0,0 -12,-5.5 -12,5.5"
                    fill={col}
                    transform={`translate(${ax}, ${ay}) rotate(${g.ang})`}
                  />
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* Clean Minimal Top Anchor */}
      <MinimalLabel
        text={frame >= driftAt ? "REDSHIFT IN EVERY DIRECTION" : "EXPANDING UNIVERSE"}
        sub={frame >= hubbleAt ? "1929 · HUBBLE CONFIRMED" : "1927 · LEMAÎTRE PREDICTED"}
        color={frame >= driftAt ? C.red : frame >= hubbleAt ? C.gold : C.cyan}
        x={960}
        y={48}
        align="center"
        size={34}
        delay={Math.max(0, lemaitreAt)}
      />

      {/* Left Flank: Georges Lemaitre Portrait (1927) */}
      <div style={{ position: "absolute", left: 52, top: 340, zIndex: 10 }}>
        <CleanPortrait
          src="cosmiclimit/portraits/lemaitre.jpg"
          name="Georges Lemaître"
          year="1927"
          credit="Public Domain · Wikimedia"
          accent={C.cyan}
          width={285}
          height={375}
          objectPosition="50% 18%"
          delay={lemaitreAt}
        />
      </div>

      {/* Right Flank: Edwin Hubble Portrait (1929) */}
      <div style={{ position: "absolute", right: 52, top: 340, zIndex: 10 }}>
        <CleanPortrait
          src="cosmiclimit/portraits/hubble.jpg"
          name="Edwin Hubble"
          year="1929"
          credit="Public Domain · Wikimedia"
          accent={C.gold}
          width={285}
          height={375}
          objectPosition="50% 14%"
          delay={hubbleAt}
        />
      </div>
    </AbsoluteFill>
  );
};

// ===========================================================================
// 11. BrandNewSpaceAnim — Ch 1 (2:25.6–2:37.0): HERO FIX FOR 2:30–2:37!
//     Crossed-out Rockets ("NOT ROCKETING X") -> Brand-New Glowing Grid Tiles
//     Spawning Right Between Galaxies Every Second Pushing Them Apart!
// ===========================================================================
const SPAWN_ORDER = [-1, 0, 2, 4, 6, 5, 3, 1, -2]; // -1=baseL, -2=baseR, 0..6=fresh center tiles!

export const BrandNewSpaceAnim: React.FC<{ spawnAt: number }> = ({
  spawnAt,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const dur = Math.max(120, durationInFrames);
  const cx = 960;
  const cy = 565;
  const tileW = 144;
  const tileH = 276;

  const safeSpawn = Math.max(36, Math.min(dur - 60, spawnAt));

  // PHASE 1 (0 -> safeSpawn): Galaxies strapped to rocket engines -> stamped NOT ROCKETING X!
  const p1U = clamp01(frame / safeSpawn);
  const xStampAt = Math.round(safeSpawn * 0.36);
  const thrusterCrossP =
    frame >= xStampAt ? clamp01((frame - xStampAt) / 16) : 0;
  const rocketFadeOut =
    frame >= safeSpawn - 22
      ? clamp01(1 - (frame - (safeSpawn - 22)) / 22)
      : 1;
  // Brief outward thruster push then snap smoothly to base tile anchors (816, 1104)
  const rocketKick =
    frame < xStampAt
      ? easeOutCubic(frame / Math.max(1, xStampAt)) * 42
      : lerp(42, 0, easeInOutCubic((frame - xStampAt) / Math.max(12, safeSpawn - xStampAt)));

  // PHASE 2 (safeSpawn -> dur): 7 brand-new glowing space tiles spawn right at center!
  const numSpawns = 7;
  const p2Dur = Math.max(48, dur - safeSpawn);
  const spawnInterval = p2Dur / numSpawns;
  const spawnAnimDur = Math.min(28, spawnInterval * 0.85);

  const p2Appear = easeOutCubic((frame - safeSpawn) / 18);

  const tileItems = SPAWN_ORDER.map((id) => {
    if (id < 0) {
      return { id, w: tileW, fresh: 0, active: true };
    }
    const startF = safeSpawn + id * spawnInterval;
    const rawT = (frame - startF) / spawnAnimDur;
    const w = frame >= startF ? tileW * easeOutCubic(rawT) : 0;
    const fresh =
      frame >= startF ? 1 - clamp01((frame - startF) / (spawnInterval * 1.25)) : 0;
    return { id, w, fresh, active: frame >= startF };
  });

  const totalGap = tileItems.reduce((acc, t) => acc + t.w, 0);
  const leftGalX = cx - totalGap * 0.5 - (frame < safeSpawn ? rocketKick : 0);
  const rightGalX = cx + totalGap * 0.5 + (frame < safeSpawn ? rocketKick : 0);

  // Determine newest active tile for the floating "+ NEW SPACE" spark badge
  const latestIdx =
    frame >= safeSpawn
      ? Math.min(numSpawns - 1, Math.floor((frame - safeSpawn) / spawnInterval))
      : -1;
  const latestStartF = latestIdx >= 0 ? safeSpawn + latestIdx * spawnInterval : 0;
  const latestPulseU =
    latestIdx >= 0
      ? clamp01((frame - latestStartF) / Math.max(14, spawnInterval))
      : 0;

  // Compute left-to-right tile screen positions
  let cursorX = cx - totalGap * 0.5;
  const positionedTiles = tileItems.map((t) => {
    const x = cursorX;
    cursorX += t.w;
    return { ...t, x };
  });

  const latestTilePos =
    latestIdx >= 0
      ? positionedTiles.find((t) => t.id === latestIdx)
      : undefined;
  const latestCenterX = latestTilePos
    ? latestTilePos.x + latestTilePos.w * 0.5
    : cx;

  return (
    <AbsoluteFill>
      <svg
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <linearGradient
            id="csl11NewTileFill"
            gradientUnits="userSpaceOnUse"
            x1={cx}
            y1={cy - tileH * 0.5}
            x2={cx}
            y2={cy + tileH * 0.5}
          >
            <stop offset="0%" stopColor={C.green} stopOpacity={0.34} />
            <stop offset="50%" stopColor={C.cyan} stopOpacity={0.18} />
            <stop offset="100%" stopColor={C.green} stopOpacity={0.34} />
          </linearGradient>
          <linearGradient
            id="csl11BaseTileFill"
            gradientUnits="userSpaceOnUse"
            x1={cx}
            y1={cy - tileH * 0.5}
            x2={cx}
            y2={cy + tileH * 0.5}
          >
            <stop offset="0%" stopColor={C.cyan} stopOpacity={0.14} />
            <stop offset="50%" stopColor={C.cyan} stopOpacity={0.06} />
            <stop offset="100%" stopColor={C.cyan} stopOpacity={0.14} />
          </linearGradient>
        </defs>

        {/* Faint ambient backdrop horizontal guide */}
        <line
          x1={80}
          y1={cy}
          x2={1840}
          y2={cy}
          stroke="rgba(62, 224, 255, 0.16)"
          strokeWidth={2}
          strokeDasharray="8 14"
        />

        {/* PHASE 2: Glowing Space Grid Tiles Spawning Between the Galaxies */}
        <g opacity={p2Appear}>
          {positionedTiles.map((tile) => {
            if (tile.w < 1.5) return null;
            const isFresh = tile.fresh > 0.04;
            const borderCol = isFresh
              ? mixHex(C.cyan, C.green, tile.fresh)
              : C.cyan;
            const pad = 4;
            const innerW = Math.max(0, tile.w - pad * 2);
            return (
              <g key={tile.id}>
                {/* Tile box */}
                <rect
                  x={tile.x + pad}
                  y={cy - tileH * 0.5}
                  width={innerW}
                  height={tileH}
                  rx={12}
                  fill={isFresh ? "url(#csl11NewTileFill)" : "url(#csl11BaseTileFill)"}
                  stroke={borderCol}
                  strokeWidth={isFresh ? 3.2 : 1.9}
                  opacity={isFresh ? 0.96 : 0.72}
                  style={isFresh ? { filter: svgGlow(C.green, 7) } : undefined}
                />
                {/* Crisp 3x3 internal space-mesh subdivisions inside every tile */}
                {innerW > 24 && (
                  <g opacity={isFresh ? 0.55 : 0.25}>
                    <line
                      x1={tile.x + tile.w * 0.33}
                      y1={cy - tileH * 0.5 + 8}
                      x2={tile.x + tile.w * 0.33}
                      y2={cy + tileH * 0.5 - 8}
                      stroke={borderCol}
                      strokeWidth={1.2}
                    />
                    <line
                      x1={tile.x + tile.w * 0.67}
                      y1={cy - tileH * 0.5 + 8}
                      x2={tile.x + tile.w * 0.67}
                      y2={cy + tileH * 0.5 - 8}
                      stroke={borderCol}
                      strokeWidth={1.2}
                    />
                    <line
                      x1={tile.x + pad + 6}
                      y1={cy - tileH * 0.17}
                      x2={tile.x + tile.w - pad - 6}
                      y2={cy - tileH * 0.17}
                      stroke={borderCol}
                      strokeWidth={1.2}
                    />
                    <line
                      x1={tile.x + pad + 6}
                      y1={cy + tileH * 0.17}
                      x2={tile.x + tile.w - pad - 6}
                      y2={cy + tileH * 0.17}
                      stroke={borderCol}
                      strokeWidth={1.2}
                    />
                  </g>
                )}
                {/* Crisp '+' symbol glowing inside freshly spawned tile */}
                {tile.id >= 0 && innerW > 46 && (
                  <text
                    x={tile.x + tile.w * 0.5}
                    y={cy + 12}
                    textAnchor="middle"
                    fill={isFresh ? C.green : C.cyan}
                    fontFamily={MONO}
                    fontWeight={700}
                    fontSize={36}
                    opacity={isFresh ? 0.95 : 0.32}
                    style={isFresh ? { filter: svgGlow(C.green, 6) } : undefined}
                  >
                    +
                  </text>
                )}
              </g>
            );
          })}

          {/* Expanding Spark Seam & "+ NEW SPACE" Badge on every single tile spawn! */}
          {latestIdx >= 0 && (
            <g opacity={1 - latestPulseU * 0.35}>
              <line
                x1={latestCenterX}
                y1={cy - tileH * 0.5 - 22}
                x2={latestCenterX}
                y2={cy + tileH * 0.5 + 22}
                stroke={C.green}
                strokeWidth={3}
                opacity={0.75 * (1 - latestPulseU)}
                style={{ filter: svgGlow(C.green, 8) }}
              />
              <text
                x={latestCenterX}
                y={cy - tileH * 0.5 - 32 - latestPulseU * 20}
                textAnchor="middle"
                fill={C.green}
                fontFamily={MONO}
                fontWeight={700}
                fontSize={30}
                style={{ filter: svgGlow(C.green, 8) }}
              >
                + NEW SPACE
              </text>
            </g>
          )}

          {/* Outward push arrows right beside the galaxies during Phase 2 */}
          {p2Appear > 0.05 && (
            <g opacity={p2Appear * 0.85}>
              <line
                x1={leftGalX - 58}
                y1={cy}
                x2={Math.max(46, leftGalX - 135)}
                y2={cy}
                stroke={C.cyan}
                strokeWidth={5.5}
                strokeLinecap="round"
              />
              <polygon
                points="0,0 18,-10 18,10"
                fill={C.cyan}
                transform={`translate(${Math.max(36, leftGalX - 146)}, ${cy})`}
              />
              <line
                x1={rightGalX + 58}
                y1={cy}
                x2={Math.min(1874, rightGalX + 135)}
                y2={cy}
                stroke={C.cyan}
                strokeWidth={5.5}
                strokeLinecap="round"
              />
              <polygon
                points="0,0 -18,-10 -18,10"
                fill={C.cyan}
                transform={`translate(${Math.min(1884, rightGalX + 146)}, ${cy})`}
              />
            </g>
          )}
        </g>

        {/* PHASE 1: Rocket Thrusters Strapped to Galaxies -> Crossed Out X! */}
        {rocketFadeOut > 0.01 && (
          <g opacity={rocketFadeOut}>
            {/* Left galaxy rocket pointing left */}
            <SleekRocket
              x={leftGalX - 38}
              y={cy}
              scale={1.15}
              angle={180}
              thrust={thrusterCrossP > 0.35 ? 0.12 : 0.92}
              flameColor={C.gold}
            />
            {/* Right galaxy rocket pointing right */}
            <SleekRocket
              x={rightGalX + 38}
              y={cy}
              scale={1.15}
              angle={0}
              thrust={thrusterCrossP > 0.35 ? 0.12 : 0.92}
              flameColor={C.gold}
            />
            {/* Bold Crimson X Stamps slamming over both rocket thrusters */}
            <CrimsonCross
              x={leftGalX - 74}
              y={cy}
              size={58}
              progress={thrusterCrossP}
            />
            <CrimsonCross
              x={rightGalX + 74}
              y={cy}
              size={58}
              progress={thrusterCrossP}
            />
          </g>
        )}

        {/* Left & Right Galaxies (Pinned on Outer Edges of Growing Space Ribbon!) */}
        <g>
          {p2Appear > 0.05 && (
            <circle
              cx={leftGalX}
              cy={cy}
              r={42}
              fill="none"
              stroke={C.cyan}
              strokeWidth={2.2}
              strokeDasharray="6 6"
              opacity={p2Appear * 0.78}
            />
          )}
          <SpiralGalaxy
            x={leftGalX}
            y={cy}
            radius={32}
            color={C.cyan}
            angle={18 + p1U * 14}
          />
          <text
            x={leftGalX}
            y={cy + 74}
            textAnchor="middle"
            fill={C.cyan}
            fontFamily={MONO}
            fontWeight={700}
            fontSize={22}
          >
            MILKY WAY
          </text>
          {p2Appear > 0.1 && (
            <text
              x={leftGalX}
              y={cy + 102}
              textAnchor="middle"
              fill={C.dim}
              fontFamily={MONO}
              fontWeight={700}
              fontSize={17}
              opacity={p2Appear}
            >
              LOCAL v = 0
            </text>
          )}
        </g>

        <g>
          {p2Appear > 0.05 && (
            <circle
              cx={rightGalX}
              cy={cy}
              r={42}
              fill="none"
              stroke={C.gold}
              strokeWidth={2.2}
              strokeDasharray="6 6"
              opacity={p2Appear * 0.78}
            />
          )}
          <SpiralGalaxy
            x={rightGalX}
            y={cy}
            radius={32}
            color={frame >= safeSpawn ? C.red : "#ffd79c"}
            angle={-22 - p1U * 14}
          />
          <text
            x={rightGalX}
            y={cy + 74}
            textAnchor="middle"
            fill={frame >= safeSpawn ? C.red : C.gold}
            fontFamily={MONO}
            fontWeight={700}
            fontSize={22}
          >
            DISTANT GALAXY
          </text>
          {p2Appear > 0.1 && (
            <text
              x={rightGalX}
              y={cy + 102}
              textAnchor="middle"
              fill={C.dim}
              fontFamily={MONO}
              fontWeight={700}
              fontSize={17}
              opacity={p2Appear}
            >
              LOCAL v = 0
            </text>
          )}
        </g>

        {/* Bottom Expanding Distance Caliper spanning the growing space gap */}
        {p2Appear > 0.1 && (
          <g opacity={p2Appear * 0.85}>
            <line
              x1={leftGalX}
              y1={805}
              x2={rightGalX}
              y2={805}
              stroke={C.green}
              strokeWidth={3}
            />
            <line x1={leftGalX} y1={792} x2={leftGalX} y2={818} stroke={C.green} strokeWidth={3} />
            <line x1={rightGalX} y1={792} x2={rightGalX} y2={818} stroke={C.green} strokeWidth={3} />
            <text
              x={cx}
              y={848}
              textAnchor="middle"
              fill={C.green}
              fontFamily={MONO}
              fontWeight={700}
              fontSize={26}
              style={{ filter: svgGlow(C.green, 6) }}
            >
              SPACE CELLS: {2 + Math.max(0, latestIdx + 1)}
            </text>
          </g>
        )}
      </svg>

      {/* Top Headline Transitions cleanly from NOT ROCKETING X -> + BRAND-NEW SPACE */}
      {rocketFadeOut > 0.05 && (
        <div style={{ opacity: rocketFadeOut }}>
          <MinimalLabel
            text="NOT ROCKETING ✕"
            sub="NO ENGINES THROUGH SPACE"
            color={C.red}
            x={960}
            y={64}
            align="center"
            size={48}
            delay={Math.max(0, xStampAt - 2)}
          />
        </div>
      )}

      <MinimalLabel
        text="BRAND-NEW SPACE"
        sub="CREATED EVERY SINGLE SECOND"
        color={C.green}
        x={960}
        y={58}
        align="center"
        size={48}
        delay={safeSpawn}
      />
    </AbsoluteFill>
  );
};
