import React from "react";
import { interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, glow, INTER, MONO, svgGlow } from "../FiveHundredMileEmail/theme";

// ---------------------------------------------------------------------------
// 1. YEAR BADGE / CHRONO TIMELINE BANNER (User Rule #1: Always display years)
// ---------------------------------------------------------------------------
export const YearBadge: React.FC<{
  year: string;
  location?: string;
  at?: number;
  color?: string;
}> = ({ year, location, at = 0, color = C.gold }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({
    frame: Math.max(0, frame - at),
    fps,
    config: { damping: 14, stiffness: 130 },
  });
  if (frame < at) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: 52,
        left: 76,
        display: "flex",
        alignItems: "center",
        gap: 18,
        padding: "12px 28px",
        borderRadius: 16,
        background: "rgba(8, 15, 36, 0.85)",
        border: `2px solid ${color}`,
        boxShadow: `0 12px 32px rgba(0,0,0,0.65), ${glow(color, 10)}`,
        transform: `translateY(${(1 - p) * -36}px) scale(${0.9 + 0.1 * p})`,
        opacity: p,
        zIndex: 20,
      }}
    >
      <svg width={34} height={34} viewBox="0 0 100 100" fill="none" stroke={color} strokeWidth={6}>
        <circle cx={50} cy={50} r={40} />
        <polyline points="50,24 50,50 68,62" />
      </svg>
      <div>
        <div
          style={{
            fontFamily: MONO,
            fontWeight: 900,
            fontSize: 36,
            color,
            letterSpacing: 3,
            lineHeight: 1.05,
            textShadow: glow(color, 8),
          }}
        >
          {year}
        </div>
        {location ? (
          <div
            style={{
              fontFamily: INTER,
              fontWeight: 800,
              fontSize: 18,
              color: C.white,
              letterSpacing: 2,
              marginTop: 2,
              opacity: 0.9,
            }}
          >
            {location}
          </div>
        ) : null}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// 2. RECURRING METAPHOR #1: 8-BIT / 13-BIT BINARY REGISTER (Evolving Visual)
// ---------------------------------------------------------------------------
export const BinaryRegister: React.FC<{
  bits: (0 | 1)[];
  flippedIndex?: number;
  flipAt?: number;
  hexBefore?: string;
  hexAfter?: string;
  valBefore?: string;
  valAfter?: string;
  bitLabels?: string[];
  scale?: number;
}> = ({
  bits,
  flippedIndex = -1,
  flipAt = 99999,
  hexBefore,
  hexAfter,
  valBefore,
  valAfter,
  bitLabels,
  scale = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const isFlipped = frame >= flipAt;
  const flipPop = spring({
    frame: Math.max(0, frame - flipAt),
    fps,
    config: { damping: 11, stiffness: 160 },
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        transform: `scale(${scale})`,
      }}
    >
      {/* Top Hex & Value Readout */}
      {(hexBefore || valBefore) && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 44,
            marginBottom: 26,
            padding: "16px 38px",
            borderRadius: 18,
            background: "rgba(10,20,48,0.78)",
            border: `1.5px solid ${isFlipped ? C.red : C.panelBorder}`,
            boxShadow: isFlipped ? glow(C.red, 12) : "none",
          }}
        >
          {hexBefore && (
            <div style={{ fontFamily: MONO, fontSize: 38, fontWeight: 700, color: C.white }}>
              HEX:{" "}
              <span style={{ color: isFlipped ? C.red : C.gold, textShadow: glow(isFlipped ? C.red : C.gold, 10) }}>
                {isFlipped ? hexAfter : hexBefore}
              </span>
            </div>
          )}
          {valBefore && (
            <div style={{ fontFamily: MONO, fontSize: 38, fontWeight: 700, color: C.white }}>
              VALUE:{" "}
              <span style={{ color: isFlipped ? C.green : C.cyan, textShadow: glow(isFlipped ? C.green : C.cyan, 10) }}>
                {isFlipped ? valAfter : valBefore}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Bit Cells Row */}
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        {bits.map((b, i) => {
          const hit = i === flippedIndex && isFlipped;
          const val = hit ? (b === 1 ? 0 : 1) : b;
          const col = hit ? C.red : val === 1 ? C.gold : C.cyan;
          const bounce = hit ? 1 + 0.22 * Math.sin(flipPop * Math.PI) : 1;
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              {bitLabels && bitLabels[i] ? (
                <div style={{ fontFamily: MONO, fontSize: 18, color: hit ? C.red : C.dim, marginBottom: 8, fontWeight: 700 }}>
                  {bitLabels[i]}
                </div>
              ) : null}
              <div
                style={{
                  width: 96,
                  height: 118,
                  borderRadius: 18,
                  background: hit ? "rgba(255,77,94,0.22)" : val === 1 ? "rgba(255,194,77,0.14)" : "rgba(62,224,255,0.06)",
                  border: `3px solid ${col}`,
                  boxShadow: hit ? glow(C.red, 18) : val === 1 ? glow(C.gold, 8) : "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: MONO,
                  fontWeight: 900,
                  fontSize: 64,
                  color: hit ? "#fff" : col,
                  transform: `scale(${bounce})`,
                }}
              >
                {val}
              </div>
              <div style={{ fontFamily: MONO, fontSize: 16, color: C.dim, marginTop: 8 }}>bit {bits.length - 1 - i}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// 3. RECURRING METAPHOR #2: MICROSCOPIC DRAM CAPACITOR BUCKET
// ---------------------------------------------------------------------------
export const CapacitorBucketSVG: React.FC<{
  fillLevel: number; // 0 to 1
  label: string;
  sublabel?: string;
  strikeAt?: number;
  width?: number;
  height?: number;
  electronCount?: number;
}> = ({ fillLevel, label, sublabel, strikeAt = 99999, width = 460, height = 520, electronCount = 18 }) => {
  const frame = useCurrentFrame();
  const isStruck = frame >= strikeAt;
  const strikeProg = interpolate(frame, [strikeAt - 12, strikeAt + 4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const effectiveFill = isStruck
    ? interpolate(frame, [strikeAt, strikeAt + 18], [fillLevel, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : fillLevel;

  const col = isStruck ? C.red : effectiveFill > 0.5 ? C.gold : C.cyan;
  const bitVal = effectiveFill > 0.5 ? "1" : "0";

  const electrons = React.useMemo(
    () =>
      new Array(electronCount).fill(0).map((_, i) => ({
        rx: 0.16 + random(`ex${i}`) * 0.68,
        ry: 0.12 + random(`ey${i}`) * 0.78,
        sp: 0.04 + random(`es${i}`) * 0.06,
      })),
    [electronCount],
  );

  const bx = 90;
  const by = 130;
  const bw = 280;
  const bh = 280;
  const liquidH = bh * effectiveFill;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: "visible" }}>
      {/* Transistor Switch Lid at Top */}
      <g style={{ filter: svgGlow(C.cyan, 4) }}>
        <rect x={bx - 20} y={58} width={bw + 40} height={24} rx={8} fill="rgba(62,224,255,0.18)" stroke={C.cyan} strokeWidth={2.5} />
        <text x={width / 2} y={42} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontSize={20} fontWeight={700}>
          TRANSISTOR GATE (LID)
        </text>
      </g>

      {/* Silicon Trench Bucket Walls */}
      <path
        d={`M ${bx} ${by} L ${bx} ${by + bh} Q ${bx} ${by + bh + 20} ${bx + 20} ${by + bh + 20} L ${bx + bw - 20} ${by + bh + 20} Q ${bx + bw} ${by + bh + 20} ${bx + bw} ${by + bh} L ${bx + bw} ${by}`}
        fill="rgba(10, 20, 48, 0.75)"
        stroke={col}
        strokeWidth={6}
        style={{ filter: svgGlow(col, 6) }}
      />

      {/* Threshold Line (0 vs 1 boundary) */}
      <line
        x1={bx + 10}
        y1={by + bh * 0.45}
        x2={bx + bw - 10}
        y2={by + bh * 0.45}
        stroke={C.dim}
        strokeWidth={2}
        strokeDasharray="8 8"
      />
      <text x={bx + bw + 16} y={by + bh * 0.45 + 6} fill={C.dim} fontFamily={MONO} fontSize={18}>
        THRESHOLD
      </text>

      {/* Charge Liquid Fill */}
      {liquidH > 2 && (
        <rect
          x={bx + 6}
          y={by + bh + 14 - liquidH}
          width={bw - 12}
          height={liquidH}
          rx={10}
          fill={col}
          fillOpacity={0.28}
        />
      )}

      {/* Bouncing Electrons inside the bucket */}
      {electrons.slice(0, Math.round(electronCount * Math.max(0.08, effectiveFill))).map((e, i) => {
        const ex = bx + 24 + ((e.rx + Math.sin(frame * e.sp + i) * 0.08) % 0.85) * (bw - 48);
        const ey = by + bh + 6 - e.ry * Math.max(28, liquidH - 12);
        return (
          <g key={i} style={{ filter: svgGlow(col, 4) }}>
            <circle cx={ex} cy={ey} r={9} fill={col} />
            <text x={ex} y={ey + 5} textAnchor="middle" fill="#040814" fontFamily={MONO} fontWeight={900} fontSize={14}>
              -
            </text>
          </g>
        );
      })}

      {/* Cosmic Particle Ray Striking Bucket */}
      {strikeProg > 0 && (
        <g style={{ filter: svgGlow(C.red, 10) }}>
          <line
            x1={bx - 120}
            y1={by - 110}
            x2={bx - 120 + (bw * 0.95) * strikeProg}
            y2={by - 110 + (bh * 1.15) * strikeProg}
            stroke={C.red}
            strokeWidth={7}
          />
          <circle
            cx={bx - 120 + bw * 0.95 * strikeProg}
            cy={by - 110 + bh * 1.15 * strikeProg}
            r={14}
            fill="#fff"
          />
        </g>
      )}

      {/* Bit State Badge on Right */}
      <g transform={`translate(${bx + bw + 48}, ${by + bh * 0.72})`}>
        <rect x={-44} y={-50} width={88} height={96} rx={16} fill="rgba(10,20,48,0.9)" stroke={col} strokeWidth={3} style={{ filter: svgGlow(col, 6) }} />
        <text x={0} y={18} textAnchor="middle" fill={col} fontFamily={MONO} fontWeight={900} fontSize={58}>
          {bitVal}
        </text>
      </g>

      {/* Bottom Label */}
      <text x={width / 2} y={by + bh + 66} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={32}>
        {label}
      </text>
      {sublabel && (
        <text x={width / 2} y={by + bh + 98} textAnchor="middle" fill={col} fontFamily={MONO} fontWeight={700} fontSize={22}>
          {sublabel}
        </text>
      )}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// 4. MARIO TICK TOCK CLOCK TOWER UPWARP ILLUSTRATION (SVG + Custom Motion)
// ---------------------------------------------------------------------------
export const MarioTowerUpwarpSVG: React.FC<{
  warpAt: number;
  width?: number;
  height?: number;
}> = ({ warpAt, width = 760, height = 680 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const isWarped = frame >= warpAt;
  const warpP = spring({
    frame: Math.max(0, frame - warpAt),
    fps,
    config: { damping: 13, stiffness: 150 },
  });

  // Mario Y position: starts at lower platform (y = 500), teleports straight through ceiling to upper platform (y = 175)
  const marioY = interpolate(warpP, [0, 1], [500, 175]);
  const gearRot = frame * 1.1;

  return (
    <svg width={width} height={height} viewBox="0 0 760 680" style={{ overflow: "visible" }}>
      {/* Rotating Clockwork Background Gears */}
      <g transform={`translate(170, 340) rotate(${gearRot})`} opacity={0.22} stroke={C.gold} strokeWidth={3} fill="none">
        <circle cx={0} cy={0} r={110} />
        <circle cx={0} cy={0} r={45} />
        {new Array(12).fill(0).map((_, i) => {
          const a = (i * 30 * Math.PI) / 180;
          return <line key={i} x1={Math.cos(a) * 45} y1={Math.sin(a) * 45} x2={Math.cos(a) * 128} y2={Math.sin(a) * 128} strokeWidth={12} />;
        })}
      </g>
      <g transform={`translate(560, 250) rotate(${-gearRot * 0.8})`} opacity={0.22} stroke={C.cyan} strokeWidth={3} fill="none">
        <circle cx={0} cy={0} r={85} />
        <circle cx={0} cy={0} r={32} />
        {new Array(10).fill(0).map((_, i) => {
          const a = (i * 36 * Math.PI) / 180;
          return <line key={i} x1={Math.cos(a) * 32} y1={Math.sin(a) * 32} x2={Math.cos(a) * 100} y2={Math.sin(a) * 100} strokeWidth={10} />;
        })}
      </g>

      {/* Upper Platform (Y = -895) */}
      <g style={{ filter: svgGlow(C.gold, 5) }}>
        <rect x={120} y={230} width={520} height={28} rx={6} fill="rgba(255,194,77,0.22)" stroke={C.gold} strokeWidth={3.5} />
        <text x={665} y={250} fill={C.gold} fontFamily={MONO} fontWeight={700} fontSize={24}>
          Y = -895 (C4)
        </text>
      </g>

      {/* Solid Ceiling Barrier */}
      <rect x={120} y={258} width={520} height={20} fill="rgba(255,77,94,0.25)" stroke={C.red} strokeWidth={2} strokeDasharray="10 6" />
      <text x={140} y={298} fill={C.red} fontFamily={MONO} fontSize={18} fontWeight={700}>
        SOLID CEILING COLLISION BARRIER
      </text>

      {/* Lower Platform (Y = -1658) */}
      <g style={{ filter: svgGlow(C.cyan, 5) }}>
        <rect x={120} y={555} width={520} height={28} rx={6} fill="rgba(62,224,255,0.18)" stroke={C.cyan} strokeWidth={3.5} />
        <text x={665} y={575} fill={C.cyan} fontFamily={MONO} fontWeight={700} fontSize={24}>
          Y = -1658 (C5)
        </text>
      </g>

      {/* Vertical Cyan Teleport Beam */}
      {isWarped && (
        <g style={{ filter: svgGlow(C.cyan, 12) }}>
          <rect
            x={354}
            y={180}
            width={52}
            height={375}
            fill={C.cyan}
            opacity={interpolate(frame, [warpAt, warpAt + 8, warpAt + 45], [0, 0.45, 0.12], { extrapolateRight: "clamp" })}
          />
          <line x1={380} y1={545} x2={380} y2={185} stroke="#fff" strokeWidth={5} strokeDasharray="14 10" />
        </g>
      )}

      {/* Stylized Retro 64-Bit Platformer Character Silhouette */}
      <g transform={`translate(380, ${marioY})`} style={{ filter: svgGlow(isWarped ? C.gold : C.red, 8) }}>
        {/* Cap */}
        <path d="M-24,-42 L20,-42 L32,-32 L-26,-32 Z" fill="#ff3b4e" stroke="#fff" strokeWidth={2} />
        {/* Head */}
        <circle cx={0} cy={-20} r={16} fill="#ffcc99" stroke="#fff" strokeWidth={2} />
        {/* Torso & Overalls */}
        <rect x={-18} y={-4} width={36} height={32} rx={8} fill="#ff3b4e" />
        <rect x={-14} y={4} width={28} height={26} rx={6} fill="#2979ff" stroke="#fff" strokeWidth={2} />
        <circle cx={-7} cy={10} r={3} fill={C.gold} />
        <circle cx={7} cy={10} r={3} fill={C.gold} />
        {/* Boots */}
        <rect x={-20} y={30} width={16} height={12} rx={4} fill="#8d4e2a" />
        <rect x={4} y={30} width={16} height={12} rx={4} fill="#8d4e2a" />
      </g>
    </svg>
  );
};

// ---------------------------------------------------------------------------
// 5. NON-INTRUSIVE MID-ROLL SUBSCRIBE TOAST (Carter Studios 40% Rule)
// ---------------------------------------------------------------------------
export const MidRollSubscribeToast: React.FC<{ at: number; dur?: number }> = ({ at, dur = 135 }) => {
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
        bottom: 64,
        right: 76,
        opacity: enter * exit,
        transform: `translateY(${(1 - enter) * 40}px)`,
        display: "flex",
        alignItems: "center",
        gap: 24,
        padding: "20px 34px",
        borderRadius: 24,
        background: "rgba(8, 15, 36, 0.92)",
        border: `2px solid ${C.cyan}`,
        boxShadow: `0 18px 50px rgba(0,0,0,0.75), ${glow(C.cyan, 12)}`,
        zIndex: 30,
      }}
    >
      <div>
        <div style={{ fontFamily: MONO, fontSize: 20, color: C.cyan, fontWeight: 700, letterSpacing: 3 }}>
          PHYSICS BUGS · EPISODE 02
        </div>
        <div style={{ fontFamily: INTER, fontSize: 28, color: C.white, fontWeight: 800, marginTop: 4 }}>
          Deep physics × everyday computing
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
