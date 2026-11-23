import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, INTER, MONO, svgGlow } from "../FiveHundredMileEmail/theme";

// ===========================================================================
// CH 2 — PAGE 2A: JOSEPHSON JUNCTION CROSS-STRIP ANATOMY (Nb–NbOx–PbIn)
// ===========================================================================
export const JunctionAnatomyAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const enterP = spring({ frame, fps, config: { damping: 16, stiffness: 90 } });
  // Gently explodes vertical layers apart slightly then settles so viewers clearly see the 3-layer sandwich
  const explode = Math.sin(Math.min(Math.PI, t * 0.9)) * 28;
  const glowPulse = 0.7 + 0.3 * Math.sin(t * 5);

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      <defs>
        <linearGradient id="nbStrip" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2673b8" />
          <stop offset="50%" stopColor="#3ee0ff" />
          <stop offset="100%" stopColor="#164b7a" />
        </linearGradient>
        <linearGradient id="pbinStrip" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#b87e1b" />
          <stop offset="50%" stopColor="#ffc24d" />
          <stop offset="100%" stopColor="#7a4c0e" />
        </linearGradient>
      </defs>

      {/* Silicon wafer base platform */}
      <g transform={`translate(620, 410) scale(${0.8 + 0.2 * enterP})`}>
        <polygon points="0,-160 390,0 0,160 -390,0" fill="rgba(16, 28, 56, 0.92)" stroke="rgba(127,147,196,0.4)" strokeWidth={3} />
        <polygon points="-390,0 0,160 0,188 -390,28" fill="#0b152c" stroke="rgba(127,147,196,0.3)" strokeWidth={2} />
        <polygon points="390,0 0,160 0,188 390,28" fill="#070e1f" stroke="rgba(127,147,196,0.3)" strokeWidth={2} />

        {/* Bottom Superconducting Ribbon (Niobium) */}
        <g transform={`translate(0, ${explode * 0.4})`}>
          <polygon
            points="-265,-85 -195,-114 265,76 195,105"
            fill="url(#nbStrip)"
            stroke={C.white}
            strokeWidth={2}
            style={{ filter: svgGlow(C.cyan, 6) }}
          />
        </g>

        {/* Razor-thin Oxide Insulator Sandwich in the center */}
        <g transform={`translate(0, ${-14 - explode * 0.2})`} style={{ filter: svgGlow(C.red, 10) }}>
          <polygon
            points="0,-42 74,-12 0,18 -74,-12"
            fill="rgba(255, 77, 94, 0.55)"
            stroke={C.red}
            strokeWidth={3.5}
            opacity={glowPulse}
          />
        </g>

        {/* Top Superconducting Ribbon (Lead-Indium) crossing at 90 deg */}
        <g transform={`translate(0, ${-28 - explode})`}>
          <polygon
            points="-265,76 -195,105 265,-85 195,-114"
            fill="url(#pbinStrip)"
            stroke={C.white}
            strokeWidth={2}
            style={{ filter: svgGlow(C.gold, 6) }}
          />
        </g>
      </g>

      {/* Clean visual callouts on right */}
      <g transform="translate(1165, 195)" opacity={enterP}>
        <line x1={-390} y1={130} x2={-110} y2={10} stroke={C.gold} strokeWidth={2.5} strokeDasharray="6 6" />
        <rect x={-110} y={-28} width={375} height={74} rx={16} fill="rgba(8,16,38,0.9)" stroke={C.gold} strokeWidth={2.5} />
        <text x={78} y={18} textAnchor="middle" fill={C.gold} fontFamily={INTER} fontWeight={800} fontSize={26}>
          Top Superconductor
        </text>
      </g>

      <g transform="translate(1165, 340)" opacity={enterP}>
        <line x1={-470} y1={52} x2={-110} y2={10} stroke={C.red} strokeWidth={2.5} strokeDasharray="6 6" />
        <rect x={-110} y={-28} width={375} height={74} rx={16} fill="rgba(34,10,16,0.92)" stroke={C.red} strokeWidth={2.5} />
        <text x={78} y={18} textAnchor="middle" fill={C.red} fontFamily={INTER} fontWeight={800} fontSize={26}>
          Oxide Barrier (Atoms Thick)
        </text>
      </g>

      <g transform="translate(1165, 485)" opacity={enterP}>
        <line x1={-340} y1={-15} x2={-110} y2={10} stroke={C.cyan} strokeWidth={2.5} strokeDasharray="6 6" />
        <rect x={-110} y={-28} width={375} height={74} rx={16} fill="rgba(8,16,38,0.9)" stroke={C.cyan} strokeWidth={2.5} />
        <text x={78} y={18} textAnchor="middle" fill={C.cyan} fontFamily={INTER} fontWeight={800} fontSize={26}>
          Bottom Superconductor
        </text>
      </g>

      {/* Human Hair scale comparison pill bottom left */}
      <g transform="translate(320, 625)" opacity={enterP}>
        <circle cx={-120} cy={0} r={42} fill="rgba(127,147,196,0.2)" stroke={C.dim} strokeWidth={3} strokeDasharray="6 6" />
        <rect x={-126} y={-6} width={12} height={12} fill={C.gold} style={{ filter: svgGlow(C.gold, 6) }} />
        <text x={-55} y={-6} fill={C.white} fontFamily={INTER} fontWeight={800} fontSize={24}>
          Junction: 10 × 10 μm
        </text>
        <text x={-55} y={24} fill={C.gold} fontFamily={MONO} fontWeight={700} fontSize={20}>
          1/10th the width of a human hair
        </text>
      </g>
    </svg>
  );
};

// ===========================================================================
// CH 2 — PAGE 2A2: ONE SHARED PROPERTY — PHASE DIFFERENCE ACROSS THE GAP
// (Fixes 2:58 vs 3:10 desync so Washboard appears EXACTLY when spoken!)
// ===========================================================================
export const SharedPhaseAcrossGapAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // Left superconducting wave (phase 1) & Right superconducting wave (phase 2 shifted by deltaPhi!)
  const deltaPhi = 1.15 + Math.sin(t * 1.8) * 0.45;
  const makeSideWave = (xStart: number, xEnd: number, phaseOffset: number) => {
    const pts: string[] = [];
    for (let x = xStart; x <= xEnd; x += 8) {
      const y = 365 + Math.sin(x * 0.025 - t * 4.5 + phaseOffset) * 84;
      pts.push(`${x === xStart ? "M" : "L"}${x},${y.toFixed(1)}`);
    }
    return pts.join(" ");
  };

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      {/* Left Superconductor */}
      <rect x={140} y={185} width={580} height={360} rx={26} fill="rgba(12, 34, 72, 0.86)" stroke={C.cyan} strokeWidth={3} />
      <path d={makeSideWave(170, 690, 0)} fill="none" stroke={C.cyan} strokeWidth={6.5} style={{ filter: svgGlow(C.cyan, 8) }} />
      <text x={430} y={236} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={22}>
        SUPERCONDUCTOR 1 · WAVE A
      </text>

      {/* Thin Oxide Barrier Center */}
      <rect x={752} y={165} width={96} height={400} rx={14} fill="rgba(255, 77, 94, 0.2)" stroke={C.red} strokeWidth={3} strokeDasharray="8 6" />
      <text x={800} y={142} textAnchor="middle" fill={C.red} fontFamily={MONO} fontWeight={800} fontSize={19}>
        OXIDE GAP
      </text>

      {/* Right Superconductor */}
      <rect x={880} y={185} width={580} height={360} rx={26} fill="rgba(28, 22, 12, 0.86)" stroke={C.gold} strokeWidth={3} />
      <path d={makeSideWave(910, 1430, deltaPhi)} fill="none" stroke={C.gold} strokeWidth={6.5} style={{ filter: svgGlow(C.gold, 8) }} />
      <text x={1170} y={236} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={22}>
        SUPERCONDUCTOR 2 · WAVE B
      </text>

      {/* Central glowing Phase-Difference Dial spanning the gap */}
      <g transform="translate(800, 365)" style={{ filter: svgGlow(C.gold, 10) }}>
        <circle r={68} fill="#060c1e" stroke={C.white} strokeWidth={3.5} />
        {/* Reference hand A */}
        <line x1={0} y1={0} x2={0} y2={-46} stroke={C.cyan} strokeWidth={5} strokeLinecap="round" />
        {/* Shifted hand B */}
        <line
          x1={0}
          y1={0}
          x2={Math.sin(deltaPhi) * 46}
          y2={-Math.cos(deltaPhi) * 46}
          stroke={C.gold}
          strokeWidth={5}
          strokeLinecap="round"
        />
        <circle r={8} fill={C.white} />
      </g>

      <text x={800} y={635} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={26} letterSpacing={2.2}>
        ONE COLLECTIVE VARIABLE: PHASE DIFFERENCE ACROSS THE GAP
      </text>
    </svg>
  );
};

// ===========================================================================
// CH 2 — PAGE 2B: FLAT WASHBOARD LANDSCAPE (NO CURRENT YET)
// ===========================================================================
export const FlatWashboardAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // Flat cosine potential U(phi) = -cos(phi)
  const buildCurve = () => {
    const pts: string[] = [];
    for (let x = 140; x <= 1460; x += 8) {
      const phi = ((x - 800) / 145) * Math.PI;
      const y = 390 - Math.cos(phi) * 115;
      pts.push(`${x === 140 ? "M" : "L"}${x},${y.toFixed(1)}`);
    }
    return pts.join(" ");
  };

  // Marble gently rocking at bottom of center valley (x=655 -> cos(phi) = -1 -> y=505)
  const rock = Math.sin(t * 2.8) * 18;
  const mx = 655 + rock;
  const mPhi = ((mx - 800) / 145) * Math.PI;
  const my = 390 - Math.cos(mPhi) * 115 - 26;

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      <defs>
        <radialGradient id="phaseMarble" cx="35%" cy="30%" r="68%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="45%" stopColor={C.gold} />
          <stop offset="100%" stopColor="#c46e00" />
        </radialGradient>
        <linearGradient id="washFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.cyan} stopOpacity="0.28" />
          <stop offset="100%" stopColor="#040814" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Filled soft glow under washboard */}
      <path d={`${buildCurve()} L1460,640 L140,640 Z`} fill="url(#washFill)" />

      {/* Main washboard track */}
      <path
        d={buildCurve()}
        fill="none"
        stroke={C.cyan}
        strokeWidth={7}
        strokeLinecap="round"
        style={{ filter: svgGlow(C.cyan, 8) }}
      />

      {/* Glowing Phase Marble resting peacefully in the valley */}
      <g transform={`translate(${mx}, ${my})`} style={{ filter: svgGlow(C.gold, 10) }}>
        <circle r={26} fill="url(#phaseMarble)" stroke={C.white} strokeWidth={2.5} />
        <circle r={42} fill="none" stroke={C.gold} strokeWidth={2} opacity={0.4 + 0.25 * Math.sin(t * 4)} />
      </g>

      {/* Clean indicator label pointing to marble */}
      <g transform={`translate(${mx}, ${my - 95})`}>
        <line x1={0} y1={28} x2={0} y2={62} stroke={C.gold} strokeWidth={2.5} strokeDasharray="5 5" />
        <rect x={-165} y={-22} width={330} height={50} rx={14} fill="rgba(8,14,32,0.92)" stroke={C.gold} strokeWidth={2.5} />
        <text x={0} y={11} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={22} letterSpacing={1.5}>
          CIRCUIT PHASE STATE
        </text>
      </g>

      <text x={800} y={645} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={800} fontSize={25} letterSpacing={2.5}>
        CURRENT = 0 μA · FLAT WASHBOARD · MARBLE AT REST
      </text>
    </svg>
  );
};

// ===========================================================================
// CH 2 — PAGE 2C: DIALING CURRENT UP TO 9.5 μA TILTS THE WASHBOARD!
// ===========================================================================
export const TiltingWashboardAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // Smoothly ramp bias current from 0 -> 9.2 μA across ~14s matching narrator's washboard tilt description!
  const ramp = interpolate(frame, [10, 420], [0, 0.86], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const currentUa = (ramp / 0.86) * 9.2 + Math.sin(t * 2.4) * 0.04;

  // Tilted washboard U(phi) = -cos(phi) - ramp * phi
  const evalY = (x: number) => {
    const phi = ((x - 420) / 140) * Math.PI;
    const tilt = ramp * 0.82 * ((x - 420) / 140) * 105;
    return 250 - Math.cos(phi) * 92 + tilt;
  };

  const pts: string[] = [];
  for (let x = 140; x <= 1460; x += 8) {
    pts.push(`${x === 140 ? "M" : "L"}${x},${evalY(x).toFixed(1)}`);
  }

  // Marble sits in the first valley near x = 280..325 (shifting slightly downhill as tilt increases)
  const marbleBaseX = 280 + ramp * 42;
  const mx = marbleBaseX + Math.sin(t * 4.5) * 6;
  const my = evalY(mx) - 24;

  // Front barrier peak sits around x = 420 - ramp*24
  const peakX = 420 - ramp * 22;
  const peakY = evalY(peakX);

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      <defs>
        <radialGradient id="tiltMarble" cx="35%" cy="30%" r="68%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="45%" stopColor={C.gold} />
          <stop offset="100%" stopColor="#c46e00" />
        </radialGradient>
      </defs>

      {/* Tilted washboard curve */}
      <path
        d={pts.join(" ")}
        fill="none"
        stroke={C.cyan}
        strokeWidth={7}
        strokeLinecap="round"
        style={{ filter: svgGlow(C.cyan, 8) }}
      />

      {/* Highlighted shrinking barrier lip */}
      {ramp > 0.3 && (
        <g opacity={interpolate(ramp, [0.3, 0.7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
          <circle cx={peakX} cy={peakY} r={10} fill={C.red} style={{ filter: svgGlow(C.red, 8) }} />
          <line x1={peakX} y1={peakY - 14} x2={peakX + 90} y2={peakY - 82} stroke={C.red} strokeWidth={2.5} strokeDasharray="6 6" />
          <rect x={peakX + 90} y={peakY - 114} width={310} height={56} rx={14} fill="rgba(34,10,16,0.92)" stroke={C.red} strokeWidth={2.5} />
          <text x={peakX + 245} y={peakY - 78} textAnchor="middle" fill={C.red} fontFamily={INTER} fontWeight={800} fontSize={23}>
            Shorter, Thinner Barrier
          </text>
        </g>
      )}

      {/* Marble trapped inside the tilted pocket */}
      <g transform={`translate(${mx}, ${my})`} style={{ filter: svgGlow(C.gold, 10) }}>
        <circle r={24} fill="url(#tiltMarble)" stroke={C.white} strokeWidth={2.5} />
      </g>

      {/* Clean physical Current Dial on upper right */}
      <g transform="translate(1285, 225)">
        <rect x={-165} y={-110} width={330} height={225} rx={24} fill="rgba(6, 12, 30, 0.92)" stroke={C.gold} strokeWidth={3} />
        <text x={0} y={-68} textAnchor="middle" fill={C.dim} fontFamily={MONO} fontWeight={800} fontSize={19} letterSpacing={2}>
          DC BIAS CURRENT
        </text>
        {/* Arc gauge */}
        <path d="M-85,35 A90,90 0 0,1 85,35" fill="none" stroke="rgba(127,147,196,0.28)" strokeWidth={14} strokeLinecap="round" />
        {/* Needle */}
        <g transform={`translate(0, 35) rotate(${interpolate(ramp, [0, 0.86], [-72, 68])})`}>
          <line x1={0} y1={8} x2={0} y2={-78} stroke={C.gold} strokeWidth={6} strokeLinecap="round" style={{ filter: svgGlow(C.gold, 6) }} />
          <circle r={11} fill={C.white} />
        </g>
        <text x={0} y={88} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={36}>
          {currentUa.toFixed(1)} μA
        </text>
      </g>
    </svg>
  );
};

// ===========================================================================
// CH 2 — PAGE 2D: TRAPPED = 0.00 V  →  TUMBLING DOWN = VOLTAGE SPIKE!
// ===========================================================================
export const TrappedVsTumblingAnim: React.FC<{
  escapeAt: number; // local frame when marble escapes and tumbles downhill
}> = ({ escapeAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const escaped = frame >= escapeAt;
  const escSec = Math.max(0, (frame - escapeAt) / fps);

  const evalY = (x: number) => {
    const phi = ((x - 420) / 140) * Math.PI;
    const tilt = 0.78 * ((x - 420) / 140) * 95;
    return 190 - Math.cos(phi) * 68 + tilt;
  };

  const washPts: string[] = [];
  for (let x = 140; x <= 1460; x += 8) {
    washPts.push(`${x === 140 ? "M" : "L"}${x},${evalY(x).toFixed(1)}`);
  }

  // Before escape: marble rests near x=318; After escape: rolls smoothly & accelerates down to right!
  let mx = 318 + Math.sin(t * 5) * 6;
  if (escaped) {
    mx = Math.min(1420, 395 + escSec * 320 + escSec * escSec * 90);
  }
  const my = evalY(mx) - 22;

  // Bottom live voltage strip
  const vPts: string[] = [];
  for (let x = 180; x <= 1420; x += 8) {
    let vy = 625;
    if (escaped && x >= 760) {
      const span = Math.min(1420, 760 + escSec * 520);
      if (x <= span) {
        const step = interpolate(x, [760, 790], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        vy = 625 - step * (76 + Math.sin(x * 0.14 - t * 20) * 8);
      }
    }
    vPts.push(`${x === 180 ? "M" : "L"}${x},${vy.toFixed(1)}`);
  }

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      {/* Tilted washboard */}
      <path d={washPts.join(" ")} fill="none" stroke={C.cyan} strokeWidth={6} style={{ filter: svgGlow(C.cyan, 6) }} />

      {/* Speed trail behind tumbling marble */}
      {escaped && mx > 460 && (
        <g opacity={0.45}>
          {[35, 70, 105].map((dx, i) => {
            const tx = Math.max(395, mx - dx);
            return <circle key={i} cx={tx} cy={evalY(tx) - 22} r={16 - i * 4} fill={C.gold} />;
          })}
        </g>
      )}

      {/* Marble */}
      <g transform={`translate(${mx}, ${my})`} style={{ filter: svgGlow(escaped ? C.gold : C.cyan, 10) }}>
        <circle r={22} fill={escaped ? C.gold : C.cyan} stroke={C.white} strokeWidth={2.5} />
      </g>

      {/* Bottom voltage strip */}
      <rect x={160} y={515} width={1280} height={155} rx={20} fill="rgba(6, 12, 30, 0.92)" stroke={escaped ? C.gold : C.cyan} strokeWidth={2.5} />
      <path
        d={vPts.join(" ")}
        fill="none"
        stroke={escaped ? C.gold : C.cyan}
        strokeWidth={5.5}
        style={{ filter: svgGlow(escaped ? C.gold : C.cyan, 7) }}
      />
      <text x={200} y={560} fill={C.cyan} fontFamily={MONO} fontWeight={800} fontSize={22}>
        TRAPPED IN POCKET → 0.00 V
      </text>
      <text x={1400} y={560} textAnchor="end" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={24} opacity={escaped ? 1 : 0.25}>
        TUMBLING FREE → VOLTAGE SPIKE!
      </text>
    </svg>
  );
};

// ===========================================================================
// CH 3 — PAGE 3A1: 1981 IBM EARLY HINTS + SKEPTICS' OBJECTION
// (Replaces 43.5s loop with 3 distinct voice-synced pages!)
// ===========================================================================
export const IbmEarlyHintsAnim: React.FC<{
  objectionAt: number;
}> = ({ objectionAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const traceP = interpolate(frame, [0, Math.max(40, objectionAt)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const stampP = spring({ frame: Math.max(0, frame - objectionAt), fps, config: { damping: 12, stiffness: 130 } });

  // Early 1981 IBM switching curve flattening mildly at low temperature
  const pts: [number, number][] = [
    [1220, 195],
    [1040, 285],
    [860, 375],
    [680, 445],
    [520, 468],
    [380, 474],
  ];
  const count = Math.max(1, Math.round(traceP * pts.length));
  const pathStr = pts.slice(0, count).map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      <rect x={240} y={135} width={1120} height={470} rx={28} fill="rgba(8, 16, 38, 0.9)" stroke={C.dim} strokeWidth={3} />
      <line x1={320} y1={545} x2={1280} y2={545} stroke={C.dim} strokeWidth={3} />
      <line x1={320} y1={545} x2={320} y2={175} stroke={C.dim} strokeWidth={3} />

      <text x={800} y={590} textAnchor="middle" fill={C.dim} fontFamily={MONO} fontWeight={800} fontSize={22}>
        ← LOWER TEMPERATURE · IBM NIOBIUM JUNCTION DATA (1981)
      </text>

      {/* Flattening early hint curve */}
      <path d={pathStr} fill="none" stroke={C.cyan} strokeWidth={6.5} strokeLinecap="round" style={{ filter: svgGlow(C.cyan, 8) }} />
      {pts.slice(0, count).map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={9} fill={i >= 3 ? C.gold : C.cyan} stroke={C.white} strokeWidth={2.5} />
      ))}

      {/* Skeptics' Brutal Objection Stamp */}
      <g transform={`translate(780, 320) rotate(-6) scale(${0.75 + 0.25 * stampP})`} opacity={stampP} style={{ filter: svgGlow(C.red, 12) }}>
        <rect x={-325} y={-52} width={650} height={104} rx={22} fill="rgba(50, 10, 18, 0.96)" stroke={C.red} strokeWidth={4} />
        <text x={0} y={-4} textAnchor="middle" fill={C.red} fontFamily={MONO} fontWeight={900} fontSize={26} letterSpacing={2}>
          SKEPTICS' OBJECTION!
        </text>
        <text x={0} y={32} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={800} fontSize={23}>
          Was That Really Quantum — or Warm Lab Noise?
        </text>
      </g>
    </svg>
  );
};

// ===========================================================================
// CH 3 — PAGE 3A2: 300 K WARM WIRES RADIATING MICROWAVES DOWN TO COLD CHIP
// ===========================================================================
export const WarmWireRadiatorAnim: React.FC<{
  radiateAt: number;
}> = ({ radiateAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const radP = interpolate(frame, [radiateAt - 8, radiateAt + 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const makeWave = (baseX: number) => {
    const pts: string[] = [];
    for (let y = 185; y <= 510; y += 8) {
      const x = baseX + Math.sin(y * 0.16 - t * 20) * (22 * radP);
      pts.push(`${y === 185 ? "M" : "L"}${x.toFixed(1)},${y}`);
    }
    return pts.join(" ");
  };

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      {/* Warm 300 K Lab Room top */}
      <rect x={390} y={85} width={820} height={100} rx={22} fill="rgba(76, 16, 24, 0.9)" stroke={C.red} strokeWidth={3.5} />
      <text x={800} y={145} textAnchor="middle" fill={C.red} fontFamily={MONO} fontWeight={900} fontSize={29} letterSpacing={2}>
        ROOM-TEMPERATURE LAB · 300 K
      </text>

      {/* Twin Metal Measurement Cables */}
      <line x1={630} y1={185} x2={630} y2={510} stroke="#8ba3d4" strokeWidth={12} />
      <line x1={970} y1={185} x2={970} y2={510} stroke="#8ba3d4" strokeWidth={12} />

      {/* Thermal Microwave Radiation blooming off the warm wires */}
      <g opacity={radP}>
        <path d={makeWave(630)} fill="none" stroke={C.red} strokeWidth={6} style={{ filter: svgGlow(C.red, 10) }} />
        <path d={makeWave(970)} fill="none" stroke={C.red} strokeWidth={6} style={{ filter: svgGlow(C.red, 10) }} />
        <rect x={165} y={295} width={355} height={94} rx={18} fill="rgba(48, 12, 18, 0.92)" stroke={C.red} strokeWidth={2.5} />
        <text x={342} y={335} textAnchor="middle" fill={C.red} fontFamily={MONO} fontWeight={900} fontSize={22}>
          WARM WIRE RADIATION
        </text>
        <text x={342} y={368} textAnchor="middle" fill={C.gold} fontFamily={INTER} fontWeight={800} fontSize={21}>
          Invisible 300 K Microwaves ↓
        </text>
      </g>

      {/* Cold Chip Bottom Chamber */}
      <rect x={440} y={510} width={720} height={140} rx={24} fill="rgba(6, 20, 48, 0.94)" stroke={C.cyan} strokeWidth={3.5} />
      <text x={800} y={572} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={26}>
        SUPERCONDUCTING CHIP · 0.02 K
      </text>
      <text x={800} y={612} textAnchor="middle" fill={C.dim} fontFamily={INTER} fontWeight={700} fontSize={21}>
        Still Physically Wired Directly to a Warm Room!
      </text>
    </svg>
  );
};

// ===========================================================================
// CH 3 — PAGE 3A3: STRAY MICROWAVE KICKS MARBLE OVER THE TOP (FAKE TUNNELING!)
// ===========================================================================
export const FakeKickOverHillAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // Dramatic single-focus close-up: red pulse enters left (0..1.4s), slams marble OVER crest (1.4..3.2s)
  const hitT = Math.max(0, t - 1.1);
  const impactP = interpolate(hitT, [0, 0.75, 1.8], [0, 0.5, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Incoming red microwave wave pulse from left
  const pulseX = interpolate(t, [0, 1.15], [140, 520], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const mwPts: string[] = [];
  for (let x = Math.max(140, pulseX - 180); x <= pulseX; x += 6) {
    const y = 455 + Math.sin(x * 0.16 - t * 22) * 32;
    mwPts.push(`${x === Math.max(140, pulseX - 180) ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`);
  }

  // Marble sits in valley at (540, 465), then gets launched OVER the crest (820, 235) and crashes downhill!
  const mx = interpolate(impactP, [0, 0.48, 1], [540, 825, 1290]);
  const my = interpolate(impactP, [0, 0.48, 1], [465, 225, 585]);
  const stampP = spring({ frame: Math.max(0, frame - 68), fps, config: { damping: 13, stiffness: 130 } });

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      {/* Potential barrier */}
      <path
        d="M220,250 Q380,525 540,515 Q690,510 825,275 Q965,280 1380,625"
        fill="none"
        stroke={C.cyan}
        strokeWidth={7.5}
        style={{ filter: svgGlow(C.cyan, 8) }}
      />

      {/* Red stray microwave bullet slamming into marble */}
      {t < 1.35 && (
        <path d={mwPts.join(" ")} fill="none" stroke={C.red} strokeWidth={6.5} style={{ filter: svgGlow(C.red, 10) }} />
      )}

      {/* Arched trajectory showing marble went OVER the hill, NOT through it! */}
      <path
        d="M540,465 Q825,140 1180,505"
        fill="none"
        stroke={C.red}
        strokeWidth={4.5}
        strokeDasharray="12 10"
        opacity={impactP}
      />

      {/* Marble */}
      <circle cx={mx} cy={my} r={26} fill={impactP > 0 ? C.red : C.gold} stroke={C.white} strokeWidth={3} style={{ filter: svgGlow(C.red, 10) }} />

      {/* Big unmistakable verdict pill */}
      <g transform={`translate(825, 145) scale(${0.75 + 0.25 * stampP})`} opacity={stampP} style={{ filter: svgGlow(C.red, 10) }}>
        <rect x={-380} y={-40} width={760} height={80} rx={40} fill="rgba(52, 10, 18, 0.95)" stroke={C.red} strokeWidth={3.5} />
        <text x={0} y={8} textAnchor="middle" fill={C.red} fontFamily={MONO} fontWeight={900} fontSize={22} letterSpacing={1.8}>
          KICKED OVER THE TOP · FAKE TUNNELING ✕
        </text>
      </g>
    </svg>
  );
};

// ===========================================================================
// CH 3 — PAGE 3B: BERKELEY TRIO + COPPER POWDER TUBE REVEAL
// ===========================================================================
export const BerkeleyTrioFilterIntroAnim: React.FC<{
  filterAt: number;
}> = ({ filterAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const people = [
    { name: "John Clarke", role: "Professor · UC Berkeley", color: C.cyan, delay: 0 },
    { name: "Michel Devoret", role: "Postdoctoral Researcher", color: C.gold, delay: 14 },
    { name: "John Martinis", role: "PhD Student", color: C.green, delay: 28 },
  ];

  const filterP = spring({ frame: Math.max(0, frame - filterAt), fps, config: { damping: 16, stiffness: 100 } });

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      {/* Top Row: Clean Berkeley Trio Cards */}
      {people.map((p, i) => {
        const sp = spring({ frame: Math.max(0, frame - p.delay), fps, config: { damping: 16, stiffness: 110 } });
        const cx = 360 + i * 440;
        return (
          <g key={p.name} transform={`translate(${cx}, ${215 + (1 - sp) * 30})`} opacity={sp}>
            <rect x={-185} y={-72} width={370} height={144} rx={22} fill="rgba(8, 16, 38, 0.9)" stroke={p.color} strokeWidth={3} />
            <circle cx={-122} cy={0} r={34} fill="rgba(255,255,255,0.08)" stroke={p.color} strokeWidth={2.5} />
            <circle cx={-122} cy={-10} r={11} fill={p.color} />
            <path d="M-142,18 Q-122,2 -102,18" fill="none" stroke={p.color} strokeWidth={4} strokeLinecap="round" />
            <text x={32} y={-10} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={27}>
              {p.name}
            </text>
            <text x={32} y={24} textAnchor="middle" fill={p.color} fontFamily={MONO} fontWeight={700} fontSize={17}>
              {p.role}
            </text>
          </g>
        );
      })}

      {/* Bottom Stage: Copper-Powder Tube Reveal */}
      <g transform={`translate(800, ${505 + (1 - filterP) * 40})`} opacity={filterP}>
        <defs>
          <linearGradient id="copperTube" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f09c5a" />
            <stop offset="45%" stopColor="#c4662c" />
            <stop offset="100%" stopColor="#692d0e" />
          </linearGradient>
        </defs>
        {/* Coax leads entering left and right */}
        <line x1={-490} y1={0} x2={-280} y2={0} stroke={C.cyan} strokeWidth={10} />
        <line x1={280} y1={0} x2={490} y2={0} stroke={C.cyan} strokeWidth={10} />

        {/* Sleek metallic copper cylinder */}
        <rect x={-290} y={-78} width={580} height={156} rx={36} fill="url(#copperTube)" stroke="#ffbe85" strokeWidth={3.5} style={{ filter: svgGlow("#ff9d4d", 8) }} />

        {/* Shimmering powder cutaway window */}
        <rect x={-230} y={-50} width={460} height={100} rx={20} fill="#210d05" stroke="#ffaa66" strokeWidth={2} />
        {Array.from({ length: 48 }, (_, idx) => {
          const gx = -212 + (idx % 16) * 28;
          const gy = -30 + Math.floor(idx / 16) * 30 + Math.sin(idx * 2.3) * 4;
          const shine = 0.55 + 0.45 * Math.sin(t * 4 + idx * 0.7);
          return <circle key={idx} cx={gx} cy={gy} r={7.5} fill="#e88a45" opacity={shine} />;
        })}

        <text x={0} y={132} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={26} letterSpacing={2.5}>
          COPPER-POWDER MICROWAVE FILTER
        </text>
      </g>
    </svg>
  );
};

// ===========================================================================
// CH 3 — PAGE 3C: INSIDE THE COPPER-POWDER FILTER (DC PASSES, NOISE DIES!)
// ===========================================================================
export const CopperPowderFilterAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // Jagged red microwave entering left (x=140..420), exponentially dying inside copper chamber (x=420..1180)
  const buildMicrowave = () => {
    const pts: string[] = [];
    for (let x = 140; x <= 1180; x += 6) {
      const decay = x < 420 ? 1 : Math.exp(-(x - 420) / 145);
      const y = 265 + Math.sin(x * 0.14 - t * 18) * 68 * decay;
      pts.push(`${x === 140 ? "M" : "L"}${x},${y.toFixed(1)}`);
    }
    return pts.join(" ");
  };

  // Smooth calm cyan DC pulses gliding cleanly from x=140 to x=1460 through center wire
  const dcBeads = Array.from({ length: 8 }, (_, i) => {
    const x = 140 + ((t * 210 + i * 165) % 1320);
    return x;
  });

  // Dense copper powder grains surrounding the chamber
  const grains = Array.from({ length: 72 }, (_, i) => {
    const col = i % 18;
    const row = Math.floor(i / 18);
    const x = 452 + col * 41 + (row % 2) * 14;
    const y = 185 + row * 98 + Math.sin(i * 3.1) * 12;
    const absorbGlow = x < 720 ? 0.5 + 0.5 * Math.sin(t * 10 - x * 0.03) : 0.25;
    return { x, y, absorbGlow, i };
  });

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      {/* Copper filter chamber */}
      <rect x={420} y={135} width={760} height={445} rx={34} fill="rgba(42, 18, 8, 0.88)" stroke="#f09c5a" strokeWidth={4} />

      {/* Micro copper grains soaking up high-frequency skin-effect currents */}
      {grains.map((g) => (
        <circle
          key={g.i}
          cx={g.x}
          cy={g.y}
          r={13}
          fill="#d97a36"
          stroke="#ffbe85"
          strokeWidth={1.5}
          opacity={g.absorbGlow}
        />
      ))}

      {/* Red High-Frequency Microwave Noise smashing into powder and dying */}
      <path d={buildMicrowave()} fill="none" stroke={C.red} strokeWidth={5.5} style={{ filter: svgGlow(C.red, 8) }} />
      <text x={270} y={175} textAnchor="middle" fill={C.red} fontFamily={MONO} fontWeight={800} fontSize={21}>
        300 K NOISE IN →
      </text>
      <text x={1330} y={272} textAnchor="middle" fill={C.dim} fontFamily={MONO} fontWeight={800} fontSize={22}>
        NOISE BLOCKED ✕
      </text>

      {/* Insulated central DC core wire (bottom lane) */}
      <line x1={140} y1={465} x2={1460} y2={465} stroke="rgba(62,224,255,0.35)" strokeWidth={18} strokeLinecap="round" />
      <line x1={140} y1={465} x2={1460} y2={465} stroke={C.cyan} strokeWidth={4} />
      {dcBeads.map((bx, i) => (
        <circle key={i} cx={bx} cy={465} r={11} fill={C.cyan} style={{ filter: svgGlow(C.cyan, 8) }} />
      ))}

      <text x={270} y={525} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={800} fontSize={21}>
        CLEAN DC CURRENT →
      </text>
      <text x={1330} y={525} textAnchor="middle" fill={C.green} fontFamily={MONO} fontWeight={900} fontSize={22}>
        PASSES CLEAN ✓
      </text>
    </svg>
  );
};

// ===========================================================================
// CH 3 — PAGE 3D: ZERO FREE PARAMETERS CALIBRATION IN CLASSICAL REGIME
// ===========================================================================
export const ZeroFudgeCalibrationAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const dials = [
    { label: "CRITICAL CURRENT", value: "9.49 μA", color: C.cyan, delay: 0 },
    { label: "CAPACITANCE", value: "6.35 pF", color: C.gold, delay: 45 },
    { label: "DAMPING", value: "MEASURED", color: C.green, delay: 90 },
  ];

  const sealP = spring({ frame: Math.max(0, frame - 145), fps, config: { damping: 14, stiffness: 110 } });
  const pulse = 1 + 0.025 * Math.sin(t * 4.2);

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      {dials.map((d, i) => {
        const sp = spring({ frame: Math.max(0, frame - d.delay), fps, config: { damping: 15, stiffness: 100 } });
        const cx = 360 + i * 440;
        const arcLen = 285 * sp + Math.sin(t * 3 + i) * 8;
        return (
          <g key={d.label} transform={`translate(${cx}, ${305 + Math.sin(t * 2 + i * 1.4) * 4})`} opacity={sp}>
            <rect x={-185} y={-155} width={370} height={310} rx={26} fill="rgba(8, 16, 38, 0.9)" stroke={d.color} strokeWidth={3} />
            {/* Circular gauge */}
            <circle cx={0} cy={-25} r={74} fill="none" stroke="rgba(127,147,196,0.2)" strokeWidth={12} />
            <circle
              cx={0}
              cy={-25}
              r={74}
              fill="none"
              stroke={d.color}
              strokeWidth={12}
              strokeDasharray={`${arcLen} 500`}
              strokeLinecap="round"
              transform="rotate(-90 0 -25)"
              style={{ filter: svgGlow(d.color, 6) }}
            />
            <text x={0} y={-14} textAnchor="middle" fill={C.white} fontFamily={MONO} fontWeight={900} fontSize={28}>
              {d.value}
            </text>
            <text x={0} y={92} textAnchor="middle" fill={d.color} fontFamily={MONO} fontWeight={800} fontSize={20} letterSpacing={1.8}>
              {d.label}
            </text>
            <text x={0} y={128} textAnchor="middle" fill={C.green} fontFamily={MONO} fontWeight={800} fontSize={18}>
              LOCKED IN SITU ✓
            </text>
          </g>
        );
      })}

      {/* Bottom rigid prediction lock badge */}
      <g transform={`translate(800, 580) scale(${(0.8 + 0.2 * sealP) * pulse})`} opacity={sealP} style={{ filter: svgGlow(C.green, 10) }}>
        <rect x={-355} y={-44} width={710} height={88} rx={44} fill="rgba(6, 32, 24, 0.94)" stroke={C.green} strokeWidth={3.5} />
        <text x={0} y={10} textAnchor="middle" fill={C.green} fontFamily={MONO} fontWeight={900} fontSize={28} letterSpacing={2.5}>
          ZERO ADJUSTABLE FUDGE FACTORS
        </text>
      </g>
    </svg>
  );
};
