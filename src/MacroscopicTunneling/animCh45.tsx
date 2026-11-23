import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, INTER, MONO, svgGlow } from "../FiveHundredMileEmail/theme";

// ===========================================================================
// CH 4 — PAGE 4A: THERMAL CLIMB (100 mK) → QUANTUM TUNNELING (20 mK)
// ===========================================================================
export const ThermalVsQuantumTunnelAnim: React.FC<{
  coolAt: number;
}> = ({ coolAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const coldP = interpolate(frame, [coolAt - 10, coolAt + 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Potential hill curve
  const evalY = (x: number) => {
    const u = (x - 820) / 170;
    const hill = 225 * Math.exp(-u * u * 1.15);
    const tilt = (x - 520) * 0.16;
    return 445 - hill + tilt;
  };
  const curvePts: string[] = [];
  for (let x = 160; x <= 1460; x += 8) {
    curvePts.push(`${x === 160 ? "M" : "L"}${x},${evalY(x).toFixed(1)}`);
  }

  // Warm regime: marble hops UP AND OVER the crest!
  const warmCycle = (t * 0.55) % 1;
  const wx = interpolate(warmCycle, [0, 0.45, 0.72, 1], [470, 560, 820, 1280]);
  const wy = evalY(wx) - 24 - (warmCycle > 0.35 && warmCycle < 0.78 ? Math.sin(((warmCycle - 0.35) / 0.43) * Math.PI) * 34 : 0);

  // Cold regime: marble sits calmly, wave leaks STRAIGHT THROUGH the barrier wall!
  const qCycle = (t * 0.42) % 1;
  const qGhostX = interpolate(qCycle, [0, 1], [540, 1260]);
  const qInWall = qGhostX > 660 && qGhostX < 980;
  const qOpacity = qInWall ? 0.38 : qGhostX >= 980 ? 0.92 : 0.95;

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      <defs>
        <linearGradient id="hillShade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={coldP > 0.5 ? C.cyan : C.red} stopOpacity="0.32" />
          <stop offset="100%" stopColor="#040814" stopOpacity="0" />
        </linearGradient>
      </defs>

      <path d={`${curvePts.join(" ")} L1460,670 L160,670 Z`} fill="url(#hillShade)" />
      <path
        d={curvePts.join(" ")}
        fill="none"
        stroke={coldP > 0.5 ? C.cyan : C.gold}
        strokeWidth={7}
        style={{ filter: svgGlow(coldP > 0.5 ? C.cyan : C.gold, 8) }}
      />

      {/* WARM THERMAL ACTIVATION LAYER */}
      <g opacity={1 - coldP}>
        {/* Thermal arrow curving OVER the hill */}
        <path
          d="M520,400 Q815,135 1110,415"
          fill="none"
          stroke={C.red}
          strokeWidth={4.5}
          strokeDasharray="12 10"
          opacity={0.75}
        />
        <text x={820} y={162} textAnchor="middle" fill={C.red} fontFamily={MONO} fontWeight={900} fontSize={25} letterSpacing={2}>
          THERMAL HEAT HOPS OVER THE HILL ↑
        </text>
        <circle cx={wx} cy={wy} r={24} fill={C.red} stroke={C.white} strokeWidth={2.5} style={{ filter: svgGlow(C.red, 10) }} />
      </g>

      {/* COLD QUANTUM TUNNELING LAYER */}
      <g opacity={coldP}>
        {/* Horizontal quantum tunnel beam piercing right THROUGH the hill */}
        <line
          x1={520}
          y1={430}
          x2={1160}
          y2={430}
          stroke={C.cyan}
          strokeWidth={5}
          strokeDasharray="14 10"
          opacity={0.75}
        />
        <text x={820} y={162} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={25} letterSpacing={2}>
          ZERO THERMAL ENERGY · TUNNELS STRAIGHT THROUGH →
        </text>

        {/* Resting quantum wave packet in valley */}
        <circle cx={520} cy={430} r={24} fill={C.gold} opacity={0.35} />
        {/* Tunneling ghost sphere moving straight horizontally through barrier */}
        <g transform={`translate(${qGhostX}, ${qGhostX > 1020 ? evalY(qGhostX) - 24 : 430})`} opacity={qOpacity} style={{ filter: svgGlow(C.cyan, 10) }}>
          <circle r={24} fill={C.cyan} stroke={C.white} strokeWidth={2.5} />
          <circle r={40} fill="none" stroke={C.cyan} strokeWidth={2} opacity={0.5} />
        </g>
      </g>

      {/* Live Fridge Temperature Badge bottom left */}
      <g transform="translate(260, 615)">
        <rect x={-135} y={-42} width={270} height={82} rx={18} fill="rgba(6, 12, 30, 0.92)" stroke={coldP > 0.5 ? C.cyan : C.red} strokeWidth={2.5} />
        <text x={0} y={-10} textAnchor="middle" fill={C.dim} fontFamily={MONO} fontWeight={700} fontSize={17}>
          FRIDGE TEMPERATURE
        </text>
        <text x={0} y={24} textAnchor="middle" fill={coldP > 0.5 ? C.cyan : C.red} fontFamily={MONO} fontWeight={900} fontSize={30}>
          {Math.round(interpolate(coldP, [0, 1], [100, 19]))} mK
        </text>
      </g>
    </svg>
  );
};

// ===========================================================================
// CH 4 — PAGE 4B: FRESH FULL-SCREEN DATA GRAPH (THE 37 mK QUANTUM PLATEAU!)
// ===========================================================================
export const PlateauGraphAnim: React.FC<{
  plateauAt: number;
  deepSpaceAt?: number;
}> = ({ plateauAt, deepSpaceAt = 240 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // Graph coordinates: X = Fridge Temp (0..110 mK) -> x=290..1360; Y = Escape Temp (0..110 mK) -> y=575..145
  const toX = (mK: number) => 290 + (mK / 110) * 1070;
  const toY = (mK: number) => 575 - (mK / 110) * 430;

  // Sweep cooling progress from right (100 mK) -> left (19 mK)!
  // Before plateauAt: sweeps 100 mK -> 32 mK; after plateauAt: smoothly completes 32 mK -> 19 mK over 7s!
  const beforeP = interpolate(frame, [0, Math.max(15, plateauAt)], [0, 0.64], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const afterP = interpolate(frame, [plateauAt, plateauAt + 210], [0, 0.36], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sweep = beforeP + afterP;
  const deepP = spring({ frame: Math.max(0, frame - deepSpaceAt), fps, config: { damping: 14, stiffness: 120 } });

  // Data points cooling from 100 mK down to 19 mK (matching PRL 55, 1908!)
  const dataPts: [number, number][] = [
    [100, 101],
    [88, 89],
    [76, 77],
    [64, 65],
    [52, 54],
    [42, 45],
    [34, 40],
    [28, 38],
    [24, 37.5],
    [21, 37.4],
    [19, 37.4],
  ];

  const visibleCount = Math.max(1, Math.round(sweep * dataPts.length));
  const curveStr = dataPts
    .slice(0, visibleCount)
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${toX(x).toFixed(1)},${toY(y).toFixed(1)}`)
    .join(" ");

  const plateauBadgeP = spring({ frame: Math.max(0, frame - plateauAt - 22), fps, config: { damping: 14, stiffness: 120 } });

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      {/* Clean axes */}
      <line x1={290} y1={575} x2={1395} y2={575} stroke={C.dim} strokeWidth={3.5} />
      <line x1={290} y1={575} x2={290} y2={125} stroke={C.dim} strokeWidth={3.5} />

      {/* Subtle grid ticks */}
      {[20, 40, 60, 80, 100].map((v) => (
        <g key={v}>
          <line x1={toX(v)} y1={575} x2={toX(v)} y2={145} stroke="rgba(127,147,196,0.12)" strokeWidth={1.5} />
          <text x={toX(v)} y={615} textAnchor="middle" fill={C.dim} fontFamily={MONO} fontWeight={700} fontSize={21}>
            {v} mK
          </text>
          <line x1={290} y1={toY(v)} x2={1360} y2={toY(v)} stroke="rgba(127,147,196,0.12)" strokeWidth={1.5} />
          <text x={265} y={toY(v) + 7} textAnchor="end" fill={C.dim} fontFamily={MONO} fontWeight={700} fontSize={21}>
            {v}
          </text>
        </g>
      ))}

      {/* Axis Labels */}
      <text x={825} y={672} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={800} fontSize={26}>
        ← Cooling Down · Fridge Temperature (mK)
      </text>
      <text x={155} y={355} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={800} fontSize={25} transform="rotate(-90 155 355)">
        Escape Temperature (mK)
      </text>

      {/* Classical 1-to-1 diagonal line */}
      <line x1={toX(0)} y1={toY(0)} x2={toX(105)} y2={toY(105)} stroke="rgba(255,255,255,0.28)" strokeWidth={3} strokeDasharray="10 10" />
      <text x={toX(84)} y={toY(96)} fill={C.dim} fontFamily={MONO} fontWeight={700} fontSize={20} transform="rotate(-22 1100 205)">
        CLASSICAL THERMAL LINE
      </text>

      {/* Gold dotted zero-parameter quantum prediction line at 37.4 mK */}
      <line
        x1={toX(12)}
        y1={toY(37.4)}
        x2={toX(48)}
        y2={toY(37.4)}
        stroke={C.gold}
        strokeWidth={4}
        strokeDasharray="12 8"
        opacity={plateauBadgeP}
      />

      {/* Crossover vertical marker at 30 mK — placed cleanly below diagonal so zero overlap! */}
      <line x1={toX(30)} y1={575} x2={toX(30)} y2={toY(48)} stroke={C.cyan} strokeWidth={2.5} strokeDasharray="7 7" opacity={plateauBadgeP * 0.78} />
      <text x={toX(30) + 14} y={toY(14)} textAnchor="start" fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={21} opacity={plateauBadgeP}>
        30 mK CROSSOVER
      </text>

      {/* Glowing experimental curve & dots */}
      <path d={curveStr} fill="none" stroke={C.cyan} strokeWidth={6} strokeLinecap="round" style={{ filter: svgGlow(C.cyan, 8) }} />
      {dataPts.slice(0, visibleCount).map(([x, y], idx) => {
        const isPlat = x <= 30;
        const r = isPlat ? 10 + 2.5 * Math.sin(t * 5 - idx * 0.8) : 10;
        return (
          <circle
            key={idx}
            cx={toX(x)}
            cy={toY(y)}
            r={r}
            fill={isPlat ? C.gold : C.cyan}
            stroke={C.white}
            strokeWidth={2.5}
            style={{ filter: svgGlow(isPlat ? C.gold : C.cyan, 6) }}
          />
        );
      })}

      {/* Clean Quantum Plateau Callout floating in open upper-left sky (zero overlap!) */}
      <g opacity={plateauBadgeP}>
        <line x1={toX(22)} y1={toY(37.4) - 18} x2={520} y2={245} stroke={C.gold} strokeWidth={2.5} strokeDasharray="6 6" />
        <g transform="translate(345, 160)">
          <rect x={0} y={0} width={455} height={86} rx={18} fill="rgba(26, 20, 4, 0.94)" stroke={C.gold} strokeWidth={3} style={{ filter: svgGlow(C.gold, 6) }} />
          <text x={227} y={36} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={22}>
            FLAT PLATEAU AT ~37 mK
          </text>
          <text x={227} y={66} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={700} fontSize={20}>
            Matches Zero-Parameter Quantum Theory!
          </text>
        </g>
      </g>

      {/* Deep Space chill context pill popping right when "nineteen millikelvin" is spoken! */}
      <g transform={`translate(1070, 505) scale(${0.8 + 0.2 * deepP})`} opacity={deepP}>
        <rect x={-235} y={-34} width={470} height={68} rx={18} fill="rgba(6, 22, 48, 0.94)" stroke={C.cyan} strokeWidth={2.5} />
        <text x={0} y={8} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={20}>
          19 mK · 140× COLDER THAN DEEP SPACE
        </text>
      </g>
    </svg>
  );
};

// ===========================================================================
// CH 4 — PAGE 4C: THE SKEPTIC'S QUESTION (QUANTUM vs. HIDDEN NOISE FLOOR?)
// ===========================================================================
export const SkepticPlateauChallengeAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const p1 = spring({ frame, fps, config: { damping: 16, stiffness: 110 } });
  const p2 = spring({ frame: Math.max(0, frame - 18), fps, config: { damping: 16, stiffness: 110 } });

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      {/* Central flat line visual */}
      <line x1={380} y1={210} x2={1220} y2={210} stroke={C.gold} strokeWidth={8} strokeLinecap="round" style={{ filter: svgGlow(C.gold, 10) }} />
      {[460, 620, 800, 980, 1140].map((cx, i) => (
        <circle key={i} cx={cx} cy={210} r={12 + 2 * Math.sin(t * 5 + i)} fill={C.gold} stroke={C.white} strokeWidth={2.5} />
      ))}
      <text x={800} y={160} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={28} letterSpacing={2}>
        STUCK FLAT AT 37 mK — WHY?
      </text>

      {/* Fork arrows */}
      <path d="M680,235 L480,355" fill="none" stroke={C.cyan} strokeWidth={4} strokeDasharray="10 8" />
      <path d="M920,235 L1120,355" fill="none" stroke={C.red} strokeWidth={4} strokeDasharray="10 8" />

      {/* Hypothesis A: Real Quantum Tunneling */}
      <g transform={`translate(450, ${475 + (1 - p1) * 35})`} opacity={p1}>
        <rect x={-260} y={-105} width={520} height={210} rx={28} fill="rgba(6, 20, 44, 0.92)" stroke={C.cyan} strokeWidth={3.5} />
        <text x={0} y={-32} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={24} letterSpacing={2}>
          POSSIBILITY A
        </text>
        <text x={0} y={24} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={36}>
          True Quantum Tunneling
        </text>
        <text x={0} y={68} textAnchor="middle" fill={C.dim} fontFamily={INTER} fontWeight={700} fontSize={22}>
          Wave slips straight through the hill
        </text>
      </g>

      {/* Hypothesis B: Hidden Noise Floor */}
      <g transform={`translate(1150, ${475 + (1 - p2) * 35})`} opacity={p2}>
        <rect x={-260} y={-105} width={520} height={210} rx={28} fill="rgba(42, 10, 18, 0.92)" stroke={C.red} strokeWidth={3.5} />
        <text x={0} y={-32} textAnchor="middle" fill={C.red} fontFamily={MONO} fontWeight={900} fontSize={24} letterSpacing={2}>
          POSSIBILITY B
        </text>
        <text x={0} y={24} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={36}>
          Hidden 37 mK Noise Leak
        </text>
        <text x={0} y={68} textAnchor="middle" fill={C.dim} fontFamily={INTER} fontWeight={700} fontSize={22}>
          Bad thermometer or sneaky stray heat?
        </text>
      </g>
    </svg>
  );
};

// ===========================================================================
// CH 4 — PAGE 4D: THE MAGNETIC-FIELD CHECKMATE (FLAT LINE PLUMMETS TO 19 mK!)
// ===========================================================================
export const MagneticFieldCheckmateAnim: React.FC<{
  magOnAt: number;
  dropAt: number;
}> = ({ magOnAt, dropAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const magOn = interpolate(frame, [Math.max(0, magOnAt - 6), magOnAt + 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dropP = interpolate(frame, [dropAt - 5, dropAt + 42], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const stampP = spring({ frame: Math.max(0, frame - dropAt - 38), fps, config: { damping: 12, stiffness: 130 } });

  // Clean right-side graph (X: 0..80 mK -> x=730..1430, Y: 0..80 mK -> y=575..165)
  const toX = (mK: number) => 730 + (mK / 80) * 700;
  const toY = (mK: number) => 575 - (mK / 80) * 410;

  // Points morph cleanly from flat 37.4 mK down onto the diagonal 19 mK line!
  const pts: [number, number][] = [
    [65, 65],
    [50, 50],
    [35, interpolate(dropP, [0, 1], [40, 35])],
    [27, interpolate(dropP, [0, 1], [37.8, 27])],
    [22, interpolate(dropP, [0, 1], [37.4, 22])],
    [19, interpolate(dropP, [0, 1], [37.4, 19])],
  ];
  const liveStr = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${toX(x).toFixed(1)},${toY(y).toFixed(1)}`).join(" ");

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      {/* Left Side: Magnetic Coil turning ON around the superconducting chip */}
      <g transform="translate(355, 370)">
        {/* Magnetic field flux loops */}
        {[1, 2, 3].map((k) => (
          <ellipse
            key={k}
            cx={0}
            cy={0}
            rx={110 + k * 42}
            ry={165 + k * 24}
            fill="none"
            stroke={C.green}
            strokeWidth={3}
            strokeDasharray="14 10"
            strokeDashoffset={-t * 50}
            opacity={magOn * (0.75 - k * 0.16)}
            style={{ filter: svgGlow(C.green, 6) }}
          />
        ))}
        {/* Chip core — generously sized so text has clean internal margins */}
        <rect x={-122} y={-88} width={244} height={176} rx={24} fill="#0c1a38" stroke={C.green} strokeWidth={3.5} style={{ filter: svgGlow(C.green, 8) }} />
        <text x={0} y={-10} textAnchor="middle" fill={C.green} fontFamily={MONO} fontWeight={900} fontSize={26}>
          B-FIELD ON
        </text>
        <text x={0} y={28} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={800} fontSize={19}>
          Lowers Critical Current
        </text>
      </g>

      {/* Right Side: Fresh Live Graph Dropping Straight to 19 mK */}
      <g>
        <line x1={730} y1={575} x2={1450} y2={575} stroke={C.dim} strokeWidth={3.5} />
        <line x1={730} y1={575} x2={730} y2={145} stroke={C.dim} strokeWidth={3.5} />

        {/* Classical diagonal */}
        <line x1={toX(0)} y1={toY(0)} x2={toX(75)} y2={toY(75)} stroke="rgba(255,255,255,0.32)" strokeWidth={3} strokeDasharray="10 8" />

        {/* Faint ghost of the previous 37 mK quantum plateau */}
        <path
          d={`M${toX(65)},${toY(65)} L${toX(50)},${toY(50)} L${toX(35)},${toY(40)} L${toX(19)},${toY(37.4)}`}
          fill="none"
          stroke={C.gold}
          strokeWidth={3.5}
          strokeDasharray="8 8"
          opacity={0.4}
        />

        {/* Dropping downward arrow at 19 mK */}
        {dropP > 0.15 && (
          <g opacity={dropP}>
            <line x1={toX(19)} y1={toY(35)} x2={toX(19)} y2={toY(22)} stroke={C.green} strokeWidth={5} />
            <polygon points={`${toX(19)},${toY(19) - 10} ${toX(19) - 12},${toY(24)} ${toX(19) + 12},${toY(24)}`} fill={C.green} />
          </g>
        )}

        {/* Active data line dropping straight onto 19 mK! */}
        <path
          d={liveStr}
          fill="none"
          stroke={dropP > 0.5 ? C.green : C.gold}
          strokeWidth={7}
          strokeLinecap="round"
          style={{ filter: svgGlow(dropP > 0.5 ? C.green : C.gold, 8) }}
        />
        {pts.map(([x, y], i) => (
          <circle key={i} cx={toX(x)} cy={toY(y)} r={10} fill={dropP > 0.5 ? C.green : C.gold} stroke={C.white} strokeWidth={2.5} />
        ))}

        {/* 19 mK label */}
        <text x={toX(19)} y={615} textAnchor="middle" fill={C.green} fontFamily={MONO} fontWeight={900} fontSize={23}>
          19 mK
        </text>
        <text x={toX(65)} y={615} textAnchor="middle" fill={C.dim} fontFamily={MONO} fontWeight={700} fontSize={21}>
          65 mK
        </text>
        <text x={1090} y={662} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={800} fontSize={24}>
          Fridge Temperature (mK)
        </text>

        {/* Verdict Stamp placed cleanly in open sky well above diagonal */}
        <g transform={`translate(1015, 162) scale(${0.75 + 0.25 * stampP})`} opacity={stampP} style={{ filter: svgGlow(C.green, 10) }}>
          <rect x={-235} y={-42} width={470} height={84} rx={20} fill="rgba(6, 36, 24, 0.95)" stroke={C.green} strokeWidth={3.5} />
          <text x={0} y={9} textAnchor="middle" fill={C.green} fontFamily={MONO} fontWeight={900} fontSize={25} letterSpacing={2}>
            NOISE FLOOR RULED OUT ✓
          </text>
        </g>
      </g>
    </svg>
  );
};

// ===========================================================================
// CH 5 — PAGE 5A: DISCRETE QUANTIZED ENERGY RUNGS INSIDE THE WELL
// ===========================================================================
export const DiscreteRungsWellAnim: React.FC<{
  rungsAt?: number;
}> = ({ rungsAt = 120 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // Deep close-up of ONE cubic anharmonic washboard pocket
  const evalY = (x: number) => {
    const u = (x - 680) / 310;
    return 565 - 290 * (1 - Math.pow(u, 2) * 1.15 + Math.pow(u, 3) * 0.42);
  };
  const wellPts: string[] = [];
  for (let x = 230; x <= 1370; x += 8) {
    const y = Math.min(675, evalY(x));
    wellPts.push(`${x === 230 ? "M" : "L"}${x},${y.toFixed(1)}`);
  }

  // 4 discrete anharmonic rungs snapping in RIGHT as "discrete, quantized rungs" is spoken!
  const baseF = Math.max(10, rungsAt);
  const rungs = [
    { n: "0", y: 512, x1: 545, x2: 815, color: C.cyan, delay: baseF },
    { n: "1", y: 416, x1: 470, x2: 895, color: C.gold, delay: baseF + 24 },
    { n: "2", y: 334, x1: 415, x2: 965, color: C.green, delay: baseF + 48 },
    { n: "3", y: 268, x1: 375, x2: 1030, color: C.red, delay: baseF + 72 },
  ];

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      {/* Potential pocket curve */}
      <path
        d={wellPts.join(" ")}
        fill="none"
        stroke={C.cyan}
        strokeWidth={7.5}
        strokeLinecap="round"
        style={{ filter: svgGlow(C.cyan, 8) }}
      />

      {/* Quantized discrete rungs materializing inside the valley */}
      {rungs.map((r, idx) => {
        const sp = spring({ frame: Math.max(0, frame - r.delay), fps, config: { damping: 14, stiffness: 110 } });
        // Shimmering standing-wave probability lobe on each rung
        const wavePts: string[] = [];
        const nodes = idx + 1;
        for (let x = r.x1; x <= r.x2; x += 6) {
          const p = (x - r.x1) / (r.x2 - r.x1);
          const env = Math.sin(p * Math.PI * nodes) * Math.sin(t * 4.5 + idx) * 18 * sp;
          wavePts.push(`${x === r.x1 ? "M" : "L"}${x.toFixed(1)},${(r.y - env).toFixed(1)}`);
        }
        return (
          <g key={r.n} opacity={sp}>
            <line x1={r.x1} y1={r.y} x2={r.x2} y2={r.y} stroke={r.color} strokeWidth={5} strokeLinecap="round" style={{ filter: svgGlow(r.color, 6) }} />
            <path d={wavePts.join(" ")} fill="none" stroke={r.color} strokeWidth={3} opacity={0.65} />
            <rect x={r.x1 - 92} y={r.y - 22} width={76} height={44} rx={12} fill="#060c1e" stroke={r.color} strokeWidth={2.5} />
            <text x={r.x1 - 54} y={r.y + 9} textAnchor="middle" fill={r.color} fontFamily={MONO} fontWeight={900} fontSize={25}>
              |{r.n}⟩
            </text>
          </g>
        );
      })}

      <text x={800} y={662} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={26} letterSpacing={2.5}>
        ONLY DISCRETE ENERGY RUNGS ALLOWED — LIKE AN ATOM
      </text>
    </svg>
  );
};

// ===========================================================================
// CH 5 — PAGE 5B: 2.0 GHz MICROWAVE PHOTON EXCITES RUNG → FASTER TUNNELING!
// ===========================================================================
export const MicrowaveProbeAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // Cycle: 0..0.35 microwave hits |0⟩ -> 0.35..0.65 leaps to |1⟩ -> 0.65..1.0 rockets straight through thin barrier!
  const cyc = (t * 0.32) % 1;
  const jumped = cyc > 0.34;
  const tunneling = cyc > 0.56;

  // Well curve
  const wellPath = "M260,180 Q320,565 620,565 Q870,565 1015,270 Q1145,270 1370,635";

  // Incoming golden 2.0 GHz microwave beam from upper left
  const mwPts: string[] = [];
  const mwProgress = Math.min(1, cyc / 0.36);
  const mwEndX = 160 + mwProgress * 420;
  for (let x = 160; x <= mwEndX; x += 6) {
    const p = (x - 160) / 420;
    const baseY = 230 + p * 270;
    const osc = Math.sin(x * 0.14 - t * 18) * 18;
    mwPts.push(`${x === 160 ? "M" : "L"}${x.toFixed(1)},${(baseY + osc).toFixed(1)}`);
  }

  // Particle position
  let px = 620;
  let py = 515;
  if (jumped && !tunneling) {
    const jp = Math.min(1, (cyc - 0.34) / 0.14);
    py = interpolate(jp, [0, 1], [515, 345]);
  } else if (tunneling) {
    const tp = (cyc - 0.56) / 0.44;
    px = interpolate(tp, [0, 1], [620, 1340]);
    py = px > 1130 ? interpolate(px, [1130, 1340], [345, 570]) : 345;
  }

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      {/* Potential barrier */}
      <path d={wellPath} fill="none" stroke={C.cyan} strokeWidth={7} style={{ filter: svgGlow(C.cyan, 8) }} />

      {/* Ground rung |0⟩ and Excited rung |1⟩ */}
      <line x1={485} y1={515} x2={755} y2={515} stroke={C.cyan} strokeWidth={4.5} opacity={0.8} />
      <text x={450} y={523} textAnchor="end" fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={24}>|0⟩</text>

      <line x1={395} y1={345} x2={935} y2={345} stroke={C.gold} strokeWidth={5} style={{ filter: svgGlow(C.gold, 6) }} />
      <text x={360} y={353} textAnchor="end" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={24}>|1⟩</text>

      {/* Highlight paper-thin barrier at upper rung! */}
      <line x1={945} y1={345} x2={1115} y2={345} stroke={C.red} strokeWidth={6} strokeDasharray="10 8" />
      <text x={1035} y={230} textAnchor="middle" fill={C.red} fontFamily={MONO} fontWeight={900} fontSize={21}>
        THINNER BARRIER!
      </text>

      {/* 2.0 GHz Microwave beam */}
      <path d={mwPts.join(" ")} fill="none" stroke={C.gold} strokeWidth={5.5} style={{ filter: svgGlow(C.gold, 8) }} />
      <text x={245} y={195} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={24}>
        2.0 GHz MICROWAVE
      </text>

      {/* Upward jump arrow when excited */}
      {jumped && (
        <g>
          <line x1={620} y1={495} x2={620} y2={370} stroke={C.gold} strokeWidth={5} />
          <polygon points="620,355 606,382 634,382" fill={C.gold} />
        </g>
      )}

      {/* Circuit state orb */}
      <g transform={`translate(${px}, ${py})`} style={{ filter: svgGlow(tunneling ? C.green : C.gold, 10) }}>
        <circle r={24} fill={tunneling ? C.green : C.gold} stroke={C.white} strokeWidth={2.5} />
      </g>

      <text x={800} y={665} textAnchor="middle" fill={C.green} fontFamily={MONO} fontWeight={900} fontSize={25} letterSpacing={2}>
        RESONANT JUMP → DRASTICALLY FASTER TUNNEL ESCAPE!
      </text>
    </svg>
  );
};

// ===========================================================================
// CH 5 — PAGE 5C: FRESH FULL-SCREEN SPECTRUM — VOICE-SYNCED THREE PEAKS!
// ===========================================================================
export const ThreePeaksSpectrumAnim: React.FC<{
  clearAt: number;
  peak1At: number;
  peak2At: number;
  peak3At: number;
}> = ({ clearAt, peak1At, peak2At, peak3At }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // Classical broad smudge visible while narrator describes "broad smudge", then clears into quantum peaks!
  const smudgeO = interpolate(frame, [0, 15, clearAt - 10, clearAt + 18], [0, 0.85, 0.85, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Sweep bias current continuously synced to the exact frames the narrator names each peak!
  const f0 = Math.max(20, clearAt);
  const f1 = Math.max(f0 + 40, peak1At);
  const f2 = Math.max(f1 + 45, peak2At);
  const f3 = Math.max(f2 + 45, peak3At);

  const sweepX = interpolate(
    frame,
    [f0, f1, f2, f3, f3 + 85],
    [220, 495, 865, 1165, 1385],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // 3 Lorentzian resonant peaks at uneven spacing (anharmonicity: 0->1, 1->2, 2->3!)
  const peaks = [
    { x0: 470, h: 315, w: 30, label: "0 → 1", color: C.cyan, at: f1 - 8 },
    { x0: 840, h: 255, w: 28, label: "1 → 2", color: C.gold, at: f2 - 8 },
    { x0: 1140, h: 190, w: 26, label: "2 → 3", color: C.green, at: f3 - 8 },
  ];

  const evalSpecY = (x: number) => {
    let val = 0;
    for (const pk of peaks) {
      val += pk.h / (1 + Math.pow((x - pk.x0) / pk.w, 2));
    }
    return 565 - val;
  };

  const pts: string[] = [];
  for (let x = 220; x <= sweepX; x += 5) {
    pts.push(`${x === 220 ? "M" : "L"}${x.toFixed(1)},${evalSpecY(x).toFixed(1)}`);
  }

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      {/* Clean axes */}
      <line x1={220} y1={565} x2={1410} y2={565} stroke={C.dim} strokeWidth={3.5} />
      <line x1={220} y1={565} x2={220} y2={145} stroke={C.dim} strokeWidth={3.5} />

      <text x={815} y={635} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={800} fontSize={26}>
        Sweeping Bias Current (I) →
      </text>
      <text x={150} y={355} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={800} fontSize={25} transform="rotate(-90 150 355)">
        Escape Rate Boost
      </text>

      {/* Classical broad smudge comparison (fades away cleanly when quantum sweep starts) */}
      <g opacity={smudgeO}>
        <path
          d="M250,562 Q580,315 840,340 Q1100,365 1360,562"
          fill="rgba(127, 147, 196, 0.16)"
          stroke={C.dim}
          strokeWidth={4.5}
          strokeDasharray="12 10"
        />
        <text x={820} y={295} textAnchor="middle" fill={C.dim} fontFamily={MONO} fontWeight={800} fontSize={23}>
          CLASSICAL EXPECTATION: BROAD SMUDGE (NOT SEEN ✕)
        </text>
      </g>

      {/* Glowing live spectrum trace */}
      {frame >= f0 && (
        <path d={pts.join(" ")} fill="none" stroke={C.gold} strokeWidth={6} strokeLinecap="round" style={{ filter: svgGlow(C.gold, 8) }} />
      )}

      {/* Moving scan cursor dot */}
      <circle cx={sweepX} cy={evalSpecY(sweepX)} r={10 + 2 * Math.sin(t * 8)} fill={C.white} style={{ filter: svgGlow(C.gold, 10) }} />

      {/* Individual peak badges popping cleanly RIGHT when narrator calls each peak! */}
      {peaks.map((pk, idx) => {
        const sp = spring({ frame: Math.max(0, frame - pk.at), fps, config: { damping: 13, stiffness: 130 } });
        const pulse = 1 + 0.03 * Math.sin(t * 5 + idx);
        return (
          <g key={pk.label} transform={`translate(${pk.x0}, ${565 - pk.h - 58}) scale(${(0.7 + 0.3 * sp) * pulse})`} opacity={sp}>
            <rect x={-72} y={-28} width={144} height={54} rx={14} fill="#060c1e" stroke={pk.color} strokeWidth={3} style={{ filter: svgGlow(pk.color, 6) }} />
            <text x={0} y={8} textAnchor="middle" fill={pk.color} fontFamily={MONO} fontWeight={900} fontSize={26}>
              {pk.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

// ===========================================================================
// CH 5 — PAGE 5D: HIGHER RUNGS FACE A THINNER BARRIER → FASTER TUNNELING!
// ===========================================================================
export const HigherRungsFasterTunnelAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // Curved washboard hill clearly showing WIDE barrier at |0⟩ vs PAPER-THIN barrier at |2⟩!
  const wellPath = "M220,175 Q300,565 565,565 Q785,565 925,215 Q1025,215 1375,620";

  // Slow trickle escaping from bottom |0⟩ (thick barrier: x=710..1240 -> 530px thick!)
  const slowX = 565 + ((t * 115) % 800);
  const slowY = slowX > 1220 ? 520 + (slowX - 1220) * 0.45 : 520;

  // Rapid stream of 4 particles rocketing out of top |2⟩ (paper-thin barrier: x=855..1045 -> 190px thin!)
  const fastOrbs = [0, 1, 2, 3].map((i) => {
    const p = ((t * 0.85 + i * 0.25) % 1);
    const fx = interpolate(p, [0, 1], [620, 1375]);
    const fy = fx > 1050 ? interpolate(fx, [1050, 1375], [275, 555]) : 275;
    return { fx, fy, i };
  });

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      {/* Potential barrier */}
      <path d={wellPath} fill="none" stroke={C.cyan} strokeWidth={7} style={{ filter: svgGlow(C.cyan, 8) }} />

      {/* Bottom Rung |0⟩ — Wide thick barrier */}
      <line x1={430} y1={520} x2={700} y2={520} stroke={C.dim} strokeWidth={5} />
      <text x={395} y={528} textAnchor="end" fill={C.dim} fontFamily={MONO} fontWeight={900} fontSize={25}>|0⟩</text>
      <line x1={715} y1={520} x2={1225} y2={520} stroke={C.red} strokeWidth={4} strokeDasharray="10 10" opacity={0.65} />
      <rect x={845} y={536} width={275} height={44} rx={12} fill="rgba(42,10,16,0.92)" stroke={C.red} strokeWidth={2} />
      <text x={982} y={565} textAnchor="middle" fill={C.red} fontFamily={MONO} fontWeight={800} fontSize={19}>
        THICK WALL · SLOW
      </text>
      <circle cx={slowX} cy={slowY} r={14} fill={C.dim} opacity={slowX > 710 && slowX < 1220 ? 0.3 : 0.85} />

      {/* Upper Rung |2⟩ — Paper-thin barrier near top! */}
      <line x1={325} y1={275} x2={845} y2={275} stroke={C.green} strokeWidth={6} style={{ filter: svgGlow(C.green, 6) }} />
      <text x={295} y={283} textAnchor="end" fill={C.green} fontFamily={MONO} fontWeight={900} fontSize={26}>|2⟩</text>
      <line x1={855} y1={275} x2={1045} y2={275} stroke={C.gold} strokeWidth={6} strokeDasharray="8 6" />
      <rect x={820} y={140} width={360} height={54} rx={14} fill="rgba(6,34,24,0.95)" stroke={C.green} strokeWidth={2.5} style={{ filter: svgGlow(C.green, 6) }} />
      <text x={1000} y={175} textAnchor="middle" fill={C.green} fontFamily={MONO} fontWeight={900} fontSize={21}>
        THIN BARRIER · 1000× FASTER!
      </text>

      {fastOrbs.map((o) => (
        <circle
          key={o.i}
          cx={o.fx}
          cy={o.fy}
          r={18}
          fill={C.green}
          stroke={C.white}
          strokeWidth={2.5}
          opacity={o.fx > 855 && o.fx < 1045 ? 0.55 : 1}
          style={{ filter: svgGlow(C.green, 8) }}
        />
      ))}

      <text x={800} y={668} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={24} letterSpacing={2}>
        EVERY QUANTUM JUMP MAKES TUNNELING EXPLODE FASTER
      </text>
    </svg>
  );
};

// ===========================================================================
// CH 5 — PAGE 5D: HYDROGEN ATOM vs. CENTIMETER-SIZED ARTIFICIAL ATOM CHIP
// ===========================================================================
export const AtomVsChipParallelAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const p = spring({ frame, fps, config: { damping: 16, stiffness: 100 } });

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      {/* LEFT: Single Hydrogen Atom */}
      <g transform="translate(430, 355)" opacity={p}>
        {[72, 128, 182].map((r, i) => (
          <circle key={r} r={r} fill="none" stroke={i === 0 ? C.cyan : i === 1 ? C.gold : C.green} strokeWidth={3} strokeDasharray="10 8" opacity={0.75} />
        ))}
        <circle r={18} fill={C.red} style={{ filter: svgGlow(C.red, 8) }} />
        {/* Orbiting electron */}
        <circle
          cx={Math.cos(t * 2.8) * 128}
          cy={Math.sin(t * 2.8) * 128}
          r={12}
          fill={C.cyan}
          style={{ filter: svgGlow(C.cyan, 8) }}
        />
        <text x={0} y={248} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={32}>
          Single Hydrogen Atom
        </text>
        <text x={0} y={286} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={700} fontSize={21}>
          0.00000001 cm · Invisible
        </text>
      </g>

      {/* Center glowing equals / equivalence symbol */}
      <g transform="translate(800, 355)" opacity={p}>
        <line x1={-40} y1={-16} x2={40} y2={-16} stroke={C.gold} strokeWidth={7} strokeLinecap="round" style={{ filter: svgGlow(C.gold, 8) }} />
        <line x1={-40} y1={16} x2={40} y2={16} stroke={C.gold} strokeWidth={7} strokeLinecap="round" style={{ filter: svgGlow(C.gold, 8) }} />
      </g>

      {/* RIGHT: Centimeter-Sized Artificial Atom Silicon Chip */}
      <g transform="translate(1170, 355)" opacity={p}>
        <rect x={-165} y={-165} width={330} height={330} rx={28} fill="#0c1938" stroke={C.gold} strokeWidth={4} style={{ filter: svgGlow(C.gold, 10) }} />
        {/* Same 3 discrete quantized energy rungs glowing inside the chip! */}
        {[
          { y: 78, col: C.cyan, n: "|0⟩" },
          { y: 0, col: C.gold, n: "|1⟩" },
          { y: -74, col: C.green, n: "|2⟩" },
        ].map((r, i) => (
          <g key={r.n}>
            <line x1={-105} y1={r.y} x2={105} y2={r.y} stroke={r.col} strokeWidth={6} strokeLinecap="round" style={{ filter: svgGlow(r.col, 6) }} />
            <text x={-122} y={r.y + 8} textAnchor="end" fill={r.col} fontFamily={MONO} fontWeight={900} fontSize={20}>
              {r.n}
            </text>
            {i === Math.floor(t * 1.4) % 3 && (
              <circle cx={0} cy={r.y} r={13} fill={C.white} style={{ filter: svgGlow(r.col, 10) }} />
            )}
          </g>
        ))}

        <text x={0} y={248} textAnchor="middle" fill={C.gold} fontFamily={INTER} fontWeight={900} fontSize={32}>
          Macroscopic Artificial Atom
        </text>
        <text x={0} y={286} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={700} fontSize={21}>
          ~1 cm Silicon Chip · Hold in Your Hand
        </text>
      </g>
    </svg>
  );
};
