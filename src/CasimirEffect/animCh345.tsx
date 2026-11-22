import React from "react";
import { interpolate, random, useCurrentFrame } from "remotion";
import { C, INTER, MONO, svgGlow } from "../FiveHundredMileEmail/theme";

// ===========================================================================
// CH3 BEAT 1 — GUITAR-STRING STANDING MODES BUILDING ONE BY ONE + OPEN OUTER WAVES
// ===========================================================================
export const Ch3GuitarMirrorModesSim: React.FC<{
  oneAt: number;
  twoAt: number;
  threeAt: number;
  forbidAt: number;
  outsideAt: number;
}> = ({ oneAt, twoAt, threeAt, forbidAt, outsideAt }) => {
  const frame = useCurrentFrame();

  const p1 = interpolate(frame, [oneAt - 4, oneAt + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const p2 = interpolate(frame, [twoAt - 4, twoAt + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const p3 = interpolate(frame, [threeAt - 4, threeAt + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pForb = interpolate(frame, [forbidAt - 4, forbidAt + 14, outsideAt - 10, outsideAt + 8], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pOut = interpolate(frame, [outsideAt - 4, outsideAt + 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Gap narrows cleanly when zooming out to show open outer waves!
  const halfGap = interpolate(pOut, [0, 1], [320, 170]);
  const cx = 960;
  const lx = cx - halfGap;
  const rx = cx + halfGap;

  const makeStanding = (n: number, cy: number, amp: number, spd: number) => {
    const pts: string[] = [];
    const osc = Math.cos(frame * spd + n);
    for (let i = 0; i <= 56; i++) {
      const u = i / 56;
      const x = lx + u * (rx - lx);
      const y = cy + Math.sin(u * n * Math.PI) * amp * osc;
      pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return pts.join(" ");
  };

  const makeForbidden = (cy: number) => {
    const pts: string[] = [];
    for (let i = 0; i <= 44; i++) {
      const u = i / 44;
      const x = lx + u * (rx - lx);
      const y = cy + Math.sin(u * Math.PI * 0.62) * 52 * Math.cos(frame * 0.16);
      pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return pts.join(" ");
  };

  const makeOuter = (side: "L" | "R", cy: number, cycles: number, amp: number, spd: number) => {
    const pts: string[] = [];
    const span = side === "L" ? lx - 120 : 1800 - rx;
    for (let i = 0; i <= 56; i++) {
      const u = i / 56;
      const x = side === "L" ? 110 + u * span : 1810 - u * span;
      const y = cy + Math.sin(u * cycles * Math.PI * 2 - frame * spd) * amp;
      pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return pts.join(" ");
  };

  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute" }}>
      <defs>
        <linearGradient id="mPlate3" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="40%" stopColor="#f8fafc" />
          <stop offset="70%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
      </defs>

      {/* Open Unrestricted Waves Outside (Appear cleanly on "Outside the plates"!) */}
      {pOut > 0.02 && (
        <g opacity={pOut}>
          {[
            { y: 380, cyc: 4.5, amp: 22, spd: 0.22, col: C.cyan },
            { y: 495, cyc: 2.8, amp: 32, spd: 0.16, col: C.gold },
            { y: 615, cyc: 1.7, amp: 40, spd: 0.11, col: "#c084fc" },
            { y: 740, cyc: 1.0, amp: 46, spd: 0.08, col: C.red },
          ].map((w, i) => (
            <React.Fragment key={i}>
              <polyline points={makeOuter("L", w.y, w.cyc, w.amp, w.spd)} fill="none" stroke={w.col} strokeWidth={4} opacity={0.85} />
              <polyline points={makeOuter("R", w.y, w.cyc, w.amp, w.spd)} fill="none" stroke={w.col} strokeWidth={4} opacity={0.85} />
            </React.Fragment>
          ))}
          {/* Inward Pressure Arrows */}
          <g style={{ filter: svgGlow(C.red, 10) }}>
            <line x1={lx - 185} y1={560} x2={lx - 58} y2={560} stroke={C.red} strokeWidth={14} strokeLinecap="round" />
            <polygon points={`${lx - 32},560 ${lx - 70},536 ${lx - 70},584`} fill={C.red} />
            <line x1={rx + 185} y1={560} x2={rx + 58} y2={560} stroke={C.red} strokeWidth={14} strokeLinecap="round" />
            <polygon points={`${rx + 32},560 ${rx + 70},536 ${rx + 70},584`} fill={C.red} />
          </g>
        </g>
      )}

      {/* 1st Harmonic ("one half-wave") */}
      {p1 > 0 && (
        <g opacity={p1}>
          <polyline points={makeStanding(1, 415, 42, 0.16)} fill="none" stroke={C.cyan} strokeWidth={6} style={{ filter: svgGlow(C.cyan, 8) }} />
          <circle cx={lx} cy={415} r={9} fill={C.gold} />
          <circle cx={rx} cy={415} r={9} fill={C.gold} />
          {pOut < 0.3 && (
            <text x={cx} y={358} textAnchor="middle" fill={C.cyan} fontFamily={INTER} fontWeight={900} fontSize={28}>
              1 Half-Wave
            </text>
          )}
        </g>
      )}

      {/* 2nd Harmonic ("two half-waves") */}
      {p2 > 0 && (
        <g opacity={p2}>
          <polyline points={makeStanding(2, 560, 36, 0.22)} fill="none" stroke={C.green} strokeWidth={6} style={{ filter: svgGlow(C.green, 8) }} />
          <circle cx={lx} cy={560} r={9} fill={C.gold} />
          <circle cx={rx} cy={560} r={9} fill={C.gold} />
          {pOut < 0.3 && (
            <text x={cx} y={508} textAnchor="middle" fill={C.green} fontFamily={INTER} fontWeight={900} fontSize={28}>
              2 Half-Waves
            </text>
          )}
        </g>
      )}

      {/* 3rd Harmonic ("three half-waves") */}
      {p3 > 0 && (
        <g opacity={p3}>
          <polyline points={makeStanding(3, 705, 30, 0.28)} fill="none" stroke={C.gold} strokeWidth={6} style={{ filter: svgGlow(C.gold, 8) }} />
          <circle cx={lx} cy={705} r={9} fill={C.gold} />
          <circle cx={rx} cy={705} r={9} fill={C.gold} />
          {pOut < 0.3 && (
            <text x={cx} y={655} textAnchor="middle" fill={C.gold} fontFamily={INTER} fontWeight={900} fontSize={28}>
              3 Half-Waves
            </text>
          )}
        </g>
      )}

      {/* Forbidden Long Wave ("strictly forbidden inside") */}
      {pForb > 0.02 && (
        <g opacity={pForb}>
          <polyline points={makeForbidden(815)} fill="none" stroke={C.red} strokeWidth={6} strokeDasharray="14 10" style={{ filter: svgGlow(C.red, 8) }} />
          <text x={cx} y={885} textAnchor="middle" fill={C.red} fontFamily={INTER} fontWeight={900} fontSize={32}>
            Too Long to Fit Inside — Forbidden ✕
          </text>
        </g>
      )}

      {/* Gleaming Parallel Mirror Walls */}
      <rect x={lx - 34} y={320} width={34} height={510} rx={8} fill="url(#mPlate3)" stroke={C.gold} strokeWidth={3} style={{ filter: svgGlow(C.gold, 8) }} />
      <rect x={rx} y={320} width={34} height={510} rx={8} fill="url(#mPlate3)" stroke={C.gold} strokeWidth={3} style={{ filter: svgGlow(C.gold, 8) }} />

      {/* Clean Gap Label */}
      <text x={cx} y={295} textAnchor="middle" fill={C.cyan} fontFamily={INTER} fontWeight={900} fontSize={30}>
        {pOut > 0.5 ? "Fewer Waves Inside → Net Push Inward" : "Mirrors Pin Both Ends to Zero"}
      </text>
    </svg>
  );
};

// ===========================================================================
// CH3 BEAT 2 — SEAMLESS TWO SHIPS IN CHOPPY OCEAN SWELLS WAVE TANK
// ===========================================================================
export const Ch3TwoShipsOceanSim: React.FC<{ startAt: number }> = ({ startAt }) => {
  const frame = useCurrentFrame();
  const driftP = interpolate(frame, [startAt, startAt + 210], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const halfGap = 235 - driftP * 110;
  const cx = 960;
  const waterY = 590;
  const leftShipX = cx - halfGap - 150;
  const rightShipX = cx + halfGap;
  const rockL = Math.sin(frame * 0.1) * 4.5;
  const rockR = Math.cos(frame * 0.11) * 4.5;

  const buildOcean = (xStart: number, xEnd: number, amp: number, freq: number, dir: number) => {
    const linePts: string[] = [];
    const steps = 48;
    for (let i = 0; i <= steps; i++) {
      const u = i / steps;
      const x = xStart + u * (xEnd - xStart);
      const y = waterY + Math.sin(x * freq - frame * 0.15 * dir) * amp + Math.cos(x * freq * 1.7 + frame * 0.1) * (amp * 0.35);
      linePts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return { line: linePts.join(" "), poly: [...linePts, `${xEnd},875`, `${xStart},875`].join(" ") };
  };

  const lw = buildOcean(120, leftShipX + 35, 38, 0.022, 1);
  const rw = buildOcean(rightShipX + 115, 1800, 38, 0.022, -1);
  const mw = buildOcean(leftShipX + 125, rightShipX + 25, 7, 0.075, 1);

  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute" }}>
      <defs>
        <linearGradient id="ocFill3" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.58" />
          <stop offset="100%" stopColor="#082f49" stopOpacity="0.94" />
        </linearGradient>
        <linearGradient id="hull3" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="50%" stopColor="#334155" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>

      <rect x={110} y={295} width={1700} height={585} rx={26} fill="rgba(5,12,30,0.82)" stroke={C.cyan} strokeWidth={3} />
      <rect x={120} y={625} width={1680} height={250} fill="url(#ocFill3)" />

      <polygon points={lw.poly} fill="url(#ocFill3)" />
      <polyline points={lw.line} fill="none" stroke={C.cyan} strokeWidth={4.5} />
      <polygon points={rw.poly} fill="url(#ocFill3)" />
      <polyline points={rw.line} fill="none" stroke={C.cyan} strokeWidth={4.5} />
      <polygon points={mw.poly} fill="rgba(56,189,248,0.28)" />
      <polyline points={mw.line} fill="none" stroke="#7dd3fc" strokeWidth={3.5} />

      {/* Left & Right Ship Hulls */}
      <g transform={`translate(${leftShipX}, ${waterY - 12}) rotate(${rockL} 75 0)`}>
        <polygon points="10,-25 140,-25 124,62 26,62" fill="url(#hull3)" stroke={C.gold} strokeWidth={3.5} />
        <rect x={38} y={-88} width={74} height={63} rx={6} fill="#1e293b" stroke={C.cyan} strokeWidth={3} />
        <rect x={60} y={-124} width={22} height={36} fill={C.gold} />
      </g>
      <g transform={`translate(${rightShipX}, ${waterY - 12}) rotate(${rockR} 75 0)`}>
        <polygon points="10,-25 140,-25 124,62 26,62" fill="url(#hull3)" stroke={C.gold} strokeWidth={3.5} />
        <rect x={38} y={-88} width={74} height={63} rx={6} fill="#1e293b" stroke={C.cyan} strokeWidth={3} />
        <rect x={68} y={-124} width={22} height={36} fill={C.gold} />
      </g>

      {/* Inward Swell Push Arrows */}
      <g style={{ filter: svgGlow(C.gold, 8) }}>
        <line x1={leftShipX - 180} y1={515} x2={leftShipX - 36} y2={515} stroke={C.gold} strokeWidth={13} strokeLinecap="round" />
        <polygon points={`${leftShipX - 12},515 ${leftShipX - 48},493 ${leftShipX - 48},537`} fill={C.gold} />
        <line x1={rightShipX + 330} y1={515} x2={rightShipX + 186} y2={515} stroke={C.gold} strokeWidth={13} strokeLinecap="round" />
        <polygon points={`${rightShipX + 162},515 ${rightShipX + 198},493 ${rightShipX + 198},537`} fill={C.gold} />
      </g>

      <text x={320} y={372} textAnchor="middle" fill={C.gold} fontFamily={INTER} fontWeight={900} fontSize={30}>Big Outer Swells →</text>
      <text x={1600} y={372} textAnchor="middle" fill={C.gold} fontFamily={INTER} fontWeight={900} fontSize={30}>← Big Outer Swells</text>
      <text x={cx} y={372} textAnchor="middle" fill={C.cyan} fontFamily={INTER} fontWeight={900} fontSize={28}>Tiny Inner Ripples</text>
    </svg>
  );
};

// ===========================================================================
// CH3 BEAT 3 — CLEAN VISUAL GAP MULTIPLIER (1/2 -> 16×, 1/10 -> 10,000×)
// (Zero intimidating equations!)
// ===========================================================================
export const Ch3GapMultiplierSim: React.FC<{
  halfAt: number;
  tenthAt: number;
}> = ({ halfAt, tenthAt }) => {
  const frame = useCurrentFrame();
  const p1 = interpolate(frame, [halfAt, halfAt + 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const p2 = interpolate(frame, [tenthAt, tenthAt + 32], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const dNorm = 1 - p1 * 0.5 - p2 * 0.4; // 1.0 -> 0.5 -> 0.1
  const halfGap = 230 * dNorm + 28;
  const mult = Math.round(1 / Math.pow(dNorm, 4));
  const surgeH = (Math.log10(Math.max(1, mult)) / 4) * 430 + 36;
  const arrowW = 110 + (Math.log10(Math.max(1, mult)) / 4) * 195;

  const cx = 640;
  const cy = 565;

  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute" }}>
      <defs>
        <linearGradient id="mPlateMult" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="45%" stopColor="#f8fafc" />
          <stop offset="75%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
        <linearGradient id="surgeBar" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#ff4d5e" />
        </linearGradient>
      </defs>

      {/* Left Clean Shrinking Gap Plates */}
      <rect x={cx - halfGap - 38} y={cy - 210} width={38} height={420} rx={8} fill="url(#mPlateMult)" stroke={C.gold} strokeWidth={3} style={{ filter: svgGlow(C.gold, 8) }} />
      <rect x={cx + halfGap} y={cy - 210} width={38} height={420} rx={8} fill="url(#mPlateMult)" stroke={C.gold} strokeWidth={3} style={{ filter: svgGlow(C.gold, 8) }} />

      {/* Gap Indicator */}
      <line x1={cx - halfGap} y1={cy - 245} x2={cx + halfGap} y2={cy - 245} stroke={C.cyan} strokeWidth={4} />
      <text x={cx} y={cy - 268} textAnchor="middle" fill={C.cyan} fontFamily={INTER} fontWeight={900} fontSize={36}>
        {p2 > 0.5 ? "1 / 10 Gap" : p1 > 0.5 ? "Half the Gap" : "Starting Gap"}
      </text>

      {/* Exploding Inward Force Arrows */}
      <g style={{ filter: svgGlow(C.red, 12) }}>
        <line x1={cx - halfGap - 56 - arrowW} y1={cy} x2={cx - halfGap - 66} y2={cy} stroke={C.red} strokeWidth={14 + p2 * 10} strokeLinecap="round" />
        <polygon points={`${cx - halfGap - 44},${cy} ${cx - halfGap - 82},${cy - 26} ${cx - halfGap - 82},${cy + 26}`} fill={C.red} />
        <line x1={cx + halfGap + 56 + arrowW} y1={cy} x2={cx + halfGap + 66} y2={cy} stroke={C.red} strokeWidth={14 + p2 * 10} strokeLinecap="round" />
        <polygon points={`${cx + halfGap + 44},${cy} ${cx + halfGap + 82},${cy - 26} ${cx + halfGap + 82},${cy + 26}`} fill={C.red} />
      </g>

      {/* Right Clean Vertical Force Surge Column (Wide breathing room from 10,000x text!) */}
      <rect x={1125} y={325} width={104} height={495} rx={20} fill="rgba(255,255,255,0.06)" stroke={C.dim} strokeWidth={3} />
      <rect x={1135} y={810 - surgeH} width={84} height={surgeH} rx={14} fill="url(#surgeBar)" style={{ filter: svgGlow(p2 > 0.4 ? C.red : C.gold, 12) }} />

      <text x={1565} y={525} textAnchor="middle" fill={C.dim} fontFamily={MONO} fontWeight={900} fontSize={26}>
        FORCE STRENGTH
      </text>
      <text x={1565} y={625} textAnchor="middle" fill={p2 > 0.4 ? C.red : C.gold} fontFamily={INTER} fontWeight={900} fontSize={94} style={{ filter: svgGlow(p2 > 0.4 ? C.red : C.gold, 12) }}>
        {mult.toLocaleString()}×
      </text>
      <text x={1565} y={692} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={800} fontSize={31}>
        {p2 > 0.5 ? "10× closer → 10,000× stronger!" : p1 > 0.5 ? "2× closer → 16× stronger!" : "Scales as 1 / distance⁴"}
      </text>
    </svg>
  );
};

// ===========================================================================
// CH4 PAGE A — CLEAN INFINITY STACK PARADOX (Single Focus!)
// ===========================================================================
export const Ch4InfinityStackSim: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute" }}>
      {/* Endless Stacking Frequencies Ascending Upward */}
      {[0, 1, 2, 3, 4, 5, 6].map((k) => {
        const wy = 780 - k * 74;
        const pts: string[] = [];
        for (let i = 0; i <= 72; i++) {
          const u = i / 72;
          pts.push(`${(260 + u * 860).toFixed(1)},${(wy + Math.sin(u * (6 + k * 7) - frame * (0.14 + k * 0.05)) * (26 - k * 2)).toFixed(1)}`);
        }
        return (
          <polyline
            key={k}
            points={pts.join(" ")}
            fill="none"
            stroke={k > 4 ? C.red : k > 2 ? C.gold : C.cyan}
            strokeWidth={4.5}
            opacity={0.85}
          />
        );
      })}
      <text x={690} y={850} textAnchor="middle" fill={C.cyan} fontFamily={INTER} fontWeight={900} fontSize={34}>
        Higher &amp; Higher Frequencies Forever ↑
      </text>

      {/* Right Huge Clean ∞ − ∞ Question */}
      <text x={1485} y={545} textAnchor="middle" fill={C.red} fontFamily={INTER} fontWeight={900} fontSize={140} style={{ filter: svgGlow(C.red, 14) }}>
        ∞ − ∞
      </text>
      <text x={1485} y={635} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={42}>
        Sounds Like a Math Trick?!
      </text>
    </svg>
  );
};

// ===========================================================================
// CH4 PAGE B — IDEAL 1 ATMOSPHERE PRESSURE -> CRACKS ON "NOT PERFECT MIRRORS"
// ===========================================================================
export const Ch4OneAtmIdealSim: React.FC<{ breakAt: number }> = ({ breakAt }) => {
  const frame = useCurrentFrame();
  const brkP = interpolate(frame, [breakAt, breakAt + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute" }}>
      {/* Clean Ideal Mirror Plates at 10 nm */}
      <g transform={`translate(${-brkP * 35}, 0) rotate(${-brkP * 6} 790 560)`}>
        <rect x={790} y={360} width={38} height={400} rx={8} fill="#fbbf24" stroke="#fef08a" strokeWidth={3} style={{ filter: svgGlow(C.gold, 10) }} />
      </g>
      <g transform={`translate(${brkP * 35}, 0) rotate(${brkP * 6} 1092 560)`}>
        <rect x={1092} y={360} width={38} height={400} rx={8} fill="#fbbf24" stroke="#fef08a" strokeWidth={3} style={{ filter: svgGlow(C.gold, 10) }} />
      </g>

      {/* Giant 1 Atmosphere Pressure Arrows */}
      <g opacity={1 - brkP * 0.65} style={{ filter: svgGlow(C.gold, 10) }}>
        <line x1={440} y1={560} x2={745} y2={560} stroke={C.gold} strokeWidth={18} strokeLinecap="round" />
        <polygon points="775,560 730,530 730,590" fill={C.gold} />
        <line x1={1480} y1={560} x2={1175} y2={560} stroke={C.gold} strokeWidth={18} strokeLinecap="round" />
        <polygon points="1145,560 1190,530 1190,590" fill={C.gold} />
      </g>

      <text x={960} y={310} textAnchor="middle" fill={C.cyan} fontFamily={INTER} fontWeight={900} fontSize={38}>
        10 Nanometers Apart (Ideal Perfect Mirrors)
      </text>

      {brkP < 0.35 ? (
        <text x={960} y={860} textAnchor="middle" fill={C.gold} fontFamily={INTER} fontWeight={900} fontSize={54} style={{ filter: svgGlow(C.gold, 10) }}>
          Predicted Pressure: Over 1 Atmosphere
        </text>
      ) : (
        <g opacity={brkP}>
          <text x={960} y={860} textAnchor="middle" fill={C.red} fontFamily={INTER} fontWeight={900} fontSize={54} style={{ filter: svgGlow(C.red, 10) }}>
            Real Metal Plates Are NOT Perfect Mirrors!
          </text>
        </g>
      )}
    </svg>
  );
};

// ===========================================================================
// CH4 PAGE C — 100% FULL-SCREEN REAL GOLD TRANSPARENCY (NO SIDE GRAPH!)
// ===========================================================================
export const Ch4GoldTransparencySim: React.FC<{
  uvAt: number;
  transAt: number;
}> = ({ uvAt, transAt }) => {
  const frame = useCurrentFrame();
  const uvP = interpolate(frame, [uvAt, uvAt + 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const transP = interpolate(frame, [transAt, transAt + 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Visible/IR wave bounces off gold mirror at x = 920
  const lowIn: string[] = [];
  const lowRef: string[] = [];
  for (let i = 0; i <= 60; i++) {
    const u = i / 60;
    const x = 160 + u * 755;
    lowIn.push(`${x.toFixed(1)},${(425 + Math.sin(u * 14 - frame * 0.16) * 34).toFixed(1)}`);
    lowRef.push(`${x.toFixed(1)},${(425 + Math.sin(u * 14 + frame * 0.16) * 26).toFixed(1)}`);
  }

  // Deep UV / X-ray passes straight through translucent gold slab!
  const highEnd = 915 + transP * 845;
  const highPts: string[] = [];
  for (let i = 0; i <= 105; i++) {
    const u = i / 105;
    const x = 160 + u * (highEnd - 160);
    highPts.push(`${x.toFixed(1)},${(725 + Math.sin(x * 0.085 - frame * 0.34) * 30).toFixed(1)}`);
  }

  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute" }}>
      <defs>
        <linearGradient id="fullGold" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#92400e" />
          <stop offset="45%" stopColor="#fbbf24" />
          <stop offset="75%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#78350f" />
        </linearGradient>
      </defs>

      {/* Upper Track: Visible & IR Light Reflecting Off Sloshing Gold Electrons */}
      <text x={165} y={325} fill={C.cyan} fontFamily={INTER} fontWeight={900} fontSize={32}>
        Visible &amp; Infrared Waves — Reflected ✓
      </text>
      <polyline points={lowIn.join(" ")} fill="none" stroke={C.cyan} strokeWidth={6} style={{ filter: svgGlow(C.cyan, 8) }} />
      <polyline points={lowRef.join(" ")} fill="none" stroke={C.gold} strokeWidth={3.5} strokeDasharray="10 8" opacity={0.75} />

      {/* Giant 3D Gold Slab (Upper Half Solid Reflective, Lower Half Turns Crystal-Transparent!) */}
      <rect x={920} y={345} width={88} height={225} rx={12} fill="url(#fullGold)" stroke={C.gold} strokeWidth={3.5} style={{ filter: svgGlow(C.gold, 10) }} />
      {[388, 440, 492, 540].map((ey, idx) => (
        <circle key={idx} cx={964} cy={ey + Math.sin(frame * 0.16 + idx) * 16} r={10} fill={C.cyan} style={{ filter: svgGlow(C.cyan, 6) }} />
      ))}
      <text x={1055} y={445} fill={C.green} fontFamily={INTER} fontWeight={900} fontSize={34}>
        Electrons Keep Up
      </text>
      <text x={1055} y={488} fill={C.cyan} fontFamily={INTER} fontWeight={800} fontSize={28}>
        Mirrors Reflect &amp; Feel Pressure
      </text>

      {/* Lower Track: High-Frequency UV & X-Ray Appears Right at uvAt! */}
      {uvP > 0.02 && (
        <g opacity={uvP}>
          <text x={165} y={635} fill="#c084fc" fontFamily={INTER} fontWeight={900} fontSize={32}>
            High-Frequency UV &amp; X-Rays (Shorter Than 136 nm)
          </text>
          <polyline points={highPts.join(" ")} fill="none" stroke="#c084fc" strokeWidth={6} style={{ filter: svgGlow("#c084fc", 10) }} />

          <rect
            x={920}
            y={645}
            width={88}
            height={190}
            rx={12}
            fill="url(#fullGold)"
            fillOpacity={1 - transP * 0.85}
            stroke={C.gold}
            strokeWidth={3.5}
            strokeDasharray={transP > 0.25 ? "10 8" : undefined}
          />
          {[688, 740, 792].map((ey, idx) => (
            <circle key={idx} cx={964} cy={ey + Math.sin(frame * 0.34 + idx) * 2} r={8} fill={C.dim} opacity={0.6} />
          ))}

          <text x={1055} y={845} fill={C.gold} fontFamily={INTER} fontWeight={900} fontSize={34}>
            {transP > 0.3 ? "Gold Turns Transparent → Zero Net Force!" : "Electrons Can't Keep Up!"}
          </text>
        </g>
      )}
    </svg>
  );
};

// ===========================================================================
// CH4 PAGE D — FRESH FULL-SCREEN PAGE FOR IDEAL vs. REAL GOLD CHART!
// ===========================================================================
export const Ch4IdealVsRealChartSim: React.FC<{ startAt: number }> = ({ startAt }) => {
  const frame = useCurrentFrame();
  const drawP = interpolate(frame, [startAt, startAt + 45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const idealPts: string[] = [];
  const realPts: string[] = [];
  const count = Math.max(2, Math.floor(drawP * 60));
  for (let i = 0; i <= count; i++) {
    const u = i / 60; // 0 (10 nm) -> 1 (500 nm)
    const x = 320 + u * 1280;
    const yIdeal = 310 + Math.pow(u, 0.55) * 470;
    const penalty = Math.exp(-u * 5.2) * 215;
    idealPts.push(`${x.toFixed(1)},${yIdeal.toFixed(1)}`);
    realPts.push(`${x.toFixed(1)},${(yIdeal + penalty).toFixed(1)}`);
  }

  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute" }}>
      {/* Clean Large Chart Axes */}
      <line x1={320} y1={810} x2={1620} y2={810} stroke={C.dim} strokeWidth={4} />
      <line x1={320} y1={285} x2={320} y2={810} stroke={C.dim} strokeWidth={4} />

      <text x={970} y={872} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={32}>
        Distance Between Plates (10 nm ← → 500 nm)
      </text>
      <text x={245} y={555} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={30} transform="rotate(-90 245 555)">
        Force Strength
      </text>

      {/* Curves */}
      <polyline points={idealPts.join(" ")} fill="none" stroke={C.red} strokeWidth={6} strokeDasharray="16 12" />
      <polyline points={realPts.join(" ")} fill="none" stroke={C.cyan} strokeWidth={8} style={{ filter: svgGlow(C.cyan, 10) }} />

      {/* Crystal-Clear Non-Overlapping Legend Callouts */}
      <text x={820} y={385} fill={C.red} fontFamily={INTER} fontWeight={900} fontSize={36}>
        Ideal Textbook Mirror
      </text>
      <text x={450} y={715} fill={C.cyan} fontFamily={INTER} fontWeight={900} fontSize={38}>
        Real Gold Mirror (Weaker at 10 nm)
      </text>
    </svg>
  );
};

// ===========================================================================
// CH5 PAGE A — 100% FULL-SCREEN 0 K -> 300 K ROOM TEMPERATURE WARMUP
// ===========================================================================
export const Ch5ThermalWarmupSim: React.FC<{ warmAt: number }> = ({ warmAt }) => {
  const frame = useCurrentFrame();
  const warmP = interpolate(frame, [warmAt, warmAt + 42], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const photons = React.useMemo(
    () =>
      new Array(38).fill(0).map((_, i) => ({
        x0: 240 + random(`wpx${i}`) * 1440,
        y0: 320 + random(`wpy${i}`) * 480,
        vx: (random(`wpvx${i}`) - 0.5) * 8,
        vy: (random(`wpvy${i}`) - 0.5) * 8,
        r: 5 + random(`wpr${i}`) * 5,
      })),
    [],
  );

  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute" }}>
      {/* Chamber Shifting Smoothly From Cryo Blue -> Warm Room-Temp Glow */}
      <rect
        x={220}
        y={285}
        width={1480}
        height={555}
        rx={30}
        fill={warmP > 0.3 ? `rgba(255,140,40,${0.06 + warmP * 0.1})` : "rgba(14,165,233,0.08)"}
        stroke={warmP > 0.3 ? C.gold : C.cyan}
        strokeWidth={4}
      />

      {/* Two Plates Inside Warm Lab */}
      <rect x={765} y={385} width={38} height={355} rx={8} fill="#cbd5e1" stroke={C.gold} strokeWidth={3} />
      <rect x={1117} y={385} width={38} height={355} rx={8} fill="#cbd5e1" stroke={C.gold} strokeWidth={3} />

      {/* Buzzing Warm Thermal Photons */}
      {warmP > 0.05 &&
        photons.map((p, idx) => {
          const px = 250 + (((p.x0 - 250 + frame * p.vx) % 1420) + 1420) % 1420;
          const py = 315 + (((p.y0 - 315 + frame * p.vy) % 495) + 495) % 495;
          return <circle key={idx} cx={px} cy={py} r={p.r} fill={idx % 2 === 0 ? C.gold : C.red} opacity={warmP * 0.88} style={{ filter: svgGlow(C.gold, 6) }} />;
        })}

      <text x={960} y={918} textAnchor="middle" fill={warmP > 0.4 ? C.gold : C.cyan} fontFamily={INTER} fontWeight={900} fontSize={42}>
        {warmP > 0.4 ? `Room Temperature: ${Math.round(warmP * 300)} K — Warm Thermal Photons Everywhere` : "Absolute Zero: 0 Kelvin"}
      </text>
    </svg>
  );
};

// ===========================================================================
// CH5 PAGE B — FRESH FULL-SCREEN PAGE: CLOSE (QUANTUM) -> FAR (THERMAL)
// ===========================================================================
export const Ch5ThermalShiftSim: React.FC<{ pushAt: number }> = ({ pushAt }) => {
  const frame = useCurrentFrame();
  const pushP = interpolate(frame, [pushAt, pushAt + 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const halfGap = 115 + pushP * 340;
  const cx = 960;

  const swarm = React.useMemo(
    () =>
      new Array(24).fill(0).map((_, i) => ({
        u: random(`tsu${i}`),
        v: random(`tsv${i}`),
        vx: (random(`tsvx${i}`) - 0.5) * 0.015,
        vy: (random(`tsvy${i}`) - 0.5) * 0.018,
        r: 5 + random(`tsr${i}`) * 5,
      })),
    [],
  );

  // Inner quantum standing ripple visible when plates are close (< 1 um)
  const qWavePts = new Array(32)
    .fill(0)
    .map((_, i) => {
      const u = i / 31;
      const x = cx - halfGap + u * (halfGap * 2);
      const y = 565 + Math.sin(u * Math.PI * 2) * 34 * Math.cos(frame * 0.22);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute" }}>
      <defs>
        <radialGradient id="shiftAuraCyan" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.24" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="shiftAuraGold" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.24" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Soft Volumetric Radial Aura (Zero hard oval edges!) */}
      <ellipse cx={cx} cy={565} rx={720} ry={300} fill="url(#shiftAuraCyan)" opacity={1 - pushP} />
      <ellipse cx={cx} cy={565} rx={720} ry={300} fill="url(#shiftAuraGold)" opacity={pushP} />

      {/* Quantum Cyan Standing Ripple (Visible when Close!) */}
      {pushP < 0.85 && (
        <polyline points={qWavePts} fill="none" stroke={C.cyan} strokeWidth={5.5} opacity={1 - pushP} style={{ filter: svgGlow(C.cyan, 8) }} />
      )}

      {/* Swarming Warm Amber Thermal Photons Inside Wide Gap (Visible as Plates Move Apart!) */}
      {pushP > 0.12 &&
        swarm.map((p, idx) => {
          const nu = (((p.u + frame * p.vx) % 1) + 1) % 1;
          const nv = (((p.v + frame * p.vy) % 1) + 1) % 1;
          const px = cx - halfGap + 24 + nu * Math.max(40, halfGap * 2 - 48);
          const py = 395 + nv * 340;
          return <circle key={idx} cx={px} cy={py} r={p.r} fill={idx % 2 === 0 ? C.gold : C.red} opacity={pushP * 0.85} style={{ filter: svgGlow(C.gold, 6) }} />;
        })}

      {/* Two Plates Sliding Smoothly Apart */}
      <rect x={cx - halfGap - 38} y={375} width={38} height={380} rx={8} fill="#cbd5e1" stroke={pushP > 0.5 ? C.gold : C.cyan} strokeWidth={4} />
      <rect x={cx + halfGap} y={375} width={38} height={380} rx={8} fill="#cbd5e1" stroke={pushP > 0.5 ? C.gold : C.cyan} strokeWidth={4} />

      {/* Gap Ruler */}
      <line x1={cx - halfGap} y1={330} x2={cx + halfGap} y2={330} stroke={pushP > 0.5 ? C.gold : C.cyan} strokeWidth={4} />
      <text x={cx} y={306} textAnchor="middle" fill={pushP > 0.5 ? C.gold : C.cyan} fontFamily={INTER} fontWeight={900} fontSize={36}>
        {pushP > 0.5 ? "Several Micrometers Apart" : "Under 1 Micrometer Apart"}
      </text>

      {/* Clean Simple Regime Callout Below */}
      <rect
        x={420}
        y={825}
        width={1080}
        height={102}
        rx={24}
        fill="rgba(8,15,36,0.92)"
        stroke={pushP > 0.5 ? C.gold : C.cyan}
        strokeWidth={3.5}
      />
      <text x={960} y={888} textAnchor="middle" fill={pushP > 0.5 ? C.gold : C.cyan} fontFamily={INTER} fontWeight={900} fontSize={40}>
        {pushP > 0.5 ? "Warm Thermal Photons Take Over  (1 / d³)" : "Quantum Vacuum Dominates  (1 / d⁴)"}
      </text>
    </svg>
  );
};

// ===========================================================================
// CH5 PAGE C — SEQUENTIAL: MICROSCOPIC TILT CRASH -> ZOOM INTO ROUGHNESS
// ===========================================================================
export const Ch5TiltAndRoughnessSim: React.FC<{
  tiltAt: number;
  roughAt: number;
}> = ({ tiltAt, roughAt }) => {
  const frame = useCurrentFrame();
  const tiltP = interpolate(frame, [tiltAt - 4, tiltAt + 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const roughP = interpolate(frame, [roughAt - 4, roughAt + 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const angle = tiltP * 8.5;

  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute" }}>
      {/* Stage 1: Flat Plates Tilt & Crash Together */}
      {roughP < 0.98 && (
        <g opacity={1 - roughP}>
          <rect x={830} y={325} width={44} height={470} rx={8} fill="#94a3b8" stroke={C.cyan} strokeWidth={3.5} />
          <g transform={`translate(1030, 560) rotate(${-angle})`}>
            <rect x={-22} y={-235} width={44} height={470} rx={8} fill="#94a3b8" stroke={tiltP > 0.4 ? C.red : C.cyan} strokeWidth={3.5} />
          </g>
          {tiltP > 0.5 && (
            <circle cx={932} cy={355} r={24 + Math.sin(frame * 0.45) * 8} fill="none" stroke={C.red} strokeWidth={6} style={{ filter: svgGlow(C.red, 10) }} />
          )}
          <text x={960} y={880} textAnchor="middle" fill={C.red} fontFamily={INTER} fontWeight={900} fontSize={40}>
            Even a Microscopic Tilt Ruins the Gap ✕
          </text>
        </g>
      )}

      {/* Stage 2: Zoom Into Nanoscale Rough Surface & Stray Static Sparks */}
      {roughP > 0.02 && (
        <g opacity={roughP}>
          <polyline
            points="220,440 360,375 510,468 670,360 840,455 1010,370 1180,465 1350,385 1520,458 1700,380"
            fill="none"
            stroke={C.gold}
            strokeWidth={9}
          />
          <polyline
            points="220,680 390,745 550,655 720,750 890,650 1070,740 1240,660 1420,745 1570,662 1700,720"
            fill="none"
            stroke={C.cyan}
            strokeWidth={9}
          />
          {[480, 960, 1420].map((px, i) => (
            <g key={i}>
              <circle cx={px} cy={395} r={26} fill="rgba(255,77,94,0.28)" stroke={C.red} strokeWidth={3} />
              <text x={px} y={406} textAnchor="middle" fill={C.red} fontFamily={MONO} fontWeight={900} fontSize={32}>+</text>
              <circle cx={px + 65} cy={715} r={26} fill="rgba(62,224,255,0.28)" stroke={C.cyan} strokeWidth={3} />
              <text x={px + 65} y={726} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={32}>−</text>
            </g>
          ))}
          <text x={960} y={880} textAnchor="middle" fill={C.gold} fontFamily={INTER} fontWeight={900} fontSize={40}>
            Bumpy Surfaces &amp; Stray Static Charges Drown Out the Signal
          </text>
        </g>
      )}
    </svg>
  );
};

// ===========================================================================
// CH5 PAGE D — 100% FULL-SCREEN 1997 LAMOREAUX SPHERE-PLATE TORSION PENDULUM
// ===========================================================================
export const Ch5LamoreauxPendulumSim: React.FC<{
  fivePctAt: number;
  afmAt: number;
}> = ({ fivePctAt, afmAt }) => {
  const frame = useCurrentFrame();
  const fiveP = interpolate(frame, [fivePctAt, fivePctAt + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const afmP = interpolate(frame, [afmAt, afmAt + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const twist = Math.sin(frame * 0.08) * 3.5 + fiveP * 3.5;

  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute" }}>
      <defs>
        <radialGradient id="lamGold" cx="35%" cy="35%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="55%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#78350f" />
        </radialGradient>
      </defs>

      {/* Hair-Thin Tungsten Torsion Wire */}
      <line x1={760} y1={285} x2={760} y2={585} stroke={C.cyan} strokeWidth={4} style={{ filter: svgGlow(C.cyan, 6) }} />
      <rect x={720} y={272} width={80} height={22} rx={6} fill="#64748b" />

      {/* Suspended Torsion Arm + Curved Gold Lens */}
      <g transform={`translate(760, 585) rotate(${twist * 0.4})`}>
        <rect x={-350} y={-12} width={700} height={24} rx={10} fill="#475569" stroke={C.cyan} strokeWidth={3} />
        <rect x={-360} y={-44} width={54} height={88} rx={10} fill="#334155" stroke="#94a3b8" strokeWidth={3} />
        <circle cx={345} cy={0} r={104} fill="url(#lamGold)" stroke={C.gold} strokeWidth={4.5} style={{ filter: svgGlow(C.gold, 12) }} />
        <text x={345} y={10} textAnchor="middle" fill="#040814" fontFamily={INTER} fontWeight={900} fontSize={28}>
          Gold Lens
        </text>
      </g>

      {/* Fixed Flat Gold Plate */}
      <rect x={1255} y={405} width={42} height={360} rx={8} fill="url(#lamGold)" stroke={C.gold} strokeWidth={3.5} />
      <text x={1410} y={595} textAnchor="middle" fill={C.gold} fontFamily={INTER} fontWeight={900} fontSize={32}>
        Flat Plate
      </text>

      {/* Glowing Gap */}
      <line x1={1214} y1={585} x2={1252} y2={585} stroke={C.green} strokeWidth={8} style={{ filter: svgGlow(C.green, 10) }} />

      {/* Clean Dynamic Result Pill Appearing Only When Spoken! */}
      {fiveP > 0.05 && (
        <g opacity={fiveP}>
          <rect x={370} y={840} width={1180} height={88} rx={22} fill="rgba(61,255,155,0.14)" stroke={C.green} strokeWidth={3} style={{ filter: svgGlow(C.green, 8) }} />
          <text x={960} y={896} textAnchor="middle" fill={C.green} fontFamily={INTER} fontWeight={900} fontSize={35}>
            {afmP > 0.3 ? "1998 Atomic Force Microscope: Within 1% Accuracy ✓" : "1997 Torsion Balance: Matched Theory Within 5% ✓"}
          </text>
        </g>
      )}
    </svg>
  );
};
