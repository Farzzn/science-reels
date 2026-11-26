import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, glow, INTER, MONO, svgGlow } from "../FiveHundredMileEmail/theme";
import { MinimalLabel } from "./ui";

// ===========================================================================
// Shared Helpers (ES2015-safe, smooth monotonic progression, zero loops)
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

const SpiralGalaxy: React.FC<{
  x: number;
  y: number;
  radius?: number;
  color?: string;
  angle?: number;
  opacity?: number;
}> = ({ x, y, radius = 20, color = "#eaf3ff", angle = 0, opacity = 1 }) => {
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
        opacity={0.9}
      />
      <path
        d="M 0 0 C -7 2 -13 9 -18 14 C -12 4 -6 -2 0 -3"
        fill="none"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        opacity={0.9}
      />
      <path
        d="M 0 0 C 2 7 9 12 14 14"
        fill="none"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        opacity={0.55}
      />
      <path
        d="M 0 0 C -2 -7 -9 -12 -14 -14"
        fill="none"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        opacity={0.55}
      />
      <circle cx={0} cy={0} r={4.8} fill="#ffffff" />
    </g>
  );
};

// Crisp glowing Earth orb
const EarthOrb: React.FC<{ x: number; y: number; r?: number }> = ({
  x,
  y,
  r = 16,
}) => (
  <g transform={`translate(${x}, ${y})`}>
    <circle
      cx={0}
      cy={0}
      r={r * 2.15}
      fill={C.cyan}
      opacity={0.16}
      style={{ filter: svgGlow(C.cyan, 10) }}
    />
    <circle
      cx={0}
      cy={0}
      r={r * 1.25}
      fill="none"
      stroke={C.cyan}
      strokeWidth={1.8}
      opacity={0.58}
    />
    <circle cx={0} cy={0} r={r} fill="#1d6fe8" stroke={C.cyan} strokeWidth={2} />
    <path
      d={`M ${-r * 0.45} ${-r * 0.25} Q 0 ${-r * 0.55} ${r * 0.35} ${-r * 0.1} Q ${r * 0.1} ${r * 0.3} ${-r * 0.35} ${r * 0.25} Z`}
      fill={C.green}
      opacity={0.78}
    />
    <circle
      cx={-r * 0.3}
      cy={-r * 0.3}
      r={r * 0.25}
      fill="#ffffff"
      opacity={0.42}
    />
  </g>
);

// ===========================================================================
// 1. ExpandingGridHubbleLawAnim — Ch 2A (2:37.8–3:51.3): 9-Cue Elastic Grid
// ===========================================================================
export const ExpandingGridHubbleLawAnim: React.FC<{
  pinAt: number;
  parkedAt: number;
  stretchAt: number;
  rateAt: number;
  oneAt: number;
  twoAt: number;
  threeAt: number;
  lawAt: number;
  exceedAt: number;
}> = ({
  pinAt,
  parkedAt,
  stretchAt,
  rateAt,
  oneAt,
  twoAt,
  threeAt,
  lawAt,
  exceedAt,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const dur = Math.max(300, durationInFrames);
  const x0 = 185;
  const y0 = 645;
  const cell0 = 148;

  // Phase 0 (0 -> pinAt): Grid lines smoothly draw across the entire canvas
  const gridDrawP = easeOutCubic(frame / Math.max(30, pinAt * 0.85));

  // Continuous monotonic stretch spanning 100% of durationInFrames!
  // Gently breathes 0.96 -> 1.00 before pinAt, 1.00 -> 1.04 before stretchAt,
  // then stretches steadily from 1.04 -> 2.38 ALL THE WAY to dur!
  const safeStretch = Math.max(parkedAt + 12, stretchAt);
  let scaleFactor: number;
  if (frame < pinAt) {
    scaleFactor = lerp(0.96, 1.0, clamp01(frame / Math.max(1, pinAt)));
  } else if (frame < safeStretch) {
    scaleFactor = lerp(
      1.0,
      1.04,
      clamp01((frame - pinAt) / Math.max(1, safeStretch - pinAt)),
    );
  } else {
    const uStretch = clamp01(
      (frame - safeStretch) / Math.max(60, dur - safeStretch),
    );
    scaleFactor =
      1.04 +
      1.34 * (0.34 * easeOutCubic(Math.min(1, uStretch * 2.8)) + 0.66 * uStretch);
  }
  const cell = cell0 * scaleFactor;

  // Phase 1 (pinAt -> parkedAt): Galaxies pin onto intersections staggered 0..4
  const pinSpan = Math.max(24, parkedAt - pinAt);
  const nodePinP = (n: number) => {
    const startF = pinAt + n * (pinSpan * 0.16);
    if (frame < startF) return 0;
    return spring({
      frame: Math.max(0, frame - startF),
      fps,
      config: { damping: 14, stiffness: 135 },
    });
  };

  // Phase 2 (parkedAt): Pin-lock rings pulse + LOCAL v = 0 badges
  const parkedP = easeOutCubic((frame - parkedAt) / 28);
  const parkRingPulse =
    frame >= parkedAt ? clamp01((frame - parkedAt) / 48) : 0;

  // Phase 3 (rateAt): Single-cell ruler highlights 67 km/s per 3.3 M ly
  const rateP = easeOutCubic((frame - rateAt) / 28);

  // Timed proportional vector activations
  const p1 = easeOutCubic((frame - oneAt) / 30);
  const p2 = easeOutCubic((frame - twoAt) / 30);
  const p3 = easeOutCubic((frame - threeAt) / 30);
  const pLaw = easeOutCubic((frame - lawAt) / 36);
  const p4 = easeOutCubic((frame - exceedAt) / 36);

  const unitArrow = 48; // 1x = 48, 2x = 96, 3x = 144, 4x = 224 (blasts past c!)
  const stepY = 46; // Stepped arrow heights -> tips lie EXACTLY on one straight proportional line!
  const arrowYOf = (idx: number) => y0 - 28 - idx * stepY;

  const activeSquares =
    frame >= exceedAt
      ? 4
      : frame >= threeAt
        ? 3
        : frame >= twoAt
          ? 2
          : frame >= oneAt || frame >= rateAt
            ? 1
            : 0;

  const cols = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const rows = [-4, -3, -2, -1, 0, 1, 2, 3, 4];

  const nodes = [
    { idx: 1, prog: p1, mult: "1×", color: C.cyan, len: unitArrow * 1 },
    { idx: 2, prog: p2, mult: "2×", color: C.cyan, len: unitArrow * 2 },
    { idx: 3, prog: p3, mult: "3×", color: C.gold, len: unitArrow * 3 },
    { idx: 4, prog: p4, mult: "> c", color: C.red, len: 224 },
  ];

  // Exact linear proportionality slope line connecting origin (x0, y0 - 28) across 1x, 2x, 3x tips!
  const tip3X = x0 + 3 * (cell + unitArrow);
  const tip3Y = arrowYOf(3);
  const slopeEndX = lerp(x0, tip3X + (p4 > 0.1 ? cell * 0.85 : 32), pLaw);
  const slopeEndY = lerp(
    y0 - 28,
    tip3Y - (p4 > 0.1 ? stepY * 0.72 : 10),
    pLaw,
  );

  const mwPin = nodePinP(0);

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
            id="csl21ExceedArrow"
            gradientUnits="userSpaceOnUse"
            x1={x0 + 4 * cell}
            y1={arrowYOf(4)}
            x2={x0 + 4 * cell + 224}
            y2={arrowYOf(4)}
          >
            <stop offset="0%" stopColor={C.gold} />
            <stop offset="60%" stopColor="#ff7a45" />
            <stop offset="100%" stopColor={C.red} />
          </linearGradient>
        </defs>

        {/* Highlighted stretching squares along the galaxy chain */}
        {activeSquares > 0 &&
          [0, 1, 2, 3].map((sq) => {
            if (sq >= activeSquares) return null;
            const sqX = x0 + sq * cell;
            const sqColor =
              activeSquares === 4
                ? C.red
                : activeSquares === 3
                  ? C.gold
                  : C.cyan;
            return (
              <rect
                key={"sq" + sq}
                x={sqX}
                y={y0 - cell * 0.44}
                width={cell}
                height={cell * 0.88}
                fill={sqColor}
                opacity={sq === 0 && frame < oneAt ? 0.085 * rateP : 0.06}
              />
            );
          })}

        {/* Vertical Elastic Grid Lines (draw smoothly during Phase 0) */}
        {cols.map((cIdx) => {
          const gx = x0 + cIdx * cell;
          if (gx < -40 || gx > 1960) return null;
          const isMainNode = cIdx >= 0 && cIdx <= 4;
          return (
            <line
              key={"v" + cIdx}
              x1={gx}
              y1={0}
              x2={gx}
              y2={1080}
              stroke={
                isMainNode
                  ? "rgba(62, 224, 255, 0.36)"
                  : "rgba(62, 224, 255, 0.14)"
              }
              strokeWidth={isMainNode ? 2.1 : 1.3}
              strokeDasharray="1100"
              strokeDashoffset={`${1100 * (1 - gridDrawP)}`}
            />
          );
        })}

        {/* Horizontal Elastic Grid Lines */}
        {rows.map((rIdx) => {
          const gy = y0 + rIdx * cell;
          if (gy < -40 || gy > 1120) return null;
          const isAxis = rIdx === 0;
          return (
            <line
              key={"h" + rIdx}
              x1={0}
              y1={gy}
              x2={1920}
              y2={gy}
              stroke={
                isAxis
                  ? "rgba(62, 224, 255, 0.48)"
                  : "rgba(62, 224, 255, 0.14)"
              }
              strokeWidth={isAxis ? 2.5 : 1.3}
              strokeDasharray="1940"
              strokeDashoffset={`${1940 * (1 - gridDrawP)}`}
            />
          );
        })}

        {/* Proportional Dashed Golden Hubble's Law Slope Line (lawAt) */}
        {pLaw > 0.02 && (
          <g opacity={pLaw * 0.85}>
            <line
              x1={x0}
              y1={y0 - 28}
              x2={slopeEndX}
              y2={slopeEndY}
              stroke={C.gold}
              strokeWidth={2.8}
              strokeDasharray="10 10"
              style={{ filter: svgGlow(C.gold, 6) }}
            />
          </g>
        )}

        {/* Pin-lock intersection rings & parked pulses */}
        {[0, 1, 2, 3, 4].map((n) => {
          const pinP = nodePinP(n);
          if (pinP <= 0.01) return null;
          const nx = x0 + n * cell;
          const ringColor = n === 4 && p4 > 0.15 ? C.red : C.cyan;
          return (
            <g key={"pin" + n}>
              <circle
                cx={nx}
                cy={y0}
                r={26 + (1 - pinP) * 18}
                fill="none"
                stroke={ringColor}
                strokeWidth={1.8}
                strokeDasharray="5 5"
                opacity={0.62 * Math.min(1, pinP)}
              />
              {parkRingPulse > 0 && parkRingPulse < 0.99 && (
                <circle
                  cx={nx}
                  cy={y0}
                  r={26 + parkRingPulse * 48}
                  fill="none"
                  stroke={C.gold}
                  strokeWidth={2.5}
                  opacity={0.72 * (1 - parkRingPulse)}
                />
              )}
            </g>
          );
        })}

        {/* Node 0: Milky Way pinned at origin */}
        {mwPin > 0.01 && (
          <g
            transform={`translate(${x0}, ${y0}) scale(${Math.min(1.06, mwPin)}) translate(${-x0}, ${-y0})`}
            opacity={Math.min(1, mwPin * 1.3)}
          >
            <SpiralGalaxy x={x0} y={y0} radius={26} color={C.cyan} angle={14} />
            <text
              x={x0}
              y={y0 + 56}
              textAnchor="middle"
              fill={C.cyan}
              fontFamily={MONO}
              fontWeight={700}
              fontSize={20}
            >
              MILKY WAY
            </text>
            <text
              x={x0}
              y={y0 + 84}
              textAnchor="middle"
              fill={C.dim}
              fontFamily={MONO}
              fontWeight={700}
              fontSize={16}
            >
              0
            </text>
          </g>
        )}

        {/* Nodes 1, 2, 3, 4 — Pinned strictly on grid intersections */}
        {nodes.map((node) => {
          const pinP = nodePinP(node.idx);
          if (pinP <= 0.01) return null;
          const nx = x0 + node.idx * cell;
          const isExceed = node.idx === 4 && node.prog > 0.05;
          const gColor =
            node.prog > 0.1
              ? isExceed
                ? C.red
                : node.color
              : "#d6e6ff";
          const curArrowLen = node.len * node.prog;
          const ay = arrowYOf(node.idx);

          return (
            <g key={node.idx} opacity={Math.min(1, pinP * 1.3)}>
              <g
                transform={`translate(${nx}, ${y0}) scale(${Math.min(1.05, pinP)}) translate(${-nx}, ${-y0})`}
              >
                <SpiralGalaxy
                  x={nx}
                  y={y0}
                  radius={22}
                  color={gColor}
                  angle={node.idx * 27}
                />
              </g>

              {/* LOCAL v = 0 indicator on parkedAt */}
              {parkedP > 0.02 && node.idx <= 3 && (
                <text
                  x={nx}
                  y={y0 + 54}
                  textAnchor="middle"
                  fill={C.dim}
                  fontFamily={MONO}
                  fontWeight={700}
                  fontSize={16}
                  opacity={parkedP * 0.88}
                >
                  LOCAL v = 0
                </text>
              )}

              {/* Grid step index */}
              <text
                x={nx}
                y={y0 + 84}
                textAnchor="middle"
                fill={node.prog > 0.1 ? gColor : C.dim}
                fontFamily={MONO}
                fontWeight={700}
                fontSize={18}
              >
                {node.idx}d
              </text>

              {/* Stepped Proportional Velocity Arrow */}
              {curArrowLen > 6 && (
                <g>
                  {/* c threshold tick on Node 4's arrow — cleanly below shaft */}
                  {node.idx === 4 && curArrowLen > 140 && (
                    <g opacity={clamp01((curArrowLen - 140) / 36)}>
                      <line
                        x1={nx + 162}
                        y1={ay - 22}
                        x2={nx + 162}
                        y2={ay + 36}
                        stroke={C.gold}
                        strokeWidth={2.6}
                        strokeDasharray="5 5"
                      />
                      <text
                        x={nx + 162}
                        y={ay + 62}
                        textAnchor="middle"
                        fill={C.gold}
                        fontFamily={MONO}
                        fontWeight={700}
                        fontSize={22}
                      >
                        c
                      </text>
                    </g>
                  )}

                  {/* Vertical dashed stem from galaxy to its proportional arrow */}
                  <line
                    x1={nx}
                    y1={y0 - 28}
                    x2={nx}
                    y2={ay}
                    stroke={gColor}
                    strokeWidth={2}
                    strokeDasharray="4 5"
                    opacity={0.55}
                  />

                  {/* Horizontal proportional vector shaft */}
                  <line
                    x1={nx}
                    y1={ay}
                    x2={nx + curArrowLen - 14}
                    y2={ay}
                    stroke={isExceed ? "url(#csl21ExceedArrow)" : gColor}
                    strokeWidth={isExceed ? 8.5 : 6}
                    strokeLinecap="round"
                    style={{ filter: svgGlow(gColor, 7) }}
                  />
                  <polygon
                    points="0,0 -18,-10 -18,10"
                    fill={gColor}
                    transform={`translate(${nx + curArrowLen}, ${ay})`}
                    style={{ filter: svgGlow(gColor, 6) }}
                  />

                  {/* Multiplier / > c readout */}
                  <text
                    x={nx + curArrowLen * (isExceed ? 0.48 : 0.52)}
                    y={ay - (isExceed ? 26 : 20)}
                    textAnchor="middle"
                    fill={isExceed ? C.gold : gColor}
                    fontFamily={MONO}
                    fontWeight={700}
                    fontSize={isExceed ? 36 : 28}
                    style={{ filter: svgGlow(isExceed ? C.red : gColor, 6) }}
                  >
                    {node.mult}
                  </text>
                  {isExceed && curArrowLen > 180 && (
                    <text
                      x={nx + curArrowLen * 0.52}
                      y={ay - 62}
                      textAnchor="middle"
                      fill={C.red}
                      fontFamily={MONO}
                      fontWeight={700}
                      fontSize={20}
                      opacity={clamp01((curArrowLen - 180) / 36)}
                    >
                      &gt; 300,000 km/s
                    </text>
                  )}
                </g>
              )}
            </g>
          );
        })}

        {/* Single-Cell Ruler Highlight (rateAt): 67 km/s per 3.3 M ly */}
        {rateP > 0.01 && (
          <g opacity={rateP * 0.92}>
            <line
              x1={x0 + 6}
              y1={y0 + 132}
              x2={x0 + cell - 6}
              y2={y0 + 132}
              stroke={C.cyan}
              strokeWidth={3}
              style={{ filter: svgGlow(C.cyan, 5) }}
            />
            <line
              x1={x0 + 6}
              y1={y0 + 120}
              x2={x0 + 6}
              y2={y0 + 144}
              stroke={C.cyan}
              strokeWidth={3}
            />
            <line
              x1={x0 + cell - 6}
              y1={y0 + 120}
              x2={x0 + cell - 6}
              y2={y0 + 144}
              stroke={C.cyan}
              strokeWidth={3}
            />
            <text
              x={x0 + cell * 0.5}
              y={y0 + 168}
              textAnchor="middle"
              fill={C.cyan}
              fontFamily={MONO}
              fontWeight={700}
              fontSize={22}
            >
              {scaleFactor.toFixed(2)}×
            </text>
            <text
              x={x0 + cell * 0.5}
              y={y0 + 198}
              textAnchor="middle"
              fill={C.gold}
              fontFamily={MONO}
              fontWeight={700}
              fontSize={19}
            >
              67 km/s PER 3.3 M ly
            </text>
          </g>
        )}
      </svg>

      {/* Subtle Initial Phase Header before Hubble's Law takes center stage */}
      {pLaw < 0.85 && (
        <div style={{ opacity: 1 - pLaw }}>
          <MinimalLabel
            text={
              frame >= safeStretch
                ? "UNIFORM STRETCH"
                : frame >= parkedAt
                  ? "PARKED ON THE GRID"
                  : "ELASTIC SPACE SHEET"
            }
            sub={
              frame >= safeStretch
                ? "EVERY SQUARE EXPANDS EQUALLY"
                : frame >= parkedAt
                  ? "LOCAL SPEED = 0"
                  : "GALAXIES PINNED TO INTERSECTIONS"
            }
            color={frame >= safeStretch ? C.cyan : C.white}
            x={960}
            y={56}
            align="center"
            size={36}
            delay={4}
          />
        </div>
      )}

      {/* Clean Minimal Formula Anchor on lawAt */}
      <MinimalLabel
        text="v = H₀ × d"
        sub="HUBBLE'S LAW"
        color={C.gold}
        x={960}
        y={48}
        align="center"
        size={48}
        delay={lawAt}
      />
    </AbsoluteFill>
  );
};

// ===========================================================================
// 2. RubberBandAntAnim — Ch 2B (3:51.3–4:32.0): Ant -> Pull -> Loupe -> Galaxy
// ===========================================================================
const MinimalVectorAnt: React.FC<{
  x: number;
  y: number;
  scale?: number;
  stridePhase?: number;
}> = ({ x, y, scale = 1, stridePhase = 0 }) => {
  const sA = Math.sin(stridePhase) * 3.5;
  const sB = -sA;
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <ellipse
        cx={0}
        cy={-16}
        rx={34}
        ry={18}
        fill={C.gold}
        opacity={0.18}
        style={{ filter: svgGlow(C.gold, 8) }}
      />
      <path
        d={`M -10 -12 L ${-20 + sA} -4 L ${-26 + sA} 0 M -2 -13 L ${-4 + sB} -4 L ${-8 + sB} 0 M 6 -13 L ${10 + sA} -4 L ${15 + sA} 0`}
        fill="none"
        stroke={C.gold}
        strokeWidth={2.4}
        strokeLinecap="round"
      />
      <path
        d={`M -14 -10 L ${-24 + sB} -2 L ${-31 + sB} 0 M 2 -12 L ${2 + sA} -3 L ${3 + sA} 0 M 10 -12 L ${16 + sB} -3 L ${22 + sB} 0`}
        fill="none"
        stroke="#ffe39f"
        strokeWidth={2}
        strokeLinecap="round"
        opacity={0.82}
      />
      <ellipse cx={-18} cy={-18} rx={12} ry={8.5} fill={C.gold} />
      <ellipse cx={-1} cy={-16} rx={7.5} ry={5.5} fill="#ffd573" />
      <circle cx={12} cy={-19} r={6.5} fill={C.gold} />
      <path
        d="M 16 -23 Q 22 -30 28 -29 M 17 -20 Q 24 -25 30 -22"
        fill="none"
        stroke="#ffe8b0"
        strokeWidth={1.8}
        strokeLinecap="round"
      />
      <circle cx={14.5} cy={-20} r={1.5} fill="#050a18" />
    </g>
  );
};

export const RubberBandAntAnim: React.FC<{
  antAt: number;
  pullAt: number;
  localAt: number;
  fiveAt: number;
  galaxiesAt: number;
}> = ({ antAt, pullAt, localAt, fiveAt, galaxiesAt }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const dur = Math.max(240, durationInFrames);
  const cx = 960;
  const bandY = 615;
  const L0 = 760;
  const LMax = 1600;

  const safeAnt = Math.max(12, antAt);
  const safePull = Math.max(safeAnt + 20, pullAt);
  const safeLocal = Math.max(safePull + 20, localAt);
  const safeFive = Math.max(safeLocal + 20, fiveAt);
  const safeGal = Math.max(safeFive + 20, galaxiesAt);

  // Band intro draw (0 -> safeAnt)
  const bandIntroP = easeOutCubic(frame / Math.max(20, safeAnt * 0.85));

  // Monotonic band length function L(f) stretching continuously ALL THE WAY from pullAt to safeGal!
  const bandLengthAt = (f: number): number => {
    if (f <= safePull) {
      return L0 + clamp01(f / Math.max(1, safePull)) * 18;
    }
    const u = clamp01((f - safePull) / Math.max(60, safeGal - safePull));
    const stretchEased = 0.25 * easeOutCubic(Math.min(1, u * 2.2)) + 0.75 * u;
    return L0 + 18 + (LMax - L0 - 18) * stretchEased;
  };

  // Exact physics integral for ant fractional position u(f) along band: du/df = v_ant / L(f)
  const vAntPxPerFrame = 1.05;
  const walkFrames = Math.max(0, Math.min(safeGal + 30, frame) - safeAnt);
  const maxStep = Math.floor(walkFrames);
  let uAnt = 0.19;
  for (let k = 0; k < maxStep; k++) {
    uAnt += vAntPxPerFrame / bandLengthAt(safeAnt + k);
  }
  const fracRem = walkFrames - maxStep;
  if (fracRem > 0) {
    uAnt += (vAntPxPerFrame * fracRem) / bandLengthAt(safeAnt + maxStep);
  }
  uAnt = Math.min(0.88, uAnt);

  const curL = bandLengthAt(frame) * bandIntroP;
  const leftX = cx - curL * 0.5;
  const rightX = cx + curL * 0.5;
  const antX = leftX + uAnt * curL;

  const stretchRatio = Math.max(1, curL / L0);
  const bandH = Math.max(22, 38 - (stretchRatio - 1) * 13);

  const antEnterP = spring({
    frame: Math.max(0, frame - safeAnt),
    fps,
    config: { damping: 14, stiffness: 140 },
  });
  const pullP = easeOutCubic((frame - safePull) / 26);

  // Magnifying glass zoom-bubble pops cleanly on localAt, dims gracefully on fiveAt
  const loupeIn = spring({
    frame: Math.max(0, frame - safeLocal),
    fps,
    config: { damping: 15, stiffness: 125 },
  });
  const loupeOut = interpolate(frame, [safeFive - 12, safeFive + 16], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const loupeOpacity =
    frame >= safeLocal - 2 ? Math.min(1, loupeIn * 1.2) * loupeOut : 0;

  // 5x FASTER highlight on fiveAt
  const fiveP = spring({
    frame: Math.max(0, frame - safeFive),
    fps,
    config: { damping: 15, stiffness: 125 },
  });

  // Final stage morph on galaxiesAt -> dur: Stretching cosmic grid + local photon at 1.0 c!
  const galMorph = easeInOutCubic((frame - safeGal) / 28);
  const galU = clamp01((frame - safeGal) / Math.max(40, dur - safeGal));
  const galScale = 1.0 + 0.92 * galU;
  const galCell = 110 * galScale;
  const galOriginX = 240;
  const galNodeX = galOriginX + 3.2 * galCell;
  const galCy = 550;
  // Golden photon zips smoothly past the galaxy locally at speed c across galU!
  const localPhotonX = lerp(galNodeX - 280, Math.min(1830, galNodeX + 410), galU);

  // Build sinusoidal golden photon wave for Phase 5
  const phLen = 110;
  const phPts: string[] = [];
  for (let i = 0; i <= 34; i++) {
    const frac = i / 34;
    const px = localPhotonX - phLen * (1 - frac);
    const env = Math.sin(frac * Math.PI);
    const py = galCy - 36 + Math.sin(frac * Math.PI * 6 - frame * 0.4) * 11 * env;
    phPts.push((i === 0 ? "M " : "L ") + px.toFixed(1) + " " + py.toFixed(1));
  }
  const localPhotonWave = phPts.join(" ");

  const tickCount = 16;
  const ticks: number[] = [];
  for (let i = 1; i < tickCount; i++) {
    ticks.push(i / tickCount);
  }

  // Magnifier coordinates centered directly above ant
  const loupeX = Math.max(240, Math.min(1680, antX));
  const loupeY = 278;
  const loupeR = 128;

  return (
    <AbsoluteFill>
      {/* ACT 1–4: Rubber Band + Ant + Magnifying Loupe + 5x Speed Comparison */}
      {galMorph < 0.99 && (
        <AbsoluteFill style={{ opacity: 1 - galMorph }}>
          <svg
            width={1920}
            height={1080}
            viewBox="0 0 1920 1080"
            style={{ position: "absolute", inset: 0 }}
          >
            <defs>
              <linearGradient
                id="csl22BandFill"
                gradientUnits="userSpaceOnUse"
                x1={0}
                y1={bandY - 22}
                x2={0}
                y2={bandY + 22}
              >
                <stop offset="0%" stopColor="rgba(62, 224, 255, 0.36)" />
                <stop offset="50%" stopColor="rgba(26, 62, 130, 0.58)" />
                <stop offset="100%" stopColor="rgba(62, 224, 255, 0.28)" />
              </linearGradient>
              <clipPath id="csl22LoupeClip">
                <circle cx={loupeX} cy={loupeY} r={loupeR - 4} />
              </clipPath>
            </defs>

            {/* Elastic Rubber Band Body */}
            <rect
              x={leftX}
              y={bandY - bandH * 0.5}
              width={curL}
              height={bandH}
              rx={bandH * 0.45}
              fill="url(#csl22BandFill)"
              stroke={C.cyan}
              strokeWidth={2.6}
              style={{ filter: svgGlow(C.cyan, 6) }}
            />

            {/* Stretching Tick Marks */}
            {ticks.map((u, idx) => {
              const tx = leftX + u * curL;
              const nearAnt = frame >= safeAnt && Math.abs(tx - antX) < 55;
              return (
                <line
                  key={idx}
                  x1={tx}
                  y1={bandY - bandH * 0.46}
                  x2={tx}
                  y2={bandY + bandH * 0.46}
                  stroke={nearAnt ? C.gold : C.cyan}
                  strokeWidth={nearAnt ? 3 : 2}
                  opacity={nearAnt ? 0.95 : 0.58}
                />
              );
            })}

            {/* Anchor Pull-Grips */}
            <rect
              x={leftX - 18}
              y={bandY - 50}
              width={20}
              height={100}
              rx={6}
              fill="#162850"
              stroke={pullP > 0.1 ? C.red : C.cyan}
              strokeWidth={2.8}
            />
            <rect
              x={rightX - 2}
              y={bandY - 50}
              width={20}
              height={100}
              rx={6}
              fill="#162850"
              stroke={pullP > 0.1 ? C.red : C.cyan}
              strokeWidth={2.8}
            />

            {/* Outward Pull Arrows (pullAt) */}
            {pullP > 0.02 && (
              <g opacity={pullP}>
                <line
                  x1={leftX - 28}
                  y1={bandY}
                  x2={Math.max(28, leftX - 28 - 94 * pullP)}
                  y2={bandY}
                  stroke={C.red}
                  strokeWidth={6.5}
                  strokeLinecap="round"
                  style={{ filter: svgGlow(C.red, 6) }}
                />
                <polygon
                  points="0,0 18,-10 18,10"
                  fill={C.red}
                  transform={`translate(${Math.max(18, leftX - 28 - 102 * pullP)}, ${bandY})`}
                />
                <line
                  x1={rightX + 28}
                  y1={bandY}
                  x2={Math.min(1892, rightX + 28 + 94 * pullP)}
                  y2={bandY}
                  stroke={C.red}
                  strokeWidth={6.5}
                  strokeLinecap="round"
                  style={{ filter: svgGlow(C.red, 6) }}
                />
                <polygon
                  points="0,0 -18,-10 -18,10"
                  fill={C.red}
                  transform={`translate(${Math.min(1902, rightX + 28 + 102 * pullP)}, ${bandY})`}
                />
                <text
                  x={Math.min(1720, rightX)}
                  y={bandY + 98}
                  textAnchor="middle"
                  fill={C.red}
                  fontFamily={MONO}
                  fontWeight={700}
                  fontSize={32}
                  style={{ filter: svgGlow(C.red, 6) }}
                >
                  END: 5 cm/s
                </text>
              </g>
            )}

            {/* Vector Ant stepping onto band on antAt */}
            {frame >= safeAnt - 1 && (
              <g opacity={Math.min(1, antEnterP * 1.3)}>
                <MinimalVectorAnt
                  x={antX}
                  y={bandY - bandH * 0.5 - 1 - (1 - antEnterP) * 32}
                  scale={1.38}
                  stridePhase={walkFrames * 0.34}
                />
                {/* Local 1 cm/s badge directly above ant (dims slightly while loupe is open) */}
                <g opacity={1 - loupeOpacity * 0.85}>
                  <line
                    x1={antX - 24}
                    y1={bandY - bandH * 0.5 - 82}
                    x2={antX + 34}
                    y2={bandY - bandH * 0.5 - 82}
                    stroke={C.gold}
                    strokeWidth={4.5}
                    strokeLinecap="round"
                    style={{ filter: svgGlow(C.gold, 6) }}
                  />
                  <polygon
                    points="0,0 -14,-7 -14,7"
                    fill={C.gold}
                    transform={`translate(${antX + 42}, ${bandY - bandH * 0.5 - 82})`}
                  />
                  <text
                    x={antX + 8}
                    y={bandY - bandH * 0.5 - 108}
                    textAnchor="middle"
                    fill={C.gold}
                    fontFamily={MONO}
                    fontWeight={700}
                    fontSize={28}
                    style={{ filter: svgGlow(C.gold, 6) }}
                  >
                    ANT: 1 cm/s
                  </text>
                </g>
              </g>
            )}

            {/* Magnifying Glass Zoom-Bubble over Ant's Feet (localAt -> fiveAt) */}
            {loupeOpacity > 0.01 && (
              <g opacity={loupeOpacity}>
                {/* Crisp tangent connector lines from ant feet to magnifying lens */}
                <line
                  x1={antX - 28}
                  y1={bandY - bandH * 0.5 - 4}
                  x2={loupeX - loupeR * 0.72}
                  y2={loupeY + loupeR * 0.7}
                  stroke={C.gold}
                  strokeWidth={2}
                  strokeDasharray="6 6"
                  opacity={0.7}
                />
                <line
                  x1={antX + 28}
                  y1={bandY - bandH * 0.5 - 4}
                  x2={loupeX + loupeR * 0.72}
                  y2={loupeY + loupeR * 0.7}
                  stroke={C.gold}
                  strokeWidth={2}
                  strokeDasharray="6 6"
                  opacity={0.7}
                />
                {/* Loupe backdrop */}
                <circle
                  cx={loupeX}
                  cy={loupeY}
                  r={loupeR}
                  fill="#07122b"
                  stroke={C.gold}
                  strokeWidth={4}
                  style={{ filter: svgGlow(C.gold, 10) }}
                />
                {/* Magnified rubber surface + scrolling local ticks + zoomed ant */}
                <g clipPath="url(#csl22LoupeClip)">
                  <rect
                    x={loupeX - loupeR}
                    y={loupeY + 26}
                    width={loupeR * 2}
                    height={loupeR}
                    fill="rgba(62, 224, 255, 0.22)"
                  />
                  <line
                    x1={loupeX - loupeR}
                    y1={loupeY + 26}
                    x2={loupeX + loupeR}
                    y2={loupeY + 26}
                    stroke={C.cyan}
                    strokeWidth={3.5}
                  />
                  {/* Local ruler ticks scrolling continuously leftward at 1 cm/s underneath ant! */}
                  {[-4, -3, -2, -1, 0, 1, 2, 3, 4, 5].map((k) => {
                    const offset = (walkFrames * 2.6) % 52;
                    const tx = loupeX + k * 52 - offset;
                    return (
                      <line
                        key={k}
                        x1={tx}
                        y1={loupeY + 26}
                        x2={tx}
                        y2={loupeY + 58}
                        stroke={C.cyan}
                        strokeWidth={3}
                        opacity={0.72}
                      />
                    );
                  })}
                  <MinimalVectorAnt
                    x={loupeX}
                    y={loupeY + 25}
                    scale={2.45}
                    stridePhase={walkFrames * 0.34}
                  />
                </g>
                <text
                  x={loupeX}
                  y={loupeY - loupeR - 22}
                  textAnchor="middle"
                  fill={C.gold}
                  fontFamily={MONO}
                  fontWeight={700}
                  fontSize={30}
                  style={{ filter: svgGlow(C.gold, 7) }}
                >
                  1 cm/s LOCAL ✓
                </text>
              </g>
            )}

            {/* 5x FASTER Speed Comparison Bar (fiveAt -> galaxiesAt) */}
            {frame >= safeFive - 1 && (
              <g opacity={Math.min(1, fiveP * 1.25)}>
                <text
                  x={960}
                  y={215}
                  textAnchor="middle"
                  fill={C.red}
                  fontFamily={MONO}
                  fontWeight={700}
                  fontSize={52}
                  style={{ filter: svgGlow(C.red, 10) }}
                >
                  5× FASTER THAN THE ANT
                </text>
                {/* Clean visual bar comparison: 1 unit gold vs 5 units red */}
                <rect
                  x={660}
                  y={260}
                  width={120}
                  height={22}
                  rx={11}
                  fill={C.gold}
                  style={{ filter: svgGlow(C.gold, 6) }}
                />
                <text
                  x={640}
                  y={278}
                  textAnchor="end"
                  fill={C.gold}
                  fontFamily={MONO}
                  fontWeight={700}
                  fontSize={22}
                >
                  ANT 1 cm/s
                </text>
                <rect
                  x={660}
                  y={308}
                  width={600 * Math.min(1, fiveP)}
                  height={22}
                  rx={11}
                  fill={C.red}
                  style={{ filter: svgGlow(C.red, 7) }}
                />
                <text
                  x={640}
                  y={326}
                  textAnchor="end"
                  fill={C.red}
                  fontFamily={MONO}
                  fontWeight={700}
                  fontSize={22}
                >
                  END 5 cm/s
                </text>
              </g>
            )}
          </svg>
        </AbsoluteFill>
      )}

      {/* ACT 5 (galaxiesAt -> dur): Stretching Space Galaxy + Local Photon at 1.0 c */}
      {galMorph > 0.01 && (
        <AbsoluteFill style={{ opacity: galMorph }}>
          <svg
            width={1920}
            height={1080}
            viewBox="0 0 1920 1080"
            style={{ position: "absolute", inset: 0 }}
          >
            <defs>
              <linearGradient
                id="csl22LocalPhoton"
                gradientUnits="userSpaceOnUse"
                x1={Math.max(80, localPhotonX - 280)}
                y1={galCy - 36}
                x2={Math.max(84, localPhotonX)}
                y2={galCy - 36}
              >
                <stop offset="0%" stopColor={C.gold} stopOpacity={0} />
                <stop offset="100%" stopColor={C.gold} stopOpacity={0.98} />
              </linearGradient>
            </defs>

            {/* Continuously Stretching Luminous Cyan Cosmic Grid */}
            {[-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((col) => {
              const gx = galOriginX + col * galCell;
              if (gx < -40 || gx > 1960) return null;
              return (
                <line
                  key={"gv" + col}
                  x1={gx}
                  y1={0}
                  x2={gx}
                  y2={1080}
                  stroke="rgba(62, 224, 255, 0.24)"
                  strokeWidth={1.8}
                />
              );
            })}
            {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map((row) => {
              const gy = galCy + row * galCell;
              if (gy < -40 || gy > 1120) return null;
              return (
                <line
                  key={"gh" + row}
                  x1={0}
                  y1={gy}
                  x2={1920}
                  y2={gy}
                  stroke="rgba(62, 224, 255, 0.2)"
                  strokeWidth={1.6}
                />
              );
            })}

            {/* Reference Milky Way at Left */}
            <SpiralGalaxy
              x={galOriginX}
              y={galCy}
              radius={24}
              color={C.cyan}
              angle={16}
            />
            <text
              x={galOriginX}
              y={galCy + 54}
              textAnchor="middle"
              fill={C.cyan}
              fontFamily={MONO}
              fontWeight={700}
              fontSize={19}
            >
              MILKY WAY
            </text>

            {/* Distant Galaxy riding stretching grid + local light-speed patch */}
            <circle
              cx={galNodeX}
              cy={galCy}
              r={105}
              fill={C.gold}
              opacity={0.07}
              stroke={C.gold}
              strokeWidth={2}
              strokeDasharray="8 8"
            />
            <SpiralGalaxy
              x={galNodeX}
              y={galCy}
              radius={30}
              color={C.red}
              angle={-22}
            />
            <text
              x={galNodeX}
              y={galCy + 64}
              textAnchor="middle"
              fill={C.red}
              fontFamily={MONO}
              fontWeight={700}
              fontSize={22}
            >
              GALAXY (&gt; c AWAY)
            </text>

            {/* Golden Photon Beam zipping right past the galaxy locally at 1.0 c! */}
            <line
              x1={Math.max(80, localPhotonX - 280)}
              y1={galCy - 36}
              x2={localPhotonX}
              y2={galCy - 36}
              stroke="url(#csl22LocalPhoton)"
              strokeWidth={5}
              strokeLinecap="round"
              style={{ filter: svgGlow(C.gold, 8) }}
            />
            <path
              d={localPhotonWave}
              fill="none"
              stroke="#fff4cc"
              strokeWidth={3}
            />
            <circle cx={localPhotonX} cy={galCy - 36} r={7} fill="#ffffff" />
            <text
              x={Math.min(1770, localPhotonX)}
              y={galCy - 68}
              textAnchor="middle"
              fill={C.gold}
              fontFamily={MONO}
              fontWeight={700}
              fontSize={24}
              style={{ filter: svgGlow(C.gold, 6) }}
            >
              1.0 c
            </text>
          </svg>

          <MinimalLabel
            text="LOCAL = c ✓"
            sub="NOTHING OUTRUNS LIGHT LOCALLY"
            color={C.gold}
            x={960}
            y={84}
            align="center"
            size={44}
            delay={safeGal + 4}
          />
          <MinimalLabel
            text="SPACE = NO LIMIT"
            color={C.cyan}
            x={960}
            y={860}
            align="center"
            size={42}
            delay={safeGal + 24}
          />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// ===========================================================================
// 3. HubbleSphereIntroAnim — Ch 3A (4:41.2–5:02.2): 4-Stage Hubble Sphere
// ===========================================================================
const INNER_GALAXIES = [
  { ang: -145, r0: 145, tilt: 12 },
  { ang: -74, r0: 215, tilt: -25 },
  { ang: -16, r0: 168, tilt: 30 },
  { ang: 46, r0: 232, tilt: -18 },
  { ang: 126, r0: 175, tilt: 22 },
  { ang: 176, r0: 248, tilt: -10 },
];

const RIM_GALAXIES = [
  { ang: -56, tilt: 18 },
  { ang: 22, tilt: -22 },
  { ang: 112, tilt: 28 },
  { ang: -146, tilt: -16 },
];

const OUTER_GALAXIES = [
  { ang: -166, r0: 468, tilt: 20 },
  { ang: -124, r0: 422, tilt: -30 },
  { ang: -42, r0: 448, tilt: 16 },
  { ang: -6, r0: 495, tilt: -14 },
  { ang: 28, r0: 468, tilt: 34 },
  { ang: 148, r0: 472, tilt: -22 },
  { ang: 172, r0: 605, tilt: 14 },
  { ang: -175, r0: 635, tilt: -26 },
  { ang: 12, r0: 668, tilt: 18 },
  { ang: -24, r0: 622, tilt: -12 },
  { ang: 78, r0: 452, tilt: 24 },
  { ang: -94, r0: 446, tilt: -18 },
];

export const HubbleSphereIntroAnim: React.FC<{
  sphereAt: number;
  nameAt: number;
  onLineAt: number;
  beyondAt: number;
}> = ({ sphereAt, nameAt, onLineAt, beyondAt }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const dur = Math.max(180, durationInFrames);
  const cx = 960;
  const cy = 548;
  const R_H = 316;
  const circ = 2 * Math.PI * R_H;

  // Stage 1: Compass cyan ring draws 0 -> 360 deg on sphereAt
  const sphereP = easeOutCubic((frame - sphereAt) / 42);
  const radiusLineP = easeOutCubic((frame - (sphereAt + 10)) / 30);

  // Stage 2: Inner < c galaxies & name on nameAt
  const innerP = easeOutCubic((frame - nameAt) / 34);

  // Stage 3: Galaxies ON THE RIM ignite gold v = c on onLineAt
  const onLineP = easeOutCubic((frame - onLineAt) / 30);

  // Stage 4: Camera pulls gently back + outer crimson > c galaxies ignite on beyondAt
  const beyondU = clamp01((frame - beyondAt) / Math.max(36, dur - beyondAt));
  const beyondP = easeOutCubic((frame - beyondAt) / 38);
  const camScale = lerp(1.0, 0.86, beyondU);

  // Subtle continuous monotonic cosmic drift spanning 100% of dur
  const driftScale = 1.0 + 0.1 * clamp01(frame / dur);

  // Radius caliper angle (-32 deg)
  const dimAng = (-32 * Math.PI) / 180;
  const dimEndX = cx + Math.cos(dimAng) * R_H * radiusLineP;
  const dimEndY = cy + Math.sin(dimAng) * R_H * radiusLineP;

  return (
    <AbsoluteFill>
      <svg
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <radialGradient id="csl23HubbleFill" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={C.cyan} stopOpacity={0.02} />
            <stop offset="76%" stopColor={C.cyan} stopOpacity={0.08} />
            <stop offset="100%" stopColor={C.cyan} stopOpacity={0.2} />
          </radialGradient>
        </defs>

        <g
          transform={`translate(${cx}, ${cy}) scale(${camScale}) translate(${-cx}, ${-cy})`}
        >
          {/* Faint crimson outer zone glow on beyondAt */}
          {beyondP > 0.01 && (
            <circle
              cx={cx}
              cy={cy}
              r={840}
              fill="none"
              stroke={C.red}
              strokeWidth={490}
              opacity={beyondP * 0.04}
            />
          )}

          {/* Subtle Earth pulse rings before sphereAt */}
          <circle
            cx={cx}
            cy={cy}
            r={38 + clamp01(frame / Math.max(30, sphereAt)) * 120}
            fill="none"
            stroke={C.cyan}
            strokeWidth={1.6}
            opacity={0.32 * (1 - clamp01(frame / Math.max(30, sphereAt)) * 0.7)}
          />

          {/* Glowing Cyan Hubble Sphere Ring drawing 0 -> 360 deg on sphereAt */}
          {frame >= sphereAt - 1 && (
            <g>
              <circle
                cx={cx}
                cy={cy}
                r={R_H}
                fill="url(#csl23HubbleFill)"
                opacity={sphereP}
              />
              <circle
                cx={cx}
                cy={cy}
                r={R_H}
                fill="none"
                stroke={onLineP > 0.25 ? C.gold : C.cyan}
                strokeWidth={4.2}
                strokeDasharray={`${circ * sphereP} ${circ}`}
                transform={`rotate(-90 ${cx} ${cy})`}
                style={{
                  filter: svgGlow(onLineP > 0.25 ? C.gold : C.cyan, 8),
                }}
              />
              {/* Radius dimension caliper (14.4 B ly) */}
              {radiusLineP > 0.02 && (
                <g opacity={radiusLineP}>
                  <line
                    x1={cx + Math.cos(dimAng) * 26}
                    y1={cy + Math.sin(dimAng) * 26}
                    x2={dimEndX}
                    y2={dimEndY}
                    stroke={C.cyan}
                    strokeWidth={2.4}
                    strokeDasharray="6 6"
                  />
                  <text
                    x={cx + Math.cos(dimAng) * (R_H * 0.54) - 18}
                    y={cy + Math.sin(dimAng) * (R_H * 0.54) - 18}
                    textAnchor="middle"
                    fill={C.cyan}
                    fontFamily={MONO}
                    fontWeight={700}
                    fontSize={28}
                    style={{ filter: svgGlow(C.cyan, 6) }}
                  >
                    14.4 B ly
                  </text>
                </g>
              )}
            </g>
          )}

          {/* Inner < c Galaxies (nameAt) */}
          {innerP > 0.01 &&
            INNER_GALAXIES.map((g, idx) => {
              const rad = (g.ang * Math.PI) / 180;
              const rCur = Math.min(R_H - 36, g.r0 * driftScale);
              const gx = cx + Math.cos(rad) * rCur;
              const gy = cy + Math.sin(rad) * rCur;
              const vecLen = (24 + g.r0 * 0.09) * innerP;
              const sx = gx + Math.cos(rad) * 20;
              const sy = gy + Math.sin(rad) * 20;
              const ex = sx + Math.cos(rad) * vecLen;
              const ey = sy + Math.sin(rad) * vecLen;
              return (
                <g key={"in" + idx} opacity={innerP}>
                  <SpiralGalaxy
                    x={gx}
                    y={gy}
                    radius={16}
                    color="#d8f2ff"
                    angle={g.tilt}
                  />
                  <line
                    x1={sx}
                    y1={sy}
                    x2={ex}
                    y2={ey}
                    stroke={C.cyan}
                    strokeWidth={2.5}
                    strokeLinecap="round"
                  />
                  <polygon
                    points="0,0 -11,-5 -11,5"
                    fill={C.cyan}
                    transform={`translate(${ex}, ${ey}) rotate(${g.ang})`}
                  />
                </g>
              );
            })}

          {/* Rim Galaxies Right ON the Hubble Sphere (onLineAt: Gold v = c!) */}
          {onLineP > 0.01 &&
            RIM_GALAXIES.map((g, idx) => {
              const rad = (g.ang * Math.PI) / 180;
              const gx = cx + Math.cos(rad) * R_H;
              const gy = cy + Math.sin(rad) * R_H;
              const vecLen = 58 * onLineP;
              const sx = gx + Math.cos(rad) * 24;
              const sy = gy + Math.sin(rad) * 24;
              const ex = sx + Math.cos(rad) * vecLen;
              const ey = sy + Math.sin(rad) * vecLen;
              return (
                <g key={"rim" + idx} opacity={onLineP}>
                  <circle
                    cx={gx}
                    cy={gy}
                    r={28}
                    fill={C.gold}
                    opacity={0.18}
                    style={{ filter: svgGlow(C.gold, 8) }}
                  />
                  <SpiralGalaxy
                    x={gx}
                    y={gy}
                    radius={19}
                    color={C.gold}
                    angle={g.tilt}
                  />
                  <line
                    x1={sx}
                    y1={sy}
                    x2={ex}
                    y2={ey}
                    stroke={C.gold}
                    strokeWidth={3.6}
                    strokeLinecap="round"
                    style={{ filter: svgGlow(C.gold, 6) }}
                  />
                  <polygon
                    points="0,0 -13,-6 -13,6"
                    fill={C.gold}
                    transform={`translate(${ex}, ${ey}) rotate(${g.ang})`}
                  />
                  {idx === 1 && (
                    <text
                      x={ex + 38}
                      y={ey + 6}
                      textAnchor="middle"
                      fill={C.gold}
                      fontFamily={MONO}
                      fontWeight={700}
                      fontSize={28}
                      style={{ filter: svgGlow(C.gold, 7) }}
                    >
                      v = c
                    </text>
                  )}
                </g>
              );
            })}

          {/* Outer > c Crimson Galaxies (beyondAt) */}
          {beyondP > 0.01 &&
            OUTER_GALAXIES.map((g, idx) => {
              const localP = easeOutCubic(
                (frame - (beyondAt + idx * 4)) / 30,
              );
              if (localP <= 0.01) return null;
              const rad = (g.ang * Math.PI) / 180;
              const rCur = g.r0 * driftScale;
              const gx = cx + Math.cos(rad) * rCur;
              const gy = cy + Math.sin(rad) * rCur;
              const vecLen = (62 + (g.r0 - R_H) * 0.16) * localP;
              const sx = gx + Math.cos(rad) * 22;
              const sy = gy + Math.sin(rad) * 22;
              const ex = sx + Math.cos(rad) * vecLen;
              const ey = sy + Math.sin(rad) * vecLen;
              return (
                <g key={"out" + idx} opacity={localP}>
                  <SpiralGalaxy
                    x={gx}
                    y={gy}
                    radius={19}
                    color="#ff7d85"
                    angle={g.tilt}
                  />
                  <line
                    x1={sx}
                    y1={sy}
                    x2={ex}
                    y2={ey}
                    stroke={C.red}
                    strokeWidth={3.8}
                    strokeLinecap="round"
                    style={{ filter: svgGlow(C.red, 5) }}
                  />
                  <polygon
                    points="0,0 -13,-6 -13,6"
                    fill={C.red}
                    transform={`translate(${ex}, ${ey}) rotate(${g.ang})`}
                  />
                </g>
              );
            })}

          {/* Earth at Center */}
          <EarthOrb x={cx} y={cy} r={18} />
          <text
            x={cx}
            y={cy + 46}
            textAnchor="middle"
            fill={C.white}
            fontFamily={MONO}
            fontWeight={700}
            fontSize={20}
          >
            EARTH
          </text>
        </g>
      </svg>

      {/* Clean Minimal Labels (Top-Right Label Verified Clear at 1570, 84!) */}
      <MinimalLabel
        text="HUBBLE SPHERE"
        sub={frame >= onLineAt ? "ON THE LINE · v = c" : "RADIUS = 14.4 B ly"}
        color={frame >= onLineAt ? C.gold : C.cyan}
        x={960}
        y={56}
        align="center"
        size={38}
        delay={nameAt}
      />
      <MinimalLabel
        text="< c"
        color={C.cyan}
        x={785}
        y={375}
        align="center"
        size={30}
        delay={nameAt + 12}
      />
      <MinimalLabel
        text="> c"
        sub="FASTER THAN LIGHT"
        color={C.red}
        x={1570}
        y={84}
        align="center"
        size={38}
        delay={beyondAt + 4}
      />
    </AbsoluteFill>
  );
};

// ===========================================================================
// 4. SweptBackwardQuestionAnim — Ch 3B-teaser (5:02.2–5:14.3): PART OF 5:18 FIX!
//    Outer Galaxy Fires Photon Leftward -> Visibly Dragged Backward -> Cut to NO.!
// ===========================================================================
export const SweptBackwardQuestionAnim: React.FC<{
  beamAt: number;
  sweptAt: number;
}> = ({ beamAt, sweptAt }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const dur = Math.max(120, durationInFrames);
  const cy = 560;
  const arcCenterX = -820;
  const arcRadius = 1380; // Arc crosses x = 560 right at y = 560!

  const safeBeam = Math.max(18, beamAt);
  const safeSwept = Math.max(safeBeam + 20, sweptAt);

  // Subtle continuous camera push-in creating dramatic tension straight into NO. X!
  const uAll = clamp01(frame / dur);
  const camScale = lerp(0.96, 1.045, uAll);

  // Outer crimson galaxy drifts monotonically rightward across entire scene
  const galaxyX = lerp(1150, 1525, uAll);

  // Golden photon fired leftward on beamAt, then dragged backward (rightward) on sweptAt!
  const beamVisible = frame >= safeBeam;
  const emitX = lerp(1150, 1525, clamp01(safeBeam / dur));
  let photonX = emitX;
  if (frame >= safeBeam && frame < safeSwept) {
    // Brief initial launch leftward from galaxy before expansion overwhelms it
    const u = clamp01((frame - safeBeam) / Math.max(1, safeSwept - safeBeam));
    photonX = emitX - 75 * Math.sin(u * Math.PI * 0.5);
  } else if (frame >= safeSwept) {
    // Visibly swept BACKWARD (rightward) away from the 14.4 B ly Hubble Sphere!
    const u = clamp01((frame - safeSwept) / Math.max(24, dur - safeSwept));
    photonX = emitX - 75 + 420 * (0.25 * u + 0.75 * u * u * 0.7 + 0.22 * easeOutCubic(u));
  }
  const safePhotonX = Math.min(1760, photonX);

  // Build crisp golden sinusoidal photon wave packet STILL pointing LEFT toward Earth!
  const pktLen = 104;
  const pktPts: string[] = [];
  for (let i = 0; i <= 36; i++) {
    const frac = i / 36;
    const px = safePhotonX + frac * pktLen;
    const env = Math.sin(frac * Math.PI);
    const py = cy + Math.sin(frac * Math.PI * 6 - frame * 0.42) * 16 * env;
    pktPts.push((i === 0 ? "M " : "L ") + px.toFixed(1) + " " + py.toFixed(1));
  }
  const pktPath = pktPts.join(" ");

  const sweptP = easeOutCubic((frame - safeSwept) / 26);

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <svg
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <radialGradient id="csl24ArcFill" cx="50%" cy="50%" r="50%">
            <stop offset="88%" stopColor={C.cyan} stopOpacity={0} />
            <stop offset="100%" stopColor={C.cyan} stopOpacity={0.18} />
          </radialGradient>
        </defs>

        <g
          transform={`translate(960, ${cy}) scale(${camScale}) translate(-960, ${-cy})`}
        >
          {/* Faint crimson outer zone backdrop */}
          <rect
            x={560}
            y={0}
            width={1360}
            height={1080}
            fill="rgba(255, 77, 94, 0.045)"
          />

          {/* Glowing Cyan 14.4 B ly Hubble Sphere Arc on Left */}
          <circle
            cx={arcCenterX}
            cy={cy}
            r={arcRadius}
            fill="url(#csl24ArcFill)"
            stroke={C.cyan}
            strokeWidth={5}
            strokeDasharray="18 12"
            style={{ filter: svgGlow(C.cyan, 10) }}
          />

          {/* Earth direction indicator inside sphere on left */}
          <text
            x={210}
            y={cy - 10}
            textAnchor="middle"
            fill={C.cyan}
            fontFamily={MONO}
            fontWeight={700}
            fontSize={28}
            style={{ filter: svgGlow(C.cyan, 6) }}
          >
            ← EARTH
          </text>
          <text
            x={210}
            y={cy + 28}
            textAnchor="middle"
            fill={C.dim}
            fontFamily={MONO}
            fontWeight={700}
            fontSize={19}
          >
            INSIDE &lt; c
          </text>

          {/* Boundary label hugging arc cleanly */}
          <text
            x={475}
            y={220}
            textAnchor="end"
            fill={C.cyan}
            fontFamily={MONO}
            fontWeight={700}
            fontSize={30}
            style={{ filter: svgGlow(C.cyan, 6) }}
          >
            14.4 B ly
          </text>
          <text
            x={475}
            y={254}
            textAnchor="end"
            fill={C.dim}
            fontFamily={MONO}
            fontWeight={700}
            fontSize={18}
          >
            HUBBLE SPHERE
          </text>

          {/* Expanding Crimson Space-Flow Chevrons Surging Rightward on sweptAt! */}
          {[0, 1, 2, 3, 4, 5].map((col) => {
            const flowSpeed = 1.6 + sweptP * 4.4;
            const bx = 680 + ((col * 195 + frame * flowSpeed) % 1160);
            const alpha = 0.14 + sweptP * 0.44;
            return (
              <g key={col} opacity={alpha}>
                <path
                  d={`M ${bx} ${cy - 185} L ${bx + 28} ${cy - 155} L ${bx} ${cy - 125}`}
                  fill="none"
                  stroke={C.red}
                  strokeWidth={4}
                  strokeLinecap="round"
                />
                <path
                  d={`M ${bx} ${cy + 125} L ${bx + 28} ${cy + 155} L ${bx} ${cy + 185}`}
                  fill="none"
                  stroke={C.red}
                  strokeWidth={4}
                  strokeLinecap="round"
                />
              </g>
            );
          })}

          {/* Horizontal line of sight axis */}
          <line
            x1={290}
            y1={cy}
            x2={1860}
            y2={cy}
            stroke="rgba(127, 147, 196, 0.22)"
            strokeWidth={2}
            strokeDasharray="6 12"
          />

          {/* Crimson Drag Trail once photon starts losing ground */}
          {frame >= safeSwept && safePhotonX > emitX - 65 && (
            <line
              x1={emitX - 75}
              y1={cy}
              x2={safePhotonX}
              y2={cy}
              stroke={C.red}
              strokeWidth={4.5}
              strokeDasharray="10 8"
              opacity={0.85}
            />
          )}

          {/* Outer Crimson Galaxy receding > c */}
          <SpiralGalaxy
            x={galaxyX}
            y={cy}
            radius={34}
            color={C.red}
            angle={-22}
          />
          <line
            x1={galaxyX + 44}
            y1={cy}
            x2={Math.min(1870, galaxyX + 148)}
            y2={cy}
            stroke={C.red}
            strokeWidth={6}
            strokeLinecap="round"
            style={{ filter: svgGlow(C.red, 6) }}
          />
          <polygon
            points="0,0 -20,-10 -20,10"
            fill={C.red}
            transform={`translate(${Math.min(1884, galaxyX + 160)}, ${cy})`}
          />
          <text
            x={galaxyX}
            y={cy + 74}
            textAnchor="middle"
            fill={C.red}
            fontFamily={MONO}
            fontWeight={700}
            fontSize={26}
          >
            GALAXY &gt; c
          </text>

          {/* Golden Photon Beam Pointing Leftward While Dragged Rightward! */}
          {beamVisible && (
            <g>
              <path
                d={pktPath}
                fill="none"
                stroke={C.gold}
                strokeWidth={5}
                strokeLinecap="round"
                style={{ filter: svgGlow(C.gold, 9) }}
              />
              <polygon
                points="0,0 20,-10 20,10"
                fill="#fff7d6"
                transform={`translate(${safePhotonX - 4}, ${cy})`}
                style={{ filter: svgGlow(C.gold, 8) }}
              />
              <text
                x={safePhotonX + 46}
                y={cy - 38}
                textAnchor="middle"
                fill={C.gold}
                fontFamily={MONO}
                fontWeight={700}
                fontSize={24}
                style={{ filter: svgGlow(C.gold, 6) }}
              >
                ← PHOTON · c
              </text>
            </g>
          )}

          {/* Big Crimson Backward-Drag Arrow above photon on sweptAt */}
          {sweptP > 0.04 && (
            <g opacity={sweptP}>
              <line
                x1={Math.max(760, safePhotonX - 110)}
                y1={cy - 104}
                x2={Math.min(1760, safePhotonX + 125)}
                y2={cy - 104}
                stroke={C.red}
                strokeWidth={6}
                strokeLinecap="round"
                style={{ filter: svgGlow(C.red, 7) }}
              />
              <polygon
                points="0,0 -20,-10 -20,10"
                fill={C.red}
                transform={`translate(${Math.min(1774, safePhotonX + 136)}, ${cy - 104})`}
              />
              <text
                x={Math.min(1680, safePhotonX + 10)}
                y={cy - 126}
                textAnchor="middle"
                fill={C.red}
                fontFamily={MONO}
                fontWeight={700}
                fontSize={26}
              >
                SWEPT BACKWARD →
              </text>
            </g>
          )}
        </g>
      </svg>

      <MinimalLabel
        text="SWEPT BACKWARD FOREVER?"
        sub="OUTSIDE THE HUBBLE SPHERE"
        color={C.gold}
        x={1060}
        y={64}
        align="center"
        size={46}
        delay={safeSwept}
      />
    </AbsoluteFill>
  );
};

// ===========================================================================
// 5. UpstreamPhotonRescueAnim — Ch 3C (5:20.5–6:20.0): 7-Cue Continuous Rescue!
// ===========================================================================
const SPACE_FLOW_STREAKS = [
  { y: 270, x0: 420, len: 55, speed: 0.75 },
  { y: 340, x0: 840, len: 70, speed: 1.35 },
  { y: 410, x0: 1220, len: 92, speed: 2.15 },
  { y: 475, x0: 660, len: 60, speed: 1.05 },
  { y: 650, x0: 540, len: 58, speed: 0.95 },
  { y: 715, x0: 1080, len: 84, speed: 1.85 },
  { y: 785, x0: 1340, len: 96, speed: 2.35 },
  { y: 850, x0: 780, len: 66, speed: 1.25 },
  { y: 310, x0: 1450, len: 105, speed: 2.65 },
  { y: 745, x0: 460, len: 52, speed: 0.8 },
];

export const UpstreamPhotonRescueAnim: React.FC<{
  fireAt: number;
  dragAt: number;
  howAt: number;
  dropAt: number;
  growAt: number;
  rescueAt: number;
  homeAt: number;
}> = ({ fireAt, dragAt, howAt, dropAt, growAt, rescueAt, homeAt }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const dur = Math.max(300, durationInFrames);
  const earthX = 185;
  const cy = 575;

  const safeFire = Math.max(4, fireAt);
  const safeDrag = Math.max(safeFire + 12, dragAt);
  const safeGrow = Math.max(safeDrag + 20, growAt);
  const safeRescue = Math.max(safeGrow + 18, rescueAt);
  const safeHome = Math.max(safeRescue + 24, homeAt);
  const endFrame = Math.max(safeHome + 45, dur - 14);

  // Hubble Sphere expands smoothly starting at growAt, crossing xTurn RIGHT ON rescueAt!
  const hubbleX0 = 1120;
  const xTurn = 1525;
  const hubbleXMax = 1650;

  let hubbleX = hubbleX0;
  if (frame > safeGrow && frame <= safeRescue) {
    const u = clamp01((frame - safeGrow) / Math.max(1, safeRescue - safeGrow));
    hubbleX = hubbleX0 + (xTurn - hubbleX0) * (2 * u * u - u * u * u);
  } else if (frame > safeRescue) {
    const v = clamp01((frame - safeRescue) / Math.max(45, dur - safeRescue));
    hubbleX = xTurn + (hubbleXMax - xTurn) * (0.65 * easeOutCubic(Math.min(1, v * 2.2)) + 0.35 * v);
  }
  const hubbleRadius = hubbleX - earthX;
  const hubbleBly = interpolate(hubbleX, [hubbleX0, hubbleXMax], [14.4, 16.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Distant emitter galaxy drifts continuously rightward across entire 60s
  const xEmit = 1345;
  const galaxyX =
    frame < safeFire
      ? xEmit - (safeFire - frame) * 0.14
      : lerp(xEmit, 1835, clamp01((frame - safeFire) / Math.max(60, dur - safeFire)));

  // Smooth C1-continuous photon trajectory across ALL 60 seconds!
  const photonVisible = frame >= safeFire;
  const xMid = 1235;
  let photonX = xEmit;
  let isRescued = false;
  let arrivedEarth = false;

  if (frame >= safeFire && frame <= safeRescue) {
    // Dragged continuously rightward away from Earth to turnaround xTurn!
    const u = clamp01((frame - safeFire) / Math.max(1, safeRescue - safeFire));
    photonX = xEmit + (xTurn - xEmit) * Math.sin(u * Math.PI * 0.5);
  } else if (frame > safeRescue && frame <= safeHome) {
    // Rescued! Arrests drift smoothly and begins swimming leftward inside cyan sphere
    isRescued = true;
    const u = clamp01((frame - safeRescue) / Math.max(1, safeHome - safeRescue));
    photonX = lerp(xTurn, xMid, u * u);
  } else if (frame > safeHome) {
    // Accelerates continuously home all the way into Earth!
    isRescued = true;
    const w = clamp01((frame - safeHome) / Math.max(1, endFrame - safeHome));
    photonX = lerp(xMid, earthX + 26, Math.pow(w, 1.18));
    arrivedEarth = w >= 0.97;
  }

  // Golden sinusoidal photon wave packet (ALWAYS pointing LEFT toward Earth!)
  const packetLen = 84;
  const packetPts: string[] = [];
  const pSteps = 34;
  for (let i = 0; i <= pSteps; i++) {
    const frac = i / pSteps;
    const px = photonX + frac * packetLen;
    const env = Math.sin(frac * Math.PI);
    const py = cy + Math.sin(frac * Math.PI * 5 - frame * 0.36) * 14 * env;
    packetPts.push((i === 0 ? "M " : "L ") + px.toFixed(1) + " " + py.toFixed(1));
  }
  const packetPath = packetPts.join(" ");

  // 2.2s (66 frame) crisp HOW? overlay right on howAt
  const howDur = 66;
  const howVisible = frame >= howAt - 2 && frame <= howAt + howDur + 16;
  const howEnter = spring({
    frame: Math.max(0, frame - howAt),
    fps,
    config: { damping: 14, stiffness: 170 },
  });
  const howExit = interpolate(
    frame,
    [howAt + howDur - 12, howAt + howDur + 8],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const howProgress = clamp01((frame - howAt) / howDur);

  // Top-left sleek H(t) down-meter on dropAt -> dur
  const dropEnter = spring({
    frame: Math.max(0, frame - dropAt),
    fps,
    config: { damping: 16, stiffness: 120 },
  });
  const dropU = clamp01((frame - dropAt) / Math.max(60, dur - dropAt));
  const hVal = lerp(74.0, 67.4, dropU);
  // Smooth downward-sloping H(t) curve inside top-left meter
  const meterPts: string[] = [];
  const mSamples = 28;
  for (let i = 0; i <= mSamples; i++) {
    const f = (i / mSamples) * Math.max(0.08, dropU);
    const mx = 86 + f * 244;
    const my = 112 + (1 - Math.exp(-f * 2.1)) * 66;
    meterPts.push((i === 0 ? "M " : "L ") + mx.toFixed(1) + " " + my.toFixed(1));
  }
  const meterCurve = meterPts.join(" ");

  // Outward growth arrows riding Hubble Sphere arc on growAt
  const growArrowP = easeOutCubic((frame - safeGrow) / 24);

  // Rescue crossing ripple expanding monotonically from (xTurn, cy) at rescueAt
  const rescueRippleP =
    frame >= safeRescue ? clamp01((frame - safeRescue) / 68) : 0;
  const dragBadgeP = spring({
    frame: Math.max(0, frame - safeDrag),
    fps,
    config: { damping: 16, stiffness: 120 },
  });
  const dragBadgeOut = interpolate(
    frame,
    [safeRescue - 10, safeRescue + 10],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const rescueBadgeP = spring({
    frame: Math.max(0, frame - safeRescue),
    fps,
    config: { damping: 14, stiffness: 130 },
  });

  // Earth arrival bloom
  const arriveBloom = arrivedEarth
    ? clamp01((frame - (endFrame - 4)) / 24)
    : 0;

  // Exact x of curved Hubble Sphere arc at y = 175 so top label ALWAYS clears the arc!
  const labelArcX =
    earthX +
    Math.sqrt(
      Math.max(1, hubbleRadius * hubbleRadius - (cy - 175) * (cy - 175)),
    );

  // Outward growth arrow anchor along curved arc at y = 385 and y = 765
  const arcXAtY = (targetY: number) =>
    earthX +
    Math.sqrt(
      Math.max(1, hubbleRadius * hubbleRadius - (cy - targetY) * (cy - targetY)),
    );

  return (
    <AbsoluteFill>
      <svg
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <radialGradient id="csl25HubbleArcFill" cx="50%" cy="50%" r="50%">
            <stop offset="86%" stopColor={C.cyan} stopOpacity={0} />
            <stop offset="100%" stopColor={C.cyan} stopOpacity={0.15} />
          </radialGradient>
          <linearGradient
            id="csl25GoldTrail"
            gradientUnits="userSpaceOnUse"
            x1={xTurn}
            y1={cy}
            x2={Math.min(xTurn - 4, photonX)}
            y2={cy}
          >
            <stop offset="0%" stopColor={C.gold} stopOpacity={0.2} />
            <stop offset="100%" stopColor={C.gold} stopOpacity={0.98} />
          </linearGradient>
        </defs>

        {/* Continuous space-expansion flow streaks drifting rightward */}
        {SPACE_FLOW_STREAKS.map((st, idx) => {
          const x = earthX + 90 + ((st.x0 - earthX + frame * st.speed) % 1580);
          const outside = x > hubbleX;
          return (
            <line
              key={idx}
              x1={x}
              y1={st.y}
              x2={x + st.len}
              y2={st.y}
              stroke={outside ? C.red : C.cyan}
              strokeWidth={1.8}
              strokeLinecap="round"
              opacity={outside ? 0.22 : 0.13}
            />
          );
        })}

        {/* Main horizontal line of sight axis */}
        <line
          x1={earthX}
          y1={cy}
          x2={1865}
          y2={cy}
          stroke="rgba(127, 147, 196, 0.22)"
          strokeWidth={2}
          strokeDasharray="6 12"
        />

        {/* Expanding Dashed Cyan Hubble Sphere Arc */}
        <circle
          cx={earthX}
          cy={cy}
          r={hubbleRadius}
          fill="url(#csl25HubbleArcFill)"
          stroke={C.cyan}
          strokeWidth={4.2}
          strokeDasharray="16 10"
          style={{ filter: svgGlow(C.cyan, 8) }}
        />

        {/* Outward Cyan Expansion Arrows riding the Growing Hubble Sphere Rim (growAt) */}
        {growArrowP > 0.02 && (
          <g opacity={growArrowP * 0.9}>
            {[365, 785].map((ay) => {
              const ax = arcXAtY(ay);
              if (ax > 1810) return null;
              return (
                <g key={ay}>
                  <line
                    x1={ax + 12}
                    y1={ay}
                    x2={ax + 68}
                    y2={ay}
                    stroke={C.cyan}
                    strokeWidth={4.5}
                    strokeLinecap="round"
                    style={{ filter: svgGlow(C.cyan, 6) }}
                  />
                  <polygon
                    points="0,0 -16,-8 -16,8"
                    fill={C.cyan}
                    transform={`translate(${ax + 78}, ${ay})`}
                  />
                </g>
              );
            })}
          </g>
        )}

        {/* Live Hubble Sphere Radius Readout — cleanly inside curved arc! */}
        <text
          x={labelArcX - 36}
          y={184}
          textAnchor="end"
          fill={C.cyan}
          fontFamily={MONO}
          fontWeight={700}
          fontSize={32}
          style={{ filter: svgGlow(C.cyan, 6) }}
        >
          {hubbleBly.toFixed(1)} B ly
        </text>
        <text
          x={labelArcX - 36}
          y={216}
          textAnchor="end"
          fill={C.dim}
          fontFamily={MONO}
          fontWeight={700}
          fontSize={18}
        >
          HUBBLE SPHERE
        </text>

        {/* Distant Emitter Galaxy (15.5 B ly -> drifting right) */}
        <line
          x1={xEmit}
          y1={cy + 46}
          x2={galaxyX}
          y2={cy + 46}
          stroke={C.red}
          strokeWidth={2}
          strokeDasharray="4 6"
          opacity={0.42}
        />
        <SpiralGalaxy x={galaxyX} y={cy} radius={24} color={C.red} angle={-20} />
        <text
          x={Math.min(1815, galaxyX)}
          y={cy + 82}
          textAnchor="middle"
          fill={C.red}
          fontFamily={MONO}
          fontWeight={700}
          fontSize={22}
        >
          15.5 B ly
        </text>

        {/* Rightward drag trail (fireAt -> turnaround) */}
        {photonVisible && (
          <line
            x1={xEmit}
            y1={cy}
            x2={isRescued ? xTurn : photonX}
            y2={cy}
            stroke={C.red}
            strokeWidth={4}
            strokeDasharray="8 6"
            opacity={isRescued ? 0.45 : 0.9}
          />
        )}

        {/* Rescued leftward swim-home golden trail (xTurn -> Earth) */}
        {isRescued && (
          <line
            x1={xTurn}
            y1={cy}
            x2={photonX}
            y2={cy}
            stroke="url(#csl25GoldTrail)"
            strokeWidth={6}
            strokeLinecap="round"
            style={{ filter: svgGlow(C.gold, 8) }}
          />
        )}

        {/* Rescue crossing shockwave right at (xTurn, cy) */}
        {rescueRippleP > 0 && (
          <g>
            <circle
              cx={xTurn}
              cy={cy}
              r={18 + rescueRippleP * 115}
              fill="none"
              stroke={C.green}
              strokeWidth={4}
              opacity={0.92 * (1 - rescueRippleP * 0.85)}
              style={{ filter: svgGlow(C.green, 9) }}
            />
            <circle
              cx={xTurn}
              cy={cy}
              r={12 + rescueRippleP * 76}
              fill="none"
              stroke={C.cyan}
              strokeWidth={2.5}
              opacity={0.8 * (1 - rescueRippleP * 0.75)}
            />
            <circle cx={xTurn} cy={cy} r={6.5} fill={C.green} opacity={0.85} />
          </g>
        )}

        {/* Golden Sinusoidal Photon Wave Packet (ALWAYS pointing LEFT toward Earth!) */}
        {photonVisible && (
          <g>
            <path
              d={packetPath}
              fill="none"
              stroke={C.gold}
              strokeWidth={4.6}
              strokeLinecap="round"
              style={{ filter: svgGlow(C.gold, 8) }}
            />
            <polygon
              points="0,0 18,-9 18,9"
              fill="#fff7d6"
              transform={`translate(${photonX - 4}, ${cy})`}
              style={{ filter: svgGlow(C.gold, 8) }}
            />
            <text
              x={photonX + 36}
              y={cy - 36}
              textAnchor="middle"
              fill={C.gold}
              fontFamily={MONO}
              fontWeight={700}
              fontSize={22}
              style={{ filter: svgGlow(C.gold, 6) }}
            >
              PHOTON · c
            </text>
          </g>
        )}

        {/* Transient State Callout: DRAGGED OUT (dragAt -> rescueAt) */}
        {frame >= safeDrag && dragBadgeOut > 0.02 && (
          <g opacity={Math.min(1, dragBadgeP) * dragBadgeOut}>
            <line
              x1={xEmit + 10}
              y1={cy - 90}
              x2={Math.max(xEmit + 50, photonX + 22)}
              y2={cy - 90}
              stroke={C.red}
              strokeWidth={4.5}
              strokeLinecap="round"
            />
            <polygon
              points="0,0 -15,-7 -15,7"
              fill={C.red}
              transform={`translate(${Math.max(xEmit + 58, photonX + 30)}, ${cy - 90})`}
            />
            <text
              x={(xEmit + Math.max(xEmit + 58, photonX + 30)) * 0.5}
              y={cy - 110}
              textAnchor="middle"
              fill={C.red}
              fontFamily={MONO}
              fontWeight={700}
              fontSize={24}
            >
              DRAGGED OUT
            </text>
          </g>
        )}

        {/* Crisp State Callout: RESCUED ✓ (rescueAt onward) */}
        {frame >= safeRescue && (
          <text
            x={xTurn}
            y={cy - 102}
            textAnchor="middle"
            fill={C.green}
            fontFamily={MONO}
            fontWeight={700}
            fontSize={30}
            opacity={Math.min(1, rescueBadgeP)}
            style={{ filter: svgGlow(C.green, 8) }}
          >
            RESCUED ✓
          </text>
        )}

        {/* Top-Left Sleek H(t) ↓ Meter (dropAt -> dur) */}
        {frame >= dropAt - 1 && (
          <g
            opacity={Math.min(1, dropEnter * 1.25)}
            transform={`translate(0, ${(1 - dropEnter) * -18})`}
          >
            <rect
              x={56}
              y={46}
              width={305}
              height={162}
              rx={16}
              fill="rgba(5, 10, 24, 0.82)"
              stroke="rgba(62, 224, 255, 0.45)"
              strokeWidth={1.8}
            />
            <text
              x={82}
              y={84}
              fill={C.cyan}
              fontFamily={MONO}
              fontWeight={700}
              fontSize={24}
              style={{ filter: svgGlow(C.cyan, 5) }}
            >
              H(t) ↓
            </text>
            <text
              x={336}
              y={84}
              textAnchor="end"
              fill={C.white}
              fontFamily={MONO}
              fontWeight={700}
              fontSize={22}
            >
              {hVal.toFixed(1)}
            </text>
            {/* Axis hairlines */}
            <line
              x1={84}
              y1={104}
              x2={84}
              y2={186}
              stroke="rgba(127, 147, 196, 0.35)"
              strokeWidth={1.5}
            />
            <line
              x1={84}
              y1={186}
              x2={336}
              y2={186}
              stroke="rgba(127, 147, 196, 0.35)"
              strokeWidth={1.5}
            />
            {/* Downward-sloping H(t) curve */}
            <path
              d={meterCurve}
              fill="none"
              stroke={C.cyan}
              strokeWidth={3.8}
              strokeLinecap="round"
              style={{ filter: svgGlow(C.cyan, 6) }}
            />
            <circle
              cx={86 + Math.max(0.08, dropU) * 244}
              cy={112 + (1 - Math.exp(-Math.max(0.08, dropU) * 2.1)) * 66}
              r={5.5}
              fill="#ffffff"
            />
          </g>
        )}

        {/* Earth Arrival Glow */}
        {arriveBloom > 0 && (
          <circle
            cx={earthX}
            cy={cy}
            r={24 + arriveBloom * 96}
            fill="none"
            stroke={C.gold}
            strokeWidth={4.5}
            opacity={0.92 * (1 - arriveBloom * 0.65)}
            style={{ filter: svgGlow(C.gold, 10) }}
          />
        )}

        {/* Earth at Left */}
        <EarthOrb x={earthX} y={cy} r={22} />
        <text
          x={earthX}
          y={cy + 58}
          textAnchor="middle"
          fill={C.white}
          fontFamily={MONO}
          fontWeight={700}
          fontSize={22}
        >
          EARTH
        </text>
      </svg>

      {/* Crisp 2.2s Bold HOW? Overlay right on howAt (5:40.6) */}
      {howVisible && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 215,
            display: "flex",
            justifyContent: "center",
            pointerEvents: "none",
            opacity: Math.min(1, howEnter * 1.35) * howExit,
            transform: `scale(${lerp(0.88, 1.0, howEnter) + howProgress * 0.08})`,
          }}
        >
          <div
            style={{
              fontFamily: INTER,
              fontWeight: 900,
              fontSize: 112,
              color: C.white,
              letterSpacing: 6,
              textShadow: `0 12px 36px rgba(4, 8, 20, 0.96), ${glow(C.gold, 22)}`,
            }}
          >
            HOW?
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ===========================================================================
// 6. PhotonArrivalLikeBridgeAnim — Ch 3D (6:20.0–6:32.2): Continuous Capture!
//    (Leaves bottom-right completely open for LikePromptToast!)
// ===========================================================================
export const PhotonArrivalLikeBridgeAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const dur = Math.max(180, durationInFrames);
  const mirrorX = 560;
  const mirrorY = 518;
  const secX = 768;
  const secY = 422;

  // Monotonic gentle parallax camera drift spanning 100% of durationInFrames!
  const uAll = clamp01(frame / dur);
  const driftX = lerp(0, -38, uAll);
  const driftScale = lerp(1.0, 1.045, uAll);

  // Incoming rescued golden photon path: (1760, 170) -> mirror -> secondary -> detector core
  const hitMirrorF = 62;
  const hitSecF = 84;
  const hitCoreF = 104;

  const pIn = clamp01(frame / hitMirrorF);
  const pBounce1 = clamp01((frame - hitMirrorF) / (hitSecF - hitMirrorF));
  const pBounce2 = clamp01((frame - hitSecF) / (hitCoreF - hitSecF));
  const bloomU =
    frame > hitCoreF
      ? clamp01((frame - hitCoreF) / Math.max(60, dur - hitCoreF))
      : 0;

  const inStartX = 1760;
  const inStartY = 170;
  const curInX = lerp(inStartX, mirrorX + 18, pIn);
  const curInY = lerp(inStartY, mirrorY - 8, pIn);

  // Build incoming sinusoidal golden light wave
  const wavePts: string[] = [];
  const inSteps = 40;
  const dx = mirrorX + 18 - inStartX;
  const dy = mirrorY - 8 - inStartY;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / dist;
  const uy = dy / dist;
  const nx = -uy;
  const ny = ux;
  const waveLen = Math.min(280, pIn * dist);
  for (let i = 0; i <= inSteps; i++) {
    const frac = i / inSteps;
    const s = -waveLen * (1 - frac);
    const bx = curInX + ux * s;
    const by = curInY + uy * s;
    const env = Math.sin(frac * Math.PI);
    const amp = Math.sin(frac * Math.PI * 8 - frame * 0.34) * 12 * env;
    wavePts.push(
      (i === 0 ? "M " : "L ") +
        (bx + nx * amp).toFixed(1) +
        " " +
        (by + ny * amp).toFixed(1),
    );
  }
  const incomingWavePath = wavePts.join(" ");

  const hexOffsets = [
    { ox: 0, oy: 0 },
    { ox: -14, oy: -46 },
    { ox: 14, oy: 46 },
    { ox: -40, oy: -18 },
    { ox: -26, oy: 28 },
    { ox: 26, oy: -28 },
    { ox: 40, oy: 18 },
  ];

  const hexPoly = (cx: number, cy: number, rx: number, ry: number) => {
    const pts: string[] = [];
    for (let k = 0; k < 6; k++) {
      const a = (k * Math.PI) / 3 + Math.PI / 6;
      pts.push(
        (cx + Math.cos(a) * rx).toFixed(1) +
          "," +
          (cy + Math.sin(a) * ry).toFixed(1),
      );
    }
    return pts.join(" ");
  };

  // 5 staggered monotonic expanding light-capture rings keeping motion alive all the way to dur!
  const captureRings = [0, 1, 2, 3, 4];

  return (
    <AbsoluteFill>
      <svg
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <radialGradient id="csl26TelescopeBloom" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff7d6" stopOpacity={0.92} />
            <stop offset="32%" stopColor={C.gold} stopOpacity={0.46} />
            <stop offset="70%" stopColor={C.cyan} stopOpacity={0.14} />
            <stop offset="100%" stopColor={C.cyan} stopOpacity={0} />
          </radialGradient>
        </defs>

        <g
          transform={`translate(${mirrorX + driftX}, ${mirrorY}) scale(${driftScale}) translate(${-mirrorX}, ${-mirrorY})`}
        >
          {/* Sunshield Diamond Layers */}
          <polygon
            points={`${mirrorX - 240},${mirrorY + 135} ${mirrorX + 20},${mirrorY + 95} ${mirrorX + 245},${mirrorY + 150} ${mirrorX - 15},${mirrorY + 215}`}
            fill="rgba(18, 36, 78, 0.78)"
            stroke="rgba(62, 224, 255, 0.35)"
            strokeWidth={2}
          />
          <polygon
            points={`${mirrorX - 220},${mirrorY + 155} ${mirrorX + 20},${mirrorY + 118} ${mirrorX + 225},${mirrorY + 168} ${mirrorX - 15},${mirrorY + 230}`}
            fill="rgba(12, 24, 54, 0.7)"
            stroke="rgba(62, 224, 255, 0.22)"
            strokeWidth={1.6}
          />

          {/* Golden Segmented Hexagonal Mirror Dish */}
          <g transform={`rotate(-18 ${mirrorX} ${mirrorY})`}>
            {hexOffsets.map((h, idx) => (
              <polygon
                key={idx}
                points={hexPoly(mirrorX + h.ox, mirrorY + h.oy, 24, 28)}
                fill={bloomU > 0 ? "#ffd26e" : "rgba(255, 194, 77, 0.8)"}
                stroke="#fff2c2"
                strokeWidth={2}
                opacity={0.86 + Math.min(0.14, bloomU * 0.25)}
                style={idx === 0 ? { filter: svgGlow(C.gold, 8) } : undefined}
              />
            ))}
          </g>

          {/* Slender Tripod Boom holding Secondary Mirror */}
          <line
            x1={mirrorX - 12}
            y1={mirrorY - 76}
            x2={secX}
            y2={secY}
            stroke="#94a3b8"
            strokeWidth={3}
            opacity={0.76}
          />
          <line
            x1={mirrorX + 26}
            y1={mirrorY + 70}
            x2={secX}
            y2={secY}
            stroke="#94a3b8"
            strokeWidth={3}
            opacity={0.76}
          />
          <line
            x1={mirrorX - 40}
            y1={mirrorY + 32}
            x2={secX}
            y2={secY}
            stroke="#94a3b8"
            strokeWidth={2.5}
            opacity={0.6}
          />
          <circle
            cx={secX}
            cy={secY}
            r={13}
            fill="#1e293b"
            stroke={C.gold}
            strokeWidth={2.8}
          />

          {/* Incoming Golden Photon Beam */}
          {frame < hitMirrorF + 18 && (
            <g
              opacity={interpolate(
                frame,
                [hitMirrorF, hitMirrorF + 18],
                [1, 0],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
              )}
            >
              <path
                d={incomingWavePath}
                fill="none"
                stroke={C.gold}
                strokeWidth={4.5}
                strokeLinecap="round"
                style={{ filter: svgGlow(C.gold, 9) }}
              />
              <circle cx={curInX} cy={curInY} r={7} fill="#ffffff" />
            </g>
          )}

          {/* Focusing Rays */}
          {pBounce1 > 0 && (
            <line
              x1={mirrorX + 18}
              y1={mirrorY - 8}
              x2={lerp(mirrorX + 18, secX, pBounce1)}
              y2={lerp(mirrorY - 8, secY, pBounce1)}
              stroke="#fff4cc"
              strokeWidth={4}
              strokeLinecap="round"
              opacity={1 - bloomU * 0.55}
              style={{ filter: svgGlow(C.gold, 8) }}
            />
          )}
          {pBounce2 > 0 && (
            <line
              x1={secX}
              y1={secY}
              x2={lerp(secX, mirrorX + 6, pBounce2)}
              y2={lerp(secY, mirrorY - 2, pBounce2)}
              stroke={C.gold}
              strokeWidth={4.5}
              strokeLinecap="round"
              opacity={1 - bloomU * 0.45}
              style={{ filter: svgGlow(C.gold, 10) }}
            />
          )}

          {/* Continuous Expanding Light Capture Rings + 6-Point JWST Diffraction Spikes */}
          {bloomU > 0 && (
            <g>
              <circle
                cx={mirrorX + 6}
                cy={mirrorY - 2}
                r={42 + easeOutCubic(bloomU) * 285}
                fill="url(#csl26TelescopeBloom)"
                opacity={0.92 - bloomU * 0.3}
              />
              {captureRings.map((idx) => {
                const startFrac = idx * 0.17;
                const localP = clamp01((bloomU - startFrac) / 0.55);
                if (localP <= 0.005) return null;
                return (
                  <circle
                    key={idx}
                    cx={mirrorX + 6}
                    cy={mirrorY - 2}
                    r={22 + easeOutCubic(localP) * 395}
                    fill="none"
                    stroke={idx % 2 === 0 ? C.gold : C.cyan}
                    strokeWidth={2.6 - idx * 0.2}
                    opacity={0.78 * (1 - localP * 0.92)}
                  />
                );
              })}
              {/* 6-point JWST star diffraction spikes growing continuously */}
              {[0, 60, 120].map((deg) => {
                const rad = (deg * Math.PI) / 180;
                const spikeLen = 44 + easeOutCubic(bloomU) * 210 + bloomU * 55;
                return (
                  <line
                    key={deg}
                    x1={mirrorX + 6 - Math.cos(rad) * spikeLen}
                    y1={mirrorY - 2 - Math.sin(rad) * spikeLen}
                    x2={mirrorX + 6 + Math.cos(rad) * spikeLen}
                    y2={mirrorY - 2 + Math.sin(rad) * spikeLen}
                    stroke="#fff8df"
                    strokeWidth={2.4}
                    opacity={0.88 - bloomU * 0.22}
                    style={{ filter: svgGlow(C.gold, 6) }}
                  />
                );
              })}
              <circle cx={mirrorX + 6} cy={mirrorY - 2} r={10} fill="#ffffff" />
            </g>
          )}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
