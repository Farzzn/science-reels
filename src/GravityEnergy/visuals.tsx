import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, glow, INTER, MONO, svgGlow } from "../FiveHundredMileEmail/theme";

// ---------------------------------------------------------------------------
// 1. ANIMATED CHAPTER CARD (Zero static holds — continuous orbital rings)
// ---------------------------------------------------------------------------
export const AnimatedChapterCard: React.FC<{ num: number; title: string; subtitle?: string; len?: number }> = ({
  num,
  title,
  subtitle,
  len = 46,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame > len + 16) return null;
  const p = spring({ frame, fps, config: { damping: 16, stiffness: 120 } });
  const o = interpolate(frame, [len, len + 16], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line = interpolate(frame, [4, 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const rot = frame * 1.4;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity: o,
        background: `rgba(4,8,20,${0.95 * o})`,
        backdropFilter: `blur(${Math.round(14 * o)}px)`,
        zIndex: 40,
      }}
    >
      {/* Animated orbital rings behind title so transition is never static */}
      <svg width={1100} height={700} viewBox="0 0 1100 700" style={{ position: "absolute", opacity: 0.25 * p }}>
        <g transform={`translate(550,350) rotate(${rot})`}>
          <ellipse cx={0} cy={0} rx={420} ry={160} fill="none" stroke={C.cyan} strokeWidth={2} strokeDasharray="14 10" />
          <circle cx={420} cy={0} r={8} fill={C.gold} />
        </g>
        <g transform={`translate(550,350) rotate(${-rot * 0.7})`}>
          <ellipse cx={0} cy={0} rx={320} ry={120} fill="none" stroke={C.gold} strokeWidth={1.8} />
          <circle cx={-320} cy={0} r={7} fill={C.cyan} />
        </g>
      </svg>

      <div style={{ textAlign: "center", transform: `translateY(${(1 - p) * 28}px) scale(${0.95 + 0.05 * p})` }}>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 28, letterSpacing: 6, color: C.cyan }}>
          PART {num < 10 ? `0${num}` : num}
        </div>
        <div
          style={{
            width: 560 * line,
            height: 3,
            margin: "20px auto",
            background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`,
            boxShadow: glow(C.gold, 8),
          }}
        />
        <div
          style={{
            fontFamily: INTER,
            fontWeight: 900,
            fontSize: 92,
            color: C.white,
            letterSpacing: -2.2,
            textShadow: "0 8px 32px rgba(0,0,0,0.9)",
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div style={{ fontFamily: MONO, fontSize: 24, color: C.gold, marginTop: 14, letterSpacing: 3 }}>
            {subtitle}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// 2. RECURRING METAPHOR #1: FORCE vs. WORK LIVE GAUGE RIG (W = F · d)
// ---------------------------------------------------------------------------
export const ForceVsWorkGauge: React.FC<{
  forceText: string;
  forceFill: number; // 0..1
  distText: string;
  distFill: number; // 0..1
  workText: string;
  workFill: number; // 0..1
  verdict: string;
  verdictColor?: string;
  width?: number;
}> = ({
  forceText,
  forceFill,
  distText,
  distFill,
  workText,
  workFill,
  verdict,
  verdictColor = C.green,
  width = 740,
}) => {
  const bar = (label: string, val: string, fill: number, color: string) => (
    <div style={{ marginTop: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: MONO, fontWeight: 800, fontSize: 24 }}>
        <span style={{ color: C.dim }}>{label}</span>
        <span style={{ color }}>{val}</span>
      </div>
      <div style={{ height: 22, borderRadius: 11, background: "rgba(255,255,255,0.08)", marginTop: 8, overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${Math.max(2, Math.min(100, fill * 100))}%`,
            background: color,
            boxShadow: glow(color, 10),
            borderRadius: 11,
          }}
        />
      </div>
    </div>
  );

  return (
    <div
      style={{
        width,
        padding: "32px 38px",
        borderRadius: 24,
        background: "rgba(10, 20, 48, 0.86)",
        border: `2px solid ${C.panelBorder}`,
        boxShadow: "0 20px 60px rgba(0,0,0,0.65)",
      }}
    >
      <div style={{ fontFamily: MONO, fontWeight: 900, fontSize: 26, color: C.white, letterSpacing: 2 }}>
        PHYSICS EQUATION: <span style={{ color: C.gold }}>WORK = FORCE × DISTANCE</span>
      </div>
      {bar("FORCE (F)", forceText, forceFill, C.gold)}
      {bar("DISTANCE MOVED (d)", distText, distFill, C.cyan)}
      {bar("ENERGY / WORK DONE (W)", workText, workFill, workFill > 0.05 ? C.red : C.green)}
      <div
        style={{
          marginTop: 28,
          padding: "16px 24px",
          borderRadius: 14,
          background: "rgba(4,8,20,0.7)",
          border: `2px solid ${verdictColor}`,
          textAlign: "center",
          fontFamily: INTER,
          fontWeight: 900,
          fontSize: 32,
          color: verdictColor,
          textShadow: glow(verdictColor, 8),
        }}
      >
        {verdict}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// 3. RECURRING METAPHOR #2: INTERACTIVE 3D-PROJECTED SPACETIME FUNNEL SVG
// ---------------------------------------------------------------------------
export const SpacetimeFunnelSVG: React.FC<{
  depth: number; // 0 = flat Newton grid, 1 = deep Einstein curved well
  showMoon?: boolean;
  showForceRope?: boolean;
  width?: number;
  height?: number;
}> = ({ depth, showMoon = true, showForceRope = false, width = 920, height = 660 }) => {
  const frame = useCurrentFrame();
  const cx = width / 2;
  const cy = height * 0.44;
  const rings = 7;
  const spokes = 16;

  // Project radial grid point (r, theta) onto curved funnel
  const proj = (r: number, theta: number): [number, number] => {
    const x = cx + Math.cos(theta) * r;
    const wellDip = depth * (260 / (1 + Math.pow(r / 125, 1.9)));
    const y = cy + Math.sin(theta) * (r * 0.42) + wellDip;
    return [x, y];
  };

  const moonAngle = frame * 0.032;
  const moonR = 330;
  const [mx, my] = proj(moonR, moonAngle);
  const earthDip = depth * 125;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: "visible" }}>
      {/* Radial Spokes */}
      {new Array(spokes).fill(0).map((_, s) => {
        const theta = (s / spokes) * Math.PI * 2;
        const pts: string[] = [];
        for (let step = 0; step <= 24; step++) {
          const r = 45 + (step / 24) * 380;
          const [px, py] = proj(r, theta);
          pts.push(`${px.toFixed(1)},${py.toFixed(1)}`);
        }
        return (
          <polyline
            key={`s-${s}`}
            points={pts.join(" ")}
            fill="none"
            stroke={C.cyan}
            strokeWidth={1.6}
            opacity={0.42}
          />
        );
      })}

      {/* Concentric Curved Spacetime Rings */}
      {new Array(rings).fill(0).map((_, k) => {
        const r = 68 + k * 56;
        const pts: string[] = [];
        for (let step = 0; step <= 64; step++) {
          const theta = (step / 64) * Math.PI * 2;
          const [px, py] = proj(r, theta);
          pts.push(`${px.toFixed(1)},${py.toFixed(1)}`);
        }
        const isOrbitRing = k === 5 && showMoon;
        return (
          <polyline
            key={`r-${k}`}
            points={pts.join(" ")}
            fill="none"
            stroke={isOrbitRing ? C.gold : C.cyan}
            strokeWidth={isOrbitRing ? 3.2 : 1.8}
            opacity={isOrbitRing ? 0.85 : 0.48}
            style={isOrbitRing ? { filter: svgGlow(C.gold, 5) } : undefined}
          />
        );
      })}

      {/* Optional Newton Pulling Rope Arrow */}
      {showForceRope && showMoon && (
        <g style={{ filter: svgGlow(C.red, 6) }}>
          <line
            x1={mx}
            y1={my}
            x2={cx}
            y2={cy + earthDip}
            stroke={C.red}
            strokeWidth={4}
            strokeDasharray="10 8"
          />
          <text x={(mx + cx) / 2} y={(my + cy + earthDip) / 2 - 14} fill={C.red} fontFamily={MONO} fontWeight={800} fontSize={20}>
            F = 1.98×10²⁰ N
          </text>
        </g>
      )}

      {/* Earth Sphere Resting in the Curved Well */}
      <defs>
        <radialGradient id="gravEarth" cx="35%" cy="35%">
          <stop offset="0%" stopColor="#4da6ff" />
          <stop offset="55%" stopColor="#1456b8" />
          <stop offset="100%" stopColor="#071a3f" />
        </radialGradient>
        <radialGradient id="gravMoon" cx="35%" cy="35%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="65%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#475569" />
        </radialGradient>
      </defs>

      <g transform={`translate(${cx}, ${cy + earthDip})`} style={{ filter: svgGlow(C.cyan, 10) }}>
        <circle cx={0} cy={0} r={54} fill="url(#gravEarth)" stroke={C.cyan} strokeWidth={2.5} />
        <text x={0} y={82} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={800} fontSize={22}>
          EARTH
        </text>
      </g>

      {/* Orbiting Moon */}
      {showMoon && (
        <g transform={`translate(${mx}, ${my})`} style={{ filter: svgGlow(C.gold, 8) }}>
          <circle cx={0} cy={0} r={19} fill="url(#gravMoon)" stroke={C.gold} strokeWidth={2.5} />
          <text x={0} y={-28} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={800} fontSize={20}>
            MOON
          </text>
        </g>
      )}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// 4. STANDALONE MID-ROLL SUBSCRIBE TOAST (No Episode / Playlist Labels!)
// ---------------------------------------------------------------------------
export const CleanSubscribeToast: React.FC<{ at: number; dur?: number }> = ({ at, dur = 140 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < at || frame > at + dur) return null;
  const enter = spring({ frame: frame - at, fps, config: { damping: 15, stiffness: 140 } });
  const exit = interpolate(frame, [at + dur - 18, at + dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const clicked = frame > at + 55;
  const clickScale = interpolate(frame, [at + 50, at + 55, at + 62], [1, 0.9, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div
      style={{
        position: "absolute",
        bottom: 60,
        right: 76,
        opacity: enter * exit,
        transform: `translateY(${(1 - enter) * 40}px)`,
        display: "flex",
        alignItems: "center",
        gap: 24,
        padding: "20px 34px",
        borderRadius: 24,
        background: "rgba(8, 15, 36, 0.94)",
        border: `2px solid ${C.gold}`,
        boxShadow: `0 18px 50px rgba(0,0,0,0.8), ${glow(C.gold, 12)}`,
        zIndex: 35,
      }}
    >
      <div>
        <div style={{ fontFamily: MONO, fontSize: 20, color: C.gold, fontWeight: 800, letterSpacing: 3 }}>
          ENJOYING THE VISUAL PHYSICS?
        </div>
        <div style={{ fontFamily: INTER, fontSize: 28, color: C.white, fontWeight: 800, marginTop: 4 }}>
          Subscribe for more deep dives
        </div>
      </div>
      <div
        style={{
          padding: "14px 32px",
          borderRadius: 40,
          background: clicked ? C.green : C.red,
          color: clicked ? "#040814" : "#fff",
          fontFamily: INTER,
          fontWeight: 900,
          fontSize: 26,
          transform: `scale(${clickScale})`,
          boxShadow: glow(clicked ? C.green : C.red, 10),
        }}
      >
        {clicked ? "SUBSCRIBED ✓" : "SUBSCRIBE"}
      </div>
    </div>
  );
};
