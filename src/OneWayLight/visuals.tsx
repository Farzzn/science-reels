import React from "react";
import { C, INTER, MONO, svgGlow } from "../FiveHundredMileEmail/theme";

// ES2015-safe zero padding (never uses String.prototype.padStart)
export function pad2(n: number): string {
  const v = Math.floor(Math.abs(n));
  return v < 10 ? `0${v}` : `${v}`;
}

export function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

export function easeOutCubic(t: number): number {
  const u = 1 - clamp01(t);
  return 1 - u * u * u;
}

export function easeInOutCubic(t: number): number {
  const x = clamp01(t);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

// ===========================================================================
// 1. MinimalClock — Crisp glowing analog + optional digital readout clock
// ===========================================================================
export const MinimalClock: React.FC<{
  cx: number;
  cy: number;
  r?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  color?: string;
  label?: string;
  digital?: string;
  sub?: string;
  opacity?: number;
  warning?: boolean;
  questionMark?: boolean;
}> = ({
  cx,
  cy,
  r = 92,
  hours = 3,
  minutes = 0,
  seconds = 0,
  color = C.cyan,
  label,
  digital,
  sub,
  opacity = 1,
  warning = false,
  questionMark = false,
}) => {
  if (opacity <= 0.01) return null;
  const ringColor = warning ? C.red : color;
  const hAngle = ((hours % 12) + minutes / 60) * 30 - 90;
  const mAngle = (minutes + seconds / 60) * 6 - 90;
  const sAngle = seconds * 6 - 90;

  const hRad = (hAngle * Math.PI) / 180;
  const mRad = (mAngle * Math.PI) / 180;
  const sRad = (sAngle * Math.PI) / 180;

  return (
    <g transform={`translate(${cx}, ${cy})`} opacity={opacity}>
      {/* Subtle outer halo */}
      <circle
        cx={0}
        cy={0}
        r={r + 14}
        fill="none"
        stroke={ringColor}
        strokeWidth={1.6}
        opacity={0.22}
      />
      {/* Dark glass face */}
      <circle
        cx={0}
        cy={0}
        r={r}
        fill="#071024"
        fillOpacity={0.94}
        stroke={ringColor}
        strokeWidth={3.5}
        style={{ filter: svgGlow(ringColor, 10) }}
      />
      {/* Inner recessed rim */}
      <circle
        cx={0}
        cy={0}
        r={r - 10}
        fill="none"
        stroke={ringColor}
        strokeWidth={1}
        opacity={0.3}
      />

      {/* 12 hour ticks */}
      {Array.from({ length: 12 }).map((_, i) => {
        const a = ((i * 30 - 90) * Math.PI) / 180;
        const major = i % 3 === 0;
        const r1 = r - (major ? 22 : 16);
        const r2 = r - 7;
        return (
          <line
            key={i}
            x1={Math.cos(a) * r1}
            y1={Math.sin(a) * r1}
            x2={Math.cos(a) * r2}
            y2={Math.sin(a) * r2}
            stroke={major ? C.white : ringColor}
            strokeWidth={major ? 3.2 : 1.8}
            strokeLinecap="round"
            opacity={major ? 0.92 : 0.55}
          />
        );
      })}

      {questionMark ? (
        <text
          x={0}
          y={20}
          textAnchor="middle"
          fill={ringColor}
          fontFamily={MONO}
          fontWeight={800}
          fontSize={r * 0.68}
          style={{ filter: svgGlow(ringColor, 10) }}
        >
          ?
        </text>
      ) : (
        <>
          {/* Hour hand */}
          <line
            x1={0}
            y1={0}
            x2={Math.cos(hRad) * (r * 0.48)}
            y2={Math.sin(hRad) * (r * 0.48)}
            stroke={C.white}
            strokeWidth={5.5}
            strokeLinecap="round"
          />
          {/* Minute hand */}
          <line
            x1={0}
            y1={0}
            x2={Math.cos(mRad) * (r * 0.7)}
            y2={Math.sin(mRad) * (r * 0.7)}
            stroke={ringColor}
            strokeWidth={3.6}
            strokeLinecap="round"
            style={{ filter: svgGlow(ringColor, 6) }}
          />
          {/* Second hand */}
          <line
            x1={0}
            y1={0}
            x2={Math.cos(sRad) * (r * 0.78)}
            y2={Math.sin(sRad) * (r * 0.78)}
            stroke={C.gold}
            strokeWidth={2}
            strokeLinecap="round"
            opacity={0.92}
          />
          {/* Center cap */}
          <circle cx={0} cy={0} r={5.5} fill={C.white} />
        </>
      )}

      {/* Top label */}
      {label && (
        <text
          x={0}
          y={-r - 28}
          textAnchor="middle"
          fill={ringColor}
          fontFamily={MONO}
          fontWeight={700}
          fontSize={24}
          letterSpacing={2.4}
          style={{ filter: svgGlow(ringColor, 6) }}
        >
          {label}
        </text>
      )}

      {/* Digital time readout below */}
      {digital && (
        <text
          x={0}
          y={r + 44}
          textAnchor="middle"
          fill={warning ? C.red : C.white}
          fontFamily={MONO}
          fontWeight={800}
          fontSize={34}
          letterSpacing={2}
          style={{ filter: svgGlow(ringColor, 6) }}
        >
          {digital}
        </text>
      )}

      {/* Sub-label */}
      {sub && (
        <text
          x={0}
          y={r + (digital ? 76 : 40)}
          textAnchor="middle"
          fill={C.dim}
          fontFamily={INTER}
          fontWeight={600}
          fontSize={18}
          letterSpacing={1.8}
        >
          {sub}
        </text>
      )}
    </g>
  );
};

// ===========================================================================
// 2. PhotonPacket — Glowing wave packet gliding along (x1,y1) -> (x2,y2)
//    Uses explicit userSpaceOnUse gradients so horizontal lines NEVER vanish!
// ===========================================================================
export const PhotonPacket: React.FC<{
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  progress: number;
  color?: string;
  tailLen?: number;
  amp?: number;
  waves?: number;
  opacity?: number;
  label?: string;
}> = ({
  id,
  x1,
  y1,
  x2,
  y2,
  progress,
  color = C.gold,
  tailLen = 190,
  amp = 13,
  waves = 3.5,
  opacity = 1,
  label,
}) => {
  const p = clamp01(progress);
  if (opacity <= 0.01 || p <= 0.001) return null;

  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.max(1, Math.hypot(dx, dy));
  const ux = dx / dist;
  const uy = dy / dist;
  const nx = -uy;
  const ny = ux;

  const headD = p * dist;
  const startD = Math.max(0, headD - tailLen);
  const segLen = headD - startD;
  if (segLen < 2) return null;

  const hx = x1 + ux * headD;
  const hy = y1 + uy * headD;
  const sx = x1 + ux * startD;
  const sy = y1 + uy * startD;

  // Build smooth sinusoidal wave trail
  const pts: string[] = [];
  const steps = 32;
  for (let i = 0; i <= steps; i++) {
    const f = i / steps;
    const d = startD + f * segLen;
    const env = Math.sin(f * Math.PI) * Math.pow(f, 0.55);
    const osc = Math.sin(f * Math.PI * 2 * waves - p * 12) * amp * env;
    const px = x1 + ux * d + nx * osc;
    const py = y1 + uy * d + ny * osc;
    pts.push(`${i === 0 ? "M" : "L"}${px.toFixed(1)},${py.toFixed(1)}`);
  }

  return (
    <g opacity={opacity}>
      <defs>
        <linearGradient
          id={id}
          gradientUnits="userSpaceOnUse"
          x1={sx}
          y1={sy}
          x2={hx}
          y2={hy}
        >
          <stop offset="0%" stopColor={color} stopOpacity={0} />
          <stop offset="45%" stopColor={color} stopOpacity={0.78} />
          <stop offset="100%" stopColor="#ffffff" stopOpacity={1} />
        </linearGradient>
      </defs>

      {/* Subtle straight core beam */}
      <line
        x1={sx}
        y1={sy}
        x2={hx}
        y2={hy}
        stroke={`url(#${id})`}
        strokeWidth={2.5}
        opacity={0.45}
      />

      {/* Sinusoidal wave packet */}
      <path
        d={pts.join(" ")}
        fill="none"
        stroke={`url(#${id})`}
        strokeWidth={4.5}
        strokeLinecap="round"
        style={{ filter: svgGlow(color, 10) }}
      />

      {/* Blazing leading photon head */}
      <circle
        cx={hx}
        cy={hy}
        r={11}
        fill={color}
        opacity={0.45}
        style={{ filter: svgGlow(color, 12) }}
      />
      <circle cx={hx} cy={hy} r={6} fill="#ffffff" />

      {label && (
        <text
          x={(sx + hx) * 0.5}
          y={(sy + hy) * 0.5 - amp - 18}
          textAnchor="middle"
          fill={color}
          fontFamily={MONO}
          fontWeight={700}
          fontSize={22}
          letterSpacing={1.5}
          style={{ filter: svgGlow(color, 6) }}
        >
          {label}
        </text>
      )}
    </g>
  );
};

// ===========================================================================
// 3. SpiralGalaxy — Luminous stylized Andromeda galaxy vector graphic
// ===========================================================================
export const SpiralGalaxy: React.FC<{
  cx: number;
  cy: number;
  scale?: number;
  rotation?: number;
  opacity?: number;
  color?: string;
}> = ({
  cx,
  cy,
  scale = 1,
  rotation = -18,
  opacity = 1,
  color = "#c084fc",
}) => {
  if (opacity <= 0.01) return null;
  const armAngles = [0, 120, 240];
  return (
    <g
      transform={`translate(${cx}, ${cy}) scale(${scale}) rotate(${rotation})`}
      opacity={opacity}
    >
      {/* Soft outer nebula glow */}
      <ellipse
        cx={0}
        cy={0}
        rx={122}
        ry={50}
        fill={color}
        opacity={0.14}
        style={{ filter: svgGlow(color, 18) }}
      />
      <ellipse
        cx={0}
        cy={0}
        rx={82}
        ry={32}
        fill="#e879f9"
        opacity={0.2}
      />
      {/* Spiral arms */}
      <g transform="scale(1, 0.44)">
        {armAngles.map((a) => (
          <g key={a} transform={`rotate(${a})`}>
            <path
              d="M 0,0 C 26,-16 56,-8 78,24 C 98,52 94,94 64,116"
              fill="none"
              stroke={color}
              strokeWidth={9}
              strokeLinecap="round"
              opacity={0.45}
              style={{ filter: svgGlow(color, 8) }}
            />
            <path
              d="M 0,0 C 24,-14 52,-6 74,24 C 92,48 88,88 58,108"
              fill="none"
              stroke="#f5d0fe"
              strokeWidth={3.2}
              strokeLinecap="round"
              opacity={0.85}
            />
          </g>
        ))}
      </g>
      {/* Blazing galactic core */}
      <ellipse
        cx={0}
        cy={0}
        rx={34}
        ry={16}
        fill="#fdf4ff"
        opacity={0.92}
        style={{ filter: svgGlow("#f0abfc", 14) }}
      />
      <circle cx={0} cy={0} r={11} fill="#ffffff" />
    </g>
  );
};

// ===========================================================================
// 4. MinimalWalker — Sleek vector observer icon on sidewalk / platform
// ===========================================================================
export const MinimalWalker: React.FC<{
  x: number;
  y: number;
  dir: 1 | -1;
  color: string;
  stride?: number;
  scale?: number;
  label?: string;
}> = ({ x, y, dir, color, stride = 0, scale = 1, label }) => {
  const leg = Math.sin(stride) * 14;
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Head */}
      <circle
        cx={0}
        cy={-56}
        r={11}
        fill={color}
        style={{ filter: svgGlow(color, 8) }}
      />
      {/* Torso */}
      <line
        x1={0}
        y1={-44}
        x2={dir * 3}
        y2={-14}
        stroke={color}
        strokeWidth={5.5}
        strokeLinecap="round"
      />
      {/* Arms */}
      <line
        x1={0}
        y1={-36}
        x2={dir * (12 - leg * 0.5)}
        y2={-20}
        stroke={color}
        strokeWidth={4}
        strokeLinecap="round"
        opacity={0.85}
      />
      <line
        x1={0}
        y1={-36}
        x2={dir * (-10 + leg * 0.5)}
        y2={-20}
        stroke={color}
        strokeWidth={4}
        strokeLinecap="round"
        opacity={0.65}
      />
      {/* Legs */}
      <line
        x1={dir * 3}
        y1={-14}
        x2={dir * (10 + leg)}
        y2={14}
        stroke={color}
        strokeWidth={5}
        strokeLinecap="round"
      />
      <line
        x1={dir * 3}
        y1={-14}
        x2={dir * (-10 - leg)}
        y2={14}
        stroke={color}
        strokeWidth={5}
        strokeLinecap="round"
        opacity={0.78}
      />
      {/* Directional arrow */}
      <line
        x1={dir * 22}
        y1={-34}
        x2={dir * 56}
        y2={-34}
        stroke={color}
        strokeWidth={3.2}
        strokeLinecap="round"
        style={{ filter: svgGlow(color, 6) }}
      />
      <polyline
        points={`${dir * 46},-42 ${dir * 58},-34 ${dir * 46},-26`}
        fill="none"
        stroke={color}
        strokeWidth={3.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {label && (
        <text
          x={0}
          y={54}
          textAnchor="middle"
          fill={color}
          fontFamily={MONO}
          fontWeight={700}
          fontSize={20}
          letterSpacing={1.4}
        >
          {label}
        </text>
      )}
    </g>
  );
};
